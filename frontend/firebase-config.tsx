import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
//GetAuth Method is used to Configure our app to use Firebase Authentication
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_FIREBASE_KEY,
  authDomain: process.env.NEXT_AUTH_DOMAIN,
  projectId: process.env.NEXT_PROJECT_ID,
  storageBucket: process.env.NEXT_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
