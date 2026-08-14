import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Globe2, Sparkles, MessageCircle } from 'lucide-react';

export default function CtaBanner({ onOpenQuote, onNavigate }) {
  return (
    <section className="cta-banner-redesign-section">
      <div className="container">
        <motion.div
          className="cta-banner-card"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="cta-banner-grid">
            {/* Left Image Showcase */}
            <div className="cta-banner-image-wrap">
              <img
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80"
                alt="Connect with Trishu Impex"
              />
              <div className="cta-image-floating-tag">
                <Sparkles size={15} color="#ED6C1B" />
                <span>Delivering Trust, Exporting Excellence</span>
              </div>
            </div>

            {/* Right Content & Actions */}
            <div className="cta-banner-content">
              <h2 className="cta-banner-title">
                Connect With Us Today for <span style={{ color: 'var(--gold)' }}>Bulk Container Exports</span>
              </h2>

              <p className="cta-banner-desc">
                Partner with Trishu Impex for premium spices, oil seeds, herbs, and agricultural produce delivered to your port with guaranteed purity and complete export compliance.
              </p>

              <div className="cta-features-pill-row">
                <span className="cta-pill-item">
                  <ShieldCheck size={14} color="#ED6C1B" />
                  <span>ISO & APEDA Certified</span>
                </span>
                <span className="cta-pill-item">
                  <ShieldCheck size={14} color="#ED6C1B" />
                  <span>Worldwide Port Dispatch</span>
                </span>
              </div>

              <div className="cta-actions-row">
                <button 
                  className="btn btn-primary" 
                  onClick={() => onOpenQuote ? onOpenQuote() : (onNavigate && onNavigate('contact'))} 
                  style={{ padding: '14px 28px', fontSize: '14.5px', display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '10px' }}
                >
                  <span>Request Container Quote</span>
                  <ArrowRight size={17} />
                </button>

                <button
                  onClick={() => onNavigate && onNavigate('contact')}
                  className="btn-outline"
                  style={{ padding: '13px 24px', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '10px', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(255,255,255,0.06)' }}
                >
                  <Globe2 size={16} />
                  <span>Contact Export Desk</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
