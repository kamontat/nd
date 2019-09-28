import Exception, { ERR_CLI } from "@nd/error";
import LoggerService, { Colorize, LOGGER_CLI_BUILDER } from "@nd/logger";

import { CommandApi } from "..";

import Command from "./Command";
import CommandlineEvent, { Default } from "./CommandlineEvent";
import { ICommandCallback, ICommandCallbackResult } from "./ICommand";
import Option from "./Option";
import Optionable, { IOptionable } from "./Optionable";

export default class Commandline implements IOptionable {
  get description() {
    return this._description;
  }

  set event(event: CommandlineEvent) {
    this.event.removeAllListeners(); // remove all old listeners
    this.event.emit("destory", undefined);
    this._event = event;
    this.event.emit("initial", undefined);
  }

  get event() {
    return this._event;
  }
  get name() {
    return this._name;
  }

  private _callback?: ICommandCallback;
  private _commands: Map<string, Command>;
  private _globalOptions: Map<string, Option>;

  constructor(private _name: string, private _description: string, private _event: CommandlineEvent = Default) {
    this._globalOptions = new Map();
    this._commands = new Map();

    LoggerService.log(LOGGER_CLI_BUILDER, `initial ${Colorize.appname(this._name)} commandline`);
  }

  public callback(callback: ICommandCallback) {
    this._callback = callback;
  }

  public command(cmd: Command) {
    this._commands.set(cmd.name, cmd);
  }

  public option(option: Option) {
    this._globalOptions.set(option.name, option);
    return this;
  }

  public async run(_args: string[]) {
    const node = _args[0];
    const file = _args[1];

    const args = _args.slice(2);

    LoggerService.log(LOGGER_CLI_BUILDER, `node path       ${node}`);
    LoggerService.log(LOGGER_CLI_BUILDER, `file path       ${file}`);
    LoggerService.log(LOGGER_CLI_BUILDER, `input arguments ${args}`);

    const global = await this.executeGlobalOptions(args);

    if (global.callback.length > 0) {
      LoggerService.log(LOGGER_CLI_BUILDER, `global callback exist`);
      LoggerService.log(LOGGER_CLI_BUILDER, `start run global callback...`);

      global.callback.forEach(c => {
        if (c && typeof c === "function") {
          LoggerService.log(LOGGER_CLI_BUILDER, `callback is function; calling it...`);
          const isEnd = c();
          if (isEnd === true) {
            LoggerService.log(LOGGER_CLI_BUILDER, `program should be finish now`);
            return this.finish();
          } else {
            LoggerService.log(LOGGER_CLI_BUILDER, `continue this next process`);
          }
        } else {
          LoggerService.log(LOGGER_CLI_BUILDER, `not sure what is a callback type = ${Colorize.important(typeof c)}`);
        }
      });
    }

    args.push(""); // push empty string
    const callback = await this.travisArgumentPath(global.arguments);
    if (callback && typeof callback === "function") {
      const isEnd = callback();
      if (isEnd === true) return this.finish();
    }

    return this.finish();
  }

  private async executeGlobalOptions(opts: string[]) {
    LoggerService.log(LOGGER_CLI_BUILDER, `start check global option...`);

    const callback: ICommandCallbackResult[] = [];

    await opts.forEach(async (_o, i) => {
      if (!this.isOption(_o)) return;

      const o = _o.replace("--", "");
      LoggerService.log(LOGGER_CLI_BUILDER, `is ${o} be global option ?`);
      if (this._globalOptions.has(o)) {
        const option = this._globalOptions.get(o) as Option;
        LoggerService.log(
          LOGGER_CLI_BUILDER,
          `  - ${Colorize.option(o)} is a global option ${option.needParam ? "need parameter" : "no parameter"} !`,
        );

        if (option.needParam) {
          callback.push(await option.execute(this, opts[i + 1]));
          this._event.emit("globalOption", option, opts[i + 1]);
          opts.splice(i, 2);
        } else {
          callback.push(await option.execute(this, undefined));
          this._event.emit("globalOption", option);
          opts.splice(i, 1);
        }
      } else {
        LoggerService.log(LOGGER_CLI_BUILDER, `  - ${Colorize.option(o)} is not a global option !`);
      }
    });

    return { arguments: opts, callback };
  }

  private finish() {
    LoggerService.log(LOGGER_CLI_BUILDER, "start emit end process event !!");
    this.event.emit("end");
  }

  private isCommand(a: string) {
    return this._commands.get(a);
  }

  private isOption(a: string) {
    return /^--.*/.test(a);
  }

  private isParam(a?: string) {
    return a !== undefined && a !== null && !this.isOption(a) && a !== "";
  }

  private async travisArgumentPath(args: string[]): Promise<ICommandCallbackResult> {
    LoggerService.log(LOGGER_CLI_BUILDER, `start check arguments...`);

    let skip: Array<number> = [];
    let c: Command | undefined;
    let callback: ICommandCallbackResult;

    let i = 0;
    for await (const arg of args) {
      // print the log message with current and future argument
      let __msg = `arguments index ${i}`;
      if (arg !== "") __msg += `\n  - current: ${arg}`;
      const next = args[i + 1];
      if (next !== "") __msg += `\n  - next   : ${next}`;
      LoggerService.log(LOGGER_CLI_BUILDER, __msg);
      LoggerService.log(LOGGER_CLI_BUILDER, `skip value is [${skip}]`);

      if (c) {
        let s;

        if (!this.isOption(arg)) {
          LoggerService.log(LOGGER_CLI_BUILDER, `${c.name} might have ${arg} as a subcommand ?`);
          s = c.getSub(arg);
        }

        if (s) {
          LoggerService.log(LOGGER_CLI_BUILDER, `  - ${arg} is a subcommand of ${c.name} !`);
          skip.push(...this.travisOptionPath(s, args));

          if (s.needParam) {
            if (!this.isParam(next))
              throw Exception.build(ERR_CLI).description(`${c.name} ${s.name} is require parameter`);
            LoggerService.log(LOGGER_CLI_BUILDER, `need parameter; pass ${next} as subcommand parameter`);
            callback = await s.execute(this, next);
            this._event.emit("subcommand", s, next);
            skip.push(i + 1); // skip next args
          } else {
            LoggerService.log(LOGGER_CLI_BUILDER, `no parameter required`);
            callback = await s.execute(this, undefined);
            this._event.emit("subcommand", s);
          }

          LoggerService.log(LOGGER_CLI_BUILDER, `${c.name} ${s.name} has been executed; remove in cache`);
          c = undefined;
          s = undefined;
          continue; // skip
        } else {
          if (!this.isOption(arg))
            LoggerService.log(LOGGER_CLI_BUILDER, `  - ${arg} isn't a subcommand of ${c.name} !`);

          skip.push(...this.travisOptionPath(c, args));
          // LoggerService.log(LOGGER_CLI_BUILDER, `updated config from options`);

          if (c.needParam) {
            if (!this.isParam(arg)) throw Exception.build(ERR_CLI).description(`${c.name} is require parameter`);
            LoggerService.log(LOGGER_CLI_BUILDER, `need parameter; pass ${arg} as command parameter`);
            callback = await c.execute(this, arg);
            this._event.emit("command", c);
            skip.push(i + 1); // skip next args
          } else {
            LoggerService.log(LOGGER_CLI_BUILDER, `no parameter required`);
            callback = await c.execute(this, undefined);
            this._event.emit("command", c);
          }

          LoggerService.log(LOGGER_CLI_BUILDER, `${c.name} has been executed; remove in cache`);
          c = undefined;
          continue; // skip
        }
      }

      if (skip.includes(i)) {
        LoggerService.log(LOGGER_CLI_BUILDER, `skip argument ${arg}`);
        skip = skip.filter(s => s !== i); // remove element of i

        i++; // increase i even skip
        continue;
      }

      if (i === 0 && this.isOption(arg)) {
        LoggerService.log(LOGGER_CLI_BUILDER, `option look like to appear before primary command set`);
        throw Exception.build(ERR_CLI).description(
          `Invalid command format... learn more at ${Colorize.appname(this.name)} ${Colorize.option("--help")}`,
        );
      }

      // no command in first args
      c = this.isCommand(arg);
      if (c)
        LoggerService.log(
          LOGGER_CLI_BUILDER,
          `received, '${Colorize.important(c.name)}' as a ${
            c.needParam ? "need parameter" : "no parameter"
          } root command`,
        );

      // if no root command exist
      // error if default callback never got set
      if (i === 0 && !c) {
        LoggerService.log(LOGGER_CLI_BUILDER, `seem like you didn't input any valid root command`);
        LoggerService.log(LOGGER_CLI_BUILDER, `try to call default callback with arguments '${arg}'`);

        if (this._callback) {
          if (!this.isParam(arg)) throw Exception.build(ERR_CLI).description(`${this.name} is require parameter`);
          callback = this._callback({ self: this, name: "default", value: arg, apis: CommandApi.get() });
        } else
          throw Exception.build(ERR_CLI).description(
            `Invalid command format... learn more at ${Colorize.appname(this.name)} ${Colorize.option("--help")}`,
          );
      }

      i++;
    }

    return callback;
  }

  private travisOptionPath(c: Optionable, opts: string[]) {
    const skipingList: Array<number> = [];

    LoggerService.log(LOGGER_CLI_BUILDER, `start check local option...`);

    opts.forEach((_o, i) => {
      // print the log message with current and future argument
      let __msg = "options";
      if (_o !== "") __msg += `\n  - current: ${_o}`;
      const next = opts[i + 1];
      if (next !== "") __msg += `\n  - next   : ${next}`;
      LoggerService.log(LOGGER_CLI_BUILDER, __msg);

      if (!this.isOption(_o)) {
        LoggerService.log(LOGGER_CLI_BUILDER, `skip this since it not a option`);
        return;
      }

      const o = _o.replace("--", "");

      LoggerService.log(LOGGER_CLI_BUILDER, `is ${o} be option of ${c.name} ?`);
      const option = c.getOption(o);

      if (option) {
        LoggerService.log(
          LOGGER_CLI_BUILDER,
          `  - ${Colorize.option(option.name)} is a ${
            option.needParam ? "need parameter option" : "no parameter option"
          } which is a part of ${c.name} ${c.type}`,
        );

        if (option.needParam) {
          if (!this.isParam(next)) throw Exception.build(ERR_CLI).description(`${option.name} is required parameter`);

          LoggerService.log(LOGGER_CLI_BUILDER, `    - pass ${Colorize.value(next)} as a parameter`);
          option.execute(this, next);

          this._event.emit("option", option, next);

          skipingList.push(i);
          skipingList.push(i + 1);
        } else {
          option.execute(this, undefined);
          this._event.emit("option", option);

          skipingList.push(i);
        }
      } else {
        LoggerService.log(LOGGER_CLI_BUILDER, `  - cannot find ${Colorize.option(_o)} option on ${c.name}`);
      }
    });

    LoggerService.log(LOGGER_CLI_BUILDER, `start remove all resolved option and parameter`);
    LoggerService.log(LOGGER_CLI_BUILDER, `  - argument list ${opts}`);
    LoggerService.log(LOGGER_CLI_BUILDER, `  - removed list  ${skipingList}`);

    // remove all resolved arguments
    return skipingList;
    // return opts.filter((v, i) => {
    //   if (skipingList.includes(i)) {
    //     LoggerService.log(LOGGER_CLI_BUILDER, `  - removed '${v}' key from arguments`);
    //     return false;
    //   } else return true;
    // });
  }
}
