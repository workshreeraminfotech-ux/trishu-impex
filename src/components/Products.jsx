import React, { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import ProductModal from './ProductModal';
import { PRODUCT_CATEGORIES } from '../data/products';
import { getProducts } from '../utils/adminStore';

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const productsList = getProducts();

  const filteredProducts = productsList.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory || item.cat === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (item.desc && item.desc.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-80 bg-light" id="products">
      <div className="container">
        <div className="section-title text-center">
          <span className="eyebrow">Our Spice Collection</span>
          <h2>Explore Trishu Impex <span>Indian Agro Catalog</span></h2>
          <p className="section-desc">Search and filter through our export-grade wholesale ground spices, whole spices, seed spices, and custom blends.</p>
        </div>

        {/* Controls */}
        <div className="catalog-controls">
          <div className="search-input-wrap">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search spices (e.g. Turmeric, Cumin, Chilli, Cardamom...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-pills">
            {PRODUCT_CATEGORIES.map((cat, idx) => (
              <button 
                key={idx}
                className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="product-grid">
          {filteredProducts.map((item, idx) => (
            <div key={item.id || idx} className="product-card" onClick={() => setSelectedProduct(item)}>
              <div className="card-img-wrap">
                <img src={item.image} alt={item.title} loading="lazy" />
              </div>
              <div className="card-content">
                <h3>{item.title}</h3>
                <p>{item.description || item.desc}</p>
                <div className="card-foot">
                  <span>View Details</span>
                  <Eye size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <p>No products found matching "{searchTerm}". Try searching for another term.</p>
          </div>
        )}
      </div>

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </section>
  );
}
