export enum FileLoadResult {
  Err = "error",
  NotExt = "not-exist",
  Ext = "exist",
  Emp = "empty",
  NotEmp = "not-empty",
}

export enum FileType {
  DIR = "directory",
  FILE = "file",
}

export enum FileAction {
  READ = "read",
  WRITE = "write",
}
