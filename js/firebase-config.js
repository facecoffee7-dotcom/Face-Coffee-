/* ============================================================
   FACE COFFEE — Configuración de Firebase
   ------------------------------------------------------------
   PASO OBLIGATORIO: reemplaza los valores de abajo con los de
   TU proyecto de Firebase. Los encuentras en:
   Firebase Console > Configuración del proyecto > Tus apps > SDK

   Instrucciones completas paso a paso en README.md
   ============================================================ */

const firebaseConfig = {
  apiKey: "AIzaSyDIzXMou-4UPPp9oZFgb8XKoG3YA-zkk8Q",
  authDomain: "face-coffee.firebaseapp.com",
  projectId: "face-coffee",
  storageBucket: "face-coffee.firebasestorage.app",
  messagingSenderId: "515569552050",
  appId: "1:515569552050:web:bd695a07bce0ffe3c397ab"
};

// Inicializar Firebase (usa el SDK "compat" cargado en el <head>)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
