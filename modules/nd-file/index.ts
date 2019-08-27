import FileAsyncManager from "./models/FileAsyncManager";
import FileSyncManager from "./models/FileSyncManager";
import { ErrorManager as DeprecateErrorManager } from "./old/manager/ErrorManager";
import DeprecateFileManager from "./old/manager/FileManager";
import DeprecateFile from "./old/models/File";
import Package from "./package.json";
import FileSystem from "./services/FileSystem";

// USAGE A1: Normal file action

// const manager: IFileSyncManager = new FileSyncManager("/tmp/directory", {
//   type: FileType.DIR,
//   name: "custom-append-directory",
// });
// console.log(file.type) // DIR | FILE

// const type = manager.load(); // load file to memory
// const type2 = manager.name({ type: FileType.FILE, name: "custom-append-file.txt" }); // append name and load to memory
// console.log(type); // FileLoadResult
// console.log(type2); // FileLoadResult
// Possible value:
//     FileLoadResult.NotExt
//     FileLoadResult.Ext

// --------------------
// Rename method
// --------------------

// manager.rename("input", "new-input", { recursive: true, once: false }); // rename directory or file that matches input

// /tmp/input/hello/world/file.txt   => /tmp/new-input/hello/world/file.txt   // when recursive is 'on' | once is 'off'
// /tmp/hello/input/file/input.txt   => /tmp/hello/input/file/new-input.txt   // when recursive is 'on' | once is 'on'
// /tmp/hello/input/file/nothing.txt => /tmp/hello/world/file/new-input.txt
// /tmp/input/world/input/input.txt  => /tmp/input/world/input/new-input.txt  // when recursive is off
// /tmp/input/world/input/asdf.txt   => /tmp/input/world/input/asdf.txt       // when recursive is off

// --------------------
// Read method
// --------------------

// throw exception if initial when root type is file
// return string
// manager.read({ type: FileType.FILE, name: "hello.txt" });

// this only when root type is FILE.
// return string
// manager.read();

// --------------------
// Find method
// --------------------

// this only when root type is DIR.
// find file/directory match on input regular expression
// return Array<path:string>
// manager.find({ type: FileType.FILE, name: new RegExp("some-name") }, { recursive: true, limit: 4 });

// --------------------
// Write method
// --------------------

// this only when root type is DIR.
// return boolean
// manager.write("file-name.txt", "hello-file-name", { force: false });

// this only when root type is FILE.
// return boolean
// manager.write("hello-me", { force: true, tmp: "this.is.custom.tmp.file.txt" }); // create temp file and replace

// content: string;
// filename: string;
// opts?: IFileOption;

// --------------------
// Reset method
// --------------------

// reset will reset all attributes in object and reinitial when input
// the input is the same as object constructor
// manager.reset("/tmp/directory", { type: FileType.DIR, name: "custom-append-directory" });

// --------------------
// Export
// --------------------

// const system = new FileSystem("/tmp/directory");
// system.append({type: FileType.DIR, name: "Hello world"}, {create: true});

// system.add({name:"chapter-1.html", alias:"chapter1"}, "hello from chapter 1")
// system.add({name:"chapter-2.html", alias:"chapter2"}, "hello from chapter 2")
// system.add({name:"chapter-3.html", alias:"chapter3"}, "hello from chapter 3")
// system.add({name:"chapter-4.html", alias:"chapter4"}, "hello from chapter 4")

// file system
export default FileSystem;

// dependencies class models
export { Package, FileSyncManager, FileAsyncManager };

// Type constants
export { FileLoadResult, FileType } from "./models/enum";

// manager interface
export { IFileSyncManager } from "./models/interface/IFileSyncManager";
export { IFileASyncManager } from "./models/interface/IFileAsyncManager";

// deprecated models
export { DeprecateFileManager, DeprecateFile, DeprecateErrorManager };
