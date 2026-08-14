import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { getBlogs } from '../utils/adminStore';

export default function RecentBlogs({ onNavigate }) {
  const blogsList = getBlogs();
  // Use first 3 product blogs
  const recentPosts = blogsList.slice(0, 3);

  return (
    <section className="py-80" id="recent-blogs" style={{ backgroundColor: '#FFFDF7' }}>
      <div className="container">
        <motion.div
          className="section-title text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="eyebrow">
            EXPORT KNOWLEDGE & PRODUCT GUIDES
          </span>
          <h2 style={{ color: 'var(--navy)', marginTop: '10px' }}>
            Latest <span style={{ color: 'var(--gold)' }}>Spice Blog Posts</span>
          </h2>
          <p style={{ color: 'var(--gray)', marginTop: '8px' }}>
            Product quality guides, curcumin testing, ASTA color ratings, and market insights for international buyers.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '28px' }}>
          {recentPosts.map((b, i) => (
            <motion.div
              key={b.id || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              onClick={() => onNavigate && onNavigate('blog')}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1.5px solid var(--border)',
                overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(237, 108, 27, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease'
              }}
              whileHover={{ y: -5, boxShadow: '0 16px 36px rgba(237, 108, 27, 0.2)', borderColor: 'var(--gold)' }}
            >
              <div style={{
                height: '210px',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                borderBottom: '1px solid var(--border)'
              }}>
                <img src={b.image} alt={b.title} loading="lazy" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: 'var(--gold-deep)',
                  backgroundColor: 'var(--gold-pale)',
                  padding: '3px 10px',
                  borderRadius: '100px',
                  alignSelf: 'flex-start',
                  marginBottom: '10px'
                }}>
                  {b.cat}
                </span>

                <h3 style={{
                  fontFamily: 'var(--font-h, Outfit, sans-serif)',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: 'var(--navy)',
                  marginBottom: '10px',
                  lineHeight: 1.35
                }}>
                  {b.title}
                </h3>

                <p style={{
                  fontSize: '13.5px',
                  color: 'var(--gray)',
                  lineHeight: 1.55,
                  marginBottom: '20px',
                  flex: 1,
                  fontWeight: 500,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {b.excerpt}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--gray)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} /> {b.date}
                  </span>

                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--gold-deep)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Read Post <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button
            onClick={() => onNavigate && onNavigate('blog')}
            className="btn btn-outline"
            style={{
              padding: '13px 28px',
              fontSize: '14.5px'
            }}
          >
            <span>View All Knowledge Posts</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
