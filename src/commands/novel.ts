import { Command, Commandline, ICommandCallback, IOptionable, Option, SubCommand } from "nd-commandline-interpreter";
import { IConfiguration } from "nd-config";
import ExceptionService, { ERR_NLV } from "nd-error";
import FormatterFactory, { NovelSummary } from "nd-formatter";
import LoggerService, { LOGGER_CLI } from "nd-logger";

import { HELP_FOOTER, HELP_HEADER, HELP_NOVEL } from "../constants/content";

import downloadCallback from "./novel/download";
import rawDownloadCallback from "./novel/raw";

export default (cli: Commandline, config: IConfiguration) => {
  const factory = FormatterFactory.Build();
  factory.set("novel", new NovelSummary());

  const downloadOption = <T extends IOptionable>(opt: T) => {
    opt
      .option(
        Option.build("location", true, ({ value }) => {
          LoggerService.log(LOGGER_CLI, `downloading location is ${value}`);
          config.set("novel.location", value);
        }),
      )
      .option(
        Option.build("thread", true, ({ value, apis }) => {
          if (!apis.verify.IsNumber(value)) throw ExceptionService.build(ERR_NLV, "input must be number of thread");
          apis.config.set("novel.thread", parseInt(value || "4"));
        }),
      )
      .option(Option.build("replace", false, ({ apis }) => apis.config.set("novel.replace", true)))
      .option(Option.build("change", false, ({ apis }) => apis.config.set("novel.change", true)));

    return opt;
  };

  const rawDownloadOption = <T extends IOptionable>(opt: T) => {
    opt
      .option(
        Option.build("location", true, ({ value }) => {
          LoggerService.log(LOGGER_CLI, `downloading location is ${value}`);
          config.set("novel.location", value);
        }),
      )
      .option(
        Option.build("thread", true, ({ value, apis }) => {
          if (!apis.verify.IsNumber(value)) throw ExceptionService.build(ERR_NLV, "input must be number of thread");
          apis.config.set("novel.thread", value || 4);
        }),
      )
      .option(Option.build("replace", false, ({ apis }) => apis.config.set("novel.replace", true)))
      .option(Option.build("chapter", true, ({ value, apis }) => apis.config.set("novel.chapter", value || "")));

    return opt;
  };

  /**
   * Command setup
   */

  downloadOption(cli).callback(downloadCallback);

  cli.command(
    downloadOption(
      Command.build("novel", true, downloadCallback)
        .sub(
          SubCommand.build("help", false, ({ self }) => {
            LoggerService.console.log(`
${HELP_HEADER(self.name, self.description)}
${HELP_NOVEL(self.name)}`);
          }),
        )
        .sub(downloadOption(SubCommand.build("download", true, downloadCallback)))
        .sub(rawDownloadOption(SubCommand.build("raw", true, rawDownloadCallback))),
    ),
  );

  cli.command(rawDownloadOption(Command.build("raw", true, rawDownloadCallback)));
};
