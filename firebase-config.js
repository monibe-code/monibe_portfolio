// Importamos lo que necesitamos de Firebase usando las URLs que te dio el asistente
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, updateDoc, increment, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Tus credenciales reales de la captura
const firebaseConfig = {
  apiKey: "AIzaSyBrg7VT1kg00KMy1ufuB9myWm-MaRKELjc",
  authDomain: "monibe-corazones.firebaseapp.com",
  projectId: "monibe-corazones",
  storageBucket: "monibe-corazones.firebasestorage.app",
  messagingSenderId: "215074528957",
  appId: "1:215074528957:web:7f7fd10b19e2ddb9c421d4"
};

// Inicializamos la App de Firebase
const app = initializeApp(firebaseConfig);

// Inicializamos la base de datos Firestore
const db = getFirestore(app);

// Apuntamos directamente al documento del contador que creamos
const documentoRef = doc(db, "interacciones", "clicks_mama");

// Exportamos las herramientas para usarlas en el archivo principal de tu chatbot
export { documentoRef, updateDoc, increment, onSnapshot };