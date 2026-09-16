// Centralized Dynamic Data & Admin Store — Trishu Impex
// Powered by Persistent IndexedDB (GBs capacity) + In-Memory Fast Cache + Safe LocalStorage

import { PRODUCTS as INITIAL_PRODUCTS, PRODUCT_CATEGORIES } from '../data/products';
import { AGRO_PRODUCTS as INITIAL_AGRO_PRODUCTS, AGRO_CATEGORIES } from '../data/agroProducts';
import { SANITARYWARE_PRODUCTS as INITIAL_SANITARYWARE_PRODUCTS, SANITARYWARE_CATEGORIES } from '../data/sanitarywareProducts';
import { TILES_PRODUCTS as INITIAL_TILES_PRODUCTS, TILES_CATEGORIES } from '../data/tilesProducts';
import { HARDWARE_PRODUCTS as INITIAL_HARDWARE_PRODUCTS, HARDWARE_CATEGORIES } from '../data/hardwareProducts';
import { PVC_PIPE_PRODUCTS as INITIAL_PVC_PIPE_PRODUCTS, PVC_PIPE_CATEGORIES } from '../data/pvcPipeProducts';
import { BLOGS as INITIAL_BLOGS } from '../data/blogs';
import { idbGet, idbSet, idbDel, idbClear } from './idbStore';

import apedaLogo from '../assets/certificate/apeda.webp';
import spicesBoardLogo from '../assets/certificate/spices board.webp';
import fdaLogo from '../assets/certificate/fda.webp';
import isoLogo from '../assets/certificate/iso.webp';
import fssaiLogo from '../assets/certificate/fssai.webp';
import halalLogo from '../assets/certificate/halal.webp';

const INITIAL_CERTS = [
  { 
    id: 'cert-1',
    name: 'APEDA Certified Exporter', 
    code: 'APEDA / GOVT', 
    tag: 'Agricultural & Processed Food Products Export Development Authority',
    logo: apedaLogo
  },
  { 
    id: 'cert-2',
    name: 'Spices Board India', 
    code: 'SPICES BOARD', 
    tag: 'Ministry of Commerce and Industry, Government of India',
    logo: spicesBoardLogo
  },
  { 
    id: 'cert-3',
    name: 'US FDA Registered Facility', 
    code: 'US FDA', 
    tag: 'United States Food and Drug Administration Compliance',
    logo: fdaLogo
  },
  { 
    id: 'cert-4',
    name: 'ISO 9001:2015 & HACCP', 
    code: 'ISO 9001:2015', 
    tag: 'Certified Quality Management & Food Safety Standards',
    logo: isoLogo
  },
  { 
    id: 'cert-5',
    name: 'FSSAI License Approved', 
    code: 'FSSAI', 
    tag: 'Food Safety and Standards Authority of India',
    logo: fssaiLogo
  },
  { 
    id: 'cert-6',
    name: 'Halal Certified Export', 
    code: 'HALAL', 
    tag: 'Global Dietary Compliance for Gulf & Middle East Markets',
    logo: halalLogo
  }
];

const INITIAL_ENQUIRIES = [
  {
    id: 'enq-101',
    source: 'Product Quote Request',
    name: 'Hans Weber',
    company: 'EuroSpices GmbH',
    email: 'h.weber@eurospices.de',
    phone: '+49 171 5550192',
    product: 'Turmeric Powder (Curcumin > 3.5%)',
    quantity: '20 MT (1x20ft FCL)',
    destinationPort: 'Hamburg Port, Germany',
    notes: 'Please quote CIF Hamburg rates with phytosanitary & lab COA test certificates.',
    status: 'New',
    date: 'Aug 08, 2026 10:15 AM'
  },
  {
    id: 'enq-102',
    source: 'Contact Us Form',
    name: 'Tariq Al-Mansoor',
    company: 'Gulf General Trading Co.',
    email: 'tariq@gulfgeneral.ae',
    phone: '+971 50 1234567',
    product: 'Guntur S17 Red Chilli & Cumin Seeds',
    quantity: '40 MT (2x40ft FCL)',
    destinationPort: 'Jebel Ali Port, Dubai',
    notes: 'Urgent container requirement for Ramadan shipment. Halal certification required.',
    status: 'New',
    date: 'Aug 07, 2026 04:30 PM'
  }
];

// --- HELPER: INITIAL SEED FROM LOCALSTORAGE ---
function getInitialList(lsKey, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(lsKey);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return fallback;
}

const INITIAL_PRODUCTS_MAP = new Map(INITIAL_PRODUCTS.map(p => [p.id, p]));
const INITIAL_CERTS_MAP = new Map(INITIAL_CERTS.map(c => [c.id, c]));

// Resilient Image Normalizer — ALWAYS preserves custom user-uploaded/edited images
function sanitizeProductList(list) {
  if (!Array.isArray(list) || list.length === 0) return INITIAL_PRODUCTS;
  return list.map(item => {
    const defaultItem = INITIAL_PRODUCTS_MAP.get(item.id);
    let img = item.image;
    // Only fall back if the user has NOT provided an image, or if it is an invalid dev server path
    if (!img || (typeof img === 'string' && img.startsWith('/@fs'))) {
      img = defaultItem ? defaultItem.image : '';
    }
    return {
      ...item,
      image: img
    };
  });
}

function sanitizeCertList(list) {
  if (!Array.isArray(list) || list.length === 0) return INITIAL_CERTS;
  return list.map(item => {
    const defaultItem = INITIAL_CERTS_MAP.get(item.id);
    let logo = item.logo;
    if (!logo || (typeof logo === 'string' && logo.startsWith('/@fs'))) {
      logo = defaultItem ? defaultItem.logo : '';
    }
    return {
      ...item,
      logo: logo
    };
  });
}

export const DEFAULT_MAIN_CATEGORIES = [
  { id: 'spices', name: 'Spices & Seasonings', icon: 'Sparkles', color: '#ED6C1B', defaultHs: 'HS 0910', defaultPack: '25kg / 50kg PP Bags' },
  { id: 'agro', name: 'Agro Commodities', icon: 'Sprout', color: '#166534', defaultHs: 'HS 1006', defaultPack: '25kg / 50kg PP Bags / Bulk FCL' },
  { id: 'sanitaryware', name: 'Sanitaryware', icon: 'Bath', color: '#0369A1', defaultHs: 'HS 69101000', defaultPack: '5-Ply Export Carton / Wooden Pallets' },
  { id: 'tiles', name: 'Tiles & Ceramics', icon: 'Grid3X3', color: '#854D0E', defaultHs: 'HS 69072100', defaultPack: 'Export Box on Euro Pallets' },
  { id: 'hardware', name: 'Architectural Hardware', icon: 'Wrench', color: '#475569', defaultHs: 'HS 83024110', defaultPack: 'Box with Fixings / Master Export Carton' },
  { id: 'pvcpipe', name: 'PVC & CPVC Pipes', icon: 'Waves', color: '#0284C7', defaultHs: 'HS 39172300', defaultPack: 'Polywrap Bundles / Container Nested' }
];

function getInitialMainCategories() {
  if (typeof window === 'undefined') return DEFAULT_MAIN_CATEGORIES;
  try {
    const raw = localStorage.getItem('trishu_main_categories');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return DEFAULT_MAIN_CATEGORIES;
}

function getInitialCustomProducts() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('trishu_custom_products');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (e) {}
  return {};
}

export const INITIAL_CATEGORIES = {
  spices: PRODUCT_CATEGORIES,
  agro: AGRO_CATEGORIES,
  sanitaryware: SANITARYWARE_CATEGORIES,
  tiles: TILES_CATEGORIES,
  hardware: HARDWARE_CATEGORIES,
  pvcpipe: PVC_PIPE_CATEGORIES
};

function getInitialCategories() {
  if (typeof window === 'undefined') return INITIAL_CATEGORIES;
  try {
    const raw = localStorage.getItem('trishu_categories');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch (e) {}
  return INITIAL_CATEGORIES;
}

// IN-MEMORY FAST CACHE (Synchronous access for components)
const memoryCache = {
  products: sanitizeProductList(getInitialList('trishu_products', INITIAL_PRODUCTS)),
  agro: getInitialList('trishu_agro_products', INITIAL_AGRO_PRODUCTS),
  sanitaryware: getInitialList('trishu_sanitaryware_products', INITIAL_SANITARYWARE_PRODUCTS),
  tiles: getInitialList('trishu_tiles_products', INITIAL_TILES_PRODUCTS),
  hardware: getInitialList('trishu_hardware_products', INITIAL_HARDWARE_PRODUCTS),
  pvcpipe: getInitialList('trishu_pvcpipe_products', INITIAL_PVC_PIPE_PRODUCTS),
  blogs: getInitialList('trishu_blogs', INITIAL_BLOGS),
  certs: sanitizeCertList(getInitialList('trishu_certs', INITIAL_CERTS)),
  enquiries: getInitialList('trishu_enquiries', INITIAL_ENQUIRIES),
  categories: getInitialCategories(),
  mainCategories: getInitialMainCategories(),
  customProducts: getInitialCustomProducts()
};

import { 
  getCloudData, setCloudData, setCloudSingleItem, deleteCloudSingleItem,
  isFirebaseConnected, getFirebaseConfig, saveFirebaseConfig 
} from './firebase';

export { isFirebaseConnected, getFirebaseConfig, saveFirebaseConfig };

// ASYNC BOOTSTRAP: Load full persistent IndexedDB data + Cloud Sync
const STORE_KEYS = [
  { idbKey: 'products', memKey: 'products', lsKey: 'trishu_products' },
  { idbKey: 'agro', memKey: 'agro', lsKey: 'trishu_agro_products' },
  { idbKey: 'sanitaryware', memKey: 'sanitaryware', lsKey: 'trishu_sanitaryware_products' },
  { idbKey: 'tiles', memKey: 'tiles', lsKey: 'trishu_tiles_products' },
  { idbKey: 'hardware', memKey: 'hardware', lsKey: 'trishu_hardware_products' },
  { idbKey: 'pvcpipe', memKey: 'pvcpipe', lsKey: 'trishu_pvcpipe_products' },
  { idbKey: 'blogs', memKey: 'blogs', lsKey: 'trishu_blogs' },
  { idbKey: 'certs', memKey: 'certs', lsKey: 'trishu_certs' },
  { idbKey: 'enquiries', memKey: 'enquiries', lsKey: 'trishu_enquiries' },
  { idbKey: 'main_categories', memKey: 'mainCategories', lsKey: 'trishu_main_categories' },
  { idbKey: 'custom_products', memKey: 'customProducts', lsKey: 'trishu_custom_products' }
];

async function initIndexedDBStore() {
  let hasUpdates = false;

  // 1. Fast local cache from IndexedDB (0ms instant UI load)
  for (const k of STORE_KEYS) {
    const fromIdb = await idbGet(k.idbKey);
    if (fromIdb && Array.isArray(fromIdb) && fromIdb.length > 0) {
      memoryCache[k.memKey] = fromIdb;
      hasUpdates = true;
    } else {
      await idbSet(k.idbKey, memoryCache[k.memKey]);
    }
  }

  // Load custom categories from IndexedDB
  const categoriesFromIdb = await idbGet('categories');
  if (categoriesFromIdb && typeof categoriesFromIdb === 'object' && Object.keys(categoriesFromIdb).length > 0) {
    memoryCache.categories = categoriesFromIdb;
    hasUpdates = true;
  } else {
    await idbSet('categories', memoryCache.categories);
  }

  if (hasUpdates && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('trishu_store_sync'));
  }

  // 2. Asynchronous Cloud Database Synchronization (Firebase)
  if (isFirebaseConnected()) {
    try {
      let cloudUpdated = false;
      await Promise.all(STORE_KEYS.map(async (k) => {
        const cloudItems = await getCloudData(k.idbKey);
        if (cloudItems && Array.isArray(cloudItems) && cloudItems.length > 0) {
          memoryCache[k.memKey] = cloudItems;
          await idbSet(k.idbKey, cloudItems);
          try { localStorage.setItem(k.lsKey, JSON.stringify(cloudItems)); } catch (e) {}
          cloudUpdated = true;
        }
      }));

      // Cloud sync categories
      const cloudCats = await getCloudData('categories');
      if (cloudCats && Array.isArray(cloudCats) && cloudCats.length > 0) {
        const catMap = {};
        cloudCats.forEach(item => {
          if (item && item.id && Array.isArray(item.categories)) {
            catMap[item.id] = item.categories;
          }
        });
        if (Object.keys(catMap).length > 0) {
          memoryCache.categories = catMap;
          await idbSet('categories', catMap);
          try { localStorage.setItem('trishu_categories', JSON.stringify(catMap)); } catch (e) {}
          cloudUpdated = true;
        }
      }

      if (cloudUpdated && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('trishu_store_sync'));
      }
    } catch (err) {
      console.warn('Cloud sync error on startup:', err);
    }
  }
}

// Push all current local data to Firebase Cloud in parallel
export async function syncAllToCloud() {
  if (!isFirebaseConnected()) {
    return { success: false, message: 'Firebase is not connected. Please check configuration.' };
  }

  try {
    await Promise.all(STORE_KEYS.map(k => setCloudData(k.idbKey, memoryCache[k.memKey])));
    
    // Sync categories
    const cloudCats = Object.keys(memoryCache.categories).map(k => ({
      id: k,
      domain: k,
      categories: memoryCache.categories[k]
    }));
    await setCloudData('categories', cloudCats);

    return { success: true, message: 'All catalogue data successfully synchronized to Cloud in ultra-fast mode!' };
  } catch (err) {
    return { success: false, message: err.message || 'Failed to sync to cloud.' };
  }
}

// Pull all data from Firebase Cloud to local in parallel
export async function syncAllFromCloud() {
  if (!isFirebaseConnected()) {
    return { success: false, message: 'Firebase is not connected.' };
  }

  try {
    let count = 0;
    await Promise.all(STORE_KEYS.map(async (k) => {
      const cloudItems = await getCloudData(k.idbKey);
      if (cloudItems && Array.isArray(cloudItems) && cloudItems.length > 0) {
        memoryCache[k.memKey] = cloudItems;
        await idbSet(k.idbKey, cloudItems);
        try { localStorage.setItem(k.lsKey, JSON.stringify(cloudItems)); } catch (e) {}
        count++;
      }
    }));

    const cloudCats = await getCloudData('categories');
    if (cloudCats && Array.isArray(cloudCats) && cloudCats.length > 0) {
      const catMap = {};
      cloudCats.forEach(item => {
        if (item && item.id && Array.isArray(item.categories)) {
          catMap[item.id] = item.categories;
        }
      });
      if (Object.keys(catMap).length > 0) {
        memoryCache.categories = catMap;
        await idbSet('categories', catMap);
        try { localStorage.setItem('trishu_categories', JSON.stringify(catMap)); } catch (e) {}
        count++;
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('trishu_store_sync'));
    }
    return { success: true, message: `Successfully synced ${count} data categories from Cloud!` };
  } catch (err) {
    return { success: false, message: err.message || 'Failed to pull from cloud.' };
  }
}

// Auto-run bootstrap on module load & auto-sync when page/tab is viewed
let lastUserActionTime = 0;

if (typeof window !== 'undefined') {
  initIndexedDBStore();

  let lastSyncTime = 0;
  const triggerBackgroundSync = () => {
    const now = Date.now();
    // Do not run background sync if user recently took an action within 15 seconds
    if (now - lastUserActionTime < 15000) return;
    if (now - lastSyncTime > 8000 && isFirebaseConnected()) {
      lastSyncTime = now;
      initIndexedDBStore();
    }
  };

  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') triggerBackgroundSync();
  });
  window.addEventListener('focus', triggerBackgroundSync);
}

// Universal Persistence Handler
function persistData(memKey, idbKey, lsKey, data) {
  lastUserActionTime = Date.now();
  memoryCache[memKey] = data;

  // 1. Asynchronously save full dataset to IndexedDB (Instant local speed)
  idbSet(idbKey, data).catch(() => {});

  // 2. Best-effort save to localStorage
  try {
    localStorage.setItem(lsKey, JSON.stringify(data));
  } catch (err) {}

  // 3. Dispatch reactive update event immediately for 0ms UI response
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('trishu_store_updated', { detail: { key: memKey, data } }));
  }
}

// --- ULTRA-FAST CLIENT-SIDE IMAGE COMPRESSOR (< 30ms, ~20KB) ---
export function compressImageFile(file, maxWidth = 550, maxHeight = 550, quality = 0.68) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve('');
    if (!file.type || !file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => resolve(readerEvent.target.result);
      img.src = readerEvent.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// --- AUTHENTICATION ---
const AUTH_STORAGE_KEY = 'trishu_admin_auth_v3';

export function isAdminLoggedIn() {
  return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
}

export function loginAdmin(username, password) {
  const cleanUser = (username || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  if (
    (cleanUser === 'trishu impex' || cleanUser === 'trishuimpex') &&
    cleanPass === 'trishuimpex@123'
  ) {
    sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
    return { success: true };
  }
  return { success: false, message: 'Invalid Admin ID or Password. (ID: trishu impex)' };
}

export function logoutAdmin() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem('trishu_admin_auth');
  sessionStorage.removeItem('trishu_admin_auth_v2');
}

// --- PRODUCTS STORE ---
export function getProducts() {
  return sanitizeProductList(memoryCache.products);
}

export function saveProducts(list) {
  persistData('products', 'products', 'trishu_products', list);
}

export function addProduct(newProd) {
  const list = getProducts();
  const prodWithId = {
    ...newProd,
    id: newProd.id || `prod-${Date.now()}`
  };
  const updated = [prodWithId, ...list];
  saveProducts(updated);
  setCloudSingleItem('products', prodWithId).catch(() => {});
  return updated;
}

export function updateProduct(updatedProd) {
  const list = getProducts();
  const updated = list.map(p => (p.id === updatedProd.id ? { ...p, ...updatedProd } : p));
  saveProducts(updated);
  setCloudSingleItem('products', updatedProd).catch(() => {});
  return updated;
}

export function deleteProduct(id) {
  const list = getProducts();
  const updated = list.filter(p => String(p.id) !== String(id));
  saveProducts(updated);
  deleteCloudSingleItem('products', id, updated).catch(() => {});
  return updated;
}

// --- AGRO COMMODITIES STORE ---
export function getAgroProducts() {
  return memoryCache.agro;
}

export function saveAgroProducts(list) {
  persistData('agro', 'agro', 'trishu_agro_products', list);
}

export function addAgroProduct(newAgro) {
  const list = getAgroProducts();
  const agroWithId = {
    ...newAgro,
    id: newAgro.id || `agro-${Date.now()}`
  };
  const updated = [agroWithId, ...list];
  saveAgroProducts(updated);
  setCloudSingleItem('agro', agroWithId).catch(() => {});
  return updated;
}

export function updateAgroProduct(updatedAgro) {
  const list = getAgroProducts();
  const updated = list.map(p => (String(p.id) === String(updatedAgro.id) ? { ...p, ...updatedAgro } : p));
  saveAgroProducts(updated);
  setCloudSingleItem('agro', updatedAgro).catch(() => {});
  return updated;
}

export function deleteAgroProduct(id) {
  const list = getAgroProducts();
  const updated = list.filter(p => String(p.id) !== String(id));
  saveAgroProducts(updated);
  deleteCloudSingleItem('agro', id, updated).catch(() => {});
  return updated;
}

// --- SANITARYWARE STORE ---
export function getSanitarywareProducts() {
  return memoryCache.sanitaryware;
}

export function saveSanitarywareProducts(list) {
  persistData('sanitaryware', 'sanitaryware', 'trishu_sanitaryware_products', list);
}

export function addSanitarywareProduct(newProd) {
  const list = getSanitarywareProducts();
  const prodWithId = {
    ...newProd,
    id: newProd.id || `sanitary-${Date.now()}`
  };
  const updated = [prodWithId, ...list];
  saveSanitarywareProducts(updated);
  setCloudSingleItem('sanitaryware', prodWithId).catch(() => {});
  return updated;
}

export function updateSanitarywareProduct(updatedProd) {
  const list = getSanitarywareProducts();
  const updated = list.map(p => (String(p.id) === String(updatedProd.id) ? { ...p, ...updatedProd } : p));
  saveSanitarywareProducts(updated);
  setCloudSingleItem('sanitaryware', updatedProd).catch(() => {});
  return updated;
}

export function deleteSanitarywareProduct(id) {
  const list = getSanitarywareProducts();
  const updated = list.filter(p => String(p.id) !== String(id));
  saveSanitarywareProducts(updated);
  deleteCloudSingleItem('sanitaryware', id, updated).catch(() => {});
  return updated;
}

// --- TILES STORE ---
export function getTilesProducts() {
  return memoryCache.tiles;
}

export function saveTilesProducts(list) {
  persistData('tiles', 'tiles', 'trishu_tiles_products', list);
}

export function addTilesProduct(newProd) {
  const list = getTilesProducts();
  const prodWithId = {
    ...newProd,
    id: newProd.id || `tiles-${Date.now()}`
  };
  const updated = [prodWithId, ...list];
  saveTilesProducts(updated);
  setCloudSingleItem('tiles', prodWithId).catch(() => {});
  return updated;
}

export function updateTilesProduct(updatedProd) {
  const list = getTilesProducts();
  const updated = list.map(p => (String(p.id) === String(updatedProd.id) ? { ...p, ...updatedProd } : p));
  saveTilesProducts(updated);
  setCloudSingleItem('tiles', updatedProd).catch(() => {});
  return updated;
}

export function deleteTilesProduct(id) {
  const list = getTilesProducts();
  const updated = list.filter(p => String(p.id) !== String(id));
  saveTilesProducts(updated);
  deleteCloudSingleItem('tiles', id, updated).catch(() => {});
  return updated;
}

// --- HARDWARE STORE ---
export function getHardwareProducts() {
  return memoryCache.hardware;
}

export function saveHardwareProducts(list) {
  persistData('hardware', 'hardware', 'trishu_hardware_products', list);
}

export function addHardwareProduct(newProd) {
  const list = getHardwareProducts();
  const prodWithId = {
    ...newProd,
    id: newProd.id || `hard-${Date.now()}`
  };
  const updated = [prodWithId, ...list];
  saveHardwareProducts(updated);
  setCloudSingleItem('hardware', prodWithId).catch(() => {});
  return updated;
}

export function updateHardwareProduct(updatedProd) {
  const list = getHardwareProducts();
  const updated = list.map(p => (String(p.id) === String(updatedProd.id) ? { ...p, ...updatedProd } : p));
  saveHardwareProducts(updated);
  setCloudSingleItem('hardware', updatedProd).catch(() => {});
  return updated;
}

export function deleteHardwareProduct(id) {
  const list = getHardwareProducts();
  const updated = list.filter(p => String(p.id) !== String(id));
  saveHardwareProducts(updated);
  deleteCloudSingleItem('hardware', id, updated).catch(() => {});
  return updated;
}

// --- PVC PIPE STORE ---
export function getPvcPipeProducts() {
  return memoryCache.pvcpipe;
}

export function savePvcPipeProducts(list) {
  persistData('pvcpipe', 'pvcpipe', 'trishu_pvcpipe_products', list);
}

export function addPvcPipeProduct(newProd) {
  const list = getPvcPipeProducts();
  const prodWithId = {
    ...newProd,
    id: newProd.id || `pvc-${Date.now()}`
  };
  const updated = [prodWithId, ...list];
  savePvcPipeProducts(updated);
  setCloudSingleItem('pvcpipe', prodWithId).catch(() => {});
  return updated;
}

export function updatePvcPipeProduct(updatedProd) {
  const list = getPvcPipeProducts();
  const updated = list.map(p => (String(p.id) === String(updatedProd.id) ? { ...p, ...updatedProd } : p));
  savePvcPipeProducts(updated);
  setCloudSingleItem('pvcpipe', updatedProd).catch(() => {});
  return updated;
}

export function deletePvcPipeProduct(id) {
  const list = getPvcPipeProducts();
  const updated = list.filter(p => String(p.id) !== String(id));
  savePvcPipeProducts(updated);
  deleteCloudSingleItem('pvcpipe', id, updated).catch(() => {});
  return updated;
}

// --- BLOGS STORE ---
export function getBlogs() {
  return memoryCache.blogs;
}

export function saveBlogs(list) {
  persistData('blogs', 'blogs', 'trishu_blogs', list);
}

export function addBlog(newBlog) {
  const list = getBlogs();
  const blogWithId = {
    ...newBlog,
    id: newBlog.id || Date.now(),
    date: newBlog.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  };
  const updated = [blogWithId, ...list];
  saveBlogs(updated);
  setCloudSingleItem('blogs', blogWithId).catch(() => {});
  return updated;
}

export function updateBlog(updatedBlog) {
  const list = getBlogs();
  const updated = list.map(b => (String(b.id) === String(updatedBlog.id) ? { ...b, ...updatedBlog } : b));
  saveBlogs(updated);
  setCloudSingleItem('blogs', updatedBlog).catch(() => {});
  return updated;
}

export function deleteBlog(id) {
  const list = getBlogs();
  const updated = list.filter(b => String(b.id) !== String(id));
  saveBlogs(updated);
  deleteCloudSingleItem('blogs', id, updated).catch(() => {});
  return updated;
}

// --- CERTIFICATES STORE ---
export function getCertificates() {
  return sanitizeCertList(memoryCache.certs);
}

export function saveCertificates(list) {
  persistData('certs', 'certs', 'trishu_certs', list);
}

export function addCertificate(newCert) {
  const list = getCertificates();
  const certWithId = {
    ...newCert,
    id: newCert.id || `cert-${Date.now()}`
  };
  const updated = [...list, certWithId];
  saveCertificates(updated);
  setCloudSingleItem('certs', certWithId).catch(() => {});
  return updated;
}

export function updateCertificate(updatedCert) {
  const list = getCertificates();
  const updated = list.map(c => (String(c.id) === String(updatedCert.id) ? { ...c, ...updatedCert } : c));
  saveCertificates(updated);
  setCloudSingleItem('certs', updatedCert).catch(() => {});
  return updated;
}

export function deleteCertificate(id) {
  const list = getCertificates();
  const updated = list.filter(c => String(c.id) !== String(id));
  saveCertificates(updated);
  deleteCloudSingleItem('certs', id, updated).catch(() => {});
  return updated;
}

// --- ENQUIRIES STORE ---
export function getEnquiries() {
  return memoryCache.enquiries;
}

export function saveEnquiries(list) {
  persistData('enquiries', 'enquiries', 'trishu_enquiries', list);
}

export function addEnquiry(enquiryData) {
  const list = getEnquiries();
  const newEnq = {
    ...enquiryData,
    id: `enq-${Date.now()}`,
    status: 'New',
    date: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }) + ' ' + new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
  const updated = [newEnq, ...list];
  saveEnquiries(updated);
  setCloudSingleItem('enquiries', newEnq).catch(() => {});
  return updated;
}

export function updateEnquiryStatus(id, newStatus) {
  const list = getEnquiries();
  let updatedEnq = null;
  const updated = list.map(item => {
    if (String(item.id) === String(id)) {
      updatedEnq = { ...item, status: newStatus };
      return updatedEnq;
    }
    return item;
  });
  saveEnquiries(updated);
  if (updatedEnq) {
    setCloudSingleItem('enquiries', updatedEnq).catch(() => {});
  }
  return updated;
}

export function deleteEnquiry(id) {
  const list = getEnquiries();
  const updated = list.filter(item => String(item.id) !== String(id));
  saveEnquiries(updated);
  deleteCloudSingleItem('enquiries', id, updated).catch(() => {});
  return updated;
}

export function exportEnquiriesCSV(filter = 'all') {
  const list = getEnquiries();
  const filtered = list.filter(e => {
    if (filter === 'all') return true;
    const source = (e.source || '').toLowerCase();
    if (filter === 'product_quote') return source.includes('product') || source.includes('quote');
    if (filter === 'contact_form') return source.includes('contact');
    return true;
  });

  if (filtered.length === 0) {
    alert('No enquiry records available to export.');
    return;
  }

  const headers = ['ID', 'Date', 'Type / Source', 'Buyer Name', 'Company', 'Email', 'Phone', 'Product Requested', 'Quantity', 'Destination Port', 'Status', 'Notes'];
  
  const rows = filtered.map(e => [
    `"${e.id || ''}"`,
    `"${e.date || ''}"`,
    `"${e.source || ''}"`,
    `"${(e.name || '').replace(/"/g, '""')}"`,
    `"${(e.company || '').replace(/"/g, '""')}"`,
    `"${e.email || ''}"`,
    `"${e.phone || ''}"`,
    `"${(e.product || '').replace(/"/g, '""')}"`,
    `"${(e.quantity || '').replace(/"/g, '""')}"`,
    `"${(e.destinationPort || '').replace(/"/g, '""')}"`,
    `"${e.status || 'New'}"`,
    `"${(e.notes || e.message || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `trishu_enquiries_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// --- CATEGORY & SUBCATEGORY STORE ---
function normalizeDomainKey(domain) {
  if (!domain) return 'spices';
  const d = String(domain).toLowerCase().trim();
  if (d === 'pvc-pipes' || d === 'pvc' || d === 'pvcpipe' || d === 'pvc_pipe') return 'pvcpipe';
  return d;
}

export function getCategories(domain) {
  const normKey = normalizeDomainKey(domain);
  const list = (memoryCache.categories && memoryCache.categories[normKey]) || INITIAL_CATEGORIES[normKey] || ['All'];
  if (!list.includes('All')) {
    return ['All', ...list];
  }
  return list;
}

export function getAllCategories() {
  return { ...memoryCache.categories };
}

function persistCategories(catMap) {
  lastUserActionTime = Date.now();
  memoryCache.categories = { ...catMap };
  idbSet('categories', catMap).catch(() => {});
  try {
    localStorage.setItem('trishu_categories', JSON.stringify(catMap));
  } catch (e) {}

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('trishu_store_updated', { detail: { key: 'categories', data: catMap } }));
  }

  // Cloud sync
  const cloudList = Object.keys(catMap).map(k => ({
    id: k,
    domain: k,
    categories: catMap[k]
  }));
  setCloudData('categories', cloudList).catch(() => {});
}

export function addCategory(domain, categoryName) {
  const normKey = normalizeDomainKey(domain);
  const trimmed = (categoryName || '').trim();
  if (!trimmed) return getCategories(normKey);

  const current = [...getCategories(normKey)];
  if (current.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
    return current;
  }

  const updated = [...current, trimmed];
  const all = {
    ...memoryCache.categories,
    [normKey]: updated
  };
  persistCategories(all);
  return updated;
}

export function updateCategory(domain, oldName, newName) {
  const normKey = normalizeDomainKey(domain);
  const oldTrimmed = (oldName || '').trim();
  const newTrimmed = (newName || '').trim();

  if (!oldTrimmed || !newTrimmed || oldTrimmed === 'All' || newTrimmed === 'All' || oldTrimmed === newTrimmed) {
    return getCategories(normKey);
  }

  const current = [...getCategories(normKey)];
  const updated = current.map(c => c === oldTrimmed ? newTrimmed : c);
  const all = {
    ...memoryCache.categories,
    [normKey]: updated
  };
  persistCategories(all);

  // Re-tag products in that domain
  if (normKey === 'spices') {
    const prods = getProducts().map(p => (p.category === oldTrimmed || p.cat === oldTrimmed) ? { ...p, category: newTrimmed, cat: newTrimmed } : p);
    saveProducts(prods);
  } else if (normKey === 'agro') {
    const prods = getAgroProducts().map(p => (p.category === oldTrimmed || p.cat === oldTrimmed) ? { ...p, category: newTrimmed, cat: newTrimmed } : p);
    saveAgroProducts(prods);
  } else if (normKey === 'sanitaryware') {
    const prods = getSanitarywareProducts().map(p => (p.category === oldTrimmed || p.cat === oldTrimmed) ? { ...p, category: newTrimmed, cat: newTrimmed } : p);
    saveSanitarywareProducts(prods);
  } else if (normKey === 'tiles') {
    const prods = getTilesProducts().map(p => (p.category === oldTrimmed || p.cat === oldTrimmed) ? { ...p, category: newTrimmed, cat: newTrimmed } : p);
    saveTilesProducts(prods);
  } else if (normKey === 'hardware') {
    const prods = getHardwareProducts().map(p => (p.category === oldTrimmed || p.cat === oldTrimmed) ? { ...p, category: newTrimmed, cat: newTrimmed } : p);
    saveHardwareProducts(prods);
  } else if (normKey === 'pvcpipe') {
    const prods = getPvcPipeProducts().map(p => (p.category === oldTrimmed || p.cat === oldTrimmed) ? { ...p, category: newTrimmed, cat: newTrimmed } : p);
    savePvcPipeProducts(prods);
  }

  return updated;
}

export function deleteCategory(domain, categoryName) {
  const normKey = normalizeDomainKey(domain);
  const trimmed = (categoryName || '').trim();

  if (!trimmed || trimmed === 'All') {
    return getCategories(normKey);
  }

  const current = [...getCategories(normKey)];
  const updated = current.filter(c => c !== trimmed);
  const all = {
    ...memoryCache.categories,
    [normKey]: updated
  };
  persistCategories(all);

  const fallbackCat = updated.find(c => c !== 'All') || 'General';

  // Re-assign orphaned products to fallbackCat
  if (normKey === 'spices') {
    const prods = getProducts().map(p => (p.category === trimmed || p.cat === trimmed) ? { ...p, category: fallbackCat, cat: fallbackCat } : p);
    saveProducts(prods);
  } else if (normKey === 'agro') {
    const prods = getAgroProducts().map(p => (p.category === trimmed || p.cat === trimmed) ? { ...p, category: fallbackCat, cat: fallbackCat } : p);
    saveAgroProducts(prods);
  } else if (normKey === 'sanitaryware') {
    const prods = getSanitarywareProducts().map(p => (p.category === trimmed || p.cat === trimmed) ? { ...p, category: fallbackCat, cat: fallbackCat } : p);
    saveSanitarywareProducts(prods);
  } else if (normKey === 'tiles') {
    const prods = getTilesProducts().map(p => (p.category === trimmed || p.cat === trimmed) ? { ...p, category: fallbackCat, cat: fallbackCat } : p);
    saveTilesProducts(prods);
  } else if (normKey === 'hardware') {
    const prods = getHardwareProducts().map(p => (p.category === trimmed || p.cat === trimmed) ? { ...p, category: fallbackCat, cat: fallbackCat } : p);
    saveHardwareProducts(prods);
  } else if (normKey === 'pvcpipe') {
    const prods = getPvcPipeProducts().map(p => (p.category === trimmed || p.cat === trimmed) ? { ...p, category: fallbackCat, cat: fallbackCat } : p);
    savePvcPipeProducts(prods);
  }

  return updated;
}

// --- MAIN CATEGORY (CATALOG) CRUD ---
export function getMainCategories() {
  const list = memoryCache.mainCategories;
  if (Array.isArray(list) && list.length > 0) return list;
  return DEFAULT_MAIN_CATEGORIES;
}

export function saveMainCategories(list) {
  persistData('mainCategories', 'main_categories', 'trishu_main_categories', list);
  setCloudData('main_categories', list).catch(() => {});
}

export function addMainCategory({ name, color = '#8B5CF6', icon = 'Package', defaultHs = 'HS 0000', defaultPack = 'Export Standard Packing', subcategories = [] }) {
  const trimmed = (name || '').trim();
  if (!trimmed) return getMainCategories();

  const list = [...getMainCategories()];
  const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const id = slug && !list.some(c => c.id === slug) ? slug : `cat_${Date.now()}`;

  const newCat = {
    id,
    name: trimmed,
    icon: icon || 'Package',
    color: color || '#8B5CF6',
    defaultHs: defaultHs || 'HS Standard',
    defaultPack: defaultPack || 'Standard Export Packing'
  };

  const updated = [...list, newCat];
  saveMainCategories(updated);

  // Initialize subcategories for this new main category
  const initialSubs = Array.isArray(subcategories) && subcategories.length > 0 
    ? (subcategories.includes('All') ? subcategories : ['All', ...subcategories])
    : ['All', 'General'];
  
  const allCats = {
    ...memoryCache.categories,
    [id]: initialSubs
  };
  persistCategories(allCats);

  return updated;
}

export function updateMainCategory(id, updatedFields) {
  const list = [...getMainCategories()];
  const updated = list.map(c => {
    if (c.id === id) {
      return {
        ...c,
        ...updatedFields,
        name: updatedFields.name !== undefined ? updatedFields.name.trim() : c.name
      };
    }
    return c;
  });
  saveMainCategories(updated);
  return updated;
}

export function deleteMainCategory(id) {
  lastUserActionTime = Date.now();
  const list = [...getMainCategories()];
  if (list.length <= 1) {
    alert('At least one category must remain.');
    return list;
  }
  const updated = list.filter(c => c.id !== id);
  saveMainCategories(updated);
  deleteCloudSingleItem('main_categories', id, updated).catch(() => {});

  // Clean up subcategories
  const allCats = { ...memoryCache.categories };
  delete allCats[id];
  persistCategories(allCats);
  deleteCloudSingleItem('categories', id).catch(() => {});

  // Clean up custom products if any
  if (memoryCache.customProducts && memoryCache.customProducts[id]) {
    const updatedCustom = { ...memoryCache.customProducts };
    delete updatedCustom[id];
    persistData('customProducts', 'custom_products', 'trishu_custom_products', updatedCustom);
    deleteCloudSingleItem('custom_products', id).catch(() => {});
  }

  return updated;
}

// Universal Domain Products Getter / Setter
export function getDomainProducts(domainId) {
  const normKey = normalizeDomainKey(domainId);
  if (normKey === 'spices') return getProducts();
  if (normKey === 'agro') return getAgroProducts();
  if (normKey === 'sanitaryware') return getSanitarywareProducts();
  if (normKey === 'tiles') return getTilesProducts();
  if (normKey === 'hardware') return getHardwareProducts();
  if (normKey === 'pvcpipe') return getPvcPipeProducts();
  return (memoryCache.customProducts && memoryCache.customProducts[normKey]) || [];
}

export function addDomainProduct(domainId, product) {
  const normKey = normalizeDomainKey(domainId);
  if (normKey === 'spices') return addProduct(product);
  if (normKey === 'agro') return addAgroProduct(product);
  if (normKey === 'sanitaryware') return addSanitarywareProduct(product);
  if (normKey === 'tiles') return addTilesProduct(product);
  if (normKey === 'hardware') return addHardwareProduct(product);
  if (normKey === 'pvcpipe') return addPvcPipeProduct(product);

  const current = getDomainProducts(normKey);
  const prodWithId = {
    ...product,
    id: product.id || `custom_${normKey}_${Date.now()}`
  };
  const updated = [prodWithId, ...current];
  const allCustom = {
    ...(memoryCache.customProducts || {}),
    [normKey]: updated
  };
  persistData('customProducts', 'custom_products', 'trishu_custom_products', allCustom);
  return updated;
}

export function updateDomainProduct(domainId, product) {
  const normKey = normalizeDomainKey(domainId);
  if (normKey === 'spices') return updateProduct(product);
  if (normKey === 'agro') return updateAgroProduct(product);
  if (normKey === 'sanitaryware') return updateSanitarywareProduct(product);
  if (normKey === 'tiles') return updateTilesProduct(product);
  if (normKey === 'hardware') return updateHardwareProduct(product);
  if (normKey === 'pvcpipe') return updatePvcPipeProduct(product);

  const current = getDomainProducts(normKey);
  const updated = current.map(p => (String(p.id) === String(product.id) ? { ...p, ...product } : p));
  const allCustom = {
    ...(memoryCache.customProducts || {}),
    [normKey]: updated
  };
  persistData('customProducts', 'custom_products', 'trishu_custom_products', allCustom);
  return updated;
}

export function deleteDomainProduct(domainId, productId) {
  const normKey = normalizeDomainKey(domainId);
  if (normKey === 'spices') return deleteProduct(productId);
  if (normKey === 'agro') return deleteAgroProduct(productId);
  if (normKey === 'sanitaryware') return deleteSanitarywareProduct(productId);
  if (normKey === 'tiles') return deleteTilesProduct(productId);
  if (normKey === 'hardware') return deleteHardwareProduct(productId);
  if (normKey === 'pvcpipe') return deletePvcPipeProduct(productId);

  const current = getDomainProducts(normKey);
  const updated = current.filter(p => String(p.id) !== String(productId));
  const allCustom = {
    ...(memoryCache.customProducts || {}),
    [normKey]: updated
  };
  persistData('customProducts', 'custom_products', 'trishu_custom_products', allCustom);
  return updated;
}

// Reset everything in IndexedDB and LocalStorage
export async function resetAllCustomData() {
  await idbClear();
  localStorage.removeItem('trishu_products');
  localStorage.removeItem('trishu_agro_products');
  localStorage.removeItem('trishu_sanitaryware_products');
  localStorage.removeItem('trishu_tiles_products');
  localStorage.removeItem('trishu_hardware_products');
  localStorage.removeItem('trishu_pvcpipe_products');
  localStorage.removeItem('trishu_blogs');
  localStorage.removeItem('trishu_certs');
  localStorage.removeItem('trishu_enquiries');
  localStorage.removeItem('trishu_categories');
  localStorage.removeItem('trishu_main_categories');
  localStorage.removeItem('trishu_custom_products');
  window.location.reload();
}
