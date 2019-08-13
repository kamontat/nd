// import { ArrayUtils } from "nd-helper";

import FileManager from "./manager/FileManager";
import Package from "./package.json";

// ---------------------------- //
// Usage A: For write           //
// ---------------------------- //

// const manager = new FileManager.write("/tmp/hello-world", "custom-path");
// manager.load(); // you must either call load() or name()
// manager.name("sub-directory"); // either if you didn't call load()

// manager.add({ content: "content-A", filename: "example-a.txt", opts: { force: false } });
// manager.add({ content: "content-B", filename: "example-b.txt", opts: { force: true, tmp: "template-name.txt" } });

// manager.run();

// ---------------------------- //
// Usage B: For read            //
// ---------------------------- //

// const manager2 = new FileManager.read("/tmp/hello-world", "custom-path");
// manager2.load(); // you must either call load() or name()
// manager2.name("sub-directory"); // either if you didn't call load()

// manager2.add({ alias: "expA", filename: "example-a.txt" });
// manager2.add({ filename: "example-b.txt" });

// manager2.run().then((arrayObject: any[]) => {
//   const obj = ArrayUtils.MergeArrayObject(arrayObject);

//   console.log(obj.expA); // file content of A
//   console.log(obj["example-b.txt"]); // file content of B
// });

export default FileManager;

export { Package };
