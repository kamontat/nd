import test from "ava";
import { HistoryNode } from "./HistoryNode";

test("JSON message of default history node; event type must be undefined", t => {
  const node = new HistoryNode("title");
  t.is(node.toJSON().type, undefined);
});

test("JSON message of default history node; event title must be same as input", t => {
  const node = new HistoryNode("title");
  t.is(node.toJSON().title, "title");
});

test("JSON message of default history node; create at must be past date", t => {
  const node = new HistoryNode("title");
  t.true(node.toJSON().createAt <= +new Date());
});

test("JSON message of default history node; create and update must equal when never update node before", t => {
  const node = new HistoryNode("title");
  t.is(node.toJSON().createAt, node.toJSON().updateAt);
});

test("toString will return error if never set value of history", t => {
  const node = new HistoryNode("title");
  t.regex(node.toString(), new RegExp("error", "i"));
});

test("updated node should update datetime", t => {
  t.plan(2);

  const node = new HistoryNode("title");

  return new Promise(res => {
    setTimeout(() => {
      const node2 = node.set("added", "hello");

      t.deepEqual(node, node2);
      t.not(node.toJSON().createAt, node.toJSON().updateAt);

      res();
    }, 10);
  });
});

test("return Error message when input unknown event type", t => {
  const node = new HistoryNode("title");
  node.set("unknown" as any, "custom message"); // eslint-disable-line @typescript-eslint/no-explicit-any

  t.regex(node.toString({ color: false }), new RegExp("error", "i"));
});

test("toString with color should different with without color", t => {
  const node = new HistoryNode("title");
  node.set("added", "string");

  t.not(node.toString({ color: true }), node.toString({ color: false }));
});

test("toString will make different message base on event type", t => {
  const title = "random-string";
  const message = "random-message";

  const addedNode = new HistoryNode(title).set("added", message);
  const modifiedNode = new HistoryNode(title).set("modified", message);
  const deletedNode = new HistoryNode(title).set("deleted", message);

  t.not(addedNode.toString(), modifiedNode.toString());
  t.not(deletedNode.toString(), modifiedNode.toString());
  t.not(addedNode.toString(), deletedNode.toString());
});

test("toString should return event message as output", t => {
  const title = "random-string";
  const message = "random-message";

  const node = new HistoryNode(title).set("deleted", message);

  t.regex(node.toString({ color: true }), new RegExp(message));
});

test("toString will limit message less than 30 character", t => {
  const title = "random-string";
  const veryLongMessage1 = "thisisaveryverylongmessagefortestinghistorynodetostringmethod";
  const veryLongMessage2 =
    "1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890";

  const node = new HistoryNode(title).set("modified", { before: veryLongMessage1, after: veryLongMessage2 });

  t.notRegex(node.toString({ color: true }), new RegExp(veryLongMessage1));
  t.notRegex(node.toString({ color: true }), new RegExp(veryLongMessage2));
});
