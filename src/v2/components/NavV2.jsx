import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

/* ── Avatar initials helper ─────────────────────────────────────────────────── */
function getInitials(name = '') {
  const parts = name.trim().split(' ');
  return parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0]?.[0] ?? '?');
}

/* ── ProfileMenu ─────────────────────────────────────────────────────────────── */
function ProfileMenu({ isAdmin, userName, onGoToDashboard }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const items = isAdmin
    ? [{ label: 'Admin Dashboard', icon: '⚡' }]
    : [{ label: 'My Learning', icon: '🎓' }];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #f59e0b', background: '#1a0a24', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', transition: 'box-shadow 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.3)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
        {getInitials(userName)}
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 8px 28px rgba(0,0,0,0.12)', minWidth: 180, zIndex: 200, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{userName}</div>
            <div style={{ fontSize: 12, color: '#707685', marginTop: 2 }}>{isAdmin ? 'Admin' : 'Learner'}</div>
          </div>
          {items.map(item => (
            <button key={item.label} onClick={() => { setOpen(false); onGoToDashboard?.(); }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#111827', textAlign: 'left', transition: 'background 0.12s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── useScrollThreshold ─────────────────────────────────────────────────────── */
function useScrollThreshold(threshold = 10) {
  const [scrolled, setScrolled] = useState(false);
  const onScroll = useCallback(() => setScrolled(window.scrollY > threshold), [threshold]);
  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);
  return scrolled;
}

/* ── MenuToggleIcon ─────────────────────────────────────────────────────────── */
function MenuToggleIcon({ open, size = 18, duration = 300 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor"
      strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: `transform ${duration}ms ease-in-out`, transform: open ? 'rotate(-45deg)' : 'rotate(0deg)' }}
    >
      <path
        d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
        style={{ transition: `stroke-dasharray ${duration}ms ease-in-out, stroke-dashoffset ${duration}ms ease-in-out`, strokeDasharray: open ? '20 300' : '12 63', strokeDashoffset: open ? '-32.42px' : '0' }}
      />
      <path d="M7 16 27 16" />
    </svg>
  );
}

/* ── Nav links ──────────────────────────────────────────────────────────────── */
const LINKS = [
  { label: 'Sessions', href: '#features-v2'    },
  { label: 'Speakers', href: '#instructors-v2' },
  { label: 'FAQ',      href: '#faq-v2'         },
];

/* ── NavV2 ──────────────────────────────────────────────────────────────────── */
export default function NavV2({ onGetStarted, isLoggedIn, isAdmin, userName, onGoToDashboard }) {
  const [open, setOpen] = useState(false);
  const scrolled = useScrollThreshold(10);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e) => { if (e.matches) setOpen(false); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        borderBottom: scrolled ? '1px solid #e5e7eb' : '1px solid transparent',
        background: scrolled || open ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled || open ? 'blur(12px)' : 'none',
        transition: 'background 0.2s, border-color 0.2s, backdrop-filter 0.2s',
      }}>
        <nav style={{ maxWidth: 1100, margin: '0 auto', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>

          {/* Logo */}
          <div style={{ cursor: 'pointer', borderRadius: 8, padding: '6px 8px', transition: 'background 0.15s' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <img src="/Container.png" alt="SPED Summit" style={{ height: 26, display: 'block' }} />
          </div>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="v2-nav-desktop">
            {LINKS.map(({ label, href }) => (
              <a key={label} href={href}
                style={{ fontSize: 14, color: '#5D636F', fontWeight: 500, padding: '6px 14px', borderRadius: 8, textDecoration: 'none', transition: 'color 0.15s, background 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#2B2E33'; e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#5D636F'; e.currentTarget.style.background = 'transparent'; }}
              >{label}</a>
            ))}
            {isLoggedIn
              ? <button onClick={onGoToDashboard}
                  style={{ marginLeft: 8, padding: '7px 18px', fontSize: 14, fontWeight: 700, background: '#f59e0b', color: '#000', border: 'none', borderRadius: 10, cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#d97706'}
                  onMouseLeave={e => e.currentTarget.style.background = '#f59e0b'}
                >My Dashboard</button>
              : <button onClick={onGetStarted}
                  style={{ marginLeft: 8, padding: '7px 18px', fontSize: 14, fontWeight: 700, background: '#f59e0b', color: '#000', border: 'none', borderRadius: 10, cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#d97706'}
                  onMouseLeave={e => e.currentTarget.style.background = '#f59e0b'}
                >Get started free</button>
            }
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(o => !o)} className="v2-nav-hamburger" aria-label="Toggle menu"
            style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8, border: '1px solid #e5e7eb', background: '#ffffff', cursor: 'pointer', color: '#2B2E33' }}>
            <MenuToggleIcon open={open} />
          </button>
        </nav>

        <style>{`
          @media (min-width: 768px) { .v2-nav-hamburger { display: none !important; } .v2-nav-desktop { display: flex !important; } }
          @media (max-width: 767px) { .v2-nav-hamburger { display: flex !important; } .v2-nav-desktop { display: none !important; } }
        `}</style>
      </header>

      {/* Mobile menu portal */}
      {open && createPortal(
        <div style={{ position: 'fixed', top: 56, left: 0, right: 0, bottom: 0, zIndex: 99, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderTop: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', padding: '16px 24px 32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
            {LINKS.map(({ label, href }) => (
              <a key={label} href={href} onClick={() => setOpen(false)}
                style={{ fontSize: 16, color: '#2B2E33', fontWeight: 600, padding: '12px 16px', borderRadius: 10, textDecoration: 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >{label}</a>
            ))}
          </div>
          {isLoggedIn
            ? <button onClick={() => { setOpen(false); onGoToDashboard?.(); }}
                style={{ width: '100%', padding: '14px', fontSize: 15, fontWeight: 800, background: '#f59e0b', color: '#000', border: 'none', borderRadius: 12, cursor: 'pointer' }}>
                My Dashboard →
              </button>
            : <button onClick={() => { setOpen(false); onGetStarted?.(); }}
                style={{ width: '100%', padding: '14px', fontSize: 15, fontWeight: 800, background: '#f59e0b', color: '#000', border: 'none', borderRadius: 12, cursor: 'pointer' }}>
                Get started free
              </button>
          }
        </div>,
        document.body
      )}
    </>
  );
}
