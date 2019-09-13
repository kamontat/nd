import ExceptionService, { ERR_NLV } from "nd-error";
import LoggerService, { LOGGER_NOVEL_BUILDER } from "nd-logger";

import { History } from "../models/history/History";
import { HistoryEvent } from "../models/history/HistoryEvent";
import { ChapterStatus } from "../models/novel/ChapterStatus";
import { Novel as N } from "../models/novel/Novel";

const canMergeString = (s?: string, ss?: string) => {
  if (s === undefined && ss === undefined) return false; // noname all
  if (s !== undefined && ss === undefined) return false; // old have name; new didn't

  return s !== ss;
};

const canMergeNumber = (s?: number, ss?: number) => {
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

const changesString = (s?: string, ss?: string) => {
  return s !== ss;
};

const changesNumber = (s?: number, ss?: number) => {
  return s !== ss;
};

// can `ss` merge into `s`; ss => s
const changesArrayString = (s?: string[], ss?: string[]) => {
  if (s !== undefined && ss !== undefined) return s.length !== ss.length;
  return !(s === undefined && ss === undefined);
};

// base is a old novel from resource file
// diff is a new novel from current fetching
export const Merge = (resource: N, refresh: N) => {
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
      if ((resourceChapter.updateAt || 0) < (refreshChapter.updateAt || 0)) {
        if (refreshChapter.status === ChapterStatus.COMPLETED)
          // replace new chapter result
          resource.addChapter(refreshChapter.cid, refreshChapter);
      }
    }
  }

  return resource;
};

export const Compare = (resource: N, refresh: N) => {
  if (resource.id !== refresh.id) {
    LoggerService.warn(LOGGER_NOVEL_BUILDER, "cannot merge 2 difference novel id");
    return resource;
  }

  const event = new HistoryEvent();
  const history = new History();
  history.addEvent(event);

  // if base version is latest version
  if ((resource.updateAt || 0) === (refresh.updateAt || 0)) {
    return history;
  }

  // compare all information changes
  if (changesString(resource.name, refresh.name))
    event.classify("Novel name", { before: resource.name, after: refresh.name });
  if (changesString(resource.author, refresh.author))
    event.classify("Novel author", { before: resource.author, after: refresh.author });
  if (changesArrayString(resource.tags, refresh.tags))
    event.classify("Novel tags", { before: resource.tags, after: refresh.tags });
  if (changesString(resource.abstract, refresh.abstract))
    event.classify("Novel abstract", { before: resource.abstract, after: refresh.abstract });
  if (changesNumber(resource.updateAt, refresh.updateAt))
    event.classify("Novel update at", { before: resource.updateAt, after: refresh.updateAt });

  // NOTES: this might not neccessary because I always be present
  if (changesNumber(resource.downloadAt, refresh.downloadAt))
    event.classify("Novel download at", { before: resource.downloadAt, after: refresh.downloadAt });

  const max = Math.max(refresh.size, resource.size);
  for (let i = 1; i <= max; i++) {
    const resourceChapter = resource.chapter(i);
    const refreshChapter = refresh.chapter(i);

    // new chapter occurred
    if (!resourceChapter && refreshChapter) event.emit("added", "Chapter", refreshChapter);
    if (resourceChapter && !refreshChapter) event.emit("deleted", "Chapter", resourceChapter);

    if (resourceChapter && refreshChapter) {
      // if base version is latest version
      if ((resourceChapter.updateAt || 0) < (refresh.updateAt || 0)) {
        // compare all chapter information changes
        if (changesString(resourceChapter.name, refreshChapter.name))
          event.classify("Chapter name", { before: resourceChapter.name, after: refreshChapter.name });
        if (changesString(resourceChapter.status, refreshChapter.status))
          event.classify("Chapter status", { before: resourceChapter.status, after: refreshChapter.status });
        if (changesNumber(resourceChapter.updateAt, refreshChapter.updateAt))
          event.classify("Chapter update at", { before: resourceChapter.updateAt, after: refreshChapter.updateAt });
        if (changesNumber(resourceChapter.downloadAt, refreshChapter.downloadAt))
          event.classify("Chapter download at", {
            before: resourceChapter.downloadAt,
            after: refreshChapter.downloadAt,
          });
      }
    }
  }

  return history;
};
