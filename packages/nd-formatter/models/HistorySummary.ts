import { History } from "nd-novel";

import { IDefaultConfigFormat, IFormatter } from "./IFormatter";

export class HistorySummary implements IFormatter<IDefaultConfigFormat, History> {
  private _obj?: History;

  public build() {
    let str = "";
    if (this._obj) {
      this._obj.events.forEach(n => (str += `${n.toString({ color: true })}\n`));
    }
    return str;
  }

  public config(_: IDefaultConfigFormat) {
    return this;
  }

  public save(v: History) {
    this._obj = v;
    return this;
  }
}
