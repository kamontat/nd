export default interface IDatabase<R = any> {
  read(path: string): Promise<R>;
}
