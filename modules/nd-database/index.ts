import firebase from "firebase/app";

import Database from "./models/Database";
import IDatabase from "./models/IDatabase";
import Package from "./package.json";
import DatabaseService from "./services/DatabaseService";

declare var __FIREBASE_API_KEY__: string;
declare var __FIREBASE_AUTH_DOMAIN__: string;
declare var __FIREBASE_DATABASE_URL__: string;
declare var __FIREBASE_PROJECT_ID__: string;
declare var __FIREBASE_STORAGE_BUCKET__: string;
declare var __FIREBASE_MESSAGING_SENDER_ID__: string;
declare var __FIREBASE_APP_ID__: string;

export const InitialDatabase = () => {
  const app = firebase.initializeApp({
    apiKey: __FIREBASE_API_KEY__,
    authDomain: __FIREBASE_AUTH_DOMAIN__,
    databaseURL: __FIREBASE_DATABASE_URL__,
    projectId: __FIREBASE_PROJECT_ID__,
    storageBucket: __FIREBASE_STORAGE_BUCKET__,
    messagingSenderId: __FIREBASE_MESSAGING_SENDER_ID__,
    appId: __FIREBASE_APP_ID__,
  });

  DatabaseService.Set(new Database(app));
  // LoggerService.log(LOGGER_FIREBASE, "%O", DatabaseService.Get());
};

// -------------------- //
// Usage                //
// -------------------- //

// const db = DatabaseService.Get<Database>();
// const v = await db.read("command/test");
// console.log(v.val());

export { Package, DatabaseService, IDatabase, Database };
