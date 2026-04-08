import { Boxes } from './BackgroundBoxes';
import { Button } from './Button';
import { ChalkboardTeacher, Certificate, BookOpen, Users, Lightning, Heart } from '@phosphor-icons/react';

const PERKS = [
  { Icon: BookOpen,          label: '9 Expert Sessions' },
  { Icon: Certificate,       label: 'Free Certificate' },
  { Icon: ChalkboardTeacher, label: '4,200+ Educators' },
  { Icon: Users,             label: 'Open to All' },
  { Icon: Lightning,         label: 'Instant Access' },
  { Icon: Heart,             label: 'No Credit Card' },
];

export default function FreeSection({ onGetStarted }) {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: '#0f172a', padding: '100px 32px' }}>

      {/* Radial vignette overlay — fades edges into dark */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, black 100%)',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, black 100%)',
        background: '#0f172a',
      }} />

      {/* Animated box grid */}
      <Boxes />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 30, maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: 999, padding: '6px 18px', fontSize: 12, fontWeight: 700, color: '#fbbf24', marginBottom: 28, textTransform: 'uppercase', letterSpacing: 1 }}>
          ✦ SPED Summit 2026
        </div>

        {/* Headline */}
        <h2 style={{ margin: '0 0 20px', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, lineHeight: 1.06, letterSpacing: -2, color: '#ffffff' }}>
          Free &amp; Open to{' '}
          <span style={{ backgroundImage: 'linear-gradient(90deg,#f59e0b,#fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            All Educators
          </span>
        </h2>

        {/* Sub */}
        <p style={{ margin: '0 auto 48px', fontSize: 18, color: '#94a3b8', lineHeight: 1.7, maxWidth: 520 }}>
          No paywalls, no subscriptions, no catch. Every session, quiz, and certificate is completely free — because great SPED education should be accessible to everyone.
        </p>

        {/* Perk pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 48 }}>
          {PERKS.map(({ Icon, label }, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, padding: '8px 18px', fontSize: 13, color: '#e2e8f0', backdropFilter: 'blur(8px)' }}>
              <Icon size={15} weight="duotone" color="#f59e0b" />
              {label}
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onGetStarted}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#000000', fontWeight: 800, fontSize: 16, border: 'none', borderRadius: 14, padding: '16px 40px', cursor: 'pointer', boxShadow: '0 8px 32px rgba(245,158,11,0.35)', letterSpacing: -0.3 }}
        >
          Start learning for free →
        </button>

        {/* Fine print */}
        <p style={{ margin: '20px 0 0', fontSize: 12, color: '#64748b' }}>
          No sign-up required to browse · Certificate needs a free account
        </p>
      </div>
    </section>
  );
}
