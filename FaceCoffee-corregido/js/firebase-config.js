/* ============================================================
   FACE COFFEE — Configuración de Firebase
   ------------------------------------------------------------
   PASO OBLIGATORIO: reemplaza los valores de abajo con los de
   TU proyecto de Firebase. Los encuentras en:
   Firebase Console > Configuración del proyecto > Tus apps > SDK

   Instrucciones completas paso a paso en README.md
   ============================================================ */

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializar Firebase (usa el SDK "compat" cargado en el <head>)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
