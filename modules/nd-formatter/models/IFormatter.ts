export interface Json {
  [key: string]: string;
}

export interface IFormatter<V = Json> {
  save(v: V): this;

  build(): string;
}
