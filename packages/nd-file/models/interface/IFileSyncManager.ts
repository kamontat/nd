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

export interface IFileSyncManager extends IFileManager {
  find(input: IFindFileInput, opts?: FindOptions): string[];

  load(opts?: ILoadOptions): FileLoadResult;

  name(input: FileInput, opts?: ILoadOptions): FileLoadResult;

  read(): string;
  read(input: IFileFileInput): string;

  rename(input: string, output: string, opts?: RenameOptions): boolean;

  reset(directory: string, opts?: FileInput): this;

  write(content: string, fileName?: string, opts?: WriteOption): boolean;
  write(content: string, opts?: WriteOption): boolean;
}
