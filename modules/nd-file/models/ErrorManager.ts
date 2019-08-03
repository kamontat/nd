export type ErrorType = "folder-not-empty" | "file-exist" | "folder-not-found";

export interface IErrorCallbackParam {
  path: string;
  again?(): void;
}
export type ErrorCallback = (opt: IErrorCallbackParam) => void;

const EmptyCallback = () => {};

export class ErrorManager {
  private _errors: Map<ErrorType, ErrorCallback>;

  constructor() {
    this._errors = new Map();
  }

  public execute(t: ErrorType, p: IErrorCallbackParam) {
    if (this._errors.has(t)) {
      const callback = this._errors.get(t) || EmptyCallback;
      return callback(p);
    }

    return undefined;
  }

  public set(t: ErrorType, c: ErrorCallback) {
    this._errors.set(t, c);
  }
}
