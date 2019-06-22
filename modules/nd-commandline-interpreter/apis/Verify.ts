export default {
  IsBoolean(n: any) {
    if (!n) return false;
    return n === "true" || n === true || n === "false" || n === false;
  },
  IsNumber(n?: string) {
    if (!n) return false;
    return n.match(/^\d+$/);
  },
  IsDecimal(n?: string) {
    if (!n) return false;
    try {
      parseFloat(n);
      return true;
    } catch (_) {
      return false;
    }
  },
  IsId(n?: string) {
    if (!n) return false;
    return this.IsNumber(n);
  },
  IsUrl(n?: string) {
    if (!n) return false;
    try {
      const url = new URL(n);
      return url.protocol.includes("http") || url.protocol.includes("https");
    } catch (e) {
      return false;
    }
  },
};
