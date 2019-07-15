import { IParser } from "./IParser";

export class HtmlParser implements IParser<string, string, string> {
  constructor(private _value: string) {}

  public get value() {
    return this._value;
  }

  public query(key: string) {
    return `templates-${key}`;
  }
}
