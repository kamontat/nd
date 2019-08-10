import IDatabase from "../IDatabase";

export default abstract class DatabaseMock implements IDatabase {
  public abstract getValue(path: string): any;

  public read(path: string) {
    return new Promise(res => res(this.getValue(path)));
  }
}
