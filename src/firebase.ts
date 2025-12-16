import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD8dfnPsGDcspt4rh7TEDm8_a06AEE-2Jc",
  authDomain: "twinkle-website-ade2f.firebaseapp.com",
  projectId: "twinkle-website-ade2f",
  storageBucket: "twinkle-website-ade2f.firebasestorage.app",
  messagingSenderId: "569033572094",
  appId: "1:569033572094:web:d8df7cc13572020732afaf"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);