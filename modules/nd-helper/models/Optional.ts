export class Optional<T, R = T> {
  private _isTransform: boolean;
  private result: R | undefined;
  private constructor(private _optional: T | undefined | null) {
    this._isTransform = false;
  }

  public static of<T, R = T>(t: T | undefined | null) {
    return new Optional<T, R>(t);
  }

  public or(r: R): R {
    if (this._isTransform) return this.result || r;
    else return ((this._optional as unknown) as R) || r;
  }

  public transform(fn: (t: T) => R): this {
    if (this._optional) {
      this.result = fn(this._optional);
    } else this._isTransform = true;
    return this;
  }
}
