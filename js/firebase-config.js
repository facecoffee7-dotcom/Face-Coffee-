/* ============================================================
   FACE COFFEE — Configuración de Firebase
   ------------------------------------------------------------
   PASO OBLIGATORIO: reemplaza los valores de abajo con los de
   TU proyecto de Firebase. Los encuentras en:
   Firebase Console > Configuración del proyecto > Tus apps > SDK
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
// Forzamos "long polling" en vez de streaming en tiempo real: algunas redes
// (antivirus, firewalls, proxies corporativos) cortan las conexiones de
// streaming que Firestore usa por defecto, aunque las peticiones normales
// sí les lleguen. Esto hace la conexión más lenta pero mucho más confiable.
db.settings({ experimentalForceLongPolling: true, merge: true });
const auth = firebase.auth();

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
