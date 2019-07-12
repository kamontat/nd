export const byteToSize = (bytes: number, seperator: string = "") => {
  const compare = 1000;
  const digit = 2;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "n/a";
  const i = Math.round(Math.floor(Math.log(Math.abs(bytes)) / Math.log(compare)));
  if (i === 0) return `${bytes}${seperator}${sizes[i]}`;
  return `${(bytes / compare ** i).toFixed(digit)}${seperator}${sizes[i]}`;
};
