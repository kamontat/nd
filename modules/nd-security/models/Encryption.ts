import { hash, unhash } from "../apis/hash";

export default {
  encrypt(str: string) {
    return hash(str);
  },
  decrypt(token: string) {
    return unhash(token);
  },
};
