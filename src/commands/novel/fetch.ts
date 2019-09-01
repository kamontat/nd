import { ICommandCallback } from "nd-commandline-interpreter";
import { config } from "nd-config";
import ExceptionService, { ERR_CLI } from "nd-error";
import FileSystem from "nd-file";
import FormatterFactory, { NovelSummary } from "nd-formatter";
import { PathUtils } from "nd-helper";
import LoggerService, { LOGGER_NOVEL_FETCHER } from "nd-logger";
import { Novel } from "nd-novel";
import { NovelBuilder } from "nd-novel";
import { Resource, RESOURCE_FILENAME } from "nd-resource";
import { resolve } from "path";

const __fetch_url = async (value: number, opts: { chapter: boolean; fast: boolean; thread: number }) => {
  LoggerService.log(LOGGER_NOVEL_FETCHER, `get url/id as parameter; ${value}`);

  const factory = FormatterFactory.Build();
  const builder = new NovelBuilder(value);

  const novel = await builder.build(opts.thread, opts.fast);
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

const __fetch_path = async (value: string, opts: { chapter: boolean; thread: number }) => {
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
  const result = formatter
    .save(novel)
    .config({ chapters: opts.chapter, path: system.directory, short: true, _format: true, history: false })
    .build();

  LoggerService.console.log(result);
};

const __main: ICommandCallback = async ({ value, apis }) => {
  const { err } = await apis.verify.CheckAuthenication(config);
  if (err) throw err;

  const thread = apis.config.get<number>("novel.thread", 4);
  const chapter = apis.config.get<boolean>("novel.chapter", false);
  const fast = apis.config.get<boolean>("fetch.fast", false);

  LoggerService.log(LOGGER_NOVEL_FETCHER, `start fetch with options thread=${thread},chapter=${chapter},fast=${fast}`);

  if (apis.verify.IsNumber(value)) await __fetch_url(parseInt(value || "0"), { thread, chapter, fast });
  else if (apis.verify.IsPath(value)) {
    if (!apis.verify.IsFileExist(value, RESOURCE_FILENAME))
      throw ExceptionService.build(ERR_CLI, "input must be valid nd novel directory");

    await __fetch_path(value || "", { thread, chapter });
  } else throw ExceptionService.build(ERR_CLI, "cannot classify input; you must input either number or local path");
};

export default __main;
