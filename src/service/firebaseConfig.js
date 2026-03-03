import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import App from "./App";
const firebaseConfig = {
  apiKey: "AIzaSyBo7wYDJsTYKTmbnzI4qG_DgnLPj3hGcxk",
  authDomain: "mobileproject342.firebaseapp.com",
  projectId: "mobileproject342",
  storageBucket: "mobileproject342.firebasestorage.app",
  messagingSenderId: "865121371168",
  appId: "1:865121371168:web:9cf864d9c08dff60222845"
};

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)