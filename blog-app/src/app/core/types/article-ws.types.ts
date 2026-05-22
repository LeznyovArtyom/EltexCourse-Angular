import { WsEvents } from "../enums/article-ws-event.enum";

export type ConnectWsStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface WebSocketOutgoingMessage {
  event: string,
  data?: string
}

export interface WsCommentCreatedPayload {
  commentId: string,
  articleId: string,
  content: string,
  username: string,
  createdAt: string
}

export interface WsCommentRatingChangedPayload {
  commentId: string,
  articleId: string,
  rating: number,
  prevRating: number
}

export interface WsArticleRatingChangedPayload {
  articleId: string,
  rating: number,
  prevRating: number
}

export type WebSocketIncomingMessage = 
  | { type: WsEvents.commentCreated; payload: WsCommentCreatedPayload }
  | { type: WsEvents.commentRatingChanged; payload: WsCommentRatingChangedPayload }
  | { type: WsEvents.articleRatingChanged; payload: WsArticleRatingChangedPayload }
  | { event: WsEvents.subscribed; topic: string; clientId: string }
  | { event: WsEvents.unsubscribed; topic: string; clientId: string };