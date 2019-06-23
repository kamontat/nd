import ICommand, { ICommandCallback } from "./ICommand";
import SubCommand from "./SubCommand";

export default class Command extends ICommand {
  public sub(sub: SubCommand) {
    this.addChild(sub);
    return this;
  }

  public getSub(name: string) {
    return this.getChild(name);
  }

  public static build(name: string, needParam: boolean, callback: ICommandCallback) {
    return new Command(name, needParam, callback);
  }
}
