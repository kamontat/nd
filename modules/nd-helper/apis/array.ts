export default {
  ReadableArray: (array: number[]) => {
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
};
