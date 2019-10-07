interface IJson {
  [key: string]: string;
}

export default {
  /**
   * @param str
   */
  BuildArray: (str: string) => {
    const _arr = str.split(","); // split by ,
    const it = _arr
      .reduce((p, c) => {
        try {
          if (/.*-.*/.test(c)) {
            const __arr = c.split("-");
            if (__arr.length === 2) {
              const first = parseInt(__arr[0], 10);
              const last = parseInt(__arr[1], 10);
              if (isNaN(first) || isNaN(last)) throw new Error("cannot parse to int");

              for (let i = first; i <= last; i++) {
                p.set(i, i);
              }
            }
          } else if (/\d+/.test(c)) p.set(parseInt(c, 10), parseInt(c, 10));

          return p;
        } catch (e) {
          return p;
        }
      }, new Map<number, number>())
      .values();

    return Array.from(it).sort((a, b) => a - b);
  },
  ReadableArray: (array: Array<number | string>) => {
    if (array.length < 1) return "empty";

    // sort the array low - high
    array = array.sort((a, b) => {
      const _a = typeof a === "number" ? a : parseInt(a);
      const _b = typeof b === "number" ? b : parseInt(b);
      return _a - _b;
    });

    let result: string = array[0].toString();
    let cont = false;
    let dash = false;

    for (let i = 0; i < array.length; i++) {
      const _i = array[i];
      const current = typeof _i === "number" ? _i : parseInt(_i);
      if (isNaN(current)) {
        return array.join(", ");
      }
      if (i + 1 < array.length) {
        const next = array[i + 1];
        cont = current + 1 == next;
        if (cont && !dash) {
          result += "-";
          dash = true;
          continue;
        } else if (!cont) {
          if (dash) {
            result += array[i];
            dash = false;
          }
          result += `, ${next}`;
          cont = false;
          continue;
        }
      } else {
        if (cont) {
          result += current;
        }
      }
    }

    return result;
  },
  /**
   * this will convert array of json to single json
   *
   * @param array is a array of object only; otherwise it will ignore non-object
   *
   * @example
   *   const jsons = [{"foo": "bar"}, {"bar": "hello"}]
   *   const result = MergeArrayObject(jsons)
   *   // result = {"foo": "bar", "bar": "hello"}
   */
  MergeArrayObject: (array: IJson[]) => {
    return array.reduce(
      (p, c) => {
        if (typeof c !== "object") return p;
        return { ...p, ...c };
      },
      {} as IJson,
    );
  },
};
