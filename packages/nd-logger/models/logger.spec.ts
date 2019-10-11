import test from "ava";
import Logger from "./Logger";

test("create logger", t => {
  const logger = new Logger("test");
  t.false(logger.enabled, "creating logger should be disable by default");
});

test("can append new namespace", t => {
  const logger = new Logger("hello:world");
  const logger2 = logger.extend("1");

  t.is(logger.namespace, "hello:world", "It should create new instance per logger namespace");
  t.is(logger2.namespace, "hello:world:1");
});
