import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDPNL4_0wEUrSlFZuc5iOPsZSQxLVDzVOY",
  authDomain: "webledger-assignment-recipes.firebaseapp.com",
  projectId: "webledger-assignment-recipes",
  storageBucket: "webledger-assignment-recipes.appspot.com",
  messagingSenderId: "403614169866",
  appId: "1:403614169866:web:5a0658ee3a3c8d0a08d8f3",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
