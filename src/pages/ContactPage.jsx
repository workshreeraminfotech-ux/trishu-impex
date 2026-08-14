import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageCircle, ArrowRight, Clock, Globe, Send } from 'lucide-react';
import { addEnquiry } from '../utils/adminStore';

const countryCodes = ['+91', '+1', '+44', '+971', '+65', '+27', '+49', '+61', '+33', '+86', '+55', '+52'];

const contactCards = [
  {
    icon: Phone, label: 'Phone / WhatsApp',
    value: '+91 98985 22905',
    sub: 'Mon–Sat, 9AM – 6PM IST',
    href: 'tel:+919898522905',
    color: '#ED6C1B'
  },
  {
    icon: Mail, label: 'Email Address',
    value: 'sales@trishuimpex.com',
    sub: 'We reply within 24 hours',
    href: 'mailto:sales@trishuimpex.com',
    color: '#FF8238'
  },
  {
    icon: MapPin, label: 'Our Location',
    value: 'Dayima Complex, Office No 1, Paliyad Road, Sayla - 363430, Gujarat, India',
    sub: 'Export Hub — Near Mundra Port',
    href: '#map',
    color: '#ED6C1B'
  },
  {
    icon: Clock, label: 'Business Hours',
    value: 'Mon–Sat: 9AM – 6PM',
    sub: 'Sunday: Closed (IST)',
    href: null,
    color: '#FF8238'
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', company: '', email: '', countryCode: '+91', phone: '', product: '', quantity: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    addEnquiry({
      source: 'Contact Us Form',
      name: form.name,
      company: form.company,
      email: form.email,
      phone: `${form.countryCode} ${form.phone}`,
      product: form.product || 'General Export Enquiry',
      quantity: form.quantity || 'N/A',
      notes: form.message
    });
    setSubmitted(true);
  };

  return (
    <div>
      {/* Page Hero — Guaranteed Background Image Overlay */}
      <section style={{
        position: 'relative',
        color: '#FFFFFF',
        padding: '75px 0 65px',
        overflow: 'hidden',
        backgroundColor: '#1C1917',
        textAlign: 'center'
      }}>
        {/* Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80" 
          alt="Contact Trishu Impex Background" 
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 0
          }}
        />
        {/* Warm Golden Dark Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(42, 29, 8, 0.75) 0%, rgba(28, 25, 23, 0.88) 100%)',
          zIndex: 1
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ maxWidth: '820px', margin: '0 auto' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1.5px solid #ED6C1B',
              color: '#ED6C1B',
              fontSize: '12px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              padding: '6px 20px',
              borderRadius: '100px',
              marginBottom: '20px',
              backdropFilter: 'blur(6px)'
            }}>
              Available 6 Days a Week • Direct B2B Desk
            </span>

            <h1 style={{
              fontFamily: 'var(--font-h, Outfit, sans-serif)',
              fontSize: 'clamp(34px, 5vw, 54px)',
              fontWeight: 900,
              marginBottom: '20px',
              lineHeight: 1.15,
              color: '#FFFFFF'
            }}>
              Contact <span style={{ color: '#ED6C1B' }}>Trishu Impex</span>
            </h1>

            <p style={{ fontSize: '17px', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto', fontWeight: 500 }}>
              Get in touch for product queries, bulk orders, export quotes or sample requests. Our team responds within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section style={{ background: '#FFFDF7', padding: '48px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {contactCards.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '24px 20px',
                  border: '1.5px solid var(--border)',
                  boxShadow: '0 6px 20px rgba(237, 108, 27, 0.05)',
                  cursor: c.href ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'all 0.3s ease'
                }}
                whileHover={{ y: -4, borderColor: 'var(--gold)', boxShadow: '0 12px 30px rgba(237, 108, 27, 0.15)' }}
                onClick={() => c.href && c.href !== '#map' && window.open(c.href)}
              >
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--gold-pale)', border: '1px solid var(--gold-light)', color: 'var(--gold-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <c.icon size={22} />
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--gold-deep)', marginBottom: 4 }}>{c.label}</span>
                  <strong style={{ fontSize: 14, color: 'var(--navy)', display: 'block' }}>{c.value}</strong>
                  <span style={{ display: 'block', fontSize: 12, color: 'var(--gray)', marginTop: 2 }}>{c.sub}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="py-80">
        <div className="container">
          <div className="contact-page-grid">
            {/* Form */}
            <motion.div
              className="contact-form-card"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h3 style={{ fontFamily: 'var(--font-h)', fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
                Send an Enquiry
              </h3>
              <p style={{ fontSize: 14, color: 'var(--gray)', marginBottom: 28 }}>
                Fill in the details below and we'll get in touch with pricing and availability.
              </p>

              {submitted && (
                <div style={{ background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: 12, padding: '14px 18px', marginBottom: 20, color: '#065F46', fontWeight: 700 }}>
                  ✓ Thank you! Your enquiry has been received by our Export Desk. We will respond within 24 hours.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input name="name" placeholder="Your full name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Company Name</label>
                    <input name="company" placeholder="Company / Organization" value={form.company} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input type="email" name="email" placeholder="importer@company.com" value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Phone / WhatsApp *</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <select name="countryCode" value={form.countryCode} onChange={handleChange} style={{ width: 90, flexShrink: 0 }}>
                        {countryCodes.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <input type="tel" name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} required style={{ flex: 1 }} />
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Interest</label>
                    <input name="product" placeholder="e.g. Turmeric Powder, Cumin Seeds" value={form.product} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Target Quantity / Volume</label>
                    <input name="quantity" placeholder="e.g. 20 MT Container" value={form.quantity} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Message / Enquiry *</label>
                  <textarea
                    name="message"
                    placeholder="Describe your requirements — product specifications, destination country, packaging preferences, delivery timeline..."
                    value={form.message}
                    onChange={handleChange}
                    required
                    style={{ minHeight: 130 }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    <Send size={17} />
                    <span>Submit Enquiry</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Right Side */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Map */}
              <motion.div
                className="map-card"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                style={{ minHeight: 300 }}
              >
                <iframe
                  src="https://maps.google.com/maps?q=Dayima+Complex,+Paliyad+Road,+Sayla,+Gujarat+363430&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  title="Trishu Impex Location - Sayla, Gujarat"
                  allowFullScreen
                  loading="lazy"
                />
              </motion.div>

              {/* WhatsApp Direct */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ background: '#E8F5E9', border: '1.5px solid #A5D6A7', borderRadius: 16, padding: '24px 28px' }}
              >
                <h4 style={{ fontFamily: 'var(--font-h)', fontSize: 17, fontWeight: 800, marginBottom: 6 }}>
                  💬 Prefer to Chat?
                </h4>
                <p style={{ fontSize: 14, color: 'var(--gray)', marginBottom: 16 }}>
                  Chat directly with our export team on WhatsApp for the fastest response!
                </p>
                <a
                  href="https://api.whatsapp.com/send?phone=919898522905&text=Hi%20Trishu%20Impex!%20I%20would%20like%20to%20enquire%20about%20your%20products."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ background: '#25D366', display: 'inline-flex', width: '100%', justifyContent: 'center' }}
                >
                  <MessageCircle size={18} />
                  <span>Chat on WhatsApp</span>
                  <ArrowRight size={15} />
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
