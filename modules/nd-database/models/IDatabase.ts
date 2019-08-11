export default interface IDatabase<R = any> {
  append(path: string, value: any): Promise<R>;
  read(path: string): Promise<R>;
  write(path: string, value: any): Promise<R>;
}
