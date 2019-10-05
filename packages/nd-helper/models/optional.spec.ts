import test from "ava";
import { Optional } from "./optional";

test("create with string data", t => {
  const o = Optional.of("string");
  t.is(o.or("default"), "string");
});

test("create with int data", t => {
  const o = Optional.of(20);
  t.is(o.or(0), 20);
});

test("create with bool data", t => {
  const o = Optional.of(false);
  t.is(o.or(true), false);
});
