import IDatabase from "../IDatabase";

/**
 * NOTES: Never tested; be aware when use this
 */
export default abstract class DatabaseMock implements IDatabase {
  private static index: number = 0;

  protected __list: { [key: string]: any };

  constructor() {
    this.__list = new Map();
  }

  public append(path: string, value: any) {
    return this.write(path.concat("/", DatabaseMock.index.toString()).replace("//", "/"), value);
  }

  public read(path: string) {
    return new Promise(res => {
      let result;
      const _arr = path.split("/");
      _arr.forEach(a => {
        const v = this.__list[a];
        if (v) result = v;
        else result = undefined;
      });

      res(result);
    });
  }

  public write(path: string, value: any) {
    return new Promise(res => {
      const _arr = path.split("/");
      if (_arr.pop() === "" && _arr.length < 0) this.__list = value;
      this.__list = this.__setValue(this.__list, _arr, value);
      res();
    });
  }

  protected getValue(path: string): any {
    return this.__list.get(path);
  }

  private __setValue(list: { [key: string]: any }, paths: string[], value: string): any {
    const first = paths.pop();

    // terminal condition
    if (first === "" || first === undefined || first === null) {
      return value;
    }

    const next = paths;

    return this.__setValue(list[first], next, value);
  }
}
