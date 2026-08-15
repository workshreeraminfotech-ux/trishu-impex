import React, { useState, useRef } from 'react';
import { 
  Menu, X, ArrowRight, MapPin, Mail, Phone, ChevronDown, ChevronRight,
  Sparkles, Sprout, Bath, Grid3X3, Wrench, Waves 
} from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Navbar({ activePage, onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(true);
  const dropdownTimeoutRef = useRef(null);

  const handleNav = (id) => {
    onNavigate(id);
    setMobileOpen(false);
    setDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  const isProductsActive = [
    'products', 'spices', 'agro', 'sanitaryware', 'tiles', 'hardware', 'pvc-pipes'
  ].includes(activePage);

  const categories = [
    {
      id: 'products',
      title: 'Spices & Seasonings',
      tag: '38 Items',
      tagColor: '#ED6C1B',
      tagBg: 'rgba(237, 108, 27, 0.12)',
      desc: 'Ground, Whole, Seed & Blended Spices',
      icon: Sparkles,
      iconColor: '#ED6C1B',
      iconBg: '#FFF7ED'
    },
    {
      id: 'agro',
      title: 'Agro Commodities',
      tag: 'Grains & Pulses',
      tagColor: '#166534',
      tagBg: '#DCFCE7',
      desc: 'Rice, Wheat, Corn, Barley & Millets',
      icon: Sprout,
      iconColor: '#166534',
      iconBg: '#F0FDF4'
    },
    {
      id: 'sanitaryware',
      title: 'Sanitaryware',
      tag: 'Vitreous China',
      tagColor: '#0369A1',
      tagBg: '#E0F2FE',
      desc: 'Toilets, Wash Basins & Vanity Sinks',
      icon: Bath,
      iconColor: '#0369A1',
      iconBg: '#F0F9FF'
    },
    {
      id: 'tiles',
      title: 'Tiles & Ceramics',
      tag: 'Vitrified Slabs',
      tagColor: '#854D0E',
      tagBg: '#FEF9C3',
      desc: 'PGVT/GVT, Wall & Parking Pavers',
      icon: Grid3X3,
      iconColor: '#854D0E',
      iconBg: '#FEFCE8'
    },
    {
      id: 'hardware',
      title: 'Architectural Hardware',
      tag: 'SS 304 / Brass',
      tagColor: '#475569',
      tagBg: '#F1F5F9',
      desc: 'Door Handles, SS Hinges & Drawer Slides',
      icon: Wrench,
      iconColor: '#475569',
      iconBg: '#F8FAFC'
    },
    {
      id: 'pvc-pipes',
      title: 'PVC & CPVC Pipes',
      tag: 'ASTM / IS Class',
      tagColor: '#0284C7',
      tagBg: '#E0F2FE',
      desc: 'UPVC, CPVC, SWR & Agri Piping',
      icon: Waves,
      iconColor: '#0284C7',
      iconBg: '#F0F9FF'
    }
  ];

  return (
    <>
      <header className="jrp-header">
        <div className="container">
          <div className="jrp-header-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '104px' }}>
            {/* Logo */}
            <a href="#" onClick={(e) => { e.preventDefault(); handleNav('home'); }} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img 
                src={logoImg} 
                alt="Trishu Impex" 
                className="jrp-header-logo-img" 
                style={{ 
                  height: '82px', 
                  width: 'auto', 
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 8px rgba(11,34,64,0.08))',
                  display: 'block',
                  transition: 'transform 0.2s ease'
                }} 
              />
            </a>

            {/* Desktop Navigation Menu */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '36px' }} className="d-none-mobile">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); handleNav('home'); }}
                style={{ fontWeight: 700, fontSize: '17px', color: activePage === 'home' ? 'var(--gold)' : 'var(--navy)', textDecoration: 'none', transition: 'color 0.2s' }}
              >
                Home
              </a>
              
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); handleNav('about'); }}
                style={{ fontWeight: 700, fontSize: '17px', color: activePage === 'about' ? 'var(--gold)' : 'var(--navy)', textDecoration: 'none', transition: 'color 0.2s' }}
              >
                About Us
              </a>

              {/* Product Categories Dropdown — Clean Vertical List */}
              <div 
                style={{ position: 'relative' }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={(e) => { 
                    e.preventDefault(); 
                    setDropdownOpen(prev => !prev);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '12px 0',
                    fontFamily: 'inherit',
                    fontWeight: 700,
                    fontSize: '17px',
                    color: isProductsActive ? 'var(--gold)' : 'var(--navy)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>Product Categories</span>
                  <ChevronDown 
                    size={16} 
                    style={{ 
                      transition: 'transform 0.25s ease',
                      transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      color: isProductsActive ? 'var(--gold)' : 'inherit'
                    }} 
                  />
                </button>

                {/* Clean Vertical Dropdown List */}
                {dropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      paddingTop: '8px',
                      zIndex: 1000,
                      minWidth: '340px',
                      animation: 'fadeInSlide 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '20px',
                        padding: '12px 10px',
                        boxShadow: '0 20px 45px -10px rgba(11, 34, 64, 0.2), 0 0 0 1px rgba(11, 34, 64, 0.08)',
                        border: '1.5px solid rgba(237, 108, 27, 0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}
                    >
                      {categories.map((cat) => {
                        const IconComponent = cat.icon;
                        const isActive = activePage === cat.id;

                        return (
                          <a
                            key={cat.id}
                            href="#"
                            onClick={(e) => { e.preventDefault(); handleNav(cat.id); }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '12px',
                              padding: '10px 14px',
                              borderRadius: '12px',
                              textDecoration: 'none',
                              backgroundColor: isActive ? '#FFF7ED' : 'transparent',
                              transition: 'all 0.2s ease',
                              border: isActive ? '1px solid rgba(237, 108, 27, 0.3)' : '1px solid transparent'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#FFF7ED';
                              e.currentTarget.style.transform = 'translateX(4px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = isActive ? '#FFF7ED' : 'transparent';
                              e.currentTarget.style.transform = 'translateX(0)';
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '10px',
                                backgroundColor: cat.iconBg,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                border: '1px solid rgba(0,0,0,0.04)'
                              }}>
                                <IconComponent size={19} style={{ color: cat.iconColor }} />
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--navy)', lineHeight: 1.2 }}>
                                  {cat.title}
                                </span>
                                <span style={{ fontSize: '12px', color: 'var(--gray)', fontWeight: 500, marginTop: '2px' }}>
                                  {cat.desc}
                                </span>
                              </div>
                            </div>

                            <ChevronRight size={16} style={{ color: 'var(--gold)', flexShrink: 0, opacity: 0.8 }} />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <a
                href="#"
                onClick={(e) => { e.preventDefault(); handleNav('blog'); }}
                style={{ fontWeight: 700, fontSize: '17px', color: activePage === 'blog' ? 'var(--gold)' : 'var(--navy)', textDecoration: 'none', transition: 'color 0.2s' }}
              >
                Blogs
              </a>

              <a
                href="#"
                onClick={(e) => { e.preventDefault(); handleNav('contact'); }}
                style={{ fontWeight: 700, fontSize: '17px', color: activePage === 'contact' ? 'var(--gold)' : 'var(--navy)', textDecoration: 'none', transition: 'color 0.2s' }}
              >
                Contact Us
              </a>
            </nav>

            {/* Actions: CTA + Mobile Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <button
                className="btn btn-primary d-none-mobile"
                onClick={() => handleNav('contact')}
                style={{ fontSize: '15px', padding: '12px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <span>Freight Quote</span>
                <ArrowRight size={16} />
              </button>

              <button
                className="mobile-menu-toggle-btn"
                onClick={() => setMobileOpen(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--navy)', padding: '6px' }}
                aria-label="Toggle Navigation"
              >
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Offcanvas Drawer */}
      {mobileOpen && (
        <>
          <div className="jrp-offcanvas-overlay" onClick={() => setMobileOpen(false)} />
          <div className="jrp-offcanvas">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <img src={logoImg} alt="Trishu Impex" style={{ height: '64px', width: 'auto', objectFit: 'contain', filter: 'contrast(1.08)' }} />
              <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--navy)' }}>
                <X size={24} />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              <a href="#" onClick={(e) => { e.preventDefault(); handleNav('home'); }} style={{ fontWeight: 700, fontSize: '17px', color: activePage === 'home' ? '#ED6C1B' : 'var(--navy)', textDecoration: 'none', padding: '4px 0' }}>Home</a>
              <a href="#" onClick={(e) => { e.preventDefault(); handleNav('about'); }} style={{ fontWeight: 700, fontSize: '17px', color: activePage === 'about' ? '#ED6C1B' : 'var(--navy)', textDecoration: 'none', padding: '4px 0' }}>About Us</a>
              
              {/* Mobile Product Categories Accordion */}
              <div style={{ borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', padding: '8px 0' }}>
                <div 
                  onClick={() => setMobileCategoriesOpen(prev => !prev)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '6px 0' }}
                >
                  <span style={{ fontWeight: 800, fontSize: '17px', color: isProductsActive ? '#ED6C1B' : 'var(--navy)' }}>Product Categories</span>
                  <ChevronDown size={18} style={{ color: 'var(--navy)', transform: mobileCategoriesOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                </div>
                
                {mobileCategoriesOpen && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '8px', marginTop: '8px' }}>
                    {categories.map(cat => {
                      const IconComp = cat.icon;
                      const isActive = activePage === cat.id;

                      return (
                        <a 
                          key={cat.id}
                          href="#" 
                          onClick={(e) => { e.preventDefault(); handleNav(cat.id); }}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px', 
                            padding: '8px 10px', 
                            borderRadius: '8px', 
                            backgroundColor: isActive ? '#FFF7ED' : '#F8FAFC',
                            color: isActive ? '#ED6C1B' : 'var(--navy)',
                            textDecoration: 'none',
                            fontSize: '14.5px',
                            fontWeight: 700
                          }}
                        >
                          <IconComp size={16} style={{ color: '#ED6C1B' }} />
                          <span>{cat.title}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              <a href="#" onClick={(e) => { e.preventDefault(); handleNav('blog'); }} style={{ fontWeight: 700, fontSize: '17px', color: activePage === 'blog' ? '#ED6C1B' : 'var(--navy)', textDecoration: 'none', padding: '4px 0' }}>Blogs</a>
              <a href="#" onClick={(e) => { e.preventDefault(); handleNav('contact'); }} style={{ fontWeight: 700, fontSize: '17px', color: activePage === 'contact' ? '#ED6C1B' : 'var(--navy)', textDecoration: 'none', padding: '4px 0' }}>Contact Us</a>
            </div>

            {/* Offcanvas Contact Info */}
            <div style={{ marginTop: 'auto', borderTop: '1px solid #eee', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '12px', color: 'var(--navy)' }}>Contact Info</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: 'var(--gray)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                  <span>Dayima Complex, Office No 1, Paliyad Road, Sayla - 363430, Gujarat, India</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                  <span>sales@trishuimpex.com</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Phone size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                  <span>+91 98985 22905</span>
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <button className="btn btn-primary" onClick={() => handleNav('contact')} style={{ width: '100%', justifyContent: 'center' }}>
                  <span>Get A Quote</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
