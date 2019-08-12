import { ArrayUtils, TimeUtils } from "nd-helper";
import { Colorize } from "nd-logger";
import { ChapterStatus, History, Novel } from "nd-novel";

import { IDefaultConfigFormat, IFormatter } from "./IFormatter";

interface INovelConfigFormat extends IDefaultConfigFormat {
  chapters: boolean;
  history: boolean;
  path: string;
  short: boolean;
}

export class NovelSummary implements IFormatter<INovelConfigFormat, Novel> {
  private __summary: string;

  private _config?: INovelConfigFormat;
  private _obj?: Novel;

  constructor() {
    this.__summary = "";
  }

  public build() {
    if (!this._obj) return "";

    if (this._config) {
      if (this._config.short) this.__build();
      else this.__build();

      if (this._config.chapters) this.__buildChapter();
      if (this._config.history) this.__buildHistory();
    } else {
      this.__build(); // default
    }

    const summary = this.getSummary();
    return summary;
  }

  public config(conf: INovelConfigFormat) {
    this._config = conf;
    return this;
  }

  public save(v: Novel) {
    this._obj = v;
    return this;
  }

  private __build() {
    const completed: Array<number> = [];
    const unknown: Array<number> = [];
    const closed: Array<number> = [];
    const sold: Array<number> = [];

    if (this._obj) {
      Array.from(this._obj.chapters).forEach(c => {
        if (c.status === ChapterStatus.CLOSED) closed.push(c.cid);
        else if (c.status === ChapterStatus.COMPLETED) completed.push(c.cid);
        else if (c.status === ChapterStatus.SOLD) sold.push(c.cid);
        else if (c.status === ChapterStatus.UNKNOWN) unknown.push(c.cid);
      });

      this._appendSummary(`
id          =  ${Colorize.id(this._obj.id.toString())} | ${Colorize.url(this._obj.link.href)}
name        =  ${Colorize.important(this._obj.name || "unknown")}
chapters    =  ${ArrayUtils.ReadableArray(completed)}
closed      =  ${ArrayUtils.ReadableArray(closed)}
sold        =  ${ArrayUtils.ReadableArray(sold)}
unknown     =  ${ArrayUtils.ReadableArray(unknown)}
update at   =  ${Colorize.date(TimeUtils.FormatDate(TimeUtils.GetDate(this._obj.updateAt)))}
download at =  ${Colorize.date(TimeUtils.FormatDate(TimeUtils.GetDate(this._obj.downloadAt)))}
${this._config && `path        =  ${Colorize.path(this._config.path)}`}`);
    }
  }

  private __buildChapter() {
    if (this._obj) {
      this._appendSummary(this._section("Chapters"));
      Array.from(this._obj.chapters).forEach(c => this._appendSummary(c.toString({ color: true, long: true })));
    }
  }

  private __buildHistory() {
    if (this._obj) {
      this._appendSummary(this._section("Histories"));
      const events = History.Get().events;
      events.forEach(n => this._appendSummary(n.toString({ color: true })));
    }
  }

  private _appendSummary(a: any, newline: boolean = true) {
    this.__summary += a;
    if (newline) this.__summary += "\n";
  }

  private _section(title: string) {
    const lineSize = 35;

    const left = lineSize - title.length;

    let line = "";
    for (let i = 0; i < lineSize; i++) line += "-";
    let padding = "";

    if (left > 0) {
      for (let i = 0; i < left; i++) padding += " ";
    }
    return `
# ${Colorize.dim(line)} #
# ${Colorize.key(title)}${padding} #
# ${Colorize.dim(line)} #
`;
  }

  private getSummary() {
    return this.__summary;
  }
}
