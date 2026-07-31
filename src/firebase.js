import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Sentinel: Using environment variables for Firebase configuration to prevent
// sensitive data from being committed to version control.
// This project is built with Create React App (CRA), confirmed by
// 'react-scripts' in package.json, so REACT_APP_ prefix and process.env syntax
// are strictly required for the build system, overriding general Vite-style suggestions.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Security check: Warn if environment variables are missing (non-production only)
if (process.env.NODE_ENV !== 'production') {
  if (!process.env.REACT_APP_FIREBASE_API_KEY ||
      !process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
      !process.env.REACT_APP_FIREBASE_PROJECT_ID) {
    console.warn("Sentinel: Firebase configuration is incomplete. Check your .env file.");
  }
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
