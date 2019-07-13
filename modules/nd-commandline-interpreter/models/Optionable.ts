import ICommand, { ICommandCallback } from "./ICommand";
import Option from "./Option";

export interface IOptionable {
  option(option: Option): this;
}

export default abstract class Optionable extends ICommand implements IOptionable {
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
