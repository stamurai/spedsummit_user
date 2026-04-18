import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation, fadeUp, stagger } from '../hooks/useScrollAnimation';

const C = {
  text:   '#2B2E33',
  muted:  '#5D636F',
  border: '#e5e7eb',
  bgCard: '#ffffff',
};

const FAQS = [
  {
    q: 'Is SPED Summit really free?',
    a: 'Yes, 100% free. No credit card, no trial period, no hidden fees. We partnered with Ablespace to make high-quality SPED professional development accessible to every educator.',
  },
  {
    q: 'How do I earn my certificate?',
    a: 'Complete all 9 sessions and pass the knowledge check at the end of each one. Your personalized PDF certificate is automatically generated and ready to download — no manual requests needed.',
  },
  {
    q: 'Can I watch the sessions at my own pace?',
    a: 'Absolutely. All sessions are available on-demand and you can replay them as many times as you like throughout January 2026. There are no deadlines within that window.',
  },
  {
    q: 'What topics do the sessions cover?',
    a: 'The 9 sessions cover: mindfulness for SPED educators, AAC (Augmentative and Alternative Communication), IEP writing, behavior intervention, inclusive classroom strategies, sensory processing, parent collaboration, transition planning, and self-care for educators.',
  },
  {
    q: 'Who are the instructors?',
    a: 'All sessions are led by certified SPED specialists with real classroom experience — not just academics. Each instructor was selected for their practical, actionable teaching style.',
  },
  {
    q: 'How does the Ablespace Pro giveaway work?',
    a: 'Participants who complete all sessions and assessments are automatically entered into the giveaway for an Ablespace Pro subscription. Winners are selected and notified at the end of January 2026.',
  },
  {
    q: 'Can I share my certificate?',
    a: "Yes! Your certificate is a downloadable PDF with your name, the date, and the session details. It's designed to look great on LinkedIn, in email signatures, or printed for display.",
  },
  {
    q: 'What if I fail a quiz?',
    a: 'No stress — you can retake each knowledge check as many times as you need. The quizzes are designed to help you learn, not to gate your certificate behind arbitrary scores.',
  },
];

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <motion.div
      layout
      style={{
        border: `1px solid ${isOpen ? 'rgba(245,158,11,0.4)' : C.border}`,
        borderRadius: 16,
        overflow: 'hidden',
        background: isOpen ? '#fffbeb' : C.bgCard,
        transition: 'border-color 0.2s, background 0.2s',
      }}
    >
      <button
        onClick={onToggle}
        className="faq-item-btn"
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '22px 24px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 16, textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 600, color: C.text, lineHeight: 1.4 }}>
          {item.q}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
            background: isOpen ? 'rgba(245,158,11,0.2)' : '#f3f4f6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, color: isOpen ? '#d97706' : C.muted,
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          +
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 24px 22px', fontSize: 15, color: '#5D636F', lineHeight: 1.7 }}>
              {item.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQAccordion() {
  const [openIdx, setOpenIdx] = useState(0);
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="faq-v2" className="faq-section" style={{ background: '#ffffff', padding: '48px 32px 120px' }}>
      <style>{`
        @media (max-width: 767px) {
          .faq-section { padding: 40px 16px 64px !important; }
          .faq-item-btn { padding: 16px 16px !important; }
        }
      `}</style>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          ref={ref}
          variants={stagger(0.1)}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <motion.div variants={fadeUp}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fffbeb', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 999, padding: '5px 16px', fontSize: 12, fontWeight: 700, color: '#92400e', marginBottom: 24, textTransform: 'uppercase', letterSpacing: 1 }}>
            FAQ
          </motion.div>
          <motion.h2 variants={fadeUp}
            style={{ margin: '0 0 16px', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 900, color: C.text, letterSpacing: -1.5, lineHeight: 1.1 }}>
            Questions? Answered.
          </motion.h2>
          <motion.p variants={fadeUp}
            style={{ margin: 0, fontSize: 17, color: C.muted }}>
            Everything you need to know before you dive in.
          </motion.p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          variants={stagger(0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          {FAQS.map((item, i) => (
            <motion.div key={i} variants={fadeUp}>
              <FAQItem
                item={item}
                isOpen={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
