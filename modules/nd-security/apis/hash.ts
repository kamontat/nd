export const hash = (str: string) => {
  return Buffer.from(str, "utf8")
    .toString("hex")
    .toUpperCase();
};

export const unhash = (str: string) => {
  return Buffer.from(str.toLowerCase(), "hex").toString("utf8");
};
