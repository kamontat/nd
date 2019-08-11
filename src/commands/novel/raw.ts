import { ICommandCallback } from "nd-commandline-interpreter";
import { config } from "nd-config";
import FileManager from "nd-file";
import FormatterFactory, { NovelSummary } from "nd-formatter";
import { ArrayUtils, Optional, PathUtils } from "nd-helper";
import { HtmlGenerator, ITemplateObject } from "nd-html-generator";
import { TemplateType } from "nd-html-generator/loader";
import LoggerService, { LOGGER_CLI } from "nd-logger";
import { Chapter, ChapterStatus, Novel, NovelBuilder } from "nd-novel";
import { Security } from "nd-security";

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

  const id = parseInt(value || "", 10);
  const chapter = apis.config.get<string>("novel.chapter", "0");
  const chapters = ArrayUtils.BuildArray(chapter);

  const thread = apis.config.get<number>("novel.thread", 4);

  const replace = apis.config.get<boolean>("novel.replace", false);
  const change = apis.config.get<boolean>("novel.change", false);

  const location = config.get("novel.location");
  const fileManager = new FileManager(location || PathUtils.GetCurrentPath());

  LoggerService.log(LOGGER_CLI, `Start download as a raw chapter nid=${id} [${chapters}]`);

  const builder = new NovelBuilder(parseInt(value || "", 10));
  return builder.partialBuild(chapters, thread).then(novel => {
    const factory = FormatterFactory.Build();
    const result = factory
      .get<NovelSummary>("novel")
      .save(novel)
      .config({
        short: true,
        history: change,
        chapters: true,
        _format: true,
        path: fileManager.path,
      })
      .build();

    LoggerService.console.log(result);

    return new Promise<{ html: string; novel: Novel }>(res => {
      Array.from(novel.chapters).forEach(c => {
        if (c.status === ChapterStatus.COMPLETED) {
          const html = generateHtmlGeneratorConfig("default", "chapter", secure, novel, c);
          const name = `chapter-${c.cid}`;
          fileManager.save(html, `${name}.html`, { force: replace, tmp: PathUtils.Cachename(name, "f.html") });
        }
      });

      res();
    });
  }) as Promise<undefined>;
};

export default __main;
