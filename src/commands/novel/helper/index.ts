import { config } from "nd-config";
import { Optional } from "nd-helper";
import { IConfigObject } from "nd-html-generator";
import { Chapter, Novel } from "nd-novel";
import { Security } from "nd-security";

export const htmlConfigBuilder = (type: "novel" | "chapter", secure: Security, novel: Novel, chapter?: Chapter) => {
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
      tags: novel.tags,
      updateat: novel.updateAt || 0,
      downloadat: novel.downloadAt || 0,
      chapters: Array.from(novel.chapters),
      abstract: novel.abstract,
    },
    contents: novel.content,
  } as IConfigObject;

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

  return htmlConfig;
};
