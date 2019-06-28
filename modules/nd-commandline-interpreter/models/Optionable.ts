import ICommand, { ICommandCallback } from "./ICommand";
import Option from "./Option";

export default abstract class Optionable extends ICommand {
  protected constructor(name: string, param: boolean, callback: ICommandCallback) {
    super(name, param, callback);
  }

  public option(option: Option) {
    this.addChild(option);
    return this;
  }

  public getOption(name: string) {
    return this.getChild(name) as Option;
  }
}
