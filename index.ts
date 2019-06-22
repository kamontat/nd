import { Command, Commandline, Option, SubCommand, Verify } from "nd-commandline-interpreter";
import { load } from "nd-config";
import Exception from "nd-error";
import { Colorize } from "nd-helper";
import LoggerService, { LOGGER_CLI, LOGGER_ROOT } from "nd-logger";

import pjson from "./package.json";
import { Package } from "./src/build/Package";
import { HELP_CONTENT, HELP_FOOTER, VERSION_FULL } from "./src/constants/content";

declare var __COMPILE_DATE__: string;

// disable color if --no-color appear
((args: string[]) => {
  const i = args.findIndex(v => /^--no-color$/.test(v));
  if (i >= 0) {
    args.splice(i, 1);
    process.env.DEBUG_COLORS = "false";
  }
})(process.argv);

// set logger level if --level [0|1|2] appear
const updateLoggerInfo = (args: string[]) => {
  const i = args.findIndex(v => /^--level$/.test(v));
  if (i >= 0) {
    const v = args[i + 1];
    if (v === "0") LoggerService.disable();
    // print nothing
    else if (v === "1") LoggerService.enable("nd*warn,nd*error");
    // print only warn and error
    else if (v === "2") LoggerService.enable("nd:*");
  }
};
updateLoggerInfo(process.argv);

// --------------------------- //
// Start commandline interface //
// --------------------------- //

const cli = new Commandline(pjson.name, pjson.description);

load("/tmp/test.ndc")
  .then(config => {
    config.on("output.level", (level: string) => {
      LoggerService.log(LOGGER_CLI, `now output level is ${level}`);
      updateLoggerInfo(["--level", level]);
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
      Command.build("setting", false, ({ self }) => {
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
      Command.build("command", true, ({ self, value }) => {
        LoggerService.log(LOGGER_CLI, `${self.name} start default novel command with ${value}`);
      }).sub(
        SubCommand.build("version", false, ({ self }) => {
          LoggerService.log(LOGGER_CLI, `${self.name} start initial setting command`);
          console.log(VERSION_FULL());
        }),
      ),
    );

    return new Promise<Commandline>(res => {
      res(cli);
    });
  })
  .then(cli => {
    cli.run(process.argv);
  })
  .catch(e => {
    const err = Exception.cast(e);
    err.print(LOGGER_ROOT).exit(1);
  });
