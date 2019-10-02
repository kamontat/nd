import { Colorize } from "@nd/logger";

import { EventType } from "./HistoryEvent";

interface IModifyValue {
  after: string;
  before: string;
}

interface IHistoryNode<T = string> {
  set(type: "added" | "deleted", value: T): this;
  set(type: "modified", value: IModifyValue): this;
}

export class HistoryNode implements IHistoryNode {
  private _createAt: number;
  private _type?: EventType;
  private _updateAt: number;
  private _value?: string | IModifyValue;

  constructor(private title: string) {
    this._createAt = +new Date();
    this._updateAt = +new Date();
  }

  public set(type: EventType, value: string | IModifyValue) {
    this._type = type;
    this._value = value;
    this._updateAt = +new Date();

    return this;
  }

  public toJSON() {
    return {
      type: this._type,
      title: this.title,
      value: this._value,
      createAt: this._createAt,
      updateAt: this._updateAt,
    };
  }

  public toString(_opts: { color?: boolean } = {}) {
    const opts = Object.assign({ color: false }, _opts);

    if (!this._type || !this._value) return "Error: never set type and value in history";

    if (opts.color) {
      switch (this._type) {
        case "added":
          return `adding ${Colorize.value(this.limit(this._value.toString()))} to ${Colorize.key(this.title)}`;
        case "deleted":
          return `removing ${Colorize.value(this.limit(this._value.toString()))} from ${Colorize.key(this.title)}`;
        case "modified":
          return `changing ${Colorize.value(this.limit((this._value as IModifyValue).before))} to ${Colorize.value(
            this.limit((this._value as IModifyValue).after),
          )} in ${Colorize.key(this.title)}`;
      }
    } else {
      switch (this._type) {
        case "added":
          return `adding ${this._value.toString()} to ${this.title}`;
        case "deleted":
          return `removing ${this._value.toString()} from ${this.title}`;
        case "modified":
          return `changing ${(this._value as IModifyValue).before} to ${(this._value as IModifyValue).after} in ${
            this.title
          }`;
      }
    }

    return "Error: unknown event type";
  }

  private limit(str: string, size: number = 30) {
    if (str.length > size) return `${str.substr(0, size)}...`;
    else return str;
  }
}
