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
