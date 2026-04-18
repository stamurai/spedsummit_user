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
    text: "The IEP session alone was worth it. I walked away with three new strategies I used that same week. The certificate was ready instantly — no chasing required.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Sarah M.",
    role: "Resource Room Teacher, TX",
  },
  {
    text: "I've paid hundreds for PD that wasn't as good as this. The AAC module was incredibly practical and the quizzes really locked in the learning.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "James K.",
    role: "Inclusion Specialist, NY",
  },
  {
    text: "Recommended it to my entire department. Free, self-paced, and the quality rivals anything I've seen on paid platforms.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Priya D.",
    role: "Special Ed Coordinator, CA",
  },
  {
    text: "The mindfulness session shifted how I approach dysregulation in the classroom. Really well-presented, even after a long day.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "Tom R.",
    role: "Behavior Interventionist, FL",
  },
  {
    text: "I was nervous about the quiz format but they're fair — multiple attempts allowed and instant feedback. I felt genuinely proud of my scores.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Lisa H.",
    role: "SPED Paraprofessional, OH",
  },
  {
    text: "The Ablespace giveaway was a bonus, but honestly the content itself kept me coming back. Nine sessions was the perfect amount.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Deb A.",
    role: "Elementary SPED Teacher, WA",
  },
  {
    text: "Every instructor had real classroom experience — not just theory. The behavior intervention session was immediately applicable.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "Marcus T.",
    role: "Behavioral Support Specialist, IL",
  },
  {
    text: "Sharing my certificate on LinkedIn got more engagement than anything I've posted. Colleagues started asking where to sign up.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Aisha N.",
    role: "Special Ed Department Head, GA",
  },
  {
    text: "Finally, PD that doesn't feel like a checkbox. I replayed two sessions because the content was that good. Completely free is wild.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Carlos B.",
    role: "Transition Planning Specialist, AZ",
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
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18 }}>
                  <img
                    src={image}
                    alt={name}
                    style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text, lineHeight: 1.3 }}>{name}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2, lineHeight: 1.3 }}>{role}</div>
                  </div>
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
            style={{ margin: "0 0 16px", fontSize: "clamp(32px,4vw,52px)", fontWeight: 900, color: C.text, letterSpacing: -1.5, lineHeight: 1.1 }}
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
