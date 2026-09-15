// Import Firebase core
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";

// Import Auth & Firestore
import { getAuth } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBgprqfnohvuNsTYwTtpA0Bp_oams0SgSQ",
    authDomain: "talentforge11.firebaseapp.com",
    projectId: "talentforge11",
    storageBucket: "talentforge11.firebasestorage.app",
    messagingSenderId: "968299391213",
    appId: "1:968299391213:web:dceb8c1aaeb3ff885244e4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);