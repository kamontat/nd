import test from "ava";
import { ConfigParser } from "./parser";

test("parse undefined and null", t => {
  const result = ConfigParser();
  t.falsy(result);
});
