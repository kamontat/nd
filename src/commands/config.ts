import { Command, Commandline, Option, SubCommand } from "nd-commandline-interpreter";
import { IConfiguration } from "nd-config";
import LoggerService, { LOGGER_CLI } from "nd-logger";
import readline from "readline";

export default (cli: Commandline, config: IConfiguration) => {
  cli.command(
    Command.build("config", false, ({ self }) => {
      LoggerService.log(LOGGER_CLI, `${self.name} start default setting command`);
    })
      .sub(
        SubCommand.build(
          "init",
          false,
          async ({ apis }): Promise<void> => {
            config.restore();

            await config.start(readline.createInterface(process.stdin, process.stdout));
            config.save(apis.config.get("config.backup") as boolean);
          },
        ).option(Option.build("backup", false, ({ apis }) => apis.config.set("config.backup", true))),
      )
      .sub(
        SubCommand.build("path", true, async ({ self, apis }) => {
          LoggerService.log(LOGGER_CLI, `${self.name} start config path`);
          const open = apis.config.get("path.open") as boolean;
          const path = await config.path(open);

          if (apis.config.get("path.onlyName") as boolean) LoggerService.console.log(path);
          else LoggerService.console.log(`Configuration path is ${path}`);
        })
          .option(Option.build("open", false, ({ apis }) => apis.config.set("path.open", true)))
          .option(Option.build("only", false, ({ apis }) => apis.config.set("path.onlyName", true))),
      ),
  );
};
