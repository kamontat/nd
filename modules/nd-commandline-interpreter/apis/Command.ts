import CommandlineConfig from "../models/CommandlineConfig";

import Verify from "./Verify";

export default class CommandApis {
  private static c: CommandApis;

  public exit() {
    process.exit(0);
  }

  public end() {
    return true;
  }

  public forceExit() {
    process.exit(5);
  }

  get verify() {
    return Verify;
  }

  get config() {
    return CommandlineConfig.CONST();
  }

  public static get() {
    if (!CommandApis.c) CommandApis.c = new CommandApis();
    return CommandApis.c;
  }
}
