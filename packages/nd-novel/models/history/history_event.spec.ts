import test, { Macro } from "ava";
import { HistoryEvent, EventType } from "./HistoryEvent";
import { RandomUtils } from "@nd/helper";

const random = (size = 20) => RandomUtils.RandomString(size);
const macro: Macro<[{ before: any; after: any }, EventType | undefined]> = (t, obj, type) => {
  t.plan(1);

  const title = random();
  const event = new HistoryEvent();

  if (type !== undefined) {
    event.on("added", tt => (type === "added" ? t.is(tt, title) : t.fail(`expected type tobe ${type}, but got added`)));
    event.on("modified", tt =>
      type === "modified" ? t.is(tt, title) : t.fail(`expected type tobe ${type}, but got modified`),
    );
    event.on("deleted", tt =>
      type === "deleted" ? t.is(tt, title) : t.fail(`expected type tobe ${type}, but got deleted`),
    );
  }

  event.classify(title, obj);
  if (type === undefined) t.pass();
};
macro.title = (title = "", obj, type) =>
  `${title} classify when before is '${JSON.stringify(
    obj.before,
  )}'(${typeof obj.before}) and after is '${JSON.stringify(
    obj.after,
  )}'(${typeof obj.after}), the ${type} event should emit`;

test("able to create history event object", t => {
  t.plan(1);

  const title = "random-message";
  const event = new HistoryEvent();

  event.on("added", tt => t.is(tt, title));
  event.emit("added", title, "");
});

test("1.1)", macro, { before: undefined, after: undefined }, undefined);
test("1.2)", macro, { before: "", after: undefined }, undefined);
test("1.3)", macro, { before: undefined, after: "" }, undefined);
test("1.4)", macro, { before: undefined, after: "undefined" }, undefined);
test("1.5)", macro, { before: "undefined", after: undefined }, undefined);
test("1.6)", macro, { before: null, after: "" }, undefined);
test("1.7)", macro, { before: null, after: "null" }, undefined);
test("1.8)", macro, { before: null, after: null }, undefined);
test("1.9)", macro, { before: [], after: [] }, undefined);
test("1.10)", macro, { before: {}, after: {} }, undefined);
test("1.11)", macro, { before: {}, after: new (class {})() }, undefined);
test("1.12)", macro, { before: "", after: "" }, undefined);

test("2.1)", macro, { before: undefined, after: 0 }, "added");
test("2.2)", macro, { before: "no", after: "yes" }, "modified");
test("2.3)", macro, { before: false, after: true }, "modified");
test("2.4)", macro, { before: "0", after: undefined }, "deleted");

test("3.1)", macro, { before: [], after: ["one", "two", "three"] }, "added");
test("3.2)", macro, { before: ["one", "two", "three"], after: [] }, "deleted");

test("4.1)", macro, { before: {}, after: { value: "string-2" } }, "added");
test("4.2)", macro, { before: { update: true }, after: null }, "deleted");
test("4.3)", macro, { before: { update: true }, after: {} }, "deleted");
test("4.4)", macro, { before: { update: true }, after: [] }, "deleted");

test(
  "5.1)",
  macro,
  {
    before: { value: "string" },
    after: new (class {
      public v = "hello, V";
    })(),
  },
  "modified",
);
class HelloWorld {
  public get message() {
    return this.msg;
  }
  constructor(private msg: string = "Hello world") {}

  equals(obj: HelloWorld) {
    return this.message === obj.message;
  }

  toString() {
    return this.message;
  }
}

test("5.2)", macro, { before: undefined, after: new HelloWorld() }, "added");
test(
  "5.3)",
  macro,
  { before: new HelloWorld("custom hello, world"), after: new HelloWorld("new message") },
  "modified",
);
test(
  "5.4)",
  macro,
  { before: new HelloWorld("custom hello, world"), after: new HelloWorld("custom hello, world") },
  undefined,
);
test("5.5)", macro, { before: new HelloWorld("undefined"), after: new HelloWorld("custom hello, world") }, "added");
