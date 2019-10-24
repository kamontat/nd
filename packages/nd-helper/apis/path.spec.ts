import test from "ava";
import { PathUtils } from "..";

test("get current absolute path", t => {
  t.regex(PathUtils.GetCurrentPath(), /\/nd/);
});

test("create tmp name", t => {
  const name = PathUtils.Tmpname(".hello");

  t.regex(name, new RegExp("hello$"));
  t.regex(name, new RegExp("[A-Za-z0-9]-[A-Za-z0-9]"));
  t.regex(name, new RegExp("^[0-9]+"));
});

test("create tmp name with empty random size", t => {
  const name = PathUtils.Tmpname(".hello", 0);

  t.regex(name, new RegExp("hello$"));
  t.notRegex(name, new RegExp("--"));
});

test("create tmp name with negative size", t => {
  const name = PathUtils.Tmpname(".hello", -12);

  t.regex(name, new RegExp("hello$"));
  t.notRegex(name, new RegExp("--"));
});

test("create cache name", t => {
  const name = PathUtils.Cachename("work.txt", ".backup");

  t.regex(name, new RegExp("^work\\.txt"));
  t.regex(name, new RegExp("[A-Za-z0-9]-[A-Za-z0-9]"));
  t.regex(name, new RegExp("backup$"));
});

test("create cache name without any random", t => {
  const name = PathUtils.Cachename("work.txt", "backup", 0);

  t.is(name, "work.txt-backup");
});

test("create cache file without any random", t => {
  const name = PathUtils.Cachefile("work.txt", ".backup", 0);

  t.regex(name, new RegExp("work\\.txt-f\\.backup"));
});
