// ══════════════════════════════════════
//  LOWER-THIRD CALCULATOR — Firebase Configuration
//  Replace the values below with your own Firestore project's config.
// ══════════════════════════════════════
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword,
         signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc,
         serverTimestamp, query, where, getDocs, orderBy,
         updateDoc, onSnapshot, deleteDoc, runTransaction }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAVljHVEfy-a9mb1ZValEdSSZ7UfY2YxtY",
    authDomain: "a-lowerthird.firebaseapp.com",
    projectId: "a-lowerthird",
    storageBucket: "a-lowerthird.firebasestorage.app",
    messagingSenderId: "793580208049",
    appId: "1:793580208049:web:3bc61432c4b9e816d6c790",
    measurementId: "G-LP7201BQDS"
  };

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
// Always show the account chooser instead of silently signing in
// with whatever Google account the browser already has an active session for.
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { auth, db, googleProvider,
  GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile,
  doc, setDoc, getDoc, collection, addDoc, serverTimestamp,
  query, where, getDocs, orderBy,
  updateDoc, onSnapshot, deleteDoc, runTransaction };
