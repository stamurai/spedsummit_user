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
    q: 'Is SPED Summit completely free?',
    a: 'Yes! SPED Summit is completely free to attend. Registered attendees can access all summit sessions during the event and earn free PD certificates by completing the required assessments.\n\nA Plus Plan also includes access to PD certificates from previous years\' SPED Summit sessions, along with premium content, extended access to recordings, and additional resources.',
  },
  {
    q: 'Can I rewatch if I am unable to attend live?',
    a: 'Absolutely! All summit sessions remain available to watch on-demand throughout the event period, so you can learn at a time that works best for you.\n\nIf you\'d like extended access beyond the summit dates, a Plus Plan includes access to session recordings after the event concludes.',
  },
  {
    q: 'How will I get the Completion Certificate?',
    a: 'After completing a session and successfully passing the accompanying assessment, your PD certificate will be available directly within your SPED Summit account.\n\nPlus Plan members can also access certificates from eligible sessions in previous years\' SPED Summit libraries.',
  },
  {
    q: 'Can I retake quizzes if I don\'t pass?',
    a: 'Yes! If you don\'t pass an assessment on your first attempt, you can retake it. Our goal is to support your learning and help you successfully earn your PD certificate.',
  },
  {
    q: 'What topics are covered at SPED Summit?',
    a: 'SPED Summit features expert-led sessions on a wide range of special education topics, including autism support, AAC and communication, IEP development, data collection, literacy and dyslexia, executive functioning, emotional regulation, inclusion, behavior support, student independence, family collaboration, transition planning, and much more.',
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
            <div style={{ padding: '0 24px 22px', fontSize: 15, color: '#5D636F', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
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
