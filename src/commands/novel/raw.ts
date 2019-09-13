import { ICommandCallback } from "nd-commandline-interpreter";
import { config } from "nd-config";
import ExceptionService, { ERR_NLV } from "nd-error";
import FileSystem, { FileAction } from "nd-file";
import FormatterFactory, { NovelSummary } from "nd-formatter";
import { ArrayUtils, is, PathUtils } from "nd-helper";
import { TemplateType } from "nd-html-generator";
import { Generator } from "nd-html-generator";
import LoggerService, { LOGGER_CLI, LOGGER_NOVEL_DOWNLOADER } from "nd-logger";
import { ChapterStatus, NovelBuilder } from "nd-novel";

import { htmlConfigBuilder } from "./helper";

const __main: ICommandCallback = async ({ value, apis }) => {
  const { err, secure } = await apis.verify.CheckAuthenication(config);
  if (err) throw err;

  if (!is.id(value)) throw ExceptionService.build(ERR_NLV, `you pass ${value} instead of novel id`);

  const id = parseInt(value || "", 10);
  const showChapter = apis.config.get<boolean>("novel.chapter", false);
  const chapter = apis.config.get<string>("novel.chapters", "0");

  const chapters = ArrayUtils.BuildArray(chapter);

  const thread = apis.config.get<number>("novel.thread", 4);

  const replace = apis.config.get<boolean>("novel.replace", false);
  const change = apis.config.get<boolean>("novel.change", false);

  const location = config.get("novel.location");
  const system = new FileSystem(location || PathUtils.GetCurrentPath(), thread);

  const factory = FormatterFactory.Build();

  LoggerService.log(
    LOGGER_CLI,
    `start download ${value} (nid) raw chapters [${chapters}] to ${location} with replace=${replace},change=${change},chapter=${chapters},thread=${thread}`,
  );

  const builder = new NovelBuilder(parseInt(value || "", 10));

  const novel = await builder.partialBuild(chapters, thread);
  const result = factory
    .get<NovelSummary>("novel")
    .save(novel)
    .config({
      short: true,
      history: change,
      chapters: showChapter,
      _format: true,
      path: system.directory,
    })
    .build();
  LoggerService.console.log(result);

  const generator = new Generator(htmlConfigBuilder("novel", secure, novel));

  Array.from(novel.chapters).forEach(c => {
    if (c.status === ChapterStatus.COMPLETED)
      system.add(`chapter${c.cid}`, {
        action: FileAction.WRITE,
        name: `chapter-${c.cid}.html`,
        content: generator.reset(htmlConfigBuilder("chapter", secure, novel, c)).load(TemplateType.Default),
        opts: { force: replace, tmp: PathUtils.Cachename(name, "f.html") },
      });
    else LoggerService.warn(LOGGER_NOVEL_DOWNLOADER, `found chapter ${c.cid} status is not completed [${c.status}]`);
  });

  await system.run();
  return undefined;
};

export default __main;
