import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, doc, getDoc, setDoc, deleteDoc, 
  collection, getDocs, writeBatch 
} from 'firebase/firestore';

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

// Fetch dataset from Firestore (checks granular collection first, then falls back to single doc)
export async function getCloudData(collectionKey) {
  const db = initFirebase();
  if (!db) return null;

  try {
    // 1. Try fetching from granular multi-document collection (No 1MB document limit)
    const colName = `trishu_items_${collectionKey}`;
    const colRef = collection(db, colName);
    const querySnapshot = await getDocs(colRef);

    if (!querySnapshot.empty) {
      const items = [];
      querySnapshot.forEach(docSnap => {
        const d = docSnap.data();
        if (d && d.item) {
          items.push({ ...d.item, _order: d._order ?? items.length });
        } else if (d) {
          items.push(d);
        }
      });
      // Sort by original index if preserved
      items.sort((a, b) => (a._order ?? 0) - (b._order ?? 0));
      if (items.length > 0) {
        return items;
      }
    }

    // 2. Fallback to legacy single document
    const docRef = doc(db, 'trishu_store', collectionKey);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
        return data.items;
      }
    }
  } catch (err) {
    console.warn(`Error fetching ${collectionKey} from cloud:`, err);
  }
  return null;
}

// Save dataset to Firestore using safe chunked batches
export async function setCloudData(collectionKey, items) {
  const db = initFirebase();
  if (!db || !Array.isArray(items)) return false;

  try {
    const colName = `trishu_items_${collectionKey}`;
    
    // Save in batches of 20 to avoid exceeding Firestore limits
    for (let i = 0; i < items.length; i += 20) {
      const batch = writeBatch(db);
      const chunk = items.slice(i, i + 20);
      
      chunk.forEach((item, chunkIdx) => {
        const globalIdx = i + chunkIdx;
        const itemId = String(item.id || item.code || `item-${globalIdx}`).replace(/[\/\s]/g, '_');
        const itemDocRef = doc(db, colName, itemId);
        batch.set(itemDocRef, {
          _id: itemId,
          _order: globalIdx,
          _updatedAt: new Date().toISOString(),
          item: item
        });
      });

      await batch.commit();
    }

    // Also attempt legacy doc update (best-effort)
    try {
      const docRef = doc(db, 'trishu_store', collectionKey);
      await setDoc(docRef, {
        items: items,
        count: items.length,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (docErr) {
      // Ignored if document exceeds 1MB since granular collection has all data safely saved
    }

    return true;
  } catch (err) {
    console.warn(`Error saving ${collectionKey} to cloud:`, err);
    return false;
  }
}

// Save single item directly to cloud (instant sync < 100ms)
export async function setCloudSingleItem(collectionKey, item) {
  const db = initFirebase();
  if (!db || !item) return false;

  try {
    const colName = `trishu_items_${collectionKey}`;
    const itemId = String(item.id || item.code || Date.now()).replace(/[\/\s]/g, '_');
    const docRef = doc(db, colName, itemId);
    await setDoc(docRef, {
      _id: itemId,
      _updatedAt: new Date().toISOString(),
      item: item
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn(`Error saving single item to ${collectionKey}:`, err);
    return false;
  }
}

// Delete single item from cloud
export async function deleteCloudSingleItem(collectionKey, itemId, remainingList = null) {
  const db = initFirebase();
  if (!db || !itemId) return false;

  try {
    const colName = `trishu_items_${collectionKey}`;
    const cleanId = String(itemId).replace(/[\/\s]/g, '_');
    const docRef = doc(db, colName, cleanId);
    await deleteDoc(docRef);

    // Also update main document if remaining list is passed
    if (Array.isArray(remainingList)) {
      try {
        const mainDocRef = doc(db, 'trishu_store', collectionKey);
        await setDoc(mainDocRef, {
          items: remainingList,
          count: remainingList.length,
          updatedAt: new Date().toISOString()
        });
      } catch (e) {}
    }

    return true;
  } catch (err) {
    console.warn(`Error deleting item from ${collectionKey}:`, err);
    return false;
  }
}
