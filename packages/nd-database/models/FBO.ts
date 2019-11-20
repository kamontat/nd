import { IDBO } from "..";
import { FBase } from "@nd/fbase";

export default abstract class FBO<T> extends FBase implements IDBO<T> {
  public abstract read(path: string): Promise<T>;
  public abstract write(path: string, value: any): Promise<T>; // eslint-disable-line @typescript-eslint/no-explicit-any
}
