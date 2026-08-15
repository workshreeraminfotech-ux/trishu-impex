// IndexedDB Storage Layer — Trishu Impex
// Unlimited Persistent Storage (Gigabytes Capacity) for Products, Full Images & Catalogs

const DB_NAME = 'TrishuImpexDB';
const DB_VERSION = 1;
const STORE_NAME = 'keyval';

let dbPromise = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        return resolve(null);
      }
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };
        request.onsuccess = (event) => {
          // Request browser persistent storage permission
          if (navigator.storage && navigator.storage.persist) {
            navigator.storage.persist().catch(() => {});
          }
          resolve(event.target.result);
        };
        request.onerror = (event) => {
          console.warn('IndexedDB open warning:', event);
          resolve(null);
        };
      } catch (e) {
        console.warn('IndexedDB initialization failed:', e);
        resolve(null);
      }
    });
  }
  return dbPromise;
}

export async function idbGet(key) {
  try {
    const db = await getDB();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result !== undefined ? req.result : null);
        req.onerror = () => resolve(null);
      } catch (err) {
        resolve(null);
      }
    });
  } catch (e) {
    return null;
  }
}

export async function idbSet(key, val) {
  try {
    const db = await getDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(val, key);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (err) {
        resolve(false);
      }
    });
  } catch (e) {
    return false;
  }
}

export async function idbDel(key) {
  try {
    const db = await getDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(key);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (err) {
        resolve(false);
      }
    });
  } catch (e) {
    return false;
  }
}

export async function idbClear() {
  try {
    const db = await getDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.clear();
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (err) {
        resolve(false);
      }
    });
  } catch (e) {
    return false;
  }
}
