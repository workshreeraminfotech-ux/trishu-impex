import React, { useState, useEffect } from 'react';
import { 
  Package, FileText, Award, LogOut, Plus, Trash2, Edit3, Search, 
  CheckCircle2, X, Upload, ShieldCheck, ExternalLink, RefreshCw,
  Inbox, MessageSquare, Mail, Phone, Clock, Globe, AlertCircle, Download,
  Sprout, Bath, Grid3X3, Wrench, Waves, Sparkles, Cloud, Database, Save, Zap, Check, HelpCircle,
  Tag, Layers, FolderPlus, Box, Leaf, Factory, Truck, Flame, Anchor, Palette
} from 'lucide-react';
import AdminLogin from './AdminLogin';
import { 
  isAdminLoggedIn, logoutAdmin, compressImageFile, resetAllCustomData,
  getProducts, addProduct, updateProduct, deleteProduct,
  getAgroProducts, addAgroProduct, updateAgroProduct, deleteAgroProduct,
  getSanitarywareProducts, addSanitarywareProduct, updateSanitarywareProduct, deleteSanitarywareProduct,
  getTilesProducts, addTilesProduct, updateTilesProduct, deleteTilesProduct,
  getHardwareProducts, addHardwareProduct, updateHardwareProduct, deleteHardwareProduct,
  getPvcPipeProducts, addPvcPipeProduct, updatePvcPipeProduct, deletePvcPipeProduct,
  getBlogs, addBlog, updateBlog, deleteBlog,
  getCertificates, addCertificate, updateCertificate, deleteCertificate,
  getEnquiries, updateEnquiryStatus, deleteEnquiry, exportEnquiriesCSV,
  getEnquiryEmailConfig, saveEnquiryEmailConfig, sendEnquiryEmail,
  isFirebaseConnected, getFirebaseConfig, saveFirebaseConfig, syncAllToCloud, syncAllFromCloud,
  getCategories, getAllCategories, addCategory, updateCategory, deleteCategory,
  getMainCategories, addMainCategory, updateMainCategory, deleteMainCategory,
  getDomainProducts, addDomainProduct, updateDomainProduct, deleteDomainProduct
} from '../utils/adminStore';

const ICON_OPTIONS = [
  { name: 'Sparkles', label: 'Sparkles (Spices / Food)', icon: Sparkles },
  { name: 'Sprout', label: 'Sprout (Agro / Grains)', icon: Sprout },
  { name: 'Bath', label: 'Bath (Sanitaryware)', icon: Bath },
  { name: 'Grid3X3', label: 'Grid (Tiles / Ceramics)', icon: Grid3X3 },
  { name: 'Wrench', label: 'Wrench (Hardware / Tools)', icon: Wrench },
  { name: 'Waves', label: 'Waves (Pipes / Fluids)', icon: Waves },
  { name: 'Package', label: 'Package (General Goods)', icon: Package },
  { name: 'Box', label: 'Box (Packaging / Cargo)', icon: Box },
  { name: 'Leaf', label: 'Leaf (Organic / Herbs)', icon: Leaf },
  { name: 'Layers', label: 'Layers (Plastics / Polymers)', icon: Layers },
  { name: 'ShieldCheck', label: 'Shield (Safety / Quality)', icon: ShieldCheck },
  { name: 'Factory', label: 'Factory (Industrial / Mfg)', icon: Factory },
  { name: 'Truck', label: 'Truck (Logistics / Bulk)', icon: Truck },
  { name: 'Flame', label: 'Flame (Energy / Chemical)', icon: Flame },
  { name: 'Globe', label: 'Globe (International / Trade)', icon: Globe }
];

const ICON_MAP = {};
ICON_OPTIONS.forEach(opt => {
  ICON_MAP[opt.name] = opt.icon;
});

function getCategoryIconComponent(iconName) {
  if (!iconName) return Package;
  if (typeof iconName === 'object' || typeof iconName === 'function') return iconName;
  return ICON_MAP[iconName] || Package;
}

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(isAdminLoggedIn());
  const [mainTab, setMainTab] = useState('catalog'); // 'catalog' | 'categories' | 'product_enquiries' | 'contact_enquiries' | 'certs'
  const [selectedCatalog, setSelectedCatalog] = useState('spices');
  const [toast, setToast] = useState('');

  // Main Categories State
  const [mainCategoriesList, setMainCategoriesList] = useState(getMainCategories());
  const [showMainCatModal, setShowMainCatModal] = useState(false);
  const [editingMainCat, setEditingMainCat] = useState(null);
  const [mainCatForm, setMainCatForm] = useState({
    name: '',
    color: '#8B5CF6',
    icon: 'Package',
    defaultHs: 'HS Standard',
    defaultPack: 'Standard Export Packing'
  });

  // Category & Subcategory Management State
  const [categoriesMap, setCategoriesMap] = useState(getAllCategories());
  const [newCatInput, setNewCatInput] = useState('');
  const [editingCatOldName, setEditingCatOldName] = useState(null);
  const [editingCatNewName, setEditingCatNewName] = useState('');

  // Cloud Sync (Firebase) State
  const [firebaseConfigInput, setFirebaseConfigInput] = useState(() => {
    const cfg = getFirebaseConfig();
    return cfg ? JSON.stringify(cfg, null, 2) : '';
  });
  const [isCloudReady, setIsCloudReady] = useState(isFirebaseConnected());
  const [isSyncing, setIsSyncing] = useState(false);

  // Stores
  const [spicesList, setSpicesList] = useState(getProducts());
  const [agroList, setAgroList] = useState(getAgroProducts());
  const [sanitaryList, setSanitaryList] = useState(getSanitarywareProducts());
  const [tilesList, setTilesList] = useState(getTilesProducts());
  const [hardwareList, setHardwareList] = useState(getHardwareProducts());
  const [pvcList, setPvcList] = useState(getPvcPipeProducts());

  const [blogs, setBlogsState] = useState(getBlogs());
  const [certs, setCertsState] = useState(getCertificates());
  const [enquiries, setEnquiriesState] = useState(getEnquiries());
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [emailConfig, setEmailConfig] = useState(() => getEnquiryEmailConfig());
  const [isSendingTest, setIsSendingTest] = useState(false);

  // Search & Filter State for Catalog
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedSubCat, setSelectedSubCat] = useState('All');

  // Modal States
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const [showCertModal, setShowCertModal] = useState(false);
  const [editingCert, setEditingCert] = useState(null);

  // Form States
  const [itemForm, setItemForm] = useState({
    title: '', category: '', origin: 'India', packaging: '', specs: '', description: '', image: '', hsCode: '', isFeatured: false
  });

  const [blogForm, setBlogForm] = useState({
    title: '', cat: 'Product Guide', read: '5 min read', excerpt: '', body: '', image: ''
  });

  const [certForm, setCertForm] = useState({
    name: '', code: '', tag: '', logo: ''
  });

  // Sync state helper
  const syncStateFromStore = () => {
    setMainCategoriesList([...getMainCategories()]);
    setSpicesList([...getProducts()]);
    setAgroList([...getAgroProducts()]);
    setSanitaryList([...getSanitarywareProducts()]);
    setTilesList([...getTilesProducts()]);
    setHardwareList([...getHardwareProducts()]);
    setPvcList([...getPvcPipeProducts()]);
    setBlogsState([...getBlogs()]);
    setCertsState([...getCertificates()]);
    setEnquiriesState([...getEnquiries()]);
    setCategoriesMap({ ...getAllCategories() });
  };

  // Sync state on load and on IndexedDB bootstrap sync
  useEffect(() => {
    syncStateFromStore();

    const handleSync = () => syncStateFromStore();
    window.addEventListener('trishu_store_sync', handleSync);
    window.addEventListener('trishu_store_updated', handleSync);
    return () => {
      window.removeEventListener('trishu_store_sync', handleSync);
      window.removeEventListener('trishu_store_updated', handleSync);
    };
  }, [authenticated]);

  const showNotification = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleLogout = () => {
    logoutAdmin();
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <AdminLogin onLoginSuccess={() => setAuthenticated(true)} />;
  }

  // --- AUTOMATIC IMAGE OPTIMIZER & CONVERTER HELPER ---
  const handleImageFileChange = async (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      try {
        showNotification('Optimizing & compressing image...');
        const compressedDataUrl = await compressImageFile(file, 700, 700, 0.72);
        callback(compressedDataUrl);
        showNotification('Image optimized successfully!');
      } catch (err) {
        console.error('Image compression error:', err);
        const reader = new FileReader();
        reader.onloadend = () => callback(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };

  // --- DYNAMIC CATALOG CONFIGURATION MAPPING ---
  const catalogConfigs = {};
  mainCategoriesList.forEach(cat => {
    const catKey = cat.id;
    catalogConfigs[catKey] = {
      key: catKey,
      name: cat.name,
      icon: getCategoryIconComponent(cat.icon),
      iconName: cat.icon || 'Package',
      color: cat.color || '#8B5CF6',
      list: getDomainProducts(catKey),
      categories: getCategories(catKey),
      defaultCategory: getCategories(catKey).find(c => c !== 'All') || 'General',
      defaultHs: cat.defaultHs || 'HS Standard',
      defaultPack: cat.defaultPack || 'Standard Export Packing',
      addFn: (p) => addDomainProduct(catKey, p),
      updateFn: (p) => updateDomainProduct(catKey, p),
      deleteFn: (id) => deleteDomainProduct(catKey, id)
    };
  });

  const validKeys = Object.keys(catalogConfigs);
  const activeCatalogKey = catalogConfigs[selectedCatalog] ? selectedCatalog : (validKeys[0] || 'spices');
  const currentConfig = catalogConfigs[activeCatalogKey] || {
    key: 'spices',
    name: 'Spices & Seasonings',
    icon: Sparkles,
    color: '#ED6C1B',
    list: spicesList,
    categories: ['All', 'General'],
    defaultCategory: 'General',
    defaultHs: 'HS Standard',
    defaultPack: 'Standard Export Packing',
    addFn: addProduct,
    updateFn: updateProduct,
    deleteFn: deleteProduct
  };

  // Filter items in current catalog
  const filteredCatalogItems = (currentConfig.list || []).filter(item => {
    const matchesCat = selectedSubCat === 'All' || item.category === selectedSubCat || item.cat === selectedSubCat;
    const matchesQuery = catalogSearch.trim() === '' || (item.title || '').toLowerCase().includes(catalogSearch.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // --- MAIN CATEGORY ACTIONS ---
  const openAddMainCategory = () => {
    setEditingMainCat(null);
    setMainCatForm({
      name: '',
      color: '#ED6C1B',
      icon: 'Sparkles',
      defaultHs: 'HS Standard',
      defaultPack: 'Standard Export Packing'
    });
    setShowMainCatModal(true);
  };

  const openEditMainCategory = (cat) => {
    setEditingMainCat(cat);
    setMainCatForm({
      name: cat.name || '',
      color: cat.color || '#ED6C1B',
      icon: cat.icon || 'Package',
      defaultHs: cat.defaultHs || '',
      defaultPack: cat.defaultPack || ''
    });
    setShowMainCatModal(true);
  };

  const handleSaveMainCategory = (e) => {
    e.preventDefault();
    const trimmed = mainCatForm.name.trim();
    if (!trimmed) return alert('Please enter Category Name');

    if (editingMainCat) {
      updateMainCategory(editingMainCat.id, {
        name: trimmed,
        color: mainCatForm.color,
        icon: mainCatForm.icon,
        defaultHs: mainCatForm.defaultHs,
        defaultPack: mainCatForm.defaultPack
      });
      syncStateFromStore();
      showNotification(`Main Category "${trimmed}" updated!`);
    } else {
      const updated = addMainCategory({
        name: trimmed,
        color: mainCatForm.color,
        icon: mainCatForm.icon,
        defaultHs: mainCatForm.defaultHs,
        defaultPack: mainCatForm.defaultPack
      });
      syncStateFromStore();
      const newAdded = updated[updated.length - 1];
      if (newAdded) setSelectedCatalog(newAdded.id);
      showNotification(`New Main Category "${trimmed}" created!`);
    }
    setShowMainCatModal(false);
  };

  const handleDeleteMainCategory = (catId, catName) => {
    if (mainCategoriesList.length <= 1) {
      return alert('At least one Category must remain.');
    }

    if (window.confirm(`Are you sure you want to delete Category "${catName}"?\n\nThis will remove this category and its subcategories from the site.`)) {
      const updated = deleteMainCategory(catId);
      syncStateFromStore();
      if (selectedCatalog === catId) {
        setSelectedCatalog(updated[0]?.id || 'spices');
      }
      showNotification(`Category "${catName}" deleted.`);
    }
  };

  // --- SUBCATEGORY ACTIONS ---
  const handleAddNewCategory = (e) => {
    e.preventDefault();
    const trimmed = newCatInput.trim();
    if (!trimmed) return;
    const catDomain = currentConfig.key || selectedCatalog;
    addCategory(catDomain, trimmed);
    syncStateFromStore();
    setNewCatInput('');
    showNotification(`Subcategory "${trimmed}" added to ${currentConfig.name}!`);
  };

  const handleStartEditCategory = (catName) => {
    setEditingCatOldName(catName);
    setEditingCatNewName(catName);
  };

  const handleSaveEditCategory = (catDomain) => {
    const trimmed = editingCatNewName.trim();
    if (!trimmed || trimmed === editingCatOldName) {
      setEditingCatOldName(null);
      return;
    }
    updateCategory(catDomain, editingCatOldName, trimmed);
    syncStateFromStore();
    setEditingCatOldName(null);
    setEditingCatNewName('');
    showNotification(`Subcategory updated to "${trimmed}" and products updated!`);
  };

  const handleDeleteCategory = (catDomain, catName) => {
    if (catName === 'All') return;
    const remaining = currentConfig.categories.filter(c => c !== 'All' && c !== catName);
    const fallback = remaining[0] || 'General';

    if (window.confirm(`Delete subcategory "${catName}" from ${currentConfig.name}?\n\nAny existing products in this subcategory will be assigned to "${fallback}".`)) {
      deleteCategory(catDomain, catName);
      syncStateFromStore();
      if (selectedSubCat === catName) setSelectedSubCat('All');
      showNotification(`Subcategory "${catName}" deleted.`);
    }
  };

  // --- CATALOG ITEM ACTIONS ---
  const openAddItem = () => {
    setEditingItem(null);
    setItemForm({
      title: '',
      category: currentConfig.defaultCategory,
      origin: 'India',
      packaging: currentConfig.defaultPack,
      specs: '',
      description: '',
      image: '',
      hsCode: currentConfig.defaultHs,
      isFeatured: false
    });
    setShowItemModal(true);
  };

  const openEditItem = (item) => {
    setEditingItem(item);
    setItemForm({
      title: item.title || '',
      category: item.category || item.cat || currentConfig.defaultCategory,
      origin: item.origin || '',
      packaging: item.packaging || '',
      specs: item.specs || '',
      description: item.description || item.desc || '',
      image: item.image || '',
      hsCode: item.hsCode || '',
      isFeatured: item.isFeatured || false
    });
    setShowItemModal(true);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!itemForm.title.trim()) return alert('Please enter product title');

    if (editingItem) {
      const updated = currentConfig.updateFn({
        ...editingItem,
        ...itemForm,
        cat: itemForm.category,
        desc: itemForm.description
      });
      syncStateFromStore();
      showNotification(`"${itemForm.title}" updated in ${currentConfig.name}!`);
    } else {
      const updated = currentConfig.addFn({
        ...itemForm,
        cat: itemForm.category,
        desc: itemForm.description
      });
      syncStateFromStore();
      showNotification(`New item "${itemForm.title}" added to ${currentConfig.name}!`);
    }
    setShowItemModal(false);
  };

  const handleDeleteItem = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}" from ${currentConfig.name}?`)) {
      const updated = currentConfig.deleteFn(id);
      syncStateFromStore();
      showNotification(`"${title}" deleted from ${currentConfig.name}.`);
    }
  };

  // --- ENQUIRY ACTIONS ---
  const handleToggleEnquiryStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'New' ? 'Replied' : 'New';
    const updated = updateEnquiryStatus(id, newStatus);
    setEnquiriesState(updated);
    showNotification(`Enquiry marked as ${newStatus}.`);
  };

  const handleDeleteEnquiry = (id, name) => {
    if (window.confirm(`Delete enquiry from "${name}"?`)) {
      const updated = deleteEnquiry(id);
      setEnquiriesState(updated);
      showNotification(`Enquiry deleted.`);
    }
  };

  const handleSaveEmailConfig = () => {
    const trimmed = (emailConfig.recipientEmail || '').trim();
    if (!trimmed) return alert('Please enter recipient email address');
    const updated = saveEnquiryEmailConfig({ ...emailConfig, recipientEmail: trimmed });
    setEmailConfig(updated);
    showNotification(`Enquiry notifications destination set to "${trimmed}"!`);
  };

  const handleSendTestEmail = async () => {
    setIsSendingTest(true);
    const testPayload = {
      source: 'Admin Panel Test Alert',
      name: 'Website Tester (Trishu Impex Admin)',
      company: 'Trishu Impex International Test',
      email: emailConfig.recipientEmail || 'sales@trishuimpex.com',
      phone: '+91 98765 43210',
      product: 'Indian Spices & Agricultural Produce',
      quantity: '25 Metric Tons',
      destinationPort: 'Jebel Ali / Rotterdam',
      incoterm: 'CIF',
      packaging: '50 Kg PP Bags',
      notes: 'This is a test notification confirming that customer website enquiries are successfully routed to your email address.'
    };
    try {
      const res = await sendEnquiryEmail(testPayload);
      if (res && res.success !== false) {
        showNotification(`✅ Test email dispatched to ${emailConfig.recipientEmail}! Check your inbox.`);
      } else {
        showNotification(`Test email triggered for ${emailConfig.recipientEmail}!`);
      }
    } catch (e) {
      alert('Notice: ' + e.message);
    } finally {
      setIsSendingTest(false);
    }
  };

  // --- BLOG ACTIONS ---
  const openAddBlog = () => {
    setEditingBlog(null);
    setBlogForm({
      title: '', cat: 'Product Guide', read: '5 min read', excerpt: '', body: '', image: ''
    });
    setShowBlogModal(true);
  };

  const openEditBlog = (blog) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title || '',
      cat: blog.cat || 'Product Guide',
      read: blog.read || '5 min read',
      excerpt: blog.excerpt || '',
      body: blog.body || '',
      image: blog.image || ''
    });
    setShowBlogModal(true);
  };

  const handleSaveBlog = (e) => {
    e.preventDefault();
    if (!blogForm.title.trim()) return alert('Please enter blog title');

    if (editingBlog) {
      const updated = updateBlog({ ...editingBlog, ...blogForm });
      setBlogsState(updated);
      showNotification(`Blog article "${blogForm.title}" updated!`);
    } else {
      const updated = addBlog(blogForm);
      setBlogsState(updated);
      showNotification(`New Blog article "${blogForm.title}" published!`);
    }
    setShowBlogModal(false);
  };

  const handleDeleteBlog = (id, title) => {
    if (window.confirm(`Are you sure you want to delete article "${title}"?`)) {
      const updated = deleteBlog(id);
      setBlogsState(updated);
      showNotification(`Article "${title}" deleted.`);
    }
  };

  // --- CERTIFICATE ACTIONS ---
  const openAddCert = () => {
    setEditingCert(null);
    setCertForm({
      name: '', code: 'CERTIFIED', tag: '', logo: ''
    });
    setShowCertModal(true);
  };

  const openEditCert = (cert) => {
    setEditingCert(cert);
    setCertForm({
      name: cert.name || '',
      code: cert.code || '',
      tag: cert.tag || '',
      logo: cert.logo || ''
    });
    setShowCertModal(true);
  };

  const handleSaveCert = (e) => {
    e.preventDefault();
    if (!certForm.name.trim()) return alert('Please enter certificate name');

    if (editingCert) {
      const updated = updateCertificate({ ...editingCert, ...certForm });
      setCertsState(updated);
      showNotification(`Certificate "${certForm.name}" updated!`);
    } else {
      const updated = addCertificate(certForm);
      setCertsState(updated);
      showNotification(`New Certificate "${certForm.name}" added!`);
    }
    setShowCertModal(false);
  };

  const handleDeleteCert = (id, name) => {
    if (window.confirm(`Are you sure you want to delete certificate "${name}"?`)) {
      const updated = deleteCertificate(id);
      setCertsState(updated);
      showNotification(`Certificate "${name}" removed.`);
    }
  };

  const totalProductsCount = spicesList.length + agroList.length + sanitaryList.length + tilesList.length + hardwareList.length + pvcList.length;
  const productQuotesCount = enquiries.filter(e => (e.source || '').toLowerCase().includes('product') || (e.source || '').toLowerCase().includes('quote')).length;
  const contactFormCount = enquiries.filter(e => (e.source || '').toLowerCase().includes('contact')).length;
  const totalCategoriesCount = Object.keys(catalogConfigs).reduce((acc, k) => {
    return acc + (catalogConfigs[k].categories.filter(c => c !== 'All').length);
  }, 0);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F1F5F9', fontFamily: 'var(--font-b, "Inter", sans-serif)' }}>
      
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 99999,
          backgroundColor: '#0B2240',
          color: '#FFFFFF',
          padding: '14px 24px',
          borderRadius: '16px',
          boxShadow: '0 12px 30px rgba(11, 34, 64, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px',
          fontWeight: 700
        }}>
          <CheckCircle2 size={18} style={{ color: '#22C55E' }} />
          <span>{toast}</span>
        </div>
      )}

      {/* LEFT SIDEBAR PANEL */}
      <aside style={{
        width: '290px',
        flexShrink: 0,
        backgroundColor: '#07182E',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        boxSizing: 'border-box',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: 100
      }}>
        
        {/* Sidebar Header / Brand */}
        <div style={{
          padding: '24px 20px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ED6C1B 0%, #D95D10 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(237, 108, 27, 0.35)'
            }}>
              <ShieldCheck size={24} color="#FFFFFF" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: '#FFFFFF', letterSpacing: '-0.3px', fontFamily: 'var(--font-h, Outfit, sans-serif)' }}>
                Trishu Impex
              </h2>
              <span style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                Admin Control Desk
              </span>
            </div>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(34, 197, 94, 0.12)', padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, color: '#4ADE80' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22C55E', boxShadow: '0 0 8px #22C55E' }} />
            <span>Admin Active • Online</span>
          </div>
        </div>

        {/* Sidebar Navigation Menu */}
        <nav style={{
          flex: 1,
          padding: '20px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          overflowY: 'auto'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '0 10px', marginBottom: '4px' }}>
            Main Navigation
          </div>

          {/* 1. Manage Products */}
          <button
            onClick={() => setMainTab('catalog')}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '12px 14px',
              borderRadius: '12px',
              backgroundColor: mainTab === 'catalog' ? '#ED6C1B' : 'transparent',
              color: mainTab === 'catalog' ? '#FFFFFF' : '#CBD5E1',
              border: 'none',
              fontWeight: 700,
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              boxShadow: mainTab === 'catalog' ? '0 4px 14px rgba(237, 108, 27, 0.35)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Package size={18} />
              <span>📦 Manage Products</span>
            </div>
            <span style={{
              backgroundColor: mainTab === 'catalog' ? 'rgba(255, 255, 255, 0.25)' : '#0F2744',
              color: '#FFFFFF',
              fontSize: '11.5px',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '100px'
            }}>
              {totalProductsCount}
            </span>
          </button>

          {/* 2. Manage Categories & Subcategories */}
          <button
            onClick={() => setMainTab('categories')}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '12px 14px',
              borderRadius: '12px',
              backgroundColor: mainTab === 'categories' ? '#8B5CF6' : 'transparent',
              color: mainTab === 'categories' ? '#FFFFFF' : '#CBD5E1',
              border: 'none',
              fontWeight: 700,
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              boxShadow: mainTab === 'categories' ? '0 4px 14px rgba(139, 92, 246, 0.35)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Tag size={18} />
              <span>🏷️ Manage Categories & Subcategories</span>
            </div>
            <span style={{
              backgroundColor: mainTab === 'categories' ? 'rgba(255, 255, 255, 0.25)' : '#0F2744',
              color: '#FFFFFF',
              fontSize: '11.5px',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '100px'
            }}>
              {totalCategoriesCount}
            </span>
          </button>

          {/* 3. Product Quote Enquiries */}
          <button
            onClick={() => setMainTab('product_enquiries')}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '12px 14px',
              borderRadius: '12px',
              backgroundColor: mainTab === 'product_enquiries' ? '#0284C7' : 'transparent',
              color: mainTab === 'product_enquiries' ? '#FFFFFF' : '#CBD5E1',
              border: 'none',
              fontWeight: 700,
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              boxShadow: mainTab === 'product_enquiries' ? '0 4px 14px rgba(2, 132, 199, 0.35)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Inbox size={18} />
              <span>Product Quote Enquiries</span>
            </div>
            <span style={{
              backgroundColor: mainTab === 'product_enquiries' ? 'rgba(255, 255, 255, 0.25)' : '#0F2744',
              color: '#FFFFFF',
              fontSize: '11.5px',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '100px'
            }}>
              {productQuotesCount}
            </span>
          </button>

          {/* 4. Contact Us Enquiries */}
          <button
            onClick={() => setMainTab('contact_enquiries')}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '12px 14px',
              borderRadius: '12px',
              backgroundColor: mainTab === 'contact_enquiries' ? '#16A34A' : 'transparent',
              color: mainTab === 'contact_enquiries' ? '#FFFFFF' : '#CBD5E1',
              border: 'none',
              fontWeight: 700,
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              boxShadow: mainTab === 'contact_enquiries' ? '0 4px 14px rgba(22, 163, 74, 0.35)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={18} />
              <span>Contact Us Enquiries</span>
            </div>
            <span style={{
              backgroundColor: mainTab === 'contact_enquiries' ? 'rgba(255, 255, 255, 0.25)' : '#0F2744',
              color: '#FFFFFF',
              fontSize: '11.5px',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '100px'
            }}>
              {contactFormCount}
            </span>
          </button>

          {/* 5. Manage Certificates (6) */}
          <button
            onClick={() => setMainTab('certs')}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '12px 14px',
              borderRadius: '12px',
              backgroundColor: mainTab === 'certs' ? '#D97706' : 'transparent',
              color: mainTab === 'certs' ? '#FFFFFF' : '#CBD5E1',
              border: 'none',
              fontWeight: 700,
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              boxShadow: mainTab === 'certs' ? '0 4px 14px rgba(217, 119, 6, 0.35)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Award size={18} />
              <span>Manage Certificates (6)</span>
            </div>
            <span style={{
              backgroundColor: mainTab === 'certs' ? 'rgba(255, 255, 255, 0.25)' : '#0F2744',
              color: '#FFFFFF',
              fontSize: '11.5px',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '100px'
            }}>
              {certs.length}
            </span>
          </button>
        </nav>

        {/* Sidebar Footer Actions */}
        <div style={{
          padding: '16px 14px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>

          <button
            onClick={() => {
              if (window.location.hash) window.location.hash = '';
              if (window.location.search) window.location.search = '';
              window.location.reload();
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#CBD5E1',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '12.5px',
              fontWeight: 600,
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              cursor: 'pointer'
            }}
          >
            <span>View Main Site</span>
            <ExternalLink size={13} />
          </button>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#FCA5A5',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '9px 12px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <LogOut size={14} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Navbar */}
        <header style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1.5px solid #E2E8F0',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 90,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
        }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#0B2240', margin: 0, fontFamily: 'var(--font-h, Outfit, sans-serif)' }}>
              {mainTab === 'catalog' && '📦 Manage Products'}
              {mainTab === 'categories' && '🏷️ Manage Categories & Subcategories'}
              {mainTab === 'product_enquiries' && '📥 Product Quote Enquiries'}
              {mainTab === 'contact_enquiries' && '✉️ Contact Us Enquiries'}
              {mainTab === 'certs' && '🏆 Manage Government Certificates (6)'}
            </h1>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0', fontWeight: 500 }}>
              {mainTab === 'catalog' && 'Add, edit, delete products across all 6 export commodity categories with real-time updates.'}
              {mainTab === 'categories' && 'Add, edit, rename, or delete subcategories for all product categories. Changes sync automatically.'}
              {mainTab === 'product_enquiries' && 'Review incoming container rate & product quotation requests from overseas buyers.'}
              {mainTab === 'contact_enquiries' && 'Manage business inquiries submitted via the Contact Us form.'}
              {mainTab === 'certs' && 'Update official ISO, APEDA, FSSAI, Spices Board, FDA & Halal export credentials.'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => {
                if (window.location.hash) window.location.hash = '';
                if (window.location.search) window.location.search = '';
                window.location.reload();
              }}
              className="btn btn-outline"
              style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 700, borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>Preview Site</span>
              <ExternalLink size={14} />
            </button>
          </div>
        </header>

        {/* Content Container */}
        <div style={{ padding: '28px 32px 60px', flex: 1 }}>
          
          {/* Dashboard Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px', marginBottom: '28px' }}>
            
            <div 
              onClick={() => setMainTab('catalog')}
              style={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: '16px', 
                padding: '16px', 
                border: mainTab === 'catalog' ? '2px solid #ED6C1B' : '1.5px solid #E2E8F0', 
                boxShadow: '0 2px 10px rgba(11, 34, 64, 0.03)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#0B2240', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={20} />
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Products</span>
                <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0B2240', margin: 0 }}>{totalProductsCount}</h3>
              </div>
            </div>

            <div 
              onClick={() => setMainTab('categories')}
              style={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: '16px', 
                padding: '16px', 
                border: mainTab === 'categories' ? '2px solid #8B5CF6' : '1.5px solid #E2E8F0', 
                boxShadow: '0 2px 10px rgba(11, 34, 64, 0.03)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#8B5CF6', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Tag size={20} />
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Subcategories</span>
                <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#8B5CF6', margin: 0 }}>{totalCategoriesCount}</h3>
              </div>
            </div>

            <div 
              onClick={() => setMainTab('product_enquiries')}
              style={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: '16px', 
                padding: '16px', 
                border: mainTab === 'product_enquiries' ? '2px solid #0284C7' : '1.5px solid #E2E8F0', 
                boxShadow: '0 2px 10px rgba(11, 34, 64, 0.03)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#0284C7', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Inbox size={20} />
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Product Quotes</span>
                <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0284C7', margin: 0 }}>{productQuotesCount}</h3>
              </div>
            </div>

            <div 
              onClick={() => setMainTab('contact_enquiries')}
              style={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: '16px', 
                padding: '16px', 
                border: mainTab === 'contact_enquiries' ? '2px solid #16A34A' : '1.5px solid #E2E8F0', 
                boxShadow: '0 2px 10px rgba(11, 34, 64, 0.03)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#16A34A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={20} />
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact Form</span>
                <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#16A34A', margin: 0 }}>{contactFormCount}</h3>
              </div>
            </div>

            <div 
              onClick={() => setMainTab('certs')}
              style={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: '16px', 
                padding: '16px', 
                border: mainTab === 'certs' ? '2px solid #D97706' : '1.5px solid #E2E8F0', 
                boxShadow: '0 2px 10px rgba(11, 34, 64, 0.03)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#D97706', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={20} />
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Certificates</span>
                <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#D97706', margin: 0 }}>{certs.length}</h3>
              </div>
            </div>

          </div>

        {/* TAB 1: PRODUCT CATALOG MANAGER WITH 6 CATEGORIES SWITCHER */}
        {mainTab === 'catalog' && (
          <div>
            {/* Dynamic Category Sub-Navigation Buttons */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '12px',
              border: '1.5px solid #CBD5E1',
              marginBottom: '24px',
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {mainCategoriesList.map((cat) => {
                const cfg = catalogConfigs[cat.id] || { name: cat.name, color: cat.color || '#ED6C1B', list: [] };
                const IconC = getCategoryIconComponent(cat.icon);
                const isSelected = selectedCatalog === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCatalog(cat.id);
                      setSelectedSubCat('All');
                      setCatalogSearch('');
                    }}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '12px',
                      backgroundColor: isSelected ? (cat.color || '#0B2240') : '#F8FAFC',
                      color: isSelected ? '#FFFFFF' : '#0B2240',
                      border: isSelected ? `1px solid ${cat.color || '#0B2240'}` : '1px solid #E2E8F0',
                      fontWeight: 800,
                      fontSize: '13.5px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      flex: '1 1 auto',
                      justifyContent: 'center',
                      boxShadow: isSelected ? `0 4px 14px ${cat.color}40` : 'none'
                    }}
                  >
                    <IconC size={16} style={{ color: isSelected ? '#FFFFFF' : (cat.color || '#ED6C1B') }} />
                    <span>{cat.name} ({cfg.list.length})</span>
                  </button>
                );
              })}
            </div>

            {/* Catalog Controls: Search, Sub-category filter, Manage Subcategories, and Add Item button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '12px', flex: '1 1 380px', maxWidth: '640px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '1 1 200px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#8C96A0' }} />
                  <input
                    type="text"
                    placeholder={`Search ${currentConfig.name}...`}
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px 12px 44px', borderRadius: '100px', border: '1.5px solid #CBD5E1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <select
                  value={selectedSubCat}
                  onChange={(e) => setSelectedSubCat(e.target.value)}
                  style={{ padding: '12px 20px', borderRadius: '100px', border: '1.5px solid #CBD5E1', fontSize: '14px', fontWeight: 700, outline: 'none', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
                >
                  {currentConfig.categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={openAddItem}
                  style={{ backgroundColor: '#0B2240', color: '#FFFFFF', border: 'none', padding: '12px 24px', borderRadius: '100px', fontWeight: 800, fontSize: '14.5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(11, 34, 64, 0.15)' }}
                >
                  <Plus size={18} />
                  <span>Add in {currentConfig.name}</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1.5px solid #CBD5E1', overflow: 'hidden', boxShadow: '0 8px 24px rgba(11, 34, 64, 0.04)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '1.5px solid #CBD5E1', color: '#0B2240', fontWeight: 800 }}>
                    <th style={{ padding: '16px 20px' }}>Product</th>
                    <th style={{ padding: '16px 20px' }}>Subcategory</th>
                    <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCatalogItems.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={{ padding: '40px 20px', textAlign: 'center', color: '#64748B', fontWeight: 600 }}>
                        No items found in {currentConfig.name}. Click "Add in {currentConfig.name}" to add new products.
                      </td>
                    </tr>
                  ) : (
                    filteredCatalogItems.map((p, idx) => (
                      <tr key={p.id || idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <img src={p.image} alt={p.title} style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '10px', backgroundColor: '#F8FAFC', padding: '4px', border: '1px solid #E2E8F0' }} />
                          <div>
                            <strong style={{ fontSize: '15px', color: '#0B2240', display: 'block' }}>{p.title}</strong>
                            <span style={{ fontSize: '12px', color: '#475569' }}>{p.description ? p.description.substring(0, 70) + (p.description.length > 70 ? '...' : '') : (p.desc ? p.desc.substring(0, 70) + (p.desc.length > 70 ? '...' : '') : '')}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: 600, color: '#0B2240' }}>{p.category || p.cat}</td>
                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button onClick={() => openEditItem(p)} style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', color: '#0B2240', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '12.5px' }}>
                              <Edit3 size={14} /> Edit
                            </button>
                            <button onClick={() => handleDeleteItem(p.id, p.title)} style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '12.5px' }}>
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: DEDICATED CATEGORIES & SUBCATEGORIES MANAGEMENT CENTER */}
        {mainTab === 'categories' && (
          <div>
            {/* SECTION 1: MAIN CATEGORIES MANAGEMENT */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1.5px solid #CBD5E1',
              padding: '24px',
              marginBottom: '28px',
              boxShadow: '0 4px 16px rgba(11, 34, 64, 0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(139, 92, 246, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Layers size={24} style={{ color: '#8B5CF6' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0B2240', margin: 0 }}>
                      📁 Main Categories & Catalogs ({mainCategoriesList.length})
                    </h3>
                    <span style={{ fontSize: '13px', color: '#64748B' }}>
                      Add new main product categories, rename them, customize theme colors & icons, or delete categories.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={openAddMainCategory}
                  style={{
                    backgroundColor: '#8B5CF6',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(139, 92, 246, 0.35)'
                  }}
                >
                  <Plus size={18} />
                  <span>Add New Category</span>
                </button>
              </div>

              {/* Main Categories Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '16px'
              }}>
                {mainCategoriesList.map((cat) => {
                  const isSelected = selectedCatalog === cat.id;
                  const IconC = getCategoryIconComponent(cat.icon);
                  const subCount = getCategories(cat.id).filter(c => c !== 'All').length;
                  const prodCount = (catalogConfigs[cat.id]?.list || []).length;
                  const catColor = cat.color || '#8B5CF6';

                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setSelectedCatalog(cat.id);
                        setEditingCatOldName(null);
                      }}
                      style={{
                        backgroundColor: isSelected ? '#FAF5FF' : '#FFFFFF',
                        borderRadius: '18px',
                        border: isSelected ? `2px solid ${catColor}` : '1.5px solid #E2E8F0',
                        padding: '18px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        position: 'relative',
                        boxShadow: isSelected ? `0 6px 20px ${catColor}25` : '0 2px 6px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '12px',
                            backgroundColor: `${catColor}18`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <IconC size={20} style={{ color: catColor }} />
                          </div>
                          <div>
                            <h4 style={{ fontSize: '15.5px', fontWeight: 800, color: '#0B2240', margin: 0 }}>
                              {cat.name}
                            </h4>
                            <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>
                              ID: {cat.id}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <span style={{
                            backgroundColor: catColor,
                            color: '#FFFFFF',
                            fontSize: '10.5px',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '100px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <Check size={11} /> Selected
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '100px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          backgroundColor: '#EDE9FE',
                          color: '#7C3AED'
                        }}>
                          🏷️ {subCount} Subcategories
                        </span>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '100px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          backgroundColor: '#F1F5F9',
                          color: '#475569'
                        }}>
                          📦 {prodCount} Products
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', paddingTop: '8px', borderTop: '1px solid #F1F5F9', marginTop: 'auto' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => openEditMainCategory(cat)}
                          style={{
                            flex: 1,
                            backgroundColor: '#F1F5F9',
                            border: '1px solid #CBD5E1',
                            color: '#0B2240',
                            padding: '7px 10px',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                          title="Edit Category Name, Color, or Icon"
                        >
                          <Edit3 size={13} />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteMainCategory(cat.id, cat.name)}
                          style={{
                            backgroundColor: '#FEF2F2',
                            border: '1px solid #FCA5A5',
                            color: '#991B1B',
                            padding: '7px 12px',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                          title="Delete Category"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: SUBCATEGORIES MANAGEMENT FOR CURRENT ACTIVE CATEGORY */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1.5px solid #CBD5E1',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 4px 16px rgba(11, 34, 64, 0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '14px',
                    backgroundColor: `${currentConfig.color}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Tag size={22} style={{ color: currentConfig.color }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0B2240', margin: 0 }}>
                      🏷️ Subcategories for <span style={{ color: currentConfig.color }}>{currentConfig.name}</span>
                    </h3>
                    <span style={{ fontSize: '13px', color: '#64748B' }}>
                      Add, rename, or remove subcategories. Renaming a subcategory automatically re-tags all associated products instantly.
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ padding: '6px 14px', borderRadius: '100px', backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 800, color: '#0B2240' }}>
                    📦 {(currentConfig.list || []).length} Total Products
                  </span>
                  <span style={{ padding: '6px 14px', borderRadius: '100px', backgroundColor: '#EDE9FE', border: '1px solid #DDD6FE', fontSize: '13px', fontWeight: 800, color: '#7C3AED' }}>
                    🏷️ {currentConfig.categories.filter(c => c !== 'All').length} Subcategories
                  </span>
                </div>
              </div>

              {/* Add Subcategory Form */}
              <form onSubmit={handleAddNewCategory} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1.5px solid #E2E8F0' }}>
                <div style={{ flex: '1 1 300px' }}>
                  <input
                    type="text"
                    placeholder={`Enter new subcategory for ${currentConfig.name} (e.g. Organic Herbal Powders)...`}
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value)}
                    style={{ width: '100%', padding: '12px 18px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    backgroundColor: currentConfig.color || '#8B5CF6',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: `0 4px 12px ${currentConfig.color}40`
                  }}
                >
                  <Plus size={16} />
                  <span>Add Subcategory</span>
                </button>
              </form>
            </div>

            {/* Subcategories List Table */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1.5px solid #CBD5E1', overflow: 'hidden', boxShadow: '0 8px 24px rgba(11, 34, 64, 0.04)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '1.5px solid #CBD5E1', color: '#0B2240', fontWeight: 800 }}>
                    <th style={{ padding: '16px 24px', width: '50px' }}>#</th>
                    <th style={{ padding: '16px 24px' }}>Subcategory Name</th>
                    <th style={{ padding: '16px 24px' }}>Products Linked</th>
                    <th style={{ padding: '16px 24px' }}>Status</th>
                    <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentConfig.categories.filter(c => c !== 'All').length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '36px 24px', textAlign: 'center', color: '#64748B', fontWeight: 600 }}>
                        No subcategories created yet for {currentConfig.name}. Add one using the form above!
                      </td>
                    </tr>
                  ) : (
                    currentConfig.categories.filter(c => c !== 'All').map((catName, idx) => {
                      const isEditing = editingCatOldName === catName;
                      const countInCat = (currentConfig.list || []).filter(p => p.category === catName || p.cat === catName).length;
                      const catDomain = currentConfig.key || selectedCatalog;

                      return (
                        <tr key={catName} style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: isEditing ? '#FAF5FF' : '#FFFFFF' }}>
                          <td style={{ padding: '16px 24px', color: '#94A3B8', fontWeight: 700, fontSize: '13px' }}>
                            {idx + 1}
                          </td>
                          
                          <td style={{ padding: '16px 24px' }}>
                            {isEditing ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '400px' }}>
                                <input
                                  type="text"
                                  value={editingCatNewName}
                                  onChange={(e) => setEditingCatNewName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveEditCategory(catDomain);
                                    if (e.key === 'Escape') setEditingCatOldName(null);
                                  }}
                                  autoFocus
                                  style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #8B5CF6', fontSize: '14px', fontWeight: 700, outline: 'none' }}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSaveEditCategory(catDomain)}
                                  style={{ backgroundColor: '#16A34A', color: '#FFFFFF', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '12.5px', cursor: 'pointer' }}
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingCatOldName(null)}
                                  style={{ backgroundColor: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', padding: '8px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '12.5px', cursor: 'pointer' }}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: currentConfig.color, display: 'inline-block' }} />
                                <strong style={{ fontSize: '15px', color: '#0B2240' }}>{catName}</strong>
                              </div>
                            )}
                          </td>

                          <td style={{ padding: '16px 24px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '100px',
                              fontSize: '12.5px',
                              fontWeight: 800,
                              backgroundColor: countInCat > 0 ? `${currentConfig.color}15` : '#F1F5F9',
                              color: countInCat > 0 ? currentConfig.color : '#64748B',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              {countInCat} {countInCat === 1 ? 'Product' : 'Products'}
                            </span>
                          </td>

                          <td style={{ padding: '16px 24px' }}>
                            <span style={{
                              padding: '3px 10px',
                              borderRadius: '100px',
                              fontSize: '12px',
                              fontWeight: 700,
                              backgroundColor: '#DCFCE7',
                              color: '#166534',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <CheckCircle2 size={12} /> Active in Catalog & Site
                            </span>
                          </td>

                          <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                            {!isEditing && (
                              <div style={{ display: 'inline-flex', gap: '8px' }}>
                                <button
                                  type="button"
                                  onClick={() => handleStartEditCategory(catName)}
                                  style={{
                                    backgroundColor: '#F1F5F9',
                                    border: '1px solid #CBD5E1',
                                    color: '#0B2240',
                                    padding: '7px 14px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontWeight: 700,
                                    fontSize: '12.5px'
                                  }}
                                  title="Rename subcategory and update all linked products"
                                >
                                  <Edit3 size={13} />
                                  <span>Rename</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteCategory(catDomain, catName)}
                                  style={{
                                    backgroundColor: '#FEF2F2',
                                    border: '1px solid #FCA5A5',
                                    color: '#991B1B',
                                    padding: '7px 12px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontWeight: 700,
                                    fontSize: '12.5px'
                                  }}
                                  title="Delete subcategory"
                                >
                                  <Trash2 size={13} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3 & 4: ENQUIRIES */}
        {(mainTab === 'product_enquiries' || mainTab === 'contact_enquiries') && (
          <div>
            {/* EMAIL ALERTS CONFIGURATION BAR */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid #CBD5E1',
              padding: '20px 24px',
              marginBottom: '20px',
              boxShadow: '0 4px 16px rgba(11, 34, 64, 0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563EB',
                  flexShrink: 0
                }}>
                  <Mail size={22} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '15px', color: '#0B2240' }}>Instant Enquiry Alerts on Email</strong>
                    <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '100px', backgroundColor: emailConfig.enabled ? '#DCFCE7' : '#FEE2E2', color: emailConfig.enabled ? '#166534' : '#991B1B' }}>
                      {emailConfig.enabled ? '● Alerts Active' : '○ Paused'}
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', color: '#64748B' }}>
                    Website par koi bhi product quote ya contact form submit karega to direct is mail par details jayengi.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="email"
                  placeholder="sales@trishuimpex.com"
                  value={emailConfig.recipientEmail}
                  onChange={(e) => setEmailConfig({ ...emailConfig, recipientEmail: e.target.value })}
                  style={{ padding: '9px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13.5px', fontWeight: 600, minWidth: '230px' }}
                />
                <button
                  type="button"
                  onClick={handleSaveEmailConfig}
                  style={{ backgroundColor: '#0B2240', color: '#FFFFFF', border: 'none', padding: '9px 18px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                >
                  Save Email
                </button>
                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  disabled={isSendingTest}
                  style={{ backgroundColor: '#F8FAFC', color: '#0369A1', border: '1.5px solid #BAE6FD', padding: '9px 16px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                >
                  {isSendingTest ? 'Sending...' : '📨 Send Test Mail'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0B2240', margin: 0 }}>
                  {mainTab === 'product_enquiries' ? '📦 Product Quote Enquiries' : '✉️ Contact Form Inquiries'}
                </h3>
              </div>
              <button
                onClick={() => exportEnquiriesCSV(mainTab === 'product_enquiries' ? 'product_quote' : 'contact_form')}
                style={{ backgroundColor: '#0369A1', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '100px', fontWeight: 700, fontSize: '13.5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Download size={16} /> Export to Excel / CSV
              </button>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1.5px solid #CBD5E1', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '1.5px solid #CBD5E1', color: '#0B2240', fontWeight: 800 }}>
                    <th style={{ padding: '16px 20px' }}>Date</th>
                    <th style={{ padding: '16px 20px' }}>Buyer / Company</th>
                    <th style={{ padding: '16px 20px' }}>Product / Subject</th>
                    <th style={{ padding: '16px 20px' }}>Destination Port</th>
                    <th style={{ padding: '16px 20px' }}>Status</th>
                    <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const currentTabList = enquiries.filter(e => {
                      const isQuote = (e.source || '').toLowerCase().includes('product') || (e.source || '').toLowerCase().includes('quote');
                      return mainTab === 'product_enquiries' ? isQuote : !isQuote;
                    });

                    if (currentTabList.length === 0) {
                      return (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '48px 20px', color: '#64748B' }}>
                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>No enquiries found</div>
                            <span style={{ fontSize: '13.5px' }}>Jab bhi koi visitor ya client website par form submit karega, unki details yahan instantly real-time dikhengi.</span>
                          </td>
                        </tr>
                      );
                    }

                    return currentTabList.map((enq, idx) => (
                      <tr key={enq.id || idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '16px 20px', fontSize: '13px', color: '#64748B', whiteSpace: 'nowrap' }}>{enq.date}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <strong style={{ color: '#0B2240', display: 'block' }}>{enq.name || 'Anonymous'}</strong>
                          <span style={{ fontSize: '12px', color: '#64748B' }}>{enq.company || enq.email || enq.phone}</span>
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: 600, color: '#0B2240' }}>{enq.product || enq.title || 'General Enquiry'}</td>
                        <td style={{ padding: '16px 20px', color: '#64748B' }}>{enq.destinationPort || '—'}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 800, backgroundColor: enq.status === 'Replied' ? '#DCFCE7' : '#FEF3C7', color: enq.status === 'Replied' ? '#166534' : '#92400E' }}>
                            {enq.status || 'New'}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button onClick={() => setSelectedEnquiry(enq)} style={{ backgroundColor: '#15803D', color: '#FFFFFF', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>
                              Details
                            </button>
                            <button onClick={() => handleToggleEnquiryStatus(enq.id, enq.status)} style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', color: '#0B2240', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>
                              {enq.status === 'Replied' ? 'Mark New' : 'Mark Replied'}
                            </button>
                            <button onClick={() => handleDeleteEnquiry(enq.id, enq.name)} style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {/* TAB 5: CERTIFICATES MANAGER */}
        {mainTab === 'certs' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0B2240', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={22} />
                  <span>Official Certificates & Approvals ({certs.length})</span>
                </h3>
              </div>
              <button
                onClick={openAddCert}
                style={{ backgroundColor: '#0B2240', color: '#FFFFFF', border: 'none', padding: '12px 24px', borderRadius: '100px', fontWeight: 800, fontSize: '14.5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={18} />
                <span>Add Certificate Photo</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {certs.map((c, idx) => (
                <div key={c.id || idx} style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1.5px solid #CBD5E1', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 4px 16px rgba(11, 34, 64, 0.04)' }}>
                  <div style={{ height: '160px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '12px' }}>
                    {c.logo ? (
                      <img src={c.logo} alt={c.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ color: '#94A3B8', fontSize: '13px', fontWeight: 600 }}>No Certificate Photo</span>
                    )}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0B2240', margin: '0 0 4px' }}>{c.name}</h4>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>{c.tag}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                    <button onClick={() => openEditCert(c)} style={{ flex: 1, backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', color: '#0B2240', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '12.5px' }}>Edit</button>
                    <button onClick={() => handleDeleteCert(c.id, c.name)} style={{ flex: 1, backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '12.5px' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        </div>
      </main>

      {/* --- UNIVERSAL MODAL: ADD / EDIT PRODUCT IN CURRENT CATEGORY --- */}
      {showItemModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(7,23,44,0.75)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '28px', padding: '32px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', border: '1.5px solid #CBD5E1', boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1.5px solid #F1F5F9', paddingBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0B2240', margin: 0, fontFamily: 'var(--font-h, Outfit, sans-serif)' }}>
                  {editingItem ? `Edit ${currentConfig.name} Item` : `Add in ${currentConfig.name}`}
                </h3>
                <span style={{ fontSize: '13px', color: '#64748B' }}>Category: {currentConfig.name}</span>
              </div>
              <button onClick={() => setShowItemModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveItem} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Item Title"
                    value={itemForm.title}
                    onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Sub-Category *</label>
                  <select
                    value={itemForm.category}
                    onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
                  >
                    {currentConfig.categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Product Image (URL or Upload)</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Paste Image URL or choose file below"
                    value={itemForm.image}
                    onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                    style={{ flex: 1, padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px' }}
                  />
                  <label style={{ backgroundColor: '#F1F5F9', border: '1.5px solid #CBD5E1', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '13px', color: '#0B2240', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Upload size={15} /> Upload File
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageFileChange(e, (url) => setItemForm({ ...itemForm, image: url }))} />
                  </label>
                </div>
                {itemForm.image && (
                  <img src={itemForm.image} alt="Preview" style={{ height: '60px', marginTop: '10px', borderRadius: '10px', objectFit: 'contain', border: '1px solid #CBD5E1' }} />
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Product Description</label>
                <textarea
                  rows={4}
                  placeholder="Enter product description, highlights, details..."
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowItemModal(false)} style={{ padding: '12px 24px', borderRadius: '100px', border: '1.5px solid #CBD5E1', backgroundColor: 'transparent', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '12px 32px', borderRadius: '100px', backgroundColor: '#0B2240', color: '#FFFFFF', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: ADD / EDIT MAIN CATEGORY --- */}
      {showMainCatModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(7,23,44,0.75)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '28px', padding: '32px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', border: '1.5px solid #CBD5E1', boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1.5px solid #F1F5F9', paddingBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0B2240', margin: 0, fontFamily: 'var(--font-h, Outfit, sans-serif)' }}>
                  {editingMainCat ? `Edit Category "${editingMainCat.name}"` : '➕ Add New Main Category'}
                </h3>
                <span style={{ fontSize: '13px', color: '#64748B' }}>
                  Set category name, theme brand color, icon, and export defaults.
                </span>
              </div>
              <button onClick={() => setShowMainCatModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveMainCategory} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 800, color: '#0B2240', marginBottom: '6px' }}>
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solar Energy Products, Organic Pulses, Packaging..."
                  value={mainCatForm.name}
                  onChange={(e) => setMainCatForm({ ...mainCatForm, name: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 800, color: '#0B2240', marginBottom: '8px' }}>
                  Category Theme Color
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {['#ED6C1B', '#166534', '#0369A1', '#854D0E', '#475569', '#0284C7', '#8B5CF6', '#DC2626', '#0D9488', '#D97706'].map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setMainCatForm({ ...mainCatForm, color: col })}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: col,
                        border: mainCatForm.color === col ? '3px solid #0B2240' : '2px solid #FFFFFF',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                        cursor: 'pointer',
                        outline: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {mainCatForm.color === col && <Check size={16} color="#FFFFFF" />}
                    </button>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
                    <input
                      type="color"
                      value={mainCatForm.color}
                      onChange={(e) => setMainCatForm({ ...mainCatForm, color: e.target.value })}
                      style={{ width: '36px', height: '36px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>Custom</span>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 800, color: '#0B2240', marginBottom: '8px' }}>
                  Category Icon
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px', maxHeight: '180px', overflowY: 'auto', padding: '8px', border: '1.5px solid #E2E8F0', borderRadius: '14px', backgroundColor: '#F8FAFC' }}>
                  {ICON_OPTIONS.map((opt) => {
                    const OptIcon = opt.icon;
                    const isSelected = mainCatForm.icon === opt.name;
                    return (
                      <button
                        key={opt.name}
                        type="button"
                        onClick={() => setMainCatForm({ ...mainCatForm, icon: opt.name })}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid #8B5CF6' : '1px solid #E2E8F0',
                          backgroundColor: isSelected ? '#EDE9FE' : '#FFFFFF',
                          color: isSelected ? '#6D28D9' : '#0B2240',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 700,
                          textAlign: 'left'
                        }}
                      >
                        <OptIcon size={16} style={{ color: isSelected ? '#6D28D9' : mainCatForm.color }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{opt.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Default HS Code</label>
                  <input
                    type="text"
                    placeholder="e.g. HS 0910"
                    value={mainCatForm.defaultHs}
                    onChange={(e) => setMainCatForm({ ...mainCatForm, defaultHs: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Default Packaging</label>
                  <input
                    type="text"
                    placeholder="e.g. 25kg PP Bags / Master Carton"
                    value={mainCatForm.defaultPack}
                    onChange={(e) => setMainCatForm({ ...mainCatForm, defaultPack: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowMainCatModal(false)} style={{ padding: '12px 24px', borderRadius: '100px', border: '1.5px solid #CBD5E1', backgroundColor: 'transparent', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '12px 32px', borderRadius: '100px', backgroundColor: '#8B5CF6', color: '#FFFFFF', border: 'none', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(139, 92, 246, 0.35)' }}>
                  {editingMainCat ? 'Save Changes' : 'Create Main Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* --- MODAL: ENQUIRY DETAILS MODAL --- */}
      {selectedEnquiry && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(7,23,44,0.75)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '28px', padding: '32px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', border: '1.5px solid #CBD5E1' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1.5px solid #F1F5F9', paddingBottom: '14px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0B2240', margin: 0 }}>Enquiry Details</h3>
              <button onClick={() => setSelectedEnquiry(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <div><strong style={{ color: '#0B2240' }}>Buyer Name:</strong> {selectedEnquiry.name}</div>
              <div><strong style={{ color: '#0B2240' }}>Company:</strong> {selectedEnquiry.company || 'N/A'}</div>
              <div><strong style={{ color: '#0B2240' }}>Email:</strong> <a href={`mailto:${selectedEnquiry.email}`} style={{ color: '#0369A1' }}>{selectedEnquiry.email}</a></div>
              <div><strong style={{ color: '#0B2240' }}>Phone:</strong> <a href={`tel:${selectedEnquiry.phone}`} style={{ color: '#0369A1' }}>{selectedEnquiry.phone}</a></div>
              <div><strong style={{ color: '#0B2240' }}>Product Requested:</strong> {selectedEnquiry.product}</div>
              <div><strong style={{ color: '#0B2240' }}>Quantity:</strong> {selectedEnquiry.quantity || 'N/A'}</div>
              <div><strong style={{ color: '#0B2240' }}>Destination Port:</strong> {selectedEnquiry.destinationPort || 'N/A'}</div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', marginTop: '6px' }}>
                <strong style={{ color: '#0B2240', display: 'block', marginBottom: '4px' }}>Buyer Notes / Message:</strong>
                <p style={{ margin: 0, color: '#475569', lineHeight: 1.5 }}>{selectedEnquiry.notes || selectedEnquiry.message || 'No additional notes provided.'}</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
              <button onClick={() => setSelectedEnquiry(null)} style={{ padding: '10px 22px', borderRadius: '100px', backgroundColor: '#0B2240', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}


      {/* --- MODAL: ADD / EDIT CERTIFICATE --- */}
      {showCertModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(7,23,44,0.75)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '28px', padding: '32px', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto', border: '1.5px solid #CBD5E1' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1.5px solid #F1F5F9', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0B2240', margin: 0 }}>
                {editingCert ? 'Edit Certificate' : 'Add New Certificate Photo'}
              </h3>
              <button onClick={() => setShowCertModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveCert} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Certificate Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. APEDA / ISO 9001 / CE Certified"
                  value={certForm.name}
                  onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Issuing Authority / Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Ministry of Commerce & Industry / International Compliance"
                  value={certForm.tag}
                  onChange={(e) => setCertForm({ ...certForm, tag: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Certificate Logo / Photo</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Paste Logo URL or upload file"
                    value={certForm.logo}
                    onChange={(e) => setCertForm({ ...certForm, logo: e.target.value })}
                    style={{ flex: 1, padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px' }}
                  />
                  <label style={{ backgroundColor: '#F1F5F9', border: '1.5px solid #CBD5E1', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '13px', color: '#0B2240', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Upload size={15} /> Upload
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageFileChange(e, (url) => setCertForm({ ...certForm, logo: url }))} />
                  </label>
                </div>
                {certForm.logo && (
                  <img src={certForm.logo} alt="Preview" style={{ height: '60px', marginTop: '10px', borderRadius: '10px', objectFit: 'contain', border: '1px solid #CBD5E1' }} />
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowCertModal(false)} style={{ padding: '12px 24px', borderRadius: '100px', border: '1.5px solid #CBD5E1', backgroundColor: 'transparent', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '12px 32px', borderRadius: '100px', backgroundColor: '#0B2240', color: '#FFFFFF', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Save Certificate</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
