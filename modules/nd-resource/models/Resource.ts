export class Resource {
  constructor(private json: string, private _filename: string) {}

  public filename() {
    return this._filename;
  }

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
