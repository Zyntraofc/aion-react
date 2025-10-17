import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDAtsrA5QnHFoSaeHpo1Cz_Ix7mWEjmRsM",
    authDomain: "aion-e719d.firebaseapp.com",
    projectId: "aion-e719d",
    storageBucket: "aion-e719d.firebasestorage.app",
    messagingSenderId: "249471087737",
    appId: "1:249471087737:android:34413574bc423ff78350a8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
