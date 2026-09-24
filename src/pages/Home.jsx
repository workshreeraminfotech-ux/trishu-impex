import React from 'react';
import HeroBannerSlider from '../components/HeroBannerSlider';
import MainSeedsShowcase from '../components/MainSeedsShowcase';
import AboutUs from '../components/AboutUs';
import WorkProcess from '../components/WorkProcess';
import CertificationsSection from '../components/CertificationsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CounterSection from '../components/CounterSection';
import FAQ from '../components/FAQ';
import CtaBanner from '../components/CtaBanner';

export default function Home({ onNavigate, onOpenQuote }) {
  return (
    <div className="home-page">
      <HeroBannerSlider onOpenQuote={() => onOpenQuote()} onNavigate={onNavigate} />
      <AboutUs />
      <CounterSection />
      <MainSeedsShowcase onOpenQuote={(product) => onOpenQuote(product)} onNavigate={onNavigate} />
      <WorkProcess />
      <CertificationsSection />
      <TestimonialsSection />
      <FAQ />
      <CtaBanner onOpenQuote={() => onOpenQuote()} onNavigate={onNavigate} />
    </div>
  );
}
