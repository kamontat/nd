import { SubCommand } from "@nd/commandline-interpreter";
import { Command, Commandline } from "@nd/commandline-interpreter";
import { IConfiguration } from "@nd/config";
import LoggerService, { LOGGER_CLI } from "@nd/logger";
// import omelette from "omelette";

export default (cli: Commandline, _: IConfiguration) => {
  cli.command(
    Command.build("completion", false, async ({ self }) => {
      LoggerService.log(LOGGER_CLI, `${self.name} start install completion`);
      // await tabtab.install({
      //   name: "nd",
      //   completer: "nd",
      // });
    }).sub(
      SubCommand.build("uninstall", false, async ({ self }) => {
        LoggerService.log(LOGGER_CLI, `${self.name} start uninstall completion`);
        // await tabtab.uninstall({
        //   name: "nd",
        // });
      }),
    ),
  );
};
