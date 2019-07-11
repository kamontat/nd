export interface IExceptionState {
  readonly code: string;
  readonly name: string;

  buildMessage(override?: string): string;
}
