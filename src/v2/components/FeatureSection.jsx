import React from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import {
  Brain, ChatCircle, ClipboardText, Target, Handshake,
  Hand, UsersThree, Rocket, Heart, PlayCircle,
  VideoCamera, ClosedCaptioning, ArrowCounterClockwise, ChalkboardTeacher, Tag,
  Lightning, CheckSquare, ArrowClockwise, ChartBar,
  Scales, TrendUp, LockOpen, Lightbulb,
  Medal, PushPin, MagnifyingGlass, Barbell, Trophy,
  FilePdf, LinkedinLogo, DownloadSimple, UserCircle, CalendarCheck,
  ShareNetwork, Robot, Printer, Gift,
  SealCheck, EnvelopeSimple, Star, FrameCorners, CurrencyDollar,
} from '@phosphor-icons/react';
import { useScrollAnimation, stagger, fadeUp } from '../hooks/useScrollAnimation';

// ── Tag data ──────────────────────────────────────────────────────────────────

const CARDS = [
  {
    tag: 'Watch & Learn',
    title: 'Expert sessions you can watch anywhere.',
    description: 'Nine SPED specialists share practical, classroom-tested strategies. Watch live or on-demand — no schedule pressure.',
    rows: [
      [
        { id: 'mindfulness', Icon: Brain,                  label: 'Mindfulness' },
        { id: 'aac',         Icon: ChatCircle,             label: 'AAC Strategies' },
        { id: 'iep',         Icon: ClipboardText,          label: 'IEP Writing' },
        { id: 'behavior',    Icon: Target,                 label: 'Behavior Intervention' },
        { id: 'inclusive',   Icon: Handshake,              label: 'Inclusive Classroom' },
      ],
      [
        { id: 'sensory',     Icon: Hand,                   label: 'Sensory Processing' },
        { id: 'parent',      Icon: UsersThree,             label: 'Family Collaboration' },
        { id: 'transition',  Icon: Rocket,                 label: 'Transition Planning' },
        { id: 'selfcare',    Icon: Heart,                  label: 'Self-Care' },
        { id: 'ondemand',    Icon: PlayCircle,             label: 'On-Demand Video' },
      ],
      [
        { id: 'hd',          Icon: VideoCamera,            label: 'HD Quality' },
        { id: 'captions',    Icon: ClosedCaptioning,       label: 'Closed Captions' },
        { id: 'replay',      Icon: ArrowCounterClockwise,  label: 'Replay Anytime' },
        { id: 'specialists', Icon: ChalkboardTeacher,      label: 'SPED Specialists' },
        { id: 'free',        Icon: Tag,                    label: '100% Free' },
      ],
    ],
  },
  {
    tag: 'Quiz & Assess',
    title: 'Lock in your learning with interactive quizzes.',
    description: 'Short knowledge checks after each session reinforce content with instant feedback and unlimited retakes.',
    rows: [
      [
        { id: 'knowledge',   Icon: Brain,          label: 'Knowledge Check' },
        { id: 'instant',     Icon: Lightning,      label: 'Instant Feedback' },
        { id: 'multichoice', Icon: CheckSquare,    label: 'Multiple Choice' },
        { id: 'retry',       Icon: ArrowClockwise, label: 'Retry Anytime' },
        { id: 'tracking',    Icon: ChartBar,       label: 'Score Tracking' },
      ],
      [
        { id: 'persession',  Icon: Target,         label: 'Per-Session Quiz' },
        { id: 'fair',        Icon: Scales,         label: 'Fair Questions' },
        { id: 'progress',    Icon: TrendUp,        label: 'Progress Overview' },
        { id: 'nogate',      Icon: LockOpen,       label: 'No Gatekeeping' },
        { id: 'hints',       Icon: Lightbulb,      label: 'Answer Hints' },
      ],
      [
        { id: 'mastery',     Icon: Medal,          label: 'Mastery Focus' },
        { id: 'accountable', Icon: PushPin,        label: 'Stay Accountable' },
        { id: 'review',      Icon: MagnifyingGlass,label: 'Answer Review' },
        { id: 'confidence',  Icon: Barbell,        label: 'Build Confidence' },
        { id: 'complete',    Icon: Trophy,         label: 'Completion Badge' },
      ],
    ],
  },
  {
    tag: 'Get Certified',
    title: 'A real certificate, automatically generated.',
    description: 'Pass all sessions and your personalised PDF certificate is ready instantly — shareable on LinkedIn, no chasing required.',
    rows: [
      [
        { id: 'pdf',         Icon: FilePdf,        label: 'PDF Certificate' },
        { id: 'linkedin',    Icon: LinkedinLogo,   label: 'LinkedIn Ready' },
        { id: 'instant',     Icon: DownloadSimple, label: 'Instant Download' },
        { id: 'name',        Icon: UserCircle,     label: 'Your Name' },
        { id: 'date',        Icon: CalendarCheck,  label: 'Completion Date' },
      ],
      [
        { id: 'shareable',   Icon: ShareNetwork,   label: 'Shareable' },
        { id: 'auto',        Icon: Robot,          label: 'Auto Generated' },
        { id: 'details',     Icon: ClipboardText,  label: 'Session Details' },
        { id: 'print',       Icon: Printer,        label: 'Print Ready' },
        { id: 'giveaway',    Icon: Gift,           label: 'Giveaway Entry' },
      ],
      [
        { id: 'verified',    Icon: SealCheck,      label: 'Verified Completion' },
        { id: 'email',       Icon: EnvelopeSimple, label: 'Email Friendly' },
        { id: 'pro',         Icon: Star,           label: 'Ablespace Pro' },
        { id: 'display',     Icon: FrameCorners,   label: 'Display Ready' },
        { id: 'nocost',      Icon: CurrencyDollar, label: 'Zero Cost' },
      ],
    ],
  },
];

// ── Bento card ────────────────────────────────────────────────────────────────

const LENS_SIZE = 68;
const LENS_HALF = LENS_SIZE / 2;

function BentoCard({ card }) {
  const containerRef = React.useRef(null);
  const lensX = useMotionValue(0);
  const lensY = useMotionValue(0);

  const clipPath    = useMotionTemplate`circle(${LENS_HALF}px at calc(50% + ${lensX}px) calc(50% + ${lensY}px))`;
  const inverseMask = useMotionTemplate`radial-gradient(circle ${LENS_HALF}px at calc(50% + ${lensX}px) calc(50% + ${lensY}px), transparent 100%, black 100%)`;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minWidth: 0,
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: 28,
      overflow: 'hidden',
      boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
      transition: 'box-shadow 0.4s, transform 0.4s',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 40px rgba(245,158,11,0.12)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* Scrolling tags area */}
      <div
        ref={containerRef}
        style={{ position: 'relative', width: '100%', height: 160, overflow: 'hidden', background: 'rgba(249,250,251,0.6)' }}
      >
        <div style={{ position: 'relative', height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          {/* Base layer — masked out under lens */}
          <motion.div style={{ WebkitMaskImage: inverseMask, maskImage: inverseMask, display: 'flex', flexDirection: 'column', gap: 8, width: '100%', height: '100%', justifyContent: 'center' }}>
            {card.rows.map((row, ri) => (
              <motion.div key={ri}
                style={{ display: 'flex', gap: 10, width: 'max-content' }}
                animate={{ x: ri % 2 === 0 ? ['0%', '-33.333%'] : ['-33.333%', '0%'] }}
                transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
              >
                {[...row, ...row, ...row].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(6px)', border: '1px solid #e5e7eb', borderRadius: 999, padding: '5px 12px', fontSize: 11, color: '#5D636F', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    <item.Icon size={13} weight="duotone" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </motion.div>
            ))}
          </motion.div>

          {/* Reveal layer — visible only through lens */}
          <motion.div style={{ position: 'absolute', inset: 0, clipPath, display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center', pointerEvents: 'none', zIndex: 10 }}>
            {card.rows.map((row, ri) => (
              <motion.div key={ri}
                style={{ display: 'flex', gap: 10, width: 'max-content' }}
                animate={{ x: ri % 2 === 0 ? ['0%', '-33.333%'] : ['-33.333%', '0%'] }}
                transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
              >
                {[...row, ...row, ...row].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#ffffff', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 999, padding: '5px 12px', fontSize: 11, color: '#d97706', whiteSpace: 'nowrap', flexShrink: 0, fontWeight: 600, boxShadow: '0 2px 8px rgba(245,158,11,0.15)' }}>
                    <item.Icon size={13} weight="duotone" color="#d97706" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </motion.div>
            ))}
          </motion.div>

          {/* Draggable lens */}
          <motion.div
            drag
            dragMomentum={false}
            dragConstraints={containerRef}
            style={{
              x: lensX,
              y: lensY,
              position: 'absolute',
              top: `calc(50% - ${LENS_HALF}px)`,
              left: `calc(50% - ${LENS_HALF}px)`,
              zIndex: 40,
              cursor: 'grab',
              touchAction: 'none',
            }}
            whileDrag={{ cursor: 'grabbing' }}
          >
            <MagnifyingLens size={LENS_SIZE} />
          </motion.div>

          {/* Fade edges */}
          <div style={{ position: 'absolute', inset: 0, left: 0, width: '20%', background: 'linear-gradient(to right, #ffffff, transparent)', zIndex: 20, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, left: 'auto', right: 0, width: '20%', background: 'linear-gradient(to left, #ffffff, transparent)', zIndex: 20, pointerEvents: 'none' }} />
        </div>
      </div>

      {/* Card text */}
      <div style={{ padding: '20px 24px 24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fffbeb', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 999, padding: '3px 12px', fontSize: 10, fontWeight: 700, color: '#92400e', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          {card.tag}
        </div>
        <h3 style={{ margin: '0 0 10px', fontSize: 17, fontWeight: 800, color: '#2B2E33', lineHeight: 1.3, letterSpacing: -0.5 }}>
          {card.title}
        </h3>
        <p style={{ margin: 0, fontSize: 13, color: '#5D636F', lineHeight: 1.65 }}>
          {card.description}
        </p>
      </div>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function FeatureSections() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="features-v2" className="feature-section" style={{ background: '#ffffff', padding: '80px 32px 120px' }}>
      <style>{`
        @media (max-width: 767px) {
          .feature-section { padding: 48px 16px 64px !important; }
          .feature-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <motion.div
          ref={ref}
          variants={stagger(0.1)}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <motion.div variants={fadeUp}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fffbeb', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 999, padding: '5px 16px', fontSize: 12, fontWeight: 700, color: '#92400e', marginBottom: 24, textTransform: 'uppercase', letterSpacing: 1 }}>
            How it works
          </motion.div>
          <motion.h2 variants={fadeUp}
            style={{ margin: '0 0 16px', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 900, color: '#2B2E33', lineHeight: 1.08, letterSpacing: -1.8 }}>
            Watch. Quiz. Certify.
          </motion.h2>
          <motion.p variants={fadeUp}
            style={{ margin: '0 auto', fontSize: 17, color: '#5D636F', lineHeight: 1.7, maxWidth: 480 }}>
            Three simple steps to grow as a SPED educator — all completely free.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger(0.14)}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="feature-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}
        >
          {CARDS.map((card, i) => (
            <motion.div key={i} variants={fadeUp} style={{ minWidth: 0 }}>
              <BentoCard card={card} />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// ── Magnifying lens SVG ───────────────────────────────────────────────────────

function MagnifyingLens({ size = 84 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.18))' }}>
      <path d="M365.424 335.392L342.24 312.192L311.68 342.736L334.88 365.936L365.424 335.392Z" fill="#B0BDC6" />
      <path d="M358.08 342.736L334.88 319.552L319.04 335.392L342.24 358.584L358.08 342.736Z" fill="#DFE9EF" />
      <path d="M352.368 321.808L342.752 312.192L312.208 342.752L321.824 352.36L352.368 321.808Z" fill="#B0BDC6" />
      <path d="M332 332C260 404 142.4 404 69.6001 332C-2.3999 260 -2.3999 142.4 69.6001 69.6C141.6 -3.20003 259.2 -2.40002 332 69.6C404.8 142.4 404.8 260 332 332ZM315.2 87.2C252 24 150.4 24 88.0001 87.2C24.8001 150.4 24.8001 252 88.0001 314.4C151.2 377.6 252.8 377.6 315.2 314.4C377.6 252 377.6 150.4 315.2 87.2Z" fill="#DFE9EF" />
      <path d="M319.2 319.2C254.4 384 148.8 384 83.2001 319.2C18.4001 254.4 18.4001 148.8 83.2001 83.2C148 18.4 253.6 18.4 319.2 83.2C384 148.8 384 254.4 319.2 319.2ZM310.4 92C250.4 32 152 32 92.0001 92C32.0001 152 32.0001 250.4 92.0001 310.4C152 370.4 250.4 370.4 310.4 310.4C370.4 250.4 370.4 152 310.4 92Z" fill="#7A858C" />
      <path d="M484.104 428.784L373.8 318.472L318.36 373.912L428.672 484.216L484.104 428.784Z" fill="#333333" />
      <path d="M471.664 441.224L361.344 330.928L330.8 361.48L441.12 471.76L471.664 441.224Z" fill="#575B5E" />
      <path d="M495.2 423.2C504 432 432.8 504 423.2 495.2L417.6 489.6C408.8 480.8 480 408.8 489.6 417.6L495.2 423.2Z" fill="#B0BDC6" />
      <path d="M483.2 435.2C492 444 444.8 492 435.2 483.2L429.6 477.6C420.8 468.8 468 420.8 477.6 429.6L483.2 435.2Z" fill="#DFE9EF" />
    </svg>
  );
}
