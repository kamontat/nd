import { Command, Commandline, Option, SubCommand } from "nd-commandline-interpreter";
import { IConfiguration } from "nd-config";
import { Colorize } from "nd-helper";
import LoggerService, { LOGGER_CLI } from "nd-logger";
// TODO: make completion as a dependency instead.
import tabtab from "tabtab";

import { Package } from "./build/Package";
import { HELP_CONTENT, HELP_FOOTER, VERSION_FULL } from "./constants/content";

declare var __COMPILE_DATE__: string;

// set logger level if --level [0|1|2] appear
export const UpdateLogInfo = (args: string[]) => {
  const i = args.findIndex(v => /^--level$/.test(v));
  if (i >= 0) {
    const v = args[i + 1];
    // print nothing
    if (v === "0") LoggerService.disable();
    // print only warn and error
    else if (v === "1") LoggerService.enable("nd*warn,nd*error");
    // print everything in nd command
    else if (v === "2") LoggerService.enable("nd:*");
    // print everything of all nd command and libraries
    else if (v === "3") LoggerService.enable("*");
  }
};

// --------------------------- //
// Start commandline interface //
// --------------------------- //

export const BuildCommandline = (cli: Commandline, config: IConfiguration) => {
  // . realtime update output.level
  config.on("output.level", (level: string) => {
    LoggerService.log(LOGGER_CLI, `now output level is ${level}`);
    UpdateLogInfo(["--level", level]);
  });

  cli.option(
    Option.build("help", false, ({ self, apis }) => {
      const date = new Date(__COMPILE_DATE__);
      LoggerService.log(LOGGER_CLI, `${self.name} start --help`);
      LoggerService.console.log(`
${Colorize.appname(self.name.toUpperCase())} command; ${self.description}
Built at ${Colorize.datetime(date.toLocaleString())}
${HELP_CONTENT(self.name)}
${HELP_FOOTER(self.name)}`);
      return apis.end;
    }),
  );

  cli.option(
    Option.build("version", false, ({ self, apis }) => {
      LoggerService.console.log(Colorize.format`${self.name}: v${Package.version}`);
      return apis.end;
    }),
  );

  cli.option(
    Option.build("level", true, ({ value }) => {
      LoggerService.log(LOGGER_CLI, `try to set log level to ${value}`);
      config.set("output.level", value);
    }),
  );

  cli.command(
    Command.build("config", false, ({ self }) => {
      LoggerService.log(LOGGER_CLI, `${self.name} start default setting command`);
    })
      .sub(
        SubCommand.build("init", false, ({ self }) => {
          LoggerService.log(LOGGER_CLI, `${self.name} start initial setting command`);
        }),
      )
      .sub(
        SubCommand.build("path", true, ({ self }) => {
          LoggerService.log(LOGGER_CLI, `${self.name} start config path`);
        }),
      ),
  );

  cli.command(
    Command.build("completion", false, async ({ self }) => {
      LoggerService.log(LOGGER_CLI, `${self.name} start install completion`);
      await tabtab.install({
        name: "nd",
        completer: "nd",
      });
    }).sub(
      SubCommand.build("uninstall", false, async ({ self }) => {
        LoggerService.log(LOGGER_CLI, `${self.name} start uninstall completion`);

        await tabtab.uninstall({
          name: "nd",
        });
      }),
    ),
  );

  cli.command(
    Command.build("command", true, ({ self, value }) => {
      LoggerService.log(LOGGER_CLI, `${self.name} start default novel command with ${value}`);
      tabtab.log([{ name: "version", description: "show command version (all)" }]);
    }).sub(
      SubCommand.build("version", false, ({ self }) => {
        LoggerService.log(LOGGER_CLI, `${self.name} start initial setting command`);
        LoggerService.console.log(VERSION_FULL());
      }),
    ),
  );

  return new Promise<Commandline>(res => {
    res(cli);
  });
};
