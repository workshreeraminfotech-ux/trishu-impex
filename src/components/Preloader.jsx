import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../assets/logo.png';

export default function Preloader({ onFinish }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      if (onFinish) onFinish();
    }, 1800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#FFFFFF',
            zIndex: 99999999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          {/* Animated Logo Container */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            <motion.img
              src={logoImg}
              alt="Trishu Impex"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              style={{
                height: '110px',
                width: 'auto',
                maxWidth: '280px',
                objectFit: 'contain',
                marginBottom: '24px'
              }}
            />

            {/* Subtle Progress Bar */}
            <div
              style={{
                width: '160px',
                height: '3.5px',
                backgroundColor: '#E2E8F0',
                borderRadius: '100px',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.6, ease: 'easeInOut' }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(135deg, #ED6C1B 0%, #FF8238 100%)',
                  borderRadius: '100px'
                }}
              />
            </div>

            <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C96A0', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '16px' }}>
              Pioneering Indian Agro Exports
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
