import CommandApi from "../apis/Command";

import Commandline from "./Commandline";

type VoidFunction = () => void;
type BoolFunction = () => boolean;

export type ICommandCallbackResultSync = void | VoidFunction | BoolFunction | undefined;
export type ICommandCallbackResultASync =
  | Promise<void>
  | Promise<undefined>
  | Promise<VoidFunction>
  | Promise<BoolFunction>;

export type ICommandCallbackResult = ICommandCallbackResultSync | ICommandCallbackResultASync;

export type ICommandCallback = (value: {
  apis: CommandApi;
  name: string;
  self: Commandline;
  value: string | undefined;
}) => ICommandCallbackResult;

export default abstract class ICommand {
  get name() {
    return this._name;
  }

  get needParam() {
    return this.param;
  }
  public abstract get type(): string;
  private _child: Map<string, ICommand>;

  protected constructor(private _name: string, private param: boolean, private _callback: ICommandCallback) {
    this._child = new Map();
  }

  public execute(self: Commandline, value: string | undefined) {
    return this._callback({ self, name: this.name, value, apis: CommandApi.get() });
  }

  protected addChild(child: ICommand) {
    this._child.set(child.name, child);
  }

  protected getChild(name: string) {
    return this._child.get(name);
  }
}
