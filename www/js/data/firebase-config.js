const firebaseConfig = {
  apiKey: "AIzaSyBQalLE60geNbHB0eIdrLop2BxoqnJkSrg",
  authDomain: "ruangbk-73a99.firebaseapp.com",
  databaseURL: "https://ruangbk-73a99-default-rtdb.asia-southeast1.firebasedatabase.app", // Cek & samakan dengan URL di tab Realtime Database
  projectId: "ruangbk-73a99",
  storageBucket: "ruangbk-73a99.firebasestorage.app",
  messagingSenderId: "484243750479",
  appId: "1:484243750479:web:f43bca524f42859172743a"
};

// Inisialisasi Firebase sekali saja
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

window.RuangBKFirebase = {
  app: firebase.app(),
  auth: firebase.auth(),
  db: firebase.database()
};