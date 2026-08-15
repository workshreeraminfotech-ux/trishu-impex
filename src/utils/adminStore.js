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

import apedaLogo from '../assets/certificate/apeda.png';
import spicesBoardLogo from '../assets/certificate/spices board.png';
import fdaLogo from '../assets/certificate/fda.png';
import isoLogo from '../assets/certificate/iso.png';
import fssaiLogo from '../assets/certificate/fssai.png';
import halalLogo from '../assets/certificate/halal.png';

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
  enquiries: getInitialList('trishu_enquiries', INITIAL_ENQUIRIES)
};

import { getCloudData, setCloudData, isFirebaseConnected, getFirebaseConfig, saveFirebaseConfig } from './firebase';

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
  { idbKey: 'enquiries', memKey: 'enquiries', lsKey: 'trishu_enquiries' }
];

async function initIndexedDBStore() {
  let hasUpdates = false;

  // 1. Fast local cache from IndexedDB
  for (const k of STORE_KEYS) {
    const fromIdb = await idbGet(k.idbKey);
    if (fromIdb && Array.isArray(fromIdb) && fromIdb.length > 0) {
      memoryCache[k.memKey] = fromIdb;
      hasUpdates = true;
    } else {
      await idbSet(k.idbKey, memoryCache[k.memKey]);
    }
  }

  if (hasUpdates && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('trishu_store_sync'));
  }

  // 2. Asynchronous Cloud Database Synchronization (Firebase)
  if (isFirebaseConnected()) {
    try {
      let cloudUpdated = false;
      for (const k of STORE_KEYS) {
        const cloudItems = await getCloudData(k.idbKey);
        if (cloudItems && Array.isArray(cloudItems) && cloudItems.length > 0) {
          memoryCache[k.memKey] = cloudItems;
          await idbSet(k.idbKey, cloudItems);
          try { localStorage.setItem(k.lsKey, JSON.stringify(cloudItems)); } catch (e) {}
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

// Push all current local data to Firebase Cloud
export async function syncAllToCloud() {
  if (!isFirebaseConnected()) {
    return { success: false, message: 'Firebase is not connected. Please enter your Firebase configuration.' };
  }

  try {
    for (const k of STORE_KEYS) {
      await setCloudData(k.idbKey, memoryCache[k.memKey]);
    }
    return { success: true, message: 'All website data successfully uploaded to Firebase Cloud!' };
  } catch (err) {
    return { success: false, message: err.message || 'Failed to sync to cloud.' };
  }
}

// Pull all data from Firebase Cloud to local
export async function syncAllFromCloud() {
  if (!isFirebaseConnected()) {
    return { success: false, message: 'Firebase is not connected.' };
  }

  try {
    let count = 0;
    for (const k of STORE_KEYS) {
      const cloudItems = await getCloudData(k.idbKey);
      if (cloudItems && Array.isArray(cloudItems) && cloudItems.length > 0) {
        memoryCache[k.memKey] = cloudItems;
        await idbSet(k.idbKey, cloudItems);
        try { localStorage.setItem(k.lsKey, JSON.stringify(cloudItems)); } catch (e) {}
        count++;
      }
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('trishu_store_sync'));
    }
    return { success: true, message: `Successfully synced ${count} data collections from Firebase Cloud!` };
  } catch (err) {
    return { success: false, message: err.message || 'Failed to pull from cloud.' };
  }
}

// Auto-run bootstrap on module load
if (typeof window !== 'undefined') {
  initIndexedDBStore();
}

// Universal Persistence Handler
function persistData(memKey, idbKey, lsKey, data) {
  memoryCache[memKey] = data;

  // 1. Asynchronously save full dataset to IndexedDB (Unlimited capacity, never fails)
  idbSet(idbKey, data).catch(() => {});

  // 2. Best-effort save to localStorage
  try {
    localStorage.setItem(lsKey, JSON.stringify(data));
  } catch (err) {}

  // 3. Save to Firebase Cloud Firestore
  if (isFirebaseConnected()) {
    setCloudData(idbKey, data).catch(err => console.warn('Background cloud save error:', err));
  }

  // 4. Dispatch reactive update event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('trishu_store_updated', { detail: { key: memKey, data } }));
  }
}

// --- CLIENT-SIDE IMAGE OPTIMIZER & CONVERTER ---
export function compressImageFile(file, maxWidth = 800, maxHeight = 800, quality = 0.75) {
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
  return updated;
}

export function updateProduct(updatedProd) {
  const list = getProducts();
  const updated = list.map(p => (p.id === updatedProd.id ? { ...p, ...updatedProd } : p));
  saveProducts(updated);
  return updated;
}

export function deleteProduct(id) {
  const list = getProducts();
  const updated = list.filter(p => p.id !== id);
  saveProducts(updated);
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
  return updated;
}

export function updateAgroProduct(updatedAgro) {
  const list = getAgroProducts();
  const updated = list.map(p => (p.id === updatedAgro.id ? { ...p, ...updatedAgro } : p));
  saveAgroProducts(updated);
  return updated;
}

export function deleteAgroProduct(id) {
  const list = getAgroProducts();
  const updated = list.filter(p => p.id !== id);
  saveAgroProducts(updated);
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
  return updated;
}

export function updateSanitarywareProduct(updatedProd) {
  const list = getSanitarywareProducts();
  const updated = list.map(p => (p.id === updatedProd.id ? { ...p, ...updatedProd } : p));
  saveSanitarywareProducts(updated);
  return updated;
}

export function deleteSanitarywareProduct(id) {
  const list = getSanitarywareProducts();
  const updated = list.filter(p => p.id !== id);
  saveSanitarywareProducts(updated);
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
  return updated;
}

export function updateTilesProduct(updatedProd) {
  const list = getTilesProducts();
  const updated = list.map(p => (p.id === updatedProd.id ? { ...p, ...updatedProd } : p));
  saveTilesProducts(updated);
  return updated;
}

export function deleteTilesProduct(id) {
  const list = getTilesProducts();
  const updated = list.filter(p => p.id !== id);
  saveTilesProducts(updated);
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
  return updated;
}

export function updateHardwareProduct(updatedProd) {
  const list = getHardwareProducts();
  const updated = list.map(p => (p.id === updatedProd.id ? { ...p, ...updatedProd } : p));
  saveHardwareProducts(updated);
  return updated;
}

export function deleteHardwareProduct(id) {
  const list = getHardwareProducts();
  const updated = list.filter(p => p.id !== id);
  saveHardwareProducts(updated);
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
  return updated;
}

export function updatePvcPipeProduct(updatedProd) {
  const list = getPvcPipeProducts();
  const updated = list.map(p => (p.id === updatedProd.id ? { ...p, ...updatedProd } : p));
  savePvcPipeProducts(updated);
  return updated;
}

export function deletePvcPipeProduct(id) {
  const list = getPvcPipeProducts();
  const updated = list.filter(p => p.id !== id);
  savePvcPipeProducts(updated);
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
  return updated;
}

export function updateBlog(updatedBlog) {
  const list = getBlogs();
  const updated = list.map(b => (b.id === updatedBlog.id ? { ...b, ...updatedBlog } : b));
  saveBlogs(updated);
  return updated;
}

export function deleteBlog(id) {
  const list = getBlogs();
  const updated = list.filter(b => b.id !== id);
  saveBlogs(updated);
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
  return updated;
}

export function updateCertificate(updatedCert) {
  const list = getCertificates();
  const updated = list.map(c => (c.id === updatedCert.id ? { ...c, ...updatedCert } : c));
  saveCertificates(updated);
  return updated;
}

export function deleteCertificate(id) {
  const list = getCertificates();
  const updated = list.filter(c => c.id !== id);
  saveCertificates(updated);
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
  return updated;
}

export function updateEnquiryStatus(id, newStatus) {
  const list = getEnquiries();
  const updated = list.map(item => (item.id === id ? { ...item, status: newStatus } : item));
  saveEnquiries(updated);
  return updated;
}

export function deleteEnquiry(id) {
  const list = getEnquiries();
  const updated = list.filter(item => item.id !== id);
  saveEnquiries(updated);
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
  window.location.reload();
}
