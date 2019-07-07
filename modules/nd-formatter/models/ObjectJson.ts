import { Colorize } from "nd-helper";

import { IFormatter, Json } from "./IFormatter";

export class ObjectJson implements IFormatter<Json> {
  private _obj?: Json;

  public save(v: Json) {
    this._obj = v;
    return this;
  }

  public build() {
    if (!this._obj) return "";

    const result = Object.keys(this._obj).reduce((p, key) => {
      const value = (this._obj && this._obj[key]) || "";
      p += "  " + Colorize.format`{greenBright ${key.padEnd(15)}}: {cyanBright ${value}}` + "\n";
      return p;
    }, "{\n");

    return result + "}";
  }
}
