import LoggerService, { LOGGER_NOVEL_BUILDER } from "nd-logger";

import { ChapterStatus } from "../../models/novel/ChapterStatus";
import { IParser } from "../../models/parser/IParser";

export default (parser: IParser<string, string, Cheerio>) => {
  if (parser.query(".chapter-metainfo-wrapper").find(".-hidden").length > 0) {
    LoggerService.log(LOGGER_NOVEL_BUILDER, `try to query chapter status: -hidden css class exist`);
    return ChapterStatus.CLOSED;
  }

  const cls = parser.query("#story-content").attr("class");
  LoggerService.log(LOGGER_NOVEL_BUILDER, `get story-content class: ${cls}`);

  if (cls !== undefined && cls !== null) {
    return cls.includes("selling-chapter") ? ChapterStatus.SOLD : ChapterStatus.COMPLETED;
  }

  // V1
  // FIXME: handle close novel in v1 website
  const text = parser
    .query("#story_body")
    .children("tbody")
    .children("tr")
    .children("td")
    .text();

  if (text) return ChapterStatus.COMPLETED;

  return ChapterStatus.UNKNOWN;
};
