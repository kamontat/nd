import { IParser } from "../../models/parser/IParser";
import { convertChapterDate } from "../date";

export default (parser: IParser<string, string, Cheerio>) => {
  let dateString = parser.query("font[style=font-size\\:9pt\\;color\\:\\#cdcdcd]").text();

  if (!dateString) {
    dateString = parser.query(parser.query(".timeupdate").get(0)).text();
  }

  return convertChapterDate(dateString);
};
