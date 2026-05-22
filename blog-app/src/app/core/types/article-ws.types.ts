export type ConnectWsStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface WebSocketOutgoingMessage {
  eventName: string,
  data?: unknown
}

export interface WebSocketIncomingMessage {
  type: string,
  payload: any
}