import { hash } from "../hash";

export default (username: string) => {
  return hash(`${username}`);
};
