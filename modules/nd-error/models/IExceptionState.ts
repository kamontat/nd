export interface IExceptionState {
  readonly code: string;
  readonly name: string;
  readonly exit: boolean;

  buildMessage(override?: string): string;
}
