import ExceptionService, { ERR_NLV } from "nd-error";
import LoggerService, { LOGGER_NOVEL_BUILDER } from "nd-logger";

import { Novel as N } from "../../models/novel/Novel";

const canMergeString = (s?: string, ss?: string) => {
  if (s === undefined && ss !== undefined) return true;

  if (s === undefined && ss === undefined) return false; // noname all

  if (s !== undefined && ss === undefined) return false; // old have name; new didn't

  return s !== ss;
};

const canMergeNumber = (s?: number, ss?: number) => {
  if (s === undefined && ss !== undefined) return true;

  if (s === undefined && ss === undefined) return false; // noname all

  if (s !== undefined && ss === undefined) return false; // old have name; new didn't

  return s !== ss;
};

// can `ss` merge into `s`; ss => s
const canMergeArrayString = (s?: string[], ss?: string[]) => {
  if (s === undefined && ss !== undefined) return true;

  if (s === undefined && ss === undefined) return false; // noname all

  if (s !== undefined && ss === undefined) return false; // old have name; new didn't

  if (s !== undefined && ss !== undefined) return s.length !== ss.length;

  return false;
};

// base is a old novel from resource file
// diff is a new novel from current fetching
export default (resource: N, refresh: N) => {
  if (resource.id !== refresh.id) {
    LoggerService.warn(LOGGER_NOVEL_BUILDER, "cannot merge 2 difference novel id");
    return resource;
  }

  // if base version is latest version
  if ((resource.updateAt || 0) >= (refresh.updateAt || 0)) {
    throw ExceptionService.build(ERR_NLV, `nothing changes on novel ${resource.id} (${resource.name})`);
  }

  // merge all information
  if (canMergeString(resource.name, refresh.name)) resource.name = refresh.name;
  if (canMergeString(resource.author, refresh.author)) resource.author = refresh.author;
  if (canMergeArrayString(resource.tags, refresh.tags)) resource.setTag(refresh.tags);
  if (canMergeString(resource.abstract, refresh.abstract)) resource.abstract = refresh.abstract;
  if (canMergeNumber(resource.updateAt, refresh.updateAt)) resource.updateAt = refresh.updateAt;
  if (canMergeNumber(resource.downloadAt, refresh.downloadAt)) resource.downloadAt = refresh.downloadAt;

  const max = Math.max(refresh.size, resource.size);

  for (let i = 1; i <= max; i++) {
    const resourceChapter = resource.chapter(i);
    const refreshChapter = refresh.chapter(i);

    // new chapter occurred
    if (!resourceChapter && refreshChapter) resource.addChapter(refreshChapter.cid, refreshChapter);
    if (resourceChapter && !refreshChapter) resource.removeChapter(resourceChapter.cid); // NOTES: This might cause chapter missing when chapters list is not correct

    if (resourceChapter && refreshChapter) {
      // if base version is latest version
      if ((resource.updateAt || 0) < (refresh.updateAt || 0)) {
        resource.addChapter(refreshChapter.cid, refreshChapter); // replace new chapter result
      }
    }
  }

  return resource;
};
