import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function NewArrivalsSlider({ onSelectProduct }) {
  const newArrivals = [
    {
      title: "Sunflower Seeds",
      subtitle: "Fresh and crunchy premium sunflower seeds",
      image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=600&q=80",
      category: "Seeds",
      packaging: "25kg / 50kg Bags",
      origin: "India",
      specs: "Purity 99.0%, Moisture < 8%"
    },
    {
      title: "Dried Rose Petals",
      subtitle: "Naturally dried rose petals with vibrant color",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
      category: "Herbal",
      packaging: "10kg Cartons / Vacuum Bags",
      origin: "India",
      specs: "100% Natural, No Additives"
    },
    {
      title: "Dried Lemon Grass",
      subtitle: "Natural dried lemon grass with citrus flavor",
      image: "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=600&q=80",
      category: "Herbal",
      packaging: "15kg Bags",
      origin: "India",
      specs: "High Aroma, Premium Cut"
    },
    {
      title: "Natural Indigo Powder",
      subtitle: "Fine-quality indigo powder with natural purity",
      image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
      category: "Herbal Powders",
      packaging: "20kg Fiber Drums",
      origin: "Tamil Nadu, India",
      specs: "Purity 99.5%, Fine Mesh"
    },
    {
      title: "Natural Henna Powder",
      subtitle: "Natural henna powder with smooth texture",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
      category: "Herbal Powders",
      packaging: "25kg Bags",
      origin: "Sojat, Rajasthan, India",
      specs: "Triple Sifted, Lawsone > 2%"
    },
    {
      title: "Carrot Powder",
      subtitle: "Natural carrot powder with fresh taste & color",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
      category: "Herbal Powders",
      packaging: "20kg Cartons",
      origin: "India",
      specs: "Moisture < 6%"
    },
    {
      title: "Mint Powder",
      subtitle: "Premium mint powder with fresh natural aroma",
      image: "https://images.unsplash.com/photo-1509358217951-4fd2d6d8fb03?auto=format&fit=crop&w=600&q=80",
      category: "Herbal Powders",
      packaging: "20kg Bags",
      origin: "India",
      specs: "High Menthol Content"
    },
    {
      title: "Bhringraj Powder",
      subtitle: "Natural Bhringraj Powder – Clean & Pure",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
      category: "Herbal Powders",
      packaging: "25kg Drums",
      origin: "India",
      specs: "100% Organic"
    }
  ];

  return (
    <div className="products-section ph-latest py-30 bg-light" id="products-showcase">
      <div className="container">
        <div className="section-title">
          <span className="ph-eyebrow">New Arrivals</span>
          <h2>Latest <span>Products</span></h2>
          <p className="ph-section-sub">Discover our newest spices — sourced, ground and packed for buyers around the world.</p>
        </div>

        <div className="products-4-grid">
          {newArrivals.map((item, idx) => (
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
  );
}
