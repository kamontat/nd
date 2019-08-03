import path from "path";

import { RandomUtils } from "..";

export default {
  GetCurrentPath() {
    return process.cwd();
  },
  Tmpdir(dirPath: string) {
    const root = path.dirname(dirPath);
    const name = `${+new Date()}-${RandomUtils.RandomString(6)}-d`;
    return path.resolve(root, name);
  },
  Tmpfile(filePath: string, ext: string = ".tmp") {
    const root = path.dirname(filePath);
    const name = `${+new Date()}-${RandomUtils.RandomString(6)}-d`;
    return path.resolve(root, `${name}${ext}`);
  },
  Cachedir(dirPath: string) {
    const root = path.dirname(dirPath);
    const name = `${path.basename(dirPath)}-${RandomUtils.RandomString(3)}-d`;
    return path.resolve(root, name);
  },
  Cachefile(filePath: string, ext: string = ".txt") {
    const root = path.dirname(filePath);
    const name = `${path.basename(filePath)}-${RandomUtils.RandomString(3)}-d`;
    return path.resolve(root, `${name}${ext}`);
  },
};
