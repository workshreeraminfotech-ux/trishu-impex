import React from 'react';
import { ArrowRight, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { getProducts } from '../utils/adminStore';

// Top 6 most exported spices from India
const TOP_6_EXPORT_IDS = [
  'turmeric-powder',
  'chilli-powder',
  'cumin-seeds',
  'black-pepper',
  'green-cardamom',
  'ginger-powder'
];

export default function ProductsShowcaseSection({ onSelectProduct, onOpenQuote, onNavigate }) {
  const allProducts = getProducts();
  // Get featured / top products
  let topExportProducts = TOP_6_EXPORT_IDS.map(id => allProducts.find(p => p.id === id)).filter(Boolean);
  if (topExportProducts.length < 6) {
    topExportProducts = allProducts.slice(0, 6);
  }

  return (
    <section className="py-50" id="products-section" style={{ background: '#FFFFFF', padding: '54px 0' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="section-title">
            <span className="eyebrow">
              TOP EXPORT COMMODITIES FROM INDIA
            </span>
            <h2 style={{ color: 'var(--navy)', marginTop: '12px' }}>
              Our Featured <span style={{ color: 'var(--gold)' }}>Indian Commodities</span>
            </h2>
            <p style={{ marginTop: '10px', color: 'var(--gray)', maxWidth: '600px', margin: '10px auto 0' }}>
              India's most demanded premium export commodities — machine cleaned, Sortex sorted, and packed for international trade.
            </p>
          </div>
        </div>

        {/* 6 Products Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          {topExportProducts.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.07 }}
              style={{ 
                background: '#FFFFFF', 
                borderRadius: '24px', 
                overflow: 'hidden', 
                border: '1.5px solid var(--border)', 
                boxShadow: '0 8px 30px rgba(237, 108, 27, 0.06)', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease'
              }}
              whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(237, 108, 27, 0.2)', borderColor: 'var(--gold)' }}
            >
              {/* Product Image — Object-Fit Contain (Uncropped) */}
              <div 
                style={{ 
                  height: '240px', 
                  backgroundColor: '#FFFFFF', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: '20px',
                  borderBottom: '1px solid var(--border)',
                  position: 'relative',
                  cursor: 'pointer'
                }}
                onClick={() => onSelectProduct ? onSelectProduct(item) : null}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    transition: 'transform 0.4s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>

              {/* Product Body — Simplified (Title & Brief Description Only) */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 
                  style={{ fontSize: '20px', fontWeight: 800, color: 'var(--navy)', marginBottom: '10px', lineHeight: 1.3, cursor: 'pointer' }}
                  onClick={() => onSelectProduct ? onSelectProduct(item) : null}
                >
                  {item.title}
                </h3>

                <p style={{ fontSize: '14px', color: 'var(--gray)', lineHeight: 1.6, marginBottom: '24px', flex: 1, fontWeight: 500 }}>
                  {item.desc || item.description}
                </p>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                  <button
                    onClick={() => onOpenQuote ? onOpenQuote(item.title) : null}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '12px 18px', fontSize: '13.5px', justifyContent: 'center' }}
                  >
                    <span>Request Quote</span>
                    <ArrowRight size={15} />
                  </button>
                  
                  <button
                    onClick={() => onSelectProduct ? onSelectProduct(item) : null}
                    className="btn btn-outline"
                    style={{ padding: '12px 18px', fontSize: '13.5px' }}
                  >
                    <Eye size={15} />
                    <span>View</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Products CTA Link */}
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <button
            onClick={() => onNavigate ? onNavigate('products') : null}
            className="btn btn-primary"
            style={{ padding: '14px 32px', fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <span>Explore All 38 Commodity Products</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
}
