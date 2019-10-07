import test from "ava";
import Decoder from ".";

test("try to decode utf8 encoded string", t => {
  const str = Decoder(Buffer.from("hello, world", "utf8"), "UTF-8");
  t.is(str, "hello, world");
});
