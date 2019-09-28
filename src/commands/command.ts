import { Command, Commandline, ICommandCallback, Option, SubCommand } from "nd-commandline-interpreter";
import { config, IConfiguration } from "nd-config";
import LoggerService, { LOGGER_CLI } from "nd-logger";

import { COMMAND_INFORMATION, HELP_COMMAND, HELP_HEADER, VERSION, VERSION_FULL } from "../constants/content";

import ProgramVerification from "./command/verify";

export default (cli: Commandline, _: IConfiguration) => {
  const verification: ICommandCallback = async ({ self, apis }) => {
    let msg = "";
    const json = apis.config.get("command.output.json", false);
    if (json) {
      const root = JSON.parse(await COMMAND_INFORMATION(self.name, { json }));
      const next = JSON.parse(await ProgramVerification(self, { json }));

      msg = JSON.stringify({ ...root, ...next }, undefined, "  ");
    } else {
      msg = await COMMAND_INFORMATION(self.name, { json });
      msg += "\n\n\n";
      msg += await ProgramVerification(self, { json });
    }

    LoggerService.console.log(msg);
  };

  cli.command(
    Command.build("command", false, verification)
      .option(Option.build("json", false, ({ apis }) => apis.config.set("command.output.json", true)))
      .sub(
        SubCommand.build("verify", false, verification).option(
          Option.build("json", false, ({ apis }) => apis.config.set("command.output.json", true)),
        ),
      )
      .sub(
        SubCommand.build("help", false, ({ self }) => {
          LoggerService.console.log(`
${HELP_HEADER(self.name, self.description)}
${HELP_COMMAND(self.name)}`);
        }),
      )
      .sub(
        SubCommand.build("version", false, ({ self, apis }) => {
          LoggerService.log(LOGGER_CLI, `${self.name} start initial setting command`);

          if (apis.config.get("version.detail"))
            LoggerService.console.log(VERSION_FULL(config.get("command.version.detail.limit")));
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
