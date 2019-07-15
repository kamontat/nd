import getChapterContent from "./getChapterContent";
import getChapterDate from "./getChapterDate";
import getChapterList from "./getChapterList";
import getChapterName from "./getChapterName";
import getNovelAbstract from "./getNovelAbstract";
import getNovelContent from "./getNovelContent";
import getNovelDate from "./getNovelDate";
import getNovelName from "./getNovelName";
import { INovelAPIs } from "./INovelAPIs";

export const NovelAPIs: INovelAPIs = {
  getChapterContent,
  getChapterDate,
  getChapterList,
  getChapterName,
  getNovelAbstract,
  getNovelContent,
  getNovelDate,
  getNovelName,
};
