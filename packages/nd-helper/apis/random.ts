export default {
  /**
   * This will random number as this expressio; start <= x < end
   *
   * @param _opts random number creation object
   * @param _opts.start inclusive start number
   * @param _opts.end exclusive end number
   *
   * @returns number as integer only
   */
  RandomNumber(_opts: { end?: number; start?: number }) {
    const opt = Object.assign({ end: 10, start: 0 }, _opts);

    // shuffle start and end if end less than start
    if (opt.start > opt.end) {
      const tmp = opt.end;
      opt.end = opt.start;
      opt.start = tmp;
    }

    const size = opt.end - opt.start;
    return opt.start + Math.floor(Math.random() * size);
  },
  RandomString(size = 10) {
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const number = "0123456789";
    const __array = [lower, upper, number];

    let str = "";
    for (let i = 0; i < size; i++) {
      const type = __array[this.RandomNumber({ start: 0, end: __array.length })];
      str += type.charAt(this.RandomNumber({ start: 0, end: type.length }));
    }
    return str;
  },
};
