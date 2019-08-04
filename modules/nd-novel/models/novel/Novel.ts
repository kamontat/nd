import { buildViewURL } from "../../apis";
import { History } from "../history/History";
import { HistoryEvent } from "../history/HistoryEvent";

import { Chapter } from "./Chapter";
import { NovelType } from "./NovelType";

export class Novel {
  public get abstract() {
    return this._abstract;
  }

  public set abstract(abs: string | undefined) {
    this.eventHandler("abstract", { before: this._abstract, after: abs });
    this._abstract = abs;
  }

  public get author() {
    return this._author;
  }

  public set author(a: string | undefined) {
    this.eventHandler("author", { before: this._author, after: a });
    this._author = a;
  }

  public get chapters() {
    return this._chapters.values();
  }

  public set content(c: string[]) {
    this.eventHandler("content", { before: this._content, after: c });
    this._content = c;
  }

  public get content() {
    return this._content;
  }

  public get downloadAt() {
    return this._downloadAt;
  }

  public set downloadAt(dlAt: number | undefined) {
    this.eventHandler("download at", { before: this._downloadAt, after: dlAt });
    this._downloadAt = dlAt;
  }
  public get id() {
    return this._id;
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
  }

  public get normalizeName() {
    if (!this._name) return `unknown-name-${this.id}`;
    return this._name.replace(/([ \n\t\r\n])/g, "-").replace(/([\(\)\[\]\&\%\$\#\@\^\*\\\/])/g, "_");
  }

  public get size() {
    return this._chapters.size;
  }

  public get tags() {
    return this._tags;
  }

  public get type() {
    return this._type;
  }

  public set type(t: NovelType) {
    this.eventHandler("type", { before: this._type, after: t });
    this._type = t;
  }

  public get updateAt() {
    return this._updateAt;
  }

  public set updateAt(udAt: number | undefined) {
    this.eventHandler("update at", { before: this._updateAt, after: udAt });
    this._updateAt = udAt;
  }
  private _abstract?: string;
  private _author?: string;
  private _chapters: Map<number, Chapter>;
  private _content: string[];
  private _downloadAt?: number;
  private _event: HistoryEvent;

  private _link: URL;
  private _name?: string;
  private _tags: string[];

  private _type: NovelType;
  private _updateAt?: number;

  constructor(private _id: number, event?: HistoryEvent) {
    this._type = NovelType.UNKNOWN;

    this._link = buildViewURL(_id);
    this._event = event ? event : new HistoryEvent();
    this._chapters = new Map();
    this._content = [];
    this._tags = [];

    History.Get().addEvent(this._event);

    this.eventHandler("id", { before: undefined, after: _id });
  }

  public addChapter(num: number, chapter: Chapter) {
    this.eventHandler("chapter", { before: this.chapter(num), after: chapter });
    this._chapters.set(num, chapter);
  }

  public addTag(t: string) {
    this.eventHandler("tag", { before: this._tags, after: t });
    this._tags.push(t);
  }

  public chapter(num: number) {
    return this._chapters.get(num);
  }

  public toJSON(_opts?: { content?: boolean }) {
    const opts = Object.assign(_opts, { content: true });

    const json = {
      id: this.id,
      name: this.name,
      link: this.link,
      author: this.author,
      tags: this.tags,
      type: this.type,
      abstract: this.abstract,
      chapters: Array.from(this.chapters).map(c => c.toJSON(_opts)),
      updateAt: this.updateAt,
      downloadAt: this.downloadAt,
    } as { [key: string]: any };

    if (opts.content) json.content = this.content;
    return json;
  }

  private eventHandler(name: string, value: { after: any; before: any }) {
    const verify = (v: any) => {
      if (v === undefined || v === null || v === "") return false;
      if (typeof v === "object" && typeof v.length === "number") return v.length > 0;
      return true;
    };

    if (!verify(value.before) && verify(value.after)) this._event.emit("added", `Novel ${name}`, value.after);
    else if (verify(value.before) && !verify(value.after)) this._event.emit("deleted", `Novel ${name}`, value.before);
    else if (verify(value.before) && verify(value.after)) this._event.emit("modified", `Novel ${name}`, value);
  }
}
