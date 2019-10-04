import LoggerService, { LOGGER_NOVEL_BUILDER } from "@nd/logger";

import { IParser } from "../../models/parser/IParser";
import { HtmlEntity, HtmlEntityType } from "@nd/content";

const HTML_BLACKLIST_TEXT = ["ads.dek-d.com", "min_t_comment", "Dek-D Writer APP", "BG&Picture"];

export default (parser: IParser<string, string | CheerioElement, Cheerio>) => {
  const result: HtmlEntity[] = [];

  parser
    .query(".prevent-user-select")
    .contents()
    .each((_, e) => {
      const text = parser
        .query(e)
        .text()
        .trim();

      if (text !== "" && text !== "\n") {
        if (HTML_BLACKLIST_TEXT.filter(v => text.includes(v)).length < 1) {
          LoggerService.log(LOGGER_NOVEL_BUILDER, "novel node data: %O", text);

          result.push(new HtmlEntity({ tag: HtmlEntityType.P, content: text }));
        }
      }
    });

  return result;
};
