import { DEK_D_CHAPTER_URL, DEK_D_VIEW_URL } from "../constants/html";

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

export const buildViewlongURL = (id: number | string, cid: number): URL => {
  if (typeof id === "number") return DEK_D_CHAPTER_URL(id, cid);
  const _arr = id.match(/\d+/);
  if (_arr) {
    const _id = _arr.pop();
    try {
      return buildViewlongURL(parseInt(_id || "", 10), cid);
    } catch (e) {
      return new URL("");
    }
  }
  return new URL(id);
};
