import LoggerService, { LOGGER_MODEL } from "nd-logger";

export class Optional<T, R = T> {
  private _isTransform: boolean;
  private result: R | undefined;
  private constructor(private _optional: T | undefined | null) {
    this._isTransform = false;
  }

  public static of<T, R = T>(t: T | undefined | null) {
    LoggerService.log(LOGGER_MODEL, `insert object %O`, t);
    return new Optional<T, R>(t);
  }

  public or(r: R): R {
    LoggerService.log(LOGGER_MODEL, `called or method: %O`, this);
    if (this._isTransform) return this.result || r;
    else return ((this._optional as unknown) as R) || r;
  }

  public transform(fn: (t: T) => R): this {
    LoggerService.log(LOGGER_MODEL, `called transform method: %O`, this);
    if (this._optional) {
      this._isTransform = true;
      this.result = fn(this._optional);
    }
    return this;
  }
}
