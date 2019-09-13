import { ArrayUtils, TimeUtils } from "nd-helper";
import { Colorize } from "nd-logger";
import { ChapterStatus, History, Novel } from "nd-novel";

import { HistorySummary } from "./HistorySummary";
import { IDefaultConfigFormat, IFormatter } from "./IFormatter";

interface INovelConfigFormat extends IDefaultConfigFormat {
  caches?: string;
  chapters: boolean;
  history: boolean;
  path?: string;
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

      // newline
      this._appendSummary(``);

      this._appendSummary(
        `id          =  ${Colorize.id(this._obj.id.toString())} | ${Colorize.url(this._obj.link.href)}`,
      );
      this._appendSummary(`name        =  ${Colorize.important(this._obj.name || "unknown")}`);

      const c = ArrayUtils.ReadableArray(completed);
      if (c !== "empty") this._appendSummary(`chapters    =  ${c}`);

      const C = ArrayUtils.ReadableArray(closed);
      if (C !== "empty") this._appendSummary(`closed      =  ${C}`);

      const s = ArrayUtils.ReadableArray(sold);
      if (s !== "empty") this._appendSummary(`sold        =  ${s}`);

      const u = ArrayUtils.ReadableArray(unknown);
      if (u !== "empty") this._appendSummary(`unknown     =  ${u}`);

      this._appendSummary(
        `update at   =  ${Colorize.date(TimeUtils.FormatDate(TimeUtils.GetDate(this._obj.updateAt)))}`,
      );
      this._appendSummary(
        `download at =  ${Colorize.date(TimeUtils.FormatDate(TimeUtils.GetDate(this._obj.downloadAt)))}`,
      );

      if (this._config) {
        if (this._config.path) this._appendSummary(`path        =  ${Colorize.path(this._config.path)}`);
        if (this._config.caches) this._appendSummary(`cache path  =  ${Colorize.path(this._config.caches)}`);
      }
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

      const historyFormatter = new HistorySummary();
      this._appendSummary(historyFormatter.save(History.Get()).build());
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
