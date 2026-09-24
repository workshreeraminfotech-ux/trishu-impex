import React from 'react';
import { motion } from 'framer-motion';
import { Globe2, Ship, Building2, ShieldCheck } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

export default function CounterSection() {
  const stats = [
    {
      end: 1000,
      suffix: '+ MT',
      title: 'Global Cargo Export Volume',
      icon: Ship,
      desc: 'Worldwide FCL & LCL container dispatches'
    },
    {
      end: 100,
      suffix: '%',
      title: 'On-Time Container Delivery',
      icon: ShieldCheck,
      desc: 'Seamless port & customs clearing'
    },
    {
      end: 30,
      suffix: '+',
      title: 'Countries Reached',
      icon: Globe2,
      desc: 'Trusted global trade network'
    },
    {
      end: 100,
      suffix: '%',
      title: 'Quality & Purity Compliance',
      icon: Building2,
      desc: 'Lab tested & export certified'
    }
  ];

  return (
    <section className="counter-stats-redesign-section">
      <div className="container">
        <div className="counter-stats-grid">
          {stats.map((st, idx) => {
            const Icon = st.icon;
            return (
              <motion.div
                key={idx}
                className="counter-card-v2"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
              >
                <div className="counter-card-header">
                  <div className="counter-icon-wrap">
                    <Icon size={24} />
                  </div>
                  <h2 className="counter-num-val">
                    <AnimatedCounter end={st.end} suffix={st.suffix} />
                  </h2>
                </div>
                <h3>{st.title}</h3>
                <p>{st.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

