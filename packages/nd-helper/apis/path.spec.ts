import test from "ava";
import { PathUtils } from "..";

test("get current absolute path", t => {
  t.regex(PathUtils.GetCurrentPath(), /\/nd/);
});
