import LoggerService, { LOGGER_NOVEL_BUILDER } from "nd-logger";

import { IParser } from "../../models/parser/IParser";

export default (parser: IParser<string, string, Cheerio>) => {
  const result = parser.query("#writer-empty").is("div");
  LoggerService.log(LOGGER_NOVEL_BUILDER, `${result ? "novel is not exist" : "novel is exist"}`);
  return !result;
};
