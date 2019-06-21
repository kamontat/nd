import { Command, Commandline, Option, SubCommand } from "nd-commandline-interpreter";
import LoggerService, { LOGGER_CLI } from "nd-logger";

import pjson from "./package.json";
import { HELP_CONTENT, HELP_FOOTER } from "./src/constants/help";

declare var __COMPILE_DATE__: string;

(function disableColor(args: string[]) {
  const i = args.findIndex(v => /^--no-color$/.test(v));
  if (i >= 0) {
    args.splice(i, 1);
    process.env.DEBUG_COLORS = "false";
  }
})(process.argv);

const cli = new Commandline(pjson.name, pjson.description);

cli.option(
  Option.build("help", false, self => {
    const date = new Date(__COMPILE_DATE__);
    LoggerService.log(LOGGER_CLI, `${self.name} start --help`);

    console.log(`
${self.name.toUpperCase()} command; ${self.description}
Built at ${date.toLocaleString()}
${HELP_CONTENT(self.name)}
${HELP_FOOTER(self.name)}`);
  }),
);

cli.command(
  Command.build("setting", false, self => {
    LoggerService.log(LOGGER_CLI, `${self.name} start default setting command`);
  })
    .sub(
      SubCommand.build("init", false, self => {
        LoggerService.log(LOGGER_CLI, `${self.name} start initial setting command`);
      }),
    )
    .sub(
      SubCommand.build("path", true, (self: Commandline, name: string, value: string | undefined) => {
        LoggerService.log(LOGGER_CLI, `${self.name} start run ${name} with ${value}`);
      }),
    ),
);

cli.run(process.argv);
