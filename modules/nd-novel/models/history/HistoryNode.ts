import { EventType } from "./HistoryEvent";

interface IHistoryNode<T = string> {
  set(type: "added", value: T): this;
  set(type: "modified", value: { before: T; after: T }): this;
  set(type: "deleted", value: T): this;
}

export class HistoryNode implements IHistoryNode {
  private _type?: EventType;
  private _value?: string | { before: string; after: string };

  private _createAt: number;
  private _updateAt: number;

  constructor(private title: string) {
    this._createAt = +new Date();
    this._updateAt = +new Date();
  }

  public set(type: EventType, value: string | { before: string; after: string }) {
    this._type = type;
    this._value = value;
    this._updateAt = +new Date();

    return this;
  }

  public toString() {
    if (!this._type || !this._value) return "never set type and value in history";
    return `${this._type} ${this.title} (${this._createAt} ${this._updateAt})`;
  }
}
