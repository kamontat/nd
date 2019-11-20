import firebase from "firebase/app";

declare let __FIREBASE_API_KEY__: string;
declare let __FIREBASE_AUTH_DOMAIN__: string;
declare let __FIREBASE_DATABASE_URL__: string;
declare let __FIREBASE_PROJECT_ID__: string;
declare let __FIREBASE_STORAGE_BUCKET__: string;
declare let __FIREBASE_MESSAGING_SENDER_ID__: string;
declare let __FIREBASE_APP_ID__: string;

export default class {
  protected app: firebase.app.App;

  constructor() {
    if (firebase.apps.length === 0) {
      this.app = firebase.initializeApp({
        apiKey: process.env.NODE_ENV === "test" ? "" : __FIREBASE_API_KEY__,
        authDomain: process.env.NODE_ENV === "test" ? "" : __FIREBASE_AUTH_DOMAIN__,
        databaseURL: process.env.NODE_ENV === "test" ? "" : __FIREBASE_DATABASE_URL__,
        projectId: process.env.NODE_ENV === "test" ? "" : __FIREBASE_PROJECT_ID__,
        storageBucket: process.env.NODE_ENV === "test" ? "" : __FIREBASE_STORAGE_BUCKET__,
        messagingSenderId: process.env.NODE_ENV === "test" ? "" : __FIREBASE_MESSAGING_SENDER_ID__,
        appId: process.env.NODE_ENV === "test" ? "" : __FIREBASE_APP_ID__,
      });
    } else {
      this.app = firebase.app();
    }
  }
}
