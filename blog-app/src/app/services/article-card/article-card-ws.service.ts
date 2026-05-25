import { DestroyRef, inject, Injectable, Signal, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Observable, Subject, tap } from "rxjs";
import { WebSocketSubject, WebSocketSubjectConfig } from "rxjs/webSocket";
import { WsEvents } from "../../core/enums/article-ws-event.enum";
import { 
  ConnectWsStatus, 
  WebSocketIncomingMessage, 
  WebSocketOutgoingMessage, 
  WsArticleRatingChangedPayload, 
  WsCommentCreatedPayload, 
  WsCommentRatingChangedPayload 
} from "../../core/types/article-ws.types";

@Injectable()
export class ArticleCardWsService {
  private destroyRef = inject(DestroyRef);

  private webSocket$: WebSocketSubject<WebSocketIncomingMessage | WebSocketOutgoingMessage> | null = null;
  private connectionStatus = signal<ConnectWsStatus>('disconnected');

  private readonly wsUrl = "ws://localhost:3000";

  private commentCreated$ = new Subject<WsCommentCreatedPayload>();
  private commentRatingChanged$ = new Subject<WsCommentRatingChangedPayload>();
  private articleRatingChanged$ = new Subject<WsArticleRatingChangedPayload>();

  constructor() {
    this.initWebSocket();
  }

  private initWebSocket() {
    const config: WebSocketSubjectConfig<WebSocketIncomingMessage | WebSocketOutgoingMessage> = {
      url: this.wsUrl,
      openObserver: {
        next: () => {
          console.log('WebSocket соединение установлено');
          this.connectionStatus.set('connected');
        }
      },
      closeObserver: {
        next: () => {
          console.log('WebSocket соединение закрыто')
          this.connectionStatus.set('disconnected');
          this.attemptReconnect();
        }
      }
    };
    
    this.webSocket$ = new WebSocketSubject(config);

    this.webSocket$.pipe(
      tap((message) => this.handleMessage(message as WebSocketIncomingMessage)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      error: (error) => {
        console.error('WebSocket ошибка:', error);
        this.connectionStatus.set('error');
      }
    })
  }

  private handleMessage(message: WebSocketIncomingMessage): void {  
    if ("type" in message) {
      switch (message.type) {
        case WsEvents.commentCreated:
          this.commentCreated$.next(message.payload);
          break;
        case WsEvents.commentRatingChanged:
          this.commentRatingChanged$.next(message.payload);
          break;
        case WsEvents.articleRatingChanged:
          this.articleRatingChanged$.next(message.payload);
          break;
        default:
            console.warn(`[WS] Неизвестный type события:`, message);
      }
    }
    else if ("event" in message) {
      switch (message.event) {
        case WsEvents.subscribed:
          console.log(`Успешно подписались на (topic: ${message.topic})`);
          break;
        case WsEvents.unsubscribed:
          console.log(`Отписались от (topic: ${message.topic})`);
          break;
        default:
          console.warn(`[WS] Неизвестный event:`, message);
      }
    } else {
      console.log('[WS] Получено неизвестное сообщение от сервера:', message);
    }
  }

  public getCommentCreated(): Observable<WsCommentCreatedPayload> {
    return this.commentCreated$.asObservable();
  }

  public getCommentRatingChanged(): Observable<WsCommentRatingChangedPayload> {
    return this.commentRatingChanged$.asObservable();
  }

  public getArticleRatingChanged(): Observable<WsArticleRatingChangedPayload> {
    return this.articleRatingChanged$.asObservable();
  }

  public subscribeAll(): void {
    const message: WebSocketOutgoingMessage = { event: "subscribe-all" };
    this.webSocket$?.next(message);
  }

  public subscribeToArticle(articleId: string): void {
    const message: WebSocketOutgoingMessage = { event: "subscribe-article", data: articleId };
    this.webSocket$?.next(message);
  }

  public unsubscribeFromArticle(articleId: string): void {
    const message: WebSocketOutgoingMessage = { event: "unsubscribe-article", data: articleId };
    this.webSocket$?.next(message);
  }

  public getConnectionStatus(): Signal<ConnectWsStatus> {
    return this.connectionStatus.asReadonly();
  }

  public disconnect(): void {
    this.webSocket$?.complete();
    this.webSocket$ = null;
  }

  private attemptReconnect(): void {
    setTimeout(() => {
      if (this.connectionStatus() === "disconnected") {
        this.initWebSocket();
      }
    }, 3000);
  }
}