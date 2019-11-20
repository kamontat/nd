import { TimeUtils, StringUtils } from "@nd/helper";
import { Colorize } from "@nd/logger";

import { buildViewlongURL } from "../../apis/url";
import { History } from "../history/History";
import { HistoryEvent } from "../history/HistoryEvent";

import { ChapterStatus } from "./ChapterStatus";
import { HtmlEntity } from "@nd/content";

export class Chapter {
  public get cid() {
    return this._cid;
  }
  public set cid(c: number) {
    this.eventHandler("number", { before: this._cid, after: c });
    this._cid = c;
  }
  public get content() {
    return this._content;
  }
  public set content(c: HtmlEntity[]) {
    this.eventHandler("content", { before: this._content, after: c });
    this._content = c;
  }
  public get downloadAt() {
    return this._downloadAt;
  }
  public set downloadAt(d: number | undefined) {
    this.eventHandler("download at", { before: this._downloadAt, after: d });
    this._downloadAt = d;
  }
  public get link() {
    return this._link;
  }
  public get name() {
    return this._name;
  }

  public set name(n: string | undefined) {
    this.eventHandler("name", { before: this._name, after: n });
    this._name = n;
    if (this._name) this._name = this._name.trim();
  }

  public get nid() {
    return this._nid;
  }

  public set nid(n: number) {
    this.eventHandler("novel id", { before: this._nid, after: n });
    this._nid = n;
  }
  public get status() {
    return this._status;
  }
  public set status(s: ChapterStatus) {
    this.eventHandler("status", { before: this._status, after: s });
    this._status = s;
  }
  public get updateAt() {
    return this._updateAt;
  }
  public set updateAt(u: number | undefined) {
    this.eventHandler("update at", { before: this._updateAt, after: u });
    this._updateAt = u;
  }

  private _content: HtmlEntity[];
  private _downloadAt?: number;

  private _event: HistoryEvent;
  private _link: URL;

  private _name?: string;
  private _updateAt?: number;

  constructor(
    private _nid: number,
    private _cid: number,
    private _status: ChapterStatus = ChapterStatus.UNKNOWN,
    event?: HistoryEvent
  ) {
    this._link = buildViewlongURL(this._nid, this._cid);
    this._content = [];

    this._event = event ? event : new HistoryEvent();

    History.Get().addEvent(this._event);

    this.eventHandler("novel id", { before: undefined, after: _nid });
    this.eventHandler("number", { before: undefined, after: _cid });
  }

  public equals(c: Chapter) {
    return (
      this.cid === c.cid &&
      this.nid === c.nid &&
      this.status === c.status &&
      this.name === c.name
    );
  }

  public toJSON(_opts?: { content?: boolean }) {
    const opts = Object.assign({ content: true }, _opts);

    const json = {
      nid: this.nid,
      cid: this.cid,
      name: this.name,
      link: this.link,
      status: this.status,
      content: this.content,
      downloadAt: this.downloadAt,
      updateAt: this.updateAt
    } as { [key: string]: any }; // eslint-disable-line @typescript-eslint/no-explicit-any

    if (opts.content) json.content = this.content;
    return json;
  }

  public toString(_opts: { color?: boolean; long?: boolean } = {}) {
    const opts = Object.assign({ color: false, long: false }, _opts);

    const colorless = (...text: string[]) => {
      return text;
    };

    const color = {
      nid: opts.color ? Colorize.id : colorless,
      chapter: opts.color ? Colorize.number : colorless,
      name: opts.color ? Colorize.name : colorless,
      enum: opts.color ? Colorize.enum : colorless,
      link: opts.color ? Colorize.url : colorless,
      date: opts.color ? Colorize.date : colorless,
      datetime: opts.color ? Colorize.datetime : colorless
    };

    if (this.name) {
      if (opts.long) {
        const chap = StringUtils.Padding(this.cid.toString(), 3);
        const updated = TimeUtils.FormatDate(TimeUtils.GetDate(this.updateAt), {
          format: "short",
          lang: "th"
        });
        const downloaded = TimeUtils.FormatDate(
          TimeUtils.GetDate(this.downloadAt),
          {
            format: "short",
            lang: "th"
          }
        );

        return `${color.chapter(chap)}: ${color.enum(
          this.status.toUpperCase()
        )}: ${color.name(this.name)}
  - Updated at    ${color.date(updated)}
  - Downloaded at ${color.datetime(downloaded)}`;
      } else {
        return `${color.chapter(this.cid.toString())} ${color.name(this.name)}`;
      }
    } else {
      return `${color.chapter(this.cid.toString())} ${color.enum(
        this.status
      )} ${color.link(this.link.toString())}`;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private eventHandler(name: string, value: { after: any; before: any }) {
    return this._event.classify(`Chapter ${name}`, value);
  }
}
