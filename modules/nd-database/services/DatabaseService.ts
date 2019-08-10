import ExceptionService, { ERR_DBO } from "nd-error";

import IDatabase from "../models/IDatabase";

export default class {
  private static instance: IDatabase;

  public static Get<V extends IDatabase>() {
    if (!this.instance) throw ExceptionService.build(ERR_DBO, "You try to get empty database object; Initial it first");
    return this.instance as V;
  }

  public static Set(i: IDatabase) {
    if (!this.instance) this.instance = i;
    else throw ExceptionService.build(ERR_DBO, "You initial database object twice.");
  }
}
