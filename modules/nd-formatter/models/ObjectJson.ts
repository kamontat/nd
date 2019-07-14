import { Colorize } from "nd-logger";

import { IDefaultConfigFormat, IFormatter, IJson } from "./IFormatter";

interface IJsonConfig extends IDefaultConfigFormat {}

export class ObjectJson implements IFormatter<IJsonConfig, IJson> {
  private _obj?: IJson;

  public save(v: IJson) {
    this._obj = v;
    return this;
  }

  public config(_: IJsonConfig) {
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
