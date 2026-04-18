import { motion } from 'framer-motion';
import { useScrollAnimation, stagger, fadeUp } from '../hooks/useScrollAnimation';

const C = {
  text:   '#2B2E33',
  muted:  '#5D636F',
  border: '#e5e7eb',
  bg:     '#f9fafb',
};

const STATS = [
  { value: '9',      label: 'Expert Sessions' },
  { value: '4,200+', label: 'Educators Enrolled' },
  { value: '100%',   label: 'Free to Access' },
  { value: '4.9★',   label: 'Average Rating' },
];

export default function StatsStrip() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section className="stats-section" style={{ background: '#ffffff', padding: '80px 32px 0' }}>
      <style>{`
        @media (max-width: 767px) {
          .stats-section { padding: 40px 16px 0 !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
      <motion.div
        ref={ref}
        variants={stagger(0.08)}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="stats-grid"
        style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1,
          border: `1px solid ${C.border}`, borderRadius: 20, overflow: 'hidden',
          background: C.border,
        }}
      >
        {STATS.map((s, i) => (
          <motion.div key={i} variants={fadeUp}
            style={{
              padding: '36px 28px', textAlign: 'center',
              background: '#ffffff',
            }}
          >
            <div style={{ fontSize: 'clamp(28px,3vw,44px)', fontWeight: 900, letterSpacing: -1.5, backgroundImage: 'linear-gradient(135deg,#f59e0b,#d97706)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              {s.value}
            </div>
            <div style={{ marginTop: 6, fontSize: 14, color: C.muted, fontWeight: 500 }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
