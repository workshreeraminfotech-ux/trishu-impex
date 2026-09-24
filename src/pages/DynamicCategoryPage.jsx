import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ArrowRight, Eye, Sparkles, Filter, CheckCircle2, 
  Package, Box, Leaf, Layers, ShieldCheck, Factory, Truck, Flame, Globe,
  Sprout, Bath, Grid3X3, Wrench, Waves
} from 'lucide-react';
import { getDomainProducts, getCategories } from '../utils/adminStore';

const ICON_MAP = {
  Sparkles, Sprout, Bath, Grid3X3, Wrench, Waves,
  Package, Box, Leaf, Layers, ShieldCheck, Factory, Truck, Flame, Globe
};

export default function DynamicCategoryPage({ category, onSelectProduct, onOpenQuote }) {
  const domainId = category?.id || 'spices';
  const categoryName = category?.name || 'Products Catalogue';
  const categoryColor = category?.color || '#ED6C1B';
  const defaultHs = category?.defaultHs || 'Certified Export';
  const defaultPack = category?.defaultPack || 'Standard Export Packing';

  const IconComponent = ICON_MAP[category?.icon] || Package;

  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState(() => getCategories(domainId));
  const [productsList, setProductsList] = useState(() => getDomainProducts(domainId));

  const syncData = () => {
    setCategories([...getCategories(domainId)]);
    setProductsList([...getDomainProducts(domainId)]);
  };

  useEffect(() => {
    syncData();
    setActiveTab('All');
  }, [domainId]);

  useEffect(() => {
    const handleSync = () => syncData();
    window.addEventListener('trishu_store_sync', handleSync);
    window.addEventListener('trishu_store_updated', handleSync);
    return () => {
      window.removeEventListener('trishu_store_sync', handleSync);
      window.removeEventListener('trishu_store_updated', handleSync);
    };
  }, [domainId]);

  // Filter logic
  const filteredProducts = useMemo(() => {
    return productsList.filter(product => {
      const prodCat = product.category || product.cat || 'General';
      const matchesCategory = activeTab === 'All' || prodCat.toLowerCase() === activeTab.toLowerCase();
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch = query === '' || 
        (product.title && product.title.toLowerCase().includes(query)) || 
        (product.description && product.description.toLowerCase().includes(query)) ||
        (product.desc && product.desc.toLowerCase().includes(query)) ||
        (product.specs && product.specs.toLowerCase().includes(query)) ||
        (product.origin && product.origin.toLowerCase().includes(query));
      
      return matchesCategory && matchesSearch;
    });
  }, [activeTab, searchTerm, productsList]);

  // Counts for tabs
  const categoryCounts = useMemo(() => {
    const counts = { All: productsList.length };
    productsList.forEach(p => {
      const cat = p.category || p.cat || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [productsList]);

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* Dynamic Hero Section */}
      <section style={{
        position: 'relative',
        color: '#FFFFFF',
        padding: '75px 0 65px',
        overflow: 'hidden',
        backgroundColor: '#0F172A'
      }}>
        {/* Subtle Background Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 80% 20%, ${categoryColor}35 0%, transparent 60%), linear-gradient(180deg, #0B2240 0%, #07182E 100%)`,
          zIndex: 1
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}
          >
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: `1.5px solid ${categoryColor}`,
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              padding: '6px 20px',
              borderRadius: '100px',
              marginBottom: '20px',
              backdropFilter: 'blur(6px)'
            }}>
              <IconComponent size={15} style={{ color: categoryColor }} />
              {defaultHs} • {productsList.length} Products Available
            </span>

            <h1 style={{
              fontFamily: 'var(--font-h, Outfit, sans-serif)',
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: '16px',
              letterSpacing: '-0.5px',
              color: '#FFFFFF'
            }}>
              Export Quality <br />
              <span style={{ color: categoryColor }}>{categoryName}</span>
            </h1>

            <p style={{
              fontSize: 'clamp(15px, 2vw, 17.5px)',
              color: '#E2E8F0',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto 28px',
              fontWeight: 400
            }}>
              Direct manufacturer & farm supply with full export compliance, rigorous inspection, custom packaging ({defaultPack}) and reliable international shipping.
            </p>

            {/* Quick Stats Badges */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.1)', padding: '6px 14px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <CheckCircle2 size={15} style={{ color: '#22C55E' }} />
                <span>Lab COA / Phytosanitary Certified</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.1)', padding: '6px 14px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <CheckCircle2 size={15} style={{ color: '#22C55E' }} />
                <span>FOB / CIF Global Ports</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.1)', padding: '6px 14px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <CheckCircle2 size={15} style={{ color: '#22C55E' }} />
                <span>{defaultPack}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container" style={{ marginTop: '36px' }}>
        
        {/* Search & Sub-Category Filter Navigation Bar */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '20px 24px',
          boxShadow: '0 8px 30px rgba(11, 34, 64, 0.05)',
          border: '1.5px solid #E2E8F0',
          marginBottom: '36px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: categories.length > 1 ? '16px' : '0'
          }}>
            {/* Search Input Box */}
            <div style={{
              position: 'relative',
              flex: '1 1 300px',
              maxWidth: '520px'
            }}>
              <Search 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: '#94A3B8' 
                }} 
              />
              <input
                type="text"
                placeholder={`Search ${categoryName} (e.g. title, specs, packaging)...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 44px',
                  borderRadius: '100px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#F8FAFC',
                  color: '#0B2240',
                  boxSizing: 'border-box',
                  fontWeight: 500,
                  transition: 'border-color 0.2s'
                }}
              />
            </div>

            {/* Total Results Counter */}
            <div style={{
              fontSize: '13.5px',
              fontWeight: 700,
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Filter size={15} style={{ color: categoryColor }} />
              <span>Showing <strong>{filteredProducts.length}</strong> of {productsList.length} products</span>
            </div>
          </div>

          {/* Subcategory Filter Pills */}
          {categories.length > 1 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              overflowX: 'auto',
              paddingTop: '12px',
              borderTop: '1px solid #F1F5F9',
              scrollbarWidth: 'none'
            }}>
              {categories.map((cat, idx) => {
                const isActive = activeTab.toLowerCase() === cat.toLowerCase();
                const count = categoryCounts[cat] || (cat === 'All' ? productsList.length : 0);

                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(cat)}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '100px',
                      border: isActive ? `1.5px solid ${categoryColor}` : '1.5px solid #E2E8F0',
                      backgroundColor: isActive ? categoryColor : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : '#475569',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? `0 4px 12px ${categoryColor}35` : 'none'
                    }}
                  >
                    <span>{cat}</span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: '100px',
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : '#F1F5F9',
                      color: isActive ? '#FFFFFF' : '#64748B'
                    }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((prod, index) => {
                const fallbackImg = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80';
                const imgSrc = prod.image || fallbackImg;
                const subCat = prod.category || prod.cat || 'Export Grade';

                return (
                  <motion.div
                    key={prod.id || index}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '20px',
                      border: '1.5px solid #E2E8F0',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 4px 18px rgba(11, 34, 64, 0.04)',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                    }}
                    whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(11, 34, 64, 0.1)' }}
                  >
                    {/* Product Image Box */}
                    <div 
                      style={{
                        position: 'relative',
                        height: '220px',
                        backgroundColor: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '16px',
                        overflow: 'hidden',
                        borderBottom: '1px solid #F1F5F9'
                      }}
                    >
                      <img
                        src={imgSrc}
                        alt={prod.title}
                        loading="lazy"
                        style={{
                          maxHeight: '100%',
                          maxWidth: '100%',
                          objectFit: 'contain',
                          transition: 'transform 0.3s ease'
                        }}
                      />

                      {subCat && subCat !== 'All' && subCat !== 'General' && (
                        <span style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.94)',
                          color: '#0B2240',
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '4px 10px',
                          borderRadius: '100px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                          backdropFilter: 'blur(4px)',
                          border: '1px solid #E2E8F0'
                        }}>
                          {subCat}
                        </span>
                      )}
                    </div>

                    {/* Product Info Body: Name, Description & Quote Action */}
                    <div style={{
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1
                    }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: 800,
                        color: '#0B2240',
                        margin: '0 0 10px',
                        lineHeight: 1.3
                      }}>
                        {prod.title}
                      </h3>

                      <p style={{
                        fontSize: '13.5px',
                        color: '#57534E',
                        lineHeight: 1.6,
                        margin: '0 0 20px',
                        flex: 1
                      }}>
                        {prod.description || prod.desc || 'Premium export quality grade.'}
                      </p>

                      {/* Single Clean Action Button */}
                      <button
                        type="button"
                        onClick={() => onOpenQuote ? onOpenQuote(prod.title) : null}
                        style={{
                          width: '100%',
                          backgroundColor: categoryColor || '#0B2240',
                          border: 'none',
                          color: '#FFFFFF',
                          padding: '12px 18px',
                          borderRadius: '10px',
                          fontWeight: 800,
                          fontSize: '13.5px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          transition: 'all 0.2s ease',
                          boxShadow: `0 4px 14px ${categoryColor}30`,
                          marginTop: 'auto'
                        }}
                      >
                        <span>Get Quote</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* Empty State */
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '60px 24px',
            textAlign: 'center',
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 4px 18px rgba(11, 34, 64, 0.04)',
            maxWidth: '580px',
            margin: '0 auto'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: `${categoryColor}15`,
              color: categoryColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Package size={30} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0B2240', margin: '0 0 8px' }}>
              {productsList.length === 0 ? 'No Products Added Yet' : 'No Matching Products Found'}
            </h3>
            <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '420px', margin: '0 auto 24px', lineHeight: 1.5 }}>
              {productsList.length === 0 
                ? `Products can be added to "${categoryName}" anytime directly from the Admin Panel.`
                : `We couldn't find any products matching "${searchTerm}". Try adjusting your search query.`}
            </p>
            {searchTerm && (
              <button
                onClick={() => { setSearchTerm(''); setActiveTab('All'); }}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#0B2240',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '100px',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  cursor: 'pointer'
                }}
              >
                Clear Search & Filter
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
