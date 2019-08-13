import LoggerService, { LOGGER_NOVEL_BUILDER } from "nd-logger";

import { IParser } from "../../models/parser/IParser";

export default (parser: IParser<string, string, Cheerio>) => {
  // h2[@class="chaptername"]/text()
  let name = parser
    .query(".chaptername")
    .first()
    .text();

  LoggerService.log(LOGGER_NOVEL_BUILDER, `try to query chapter name: ${name}`);
  if (name && name !== "") {
    return name.replace(/^ตอนที่ \d+ : /, "");
  }

  const element = parser.query("h2[style=margin\\:0px\\;font-size\\:17px\\;color\\:\\#ffffff]");
  name = element.text();

  LoggerService.log(LOGGER_NOVEL_BUILDER, `try again with old website xpath: ${name}`);
  if (name && name !== "") {
    return name;
  }

  LoggerService.log(LOGGER_NOVEL_BUILDER, `cannot find any chapter name`);
  return "";
};
