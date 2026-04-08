import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChalkboardTeacher, PlayCircle, Certificate } from '@phosphor-icons/react';
import { Button } from './Button';

const IMAGES = [
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop',
];

const STATS = [
  { value: '4,200+', label: 'Active educators', Icon: ChalkboardTeacher },
  { value: '9',      label: 'Expert sessions',  Icon: PlayCircle },
  { value: 'Free',   label: 'Certificate',       Icon: Certificate },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.18 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const imageVariants = {
  hidden:  { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const floatVariants = {
  animate: { y: [0, -10, 0], transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' } },
};

export default function HeroV2({ onGetStarted }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y       = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} style={{
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden',
      background: '#ffffff',
      display: 'flex',
      alignItems: 'center',
    }}>
      {/* Subtle glow blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '5%', left: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(245,158,11,0.08) 0%,transparent 70%)', filter: 'blur(48px)' }} />
        <div style={{ position: 'absolute', top: '30%', right: '0%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(245,158,11,0.06) 0%,transparent 70%)', filter: 'blur(48px)' }} />
        {/* Subtle dot grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.6 }} />
      </div>

      <motion.div style={{ y, opacity, position: 'relative', zIndex: 1, width: '100%', maxWidth: 1200, margin: '0 auto', padding: '60px 40px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}
        className="hero-grid"
      >
        <style>{`
          @media (max-width: 900px) {
            .hero-grid { grid-template-columns: 1fr !important; }
            .hero-collage { height: 340px !important; }
          }
        `}</style>

        {/* ── Left: text ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
        >
          {/* Pill */}
          <motion.div variants={itemVariants}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fffbeb', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 999, padding: '6px 18px', fontSize: 12, fontWeight: 700, color: '#92400e', marginBottom: 32, textTransform: 'uppercase', letterSpacing: 1 }}
          >
            ✦ 100% Free · SPED Summit 2026
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={itemVariants}
            style={{ margin: '0 0 24px', fontSize: 'clamp(40px,5.5vw,72px)', fontWeight: 900, lineHeight: 1.06, letterSpacing: -2.5, color: '#262626' }}
          >
            The Best SPED<br />
            Training.{' '}
            <span style={{ backgroundImage: 'linear-gradient(90deg,#f59e0b,#d97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              All Free.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={itemVariants}
            style={{ margin: '0 0 40px', fontSize: 18, color: '#6b7280', lineHeight: 1.7, maxWidth: 460 }}
          >
            9 expert-led sessions, interactive quizzes, real downloadable certificates, and a chance to win Ablespace Pro — completely free.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 52 }}>
            <Button size="lg" onClick={onGetStarted}>
              Start learning for free →
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById('features-v2')?.scrollIntoView({ behavior: 'smooth' })}>
              See how it works
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
            {STATS.map(({ value, label, Icon }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fffbeb', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color="#d97706" weight="duotone" />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#262626', lineHeight: 1.2 }}>{value}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Right: image collage ── */}
        <motion.div
          className="hero-collage"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ position: 'relative', height: 480, width: '100%' }}
        >
          {/* Floating decorative blobs */}
          <motion.div variants={floatVariants} animate="animate"
            style={{ position: 'absolute', top: -16, left: '20%', width: 64, height: 64, borderRadius: '50%', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.25)' }}
          />
          <motion.div variants={floatVariants} animate="animate"
            style={{ position: 'absolute', bottom: 16, right: '20%', width: 48, height: 48, borderRadius: 12, background: 'rgba(217,119,6,0.12)', border: '1px solid rgba(217,119,6,0.2)' }}
          />
          <motion.div variants={floatVariants} animate="animate"
            style={{ position: 'absolute', bottom: '30%', left: 0, width: 28, height: 28, borderRadius: '50%', background: 'rgba(245,158,11,0.18)' }}
          />

          {/* Top-center image */}
          <motion.div variants={imageVariants}
            style={{ position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', width: 220, height: 220, borderRadius: 24, background: '#f9fafb', border: '1px solid #e5e7eb', padding: 6, boxShadow: '0 16px 48px rgba(0,0,0,0.1)' }}
          >
            <img src={IMAGES[0]} alt="Collaborative learning" style={{ width: '100%', height: '100%', borderRadius: 20, objectFit: 'cover' }} />
          </motion.div>

          {/* Right-center image */}
          <motion.div variants={imageVariants}
            style={{ position: 'absolute', right: 0, top: '30%', width: 190, height: 190, borderRadius: 24, background: '#f9fafb', border: '1px solid #e5e7eb', padding: 6, boxShadow: '0 16px 48px rgba(0,0,0,0.1)' }}
          >
            <img src={IMAGES[1]} alt="SPED classroom" style={{ width: '100%', height: '100%', borderRadius: 20, objectFit: 'cover' }} />
          </motion.div>

          {/* Bottom-left image */}
          <motion.div variants={imageVariants}
            style={{ position: 'absolute', left: 0, bottom: 0, width: 160, height: 160, borderRadius: 24, background: '#f9fafb', border: '1px solid #e5e7eb', padding: 6, boxShadow: '0 16px 48px rgba(0,0,0,0.1)' }}
          >
            <img src={IMAGES[2]} alt="Students" style={{ width: '100%', height: '100%', borderRadius: 20, objectFit: 'cover' }} />
          </motion.div>

          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', left: '28%', bottom: '18%', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '12px 20px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
          >
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.8 }}>Next session</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#262626' }}>IEP Strategies</div>
            <div style={{ fontSize: 12, color: '#d97706', marginTop: 2 }}>Starting soon →</div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
