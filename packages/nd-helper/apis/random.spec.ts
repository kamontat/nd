import test, { Macro } from "ava";
import randomUtils from "./random";

const macro: Macro<[number, number]> = (t, start, end) => {
  const num = randomUtils.RandomNumber({ start, end });
  // shuffle start and end if end less than start
  if (start > end) {
    const tmp = end;
    end = start;
    start = tmp;
  }

  t.assert(start <= num && num <= end, `random number as ${start} <= ${num} <= ${end}`);
};
macro.title = (_title = "", start, end) => `random number between ${start} - ${end}`;

test(macro, 1, 2);
test(macro, 0, 1);
test(macro, 0, 0);
test(macro, -2, 0);

test(macro, -1024, -512);
test(macro, 100, 500);
test(macro, 120, 550);
test(macro, 200, 200);

test(macro, 100, 50);
test(macro, -128, -256);
test(macro, -500, -1200);
test(macro, -2000, -5);
