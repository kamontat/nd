export const hash = (str: string) => {
  return Buffer.from(str, "utf8").toString("hex");
};

export const unhash = (str: string) => {
  return Buffer.from(str, "hex").toString("utf8");
};
