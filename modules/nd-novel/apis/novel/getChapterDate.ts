import { IParser } from "../../models/parser/IParser";

export default (_: IParser) => {
  return new Date(); // parser.query("p#big_text");
};
