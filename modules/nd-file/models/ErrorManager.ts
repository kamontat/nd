export type ErrorType = "folder-not-empty" | "file-exist" | "folder-not-found";
export type ErrorCallback = (path: string) => void;

const EmptyCallback = () => {};

export class ErrorManager {
  private _errors: Map<ErrorType, ErrorCallback>;

  constructor() {
    this._errors = new Map();
  }

  public execute(t: ErrorType, p: string) {
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
