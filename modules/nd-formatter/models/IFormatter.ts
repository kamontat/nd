export interface IJson {
  [key: string]: string;
}

export interface IDefaultConfigFormat {
  _format: true;
}

export interface IFormatter<C extends IDefaultConfigFormat, V = IJson> {
  save(v: V): this;

  config(config: C): this;

  build(): string;
}
