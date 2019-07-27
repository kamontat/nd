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

const __main: ICommandCallback = ({ value, apis }) => {
  const { err, secure } = apis.verify.CheckAuthenication(config);
  if (err) throw err;

  if (!apis.verify.IsNumber(value)) throw ExceptionService.build(ERR_NLV, "input must be id number");
  const replace = apis.config.get<boolean>("novel.replace", false);
  const change = apis.config.get<boolean>("novel.change", false);
  const thread = apis.config.get<number>("novel.thread", 4);

  const location = config.get("novel.location");
  const fileManager = new FileManager(location || PathUtils.GetCurrentPath());
  fileManager.onError("folder-not-empty", path => {
    ExceptionService.build(
      ERR_NLV,
      `Novel folder already exist!! you might want to ${Colorize.appname(Package.name)} ${Colorize.command(
        "update",
      )} "${Colorize.param(path || "")}" instead`,
    )
      .print(LOGGER_FILE)
      .exit();
  });

  LoggerService.log(LOGGER_CLI, `download ${value} (nid) to ${location} with replace=${replace},change=${change}`);

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
          chapter: apis.config.get<boolean>("novel.change", false),
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
      fileManager.save(html, `index.html`, { force: false });

      return new Promise<Novel>(res => res(novel));
    })
    .then(novel => {
      // const executor = fileManager.multithread(thread);
      // Array.from(novel.chapters).forEach(c => {
      //   if (c.status === ChapterStatus.COMPLETED) {
      //     const html = generateHtmlGeneratorConfig("default", "chapter", secure, novel, c);
      //     executor.add(html, `chapter-${c.cid}.html`);
      //   }
      // });
      // return executor.save({ force: true });

      // TODO: make it multithread
      return new Promise<{ html: string; novel: Novel }>(res => {
        Array.from(novel.chapters).forEach(c => {
          if (c.status === ChapterStatus.COMPLETED) {
            const html = generateHtmlGeneratorConfig("default", "chapter", secure, novel, c);
            fileManager.save(html, `chapter-${c.cid}.html`, { force: false });
          }
        });

        res();
      });
    }) as Promise<undefined>;
};

export default __main;
