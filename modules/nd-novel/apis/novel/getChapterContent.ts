import { IParser } from "../../models/parser/IParser";

export default (parser: IParser) => {
  return parser.query("p#big_text");
};
