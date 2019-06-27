import Event from "events";
import ICommand from "nd-commandline-interpreter/models/ICommand";
import LoggerService, { LOGGER_CLI_BUILDER } from "nd-logger";

import { Option } from "..";

export type CommandlineEventName = "initial" | "globalOption" | "command" | "subcommand" | "option" | "destory";

export default class CommandlineEvent extends Event {
  public emit(c: CommandlineEventName, ...args: any[]) {
    return super.emit(c, ...args);
  }

  public on<T>(c: CommandlineEventName, listener: (obj: T, arg: string) => void) {
    return super.on(c, listener);
  }
}

export const Default = new CommandlineEvent();
Default.on("globalOption", (_: Option, arg: string) => {
  if (arg) LoggerService.log(LOGGER_CLI_BUILDER, `resolve as option with ${arg} as a parameter`);
  else LoggerService.log(LOGGER_CLI_BUILDER, `resolve as option without any parameters`);
});
