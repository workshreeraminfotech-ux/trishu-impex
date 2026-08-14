import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    countryCode: '+91',
    phone: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: '',
        company: '',
        countryCode: '+91',
        phone: '',
        email: '',
        message: ''
      });
    }, 5000);
  };

  return (
    <section className="py-80 bg-navy" id="contact">
      <div className="container">
        <div className="contact-grid">
          <div>
            <span className="eyebrow green" style={{ color: 'var(--silver-light)' }}>Contact Export Desk</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '38px', fontWeight: 900, color: '#fff', marginBottom: '20px', lineHeight: 1.2 }}>
              Get In Touch With <span>Trishu Impex Team</span>
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '36px', lineHeight: 1.6 }}>
              Have inquiries regarding bulk agro prices, container availability, or private label packaging? Send us a message and our team will respond within 24 hours.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'var(--silver-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={20} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: 14, color: '#fff' }}>Phone / WhatsApp:</strong>
                  <a href="tel:+919898522905" style={{ fontSize: 15, color: 'rgba(255, 255, 255, 0.85)' }}>+91 98985 22905</a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'var(--silver-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={20} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: 14, color: '#fff' }}>Email Address:</strong>
                  <a href="mailto:sales@trishuimpex.com" style={{ fontSize: 15, color: 'rgba(255, 255, 255, 0.85)' }}>sales@trishuimpex.com</a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'var(--silver-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: 14, color: '#fff' }}>India Head Office:</strong>
                  <p style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.85)' }}>Dayima Complex, Office No 1, Paliyad Road, Sayla - 363430, Gujarat, India</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'var(--silver-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: 14, color: '#fff' }}>South Africa Hub:</strong>
                  <p style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.85)' }}>Unit F8, Supreme Industrial Park, 410 Southern Klipriviersberg Rd, Steeldale, Johannesburg, Gauteng 2197</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-card">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 800, color: 'var(--navy-dark)', marginBottom: '20px' }}>
              Request Wholesale Quote
            </h3>

            {submitted ? (
              <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--accent-green)' }}>
                <CheckCircle2 size={48} style={{ margin: '0 auto 16px' }} />
                <h4 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--navy-dark)', marginBottom: '8px' }}>Quote Request Sent!</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Thank you {formData.fullName}! Our export desk will email you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" name="fullName" required placeholder="Enter full name" value={formData.fullName} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Company Name *</label>
                  <input type="text" name="company" required placeholder="Business or company name" value={formData.company} onChange={handleChange} />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="form-group" style={{ flex: 4 }}>
                    <label>Country *</label>
                    <select name="countryCode" value={formData.countryCode} onChange={handleChange}>
                      <option value="+91">India (+91)</option>
                      <option value="+1">United States (+1)</option>
                      <option value="+44">United Kingdom (+44)</option>
                      <option value="+971">UAE (+971)</option>
                      <option value="+27">South Africa (+27)</option>
                      <option value="+61">Australia (+61)</option>
                      <option value="+49">Germany (+49)</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 6 }}>
                    <label>Phone / WhatsApp *</label>
                    <input type="tel" name="phone" required placeholder="Phone number" value={formData.phone} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Business Email *</label>
                  <input type="email" name="email" required placeholder="name@company.com" value={formData.email} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Inquiry Details / Products Required *</label>
                  <textarea name="message" rows="3" required placeholder="Specify products (e.g. 5 Tons Turmeric Powder) and port of destination..." value={formData.message} onChange={handleChange}></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  <span>Send Quote Request</span>
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
