import ICommand, { ICommandCallback } from "./ICommand";
import SubCommand from "./SubCommand";

export default class Command extends ICommand {
  private _subcommands: Map<string, SubCommand>;

  protected constructor(name: string, param: boolean, callback: ICommandCallback) {
    super(name, param, callback);
    this._subcommands = new Map();
  }

  public sub(sub: SubCommand) {
    this._subcommands.set(sub.name, sub);
    return this;
  }

  public getSub(name: string) {
    return this._subcommands.get(name);
  }

  public static build(name: string, needParam: boolean, callback: ICommandCallback) {
    return new Command(name, needParam, callback);
  }
}
