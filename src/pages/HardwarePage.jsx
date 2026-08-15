import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Eye, Sparkles, Filter, CheckCircle2, Wrench } from 'lucide-react';
import { HARDWARE_CATEGORIES } from '../data/hardwareProducts';
import { getHardwareProducts } from '../utils/adminStore';

export default function HardwarePage({ onSelectProduct, onOpenQuote }) {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const productsList = getHardwareProducts();

  // Filter logic
  const filteredProducts = useMemo(() => {
    return productsList.filter(product => {
      const matchesCategory = activeTab === 'All' || product.category === activeTab || product.cat === activeTab;
      const matchesSearch = searchTerm.trim() === '' || 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.desc && product.desc.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.specs && product.specs.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  }, [activeTab, searchTerm, productsList]);

  // Counts for tabs
  const categoryCounts = useMemo(() => {
    const counts = { All: productsList.length };
    productsList.forEach(p => {
      const cat = p.category || p.cat;
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
        backgroundColor: '#1E293B'
      }}>
        {/* Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1920&q=80" 
          alt="Hardware Catalogue Background" 
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 0
          }}
        />
        {/* Dark Metallic Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.94) 100%)',
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
              border: '1.5px solid #ED6C1B',
              color: '#ED6C1B',
              fontSize: '12px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              padding: '6px 20px',
              borderRadius: '100px',
              marginBottom: '20px',
              backdropFilter: 'blur(6px)'
            }}>
              <Wrench size={14} style={{ color: '#ED6C1B' }} />
              Export Grade SS 304 & Architectural Hardware • {productsList.length} Products
            </span>

            <h1 style={{
              fontFamily: 'var(--font-h, Outfit, sans-serif)',
              fontSize: 'clamp(32px, 5vw, 54px)',
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: '20px',
              letterSpacing: '-0.5px',
              color: '#FFFFFF'
            }}>
              Explore Our Complete <br />
              <span style={{ color: '#ED6C1B' }}>Architectural Hardware Catalogue</span>
            </h1>

            <p style={{
              fontSize: '17px',
              color: 'rgba(255, 255, 255, 0.92)',
              lineHeight: 1.6,
              maxWidth: '740px',
              margin: '0 auto 36px',
              fontWeight: 500
            }}>
              Stainless Steel 304 Mortise Door Handles, Brass & SS Ball Bearing Hinges, Telescopic Drawer Slides, Hydraulic Door Closers & Precision Architectural Fittings.
            </p>

            {/* Quick Stats Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              flexWrap: 'wrap',
              fontSize: '14px',
              color: '#FFFFFF',
              fontWeight: 700
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.1)', padding: '8px 18px', borderRadius: '100px', border: '1px solid rgba(237, 108, 27, 0.4)' }}>
                <CheckCircle2 size={16} style={{ color: '#ED6C1B' }} />
                <span>AISI SS 304 & Solid Brass</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.1)', padding: '8px 18px', borderRadius: '100px', border: '1px solid rgba(237, 108, 27, 0.4)' }}>
                <CheckCircle2 size={16} style={{ color: '#ED6C1B' }} />
                <span>Salt Spray & Cycle Tested</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.1)', padding: '8px 18px', borderRadius: '100px', border: '1px solid rgba(237, 108, 27, 0.4)' }}>
                <CheckCircle2 size={16} style={{ color: '#ED6C1B' }} />
                <span>Global OEM & Retail Packaging</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Catalog Content */}
      <div className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
        
        {/* Search & Category Filter Controls */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '0 20px 50px rgba(237, 108, 27, 0.08)',
          border: '1.5px solid var(--border)',
          marginBottom: '40px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {/* Search Input Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#FFFDF7',
              border: '1.5px solid var(--border)',
              borderRadius: '16px',
              padding: '12px 20px'
            }}>
              <Search size={20} style={{ color: 'var(--gold)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search hardware (e.g. Mortise Handle, SS Hinges, Drawer Slide, Door Closer, Tower Bolt...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  width: '100%',
                  fontSize: '15px',
                  fontWeight: 500,
                  color: 'var(--navy)'
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{
                    border: 'none',
                    background: 'var(--gold-pale)',
                    color: 'var(--gold-deep)',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Tabs */}
            <div style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: '6px', marginRight: '6px' }}>
                <Filter size={14} style={{ color: 'var(--gold)' }} /> Categories:
              </span>
              {HARDWARE_CATEGORIES.map((cat) => {
                const isActive = activeTab === cat;
                const count = categoryCounts[cat] || 0;

                return (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '100px',
                      fontSize: '13.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: isActive ? '1.5px solid var(--gold)' : '1.5px solid var(--border)',
                      background: isActive ? 'linear-gradient(135deg, #ED6C1B 0%, #FF8238 100%)' : '#FFFFFF',
                      color: isActive ? '#1C1917' : 'var(--navy)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.25s ease',
                      boxShadow: isActive ? '0 4px 14px rgba(237, 108, 27, 0.3)' : 'none'
                    }}
                  >
                    <span>{cat}</span>
                    <span style={{
                      backgroundColor: isActive ? 'rgba(28, 25, 23, 0.15)' : 'var(--gold-pale)',
                      color: isActive ? '#1C1917' : 'var(--gold-deep)',
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '100px',
                      fontWeight: 800
                    }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Counter Info */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          padding: '0 4px'
        }}>
          <p style={{ fontSize: '14.5px', color: 'var(--gray)', fontWeight: 600 }}>
            Showing <strong style={{ color: 'var(--navy)' }}>{filteredProducts.length}</strong> of <strong style={{ color: 'var(--navy)' }}>{productsList.length}</strong> hardware products
            {activeTab !== 'All' && <span> in <strong>{activeTab}</strong></span>}
          </p>

          {(searchTerm || activeTab !== 'All') && (
            <button
              onClick={() => { setActiveTab('All'); setSearchTerm(''); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gold-deep)',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        <motion.div
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '28px'
          }}
        >
          <AnimatePresence>
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id || idx}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: (idx % 6) * 0.05 }}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1.5px solid var(--border)',
                  boxShadow: '0 8px 30px rgba(237, 108, 27, 0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                  cursor: 'pointer'
                }}
                whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(237, 108, 27, 0.2)', borderColor: 'var(--gold)' }}
                onClick={() => onSelectProduct ? onSelectProduct(product) : null}
              >
                {/* Product Image */}
                <div style={{
                  position: 'relative',
                  height: '230px',
                  backgroundColor: '#F8FAFC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  borderBottom: '1px solid var(--border)'
                }}>
                  <img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />

                  {/* Category Badge */}
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    color: 'var(--gold-deep)',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '4px 12px',
                    borderRadius: '100px',
                    border: '1px solid var(--gold-light)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                    backdropFilter: 'blur(4px)'
                  }}>
                    {product.category}
                  </span>

                  {/* HS Code Badge */}
                  {product.hsCode && (
                    <span style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(11, 34, 64, 0.85)',
                      color: '#FFFFFF',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '6px',
                      backdropFilter: 'blur(4px)',
                      letterSpacing: '0.5px'
                    }}>
                      {product.hsCode}
                    </span>
                  )}
                </div>

                {/* Body Content */}
                <div style={{
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  <h3 style={{
                    fontFamily: 'var(--font-h, Outfit, sans-serif)',
                    fontSize: '19px',
                    fontWeight: 800,
                    color: 'var(--navy)',
                    marginBottom: '10px',
                    lineHeight: 1.3
                  }}>
                    {product.title}
                  </h3>

                  <p style={{
                    fontSize: '13.5px',
                    color: 'var(--gray)',
                    lineHeight: 1.6,
                    marginBottom: '20px',
                    flex: 1,
                    fontWeight: 500
                  }}>
                    {product.description || product.desc}
                  </p>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenQuote) onOpenQuote(product.title);
                      }}
                      className="btn btn-primary"
                      style={{
                        flex: 1,
                        padding: '11px 16px',
                        fontSize: '13.5px',
                        justifyContent: 'center'
                      }}
                    >
                      <span>Request Quote</span>
                      <ArrowRight size={14} />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectProduct) onSelectProduct(product);
                      }}
                      className="btn btn-outline"
                      style={{
                        padding: '11px 16px',
                        fontSize: '13.5px',
                        justifyContent: 'center'
                      }}
                    >
                      <Eye size={14} />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '60px 20px',
            textAlign: 'center',
            border: '1.5px dashed var(--border)',
            marginTop: '20px'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--navy)', marginBottom: '8px' }}>
              No hardware products match "{searchTerm}"
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--gray)', marginBottom: '20px' }}>
              Try adjusting your search keyword or switching category tabs.
            </p>
            <button
              onClick={() => { setActiveTab('All'); setSearchTerm(''); }}
              className="btn btn-primary"
              style={{
                padding: '10px 24px',
                fontSize: '14px'
              }}
            >
              View All {productsList.length} Hardware Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
