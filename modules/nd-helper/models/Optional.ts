export class Optional<T, R> {
  private result: R | undefined;
  constructor(private _optional: T | undefined | null) {}

  public or(r: R) {
    return this.result || r;
  }

  public transform(fn: (t: T) => R) {
    if (this._optional) this.result = fn(this._optional);
  }
}
