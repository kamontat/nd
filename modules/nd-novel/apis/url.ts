import { DEK_D_VIEW_URL } from "../constants/html";

export const buildViewURL = (id: number | string): URL => {
  if (typeof id === "number") return DEK_D_VIEW_URL(id);
  const _arr = id.match(/\d+/);
  if (_arr) {
    const _id = _arr.pop();
    try {
      return buildViewURL(parseInt(_id || "", 10));
    } catch (e) {
      return new URL("");
    }
  }
  return new URL(id);
};
