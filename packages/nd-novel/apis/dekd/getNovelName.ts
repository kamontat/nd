import LoggerService, { LOGGER_NOVEL_BUILDER } from "nd-logger";

import { IParser } from "../../models/parser/IParser";

export default (parser: IParser<string, string, Cheerio>) => {
  let name = parser.query("p#big_text").text();
  LoggerService.log(LOGGER_NOVEL_BUILDER, `try to query novel name: ${name}`);

  if (!name || name === "") {
    name = parser.query(".novel-name").text();
    LoggerService.log(LOGGER_NOVEL_BUILDER, `try again: ${name}`);
  }

  if (!name || name === "") {
    // //td[@class="head1"]/h1/text()
    name = parser.query("td.head1").text();
    LoggerService.log(LOGGER_NOVEL_BUILDER, `try again: ${name}`);
  }

  return name.trim();
};
