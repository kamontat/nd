/* eslint-disable @typescript-eslint/no-explicit-any */

import { readFileSync as readFile } from "fs";
import LoggerService, { LOGGER_HELPER } from "@nd/logger";
import { sep } from "path";

type isfn = (n: any) => boolean;

const docatch = (fn: () => boolean) => {
  try {
    return fn();
  } catch (e) {
    LoggerService.log(LOGGER_HELPER, `something right happen: ${e}`);
    return false;
  }
};

const string: isfn = (n: any) => {
  const ans = n instanceof String || typeof n === "string";
  LoggerService.log(LOGGER_HELPER, `does ${n} is a string ? ${ans}`);
  return ans;
};

const undefine: isfn = (n: any) => {
  return docatch(
    () =>
      n === undefined || n === null || n.toString() === "undefined" || n.toString() === "null" || n.toString() === "",
  );
};

const exist: isfn = (n: any) => {
  if (undefine(n)) return false;
  if (typeof n === "object" && Object.keys(n).length <= 0) return false;

  return true;
};

const boolean: isfn = (n: any) => {
  return docatch(() => typeof n === "boolean" || n.toString() === "true" || n.toString() === "false");
};

const integer: isfn = (n: any) => {
  if (undefine(n)) return false;
  return docatch(() => /^\d+$/.test(n.toString()));
};

const decimal: isfn = (n: any) => {
  if (undefine(n)) return false;
  return docatch(() => /^\d+\.\d+$/.test(n.toString()));
};

const id: isfn = (n: any) => {
  return integer(n);
};

const url: isfn = (n: any) => {
  if (undefine(n)) return false;

  return docatch(() => new URL(n).protocol.startsWith("http"));
};

const path: isfn = (n: any) => {
  if (!string(n)) return false;
  if (url(n)) return false;

  if (docatch(() => new URL(n).protocol.startsWith("file"))) return true;

  const __arr = (n as string).match(sep);
  return (__arr && __arr.length > 0) || false;
};

const file: isfn = (n: any) => {
  if (!string(n)) return false;
  if (!path(n)) return false;

  return docatch(() => readFile(n).length > 0);
};

export const is = {
  exist,
  undefined: undefine,
  string,
  boolean,
  integer,
  decimal,
  id,
  url,
  path,
  file,
};
