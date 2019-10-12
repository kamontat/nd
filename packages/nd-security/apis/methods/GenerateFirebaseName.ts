import { hash } from "../hash";

export default (username: string) => {
  const number1 = ("0" + Math.ceil(Math.random() * 99)).slice(-2);
  console.log(number1);

  return hash(`${number1}-${username}-${number1}`).slice(0, 12);
};
