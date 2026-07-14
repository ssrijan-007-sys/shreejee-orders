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
  apiKey: "AIzaSyD2ennjchwkQfwPSAJIhiKEpPHbdExhFZo",
  authDomain: "shreejeeayucare-delhiver-19f97.firebaseapp.com",
  databaseURL: "https://shreejeeayucare-delhiver-19f97-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shreejeeayucare-delhiver-19f97",
  storageBucket: "shreejeeayucare-delhiver-19f97.firebasestorage.app",
  messagingSenderId: "44696209053",
  appId: "1:44696209053:web:58e182a5f691bced1e7674"
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
