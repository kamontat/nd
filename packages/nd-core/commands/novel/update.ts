import { ICommandCallback } from "@nd/commandline-interpreter";
import { config } from "@nd/config";
import ExceptionService, { ERR_CLI } from "@nd/error";
import FileSystem, { FileAction } from "@nd/file";
import FormatterFactory, { NovelSummary } from "@nd/formatter";
import { is, PathUtils } from "@nd/helper";
import { Generator, TemplateType } from "@nd/html-generator";
import LoggerService, { LOGGER_NOVEL_DOWNLOADER, LOGGER_NOVEL_UPDATER } from "@nd/logger";
import { ChapterStatus, Novel, NovelBuilder } from "@nd/novel";
import { Resource, RESOURCE_FILENAME } from "@nd/resource";
import { resolve } from "path";

import { htmlConfigBuilder } from "./helper";

const __main: ICommandCallback = async ({ value, apis }) => {
  const { err, secure } = await apis.verify.CheckAuthenication(config);
  if (err) throw err;

  if (!is.path(value)) throw ExceptionService.build(ERR_CLI, "update parameter must be local path");
  if (!is.file(resolve(value || "", RESOURCE_FILENAME)))
    throw ExceptionService.build(ERR_CLI, "input must be valid nd novel directory");

  config.set("novel.location", resolve(value || ""));

  const location = config.get("novel.location");
  const opts = {
    dry: apis.config.get<boolean>("novel.update.dry", false), // dry run mean never save data to file system
    thread: apis.config.get<number>("novel.thread", 4), // thread number to fetch and update
    change: apis.config.get<boolean>("novel.change", false), // show updating changes
    replace: apis.config.get<boolean>("novel.replace", true), // replace=true mean replace without create tmp files; replace=false mean create tmp file before replace occurred
    recursive: apis.config.get<boolean>("novel.update.recusive", false), // recursive check subfolder
  };

  LoggerService.log(LOGGER_NOVEL_UPDATER, `start update novel with options %O`, opts);

  const system = new FileSystem(location || PathUtils.GetCurrentPath());

  const resource = new Resource.File(system.directory);
  const novel = new Novel.Resource(resource);

  const builder = new NovelBuilder(novel.id);
  const newNovel = await builder.update(novel, opts.thread);
  const result = FormatterFactory.Build()
    .get<NovelSummary>("novel")
    .save(newNovel)
    .config({
      short: true,
      history: opts.change,
      chapters: opts.dry,
      _format: true,
      path: system.directory,
    })
    .build();
  LoggerService.console.log(result);

  const generator = new Generator(htmlConfigBuilder("novel", secure, novel));

  // add index.html
  system.add("index", {
    action: FileAction.WRITE,
    name: "index.html",
    content: generator.load(TemplateType.Default),
    opts: { force: true, tmp: opts.replace ? undefined : PathUtils.Cachefile(`index.html`, ".bk", 0) },
  });

  // add chapter files
  Array.from(newNovel.chapters).forEach(c => {
    if (c.status === ChapterStatus.COMPLETED)
      system.add(`chapter${c.cid}`, {
        action: FileAction.WRITE,
        name: `chapter-${c.cid}.html`,
        content: generator.reset(htmlConfigBuilder("chapter", secure, novel, c)).load(TemplateType.Default),
        opts: { force: true, tmp: opts.replace ? undefined : PathUtils.Cachefile(`chapter-${c.cid}.html`, ".bk", 0) },
      });
    else LoggerService.warn(LOGGER_NOVEL_DOWNLOADER, `found chapter ${c.cid} status is not completed [${c.status}]`);
  });

  // add resource file
  const newResource = new Resource.Novel(newNovel);
  newResource.write(system, {
    force: true,
    tmp: opts.replace ? undefined : PathUtils.Cachefile(RESOURCE_FILENAME, ".bk", 0),
  });

  if (!opts.dry) await system.run();
};

export default __main;
