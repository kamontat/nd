import { IFormatter } from "./models/IFormatter";
import Package from "./package.json";

export { Package };

export { ObjectTable } from "./models/ObjectTable";
export { ObjectJson } from "./models/ObjectJson";
export { NovelSummary } from "./models/NovelSummary";

export default class FormatterFactory {
  private static factory: FormatterFactory;

  private __collection: Map<string, IFormatter<any, any>>;

  constructor() {
    this.__collection = new Map();
  }

  public static Build() {
    if (!FormatterFactory.factory) FormatterFactory.factory = new FormatterFactory();
    return FormatterFactory.factory;
  }

  public get<T extends IFormatter<any, any>>(key: string): T {
    if (!this.__collection.has(key)) throw new Error(`Formatter factory cannot get any formatter with key ${key}`);

    return this.__collection.get(key) as any;
  }

  public set(key: string, i: IFormatter<any, any>) {
    this.__collection.set(key, i);
  }
}
