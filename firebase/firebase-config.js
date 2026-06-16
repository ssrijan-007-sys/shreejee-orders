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
  apiKey: "AIzaSyA0VETwJGM2xliTPcxg86dVS3vut0wdDl0",
  authDomain: "shreejeeayucare-delhiveryone.firebaseapp.com",
  databaseURL: "https://shreejeeayucare-delhiveryone-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shreejeeayucare-delhiveryone",
  storageBucket: "shreejeeayucare-delhiveryone.firebasestorage.app",
  messagingSenderId: "453512807297",
  appId: "1:453512807297:web:dd90f085e95b22a4b79e80"
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
