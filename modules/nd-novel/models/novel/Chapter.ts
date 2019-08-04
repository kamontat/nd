import { TimeUtils } from "nd-helper";
import { Colorize } from "nd-logger";

import { buildViewlongURL } from "../../apis/url";

import { ChapterStatus } from "./ChapterStatus";

export class Chapter {
  public get cid() {
    return this._cid;
  }
  public set cid(c: number) {
    this._cid = c;
  }
  public get content() {
    return this._content;
  }
  public set content(c: string[]) {
    this._content = c;
  }
  public get downloadAt() {
    return this._downloadAt;
  }
  public set downloadAt(d: number | undefined) {
    this._downloadAt = d;
  }
  public get link() {
    return this._link;
  }
  public get name() {
    return this._name;
  }

  public set name(n: string | undefined) {
    this._name = n;
  }

  public get nid() {
    return this._nid;
  }

  public set nid(n: number) {
    this._nid = n;
  }
  public get status() {
    return this._status;
  }
  public set status(s: ChapterStatus) {
    this._status = s;
  }
  public get updateAt() {
    return this._updateAt;
  }
  public set updateAt(u: number | undefined) {
    this._updateAt = u;
  }
  private _content: string[];
  private _downloadAt?: number;
  private _link: URL;

  private _name?: string;
  private _updateAt?: number;

  constructor(private _nid: number, private _cid: number, private _status: ChapterStatus = ChapterStatus.UNKNOWN) {
    this._link = buildViewlongURL(this._nid, this._cid);
    this._content = [];
  }

  public toJSON(_opts?: { content?: boolean }) {
    const opts = Object.assign(_opts, { content: true });

    const json = {
      nid: this.nid,
      cid: this.cid,
      name: this.name,
      link: this.link,
      status: this.status,
      content: this.content,
      downloadAt: this.downloadAt,
      updateAt: this.updateAt,
    } as { [key: string]: any };

    if (opts.content) json.content = this.content;
    return json;
  }

  public toString(_opts: { color?: boolean; long?: boolean } = {}) {
    const opts = Object.assign({ color: false, long: false }, _opts);

    if (opts.color) {
      if (opts.long) {
        return `${Colorize.name(this.name || "")} ${Colorize.enum(this.status)} ${Colorize.datetime(
          TimeUtils.FormatDate(TimeUtils.GetDate(this.updateAt), {
            format: "short",
            lang: "th",
          }),
        )}`;
      } else {
        return Colorize.name(this.name || "");
      }
    } else {
      if (opts.long) {
        return `${this.name} ${this.status} ${TimeUtils.FormatDate(TimeUtils.GetDate(this.updateAt), {
          format: "short",
          lang: "th",
        })}`;
      } else {
        return this.name;
      }
    }
  }
}
