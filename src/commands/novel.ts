import { Command, Commandline, IOptionable, Option, SubCommand } from "nd-commandline-interpreter";
import { IConfiguration } from "nd-config";
import FormatterFactory, { NovelSummary } from "nd-formatter";
import LoggerService, { LOGGER_CLI } from "nd-logger";

import { HELP_HEADER, HELP_NOVEL } from "../constants/content";

import downloadCallback from "./novel/download";
import fetchCallback from "./novel/fetch";
import rawDownloadCallback from "./novel/raw";
import updateCallback from "./novel/update";

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
        Option.build("thread", true, ({ value, apis }) => apis.config.set("novel.thread", parseInt(value || "4"))),
      )
      .option(Option.build("replace", false, ({ apis }) => apis.config.set("novel.replace", true)))
      .option(Option.build("chapter", false, ({ apis }) => apis.config.set("novel.chapter", true)))
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
        Option.build("thread", true, ({ value, apis }) => apis.config.set("novel.thread", parseInt(value || "4"))),
      )
      .option(Option.build("replace", false, ({ apis }) => apis.config.set("novel.replace", true)))
      .option(Option.build("change", false, ({ apis }) => apis.config.set("novel.change", true)))
      .option(Option.build("chapters", true, ({ value, apis }) => apis.config.set("novel.chapters", value || "")));

    return opt;
  };

  const fetchOption = <T extends IOptionable>(opt: T) => {
    return opt
      .option(Option.build("check", false, ({ apis }) => apis.config.set("novel.fetch.check", true)))
      .option(Option.build("fast", false, ({ apis }) => apis.config.set("novel.fetch.fast", true)));
  };

  const updateOption = <T extends IOptionable>(opt: T) => {
    return opt
      .option(Option.build("dry-run", false, ({ apis }) => apis.config.set("novel.update.dry", true)))
      .option(Option.build("no-replace", false, ({ apis }) => apis.config.set("novel.replace", false)))
      .option(Option.build("recusive", false, ({ apis }) => apis.config.set("novel.update.recusive", true)));
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
        .sub(rawDownloadOption(SubCommand.build("raw", true, rawDownloadCallback)))
        .sub(fetchOption(SubCommand.build("fetch", true, fetchCallback)))
        .sub(updateOption(SubCommand.build("update", true, updateCallback))),
    ),
  );

  cli.command(Command.build("download", true, downloadCallback));
  cli.command(rawDownloadOption(Command.build("raw", true, rawDownloadCallback)));
  cli.command(fetchOption(Command.build("fetch", true, fetchCallback)));
  cli.command(updateOption(Command.build("update", true, updateCallback)));
};
