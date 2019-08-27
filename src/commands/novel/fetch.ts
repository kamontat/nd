import { ICommandCallback } from "nd-commandline-interpreter";
import { config } from "nd-config";
import { DeprecateFileManager } from "nd-file";
import FormatterFactory, { NovelSummary } from "nd-formatter";
import { PathUtils } from "nd-helper";
import LoggerService, { LOGGER_NOVEL_FETCHER } from "nd-logger";
import { Novel } from "nd-novel";
import { NovelBuilder } from "nd-novel";
import { Resource } from "nd-resource";

const __fetch_url = (value: number, opts: { chapter: boolean; fast: boolean; thread: number }) => {
  LoggerService.log(LOGGER_NOVEL_FETCHER, `get url/id as parameter; ${value}`);

  const builder = new NovelBuilder(value);
  return builder.build(opts.thread, opts.fast).then(novel => {
    const result = FormatterFactory.Build()
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

    return new Promise(res => res());
  });
};

const __fetch_path = async (value: string, opts: { chapter: boolean; thread: number }) => {
  config.set("novel.location", value);

  const location = config.get("novel.location");
  const fileManager = new DeprecateFileManager.write(location || PathUtils.GetCurrentPath(), undefined, opts.thread);

  LoggerService.log(LOGGER_NOVEL_FETCHER, `get path as parameter; ${value}`);
  LoggerService.log(LOGGER_NOVEL_FETCHER, `Options: %O`, opts);

  const resource = new Resource.File(fileManager.system.directory);
  const novel = new Novel.Resource(resource);

  const format = FormatterFactory.Build().get<NovelSummary>("novel");
  const result = format
    .save(novel)
    .config({ chapters: opts.chapter, path: fileManager.system.directory, short: true, _format: true, history: false })
    .build();

  LoggerService.console.log(result);
};

const __main: ICommandCallback = async ({ value, apis }) => {
  const thread = apis.config.get<number>("novel.thread", 4);
  const chapter = apis.config.get<boolean>("novel.chapter", false);
  const fast = apis.config.get<boolean>("fetch.fast", false);

  LoggerService.log(LOGGER_NOVEL_FETCHER, `start fetch with options thread=${thread},chapter=${chapter},fast=${fast}`);

  if (apis.verify.IsNumber(value)) await __fetch_url(parseInt(value || "0"), { thread, chapter, fast });
  else await __fetch_path(value || "", { thread, chapter });
};

export default __main;
