import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPoYydWNO9IR87MfMI3HR0ZL26tdBWrVg",
  authDomain: "quickvote-746fc.firebaseapp.com",
  projectId: "quickvote-746fc",
  storageBucket: "quickvote-746fc.firebasestorage.app",
  messagingSenderId: "902793621477",
  appId: "1:902793621477:web:49e829816b86433424890c",
  measurementId: "G-PJRXXEXJWF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
