import { ICommandCallback } from "./ICommand";
import Optionable from "./Optionable";
import SubCommand from "./SubCommand";

export default class Command extends Optionable {
  public get type() {
    return "command";
  }

  public static build(name: string, needParam: boolean, callback: ICommandCallback) {
    return new Command(name, needParam, callback);
  }

  public getSub(name: string) {
    return this.getChild(name) as SubCommand;
  }

  public sub(sub: SubCommand) {
    this.addChild(sub);
    return this;
  }
}
