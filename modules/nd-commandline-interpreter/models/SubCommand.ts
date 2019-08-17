import { ICommandCallback } from "./ICommand";
import Optionable from "./Optionable";

export default class SubCommand extends Optionable {
  public get type() {
    return "subcommand";
  }

  public static build(name: string, needParam: boolean, callback: ICommandCallback) {
    return new SubCommand(name, needParam, callback);
  }
}
