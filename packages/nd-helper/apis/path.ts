import path from "path";

import { RandomUtils } from "..";

export default {
  GetCurrentPath() {
    return process.cwd();
  },
  Tmpname(suffix?: string, size: number = 6) {
    const _suffix = suffix || "tmp";
    return `${+new Date()}-${RandomUtils.RandomString(size)}-${_suffix}`;
  },
  Tmpdir(dirPath: string, size: number = 6) {
    const root = path.dirname(dirPath);
    const name = this.Tmpname("d", size);
    return path.resolve(root, name);
  },
  Tmpfile(filePath: string, ext: string = ".tmp", size: number = 6) {
    const root = path.dirname(filePath);
    const name = this.Tmpname("f", size);
    return path.resolve(root, `${name}${ext}`);
  },
  Cachename(name: string, suffix?: string, size: number = 3) {
    const _suffix = suffix || "tmp";
    return `${name}-${RandomUtils.RandomString(size)}-${_suffix}`;
  },
  Cachedir(dirPath: string, size: number = 3) {
    const root = path.dirname(dirPath);
    const name = this.Cachename(path.basename(dirPath), "d", size);
    return path.resolve(root, name);
  },
  Cachefile(filePath: string, ext: string = ".txt", size: number = 3) {
    const root = path.dirname(filePath);
    const name = this.Cachename(path.basename(filePath), "f", size);
    return path.resolve(root, `${name}${ext}`);
  },
};
