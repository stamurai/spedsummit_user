import { motion } from 'framer-motion';
import { useScrollAnimation, fadeUp, stagger } from '../hooks/useScrollAnimation';
import { Button } from './Button';

const C = {
  text:   '#2B2E33',
  muted:  '#5D636F',
  border: '#e5e7eb',
};

export default function Footer({ onGetStarted }) {
  const { ref, isInView } = useScrollAnimation();

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .footer-cta-section { padding: 0 16px 64px !important; }
          .footer-cta-band { padding: 40px 20px !important; }
          .footer-bar { padding: 24px 16px !important; }
          .footer-bar-inner { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
        }
      `}</style>
      {/* Final CTA band */}
      <section className="footer-cta-section" style={{ background: '#ffffff', padding: '0 32px 120px' }}>
        <motion.div
          ref={ref}
          variants={stagger(0.1)}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="footer-cta-band"
          style={{
            maxWidth: 860, margin: '0 auto',
            background: 'linear-gradient(135deg,rgba(245,158,11,0.1) 0%,rgba(217,119,6,0.06) 100%)',
            border: '1px solid rgba(245,158,11,0.25)',
            borderRadius: 28, padding: '72px 48px',
            textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}
        >
          {/* BG glow */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: '20%', left: '30%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(245,158,11,0.12) 0%,transparent 70%)', filter: 'blur(40px)' }}/>
          </div>

          <motion.div variants={fadeUp}
            style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fffbeb', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 999, padding: '5px 16px', fontSize: 12, fontWeight: 700, color: '#92400e', marginBottom: 28, textTransform: 'uppercase', letterSpacing: 1 }}>
            Free & open to all educators
          </motion.div>

          <motion.h2 variants={fadeUp}
            style={{ position: 'relative', margin: '0 0 20px', fontSize: 'clamp(32px,5vw,60px)', fontWeight: 900, color: C.text, letterSpacing: -2, lineHeight: 1.05 }}>
            Start learning today.<br />
            <span style={{ backgroundImage: 'linear-gradient(90deg,#f59e0b,#d97706)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              It's completely free.
            </span>
          </motion.h2>

          <motion.p variants={fadeUp}
            style={{ position: 'relative', margin: '0 auto 40px', fontSize: 17, color: C.muted, lineHeight: 1.65, maxWidth: 480 }}>
            9 expert sessions, knowledge checks, real certificates, and a chance to win Ablespace Pro — zero cost, zero catch.
          </motion.p>

          <motion.div variants={fadeUp} style={{ position: 'relative', display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button size="lg" onClick={onGetStarted}>
              Get started free →
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer bar */}
      <footer className="footer-bar" style={{ borderTop: `1px solid ${C.border}`, background: '#ffffff', padding: '36px 32px' }}>
        <div className="footer-bar-inner" style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <img src="/Container.png" alt="SPED Summit" style={{ height: 24, display: 'block' }} />
            <span style={{ fontSize: 13, color: C.muted }}>© 2026 SPED Summit. All rights reserved.</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'Contact'].map(label => (
              <a key={label} href="#" style={{ fontSize: 13, color: C.muted, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = C.text}
                onMouseLeave={e => e.currentTarget.style.color = C.muted}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
