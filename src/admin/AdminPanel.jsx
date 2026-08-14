import React, { useState, useEffect } from 'react';
import { 
  Package, FileText, Award, LogOut, Plus, Trash2, Edit3, Search, 
  CheckCircle2, X, Upload, ShieldCheck, ExternalLink, RefreshCw,
  Inbox, MessageSquare, Mail, Phone, Clock, Globe, AlertCircle, Download
} from 'lucide-react';
import AdminLogin from './AdminLogin';
import { 
  isAdminLoggedIn, logoutAdmin, 
  getProducts, addProduct, updateProduct, deleteProduct,
  getBlogs, addBlog, updateBlog, deleteBlog,
  getCertificates, addCertificate, updateCertificate, deleteCertificate,
  getEnquiries, updateEnquiryStatus, deleteEnquiry, exportEnquiriesCSV
} from '../utils/adminStore';
import { PRODUCT_CATEGORIES } from '../data/products';

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(isAdminLoggedIn());
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'blogs' | 'certs' | 'enquiries'
  const [toast, setToast] = useState('');

  // Stores
  const [products, setProductsState] = useState(getProducts());
  const [blogs, setBlogsState] = useState(getBlogs());
  const [certs, setCertsState] = useState(getCertificates());
  const [enquiries, setEnquiriesState] = useState(getEnquiries());
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [enquiryFilter, setEnquiryFilter] = useState('all'); // 'all' | 'product_quote' | 'contact_form'

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  // Modal States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const [showCertModal, setShowCertModal] = useState(false);
  const [editingCert, setEditingCert] = useState(null);

  // Form States
  const [prodForm, setProdForm] = useState({
    title: '', category: 'Ground Spices', origin: '', packaging: '', specs: '', description: '', image: '', hsCode: '', isFeatured: false
  });

  const [blogForm, setBlogForm] = useState({
    title: '', cat: 'Product Guide', read: '5 min read', excerpt: '', body: '', image: ''
  });

  const [certForm, setCertForm] = useState({
    name: '', code: '', tag: '', logo: ''
  });

  // Sync state on load
  useEffect(() => {
    setProductsState(getProducts());
    setBlogsState(getBlogs());
    setCertsState(getCertificates());
    setEnquiriesState(getEnquiries());
  }, [authenticated]);

  // --- ENQUIRY ACTIONS ---
  const handleToggleEnquiryStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'New' ? 'Replied' : 'New';
    const updated = updateEnquiryStatus(id, newStatus);
    setEnquiriesState(updated);
    showNotification(`Enquiry status updated to ${newStatus}.`);
  };

  const handleDeleteEnquiry = (id, name) => {
    if (window.confirm(`Delete enquiry from "${name}"?`)) {
      const updated = deleteEnquiry(id);
      setEnquiriesState(updated);
      showNotification(`Enquiry deleted.`);
    }
  };

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

  // --- IMAGE FILE CONVERTER HELPER ---
  const handleImageFileChange = (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- PRODUCT ACTIONS ---
  const openAddProduct = () => {
    setEditingProduct(null);
    setProdForm({
      title: '', category: 'Ground Spices', origin: 'India', packaging: '25kg PP Bags', specs: '', description: '', image: '', hsCode: 'HS 0910', isFeatured: false
    });
    setShowProductModal(true);
  };

  const openEditProduct = (prod) => {
    setEditingProduct(prod);
    setProdForm({
      title: prod.title || '',
      category: prod.category || prod.cat || 'Ground Spices',
      origin: prod.origin || '',
      packaging: prod.packaging || '',
      specs: prod.specs || '',
      description: prod.description || prod.desc || '',
      image: prod.image || '',
      hsCode: prod.hsCode || '',
      isFeatured: prod.isFeatured || false
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!prodForm.title.trim()) return alert('Please enter product title');

    if (editingProduct) {
      const updated = updateProduct({ ...editingProduct, ...prodForm, cat: prodForm.category, desc: prodForm.description });
      setProductsState(updated);
      showNotification(`Product "${prodForm.title}" updated successfully!`);
    } else {
      const updated = addProduct({ ...prodForm, cat: prodForm.category, desc: prodForm.description });
      setProductsState(updated);
      showNotification(`New Product "${prodForm.title}" added to catalogue!`);
    }
    setShowProductModal(false);
  };

  const handleDeleteProduct = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      const updated = deleteProduct(id);
      setProductsState(updated);
      showNotification(`Product "${title}" removed.`);
    }
  };

  // --- BLOG ACTIONS ---
  const openAddBlog = () => {
    setEditingBlog(null);
    setBlogForm({
      title: '', cat: 'Export Guide', read: '5 min read', excerpt: '', body: '', image: ''
    });
    setShowBlogModal(true);
  };

  const openEditBlog = (blog) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title || '',
      cat: blog.cat || 'Export Guide',
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

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCat === 'All' || p.category === selectedCat || p.cat === selectedCat;
    const matchesQuery = searchQuery.trim() === '' || p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

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
          zIndex: 2000,
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

      {/* Admin Header Navbar */}
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
              <span style={{ fontSize: '12px', color: '#CBD5E1' }}>Website Control Center</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
        {(() => {
          const productQuotesCount = enquiries.filter(e => (e.source || '').toLowerCase().includes('product') || (e.source || '').toLowerCase().includes('quote')).length;
          const contactFormCount = enquiries.filter(e => (e.source || '').toLowerCase().includes('contact')).length;

          return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '20px', border: '1.5px solid #CBD5E1', boxShadow: '0 4px 16px rgba(11, 34, 64, 0.04)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#0B2240', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={22} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C96A0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Products</span>
                  <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#0B2240', margin: 0 }}>{products.length}</h3>
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '20px', border: '1.5px solid #CBD5E1', boxShadow: '0 4px 16px rgba(11, 34, 64, 0.04)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#0369A1', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Inbox size={22} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C96A0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Product Quotes</span>
                  <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#0369A1', margin: 0 }}>{productQuotesCount}</h3>
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '20px', border: '1.5px solid #CBD5E1', boxShadow: '0 4px 16px rgba(11, 34, 64, 0.04)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#15803D', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={22} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C96A0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact Form</span>
                  <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#15803D', margin: 0 }}>{contactFormCount}</h3>
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '20px', border: '1.5px solid #CBD5E1', boxShadow: '0 4px 16px rgba(11, 34, 64, 0.04)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#0B2240', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={22} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C96A0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Blog Articles</span>
                  <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#0B2240', margin: 0 }}>{blogs.length}</h3>
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '20px', border: '1.5px solid #CBD5E1', boxShadow: '0 4px 16px rgba(11, 34, 64, 0.04)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#0B2240', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={22} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C96A0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Certifications</span>
                  <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#0B2240', margin: 0 }}>{certs.length}</h3>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Tab Navigation Controls */}
        {(() => {
          const productQuotesCount = enquiries.filter(e => (e.source || '').toLowerCase().includes('product') || (e.source || '').toLowerCase().includes('quote')).length;
          const contactFormCount = enquiries.filter(e => (e.source || '').toLowerCase().includes('contact')).length;

          return (
            <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', borderBottom: '2px solid #E2E8F0', paddingBottom: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveTab('products')}
                style={{
                  padding: '12px 22px',
                  borderRadius: '100px',
                  backgroundColor: activeTab === 'products' ? '#0B2240' : 'transparent',
                  color: activeTab === 'products' ? '#FFFFFF' : '#0B2240',
                  border: activeTab === 'products' ? 'none' : '1.5px solid #CBD5E1',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Package size={17} />
                <span>Manage Products ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('product_enquiries')}
                style={{
                  padding: '12px 22px',
                  borderRadius: '100px',
                  backgroundColor: activeTab === 'product_enquiries' ? '#0369A1' : 'transparent',
                  color: activeTab === 'product_enquiries' ? '#FFFFFF' : '#0B2240',
                  border: activeTab === 'product_enquiries' ? 'none' : '1.5px solid #CBD5E1',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Inbox size={17} />
                <span>📦 Product Quote Enquiries ({productQuotesCount})</span>
              </button>

              <button
                onClick={() => setActiveTab('contact_enquiries')}
                style={{
                  padding: '12px 22px',
                  borderRadius: '100px',
                  backgroundColor: activeTab === 'contact_enquiries' ? '#15803D' : 'transparent',
                  color: activeTab === 'contact_enquiries' ? '#FFFFFF' : '#0B2240',
                  border: activeTab === 'contact_enquiries' ? 'none' : '1.5px solid #CBD5E1',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Mail size={17} />
                <span>✉️ Contact Us Enquiries ({contactFormCount})</span>
              </button>

              <button
                onClick={() => setActiveTab('blogs')}
                style={{
                  padding: '12px 22px',
                  borderRadius: '100px',
                  backgroundColor: activeTab === 'blogs' ? '#0B2240' : 'transparent',
                  color: activeTab === 'blogs' ? '#FFFFFF' : '#0B2240',
                  border: activeTab === 'blogs' ? 'none' : '1.5px solid #CBD5E1',
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
                onClick={() => setActiveTab('certs')}
                style={{
                  padding: '12px 22px',
                  borderRadius: '100px',
                  backgroundColor: activeTab === 'certs' ? '#0B2240' : 'transparent',
                  color: activeTab === 'certs' ? '#FFFFFF' : '#0B2240',
                  border: activeTab === 'certs' ? 'none' : '1.5px solid #CBD5E1',
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
          );
        })()}

        {/* TAB 1: PRODUCTS MANAGER */}
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', flex: 1, maxWidth: '600px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#8C96A0' }} />
                  <input
                    type="text"
                    placeholder="Search products by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px 12px 44px', borderRadius: '100px', border: '1.5px solid #CBD5E1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <select
                  value={selectedCat}
                  onChange={(e) => setSelectedCat(e.target.value)}
                  style={{ padding: '12px 20px', borderRadius: '100px', border: '1.5px solid #CBD5E1', fontSize: '14px', fontWeight: 700, outline: 'none', backgroundColor: '#FFFFFF' }}
                >
                  {PRODUCT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <button
                onClick={openAddProduct}
                style={{ backgroundColor: '#0B2240', color: '#FFFFFF', border: 'none', padding: '12px 24px', borderRadius: '100px', fontWeight: 800, fontSize: '14.5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(11, 34, 64, 0.15)' }}
              >
                <Plus size={18} />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Table Grid */}
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
                  {filteredProducts.map((p, idx) => (
                    <tr key={p.id || idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img src={p.image} alt={p.title} style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '10px', backgroundColor: '#F8FAFC', padding: '4px', border: '1px solid #E2E8F0' }} />
                        <div>
                          <strong style={{ fontSize: '15px', color: '#0B2240', display: 'block' }}>{p.title}</strong>
                          <span style={{ fontSize: '12px', color: '#475569' }}>{p.desc ? p.desc.substring(0, 50) + '...' : ''}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', fontWeight: 600, color: '#0B2240' }}>{p.category || p.cat}</td>
                      <td style={{ padding: '16px 20px', color: '#475569' }}>{p.origin}</td>
                      <td style={{ padding: '16px 20px', color: '#475569', fontWeight: 600 }}>{p.hsCode || '—'}</td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button onClick={() => openEditProduct(p)} style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', color: '#0B2240', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '12.5px' }}>
                            <Edit3 size={14} /> Edit
                          </button>
                          <button onClick={() => handleDeleteProduct(p.id, p.title)} style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '12.5px' }}>
                            <Trash2 size={14} /> Delete
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

        {/* TAB 2: BLOGS MANAGER */}
        {activeTab === 'blogs' && (
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

        {/* TAB 3: CERTIFICATES MANAGER */}
        {activeTab === 'certs' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0B2240', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={22} />
                  <span>Official Certificates & Approvals ({certs.length})</span>
                </h3>
                <span style={{ fontSize: '13px', color: '#475569' }}>These certificate photos scroll automatically on the website's Trusted & Govt. Authorized section.</span>
              </div>
              <button
                onClick={openAddCert}
                style={{ backgroundColor: '#0B2240', color: '#FFFFFF', border: 'none', padding: '12px 24px', borderRadius: '100px', fontWeight: 800, fontSize: '14.5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(11, 34, 64, 0.15)' }}
              >
                <Plus size={18} />
                <span>Add Certificate Photo</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {certs.map((c, idx) => (
                <div key={c.id || idx} style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1.5px solid #CBD5E1', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 4px 16px rgba(11, 34, 64, 0.04)' }}>
                  
                  {/* Certificate Photo Display Area (Supports Vertical & Horizontal) */}
                  <div style={{ height: '160px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '12px', position: 'relative' }}>
                    {c.logo ? (
                      <img src={c.logo} alt={c.name} style={{ maxHeight: '100%', maxWidth: '100%', width: 'auto', height: 'auto', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ color: '#94A3B8', fontSize: '13px', fontWeight: 600 }}>No Certificate Photo</span>
                    )}
                  </div>

                  <div>
                    <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#0B2240', marginBottom: '4px' }}>{c.name}</h4>
                    <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>{c.tag || 'Official Authorized Certificate'}</p>
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    {/* Quick Direct Upload Photo */}
                    <label style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', color: '#0369A1', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Upload size={14} /> Upload Photo
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        onChange={(e) => handleImageFileChange(e, (url) => {
                          const updated = updateCertificate({ ...c, logo: url });
                          setCertsState(updated);
                          showNotification(`Certificate photo for "${c.name}" updated!`);
                        })} 
                      />
                    </label>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEditCert(c)} style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', color: '#0B2240', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>Edit</button>
                      <button onClick={() => handleDeleteCert(c.id, c.name)} style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PRODUCT QUOTE ENQUIRIES */}
        {activeTab === 'product_enquiries' && (() => {
          const productQuotes = enquiries.filter(e => (e.source || '').toLowerCase().includes('product') || (e.source || '').toLowerCase().includes('quote'));

          return (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0369A1', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Inbox size={22} />
                    <span>📦 Product Quote Enquiries Inbox ({productQuotes.length})</span>
                  </h3>
                  <span style={{ fontSize: '13px', color: '#475569' }}>Specific RFQs submitted by buyers clicking "Request Export Quote" on products</span>
                </div>

                <button
                  onClick={() => exportEnquiriesCSV('product_quote')}
                  style={{
                    backgroundColor: '#0369A1',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '100px',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(3, 105, 161, 0.25)'
                  }}
                >
                  <Download size={18} />
                  <span>📥 Export Product Enquiries (CSV)</span>
                </button>
              </div>

              {productQuotes.length === 0 ? (
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '60px 20px', textAlign: 'center', border: '1.5px solid #CBD5E1' }}>
                  <Inbox size={48} style={{ color: '#CBD5E1', marginBottom: '16px' }} />
                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#0B2240' }}>No Product Quote Enquiries Yet</h4>
                  <p style={{ color: '#475569', fontSize: '14px' }}>Product quote requests submitted by website buyers will appear here in real time.</p>
                </div>
              ) : (
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1.5px solid #CBD5E1', overflow: 'hidden', boxShadow: '0 8px 24px rgba(11, 34, 64, 0.04)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F0F9FF', borderBottom: '1.5px solid #BAE6FD', color: '#0369A1', fontWeight: 800 }}>
                        <th style={{ padding: '16px 20px' }}>Date</th>
                        <th style={{ padding: '16px 20px' }}>Buyer & Company</th>
                        <th style={{ padding: '16px 20px' }}>Requested Commodity</th>
                        <th style={{ padding: '16px 20px' }}>Target Quantity</th>
                        <th style={{ padding: '16px 20px' }}>Destination Port</th>
                        <th style={{ padding: '16px 20px' }}>Status</th>
                        <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productQuotes.map((enq) => (
                        <tr key={enq.id} style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: enq.status === 'New' ? 'rgba(3, 105, 161, 0.03)' : '#FFFFFF' }}>
                          <td style={{ padding: '16px 20px', fontSize: '13px', color: '#475569', fontWeight: 600 }}>
                            {enq.date}
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            <strong style={{ fontSize: '15px', color: '#0B2240', display: 'block' }}>{enq.name}</strong>
                            <span style={{ fontSize: '12.5px', color: '#475569' }}>{enq.company}</span>
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            <strong style={{ color: '#0369A1', fontSize: '14.5px', display: 'block' }}>{enq.product}</strong>
                          </td>
                          <td style={{ padding: '16px 20px', color: '#0B2240', fontWeight: 700 }}>
                            {enq.quantity}
                          </td>
                          <td style={{ padding: '16px 20px', color: '#0B2240', fontWeight: 600 }}>
                            {enq.destinationPort || 'Not specified'}
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '100px',
                              fontSize: '12px',
                              fontWeight: 800,
                              backgroundColor: enq.status === 'New' ? '#FFF4ED' : '#D1FAE5',
                              color: enq.status === 'New' ? '#92400E' : '#065F46',
                              border: enq.status === 'New' ? '1px solid #FF8238' : '1px solid #6EE7B7'
                            }}>
                              {enq.status || 'New'}
                            </span>
                          </td>
                          <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                              <button onClick={() => setSelectedEnquiry(enq)} style={{ backgroundColor: '#0369A1', color: '#FFFFFF', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>
                                View Details
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
              )}
            </div>
          );
        })()}

        {/* TAB 5: CONTACT US ENQUIRIES */}
        {activeTab === 'contact_enquiries' && (() => {
          const contactFormEnqs = enquiries.filter(e => (e.source || '').toLowerCase().includes('contact'));

          return (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#15803D', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={22} />
                    <span>✉️ Contact Us Form Submissions Inbox ({contactFormEnqs.length})</span>
                  </h3>
                  <span style={{ fontSize: '13px', color: '#475569' }}>General export enquiries submitted through the website Contact Us page form</span>
                </div>

                <button
                  onClick={() => exportEnquiriesCSV('contact_form')}
                  style={{
                    backgroundColor: '#15803D',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '100px',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(21, 128, 61, 0.25)'
                  }}
                >
                  <Download size={18} />
                  <span>📥 Export Contact Enquiries (CSV)</span>
                </button>
              </div>

              {contactFormEnqs.length === 0 ? (
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '60px 20px', textAlign: 'center', border: '1.5px solid #CBD5E1' }}>
                  <Mail size={48} style={{ color: '#CBD5E1', marginBottom: '16px' }} />
                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#0B2240' }}>No Contact Form Submissions Yet</h4>
                  <p style={{ color: '#475569', fontSize: '14px' }}>Submissions from the Contact Us page will appear here in real time.</p>
                </div>
              ) : (
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1.5px solid #CBD5E1', overflow: 'hidden', boxShadow: '0 8px 24px rgba(11, 34, 64, 0.04)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F0FDF4', borderBottom: '1.5px solid #BBF7D0', color: '#15803D', fontWeight: 800 }}>
                        <th style={{ padding: '16px 20px' }}>Date</th>
                        <th style={{ padding: '16px 20px' }}>Sender Name & Company</th>
                        <th style={{ padding: '16px 20px' }}>Email & Phone</th>
                        <th style={{ padding: '16px 20px' }}>Product Interest</th>
                        <th style={{ padding: '16px 20px' }}>Message / Enquiry</th>
                        <th style={{ padding: '16px 20px' }}>Status</th>
                        <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contactFormEnqs.map((enq) => (
                        <tr key={enq.id} style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: enq.status === 'New' ? 'rgba(21, 128, 61, 0.03)' : '#FFFFFF' }}>
                          <td style={{ padding: '16px 20px', fontSize: '13px', color: '#475569', fontWeight: 600 }}>
                            {enq.date}
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            <strong style={{ fontSize: '15px', color: '#0B2240', display: 'block' }}>{enq.name}</strong>
                            <span style={{ fontSize: '12.5px', color: '#475569' }}>{enq.company || 'Individual Importer'}</span>
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            <a href={`mailto:${enq.email}`} style={{ color: '#0B2240', fontWeight: 700, display: 'block', textDecoration: 'none', fontSize: '13.5px' }}>{enq.email}</a>
                            <span style={{ fontSize: '12.5px', color: '#475569' }}>{enq.phone}</span>
                          </td>
                          <td style={{ padding: '16px 20px', color: '#15803D', fontWeight: 700 }}>
                            {enq.product}
                          </td>
                          <td style={{ padding: '16px 20px', color: '#475569', fontSize: '13px', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {enq.notes || enq.message || 'No message attached'}
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '100px',
                              fontSize: '12px',
                              fontWeight: 800,
                              backgroundColor: enq.status === 'New' ? '#FFF4ED' : '#D1FAE5',
                              color: enq.status === 'New' ? '#92400E' : '#065F46',
                              border: enq.status === 'New' ? '1px solid #FF8238' : '1px solid #6EE7B7'
                            }}>
                              {enq.status || 'New'}
                            </span>
                          </td>
                          <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                              <button onClick={() => setSelectedEnquiry(enq)} style={{ backgroundColor: '#15803D', color: '#FFFFFF', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>
                                View Details
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
              )}
            </div>
          );
        })()}

      </div>

      {/* --- MODAL 1: ADD / EDIT PRODUCT --- */}
      {showProductModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(7,23,44,0.75)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '28px', padding: '32px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', border: '1.5px solid #CBD5E1', boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1.5px solid #F1F5F9', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0B2240', margin: 0, fontFamily: 'var(--font-h, Outfit, sans-serif)' }}>
                {editingProduct ? 'Edit Product Details' : 'Add New Agro Product'}
              </h3>
              <button onClick={() => setShowProductModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Turmeric Powder"
                    value={prodForm.title}
                    onChange={(e) => setProdForm({ ...prodForm, title: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Category *</label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
                  >
                    {PRODUCT_CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Origin</label>
                  <input
                    type="text"
                    placeholder="e.g. Erode & Sangli, India"
                    value={prodForm.origin}
                    onChange={(e) => setProdForm({ ...prodForm, origin: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>HS Code</label>
                  <input
                    type="text"
                    placeholder="e.g. HS 09103020"
                    value={prodForm.hsCode}
                    onChange={(e) => setProdForm({ ...prodForm, hsCode: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Product Image (URL or Upload)</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Paste Image URL or select file below"
                    value={prodForm.image}
                    onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                    style={{ flex: 1, padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px' }}
                  />
                  <label style={{ backgroundColor: '#F1F5F9', border: '1.5px solid #CBD5E1', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '13px', color: '#0B2240', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Upload size={15} /> Upload File
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageFileChange(e, (url) => setProdForm({ ...prodForm, image: url }))} />
                  </label>
                </div>
                {prodForm.image && (
                  <img src={prodForm.image} alt="Preview" style={{ height: '60px', marginTop: '10px', borderRadius: '10px', objectFit: 'contain', border: '1px solid #CBD5E1' }} />
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Specifications</label>
                <input
                  type="text"
                  placeholder="e.g. Curcumin > 3.5% | Moisture < 10%"
                  value={prodForm.specs}
                  onChange={(e) => setProdForm({ ...prodForm, specs: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Description</label>
                <textarea
                  rows={3}
                  placeholder="Detailed product description for global export buyers..."
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowProductModal(false)} style={{ padding: '12px 24px', borderRadius: '100px', border: '1.5px solid #CBD5E1', backgroundColor: 'transparent', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '12px 32px', borderRadius: '100px', backgroundColor: '#0B2240', color: '#FFFFFF', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: ADD / EDIT BLOG --- */}
      {showBlogModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(7,23,44,0.75)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '28px', padding: '32px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', border: '1.5px solid #CBD5E1', boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1.5px solid #F1F5F9', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0B2240', margin: 0, fontFamily: 'var(--font-h, Outfit, sans-serif)' }}>
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
                  placeholder="e.g. Sourcing High-Curcumin Indian Turmeric"
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
                  placeholder="Complete article content..."
                  value={blogForm.body}
                  onChange={(e) => setBlogForm({ ...blogForm, body: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowBlogModal(false)} style={{ padding: '12px 24px', borderRadius: '100px', border: '1.5px solid #CBD5E1', backgroundColor: 'transparent', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '12px 32px', borderRadius: '100px', backgroundColor: '#0B2240', color: '#FFFFFF', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Save Article</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: ADD / EDIT CERTIFICATE --- */}
      {showCertModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(7,23,44,0.75)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '28px', padding: '32px', width: '100%', maxWidth: '540px', border: '1.5px solid #CBD5E1', boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1.5px solid #F1F5F9', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0B2240', margin: 0, fontFamily: 'var(--font-h, Outfit, sans-serif)' }}>
                {editingCert ? 'Edit Certificate' : 'Add New Certificate'}
              </h3>
              <button onClick={() => setShowCertModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveCert} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Certificate Name / Authority *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. APEDA Certified Exporter, US FDA, Spices Board..."
                  value={certForm.name}
                  onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Short Description / Details</label>
                <input
                  type="text"
                  placeholder="e.g. Ministry of Commerce & Industry, Govt of India"
                  value={certForm.tag}
                  onChange={(e) => setCertForm({ ...certForm, tag: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0B2240', marginBottom: '6px' }}>Certificate Photo / Logo *</label>
                
                {/* Visual Photo Upload Dropzone */}
                <div style={{ border: '2px dashed #CBD5E1', borderRadius: '16px', padding: '20px', textAlign: 'center', background: '#F8FAFC', position: 'relative' }}>
                  {certForm.logo ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <div style={{ height: '90px', width: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '8px' }}>
                        <img src={certForm.logo} alt="Preview" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                      </div>
                      <label style={{ backgroundColor: '#0B2240', color: '#FFFFFF', padding: '8px 18px', borderRadius: '100px', cursor: 'pointer', fontWeight: 700, fontSize: '12.5px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Upload size={14} /> Change Photo
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageFileChange(e, (url) => setCertForm({ ...certForm, logo: url }))} />
                      </label>
                    </div>
                  ) : (
                    <div>
                      <Upload size={32} style={{ color: '#94A3B8', marginBottom: '8px' }} />
                      <p style={{ margin: '0 0 10px', fontSize: '13.5px', color: '#475569', fontWeight: 600 }}>Upload Certificate Image (PNG, JPG, SVG, WebP)</p>
                      <label style={{ backgroundColor: '#0B2240', color: '#FFFFFF', padding: '9px 22px', borderRadius: '100px', cursor: 'pointer', fontWeight: 800, fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Upload size={15} /> Select Certificate Photo
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageFileChange(e, (url) => setCertForm({ ...certForm, logo: url }))} />
                      </label>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '10px' }}>
                  <input
                    type="text"
                    placeholder="Or paste external image URL..."
                    value={certForm.logo}
                    onChange={(e) => setCertForm({ ...certForm, logo: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowCertModal(false)} style={{ padding: '12px 24px', borderRadius: '100px', border: '1.5px solid #CBD5E1', backgroundColor: 'transparent', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '12px 32px', borderRadius: '100px', backgroundColor: '#0B2240', color: '#FFFFFF', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Save Certificate</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 4: VIEW ENQUIRY DETAILS --- */}
      {selectedEnquiry && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(7,23,44,0.75)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '28px', padding: '32px', width: '100%', maxWidth: '600px', border: '1.5px solid #CBD5E1', boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1.5px solid #F1F5F9', paddingBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0369A1', backgroundColor: '#E0F2FE', padding: '3px 8px', borderRadius: '6px', marginRight: '8px', border: '1px solid #BAE6FD' }}>
                  {selectedEnquiry.source || 'Website Form'}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#8C96A0' }}>{selectedEnquiry.date}</span>
                <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0B2240', margin: '4px 0 0', fontFamily: 'var(--font-h, Outfit, sans-serif)' }}>
                  Enquiry & Quote Details
                </h3>
              </div>
              <button onClick={() => setSelectedEnquiry(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#475569', display: 'block', fontWeight: 700 }}>BUYER NAME</span>
                  <strong style={{ fontSize: '15px', color: '#0B2240' }}>{selectedEnquiry.name}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#475569', display: 'block', fontWeight: 700 }}>COMPANY</span>
                  <strong style={{ fontSize: '15px', color: '#0B2240' }}>{selectedEnquiry.company}</strong>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#F1F5F9', padding: '12px 16px', borderRadius: '12px' }}>
                  <Mail size={18} style={{ color: '#0B2240' }} />
                  <div>
                    <span style={{ fontSize: '11px', color: '#475569', display: 'block' }}>Email Address</span>
                    <a href={`mailto:${selectedEnquiry.email}`} style={{ color: '#0B2240', fontWeight: 700, textDecoration: 'none' }}>{selectedEnquiry.email}</a>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#F1F5F9', padding: '12px 16px', borderRadius: '12px' }}>
                  <Phone size={18} style={{ color: '#25D366' }} />
                  <div>
                    <span style={{ fontSize: '11px', color: '#475569', display: 'block' }}>Phone / WhatsApp</span>
                    <a href={`https://api.whatsapp.com/send?phone=${selectedEnquiry.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" style={{ color: '#0B2240', fontWeight: 700, textDecoration: 'none' }}>{selectedEnquiry.phone}</a>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#475569', fontWeight: 700 }}>REQUESTED PRODUCT</span>
                  <p style={{ margin: '2px 0 0', fontWeight: 800, color: '#0B2240', fontSize: '16px' }}>{selectedEnquiry.product}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#475569', fontWeight: 700 }}>TARGET QUANTITY</span>
                    <p style={{ margin: 0, fontWeight: 700, color: '#0B2240' }}>{selectedEnquiry.quantity}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#475569', fontWeight: 700 }}>DESTINATION PORT</span>
                    <p style={{ margin: 0, fontWeight: 700, color: '#0B2240' }}>{selectedEnquiry.destinationPort || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {selectedEnquiry.notes && (
                <div>
                  <span style={{ fontSize: '12px', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '4px' }}>BUYER NOTES / MESSAGE</span>
                  <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', padding: '14px', borderRadius: '12px', color: '#92400E', lineHeight: 1.5, fontSize: '13.5px' }}>
                    {selectedEnquiry.notes}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
                <button
                  onClick={() => {
                    handleToggleEnquiryStatus(selectedEnquiry.id, selectedEnquiry.status);
                    setSelectedEnquiry(prev => ({ ...prev, status: prev.status === 'New' ? 'Replied' : 'New' }));
                  }}
                  style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', padding: '10px 18px', borderRadius: '100px', fontWeight: 700, color: '#0B2240', cursor: 'pointer' }}
                >
                  Status: {selectedEnquiry.status} (Toggle)
                </button>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <a
                    href={`https://api.whatsapp.com/send?phone=${selectedEnquiry.phone.replace(/[^0-9]/g, '')}&text=Hi%20${encodeURIComponent(selectedEnquiry.name)},%20thank%20you%20for%20your%20quote%20request%20for%20${encodeURIComponent(selectedEnquiry.product)}%20at%20Trishu%20Impex.`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ backgroundColor: '#25D366', color: '#FFFFFF', padding: '10px 20px', borderRadius: '100px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13.5px' }}
                  >
                    <MessageSquare size={16} /> Reply on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
