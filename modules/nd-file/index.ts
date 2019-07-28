import { FileManager } from "./models/FileManager";
import Package from "./package.json";

// ---------------------------- //
// Usage A: single thread       //
// ---------------------------- //

// const manager = new FileManager("/tmp/hello-world", "custom-path");
// manager.load(); // you must either call load() or call name()

// manager.save("hello world", "example-A.txt", { force: true }); // for promise return
// manager.saveSync("hello world", "example-A.txt", { force: true }); // for sync method

// ---------------------------- //
// Usage B: multiple thread     //
// ---------------------------- //

// const manager = new FileManager("/tmp/multiple-thread", undefined, 12); // create 12 thread worker
// manager.load(); // you must either call load() or call name()

// manager.add({ content: "content-A", filename: "example.A.txt", opts: { force: false } });
// manager.add({ content: "content-B", filename: "example.B.txt", opts: { force: false } });
// manager.add({ content: "content-C", filename: "example.C.txt", opts: { force: false } });
// manager.add({ content: "content-D", filename: "example.D.txt", opts: { force: false } });

// manager
//   .run()
//   .then(() => {
//     console.log("done");
//   })
//   .catch(e => {
//     console.log(`Error: ${e}`);
//   });

export default FileManager;

export { Package };
