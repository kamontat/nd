import LoggerService, { LOGGER_NOVEL_BUILDER } from "nd-logger";

import { Chapter } from "../../models/novel/Chapter";
import { IParser } from "../../models/parser/IParser";

export default (parser: IParser<string, string, Cheerio>) => {
  const chapters: Array<Chapter> = [];

  parser.query("a[target=_blank]").each((_, e) => {
    const link = e.attribs.href;
    if (link && link.includes("viewlong")) {
      const url = new URL(`http://${link}`);
      chapters.push(
        new Chapter(parseInt(url.searchParams.get("id") || "", 10), parseInt(url.searchParams.get("chapter") || "", 10)),
      );
    }
  });
  return chapters;
};
