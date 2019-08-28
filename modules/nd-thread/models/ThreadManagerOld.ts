import { mapLimit } from "async";
import LoggerService, { LOGGER_THREAD } from "nd-logger";

import { THREAD_NUMBER } from "../constants";

/**
 * @deprecated
 *
 */
export default abstract class ThreadManager<V, T, R = T> {
  protected _list: Array<T>;
  protected _results: Array<R>;

  protected _thread: number;
  protected _variable?: V;

  private isVariableSet: boolean;

  public get size() {
    return this._list.length;
  }

  constructor(thread: number = THREAD_NUMBER) {
    LoggerService.warn(
      LOGGER_THREAD,
      "This ThreadManager will be removed after public version is released; consider to use v2 ThreadManager instead",
    );

    if (thread) this._thread = thread;
    else this._thread = THREAD_NUMBER;

    this._list = new Array();
    this._results = new Array();

    this._variable = undefined;
    this.isVariableSet = false;
  }

  public add(t: T) {
    LoggerService.log(LOGGER_THREAD, `add value %O`, t);
    this._list.push(t);
    return this;
  }

  public run() {
    return (mapLimit(this._list, this._thread, (i: T, callback) => {
      LoggerService.log(LOGGER_THREAD, `start transform object %O with options=%O`, i, this._variable);
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
