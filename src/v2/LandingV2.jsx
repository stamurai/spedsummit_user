import { useLenis } from './hooks/useLenis';
import NavV2 from './components/NavV2';
import HeroV2 from './components/HeroV2';
import StatsStrip from './components/StatsStrip';
import FeatureSection from './components/FeatureSection';
import { TestimonialsResponsive as Testimonials } from './components/Testimonials';
import FAQAccordion from './components/FAQAccordion';
import Footer from './components/Footer';

export default function LandingV2({ onGetStarted }) {
  useLenis();

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <NavV2 onGetStarted={onGetStarted} />
      <HeroV2 onGetStarted={onGetStarted} />
      <StatsStrip />
      <FeatureSection />
      <Testimonials />
      <FAQAccordion />
      <Footer onGetStarted={onGetStarted} />
    </div>
  );
}
