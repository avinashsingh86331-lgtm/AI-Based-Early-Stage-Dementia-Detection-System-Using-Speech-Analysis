import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAGK3biQJSQKO7DhUFJjtFFCMI28lGn3p4",
  authDomain: "ai-dementia-detection.firebaseapp.com",
  projectId: "ai-dementia-detection",
  storageBucket: "ai-dementia-detection.firebasestorage.app",
  messagingSenderId: "985737294800",
  appId: "1:985737294800:web:3b1789b3d22f8a2b833fd5",
  measurementId: "G-PTH83E1FFW"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();