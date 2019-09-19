import path from "path";

import { RandomUtils } from "..";

export default {
  GetCurrentPath() {
    return process.cwd();
  },
  /**
   * This method is for generate temporary name formatting
   *
   * @param suffix suffix after random string generated (default is tmp)
   * @param size size of random string in result
   *
   * @returns tmpname - The result will be in {timestamp}-{random(size)}-{suffix} format
   */
  Tmpname(suffix?: string, size: number = 6) {
    const _suffix = suffix || "tmp";
    return `${+new Date()}-${RandomUtils.RandomString(size)}-${_suffix}`;
  },
  /**
   * This will use for create temporary directory at specify location
   *
   * @param filePath directory path (should be absolute path)
   * @param size size of random string in result
   *
   * @see Tmpname - I use this method to generate Tmpname
   */
  Tmpdir(dirPath: string, size: number = 6) {
    const root = path.dirname(dirPath);
    const name = this.Tmpname("d", size);
    return path.resolve(root, name);
  },
  /**
   * This will use for create temporary file at specify location
   *
   * @param dirPath directory path (should be absolute path)
   * @param ext extension to append to file (default is .tmp)
   * @param size size of random string in result
   *
   * @see Tmpname - I use this method to generate Tmpname
   */
  Tmpfile(dirPath: string, ext: string = ".tmp", size: number = 6) {
    const name = this.Tmpname("f", size);
    return path.resolve(dirPath, `${name}${ext}`);
  },
  /**
   * This should be use for create caches name, basically this will append something on the input name
   *
   * @param name prefix (usually this should be filename)
   * @param suffix suffix (default is tmp)
   * @param size size of random string in result
   *
   * @returns cache - The result string will be on {name}-{random(size)}-{suffix} format
   */
  Cachename(name: string, suffix?: string, size: number = 3) {
    const _suffix = suffix || "tmp";
    return `${name}-${RandomUtils.RandomString(size)}-${_suffix}`;
  },
  /**
   * This will use for create cache directory at specify location
   *
   * @param dirPath directory path (should be absolute path)
   * @param size size of random string in result
   */
  Cachedir(dirPath: string, size: number = 3) {
    const root = path.dirname(dirPath);
    const name = this.Cachename(path.basename(dirPath), "d", size);
    return path.resolve(root, name);
  },
  /**
   * This will use for create cache file at specify location
   *
   * @param dirPath file path (should be absolute path)
   * @param ext file extension (default is .txt)
   * @param size size of random string in result
   */
  Cachefile(filePath: string, ext: string = ".txt", size: number = 3) {
    const root = path.dirname(filePath);
    const name = this.Cachename(path.basename(filePath), "f", size);
    return path.resolve(root, `${name}${ext}`);
  },
};
