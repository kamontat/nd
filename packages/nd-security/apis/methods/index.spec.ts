import test from "ava";
import generator from "./GenerateFirebaseName";

test("generated firebase username shouldn't contains username string", t => {
  const username = "Havi";
  const firebase = generator(username);

  t.notRegex(firebase, new RegExp(username));
});

test("generated firebase username shoule be difference even with same username", t => {
  const username = "Stave";
  const firebaseA = generator(username);
  const firebaseB = generator(username);
  const firebaseC = generator(username);

  t.not(firebaseA, firebaseB);
  t.not(firebaseC, firebaseB);
  t.not(firebaseA, firebaseC);
});
