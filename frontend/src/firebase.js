import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDxVKG0bSH6KUmw8K5g6f19oC0XWIsbfMA",
  authDomain: "dreamhouse-planner.firebaseapp.com",
  projectId: "dreamhouse-planner",
  storageBucket: "dreamhouse-planner.firebasestorage.app",
  messagingSenderId: "901019279053",
  appId: "1:901019279053:web:8d6f4ae159192e0d1f5384",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;