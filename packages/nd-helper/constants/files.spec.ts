import test from "ava";
import { ND_TMP_LOCATION } from "./files";

test("root tmp folder must include nd name", t => {
  t.regex(ND_TMP_LOCATION, new RegExp("/.*nd.*"));
});
