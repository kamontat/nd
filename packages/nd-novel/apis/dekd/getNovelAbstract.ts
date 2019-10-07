import { Optional } from "@nd/helper";

import { IParser } from "../../models/parser/IParser";

export default (parser: IParser<string, string, Cheerio>) => {
  const header = parser
    .query("span.desc_head")
    .parent("td")
    .get(0);

  const optional = Optional.of<string>(
    parser
      .query(header)
      .text()
      .replace("แนะนำเรื่องแบบย่อๆ", ""),
  ).or(parser.query(".desc_sub").text());

  return optional;
};
