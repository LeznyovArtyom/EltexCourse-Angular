import { DestroyRef, inject, Injectable, Signal, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Observable, Subject, tap } from "rxjs";
import { WebSocketSubject, WebSocketSubjectConfig } from "rxjs/webSocket";
import { WsEvents } from "../../core/enums/article-ws-event.enum";
import { ConnectWsStatus, WebSocketIncomingMessage, WebSocketOutgoingMessage } from "../../core/types/article-ws.types";

@Injectable()
export class ArticleCardWsService {
  private destroyRef = inject(DestroyRef);

  private webSocket$: WebSocketSubject<any> | null = null;
  private connectionStatus = signal<ConnectWsStatus>('disconnected');

  private readonly wsUrl = "ws://localhost:3000";

  private commentCreated$ = new Subject<any>();
  private commentRatingChanged$ = new Subject<any>();
  private articleRatingChanged$ = new Subject<any>();

  constructor() {
    this.initWebSocket();
  }

  private initWebSocket() {
    const config: WebSocketSubjectConfig<any> = {
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
    
    this.webSocket$ = new WebSocketSubject<any>(config);

    this.webSocket$.pipe(
      tap((message) => this.handleMessage(message)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      error: (error) => {
        console.error('WebSocket ошибка:', error);
        this.connectionStatus.set('error');
      }
    })
  }

  private handleMessage(message: WebSocketIncomingMessage): void {
    console.log('[WS] Получено сообщение от сервера:', message);

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
        console.warn(`[WS] Неизвестный тип события: ${message.type}`, message);
    }
  }

  public getCommentCreated(): Observable<any> {
    return this.commentCreated$.asObservable();
  }

  public getCommentRatingChanged(): Observable<any> {
    return this.commentRatingChanged$.asObservable();
  }

  public getArticleRatingChanged(): Observable<any> {
    return this.articleRatingChanged$.asObservable();
  }

  public subscribeAll(): void {
    const message: WebSocketOutgoingMessage = { eventName: "subscribe-all" };
    this.webSocket$?.next(message);
  }

  public subscribeToArticle(articleId: string): void {
    const message: WebSocketOutgoingMessage = { eventName: "subscribe-article", data: articleId };
    this.webSocket$?.next(message);
  }

  public unsubscribeFromArticle(articleId: string): void {
    const message: WebSocketOutgoingMessage = { eventName: "unsubscribe-article", data: articleId };
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