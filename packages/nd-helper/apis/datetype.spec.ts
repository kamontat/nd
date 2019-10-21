import test, { Macro } from "ava";
import { is } from "./datetype";
import { resolve } from "path";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type isfn = (n: any) => boolean;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const macro: Macro<[isfn, any, boolean]> = (t, method, value, expected) => {
  const bool = method(value);
  t.is(bool, expected);
};
macro.title = (_title = "", fn, value, exp) =>
  `try to execute ${fn.name}(value=${JSON.stringify(value)}, type=${typeof value}) => ${exp}`;

test(macro, is.exist, "exist", true);
test(macro, is.exist, 0, true);
test(macro, is.exist, 20, true);
test(macro, is.exist, -99, true);
test(macro, is.exist, { value: true }, true);

test(macro, is.exist, "undefined", false);
test(macro, is.exist, "null", false);
test(macro, is.exist, undefined, false);
test(macro, is.exist, null, false);
test(macro, is.exist, {}, false);

test(macro, is.boolean, true, true);
test(macro, is.boolean, false, true);
test(macro, is.boolean, "true", true);
test(macro, is.boolean, "false", true);

test(macro, is.boolean, "abc", false);
test(macro, is.boolean, "1", false);
test(macro, is.boolean, "5", false);
test(macro, is.boolean, "-10", false);
test(macro, is.boolean, 2, false);
test(macro, is.boolean, 5, false);
test(macro, is.boolean, 0, false);
test(macro, is.boolean, 1, false);
test(macro, is.boolean, undefined, false);
test(macro, is.boolean, null, false);

test(macro, is.string, "string", true);
test(macro, is.string, "123", true);
test(macro, is.string, "false", true);

test(macro, is.string, undefined, false);
test(macro, is.string, null, false);
test(macro, is.string, -12, false);
test(macro, is.string, 21, false);
test(macro, is.string, false, false);

test(macro, is.integer, 0, true);
test(macro, is.integer, 1, true);
test(macro, is.integer, 2, true);
test(macro, is.integer, "0", true);
test(macro, is.integer, "1", true);
test(macro, is.integer, "2", true);
test(macro, is.integer, 120, true);
test(macro, is.integer, 612012, true);
test(macro, is.integer, 2590128409820398, true);
test(macro, is.integer, "123", true);
test(macro, is.integer, "2590128409820398", true);

test(macro, is.integer, 2.2, false);
test(macro, is.integer, 20012.20013, false);
test(macro, is.integer, -1, false);
test(macro, is.integer, -2, false);
test(macro, is.integer, true, false);
test(macro, is.integer, "2ba", false);
test(macro, is.integer, undefined, false);
test(macro, is.integer, null, false);

test(macro, is.decimal, 2.2, true);
test(macro, is.decimal, 1024.12, true);
test(macro, is.decimal, 2.00002, true);
test(macro, is.decimal, 20012.20013, true);

test(macro, is.decimal, -1, false);
test(macro, is.decimal, -2, false);
test(macro, is.decimal, true, false);
test(macro, is.decimal, "2ba", false);
test(macro, is.decimal, undefined, false);
test(macro, is.decimal, null, false);
test(macro, is.decimal, 0, false);
test(macro, is.decimal, 1, false);
test(macro, is.decimal, 2, false);
test(macro, is.decimal, "0", false);
test(macro, is.decimal, "1", false);
test(macro, is.decimal, "2", false);
test(macro, is.decimal, 120, false);
test(macro, is.decimal, 612012, false);
test(macro, is.decimal, 2590128409820398, false);

test(macro, is.id, "140111", true);
test(macro, is.id, "1020301", true);
test(macro, is.id, "94011221", true);

test(macro, is.id, "1022213a", false);
test(macro, is.id, "a123123", false);
test(macro, is.id, "https://google.com", false);

test(macro, is.url, "https://google.com", true);
test(macro, is.url, "https://facebook.com/abc/def", true);
test(macro, is.url, "http://example.com", true);

test(macro, is.url, "google.com", false);
test(macro, is.url, "https://", false);
test(macro, is.url, "http", false);
test(macro, is.url, "abc", false);
test(macro, is.url, undefined, false);
test(macro, is.url, null, false);

test(macro, is.path, "file:///Users/example/Desktop/hello", true);
test(macro, is.path, "/abc/def", true);
test(macro, is.path, "./xxx/com", true);

test(macro, is.path, "https://google.com", false);
test(macro, is.path, "https://facebook.com/abc/def", false);
test(macro, is.path, "http://example.com", false);
test(macro, is.path, "abc", false);
test(macro, is.path, undefined, false);
test(macro, is.path, null, false);

const resource = resolve("packages", "nd-helper", "apis", "__test__", "resources");

test(macro, is.file, resolve(resource, "hello.txt"), true);

test(macro, is.file, resolve(resource, "empty.txt"), false); // empty file content
test(macro, is.file, resolve(resource, "resource-not-exist.txt"), false);
test(macro, is.file, "https://google.com", false);
test(macro, is.file, undefined, false);
test(macro, is.file, null, false);
test(macro, is.file, 123, false);
