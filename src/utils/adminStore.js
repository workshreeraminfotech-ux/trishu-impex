// Centralized Dynamic Data & Admin Store — Trishu Impex
// Persists Products, Blogs, Certificates, and Enquiries dynamically in localStorage with safe storage and automatic image compression

import { PRODUCTS as INITIAL_PRODUCTS, PRODUCT_CATEGORIES } from '../data/products';
import { AGRO_PRODUCTS as INITIAL_AGRO_PRODUCTS, AGRO_CATEGORIES } from '../data/agroProducts';
import { SANITARYWARE_PRODUCTS as INITIAL_SANITARYWARE_PRODUCTS, SANITARYWARE_CATEGORIES } from '../data/sanitarywareProducts';
import { TILES_PRODUCTS as INITIAL_TILES_PRODUCTS, TILES_CATEGORIES } from '../data/tilesProducts';
import { HARDWARE_PRODUCTS as INITIAL_HARDWARE_PRODUCTS, HARDWARE_CATEGORIES } from '../data/hardwareProducts';
import { PVC_PIPE_PRODUCTS as INITIAL_PVC_PIPE_PRODUCTS, PVC_PIPE_CATEGORIES } from '../data/pvcPipeProducts';
import { BLOGS as INITIAL_BLOGS } from '../data/blogs';

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

// --- HIGH PERFORMANCE CLIENT-SIDE IMAGE COMPRESSOR ---
// Automatically downscales large camera photos (e.g. 5MB+) into lightweight WebP/JPEG (approx. 20-40KB)
export function compressImageFile(file, maxWidth = 700, maxHeight = 700, quality = 0.72) {
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

        // Convert to optimized JPEG DataURL
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

// Safe LocalStorage Set with Quota Handling
function safeSetItem(key, data) {
  try {
    const stringified = JSON.stringify(data);
    localStorage.setItem(key, stringified);
    return true;
  } catch (err) {
    console.error(`Storage error for key ${key}:`, err);
    if (err.name === 'QuotaExceededError' || err.code === 22 || err.code === 1014) {
      alert('Browser storage is full! Please use smaller images or clear browser cache.');
    }
    return false;
  }
}

// --- AUTHENTICATION ---
export function isAdminLoggedIn() {
  return sessionStorage.getItem('trishu_admin_auth') === 'true';
}

export function loginAdmin(username, password) {
  if ((username === 'admin' || username === 'trishu') && (password === 'admin123' || password === 'trishu2026#')) {
    sessionStorage.setItem('trishu_admin_auth', 'true');
    return { success: true };
  }
  return { success: false, message: 'Invalid Admin Username or Password' };
}

export function logoutAdmin() {
  sessionStorage.removeItem('trishu_admin_auth');
}

// --- PRODUCTS STORE ---
export function getProducts() {
  const saved = localStorage.getItem('trishu_products');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved products', e);
    }
  }
  return INITIAL_PRODUCTS;
}

export function saveProducts(productsList) {
  safeSetItem('trishu_products', productsList);
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
  const saved = localStorage.getItem('trishu_agro_products');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved agro products', e);
    }
  }
  return INITIAL_AGRO_PRODUCTS;
}

export function saveAgroProducts(agroList) {
  safeSetItem('trishu_agro_products', agroList);
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
  const saved = localStorage.getItem('trishu_sanitaryware_products');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved sanitaryware products', e);
    }
  }
  return INITIAL_SANITARYWARE_PRODUCTS;
}

export function saveSanitarywareProducts(list) {
  safeSetItem('trishu_sanitaryware_products', list);
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
  const saved = localStorage.getItem('trishu_tiles_products');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved tiles products', e);
    }
  }
  return INITIAL_TILES_PRODUCTS;
}

export function saveTilesProducts(list) {
  safeSetItem('trishu_tiles_products', list);
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
  const saved = localStorage.getItem('trishu_hardware_products');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved hardware products', e);
    }
  }
  return INITIAL_HARDWARE_PRODUCTS;
}

export function saveHardwareProducts(list) {
  safeSetItem('trishu_hardware_products', list);
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
  const saved = localStorage.getItem('trishu_pvcpipe_products');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved pvc pipe products', e);
    }
  }
  return INITIAL_PVC_PIPE_PRODUCTS;
}

export function savePvcPipeProducts(list) {
  safeSetItem('trishu_pvcpipe_products', list);
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
  const saved = localStorage.getItem('trishu_blogs');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved blogs', e);
    }
  }
  return INITIAL_BLOGS;
}

export function saveBlogs(blogsList) {
  safeSetItem('trishu_blogs', blogsList);
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
  const saved = localStorage.getItem('trishu_certs');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved certs', e);
    }
  }
  return INITIAL_CERTS;
}

export function saveCertificates(certsList) {
  safeSetItem('trishu_certs', certsList);
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

export function getEnquiries() {
  const saved = localStorage.getItem('trishu_enquiries');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved enquiries', e);
    }
  }
  return INITIAL_ENQUIRIES;
}

export function saveEnquiries(enquiryList) {
  safeSetItem('trishu_enquiries', enquiryList);
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
