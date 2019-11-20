import { load } from "cheerio";

import { IParser } from "./IParser";

export class HtmlParser
  implements IParser<string, string | CheerioElement, Cheerio> {
  private _object: CheerioStatic;
  constructor(private _value: string) {
    this._object = load(_value, {
      normalizeWhitespace: true,
      xmlMode: false,
      decodeEntities: false
    });
  }

  public get value() {
    return this._value;
  }

  public query(key: string) {
    return this._object(key);
  }
}
