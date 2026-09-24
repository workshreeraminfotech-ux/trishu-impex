import React, { useState, useEffect, useCallback } from 'react';

import HeaderTop from './components/HeaderTop';
import Navbar from './components/Navbar';
import FooterSection from './components/FooterSection';
import QuoteModal from './components/QuoteModal';
import WhatsAppFloat from './components/WhatsAppFloat';

import AdminPanel from './admin/AdminPanel';
import Preloader from './components/Preloader';

// Core Pages
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import DynamicCategoryPage from './pages/DynamicCategoryPage';

import { getMainCategories } from './utils/adminStore';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [quoteProduct, setQuoteProduct] = useState('');
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isPreloading, setIsPreloading] = useState(true);
  const [mainCategories, setMainCategories] = useState(() => getMainCategories());

  const handlePreloaderFinish = useCallback(() => {
    setIsPreloading(false);
  }, []);

  useEffect(() => {
    const handleSync = () => {
      setMainCategories([...getMainCategories()]);
    };
    window.addEventListener('trishu_store_sync', handleSync);
    window.addEventListener('trishu_store_updated', handleSync);
    return () => {
      window.removeEventListener('trishu_store_sync', handleSync);
      window.removeEventListener('trishu_store_updated', handleSync);
    };
  }, []);

  useEffect(() => {
    const checkAdminRoute = () => {
      const hostname = window.location.hostname.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();

      const isSubdomainAdmin = hostname.startsWith('admin.') || hostname.includes('admin.') || hostname === 'admin';
      const isPathAdmin = pathname.includes('admin') || hash.includes('admin') || search.includes('admin');

      if (isSubdomainAdmin || isPathAdmin) {
        setIsAdmin(true);
      }
    };

    const handleKeyDown = (e) => {
      // Shortcut: Ctrl + Shift + A or Cmd + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdmin(prev => !prev);
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (isAdmin) {
    return <AdminPanel />;
  }

  const handleNavigate = (pageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 50);
  };

  const handleOpenQuote = (productName = '') => {
    setQuoteProduct(productName);
    setIsQuoteOpen(true);
  };

  // Find dynamic category matching activePage
  const matchedCategory = mainCategories.find(c => 
    c.id === activePage || 
    (c.id === 'spices' && (activePage === 'products' || activePage === 'spices')) || 
    (c.id === 'pvcpipe' && (activePage === 'pvc-pipes' || activePage === 'pvcpipe')) ||
    (c.name && c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === activePage)
  );

  return (
    <div>
      <Preloader onFinish={handlePreloaderFinish} />
      <HeaderTop />
      <Navbar 
        activePage={activePage} 
        onNavigate={handleNavigate} 
        onOpenQuote={() => handleOpenQuote()} 
      />

      <main>
        {(activePage === 'home' || activePage === 'faq') && (
          <Home 
            onNavigate={handleNavigate} 
            onOpenQuote={(prod) => handleOpenQuote(prod)} 
          />
        )}

        {activePage === 'about' && (
          <AboutPage 
            onNavigate={handleNavigate} 
            onOpenQuote={() => handleOpenQuote()} 
          />
        )}

        {activePage === 'contact' && (
          <ContactPage 
            onOpenQuote={() => handleOpenQuote()} 
          />
        )}

        {/* 100% Dynamic Category Page */}
        {activePage !== 'home' && activePage !== 'faq' && activePage !== 'about' && activePage !== 'contact' && (
          <DynamicCategoryPage 
            category={matchedCategory || { id: activePage, name: activePage.charAt(0).toUpperCase() + activePage.slice(1), color: '#ED6C1B' }}
            onOpenQuote={(prod) => handleOpenQuote(prod)} 
          />
        )}
      </main>

      <FooterSection onNavigate={handleNavigate} />

      <QuoteModal 
        isOpen={isQuoteOpen} 
        initialProduct={quoteProduct} 
        onClose={() => setIsQuoteOpen(false)} 
      />

      {!isPreloading && <WhatsAppFloat />}
    </div>
  );
}
