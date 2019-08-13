interface IJson {
  [key: string]: string;
}

export default {
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
  ReadableArray: (array: number[]) => {
    if (array.length < 1) return "empty";

    // sort the array low - high
    array = array.sort((a, b) => {
      return a - b;
    });

    let result: string = array[0].toString();
    let cont = false;
    let dash = false;
    for (let i = 0; i < array.length; i++) {
      const current = array[i];
      if (isNaN(current)) {
        return array.toString();
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
  MergeArrayObject: (array: IJson[]) => {
    return array.reduce(
      (p, c) => {
        return { ...p, ...c };
      },
      {} as IJson,
    );
  },
};
