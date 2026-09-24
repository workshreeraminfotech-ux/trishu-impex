import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAllActiveProducts } from '../utils/adminStore';

export default function MainSeedsShowcase({ onOpenQuote, onNavigate }) {
  const [allProducts, setAllProducts] = useState(() => getAllActiveProducts());
  const scrollContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const handleSync = () => {
      setAllProducts([...getAllActiveProducts()]);
    };
    window.addEventListener('trishu_store_sync', handleSync);
    window.addEventListener('trishu_store_updated', handleSync);
    return () => {
      window.removeEventListener('trishu_store_sync', handleSync);
      window.removeEventListener('trishu_store_updated', handleSync);
    };
  }, []);

  const featuredProducts = allProducts.filter(p => Boolean(p.isFeatured || p.showOnHome));
  const showcaseProducts = featuredProducts.length > 0 ? featuredProducts : allProducts;

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const cardEl = scrollContainerRef.current.querySelector('.seeds-showcase-card');
      const scrollAmount = cardEl ? cardEl.offsetWidth + 18 : 310;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (isPaused || showcaseProducts.length === 0) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const cardEl = scrollContainerRef.current.querySelector('.seeds-showcase-card');
        const scrollAmount = cardEl ? cardEl.offsetWidth + 18 : 310;

        if (scrollLeft + clientWidth >= scrollWidth - 25) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [isPaused, showcaseProducts.length]);

  if (showcaseProducts.length === 0) {
    return null;
  }

  return (
    <section 
      id="products-section"
      className="main-seeds-showcase-section" 
      style={{ 
        background: 'var(--cream)', 
        color: 'var(--navy)',
        padding: '68px 0 72px',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border)',
        borderTop: '1px solid var(--border)'
      }}
    >
      <div className="container">
        
        {/* Centered Header Section */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 36px' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(237, 108, 27, 0.14)', border: '1px solid rgba(237, 108, 27, 0.45)', padding: '6px 20px', borderRadius: '100px', fontSize: '13px', fontWeight: 800, color: '#D0550B', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '14px', boxShadow: '0 2px 10px rgba(237, 108, 27, 0.08)' }}>
            <Sparkles size={14} color="#ED6C1B" />
            <span>EXPORT CATALOGUE • 100% QUALITY INSPECTED</span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-h)', fontSize: 'clamp(28px, 4.2vw, 42px)', fontWeight: 900, color: 'var(--navy)', lineHeight: 1.2, margin: '0 0 14px' }}>
            Featured Export Products — <span style={{ color: 'var(--gold)' }}>Live Catalogue</span>
          </h2>

          <p style={{ fontSize: '15.5px', color: '#57534E', lineHeight: 1.6, margin: '0 auto', maxWidth: '640px' }}>
            Direct manufacturer & farm export supply with international packaging, lab testing certificates, and worldwide port delivery.
          </p>
        </div>

        {/* Horizontal Auto-Scrolling Track */}
        <div
          ref={scrollContainerRef}
          className="seeds-horizontal-scroll-track"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          style={{
            display: 'flex',
            gap: '24px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            paddingBottom: '8px',
            paddingTop: '6px',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {showcaseProducts.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              className="seeds-showcase-card"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: (idx % 4) * 0.05 }}
              style={{
                borderRadius: '22px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(11, 34, 64, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                border: '1.5px solid #E8DFCE',
                background: '#FFFFFF',
                minWidth: '290px',
                maxWidth: '330px',
                flexShrink: 0,
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              whileHover={{ y: -6, boxShadow: '0 16px 36px rgba(237, 108, 27, 0.2)', borderColor: 'var(--gold)' }}
            >
              {/* Product Photo Box */}
              <div
                style={{
                  height: '220px',
                  background: 'radial-gradient(circle, #FFFFFF 50%, #F9F7F2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                  position: 'relative',
                  borderBottom: '1px solid #F0E8D9'
                }}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    style={{
                      maxWidth: '90%',
                      maxHeight: '90%',
                      objectFit: 'contain',
                      transition: 'transform 0.4s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                ) : (
                  <div style={{ color: '#94A3B8', fontWeight: 700, fontSize: '14px' }}>
                    {item.title}
                  </div>
                )}
                {item.domainName && (
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.94)',
                    color: item.domainColor || '#0B2240',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: '100px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid #E2E8F0'
                  }}>
                    {item.domainName}
                  </span>
                )}
              </div>

              {/* Product Info Body: Name, Description, Action */}
              <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 
                  style={{ fontSize: '18px', fontWeight: 800, color: 'var(--navy)', marginBottom: '10px', lineHeight: 1.3 }}
                >
                  {item.title}
                </h3>

                <p style={{ fontSize: '13.5px', color: '#57534E', lineHeight: 1.6, marginBottom: '22px', flex: 1 }}>
                  {item.desc || item.description || 'Certified export quality grade.'}
                </p>

                {/* Single Clean Action Button */}
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  <button
                    onClick={() => onOpenQuote ? onOpenQuote(item.title) : null}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '11px 14px', fontSize: '13.5px', fontWeight: 700, justifyContent: 'center', borderRadius: '10px' }}
                  >
                    <span>Request Quote</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
