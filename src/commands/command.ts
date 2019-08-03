import { Command, Commandline, Option, SubCommand } from "nd-commandline-interpreter";
import { IConfiguration } from "nd-config";
import LoggerService, { LOGGER_CLI } from "nd-logger";

import { COMMAND_INFORMATION, HELP_HEADER, HELP_NOVEL, VERSION, VERSION_FULL } from "../constants/content";

export default (cli: Commandline, _: IConfiguration) => {
  cli.command(
    Command.build("command", false, ({ self }) => {
      LoggerService.console.log(COMMAND_INFORMATION(self.name));
    })
      .sub(
        SubCommand.build("help", false, ({ self }) => {
          LoggerService.console.log(`
${HELP_HEADER(self.name, self.description)}
${HELP_NOVEL(self.name)}`);
        }),
      )
      .sub(
        SubCommand.build("version", false, ({ self, apis }) => {
          LoggerService.log(LOGGER_CLI, `${self.name} start initial setting command`);

          if (apis.config.get("version.detail")) LoggerService.console.log(VERSION_FULL());
          else LoggerService.console.log(VERSION());
        }).option(
          Option.build("detail", false, ({ apis }) => {
            LoggerService.log(LOGGER_CLI, `Start version as a fully detail`);
            apis.config.set("version.detail", true);
          }),
        ),
      ),
  );
};
