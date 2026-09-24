import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Linkedin, MessageCircle, ChevronRight, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import logoImg from '../assets/logo.webp';
import { getMainCategories } from '../utils/adminStore';

export default function FooterSection({ onNavigate }) {
  const [mainCats, setMainCats] = useState(() => getMainCategories());

  useEffect(() => {
    const handleUpdate = () => {
      setMainCats([...getMainCategories()]);
    };
    window.addEventListener('trishu_store_sync', handleUpdate);
    window.addEventListener('trishu_store_updated', handleUpdate);
    return () => {
      window.removeEventListener('trishu_store_sync', handleUpdate);
      window.removeEventListener('trishu_store_updated', handleUpdate);
    };
  }, []);

  return (
    <footer className="footer-redesign-section">
      <div className="container">
        <div className="footer-top-grid">
          {/* Col 1: Brand & Bio */}
          <div className="footer-col-brand">
            <div 
              className="footer-logo-wrap" 
              onClick={() => { 
                if (onNavigate) onNavigate('home'); 
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => {
                  const heroEl = document.getElementById('hero-section');
                  if (heroEl) heroEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
              style={{ cursor: 'pointer' }}
            >
              <img src={logoImg} alt="Trishu Impex" />
            </div>
            <p className="footer-bio-text">
              Trishu Impex is a premier Indian merchant exporter delivering trust and exporting excellence worldwide with rigorous quality testing, export packing, and swift international delivery.
            </p>
            <div className="footer-social-row">
              <a href="https://www.facebook.com/61592710711493/mentions/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href="https://www.instagram.com/trishuimpex/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href="https://www.linkedin.com/company/trishu-impex/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul className="footer-links-list">
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('home'); }}>
                  <ChevronRight size={14} className="link-arrow" /> Home
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('about'); }}>
                  <ChevronRight size={14} className="link-arrow" /> About Us
                </a>
              </li>
              {mainCats.slice(0, 2).map((cat) => (
                <li key={cat.id}>
                  <a href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate(cat.id); }}>
                    <ChevronRight size={14} className="link-arrow" /> {cat.name}
                  </a>
                </li>
              ))}
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('contact'); }}>
                  <ChevronRight size={14} className="link-arrow" /> Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Product Categories (100% Dynamic from Admin Panel) */}
          <div className="footer-col">
            <h3>Product Categories</h3>
            <ul className="footer-links-list">
              {mainCats.length > 0 ? (
                mainCats.map((cat) => (
                  <li key={cat.id}>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate(cat.id); }}>
                      <ChevronRight size={14} className="link-arrow" /> {cat.name}
                    </a>
                  </li>
                ))
              ) : (
                <li style={{ color: '#94A3B8', fontSize: '13px' }}>
                  Categories managed via Admin Panel
                </li>
              )}
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div className="footer-col">
            <h3>Contact Us</h3>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <MapPin size={18} className="contact-icon" />
                <span>Dayima Complex, Office No 4, Paliyad Road, Sayla - 363430, Gujarat, India</span>
              </div>
              <a href="tel:+919898522905" className="footer-contact-item item-link">
                <Phone size={18} className="contact-icon" />
                <span>+91 98985 22905</span>
              </a>
              <a href="mailto:sales@trishuimpex.com" className="footer-contact-item item-link">
                <Mail size={18} className="contact-icon" />
                <span>sales@trishuimpex.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom copyright bar */}
        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} Trishu Impex. All Rights Reserved.</p>
          <div className="footer-bottom-right">
            <span>
              Developed by{' '}
              <a 
                href="https://www.matrixtechx.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: '#ED6C1B', fontWeight: 800, textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                MatrixTechX
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
