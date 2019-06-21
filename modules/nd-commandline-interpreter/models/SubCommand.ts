import ICommand, { ICommandCallback } from "./ICommand";

export default class SubCommand extends ICommand {
  public static build(name: string, needParam: boolean, callback: ICommandCallback) {
    return new SubCommand(name, needParam, callback);
  }
}
