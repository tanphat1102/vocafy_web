// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAC_S4iycnGdKo2YvU5onuq8zorpzuAIfA",
  authDomain: "vocafy-b13e3.firebaseapp.com",
  projectId: "vocafy-b13e3",
  storageBucket: "vocafy-b13e3.firebasestorage.app",
  messagingSenderId: "249112075196",
  appId: "1:249112075196:web:1be54bd82a9599362f69b9",
  measurementId: "G-6P84Q0WYC8",
};

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Analytics is only available in the browser
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, auth, db, analytics };
