import { Command, Commandline, Option, SubCommand } from "nd-commandline-interpreter";
import { IConfiguration } from "nd-config";
import LoggerService, { LOGGER_CLI } from "nd-logger";
import { VERSION_FULL, VERSION_FULL_DETAIL } from "src/constants/content";

export default (cli: Commandline, _: IConfiguration) => {
  cli.command(
    Command.build("command", true, ({ self, value }) => {
      LoggerService.log(LOGGER_CLI, `${self.name} start default novel command with ${value}`);
      // tabtab.log([{ name: "version", description: "show command version (all)" }]);
    }).sub(
      SubCommand.build("version", false, ({ self, apis }) => {
        LoggerService.log(LOGGER_CLI, `${self.name} start initial setting command`);

        if (apis.config.get("version.detail")) LoggerService.console.log(VERSION_FULL_DETAIL());
        else LoggerService.console.log(VERSION_FULL());
      }).option(
        Option.build("detail", false, ({ apis }) => {
          LoggerService.log(LOGGER_CLI, `Start version as a fully detail`);
          apis.config.set("version.detail", true);
        }),
      ),
    ),
  );
};
