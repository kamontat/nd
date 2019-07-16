import LoggerService, { LOGGER_NOVEL_BUILDER } from "nd-logger";

import { IParser } from "../../models/parser/IParser";

const HTML_BLACKLIST_TEXT = ["ads.dek-d.com", "min_t_comment", "Dek-D Writer APP", "BG&Picture"];

const ATTR_BLACKLIST: { key: string; value: string }[] = [
  { key: "id", value: "beacon_7169" },
  { key: "id", value: "floatboxstart" },
  { key: "id", value: "floatwriter" },
  { key: "id", value: "float_error" },
];

export default (parser: IParser<string, string | CheerioElement, Cheerio>) => {
  const result: string[] = [];

  parser
    .query("table#story_body")
    .children()
    .children()
    .children()
    .contents()
    .each((_, e) => {
      const query = parser.query(e);
      if (query.find("o\\:p").length > 0) {
        query
          .find("o\\:p")
          .children("p")
          .contents()
          .each((_, e) => {
            const query = parser.query(e);
            const text = query.text().trim();
            if (text !== "" && text !== "\n") {
              if (HTML_BLACKLIST_TEXT.filter(v => text.includes(v)).length < 1) {
                LoggerService.log(LOGGER_NOVEL_BUILDER, "chapter node become once: %O", text);
                result.push(text);
              }
            }
          });

        return;
      }

      const text = query.text().trim();
      if (text !== "" && text !== "\n") {
        if (HTML_BLACKLIST_TEXT.filter(v => text.includes(v)).length < 1) {
          LoggerService.log(LOGGER_NOVEL_BUILDER, "chapter node data: %O", text);
          result.push(text);
        }
      }
      return;
    });

  if (result.length > 0) return result;

  // -----------------------
  // version 2
  // -----------------------

  const text = parser
    .query("div#story-content")
    .contents()
    .first()
    .text()
    .trim();
  if (text) {
    LoggerService.log(LOGGER_NOVEL_BUILDER, "query first content: %O", text);
    result.push(text);
  }

  parser
    .query("div#story-content")
    .find("p")
    .each((_, e) => {
      const query = parser.query(e);
      const text = query.text().trim();
      if (text !== "") {
        LoggerService.log(LOGGER_NOVEL_BUILDER, "query p tag content: %O", text);
        result.push(text);
      }
    });

  parser
    .query("div#story-content")
    .find("div")
    .each((_, e) => {
      // filter unused element
      if (e.attribs) {
        if (
          ATTR_BLACKLIST.some(blacklist => {
            const attr = e.attribs[blacklist.key];
            return attr && attr.includes(blacklist.value);
          })
        ) {
          return;
        }
      }

      const query = parser.query(e);
      const text = query.text().trim();
      if (text !== "") {
        LoggerService.log(LOGGER_NOVEL_BUILDER, "query div tag content: %O", text);
        result.push(text);
      }
    });

  return result;
};
