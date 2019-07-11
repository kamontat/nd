export interface IJson {
  [key: string]: string;
}

export interface IFormatter<V = IJson> {
  save(v: V): this;

  build(): string;
}
