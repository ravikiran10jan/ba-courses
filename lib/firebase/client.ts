import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebaseConfig } from "./config";

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

function initializeFirebase() {
  if (getApps().length > 0) {
    app = getApp();
  } else {
    app = initializeApp(firebaseConfig);
  }
  auth = getAuth(app);
  db = getFirestore(app);
}

// Only initialize if we have a valid API key (not during build)
if (firebaseConfig.apiKey) {
  initializeFirebase();
}

export { app, auth, db };
