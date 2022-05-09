import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyByGiYEHMgbUzMRt0JsMpV-caHXwtNIxtc",
  authDomain: "linkedin-clone-4b862.firebaseapp.com",
  projectId: "linkedin-clone-4b862",
  storageBucket: "linkedin-clone-4b862.appspot.com",
  messagingSenderId: "954590753523",
  appId: "1:954590753523:web:c959e1a80b7fdb339b7d86",
  measurementId: "G-EYSN885PC0",
};

// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

const Provider = new firebase.auth.GoogleAuthProvider();
const storage = getStorage(firebaseApp);

export { auth, Provider, storage };
export default db;
