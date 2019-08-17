import { hash } from "../hash";

export default (username: string) => {
  const number = ("0" + Math.ceil(Math.random() * 99)).slice(-2);
  return hash(`${username}-${number}`);
};
