import Database from "./models/Database";
import IDatabase from "./models/IDatabase";
import Storage from "./models/Storage";
import Package from "./package.json";
import DatabaseService from "./services/DatabaseService";

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

export { Package, DatabaseService, IDatabase, Database };
