import React, { useState, useEffect } from 'react';

import HeaderTop from './components/HeaderTop';
import Navbar from './components/Navbar';
import FooterSection from './components/FooterSection';
import QuickViewModal from './components/QuickViewModal';
import QuoteModal from './components/QuoteModal';
import WhatsAppFloat from './components/WhatsAppFloat';

import AdminPanel from './admin/AdminPanel';

import Preloader from './components/Preloader';

// Pages
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import AgroPage from './pages/AgroPage';
import SanitarywarePage from './pages/SanitarywarePage';
import TilesPage from './pages/TilesPage';
import HardwarePage from './pages/HardwarePage';
import PvcPipePage from './pages/PvcPipePage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quoteProduct, setQuoteProduct] = useState('');
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isPreloading, setIsPreloading] = useState(true);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenQuote = (productName = '') => {
    setQuoteProduct(productName);
    setIsQuoteOpen(true);
  };

  return (
    <div>
      <Preloader onFinish={() => setIsPreloading(false)} />
      <HeaderTop />
      <Navbar 
        activePage={activePage} 
        onNavigate={handleNavigate} 
        onOpenQuote={() => handleOpenQuote()} 
      />

      <main>
        {(activePage === 'home' || activePage === 'faq') && (
          <Home 
            onSelectProduct={setSelectedProduct} 
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
        {(activePage === 'products' || activePage === 'spices') && (
          <ProductsPage 
            onSelectProduct={setSelectedProduct} 
            onOpenQuote={(prod) => handleOpenQuote(prod)} 
          />
        )}
        {activePage === 'agro' && (
          <AgroPage 
            onSelectProduct={setSelectedProduct} 
            onOpenQuote={(prod) => handleOpenQuote(prod)} 
          />
        )}
        {activePage === 'sanitaryware' && (
          <SanitarywarePage 
            onSelectProduct={setSelectedProduct} 
            onOpenQuote={(prod) => handleOpenQuote(prod)} 
          />
        )}
        {activePage === 'tiles' && (
          <TilesPage 
            onSelectProduct={setSelectedProduct} 
            onOpenQuote={(prod) => handleOpenQuote(prod)} 
          />
        )}
        {activePage === 'hardware' && (
          <HardwarePage 
            onSelectProduct={setSelectedProduct} 
            onOpenQuote={(prod) => handleOpenQuote(prod)} 
          />
        )}
        {activePage === 'pvc-pipes' && (
          <PvcPipePage 
            onSelectProduct={setSelectedProduct} 
            onOpenQuote={(prod) => handleOpenQuote(prod)} 
          />
        )}
        {activePage === 'blog' && (
          <BlogPage />
        )}
        {activePage === 'contact' && (
          <ContactPage 
            onOpenQuote={() => handleOpenQuote()} 
          />
        )}
      </main>

      <FooterSection onNavigate={handleNavigate} />

      {selectedProduct && (
        <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onOpenQuote={(prod) => handleOpenQuote(prod)} />
      )}

      <QuoteModal 
        isOpen={isQuoteOpen} 
        initialProduct={quoteProduct} 
        onClose={() => setIsQuoteOpen(false)} 
      />

      {!isPreloading && <WhatsAppFloat />}
    </div>
  );
}
