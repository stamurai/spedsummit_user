import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  VideoCamera,
  Certificate,
  Play,
  CheckCircle,
  DownloadSimple,
  ShareNetwork,
  Check,
  ArrowRight,
  SealCheck,
} from '@phosphor-icons/react';

const SESSIONS = [
  { id: 1, title: 'Mindfulness for SPED Educators',   instructor: 'Tara Roehl',      duration: '52 min', thumb: 'photo-1503676260728-1c00da094a0b', quiz: { q: 'Which technique best supports educator well-being under high stress?', options: ['Scheduled mindfulness breaks', 'Skipping lunch', 'Working longer hours', 'Avoiding colleagues'], answer: 0 } },
  { id: 2, title: 'AAC Strategies in the Classroom',   instructor: 'Dr. Maya Chen',   duration: '48 min', thumb: 'photo-1588072432836-e10032774350', quiz: { q: 'What does AAC stand for?', options: ['Augmentative and Alternative Communication', 'Advanced Academic Curriculum', 'Automated Assistance Coordinator', 'Applied Academic Concepts'], answer: 0 } },
  { id: 3, title: 'IEP Writing Best Practices',        instructor: 'James Okafor',    duration: '61 min', thumb: 'photo-1509062522246-3755977927d7', quiz: { q: 'Which component is required in every IEP?', options: ['Present levels of performance', 'Grade point average', 'Standardized test scores only', 'Teacher preferences'], answer: 0 } },
  { id: 4, title: 'Behavior Intervention Planning',    instructor: 'Lisa Torres',     duration: '55 min', thumb: 'photo-1522202176988-66273c2fd55f', quiz: { q: 'A BIP should be based on results from a:', options: ['Functional Behavior Assessment', 'Reading level test', 'Parent interview only', 'Random observation'], answer: 0 } },
  { id: 5, title: 'Inclusive Classroom Strategies',   instructor: 'Dr. Priya Shah',  duration: '44 min', thumb: 'photo-1485827404703-89b55fcc595e', quiz: { q: 'Universal Design for Learning (UDL) focuses on:', options: ['Flexible means of engagement', 'Single teaching method', 'Separating students by ability', 'Standardized testing'], answer: 0 } },
  { id: 6, title: 'Sensory Processing & Support',     instructor: 'Tom Walsh',       duration: '39 min', thumb: 'photo-1544027993-37dbfe43562a', quiz: { q: 'Sensory processing differences are most commonly associated with:', options: ['Autism Spectrum Disorder', 'Low academic performance', 'Poor behavior choices', 'Hearing loss'], answer: 0 } },
  { id: 7, title: 'Parent & Family Collaboration',    instructor: 'Angela Reed',     duration: '46 min', thumb: 'photo-1573496359142-b8d87734a5a2', quiz: { q: 'Effective parent collaboration in SPED requires:', options: ['Two-way communication', 'One-way information sharing', 'Formal meetings only', 'Written reports only'], answer: 0 } },
  { id: 8, title: 'Transition Planning for Students', instructor: 'Marcus Bell',     duration: '58 min', thumb: 'photo-1531746020798-e6953c6e8e04', quiz: { q: 'Transition planning in IEPs must begin by age:', options: ['16', '18', '21', '14'], answer: 0 } },
  { id: 9, title: 'Self-Care for SPED Professionals', instructor: 'Dr. Aisha Grant', duration: '35 min', thumb: 'photo-1580489944761-15a19d654956', quiz: { q: 'Which is a recognized self-care practice for educators?', options: ['Setting professional boundaries', 'Ignoring personal needs', 'Working through illness', 'Avoiding professional development'], answer: 0 } },
];

export default function LearningDemo() {
  const [activeId,     setActiveId]     = useState(1);
  const [quizActive,   setQuizActive]   = useState({});
  const [chosen,       setChosen]       = useState({});
  const [submitted,    setSubmitted]    = useState({});
  const [completedIds, setCompletedIds] = useState(new Set());

  const s         = SESSIONS.find(x => x.id === activeId);
  const isDone    = completedIds.has(activeId);
  const isQuiz    = !!quizActive[activeId];
  const pick      = chosen[activeId] ?? null;
  const isSub     = !!submitted[activeId];
  const isCorrect = isSub && pick === s.quiz.answer;
  const doneCount = completedIds.size;

  // Certificate to show = active session if done, else first completed
  const certSession = isDone ? s : SESSIONS.find(x => completedIds.has(x.id));

  function markComplete() {
    if (isDone || isQuiz) return;
    setQuizActive(p => ({ ...p, [activeId]: true }));
  }
  function selectOpt(i) {
    if (isSub) return;
    setChosen(p => ({ ...p, [activeId]: i }));
  }
  function submitAnswer() {
    if (pick === null) return;
    setSubmitted(p => ({ ...p, [activeId]: true }));
  }
  function completeSession() {
    setCompletedIds(p => new Set([...p, activeId]));
    setQuizActive(p => ({ ...p, [activeId]: false }));
  }

  const steps = SESSIONS.map(x => ({ id: x.id, done: completedIds.has(x.id) }));

  return (
    <section id="features-v2" style={{ background: '#ffffff', padding: '80px 32px 120px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ display: 'inline-block', background: '#fffbeb', color: '#92400e', fontWeight: 700, fontSize: 12, letterSpacing: 1, padding: '5px 16px', borderRadius: 999, marginBottom: 20, textTransform: 'uppercase', border: '1px solid rgba(245,158,11,0.25)' }}>
            Interactive Learning
          </span>
          <h2 style={{ fontSize: 'clamp(32px,4vw,52px)', fontWeight: 900, color: '#262626', letterSpacing: '-1.5px', margin: '0 0 16px', lineHeight: 1.1 }}>
            Learn, Quiz, Certify.
          </h2>
          <p style={{ fontSize: 17, color: '#6b7280', margin: '0 auto', maxWidth: 500 }}>
            Watch sessions, pass the quiz, download your certificate — all in one place.
          </p>
        </div>

        {/* ── Bento card + Stats ── */}
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'flex-start', gap: 20 }}>

        {/* Stats panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 148, flexShrink: 0, paddingTop: 12 }}>
          {[
            { value: `${doneCount * 47 + 12}`, label: 'total minutes', sub: 'of PD completed' },
            { value: `${doneCount} of 9`, label: 'sessions', sub: 'completed' },
            { value: `${Math.min(doneCount + 1, 7)} day`, label: 'streak', sub: 'keep it up!' },
          ].map(({ value, label, sub }) => (
            <div key={label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#262626', lineHeight: 1.1, letterSpacing: '-0.5px' }}>{value}</p>
              <p style={{ margin: '2px 0 0', fontSize: 11, fontWeight: 600, color: '#374151' }}>{label}</p>
              <p style={{ margin: '1px 0 0', fontSize: 10, color: '#9ca3af' }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Outer wrapper has padding-bottom + right to reveal the stacked bg safely */}
        <div style={{ flex: 1, paddingBottom: 12, paddingRight: 12 }}>
          <div style={{ position: 'relative' }}>

            {/* Stacked bg layer — contained within padding */}
            <div style={{ position: 'absolute', top: 12, left: 18, right: -10, bottom: -10, background: '#f3f4f6', borderRadius: 28, border: '1px solid #e5e7eb' }} />

            {/* Main card */}
            <div style={{ position: 'relative', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 28, overflow: 'hidden', boxShadow: '0 6px 32px rgba(0,0,0,0.08)' }}>

              {/* Card header text */}
              <div style={{ padding: '22px 26px 0' }}>
                <p style={{ margin: '0 0 3px', fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>SPED Summit 2026</p>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#262626', lineHeight: 1.4 }}>
                  Watch, quiz, and earn your certificate at your own pace.
                </p>
              </div>

              {/* ── Fake browser window ── */}
              <div style={{ position: 'relative', margin: '18px 0 0', height: 430 }}>

                {/* Offset bg window */}
                <div style={{ position: 'absolute', top: 16, left: 24, right: 0, bottom: 0, background: '#f9fafb', borderRadius: '16px 0 0 0', border: '1px solid #e5e7eb', opacity: 0.5 }} />

                {/* Foreground window */}
                <div style={{ position: 'absolute', top: 4, left: 34, right: 0, bottom: 0, background: '#ffffff', borderRadius: '12px 0 0 0', boxShadow: '-2px -2px 16px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                  {/* Chrome bar */}
                  <div style={{ height: 32, borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', padding: '0 14px', position: 'relative', background: '#fafafa', flexShrink: 0 }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#e5e7eb' }} />)}
                    </div>
                    <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: '#9ca3af', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                      Learning Platform
                    </div>
                  </div>

                  {/* ── 3-column body ── */}
                  <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                    {/* ── COL 1: Session list sidebar ── */}
                    <div style={{ width: 146, borderRight: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', background: '#fafafa', flexShrink: 0, overflow: 'hidden' }}>

                      {/* Tab header */}
                      <div style={{ padding: '8px 8px 5px', borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
                        <LayoutGroup id="tabs">
                          {[
                            { id: 'sessions',     label: 'Sessions',     Icon: VideoCamera },
                            { id: 'certificates', label: 'Certificates', Icon: Certificate, badge: doneCount || null },
                          ].map(({ id, label, Icon, badge }) => {
                            // We only use these for visual tab styling; clicking sessions goes to session, certs shows cert panel
                            const active = id === 'sessions' ? !isDone && true : isDone; // simplification — always show both tabs
                            // Actually let's just use a simple activeTab state for tabs
                            return null; // handled below
                          })}
                        </LayoutGroup>

                        {/* Simple tab display — Sessions always active, Certificates badge */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', borderRadius: 7, background: '#f3f4f6', border: '1px solid #e5e7eb' }}>
                            <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 2, height: 12, borderRadius: 999, background: '#f59e0b' }} />
                            <VideoCamera size={12} weight="fill" color="#262626" />
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#262626' }}>Sessions</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', borderRadius: 7 }}>
                            <Certificate size={12} weight="regular" color="#9ca3af" />
                            <span style={{ fontSize: 10, fontWeight: 500, color: '#9ca3af', flex: 1 }}>Certificates</span>
                            {doneCount > 0 && (
                              <span style={{ fontSize: 8, fontWeight: 700, background: '#f59e0b', color: '#000', borderRadius: 999, padding: '1px 5px', lineHeight: '14px' }}>{doneCount}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Session number list — no scroll */}
                      <div style={{ flex: 1, padding: '5px 6px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        {SESSIONS.map(x => {
                          const done   = completedIds.has(x.id);
                          const active = x.id === activeId;
                          return (
                            <button key={x.id} onClick={() => setActiveId(x.id)}
                              style={{ display: 'flex', alignItems: 'center', gap: 7, width: '100%', padding: '4px 8px', borderRadius: 6, border: 'none', background: active ? '#fffbeb' : 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', flex: 1, borderLeft: active ? '2px solid #f59e0b' : '2px solid transparent', transition: 'background 0.12s', minHeight: 0 }}
                            >
                              {done
                                ? <CheckCircle size={11} weight="fill" color="#16a34a" style={{ flexShrink: 0 }} />
                                : <span style={{ width: 13, height: 13, borderRadius: '50%', border: `1.5px solid ${active ? '#f59e0b' : '#d1d5db'}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 700, color: active ? '#f59e0b' : '#9ca3af', flexShrink: 0 }}>{x.id}</span>
                              }
                              <span style={{ fontSize: 9.5, fontWeight: active ? 700 : 400, color: active ? '#262626' : '#6b7280', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                {x.title}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* ── COL 2: Video / Quiz ── */}
                    <div style={{ flex: 1, borderRight: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                      {/* Sub-header */}
                      <div style={{ padding: '8px 12px 6px', borderBottom: '1px solid #f3f4f6', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#262626', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{s.title}</p>
                          <p style={{ margin: 0, fontSize: 8.5, color: '#9ca3af' }}>{s.instructor} · {s.duration}</p>
                        </div>
                        {!isDone && !isQuiz && (
                          <button onClick={markComplete}
                            style={{ flexShrink: 0, height: 22, padding: '0 9px', background: '#f59e0b', color: '#000', border: 'none', borderRadius: 5, fontSize: 8.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#d97706'}
                            onMouseLeave={e => e.currentTarget.style.background = '#f59e0b'}
                          >
                            Mark as Complete
                          </button>
                        )}
                        {isDone && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 8.5, color: '#16a34a', fontWeight: 700, flexShrink: 0 }}>
                            <CheckCircle size={11} weight="fill" /> Done
                          </div>
                        )}
                      </div>

                      {/* Progress strip */}
                      <div style={{ display: 'flex', gap: 2, padding: '6px 12px 0', flexShrink: 0 }}>
                        {steps.map(st => (
                          <div key={st.id} style={{ flex: 1, height: 2.5, borderRadius: 999, background: st.done ? '#f59e0b' : st.id === activeId ? '#fde68a' : '#f3f4f6', transition: 'background 0.3s' }} />
                        ))}
                      </div>

                      {/* Video OR Quiz — animated swap */}
                      <div style={{ flex: 1, padding: '8px 12px 10px', overflow: 'hidden' }}>
                        <AnimatePresence mode="wait" initial={false}>

                          {/* VIDEO */}
                          {!isQuiz && (
                            <motion.div key="video"
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                              transition={{ duration: 0.18 }}
                              style={{ height: '100%', position: 'relative', borderRadius: 10, overflow: 'hidden', background: '#0f0f0f' }}
                            >
                              <img
                                src={`https://images.unsplash.com/${s.thumb}?auto=format&fit=crop&w=700&q=80`}
                                alt={s.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isDone ? 0.4 : 0.72 }}
                              />
                              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {isDone ? (
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.4)', width: '100%', height: '100%', justifyContent: 'center' }}>
                                    <CheckCircle size={32} weight="fill" color="#4ade80" />
                                    <span style={{ fontSize: 10, color: '#fff', fontWeight: 700 }}>Completed</span>
                                  </div>
                                ) : (
                                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 14px rgba(245,158,11,0.55)' }}>
                                    <Play size={17} weight="fill" color="#000" />
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}

                          {/* QUIZ — replaces video */}
                          {isQuiz && (
                            <motion.div key="quiz"
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                              transition={{ duration: 0.18 }}
                              style={{ height: '100%', background: '#fafafa', borderRadius: 10, border: '1px solid #f3f4f6', padding: '12px 12px 10px', display: 'flex', flexDirection: 'column' }}
                            >
                              <p style={{ margin: '0 0 9px', fontSize: 11, fontWeight: 700, color: '#262626', lineHeight: 1.5 }}>
                                {s.quiz.q}
                              </p>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
                                {s.quiz.options.map((opt, idx) => {
                                  const sel = pick === idx;
                                  return (
                                    <button key={idx} onClick={() => selectOpt(idx)} disabled={isSub}
                                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 9px', borderRadius: 7, border: `1.5px solid ${sel ? '#f59e0b' : '#e5e7eb'}`, background: sel ? '#fef3c7' : '#fff', cursor: isSub ? 'default' : 'pointer', fontFamily: 'inherit', fontSize: 10, color: '#262626', textAlign: 'left', fontWeight: sel ? 600 : 400, transition: 'border-color 0.12s, background 0.12s' }}
                                      onMouseEnter={e => { if (!isSub && !sel) e.currentTarget.style.borderColor = '#f59e0b'; }}
                                      onMouseLeave={e => { if (!isSub && !sel) e.currentTarget.style.borderColor = '#e5e7eb'; }}
                                    >
                                      <span style={{ width: 13, height: 13, borderRadius: '50%', border: `1.5px solid ${sel ? '#f59e0b' : '#d1d5db'}`, background: sel ? '#f59e0b' : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.12s' }}>
                                        {sel && <Check size={7} weight="bold" color="#000" />}
                                      </span>
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>
                              <div style={{ marginTop: 8, flexShrink: 0 }}>
                                {!isSub ? (
                                  <button onClick={submitAnswer} disabled={pick === null}
                                    style={{ width: '100%', height: 26, background: pick === null ? '#f3f4f6' : '#f59e0b', color: pick === null ? '#9ca3af' : '#000', border: 'none', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: pick === null ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'background 0.12s' }}
                                  >
                                    Submit Answer
                                  </button>
                                ) : (
                                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.16 }}>
                                    <div style={{ padding: '6px 9px', borderRadius: 6, background: isCorrect ? '#f0fdf4' : '#fff7ed', border: `1px solid ${isCorrect ? '#bbf7d0' : '#fed7aa'}`, fontSize: 9.5, color: isCorrect ? '#15803d' : '#c2410c', fontWeight: 600, marginBottom: 6 }}>
                                      {isCorrect ? '✓ Correct! Well done.' : `Answer: "${s.quiz.options[s.quiz.answer]}"`}
                                    </div>
                                    <button onClick={completeSession}
                                      style={{ width: '100%', height: 26, background: '#f59e0b', color: '#000', border: 'none', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                                    >
                                      Complete Session <ArrowRight size={10} weight="bold" />
                                    </button>
                                  </motion.div>
                                )}
                              </div>
                            </motion.div>
                          )}

                        </AnimatePresence>
                      </div>
                    </div>

                    {/* ── COL 3: Certificate ── */}
                    <div style={{ width: 210, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#fafafa' }}>

                      <div style={{ padding: '8px 10px 5px', borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
                        <p style={{ margin: 0, fontSize: 9, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.8 }}>Certificate</p>
                      </div>

                      <div style={{ flex: 1, padding: '10px 10px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        {!certSession ? (
                          /* Empty state */
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            <SealCheck size={32} weight="thin" color="#d1d5db" />
                            <p style={{ fontSize: 9.5, color: '#9ca3af', fontWeight: 500, margin: 0, textAlign: 'center', lineHeight: 1.5 }}>
                              Complete a session to earn your certificate.
                            </p>
                          </div>
                        ) : (
                          /* Certificate card */
                          <AnimatePresence mode="wait">
                            <motion.div key={certSession.id}
                              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                              style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 12px', background: '#fff', display: 'flex', flexDirection: 'column' }}
                            >
                              {/* Seal + label */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#fffbeb', border: '1.5px solid rgba(245,158,11,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <SealCheck size={16} weight="fill" color="#f59e0b" />
                                </div>
                                <div>
                                  <p style={{ margin: 0, fontSize: 7.5, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: 0.8 }}>Certificate of Completion</p>
                                  <p style={{ margin: 0, fontSize: 8.5, color: '#9ca3af' }}>SPED Summit 2026</p>
                                </div>
                              </div>

                              <div style={{ height: 1, background: '#f3f4f6', marginBottom: 10 }} />

                              <p style={{ margin: '0 0 3px', fontSize: 8, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.7 }}>This certifies that</p>
                              <p style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 800, color: '#262626', lineHeight: 1.2 }}>Sarah Johnson</p>

                              <p style={{ margin: '0 0 3px', fontSize: 8, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.7 }}>has completed</p>
                              <p style={{ margin: '0 0 12px', fontSize: 10, fontWeight: 700, color: '#374151', lineHeight: 1.4 }}>{certSession.title}</p>

                              <div style={{ display: 'flex', gap: 12, marginBottom: 'auto' }}>
                                <div>
                                  <p style={{ margin: '0 0 2px', fontSize: 7.5, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.7 }}>Date</p>
                                  <p style={{ margin: 0, fontSize: 9, fontWeight: 600, color: '#374151' }}>Jan 2026</p>
                                </div>
                                <div>
                                  <p style={{ margin: '0 0 2px', fontSize: 7.5, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.7 }}>Completed</p>
                                  <p style={{ margin: 0, fontSize: 9, fontWeight: 600, color: '#374151' }}>{doneCount} of 9</p>
                                </div>
                              </div>

                              {/* Actions */}
                              <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <button style={{ width: '100%', height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 9.5, fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>
                                  <DownloadSimple size={11} weight="bold" /> Download PDF
                                </button>
                                <button style={{ width: '100%', height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, background: '#fffbeb', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 6, fontSize: 9.5, fontWeight: 600, color: '#92400e', cursor: 'pointer', fontFamily: 'inherit' }}>
                                  <ShareNetwork size={11} weight="bold" /> Share
                                </button>
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        </div>{/* end flex row */}

      </div>
    </section>
  );
}
