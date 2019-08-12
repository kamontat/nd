import { ICommandCallback } from "nd-commandline-interpreter";
import { config } from "nd-config";
import ExceptionService, { ERR_NLV } from "nd-error";
import FileManager from "nd-file";
import FormatterFactory, { NovelSummary } from "nd-formatter";
import { Optional, PathUtils } from "nd-helper";
import { HtmlGenerator, ITemplateObject } from "nd-html-generator";
import { TemplateType } from "nd-html-generator/loader";
import LoggerService, { Colorize, LOGGER_CLI, LOGGER_FILE } from "nd-logger";
import { Chapter, ChapterStatus, Novel, NovelBuilder } from "nd-novel";
import { ResourceBuilder } from "nd-resource";
import { Security } from "nd-security";

import { Package } from "../../build/Package";

const generateHtmlGeneratorConfig = (
  template: TemplateType,
  type: "novel" | "chapter",
  secure: Security,
  novel: Novel,
  chapter?: Chapter,
) => {
  const htmlConfig = {
    auth: {
      username: Optional.of<any, string>(secure.response)
        .transform(r => r.username)
        .or(""),
      name: config.get("auth.name") as string,
      expireat: Optional.of<any, number>(secure.response)
        .transform(r => r.expire)
        .or(0),
      issueat: Optional.of<any, number>(secure.response)
        .transform(r => r.issue)
        .or(0),
    },
    novel: {
      id: novel.id,
      size: novel.size,
      title: novel.name || "",
      description: novel.abstract || "",
      link: novel.link.href,
      author: novel.author || "",
      tags: novel.tags.join(","),
      updateat: novel.updateAt || 0,
      downloadat: novel.downloadAt || 0,
      chapters: Array.from(novel.chapters),
      abstract: novel.abstract,
    },
    contents: novel.content,
  } as ITemplateObject;

  if (type === "chapter" && chapter) {
    const prev = novel.chapter(chapter.cid - 1);
    const next = novel.chapter(chapter.cid + 1);

    htmlConfig.contents = chapter.content;
    htmlConfig.chapter = {
      nid: chapter.nid,
      cid: chapter.cid,
      name: chapter.name || "",
      link: chapter.link.href,
      updateat: chapter.updateAt || 0,
      downloadat: chapter.downloadAt || 0,
      status: chapter.status,
    };

    if (htmlConfig.chapter && prev)
      htmlConfig.chapter.prev = {
        cid: prev.cid,
        link: prev.link.href,
        status: prev.status,
      };

    if (htmlConfig.chapter && next)
      htmlConfig.chapter.next = {
        cid: next.cid,
        link: next.link.href,
        status: next.status,
      };
  }

  return HtmlGenerator(template, htmlConfig);
};

const __main: ICommandCallback = async ({ value, apis }) => {
  const { err, secure } = await apis.verify.CheckAuthenication(config);
  if (err) throw err;

  if (!apis.verify.IsNumber(value)) throw ExceptionService.build(ERR_NLV, "input must be id number");
  const replace = apis.config.get<boolean>("novel.replace", false);
  const change = apis.config.get<boolean>("novel.change", false);
  const chapters = apis.config.get<boolean>("novel.chapter", false);

  const thread = apis.config.get<number>("novel.thread", 4);

  const location = config.get("novel.location");
  const fileManager = new FileManager(location || PathUtils.GetCurrentPath(), undefined, thread);

  fileManager.onError("folder-not-empty", ({ path, again }) => {
    if (replace) {
      const newPath = PathUtils.Cachedir(path);
      fileManager.moveSync(path, newPath);
      LoggerService.console.log(
        `${Colorize.path(path)} had been rename to ${Colorize.path(newPath)} as a caching directory`,
      );
      return again && again();
    }

    ExceptionService.build(
      ERR_NLV,
      `Novel folder already exist!! you might want to ${Colorize.appname(Package.name)} ${Colorize.command(
        "update",
      )} "${Colorize.param(path || "")}" or replace by add ${Colorize.option("--replace")}`,
    )
      .print(LOGGER_FILE)
      .exit();
  });

  LoggerService.log(
    LOGGER_CLI,
    `download ${value} (nid) to ${location} with replace=${replace},change=${change},chapter=${chapters},thread=${thread}`,
  );

  const builder = new NovelBuilder(parseInt(value || "", 10));
  return builder
    .build(thread)
    .then(novel => {
      fileManager.name(novel.normalizeName);

      const factory = FormatterFactory.Build();
      const result = factory
        .get<NovelSummary>("novel")
        .save(novel)
        .config({
          short: true,
          history: change,
          chapters,
          _format: true,
          path: fileManager.path,
        })
        .build();

      LoggerService.console.log(result);

      return new Promise<{ html: string; novel: Novel }>(res => {
        const html = generateHtmlGeneratorConfig("default", "novel", secure, novel);
        res({ novel, html });
      });
    })
    .then(({ html, novel }) => {
      return fileManager.save(html, `index.html`, { force: false }).then(() => {
        return new Promise<Novel>(res => res(novel));
      });
    })
    .then(novel => {
      const resource = new ResourceBuilder.Novel(novel).build();

      // chapter file
      Array.from(novel.chapters).forEach(c => {
        if (c.status === ChapterStatus.COMPLETED) {
          const html = generateHtmlGeneratorConfig("default", "chapter", secure, novel, c);
          fileManager.add({ content: html, filename: `chapter-${c.cid}.html`, opts: { force: false } });
        }
      });
      // TODO: resource file
      fileManager.add({ content: resource.save(), filename: resource.filename(), opts: { force: false } });

      return fileManager.run();
    }) as Promise<undefined>;
};

export default __main;
