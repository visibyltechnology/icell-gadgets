import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC7bkSVJdwaJmsqLxRI0wtkqWF4jhFzQgQ",
  authDomain: "icellgadgets-8f84e.firebaseapp.com",
  projectId: "icellgadgets-8f84e",
  storageBucket: "icellgadgets-8f84e.firebasestorage.app",
  messagingSenderId: "809703155699",
  appId: "1:809703155699:web:b521e185d482d181639486",
  measurementId: "G-D8FMDYHHGK"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
