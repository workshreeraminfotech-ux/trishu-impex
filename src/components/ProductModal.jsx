import React from 'react';
import { X, Send } from 'lucide-react';

export default function ProductModal({ product, onClose, onOpenQuote }) {
  if (!product) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(7, 23, 46, 0.8)',
      backdropFilter: 'blur(4px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }} onClick={onClose}>
      <div style={{
        position: 'relative',
        backgroundColor: '#fff',
        borderRadius: 24,
        maxWidth: 680,
        width: '100%',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(11, 34, 64, 0.25)',
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            cursor: 'pointer',
            zIndex: 10,
            color: '#0B2240',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {/* Product Image Container — Uncropped (contain) */}
        <div style={{
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          borderRight: '1px solid #F1F5F9',
          minHeight: 280
        }}>
          <img 
            src={product.image} 
            alt={product.title} 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%', 
              objectFit: 'contain' 
            }} 
          />
        </div>

        {/* Product Details — Simple & Clean */}
        <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{
            fontSize: 11,
            fontWeight: 800,
            textTransform: 'uppercase',
            color: 'var(--gold-deep)',
            backgroundColor: 'var(--gold-pale)',
            border: '1px solid var(--gold-light)',
            padding: '4px 12px',
            borderRadius: 100,
            alignSelf: 'flex-start',
            marginBottom: 12
          }}>
            {product.category || product.cat}
          </span>

          <h2 style={{
            fontFamily: 'var(--font-h, Outfit, sans-serif)',
            fontSize: 22,
            fontWeight: 800,
            color: 'var(--navy)',
            marginBottom: 12,
            lineHeight: 1.3
          }}>
            {product.title}
          </h2>

          <p style={{
            fontSize: 14,
            color: 'var(--gray)',
            lineHeight: 1.6,
            marginBottom: 24
          }}>
            {product.description || product.desc}
          </p>

          <button 
            onClick={() => {
              onClose();
              if (onOpenQuote) onOpenQuote(product.title);
            }}
            className="btn btn-primary"
            style={{
              justifyContent: 'center'
            }}
          >
            <Send size={16} />
            <span>Request Export Quote</span>
          </button>
        </div>

      </div>
    </div>
  );
}
