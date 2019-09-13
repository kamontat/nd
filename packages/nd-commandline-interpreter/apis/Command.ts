import CommandlineConfig from "../models/CommandlineConfig";

import Verify from "./Verify";

export default class CommandApis {
  get config() {
    return CommandlineConfig.CONST();
  }

  get verify() {
    return Verify;
  }

  private static c: CommandApis;

  public static get() {
    if (!CommandApis.c) CommandApis.c = new CommandApis();
    return CommandApis.c;
  }

  public end() {
    return true;
  }

  public exit() {
    process.exit(0);
  }

  public forceExit() {
    process.exit(5);
  }
}
