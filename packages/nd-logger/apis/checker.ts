export default {
  CheckWithString(checker: string, value?: any) {
    if (value === undefined || value === null) return false;
    if (checker === value) return true;
    else return false;
  },
  CheckWithNumber(checker: number, value?: any) {
    if (value === undefined || value === null) return false;
    if (checker === value) return true;
    if (checker.toString() === value) return true;

    return false;
  },
  CheckWithBoolean(checker: boolean, value?: any) {
    if (value === undefined || value === null) return false;
    if (checker === true) return value === "true" || value === true || value === "1" || value === 1;
    if (checker === false) return value === "false" || value === false || value === "0" || value === 0;

    return false;
  },
};
