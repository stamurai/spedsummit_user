import React from "react";
import { motion } from "framer-motion";
import { useScrollAnimation, fadeUp, stagger } from "../hooks/useScrollAnimation";

const C = {
  text:   "#2B2E33",
  muted:  "#5D636F",
  border: "#e5e7eb",
  bgCard: "#ffffff",
};

const CARD_WIDTH = 320;

const TESTIMONIALS = [
  {
    text: "This is, by far, the best presentation of the summit. It kept my attention the whole time.",
    name: "April Moss",
    role: "SPED Educator",
  },
  {
    text: "The session was highly informative and practical. The speaker presented evidence-based, neurodiversity-affirming strategies that were clearly explained and directly applicable to educational and therapeutic settings.",
    name: "Auhen Cleo Faith Cezar",
    role: "SPED Educator",
  },
  {
    text: "The discussion reminded us that we cannot give our best to our students if we do not take care of ourselves first. It highlighted the value of setting healthy boundaries and preventing burnout.",
    name: "Erwin G. Bajao",
    role: "SPED Educator",
  },
  {
    text: "Thank you for clarifying the meaning and function of echolalia. The discussion deepened my understanding of echolalia as a communicative behavior rather than merely repetitive speech. I intend to apply the strategies presented in my own teaching practice.",
    name: "Jea Cyrill Cabigao",
    role: "SPED Educator",
  },
  {
    text: "The mindfulness-based strategies and real classroom applications were especially helpful. Thank you for prioritizing both student and teacher wellness.",
    name: "Auhen Cleo Faith Cezar",
    role: "SPED Educator",
  },
  {
    text: "The session was valuable and inspiring, and it effectively supported professional growth in SPED practices.",
    name: "Jonal P. Panes",
    role: "SPED Educator",
  },
  {
    text: "The speaker was engaging, knowledgeable, and provided practical strategies that can be applied directly in SPED settings.",
    name: "Rizza S. Ceballo",
    role: "SPED Educator",
  },
  {
    text: "AbleSpace is a very useful tool to help me with IEP goals and assessments. It will be very helpful for creating and modifying plans according to the needs and skills of my students.",
    name: "Samantha Jane S. Zumel",
    role: "SPED Educator",
  },
  {
    text: "The session was highly informative and practical. The speaker presented evidence-based, neurodiversity-affirming strategies that were clearly explained and directly applicable to educational and therapeutic settings.",
    name: "Auhen Cleo Faith Cezar",
    role: "SPED Educator",
  },
];

const firstColumn  = TESTIMONIALS.slice(0, 3);
const secondColumn = TESTIMONIALS.slice(3, 6);
const thirdColumn  = TESTIMONIALS.slice(6, 9);

function TestimonialsColumn({ testimonials, duration = 10 }) {
  return (
    <div style={{ width: CARD_WIDTH, flexShrink: 0, overflow: "hidden" }}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: 20 }}
      >
        {[0, 1].map((_, idx) => (
          <React.Fragment key={idx}>
            {testimonials.map(({ text, image, name, role }, i) => (
              <div
                key={i}
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  borderRadius: 20,
                  padding: "24px",
                  width: CARD_WIDTH,
                  boxSizing: "border-box",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  flexShrink: 0,
                }}
              >
                <p style={{ margin: 0, fontSize: 14, color: "#5D636F", lineHeight: 1.7 }}>
                  "{text}"
                </p>
                <div style={{ marginTop: 18 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text, lineHeight: 1.3 }}>— {name}</div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}

export function TestimonialsResponsive() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section style={{ background: "transparent", padding: "80px 32px 48px" }}>
      <style>{`
        .t-col-2 { display: none; }
        .t-col-3 { display: none; }
        @media (min-width: 768px)  { .t-col-2 { display: block; } }
        @media (min-width: 1100px) { .t-col-3 { display: block; } }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          ref={ref}
          variants={stagger(0.1)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <motion.div
            variants={fadeUp}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#fffbeb", border: "1px solid rgba(245,158,11,0.25)",
              borderRadius: 999, padding: "5px 16px", fontSize: 12, fontWeight: 700,
              color: "#92400e", marginBottom: 24, textTransform: "uppercase", letterSpacing: 1,
            }}
          >
            Testimonials
          </motion.div>
          <motion.h2
            variants={fadeUp}
            style={{ margin: "0 0 16px", fontSize: "clamp(32px,4vw,52px)", fontWeight: 900, color: C.text, letterSpacing: -1.8, lineHeight: 1.08 }}
          >
            What educators are saying
          </motion.h2>
          <motion.p
            variants={fadeUp}
            style={{ margin: 0, fontSize: 17, color: C.muted, maxWidth: 480, marginInline: "auto" }}
          >
            Real feedback from SPED educators who completed the summit.
          </motion.p>
        </motion.div>

        {/* Columns */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            maxHeight: 740,
            overflow: "hidden",
            maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          }}
        >
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <div className="t-col-2">
            <TestimonialsColumn testimonials={secondColumn} duration={19} />
          </div>
          <div className="t-col-3">
            <TestimonialsColumn testimonials={thirdColumn} duration={17} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsResponsive;
