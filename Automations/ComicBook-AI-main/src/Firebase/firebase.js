import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA8AOz4Z7zrrFoNdl9skWE2M-7HRSOl3AU",
  authDomain: "comicbook-ai.firebaseapp.com",
  projectId: "comicbook-ai",
  storageBucket: "comicbook-ai.appspot.com",
  messagingSenderId: "960809115255",
  appId: "1:960809115255:web:b03ddb89fcd0637bccb072",
  measurementId: "G-M0LWCF4313"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, db, storage };