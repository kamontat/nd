import { ICommandCallback } from "nd-commandline-interpreter";
import FormatterFactory, { NovelSummary } from "nd-formatter";
import LoggerService, { LOGGER_NOVEL_FETCHER } from "nd-logger";
import { NovelBuilder } from "nd-novel";

const __fetch_url = (value: number, opts: { chapter: boolean; thread: number }) => {
  LoggerService.log(LOGGER_NOVEL_FETCHER, `get url/id as parameter; ${value}`);

  const builder = new NovelBuilder(value);
  return builder.build(opts.thread).then(novel => {
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
  LoggerService.log(LOGGER_NOVEL_FETCHER, `get path as parameter; ${value}`);
  LoggerService.log(LOGGER_NOVEL_FETCHER, `Options: %O`, opts);
};

const __main: ICommandCallback = async ({ value, apis }) => {
  const thread = apis.config.get<number>("novel.thread", 4);
  const chapter = apis.config.get<boolean>("novel.chapter", false);

  LoggerService.log(LOGGER_NOVEL_FETCHER, `start fetch with options thread=${thread},chapter=${chapter}`);

  if (apis.verify.IsNumber(value)) await __fetch_url(parseInt(value || "0"), { thread, chapter });
  else await __fetch_path(value || "", { thread, chapter });
};

export default __main;
