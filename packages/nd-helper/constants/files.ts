import { resolve } from "path";

import PathUtils from "../apis/path";

declare var __COMPILE_DATE__: string;

export const ND_TMP_LOCATION = resolve(`/tmp`, `nd-${__COMPILE_DATE__}`);

// ------------

export const TMP_DIRECTORY = resolve(ND_TMP_LOCATION, PathUtils.Cachename("tmp", "d", 4));

export const TMPA_PATH = PathUtils.Tmpfile(TMP_DIRECTORY, ".tmpa");
export const TMPB_PATH = PathUtils.Tmpfile(TMP_DIRECTORY, ".tmpb");

// ------------

export const LOG_DIRECTORY = resolve(ND_TMP_LOCATION, PathUtils.Cachename("log", "d", 4));

export const LOG_PATH = PathUtils.Tmpfile(LOG_DIRECTORY, ".log");
export const WARN_PATH = PathUtils.Tmpfile(LOG_DIRECTORY, ".warn");
export const ERROR_PATH = PathUtils.Tmpfile(LOG_DIRECTORY, ".error");
