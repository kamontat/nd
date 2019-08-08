import path from "path";

import { RandomUtils } from "..";

export default {
  GetCurrentPath() {
    return process.cwd();
  },
  Tmpname(suffix?: string) {
    const _suffix = suffix || "tmp";
    return `${+new Date()}-${RandomUtils.RandomString(6)}-${_suffix}`;
  },
  Tmpdir(dirPath: string) {
    const root = path.dirname(dirPath);
    const name = this.Tmpname("d");
    return path.resolve(root, name);
  },
  Tmpfile(filePath: string, ext: string = ".tmp") {
    const root = path.dirname(filePath);
    const name = this.Tmpname("f");
    return path.resolve(root, `${name}${ext}`);
  },
  Cachename(name: string, suffix?: string) {
    const _suffix = suffix || "tmp";
    return `${name}-${RandomUtils.RandomString(3)}-${_suffix}`;
  },
  Cachedir(dirPath: string) {
    const root = path.dirname(dirPath);
    const name = this.Cachename(path.basename(dirPath), "d");
    return path.resolve(root, name);
  },
  Cachefile(filePath: string, ext: string = ".txt") {
    const root = path.dirname(filePath);
    const name = this.Cachename(path.basename(filePath), "d");
    return path.resolve(root, `${name}${ext}`);
  },
};
