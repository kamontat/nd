export class Resource {
  constructor(private json: string) {}

  public load() {
    return this._decode();
  }

  public save() {
    return this._encode();
  }

  private _decode() {
    return this.json;
  }

  private _encode() {
    return this.json;
  }
}
