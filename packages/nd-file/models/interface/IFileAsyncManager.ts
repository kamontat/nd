import { FileLoadResult } from "../enum";

import {
  FileInput,
  FindOptions,
  IFileDirInput,
  IFileFileInput,
  IFindFileInput,
  ILoadOptions,
  IReadOptions,
  RenameOptions,
  WriteOption,
} from "./defined";
import { IFileManager } from "./IFileManager";

export interface IFileASyncManager extends IFileManager {
  find(input: IFindFileInput, opts?: FindOptions): Promise<string[]>;

  load(opts?: ILoadOptions): Promise<FileLoadResult>;

  name(input: FileInput, opts?: ILoadOptions): Promise<FileLoadResult>;

  read(): Promise<string>;
  read(input: IFileFileInput): Promise<string>;

  rename(input: string, output: string, opts?: RenameOptions): Promise<boolean>;

  reset(directory: string, opts?: FileInput): this;

  write(content: string, fileName?: string, opts?: WriteOption): Promise<boolean>;
  write(content: string, opts?: WriteOption): Promise<boolean>;
}
