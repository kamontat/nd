import { Dictionary, eachOfLimit, mapValuesLimit } from "async";
import LoggerService, { LOGGER_THREAD } from "nd-logger";

import { THREAD_NUMBER } from "../constants";

import { EachFn, IThreadable, MapFn } from "./IThreadable";

type KeyType = string | number;

export default abstract class ThreadManager<K extends KeyType, V, R, O, OO = O> implements IThreadable<K, V, OO> {
  public get size() {
    return this._list.size;
  }

  protected get optionOnceExist() {
    return this._optionOnce !== undefined;
  }

  protected get optionsExist() {
    return this._options !== undefined;
  }

  protected _list: Map<K, V>;
  protected _thread: number;

  private _optionOnce?: OO;
  private _options?: O;

  constructor(thread: number = THREAD_NUMBER) {
    if (thread) this._thread = thread;
    else this._thread = THREAD_NUMBER;

    this._list = new Map();
  }

  public add(key: K, value: V) {
    this._list.set(key, value);
    return this;
  }

  public option(d: O) {
    return this._options || d;
  }

  public optionOnce(d: OO) {
    return this._optionOnce || d;
  }

  public abstract run(): Promise<any>;

  public setOptionOnce(o: OO) {
    if (!this.optionOnceExist) {
      this._optionOnce = o;
      return undefined;
    }
    return this._optionOnce;
  }

  /**
   * execute fn in any order with async task
   * @param fn function to be executed
   */
  protected _each(fn: EachFn<K, V, O, OO>) {
    return (eachOfLimit((this._list as unknown) as Dictionary<V>, this._thread, (v, k, callback) => {
      LoggerService.log(
        LOGGER_THREAD,
        `start map object %O with options=%O and optionOnce=%O`,
        { key: k, value: v },
        this._options,
        this._optionOnce,
      );

      return fn({ key: (k as unknown) as K, value: v }, { option: this._options, optionOnce: this._optionOnce })
        .then(o => {
          if (o) this.setOption(o);
          callback(undefined);
        })
        .catch(err => callback(err));
    }) as unknown) as Promise<void>;
  }

  /**
   * async mapping input array to output array
   */
  protected _map(fn: MapFn<K, V, R, O, OO>) {
    return (mapValuesLimit(
      (this._list as unknown) as Dictionary<V>, // input map object
      this._thread, // input limit number
      (v, k, callback) => {
        LoggerService.log(
          LOGGER_THREAD,
          `start map object %O with options=%O and optionOnce=%O`,
          { key: k, value: v },
          this._options,
          this._optionOnce,
        );

        fn({ key: (k as unknown) as K, value: v }, { option: this._options, optionOnce: this._optionOnce })
          .then(v => callback(undefined, v))
          .catch(err => callback(err, undefined));
      },
      undefined as any,
    ) as unknown) as Promise<R[]>;
  }

  protected setOption(o: O) {
    const caches = this._options;
    this._options = o;

    return caches;
  }
}
