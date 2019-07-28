export interface IThreadable<T, R> {
  add(t: T): this;

  run(): Promise<R[]>;
}
