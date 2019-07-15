import { Chapter } from "../../models/novel/Chapter";
import { IParser } from "../../models/parser/IParser";

export default (_: IParser) => {
  return [new Chapter(), new Chapter(), new Chapter()];
};
