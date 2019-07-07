import { Command, Commandline, ICommandCallback, Option, SubCommand } from "nd-commandline-interpreter";
import { ConfigParser, IConfiguration } from "nd-config";
import Exception, { ERR_CFG } from "nd-error";
import { ObjectJson, ObjectTable } from "nd-formatter";
import LoggerService, { LOGGER_CLI } from "nd-logger";
import readline from "readline";

export default (cli: Commandline, config: IConfiguration) => {
  const getCallback: ICommandCallback = ({ value, apis }) => {
    const result = config.regex(value || "");

    const formatter = apis.config.get("config.get.format") === "table" ? new ObjectTable() : new ObjectJson();
    const message = formatter.save(result).build();
    LoggerService.console.log(message);
  };

  cli.command(
    Command.build("config", true, getCallback)
      .option(Option.build("table", false, ({ apis }) => apis.config.set("config.get.format", "table")))
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
        SubCommand.build("set", true, ({ value, apis }) => {
          LoggerService.log(LOGGER_CLI, `set ${value}`);
          const parsed = ConfigParser(value);
          if (!parsed) throw Exception.build(ERR_CFG).description("cannot parse any key or value from input string");
          if (parsed instanceof Array) parsed.forEach(p => config.set(p.key, p.value));
          else config.set(parsed.key, parsed.value);

          config.save(apis.config.get("config.backup") as boolean);
        }).option(Option.build("backup", false, ({ apis }) => apis.config.set("config.backup", true))),
      )
      .sub(
        SubCommand.build("get", true, getCallback).option(
          Option.build("table", false, ({ apis }) => apis.config.set("config.get.format", "table")),
        ),
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
