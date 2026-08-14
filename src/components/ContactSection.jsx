import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageCircle, ArrowRight } from 'lucide-react';

import { addEnquiry } from '../utils/adminStore';

const countryCodes = ['+91', '+1', '+44', '+971', '+65', '+49', '+61', '+27', '+33', '+86'];

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', countryCode: '+91', phone: '', product: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    addEnquiry({
      source: 'Contact Us Form',
      name: form.name,
      email: form.email,
      phone: `${form.countryCode} ${form.phone}`,
      product: form.product || 'General Enquiry',
      notes: form.message
    });
    setSubmitted(true);
  };

  return (
    <section className="py-80 bg-light" id="contact-section">
      <div className="container">
        <motion.div
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="eyebrow">Get In Touch</span>
          <h2>Contact <span>Us</span></h2>
          <p>Reach out for bulk enquiries, export quotes or product samples. We respond within 24 hours.</p>
        </motion.div>

        <div className="contact-grid">
          {/* Form */}
          <motion.div
            className="contact-form-card"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
          >
            <h3 style={{ fontFamily: 'var(--font-h)', fontSize: 22, fontWeight: 800, marginBottom: 24 }}>
              Send Us An Enquiry
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input name="email" type="email" placeholder="email@example.com" value={form.email} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <div className="phone-field">
                  <select name="countryCode" value={form.countryCode} onChange={handleChange}>
                    {countryCodes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Product Interest</label>
                <select name="product" value={form.product} onChange={handleChange}>
                  <option value="">Select a spice category</option>
                  <option>Ground Spices</option>
                  <option>Whole Spices</option>
                  <option>Seed Spices</option>
                  <option>Blended Spices</option>
                  <option>Custom Spice Blend / Bulk Inquiry</option>
                </select>
              </div>
              <div className="form-group">
                <label>Message / Enquiry *</label>
                <textarea name="message" placeholder="Tell us about your requirements — quantity, packaging, destination..." value={form.message} onChange={handleChange} required />
              </div>
            {submitted ? (
              <div style={{ backgroundColor: '#D1FAE5', border: '1px solid #6EE7B7', color: '#065F46', padding: '20px', borderRadius: '16px', textAlign: 'center', fontWeight: 700, marginBottom: '20px' }}>
                ✓ Thank you! Your enquiry has been received. Our export desk will contact you within 24 hours.
              </div>
            ) : (
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <span>Submit Enquiry</span>
                <ArrowRight size={16} />
              </button>
            )}
            </form>

            <div className="contact-info-box">
              <div className="contact-info-item">
                <div className="ci-icon"><Phone size={18} /></div>
                <div className="ci-text">
                  <strong>+91 98985 22905</strong>
                  <span>Mon–Sat, 9am – 6pm IST</span>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="ci-icon"><Mail size={18} /></div>
                <div className="ci-text">
                  <strong>sales@trishuimpex.com</strong>
                  <span>We reply within 24 hours</span>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="ci-icon"><MapPin size={18} /></div>
                <div className="ci-text">
                  <strong>Dayima Complex, Office No 1, Paliyad Road, Sayla - 363430, Gujarat, India</strong>
                  <span>Export Hub — Kandla & Mundra Port Access</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            className="map-card"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
          >
            <iframe
              src="https://maps.google.com/maps?q=Dayima+Complex,+Paliyad+Road,+Sayla,+Gujarat+363430&t=&z=14&ie=UTF8&iwloc=&output=embed"
              title="Trishu Impex Location - Sayla, Gujarat"
              allowFullScreen
              loading="lazy"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
