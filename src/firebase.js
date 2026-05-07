import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBfmh_Rnf-ZVST1ZiCDcqB4K44qcPVY608",
  authDomain: "kwacha-finance-ed729.firebaseapp.com",
  projectId: "kwacha-finance-ed729",
  storageBucket: "kwacha-finance-ed729.firebasestorage.app",
  messagingSenderId: "353305719524",
  appId: "1:353305719524:web:6091c9e33b4e0d80e532f1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;