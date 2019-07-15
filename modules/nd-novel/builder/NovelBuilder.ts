import { DownloadManager } from "nd-downloader";
import { IManagerEvent, ManagerEvent } from "nd-downloader/models/ManagerEvent";
import ExceptionService, { ERR_NLV } from "nd-error";
import LoggerService, { LOGGER_NOVEL_DOWNLOADER } from "nd-logger";

import { NovelAPIs } from "../apis";
import { Novel } from "../models/novel/Novel";
import { HtmlParser } from "../models/parser/HtmlParser";

export class NovelBuilder {
  private _novel: Novel;
  private downloadEvent: IManagerEvent<string>;

  constructor(id: number, private directory: string) {
    this._novel = new Novel(id);
    this.downloadEvent = new ManagerEvent();

    this.setupDownloadEvent();
  }

  public build(thread?: number) {
    const manager = new DownloadManager<Novel>(thread, this.downloadEvent);
    manager.add(this._novel.link.href, this.directory);
    manager.build(r => {
      const html = new HtmlParser(r.result || "");

      const res = r.copy<Novel>();
      res.result = this._novel;

      res.result.name = NovelAPIs.getNovelName(html);
      res.result.updateAt = NovelAPIs.getNovelDate(html).getTime();

      return res;
    });

    return manager
      .run()
      .then(_r => {
        const r = _r.pop();
        return new Promise<Novel>((res, rej) => {
          if (!r) rej(ExceptionService.build(ERR_NLV, "cannot build novel with input html"));
          else res(r.result || this._novel);
        });
      })
      .then(novel => {
        LoggerService.log(LOGGER_NOVEL_DOWNLOADER, "Final novel is %O", novel);
      });
  }

  private setupDownloadEvent() {
    this.downloadEvent.on("add", r => {
      LoggerService.log(LOGGER_NOVEL_DOWNLOADER, `add novel link ${r.link}`);
    });
  }
}
