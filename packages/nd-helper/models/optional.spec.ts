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

test("create with undefined data", t => {
  const o = Optional.of<string>(undefined);
  t.is(o.or("exist"), "exist");
});

test("create with null data", t => {
  const o = Optional.of<string>(null);
  t.is(o.or("no-null"), "no-null");
});

test("create number with null data is least than 0; input 0, return 0", t => {
  const o = Optional.of<number>(0, v => Optional.isNull(v) && v! < 0);
  t.is(o.or(1), 0);
});

test("create number with null data is least than 0; input 3, return 3", t => {
  const o = Optional.of<number>(3, v => Optional.isNull(v) && v! < 0);
  t.is(o.or(-5), 3);
});

test("create number with null data is least than 0; input -2, return default #1", t => {
  const o = Optional.of<number>(-2, v => Optional.isNull(v) || v! < 0);
  t.is(o.or(12), 12);
});

test("create number with null data is least than 0; input -2, return default #2", t => {
  const o = Optional.of<number>(-2, v => Optional.isNull(v) || v! < 0);
  t.is(o.or(-5), -5);
});

test("create number with null data is least than 0; input undefined, return default", t => {
  const o = Optional.of<number>(undefined, v => Optional.isNull(v) || v! < 0);
  t.is(o.or(51), 51);
});

test("create number with null data is least than 0; input null, return default", t => {
  const o = Optional.of<number>(null, v => Optional.isNull(v) || v! < 0);
  t.is(o.or(20), 20);
});

test("create value optional and transform", t => {
  const o = Optional.of<string>("hello, world");
  t.is(o.transform(t => t.toUpperCase()).or("Noooo~"), "HELLO, WORLD");
});

test("create undefined optional and transform", t => {
  const o = Optional.of<string>(undefined);
  t.is(o.transform(t => t.toUpperCase()).or("Yes"), "Yes");
});
