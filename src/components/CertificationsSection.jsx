import React, { useState } from 'react';
import { Sparkles, X, Eye, ShieldCheck } from 'lucide-react';
import { getCertificates } from '../utils/adminStore';

export default function CertificationsSection({ bgColor = '#F8FAFC' }) {
  const certs = getCertificates();
  const [selectedCert, setSelectedCert] = useState(null);

  // Duplicate for seamless continuous infinite marquee
  const marqueeCerts = [...certs, ...certs, ...certs, ...certs];

  return (
    <section className="py-50 certs-marquee-section" id="certifications" style={{ background: bgColor, borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', padding: '56px 0 62px', overflow: 'hidden' }}>
      <div className="container">
        
        {/* Header */}
        <div className="section-title" style={{ maxWidth: '780px', margin: '0 auto 36px' }}>
          {/* Eyebrow Badge */}
          <span className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={13} color="var(--gold)" />
            <span>TRUSTED & GOVT. AUTHORIZED</span>
          </span>

          {/* Main Title */}
          <h2 style={{ marginTop: '6px' }}>
            Official International <span>Certifications & Approvals</span>
          </h2>

          {/* Subtitle */}
          <p style={{ fontSize: '15px', color: 'var(--gray)', lineHeight: 1.6, margin: '10px auto 0', maxWidth: '620px' }}>
            Certified by India's premier export authorities & global food safety councils guaranteeing 100% regulatory compliance.
          </p>
        </div>

      </div>

      {/* Auto Horizontal Scrolling Track of Certificate Photos (Adaptive for Portrait & Landscape) */}
      <div className="certs-marquee-wrapper" style={{ overflow: 'hidden', width: '100%', position: 'relative', padding: '14px 0' }}>
        <div className="certs-marquee-track">
          {marqueeCerts.map((c, i) => (
            <div
              key={i}
              className="cert-photo-card"
              onClick={() => setSelectedCert(c)}
              style={{
                flex: '0 0 auto',
                width: '185px',
                height: '235px',
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 6px 20px rgba(11, 34, 64, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                margin: '0 12px',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer',
                position: 'relative'
              }}
              title={`Click to view ${c.name}`}
            >
              {/* Photo Box Container — Perfect for Vertical and Horizontal orientations */}
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img
                  src={c.logo}
                  alt={c.name}
                  loading="lazy"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    objectPosition: 'center',
                    display: 'block',
                    transition: 'transform 0.3s ease'
                  }}
                />
              </div>

              {/* View Overlay on Hover */}
              <div 
                className="cert-card-hover-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '20px',
                  background: 'rgba(11, 34, 64, 0.45)',
                  backdropFilter: 'blur(2px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  opacity: 0,
                  transition: 'opacity 0.25s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '0'}
              >
                <Eye size={16} color="#ED6C1B" />
                <span>View Full</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full-Screen Certificate Lightbox Modal */}
      {selectedCert && (
        <div 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            backgroundColor: 'rgba(5, 16, 31, 0.85)', 
            zIndex: 99999, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '24px', 
            backdropFilter: 'blur(6px)' 
          }}
          onClick={() => setSelectedCert(null)}
        >
          <div 
            style={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: '24px', 
              padding: '28px', 
              maxWidth: '680px', 
              width: '100%', 
              maxHeight: '90vh', 
              display: 'flex', 
              flexDirection: 'column', 
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)', 
              position: 'relative' 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="var(--gold)" />
                <h3 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
                  {selectedCert.name}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedCert(null)}
                style={{ 
                  background: '#F1F5F9', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: '36px', 
                  height: '36px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer', 
                  color: 'var(--navy)' 
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Certificate Image (Fits both portrait and landscape perfectly) */}
            <div style={{ 
              flex: 1, 
              minHeight: '320px', 
              maxHeight: '65vh', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              background: '#F8FAFC', 
              borderRadius: '16px', 
              padding: '20px',
              border: '1px solid #E2E8F0'
            }}>
              <img 
                src={selectedCert.logo} 
                alt={selectedCert.name} 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '60vh', 
                  width: 'auto', 
                  height: 'auto', 
                  objectFit: 'contain' 
                }} 
              />
            </div>

            {selectedCert.tag && (
              <p style={{ margin: '14px 0 0', fontSize: '13.5px', color: '#64748B', textAlign: 'center', fontWeight: 500 }}>
                {selectedCert.tag}
              </p>
            )}
          </div>
        </div>
      )}

    </section>
  );
}
