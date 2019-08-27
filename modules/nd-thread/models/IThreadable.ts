export type EachFn<K, V, O, OO> = (
  element: { key: K; value: V },
  callback: (err?: Error) => void,
  opts: { option?: O; optionOnce?: OO },
) => O;

export type MapFn<K, V, R, O, OO> = (
  element: { key: K; value: V },
  callback: (err?: Error) => void,
  opts: { option?: O; optionOnce?: OO },
) => R;

export interface IThreadable<K, V, O> {
  add(key: K, value: V): this;

  run(): Promise<any>;

  setOptionOnce(o: O): O | undefined;
}
