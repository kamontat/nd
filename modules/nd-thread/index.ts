import Manager from "./models/ThreadManager";
import OLD from "./models/ThreadManagerOld";
import Package from "./package.json";

// Usage A

// const manager = new (class extends Manager<string, string, undefined, undefined, "read" | "write"> {
//   constructor() {
//     super();
//   }

//   public run() {
//     return new Promise<"read" | "write">(res => res(this._optionOnce));
//   }
// })();

// manager.setOptionOnce("read");
// manager.run().then(v => {
//   console.log(v);
// });

// This will be remove when public was released
export { OLD as DeprecatedThreadManager };
export { Manager as ThreadManager };

export { IThreadable } from "./models/IThreadable";
export { Package };
