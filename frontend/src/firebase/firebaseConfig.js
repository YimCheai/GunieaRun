// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDU_1TvlOBEPq09gMN0sqSAr_14BfKnDVI",
  authDomain: "guinea-run.firebaseapp.com",
  projectId: "guinea-run",
  storageBucket: "guinea-run.firebasestorage.app",
  messagingSenderId: "194478950209",
  appId: "1:194478950209:web:403a567adbd785abe543c0",
  measurementId: "G-NQYQEE1RF0"
}

// Firebase 초기화
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
