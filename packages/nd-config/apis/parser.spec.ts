import test, { Macro } from "ava";
import { ConfigParser } from "./parser";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const macro: Macro<[any, { key: string; value: string }[] | undefined]> = (t, input, expected) => {
  const result = ConfigParser(input);

  if (expected === undefined) t.is(result, undefined);
  else if (result) {
    t.is(result.length, expected.length);
    result.forEach((o, i) => {
      const exp = expected[i];

      t.is(o.key, exp.key, "difference config key");
      t.is(o.value, exp.value, "difference config value");
    });
  } else t.fail(`cannot pass config value ${input}`);
};
macro.title = (_title = "", input) => `parse config of '${input}'`;

test(macro, "hello=true", [{ key: "hello", value: "true" }]);
test(macro, "hello=false,world=earth", [{ key: "hello", value: "false" }, { key: "world", value: "earth" }]);
test(macro, "hello=true # world=what-is-it", [{ key: "hello", value: "true" }]);
test(macro, "hello=true,#world=what-is-it", [{ key: "hello", value: "true" }]);

test(macro, undefined, undefined);
test(macro, null, undefined);
test(macro, "", undefined);
test(macro, "# this is a comment=true", undefined);
test(macro, "my=", undefined);
test(macro, "===", undefined);
