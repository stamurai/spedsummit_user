import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from './Button';

const SPEAKERS = [
  { name:"Tara Roehl",      img:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=360&fit=crop&auto=format" },
  { name:"Casey Harrison",  img:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=360&fit=crop&auto=format" },
  { name:"Sydney Bassard",  img:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=360&fit=crop&auto=format" },
  { name:"Diana Williams",  img:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=360&fit=crop&auto=format" },
  { name:"Farwa Husain",    img:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=360&fit=crop&auto=format" },
  { name:"Jordan Smith",    img:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=360&fit=crop&auto=format" },
  { name:"Sam Parmelee",    img:"https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&h=360&fit=crop&auto=format" },
  { name:"Natasha S.",      img:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=360&fit=crop&auto=format" },
  { name:"Rose Karentina",  img:"https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=300&h=360&fit=crop&auto=format" },
];

const STATS = [
  { value: '4,200+', label: 'Active educators' },
  { value: '9',      label: 'Expert sessions'  },
  { value: 'Free',   label: 'Certificate'       },
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

export default function HeroV2({ onGetStarted, isLoggedIn, onGoToDashboard }) {
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
            {isLoggedIn
              ? <Button size="lg" onClick={onGoToDashboard}>Go to my dashboard →</Button>
              : <Button size="lg" onClick={onGetStarted}>Start learning for free →</Button>
            }
            <Button size="lg" variant="outline" onClick={() => document.getElementById('features-v2')?.scrollIntoView({ behavior: 'smooth' })}>
              See how it works
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
            {STATS.map(({ value, label }, i) => (
              <div key={i}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#262626', lineHeight: 1.2 }}>{value}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Right: speaker mosaic ── */}
        <motion.div
          className="hero-collage"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', gap: 10, alignSelf: 'center' }}
        >
          <style>{`
            .spk-mosaic-row { display: flex; gap: 10px; }
            .spk-mosaic-card { border-radius: 16px; overflow: hidden; flex-shrink: 0; box-shadow: 0 4px 16px rgba(0,0,0,0.10); }
            .spk-mosaic-card img { width: 100%; height: 100%; object-fit: cover; object-position: center 10%; display: block; transition: transform 0.4s ease; }
            .spk-mosaic-card:hover img { transform: scale(1.06); }
          `}</style>

          {/* Row 1 — 5 cards, taller */}
          <div className="spk-mosaic-row">
            {SPEAKERS.slice(0, 5).map((s, i) => (
              <motion.div key={i} variants={imageVariants} className="spk-mosaic-card"
                style={{ width: i === 0 || i === 4 ? 88 : 76, height: 116 }}>
                <img src={s.img} alt={s.name} />
              </motion.div>
            ))}
          </div>

          {/* Row 2 — 4 cards, slightly shorter, offset right */}
          <div className="spk-mosaic-row" style={{ paddingLeft: 42 }}>
            {SPEAKERS.slice(5).map((s, i) => (
              <motion.div key={i} variants={imageVariants} className="spk-mosaic-card"
                style={{ width: i === 0 || i === 3 ? 88 : 76, height: 100 }}>
                <img src={s.img} alt={s.name} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
