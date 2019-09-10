import { FileAction } from "../models/enum";
import { WriteOption } from "../models/interface/defined";

export type Content = string | undefined;

export interface ISystemAdderForRead {
  action: FileAction.READ;
  name: string;
}

export interface ISystemAdderForWrite {
  action: FileAction.WRITE;
  content: string;
  name: string;
  opts?: WriteOption;
}

export type SystemAdder = ISystemAdderForRead | ISystemAdderForWrite;
