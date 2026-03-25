// firebase/firebase-config.js

import { initializeApp }  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    push,
  get,
  child,
  update,
  remove,
  onValue
  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyANgz4ywFfS02YM-CH2ylRYGIvLXGISzlM",
  authDomain: "shreejeeayucaredelhiveryone.firebaseapp.com",
  databaseURL: "https://shreejeeayucaredelhiveryone-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shreejeeayucaredelhiveryone",
  storageBucket: "shreejeeayucaredelhiveryone.firebasestorage.app",
  messagingSenderId: "1071744887541",
  appId: "1:1071744887541:web:c774b86a341adc057cb3bc",
  measurementId: "G-QYP141TRBR"
};


const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export {
  ref,
  set,
  push,
  get,
  child,
  update,
  remove,
  onValue
};
