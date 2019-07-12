export enum MessageType {
  WARNING,
  ERROR,
}

export interface IExceptionState {
  readonly code: string;
  readonly name: string;

  buildMessage(type: MessageType, override?: string): string;
}
