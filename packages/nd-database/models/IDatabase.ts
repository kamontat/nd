export default interface IDatabase<R = any> {
  read(path: string): Promise<R>;
  write(path: string, value: any): Promise<R>;
}
