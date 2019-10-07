import { Optional, TimeUtils } from "@nd/helper";
import LoggerService, { LOGGER_NOVEL_BUILDER } from "@nd/logger";

import { IParser } from "../../models/parser/IParser";

export default (parser: IParser<string, string, Cheerio>) => {
  let dateString = parser
    .query(".writer-section-head")
    .find("span")
    .text()
    .replace("อัพเดท ", "")
    .trim();

  LoggerService.log(LOGGER_NOVEL_BUILDER, `try to get novel date: ${dateString}`);

  // second try
  if (dateString === undefined || dateString === null || dateString === "") {
    dateString = parser
      .query(".head2")
      .children("font[color=#896700]")
      .first()
      .text()
      .replace("-  อัพเดท", "")
      .trim();

    // 19 ต.ค. 47 / 07:55
    LoggerService.log(LOGGER_NOVEL_BUILDER, `try again: ${dateString}`);
  }
  const __arr = dateString.split(" ");
  const _date = Optional.of<string, number>(__arr[0])
    .transform(r => parseInt(r, 10))
    .or(1);
  const _month = TimeUtils.ConvertThaiMonth(__arr[1], "short");
  const _year = TimeUtils.ConvertThaiYear(__arr[2]);
  const __time = __arr[4].split(":");
  const _hour = Optional.of<string, number>(__time[0])
    .transform(r => parseInt(r, 10))
    .or(1);
  const _minute = Optional.of<string, number>(__time[1])
    .transform(r => parseInt(r, 10))
    .or(1);

  LoggerService.log(LOGGER_NOVEL_BUILDER, `novel date _date_=${_date}`);
  LoggerService.log(LOGGER_NOVEL_BUILDER, `novel date _month_=${_month}`);
  LoggerService.log(LOGGER_NOVEL_BUILDER, `novel date _year_=${_year}`);
  LoggerService.log(LOGGER_NOVEL_BUILDER, `novel date _hour_=${_hour}`);
  LoggerService.log(LOGGER_NOVEL_BUILDER, `novel date _minute_=${_minute}`);

  return TimeUtils.BuildDate({
    year: _year,
    month: _month,
    date: _date,
    hour: _hour,
    minute: _minute,
  });
};
