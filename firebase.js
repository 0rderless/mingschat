// ✅ Firebase configuration — keep this readable
const firebaseConfig = {
  apiKey: "AIzaSyCf1_uelYRFLSW8e652hHBppFUwmegkJE0",
  authDomain: "mingchat-e8a29.firebaseapp.com",
  databaseURL: "https://mingchat-e8a29-default-rtdb.firebaseio.com",
  projectId: "mingchat-e8a29",
  storageBucket: "mingchat-e8a29.appspot.com",
  messagingSenderId: "570070920841",
  appId: "1:570070920841:web:fa45f0f67b6fb33598e058"
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
