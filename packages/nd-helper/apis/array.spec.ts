import test, { Macro } from "ava";
import arrayUtils from "./array";

const macro: Macro<[string, number[], string]> = (t, input, expected, sexpected) => {
  const res = arrayUtils.BuildArray(input);
  t.is(res.length, expected.length, `The result array size must equal to ${expected.length} but we got:`);
  t.deepEqual(res, expected);

  const res2 = arrayUtils.ReadableArray(res);
  t.deepEqual(res2, sexpected);
};

macro.title = (_title = "", string, expected) =>
  `Build array from '${string}'; the result should return [${expected.join(", ")}] and convert back`;

test(macro, "1,2,3,4,5", [1, 2, 3, 4, 5], "1-5");
test(macro, "1-5", [1, 2, 3, 4, 5], "1-5");
test(macro, "1-5,9,10", [1, 2, 3, 4, 5, 9, 10], "1-5, 9-10");
test(
  macro,
  "1,3,4-10,15-20,25,26,30",
  [1, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20, 25, 26, 30],
  "1, 3-10, 15-20, 25-26, 30",
);

// invalided input
test(macro, "12,22,", [12, 22], "12, 22");
test(macro, "50,,", [50], "50");
test(macro, ",", [], "empty");
test(macro, "12--123", [], "empty");
test(macro, "abc", [], "empty");
test(macro, "abc-12", [], "empty");

// sorted array
test(macro, "5,3,1,8", [1, 3, 5, 8], "1, 3, 5, 8");

test("convert array of string to readable array, it should return normal array toString", t => {
  const array = ["123", "abc"];
  const str = arrayUtils.ReadableArray(array as any);
  t.deepEqual(str, "123, abc");
});

test("try to merging array of mix datatype", t => {
  const res = arrayUtils.MergeArrayObject([{ foo: "bar" }, { bar: "foofoo" }, 20 as any, "string" as any]);
  t.deepEqual(res, { foo: "bar", bar: "foofoo" });
});

test("merging array of object together", t => {
  const res = arrayUtils.MergeArrayObject([{ foo: "bar" }, { bar: "foofoo" }]);
  t.deepEqual(res, { foo: "bar", bar: "foofoo" });
});

test("merging array of object with replace if same key exist", t => {
  const res = arrayUtils.MergeArrayObject([{ foo: "bar" }, { bar: "foofoo" }, { fee: "ber" }, { bar: "new-bar" }]);
  t.deepEqual(res, { foo: "bar", bar: "new-bar", fee: "ber" });
});
