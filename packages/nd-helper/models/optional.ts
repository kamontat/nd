type NullChecker<T> = (v: T | undefined | null) => boolean;

export class Optional<T, R = T> {
  private _isTransform: boolean;
  private result: R | undefined;

  private constructor(private _optional: T | undefined | null, private isNull?: NullChecker<T>) {
    this._isTransform = false;
  }

  public null() {
    if (this.isNull) return this.isNull(this._optional);
    else return this._optional === undefined || this._optional === null;
  }

  public static of<T, R = T>(t: T | undefined | null, isNull?: NullChecker<T>) {
    // LoggerService.log(LOGGER_MODEL, `insert object %O`, t);
    return new Optional<T, R>(t, isNull);
  }

  public static isNull<T>(t: T | undefined | null) {
    return new Optional(t).null();
  }

  public or(r: R): R {
    if (this.null()) return r;
    else return (this._isTransform ? this.result : ((this._optional as unknown) as R))!; // ! is to ensure that return never be null | undefined
  }

  public transform(fn: (t: T) => R): this {
    // LoggerService.log(LOGGER_MODEL, `called transform method: %O`, this);
    if (!this.null()) {
      this.result = fn(this._optional!);
      this._isTransform = true;
    }

    return this;
  }
}
