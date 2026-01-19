import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyANwKgSVtW2k7yp05jes8FzOXbDxsfOfFA",
  authDomain: "deneyapp-36134.firebaseapp.com",
  projectId: "deneyapp-36134",
  storageBucket: "deneyapp-36134.firebasestorage.app",
  messagingSenderId: "773298911018",
  appId: "1:773298911018:web:55bbdc0ab29a869f8dd053",
};
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
