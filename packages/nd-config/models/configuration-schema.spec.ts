import test, { Macro, ExecutionContext } from "ava";
import { DoValidation } from "./ConfigurationSchema";
import Exception from "@nd/error/models/Exception";
import { StringUtils } from "@nd/helper";

type CheckFn = (
  t: ExecutionContext<unknown>,
  result: {
    err?: Error;
    value?: unknown;
  },
) => void;

// I create function as this name because it more readable in string
// eslint-disable-next-line @typescript-eslint/camelcase
const is_invalid: CheckFn = (t, result) => {
  t.is(result.value, undefined);
  t.not(result.err, undefined);
};

// I create function as this name because it more readable in string
// eslint-disable-next-line @typescript-eslint/camelcase
const is_valid: CheckFn = (t, result) => {
  t.is(result.err, undefined);
  t.not(result.value, undefined);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const macro: Macro<[string, any, Function, Function | undefined]> = (t, key, value, fn, extra) => {
  const result = DoValidation(key, value);
  fn(t, result);
  if (extra) extra(t, result);
};
macro.title = (_title = "", k, v, fn) =>
  `pass '${StringUtils.Padding(k, 30)}' config when value is '${StringUtils.Padding(
    v,
    10,
  )}' (type=${StringUtils.Padding(typeof v, 10)}) ${fn.name}`;

test(macro, "output.color", undefined, is_invalid, undefined);
test(macro, "output.color", null, is_invalid, undefined);
test(macro, "output.color", "undefined", is_invalid, undefined);
test(macro, "output.color", "", is_invalid, undefined);

test(macro, "command.version.detail.limit", "abc", is_invalid, undefined);

test(macro, "invalid key", "hello", is_invalid, undefined);

test(macro, "version", "v123", is_invalid, ((t, r) =>
  t.regex((r.err as Exception).message, new RegExp("configuration need type"))) as CheckFn);

test(macro, "auth.token", 123, is_invalid, ((t, r) =>
  t.regex((r.err as Exception).message, new RegExp("123 instead"))) as CheckFn);

test(macro, "version", "v1", is_valid, ((t, r) => t.is(r.value, "v1")) as CheckFn);
test(macro, "auth.salt", "asdf", is_valid, ((t, r) => t.is(r.value, "asdf")) as CheckFn);
test(macro, "command.version.detail.limit", "2", is_valid, ((t, r) => t.is(r.value, 2)) as CheckFn);

test(macro, "output.color", "1", is_valid, ((t, r) => t.is(r.value, true)) as CheckFn);
test(macro, "output.color", "true", is_valid, ((t, r) => t.is(r.value, true)) as CheckFn);
test(macro, "output.color", 1, is_valid, ((t, r) => t.is(r.value, true)) as CheckFn);
test(macro, "output.color", true, is_valid, ((t, r) => t.is(r.value, true)) as CheckFn);
test(macro, "output.color", false, is_valid, ((t, r) => t.is(r.value, false)) as CheckFn);
