import getChapterContent from "./getChapterContent";
import getChapterDate from "./getChapterDate";
import getChapterList from "./getChapterList";
import getChapterName from "./getChapterName";
import getChapterStatus from "./getChapterStatus";
import getNovelAbstract from "./getNovelAbstract";
import getNovelContent from "./getNovelContent";
import getNovelDate from "./getNovelDate";
import getNovelName from "./getNovelName";
import { INovelAPIs } from "./INovelAPIs";
import isNovelExist from "./isNovelExist";

export const NovelAPIs: INovelAPIs<any, Cheerio> = {
  getChapterContent,
  getChapterDate,
  getChapterList,
  getChapterName,
  getChapterStatus,
  getNovelAbstract,
  getNovelContent,
  getNovelDate,
  getNovelName,
  isNovelExist,
};
