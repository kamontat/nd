import { IncomingHttpHeaders } from "http";
import { DownloadManager, IManagerEvent, IResponse, ManagerEvent } from "nd-downloader";
import ExceptionService, { ERR_NLV } from "nd-error";
import { Optional } from "nd-helper";
import LoggerService, { LOGGER_NOVEL_DOWNLOADER } from "nd-logger";

import { NovelAPIs } from "../apis";
import { ChapterStatus } from "../models/novel/ChapterStatus";
import { Novel } from "../models/novel/Novel";
import { NovelType } from "../models/novel/NovelType";
import { HtmlParser } from "../models/parser/HtmlParser";

export class NovelBuilder {
  private _novel: Novel;
  private downloadEvent: IManagerEvent<string>;

  constructor(id: number) {
    this._novel = new Novel(id);
    this.downloadEvent = new ManagerEvent();

    this.setupDownloadEvent();
  }

  public build(thread?: number, fast: boolean = false) {
    if (fast) return this.buildNovel(thread);
    else
      return this.buildNovel(thread).then(novel => {
        return this.buildChapter(novel, thread);
      });
  }

  public partialBuild(chapters: number[], thread?: number) {
    return this.buildNovel(thread).then(novel => {
      // filter not include and set as ignore
      Array.from(novel.chapters)
        .filter(c => !chapters.includes(c.cid))
        .forEach(c => (c.status = ChapterStatus.IGNORED));
      return this.buildChapter(novel, thread);
    });
  }

  private buildChapter(novel: Novel, thread?: number): Promise<Novel> {
    if (novel.type === NovelType.SHORT) return new Promise(res => res(novel));

    const manager = new DownloadManager<Novel>(thread, this.downloadEvent);
    for (const chapter of Array.from(novel.chapters)) {
      if (chapter.status !== ChapterStatus.IGNORED && chapter.status !== ChapterStatus.DOWNLOADED)
        manager.add(chapter.link.href);
    }

    manager.build(r => {
      const url = new URL(r.link);
      const __cid = url.searchParams.get("chapter") || "0";
      const cid = parseInt(__cid);
      const html = new HtmlParser(r.result || "");
      const res = r.copy<Novel>();
      const chapter = novel.chapter(cid);
      if (chapter) {
        const stamp = +new Date();

        chapter.name = NovelAPIs.getChapterName(html);
        chapter.content = NovelAPIs.getChapterContent(html);

        chapter.downloadAt = Optional.of<IncomingHttpHeaders, number>(r.headers)
          .transform(h => +new Date(h.date || ""))
          .or(stamp);
        chapter.updateAt = NovelAPIs.getChapterDate(html).getTime();

        chapter.status = NovelAPIs.getChapterStatus(html);
      }

      res.result = novel;
      return res;
    });

    return manager
      .run()
      .then(rs => {
        const r = rs.pop() as IResponse<Novel> | undefined;
        return new Promise<Novel>((res, rej) => {
          if (!r) rej(ExceptionService.build(ERR_NLV, "cannot build novel with input html"));
          else if (r.error) rej(r.error);
          else res(r.result || this._novel);
        });
      })
      .then(novel => {
        // LoggerService.log(LOGGER_NOVEL_DOWNLOADER, "novel is %O", novel);
        return new Promise(res => res(novel));
      });
  }

  private buildNovel(thread?: number) {
    const manager = new DownloadManager<Novel>(thread, this.downloadEvent);
    manager.add(this._novel.link.href);
    manager.build(r => {
      const html = new HtmlParser(r.result || "");

      const res = r.copy<Novel>();
      if (!NovelAPIs.isNovelExist(html)) {
        res.code = 404;
        res.error = ExceptionService.warn.build(ERR_NLV, `${this._novel.link} is not exist`);
      }

      this._novel.name = NovelAPIs.getNovelName(html);
      this._novel.abstract = NovelAPIs.getNovelAbstract(html);
      this._novel.content = NovelAPIs.getNovelContent(html);

      this._novel.downloadAt = Optional.of<IncomingHttpHeaders, number>(r.headers)
        .transform(h => +new Date(h.date || ""))
        .or(0);
      this._novel.updateAt = NovelAPIs.getNovelDate(html).getTime();

      const chapters = NovelAPIs.getChapterList(html);
      if (chapters.length === 0) this._novel.type = NovelType.SHORT;
      else {
        this._novel.type = NovelType.LONG;
        chapters.forEach(c => this._novel.addChapter(c.cid, c));
      }

      res.result = this._novel;
      return res;
    });

    return manager.run().then(_r => {
      const r = _r.pop() as IResponse<Novel> | undefined;
      return new Promise<Novel>((res, rej) => {
        if (!r) rej(ExceptionService.build(ERR_NLV, "cannot build novel with input html"));
        else if (r.error) rej(r.error);
        else res(r.result || this._novel);
      });
    });
  }

  private setupDownloadEvent() {
    this.downloadEvent.on("add", r => {
      LoggerService.log(LOGGER_NOVEL_DOWNLOADER, `add novel link ${r.link}`);
    });
  }
}
