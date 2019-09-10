import Manager from "./models/Manager";
import Package from "./package.json";

// USAGE

// class Example {
//   constructor(public id: number) {}
// }

// const manager = new Manager<Example>(4);

// manager.add("https://google.com/download=1");
// manager.add("https://google.com/download=2");
// manager.add("https://google.com/download=3");
// manager.add("https://google.com/download=4");

// console.log(manager.size); // link size

// // event listener
// manager.event.on("add", () => {});
// manager.event.on("downloading", () => {});
// manager.event.on("downloaded", () => {});
// manager.event.on("header", () => {});
// manager.event.on("end", () => {});

// // if have is final response with already be Example class object
// manager.build(v => {
//   const newResponse = v.copy<Example>();
//   newResponse.result = doSomething(v.result /* this is a html response body */);

//   return newResponse;
// });

// manager.run().then(responses => {
//   responses.forEach(response => {
//     const example = response.result as Example;
//     console.log(example.id);
//   });
// });

export { Manager as DownloadManager, Package };

export { IResponse } from "./models/IResponse";

export { ManagerEvent, IManagerEvent } from "./models/ManagerEvent";

export * from "./apis/SizeConverter";
