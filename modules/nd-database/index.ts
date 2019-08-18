import firebase from "firebase/app";

import Database from "./models/Database";
import IDatabase from "./models/IDatabase";
import Package from "./package.json";
import DatabaseService from "./services/DatabaseService";

export const InitialFirebaseDatabase = () => {
  DatabaseService.Set(new Database());
  // LoggerService.log(LOGGER_FIREBASE, "%O", DatabaseService.Get());
};

// -------------------- //
// Usage                //
// -------------------- //

// const db = DatabaseService.Get<Database>();
// const v = await db.read("command/test");
// console.log(v.val());

export { Package, DatabaseService, IDatabase, Database };
