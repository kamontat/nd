/* eslint-disable @typescript-eslint/no-explicit-any */

export default interface IDBO<R = any> {
  read(path: string): Promise<R>;
  write(path: string, value: any): Promise<R>;
}
