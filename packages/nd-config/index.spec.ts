import test from "ava";
// NOTES: I get config object from node_modules because when yarn run the test if use compiled source code from node_modules so on runtime the Configuration will be different.
import { config } from "@nd/config";
import { Configuration } from "@nd/config/models/Configuration";

test("config object from @nd/config should be the same with Configuration CONST", t => {
  t.deepEqual(config, Configuration.CONST());
});
