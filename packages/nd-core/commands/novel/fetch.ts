import { ICommandCallback } from "@nd/commandline-interpreter";
import { config } from "@nd/config";
import ExceptionService, { ERR_CLI } from "@nd/error";
import FileSystem from "@nd/file";
import FormatterFactory, { NovelSummary } from "@nd/formatter";
import { HistorySummary } from "@nd/formatter/models/HistorySummary";
import { is, PathUtils } from "@nd/helper";
import LoggerService, { LOGGER_NOVEL_FETCHER } from "@nd/logger";
import { Compare, Novel } from "@nd/novel";
import { NovelBuilder } from "@nd/novel";
import { Resource, RESOURCE_FILENAME } from "@nd/resource";
import { resolve } from "path";

const __fetchUrl = async (value: number, opts: { chapter: boolean; fast: boolean; thread: number }) => {
  LoggerService.log(LOGGER_NOVEL_FETCHER, `get url/id as parameter; ${value}`);

  const factory = FormatterFactory.Build();
  const builder = new NovelBuilder(value);

  // build fast when not chapter exist
  const novel = await builder.build(opts.thread, opts.fast || !opts.chapter);
  const result = factory
    .get<NovelSummary>("novel")
    .save(novel)
    .config({
      short: false,
      chapters: opts.chapter,
      history: false,
      path: "",
      _format: true,
    })
    .build();
  LoggerService.console.log(result);
};

const __fetchPath = async (value: string, opts: { chapter: boolean; check: boolean; thread: number }) => {
  LoggerService.log(
    LOGGER_NOVEL_FETCHER,
    `fetch local novel at ${value} ${opts.chapter ? "with" : "without"} chapter list`,
  );

  config.set("novel.location", resolve(value));

  const location = config.get("novel.location");
  const system = new FileSystem(location || PathUtils.GetCurrentPath(), opts.thread);

  const resource = new Resource.File(system.directory);

  const novel = new Novel.Resource(resource);

  const formatter = FormatterFactory.Build().get<NovelSummary>("novel");
  let result = formatter
    .save(novel)
    .config({ chapters: opts.chapter, path: system.directory, short: true, _format: true, history: false })
    .build();

  LoggerService.console.log(result);

  if (opts.check) {
    const newNovel = await new NovelBuilder(novel.id).build(opts.thread);

    const historySummary = new HistorySummary();
    result = historySummary.save(Compare(novel, newNovel)).build();
    LoggerService.console.log(result);
  }
};

const __main: ICommandCallback = async ({ value, apis }) => {
  const { err } = await apis.verify.CheckAuthenication(config);
  if (err) throw err;

  const opts = {
    thread: apis.config.get<number>("novel.thread", 4),
    chapter: apis.config.get<boolean>("novel.chapter", false),
    fast: apis.config.get<boolean>("novel.fetch.fast", false),
    check: apis.config.get<boolean>("novel.fetch.check", false),
  };

  LoggerService.log(LOGGER_NOVEL_FETCHER, `start fetch with options %O`, opts);

  if (is.id(value)) await __fetchUrl(parseInt(value || "0", 10), opts);
  else if (is.path(value)) {
    if (!is.file(resolve(value || "", RESOURCE_FILENAME)))
      throw ExceptionService.build(ERR_CLI, "input must be valid nd novel directory");

    await __fetchPath(value || "", opts);
  } else throw ExceptionService.build(ERR_CLI, "cannot classify input; you must input either number or local path");
};

export default __main;
