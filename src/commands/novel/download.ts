import { ICommandCallback } from "nd-commandline-interpreter";
import { config } from "nd-config";
import ExceptionService, { ERR_CLI, ERR_NLV } from "nd-error";
import FileSystem, { FileAction, FileLoadResult, FileType } from "nd-file";
import FormatterFactory, { NovelSummary } from "nd-formatter";
import { PathUtils } from "nd-helper";
import { Generator, TemplateType } from "nd-html-generator";
import LoggerService, { Colorize, LOGGER_CLI, LOGGER_FILE, LOGGER_NOVEL_DOWNLOADER } from "nd-logger";
import { ChapterStatus, NovelBuilder } from "nd-novel";
import { Resource } from "nd-resource";
import { join } from "path";

import { Package } from "../../build/Package";

import { htmlConfigBuilder } from "./helper";

const __main: ICommandCallback = async ({ value, apis }) => {
  // -------------------------------------
  // Verify authenication and parameters
  // -------------------------------------

  const { err, secure } = await apis.verify.CheckAuthenication(config);
  if (err) throw err;

  if (!apis.verify.IsNumber(value)) throw ExceptionService.build(ERR_CLI, `you pass ${value} instead of novel id`);

  // -------------------------------------
  // Get option configuration
  // -------------------------------------

  const replace = apis.config.get<boolean>("novel.replace", false);
  const change = apis.config.get<boolean>("novel.change", false);
  const chapters = apis.config.get<boolean>("novel.chapter", false);

  const thread = apis.config.get<number>("novel.thread", 4);

  const location = config.get("novel.location");

  LoggerService.log(
    LOGGER_CLI,
    `start download ${value} (nid) to ${location} with replace=${replace},change=${change},chapter=${chapters},thread=${thread}`,
  );

  // -------------------------------------
  // Variable defined
  // -------------------------------------

  const system = new FileSystem(location || PathUtils.GetCurrentPath(), thread);

  const builder = new NovelBuilder(parseInt(value || "", 10));

  const factory = FormatterFactory.Build();

  // -------------------------------------
  // Build novel object
  // -------------------------------------

  const novel = await builder.build(thread);

  // Show novel result
  const result = factory
    .get<NovelSummary>("novel")
    .save(novel)
    .config({
      short: true,
      history: change,
      chapters,
      _format: true,
      path: system.directory,
    })
    .build();
  LoggerService.console.log(result);

  // -------------------------------------
  // Start create novel directory
  // -------------------------------------

  LoggerService.log(LOGGER_FILE, "start create novel directory and files");

  const novelPath = join(system.directory, novel.normalizeName);
  const loading = await system.append(
    { name: novel.normalizeName, type: FileType.DIR },
    { create: true, tmp: PathUtils.Cachename(novel.normalizeName, "d") },
  );

  LoggerService.log(LOGGER_FILE, "created novel directory");

  if (loading === FileLoadResult.NotEmp) {
    ExceptionService.build(
      ERR_NLV,
      `Novel folder already exist!! you might want to ${Colorize.appname(Package.name)} ${Colorize.command(
        "update",
      )} "${Colorize.param(novelPath)}" or replace by add ${Colorize.option("--replace")}`,
    )
      .print(LOGGER_FILE)
      .exit();
  }

  LoggerService.log(LOGGER_CLI, `Loading novel directory to file system result is ${loading}`);

  // -------------------------------------
  // Generate HTML message
  // -------------------------------------

  const generator = new Generator(htmlConfigBuilder("novel", secure, novel));

  // generate html
  const content = generator.load(TemplateType.Default);

  // add index.html file
  system.add("index", { action: FileAction.WRITE, name: "index.html", content, opts: { force: false } });

  // add resource file
  const resource = new Resource.Novel(novel);
  resource.write(system);

  // loop add chapters
  Array.from(novel.chapters).forEach(c => {
    if (c.status === ChapterStatus.COMPLETED)
      system.add(`chapter${c.cid}`, {
        action: FileAction.WRITE,
        name: `chapter-${c.cid}.html`,
        content: generator.reset(htmlConfigBuilder("chapter", secure, novel, c)).load(TemplateType.Default),
        opts: { force: false },
      });
    else LoggerService.warn(LOGGER_NOVEL_DOWNLOADER, `found chapter ${c.cid} status is not completed [${c.status}]`);
  });

  // Start write message to file system
  await system.run();
  return undefined;
};

export default __main;
