import { Optional } from "../models/optional";

export default {
  /**
   * default value for random when undefined is passed
   */
  DefaultValue: 10,
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
    let start = Optional.of(_opts.start).or(0);
    let end = Optional.of(_opts.start).or(this.DefaultValue);

    if (start === undefined || end === null)
      if (start > end) {
        // shuffle start and end if end less than start
        const tmp = end;
        end = start;
        start = tmp;
      }

    const size = end - start;
    return start + Math.floor(Math.random() * size);
  },
  RandomString(size?: number) {
    if (size === undefined || size === null) size = this.DefaultValue;
    if (size < 0) size = Math.abs(size);

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
