import { ThreadManager } from "nd-thread";

import File, { IReadFileOption, IWriteFileOption } from "../models/File";

export default abstract class FileManager<T, R> extends ThreadManager<undefined, T, R> {
  public get type() {
    return this._type;
  }

  public static read = class ReadFileManager extends FileManager<IReadFileOption, { [key: string]: string }> {
    constructor(directory: string, name?: string, thread?: number) {
      super("read", directory, name, thread);
    }

    protected transform(item: IReadFileOption) {
      return this.file.read(item);
    }
  };

  public static write = class WriteFileManager extends FileManager<IWriteFileOption, void> {
    constructor(directory: string, name?: string, thread?: number) {
      super("write", directory, name, thread);
    }

    protected transform(item: IWriteFileOption) {
      return this.file.write(item);
    }
  };

  private file: File;

  constructor(private _type: "write" | "read", directory: string, name?: string, thread?: number) {
    super(thread);

    this.file = new File(directory, name);
  }

  public load() {
    this.file.load();
  }

  public name(name?: string) {
    this.file.name(name);
  }
}
