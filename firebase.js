import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOpWk58duhC4E1JMP8fdiKoMyLZEveohE",
  authDomain: "smart-farming-dc210.firebaseapp.com",
  databaseURL: "https://smart-farming-dc210-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-farming-dc210",
  storageBucket: "smart-farming-dc210.firebaseestorage.app",
  messagingSenderId: "679052122613",
  appId: "1:679052122613:android:33b8db5622bb1716f3e8bc"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase; 