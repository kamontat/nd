import test, { after, before, ExecutionContext } from "ava";
import Exception from "./Exception";
import { ERR_CLI, ERR_CFG, ERR_DBO } from "../constants";
import { fake, replace, SinonSpy, restore } from "sinon";
import { ExceptionState } from "./ExceptionState";
import { MessageType } from "./IExceptionState";
import ExceptionService from "./ExceptionService";

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

  t.regex(state.buildMessage(MessageType.ERROR), /error/, "should have word 'error' on the message");
  t.regex(state.buildMessage(MessageType.WARNING), /warning/, "should have word 'warning' on the message");
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
  const msg = "3187048293";
  const err = ExceptionService.build(ERR_DBO);
  const err2 = new Exception(ERR_DBO);

  t.is(err.name, err2.name, "result of ExceptionService and new Exception should be the same");
  t.not(err.stack, err2.stack);
});
