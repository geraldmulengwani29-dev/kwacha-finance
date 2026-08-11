import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// WARNING: 'REACT_APP_' prefix and 'process.env' syntax are strictly required
// by Create React App's build system. Do not use Vite style 'import.meta.env'.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

if (process.env.NODE_ENV !== "production") {
  const missing = [];
  if (!process.env.REACT_APP_FIREBASE_API_KEY) missing.push("REACT_APP_FIREBASE_API_KEY");
  if (!process.env.REACT_APP_FIREBASE_AUTH_DOMAIN) missing.push("REACT_APP_FIREBASE_AUTH_DOMAIN");
  if (!process.env.REACT_APP_FIREBASE_PROJECT_ID) missing.push("REACT_APP_FIREBASE_PROJECT_ID");
  if (!process.env.REACT_APP_FIREBASE_STORAGE_BUCKET) missing.push("REACT_APP_FIREBASE_STORAGE_BUCKET");
  if (!process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID) missing.push("REACT_APP_FIREBASE_MESSAGING_SENDER_ID");
  if (!process.env.REACT_APP_FIREBASE_APP_ID) missing.push("REACT_APP_FIREBASE_APP_ID");

  if (missing.length > 0) {
    console.warn(`[Sentinel Warning]: Missing required environment variables for Firebase configuration in non-production environment: ${missing.join(", ")}`);
  }
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
