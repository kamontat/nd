export default {
  RandomNumber(_opts: { end?: number; start?: number }) {
    const opt = Object.assign({ end: 10, start: 0 }, _opts);
    return opt.start + Math.floor(Math.random() * opt.end);
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
