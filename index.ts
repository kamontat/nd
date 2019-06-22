import { Command, Commandline, Option, SubCommand, Verify } from "nd-commandline-interpreter";
import { load } from "nd-config";
import Exception from "nd-error";
import { Colorize } from "nd-helper";
import LoggerService, { LOGGER_CLI, LOGGER_ROOT } from "nd-logger";

import pjson from "./package.json";
import { Package } from "./src/build/Package";
import { HELP_CONTENT, HELP_FOOTER } from "./src/constants/content";

declare var __COMPILE_DATE__: string;

// disable color if --no-color appear
((args: string[]) => {
  const i = args.findIndex(v => /^--no-color$/.test(v));
  if (i >= 0) {
    args.splice(i, 1);
    process.env.DEBUG_COLORS = "false";
  }
})(process.argv);

// --------------------------- //
// Start commandline interface //
// --------------------------- //

const cli = new Commandline(pjson.name, pjson.description);

load("/tmp/test.ndc")
  .then(config => {
    cli.option(
      Option.build("help", false, ({ self, apis }) => {
        const date = new Date(__COMPILE_DATE__);
        LoggerService.log(LOGGER_CLI, `${self.name} start --help`);
        console.log(`
${self.name.toUpperCase()} command; ${self.description}
Built at ${date.toLocaleString()}
${HELP_CONTENT(self.name)}
${HELP_FOOTER(self.name)}`);

        return apis.end();
      }),
    );

    cli.option(
      Option.build("version", false, ({ self, apis }) => {
        console.log(Colorize.format`${self.name}: v${Package.version}`);
        return apis.end();
      }),
    );

    cli.option(
      Option.build("level", true, ({ self, value }) => {
        if (Verify.IsNumber(value)) {
          LoggerService.log(LOGGER_CLI, `${self.name} start verbose option setup`);
          LoggerService.log(LOGGER_CLI, `verbose have ${value} as params`);
          config.set("output.level", value);
        }
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
