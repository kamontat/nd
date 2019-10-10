import test from "ava";
import StringUtils from "./string";

test("padding to right of string", t => {
  const str = StringUtils.Padding("hello", 12);
  t.is(str, "hello       ");
});

test("padding to left of string", t => {
  const str = StringUtils.Padding("world", 7, { left: true });
  t.is(str, "  world");
});

test("add 0 to right of string", t => {
  const str = StringUtils.Padding("123", 5, { char: "0", left: true });
  t.is(str, "00123");
});
