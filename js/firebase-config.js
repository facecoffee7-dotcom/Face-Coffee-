/* ============================================================
   FACE COFFEE — Configuración de Firebase
   ------------------------------------------------------------
   PASO OBLIGATORIO: reemplaza los valores de abajo con los de
   TU proyecto de Firebase. Los encuentras en:
   Firebase Console > Configuración del proyecto > Tus apps > SDK

   Instrucciones completas paso a paso en README.md/* ============================================================
   FACE COFFEE — Configuración de Firebase
   ------------------------------------------------------------
   PASO OBLIGATORIO: reemplaza los valores de abajo con los de
   TU proyecto de Firebase. Los encuentras en:
   Firebase Console > Configuración del proyecto > Tus apps > SDK

   Instrucciones completas paso a paso en README.md
   ============================================================ */

const firebaseConfig = {
  apiKey: "AIzaSyAsH8Ir_fLTkjUME2kR1l1QGY9h3z1ZYyQ",
  authDomain: "face-coffee-38e58.firebaseapp.com",
  projectId: "face-coffee-38e58",
  storageBucket: "face-coffee-38e58.firebasestorage.app",
  messagingSenderId: "156535312985",
  appId: "1:156535312985:web:ca5aa3bc56ab5e6b991748"
};

// Inicializar Firebase (usa el SDK "compat" cargado en el <head>)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

   ============================================================ */

const firebaseConfig = {
  apiKey: "AIzaSyAsH8Ir_fLTkjUME2kR1l1QGY9h3z1ZYyQ",
  authDomain: "face-coffee-38e58.firebaseapp.com",
  projectId: "face-coffee-38e58",
  storageBucket: "face-coffee-38e58.firebasestorage.app",
  messagingSenderId: "156535312985",
  appId: "1:156535312985:web:ca5aa3bc56ab5e6b991748"
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
