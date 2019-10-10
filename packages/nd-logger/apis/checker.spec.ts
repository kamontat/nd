import test, { Macro } from "ava";
import Checker from "./checker";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const macro: Macro<[Function, any, any, boolean]> = (t, fn, v1, v2, expected) => {
  t.is(fn(v1, v2), expected);
};
macro.title = (title = "", fn, check, value, expected) =>
  `${title} ${fn.name} is ${check} is the same is ${value}(${typeof value}) and return should be ${expected}`;

test("1p.1", macro, Checker.CheckWithBoolean, true, true, true);
test("1p.2", macro, Checker.CheckWithBoolean, true, "true", true);
test("1p.3", macro, Checker.CheckWithBoolean, false, false, true);
test("1p.4", macro, Checker.CheckWithBoolean, false, "false", true);
test("1f.3", macro, Checker.CheckWithBoolean, false, 0, true);
test("1f.3", macro, Checker.CheckWithBoolean, true, 1, true);

test("1f.1", macro, Checker.CheckWithBoolean, true, false, false);
test("1f.1", macro, Checker.CheckWithBoolean, true, undefined, false);
test("1f.2", macro, Checker.CheckWithBoolean, true, "asdf", false);
test("1f.3", macro, Checker.CheckWithBoolean, true, 666, false);
test("1f.3", macro, Checker.CheckWithBoolean, true, -123, false);
test("1f.3", macro, Checker.CheckWithBoolean, undefined, "nooo", false);

test("2p.1", macro, Checker.CheckWithNumber, 1, 1, true);
test("2p.2", macro, Checker.CheckWithNumber, -2, -2, true);
test("2p.3", macro, Checker.CheckWithNumber, 0, 0, true);
test("2p.4", macro, Checker.CheckWithNumber, -9112, -9112, true);
test("2p.5", macro, Checker.CheckWithNumber, -1234, "-1234", true);

test("2f.1", macro, Checker.CheckWithNumber, 1, undefined, false);
test("2f.2", macro, Checker.CheckWithNumber, 1, true, false);
test("2f.3", macro, Checker.CheckWithNumber, 1, "hello world", false);

test("3p.1", macro, Checker.CheckWithString, "hello", "hello", true);
test("3p.2", macro, Checker.CheckWithString, "1", "1", true);
test("3p.3", macro, Checker.CheckWithString, "null", "null", true);
test("3p.4", macro, Checker.CheckWithString, "undefined", "undefined", true);
test("3p.5", macro, Checker.CheckWithString, "!#%!@#$", "!#%!@#$", true);

test("3f.1", macro, Checker.CheckWithString, "undefined", undefined, false);
test("3f.2", macro, Checker.CheckWithString, "null", null, false);
test("3f.3", macro, Checker.CheckWithString, "hello", 123, false);
test("3f.4", macro, Checker.CheckWithString, "hello", "Hello", false);
test("3f.5", macro, Checker.CheckWithString, "hello", true, false);
test("3f.6", macro, Checker.CheckWithString, "true", true, false);
test("3p.7", macro, Checker.CheckWithString, "!#%!@#$", "!#%!#$", false);
test("3p.7", macro, Checker.CheckWithString, "!#%!@# $", "!# %!# $", false);
