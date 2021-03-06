import test from "ava";
import Decoder from ".";

test("try to decode utf8 encoded string", t => {
  const str = Decoder(Buffer.from("hello, world", "utf8"), "UTF-8");
  t.is(str, "hello, world");
});

test("expect to throw exception when unknown encode pass in", t => {
  t.throws(() => {
    Decoder(Buffer.from("hello, world", "utf8"), "ABCD" as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  });
});
