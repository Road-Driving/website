// src/lib/firebase.js

import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

import {
  getDatabase,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDnKjPkO6bF5AILXSdLxK8geqoIQ92PkSI",

  authDomain:
    "road-driving-97f5b.firebaseapp.com",

  projectId:
    "road-driving-97f5b",

  storageBucket:
    "road-driving-97f5b.firebasestorage.app",

  messagingSenderId:
    "977993826541",

  appId:
    "1:977993826541:web:80793597297fb86bba8ce4",

  measurementId:
    "G-KMV0EQRRWE",
};

const app =
  initializeApp(firebaseConfig);

export const auth =
  getAuth(app);

export const provider =
  new GoogleAuthProvider();

export const db =
  getDatabase(app);