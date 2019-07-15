export interface IParser<T = string, K = string, R = string> {
  readonly value: T;

  query(key: K): R;
}
