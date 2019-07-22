import { ArrayUtils, TimeUtils } from "nd-helper";
import { Colorize } from "nd-logger";
import { ChapterStatus, Novel } from "nd-novel";

import { IDefaultConfigFormat, IFormatter } from "./IFormatter";

interface NovelConfigFormat extends IDefaultConfigFormat {
  chapter: boolean;
  path: string;
  short: boolean;
}

export class NovelSummary implements IFormatter<NovelConfigFormat, Novel> {
  private __summary: string;

  private _config?: NovelConfigFormat;
  private _obj?: Novel;

  constructor() {
    this.__summary = "";
  }

  public build() {
    if (!this._obj) return "";

    if (this._config) {
      if (this._config.short) this.__buildShort();
      else this.__buildLong();

      if (this._config.chapter) this.__buildChapter();
    } else {
      this.__buildShort(); // default
    }

    const summary = this.getSummary();
    return summary;
  }

  public config(conf: NovelConfigFormat) {
    this._config = conf;
    return this;
  }

  public save(v: Novel) {
    this._obj = v;
    return this;
  }

  private __buildChapter() {}

  private __buildLong() {}

  private __buildShort() {
    if (this._obj) {
      this._appendSummary(`
id          =  ${Colorize.id(this._obj.id.toString())} | ${Colorize.url(this._obj.link.href)}
name        =  ${Colorize.important(this._obj.name || "unknown")}
chapters    =  ${ArrayUtils.ReadableArray(
        Array.from(this._obj.chapters)
          .filter(c => c.status === ChapterStatus.COMPLETED)
          .map(c => c.cid),
      )}
update at   =  ${Colorize.date(TimeUtils.FormatDate(TimeUtils.GetDate(this._obj.updateAt)))}
download at =  ${Colorize.date(TimeUtils.FormatDate(TimeUtils.GetDate(this._obj.downloadAt)))}
${this._config && `path        =  ${Colorize.path(this._config.path)}`}
`);
    }
  }

  private _appendSummary(a: any) {
    this.__summary += a;
  }

  private getSummary() {
    return this.__summary;
  }
}
