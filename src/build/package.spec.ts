import test from "ava";
import { Package } from "./Package";

test("get package.json of root command", t => {
  t.is(Package.name, "nd");
});
