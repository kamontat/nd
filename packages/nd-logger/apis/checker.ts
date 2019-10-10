export default {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CheckWithString(checker: string, value?: any) {
    if (value === undefined || value === null) return false;
    if (checker === value) return true;
    else return false;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CheckWithNumber(checker: number, value?: any) {
    if (value === undefined || value === null) return false;
    if (checker === value) return true;
    if (checker.toString() === value) return true;

    return false;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CheckWithBoolean(checker: boolean, value?: any) {
    if (value === undefined || value === null) return false;
    if (checker === true) return value === "true" || value === true || value === "1" || value === 1;
    if (checker === false) return value === "false" || value === false || value === "0" || value === 0;

    return false;
  },
};
