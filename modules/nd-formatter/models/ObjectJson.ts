import { IFormatter, Json } from "./IFormatter";

export class ObjectJson implements IFormatter<Json> {
  private _obj?: Json;

  public save(v: Json) {
    this._obj = v;
    return this;
  }

  public build() {
    if (!this._obj) return "";
    return JSON.stringify(this._obj, undefined, "  ");
  }
}
