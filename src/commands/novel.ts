import { Command, Commandline, ICommandCallback, IOptionable, Option, SubCommand } from "nd-commandline-interpreter";
import { IConfiguration } from "nd-config";
import ExceptionService, { ERR_NLV } from "nd-error";
import FileManager from "nd-file";
import FormatterFactory, { NovelSummary } from "nd-formatter";
import { Optional, PathUtils } from "nd-helper";
import { HtmlGenerator, ITemplateObject } from "nd-html-generator";
import { TemplateType } from "nd-html-generator/loader";
import LoggerService, { LOGGER_CLI } from "nd-logger";
import { Chapter, ChapterStatus, Novel, NovelBuilder } from "nd-novel";
import { Package as SecurityPackage, Security } from "nd-security";

import { Package } from "../build/Package";

export default (cli: Commandline, config: IConfiguration) => {
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

  const downloadOption = <T extends IOptionable>(opt: T) => {
    opt
      .option(
        Option.build("location", true, ({ value }) => {
          LoggerService.log(LOGGER_CLI, `downloading location is ${value}`);
          config.set("novel.location", value);
        }),
      )
      .option(Option.build("replace", false, ({ apis }) => apis.config.set("novel.replace", true)))
      .option(Option.build("change", false, ({ apis }) => apis.config.set("novel.change", true)));

    return opt;
  };

  const downloadCallback: ICommandCallback = ({ value, apis }) => {
    const { err, secure } = apis.verify.CheckAuthenication(config);
    if (err) throw err;

    if (!apis.verify.IsNumber(value)) throw ExceptionService.build(ERR_NLV, "input must be id number");
    const replace = apis.config.get<boolean>("novel.replace", false);
    const change = apis.config.get<boolean>("novel.change", false);
    const location = config.get("novel.location");
    const fileManager = new FileManager(location || PathUtils.GetCurrentPath());

    LoggerService.log(LOGGER_CLI, `download ${value} (nid) to ${location} with replace=${replace},change=${change}`);

    const builder = new NovelBuilder(parseInt(value || "", 10));
    return builder
      .build()
      .then(novel => {
        const factory = FormatterFactory.Build();
        factory.set("novel", new NovelSummary());

        const result = factory
          .get<NovelSummary>("novel")
          .save(novel)
          .config({ short: true, chapter: apis.config.get<boolean>("novel.change", false), _format: true })
          .build();
        LoggerService.console.log(result);

        fileManager.name(novel.normalizeName);

        return new Promise<{ html: string; novel: Novel }>(res => {
          const html = generateHtmlGeneratorConfig("default", "novel", secure, novel);
          res({ novel, html });
        });
      })
      .then(({ html, novel }) => {
        fileManager.save(html, `index.html`, { force: true });

        return new Promise<Novel>(res => res(novel));
      })
      .then(novel => {
        // TODO: make it multithread
        return new Promise<{ html: string; novel: Novel }>(res => {
          Array.from(novel.chapters).forEach(c => {
            if (c.status === ChapterStatus.COMPLETED) {
              const html = generateHtmlGeneratorConfig("default", "chapter", secure, novel, c);
              fileManager.save(html, `chapter-${c.cid}.html`, { force: true });
            }
          });

          res();
        });
      }) as Promise<undefined>;
  };

  const rawDownloadOption = <T extends IOptionable>(opt: T) => {
    opt
      .option(
        Option.build("location", true, ({ value }) => {
          LoggerService.log(LOGGER_CLI, `downloading location is ${value}`);
          config.set("novel.location", value);
        }),
      )
      .option(Option.build("replace", false, ({ apis }) => apis.config.set("novel.replace", true)))
      .option(Option.build("change", false, ({ apis }) => apis.config.set("novel.change", true)));

    return opt;
  };

  const rawDownloadCallback: ICommandCallback = ({ value }) => {
    LoggerService.log(LOGGER_CLI, `start download raw novel... ${value}`);
  };

  /**
   * Command setup
   */

  downloadOption(cli).callback(downloadCallback);

  cli.command(
    downloadOption(
      Command.build("novel", true, downloadCallback)
        .sub(downloadOption(SubCommand.build("download", true, downloadCallback)))
        .sub(rawDownloadOption(SubCommand.build("raw", true, rawDownloadCallback))),
    ),
  );

  cli.command(rawDownloadOption(Command.build("raw", true, rawDownloadCallback)));

  // cli.command(
  //   Command.build("novel", true, async ({ value }) => {
  //     LoggerService.log(LOGGER_CLI, `start default novel command with ${value}`);

  //     const manager = new DownloadManager<number>();
  //     manager.event.on("downloading", (prev, curr) => {
  //       // console.log(totalMS);
  //       LoggerService.log(LOGGER_DOWNLOADER, `download size is ${byteToSize(prev + curr, " ")}`);
  //     });

  //     manager.event.on("downloaded", (r, progress, total) => {
  //       // r.result = "FUCK YOU"; // can be update !!
  //       LoggerService.log(LOGGER_DOWNLOADER, `completed ${r.link} ${progress}/${total}`);
  //     });

  //     manager.add("https://writer.dek-d.com/story/writer/view.php?id=123123", "/tmp/dek-d-123123.html");
  //     // manager.add("https://writer.dek-d.com/story/writer/view.php?id=1881939", "/tmp/dek-d-1881939.html");
  //     // manager.add("https://writer.dek-d.com/story/writer/view.php?id=1322476", "/tmp/dek-d-1322476.html");
  //     // manager.add("https://writer.dek-d.com/story/writer/view.php?id=1950088", "/tmp/dek-d-1950088.html");
  //     // manager.add("https://writer.dek-d.com/story/writer/view.php?id=1957491", "/tmp/dek-d-1957491.html");
  //     // manager.add("https://writer.dek-d.com/story/writer/view.php?id=1854069", "/tmp/dek-d-1854069.html");
  //     // manager.add("https://writer.dek-d.com/story/writer/view.php?id=1959477", "/tmp/dek-d-1959477.html");
  //     // manager.add("https://writer.dek-d.com/story/writer/view.php?id=1977407", "/tmp/dek-d-1977407.html");

  //     // manager.add("https://google.com", "/tmp/google-1.html");
  //     // manager.add("https://google.com", "/tmp/google-1.html");
  //     // manager.add("https://google.com", "/tmp/google-1.html");

  //     // manager.build(r => {
  //     //   const newResp = r.copy<number>();
  //     //   newResp.result = 12;
  //     //   return newResp;
  //     // });

  //     return manager.run().then(r => {
  //       LoggerService.log(LOGGER_CLI, r[0].result);
  //     });
  //   }),
  // );
};
