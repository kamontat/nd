import test, { Macro } from "ava";
import randomUtils from "./random";

const macro: Macro<[number | undefined, number | undefined]> = (t, start, end) => {
  const num = randomUtils.RandomNumber({ start, end });
  if (start === undefined) start = 0;
  if (end === undefined) end = randomUtils.DefaultValue;

  // shuffle start and end if end less than start
  if (start > end) {
    const tmp = end;
    end = start;
    start = tmp;
  }

  t.assert(start <= num && num <= end, `random number as ${start} <= ${num} <= ${end}`);
};
macro.title = (_title = "", start, end) => `random number between ${start} - ${end}`;

test(macro, -2, -2);
test(macro, -2, -1);
test(macro, -2, 0);
test(macro, -2, 1);
test(macro, -2, 2);

test(macro, -1, -2);
test(macro, -1, -1);
test(macro, -1, 0);
test(macro, -1, 1);
test(macro, -1, 2);

test(macro, 0, -2);
test(macro, 0, -1);
test(macro, 0, 0);
test(macro, 0, 1);
test(macro, 0, 2);

test(macro, 1, -2);
test(macro, 1, -1);
test(macro, 1, 0);
test(macro, 1, 1);
test(macro, 1, 2);

test(macro, 2, -2);
test(macro, 2, -1);
test(macro, 2, 0);
test(macro, 2, 1);
test(macro, 2, 2);

test(macro, 1024, 512);
test(macro, 128, 256);

test(macro, -1024, -512);
test(macro, -128, -256);

test(macro, undefined, 20);
test(macro, 22, undefined);
test(macro, undefined, undefined);

const macro2: Macro<[number | undefined]> = (t, size) => {
  const str = randomUtils.RandomString(size);

  if (size === undefined) size = randomUtils.DefaultValue;
  size = Math.abs(size); // remove negative number
  t.assert(str.length === size, `string ${str} have size=${str.length} but we expected to be ${size}`);
};

macro2.title = (_title = "", size) => `random string size=${size}`;

test(macro2, undefined);
// test(macro2, null);

test(macro2, -2);
test(macro2, -1);
test(macro2, 0);
test(macro2, 1);
test(macro2, 2);
test(macro2, 3);

test(macro2, 10);
test(macro2, 20);
test(macro2, 30);
test(macro2, 100);
