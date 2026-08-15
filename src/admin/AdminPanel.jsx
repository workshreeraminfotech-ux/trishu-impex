import React, { useState, useEffect } from 'react';
import { 
  Package, FileText, Award, LogOut, Plus, Trash2, Edit3, Search, 
  CheckCircle2, X, Upload, ShieldCheck, ExternalLink, RefreshCw,
  Inbox, MessageSquare, Mail, Phone, Clock, Globe, AlertCircle, Download,
  Sprout, Bath, Grid3X3, Wrench, Waves, Sparkles
} from 'lucide-react';
import AdminLogin from './AdminLogin';
import { 
  isAdminLoggedIn, logoutAdmin, compressImageFile,
  getProducts, addProduct, updateProduct, deleteProduct,
  getAgroProducts, addAgroProduct, updateAgroProduct, deleteAgroProduct,
  getSanitarywareProducts, addSanitarywareProduct, updateSanitarywareProduct, deleteSanitarywareProduct,
  getTilesProducts, addTilesProduct, updateTilesProduct, deleteTilesProduct,
  getHardwareProducts, addHardwareProduct, updateHardwareProduct, deleteHardwareProduct,
  getPvcPipeProducts, addPvcPipeProduct, updatePvcPipeProduct, deletePvcPipeProduct,
  getBlogs, addBlog, updateBlog, deleteBlog,
  getCertificates, addCertificate, updateCertificate, deleteCertificate,
  getEnquiries, updateEnquiryStatus, deleteEnquiry, exportEnquiriesCSV
} from '../utils/adminStore';

import { PRODUCT_CATEGORIES } from '../data/products';
import { AGRO_CATEGORIES } from '../data/agroProducts';
import { SANITARYWARE_CATEGORIES } from '../data/sanitarywareProducts';
import { TILES_CATEGORIES } from '../data/tilesProducts';
import { HARDWARE_CATEGORIES } from '../data/hardwareProducts';
import { PVC_PIPE_CATEGORIES } from '../data/pvcPipeProducts';

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(isAdminLoggedIn());
  const [mainTab, setMainTab] = useState('catalog'); // 'catalog' | 'product_enquiries' | 'contact_enquiries' | 'blogs' | 'certs'
  const [selectedCatalog, setSelectedCatalog] = useState('spices'); // 'spices' | 'agro' | 'sanitaryware' | 'tiles' | 'hardware' | 'pvc-pipes'
  const [toast, setToast] = useState('');

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

  // Sync state on load
  useEffect(() => {
    setSpicesList(getProducts());
    setAgroList(getAgroProducts());
    setSanitaryList(getSanitarywareProducts());
    setTilesList(getTilesProducts());
    setHardwareList(getHardwareProducts());
    setPvcList(getPvcPipeProducts());
    setBlogsState(getBlogs());
    setCertsState(getCertificates());
    setEnquiriesState(getEnquiries());
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

  // --- CATALOG CONFIGURATION MAPPING ---
  const catalogConfigs = {
    spices: {
      name: 'Spices & Seasonings',
      icon: Sparkles,
      color: '#ED6C1B',
      list: spicesList,
      setList: setSpicesList,
      categories: PRODUCT_CATEGORIES,
      defaultCategory: 'Ground Spices',
      defaultHs: 'HS 0910',
      defaultPack: '25kg / 50kg PP Bags',
      addFn: addProduct,
      updateFn: updateProduct,
      deleteFn: deleteProduct
    },
    agro: {
      name: 'Agro Commodities',
      icon: Sprout,
      color: '#166534',
      list: agroList,
      setList: setAgroList,
      categories: AGRO_CATEGORIES,
      defaultCategory: 'Rice & Basmati',
      defaultHs: 'HS 1006',
      defaultPack: '25kg / 50kg PP Bags / Bulk FCL',
      addFn: addAgroProduct,
      updateFn: updateAgroProduct,
      deleteFn: deleteAgroProduct
    },
    sanitaryware: {
      name: 'Sanitaryware',
      icon: Bath,
      color: '#0369A1',
      list: sanitaryList,
      setList: setSanitaryList,
      categories: SANITARYWARE_CATEGORIES,
      defaultCategory: 'Water Closets & Toilets',
      defaultHs: 'HS 69101000',
      defaultPack: '5-Ply Export Carton / Wooden Pallets',
      addFn: addSanitarywareProduct,
      updateFn: updateSanitarywareProduct,
      deleteFn: deleteSanitarywareProduct
    },
    tiles: {
      name: 'Tiles & Ceramics',
      icon: Grid3X3,
      color: '#854D0E',
      list: tilesList,
      setList: setTilesList,
      categories: TILES_CATEGORIES,
      defaultCategory: 'GVT / PGVT Vitrified Tiles',
      defaultHs: 'HS 69072100',
      defaultPack: 'Export Box on Euro Pallets',
      addFn: addTilesProduct,
      updateFn: updateTilesProduct,
      deleteFn: deleteTilesProduct
    },
    hardware: {
      name: 'Architectural Hardware',
      icon: Wrench,
      color: '#475569',
      list: hardwareList,
      setList: setHardwareList,
      categories: HARDWARE_CATEGORIES,
      defaultCategory: 'Door Handles & Locks',
      defaultHs: 'HS 83024110',
      defaultPack: 'Box with Fixings / Master Export Carton',
      addFn: addHardwareProduct,
      updateFn: updateHardwareProduct,
      deleteFn: deleteHardwareProduct
    },
    'pvc-pipes': {
      name: 'PVC & CPVC Pipes',
      icon: Waves,
      color: '#0284C7',
      list: pvcList,
      setList: setPvcList,
      categories: PVC_PIPE_CATEGORIES,
      defaultCategory: 'UPVC Plumbing Pipes & Fittings',
      defaultHs: 'HS 39172300',
      defaultPack: 'Polywrap Bundles / Container Nested',
      addFn: addPvcPipeProduct,
      updateFn: updatePvcPipeProduct,
      deleteFn: deletePvcPipeProduct
    }
  };

  const currentConfig = catalogConfigs[selectedCatalog];

  // Filter items in current catalog
  const filteredCatalogItems = currentConfig.list.filter(item => {
    const matchesCat = selectedSubCat === 'All' || item.category === selectedSubCat || item.cat === selectedSubCat;
    const matchesQuery = catalogSearch.trim() === '' || item.title.toLowerCase().includes(catalogSearch.toLowerCase());
    return matchesCat && matchesQuery;
  });

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
      currentConfig.setList(updated);
      showNotification(`"${itemForm.title}" updated in ${currentConfig.name}!`);
    } else {
      const updated = currentConfig.addFn({
        ...itemForm,
        cat: itemForm.category,
        desc: itemForm.description
      });
      currentConfig.setList(updated);
      showNotification(`New item "${itemForm.title}" added to ${currentConfig.name}!`);
    }
    setShowItemModal(false);
  };

  const handleDeleteItem = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}" from ${currentConfig.name}?`)) {
      const updated = currentConfig.deleteFn(id);
      currentConfig.setList(updated);
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

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: 'var(--font-b, Inter, sans-serif)' }}>
      
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#0B2240',
          color: '#FFFFFF',
          padding: '14px 24px',
          borderRadius: '16px',
          boxShadow: '0 12px 30px rgba(11, 34, 64, 0.3)',
          zIndex: 4000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px',
          fontWeight: 700
        }}>
          <CheckCircle2 size={18} style={{ color: '#CBD5E1' }} />
          <span>{toast}</span>
        </div>
      )}

      {/* Admin Header */}
      <header style={{ backgroundColor: '#0B2240', color: '#FFFFFF', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#07172C', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 900, margin: 0, fontFamily: 'var(--font-h, Outfit, sans-serif)' }}>
                Trishu Impex Admin Panel
              </h2>
              <span style={{ fontSize: '12px', color: '#CBD5E1' }}>Complete 6-Category Export Management Suite</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => {
                if (window.confirm('Reset all custom changes to default initial catalogue? (Useful if storage was full of large uncompressed files)')) {
                  localStorage.removeItem('trishu_products');
                  localStorage.removeItem('trishu_agro_products');
                  localStorage.removeItem('trishu_sanitaryware_products');
                  localStorage.removeItem('trishu_tiles_products');
                  localStorage.removeItem('trishu_hardware_products');
                  localStorage.removeItem('trishu_pvcpipe_products');
                  localStorage.removeItem('trishu_blogs');
                  localStorage.removeItem('trishu_certs');
                  window.location.reload();
                }
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#FCD34D', border: '1px solid rgba(252, 211, 77, 0.4)', fontSize: '13px', fontWeight: 700, padding: '8px 16px', borderRadius: '100px', background: 'rgba(252, 211, 77, 0.1)', cursor: 'pointer' }}
            >
              <RefreshCw size={13} />
              <span>Reset Data / Free Storage</span>
            </button>

            <button
              onClick={() => {
                if (window.location.hash) window.location.hash = '';
                if (window.location.search) window.location.search = '';
                window.location.reload();
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#CBD5E1', border: 'none', fontSize: '13.5px', fontWeight: 600, padding: '8px 16px', borderRadius: '100px', background: 'rgba(255,255,255,0.1)', cursor: 'pointer' }}
            >
              <span>View Main Site</span>
              <ExternalLink size={14} />
            </button>

            <button
              onClick={handleLogout}
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                color: '#FCA5A5',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                padding: '8px 16px',
                borderRadius: '100px',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LogOut size={15} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="container" style={{ padding: '36px 24px 80px' }}>
        
        {/* Dashboard Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '18px', border: '1.5px solid #CBD5E1', boxShadow: '0 4px 16px rgba(11, 34, 64, 0.04)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#0B2240', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={20} />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C96A0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Products</span>
              <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#0B2240', margin: 0 }}>{totalProductsCount}</h3>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '18px', border: '1.5px solid #CBD5E1', boxShadow: '0 4px 16px rgba(11, 34, 64, 0.04)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#0369A1', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Inbox size={20} />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C96A0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Product Quotes</span>
              <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#0369A1', margin: 0 }}>{productQuotesCount}</h3>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '18px', border: '1.5px solid #CBD5E1', boxShadow: '0 4px 16px rgba(11, 34, 64, 0.04)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#15803D', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={20} />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C96A0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact Form</span>
              <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#15803D', margin: 0 }}>{contactFormCount}</h3>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '18px', border: '1.5px solid #CBD5E1', boxShadow: '0 4px 16px rgba(11, 34, 64, 0.04)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#0B2240', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={20} />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C96A0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Blogs</span>
              <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#0B2240', margin: 0 }}>{blogs.length}</h3>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '18px', border: '1.5px solid #CBD5E1', boxShadow: '0 4px 16px rgba(11, 34, 64, 0.04)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#0B2240', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={20} />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C96A0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Certificates</span>
              <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#0B2240', margin: 0 }}>{certs.length}</h3>
            </div>
          </div>
        </div>

        {/* Main Tab Controls */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '2px solid #E2E8F0', paddingBottom: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setMainTab('catalog')}
            style={{
              padding: '12px 22px',
              borderRadius: '100px',
              backgroundColor: mainTab === 'catalog' ? '#0B2240' : 'transparent',
              color: mainTab === 'catalog' ? '#FFFFFF' : '#0B2240',
              border: mainTab === 'catalog' ? 'none' : '1.5px solid #CBD5E1',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Package size={17} />
            <span>📦 Manage Products & Categories ({totalProductsCount})</span>
          </button>

          <button
            onClick={() => setMainTab('product_enquiries')}
            style={{
              padding: '12px 22px',
              borderRadius: '100px',
              backgroundColor: mainTab === 'product_enquiries' ? '#0369A1' : 'transparent',
              color: mainTab === 'product_enquiries' ? '#FFFFFF' : '#0B2240',
              border: mainTab === 'product_enquiries' ? 'none' : '1.5px solid #CBD5E1',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Inbox size={17} />
            <span>Product Quote Enquiries ({productQuotesCount})</span>
          </button>

          <button
            onClick={() => setMainTab('contact_enquiries')}
            style={{
              padding: '12px 22px',
              borderRadius: '100px',
              backgroundColor: mainTab === 'contact_enquiries' ? '#15803D' : 'transparent',
              color: mainTab === 'contact_enquiries' ? '#FFFFFF' : '#0B2240',
              border: mainTab === 'contact_enquiries' ? 'none' : '1.5px solid #CBD5E1',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Mail size={17} />
            <span>Contact Us Enquiries ({contactFormCount})</span>
          </button>

          <button
            onClick={() => setMainTab('blogs')}
            style={{
              padding: '12px 22px',
              borderRadius: '100px',
              backgroundColor: mainTab === 'blogs' ? '#0B2240' : 'transparent',
              color: mainTab === 'blogs' ? '#FFFFFF' : '#0B2240',
              border: mainTab === 'blogs' ? 'none' : '1.5px solid #CBD5E1',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FileText size={17} />
            <span>Manage Blogs ({blogs.length})</span>
          </button>

          <button
            onClick={() => setMainTab('certs')}
            style={{
              padding: '12px 22px',
              borderRadius: '100px',
              backgroundColor: mainTab === 'certs' ? '#0B2240' : 'transparent',
              color: mainTab === 'certs' ? '#FFFFFF' : '#0B2240',
              border: mainTab === 'certs' ? 'none' : '1.5px solid #CBD5E1',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Award size={17} />
            <span>Manage Certificates ({certs.length})</span>
          </button>
        </div>

        {/* TAB 1: PRODUCT CATALOG MANAGER WITH 6 CATEGORIES SWITCHER */}
        {mainTab === 'catalog' && (
          <div>
            {/* 6 Category Sub-Navigation Buttons */}
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
              {Object.keys(catalogConfigs).map((catKey) => {
                const cfg = catalogConfigs[catKey];
                const IconC = cfg.icon;
                const isSelected = selectedCatalog === catKey;

                return (
                  <button
                    key={catKey}
                    onClick={() => {
                      setSelectedCatalog(catKey);
                      setSelectedSubCat('All');
                      setCatalogSearch('');
                    }}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '12px',
                      backgroundColor: isSelected ? '#0B2240' : '#F8FAFC',
                      color: isSelected ? '#FFFFFF' : '#0B2240',
                      border: isSelected ? '1px solid #0B2240' : '1px solid #E2E8F0',
                      fontWeight: 800,
                      fontSize: '13.5px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      flex: '1 1 auto',
                      justifyContent: 'center'
                    }}
                  >
                    <IconC size={16} style={{ color: isSelected ? '#ED6C1B' : cfg.color }} />
                    <span>{cfg.name} ({cfg.list.length})</span>
                  </button>
                );
              })}
            </div>

            {/* Catalog Controls: Search, Sub-category filter, and Add Item button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', flex: 1, maxWidth: '640px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
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
                  style={{ padding: '12px 20px', borderRadius: '100px', border: '1.5px solid #CBD5E1', fontSize: '14px', fontWeight: 700, outline: 'none', backgroundColor: '#FFFFFF' }}
                >
                  {currentConfig.categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <button
                onClick={openAddItem}
                style={{ backgroundColor: '#0B2240', color: '#FFFFFF', border: 'none', padding: '12px 24px', borderRadius: '100px', fontWeight: 800, fontSize: '14.5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(11, 34, 64, 0.15)' }}
              >
                <Plus size={18} />
                <span>Add in {currentConfig.name}</span>
              </button>
            </div>

            {/* Products Table */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1.5px solid #CBD5E1', overflow: 'hidden', boxShadow: '0 8px 24px rgba(11, 34, 64, 0.04)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '1.5px solid #CBD5E1', color: '#0B2240', fontWeight: 800 }}>
                    <th style={{ padding: '16px 20px' }}>Product</th>
                    <th style={{ padding: '16px 20px' }}>Category</th>
                    <th style={{ padding: '16px 20px' }}>Origin</th>
                    <th style={{ padding: '16px 20px' }}>HS Code</th>
                    <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCatalogItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '40px 20px', textAlign: 'center', color: '#64748B', fontWeight: 600 }}>
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
                            <span style={{ fontSize: '12px', color: '#475569' }}>{p.description ? p.description.substring(0, 50) + '...' : (p.desc ? p.desc.substring(0, 50) + '...' : '')}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: 600, color: '#0B2240' }}>{p.category || p.cat}</td>
                        <td style={{ padding: '16px 20px', color: '#475569' }}>{p.origin}</td>
                        <td style={{ padding: '16px 20px', color: '#475569', fontWeight: 600 }}>{p.hsCode || '—'}</td>
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

        {/* TAB 2 & 3: ENQUIRIES */}
        {(mainTab === 'product_enquiries' || mainTab === 'contact_enquiries') && (
          <div>
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
                  {enquiries
                    .filter(e => mainTab === 'product_enquiries' ? ((e.source || '').toLowerCase().includes('product') || (e.source || '').toLowerCase().includes('quote')) : (e.source || '').toLowerCase().includes('contact'))
                    .map((enq, idx) => (
                      <tr key={enq.id || idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '16px 20px', fontSize: '13px', color: '#64748B' }}>{enq.date}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <strong style={{ color: '#0B2240', display: 'block' }}>{enq.name}</strong>
                          <span style={{ fontSize: '12px', color: '#64748B' }}>{enq.company || enq.email}</span>
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
                              {enq.status === 'New' ? 'Mark Replied' : 'Mark New'}
                            </button>
                            <button onClick={() => handleDeleteEnquiry(enq.id, enq.name)} style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: BLOGS MANAGER */}
        {mainTab === 'blogs' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0B2240', margin: 0 }}>Articles Database</h3>
              <button
                onClick={openAddBlog}
                style={{ backgroundColor: '#0B2240', color: '#FFFFFF', border: 'none', padding: '12px 24px', borderRadius: '100px', fontWeight: 800, fontSize: '14.5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={18} />
                <span>Add New Blog</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {blogs.map((b, idx) => (
                <div key={b.id || idx} style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1.5px solid #CBD5E1', overflow: 'hidden', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {b.image && (
                    <img src={b.image} alt={b.title} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '14px' }} />
                  )}
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#0B2240', backgroundColor: '#F1F5F9', padding: '4px 12px', borderRadius: '100px' }}>{b.cat}</span>
                    <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#0B2240', margin: '10px 0 6px' }}>{b.title}</h4>
                    <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.5, margin: 0 }}>{b.excerpt}</p>
                  </div>
                  <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#8C96A0' }}>{b.read}</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEditBlog(b)} style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', color: '#0B2240', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>Edit</button>
                      <button onClick={() => handleDeleteBlog(b.id, b.title)} style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Origin / Hub</label>
                  <input
                    type="text"
                    placeholder="e.g. Gujarat, India"
                    value={itemForm.origin}
                    onChange={(e) => setItemForm({ ...itemForm, origin: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>HS Code</label>
                  <input
                    type="text"
                    placeholder="e.g. HS Code"
                    value={itemForm.hsCode}
                    onChange={(e) => setItemForm({ ...itemForm, hsCode: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Export Packaging</label>
                <input
                  type="text"
                  placeholder="e.g. Export Packaging details"
                  value={itemForm.packaging}
                  onChange={(e) => setItemForm({ ...itemForm, packaging: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                />
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
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Specifications & Technical Parameters</label>
                <input
                  type="text"
                  placeholder="e.g. Dimensions, Grade, Purity, Material..."
                  value={itemForm.specs}
                  onChange={(e) => setItemForm({ ...itemForm, specs: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Export Description</label>
                <textarea
                  rows={3}
                  placeholder="Detailed description for global buyers and freight tenders..."
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

      {/* --- MODAL: ADD / EDIT BLOG --- */}
      {showBlogModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(7,23,44,0.75)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '28px', padding: '32px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', border: '1.5px solid #CBD5E1' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1.5px solid #F1F5F9', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0B2240', margin: 0 }}>
                {editingBlog ? 'Edit Blog Article' : 'Publish New Blog'}
              </h3>
              <button onClick={() => setShowBlogModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Article Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sourcing High-Quality Indian Ceramic Tiles"
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Product Guide"
                    value={blogForm.cat}
                    onChange={(e) => setBlogForm({ ...blogForm, cat: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Read Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 min read"
                    value={blogForm.read}
                    onChange={(e) => setBlogForm({ ...blogForm, read: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Cover Image (URL or Upload)</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Paste Image URL or select file"
                    value={blogForm.image}
                    onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                    style={{ flex: 1, padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px' }}
                  />
                  <label style={{ backgroundColor: '#F1F5F9', border: '1.5px solid #CBD5E1', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '13px', color: '#0B2240', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Upload size={15} /> Upload
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageFileChange(e, (url) => setBlogForm({ ...blogForm, image: url }))} />
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Excerpt (Short Summary)</label>
                <textarea
                  rows={2}
                  placeholder="Short brief of article for blog card preview..."
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Full Article Body</label>
                <textarea
                  rows={6}
                  placeholder="Full markdown/text content of blog article..."
                  value={blogForm.body}
                  onChange={(e) => setBlogForm({ ...blogForm, body: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowBlogModal(false)} style={{ padding: '12px 24px', borderRadius: '100px', border: '1.5px solid #CBD5E1', backgroundColor: 'transparent', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '12px 32px', borderRadius: '100px', backgroundColor: '#0B2240', color: '#FFFFFF', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Publish Blog</button>
              </div>
            </form>
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
