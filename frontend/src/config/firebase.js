import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDudB-yqLTvb-97iGtLNXElWnF70irW70Y",
  authDomain: "whatsapp-clone-11f2f.firebaseapp.com",
  projectId: "whatsapp-clone-11f2f",
  appId: "1:43189465581:web:6ae6eff53004ffce8877e4",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);