import { IExceptionState, MessageType } from "./IExceptionState";

export class ExceptionState implements IExceptionState {
  private _code: string;
  private _name: string;

  constructor(code: string, name: string) {
    this._code = code;
    this._name = name;
  }

  get code() {
    return this._code;
  }

  get name() {
    return this._name;
  }

  public buildMessage(type: MessageType, override?: string) {
    if (override) return override;
    return `${this.name} ${type === MessageType.ERROR ? "error" : "warning"}`;
  }
}
