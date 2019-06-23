import CommandApi from "../apis/Command";

import Commandline from "./Commandline";

type VoidFunction = () => void;

export type ICommandCallback = (value: {
  self: Commandline;
  name: string;
  value: string | undefined;
  apis: CommandApi;
}) => VoidFunction | void | undefined | Promise<void> | Promise<undefined> | Promise<VoidFunction>;

export default abstract class ICommand {
  get name() {
    return this._name;
  }

  get needParam() {
    return this.param;
  }

  protected constructor(private _name: string, private param: boolean, private _callback: ICommandCallback) {}

  public execute(self: Commandline, value: string | undefined) {
    return this._callback({ self, name: this.name, value, apis: CommandApi.get() });
  }
}
