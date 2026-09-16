import React from 'react';
import { ArrowRight } from 'lucide-react';
import { getProducts } from '../utils/adminStore';

export default function CategoryWholeSpices({ onSelectProduct }) {
  // Find featured whole spices from central database
  const wholeSpices = getProducts().filter(p => p.category === 'Whole Spices' || p.cat === 'Whole Spices').slice(0, 4);

  return (
    <div className="products-outer ph-cat py-48">
      <div className="container">
        <div className="products-block-2">
          <div className="products-left">
            <div className="section-title left-align">
              <span className="ph-eyebrow">Our Products</span>
              <h2>Whole <span>Spices</span></h2>
            </div>
            <div className="text-data" style={{ fontSize: 15, color: 'var(--gray)', marginBottom: 20 }}>
              <p>Discover the true essence of authentic flavors with our premium whole spices. Each spice carries rich essential oils and aroma directly from Indian farms.</p>
            </div>
            <div className="green-link-with-arrow">
              <a href="#products">
                <span>See All</span>
                <ArrowRight size={16} />
              </a>
            </div>
            <div className="products-left-img" style={{ backgroundColor: '#FFFFFF', padding: 12, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={wholeSpices[0]?.image} alt="Whole Spices Category" loading="lazy" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
          </div>

          <div className="products-right">
            <div className="products-4-grid">
              {wholeSpices.map((item, idx) => (
                <div key={idx} className="prodcuts-box" onClick={() => onSelectProduct ? onSelectProduct(item) : null}>
                  <div className="img" style={{ backgroundColor: '#FFFFFF', padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={item.image} alt={item.title} loading="lazy" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <div className="prodcuts-box-sub">
                    <h4>{item.title}</h4>
                    <p>{item.desc || item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
