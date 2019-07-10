import { IExceptionState } from "./IExceptionState";

export class ExceptionState implements IExceptionState {
  private _code: string;
  private _name: string;
  private _exit: boolean;

  constructor(code: string, name: string, exit: boolean) {
    this._code = code;
    this._name = name;
    this._exit = exit;
  }

  get code() {
    return this._code;
  }

  get name() {
    return this._name;
  }

  get exit() {
    return this._exit;
  }

  public buildMessage(override?: string) {
    if (override) return override;
    return `${this.name}`;
  }
}
