// firebase.js (unchanged)
import { getApp, getApps, initializeApp } from '@react-native-firebase/app';
import { getDatabase } from "@react-native-firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBOpWk58duhC4E1JMP8fdiKoMyLZEveohE",
  authDomain: "smart-farming-dc210.firebaseapp.com",
  databaseURL: "https://smart-farming-dc210-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-farming-dc210",
  storageBucket: "smart-farming-dc210.firebasestorage.app",
  messagingSenderId: "679052122613",
  appId: "1:679052122613:android:33b8db5622bb1716f3e8bc"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const database = getDatabase(app);

export { database };
