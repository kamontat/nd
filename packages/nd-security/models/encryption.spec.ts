import test from "ava";
import Encryption from "./Encryption";

test("Encryption will return completely difference string", t => {
  const str = "hello, world";
  const encrypted = Encryption.encrypt(str);

  t.not(str, encrypted);
});

test("encrypted string can be decrypt by decrypt method", t => {
  const str = "hello, world";
  const encrypted = Encryption.encrypt(str);
  const decrypted = Encryption.decrypt(encrypted);

  t.not(str, encrypted);
  t.is(str, decrypted);
});
