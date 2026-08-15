import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const CONFIG_STORAGE_KEY = 'trishu_firebase_config';

export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyCgDk7yrFa8t4Kf4Z6NEwP-Y17lSlWRJfg",
  authDomain: "trishu-impex.firebaseapp.com",
  projectId: "trishu-impex",
  storageBucket: "trishu-impex.firebasestorage.app",
  messagingSenderId: "297873804272",
  appId: "1:297873804272:web:969f676b8b2e8aa08eab35",
  measurementId: "G-Q4SNHCLZ6X"
};

// Default / fallback config from environment variables or localStorage
export function getFirebaseConfig() {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.projectId && parsed.apiKey) {
          return parsed;
        }
      }
    } catch (e) {}
  }

  // Fallback to Vite env variables
  const env = import.meta.env || {};
  if (env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_PROJECT_ID) {
    return {
      apiKey: env.VITE_FIREBASE_API_KEY,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || `${env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || `${env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: env.VITE_FIREBASE_APP_ID || ''
    };
  }

  return DEFAULT_FIREBASE_CONFIG;
}

export function saveFirebaseConfig(config) {
  if (typeof window === 'undefined') return;
  if (!config) {
    localStorage.removeItem(CONFIG_STORAGE_KEY);
  } else {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  }
  // Re-init or reload
  initFirebase();
}

let firebaseApp = null;
let firestoreDb = null;

export function initFirebase() {
  const config = getFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    firebaseApp = null;
    firestoreDb = null;
    return null;
  }

  try {
    if (getApps().length === 0) {
      firebaseApp = initializeApp(config);
    } else {
      firebaseApp = getApp();
    }
    firestoreDb = getFirestore(firebaseApp);
    return firestoreDb;
  } catch (err) {
    console.warn('Firebase initialization error:', err);
    return null;
  }
}

export function isFirebaseConnected() {
  const db = initFirebase();
  return !!db;
}

// Fetch single document or collection snapshot from Firestore
export async function getCloudData(collectionKey) {
  const db = initFirebase();
  if (!db) return null;

  try {
    const docRef = doc(db, 'trishu_store', collectionKey);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      return data?.items || null;
    }
  } catch (err) {
    console.warn(`Error fetching ${collectionKey} from cloud:`, err);
  }
  return null;
}

// Save dataset to Firestore
export async function setCloudData(collectionKey, items) {
  const db = initFirebase();
  if (!db) return false;

  try {
    const docRef = doc(db, 'trishu_store', collectionKey);
    await setDoc(docRef, {
      items: items,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn(`Error saving ${collectionKey} to cloud:`, err);
    return false;
  }
}
