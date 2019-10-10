import test, { after, before, ExecutionContext } from "ava";
import Exception from "./Exception";
import { ERR_CLI, ERR_CFG, ERR_DBO, ERR_HLP, ERR_DWL, ERR_GNL, ERR_SCT, ERR_LOG } from "../constants";
import { fake, replace, SinonSpy, restore } from "sinon";
import { ExceptionState } from "./ExceptionState";
import { MessageType } from "./IExceptionState";
import ExceptionService from "./ExceptionService";
import LoggerMock from "@nd/logger/models/__test__/LoggerMock";

interface IContext {
  exit: SinonSpy<[number], never>;
}

type Execution = ExecutionContext<IContext>;

before(t => {
  const exit: SinonSpy<[number], never> = fake() as any;
  replace(process, "exit", exit);
  (t as Execution).context.exit = exit;
});

after(() => {
  restore();
});

test("can get code and name of ExceptionState", t => {
  const code = "UKN";
  const name = "Unknown error for testing";
  const state = new ExceptionState(code, name);

  t.is(state.code, code);
  t.is(state.name, name);
});

test("can build error message from ExceptionState", t => {
  const name = "Custom error for testing";
  const state = new ExceptionState("UKN2", name);

  t.regex(state.buildMessage(MessageType.ERROR), new RegExp(`.*(${name}).*`));
});

test("can override error message when build in ExceptionState", t => {
  const name = "Custom error for testing";
  const state = new ExceptionState("UKN2", name);

  t.notRegex(state.buildMessage(MessageType.ERROR, "OVERRIDE"), new RegExp(`.*(${name}).*`));
});

test("build message in Exception should prefix with message type", t => {
  const state = new ExceptionState("UKN3", "Custom message");

  t.regex(state.buildMessage(MessageType.ERROR), /Error/, "should have word 'error' on the message");
  t.regex(state.buildMessage(MessageType.WARNING), /Warn/, "should have word 'warning' on the message");
});

test("exit method will exit with default code", t => {
  const err = new Exception(ERR_CLI);
  err.exit();

  t.is((t as Execution).context.exit.called, true);
  t.true((t as Execution).context.exit.calledWith(1), `exit code should be the same as parameters (1)`);
});

test("exit method will exit with provided code", t => {
  const exitcode = 5;

  const err = new Exception(ERR_CLI);
  err.exit(exitcode);

  t.is((t as Execution).context.exit.called, true);
  t.true(
    (t as Execution).context.exit.calledWith(exitcode),
    `exit code should be the same as parameters (${exitcode})`,
  );
});

test("exception can custom message by constructor parameters", t => {
  const msg = "59123112";
  const err = new Exception(ERR_CFG, msg);

  t.regex(err.message, new RegExp(`.*(${msg}).*`));
});

test("exception can custom message by object method", t => {
  const msg = "3187048293";
  const err = new Exception(ERR_CFG);

  t.regex(err.description(msg).message, new RegExp(`.*(${msg}).*`));
});

test("create exception via service", t => {
  const err = ExceptionService.build(ERR_DBO);
  const err2 = new Exception(ERR_DBO);

  t.is(err.name, err2.name, "result of ExceptionService and new Exception should be the same");
  t.not(err.stack, err2.stack, "since we create exception difference ways, stack shouldn't be the same either");
});

test("cast error to exception", t => {
  const err = new Error("What is happen");
  const exp = ExceptionService.cast(err);

  t.regex(exp.message, new RegExp(err.message));
});

test("cast error to exception with custom state", t => {
  const err = new Error("custom state");
  const exp = ExceptionService.cast(err, { base: ERR_CLI });

  t.regex(exp.message, new RegExp(ERR_CLI.code));
});

test("cast error to exception with warning", t => {
  const err = new Error("warning...");
  const exp = ExceptionService.warn.cast(err, { base: ERR_CLI });

  t.true(exp.isWarn);
});

test("cast exception to exception", t => {
  const exp = ExceptionService.build(ERR_HLP, "custom");
  const exp2 = ExceptionService.cast(exp);

  t.false(exp2.isWarn);
  t.not(exp, exp2);
});

test("create warn exception with exception service", t => {
  const exp = ExceptionService.warn.build(ERR_HLP);

  t.regex(exp.message, new RegExp("Warn"));
});

test("create warn, it shouldn't exit program", t => {
  const context = (t as Execution).context;
  const exp = ExceptionService.warn.build(ERR_HLP);
  exp.exit(123);

  t.false(context.exit.calledWith(123));
  t.regex(exp.message, new RegExp("Warn"));
});

test("print the exception via logger object", t => {
  const logger = new LoggerMock((e, _, a) => {
    if (e === "stdlog") t.fail("print in exception should go to stdout");
    if (typeof a === "object") {
      const str = a.toString();
      if (str.includes("custom message") && str.includes("Error")) return t.pass();
    }
  });

  ExceptionService.build(ERR_DWL, "custom message").print(logger);
});

test("print warning the exception via logger object", t => {
  const logger = new LoggerMock((e, _, a) => {
    if (e === "stderr") t.fail("warning should print to stdout");
    if (typeof a === "object") {
      const str = a.toString();
      if (str.includes("custom message") && str.includes("Warn")) return t.pass();
    }
  });

  ExceptionService.warn.build(ERR_DWL, "custom message").print(logger);
});

test("exception id should be unique base on object instance", t => {
  const e1 = ExceptionService.build(ERR_GNL);
  const e2 = ExceptionService.build(ERR_SCT);
  const e3 = ExceptionService.build(ERR_LOG);

  t.not(e1.id, e2.id);
  t.not(e2.id, e3.id);
  t.not(e1.id, e3.id);
});
