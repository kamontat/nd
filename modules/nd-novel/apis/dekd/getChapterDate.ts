import { Optional, TimeUtils } from "nd-helper";
import LoggerService, { LOGGER_NOVEL_BUILDER } from "nd-logger";

import { IParser } from "../../models/parser/IParser";

export default (parser: IParser<string, string, Cheerio>) => {
  let dateString = parser.query("font[style=font-size\\:9pt\\;color\\:\\#cdcdcd]").text();

  if (!dateString) {
    dateString = parser.query(parser.query(".timeupdate").get(0)).text();
  }

  const __arr = dateString.split(" ");
  if (!/\d+/.test(__arr[0])) __arr.shift();
  LoggerService.log(LOGGER_NOVEL_BUILDER, `chapter date string: %O`, __arr);

  const _date = Optional.of<string, number>(__arr[0])
    .transform(r => parseInt(r, 10))
    .or(1);
  const _month = TimeUtils.ConvertThaiMonth(__arr[1], "short");
  const _year = TimeUtils.ConvertThaiYear(__arr[2]);

  LoggerService.log(LOGGER_NOVEL_BUILDER, `chapter date _date_=${_date}`);
  LoggerService.log(LOGGER_NOVEL_BUILDER, `chapter date _month_=${_month}`);
  LoggerService.log(LOGGER_NOVEL_BUILDER, `chapter date _year_=${_year}`);

  return TimeUtils.BuildDate({
    year: _year,
    month: _month,
    date: _date,
  });
};
