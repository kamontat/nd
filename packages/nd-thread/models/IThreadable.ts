export type EachFn<K, V, O, OO> = (
  element: { key: K; value: V },
  opts: { option?: O; optionOnce?: OO }
) => Promise<O | undefined | void>;

export type MapFn<K, V, R, O, OO> = (
  element: { key: K; value: V },
  opts: { option?: O; optionOnce?: OO }
) => Promise<R>;

export interface IThreadable<K, V, O> {
  add(key: K, value: V): this;

  run(): Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

  setOptionOnce(o: O): O | undefined;
}
