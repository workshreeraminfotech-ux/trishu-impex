import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CategoryHerbalPowders({ onSelectProduct }) {
  const herbalPowders = [
    {
      title: "Tulsi Leaf",
      subtitle: "Pure Tulsi leaves for herbal tea and wellness use",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
      category: "Herbal Powders",
      packaging: "15kg Bags",
      origin: "India",
      specs: "100% Organic"
    },
    {
      title: "Moringa Powder",
      subtitle: "Pure Organic Moringa Leaf Powder for Health Boost",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
      category: "Herbal Powders",
      packaging: "20kg Fiber Drums",
      origin: "Tamil Nadu, India",
      specs: "Purity 99.9%"
    },
    {
      title: "Ashwagandha Powder",
      subtitle: "Pure Ashwagandha Powder – Natural Stress Relief",
      image: "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=600&q=80",
      category: "Herbal Powders",
      packaging: "25kg Drums",
      origin: "Madhya Pradesh, India",
      specs: "Withanolides > 2.5%"
    },
    {
      title: "Neem Powder",
      subtitle: "Pure Neem Powder – Natural Herbal Wellness",
      image: "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=600&q=80",
      category: "Herbal Powders",
      packaging: "20kg Bags",
      origin: "Gujarat, India",
      specs: "Clean & Pure"
    }
  ];

  return (
    <div className="products-outer ph-cat py-48 bg-light">
      <div className="container">
        <div className="products-block-2">
          <div className="products-left">
            <div className="section-title left-align">
              <span className="ph-eyebrow">Our Products</span>
              <h2>Herbal <span>Powders</span></h2>
            </div>
            <div className="text-data" style={{ fontSize: 15, color: 'var(--gray)', marginBottom: 20 }}>
              <p>Premium quality herbal powders and ground spices from a trusted wholesale spice supplier. Pure, hygienic, and ideal for food, health, and retail use.</p>
            </div>
            <div className="green-link-with-arrow">
              <a href="#contact-us">
                <span>See All</span>
                <ArrowRight size={16} />
              </a>
            </div>
            <div className="products-left-img">
              <img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80" alt="Herbal Powders Category" loading="lazy" />
            </div>
          </div>

          <div className="products-right">
            <div className="products-4-grid">
              {herbalPowders.map((item, idx) => (
                <div key={idx} className="prodcuts-box" onClick={() => onSelectProduct(item)}>
                  <div className="img">
                    <img src={item.image} alt={item.title} loading="lazy" />
                  </div>
                  <div className="prodcuts-box-sub">
                    <h4>{item.title}</h4>
                    <p>{item.subtitle}</p>
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
