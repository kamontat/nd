import { FileType } from "../enum";

export interface IFileFileInput {
  name: string;
  type: FileType.FILE;
}

export interface IFileDirInput {
  name: string;
  type: FileType.DIR;
}

export type FileInput = IFileFileInput | IFileDirInput;

export interface IFindInput {
  name?: string;
  type?: FileType;
}

export interface _IFindInput {
  name: string;
  type?: FileType;
}

export interface IFileOutput {
  path: string;
  type: FileType;
}

export interface IFindFileInput {
  name: RegExp;
  type: FileType;
}

export interface IRecursiveRenameOptions {
  once: boolean;
  recursive: true;
}

export interface INoneRecursiveRenameOptions {
  recursive: false;
}

export type RenameOptions = IRecursiveRenameOptions | INoneRecursiveRenameOptions;
export interface IRenameOptions {
  once?: boolean;
  recursive: boolean;
}

export interface IReadOptions {
  recursive: boolean;
}

export interface IRecursiveFindOptions {
  limit: number;
  recursive: true;
}

export interface INoneRecursiveFindOptions {
  recursive: false;
}

export type FindOptions = IRecursiveFindOptions | INoneRecursiveFindOptions;

export interface IForceWriteOption {
  force: true;
  tmp: string | undefined;
}

export interface INotForceWriteOption {
  force: false;
}

export interface ILoadOptions {
  create: boolean;
}

export type WriteOption = IForceWriteOption | INotForceWriteOption;
