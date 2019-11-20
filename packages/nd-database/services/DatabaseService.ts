import ExceptionService, { ERR_DBO } from "@nd/error";

import IDatabase from "../models/IDBO";

type KeyDatabaseType = "database" | "storage";

export default class {
  private static instance: Map<KeyDatabaseType, IDatabase> = new Map();

  public static Get<V extends IDatabase>(key: KeyDatabaseType) {
    if (!this.instance.has(key))
      throw ExceptionService.build(ERR_DBO, "You try to get empty database object; Initial it first");

    return this.instance.get(key) as V;
  }

  public static Set<V extends IDatabase>(key: KeyDatabaseType, i: V) {
    if (!this.instance.has(key)) this.instance.set(key, i);
    else throw ExceptionService.build(ERR_DBO, "You initial database object twice.");
  }
}
