import LoggerService, { LOGGER_NOVEL_BUILDER } from "nd-logger";

import { Chapter } from "../../models/novel/Chapter";
import { IParser } from "../../models/parser/IParser";

export default (parser: IParser<string, string, Cheerio>) => {
  const chapters: Array<Chapter> = [];

  parser.query("a[target=_blank]").each((_, e) => {
    const link = e.attribs.href;
    const title = e.attribs.title;
    if (link && link.includes("viewlong")) {
      const url = new URL(`http://${link}`);
      const chapter = new Chapter(
        parseInt(url.searchParams.get("id") || "", 10),
        parseInt(url.searchParams.get("chapter") || "", 10),
      );

      // preload title from title attribute
      if (title) {
        const title2 = title.replace("อ่าน ", "");

        LoggerService.log(
          LOGGER_NOVEL_BUILDER,
          `preload: chapter title of ${url.searchParams.get("chapter")} is ${title2}`,
        );
        chapter.name = title2;
      }

      chapters.push(chapter);
    }
  });
  return chapters;
};
