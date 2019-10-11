import test, { before, ExecutionContext } from "ava";
import LoggerService from "./index";
import LoggerMock from "../models/__test__/LoggerMock";
import sinon, { SinonStub } from "sinon";
import { config } from "@nd/config";

interface IContext {
  log: SinonStub;
  error: SinonStub;
}

type Execution = ExecutionContext<IContext>;

before(t => {
  (t as Execution).context.log = sinon.stub(console, "log");
  (t as Execution).context.error = sinon.stub(console, "error");
});

test("never print console by default", t => {
  const tt = t as Execution;

  LoggerService.console.log("print: hello, world");
  t.false(tt.context.log.called);
});

test("set log level to 1 and debug to console, should print console.log", t => {
  const tt = t as Execution;

  config.set("output.level", 1);
  LoggerService.level(1);

  LoggerService.console.log("print: hello, world");

  t.true(tt.context.log.called, "console.log should called");
  t.true(tt.context.error.notCalled, "console.error never has to call");

  tt.context.log.reset();
});

test("set log level in config to zero will print nothing", t => {
  const tt = t as Execution;

  config.set("output.level", 1);
  LoggerService.level(1);

  LoggerService.console.log("first time");

  t.is(tt.context.log.callCount, 1, "console.log should called once");

  config.set("output.level", "0");

  LoggerService.console.log("second called");
  t.is(tt.context.log.callCount, 1, "console.log should called only once");

  tt.context.log.reset();
});

test("print to stdout", t => {
  const fn = sinon.fake();
  t.false(fn.called, "never call console.log before");

  const mock = new LoggerMock((e, f) => {
    if (e === "stderr") t.fail("it should print to stdout, not stderr");
    if (e === "debug") fn(f);
  });

  LoggerService.log(mock, "hello, world");

  t.true(fn.called);
  t.true(fn.calledOnce);

  t.deepEqual(fn.firstCall.args, ["hello, world"]);
});

test("print to stderr", t => {
  const fn = sinon.fake();
  t.false(fn.called, "never call console.log before");

  const mock = new LoggerMock((e, f) => {
    if (e === "stdlog") t.fail("it should print to stderr, not stdout");
    if (e === "debug") fn(f);
  });

  LoggerService.error(mock, "hello, world");

  t.true(fn.called);
  t.true(fn.calledOnce);

  t.deepEqual(fn.firstCall.args, ["hello, world"]);
});
