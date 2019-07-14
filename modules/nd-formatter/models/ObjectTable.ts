import { Colorize } from "nd-logger";
import { getBorderCharacters, table } from "table";

import { IDefaultConfigFormat, IFormatter } from "./IFormatter";

interface IObject<V = string> {
  [key: string]: V;
}

interface ITableConfig extends IDefaultConfigFormat {}

export class ObjectTable implements IFormatter<ITableConfig, Array<Array<string>> | IObject> {
  private _array?: Array<Array<string>>;
  private _options: IObject<any>;

  private buildArray(obj: IObject) {
    return Object.keys(obj).map(key => {
      return [this.buildKey(key), obj[key]];
    });
  }

  private capital(str: string, index: number = 0) {
    return str.slice(index, index + 1).toUpperCase() + str.slice(index + 1);
  }

  private buildKey(key: string) {
    if (!key.includes(".")) return this.capital(key);
    const _arr = key.split(".");

    let res = "";
    _arr.forEach((v, i) => {
      res += i === 0 ? this.capital(v) : ` ${v}`;
    });

    return `${res}\n(${key})`;
  }

  constructor() {
    this._options = {
      border: getBorderCharacters(`ramac`),
      columns: {
        0: {
          width: 20,
        },
        1: {
          width: 30,
        },
      },
    };
  }

  public save(v: Array<Array<string>> | IObject) {
    if (!(v instanceof Array)) this._array = this.buildArray(v);
    else this._array = v;
    this._array.unshift([Colorize.format`{bold.green Configuration key}`, Colorize.format`{bold.green value}`]);
    return this;
  }

  public config(_: ITableConfig) {
    return this;
  }

  public build() {
    if (!this._array) return "";
    return table(this._array, this._options);
  }
}
