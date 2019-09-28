import { TimeUtils } from "@nd/helper";
import LoggerService, { LOGGER_NOVEL_BUILDER } from "@nd/logger";

import { Chapter } from "../../models/novel/Chapter";
import { IParser } from "../../models/parser/IParser";
import { convertChapterDate } from "../date";

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

      // preload title from title attribute for v2
      if (title) {
        const title2 = title.replace("อ่าน ", "");

        LoggerService.log(
          LOGGER_NOVEL_BUILDER,
          `preload: chapter title of ${url.searchParams.get("chapter")} is ${title2}`,
        );
        // name
        chapter.name = title2;
      }

      // preload update at
      const span = e.prev.prev;
      if (span && span.tagName === "span") {
        const title = span.attribs.title;
        if (title.includes("อัพเดทล่าสุด")) {
          const dateString = title.replace("อัพเดทล่าสุด ", "");
          LoggerService.log(
            LOGGER_NOVEL_BUILDER,
            `preload: chapter updated ${url.searchParams.get("chapter")} date is ${dateString}`,
          );

          const date = convertChapterDate(dateString);
          chapter.updateAt = TimeUtils.GetTimestamp(date);
        }
      }

      LoggerService.log(LOGGER_NOVEL_BUILDER, `receive ${chapter.cid} from <a> tag`);
      chapters.push(chapter);
    }
  });

  return chapters;
};
