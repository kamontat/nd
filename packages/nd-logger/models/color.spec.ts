import test from "ava";
import Colorize from "./Colorize";

test("generated color string shouldn't same as normal string", t => {
  const str = "non-color";
  const color = Colorize.id(str);

  t.not(str, color);
});

test("generated color of boolean should be difference base on input", t => {
  const _true = Colorize.boolean(true);
  const _false = Colorize.boolean(false);

  t.not(_true, _false);
});

test("color boolean can input both string or boolean data type", t => {
  const _true = Colorize.boolean(true);
  const __true = Colorize.boolean("true");

  t.is(_true, __true);
});
