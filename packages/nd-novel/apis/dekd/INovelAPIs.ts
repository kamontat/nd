import { Chapter } from "../../models/novel/Chapter";
import { ChapterStatus } from "../../models/novel/ChapterStatus";
import { IParser } from "../../models/parser/IParser";
import { HtmlEntity } from "@nd/content";

export interface INovelAPIs<K = string, R = string> {
  getChapterContent(parser: IParser<string, K, R>): HtmlEntity[];
  getChapterDate(parser: IParser<string, K, R>): Date;
  getChapterList(parser: IParser<string, K, R>): Chapter[];
  getChapterName(parser: IParser<string, K, R>): string;
  getChapterStatus(parser: IParser<string, K, R>): ChapterStatus;

  getNovelAbstract(parser: IParser<string, K, R>): string;
  getNovelContent(parser: IParser<string, K, R>): HtmlEntity[];
  getNovelDate(parser: IParser<string, K, R>): Date;
  getNovelName(parser: IParser<string, K, R>): string;

  isNovelExist(parser: IParser<string, K, R>): boolean;
}
