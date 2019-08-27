import { FileLoadResult, FileType } from "../enum";

import {
  FileInput,
  FindOptions,
  IFileFileInput,
  IFindFileInput,
  ILoadOptions,
  RenameOptions,
  WriteOption,
} from "./defined";

export interface IFileManager {
  readonly directory: string;
  readonly loaded: boolean;
  readonly type: FileType;

  find(input: IFindFileInput, opts?: FindOptions): string[] | Promise<string[]>;

  /**
   * load and check file from file system to memory
   *
   * @param opts loading option
   */
  load(opts?: ILoadOptions): FileLoadResult | Promise<FileLoadResult>;

  /**
   * do like {@link load()} with update directory path as well
   *
   * @param input input directory path
   * @param opts loading option
   */
  name(input: FileInput, opts?: ILoadOptions): FileLoadResult | Promise<FileLoadResult>;

  read(): string | Promise<string>;
  read(input: IFileFileInput): string | Promise<string>;

  rename(input: string, output: string, opts?: RenameOptions): boolean | Promise<boolean>;

  reset(directory: string, opts?: FileInput): this;

  write(content: string, fileName?: string, opts?: WriteOption): boolean | Promise<boolean>;
  write(content: string, opts?: WriteOption): boolean | Promise<boolean>;
}
