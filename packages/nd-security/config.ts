export interface IConfigJson {
  algorithm: "HS256" | "HS384" | "HS512";
  id: string;
}

export default {
  v1: {
    algorithm: "HS256",
    id: "nd-v1"
  }
} as { [version: string]: IConfigJson };
