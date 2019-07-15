import { buildViewURL } from "../../apis";
import { History } from "../history/History";
import { HistoryEvent } from "../history/HistoryEvent";

import { Chapter } from "./Chapter";

export class Novel {
  public get chapters() {
    return this._chapters.values();
  }

  public get link() {
    return buildViewURL(this.id);
  }

  public downloadAt?: number;
  public name?: string;
  public updateAt?: number;

  private _chapters: Map<number, Chapter>;
  private _event: HistoryEvent;

  constructor(private id: number, event?: HistoryEvent) {
    this._event = event ? event : new HistoryEvent();
    this._chapters = new Map();

    History.Get().addEvent(this._event);

    // this._event.addListener("added")
    this._event.emit("added", "novel id", id);
  }

  public chapter(num: number) {
    return this._chapters.get(num);
  }
}
