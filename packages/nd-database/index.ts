import Database from "./models/Database";
import IDBO from "./models/IDBO";
import Storage from "./models/Storage";
import Package from "./package.json";
import DatabaseService from "./services/DatabaseService";
import fb from "firebase";

fb.firestore.setLogLevel("silent"); // force log to be silent

export const InitialFirebaseDatabase = () => {
  DatabaseService.Set("database", new Database());
  // LoggerService.log(LOGGER_FIREBASE, "firebase database: %O", DatabaseService.Get());
};

export const InitialFirebaseStorage = () => {
  DatabaseService.Set("storage", new Storage());
  // LoggerService.log(LOGGER_FIREBASE, "firebase storage: %O", DatabaseService.Get());
};

// -------------------- //
// Usage                //
// -------------------- //

// const db = DatabaseService.Get<Database>();
// const v = await db.read("command/test");
// console.log(v.val());

export { Package, DatabaseService, IDBO, Database };
