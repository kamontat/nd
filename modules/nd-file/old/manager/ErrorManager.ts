import LoggerService, { LOGGER_FILE } from "nd-logger";

export type ErrorType = "folder-not-empty" | "folder-empty" | "file-exist" | "file-not-exist" | "folder-not-found";

export interface IErrorCallbackParam {
  path: string;
  again?(): void;
}
export type ErrorCallback = (opt: IErrorCallbackParam) => void;

const EmptyCallback = () => {};

export class ErrorManager {
  private _errors: Map<ErrorType, ErrorCallback>;

  constructor() {
    LoggerService.warn(
      LOGGER_FILE,
      "ErrorManager is depend on deprecated version of nd-file; will be remove when public version is released",
    );

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
