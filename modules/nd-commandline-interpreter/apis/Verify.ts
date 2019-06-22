export default {
  IsNumber(n?: string) {
    if (!n) return false;

    try {
      parseInt(n, 10);
      return true;
    } catch (_) {
      return false;
    }
  },
};
