import { mapLimit } from "async";

import { THREAD_NUMBER } from "../constants";

import { IThreadable } from "./IThreadable";

export default abstract class ThreadManager<V, T, R = T> implements IThreadable<T, R> {
  protected _list: Array<T>;
  protected _results: Array<R>;

  protected _thread: number;
  protected _variable?: V;

  private isVariableSet: boolean;

  constructor(thread: number = THREAD_NUMBER) {
    if (thread) this._thread = thread;
    else this._thread = THREAD_NUMBER;

    this._list = new Array();
    this._results = new Array();

    this._variable = undefined;
    this.isVariableSet = false;
  }

  public add(t: T) {
    this._list.push(t);
    return this;
  }

  public run() {
    return (mapLimit(this._list, this._thread, (i: T, callback) => {
      this.transform(i, this._variable)
        .then(r => callback(undefined, r))
        .catch(err => callback(err));
    }) as unknown) as Promise<R[]>;
  }

  protected initVariable(variable: V) {
    if (this.isVariableSet) return;
    this._variable = variable;
  }

  protected abstract transform(item: T, variable?: V): Promise<R>;
}
