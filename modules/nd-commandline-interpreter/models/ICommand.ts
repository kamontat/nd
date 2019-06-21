import Commandline from "./Commandline";

export type ICommandCallback = (self: Commandline, name: string, value: string | undefined) => void;

export default abstract class ICommand {
  get name() {
    return this._name;
  }

  get needParam() {
    return this.param;
  }

  protected constructor(private _name: string, private param: boolean, private _callback: ICommandCallback) {}

  public execute(self: Commandline, value: string | undefined) {
    return this._callback(self, this._name, value);
  }
}
