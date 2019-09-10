import ICommand, { ICommandCallback } from "./ICommand";

export default class Option extends ICommand {
  public get type() {
    return "option";
  }

  get option() {
    return `--${this.name}`;
  }

  public static build(name: string, needParam: boolean, callback: ICommandCallback) {
    return new Option(name, needParam, callback);
  }
}
