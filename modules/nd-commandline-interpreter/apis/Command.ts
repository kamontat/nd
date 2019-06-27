import Verify from "./Verify";

export default class CommandApis {
  private static c: CommandApis;

  public end() {
    process.exit(0);
  }

  public forceEnd() {
    process.exit(5);
  }

  get verify() {
    return Verify;
  }

  public static get() {
    if (!CommandApis.c) CommandApis.c = new CommandApis();
    return CommandApis.c;
  }
}
