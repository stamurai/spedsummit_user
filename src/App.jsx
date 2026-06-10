import React, { useState, useRef, useEffect, useCallback, useReducer } from "react";
import ReactDOM from "react-dom/client";
import { supabase } from "./supabase";
import { Agentation } from "agentation";
import { createPortal } from "react-dom";
import * as PhosphorIcons from "@phosphor-icons/react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import LandingV2 from "./v2/LandingV2";
import * as XLSX from "xlsx";
import { GradientWave } from "./components/GradientWave";
import { motion, useMotionValue, useMotionTemplate, useAnimationFrame, useInView, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   PHOSPHOR ICONS  (inline SVG, consistent 20px/24px strokes)
───────────────────────────────────────────────────────────────────────────── */
const ICON_MAP = {
  envelope: PhosphorIcons.Envelope,
  house: PhosphorIcons.House,
  "play-circle": PhosphorIcons.PlayCircle,
  calendar: PhosphorIcons.CalendarBlank,
  users: PhosphorIcons.Users,
  gift: PhosphorIcons.Gift,
  "magnifying-glass": PhosphorIcons.MagnifyingGlass,
  "squares-four": PhosphorIcons.SquaresFour,
  bell: PhosphorIcons.Bell,
  gear: PhosphorIcons.Gear,
  "user-circle": PhosphorIcons.UserCircle,
  "arrow-left": PhosphorIcons.ArrowLeft,
  "arrow-right": PhosphorIcons.ArrowRight,
  "caret-right": PhosphorIcons.CaretRight,
  "caret-left":  PhosphorIcons.CaretLeft,
  lock: PhosphorIcons.Lock,
  check: PhosphorIcons.Check,
  "check-circle": PhosphorIcons.CheckCircle,
  heart: PhosphorIcons.Heart,
  "heart-straight": PhosphorIcons.HeartStraight,
  "chat-circle": PhosphorIcons.ChatCircle,
  "share-network": PhosphorIcons.ShareNetwork,
  "dots-three-vertical":  PhosphorIcons.DotsThreeVertical,
  "dots-three":           PhosphorIcons.DotsThree,
  "dots-six-vertical":    PhosphorIcons.DotsSixVertical,
  "upload-simple": PhosphorIcons.UploadSimple,
  image: PhosphorIcons.Image,
  video: PhosphorIcons.Video,
  "x-circle": PhosphorIcons.XCircle,
  "warning-circle": PhosphorIcons.WarningCircle,
  info: PhosphorIcons.Info,
  "chart-bar": PhosphorIcons.ChartBar,
  "chart-line": PhosphorIcons.ChartLine,
  "trend-up": PhosphorIcons.TrendUp,
  eye: PhosphorIcons.Eye,
  pencil: PhosphorIcons.PencilSimple,
  trash: PhosphorIcons.Trash,
  flag: PhosphorIcons.Flag,
  bookmark: PhosphorIcons.BookmarkSimple,
  "sign-out": PhosphorIcons.SignOut,
  question: PhosphorIcons.Question,
  plus: PhosphorIcons.Plus,
  x: PhosphorIcons.X,
  fire: PhosphorIcons.Fire,
  star: PhosphorIcons.Star,
  list: PhosphorIcons.List,
  "sort-ascending": PhosphorIcons.SortAscending,
  funnel: PhosphorIcons.Funnel,
  lightning: PhosphorIcons.Lightning,
  medal: PhosphorIcons.Medal,
  spinner: PhosphorIcons.Spinner,
  article: PhosphorIcons.Article,
  student: PhosphorIcons.Student,
  play: PhosphorIcons.Play,
  pause: PhosphorIcons.Pause,
  "speaker-high": PhosphorIcons.SpeakerHigh,
  "arrows-out": PhosphorIcons.ArrowsOut,
  "closed-caption": PhosphorIcons.ClosedCaptioning,
  "skip-forward": PhosphorIcons.SkipForward,
  "number-circle-one": PhosphorIcons.NumberCircleOne,
  timer: PhosphorIcons.Timer,
  "cloud-arrow-up": PhosphorIcons.CloudArrowUp,
  "spinner-gap": PhosphorIcons.SpinnerGap,
  palette: PhosphorIcons.Palette,
  moon: PhosphorIcons.Moon,
  sun: PhosphorIcons.Sun,
  "floppy-disk":        PhosphorIcons.FloppyDisk,
  copy:                 PhosphorIcons.Copy,
  "radio-button":       PhosphorIcons.RadioButton,
  "check-square":       PhosphorIcons.CheckSquare,
  "caret-circle-down":  PhosphorIcons.CaretCircleDown,
  "text-align-left":    PhosphorIcons.TextAlignLeft,
  minus:                PhosphorIcons.Minus,
  "caret-down":         PhosphorIcons.CaretDown,
  "caret-up":           PhosphorIcons.CaretUp,
  "file-pdf":           PhosphorIcons.FilePdf,
  download:             PhosphorIcons.DownloadSimple,
  "paperclip":          PhosphorIcons.Paperclip,
  "certificate":        PhosphorIcons.Certificate,
  "device-mobile":      PhosphorIcons.DeviceMobile,
  "thumbs-up":          PhosphorIcons.ThumbsUp,
  "arrow-clockwise":    PhosphorIcons.ArrowClockwise,
  "chevron-left":       PhosphorIcons.CaretLeft,
  "chevron-right":      PhosphorIcons.CaretRight,
  "toggle-left":        PhosphorIcons.ToggleLeft,
  "toggle-right":       PhosphorIcons.ToggleRight,
  "warning":            PhosphorIcons.Warning,
  "wifi-slash":         PhosphorIcons.WifiSlash,
  "shield-check":       PhosphorIcons.ShieldCheck,
  "paper-plane-tilt":   PhosphorIcons.PaperPlaneTilt,
  "arrow-square-out":   PhosphorIcons.ArrowSquareOut,
  clock:                PhosphorIcons.Clock,
  trophy:               PhosphorIcons.Trophy,
  "chat-circle-dots":   PhosphorIcons.ChatCircleDots,
  megaphone:            PhosphorIcons.Megaphone,
  "book-open":          PhosphorIcons.BookOpen,
  target:               PhosphorIcons.Target,
  "note-pencil":        PhosphorIcons.NotePencil,
  coffee:               PhosphorIcons.Coffee,
  confetti:             PhosphorIcons.Confetti,
  brain:                PhosphorIcons.Brain,
  clipboard:            PhosphorIcons.Clipboard,
  "twitter-logo":       PhosphorIcons.TwitterLogo,
  "linkedin-logo":      PhosphorIcons.LinkedinLogo,
  "youtube-logo":       PhosphorIcons.YoutubeLogo,
  "instagram-logo":     PhosphorIcons.InstagramLogo,
  "facebook-logo":      PhosphorIcons.FacebookLogo,
  globe:                PhosphorIcons.Globe,
  microphone:           PhosphorIcons.Microphone,
};

const Icon = ({ name, size = 20, color = "currentColor", weight, style: s = {} }) => {
  const IconCmp = ICON_MAP[name] || PhosphorIcons.Circle;
  return (
    <IconCmp
      size={size}
      color={color}
      weight={weight || "bold"}
      style={{
        display: "block",
        flexShrink: 0,
        minWidth: size,
        minHeight: size,
        ...s,
      }}
    />
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────────────────────── */

const INSTRUCTOR_SOCIAL_FIELDS = [
  { key:"linkedin",  icon:"linkedin-logo",  color:"#0077B5" },
  { key:"instagram", icon:"instagram-logo", color:"#E1306C" },
  { key:"facebook",  icon:"facebook-logo",  color:"#1877F2" },
  { key:"website",   icon:"globe",          color:"#6490E8" },
  { key:"podcast",   icon:"microphone",     color:"#9333ea" },
];

function InstructorSocialIcons({ instr, T = {} }) {
  const links = INSTRUCTOR_SOCIAL_FIELDS.filter(f => instr?.[f.key]);
  if (!links.length) return null;
  const bg    = T.bg    || "#f3f4f6";
  const bgHov = T.bgHov || "#e5e7eb";
  return (
    <div style={{ display:"flex", gap:8, marginTop:10, flexWrap:"wrap" }}>
      {links.map(({ key, icon, color }) => (
        <a key={key} href={instr[key]} target="_blank" rel="noopener noreferrer"
          style={{ display:"flex", alignItems:"center", justifyContent:"center", width:34, height:34, borderRadius:"50%", background:bg, textDecoration:"none", transition:"background .15s", flexShrink:0 }}
          onMouseEnter={e=>e.currentTarget.style.background=bgHov}
          onMouseLeave={e=>e.currentTarget.style.background=bg}>
          <Icon name={icon} size={18} color={color}/>
        </a>
      ))}
    </div>
  );
}

/* ── Empty state primitives ─────────────────────────────────────────────── */
function Empty({ children, style, fullPage }) {
  if (fullPage) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
      flex:1, minHeight:"100%", padding:"24px", ...style }}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        gap:24, borderRadius:0, border:"none", borderImage:"none", boxSizing:"content-box",
        padding:"64px 32px", textAlign:"center", width:"100%", maxWidth:480 }}>
        {children}
      </div>
    </div>
  );
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      gap:24, borderRadius:12, border:"1.5px dashed var(--c-gray200,#e5e7eb)",
      padding:"48px 24px", textAlign:"center", ...style }}>
      {children}
    </div>
  );
}
function EmptyMedia({ children, variant = "default", color = "#6490E8" }) {
  if (variant === "icon") return (
    <div style={{ width:48, height:48, borderRadius:12, background:`${color}18`,
      display:"flex", alignItems:"center", justifyContent:"center", marginBottom:4 }}>
      {children}
    </div>
  );
  return <div style={{ marginBottom:4 }}>{children}</div>;
}
function EmptyHeader({ children }) {
  return <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, maxWidth:340 }}>{children}</div>;
}
function EmptyTitle({ children }) {
  return <div style={{ fontSize:16, fontWeight:700, color:"var(--c-gray900,#111)", letterSpacing:-.2 }}>{children}</div>;
}
function EmptyDescription({ children }) {
  return <div style={{ fontSize:13, color:"var(--c-gray500,#6b7280)", lineHeight:1.6 }}>{children}</div>;
}
function EmptyContent({ children }) {
  return <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12, width:"100%", maxWidth:320 }}>{children}</div>;
}
/* ── End empty state primitives ─────────────────────────────────────────── */

// Global mutable user name — updated by ProfilePage on save
export const userProfile = { name: "" };

const C = {
  primary: "var(--c-primary)", primaryDark: "var(--c-primaryDark)", primaryLight: "var(--c-primaryLight)", primaryBorder: "var(--c-primaryBorder)",
  success: "var(--c-success)", successLight: "var(--c-successLight)", successBorder: "var(--c-successBorder)",
  warning: "var(--c-warning)", warningLight: "var(--c-warningLight)", warningBorder: "var(--c-warningBorder)",
  error: "var(--c-error)", errorLight: "var(--c-errorLight)", errorBorder: "var(--c-errorBorder)",
  info: "var(--c-info)", infoLight: "var(--c-infoLight)", infoBorder: "var(--c-infoBorder)",
  gray50: "var(--c-gray50)", gray100: "var(--c-gray100)", gray200: "var(--c-gray200)", gray300: "var(--c-gray300)",
  gray400: "var(--c-gray400)", gray500: "var(--c-gray500)", gray600: "var(--c-gray600)", gray700: "var(--c-gray700)",
  gray800: "var(--c-gray800)", gray900: "var(--c-gray900)",
  white: "var(--c-white)",
};

/* ─────────────────────────────────────────────────────────────────────────────
   TOAST SYSTEM
───────────────────────────────────────────────────────────────────────────── */
function useCountdown(targetDate) {
  const [diff, setDiff] = useState(() => targetDate - Date.now());
  useEffect(() => {
    const t = setInterval(() => setDiff(targetDate - Date.now()), 60000);
    return () => clearInterval(t);
  }, [targetDate]);
  if (diff <= 0) return null;
  const totalMins = Math.floor(diff / 60000);
  const days  = Math.floor(totalMins / 1440);
  const hours = Math.floor((totalMins % 1440) / 60);
  const mins  = totalMins % 60;
  if (days > 0)  return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function SessionCountdown({ dateStr, timeStr, fallback = null }) {
  function parseDate() {
    try {
      const year = new Date().getFullYear();
      const cleaned = dateStr.replace(/(\d+)\w*\s+(\w+)(\s+\d+)?/, (_, d, m, y) => `${d} ${m}${y || " " + year}`);
      const dt = new Date(`${cleaned} ${timeStr}`);
      return isNaN(dt) ? null : dt.getTime();
    } catch { return null; }
  }
  const target = parseDate();
  const label  = useCountdown(target || 0);
  if (!label || !target) return fallback;
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:12, color:"var(--c-gray500)", background:"var(--c-gray100)", padding:"6px 12px", borderRadius:99, fontWeight:500 }}>
      Starting in <span style={{ color:"#f97316", fontWeight:700 }}>{label}</span>
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const remove = useCallback(id => setToasts(t => t.filter(x => x.id !== id)), []);
  const toast = useCallback(({ title, message, type = "info", duration = 3800 }) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t.slice(-3), { id, title, message, type }]);
    setTimeout(() => remove(id), duration);
  }, [remove]);
  return { toasts, toast, remove };
}

function ToastContainer({ toasts, onRemove }) {
  const cfg = {
    success: { color:"#10b981", bg:"#10b981" },
    error:   { color:"#ef4444", bg:"#ef4444" },
    warning: { color:"#f59e0b", bg:"#f59e0b" },
    info:    { color:"#3b82f6", bg:"#3b82f6" },
  };
  const icons = { success:"check", error:"x", warning:"warning", info:"info" };
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", flexDirection:"column", gap:8, pointerEvents:"none" }}>
      {toasts.map(t => {
        const c = cfg[t.type] || cfg.info;
        return (
          <div key={t.id} onClick={() => onRemove(t.id)}
            style={{ display:"flex", alignItems:"center", gap:12, background:C.white, border:`1px solid ${C.gray100}`, borderRadius:14, padding:"12px 14px 12px 12px", minWidth:280, maxWidth:360, boxShadow:"0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)", pointerEvents:"all", cursor:"pointer", animation:"toastIn .22s cubic-bezier(.34,1.4,.64,1)" }}>
            {/* Filled circle icon */}
            <div style={{ width:32, height:32, borderRadius:"50%", background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Icon name={icons[t.type]||"info"} size={15} color="#fff"/>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              {t.title && <div style={{ fontWeight:700, fontSize:14, color:C.gray900, marginBottom:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.title}</div>}
              <div style={{ fontSize:14, color: t.title ? C.gray500 : C.gray800, lineHeight:1.4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace: t.title ? "nowrap" : "normal" }}>{t.message}</div>
            </div>
            <div style={{ width:20, height:20, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:C.gray400 }}>
              <Icon name="x" size={12} color={C.gray400}/>
            </div>
          </div>
        );
      })}
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(10px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SVG THUMBNAILS
───────────────────────────────────────────────────────────────────────────── */
const THUMB_PHOTOS = [
  "photo-1503676260728-1c00da094a0b", // classroom/learning
  "photo-1588072432836-e10032774350", // students inclusion
  "photo-1509062522246-3755977927d7", // language/literacy
  "photo-1522202176988-66273c2fd55f", // teamwork/collaboration
  "photo-1485827404703-89b55fcc595e", // AI/technology
  "photo-1544027993-37dbfe43562a", // communication/AAC
];

function extractVimeoId(url) {
  if (!url) return null;
  if (/^\d+$/.test(url.trim())) return url.trim();
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}
function extractVimeoHash(url) {
  if (!url) return null;
  // unlisted videos: vimeo.com/VIDEO_ID/HASH
  const match = url.match(/vimeo\.com\/\d+\/([a-f0-9]+)/);
  return match ? match[1] : null;
}

function useVimeoDuration(vimeoUrl) {
  const [dur, setDur] = useState(null);
  useEffect(() => {
    if (!vimeoUrl) return;
    const id = extractVimeoId(vimeoUrl);
    if (!id) return;
    fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}`)
      .then(r => r.json())
      .then(d => {
        if (!d.duration) return;
        const s = d.duration;
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        setDur(h > 0
          ? `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
          : `${m}:${String(sec).padStart(2,'0')}`);
      })
      .catch(() => {});
  }, [vimeoUrl]);
  return dur;
}

function LessonDuration({ vimeoUrl, fallback }) {
  const dur = useVimeoDuration(vimeoUrl);
  return <>{dur || fallback}</>;
}

function SessionThumb({ id = 1, height = 160, overlay = false, noPlayHover = false, vimeoUrl }) {
  const photo = THUMB_PHOTOS[(id - 1) % THUMB_PHOTOS.length];
  const fallbackSrc = `https://images.unsplash.com/${photo}?w=640&h=360&fit=crop&auto=format`;
  const vimeoId = extractVimeoId(vimeoUrl);
  const vimeoThumbSrc = vimeoId ? `https://vumbnail.com/${vimeoId}.jpg` : null;
  const [src, setSrc] = useState(vimeoThumbSrc || fallbackSrc);
  const [hov, setHov] = useState(false);
  useEffect(() => { setSrc(vimeoThumbSrc || fallbackSrc); }, [vimeoUrl]);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ width:"100%", height, position:"relative", overflow:"hidden", background:"#e5e7eb" }}>
      <img src={src} alt="" onError={() => setSrc(fallbackSrc)} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
      {overlay && <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.32)", backdropFilter:"blur(1px)" }}/>}
      {!overlay && !noPlayHover && hov && (
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.15)", transition:"opacity .15s" }}>
          <div style={{ width:44, height:44, borderRadius:"50%", background:"rgba(255,255,255,0.22)", backdropFilter:"blur(4px)", border:"2px solid rgba(255,255,255,0.5)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminThumb({ idx = 0 }) {
  const photo = THUMB_PHOTOS[idx % THUMB_PHOTOS.length];
  const src = `https://images.unsplash.com/${photo}?w=144&h=104&fit=crop&auto=format`;
  return (
    <div style={{ width:72, height:52, borderRadius:8, overflow:"hidden", flexShrink:0, background:"#e5e7eb" }}>
      <img src={src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CERTIFICATE DOWNLOAD UTILITY
───────────────────────────────────────────────────────────────────────────── */
async function loadSealAsPng(url, size = 220) {
  const res = await fetch(url);
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(blobUrl);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = blobUrl;
  });
}

async function saveCertToSupabase(certData) {
  const { data, error } = await supabase.from("certificates").insert({ cert_data: certData }).select("id").single();
  if (error) throw error;
  return data.id;
}

async function downloadCertificate({ recipientName = "", sessionTitle, instructor, duration = "", score = null, quizTitle = null, description = "", existingCertId = null, existingDate = null }) {
  const today = existingDate || new Date().toLocaleDateString("en-US", { month:"long", day:"numeric", year:"numeric" });
  const certId = existingCertId || `${Math.random().toString(36).slice(2,8).toUpperCase()}-CE${String(Date.now()).slice(-6)}`;
  const sessionTime = duration || "1 Hour";
  const instructorName = instructor ? instructor.split("|")[0].trim() : "";
  const descText = description
    ? `This session was presented by ${instructorName}. ${description} Participants receiving this certificate completed this session, including the subsequent assessments.`
    : `This session was presented by ${instructorName}. Participants receiving this certificate completed this session, including the subsequent assessments.`;

  // Save to Supabase only for new certs; re-downloads use existing verify URL
  let verifyUrl = window.location.origin;
  try {
    if (!existingCertId) {
      const certData = { recipientName, sessionTitle, instructor, duration, score, description, certId, date: today };
      const certDbId = await saveCertToSupabase(certData);
      verifyUrl = `${window.location.origin}/?cert_id=${certDbId}`;
    } else {
      verifyUrl = window.location.href.split("?")[0] + window.location.search;
    }
  } catch(e) { /* fallback to homepage */ }

  // Industry standard: Letter landscape 11" × 8.5" at 96dpi
  const W = 1056, H = 816;
  const el = document.createElement("div");
  el.style.cssText = `position:fixed;left:-9999px;top:-9999px;width:${W}px;height:${H}px;overflow:hidden;`;
  el.innerHTML = `
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
    <div style="position:relative;width:${W}px;height:${H}px;font-family:'Poppins','Arial',sans-serif;box-sizing:border-box;overflow:hidden;">
      <img src="${window.location.origin}/Certificate Background.png" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;"/>

      <!-- Content -->
      <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:960px;padding:40px 48px 36px;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;">

        <!-- Stars -->
        <div style="display:flex;gap:12px;justify-content:center;margin-bottom:20px;">
          <span style="font-size:28px;color:#3b82f6;line-height:1;">★</span>
          <span style="font-size:28px;color:#3b82f6;line-height:1;">★</span>
          <span style="font-size:28px;color:#3b82f6;line-height:1;">★</span>
        </div>

        <!-- Certificate title -->
        <div style="text-align:center;font-size:32px;font-weight:700;color:#1a1a1a;line-height:1.2;margin-bottom:6px;font-family:'Poppins',sans-serif;letter-spacing:-0.3px;">Certificate of Professional Development Hours</div>

        <!-- is presented to -->
        <div style="font-size:15px;font-weight:400;color:#6b7280;margin-bottom:12px;font-family:'Poppins',sans-serif;letter-spacing:0.4px;">is presented to</div>

        <!-- Recipient name — strongest focal point -->
        <div style="font-size:56px;font-weight:800;color:#111827;letter-spacing:-2px;line-height:1;text-align:center;margin-bottom:20px;font-family:'Poppins',sans-serif;">${recipientName}</div>

        <!-- Divider -->
        <div style="width:640px;height:1px;background:linear-gradient(90deg,transparent,#d1d5db,transparent);margin-bottom:20px;"></div>

        <!-- Session block -->
        <div style="text-align:center;margin-bottom:24px;">
          <div style="font-size:14px;font-weight:400;color:#6b7280;margin-bottom:6px;font-family:'Poppins',sans-serif;">For their participation in the session titled:</div>
          <div style="font-size:24px;font-weight:600;color:#1a1a1a;line-height:1.3;font-family:'Poppins',sans-serif;">${sessionTitle}</div>
        </div>

        <!-- Meta row -->
        <div style="display:flex;justify-content:space-between;align-items:center;width:100%;margin-bottom:20px;padding:14px 0;border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;">
          <div style="font-size:17px;font-weight:600;color:#1a1a1a;font-family:'Poppins',sans-serif;">Session time: ${sessionTime}</div>
          <div style="font-size:17px;font-weight:600;color:#1a1a1a;font-family:'Poppins',sans-serif;">${today}</div>
        </div>

        <!-- Description -->
        <div style="font-size:14px;font-weight:400;color:#4b5563;line-height:1.9;text-align:center;max-width:860px;font-family:'Poppins',sans-serif;">${descText}</div>

      </div>

      <!-- Footer bar -->
      <div style="position:absolute;bottom:0;left:0;right:0;padding:16px 56px;display:flex;justify-content:space-between;align-items:center;font-family:'Poppins',sans-serif;font-size:13px;font-weight:400;color:#374151;">
        <div>
          <div>Certificate ID: <strong style="font-weight:600;">${certId}</strong></div>
          <div style="margin-top:3px;">Contact at <strong style="font-weight:600;">support@spedsummit.com</strong></div>
        </div>
        <div style="text-align:right;">
          <div style="margin-bottom:2px;">Verify at:</div>
          <div style="color:#6490E8;font-weight:600;text-decoration:underline;">${window.location.hostname}</div>
        </div>
      </div>
    </div>`;

  document.body.appendChild(el);
  try {
    const canvas = await html2canvas(el.lastElementChild, {
      scale: 2, useCORS: true, allowTaint: true, backgroundColor: "#fffef8", width: W, height: H,
    });
    const imgData = canvas.toDataURL("image/jpeg", 0.98);
    const pdf = new jsPDF({ orientation:"landscape", unit:"in", format:"letter" });
    pdf.addImage(imgData, "JPEG", 0, 0, 11, 8.5);
    // Clickable link annotation over the footer verify URL
    pdf.link(5.5, 7.9, 5.4, 0.6, { url: verifyUrl });
    pdf.save(`SPED-Summit-Certificate-${(sessionTitle||"").replace(/[^a-z0-9]/gi,"_").slice(0,40)}.pdf`);
  } finally {
    document.body.removeChild(el);
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */
const SESSIONS = [
  { id:1, title:"Mental Health & Teacher Wellness in Special Education", category:"MANAGEMENT", instructor:"Tara Roehl", instructorBio:"Occupational Therapist and founder of The Calm Caterpillar sharing mindfulness-based strategies to support emotional regulation and wellness.", instructorQuote:"Wellness is not a luxury — it's the foundation of effective teaching.", duration:"45 mins", resources:3, progress:100, status:"completed", description:"Discover innovative strategies and tools that can help you create and manage successful distributed teams with mindfulness at the core.", lessons:[{id:1,sectionTitle:"Getting Started",title:"The Foundation",duration:"12:00",status:"completed",type:"video"},{id:"1q",title:"Foundations Check",questions:5,status:"completed",type:"quiz"},{id:2,sectionTitle:"Building Your Practice",title:"Team Architecture",duration:"45:00",status:"active",type:"video"},{id:3,title:"Sync vs Async",duration:"28:40",status:"locked",type:"video"},{id:"2q",title:"Mid-Session Assessment",questions:10,status:"locked",type:"quiz"},{id:4,sectionTitle:"Advanced Strategies",title:"Tooling for Scale",duration:"32:15",status:"locked",type:"video"},{id:"3q",title:"Final Knowledge Check",questions:15,status:"locked",type:"quiz"}] },
  { id:2, title:"Accommodations & Inclusion: Integrating Students into Mainstream Education", category:"LEADERSHIP", instructor:"Casey Harrison", instructorBio:"Certified Dyslexia Specialist and founder of The Dyslexia Classroom sharing research-aligned strategies for inclusive education.", instructorQuote:"The architecture of your classroom is the invisible ceiling of your students' growth.", duration:"60 mins", resources:2, progress:65, status:"in-progress", description:"Leverage the power of proven frameworks to supercharge your creative output and unlock new levels of innovation in inclusive classrooms.", lessons:[{id:1,sectionTitle:"Foundations",title:"Understanding Inclusion",duration:"15:00",status:"completed",type:"video"},{id:"1q",title:"Inclusion Concepts Quiz",questions:8,status:"active",type:"quiz"},{id:2,sectionTitle:"Practical Application",title:"Practical Accommodations",duration:"20:00",status:"active",type:"video"},{id:3,title:"IEP Deep Dive",duration:"25:00",status:"locked",type:"video"},{id:"2q",title:"Final Assessment",questions:12,status:"locked",type:"quiz"}] },
  { id:3, title:"Empowering Language and Literacy Skills with DHH Children", category:"COMMUNICATION", instructor:"Jordan Smith", instructorBio:"Speech-Language Pathologist and founder of The Listening SLP sharing evidence-informed strategies for language and literacy foundations.", instructorQuote:"Every child has a voice — our job is to help them find it.", duration:"50 mins", resources:4, progress:35, status:"in-progress", description:"Gather qualitative and quantitative data to inform design decisions and enhance user satisfaction in educational settings.", lessons:[{id:1,sectionTitle:"Core Concepts",title:"Foundations of DHH",duration:"18:00",status:"completed",type:"video"},{id:"1q",title:"DHH Fundamentals Quiz",questions:6,status:"active",type:"quiz"},{id:2,sectionTitle:"Language & Literacy",title:"Language Bridges",duration:"22:00",status:"active",type:"video"},{id:3,title:"Literacy Strategies",duration:"10:00",status:"locked",type:"video"},{id:"2q",title:"Literacy Assessment",questions:10,status:"locked",type:"quiz"}] },
  { id:4, title:"Paraeducators & Team Collaboration: Training, Delegation & More", category:"TEAMWORK", instructor:"Morgan Lee", instructorBio:"Diana Williams shares practical leadership-driven strategies for building strong collaborative partnerships between teachers and paraeducators.", instructorQuote:"Strong teams don't happen by accident — they're built with intention.", duration:"40 mins", resources:1, progress:0, status:"locked", description:"Create high-fidelity prototypes to visualize functionality and gather early-stage feedback from team members.", lessons:[{id:1,sectionTitle:"Team Foundations",title:"Role Clarity",duration:"10:00",status:"locked",type:"video"},{id:2,title:"Delegation Models",duration:"15:00",status:"locked",type:"video"},{id:"1q",sectionTitle:"Advanced Collaboration",title:"Team Dynamics Quiz",questions:8,status:"locked",type:"quiz"},{id:3,title:"Communication Rhythms",duration:"15:00",status:"locked",type:"video"}] },
  { id:5, title:"AI and Advanced Technologies in Special Education", category:"TECHNOLOGY", instructor:"Dr. Emily Tran", instructorBio:"Dr. Emily Tran guides educators through utilizing data to inform teaching practices and enhance student learning.", instructorQuote:"Data without empathy is just numbers. Together, they transform learning.", duration:"55 mins", resources:2, progress:0, status:"not-started", description:"Conduct sessions to observe user interactions and identify usability issues for iterative design improvement.", lessons:[{id:1,sectionTitle:"Introduction to AI",title:"AI Overview in Education",duration:"12:00",status:"available",type:"video"},{id:2,title:"Tools & Platforms",duration:"20:00",status:"locked",type:"video"},{id:"1q",sectionTitle:"Implementation",title:"AI Tools Knowledge Check",questions:10,status:"locked",type:"quiz"},{id:3,title:"Implementation Strategies",duration:"23:00",status:"locked",type:"video"}] },
  { id:6, title:"Understanding & Supporting Communication for Students with AAC", category:"ACCESSIBILITY", instructor:"Dr. Sarah Kim", instructorBio:"AAC specialist with 15+ years supporting students with complex communication needs in inclusive environments.", instructorQuote:"Communication is a human right — AAC makes it possible for everyone.", duration:"48 mins", resources:3, progress:0, status:"not-started", description:"Analyze the product for compliance with accessibility standards to ensure it serves all users regardless of ability.", lessons:[{id:1,title:"What is AAC?",duration:"10:00",status:"available",type:"video"},{id:2,title:"Device Selection",duration:"18:00",status:"locked",type:"video"},{id:"1q",title:"AAC Basics Quiz",questions:7,status:"locked",type:"quiz"},{id:3,title:"Implementation in Class",duration:"20:00",status:"locked",type:"video"}] },
  { id:7, title:"Unlocking Reading for Students with Dyslexia", category:"LEADERSHIP", instructor:"Sydney Bassard", instructorBio:"Certified dyslexia specialist sharing structured literacy approaches for struggling readers.", instructorQuote:"Every student can learn to read with the right instruction.", duration:"52 mins", resources:2, progress:0, status:"not-started", description:"Structured literacy approaches and early intervention strategies proven to accelerate reading growth in students with dyslexia.", lessons:[{id:1,title:"Screening Basics",duration:"12:00",status:"available",type:"video"}] },
  { id:8, title:"Leading High-Impact SPED Programs", category:"MANAGEMENT", instructor:"Diana Williams", instructorBio:"SPED leadership coach helping directors build high-performing programs.", instructorQuote:"Strong programs are built with intention and data.", duration:"50 mins", resources:2, progress:0, status:"not-started", description:"How to build, sustain, and continuously improve a special education program that delivers real results for students and families.", lessons:[{id:1,title:"Program Foundations",duration:"14:00",status:"available",type:"video"}] },
];

const INSTRUCTOR_AVATARS = {
  "Tara Roehl":      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&auto=format",
  "Casey Harrison":  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&auto=format",
  "Jordan Smith":    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&auto=format",
  "Morgan Lee":      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop&auto=format",
  "Dr. Emily Tran":  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&fit=crop&auto=format",
  "Dr. Sarah Kim":   "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&auto=format",
  "Sydney Bassard":  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&auto=format",
  "Diana Williams":  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&auto=format",
};

const SEASONS = [
  {
    id: "spring-2026",
    name: "Spring 2026",
    tagline: "Live & Upcoming",
    description: "Current live sessions and upcoming content for the Spring 2026 SPED Summit.",
    sessionIds: [1, 2, 5, 6],
    color: "#2563eb",
    bg: "#dbeafe",
    updatedAt: "Apr 2026",
  },
  {
    id: "winter-2026",
    name: "Winter 2026",
    tagline: "Past Season",
    description: "Recorded sessions from the Winter 2026 SPED Summit. All recordings available.",
    sessionIds: [3, 4],
    color: "#5D636F",
    bg: "#f3f4f6",
    updatedAt: "Jan 2026",
  },
  {
    id: "summer-2026",
    name: "Summer 2026",
    tagline: "Past Season",
    description: "Recorded sessions from the Summer 2026 SPED Summit. All recordings available.",
    sessionIds: [5, 6],
    color: "#5D636F",
    bg: "#f3f4f6",
    updatedAt: "Jul 2026",
  },
  {
    id: "spring-2025",
    name: "Spring 2025",
    tagline: "Past Season",
    description: "Recorded sessions from the Spring 2025 SPED Summit. All recordings available.",
    sessionIds: [1, 3],
    color: "#5D636F",
    bg: "#f3f4f6",
    updatedAt: "Apr 2025",
  },
  {
    id: "winter-2025",
    name: "Winter 2025",
    tagline: "Past Season",
    description: "Recorded sessions from the Winter 2025 SPED Summit. All recordings available.",
    sessionIds: [2, 4],
    color: "#5D636F",
    bg: "#f3f4f6",
    updatedAt: "Jan 2025",
  },
  {
    id: "summer-2025",
    name: "Summer 2025",
    tagline: "Past Season",
    description: "Recorded sessions from the Summer 2025 SPED Summit. All recordings available.",
    sessionIds: [1, 2],
    color: "#5D636F",
    bg: "#f3f4f6",
    updatedAt: "Jul 2025",
  },
  {
    id: "spring-2024",
    name: "Spring 2024",
    tagline: "Past Season",
    description: "Recorded sessions from the Spring 2024 SPED Summit. All recordings available.",
    sessionIds: [3, 5],
    color: "#5D636F",
    bg: "#f3f4f6",
    updatedAt: "Apr 2024",
  },
  {
    id: "winter-2024",
    name: "Winter 2024",
    tagline: "Past Season",
    description: "Recorded sessions from the Winter 2024 SPED Summit. All recordings available.",
    sessionIds: [4, 6],
    color: "#5D636F",
    bg: "#f3f4f6",
    updatedAt: "Jan 2024",
  },
  {
    id: "summer-2024",
    name: "Summer 2024",
    tagline: "Past Season",
    description: "Recorded sessions from the Summer 2024 SPED Summit. All recordings available.",
    sessionIds: [1, 4],
    color: "#5D636F",
    bg: "#f3f4f6",
  },
];

/* availableFrom/availableTo: control session visibility.
   hasRecording: whether a recording exists for past sessions. */
const SESSION_AVAILABILITY = {
  1: { availableFrom:"2026-03-26T09:00", availableTo:"2027-12-31T23:59", hasRecording:true  },
  2: { availableFrom:"2026-03-26T11:00", availableTo:"2027-12-31T23:59", hasRecording:true  },
  3: { availableFrom:"2025-01-06T09:00", availableTo:"2025-06-30T23:59", hasRecording:false },
  4: { availableFrom:"2025-01-07T09:00", availableTo:"2025-06-30T23:59", hasRecording:true  },
  5: { availableFrom:"2026-03-28T09:00", availableTo:"2027-12-31T23:59", hasRecording:false },
  6: { availableFrom:"2026-03-28T11:00", availableTo:"2027-12-31T23:59", hasRecording:false },
};

// 'live' | 'upcoming' | 'past' | 'unavailable'
// Accepts either a sessionId (looks up SESSION_AVAILABILITY) or a session object with availableFrom/availableTo
function parseLocalDate(str) {
  if (!str) return null;
  // "2026-05-29" → treat as local midnight, not UTC midnight
  const d = new Date(str);
  if (isNaN(d)) return null;
  // If it's a date-only string (no time component), adjust for UTC offset
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0);
  }
  return d;
}

function getSessionState(sessionIdOrObj) {
  const now = new Date();
  // If passed a session object with its own date fields (Supabase sessions)
  if (sessionIdOrObj && typeof sessionIdOrObj === "object") {
    const from = sessionIdOrObj.availableFrom || sessionIdOrObj.available_from;
    const to   = sessionIdOrObj.availableTo   || sessionIdOrObj.available_to;
    if (!from) return "live"; // no date set → always available
    const fromDate = parseLocalDate(from);
    const toDate   = parseLocalDate(to);
    if (toDate && now > toDate) return "past";
    if (fromDate && now < fromDate) return "upcoming";
    return "live";
  }
  // Legacy: look up by id
  const avail = SESSION_AVAILABILITY[sessionIdOrObj];
  if (!avail || !avail.availableFrom) return "unavailable";
  const fromDate = parseLocalDate(avail.availableFrom);
  const toDate   = parseLocalDate(avail.availableTo);
  if (toDate && now > toDate) return "past";
  if (fromDate && now < fromDate) return "upcoming";
  return "live";
}

function isSessionAvailable(sessionId) { return getSessionState(sessionId) === "live"; }
function isSessionArchived(sessionId)  { return getSessionState(sessionId) === "past"; }

// For Supabase sessions (pass full session object)
function getSessionStateFromObj(s) { return getSessionState(s); }
function isSupabaseSessionLive(s)  { return getSessionStateFromObj(s) === "live"; }
function isSupabaseSessionPast(s)  { return getSessionStateFromObj(s) === "past"; }

const SCHEDULE = [
  { id:1, date:"26th Mar", time:"09:00 AM", type:"OPENING", title:"Mental Health & Teacher Wellness in Special Education", description:"Sarah Habib—Occupational Therapist and founder of The Calm Caterpillar—shares practical, mindfulness-based strategies to support emotional regulation and wellness for both students and educators.", status:"past", cta:"Watch Again", instructor:"Tara Roehl" },
  { id:2, date:"26th Mar", time:"11:00 AM", type:"KEYNOTE", title:"Accommodations & Inclusion: Integrating Students into Mainstream", description:"Casey Harrison—Certified Dyslexia Specialist—shares practical, research-aligned strategies to support students with dyslexia and language-based learning differences.", status:"past", cta:"Resume Lesson", instructor:"Casey Harrison" },
  { id:3, date:"6th Jan 2025", time:"09:00 AM", type:"WORKSHOP", title:"Empowering Language and Literacy Skills with DHH Children", description:"Sydney Bassard—Speech-Language Pathologist—shares practical, evidence-informed strategies to build strong language and literacy foundations in children who are Deaf or Hard of Hearing.", status:"past", cta:"Recording Unavailable", instructor:"Jordan Smith" },
  { id:4, date:"7th Jan 2025", time:"02:00 PM", type:"NETWORKING", title:"Paraeducators & Team Collaboration: Training, Delegation & More", description:"Diana Williams shares practical, leadership-driven strategies for building strong, collaborative partnerships between teachers and paraeducators.", status:"past", cta:"Watch Again", instructor:"Morgan Lee" },
  { id:5, date:"15th Apr", time:"09:00 AM", type:"WORKSHOP", title:"AI and Advanced Technologies in SPED", description:"Join Dr. Emily Tran as she guides educators through the process of utilizing data to inform teaching practices and enhance student learning.", status:"upcoming", cta:"Registered", instructor:"Dr. Emily Tran" },
  { id:6, date:"15th Apr", time:"11:00 AM", type:"PANEL DISCUSSION", title:"Understanding & Supporting Communication for Students with AAC", description:"A panel of AAC specialists discuss implementation strategies, device selection, and how to create truly inclusive communication environments.", status:"upcoming", cta:"Register", instructor:"Dr. Sarah Kim" },
];

const SCHEDULE_TYPE_COLORS = { OPENING:{c:"#7c3aed",bg:"rgba(124,58,237,0.12)"}, KEYNOTE:{c:"#2563eb",bg:"rgba(37,99,235,0.12)"}, WORKSHOP:{c:"#059669",bg:"rgba(5,150,105,0.12)"}, NETWORKING:{c:"#d97706",bg:"rgba(217,119,6,0.12)"}, "PANEL DISCUSSION":{c:"#dc2626",bg:"rgba(220,38,38,0.12)"} };
const ADMIN_STATUS_COLORS = { LIVE:{c:"#fff",bg:"#10b981"}, DRAFT:{c:"#d97706",bg:"rgba(217,119,6,0.18)"}, ARCHIVED:{c:"var(--c-gray600)",bg:"rgba(156,163,175,0.18)"} };


const COMMUNITY_POSTS_DATA = [];

/* ─────────────────────────────────────────────────────────────────────────────
   UTILITIES
───────────────────────────────────────────────────────────────────────────── */
function getCTA(s) {
  if (s.status==="locked") return { label:"Locked", disabled:true };
  if (s.status==="completed") return { label:"Watch Again", disabled:false };
  if (s.status==="in-progress") return { label:"Resume Lesson", disabled:false };
  return { label:"Start Session", disabled:false };
}

function Skeleton({ width="100%", height=16, radius=8, style:s={} }) {
  return (
    <div style={{ width, height, borderRadius:radius, background:"linear-gradient(90deg,#e5e7eb 25%,#f3f4f6 50%,#e5e7eb 75%)", backgroundSize:"200% 100%", animation:"skeleton-shimmer 1.4s infinite", flexShrink:0, ...s }}/>
  );
}

function SkeletonSessionCard() {
  return (
    <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", overflow:"hidden" }}>
      <Skeleton height={160} radius={0}/>
      <div style={{ padding:"14px 16px 16px", display:"flex", flexDirection:"column", gap:10 }}>
        <Skeleton height={14} width="60%" radius={6}/>
        <Skeleton height={18} width="90%" radius={6}/>
        <Skeleton height={14} width="75%" radius={6}/>
        <div style={{ display:"flex", gap:8, marginTop:4 }}>
          <Skeleton height={28} width={90} radius={8}/>
          <Skeleton height={28} width={70} radius={8}/>
        </div>
      </div>
    </div>
  );
}

function Avatar({ name, src, size=36 }) {
  const [imgFailed, setImgFailed] = useState(false);
  const colors = ["#6490E8","#4a77d4","#FF8F6C","#2B2E33","#5D636F","#7aa3ee","#a0b8f0"];
  const c = colors[name.charCodeAt(0) % colors.length];
  const initials = name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
  const showImg = src && !imgFailed;
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:showImg ? "transparent" : c, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:size*0.36, flexShrink:0, letterSpacing:0.5, overflow:"hidden" }}>
      {showImg
        ? <img src={src} alt={name} onError={()=>setImgFailed(true)} style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"50%" }}/>
        : initials}
    </div>
  );
}

function ProgressBar({ value, color=C.primary, height=4, trackColor=C.gray200 }) {
  return <div style={{ background:trackColor, borderRadius:99, height, overflow:"hidden" }}><div style={{ width:`${value}%`, background:color, height:"100%", borderRadius:99, transition:"width 0.5s ease" }}/></div>;
}

function Badge({ label, color, bg, size=10 }) {
  return <span style={{ fontSize:size, fontWeight:700, color, background:bg, padding:"2px 8px", borderRadius:6, letterSpacing:0.4, display:"inline-block", lineHeight:1.6 }}>{label}</span>;
}

function Btn({ children, onClick, variant="primary", size="md", disabled=false, style:s={} }) {
  const sizes = { sm:"6px 13px", md:"9px 18px", lg:"11px 26px" };
  const variants = {
    primary: { background: disabled ? C.gray200 : C.primary, color: disabled ? C.gray400 : "#fff", border:"none" },
    outline: { background:C.white, color:C.gray700, border:`1px solid ${C.gray300}` },
    ghost:   { background:"transparent", color:C.primary, border:"none" },
    danger:  { background:C.errorLight, color:C.error, border:`1px solid ${C.errorBorder}` },
    success: { background:C.successLight, color:C.success, border:`1px solid ${C.successBorder}` },
  };
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled}
      style={{ padding:sizes[size], borderRadius:10, fontSize:14, fontWeight:600, cursor:disabled?"not-allowed":"pointer",
        display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6, lineHeight:1,
        transition:"all .15s", ...variants[variant], ...s }}
      onMouseEnter={e=>{ if(!disabled){ e.currentTarget.style.opacity=".85"; e.currentTarget.style.transform="translateY(-1px)"; }}}
      onMouseLeave={e=>{ e.currentTarget.style.opacity="1"; e.currentTarget.style.transform=""; }}>
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DROPDOWN MENU
───────────────────────────────────────────────────────────────────────────── */
function DropdownMenu({ items, onClose, anchorRef, bg }) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (anchorRef?.current?.contains(e.target)) return;
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose, anchorRef]);
  return (
    <div ref={ref} style={{ position:"absolute", right:0, top:"110%", background: bg || "#FEF5EC", border:`1px solid rgba(0,0,0,0.08)`, borderRadius:12, boxShadow:"0 8px 24px rgba(0,0,0,0.12)", minWidth:170, zIndex:200, overflow:"hidden", animation:"fadeIn .15s ease" }}>
      {items.map((item, i) => (
        <button key={i} onClick={() => { item.action(); onClose(); }}
          style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"11px 16px", background:"transparent", border:"none", fontSize:14, fontWeight:500, color:item.danger?C.error:C.gray700, cursor:"pointer", borderBottom:i<items.length-1?`1px solid ${C.gray100}`:"none", textAlign:"left", transition:"background 0.12s" }}
          onMouseEnter={e=>{ e.currentTarget.style.background=item.danger?"rgba(239,68,68,0.07)":"rgba(0,0,0,0.05)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; }}>
          {item.icon && <Icon name={item.icon} size={16} color={item.danger?C.error:C.primary} weight="fill"/>}
          <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.label}</span>
        </button>
      ))}
      <style>{`@keyframes fadeIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   UPLOAD ZONE
───────────────────────────────────────────────────────────────────────────── */
function UploadZone({ accept, label, hint, icon, preview, onFile, aspect="16/9", height=130 }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [localPreview, setLocalPreview] = useState(preview || null);
  const dark = document.querySelector("[data-theme='dark']") !== null;

  function handleFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => setLocalPreview(e.target.result);
    reader.readAsDataURL(file);
    if (onFile) onFile(file);
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
      style={{ height, border:`2px dashed ${dragging ? C.primary : dark ? "rgba(255,255,255,0.15)" : C.gray300}`, borderRadius:12, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", background:dragging ? C.primaryLight : dark ? "rgba(255,255,255,0.04)" : "#fafafa", transition:"all .2s", position:"relative", overflow:"hidden" }}>
      {localPreview ? (
        <>
          <img src={localPreview} alt="preview" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}/>
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8 }}>
            <Icon name="upload-simple" size={20} color="#fff"/>
            <span style={{ fontSize:12, color:"#fff", fontWeight:600 }}>Replace</span>
          </div>
        </>
      ) : (
        <>
          <Icon name={icon||"cloud-arrow-up"} size={28} color={dragging ? C.primary : dark ? "rgba(255,255,255,0.3)" : C.gray400}/>
          <span style={{ fontSize:14, color: dark ? "rgba(255,255,255,0.6)" : C.gray600, fontWeight:600, marginTop:8 }}>{label||"Click or drag to upload"}</span>
          {hint && <span style={{ fontSize:12, color: dark ? "rgba(255,255,255,0.35)" : C.gray400, marginTop:4 }}>{hint}</span>}
        </>
      )}
      <input ref={inputRef} type="file" accept={accept||"*/*"} style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])}/>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TOP BAR  +  NOTIFICATION POPOVER
───────────────────────────────────────────────────────────────────────────── */
const NOTIF_DATA = [];

function NotificationPopover({ onClose, anchorRef }) {
  const [notifs, setNotifs] = useState(NOTIF_DATA);
  const ref = useRef(null);
  const unreadCount = notifs.filter(n => !n.read).length;

  useEffect(() => {
    const handler = e => {
      if (anchorRef?.current?.contains(e.target)) return;
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose, anchorRef]);

  function markRead(id) { setNotifs(ns => ns.map(n => n.id === id ? { ...n, read:true } : n)); }
  function markAllRead() { setNotifs(ns => ns.map(n => ({ ...n, read:true }))); }

  return (
    <div ref={ref} style={{
      position:"fixed", top:68, right:12,
      width:360, maxWidth:"calc(100vw - 24px)", background:C.white, borderRadius:14,
      border:`1px solid ${C.gray200}`, boxShadow:"0 8px 32px rgba(0,0,0,0.12)",
      zIndex:300, animation:"fadeIn .18s ease"
    }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", padding:"10px 14px 8px" }}>
        <span style={{ fontWeight:700, fontSize:14, color:C.gray900 }}>Notifications</span>
        {unreadCount > 0 && (
          <button onClick={markAllRead}
            style={{ fontSize:12, fontWeight:500, color:C.gray600, background:"none", border:"none", cursor:"pointer", padding:0, fontFamily:"inherit" }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
            onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
            Mark all as read
          </button>
        )}
      </div>

      {/* Divider */}
      <div style={{ height:1, background:C.gray200, margin:"0 4px" }}/>

      {/* List */}
      <div>
        {notifs.length === 0 && (
          <div style={{ padding:"32px 16px", textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            <Icon name="bell" size={24} color={C.gray300}/>
            <div style={{ fontSize:13, fontWeight:600, color:C.gray700 }}>You're all caught up!</div>
            <div style={{ fontSize:12, color:C.gray400 }}>No new notifications</div>
          </div>
        )}
        {notifs.map(n => (
          <div key={n.id}
            onClick={() => markRead(n.id)}
            style={{ borderRadius:8, padding:"8px 10px", margin:"2px 4px", cursor:"pointer", transition:"background .12s" }}
            onMouseEnter={e => e.currentTarget.style.background = C.gray50}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <div style={{ position:"relative", display:"flex", alignItems:"flex-start", gap:10, paddingRight:16 }}>
              {/* Avatar */}
              <img src={n.img} alt={n.user} style={{ width:36, height:36, borderRadius:8, objectFit:"cover", flexShrink:0 }}/>
              {/* Text */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, color:C.gray600, lineHeight:1.45 }}>
                  <span style={{ fontWeight:600, color:C.gray900 }}>{n.user}</span>
                  {" "}{n.action}{" "}
                  <span style={{ fontWeight:600, color:C.gray900 }}>{n.target}</span>.
                </div>
                <div style={{ fontSize:12, color:C.gray400, marginTop:3 }}>{n.time}</div>
              </div>
              {/* Unread dot */}
              {!n.read && (
                <div style={{ position:"absolute", right:0, top:"50%", transform:"translateY(-50%)", width:7, height:7, borderRadius:"50%", background:C.primary, flexShrink:0 }}/>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   NOTIFICATIONS PAGE  (mobile full-page view)
───────────────────────────────────────────────────────────────────────────── */
function NotificationsPage() {
  const [notifs, setNotifs] = useState(NOTIF_DATA);
  const unreadCount = notifs.filter(n => !n.read).length;

  function markRead(id) { setNotifs(ns => ns.map(n => n.id === id ? { ...n, read:true } : n)); }
  function markAllRead() { setNotifs(ns => ns.map(n => ({ ...n, read:true }))); }

  return (
    <div style={{ background:C.gray50, minHeight:"100%", padding:"24px 16px", width:"100%", boxSizing:"border-box", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <h1 style={{ margin:0, fontSize:20, fontWeight:700, color:C.gray900, fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif", letterSpacing:-0.3 }}>Notifications</h1>
        {unreadCount > 0 && (
          <button onClick={markAllRead}
            style={{ fontSize:13, fontWeight:600, color:C.primary, background:"none", border:"none", cursor:"pointer", padding:0, fontFamily:"inherit" }}>
            Mark all as read
          </button>
        )}
      </div>

      {notifs.length === 0 ? (
        <Empty fullPage>
          <EmptyMedia variant="icon" color="#6490E8"><Icon name="bell" size={22} color="#6490E8"/></EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>You're all caught up!</EmptyTitle>
            <EmptyDescription>No new notifications right now. We'll let you know when something happens.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, overflow:"hidden", width:"100%" }}>
          {notifs.map((n, i) => (
            <div key={n.id} onClick={() => markRead(n.id)}
              style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"14px 16px", borderBottom: i < notifs.length - 1 ? `1px solid ${C.gray100}` : "none", cursor:"pointer", background: n.read ? C.white : "rgba(100,144,232,0.03)", transition:"background .12s", width:"100%", boxSizing:"border-box" }}
              onMouseEnter={e => e.currentTarget.style.background = C.gray50}
              onMouseLeave={e => e.currentTarget.style.background = n.read ? C.white : "rgba(100,144,232,0.03)"}>
              <img src={n.img} alt={n.user} style={{ width:40, height:40, borderRadius:10, objectFit:"cover", flexShrink:0 }}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, color:C.gray600, lineHeight:1.5 }}>
                  <span style={{ fontWeight:700, color:C.gray900 }}>{n.user}</span>
                  {" "}{n.action}{" "}
                  <span style={{ fontWeight:700, color:C.gray900 }}>{n.target}</span>.
                </div>
                <div style={{ fontSize:12, color:C.gray400, marginTop:3 }}>{n.time}</div>
              </div>
              {!n.read && (
                <div style={{ width:8, height:8, borderRadius:"50%", background:C.primary, flexShrink:0, marginTop:6 }}/>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SPED SUMMIT LOGO  (SVG recreation of the brand mark)
───────────────────────────────────────────────────────────────────────────── */
function SpedLogo({ height = 34 }) {
  /* Aspect ratio of the brand asset: 71 × 36 */
  const w = Math.round(height * (71 / 36));
  return (
    <svg id="spedLogoSvg" width={w} height={height} viewBox="0 0 71 36" fill="none"
      xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{ display:"block" }}>
      <rect width="71" height="36" fill="url(#spedLogoPattern)"/>
      <defs>
        <pattern id="spedLogoPattern" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use xlinkHref="#spedLogoImg" transform="matrix(0.00507042 0 0 0.01 0.00309859 0)"/>
        </pattern>
        <image id="spedLogoImg" width="196" height="100" preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMQAAABkCAYAAADZup+FAAAAtGVYSWZJSSoACAAAAAYAEgEDAAEAAAABAAAAGgEFAAEAAABWAAAAGwEFAAEAAABeAAAAKAEDAAEAAAACAAAAEwIDAAEAAAABAAAAaYcEAAEAAABmAAAAAAAAAHgyAgDoAwAAeDICAOgDAAAGAACQBwAEAAAAMDIxMAGRBwAEAAAAAQIDAACgBwAEAAAAMDEwMAGgAwABAAAA//8AAAKgBAABAAAAxAAAAAOgBAABAAAAZAAAAAAAAABHs32MAAAACXBIWXMAABYlAAAWJQFJUiTwAAAgAElEQVR4nO19CXxU1b3/mSVBa92r9okLKEIy985MFkAW9wVQSYIkAVza+tq+ttrna19tX9u/bX1afa11RUIyc2cJEEANIhAjFXBttbW2tXXBQObeO5NJAEFZRMiezP/3O8u9d8LMZMJSFrmfz/ncWc89y+97fsv5/X6HkCyuG5d3EE8oSlx+nUjBGJEVjVxU00Ikf8ThDcdOdgfVKbKi/lIK6CEof4Pvo7Ki98PrhKToCTmg9csB/RNJ0f4O9zXuoP6Q7FfnuJToRdcs+ycpqI3Y4DsC3xFveD2B7+GZu7NpmnHNWtMD9eikeJHu8IR0GZ47Feq7Dsr1B1qgLnG/zqXoY/PC+ghPjeaE/uW4Fc0x3N9K3AGVtr8o2EoufFyDfkRJWUPHkPpwqPtxNBYJ+67oU/JDer4nrJ8Nnw0DWnHKvohDDjTBmKuUHoGeiNvfDPOgESkQI3Ne6Rny2Gd1lTV0E68fQBCKkTE1KvmPd9cTD4DAE9DmQEMaoMFd0OAEEj+8p4UCIUBf92NhwID34o6/oUDRe91B7SMo9wCwzsyrUR2SogL4NNqx2eu6SOVLXVm1s6KxmwBxYjkL6v8Dfz6C8aAUyVoXe90DfXgf7o3wzDulQLR4XK3muPvK7QQ+J+5QCymujUO7hjYxh7ofR12h9CRoRhN09hGUF+Hzh4D2rnEr6omyP3JC/sItlG5kAMSIxyKkvHEvqVydHf0MelU29JLZixOkqDZuk6t1cpn/XVIQ0k+BBt0CjWimRBIQqz8r8J4WBgTOIehvdOQQ/ZJCOQUvGn0v4e8UCpQOuD8B340YU90KnWomF8/bRMbWxkjF6u7B27u6BwZDx/IVqOM1Drge83n7XySj/bzw12zSDC6Ir9+A58/yhvV/89aqlNN5AlFbyfO7KaFnNe6HsB9HY2H0ZM6BWGDNcacA+QwW0ucBGBXucMswWYk6Jb9GCmvWA/202MobOg8MDEiAY8MgBoQiNjes1pcqWo7MgLCBIxYb1csbJwijX+YNzaL0c44hwNTHV1wkrM3AMb5buEA/yR1sIS5AfFG4ZdCVdh9CYs/pHUKbsiqS0U/NBD+0H9reSwFOuYmuwW+mnfu4Tlw+lVzWsBtWfJ1MX7EH2tl7RPTjaCti3DmH4IsrH/eA3mdZlCJQflQQ1i70LmqlHKMwGLPPBPEVF6XyhuwWJnNCGrvIOFiVvQ+3gagUIUU1sS+5/XqNAQRF75b56iiZSD6QzvZztPdzUPRxgnsG5MNLJP9GctEToFsEohlX2cNISP0WPQlLN0wWAjwBHOIpGLfTixe3kVFPNYMoFSUlqzLrFccBMZRxZxyai+YACqQf/llA+wfotTOL6lpOzPdphPznatB5NVsBiFODLUrGdXtDP5kQglUtELPJNW2gnGjDofJGTvwdMiXWgwaEAUUzCAs61ck7tl7y6x4ZFPmJ9ZvJhAWb03bmCCEkg/PBvZ3rTu/BRBS5kIXXJ0BhbgO9qP84IA76uFPawdfILXqEOAWL0nIYw3O/HUmQUVUR1O9sRbWtsPBnAYobVuwFEKh2d1CFFTlyFjzgDS7f75VNheYgA2EgKHj9oFPIjKDecfm0EYB2ct0zn9iOAkLi+gV93c4nqVkKxAo8SoSMmbfeNvvVxHFAHDr6Ea/7uF6KNBQbUxO5weUDiWfRNgqKwmBLZr2ufEUvKVBiNvd8nYyr0nNBTKrmBLmXW5EycYV+WayMAQ0nr5eiNMALvJYVqhj2SpbfZiIqZmFAgqLvFxTUtpzgDUapHD6zof1gEFK/IY/iqjJIkbGYCt2giwKXcVEU7OCLyWtyqOXsfBCbJFC0b16ZejKOA+JgAcN438kXpa0gss6Q/CoZ/thH5Lx5TTZUvFNKHLcsT5Bx4TbQHbYS9/wIAUL8HtcZ2hkY0nKFfsv3TH5TdNNEqZgmQ0mYLhkH6GaKkZ6W4whOgaIHk8e12ahkFy6IkJsbDwYgNA4GSzszFG7yA2Br2PZeZvnQ+jNyTMUAfztfuX49tXGLDa1Ply3+GNrcN1g/Xub96JRQNzkqCh2bTDSTEByUWxl7Mtan0IKLKRS62PbxsWfjm2nBMxclIYJvg9c3jgF99MFEglwCtJ4SEHNWJEh+SLW5ghqAIeqGhqj8gb3pV0RqWk1w1iQmHgciBve34cFr4L8NtMBr+O0fZFov26PgJtte03SbbuCoJQEH7x8AirNwnwIUbFvp8j0HBAhuPsU+dsF9u4Qbh+lLl8zAkBCmZOhDD1XkMrSfjQebGKxDYvsv43ET8vr67SnFP8s+xNlQ/z+kLMB6ZBUOBiUtoSYteGzhyFCfZR+I0wHWj6DoprQRSL+oGos2BwV/bmteTWT88HkfkquWbrXjmN+8YsACW9nQRby/eZ+46rcQt1+7m4Oh3dhcS4k+BgZjUy6gvyUH9R+BDnKlOxg9f/T8TTkTfreBTPxdE7mkqi3HrcTO8ASik+C3P4E6X6KrHqujOwNRied08fs3Rs9vI+5ghFQM2HDZDw7RywfzXbh/yxWMlkAphzJzQCmXgtHvycHoXW5Ffwz6+wz850PLZmS3JLhBRk5HJxA/U2BccwtCLaQEJqKysS9lPzwB/WT47b1Qdz2UxVCWHh1F+2BwDmFwf5DxtdfhfwuhPJOyPgWUYkVfDb9/FcbvI7jv5PWzfQgFFyuNm10ziPQGTdP3b3hC0bMKQzEypX6nfULtpmROUdbQbqNb4AEVFek1nPh60z2Ar9x8k0rbIQe1XwHRnAN3VMqJBx40vm49KZyvOqDYJz/zEfEocVjZY0QK6WTCE7Fcd0D7RIDTJ1xs6klHVIyt0rbg65ehnArP3mezbj8A0c0HtsHt33CSC8QYIP6UBfpGZCzw3NGNAEh/xAttfgT+u1ViK5gAbOrxEvstDBQoUkyg4x3+YB9AzFjRSUZXq+TiGhjLKpVMeKyZXPpE5Kgo45+M4Pzfl4XI1MtX7c35Af1qb7VGrvj5u0l1TXiimYx/LELsj3fZJKXlZKCpc2DMxsM8zAb99mdQzwtQxyeGKB7gNJRW2rCK4HoC6O/nI5RtsPCodK/CEF9ve60TJjpqg8pg0vVCvup1SRkVR0qkXfR1EAg7gESD/4eVLxxzlK5qt1c09tpuXttDZq7pJTNf6LGVrmy3jQ23OuB3uWNhsl3wHxALboO6PubP7JMCWgpiEvZ9DRX1DhCbzkfXiBsPUGQyBhC4FUzieQAKUhiO55Q2dDgrVvfSUk7vPU74LKe4Np4D/8m9ZKFmB0AAKKLoQ1MBkx/hYOiRM61SjEgECH8nh9RcKbgvsHHjSIK6R/sAENWqvbhKtRcdBaV4HtznbrDDmPx6MDFGYpu6eG+DBWdKXm2MePx6bqp6x4Y2gPLbSrzhFua3BAsTSDHonnEycOybYDzDUOenhiSRERSGCI4Gkt3w36tkBXXmiK2sgW/84gMK67YSydeMzmmzufLRKXSC1OxHFxsgazxBdO6jjnnOcUtggjPYd29f2k/GLWkFbqE5zvdvseHEAyh+xImkK72SRJ/VzZ85VYJOFIe3JLG5/QEEvwM7Vr+Kg126am9as+7sFX2kvLafFKNfl6I64X92V5AaIG6Ctu/CPRqJ7bhnYttiR/Xv8NvTkePAM/d51py1veRrUCqhzDwKSunqDuJduonkrUEOoT0wKIcwAbEJAHE9cuGC2riz7KUus9417F4OC2tFY48N5tpesmqvY3Ldx86p9TtyikNtlGOPehppT6sA2ohyMGTi1v1W4MBr5DInQ3tRerGVruggOLmAOFBUqzc6oJH3Crk4g7iE9w6u5JRhowrDUceMF3dn6XOEbiEUCE439VLUUPyI8kHqoDLhwMKU2r302UHtzisaPyLukJqkRxwMQED70wJCXNjHIhAJ4X+2y56Ok1GP4cqlPcAHujP984RIyFxU3EH9YuR0ki9KbnlliO4ER+A1feVuAqINHQshRWQJiOsQEMCFHdk8p4IvgihxwDOcY0GswnmH+bsG6mziInh3ei5luNx0crHtBikQIeNWvAicOcYAwdhG80nwWuEV9WSYWBSXuqkcFtQuhzuZsmynfSiDh6AoBqIqBiAW+dUT4HmLsvHqZESn+uXQxhw5eHgAQZ8FXLAAxUTgdGj1gjpkeK3x+jKaeoVyDfcr8Jmjq7YBV93X/HooLuTeWMphxZ29rpfc8acsXRiyqRvm4kAAAYSeFSDEdcvyPjK2Lg6ilmbLC8Zt6PPmDqjXAh21mSJ4RrG/my9i86WgeiLSE+rAlO1whfoUeL3UkIfTV2QAAl5PQkAUheP2ytXp3RFSXZXorPeLRnJGdRMS8RR47pNQ1/2wij6YpqBs+ltQqGa4q1THjfWfQR3myvqvBAReZQ3t6N5tw/7DeHwJSg3joFy3Si82MbeCoPr9a9e9iw6U+1jMDtZ1++u9ZBbocSBu2EpWtDuKQi05btSDgCs9+PnQYzUyXf9qQLBndpNC1CkCqu2GtaCXVtHF6W6+hybE/tSiEzNy9MJ9OwBhNJrC0b0GZT5QcFUokZPgtY/Lf2kBwbX1Ti4y/bvLj7pHsy2vejtd+bO9Kl/tJu7FIK4tidjkhTG75PsUiGtr+qJstbnDn9hnXb+ZTE+s3Le+fzEg8CoFUOT7IjaXnwYH/cDQvzKITRJXvkGRf8gV2uhAq1z5QQDE7LVstZ/zMnKBHhuKIAWhWI7k10Df2UIdC1FWZvEC0eGXLtWddzd1gbh2cLjE4QAEXkhzFY1d5KbnP7ejFdPrj50C/VzGtw6EqTuV+JoQ+gbQzNdHVm0kBaEoF5n8IDL5NgyD148OpkMwUDCzGbz+Kwz0mTzaLefSumhGpdp6zX61l8z5cxe5anUbcYdjMJgxGtiRtsD3GAk1bm6cTLm3lXx9abI/0OEAxDf+3InxDk7UBaCe2zl37cgICNOEPE9SIjkocmUbK5E0fhwAt7+eIDcs32GbXLfFAaKr043tCb8HYxqlEXx5dNWMDod5Kof3j4Detg7G5q/w2SUy+vO82DOkPqe7DhcgrNeU+h2oBwOd6NOMhT29oabf0o5n8oOxL2M7AFEaKfZp5OxnW9Bn/7vC7DoI2zdZf0BbTH7WTpilScspDOr2it93kJkr9rWepLq++0+QaV/spkBCq1HagvIv3Gc19JLb6vcF3eEABJ2EZTvQ4oQOY7cZvksZAMHNx3ivlgORXPbc7DnEN99OkOmrPiOTF2+2T12+y4Ec4JtvPgEAoGZz0Emot8E57lD06/C8J4EjvAZ3DZ65QzZ3baENUa+kYERf7zEBiMqXesm19dvtMB/EE9JHARjeMaWd1BYnmXrGomVQ3+YO6mfj+JHylT2kIByzoegEFRRzVtOVqUPJHaamxnfh9ZVIGGijz/frdmDXjtKGvXaUX1GOPdTX4QDEbFCGC4IxJ4oiMG638AnIlkP4gEPkZuIQM17tJ6VvJsjMFztRNLDh/g4sWs6RVZ8AAGCsgZDyaiLEE9x4vjukIwAeBUKD1V9vhfKZLBwpFeFLZoTy7gQO4ZYDcapfHIzxP9yAwKuSB/9MfW0v7hH9ktOycO5LzSW4WJUf0scVwDzSCxQukNGpF+ZFUME2rnD0ZRCbLLELxme7oYMrABAzb2xoszMxCtl1C8jZmq1k1V5b5UtoT+4kt7yc3v15vwfjMABiFnCtYU//jYwINSN3/bk5ARkXEqFU/6qg7iN7KqW6srGTXL24DcVZm8en2UeFN9AkBh7cOacAaP6qO6TdCvXVwDhjXPcn8PpzvuIlZMP3R+O+VMwhzuAQFCzHHiBYO7qdmBAD+jtLmMKltG419E731GBsv03ubhSV9JLCME7AJgf86Fe8sV2Z3bStAT0sMIaLW7g1vh0+fx5Wvx/AwBdcv+pjh4zEGoISbCaj5zeTklXtVBQSoaHZ7GFkug4HIEqe3w0Eu5F4fRtAkdNqLfpXBnHT2NS83UU3Q5EYTA6KYJD9zaQ0kSCjajaSokfXo9FjNIg+d0DfFLZno8EKz1wQkpzejOAkYzEzvHFN1xgK2mMSEGiKvWzxFgfG80CZCG3YYnFDSkPDBsd+SAqoZhvKGjpsnlALcgkJGrqVN7jPjH1O7fEq/JoEe+Y7gGKCkDja4XMAiL4MAHGvOxCZMH0NsP4gU/rQyW3a8p3ksiVbyNT6XTQNy/5c/2pAVLzUg7HedspZlehYILLNwkM4LSEoSfsQJW660x3H3VizHxQQETKy6v0T3H71J1BfC9S7h20k6YmBY2ghehaUb25GpZGbj11A4FX2wl4720tQ81GUH2wbwdKWVfnB6IlGRZhl49vjW4m7LgZ6gH67MbmKSehpPTpNMIig+/5kIjBkuD7mvqDtgtdr5GD0HsmvX5RfEyXFC1Ex1cj4RXEy7bldZKh6x6F23bBeqDvgHgSKMIXUx0l/kvcxgw+YJggW27QXlLjhGBdR9kKy63Gl6f79FRk9QRWTvUv7jvFgALDMkWZwCBSZJHTzP4aUaqMdjV02zM8EnPtMeMZzg3FtSYRFK/ofXX79JKOichBfJizaQk2bnpoeXL0f4IMnotz6MzlOJa9COk9IwNLR8IlLYu8CLMhB3EHt75hpY2xd/ERveAtBu/6ldXFyw/Jd5LZXE2TWS4ObcvfLuU9JBkRxbQw3sIwdXRTnKrhYh8kXMMdPKXzveRwHHBTaMMj1Pn0Od0zsEzHnaQaetof3eS1wyFPcwWRxaUA/zoLfvW5yHYML92danKzzYPldv3BZ4EFcu49VDlFpAuIMeMaywcVYw7/sfTmonZxUWTlMRnFtq80djKF34QnwhwfNoA/d8A3hfujZxFYbkVFywJyYZIBoQvTCexyA8XVvOHqyO7iF7hyiI58b5OyDnb5F4u4pcF8Nus45aO2RlPepTG8UZmigm1poPfPgb6BNoOiSq367Ez00b+UuAoNFcQlRhYlLAe3uW/+YoFaigf0awCFEXqa0rvgDAJAkPol8RmIhMi1O+u5jlkMAwCUAuhTYhJkV5xv6cKZxY6bXXcCxT9+nwtJVHaAkRsnIpRtJPlsBvy5jIijDbEcHncYXi0CNLMFhEIZkgMIKEiPPDg6m7glpt1y6ZHMOWgxueXU1boBlzM10gBziHDkAcvu8n8KkbjRLYCOAYgNM8kZSWP2hvcDf7HQrkS/BwHmhz/Wcg5qx1mnDYem9zzLwF6C4VLJyXxFtCP0YBABmxjtGhFoXjOFnVyzdpnrDsYUuf/TCMfOS9ZcDI8QjBBCNPTYZ26G0oTl8vrmNkJYOBCB2pgQErlhlIBZcVv0x2tadbOcvci7cG/j+hDWMsk84UQk9IouVLE2jxCBSQu3nogfI5tGzMNnXRU9uoA516Wz2+xUxx575Dyh3wetZ8PltSUXRb4N6bqWbbor6M1i1H4E+/o1zlgT3q8+oXwnCkPjYwe9+6pnb6nD7YilToWToR9IYS2JjiRs+BgIAyh747lN43odyUH9aCqh3XbH0E5mQe8iVT28j+bDojX7qGATEagBEANvR6oRnzRe6XXYcQtsXEOIqfb2deGtBXPCpjuK3dpLRi1Bk0K+BAX4dOvOxrIhgcoMVY6W9LCbAMPkNESBJplwRGP5XULxHY26mcUva0uZm2o+YauN5/HVy/taAlcCsi4CxudZnWtkyugdYuJG+1R3SLsB2jgWlHA0ZGfuhYD/oGPRwTtQncT3EEDdNAICirLfCewC47gcx8zaMj/fgflBQp5GM3lAbufbp7XYgGgcCYcZz/Vm72gxOiEcIIEAERFFQUjahS818rjAPAgg6f7hbfdognewmkxZsIjcs20VKGvY4i2qiZNTzTWTUvPUXuf3aY8Wh+HoMo+QTlhiQdaM3CSDZg8PImyqZuZlec/m0c3huppRt3Q8OYcaFM4JFxYulyzHT5ljS6NCkAr0c+JZUnIPWz1ItsomZ4w5tIJPq/kCmDwxst/YDnfAU2o9XuRHCwokMAOyE91G+Mx0CANzh9kcv8dLs11EqYnqUFhp3UhSOO0tW7UUg2IQP1MG+jhhAQB9pTt1gFK1/1YNxCMnIC6D9QxqoVKe6ZllWsanP7rRfEmh23PBpgobxkaIoKQxFr4MV6D6cPKgYAfKpzHNtJitzlKiyzcvEv2eB4fz9U8ULWnPM3EzJCWyPoHxGwrU4YYhlbIH4Degiw5jyrpHyhtTu8rgIualvP83+/bawWkk0TFJrgtd/klFZBA4ASvlFhRh7zZIqE291HP+HhJBTXNtqRw8EtB4OtGQdiqt01Z4jBBBdNjnYDFxxI8bei3CG9GbXgCH2/hPK4IAQF3WqW5YgJc+0o8XFJvu1nHG1UYeEnrLoU+NDMWDzmVJQnSMFozgorwBRvAeN2c71DesK1yMrhttHBq9aMzuDzHIzTUfLDOZmmrXmQJMMHCIwKAYoesyMJGq4QGk6ya3gzrRqLwqnzy8qOASIp2fC/+ug36/DgvM41DMH/j+yuKqZxa8HYrgHggEyOfBdDnABB0aR3dzYQ2aiuXiIafizvW57zXS4nBZgfUAQT67bfEQAomTVHjsPZ7gA5uCVLMIZ+vh9ncuvfWm/HkqjrmCFm76ig0xctMkxdfmunAkLt+SQSmAatTEGkBrqd38OAGQ2vP/f8+atB/avNhvgYKZbkeuoP51SagkMx0b/2RPUT8VVduCBKocZEIIjYB96qUnXyCaiPeJeqjvRZQXA4CgKRzO6qcxGNxolSoqU6LCCQPSC8VUqzVTiwtQ0/g+J16ciAHILQnEHcErb9Dd6CZaZh0AUwjpvejNByl7p586Fe9G71jGiJkZjB25etZncvo4BD71MDzcgEKSw2Ngx8g1KAbShKbPrBqVFkVgtKIUiuQc8aEImnb2ORWaVNbQ7MUOFi65ccdxCJ+fNbyI3JRLkvHkfTgCQ3A+D8YbM9AsclO7MlhpDFucHs2g3yH7c2U4mrH8xIPot3K6fP6eb7jMIa09A/wDa/B/koT/ZxqCLBgfDYAd43LK6j0wIxUkx9jEIhOfTnMAhcgvCLQCA3fYZryRI6R8ShwQAeH3jrV5yO4Ls+T3IgezQD2dBjerw0j5o5Px5H5EymMsxNRtzrqyLgI4Zg8VpJ8bVH3ZAYCgu0IqDB0Ndx3eh+yQjo3wqjm7sR/18jF8dUih01hfuLCNQSle124prW5zA4nPOr43Y82s20tVu7Pzol6HB34fyV05APcaeRsqGJzlhLXMFtBNRDq84oBBSw7Tbz1YQ6jefurCVXijWPJ0lddPAbHy9SWZPlp1wvhzWx+RjJJ1ftwOXtBcMwhmSxg848GwWH2Kbsa6XlL18aDiAuEpfA24PIJu24jObJ6A7WJSdasPALRmPOatRSUEwgg6Mk2F8bx85f4MP5nTsmKci5LK1nxIpTIP8Dzsgpj/fAQtwxM7aon9HNjL2pWtLUjaXKS6QPKjChRMF92FQcjOWRuO1TfxvsAvTt9y+FFa15/bYisMxmpcpQRJ0tSmo1i9w+9GMa7CuwfyAEOlbQaHHk4xoCKe49iu3a8DYXWafpUm/yLlXkulVTrb5x+H7l+CzX0P/LgPWS2QUcxQtVw5pIEa2kPLGQxM3vb/XDU9voseVlTZ8bi+ojTnzayK5k1+PsTPa/IzA5XDsPNBnSoCo/gf69jT0N8ZFwYQrqM8sAr2x4o43iXth/LADAp0iYfG14XiDrnkOPH/ZYAr1gCwoIzHyEcPtaJIyFgZJA+bZIXYDS0Dc8eBFatmwlabIwp3pwrxMN78GDVdiNqhjGNYHSmEx3Fu5CJJJ1kMxheoc+SF9BFq5iuepZMbLbOU8AA6xi/qxBHDDDQ+FTFEUmkfpXWriVLS1Mj3fTPdDeRyedxfoSNcVB2Kn0bELYeSaimKOw+WPkYsf1smhMnUO5ark1ia004NY6xgLYm2+L+rwhCPEDfqAB5N/LYngIZKTYUzulFnSh5dljLOwetgG2NEIAIjpl4JI/JPRDWTcks2HHxANnWhidrgxrZKijYX6d3KaShfX0y9MrtDWd0SeLBp4DuV0KD6aUU7RHktVoPJHYUAehz/9L4BhBCouIAbY9oeVz6jbQ8223qo4uXrGDjyL7REjWVkG2V0yEw5P9fhUkg8TWb56PwGhGKkP/wCTeSWeVgRFhiLtUxRVkvA7RXV5fBvPdfuaz54YeB84HFsg0IgwNhAjF1Y15SIQMG1nCbDvimxPqjmEF6abKQHdozAcx53bXElppX5aCN68mihm/RjhDmK8tfYojH89jIsqWzYqJTM2ppsrp50cECUTgq3kvy5be0QA4qZnd5KCNQni9n2MC/fdgyW/M9Jfst/9nxxWc3Chp1k3oIwQokN6OV43fPGhohmUq4DCddM/hx79hibckY824XPRYoJEdSeX49KGX3JLVA9vZ4WEVhtQnoT7wwG4fzfKgcipPBVP6oJ7B/yOAUEACDIh8AECAgOfcoDYHNc9u912Z6KHXLNwx2HjCMIcSkXaxl4HcPAcTyCa4/FtoDlqWUKv2BmgdMICoP8Q+r4EypsyBnQJT2TGjfuMjcokXy1qTDAAcWkwTu6evOawAgL7W7q6HZV6uxRAL1fdDXVrQuLIQM+WdEr6RMwJ4KndwDmEXz8X7nv5eRAYcteVsgT03bwj38IV2utTHaOf2bJfBHDj8naaqYOLad/hqB0kQN+INpspKcnRZgcAiN/DZA5Hgi8Kx5yldEe3O7k0dhl3kFXxbkPXB8xde/MhVngzXTjuk+dHye3vJMhNy3fZCmrjCNBhHqWJZzHRMXwXz28eA0R3G4yNT2LHEkRNV3zd5AIBfvaF6S6+D2EfaYAoWbkX9R6Hp0YjhfM3nAiSxzOyJY9uBu9j4Uj6JxBxz6AqAYpMYlcUSrPpypBWjhfJekP5sKq6qPKo2WatG5rCiPsYBTQ3Z8TuDuHk6febFoG0BEwP1+C/uxGjzcbAZJc3HrpR4bgAACAASURBVDAghhwgdDgvwQVKV8GqGGJmUcmv5Y6vepe4gkwPdAVaToTF4ioYp3vg/fNAfB/AeOwwRAXDGEDFICsXyOCXlQIQgcMHCByDyY+uJ8XAnb2LY8QT3ICL+894vWzjNzV3EG433FdO+y55oJl4wyrNHENFASkYORH+HLbs6qVGFVNQ+rjt9nqMV8jzqc6ytZ+RW1/NLh0jijhFsLLAsxyUTYUi5yHbHjxjIC2CxbnRpPkdENcqD5xDHFAamn/VNbN+D6l4sdNWFIpi7iE8TsDBuECUHv3r9W8834W8dINozpbQ8iUOaRHiLlv9e3herWwDjUxCYncDEONAb/rG9etIcV3bAQMi29yutzS0k7LVnXj+NPRfy0HDzPQ/tzmAbh+WxPkP4iCbVMcrsHb1cS+INk8wOgoNSkDLtm8BpyUueHOJr9UGH/5QNnOPpgsVTRj+OQFd84Z1LxK1S1FzcNcUG1zekBoY1K28oZPI1esRDM78uZvJyN9ss8Prh/lz0+XPSfCVTXRkOzzzDFQKMQbbrP/YAcStr/aS77zXS7PSYdbrshfanWgVOvFxluYHieDa8F8QDJfDuP1IxrMSFK2ZunsL4jfNwsKHLEunxIFc2dirQS6CSYT3cECUoVEhQZ4lrtrogQBiigs9mRe05paBuFpJxVKzVICISl+v7nGUvtDhKArEcrxVEbuH6nQ0B5UXdLvX+H4R1xv0tImOuR5EN3ndQf3u0379Lrl0SRu5+UXuGyeczeAHhYNp5mYn6YYVfhYFUHhwMCYu3kymLt/hnFy32VGycg+Vs0HepqUU3heEonh2AMZX5KAyXFRPgfFbi/u1OAUm5eokmwkPXnMHoxikY3AHvI4lQNz03B6SD8QGK7/NHWqhZlGM1CsKYRSdeieM4QJo+3swXltkkYnd5AI8I53O41SyPyhSNnfghehEd+AlRVhjdOGo2C6H9EkutFTNi7AkafsHCDwf4mo0rIz/5QpqsBhY3JjVBKMmw+zwGrROup7fBHqSOhP+F8DkDsIgQDlDev844fHQw3/7F3dAvQBp3xuM2sqFEyu3MoHYpJ4J97eMTbLM+fWN4GyZrkpaFbwf4wlpdOIkmmK/2eyUv5l+hoh2U8uNfo2EZ9BxnYAnnU07iNb8OXD//vi6nTRbx8E+H+JIAMQdwLZP+FUTOfs3zWTconiuHIxOkIP6/eh8Bm2Nwxh+LnQAiz7QZ+UCpjUwyzBfI+iIusL3Mpd3zYi84+OEtvr/B+N7hRzURrpDes4lQDdjQjEyfeiuG8LDFLO7/BjoYxJwvqlQrktRrgXiL4NF4W4AxC/cfn01/E+F+ndyk6moL2PMv8gOY8ZGaCWeINJL1Daj0ZJlcsbz7WTy4zoZXYtxvPotfBXozCBfWkBhaOo4eJ/CxP1Zphnp1O9DR27i5Ua3EpkOn93NV7YN8J9dsnEyqZH1IN0Aio70cIX/QhTTyhqSU2UeK4Cw9OMMaN8yatkzD2y0Bikxfc6MUze8g7PkAuI1BQHVDwW3Zt9thrIUytdcIf1iT1A9zRXUHDJL7ExzbHnDMZD9mUFlKO7fphmXimEI8J0yZmJJXfC73ZQTMn8xq/k/ISsWg0Dmc/64mRW9pvWf/tvjH0H7dZpYYh+Pi7LGdpsUpDb3cyRTwc1wAqn1cHLDE1V0lqWEZ4e9G4V/ZlnZBOAyBeZz8CnGkb+PFfhizqJQfB/35mMFEJZTSDEe4i2+SosIRB7LbiZqyMAFDFFJssReS/woYcnIwGEArQtW/nXw/UMg0hbConOSOxg7cdQ8PB+QHpdGJYmRj/6dlK3qIJUv9ZByCyENMUBIcKTkSMRMxUiQkMQRLP5oaehHfIfbCQgGoCFS+waZEGqlh66kDEmeBcQ0ai4AoppGak3hDxZnMRuVpyAqSyy0cfys0elk3x+jY8ZvLQ3PvIoxq0gvEPto5A6lDQcUnH9EAyJdP7LMvySOwxVBSkYctklUVl1A3wqvFbeiznKHYyAyqyfIIdXBNiSpOEEzgxT70W9sL/Vdm5Vm930ogJDNNvUbAB+sGMDOSiTsF+KUrJjnmWCGFZev+WwX6CTX1X+afq7R8ay4tpUGnhcs2oD7At/nYkxWicqSVitF5GNKLlLyypbJ3i1kQXzdx2W/Tk9IvwE3mSYsaaWrU7aEdKwAIv1YidxX1uwbFq+D5NDTXpCb8STXX8qB6CRvIGLPD0YdebBaUsMK5wIFwW10n0P4P5W8PvjG4xABcUiKZC4ICdm6IDBaqs5XYidJgRY8VdZ2xcLNNPYk7VW+spMUBVtseLqmxxc7CSpTBHsykTzktDNDKf3GQX0GcFhngGV/45JQhEwIAJtbsTdlNNgXAxDWvQMhRnFLkiW/q2T+Fk2Rn8J9gayoXx+7sOW00V97G+qOG46aGHhUDCCYVr+LLjTIBQYeFZzNdZgBIQK0EgYXCRj+Sqgz/PK8Jz8ila/uIhVrukn5Cx3ZeR/jMVeYohHZpLd230RlQv48yMAwxSe2u8g7wzoIYPja6FqVTKyJ0/Q4+0dIRzkgLO4UspGBT7hcCPd1lgWRx6C/AZ/fB6+v8igfoc8ZO1wT7hPqNlEFuGJ1H139MTkduk4f6HUYACHo0MIZhaRicMj35aB67WjfBjKqeqPt5heH5p1Nr7IGnqhs8QZrorLdZnYCAQwzPaKQW4fGDZKSDdBYB776JbgFKw7InjZmvkrI/e+Ty5duoYEz6a5jBRCWJAPQD030g5tBrVYgnp4GExcr+lZ4v0AO6jMLwrEzXEIJptk7NBp7XbLic84BDk2s9SEDhKIncUXJoktIImNicoAW3lslTHzhj52GvnowDvbR1c1Ze1MkXakSlbmCkQuoyVTRN1m9YrkFSKRy7DMAklTMzyydESbDPqtvDddDcHJrQfE5E+5kXLjVUay0kTlDS2X5KhcbUJnqS12Eq7n24pEECOTSRhoazMuUvBeA444HjsdldjLQL0DEHTe1TqWyP5pCR1VtxMApdEa00Zy0q/sHTQN6MC4KCJogTLufE2Vv+rHPvgja4h64SQfAyCYI8DefyeiPF9QfACCcSlOQBjU7fGbDjCQzhhi7s88lEpW5/Zpj7G+byZh6TOuojsd9Bnj4Bpke0JHcMLF6WRJp9YtOGIRv/NaaZlHfAXWq8D4oBdURLl+E5FfrNljl7Dcu/zyr9loAcTbU+Y7p2KWlLRw0bwAYzj1SAJGUhgY3StnqiHsCH8J4LIB+lbmD8VPzfXjWBoZ3xokngG7omgPF3WwSQx+adhuA+J2kZB73oRarWMitlp3wfruMidkC2gfAGZ/wKtErXDU8QCscwdNh7YWgc5as6Dh4CwJOTnE4jqCwuYKqw+1vou7ieaHWYbCCfQMa44cH/xkGQIPPP4b3n0nMAc/CLk0TGX7HfGH0j+GuyzRSTa93BaMVBVWtdmTvnmpMZ6I6MS1+acOerOOQLYA4DepUAHDv0ZjtgP731EV7B9q9Hu7zAAxnHjmA6EKvASynwQr3f9DW38IKN27SIxiPrlFnTJdvA/qeOUE8cpSuaLfNpKlneg9Z6plsLjxJFXOqAvFitN0/YPzTjPvQC9DKu0Bvr7uDWoMUjM4HevmpR4lOBy5w4ehqlWYmLMRDOf00IYPDA8DEAK1DwhkxmOf2QB+ZWdcB4IjZ0BfJ44/gWWdUTs3z0UxxX4EGXg0KzDeAZd0rB6O/g/IIrGBLoRNL4LMaeP8wdOYXUL4HaL5KCkVHjpvLcgyhc5eEqxzUPW5B3Dbe30JKl2d3aKO4LIBgYa4BHs2WtmjGnXr8MkAc/AEc4mUBBC042QUwwSz7hpbjDUXtaBK95dVu8s13Dn9EnrgQEMW1mwzrlTzo+GdZ2KmiTIykocvMp8mLmdmDW3GvxInOjyBq2me/0UOmP9PxrwvQQsSVr+5DV10yadEWx9TlO3PwLOS8R9+EBsZoyhlssMwLsnTWCRZmKfFSAL/1LG4D5V2jYY1eTLIFekslP4l0/9rWwwpL0pVDkyY0Zkqa0J3LEit0O5EIRTncF0v4INqDbetxUo/Xl3vIjW8dvmCkbK4K0FegzQ7L+B6E0s0KzGUlqxPmtpcCAFPfz153+Lhi0pV0UPjqHhsQs4NPYA5MYA67GwNjfMY6g7/ttd2MKVZeObIn+fh1/Dp+Hb+OX8ev49fx6/h1/Dp+Df1CGb/sjQSZ8WoCfUAwpA/1BQe8dpSv7nJUNnY7Kld32Wet6bF9DX43Z91+7Agev45fR/LFTt/EpLd7WdLboJ7r8am5LmUD8fojNPJN4vmKvHD3BjeSi5+iO4O5RbUtznJqJRlkd7mxWxR7RSNNpTmsorF7GE+rKV7nlFPrVm9Wib9Yis0enpuo54Sk+sw6c6E+m6iTZbJI0Fyq3LKR/B+jdHPLVa8Nf7+/icioF+mLveJ5w1I+r9H4PFe0r4Ja4XpEsZuWsjSF9ZVn7Ns/kzKL66YnsNp5/zO1NxePKajk5mvL/NqMeWjMNBdG3xzsu+7k3x+KMoDG9rnEASml6/AAcd0hBzWnO9xC7eGY9FZSms/yKpECOaBOBEBcDoC43KOo44prtRFk5h9pmnSMfx1dpdrH1sadmDku7WCjm4Jft7v9NHsg2zvgaTMliw3axWzPtqwAARMgKZot2Q6evk5qJqYnjrbSxGcyT+cpWf5H/6voxj3f10a84Q/JTc/vn1Mc5qSavjZEXP54Ur3W5yXZ8mk26zbaTr7XYkvebxlYzP9KCttM3R8fJrQkFtdGiSek2tw8+/e+7RTjw56HUWhGJhQ2v7Zs51dO2bfUzzsYJUUbkgcA9wEmL/iYXFeHMbLxXNmH2+AqkUMx2R3EhLf6s9DIP0IluMMbgUHQ4b0G7zfgzm9hKPYi/O7JgtpYObn7LeLBNDPBqLP8953kjj8l9tkwQVsyDhaUCTBgz0DDFsr0kBC9jr3Wnob7/dDQM10pznROdbFD9+iAjoH/NsI9jPXxOhfxOh+D+i52sX0R4Go4GTTF49nw3VzoE/ST/cf4Lzu85Bk8t8zlbzljwtK/Ezzcb6ibQLjgFIbbyPiq9zCZ2LlQX1BmJ90kPU/Gtga0ZXB/GNp1uhyggEBisbvZRpUM382Ddj7Nfjvw/xqO5UKYoxORGHEzb6jX5b447iPZPTRnkToW6pwP7YTnafs8Dz5fDPfHvWEawEX/X7ay3cbmVzuXtiV5fsVcPAnzgInUaOI63rfr4HVQYiGsA8floBXehqVw/yk8/8QkQCBbLgwBUfhh0Ot0Oya9gs6M5h39SDYzJfDoK8Mb0XhvHlqob3MHomtBrJrp4inhJy5pI9MaktM8AiCcfMDuGBDJZWaRCOgRaOhInsxqUNcKzLDHAXGNPMBz0lLnTqjvMg4IhwUQY2SaTjNVgivNcElnZ2nTLNP2G5ftHqxJSdec+gT6Kdm9bOf1+9Z6Uz1Tps6O0fM5IBAMTs4lbpKpK4yW5r9Gm8eiaFsU/mTIByze+lqCSH41h85hQHssU1s5PewGDoFHIJCpy3aQ4lCcAwLAa4YMDJyLPTAP13BAnMD79mPjN5lSqx5gsbThr/D80wxA4K4oHvMEjbW7fC3k5IdabfD6LvjxRsN5TzEON2GHD9L8TDR3Zq94L7MUH32mh6a2fULdJj/0kJQu77CTinVk2tN7BgACcw3ps3jDOmR2fG03e00/ewsaegHnEFkDAp5/GR/Mz5nXK62zk9fZBPWNZ2xSp4CQGCAulvEgQ/a/LvE/4//84HUoL+XVRDC5VQ5NbjWE6+bnOknxkhb7pb9pzYF6NspmLqwBhZ5rgO14H9p1ruAQ8N5B3RgCdBVt4X5inQP+S//PvWSfgXYOwzEZitiEC2RxOGqb9vBjoDM2nQbj9joHQ8e+7cVUNTTMtxkWCht6J6BI4gbRlc2vlgf/7+Bz2jVgLlSYh8lJgFD078nsUMn+VPNwsIqlDb+H559iAKJyDeZZ1Wx5qCT7N+XS1JLGSaA0poAFqCSdC6f1ScI9N+k7llBMZr76FOHlL3bV4nNKVuzNOe+RJsNnyOQQ+hzOIXplca6cyZH+Ag29EBtbnhUgegSHuFxmK1KHZUXotXCdS1NwCAREq5wicN3MLkI54TZYda/Aw93hM3u27iaonE5c0GobN7uGFAVw5aZEYtSbtIIxl2d8DeJpdLhFZHLwVfR6+G5T6rgPTUTU0cNcPKEoTew2rf6zrAFRsqILOLuWywkaF0eRAEykH7IW0X5dAIJ67Cq6EJnyeaLqVPMbE9zawiHukuk520NJqrZfHEK0YW0SIEobPyfeug/Id7Y8TPKV5m9LZryDkfLQkuGhhyeuMn3T2WB1y9aDzPkJ8fg/4D6Jqc/tegJZKXzuRC9WvEDGPGoAwTlDv0VsqnPTXKpaTuXq7MzMpQ2f02Ny8QB6IJJllnjnfWPMDwgQRptFmqD/ury+hxSE9KwcGFHPKQq32gqUJtso3x7Mrvg8d9vvThMMdrABYXAIKUCTbHenK8YiZQYkmWed02Pb0v+Xcwj83WoDEKUrPoPVKkZZW36NegGLwdXYgYgBEdMgAv6N1/hAzNgQkShLp+cHCF2iz8zWofVbVtXdckCdKgeaYbCj9qnPfQYyZstRBAgjTleskBskpeUUd3ADpp4ftF2UyGp12/jlfwbdoXkUtOMTIwQyVcbCAwWESOzAohG3eMPRU5FLZArDFdfs5/pYRu0gVaavhP7qZmqilDL9wQMES8Hz3wNjaNIVK+fm42a+H/T/hg7xJ3j+qRQQmCvU7d9ICqv+DiuB+jNLOktrR3s5EDCB7j3w2cXukHYWENPZUDBz+Feh0inwn6gZzWTEt4rIOewgHpOKHc+lJkRFP5oAYXBJnjQMQ1B/KbOjvXIGa1dlNbqnq048WB2I7H9lkVLRTDV5cAFhEZ8kmsdUneby46GPgwNi1soeMmZBxDF6IeaR1av5OLKcvxmT1x0YIKSg7ixA835QPxt0u4n5Qf0KuMN3+uUDS35InwD3aTKGi5qiupWLd0J9v4Xfec+rbro6VR1YNz5DDun5mGoVU4byE4TQzh1F09h6Tsx9RlQbT24Mrz+C15PwXAZPiMfsBnXm7o3258BHeF5ELvxXnO1Fs/FJyXlZW9Fi4g58xib3KAOEAINlgXgzrwaD96M5mfZbKJGt6CUFdS2Oyks1mxeUesnIVpgmJc/BEZmE6Ir31Xg6Z+mqweNMSlfstuMhKx7fxq/CeIlEB92Zcu8eDEAU1rY6rn92B8FEdFJ1hLjmN5P8+RFWqlmRYby9NdQQg3E0mAjjPSHB8LYIMbEL6PM/zqtaT0/APeux94w6aOF1Yl3X1u8g4xdvIzci95TEGXMBfbTRcTOVh3H6J3Tyhyy+QbWPW9iCB2TzHeFeeN1OvrnwZZrhrSAcOxkasykpZFRk6lC0HS5FLXGxBMv2oxAQAxIzax+DGHgDRtuVrPo8Yzr3soY9Thg7EJuiP6Sr10BWf2g4hJHKh1n/opOKwvGMMSc4p0WhWA5Xpr/Lx4tlDEyfOOCgAGL6qnY6hl/9dYRM/GcHOW/Nx+TiVz4hI9dthbKNFun1HaT4vvcwKA0X8ZPhue+J/rF6NaHHdsOifScu2uc89UHOCEsdrGyFureRafwErOtWcmsh7uqyXUbNxfcAhLnPfAgSsl8vcdFExppz2vKd+wxk5dpe4BIxu8R2exvYfgUVB0SAOL7/XAqqd9FosIDqOEoAYc2eLQwMBteDsgzHrygcG5ZOYUW3i6JQSy4njlWyJWudkc5H0ZNFp/0ABE8TlJCsWe4shgCZnSOHqefJzDR5iUpW7LXJCqzQgThy+6UGcSlCPjdSviSP0UEABMwdBcQcoKWb1/SQspe6yQwsa8xyY2M7LCpxKtUAKE5OzSFoX7sBDHeiJOMNx3JuaNybVA8tUDf66VVaN1fHVKtoT0cCmiAJQIjNExMQaHuezYGTUxiKkVmr93VbwE23SUva8DDGU/LC+ogBZWR+WL+wMKx/eWyYbfEfDYAwLGYDXyuG2AQTEj3HHYwDKFrsc15OtjjNWd5HigJREEGaUV+bBM/fbJgveX5byQyk7z8QQCTpfUJ/Mzk9vt82ti52Evn5P8msNfvuSZS+uhfmDg+yoco0jl/cUKaFldFIFGGkETqIgMjuFKHSVR2ELbwACM4hrIDg40A5BLoclWSh4xkX/JG6OkDD8jnxdxqrgGlmTcAEzCU//gsZt6iFSD6VXL2widz0/G6e7rCLzHqJrY5Tn9tF84G6aKz0vqW4NkZmvLCXlAFii44GK1NSmnWqTyXJ/dTOH4zeN7luCykIxnKvXrAtqT0zX2/HsWWHSyrRJzgYBFcQViaLZc5IzrsfIpORRM4ACOPSZnZwKHfhwgaLmq1ywM719PrPyag61TZqER5doP+Og7RTMoBm5T4cFIcBEEhzQwEEOu9lDQh2NgQtF8DrTXxi+gZo7dTUCJPwZL4v+hVPoDknX4nyfKB4tKtKpqzcTK59djsleCTIvHAUCugUi+Kk5MV2MhNWpHIo1pXpqNiHMAl1r4z+NcIEbSQK0xKXLdn6CiEPEXdNnLrAW9tTunyP7aKFqm3cE9oJ8Ox/ciLrFaCg7/3RpQYAlP0HBBNN6X8+gNdRnjLfYjqn9a+V8QTXgGarWGXusmP2PnZcFz1tFcXndzl4mfmdPoPW8QcoW5ItO8cQIPgAQImcCA2czwehSzLBkOBKSw9fIT6D7xXo8NXw0H9zh6KnFizc6BhdzTwe3TStPiYY0GxY7/X129N37CjYqZYMk7G+HWTWyzmB9fAVU0zCx5fVbZ7hhcGnJ5lyW39p3XYyfkE8B13lofxYZm4PXOwSyXi1hEvRJeEWIh0Ah7AolB9CXd/HvQ6TuxkrPJ79cRmaGEsb2o3xrGjcgxzMgbI5EPC/c+7SwwEqgLbLraioaP/DEPuONUDc+lo/PXAOT/5xB3WPbKSUpIPBWKQ4x4F1ok/I0zBI7fDAtfDdL2EQSuH7iwAQZxXUbqPZNvDkoKLamC2dSfJoAITFJWVbni+B7s9vW6wa/eZ+gr4sbz4egKg7xi9qJbjxOBG4o8sXdYx4vAWJY7lFROq3cII3gXicUsAwax6AyKTzdKNa1Lsgeiq8/tBcyQ1xCrn9U2jpg7lx3My9YDFmwe3Hk58iw6HPa0yLIx3DLn5/FH5zuWyeA33sAQKvGav2kkJYxYqVjXi65b0iTyZbITQh31pz+mNn0Kmrl29S8Ux9+k4Z3cMD+g8AXPnemqZh8J5c9GQzmb6Cp1dvTOXtegQDIqALS9B2t0LzR/3EsnomLGKJDkR2OZ67hpY4ekKoojo5972amqI5EYn0i1Q3U/QKb03cxojFsGDtNyD4Sq5LIRUPaP+14AxJFidF3+KB70H8td3cyABR9kKHg6YLUqLXSyxruOGnJik87WdQv8WjNKM41XJMA2IWTZ+oogTIaOVDU6ZZY7eI5vJjXtkfnSRbG62icmjXq4yzZVqPU0IO68+Dr+9OB+U8KuWv0MKQL+48ulPDRfwowIQZmr1XUwk1EfAeOySuZ+XnJS9HHeuqau00+XHoCotRw6hiVlXZAMMZnJnuH/iCetnSCwhb9+A5x4Ah9Aj8OzzZSX2ZRlFXFOP4GOLXE37X+xPQSjmmFq/g0wGMffK+RFMFmdRpk09Ce5vuEMtX3X7muVjHhCVNGUlRmOB6LQwRsY8tR47UybjQX/0nC/u7Mc60sMVrT7G+s2jjfik4uR0UbMka6DqCenTChdESF5NxDbm8SbjuUeNUs0AjufiYTa9k+BebRCLRbmW8DiyoDYckw7DZzmeAN3RvwSe+b7Y4ZaTdrqjj7qVuGPCkq1ENnZYDxwQMgZvBbULJRbJ9qbwP0v2RdPfkhQaBedw04J6jlZoUZj7OEcR+1L3egLUdIz5fWPHNCAYIXWTQoyJQGXYrzrRyUr2b4bOqLfDA16QA9RPyfBmlUyQiBgJ49wIczdXE/EDe+Gz2y6pUsnY2jbHlKd30zOrjwrnPnOndyddyQOY9Dk6TbYo17JxVICGGahvdbHUmCe6wpTgfiHcX4QyLTHiSLj8uktm4Yw2sedzEDnEeTKNS1Cvly36iWS6n+yBz0rcQbQKxpyYyh4I92u8H90DlOmt8LxJ1PHOH5kIYxg95gEhHlTa0E6uXttF3ZSB5ebgIOTN/Qgn4Cp4/VMZQwAVPL5Xa5FNb0EhWnVbgcFXGL4aah0gbkxysxSXdpyIo2FjzhCZAtpOyiHoDql+OvTrTQ6UXuazxVyj4b64oH69fUyo1THu/97NgecZqfm5/N7H2/UKjCkN74TP7WxFPlgcAgGhD8dM2BfObcKxaEtSrs2NurUYDVdYQ2OLz4XysjCo8Gd3cv3DV+SLD/P6IoJDfDEAIa5rn/kEOtMMHKIJgZEj+VSHm4WUknyQib3VG9HD9Xp4fw88PCxTL1YBBOPcs4Q5CcLNQf/TmOomzNbh2B9AZBMxV7qqfYiA0LMEhL4Tidfjj9tG176PSvDdssUzWPh80ThzRbtapqupWmbdmeYyfDdXpm++OLyeeKhjJfUnO6iAQNFNom4LeH5c9D7Lat8vm75Yre6gep6EIp4/eoVpWUr2YwOi+lY+gKZY+fDYB0QFT8WCOVexlDZ0OItqW51SIOqE1dPpCsDqpfDQRb+e6wqqOQVz19M0NNjZMbUR9Io8mzuCrTG39k0/f4uD2S4QE2ZAwVURFLhUgND3BUSIAaL0hY6MgMB+FIVjdiaG6FfwgUoFCAxbnEBDSAPZcQgZA1a4BQlNlrBAjJLQuY+t+Mwawy1F8PqXboW6Ti8YIIIIZXob6BnDEWBjl3KR6VBwCCTMEGYg0U9HghRmX9MIQF8/lqfQbBhPccB0DVCmX4HF64KC2lbirqKAGHdMA8LF02+kLehV+GQbyXuolYxTNpEZ9R2kbMUejDIEIQAADB5JREFUTDFDAZIXUp1FdKBwRdxwJnz2Y9Z5zh0U89RR7gxXz6wqGnpUipjqOXxwTEAwKw7e33Ep+kg8JsobjNkyeWqWN/ZT8UNiqVImihjgFID4CDhDMXNfz45DICAY59EwNQ+MjfolmWahsBAR0ymwj7ibOwPKW9yvSATWdPPfP+QOxHNQfJSow6R+CAChDUdikCjY6P0lRsT8GeZ+018AvIVcz+uzKNNdfBzuA1DhApiDLuFfFEBgCo5yKDdBKeFlOpSZAIgJ8vyWHHlunEyrN0/zwQgwzCAxY1kHKQ5GMeIutwCAkRemZscVFuXasjLShv/tEpBFXYqWC6+dXKmsFPK4bPrd9HE2D8qfJnPTpH1GY0favpSAou5BpTcYwd9W8Do7BSDMTTQ8zCMiQ0Gl0z40DgEcMxThOYaiU3kbeziRibZjYoNmKDsH7Ex383EpwH57wkYepUMECMZ9CvwbUfQt4TvhfKESJ5pqO6C8Y3Frp6Z0Dlwt369OcLP8RbkgCRz7gGCrhz4cCp7+0wplCy9tEg301l8AEeHCMTAYheGYLdUpNaUr9xC3D0UE1eGpakYLyw8l0/LSLxkH5GkJYM8fXhdN2EfPbcJsgE7ZTBmzbYAbr9XkN4MptM22a5ZhOs19PW1vWd5HikMx6lcF5VT4/QI+yd1ywACmEAMa3eh2wp6dNSBk5u1rpys6ABRAfQ7cX5eFa0vA3FiTLDoUV6Z7uX2/AQjl1DE+lXCQH2JAoFdxlBThuWsKzq8RuCX2RQRIRCCYoUyPqYks0t9JkNOq3oM6YG6/CIDgBHku3VizBPUYuoCibYeOTJXY7064+Kko+cZbvUn5lcoaPoeVmfrrOArpiqf+Tk7mEAkTIPoHriq0Z4OyDuIHTYepqC54zl/46torDQhdhdd/BPHirDHVFHQ53qfWJx0lWw7c6tLaNhR/MLULToRLEKnJcVhKE16fXw5udpqpXbIHBLTNjvEc4158m7iqWpFT3GVRri0bllqvAAMHCRer9BkX1WwgbW8mCM93dEgBQR03Qewt9FMC+n8WN24Bin5mVUo2gCBBgZ707VEw5pIfU998QQBBByykngaNfZ0TLA4OrhwskwZb1Z6TAvGT5GALyv7DPEEg/JBuL23YYy95/jN7MeoT8PmUZ98mpY9sRaVWtQJigA6xisu0uW6fZvPOVYnrN024Q6oIvxmTIDWLr5D2BLpDuFHMCeq5GNVVsqrDWfpCu7M4FM+V/KoDwV1YFT1L9uM5zdx8aGx2WeVi7cdULg5qDjy8cCiAGFfbas8HQHuDAAzclQ5q+dBuXRYiR+rkBMLChEcNj8R2XlITsRUuNtJtHlIOMXFJnKDi7AnpF8tikUoRG80XDcFFXwdlergHuS5mN/RH7F8IQNAJoZOr/9xqdhO++fyOg1XrCcfOyceYVjS9gqzuqW0iHl8TzeVKN21CG78K95VWk6uUZPemCbR+4w7QqDrnxMfbMEbC6WI+NHfwVYp7WJp5ngzlOKivAgXwWvTUlOlxwUzxR7FjNNrblejXYBLeYbvBzNeI/9+UixX9A09A99Az8hTd4WIrZ9aAKGtot+O4oS4jM6X8RMncue4S42UUNjnCcnOfpGwCpTxG3eZdPv3QAyJIRTvqiewNqw6o8zkhysr7gJdtGvJF4xFK2EEtJ68GxS71iwEIN5oQ6a40KHrMXNppDph4kJFlYj109AkQj2Z6ApFid6jZ5fY3j3WH9FnQeQX+/yEfTMPsargBMGL8FDoxCfcgxta22W8I7yTFYTx9FJ3mYl+F718VhMVdHAaAgk7CFhjwepwwGMQfYJGpO7r+Mpp1ueIodtQtiq6hj9zvpvlqNSceaTulfhfNQZQtIHDjD8etoqGf6hMyC/zBnetOYQiwEJpQpnuY7K5NoCJdULOd/vAGAYZDCoiCcIzc8NwuMg64uwu4okfRphsxGcng7bfoOU0wnxPEooHE94UBROnKdiDOVlIQiKLVp4YTYKfBWtkA8eAVRuxQtkNpg9ICn8GdnjOdMDbmLIqlbLodY1nqDqHIozpvep5lfyhtpFkDHSzOWpuJlhljT4IHzFhErz7JXM3wN+1YLHsfPC+URT5mvxUr9F+A/Q/nHMpRupzHLazqGDIgKhv70DHOjqsvlPMk3JwMCHcOM3BGgAHuz7r90dNl4EiY8/Tap3eRYowNPsSAKOUHlk9v2Es5qUeJnQZ3XXBOc66SzMLPkwfeJqOqm+3jF7SSKcugreHoFwMQeF1fv93G5WH05Hyfg6HLIvaI6K4+YT0xCh9MTvB98gAwGD46QS3iqdUu8GAsdUi3CTdw7BxV/nwttjxflJxb9dG9LpN9iygtQw9hpsHkRFTcUtLHN8m4v44gZJFtTtsO/5suvFEn1cVIpdmGIQMCr5tfbCf5NVGby4eTo93N+zxAuTbEpVn5oETnK5ptFt9LwYzchxoQRtpQeKYXOHPBg3/D591jOBuaopNQpveAnvMtlppId976R2ZVLFu554sBiMqXesnlT28leXObybTluGpFJWj4PwyTpZERQjN86nnp46IQz+2aZLkQgyT2Hlq8ij5W9qkgouywF4VbjFQoeC+gToW6bUx4A6lPJMj5VRt+ZYBB4Zt1ish4YVGSzfhepqcEBJcy9JZu7oS4xaWoU/LRVBpQbQVAGElxGfsJiNIVezFklivXqgee08TB18uVa2HPbwbOlIeRhEIHwQtTvvyrADFrbQ85/cEmmlACCH4Mn98ekwMbyvSf5EDsHE+oBY9EsM9+Rbjqd30xAMEmppuUvcBEmCnP7kAT6ghorDWVjOHmLQnrj5LkOWkQqPhciDDw3R+8YX20u04nVz3LAvBvfy2xz/OnA3EVhlpspCIOiupGFJ9mQYnxNiSsbTCep+gWkCYlRjBjiJluMUb2x0l+4AN64tHAZF3AKWz8wBS0wsS5Y2Kf6eZA3+/EzbiKxm679b9A4DaZHjwfQ5FTkU0dyNhHgft9E5a+A0TSlgRE7LfMvV25mVZwZCuYMgCC579iKSb7ZTM7RjNz3UjO+D0DxCc0c8uByDAJz49gRM3Nw+z5QMxPcWU6F72SjbamAYRkpCul7dCt2b9lM/t3PjPtaj3iP6kB0ZMVIHAvjCfXo4CQTLFeSBCMU9M0NPvt/t1FSho+J5fWw4rl08nYKj13av2uOQXB6F+h4XuNlV9EyBk6hZHa0ZDj+edvS3iGQUgbhr4/E6tayHVPf0JmZzijAPcTxoXbCJr6iu/4jHir9a/AKvMg1KcK0YjvjVitWJaIPU2Ib0hQf/Qo0cqCX7eSUeH3QFRRSWFtlCdYS86fhOdOYDp8KRAdBc/YZDwrIERCWnbLLKV8EiAqViSoPkJNyUp0OtNrrB7AlLCvwv+W8kRc5nN7cBGgHMIQM03/rwQHUxPUO9yltGH9NreiOXj+U0wdusXijpGwcEhNCoJeY+EQeM0CQpoQiJPRIRWTypXyBatPLDrw342g5xRCwQwijuToxk4BCHTui1ufa7ZXj4nzIVDaYDmDqa9avrlQWttKxykOYLiceTNnxyHQZw33VjAvE+5rDZwvoYNC/+/iY7B/3q6lq9gG23Vzm8iMF5iLRMm6BCLxfJjUb8t4glBQ/ytMVJxZJAwOsRnY0wcg+z8DCuvP8kO6K68WFGUqSgAhrNlOiqEDqXaYB14lwCnYjrBKXOitGdDtY1ftxnSRGIb5O3jmy1CnJguPTRhoNyri9LPoMwCg/4TfjL9obgv55oMJegTVlc++S9AXSiiYAy90Q7n8/k2kqCp2Bjz7J0Acv4H7A/CMX/PyEJR7cdWDwU1yMESi8QKhFigxUqi0nOJRtFJZiXzPraj/jnd4fyN8fhJ+PyvVLj9VdnHzTHtAMp+H5QH4/GG4/1fxotjJZet2E2+YGgPszIUexTvtf2DF/z/8Lf2PgnWosIDo/w1EfQoS9kDPAhwDmiklGDsR6vqa7I+AvqB+U/ard0KbZxQtavnypGUfkxmNyWMF9djyfS0gckWHQ7vugef9VuJjJLFnPwj3H+XBGE3nHLhk5V7CjQ5nwW/vh9/eL5njiv2Dtqv3uIORC/HILliUB/VmZm3pIjz+exi0HeZbe9CYL2MMtPuh/+P5GNgHr5Vd/x95D/rdMNG0xwAAALRlWElmSUkqAAgAAAAGABIBAwABAAAAAQAAABoBBQABAAAAVgAAABsBBQABAAAAXgAAACgBAwABAAAAAgAAABMCAwABAAAAAQAAAGmHBAABAAAAZgAAAAAAAAB4MgIA6AMAAHgyAgDoAwAABgAAkAcABAAAADAyMTABkQcABAAAAAECAwAAoAcABAAAADAxMDABoAMAAQAAAP//AAACoAQAAQAAAMQAAAADoAQAAQAAAGQAAAAAAAAAR7N9jAAAAABJRU5ErkJggg=="/>
      </defs>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SEARCH BAR
───────────────────────────────────────────────────────────────────────────── */
const SEARCH_PAGES = [
  { id:"dashboard",      label:"My Learnings",    icon:"house",        type:"page" },
  { id:"sessions",       label:"Browse Sessions", icon:"video",        type:"page" },
  { id:"past-sessions",  label:"Past Sessions",   icon:"clock",        type:"page" },
  { id:"schedule",       label:"Schedule",        icon:"calendar",     type:"page" },
  { id:"profile",        label:"My Profile",      icon:"user-circle",  type:"page" },
];

/* ─────────────────────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────────────────────── */
function Footer({ onNavigate }) {
  const bg     = "#ffffff";
  const muted  = "#5D636F";
  const text   = "#2B2E33";
  const border = "#e5e7eb";
  return (
    <footer style={{ background:bg, borderTop:`1px solid ${border}`, fontFamily:"inherit", flexShrink:0 }}>
      <style>{`
        .db-footer-cols { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:48px; }
        .db-footer-brand { grid-column:auto; }
        @media(max-width:768px){
          .db-footer-cols { grid-template-columns:1fr 1fr !important; gap:24px !important; }
          .db-footer-brand { grid-column:1/-1 !important; }
          .db-footer-wrap { padding:32px 20px 40px !important; }
        }
      `}</style>

      {/* Columns */}
      <div className="db-footer-wrap" style={{ padding:"56px 40px 48px", borderBottom:`1px solid ${border}` }}>
        <div className="db-footer-cols">
          {/* Brand */}
          <div className="db-footer-brand">
            <img src="/Container.png" alt="SPED Summit" style={{ height:26, display:"block", marginBottom:16 }}/>
            <p style={{ margin:0, fontSize:14, color:muted, lineHeight:1.7, maxWidth:280 }}>
              SPED Summit is a free professional development platform for Special Education professionals — built by educators, for educators.
            </p>
          </div>

          {/* About */}
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:text, letterSpacing:.8, textTransform:"uppercase", marginBottom:16 }}>About</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {["Sessions","Speakers","FAQ","Contact"].map(l => (
                <a key={l} href="#"
                  onClick={e=>{ e.preventDefault(); if(l==="Contact") onNavigate && onNavigate("contact"); else onNavigate && onNavigate(l.toLowerCase()); }}
                  style={{ fontSize:14, color:muted, textDecoration:"none", transition:"color .12s" }}
                  onMouseEnter={e=>e.currentTarget.style.color=text}
                  onMouseLeave={e=>e.currentTarget.style.color=muted}>{l}</a>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:text, letterSpacing:.8, textTransform:"uppercase", marginBottom:16 }}>Connect</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[
                { label:"Facebook",  svg:"M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" },
                { label:"Instagram", svg:"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                { label:"YouTube",   svg:"M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" },
              ].map(({ label, svg }) => (
                <a key={label} href="#"
                  style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:14, color:muted, textDecoration:"none", transition:"color .12s" }}
                  onMouseEnter={e=>e.currentTarget.style.color=text}
                  onMouseLeave={e=>e.currentTarget.style.color=muted}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d={svg}/></svg>
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:text, letterSpacing:.8, textTransform:"uppercase", marginBottom:16 }}>Legal</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {["Privacy Policy","Terms of Service"].map(l => (
                <a key={l} href="#"
                  onClick={e=>{ e.preventDefault(); if(l==="Privacy Policy"){ sessionStorage.setItem("page","privacy-policy"); sessionStorage.setItem("showLanding","0"); sessionStorage.setItem("legalReturnTo","dashboard"); window.location.href=window.location.origin; } if(l==="Terms of Service"){ sessionStorage.setItem("page","terms-of-service"); sessionStorage.setItem("showLanding","0"); sessionStorage.setItem("legalReturnTo","dashboard"); window.location.href=window.location.origin; } }}
                  style={{ fontSize:14, color:muted, textDecoration:"none", transition:"color .12s" }}
                  onMouseEnter={e=>e.currentTarget.style.color=text}
                  onMouseLeave={e=>e.currentTarget.style.color=muted}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div style={{ padding:"16px 40px", display:"flex", justifyContent:"center" }}>
        <span style={{ fontSize:12, color:muted }}>© {new Date().getFullYear()} SPED Summit. All rights reserved.</span>
      </div>
    </footer>
  );
}

const RECENT_SEARCHES_KEY = "sped_recent_searches";
function getRecentSearches() {
  try { return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]"); } catch { return []; }
}
function saveRecentSearch(q) {
  if (!q.trim()) return;
  const prev = getRecentSearches().filter(s => s !== q.trim()).slice(0, 9);
  try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify([q.trim(), ...prev])); } catch {}
}

function MobileSearchPage({ onOpenSession, onNavigate, onClose, sessions = [] }) {
  const [query, setQuery] = useState("");
  const [recents, setRecents] = useState(getRecentSearches);
  const inputRef = useRef(null);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 80); }, []);
  useEffect(() => {
    document.body.classList.add('hide-bottom-nav');
    return () => document.body.classList.remove('hide-bottom-nav');
  }, []);

  const q = query.trim().toLowerCase();
  const sessionResults = q.length < 1 ? [] : sessions.filter(s =>
    s.title.toLowerCase().includes(q) ||
    (s.instructor||"").toLowerCase().includes(q) ||
    (s.category||"").toLowerCase().includes(q) ||
    (s.description||"").toLowerCase().includes(q)
  ).slice(0, 6);
  const pageResults = q.length < 1 ? [] : SEARCH_PAGES.filter(p => p.label.toLowerCase().includes(q));
  const instructorResults = q.length < 1 ? [] : [...new Map(
    sessions.filter(s => (s.instructor||"").toLowerCase().includes(q)).map(s => [s.instructor, s])
  ).values()].slice(0, 3);
  const hasResults = sessionResults.length > 0 || pageResults.length > 0 || instructorResults.length > 0;

  function pick(fn) {
    saveRecentSearch(query);
    setRecents(getRecentSearches());
    fn();
    onClose();
  }

  function pickRecent(r) {
    setQuery(r);
  }

  function removeRecent(r, e) {
    e.stopPropagation();
    const updated = getRecentSearches().filter(s => s !== r);
    try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated)); } catch {}
    setRecents(updated);
  }

  return (
    <div style={{ position:"fixed", inset:0, zIndex:999, background:C.white, display:"flex", flexDirection:"column", fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", borderBottom:`1px solid ${C.gray200}` }}>
        <div style={{ flex:1, display:"flex", alignItems:"center", gap:8, background:C.gray50, border:`1px solid ${C.gray200}`, borderRadius:10, padding:"8px 12px" }}>
          <Icon name="magnifying-glass" size={16} color={C.gray400}/>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search sessions…"
            style={{ flex:1, minWidth:0, width:0, border:"none", background:"none", outline:"none", fontSize:15, color:C.gray900, fontFamily:"inherit" }}
          />
          {query.length > 0 && (
            <button onClick={() => setQuery("")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", padding:0 }}>
              <Icon name="x-circle" size={16} color={C.gray400}/>
            </button>
          )}
        </div>
        <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", fontSize:15, fontWeight:600, color:C.primary, padding:"4px 0", flexShrink:0 }}>
          Cancel
        </button>
      </div>

      {/* Body */}
      <div style={{ flex:1, overflowY:"auto" }}>

        {/* No query — show recents + quick links */}
        {q.length === 0 && (
          <div>
            {recents.length > 0 && (
              <div style={{ padding:"20px 16px 8px" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                  <span style={{ fontSize:12, fontWeight:700, color:C.gray400, letterSpacing:.8, textTransform:"uppercase" }}>Recent Searches</span>
                  <button onClick={() => { localStorage.removeItem(RECENT_SEARCHES_KEY); setRecents([]); }}
                    style={{ background:"none", border:"none", cursor:"pointer", fontSize:12, fontWeight:600, color:C.primary }}>Clear all</button>
                </div>
                {recents.map(r => (
                  <button key={r} onClick={() => pickRecent(r)}
                    style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"11px 4px", background:"none", border:"none", cursor:"pointer", borderBottom:`1px solid ${C.gray100}`, textAlign:"left" }}>
                    <Icon name="clock-counter-clockwise" size={16} color={C.gray400}/>
                    <span style={{ flex:1, fontSize:14, color:C.gray700 }}>{r}</span>
                    <span onClick={e => removeRecent(r, e)} style={{ padding:"2px 4px", cursor:"pointer" }}>
                      <Icon name="x" size={13} color={C.gray400}/>
                    </span>
                  </button>
                ))}
              </div>
            )}
            <div style={{ padding:`${recents.length > 0 ? 8 : 20}px 16px 8px` }}>
              <div style={{ fontSize:12, fontWeight:700, color:C.gray400, letterSpacing:.8, textTransform:"uppercase", marginBottom:12 }}>Quick Links</div>
              {SEARCH_PAGES.map(p => (
                <button key={p.id} onClick={() => pick(() => onNavigate(p.id))}
                  style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"12px 4px", background:"none", border:"none", cursor:"pointer", borderBottom:`1px solid ${C.gray100}`, textAlign:"left" }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:C.primaryLight, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon name={p.icon} size={15} color={C.primary}/>
                  </div>
                  <span style={{ fontSize:14, fontWeight:500, color:C.gray800 }}>{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Has query — show results */}
        {q.length > 0 && !hasResults && (
          <div style={{ padding:"48px 16px", textAlign:"center", color:C.gray400, fontSize:14 }}>
            No results for "<strong style={{ color:C.gray600 }}>{query}</strong>"
          </div>
        )}

        {pageResults.length > 0 && (
          <div style={{ padding:"16px 16px 4px" }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.gray400, letterSpacing:.8, textTransform:"uppercase", marginBottom:8 }}>Pages</div>
            {pageResults.map(p => (
              <button key={p.id} onClick={() => pick(() => onNavigate(p.id))}
                style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"12px 4px", background:"none", border:"none", cursor:"pointer", borderBottom:`1px solid ${C.gray100}`, textAlign:"left" }}>
                <div style={{ width:32, height:32, borderRadius:8, background:C.primaryLight, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Icon name={p.icon} size={15} color={C.primary}/>
                </div>
                <span style={{ fontSize:14, fontWeight:600, color:C.gray800 }}>{p.label}</span>
              </button>
            ))}
          </div>
        )}

        {instructorResults.length > 0 && (
          <div style={{ padding:"16px 16px 4px" }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.gray400, letterSpacing:.8, textTransform:"uppercase", marginBottom:8 }}>Instructors</div>
            {instructorResults.map(s => (
              <button key={s.instructor} onClick={() => pick(() => onOpenSession(s))}
                style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"12px 4px", background:"none", border:"none", cursor:"pointer", borderBottom:`1px solid ${C.gray100}`, textAlign:"left" }}>
                <Avatar name={s.instructor} src={INSTRUCTOR_AVATARS[s.instructor]} size={32}/>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:C.gray800 }}>{s.instructor}</div>
                  <div style={{ fontSize:12, color:C.gray400 }}>{s.category}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {sessionResults.length > 0 && (
          <div style={{ padding:"16px 16px 24px" }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.gray400, letterSpacing:.8, textTransform:"uppercase", marginBottom:8 }}>Sessions</div>
            {sessionResults.map(s => (
              <button key={s.id} onClick={() => pick(() => onOpenSession(s))}
                style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"12px 4px", background:"none", border:"none", cursor:"pointer", borderBottom:`1px solid ${C.gray100}`, textAlign:"left" }}>
                <div style={{ width:32, height:32, borderRadius:8, background:C.primaryLight, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Icon name="play-circle" size={15} color={C.primary}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:C.gray800, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.title}</div>
                  <div style={{ fontSize:12, color:C.gray400 }}>{s.instructor} · {s.category}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SearchBar({ onOpenSession, onNavigate, sessions = [] }) {
  const [query, setQuery]   = useState("");
  const [open,  setOpen]    = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const q = query.trim().toLowerCase();
  const searchPool = sessions;
  const pagePool   = SEARCH_PAGES;

  const sessionResults = q.length < 1 ? [] : searchPool.filter(s =>
    s.title.toLowerCase().includes(q) ||
    (s.instructor||"").toLowerCase().includes(q) ||
    (s.category||"").toLowerCase().includes(q) ||
    (s.description||"").toLowerCase().includes(q)
  ).slice(0, 5);

  const pageResults = q.length < 1 ? [] : pagePool.filter(p =>
    p.label.toLowerCase().includes(q)
  );

  const instructorResults = q.length < 1 ? [] : [...new Map(
    searchPool.filter(s => (s.instructor||"").toLowerCase().includes(q)).map(s => [s.instructor, s])
  ).values()].slice(0, 3);

  const hasResults = sessionResults.length > 0 || pageResults.length > 0 || instructorResults.length > 0;
  const showEmpty  = q.length >= 1 && !hasResults;

  function pick(fn) { fn(); setQuery(""); setOpen(false); }

  return (
    <div ref={ref} style={{ flex:1, maxWidth:440, position:"relative" }}>
      <div style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)" }}>
        <Icon name="magnifying-glass" size={15} color={C.gray400}/>
      </div>
      <input
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="Search sessions, topics, instructors…"
        style={{ width:"100%", padding:"8px 12px 8px 34px", border:`1px solid ${open ? C.primary : C.gray200}`, borderRadius:9, fontSize:14, color:C.gray700, background:C.gray50, outline:"none", boxSizing:"border-box", transition:"border-color .15s" }}
      />
      {query.length > 0 && (
        <button onClick={() => { setQuery(""); setOpen(false); }}
          style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", display:"flex", padding:2 }}>
          <Icon name="x" size={13} color={C.gray400}/>
        </button>
      )}

      {open && (q.length >= 1) && (
        <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, right:0, background:C.white, border:`1px solid ${C.gray200}`, borderRadius:12, boxShadow:"0 8px 32px rgba(0,0,0,0.12)", zIndex:999, overflow:"hidden", maxHeight:400, overflowY:"auto" }}>

          {showEmpty && (
            <div style={{ padding:"24px 16px", textAlign:"center", color:C.gray400, fontSize:14 }}>
              No results for "<strong style={{color:C.gray600}}>{query}</strong>"
            </div>
          )}

          {pageResults.length > 0 && (
            <div>
              <div style={{ padding:"8px 14px 4px", fontSize:12, fontWeight:700, color:C.gray400, letterSpacing:.8, textTransform:"uppercase" }}>Pages</div>
              {pageResults.map(p => (
                <button key={p.id} onClick={() => pick(() => onNavigate(p.id))}
                  style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.gray50}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}>
                  <div style={{ width:28, height:28, borderRadius:8, background:C.primaryLight, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon name={p.icon} size={14} color={C.primary}/>
                  </div>
                  <span style={{ fontSize:14, fontWeight:600, color:C.gray800 }}>{p.label}</span>
                </button>
              ))}
            </div>
          )}

          {instructorResults.length > 0 && (
            <div>
              <div style={{ padding:"8px 14px 4px", fontSize:12, fontWeight:700, color:C.gray400, letterSpacing:.8, textTransform:"uppercase" }}>Instructors</div>
              {instructorResults.map(s => (
                <button key={s.instructor} onClick={() => pick(() => onOpenInstructor ? onOpenInstructor(s.instructor) : onOpenSession(s))}
                  style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.gray50}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}>
                  <Avatar name={s.instructor} src={INSTRUCTOR_AVATARS[s.instructor]} size={28}/>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:C.gray800 }}>{s.instructor}</div>
                    <div style={{ fontSize:12, color:C.gray400 }}>{s.category}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {sessionResults.length > 0 && (
            <div>
              <div style={{ padding:"8px 14px 4px", fontSize:12, fontWeight:700, color:C.gray400, letterSpacing:.8, textTransform:"uppercase" }}>Sessions</div>
              {sessionResults.map(s => (
                <button key={s.id} onClick={() => pick(() => onOpenSession(s))}
                  style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.gray50}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}>
                  <div style={{ width:28, height:28, borderRadius:8, background:C.primaryLight, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon name="play-circle" size={14} color={C.primary}/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:600, color:C.gray800, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.title}</div>
                    <div style={{ fontSize:12, color:C.gray400 }}>{s.instructor} · {s.category}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {q.length === 0 && (
            <div style={{ padding:"12px 14px 8px" }}>
              <div style={{ fontSize:12, fontWeight:700, color:C.gray400, letterSpacing:.8, textTransform:"uppercase", marginBottom:8 }}>Quick Links</div>
              {pagePool.map(p => (
                <button key={p.id} onClick={() => pick(() => onNavigate(p.id))}
                  style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 4px", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.gray50}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}>
                  <Icon name={p.icon} size={14} color={C.gray400}/>
                  <span style={{ fontSize:14, color:C.gray600 }}>{p.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ReferFriendsModal({ onClose, userName }) {
  const dark = document.querySelector("[data-theme='dark']") !== null;
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [referrals] = useState(0);
  const [credits] = useState(0);
  const refLink = `https://spedsummit.com/invite/${(userName || "user").toLowerCase().replace(/\s+/,"")}2026`;

  function copyLink() {
    navigator.clipboard.writeText(refLink).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }
  function sendInvite() {
    if (!email.trim()) return;
    setSent(true);
    setEmail("");
    setTimeout(() => setSent(false), 2500);
  }

  const isMobile = window.innerWidth <= 480;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:900, display:"flex", alignItems:isMobile?"flex-end":"center", justifyContent:"center", padding: isMobile ? 0 : 16 }}
      onClick={onClose}>
      <div style={{ background: dark ? "#1e2647" : "#fff", borderRadius: isMobile ? "20px 20px 0 0" : 20, width:"100%", maxWidth: isMobile ? "100%" : 460, boxShadow:"0 24px 60px rgba(0,0,0,0.3)", overflow:"hidden", position:"relative" }}
        onClick={e => e.stopPropagation()}>

        {/* Close */}
        <button onClick={onClose} style={{ position:"absolute", top:14, right:14, width:32, height:32, borderRadius:8, border:`1px solid ${dark?"rgba(255,255,255,0.12)":C.gray200}`, background:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="x" size={14} color={dark ? "rgba(255,255,255,0.5)" : C.gray500}/>
        </button>

        {/* Header */}
        <div style={{ padding: isMobile ? "24px 20px 16px" : "32px 28px 20px", textAlign:"center", borderBottom:`1px solid ${dark?"rgba(255,255,255,0.08)":C.gray100}` }}>
          <div style={{ width:48, height:48, borderRadius:14, background:"rgba(54,153,255,0.12)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
            <Icon name="gift" size={24} color={C.primary}/>
          </div>
          <div style={{ fontSize: isMobile ? 18 : 20, fontWeight:800, color: dark ? "#fff" : C.gray900, marginBottom:6 }}>Refer Friends, Get Pro Free</div>
          <div style={{ fontSize:13, color: dark ? "rgba(255,255,255,0.55)" : C.gray500, lineHeight:1.55, maxWidth:300, margin:"0 auto" }}>
            Invite a friend to SPED Summit. When they join, <strong style={{ color:C.primary }}>you both get 6 months of Pro</strong> — or refer 3+ friends for a full year free.
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: isMobile ? "20px 16px 28px" : "24px 28px" }}>

          {/* Copy link */}
          <div style={{ fontSize:11, fontWeight:700, color: dark ? "rgba(255,255,255,0.5)" : C.gray500, marginBottom:8, letterSpacing:.5 }}>YOUR INVITATION LINK</div>
          <div style={{ display:"flex", gap:8, marginBottom:18 }}>
            <div style={{ flex:1, padding:"11px 12px", background: dark ? "rgba(255,255,255,0.06)" : C.gray50, border:`1px solid ${dark?"rgba(255,255,255,0.1)":C.gray200}`, borderRadius:10, fontSize:12, color: dark ? "rgba(255,255,255,0.45)" : C.gray500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {refLink}
            </div>
            <button onClick={copyLink}
              style={{ padding:"11px 16px", background: copied ? C.success : C.primary, color:"#fff", border:"none", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", gap:6, transition:"background .2s", minHeight:44 }}>
              <Icon name="copy" size={13} color="#fff"/>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Email invite */}
          <div style={{ fontSize:11, fontWeight:700, color: dark ? "rgba(255,255,255,0.5)" : C.gray500, marginBottom:8, letterSpacing:.5 }}>EMAIL YOUR INVITATION</div>
          <div style={{ display:"flex", gap:8, marginBottom:20 }}>
            <input
              type="email" placeholder="friend@email.com" value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendInvite()}
              style={{ flex:1, padding:"11px 12px", background: dark ? "rgba(255,255,255,0.06)" : C.gray50, border:`1px solid ${dark?"rgba(255,255,255,0.1)":C.gray200}`, borderRadius:10, fontSize:14, color: dark ? "#fff" : C.gray900, outline:"none", minHeight:44 }}/>
            <button onClick={sendInvite}
              style={{ padding:"11px 16px", background: sent ? C.success : C.primary, color:"#fff", border:"none", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", gap:6, transition:"background .2s", minHeight:44 }}>
              <Icon name={sent ? "check" : "paper-plane-tilt"} size={13} color="#fff"/>
              {sent ? "Sent!" : "Send"}
            </button>
          </div>

          {/* Stats */}
          <div style={{ background: dark ? "rgba(255,255,255,0.04)" : C.gray50, border:`1px solid ${dark?"rgba(255,255,255,0.08)":C.gray100}`, borderRadius:12, padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:900, color: dark ? "#fff" : C.gray900 }}>{referrals}</div>
              <div style={{ fontSize:11, color: dark ? "rgba(255,255,255,0.45)" : C.gray500, fontWeight:600, marginTop:2 }}>Referrals</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopBar({ toast, isDark, onToggleDarkMode, onLogout, onNavigateProfile, onOpenSession, onNavigate, userName = "", userAvatar, onBrowseSelect, seasons = SEASONS, sessions = [], onOpenInstructor, onGoHome }) {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showReferModal, setShowReferModal] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showBrowse, setShowBrowse] = useState(false);
  const browseRef = useRef(null);
  const avatarBtnRef = useRef(null);
  const unread = NOTIF_DATA.filter(n => !n.read).length;
  const notifBtnRef = useRef(null);

  /* Close browse on outside click */
  useEffect(() => {
    if (!showBrowse) return;
    function handleClick(e) {
      if (browseRef.current && !browseRef.current.contains(e.target)) setShowBrowse(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showBrowse]);

  /* Derive seasons and years from live sessions only */
  const filledSeasons = seasons.filter(s => sessions.some(sess => s.sessionIds.includes(sess.id)));
  const browseSeasons = filledSeasons.map(s => ({ id: s.id, name: s.name, tagline: s.tagline, color: s.color }));
  const browseYears   = [...new Set(filledSeasons.map(s => s.name.split(" ")[1]))].sort((a,b) => b - a);

  return (
    <div style={{ height:60, background:C.white, borderBottom:`1px solid ${C.gray200}`, display:"flex", alignItems:"center", paddingLeft:24, paddingRight:24, position:"sticky", top:0, zIndex:100, flexShrink:0 }}>
      {/* Logo — clicking goes to landing page */}
      <div style={{ flexShrink:0, display:"flex", alignItems:"center", cursor:"pointer" }}
        onClick={onGoHome}>
        <img src="/Container.png" alt="SPED Summit" style={{ height:28, width:"auto", display:"block" }}/>
      </div>

      {/* Flex spacer */}
      <div style={{ flex:1 }}/>

      {/* Right actions */}
      <div style={{ flexShrink:0, display:"flex", alignItems:"center", gap:12 }}>
        {/* Notification button + popover — hidden on mobile (bottom nav handles it) */}
        <div className="topbar-notif" style={{ position:"relative" }} ref={notifBtnRef}>
            <button
              onClick={() => setShowNotif(v => !v)}
              style={{ width:36, height:36, borderRadius:"50%", border:`1px solid ${C.gray200}`, background:C.white, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", transition:"background .15s" }}
              onMouseEnter={e => { if (!showNotif) e.currentTarget.style.background = C.gray50; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.white; }}>
              <Icon name="bell" size={17} color={C.gray700}/>
              {unread > 0 && (
                <span style={{ position:"absolute", top:-7, left:"100%", transform:"translateX(-50%)", minWidth:18, height:18, borderRadius:99, background:C.primary, color:"#fff", fontSize:11, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 4px", lineHeight:1 }}>
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
            </button>
            {showNotif && <NotificationPopover onClose={() => setShowNotif(false)} anchorRef={notifBtnRef}/>}
          </div>


        {showReferModal && <ReferFriendsModal onClose={() => setShowReferModal(false)} userName={userName}/>}

        {/* Avatar */}
        <div style={{ position: "relative" }} ref={avatarBtnRef}>
          <button
            onClick={() => setShowProfileMenu(v => !v)}
            style={{ border:`1px solid ${isDark?"rgba(255,255,255,0.15)":C.gray200}`, background: isDark?"rgba(255,255,255,0.06)":"transparent", padding:"4px 10px 4px 4px", cursor: "pointer", borderRadius: 99, display:"flex", alignItems:"center", gap:8, transition:"background .15s" }}
            onMouseEnter={e=>e.currentTarget.style.background=isDark?"rgba(255,255,255,0.1)":C.gray50}
            onMouseLeave={e=>e.currentTarget.style.background=isDark?"rgba(255,255,255,0.06)":"transparent"}>
            <Avatar name={userName} src={userAvatar} size={28}/>
            {userName && <span style={{ fontSize:13, fontWeight:600, color:isDark?"#fff":C.gray800, maxWidth:80, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{userName.split(" ")[0]}</span>}
            <Icon name="caret-down" size={12} color={isDark?"rgba(255,255,255,0.5)":C.gray500}/>
          </button>
          {showProfileMenu && (
            <DropdownMenu bg="#F9FBF8" anchorRef={avatarBtnRef}
              items={[
                {
                  icon: "user-circle",
                  label: "My Profile",
                  action: () => { setShowProfileMenu(false); onNavigateProfile?.(); },
                },
                {
                  icon: "gift",
                  label: "Refer Friends",
                  action: () => { setShowProfileMenu(false); setShowReferModal(true); },
                },
                {
                  icon: "question",
                  label: "Help Center",
                  action: () => toast({ type: "info", message: "Opening Help Center..." }),
                },
                {
                  icon: "sign-out",
                  label: "Logout",
                  danger: true,
                  action: () => onLogout(),
                },
              ]}
              onClose={() => setShowProfileMenu(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────────────────────────────────────── */
function Sidebar({ active, onChange }) {
  const [hov, setHov] = useState(null);
  const nav = [
    { id:"dashboard",      icon:"house",        label:"My Learnings"    },
    { id:"sessions",       icon:"play-circle",  label:"All Sessions"    },
    { id:"schedules",      icon:"calendar",     label:"Schedules"       },
  ];

  return (
    <div style={{ width:52, background:C.white, borderRight:`1px solid ${C.gray200}`, display:"flex", flexDirection:"column", alignItems:"center", padding:"10px 0 12px", flexShrink:0, height:"100%", gap:2 }}>
      {nav.map(item => {
        const isActive = active === item.id;
        const isHov = hov === item.id;
        return (
          <div key={item.id} style={{ position:"relative" }}>
            <button
              onClick={() => onChange(item.id)}
              onMouseEnter={() => setHov(item.id)}
              onMouseLeave={() => setHov(null)}
              style={{ width:36, height:36, borderRadius:9, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", background: isActive ? C.primaryLight : isHov ? C.gray100 : "transparent", transition:"background .12s", position:"relative" }}>
              <Icon name={item.icon} size={18} color={isActive ? C.primary : C.gray500}/>
              {isActive && (
                <div style={{ position:"absolute", left:-8, top:"50%", transform:"translateY(-50%)", width:3, height:18, borderRadius:99, background:C.primary }}/>
              )}
            </button>
            {isHov && (
              <div style={{ position:"absolute", left:"calc(100% + 10px)", top:"50%", transform:"translateY(-50%)", background:"#181c32", color:"#fff", fontSize:12, fontWeight:600, padding:"5px 9px", borderRadius:7, whiteSpace:"nowrap", pointerEvents:"none", zIndex:999, boxShadow:"0 2px 8px rgba(0,0,0,0.18)" }}>
                {item.label}
                <div style={{ position:"absolute", right:"100%", top:"50%", transform:"translateY(-50%)", borderWidth:"4px 5px 4px 0", borderStyle:"solid", borderColor:"transparent #181c32 transparent transparent" }}/>
              </div>
            )}
          </div>
        );
      })}
      <div style={{ marginTop:"auto" }}/>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TAB BAR  (horizontal top nav — replaces sidebar for logged-in users)
───────────────────────────────────────────────────────────────────────────── */
/* ── LimelightBottomNav ─────────────────────────────────────────────────────── */
function LimelightBottomNav({ active, onChange, onNotif, notifCount = 0 }) {
  const items = [
    { id:'dashboard',      icon:'house',            label:'My Learnings' },
    { id:'past-sessions',  icon:'squares-four',  label:'Browse'       },
    { id:'certifications', icon:'certificate',       label:'Achievements'  },
    { id:'__notif__',      icon:'bell',              label:'Notifications' },
  ];
  const activeIdx = Math.max(0, items.findIndex(i => i.id === active));

  const [llLeft, setLlLeft] = useState(-999);
  const [ready,  setReady]  = useState(false);
  const itemRefs = useRef([]);
  const navRef   = useRef(null);

  useEffect(() => {
    const el = itemRefs.current[activeIdx];
    if (el) {
      const left = el.offsetLeft + el.offsetWidth / 2 - 22;
      setLlLeft(left);
      if (!ready) setTimeout(() => setReady(true), 50);
    }
  }, [activeIdx, items.length]);

  return (
    <nav ref={navRef} style={{
      position:'fixed', bottom:0, left:0, right:0, height:64,
      background:C.white, borderTop:`1px solid ${C.gray200}`,
      display:'flex', alignItems:'stretch', zIndex:200,
      boxShadow:'0 -2px 16px rgba(0,0,0,0.07)',
    }}>
      {/* Limelight indicator */}
      <div style={{
        position:'absolute', top:0, left:llLeft,
        width:44, height:3, borderRadius:99,
        background:C.primary,
        boxShadow:`0 0 20px 6px rgba(100,144,232,0.35)`,
        transition: ready ? 'left 0.35s cubic-bezier(0.34,1.56,0.64,1)' : 'none',
        pointerEvents:'none',
        zIndex:10,
      }}>
        {/* Glow cone */}
        <div style={{
          position:'absolute', left:'-30%', top:3,
          width:'160%', height:56,
          background:'transparent',
          clipPath:'polygon(5% 100%, 25% 0, 75% 0, 95% 100%)',
          pointerEvents:'none',
        }}/>
      </div>

      {items.map((item, i) => {
        const isAct = i === activeIdx;
        return (
          <button key={item.id}
            ref={el => itemRefs.current[i] = el}
            onClick={() => { if (item.id === '__notif__') { onNotif?.(); } else { onChange(item.id); } }}
            style={{
              flex:1, display:'flex', flexDirection:'column', alignItems:'center',
              justifyContent:'center', gap:3, background:'none', border:'none',
              cursor:'pointer', padding:'8px 2px', fontFamily:'inherit',
              WebkitTapHighlightColor:'transparent', position:'relative',
            }}>
            <div style={{ position:'relative' }}>
              <Icon name={item.icon} size={22} color={isAct ? C.primary : C.gray400}/>
              {item.id === '__notif__' && notifCount > 0 && (
                <span style={{ position:'absolute', top:-5, right:-7, minWidth:16, height:16, borderRadius:99, background:'#ef4444', color:'#fff', fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 3px', lineHeight:1 }}>
                  {notifCount > 9 ? '9+' : notifCount}
                </span>
              )}
            </div>
            <span style={{ fontSize:10, fontWeight: isAct ? 700 : 500, color: isAct ? C.primary : C.gray400, lineHeight:1 }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function TabBar({ active, onChange, breadcrumbs }) {
  const nav = [
    { id:"dashboard",      label:"My Learnings"    },
    { id:"sessions",       label:"All Sessions"    },
    { id:"certifications", label:"My Certificates" },
    { id:"community",      label:"My Community"    },
  ];

  return (
    <>
      <style>{`
        .tabbar-wrap {
          background: var(--c-white);
          border-bottom: 1px solid var(--c-gray200);
          padding: 0 28px;
          display: flex;
          align-items: stretch;
          flex-shrink: 0;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .tabbar-list {
          display: inline-flex;
          align-items: stretch;
          gap: 0;
        }
        .tabbar-tab {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 14px;
          height: 40px;
          border: none;
          background: transparent;
          border-radius: 0;
          font-family: inherit;
          font-size: 13px;
          font-weight: 500;
          color: var(--c-gray500);
          cursor: pointer;
          white-space: nowrap;
          position: relative;
          transition: color 150ms;
          outline: none;
        }
        .tabbar-tab::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: transparent;
          border-radius: 2px 2px 0 0;
          transition: background 150ms;
        }
        .tabbar-tab:hover:not(.tabbar-tab-active) {
          color: var(--c-gray900);
        }
        .tabbar-tab-active {
          color: var(--c-gray900);
          font-weight: 600;
        }
        .tabbar-tab-active::after {
          background: var(--c-gray900);
        }
      `}</style>
      <div className="tabbar-wrap">
        {breadcrumbs ? (
          <div style={{ display:"flex", alignItems:"center", gap:6, height:40, fontSize:13 }}>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
                {i > 0 && <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="m14.413 10.663-6.25 6.25a.939.939 0 1 1-1.328-1.328L12.42 10 6.836 4.413a.939.939 0 1 1 1.328-1.328l6.25 6.25a.94.94 0 0 1-.001 1.328" fill="var(--c-gray400)"/></svg>}
                {crumb.onClick ? (
                  <button onClick={crumb.onClick} style={{ background:"none", border:"none", padding:0, cursor:"pointer", fontSize:13, fontWeight:500, color:C.gray500, fontFamily:"inherit" }}
                    onMouseEnter={e=>e.currentTarget.style.color=C.gray900} onMouseLeave={e=>e.currentTarget.style.color=C.gray500}>
                    {crumb.label}
                  </button>
                ) : (
                  <span style={{ fontSize:13, fontWeight:600, color:C.gray900 }}>{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        ) : (
          <div className="tabbar-list">
            {nav.map(item => (
              <button
                key={item.id}
                className={`tabbar-tab${active === item.id ? " tabbar-tab-active" : ""}`}
                onClick={() => onChange(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SESSION CARD
───────────────────────────────────────────────────────────────────────────── */
const SESSION_VIEWERS = {
  1: [{ initials:"TR", color:"#f97316" }, { initials:"KM", color:"#6490E8" }, { initials:"SL", color:"#ec4899" }, { initials:"AJ", color:"#0ea5e9" }],
  2: [{ initials:"CH", color:"#7c3aed" }, { initials:"RD", color:"#10b981" }, { initials:"PW", color:"#f59e0b" }],
  3: [{ initials:"JS", color:"#2563eb" }, { initials:"MR", color:"#ec4899" }, { initials:"TK", color:"#f97316" }, { initials:"BN", color:"#10b981" }],
  4: [{ initials:"ML", color:"#6490E8" }, { initials:"SA", color:"#0ea5e9" }, { initials:"DW", color:"#f59e0b" }],
  5: [{ initials:"ET", color:"#7c3aed" }, { initials:"LC", color:"#2563eb" }, { initials:"NP", color:"#ec4899" }],
  6: [{ initials:"SK", color:"#10b981" }, { initials:"OG", color:"#f97316" }, { initials:"VH", color:"#6490E8" }, { initials:"IM", color:"#0ea5e9" }],
};

function AvatarStack({ sessionId }) {
  const viewers = SESSION_VIEWERS[sessionId] || [];
  if (!viewers.length) return null;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:10 }}>
      <div style={{ display:"flex" }}>
        {viewers.slice(0,4).map((v, i) => (
          <div key={i} style={{
            width:24, height:24, borderRadius:"50%",
            background:v.color, border:"2px solid #fff",
            marginLeft: i === 0 ? 0 : -8,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:9, fontWeight:700, color:"#fff", zIndex: viewers.length - i,
            position:"relative", flexShrink:0,
          }}>
            {v.initials}
          </div>
        ))}
      </div>
      <span style={{ fontSize:11, color:C.gray400 }}>
        {viewers.length > 3 ? `+${viewers.length - 3} watching` : "watching"}
      </span>
    </div>
  );
}

function SessionCard({ session, onClick, quizState = {}, onAssessmentClick, onCertificateClick, onSubscribeClick }) {
  // For Supabase sessions use their own dates; fallback to static lookup
  const sessionState = (session.availableFrom || session.available_from)
    ? getSessionState(session)
    : getSessionState(session.id);
  const isLocked   = sessionState === "past";
  const isUpcoming = sessionState === "upcoming";

  const effectiveSession = isLocked ? { ...session, status: "locked" } : session;
  const cta = getCTA(effectiveSession);
  const catColors = { MANAGEMENT:{c:"#2563eb",bg:"rgba(37,99,235,0.12)"}, LEADERSHIP:{c:"#7c3aed",bg:"rgba(124,58,237,0.12)"}, COMMUNICATION:{c:"#0ea5e9",bg:"rgba(14,165,233,0.12)"}, TEAMWORK:{c:"#f97316",bg:"rgba(249,115,22,0.12)"}, TECHNOLOGY:{c:"#6490E8",bg:"rgba(100,144,232,0.12)"}, ACCESSIBILITY:{c:"#ec4899",bg:"rgba(236,72,153,0.12)"} };
  const cc = catColors[session.category] || { c:C.primary, bg:"rgba(54,153,255,0.12)" };

  /* ── Determine assessment CTA ── */
  const qs = quizState.status; // "not-taken" | "in-progress" | "passed" | "failed" | undefined
  const hasAssessment = getSessionQuestions(session).length > 0;
  const watchedEnough = true;
  const showAssessmentCTA = hasAssessment;

  let assessBtn = null;
  if (showAssessmentCTA) {
    if (qs === "passed") {
      assessBtn = {
        label: "Download Certificate",
        icon: "medal",
        bg: C.success, color: "#fff", border: "none",
        action: e => { e.stopPropagation(); onCertificateClick && onCertificateClick(session); },
      };
    } else if (qs === "in-progress") {
      assessBtn = {
        label: "Resume Assessment",
        icon: "article",
        bg: C.primary, color: "#fff", border: "none",
        action: e => { e.stopPropagation(); onClick(session); onAssessmentClick && onAssessmentClick(session); },
      };
    } else if (qs === "failed") {
      assessBtn = {
        label: "Try Again",
        icon: "arrow-left",
        bg: C.errorLight, color: C.error, border: `1px solid ${C.errorBorder}`,
        action: e => { e.stopPropagation(); onClick(session); onAssessmentClick && onAssessmentClick(session); },
      };
    } else {
      assessBtn = {
        label: "Start Assessment",
        icon: "article",
        bg: C.primary, color: "#fff", border: "none",
        action: e => { e.stopPropagation(); onClick(session); onAssessmentClick && onAssessmentClick(session); },
      };
    }
  }

  const [cardHov, setCardHov] = useState(false);
  const cardClickable = !cta.disabled;

  function handleCardClick() {
    if (isLocked) { onSubscribeClick?.(); return; }
    if (isUpcoming) return;
    if (cardClickable || showAssessmentCTA) onClick(session);
  }

  return (
    <div
      onClick={handleCardClick}
      style={{ background:"#fff", borderRadius:18, overflow:"hidden",
               boxShadow:"0 2px 10px rgba(0,0,0,0.07)",
               cursor: isUpcoming || (isLocked || cta.disabled) ? "default" : "pointer",
               border:"none", display:"flex", flexDirection:"column" }}>

      {/* Thumbnail — tall instructor photo with name/title overlay */}
      <div style={{ position:"relative", flexShrink:0, height:180, background:"#1f2937", overflow:"hidden" }}>
        {session.instructorImage && <img src={session.instructorImage} alt={session.instructor}
          style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 15%" }}/>}
        {/* Dark gradient for text legibility */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.72) 0%,rgba(0,0,0,0.1) 50%,transparent 100%)", pointerEvents:"none" }}/>
        {/* Instructor name + title at bottom */}
        <div style={{ position:"absolute", bottom:14, left:16, right:16, pointerEvents:"none" }}>
          <div style={{ fontSize:15, fontWeight:800, color:"#fff", lineHeight:1.2 }}>{session.instructor}</div>
          {(session.instructorDesignation || session.instructorTitle) && <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)", marginTop:2 }}>{session.instructorDesignation || session.instructorTitle}</div>}
        </div>
        {/* Locked overlay (past — requires subscription) */}
        {isLocked && (
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6 }}>
            <Icon name="lock" size={28} color="rgba(255,255,255,0.9)"/>
            <span style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.8)", letterSpacing:.5 }}>PAST SESSION</span>
          </div>
        )}
        {/* Badges */}
        {qs === "passed" && (
          <div style={{ position:"absolute", top:12, right:12, display:"flex", alignItems:"center", gap:4, background:"rgba(16,185,129,0.92)", backdropFilter:"blur(4px)", padding:"4px 9px", borderRadius:99 }}>
            <Icon name="medal" size={12} color="#fff"/>
            <span style={{ fontSize:11, fontWeight:700, color:"#fff" }}>CERTIFIED</span>
          </div>
        )}
        {session.status==="completed" && qs !== "passed" && !isLocked && !isUpcoming && (
          <div style={{ position:"absolute", top:12, right:12, width:24, height:24, borderRadius:"50%", background:C.success, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="check" size={14} color="#fff"/>
          </div>
        )}
      </div>

      {/* Progress bar — directly below thumbnail */}
      {!isLocked && !isUpcoming && (
        <ProgressBar value={session.progress || 0} height={4} color={session.status==="completed" ? C.success : "#6490E8"}/>
      )}

      {/* Card body */}
      <div style={{ padding:"16px 16px 18px", flex:1, display:"flex", flexDirection:"column" }}>
        {/* Title */}
        <div style={{ fontWeight:700, fontSize:15, color:C.gray900, marginBottom:8, lineHeight:1.4,
                      display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {session.title}
        </div>

        {/* Description snippet */}
        {session.description && (
          <div style={{ fontSize:13, color:C.gray500, lineHeight:1.6, marginBottom:10,
                        display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
            {session.description}
          </div>
        )}

        <div style={{ marginTop:"auto" }}>
          {/* Duration meta */}
          {session.progress > 0 && (
            <div style={{ fontSize:12, color:C.gray500, marginBottom:12 }}>
              {session.progress}% complete
            </div>
          )}

          {/* Assessment locked hint */}
          {session.status === "completed" && hasAssessment && !watchedEnough && (
            <div style={{ marginBottom:10, display:"flex", alignItems:"center", gap:6, fontSize:12, color:C.gray500, background:C.gray100, borderRadius:8, padding:"7px 10px" }}>
              <Icon name="lock" size={13} color={C.gray400}/>
              Watch {80 - session.progress}% more to unlock assessment
            </div>
          )}

          {/* CTA button */}
          {isLocked ? (
            <button onClick={e=>{ e.stopPropagation(); onSubscribeClick?.(); }}
              style={{ width:"100%", padding:"11px", borderRadius:10, border:"none", background:"#6490E8",
                       color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", transition:"opacity .15s" }}
              onMouseEnter={e=>e.currentTarget.style.opacity=".85"}
              onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
              Subscribe to Watch
            </button>
          ) : isUpcoming ? (
            (() => {
              const af = session.availableFrom || session.available_from;
              const dateLabel = af
                ? new Date(af).toLocaleString("en-US", { month:"short", day:"numeric", hour:"numeric", minute:"2-digit" })
                : null;
              return (
                <div style={{ width:"100%", padding:"11px", borderRadius:10, border:`1px solid ${C.gray200}`,
                              background:C.gray50, color:C.gray500, fontSize:13, fontWeight:600,
                              textAlign:"center", boxSizing:"border-box" }}>
                  {dateLabel ? `Available ${dateLabel}` : "Coming Soon"}
                </div>
              );
            })()
          ) : (
            <button onClick={e=>{ e.stopPropagation(); if(!cta.disabled) onClick(session); }}
              style={{ width:"100%", padding:"11px", borderRadius:10,
                       border: cta.disabled ? `1px solid ${C.gray200}` : "none",
                       background: cta.disabled ? C.gray100 : "#6490E8",
                       color: cta.disabled ? C.gray400 : "#fff",
                       fontSize:14, fontWeight:700, cursor: cta.disabled ? "not-allowed" : "pointer",
                       transition:"opacity .15s" }}
              onMouseEnter={e=>{ if(!cta.disabled) e.currentTarget.style.opacity=".85"; }}
              onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
              {cta.disabled ? "Locked" : "Watch Now"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DASHBOARD
───────────────────────────────────────────────────────────────────────────── */
function Dashboard({ onNavigate, onNavigateToSeason, onOpenPastSeason, onOpenSession, toast, quizStates, onAssessmentClick, onCertificateClick, enrolledIds = new Set([1,2,3]), onEnroll, scheduleRegistrations = {}, setScheduleRegistrations = ()=>{}, sessions = SESSIONS, seasons = SEASONS, schedule = SCHEDULE, externalFilter, onFilterChange, isAdmin = false, sessionsLoading = false, testimonialsData = [] }) {
  const [vw, setVw] = useState(window.innerWidth);
  const [calendarItem, setCalendarItem] = useState(null);
  const [calDaySession, setCalDaySession] = useState(null);
  const [previewSession, setPreviewSession] = useState(null);
  const [contentTab, setContentTab] = useState("inprogress");
  const [calMonth, setCalMonth] = useState(() => new Date(2026, 3, 1));
  const [filterSeason, setFilterSeason] = useState(externalFilter?.season || "all");
  const [filterYear,   setFilterYear]   = useState(externalFilter?.year   || "all");
  useEffect(() => {
    const handler = () => setVw(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  const isMobile = vw <= 600;
  const isTablet = vw > 600 && vw <= 900;

  useEffect(() => {
    if (externalFilter) {
      setFilterSeason(externalFilter.season);
      setFilterYear(externalFilter.year);
    }
  }, [externalFilter?.season, externalFilter?.year]);

  const enrolledSessions = sessions.filter(s => enrolledIds.has(s.id));
  // Build upcoming list from sessions directly — any session with a future available_from
  // shows up automatically. Cross-reference schedule for type/date/time metadata.
  const upcomingSchedule = sessions
    .filter(s => getSessionState(s) === "upcoming")
    .slice().sort((a, b) => {
      const da = a.availableFrom ? new Date(a.availableFrom).getTime() : Infinity;
      const db = b.availableFrom ? new Date(b.availableFrom).getTime() : Infinity;
      return da - db;
    })
    .map(s => {
      const schedItem = schedule.find(i => i.session_id === s.id || i.id === s.id);
      return {
        id: s.id,
        session_id: s.id,
        title: s.title,
        instructor: s.instructor,
        type: schedItem?.type || s.category || "WORKSHOP",
        date: schedItem?.date || "",
        time: schedItem?.time || "",
        status: "upcoming",
        availableFrom: s.availableFrom,
      };
    });
  const completed     = enrolledSessions.filter(s => s.status === "completed").length;
  const certsEarned   = enrolledSessions.filter(s => {
    const hasQuiz = getSessionQuestions(s).length > 0;
    return hasQuiz ? quizStates?.[s.id]?.status === "passed" : s.status === "completed";
  }).length;
  const totalEnrolled = enrolledSessions.length;
  const pct = totalEnrolled > 0 ? Math.round((completed / totalEnrolled) * 100) : 0;
  const hasStarted = enrolledSessions.some(s => s.progress > 0 || s.status === "completed" || s.status === "in-progress");
  const continueSession = enrolledSessions.find(s => s.progress > 0 && s.status !== "completed");
  const featuredSession = sessions.find(s => getSessionState(s) === "live") || sessions[0] || null;

  const LEARNING_PATH = sessions.map(s => {
    const enrolled = enrolledIds.has(s.id);
    if (!enrolled) return { ...s, pathStatus: "locked" };
    if (s.status === "completed") return { ...s, pathStatus: "completed" };
    if (s.status === "in-progress") return { ...s, pathStatus: "in-progress" };
    return { ...s, pathStatus: "available" };
  });

  if (previewSession) {
    return (
      <SessionPublicPage
        session={previewSession}
        onBack={() => setPreviewSession(null)}
        onRegister={() => { onEnroll && onEnroll(previewSession.id); setPreviewSession(null); }}
      />
    );
  }

  // ─── SHARED STYLES ────────────────────────────────────────────────────────
  const CSS = `
    :root {
      --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
      --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
    }

    @keyframes db-fadeUp {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0);    }
    }
    @keyframes db-fadeIn {
      from { opacity: 0; transform: scale(0.97); }
      to   { opacity: 1; transform: scale(1);    }
    }
    @keyframes db-progressFill {
      from { transform: scaleX(0); }
      to   { transform: scaleX(1); }
    }
    @keyframes db-pulse {
      0%,100% { opacity: 1; }
      50%      { opacity: 0.35; }
    }

    .db-hero { animation: db-fadeUp 380ms var(--ease-out) both; }
    .db-section { animation: db-fadeUp 350ms var(--ease-out) both; }
    .db-section-1 { animation-delay: 60ms;  }
    .db-section-2 { animation-delay: 110ms; }
    .db-section-3 { animation-delay: 160ms; }
    .db-section-4 { animation-delay: 210ms; }
    .db-section-5 { animation-delay: 260ms; }

    .db-card {
      background: var(--c-white);
      border-radius: 16px;
      border: 1px solid var(--c-gray200);
      transition: box-shadow 180ms var(--ease-out), transform 180ms var(--ease-out);
    }
    @media (hover: hover) and (pointer: fine) {
      .db-card-hover:hover {
        box-shadow: 0 6px 24px rgba(0,0,0,0.09);
        transform: translateY(-2px);
      }
    }

    .db-btn-primary {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 10px 20px; border-radius: 9px; border: none;
      background: var(--c-primary); color: #fff;
      font-size: 14px; font-weight: 700; cursor: pointer;
      transition: transform 160ms var(--ease-out), opacity 160ms var(--ease-out);
      transform-origin: center;
    }
    .db-btn-primary:hover   { opacity: 0.88; }
    .db-btn-primary:active  { transform: scale(0.97); }

    .db-btn-ghost {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 7px 14px; border-radius: 8px; border: none;
      background: transparent; color: var(--c-primary);
      font-size: 13px; font-weight: 600; cursor: pointer;
      transition: background 150ms ease, transform 160ms var(--ease-out);
    }
    .db-btn-ghost:hover  { background: var(--c-primaryLight); }
    .db-btn-ghost:active { transform: scale(0.97); }

    .db-btn-outline {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 10px 20px; border-radius: 9px;
      background: rgba(255,255,255,0.15); color: #fff;
      border: 1.5px solid rgba(255,255,255,0.3);
      font-size: 14px; font-weight: 600; cursor: pointer;
      transition: background 160ms ease, transform 160ms var(--ease-out);
    }
    .db-btn-outline:hover  { background: rgba(255,255,255,0.22); }
    .db-btn-outline:active { transform: scale(0.97); }

    .db-path-item {
      display: flex; align-items: center; gap: 14px;
      padding: 13px 22px;
      border-bottom: 1px solid var(--c-gray50);
      transition: background 130ms ease;
    }
    .db-path-item:last-child { border-bottom: none; }
    .db-path-item.clickable { cursor: pointer; }
    @media (hover: hover) and (pointer: fine) {
      .db-path-item.clickable:hover { background: var(--c-gray50); }
    }
    .db-path-item.db-stagger-1 { animation: db-fadeIn 280ms var(--ease-out) 40ms  both; }
    .db-path-item.db-stagger-2 { animation: db-fadeIn 280ms var(--ease-out) 80ms  both; }
    .db-path-item.db-stagger-3 { animation: db-fadeIn 280ms var(--ease-out) 120ms both; }
    .db-path-item.db-stagger-4 { animation: db-fadeIn 280ms var(--ease-out) 160ms both; }

    .db-upcoming-item {
      transition: box-shadow 150ms var(--ease-out), transform 150ms var(--ease-out);
    }
    @media (hover: hover) and (pointer: fine) {
      .db-upcoming-item:hover {
        box-shadow: 0 4px 18px rgba(0,0,0,0.08);
        transform: translateY(-1px);
      }
    }
    .db-upcoming-item.db-stagger-1 { animation: db-fadeIn 260ms var(--ease-out) 30ms  both; }
    .db-upcoming-item.db-stagger-2 { animation: db-fadeIn 260ms var(--ease-out) 70ms  both; }
    .db-upcoming-item.db-stagger-3 { animation: db-fadeIn 260ms var(--ease-out) 110ms both; }

    .db-stat-tile {
      flex: 1; min-width: 90px;
      background: var(--c-gray50); border-radius: 14px; padding: 16px 14px; text-align: center;
      transition: transform 150ms var(--ease-out), box-shadow 150ms var(--ease-out);
    }
    @media (hover: hover) and (pointer: fine) {
      .db-stat-tile:hover { transform: translateY(-2px); box-shadow: 0 4px 14px rgba(0,0,0,0.07); }
    }
    .db-stat-tile.db-stagger-1 { animation: db-fadeIn 260ms var(--ease-out) 50ms  both; }
    .db-stat-tile.db-stagger-2 { animation: db-fadeIn 260ms var(--ease-out) 100ms both; }
    .db-stat-tile.db-stagger-3 { animation: db-fadeIn 260ms var(--ease-out) 150ms both; }

    .db-progress-bar-fill {
      height: 100%; border-radius: 99px;
      background: var(--c-primary);
      transform-origin: left;
      animation: db-progressFill 600ms var(--ease-out) 200ms both;
    }
    .db-hero-progress-fill {
      height: 100%; border-radius: 99px;
      background: rgba(255,255,255,0.9);
      transform-origin: left;
      animation: db-progressFill 700ms var(--ease-out) 300ms both;
    }

    .db-sidebar-card { animation: db-fadeUp 360ms var(--ease-out) 80ms both; }
    .db-sidebar-goal { animation: db-fadeUp 360ms var(--ease-out) 140ms both; }
    .db-sidebar-cert { animation: db-fadeUp 360ms var(--ease-out) 200ms both; }

    .db-cert-link {
      transition: box-shadow 150ms var(--ease-out), transform 150ms var(--ease-out);
      cursor: pointer;
    }
    @media (hover: hover) and (pointer: fine) {
      .db-cert-link:hover {
        box-shadow: 0 4px 16px rgba(0,0,0,0.09);
        transform: translateY(-1px);
      }
    }

    .db-pulse { animation: db-pulse 1.8s ease-in-out infinite; }
  `;

  // ─── SUB-COMPONENTS ───────────────────────────────────────────────────────

  function LearningPathSection({ showProgress }) {
    const statusConfig = {
      completed:    { icon:"check-circle",  iconColor:"#10b981", iconBg:"rgba(16,185,129,0.12)", label:"Completed",   labelColor:"#10b981", labelBg:"rgba(16,185,129,0.1)"  },
      "in-progress":{ icon:"play",          iconColor:C.primary,  iconBg:C.primaryLight,          label:"In Progress", labelColor:C.primary,  labelBg:C.primaryLight           },
      available:    { icon:"play-circle",   iconColor:"#6490E8", iconBg:"rgba(100,144,232,0.1)", label:"Available",   labelColor:"#6490E8", labelBg:"rgba(100,144,232,0.1)"  },
      locked:       { icon:"lock",          iconColor:C.gray400,  iconBg:C.gray100,               label:"Locked",      labelColor:C.gray400,  labelBg:C.gray100                },
    };
    return (
      <div className="db-card db-section db-section-2">
        <div style={{ padding:"18px 22px 14px", borderBottom:`1px solid ${C.gray100}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:C.primary, letterSpacing:1, textTransform:"uppercase", marginBottom:2 }}>Spring 2026</div>
            <div style={{ fontSize:16, fontWeight:800, color:C.gray900 }}>Your Learning Path</div>
          </div>
          <button className="db-btn-ghost" onClick={() => onNavigate("sessions")}>
            View All <Icon name="caret-right" size={13} color={C.primary}/>
          </button>
        </div>
        <div>
          {LEARNING_PATH.map((s, i) => {
            const sc = statusConfig[s.pathStatus] || statusConfig.locked;
            const clickable = s.pathStatus !== "locked";
            return (
              <div key={s.id}
                className={`db-path-item${clickable ? " clickable" : ""} db-stagger-${i + 1}`}
                onClick={() => clickable && onOpenSession(s)}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:sc.iconBg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, border: s.pathStatus === "in-progress" ? `2px solid ${C.primary}` : "2px solid transparent", transition:"border-color 200ms ease" }}>
                  <Icon name={sc.icon} size={16} color={sc.iconColor}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:700, color: s.pathStatus === "locked" ? C.gray400 : C.gray900, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:3 }}>{s.title}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:12, color:C.gray500 }}>{s.duration}</span>
                    {showProgress && s.pathStatus === "in-progress" && s.progress > 0 && (
                      <><span style={{ color:C.gray300 }}>·</span><span style={{ fontSize:12, color:C.primary, fontWeight:600 }}>{s.progress}% watched</span></>
                    )}
                  </div>
                  {showProgress && s.pathStatus === "in-progress" && (
                    <div style={{ marginTop:6, height:3, background:C.gray200, borderRadius:99, overflow:"hidden" }}>
                      <div className="db-progress-bar-fill" style={{ width:`${s.progress || 0}%` }}/>
                    </div>
                  )}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                  <span style={{ fontSize:11, fontWeight:700, color:sc.labelColor, background:sc.labelBg, padding:"3px 9px", borderRadius:99 }}>{sc.label}</span>
                  {clickable && <Icon name="caret-right" size={15} color={C.gray300}/>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function UpcomingSessionsSection({ sectionClass }) {
    if (upcomingSchedule.length === 0) return null;
    return (
      <div className={`db-section ${sectionClass || ""}`}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:"#dc2626", letterSpacing:1, textTransform:"uppercase", marginBottom:3, display:"flex", alignItems:"center", gap:6 }}>
              <span className="db-pulse" style={{ width:7, height:7, borderRadius:"50%", background:"#dc2626", display:"inline-block" }}/>
              Coming Up
            </div>
            <div style={{ fontSize:16, fontWeight:800, color:C.gray900 }}>Don't miss these</div>
          </div>
          <button className="db-btn-ghost" onClick={() => onNavigate("schedules")}>
            Full Schedule <Icon name="caret-right" size={13} color={C.primary}/>
          </button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {upcomingSchedule.slice(0, 3).map((item, i) => {
            const tc = SCHEDULE_TYPE_COLORS[item.type] || { c:C.gray500, bg:"rgba(128,128,128,0.10)" };
            const registered = !!scheduleRegistrations[item.id];
            return (
              <div key={item.id}
                className={`db-card db-upcoming-item db-stagger-${i + 1}`}
                style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 16px" }}>
                <div style={{ width:72, height:48, borderRadius:10, overflow:"hidden", flexShrink:0 }}>
                  <SessionThumb id={item.id} height={48} noPlayHover/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                    <Badge label={item.type} color={tc.c} bg={tc.bg} size={10}/>
                    <span style={{ fontSize:11, color:C.gray400 }}>· {item.date}, {item.time}</span>
                  </div>
                  <div style={{ fontSize:13, fontWeight:700, color:C.gray900, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.title}</div>
                  <div style={{ fontSize:12, color:C.gray500, marginTop:2, display:"flex", alignItems:"center", gap:4 }}>
                    <Avatar name={item.instructor} src={INSTRUCTOR_AVATARS[item.instructor]} size={14}/>
                    <span>{item.instructor}</span>
                  </div>
                </div>
                {registered ? (
                  <div style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:12, color:C.success, background:"rgba(16,185,129,0.10)", padding:"6px 12px", borderRadius:99, fontWeight:600, flexShrink:0 }}>
                    Registered
                  </div>
                ) : (
                  <button className="db-btn-primary" style={{ fontSize:13, padding:"7px 14px", flexShrink:0 }}
                    onClick={() => setCalendarItem(item)}>
                    Register
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── RENDER DATA ─────────────────────────────────────────────────────────
  const INST_ROLES = {
    "Tara Roehl":     "Occupational Therapist",
    "Casey Harrison": "Dyslexia Specialist",
    "Jordan Smith":   "Speech-Language Pathologist",
    "Morgan Lee":     "Special Ed Educator",
    "Dr. Emily Tran": "AI & Technology Educator",
    "Dr. Sarah Kim":  "AAC Specialist, BCBA",
  };
  const DB_TESTI_COLORS = [
    { color:"#dcfce7", accent:"#16a34a" },
    { color:"#fef9c3", accent:"#ca8a04" },
    { color:"#eef3fd", accent:"#4a77d4" },
    { color:"#fce7f3", accent:"#be185d" },
  ];
  const DB_TESTIMONIALS = testimonialsData.length > 0
    ? testimonialsData.slice(0, 4).map((t, i) => ({
        text: t.text, name: t.name, role: "SPED Educator", img: "",
        ...DB_TESTI_COLORS[i % DB_TESTI_COLORS.length],
      }))
    : [
        { text:"This is, by far, the best presentation of the summit. It kept my attention the whole time.", name:"April M.", role:"SPED Educator", img:"", color:"#dcfce7", accent:"#16a34a" },
        { text:"The session was highly informative and practical. The speaker presented evidence-based, neurodiversity-affirming strategies.", name:"Auhen Cleo Faith C.", role:"SPED Educator", img:"", color:"#fef9c3", accent:"#ca8a04" },
        { text:"The discussion reminded us that we cannot give our best to our students if we do not take care of ourselves first.", name:"Erwin G. B.", role:"SPED Educator", img:"", color:"#eef3fd", accent:"#4a77d4" },
        { text:"Thank you for clarifying the meaning and function of echolalia. The discussion deepened my understanding.", name:"Jea Cyrill C.", role:"SPED Educator", img:"", color:"#fce7f3", accent:"#be185d" },
      ];
  const CHALLENGES = [
    { icon:"warning-circle", color:"#ef4444", title:"Adapting curriculum for diverse learners", desc:"Every student has unique needs, making one-size-fits-all lesson plans ineffective." },
    { icon:"question",       color:"#f59e0b", title:"Limited planning time and resources", desc:"Educators rarely have enough time to research and develop differentiated materials." },
    { icon:"users",          color:"#8b5cf6", title:"Supporting students with complex needs", desc:"AAC users, DHH students, and those with behavioral challenges need specialized strategies." },
    { icon:"chart-bar",      color:"#3b82f6", title:"Tracking IEP goals effectively", desc:"Monitoring progress across multiple students and goals can be overwhelming." },
  ];

  // KEEP RightSidebar stub so LearningPathSection references compile (unused now)
  function RightSidebar() {
    const sessionsLeft = Math.max(0, 2 - completed);
    return (
      <div style={{ width:248, flexShrink:0, display:"flex", flexDirection:"column", gap:14 }}>
        {/* Progress */}
        <div className="db-card db-sidebar-card" style={{ padding:"20px 18px" }}>
          <div style={{ fontWeight:800, fontSize:15, color:C.gray900, marginBottom:16 }}>My Progress</div>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18, padding:"14px 16px", background:C.gray50, borderRadius:12 }}>
            <svg width="52" height="52" viewBox="0 0 52 52" style={{ flexShrink:0 }}>
              <circle cx="26" cy="26" r="21" fill="none" stroke={C.gray200} strokeWidth="5"/>
              <circle cx="26" cy="26" r="21" fill="none" stroke={C.primary} strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 21}`}
                strokeDashoffset={`${2 * Math.PI * 21 * (1 - pct / 100)}`}
                strokeLinecap="round"
                style={{ transformOrigin:"center", transform:"rotate(-90deg)", transition:`stroke-dashoffset 700ms cubic-bezier(0.23, 1, 0.32, 1) 200ms` }}/>
              <text x="26" y="31" textAnchor="middle" fontSize="12" fontWeight="800" fill="var(--c-gray900)">{pct}%</text>
            </svg>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:C.gray800 }}>Overall completion</div>
              <div style={{ fontSize:12, color:C.gray400, marginTop:2 }}>{completed} of {totalEnrolled} sessions</div>
            </div>
          </div>
          {[
            { icon:"play-circle", label:"Sessions Watched",    val: completed,   color:C.primary  },
            { icon:"certificate", label:"Certificates Earned", val: certsEarned, color:"#f59e0b"  },
            { icon:"timer",       label:"Hours Learned",       val: "2.5h",      color:C.success  },
          ].map((row, i, arr) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom: i < arr.length - 1 ? `1px solid ${C.gray100}` : "none" }}>
              <div style={{ width:30, height:30, borderRadius:8, background:`color-mix(in srgb, ${row.color} 12%, transparent)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon name={row.icon} size={15} color={row.color}/>
              </div>
              <div style={{ flex:1, fontSize:12, fontWeight:600, color:C.gray600 }}>{row.label}</div>
              <div style={{ fontSize:15, fontWeight:900, color:C.gray900 }}>{row.val}</div>
            </div>
          ))}
        </div>

        {/* Next Goal */}
        <div className="db-sidebar-goal" style={{ background:"linear-gradient(135deg, #1d4ed8 0%, #4a77d4 100%)", borderRadius:16, padding:"18px 18px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:12 }}>
            <Icon name="target" size={16} color="rgba(255,255,255,0.85)"/>
            <span style={{ fontSize:12, fontWeight:800, color:"rgba(255,255,255,0.85)", letterSpacing:0.8, textTransform:"uppercase" }}>Next Goal</span>
          </div>
          {sessionsLeft > 0 ? (
            <>
              <div style={{ fontSize:14, fontWeight:700, color:"#fff", lineHeight:1.45, marginBottom:10 }}>
                Complete {sessionsLeft} more session{sessionsLeft > 1 ? "s" : ""} to unlock:
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {[
                  { icon:"trophy",      label:"Quiz Challenge Game"    },
                  { icon:"star",        label:"Win Pro Membership"      },
                  { icon:"certificate", label:"Session Certificate"     },
                ].map((r, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:24, height:24, borderRadius:6, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Icon name={r.icon} size={13} color="#fff"/>
                    </div>
                    <span style={{ fontSize:12, color:"rgba(255,255,255,0.88)", fontWeight:600 }}>{r.label}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ fontSize:14, fontWeight:700, color:"#fff", lineHeight:1.5 }}>You've unlocked all rewards! Keep exploring.</div>
          )}
        </div>

        {/* Cert quick-link */}
        {certsEarned > 0 && (
          <div className="db-card db-cert-link db-sidebar-cert"
            style={{ padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}
            onClick={() => onNavigate("certifications")}>
            <div style={{ width:38, height:38, borderRadius:10, background:"rgba(245,158,11,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Icon name="certificate" size={20} color="#f59e0b"/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.gray900 }}>{certsEarned} Certificate{certsEarned > 1 ? "s" : ""} Earned</div>
              <div style={{ fontSize:11, color:C.gray500 }}>View & download →</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── UNIFIED RENDER ───────────────────────────────────────────────────────
  if (false) { // dead branch – keeps linter happy for removed state renders
    return (
      <div style={{ display:"flex", gap:24, padding:24, minHeight:"100%", background:C.gray50, boxSizing:"border-box", alignItems:"flex-start" }}>
        <style>{CSS}</style>
        {calendarItem && (
          <AddToCalendarModal item={calendarItem} onClose={() => setCalendarItem(null)}
            onConfirm={() => {
              setScheduleRegistrations(r => ({ ...r, [calendarItem.id]: true }));
              toast({ type:"success", title:"Registered! 🎉", message:`Added "${calendarItem.title.slice(0,40)}…" to your schedule.` });
              setCalendarItem(null);
            }}/>
        )}

        <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", gap:24 }}>

          {/* ① HERO */}
          <div className="db-hero" style={{ background:"linear-gradient(135deg, #1e40af 0%, #3b82f6 60%, #6490E8 100%)", borderRadius:20, padding:"36px 40px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-40, right:-40, width:220, height:220, borderRadius:"50%", background:"rgba(255,255,255,0.07)", pointerEvents:"none" }}/>
            <div style={{ position:"absolute", bottom:-60, right:80, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }}/>
            <div style={{ position:"relative", maxWidth:540 }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(255,255,255,0.15)", padding:"5px 13px", borderRadius:99, marginBottom:16 }}>
                <Icon name="star" size={13} color="#fbbf24"/>
                <span style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.95)", letterSpacing:0.5 }}>SPED Summit · Spring 2026</span>
              </div>
              <h1 style={{ margin:"0 0 12px", fontSize:28, fontWeight:900, color:"#fff", lineHeight:1.2 }}>Start Your Learning Journey</h1>
              <p style={{ margin:"0 0 28px", fontSize:15, color:"rgba(255,255,255,0.8)", lineHeight:1.7, maxWidth:460 }}>
                Explore expert-led sessions in special education and earn certificates that advance your career.
              </p>
              <div style={{ display:"flex", gap:12 }}>
                <button className="db-btn-primary" style={{ background:"#fff", color:"#1e40af", fontWeight:800, fontSize:14 }}
                  onClick={() => onOpenSession(featuredSession)}>
                  <Icon name="play-circle" size={16} color="#1e40af"/> Start First Session
                </button>
                <button className="db-btn-outline" onClick={() => onNavigate("sessions")}>Explore Learning Path</button>
              </div>
            </div>
          </div>

          {/* ② FEATURED SESSION */}
          {featuredSession && (
          <div className="db-section db-section-1">
            <div style={{ fontSize:11, fontWeight:700, color:C.primary, letterSpacing:1, textTransform:"uppercase", marginBottom:10 }}>Start Here</div>
            <div className="db-card db-card-hover" style={{ overflow:"hidden", display:"flex", cursor:"pointer" }}
              onClick={() => onOpenSession(featuredSession)}>
              <div style={{ width:280, flexShrink:0 }}>
                <SessionThumb id={featuredSession.id} height={185} vimeoUrl={featuredSession.vimeoUrl}/>
              </div>
              <div style={{ flex:1, padding:"22px 24px", display:"flex", flexDirection:"column", gap:10 }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(16,185,129,0.1)", padding:"4px 10px", borderRadius:99, alignSelf:"flex-start" }}>
                  <Icon name="book-open" size={12} color="#059669"/>
                  <span style={{ fontSize:11, fontWeight:700, color:"#059669" }}>FEATURED SESSION</span>
                </div>
                <div style={{ fontSize:17, fontWeight:800, color:C.gray900, lineHeight:1.35 }}>{featuredSession.title}</div>
                <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:C.gray500 }}>
                  <Avatar name={featuredSession.instructor || "Instructor"} src={INSTRUCTOR_AVATARS[featuredSession.instructor]} size={22}/>
                  <span>{featuredSession.instructor}</span>
                  <span style={{ color:C.gray300 }}>·</span>
                  <Icon name="clock" size={13} color={C.gray400}/>
                  <span>{featuredSession.duration}</span>
                </div>
                <p style={{ margin:0, fontSize:13, color:C.gray500, lineHeight:1.6, flex:1 }}>{featuredSession.description}</p>
                <button className="db-btn-primary" style={{ alignSelf:"flex-start" }}
                  onClick={e => { e.stopPropagation(); onOpenSession(featuredSession); }}>
                  <Icon name="play" size={14} color="#fff"/> Start Learning
                </button>
              </div>
            </div>
          </div>
          )}

          {/* ③ LEARNING PATH */}
          <LearningPathSection showProgress={false}/>

          {/* ④ UPCOMING */}
          <UpcomingSessionsSection sectionClass="db-section-3"/>

          {/* ⑤ HOW IT WORKS */}
          <div className="db-card db-section db-section-4" style={{ padding:"24px 28px" }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.primary, letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>How It Works</div>
            <div style={{ fontSize:16, fontWeight:800, color:C.gray900, marginBottom:20 }}>Your path to certification & rewards</div>
            <div style={{ display:"flex", gap:0 }}>
              {[
                { icon:"play-circle",  color:"#3b82f6", bg:"rgba(59,130,246,0.1)",  n:"1", title:"Watch Sessions",   desc:"Access expert-led sessions at your own pace"          },
                { icon:"note-pencil",  color:"#6490E8", bg:"rgba(100,144,232,0.1)",  n:"2", title:"Take the Quiz",    desc:"Test your knowledge with post-session assessments"    },
                { icon:"certificate",  color:"#f59e0b", bg:"rgba(245,158,11,0.1)",  n:"3", title:"Earn Certificate", desc:"Download your verified certificate of completion"     },
                { icon:"trophy",       color:"#10b981", bg:"rgba(16,185,129,0.1)",  n:"4", title:"Unlock Rewards",   desc:"Complete all sessions to win the quiz game & Pro Membership" },
              ].map((item, i, arr) => (
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", padding:"0 16px", borderRight: i < arr.length - 1 ? `1px solid ${C.gray100}` : "none" }}>
                  <div style={{ width:48, height:48, borderRadius:14, background:item.bg, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12, position:"relative" }}>
                    <Icon name={item.icon} size={22} color={item.color}/>
                    <div style={{ position:"absolute", top:-6, right:-6, width:18, height:18, borderRadius:"50%", background:item.color, color:"#fff", fontSize:10, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>{item.n}</div>
                  </div>
                  <div style={{ fontSize:13, fontWeight:800, color:C.gray900, marginBottom:5 }}>{item.title}</div>
                  <div style={{ fontSize:12, color:C.gray500, lineHeight:1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
        <RightSidebar/>
      </div>
    );
  }

  // ─── CALENDAR + COURSERA-STYLE RENDER ────────────────────────────────────
  function parseSessionDate(dateStr) {
    try {
      const m = dateStr.match(/(\d+)\w*\s+(\w+)(?:\s+(\d{4}))?/);
      if (!m) return null;
      const d = new Date(`${m[2]} ${m[1]} ${m[3] || 2026}`);
      return isNaN(d) ? null : d;
    } catch { return null; }
  }
  const scheduledDates = schedule.map(item => ({ date: parseSessionDate(item.date), item })).filter(x => x.date);
  const calYear  = calMonth.getFullYear();
  const calMon   = calMonth.getMonth();
  const daysInMon = new Date(calYear, calMon + 1, 0).getDate();
  const startOffset = (new Date(calYear, calMon, 1).getDay() + 6) % 7; // Mon=0
  function sessionsOnDay(day) {
    return scheduledDates.filter(sd => sd.date.getDate()===day && sd.date.getMonth()===calMon && sd.date.getFullYear()===calYear);
  }
  const today = new Date();
  const inProgressSessions = sessions.filter(s => getSessionState(s) === "live" && (s.status === "in-progress" || s.status === "not-started" || s.status === "completed"));
  const completedSessions  = enrolledSessions.filter(s => s.status === "completed");

  /* ── Filter options derived from seasons ── */
  const seasonOptions = [...new Set(seasons.map(s => s.name.split(" ")[0]))];
  const yearOptions   = [...new Set(seasons.map(s => s.name.split(" ")[1]))].sort((a,b) => b - a);

  function sessionMatchesFilter(s) {
    if (filterSeason === "all" && filterYear === "all") return true;
    const season = seasons.find(se => se.sessionIds.includes(s.id));
    if (!season) return false;
    const [sName, sYear] = season.name.split(" ");
    if (filterSeason !== "all" && sName !== filterSeason) return false;
    if (filterYear   !== "all" && sYear !== filterYear)   return false;
    return true;
  }

  const filteredInProgress = inProgressSessions;
  const filteredCompleted  = completedSessions.filter(sessionMatchesFilter);
  const todayGoals = [
    { text:"Complete any 2 sessions",   done: completed >= 2 },
    { text:"Watch a session today",      done: hasStarted     },
    { text:"Take a session quiz",        done: Object.keys(quizStates||{}).length > 0 },
  ];

  return (
    <div style={{ minHeight:"100%", background:C.gray50, width:"100%" }}>
      <style>{CSS + `
        .db-course-row { transition:box-shadow 150ms ease; }
        .db-course-row:hover { box-shadow:0 2px 12px rgba(0,0,0,0.08); }
        .db-cal-day:hover { background:var(--c-gray100) !important; }

        /* ── Dashboard layout ── */
        .db-main-wrap { display:flex; align-items:flex-start; gap:24px; padding:28px 32px 28px; max-width:1400px; margin:0 auto; box-sizing:border-box; width:100%; }
        .db-right-panel { width:240px; flex-shrink:0; }

        /* ── Session cards ── */
        .db-session-card-row { display:flex; align-items:stretch; overflow:hidden; cursor:pointer; min-height:235px; }
        .db-session-card-thumb { flex-shrink:0; width:200px; position:relative; }
        .db-session-card-thumb img { width:100%; height:100%; object-fit:cover; object-position:top center; display:block; }

        /* ── Upcoming sessions — desktop/tablet ── */
        .db-upcoming-section { width:100%; box-sizing:border-box; }
        .db-upcoming-list { display:flex; flex-direction:column; gap:12px; width:100%; box-sizing:border-box; }
        .db-upcoming-session-card { width:100%; box-sizing:border-box; }
        @media(min-width:601px) and (max-width:900px){
          .db-upcoming-list { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
          .db-upcoming-session-card { flex-direction:column !important; min-height:unset !important; height:auto !important; overflow:hidden !important; }
          .db-upcoming-session-card .db-session-card-thumb { width:100% !important; height:160px !important; flex-shrink:0 !important; }
          .db-upcoming-session-card .db-session-card-body { padding:14px !important; }
        }

        /* ── Mobile ── */
        @media(max-width:700px){
          .db-main-wrap { flex-direction:column; padding-top:20px; padding-bottom:20px; padding-left:16px; padding-right:16px; gap:0; width:100%; box-sizing:border-box; }
          .db-right-panel { display:none !important; }
        }
        @media(max-width:600px){
          .db-session-card-row { flex-direction:column; min-height:unset; }
          .db-session-card-thumb { width:100% !important; height:160px; }
          .db-session-card-body { padding:14px !important; }
          .db-upcoming-list { display:flex !important; flex-direction:column !important; gap:12px; width:100% !important; }
          .db-upcoming-session-card { flex-direction:column !important; min-height:unset !important; height:auto !important; overflow:hidden !important; width:100% !important; max-width:100% !important; box-sizing:border-box !important; }
          .db-upcoming-session-card .db-session-card-thumb { width:100% !important; height:160px !important; flex-shrink:0 !important; }
          .db-upcoming-session-card .db-session-card-body { padding:14px !important; }
          .db-upcoming-title { font-size:16px !important; line-height:1.3 !important; }
          .db-upcoming-desc { font-size:13px !important; }
          .db-continue-list { display:flex !important; flex-direction:row !important; overflow-x:scroll !important; overflow-y:hidden !important; gap:12px !important; padding-top:0 !important; padding-bottom:8px !important; padding-left:16px !important; padding-right:0 !important; margin-left:-16px !important; margin-right:-16px !important; width:calc(100% + 32px) !important; box-sizing:border-box !important; -webkit-overflow-scrolling:touch; scroll-snap-type:x mandatory; scroll-padding-left:16px; touch-action:pan-x pan-y; overscroll-behavior-x:contain; }
          .db-continue-list::-webkit-scrollbar { display:none; }
          .db-continue-list > * { min-width:calc(100% - 24px) !important; max-width:calc(100% - 24px) !important; flex-shrink:0 !important; scroll-snap-align:start; scroll-snap-stop:always; }
        }
      `}</style>
      {calendarItem && (
        <AddToCalendarModal item={calendarItem} onClose={() => setCalendarItem(null)}
          onConfirm={() => {
            setScheduleRegistrations(r => ({ ...r, [calendarItem.id]: true }));
            toast({ type:"success", title:"Registered! 🎉", message:`Added "${calendarItem.title.slice(0,40)}…" to your schedule.` });
            setCalendarItem(null);
          }}/>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="db-main-wrap" style={isMobile ? { flexDirection:"column", padding:"24px 16px", gap:0, width:"100%", boxSizing:"border-box" } : {}}>
      <div style={{ flex:1, minWidth:0, width:"100%", boxSizing:"border-box" }}>



        {/* ── shared card badge map ── */}
        {(()=>{
          const CAT_BADGE_MAP = {
            "MANAGEMENT":    { label:"Management",    bg:"rgba(59,130,246,0.15)",  color:"#60a5fa" },
            "LEADERSHIP":    { label:"Leadership",    bg:"rgba(16,185,129,0.15)",  color:"#34d399" },
            "COMMUNICATION": { label:"Communication", bg:"rgba(249,115,22,0.15)",  color:"#fb923c" },
            "TEAMWORK":      { label:"Teamwork",      bg:"rgba(168,85,247,0.15)",  color:"#c084fc" },
            "TECHNOLOGY":    { label:"Technology",    bg:"rgba(234,179,8,0.15)",   color:"#fbbf24" },
            "ACCESSIBILITY": { label:"Accessibility", bg:"rgba(139,92,246,0.15)",  color:"#a78bfa" },
          };
          function renderSessionCard(s, btnLabel) {
            const catBadge = CAT_BADGE_MAP[s.category] || { label:s.category, bg:C.gray100, color:C.gray700 };
            const instrRole = s.instructorDesignation || INST_ROLES[s.instructor] || "Instructor";
            const schedItem = schedule.find(i => i.id === s.id);
            const typeLabel = schedItem ? schedItem.type.charAt(0) + schedItem.type.slice(1).toLowerCase() : "Session";
            return (
              <div key={s.id} className="db-course-row db-session-card-row"
                style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:12, ...(isMobile ? { flexDirection:"column", minHeight:"unset", minWidth:"calc(100% - 24px)", maxWidth:"calc(100% - 24px)", flexShrink:0, scrollSnapAlign:"start" } : {}) }}
                onClick={() => onOpenSession(s)}>
                <div className="db-session-card-thumb" style={isMobile ? { width:"100%", height:160, flexShrink:0 } : {}}>
                  {(s.instructorImage) && <img src={s.instructorImage} alt={s.instructor}/>}
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 45%, transparent 75%)" }}/>
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"0 10px 10px" }}>
                    <div style={{ fontSize:15, fontWeight:700, color:"#fff", lineHeight:1.25 }}>{s.instructor}</div>
                    <div style={{ fontSize:13, color:"rgba(255,255,255,0.72)", marginTop:3, lineHeight:1.3 }}>{instrRole}</div>
                  </div>
                </div>
                <div className="db-session-card-body" style={{ flex:1, minWidth:0, padding: isMobile ? "14px 16px" : "24px 28px", display:"flex", flexDirection:"column" }}>
                  <div style={{ fontSize:18, fontWeight:700, color:C.gray900, lineHeight:1.35, marginBottom:10 }}>{s.title}</div>
                  <div style={{ fontSize:13, color:C.gray600, lineHeight:1.6, marginBottom:s.progress > 0 && s.status!=="completed" ? 14 : 10, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                    {s.description}
                  </div>
                  {s.progress > 0 && s.status !== "completed" && (
                    <div style={{ marginBottom:20 }}>
                      <div style={{ height:8, background:C.gray200, borderRadius:99, overflow:"hidden", maxWidth:320 }}>
                        <div style={{ width:`${s.progress}%`, height:"100%", background:C.primary, borderRadius:99 }}/>
                      </div>
                      <div style={{ fontSize:12, color:C.gray600, marginTop:6 }}>{s.progress}% complete · {s.duration}</div>
                    </div>
                  )}
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:"auto", paddingTop:16 }}>
                    <button
                      onClick={e=>{ e.stopPropagation(); onOpenSession(s); }}
                      style={{ display:"inline-flex", alignItems:"center", padding:"7px 13px", background:C.primary, color:"#fff", border:"none", borderRadius:7, fontSize:13, fontWeight:600, cursor:"pointer", transition:"opacity 0.15s" }}
                      onMouseEnter={e=>e.currentTarget.style.opacity=".85"}
                      onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                      {btnLabel}
                    </button>
                    {s.status==="completed" && (
                      <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:12, fontWeight:600, color:C.success }}>
                        <Icon name="check-circle" size={13} color={C.success}/> Certificate earned
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          }
          return (
            <>
              {/* ── UPCOMING SESSION (calendar date click) ── */}
              {calDaySession && calDaySession.status === "upcoming" && (() => {
                const tc = SCHEDULE_TYPE_COLORS[calDaySession.type] || { c:C.gray500, bg:"rgba(128,128,128,0.10)" };
                const registered = !!scheduleRegistrations[calDaySession.id];
                const calSession = sessions.find(s => s.id === calDaySession.id);
                const instrRole = calSession?.instructorDesignation || INST_ROLES[calDaySession.instructor] || "Instructor";
                const typeLabel = calDaySession.type.charAt(0) + calDaySession.type.slice(1).toLowerCase();
                return (
                  <div style={{ marginBottom:32 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                      <div style={{ fontSize:20, fontWeight:700, color:C.gray900, fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif", letterSpacing:-0.3 }}>Upcoming Session</div>
                      <button onClick={() => setCalDaySession(null)}
                        style={{ background:"none", border:"none", cursor:"pointer", color:"#707685", fontSize:20, lineHeight:1, padding:"2px 6px" }}
                        aria-label="Close">×</button>
                    </div>
                    <div style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:12, display:"flex", alignItems:"stretch", overflow:"hidden", minHeight:235 }}>
                      <div style={{ flexShrink:0, width:200, position:"relative" }}>
                        <img src={INSTRUCTOR_AVATARS[calDaySession.instructor]} alt={calDaySession.instructor}
                          style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top center", display:"block" }}/>
                        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 45%, transparent 75%)" }}/>
                        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"0 10px 10px" }}>
                          <div style={{ fontSize:15, fontWeight:700, color:"#fff", lineHeight:1.25 }}>{calDaySession.instructor}</div>
                          <div style={{ fontSize:13, color:"rgba(255,255,255,0.72)", marginTop:3, lineHeight:1.3 }}>{instrRole}</div>
                        </div>
                      </div>
                      <div style={{ flex:1, minWidth:0, padding:20, display:"flex", flexDirection:"column" }}>
                        <div style={{ marginBottom:8 }}>
                          <span style={{ display:"inline-block", fontSize:11, fontWeight:600, padding:"2px 7px", borderRadius:4, background:tc.bg, color:tc.c, letterSpacing:.2 }}>
                            {calDaySession.type}
                          </span>
                        </div>
                        <div style={{ fontSize:17, fontWeight:700, color:C.gray900, lineHeight:1.3, marginBottom:6 }}>{calDaySession.title}</div>
                        <div style={{ fontSize:12, color:C.gray600, lineHeight:1.55, marginBottom:6, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                          {calDaySession.description}
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:"auto", paddingTop:12 }}>
                          {registered ? (
                            <div style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:13, fontWeight:700, color:C.success, background:C.successLight, padding:"7px 16px", borderRadius:7 }}>
                              <Icon name="check-circle" size={14} color={C.success}/> Registered
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setScheduleRegistrations(r => ({ ...r, [calDaySession.id]: true }));
                                toast({ type:"success", title:"Registered!", message:`You're registered for "${calDaySession.title.slice(0,40)}"` });
                              }}
                              style={{ display:"inline-flex", alignItems:"center", padding:"7px 13px", background:C.primary, color:"#fff", border:"none", borderRadius:7, fontSize:13, fontWeight:600, cursor:"pointer", transition:"opacity 0.15s", fontFamily:"inherit" }}
                              onMouseEnter={e=>e.currentTarget.style.opacity="0.85"}
                              onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                              Register Now
                            </button>
                          )}
                          <span style={{ fontSize:12, color:C.gray500 }}>{calDaySession.date} · {calDaySession.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ── CONTINUE LEARNING ── */}
              {(sessionsLoading || filteredInProgress.length > 0) && <div style={{ marginBottom:32 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, gap:10 }}>
                  <div style={{ fontSize:20, fontWeight:700, color:C.gray900, fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif", letterSpacing:-0.3 }}>Continue Watching</div>
                </div>
                {sessionsLoading ? (
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    {Array(3).fill(0).map((_,i) => <SkeletonSessionCard key={i}/>)}
                  </div>
                ) : (
                  <div className="db-continue-list" style={isMobile ? { display:"flex", flexDirection:"row", overflowX:"scroll", overflowY:"hidden", gap:12, paddingTop:0, paddingBottom:8, paddingLeft:16, paddingRight:0, marginLeft:-16, marginRight:-16, width:"calc(100% + 32px)", boxSizing:"border-box", WebkitOverflowScrolling:"touch", scrollSnapType:"x mandatory", scrollPaddingLeft:16, touchAction:"pan-x pan-y", overscrollBehaviorX:"contain" } : { display:"flex", flexDirection:"column", gap:12 }}>
                    {filteredInProgress.map(s => {
                      const lbl = s.status==="in-progress" ? "Resume" : "Watch Now";
                      return renderSessionCard(s, lbl);
                    })}
                    {isMobile && <div style={{ flexShrink:0, width:16, height:1 }} aria-hidden="true" />}
                  </div>
                )}
              </div>}

              {/* ── UPCOMING SESSIONS ── */}
              {upcomingSchedule.length > 0 && (
                <div style={{ marginBottom:0 }} className="db-upcoming-section">
                  <div style={{ fontSize:20, fontWeight:700, color:C.gray900, fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif", letterSpacing:-0.3, marginBottom:16 }}>Upcoming sessions</div>
                  <div className="db-upcoming-list" style={isMobile ? { display:"flex", flexDirection:"column", gap:12 } : {}}>
                    {upcomingSchedule.map((item) => {
                      const typeColor = SCHEDULE_TYPE_COLORS[item.type];
                      const catBadge = typeColor ? { label: item.type, bg: typeColor.bg, color: typeColor.c } : (CAT_BADGE_MAP[item.category] || { label: item.type, bg:"rgba(100,144,232,0.12)", color:"#7aa3ee" });
                      const session = sessions.find(s => s.id === item.id);
                      const instrRole = session?.instructorDesignation || INST_ROLES[item.instructor] || "Instructor";
                      return (
                        <div key={item.id} className="db-session-card-row db-upcoming-session-card"
                          style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:12, cursor:"default", overflow:"hidden", width:"100%", boxSizing:"border-box", ...(isMobile ? { flexDirection:"column", minHeight:"unset" } : {}) }}>
                          <div className="db-session-card-thumb" style={isMobile ? { width:"100%", height:160, flexShrink:0 } : {}}>
                            {(item.instructorImage || session?.instructorImage) && <img src={item.instructorImage || session?.instructorImage} alt={item.instructor}/>}
                            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 45%, transparent 75%)" }}/>
                            <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"0 10px 10px" }}>
                              <div className="instr-name" style={{ fontSize:15, fontWeight:700, color:"#fff", lineHeight:1.25 }}>{item.instructor}</div>
                              <div className="instr-role" style={{ fontSize:13, color:"rgba(255,255,255,0.72)", marginTop:3, lineHeight:1.3 }}>{instrRole}</div>
                            </div>
                          </div>
                          <div className="db-session-card-body" style={{ flex:1, minWidth:0, padding: isMobile ? "12px 14px" : "24px 28px", display:"flex", flexDirection:"column" }}>
                            <div style={{ marginBottom:12 }}>
                              <span style={{ display:"inline-block", fontSize:11, fontWeight:600, padding:"3px 9px", borderRadius:4, background:catBadge.bg, color:catBadge.color, letterSpacing:.2, textTransform:"uppercase" }}>
                                {catBadge.label}
                              </span>
                            </div>
                            <div className="db-upcoming-title" style={{ fontSize:18, fontWeight:700, color:C.gray900, lineHeight:1.35, marginBottom:10 }}>{item.title}</div>
                            <div className="db-upcoming-desc" style={{ fontSize:13, color:C.gray600, lineHeight:1.6, marginBottom:10, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                              {session?.description || ""}
                            </div>
                            <div style={{ marginTop:"auto", paddingTop:8 }}>
                              <div style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:13, fontWeight:600, color:C.gray600, background:C.gray50, border:`1px solid ${C.gray200}`, borderRadius:8, padding:"7px 13px", cursor:"default" }}>
                                <Icon name="calendar" size={13} color={C.gray500}/>
                                {(() => {
                                  const af = session?.availableFrom || session?.available_from;
                                  if (af) {
                                    const d = parseLocalDate(af);
                                    return "Available " + d.toLocaleString("en-US", { month:"short", day:"numeric", hour:"numeric", minute:"2-digit" });
                                  }
                                  return `Available ${item.date}${item.time ? ` · ${item.time}` : ""}`;
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </>
          );
        })()}

      </div>{/* end main col */}

      {/* ── RIGHT PANEL ── */}
      {(()=>{
        const ringColor = pct === 100 ? "#10b981" : C.primary;
        return (
          <div className="db-right-panel" style={{ display:"flex", flexDirection:"column", gap:0, paddingTop:4 }}>
          <div className="db-right-panel-inner">
            {/* Progress card */}
            <div className="db-right-progress" style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:14, padding:"16px 18px", boxShadow:"0 1px 4px rgba(0,0,0,0.04)", marginBottom:20 }}>
              <div style={{ fontSize:15, fontWeight:800, color:C.gray900, marginBottom:3 }}>My Progress</div>
              <div style={{ fontSize:13, color:C.gray500, marginBottom:10 }}>{completed} of {totalEnrolled} sessions</div>
              <div style={{ width:"100%", height:5, background:C.gray200, borderRadius:99, overflow:"hidden" }}>
                <div style={{ width:`${pct}%`, height:"100%", background:ringColor, borderRadius:99, transition:"width 0.8s cubic-bezier(0.23,1,0.32,1)" }}/>
              </div>
              <div style={{ fontSize:13, fontWeight:700, color:ringColor, marginTop:6 }}>{pct}% complete</div>
            </div>
            {/* Stats */}
            <div className="db-right-stats" style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:14, boxShadow:"0 1px 4px rgba(0,0,0,0.04)", overflow:"hidden" }}>
              {[
                { label:"Sessions Watched",    val: completed },
                { label:"Certificates Earned", val: certsEarned },
                { label:"Hours Learned",       val: `${(completed*0.75).toFixed(1)}h` },
              ].map((row, i, arr) => (
                <div key={i} style={{ padding:"14px 18px", borderBottom: i < arr.length-1 ? `1px solid ${C.gray100}` : "none" }}>
                  <div style={{ fontSize:24, fontWeight:900, color:C.gray900, lineHeight:1, letterSpacing:"-0.5px" }}>{row.val}</div>
                  <div style={{ fontSize:11, fontWeight:600, color:C.gray500, marginTop:3 }}>{row.label}</div>
                </div>
              ))}
            </div>

            {/* Certificate encouragement */}
            <div style={{ marginTop:12, background:C.white, border:`1px solid ${C.gray200}`, borderRadius:14, padding:"16px 18px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ width:36, height:36, borderRadius:10, background: certsEarned > 0 ? "rgba(245,158,11,0.12)" : "rgba(99,144,232,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Icon name="certificate" size={18} color={certsEarned > 0 ? "#f59e0b" : C.blue}/>
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:C.text, lineHeight:1.3 }}>
                    {certsEarned > 0 ? `${certsEarned} Certificate${certsEarned > 1 ? "s" : ""} Earned 🎉` : "Earn Your Certificate"}
                  </div>
                  <div style={{ fontSize:11, color:C.gray500, marginTop:1 }}>
                    {certsEarned > 0
                      ? `${totalEnrolled - completed} session${totalEnrolled - completed !== 1 ? "s" : ""} left to complete the full summit`
                      : "Complete sessions & pass quizzes to get certified"}
                  </div>
                </div>
              </div>
              {certsEarned === 0 && (
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {[
                    { label:"Watch a session", done: completed > 0 },
                    { label:"Pass the quiz",   done: certsEarned > 0 },
                    { label:"Download certificate", done: false },
                  ].map((step, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:16, height:16, borderRadius:"50%", background: step.done ? C.success : C.gray100, border:`1.5px solid ${step.done ? C.success : C.gray300}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {step.done && <Icon name="check" size={9} color="#fff"/>}
                      </div>
                      <span style={{ fontSize:12, color: step.done ? C.gray500 : C.gray700, fontWeight: step.done ? 400 : 500, textDecoration: step.done ? "line-through" : "none" }}>{step.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>{/* end db-right-panel-inner */}
          </div>
        );
      })()}

      </div>{/* end flex row */}

      {/* ── dead section banners removed (hero/instructors/testimonials/challenges/community now replaced by this layout) ── */}
      <div style={{ display:"none" }}>
      <div className="db-hero" style={{ background: hasStarted ? "linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 50%,#3b82f6 100%)" : "linear-gradient(135deg,#1e40af 0%,#3b82f6 60%,#6490E8 100%)", padding:"40px 32px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:300, height:300, borderRadius:"50%", background:"rgba(255,255,255,0.06)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-80, right:180, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.04)", pointerEvents:"none" }}/>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", gap:32, position:"relative" }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.65)", letterSpacing:1.2, textTransform:"uppercase", marginBottom:10 }}>
              {hasStarted ? "Your Learning Journey" : "SPED Summit · Spring 2026"}
            </div>
            <h1 style={{ margin:"0 0 10px", fontSize:30, fontWeight:900, color:"#fff", lineHeight:1.15 }}>
              {hasStarted ? "Keep up the great work!" : "Start Your Learning Journey"}
            </h1>
            <p style={{ margin:"0 0 22px", fontSize:15, color:"rgba(255,255,255,0.8)", lineHeight:1.6, maxWidth:480 }}>
              {hasStarted
                ? `${completed} of ${totalEnrolled} sessions completed${completed < totalEnrolled ? ` · ${totalEnrolled - completed} more to unlock all rewards` : ""}`
                : "Expert-led sessions in special education, free for all educators."}
            </p>
            {hasStarted && (
              <div style={{ marginBottom:22, maxWidth:400 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
                  <span style={{ fontSize:12, color:"rgba(255,255,255,0.7)", fontWeight:600 }}>{pct}% complete</span>
                  <span style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>{totalEnrolled - completed} sessions left</span>
                </div>
                <div style={{ height:8, background:"rgba(255,255,255,0.2)", borderRadius:99, overflow:"hidden" }}>
                  <div className="db-hero-progress-fill" style={{ width:`${pct}%` }}/>
                </div>
              </div>
            )}
            <div style={{ display:"flex", gap:10 }}>
              {hasStarted ? (
                <>
                  {continueSession && (
                    <button className="db-btn-primary" style={{ background:"#fff", color:"#1e40af", fontWeight:800, fontSize:14 }}
                      onClick={() => onOpenSession(continueSession)}>
                      Continue Learning
                    </button>
                  )}
                  <button className="db-btn-outline" onClick={() => onNavigate("sessions")}>All Sessions</button>
                </>
              ) : (
                <>
                  <button className="db-btn-primary" style={{ background:"#fff", color:"#1e40af", fontWeight:800, fontSize:14 }}
                    onClick={() => onOpenSession(featuredSession)}>
                    Start First Session
                  </button>
                  <button className="db-btn-outline" onClick={() => onNavigate("sessions")}>Explore Path</button>
                </>
              )}
            </div>
          </div>
          {hasStarted && (
            <div style={{ display:"flex", gap:12, flexShrink:0 }}>
              {[
                { val:completed,   label:"Sessions Done" },
                { val:certsEarned, label:"Certificates"  },
                { val:"2.5h",      label:"Hours Learned" },
              ].map((stat,i) => (
                <div key={i} style={{ textAlign:"center", background:"rgba(255,255,255,0.12)", backdropFilter:"blur(6px)", border:"1px solid rgba(255,255,255,0.18)", borderRadius:16, padding:"18px 22px", minWidth:90 }}>
                  <div style={{ fontSize:26, fontWeight:900, color:"#fff", lineHeight:1 }}>{stat.val}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)", fontWeight:600, marginTop:6, whiteSpace:"nowrap" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── SESSIONS GRID ── */}
      <div style={{ padding:"52px 32px", background:C.white, borderBottom:`1px solid ${C.gray100}` }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:28 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:C.primary, letterSpacing:1.2, textTransform:"uppercase", marginBottom:5 }}>Spring 2026</div>
              <div style={{ fontSize:22, fontWeight:800, color:C.gray900 }}>{hasStarted ? "Continue Your Journey" : "Start Here"}</div>
            </div>
            <button className="db-btn-ghost" onClick={() => onNavigate("sessions")}>
              View all <Icon name="caret-right" size={13} color={C.primary}/>
            </button>
          </div>
          {sessions.length === 0 && (
            <Empty style={{ margin:"8px 0" }}>
              <EmptyMedia variant="icon" color="#6490E8"><Icon name="video" size={22} color="#6490E8"/></EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No sessions yet</EmptyTitle>
                <EmptyDescription>New sessions will appear here once published. Check back soon.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:24 }}>
            {sessions.slice(0,3).map(s => {
              const enrolled = enrolledIds.has(s.id);
              const stMap = {
                "completed":   { label:"Completed",   bg:"rgba(16,185,129,0.12)", color:"#059669" },
                "in-progress": { label:"In Progress",  bg:C.primaryLight,          color:C.primary  },
                "not-started": { label:"Available",    bg:"rgba(100,144,232,0.10)", color:"#6490E8"  },
                "locked":      { label:"Locked",       bg:C.gray100,               color:C.gray400  },
              };
              const st = enrolled ? (stMap[s.status] || stMap.locked) : stMap.locked;
              const canOpen = enrolled && s.status !== "locked";
              return (
                <div key={s.id} className="db-course-card db-card" style={{ overflow:"hidden", cursor: canOpen ? "pointer" : "default" }}
                  onClick={() => canOpen && onOpenSession(s)}>
                  <div style={{ position:"relative", height:162, overflow:"hidden", background:C.gray100 }}>
                    <SessionThumb id={s.id} height={162} vimeoUrl={s.vimeoUrl} noPlayHover={!canOpen}/>
                    {enrolled && s.progress > 0 && (
                      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:"rgba(0,0,0,0.25)" }}>
                        <div style={{ height:"100%", width:`${s.progress}%`, background:C.primary }}/>
                      </div>
                    )}
                    <div style={{ position:"absolute", top:10, left:10 }}>
                      <span style={{ fontSize:10, fontWeight:700, color:st.color, background:st.bg, backdropFilter:"blur(4px)", padding:"3px 9px", borderRadius:99 }}>{st.label}</span>
                    </div>
                  </div>
                  <div style={{ padding:"16px 18px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:9 }}>
                      <Avatar name={s.instructor} src={INSTRUCTOR_AVATARS[s.instructor]} size={22}/>
                      <span style={{ fontSize:12, color:C.gray500, fontWeight:500 }}>{s.instructor}</span>
                    </div>
                    <div style={{ fontSize:14, fontWeight:800, color:C.gray900, lineHeight:1.4, marginBottom:8 }}>{s.title}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:14 }}>
                      <Icon name="clock" size={12} color={C.gray400}/>
                      <span style={{ fontSize:12, color:C.gray500 }}>{s.duration}</span>
                    </div>
                    <button className="db-btn-primary"
                      style={{ width:"100%", justifyContent:"center", fontSize:13, padding:"9px 0", ...(!enrolled ? { background:C.gray200, color:C.gray500 } : {}) }}
                      onClick={e => { e.stopPropagation(); if (canOpen) onOpenSession(s); else if (!enrolled && onEnroll) onEnroll(s.id); }}>
                      {enrolled
                        ? (s.status==="completed" ? "Watch Again" : s.status==="in-progress" ? "Resume Session" : s.status==="locked" ? "Locked" : "Start Session")
                        : "Enroll Free"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── INSTRUCTOR SHOWCASE ── */}
      <div style={{ padding:"52px 32px", background:C.gray50, borderBottom:`1px solid ${C.gray100}` }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ marginBottom:32 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.primary, letterSpacing:1.2, textTransform:"uppercase", marginBottom:5 }}>Expert Faculty</div>
            <div style={{ fontSize:22, fontWeight:800, color:C.gray900 }}>Learn from SPED experts</div>
            <div style={{ fontSize:14, color:C.gray500, marginTop:5 }}>Top educators sharing research-backed strategies for special education</div>
          </div>
          <div style={{ display:"flex", gap:44, overflowX:"auto", paddingBottom:8 }}>
            {Object.entries(INSTRUCTOR_AVATARS).map(([name, img]) => (
              <div key={name} className="db-instr-pill" style={{ textAlign:"center", flexShrink:0 }}>
                <div style={{ width:88, height:88, borderRadius:"50%", overflow:"hidden", border:`3px solid ${C.white}`, boxShadow:"0 3px 14px rgba(0,0,0,0.12)", margin:"0 auto 10px" }}>
                  <img src={img} alt={name} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top center" }}/>
                </div>
                <div style={{ fontSize:13, fontWeight:700, color:C.gray900 }}>{name.split(" ").slice(-1)[0]}</div>
                <div style={{ fontSize:11, color:C.gray500, marginTop:2, maxWidth:110 }}>{INST_ROLES[name] || "Instructor"}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── UPCOMING LIVE SESSIONS ── */}
      {upcomingSchedule.length > 0 && (
        <div style={{ padding:"52px 32px", background:C.white, borderBottom:`1px solid ${C.gray100}` }}>
          <div style={{ maxWidth:1100, margin:"0 auto" }}>
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:28 }}>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:"#dc2626", letterSpacing:1.2, textTransform:"uppercase", marginBottom:5, display:"flex", alignItems:"center", gap:6 }}>
                  <span className="db-pulse" style={{ width:7, height:7, borderRadius:"50%", background:"#dc2626", display:"inline-block" }}/>
                  Coming Up
                </div>
                <div style={{ fontSize:22, fontWeight:800, color:C.gray900 }}>Upcoming live sessions</div>
              </div>
              <button className="db-btn-ghost" onClick={() => onNavigate("schedules")}>
                Full schedule <Icon name="caret-right" size={13} color={C.primary}/>
              </button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))", gap:20 }}>
              {upcomingSchedule.map(item => {
                const tc = SCHEDULE_TYPE_COLORS[item.type] || { c:C.gray500, bg:"rgba(128,128,128,0.10)" };
                const registered = !!scheduleRegistrations[item.id];
                return (
                  <div key={item.id} className="db-card db-upcoming-item" style={{ padding:"16px 18px", display:"flex", gap:14, alignItems:"flex-start" }}>
                    <div style={{ width:76, height:54, borderRadius:9, overflow:"hidden", flexShrink:0 }}>
                      <SessionThumb id={item.id} height={54} noPlayHover/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
                        <Badge label={item.type} color={tc.c} bg={tc.bg} size={10}/>
                        <span style={{ fontSize:11, color:C.gray400 }}>· {item.date}, {item.time}</span>
                      </div>
                      <div style={{ fontSize:13, fontWeight:700, color:C.gray900, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:4 }}>{item.title}</div>
                      <div style={{ fontSize:12, color:C.gray500, display:"flex", alignItems:"center", gap:4 }}>
                        <Avatar name={item.instructor} src={INSTRUCTOR_AVATARS[item.instructor]} size={14}/>
                        <span>{item.instructor}</span>
                      </div>
                    </div>
                    <div style={{ flexShrink:0, marginTop:2 }}>
                      {registered
                        ? <div style={{ fontSize:12, color:C.success, background:"rgba(16,185,129,0.10)", padding:"5px 11px", borderRadius:99, fontWeight:600 }}>Registered</div>
                        : <button className="db-btn-primary" style={{ fontSize:12, padding:"6px 12px" }} onClick={() => setCalendarItem(item)}>Register</button>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── HEAR FROM OUR LEARNERS ── */}
      <div style={{ padding:"52px 32px", background:C.gray50, borderBottom:`1px solid ${C.gray100}` }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ marginBottom:32 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.primary, letterSpacing:1.2, textTransform:"uppercase", marginBottom:5 }}>Social Proof</div>
            <div style={{ fontSize:22, fontWeight:800, color:C.gray900 }}>Hear straight from our learners</div>
          </div>
          <div className="sp-sessions-grid" style={{ gap:18 }}>
            {DB_TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background:t.color, borderRadius:16, padding:"22px 20px", display:"flex", flexDirection:"column", gap:14 }}>
                <div style={{ display:"flex", gap:2 }}>
                  {[0,1,2,3,4].map(j => <Icon key={j} name="star" size={13} color={t.accent} weight="fill"/>)}
                </div>
                <p style={{ margin:0, fontSize:13, color:C.gray900, lineHeight:1.65, flex:1 }}>"{t.text}"</p>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", overflow:"hidden", flexShrink:0, border:`2px solid ${t.accent}` }}>
                    <img src={t.img} alt={t.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  </div>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:C.gray900 }}>{t.name}</div>
                    <div style={{ fontSize:11, color:C.gray600 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CHALLENGES WE'VE ALL FACED ── */}
      <div style={{ padding:"52px 32px", background:"#1e1b4b" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ marginBottom:32, textAlign:"center" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.45)", letterSpacing:1.2, textTransform:"uppercase", marginBottom:5 }}>We get it</div>
            <div style={{ fontSize:22, fontWeight:800, color:"#fff" }}>Learning challenges we've all faced</div>
            <div style={{ fontSize:14, color:"rgba(255,255,255,0.55)", marginTop:6 }}>SPED Summit was built to solve these — step by step.</div>
          </div>
          <div className="sp-sessions-grid" style={{ gap:18 }}>
            {CHALLENGES.map((ch, i) => (
              <div key={i} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:16, padding:"24px 20px" }}>
                <div style={{ width:44, height:44, borderRadius:12, background:`color-mix(in srgb, ${ch.color} 18%, transparent)`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
                  <Icon name={ch.icon} size={22} color={ch.color}/>
                </div>
                <div style={{ fontSize:14, fontWeight:700, color:"#fff", marginBottom:8, lineHeight:1.4 }}>{ch.title}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", lineHeight:1.6 }}>{ch.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── YOUR LEARNING PATH ── */}
      <div style={{ padding:"52px 32px", background:C.white, borderBottom:`1px solid ${C.gray100}` }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:28 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:C.primary, letterSpacing:1.2, textTransform:"uppercase", marginBottom:5 }}>Spring 2026</div>
              <div style={{ fontSize:22, fontWeight:800, color:C.gray900 }}>Your learning path</div>
            </div>
            <button className="db-btn-ghost" onClick={() => onNavigate("sessions")}>
              View all <Icon name="caret-right" size={13} color={C.primary}/>
            </button>
          </div>
          <div style={{ maxWidth:720 }}>
            <LearningPathSection showProgress={hasStarted}/>
          </div>
        </div>
      </div>

      {/* ── JOIN THE COMMUNITY ── */}
      <div style={{ padding:"52px 32px 72px", background:"linear-gradient(135deg,#1e40af 0%,#6490E8 100%)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", gap:32 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.6)", letterSpacing:1.2, textTransform:"uppercase", marginBottom:8 }}>Join Us</div>
            <div style={{ fontSize:26, fontWeight:900, color:"#fff", marginBottom:10 }}>Join our vibrant community</div>
            <div style={{ fontSize:15, color:"rgba(255,255,255,0.8)", lineHeight:1.65, maxWidth:480, marginBottom:24 }}>
              Connect with thousands of SPED educators. Share strategies, ask questions, and grow together.
            </div>
            <button className="db-btn-primary" style={{ background:"#fff", color:"#1e40af", fontWeight:800 }}
              onClick={() => onNavigate("community")}>
              Explore Community
            </button>
          </div>
          <div style={{ display:"flex", alignItems:"center" }}>
            {Object.values(INSTRUCTOR_AVATARS).slice(0, 4).map((img, i) => (
              <div key={i} style={{ width:56, height:56, borderRadius:"50%", overflow:"hidden", border:"3px solid rgba(255,255,255,0.8)", marginLeft: i > 0 ? -16 : 0, boxShadow:"0 2px 10px rgba(0,0,0,0.2)" }}>
                <img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
              </div>
            ))}
            <span style={{ marginLeft:16, fontSize:14, fontWeight:700, color:"rgba(255,255,255,0.9)" }}>+2,400 educators</span>
          </div>
        </div>

      </div>
      </div>{/* end display:none */}
    </div>
  );
}
/* ─── old STATE 2 content removed — Dashboard now uses unified render above ─── */


/* ─────────────────────────────────────────────────────────────────────────────
   SESSIONS PAGE
───────────────────────────────────────────────────────────────────────────── */
function SessionsPage({ onOpenSession, toast, quizStates, onAssessmentClick, onCertificateClick, enrolledIds = new Set(), onNavigate, initialSeason = null, onSeasonChange, scheduleRegistrations = {}, setScheduleRegistrations = ()=>{}, sessions = SESSIONS, seasons = SEASONS, sessionsLoading = false }) {
  const [activeSeason, setActiveSeason] = useState(initialSeason);
  const [hoveredSeason, setHoveredSeason] = useState(null);
  function changeSeason(id) { setActiveSeason(id); onSeasonChange?.(id); }

  /* ── Season Detail View ── */
  if (activeSeason) {
    const season = seasons.find(s => s.id === activeSeason);
    const seasonSessions   = sessions.filter(s => season.sessionIds.includes(s.id));
    const liveSessions     = seasonSessions.filter(s => enrolledIds.has(s.id));
    const upcomingSessions = seasonSessions.filter(s => getSessionState(s) === "upcoming");
    const pastSessions     = seasonSessions.filter(s => getSessionState(s) === "past");

    return (
      <div style={{ padding:24, background:C.gray50, minHeight:"100%", display:"flex", flexDirection:"column" }}>
        {/* Breadcrumb */}
        <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:4, marginBottom:20, fontSize:14, fontWeight:500, color:C.gray500 }}>
          <button onClick={()=>changeSeason(null)} style={{ background:"none", border:"none", cursor:"pointer", padding:0, fontSize:14, fontWeight:500, color:C.gray500 }}
            onMouseEnter={e=>e.currentTarget.style.color=C.gray900} onMouseLeave={e=>e.currentTarget.style.color=C.gray500}>
            Sessions
          </button>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="m14.413 10.663-6.25 6.25a.939.939 0 1 1-1.328-1.328L12.42 10 6.836 4.413a.939.939 0 1 1 1.328-1.328l6.25 6.25a.94.94 0 0 1-.001 1.328" fill="var(--c-gray400)"/>
          </svg>
          <span style={{ color:"#6490E8", fontWeight:600 }}>{season.name}</span>
        </div>

        {/* Live */}
        {liveSessions.length > 0 && (
          <div style={{ marginBottom:28 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
              <span style={{ fontSize:14, fontWeight:800, color:C.gray900 }}>{season.name}</span>
              <span style={{ fontSize:11, fontWeight:700, color:"#fff", background:"#10b981", padding:"2px 8px", borderRadius:99 }}>● LIVE</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:16 }}>
              {liveSessions.map(s => <SessionCard key={s.id} session={s} onClick={onOpenSession} quizState={quizStates[s.id]||{}} onAssessmentClick={onAssessmentClick} onCertificateClick={onCertificateClick}/>)}
            </div>
          </div>
        )}

        {/* Past */}
        {pastSessions.length > 0 && (
          <div style={{ marginBottom:28 }}>
            <div style={{ fontSize:14, fontWeight:800, color:C.gray900, marginBottom:14 }}>{season.name}</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:16 }}>
              {pastSessions.map(s => <SessionCard key={s.id} session={s} onClick={onOpenSession} quizState={quizStates[s.id]||{}} onAssessmentClick={onAssessmentClick} onCertificateClick={onCertificateClick}/>)}
            </div>
          </div>
        )}

        {liveSessions.length === 0 && upcomingSessions.length === 0 && pastSessions.length === 0 && (
          <Empty fullPage>
            <EmptyMedia variant="icon" color="#6490E8"><Icon name="video" size={22} color="#6490E8"/></EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>No sessions in this season yet</EmptyTitle>
              <EmptyDescription>Sessions will appear here once they are published by the admin.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    );
  }

  /* ── Seasons Overview ── */
  return (
    <div style={{ padding:24, background:C.gray50, minHeight:"100%", display:"flex", flexDirection:"column" }}>
      <style>{`
        .sp-sessions-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        @media(max-width:900px){ .sp-sessions-grid { grid-template-columns:repeat(2,1fr) !important; } }
        @media(max-width:480px){ .sp-sessions-grid { grid-template-columns:1fr !important; } }
      `}</style>

      {/* Newly published sessions not in any season */}
      {/* ── All sessions grid ── */}
      {sessionsLoading ? (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:20 }}>
          {Array(4).fill(0).map((_,i) => (
            <div key={i} style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", overflow:"hidden" }}>
              <Skeleton height={140} radius={0}/>
              <div style={{ padding:"14px 16px 16px", display:"flex", flexDirection:"column", gap:10 }}>
                <Skeleton height={14} width="50%" radius={6}/>
                <Skeleton height={18} width="80%" radius={6}/>
                <div style={{ display:"flex", gap:8, marginTop:4 }}>
                  <Skeleton height={22} width={70} radius={6}/>
                  <Skeleton height={22} width={50} radius={6}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <Empty fullPage>
          <EmptyMedia variant="icon" color="#6490E8"><Icon name="video" size={22} color="#6490E8"/></EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No sessions published yet</EmptyTitle>
            <EmptyDescription>Sessions will show up here once the admin publishes them.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="sp-sessions-grid">
          {[...new Map(sessions.map(s => [s.id, s])).values()]
            .slice().sort((a,b) => {
              const da = a.availableFrom ? new Date(a.availableFrom).getTime() : Infinity;
              const db = b.availableFrom ? new Date(b.availableFrom).getTime() : Infinity;
              return da - db;
            })
            .map(s => <SessionCard key={s.id} session={s} onClick={onOpenSession} quizState={quizStates?.[s.id]||{}} onAssessmentClick={onAssessmentClick} onCertificateClick={onCertificateClick}/>)}
        </div>
      )}
    </div>
  );
}

function SeasonFolderCard({ season, sessions, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const seasonSessions = sessions.filter(s => season.sessionIds.includes(s.id));
  const liveCount = seasonSessions.filter(s => getSessionState(s) === "live").length;
  const upcomingCount = seasonSessions.filter(s => getSessionState(s) === "upcoming").length;
  const isPast = liveCount === 0 && upcomingCount === 0;
  const statusLabel = liveCount > 0 ? { label:"● Live Now", color:"#fff", bg:"#10b981" }
                    : upcomingCount > 0 ? { label:"Upcoming", color:"#2563eb", bg:"#dbeafe" }
                    : { label:"Past Season", color:"#5D636F", bg:"#f3f4f6" };
  const thumb = seasonSessions[0];
  const thumbSrc = thumb
    ? (INSTRUCTOR_AVATARS[thumb.instructor] || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=340&fit=crop")
    : "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=340&fit=crop";

  return (
    <motion.div
      onClick={onOpen}
      onHoverStart={()=>setHovered(true)}
      onHoverEnd={()=>setHovered(false)}
      whileHover={{ boxShadow:"0 4px 16px rgba(0,0,0,0.08)" }}
      transition={{ duration:0.3, ease:[0.25,1,0.5,1] }}
      style={{ cursor:"pointer", borderRadius:16, border:`1px solid ${C.gray200}`, background:C.white, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", color:"inherit" }}
    >
      {/* Top image */}
      <div style={{ position:"relative", height:144, overflow:"hidden", background:"#1f2937" }}>
        <img src={thumbSrc} alt={season.name}
          style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 20%" }}
          onError={e => e.currentTarget.src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=340&fit=crop"}/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.2) 0%,transparent 60%)" }}/>
      </div>

      {/* Body */}
      <div style={{ padding:"16px 16px 10px" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:17, fontWeight:800, color:C.gray900, lineHeight:1.3 }}>{season.name}</div>
          </div>
        </div>

        <div style={{ marginTop:10 }}>
          <p style={{ margin:"0 0 10px", fontSize:13, color:C.gray600, lineHeight:1.6 }}>{season.description}</p>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            <span style={{ fontSize:11, fontWeight:600, color:C.gray700, background:C.gray200, borderRadius:8, padding:"3px 10px" }}>{seasonSessions.length} sessions</span>
            {season.updatedAt && <span style={{ fontSize:11, fontWeight:600, color:C.gray700, background:C.gray200, borderRadius:8, padding:"3px 10px" }}>Updated {season.updatedAt}</span>}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding:"10px 16px", borderTop:`1px solid ${C.gray100}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div/>
        <span style={{ fontSize:12, fontWeight:600, color:C.primary }}>View all →</span>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SCHEDULE PAGE
───────────────────────────────────────────────────────────────────────────── */
function SchedulePage({ onOpenSession, toast, scheduleRegistrations = {}, setScheduleRegistrations = ()=>{}, sessions = SESSIONS, schedule = SCHEDULE }) {
  const [btnStates, setBtnStates] = useState({});
  const [calendarItem, setCalendarItem] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");

  function getCta(item) {
    if (scheduleRegistrations[item.id]) return "Registered";
    return btnStates[item.id] || item.cta;
  }

  function handleCta(item) {
    const cta = getCta(item);
    if (cta==="Watch Again"||cta==="Resume Lesson") {
      const s = sessions.find(s=>s.id===item.id);
      if (s) onOpenSession(s);
      else toast({ type:"info", title:"Opening session…", message:item.title.slice(0,50) });
      return;
    }
    if (cta==="Register") { setCalendarItem(item); return; }
    if (cta==="Remind Me") { setBtnStates(b=>({...b,[item.id]:"Reminded ✓"})); toast({ type:"success", title:"Reminder set! 🔔", message:`We'll notify you before "${item.title.slice(0,40)}…" starts.` }); return; }
    if (cta==="Reminded ✓") { setBtnStates(b=>({...b,[item.id]:"Remind Me"})); toast({ type:"info", message:"Reminder removed." }); return; }
  }

  // Group items by date label
  const filtered = schedule.filter(item => item.status === activeTab);
  const grouped = filtered.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});
  const dateGroups = Object.entries(grouped);

  const upcomingCount = schedule.filter(i => i.status === "upcoming").length;
  const pastCount = schedule.filter(i => i.status === "past").length;

  return (
    <div style={{ padding:24, background:C.gray50, minHeight:"100%", display:"flex", flexDirection:"column" }}>
      {calendarItem && (
        <AddToCalendarModal
          item={calendarItem}
          onClose={() => setCalendarItem(null)}
          onConfirm={() => {
            setScheduleRegistrations(r => ({ ...r, [calendarItem.id]: true }));
            toast({ type:"success", title:"Registered! 🎉", message:`"${calendarItem.title.slice(0,40)}…" added to your schedule.` });
          }}
        />
      )}

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 }}>
        <div>
          <div style={{ fontSize:11, color:C.primary, fontWeight:700, letterSpacing:1.2, marginBottom:5, textTransform:"uppercase" }}>Event Programming</div>
          <h1 style={{ margin:"0 0 5px", fontSize:26, fontWeight:900, color:C.gray900, lineHeight:1.2 }}>SPED Summit Schedule</h1>
          <p style={{ margin:0, color:C.gray500, fontSize:13, lineHeight:1.5 }}>Explore the full lineup of sessions, workshops &amp; keynote events.</p>
        </div>

        {/* Tab switcher */}
        <div style={{ display:"flex", background:C.gray100, borderRadius:10, padding:3, gap:2, alignSelf:"flex-start" }}>
          {[
            { key:"upcoming", label:"Upcoming", count:upcomingCount },
            { key:"past",     label:"Past",     count:pastCount },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{
                padding:"7px 16px", borderRadius:8, border:"none", cursor:"pointer", fontSize:13, fontWeight:700,
                background: activeTab === tab.key ? C.white : "transparent",
                color: activeTab === tab.key ? C.gray900 : C.gray500,
                boxShadow: activeTab === tab.key ? "0 1px 4px rgba(0,0,0,0.10)" : "none",
                display:"flex", alignItems:"center", gap:6, transition:"all 0.15s",
              }}>
              {tab.label}
              <span style={{
                fontSize:11, fontWeight:700, padding:"1px 6px", borderRadius:20,
                background: activeTab === tab.key ? C.primaryLight : C.gray200,
                color: activeTab === tab.key ? C.primary : C.gray500,
              }}>{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      {dateGroups.length === 0 ? (
        <Empty fullPage>
          <EmptyMedia variant="icon" color="#6490E8"><Icon name="calendar" size={22} color="#6490E8"/></EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No {activeTab} sessions</EmptyTitle>
            <EmptyDescription>{activeTab === "upcoming" ? "No upcoming sessions scheduled. Check back soon." : "No past sessions to show."}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div style={{ display:"flex", flexDirection:"column" }}>
          {dateGroups.map(([dateLabel, items], gi) => {
            const dateParts = dateLabel.match(/(\d+)\w*\s+(\w+)/);
            const dayNum   = dateParts ? dateParts[1] : dateLabel;
            const monthStr = dateParts ? dateParts[2] : "";
            const weekdayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            const months   = {jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};
            const mIdx     = months[monthStr.toLowerCase().slice(0,3)];
            const dObj     = (mIdx !== undefined) ? new Date(2026, mIdx, parseInt(dayNum)) : null;
            const weekday  = dObj ? weekdayNames[dObj.getDay()] : "";
            const isLastGroup = gi === dateGroups.length - 1;

            return (
              <div key={dateLabel} style={{ display:"flex", alignItems:"stretch" }}>

                {/* ── Date label column ── */}
                <div style={{ width:80, flexShrink:0, paddingTop:4, textAlign:"left" }}>
                  <div style={{ fontSize:15, fontWeight:700, color:C.gray900, lineHeight:1.2 }}>{dayNum} {monthStr.slice(0,3)}</div>
                  <div style={{ fontSize:13, color:C.gray400, marginTop:2 }}>{weekday}</div>
                </div>

                {/* ── Spine: dashed line + dots ── */}
                <div style={{ width:32, flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", position:"relative" }}>
                  {/* Top segment of dashed line — above first dot */}
                  {gi > 0 && (
                    <div style={{ width:0, height:14, borderLeft:"2px dashed var(--c-gray200)" }}/>
                  )}
                  {gi === 0 && <div style={{ height:14 }}/>}

                  {/* Date dot */}
                  <div style={{ width:10, height:10, borderRadius:"50%", flexShrink:0, zIndex:1,
                    background: activeTab === "upcoming" ? C.primary : C.gray300,
                    border:`2px solid ${activeTab === "upcoming" ? "var(--c-primaryBorder)" : "var(--c-gray200)"}`,
                    boxShadow: activeTab === "upcoming" ? "0 0 0 3px var(--c-primaryLight)" : "none",
                  }}/>

                  {/* Remaining line to bottom */}
                  {!isLastGroup && (
                    <div style={{ flex:1, width:0, borderLeft:"2px dashed var(--c-gray200)", minHeight:20 }}/>
                  )}
                </div>

                {/* ── Cards column ── */}
                <div style={{ flex:1, paddingLeft:12, paddingBottom: isLastGroup ? 8 : 28, paddingTop:0, display:"flex", flexDirection:"column", gap:10 }}>
                  {items.map((item) => {
                    const tc  = SCHEDULE_TYPE_COLORS[item.type] || { c:C.gray500, bg:"rgba(128,128,128,0.10)" };
                    const cta = getCta(item);
                    const isPast = item.status === "past";
                    return (
                      <div key={item.id} style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:16, padding:"14px 16px", display:"flex", gap:12, alignItems:"center", opacity: isPast ? 0.82 : 1 }}>

                        {/* Thumbnail */}
                        <div style={{ width:84, height:56, borderRadius:10, overflow:"hidden", flexShrink:0 }}>
                          <SessionThumb id={item.id} height={56} noPlayHover/>
                        </div>

                        {/* Body */}
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:4, flexWrap:"wrap" }}>
                            <Badge label={item.type} color={tc.c} bg={tc.bg} size={11}/>
                            <span style={{ fontSize:11, color:C.gray400 }}>·</span>
                            <span style={{ fontSize:11, color:C.gray500, display:"flex", alignItems:"center", gap:3 }}>
                              <Icon name="clock" size={11} color={C.gray400}/>{item.time}
                            </span>
                          </div>
                          <div style={{ fontSize:14, fontWeight:700, color:C.gray900, marginBottom:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.title}</div>
                          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                            <Avatar name={item.instructor} src={INSTRUCTOR_AVATARS[item.instructor]} size={18}/>
                            <span style={{ fontSize:12, color:C.gray600, fontWeight:500 }}>{item.instructor}</span>
                          </div>
                        </div>

                        {/* CTA */}
                        <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
                          {cta === "Recording Unavailable" ? (
                            <Btn variant="outline" size="sm" disabled>
                              <Icon name="warning-circle" size={13} color={C.gray400}/> Unavailable
                            </Btn>
                          ) : cta === "Registered" ? (
                            <SessionCountdown dateStr={item.date} timeStr={item.time}
                              fallback={
                                <div style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:12, color:C.success, background:"rgba(16,185,129,0.10)", padding:"6px 12px", borderRadius:99, fontWeight:600 }}>
                                  Registered
                                </div>
                              }/>
                          ) : cta === "Register" ? (
                            <Btn variant="primary" size="sm" onClick={() => handleCta(item)}>
                              Register
                            </Btn>
                          ) : (cta === "Watch Again" || cta === "Resume Lesson") ? (
                            <Btn variant="outline" size="sm" onClick={() => handleCta(item)}>
                              <Icon name="play" size={13} color={C.gray600}/> {cta}
                            </Btn>
                          ) : cta === "Reminded ✓" ? (
                            <Btn variant="success" size="sm" onClick={() => handleCta(item)}>
                              <Icon name="bell" size={13} color={C.success}/> Reminded
                            </Btn>
                          ) : cta === "Remind Me" ? (
                            <Btn variant="primary" size="sm" onClick={() => handleCta(item)}>
                              <Icon name="bell" size={13} color="#fff"/> Remind Me
                            </Btn>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const SESSION_RESOURCES = {
  1: {
    "Getting Started":      [{ id:1, title:"Mindfulness Starter Guide",       type:"PDF",  size:"2.4 MB", icon:"📄" }],
    "Building Your Practice":[{ id:2, title:"Emotional Regulation Worksheet",  type:"PDF",  size:"1.1 MB", icon:"📋" },
                              { id:3, title:"Session Slide Deck",              type:"PPTX", size:"5.8 MB", icon:"📊" }],
  },
  2: {
    "Foundations":           [{ id:1, title:"Accommodations Checklist",        type:"PDF",  size:"890 KB", icon:"📋" }],
    "Practical Application": [{ id:2, title:"IEP Template",                   type:"DOCX", size:"1.3 MB", icon:"📝" }],
  },
  3: {
    "Core Concepts":         [{ id:1, title:"DHH Language Strategies",         type:"PDF",  size:"3.2 MB", icon:"📄" },
                              { id:2, title:"Audiogram Reference Sheet",        type:"PDF",  size:"560 KB", icon:"📋" }],
    "Language & Literacy":   [{ id:3, title:"Literacy Activity Pack",          type:"ZIP",  size:"12.4 MB",icon:"🗂️" },
                              { id:4, title:"Session Slide Deck",              type:"PPTX", size:"7.1 MB", icon:"📊" }],
  },
  4: {
    "Team Foundations":      [{ id:1, title:"Paraeducator Training Manual",    type:"PDF",  size:"4.5 MB", icon:"📄" }],
  },
  5: {
    "Introduction to AI":    [{ id:1, title:"AI Tools Comparison Chart",       type:"PDF",  size:"1.8 MB", icon:"📋" }],
    "Implementation":        [{ id:2, title:"Implementation Roadmap",          type:"DOCX", size:"2.1 MB", icon:"📝" }],
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
   SESSION DETAIL (VIDEO EXPERIENCE)
───────────────────────────────────────────────────────────────────────────── */
function VimeoPlayer({ url, onPlay, onPause, onProgress, initialProgress = 0, sessionId, userId }) {
  const videoId = extractVimeoId(url);
  const iframeRef = useRef(null);
  const storageKey = videoId ? `vimeo_pos_${videoId}` : null;
  const savedTime = storageKey ? (parseFloat(localStorage.getItem(storageKey)) || 0) : 0;
  const onProgressRef = useRef(onProgress);
  const maxPctRef = useRef(initialProgress);
  const [embedError, setEmbedError] = useState(null);

  // Analytics state
  const viewRowId = useRef(null);
  const watchedSeconds = useRef(0);
  const totalSeconds = useRef(0);
  const lastTime = useRef(0);
  const saveThrottle = useRef(null);

  useEffect(() => { onProgressRef.current = onProgress; }, [onProgress]);

  const prevVideoIdRef = useRef(videoId);
  useEffect(() => {
    if (prevVideoIdRef.current !== videoId) {
      prevVideoIdRef.current = videoId;
      maxPctRef.current = 0;
      viewRowId.current = null;
      watchedSeconds.current = 0;
    }
  }, [videoId]);

  async function insertView() {
    if (!videoId || !userId || viewRowId.current) return;
    try {
      const { data } = await supabase.from("video_views").insert({
        session_id: sessionId || null,
        vimeo_id: videoId,
        user_id: userId,
        watched_seconds: 0,
        total_seconds: totalSeconds.current,
        completed: false,
      }).select("id").single();
      if (data?.id) viewRowId.current = data.id;
    } catch(_) {}
  }

  async function updateView(completed = false) {
    if (!viewRowId.current) return;
    try {
      await supabase.from("video_views").update({
        watched_seconds: Math.round(watchedSeconds.current),
        total_seconds: totalSeconds.current,
        completed,
      }).eq("id", viewRowId.current);
    } catch(_) {}
  }

  useEffect(() => {
    if (!videoId) return;
    setEmbedError(null);
    function onMsg(e) {
      if (e.origin !== "https://player.vimeo.com") return;
      try {
        const d = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (d.event === "error") {
          setEmbedError(d.data?.code ?? d.data?.message ?? "unknown");
          return;
        }
        if (d.event === "ready" && iframeRef.current) {
          const sub = v => iframeRef.current.contentWindow.postMessage(JSON.stringify({ method:"addEventListener", value:v }), "https://player.vimeo.com");
          sub("timeupdate"); sub("play"); sub("pause"); sub("seeked"); sub("ended");
          // Get duration
          iframeRef.current.contentWindow.postMessage(JSON.stringify({ method:"getDuration" }), "https://player.vimeo.com");
          if (savedTime > 0) {
            iframeRef.current.contentWindow.postMessage(JSON.stringify({ method:"setCurrentTime", value: savedTime }), "https://player.vimeo.com");
          }
        }
        if (d.method === "getDuration" && d.value) {
          totalSeconds.current = Math.round(d.value);
        }
        if (d.event === "play") {
          onPlay?.();
          insertView();
        }
        if (d.event === "pause") { onPause?.(); updateView(false); }
        if (d.event === "ended") { watchedSeconds.current = totalSeconds.current; updateView(true); }
        if (d.event === "timeupdate" && d.data?.seconds != null) {
          localStorage.setItem(storageKey, d.data.seconds);
          // Accumulate only forward progress (ignore seeks back)
          const cur = d.data.seconds;
          if (cur > lastTime.current) watchedSeconds.current += (cur - lastTime.current);
          lastTime.current = cur;
          if (d.data.duration) totalSeconds.current = Math.round(d.data.duration);

          // Throttle save every 10s
          if (!saveThrottle.current) {
            saveThrottle.current = setTimeout(() => { saveThrottle.current = null; updateView(false); }, 10000);
          }

          if (d.data.percent != null) {
            const pct = Math.round(d.data.percent * 100);
            if (pct > maxPctRef.current) {
              maxPctRef.current = pct;
              onProgressRef.current?.(pct);
            }
          }
        }
        if (d.event === "seeked") {
          lastTime.current = d.data?.seconds ?? lastTime.current;
          onProgressRef.current?.(maxPctRef.current);
        }
      } catch {}
    }
    window.addEventListener("message", onMsg);
    return () => {
      window.removeEventListener("message", onMsg);
      if (saveThrottle.current) clearTimeout(saveThrottle.current);
    };
  }, [videoId]);

  if (!videoId) {
    return (
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"#0f172a", color:"rgba(255,255,255,0.5)", fontSize:14 }}>
        Invalid Vimeo URL
      </div>
    );
  }

  const vimeoHash = extractVimeoHash(url);
  const embedUrl = `https://player.vimeo.com/video/${videoId}${vimeoHash ? `?h=${vimeoHash}&` : "?"}autoplay=0&title=0&byline=0&portrait=0&dnt=1&api=1`;

  return (
    <div style={{ position:"absolute", inset:0 }}>
      {embedError !== null && (
        <div style={{ position:"absolute", inset:0, zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#0f172a", gap:12 }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/><line x1="10" y1="15" x2="10" y2="15"/><line x1="12" y1="8" x2="12" y2="12"/>
          </svg>
          <div style={{ color:"rgba(255,255,255,0.7)", fontSize:15, fontWeight:600 }}>Video unavailable</div>
          <div style={{ color:"rgba(255,255,255,0.4)", fontSize:13, textAlign:"center", maxWidth:280 }}>
            {embedError === -102
              ? "This video is not allowed to be embedded here. The video owner needs to enable embedding for this domain."
              : `Playback error (${embedError})`}
          </div>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            style={{ marginTop:4, padding:"8px 18px", background:"#1db954", color:"#fff", borderRadius:6, fontSize:13, textDecoration:"none", fontWeight:600 }}
          >
            Watch on Vimeo
          </a>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={embedUrl}
        style={{ position:"absolute", inset:0, width:"100%", height:"100%", border:"none" }}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title="Session video"
      />
    </div>
  );
}

function InlineAssessment({ session, quizState = {}, onFinish, toast, stickyFooter = false, onNext, canNext, onCertificateClick }) {
  const questions = getSessionQuestions(session);
  const [currentQ, setCurrentQ] = useState(quizState.currentQ || 0);
  const [answers, setAnswers] = useState(quizState.answers || {});
  const [submitted, setSubmitted] = useState(quizState.status === "passed" || quizState.status === "failed");
  const [score, setScore] = useState(quizState.score ?? null);
  const passed = quizState.status === "passed";

  if (!questions.length) return (
    <div style={{ textAlign:"center", padding:"40px 0", color:C.gray400, fontSize:14 }}>No assessment available for this session.</div>
  );

  if (submitted) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
                    minHeight:"calc(100vh - 160px)", padding:"40px 24px",
                    background:C.white, flex:1 }}>
        <div style={{ maxWidth:480, width:"100%", textAlign:"center" }}>
          <div style={{ width:72, height:72, borderRadius:"50%", background: passed ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.1)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
            <Icon name={passed ? "medal" : "x"} size={32} color={passed ? C.success : "#ef4444"}/>
          </div>
          <div style={{ fontSize:22, fontWeight:800, color:C.gray900, marginBottom:10 }}>{passed ? "🎉 You passed!" : "Not quite there"}</div>
          <div style={{ fontSize:15, color:C.gray500, marginBottom:28 }}>You scored <strong>{score}%</strong> — {passed ? "your certificate is ready!" : "you need 80% to pass."}</div>
          {passed ? (
            <button onClick={()=> onCertificateClick ? onCertificateClick(session) : downloadCertificate({ recipientName:adminName, sessionTitle:session.title, instructor:session.instructor, duration:session.duration, score, description:session.description })}
              style={{ padding:"12px 32px", background:C.primary, color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8 }}>
              <Icon name="certificate" size={16} color="#fff"/> View Certificate
            </button>
          ) : (
            <button onClick={()=>{ setAnswers({}); setCurrentQ(0); setSubmitted(false); setScore(null); }}
              style={{ padding:"12px 32px", background:C.primary, color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}>
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  const q = questions[currentQ];
  const total = questions.length;

  function handleSelect(optIdx) {
    setAnswers(a => ({ ...a, [currentQ]: optIdx }));
  }

  function handleNext() {
    if (currentQ < total - 1) { setCurrentQ(q => q + 1); return; }
    // Submit
    const correct = Object.entries(answers).filter(([qi, ans]) => questions[Number(qi)]?.a === ans).length;
    const finalScore = Math.round((correct / total) * 100);
    const didPass = finalScore >= 80;
    setScore(finalScore);
    setSubmitted(true);
    onFinish?.(session.id, finalScore, didPass);
  }

  const questionBody = (
    <div style={{ maxWidth:560, margin:"0 auto" }}>
      {/* Progress */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <div style={{ flex:1, height:4, background:C.gray100, borderRadius:2, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${((currentQ) / total) * 100}%`, background:C.primary, borderRadius:2, transition:"width .3s" }}/>
        </div>
        <span style={{ fontSize:12, fontWeight:600, color:C.gray500, flexShrink:0 }}>Q{currentQ+1} / {total}</span>
      </div>

      {/* Question */}
      <div style={{ fontSize:16, fontWeight:700, color:C.gray900, lineHeight:1.55, marginBottom:20 }}>{q.q}</div>

      {/* Options */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {(q.opts || []).map((opt, i) => {
          const selected = answers[currentQ] === i;
          return (
            <button key={i} onClick={() => handleSelect(i)}
              style={{ padding:"12px 16px", borderRadius:10, border:`2px solid ${selected ? C.primary : C.gray200}`, background: selected ? C.primaryLight : C.white, fontSize:14, fontWeight: selected ? 600 : 400, color: selected ? C.primary : C.gray800, cursor:"pointer", textAlign:"left", transition:"all .12s" }}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      {/* Scrollable content */}
      <div style={{ flex:1, overflowY:"auto", padding:"32px 28px 16px" }}>
        {questionBody}
      </div>
      {/* Fixed CTA footer */}
      <div style={{ flexShrink:0, borderTop:"1px solid #e5e7eb", padding:16, background:C.white }}>
        <button onClick={handleNext} disabled={answers[currentQ] === undefined}
          style={{ width:"100%", padding:"13px", background: answers[currentQ] === undefined ? C.gray200 : C.primary, color: answers[currentQ] === undefined ? C.gray400 : "#fff", border:"none", borderRadius:10, fontSize:15, fontWeight:700, cursor: answers[currentQ] === undefined ? "not-allowed" : "pointer", transition:"background .15s" }}>
          {currentQ < total - 1 ? "Next Question" : "Submit Assessment"}
        </button>
      </div>
    </div>
  );
}

function SessionDetail({ session, onBack, backLabel, sessionSource, toast, onAssessmentClick, onUpdateProgress, adminName = "", adminAvatar = null, isDark = false, quizState = {}, onFinishAssessment, userEmail = "", onCertificateClick }) {
  const [playing, setPlaying] = useState(false);
  const [activeLesson, setActiveLesson] = useState(() => { const idx = session.lessons.findIndex(l=>l.status==="active" && l.type!=="quiz"); return idx >= 0 ? idx : 0; });
  const [progress, setProgress] = useState(session.progress || 0);
  const [unlockedIndices, setUnlockedIndices] = useState(() =>
    new Set(session.lessons.map((l, i) => (l.status !== "locked" || l.type === "material") ? i : null).filter(x => x !== null))
  );
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [followed, setFollowed] = useState(false);
  const [downloaded, setDownloaded] = useState({});
  const [bottomTab, setBottomTab] = useState("overview");
  const [panelMode, setPanelMode] = useState("video"); // "video" | "assessment"
  const [collapsedSections, setCollapsedSections] = useState({});
  const [sdComments, setSdComments] = useState([]);
  const [sdCommentsLoading, setSdCommentsLoading] = useState(false);
  const [sdNewComment, setSdNewComment] = useState("");
  const [sdPosting, setSdPosting] = useState(false);
  const [sdDeleteConfirm, setSdDeleteConfirm] = useState(null);
  const chatRef = useRef(null);
  const chatInputRef = useRef(null);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [narrow, setNarrow] = useState(false);
  const [videoHeight, setVideoHeight] = useState(0);
  const lesson = session.lessons[activeLesson] || session.lessons[0];
  const lastSavedPctRef = useRef(session.progress || 0);
  const saveThrottleRef = useRef(null);
  const latestPctRef = useRef(session.progress || 0);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (bottomTab === "community") {
      chatInputRef.current?.focus();
      setSdCommentsLoading(true);
      supabase.from("session_comments").select("*").eq("session_id", String(session.id)).order("created_at", { ascending: false })
        .then(({ data }) => { setSdComments(data || []); setSdCommentsLoading(false); });
    }
  }, [bottomTab, session.id]);

  function sendMessage() {
    if (!message.trim()) return;
    setMessages(m=>[...m,{user:"You",color:"#6490E8",text:message,time:"now"}]);
    setMessage("");
  }

  function switchLesson(idx) {
    const l = session.lessons[idx];
    if (!l) return;
    if (!unlockedIndices.has(idx) && l.type !== "material") {
      toast({ type:"warning", title:"Lesson locked", message:"Watch 80% of the previous video to unlock this lesson." });
      return;
    }
    if (l.type==="quiz") {
      setPanelMode("assessment"); return;
    }
    setPanelMode("video");
    setActiveLesson(idx);
    setProgress(l.status==="completed"?100:0);
    setPlaying(false);
  }

  // Responsive: detect if the container is narrow + measure video height for sidebar
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setNarrow(w < 780);
      // sidebar width is 272; video takes remaining width at 16:9
      setVideoHeight((w - 272) * 0.5625);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Unified info card — title + description + instructor row (YouTube-style)
  const InfoCard = () => (
    <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, overflow:"hidden", marginBottom:16 }}>
      {/* Title + badge */}
      <div style={{ padding:"16px 18px 12px" }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:8 }}>
          <h2 style={{ margin:0, fontSize: narrow ? 15 : 16, fontWeight:800, color:C.gray900, flex:1, lineHeight:1.35 }}>{session.title}</h2>
          <Badge label="ACTIVE" color={C.success} bg={C.successLight}/>
        </div>
        {/* Meta row */}
        <div style={{ display:"flex", gap:16, fontSize:12, color:C.gray400, marginBottom:10 }}>
          <span style={{ display:"flex", gap:4, alignItems:"center" }}><Icon name="timer" size={13} color={C.gray400}/>{session.duration}</span>
          <span style={{ display:"flex", gap:4, alignItems:"center" }}><Icon name="article" size={13} color={C.gray400}/>{session.resources} Resources</span>
        </div>
        {/* Description */}
        <p style={{ margin:0, fontSize:14, color:C.gray500, lineHeight:1.65 }}>{session.description}</p>
      </div>
      {/* Instructor row — like YouTube channel info */}
      <div style={{ padding:"12px 18px 14px", borderTop:`1px solid ${C.gray100}`, display:"flex", alignItems:"center", gap:12 }}>
        <Avatar name={session.instructor} src={session.instructorImage || INSTRUCTOR_AVATARS[session.instructor]} size={40}/>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:700, fontSize:14, color:C.gray900, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{session.instructor}</div>
          <div style={{ fontSize:12, color:C.gray400, marginTop:1 }}>Special Ed Instructor</div>
        </div>
        <div className="sd-info-btns" style={{ display:"flex", gap:8, flexShrink:0 }}>
          <Btn
            variant={followed ? "success" : "primary"} size="sm"
            onClick={() => {
              setFollowed(f => !f);
              toast({ type: followed ? "info" : "success", message: followed ? `Unfollowed ${session.instructor.split(" ")[0]}` : `Now following ${session.instructor.split(" ")[0]}!` });
            }}>
            <Icon name={followed ? "check" : "plus"} size={12} color={followed ? C.success : "#fff"}/>
            {followed ? "Following" : "Follow"}
          </Btn>
          <Btn variant="outline" size="sm" onClick={() => setBottomTab("resources")}>
            <Icon name="share-network" size={12} color={C.gray600}/>Share
          </Btn>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} style={{ background: panelMode === "assessment" ? C.white : "#f5f5f5", fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif" }}>
      <style>{`
        .sd-mobile-tabs { display:none; }
        @media(max-width:767px){
          .sd-mobile-tabs { display:flex !important; }
          .sd-layout { flex-direction:column !important; height:auto !important; overflow:visible !important; }
          .sd-sidebar { display:none !important; }
          .sd-video-panel { padding:0 !important; height:auto !important; overflow:visible !important; }
          .sd-video-card { border-radius:0 !important; box-shadow:none !important; height:auto !important; overflow:visible !important; }
          .sd-video-wrap { padding:0 !important; }
          .sd-video-wrap > div { border-radius:0 !important; }
          .sd-tab-content { padding:16px 14px !important; }
          .sd-community-layout { flex-direction:column !important; }
          .sd-community-layout > div:last-child { width:100% !important; }
          .sd-instructor-header { flex-direction:row !important; }
        }
        @media(max-width:640px){
          .sd-tabs-bar { padding:0 12px !important; overflow-x:auto; -webkit-overflow-scrolling:touch; }
          .sd-tabs-bar button { padding:12px 12px !important; font-size:13px !important; flex-shrink:0; }
          .sd-tab-content { padding:16px 14px !important; }
          .sd-overview-stats { gap:16px !important; }
          .sd-overview-stats > div > div:first-child { font-size:18px !important; }
          .sd-instructor-header { flex-direction:column !important; align-items:flex-start !important; gap:12px !important; }
          .sd-instructor-socials { flex-wrap:wrap !important; gap:6px !important; }
          .sd-instructor-stats { overflow-x:auto; }
          .sd-instructor-stats > div { min-width:72px; }
          .sd-info-btns { flex-wrap:wrap !important; gap:6px !important; }
        }
      `}</style>

      {/* ── Breadcrumb bar ── */}
      <div style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 20px", borderBottom:`1px solid ${C.gray200}`, background:C.white, fontSize:13, color:C.gray500 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", padding:0, fontSize:13, color:C.gray500, fontFamily:"inherit", fontWeight:500 }}
          onMouseEnter={e=>e.currentTarget.style.color=C.gray900}
          onMouseLeave={e=>e.currentTarget.style.color=C.gray500}>
          My Learnings
        </button>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="m8 5 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span style={{ color:C.gray900, fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:400 }}>{session.title}</span>
      </div>

      {/* ── Mobile lesson tab strip (browser-tab style) ── */}
      <div className="sd-mobile-tabs" style={{ background:C.white, borderBottom:`1px solid ${C.gray200}`, overflowX:"auto", WebkitOverflowScrolling:"touch", scrollbarWidth:"none", msOverflowStyle:"none", gap:0 }}>
        <style>{`.sd-mobile-tabs::-webkit-scrollbar{display:none}`}</style>
        {session.lessons.filter(l => !(l.type === "quiz" && getSessionQuestions(session).length === 0)).map((l, i) => {
          const isQuiz = l.type === "quiz";
          const isActive = isQuiz ? panelMode === "assessment" : (i === activeLesson && panelMode === "video");
          const done = l.status === "completed";
          const label = isQuiz ? "Assessment" : (l.title || session.title);
          return (
            <button key={String(l.id)} onClick={() => { if (isQuiz) { setPanelMode("assessment"); } else { switchLesson(i); setPanelMode("video"); } }}
              style={{ flexShrink:0, maxWidth:140, minWidth:80, padding:"10px 12px", background: isActive ? C.white : C.gray50,
                       borderBottom: isActive ? `2px solid ${C.primary}` : "2px solid transparent",
                       borderTop:"none", borderLeft:"none", borderRight:`1px solid ${C.gray200}`,
                       fontSize:12, fontWeight: isActive ? 700 : 500,
                       color: isActive ? C.primary : done ? C.gray500 : C.gray600,
                       cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"flex-start",
                       gap:2, transition:"background .12s", boxSizing:"border-box" }}>
              <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", width:"100%", display:"block" }}>{label}</span>
              {done && <span style={{ fontSize:10, color:"#16a34a", fontWeight:600 }}>✓ Done</span>}
              {!done && isQuiz && <span style={{ fontSize:10, color:C.gray400 }}>{getSessionQuestions(session).length}q</span>}
              {!done && !isQuiz && l.duration && <span style={{ fontSize:10, color:C.gray400 }}>{l.duration}</span>}
            </button>
          );
        })}
      </div>

      {/* ── Top row: Sidebar + Video ── */}
      <div className="sd-layout" style={{ display:"flex", alignItems:"flex-start", gap:0, height:"calc(100vh - 101px)", overflow:"hidden" }}>

        {/* ── Sidebar: Course Content (LEFT) ── */}
        <div className="sd-sidebar" style={{
          width: 300,
          flexShrink: 0,
          height: "100%",
          overflowY: "hidden",
          background: "#f5f5f5",
          padding: "16px 12px",
          boxSizing: "border-box",
        }}>
          {/* Floating panel */}
          <div className="sd-sidebar-inner" style={{
            background: C.white,
            borderRadius: 16,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)",
            height: "100%",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}>
          <div>
            {(() => {
              const sections = [];
              let currentSection = null;
              session.lessons.forEach((l, i) => {
                if (l.sectionTitle) {
                  currentSection = { title: l.sectionTitle, lessons: [] };
                  sections.push(currentSection);
                } else if (!currentSection) {
                  currentSection = { title: null, lessons: [] };
                  sections.push(currentSection);
                }
                currentSection.lessons.push({ ...l, _index: i });
              });
              // Only show section headers when there are 2+ distinct named sections
              const distinctTitles = new Set(sections.map(s => s.title).filter(Boolean));
              const showHeaders = distinctTitles.size >= 2;
              let namedSectionCount = 0;
              return sections.map((sec, si) => {
                const secKey = `sec-${si}`;
                const isCollapsed = collapsedSections[secKey];
                const completedCount = sec.lessons.filter(l => l.status === "completed").length;
                if (sec.title) namedSectionCount++;
                const showHeader = showHeaders && !!sec.title;
                return (
                  <div key={secKey}>
                    {showHeader && (
                    <button onClick={() => setCollapsedSections(s => ({ ...s, [secKey]: !s[secKey] }))}
                      style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:C.gray50, border:"none", cursor:"pointer", textAlign:"left", gap:8 }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:12, fontWeight:700, color:C.gray900 }}>{namedSectionCount === 1 ? "" : `${namedSectionCount}. `}{sec.title}</div>
                        <div style={{ fontSize:12, color:C.gray400, marginTop:1 }}>{sec.lessons.length} lesson{sec.lessons.length!==1?"s":""}{completedCount>0 ? ` · ${completedCount} done` : ""}</div>
                      </div>
                      <Icon name={isCollapsed ? "caret-down" : "caret-up"} size={13} color={C.gray400}/>
                    </button>
                    )}
                    {(!showHeader || !isCollapsed) && (
                      <div style={{ padding:"4px 0 8px" }}>
                        {sec.lessons.map(l => {
                          const i = l._index;
                          const isQuiz = l.type === "quiz";
                          // Hide assessment row if no real questions exist for this session
                          if (isQuiz && getSessionQuestions(session).length === 0) return null;
                          const isActive = (i === activeLesson && l.type !== "quiz" && panelMode === "video") || (l.type === "quiz" && panelMode === "assessment");
                          const locked = !unlockedIndices.has(i) && l.type !== "material";
                          const quizDone = isQuiz && l.status === "completed";
                          const isPreview = i === 0 || l.status === "available";
                          const done = l.status === "completed" || quizDone;
                          return (
                            <div key={String(l.id)} onClick={() => switchLesson(i)}
                              style={{ padding:"6px 10px", cursor: locked ? "default" : "pointer" }}>
                              <div style={{
                                display:"flex", alignItems:"center", gap:12, padding:"10px 12px",
                                background: isActive || done ? "#eef2ff" : "transparent",
                                borderRadius:10,
                                transition:"background .15s"
                              }}
                                onMouseEnter={e => { if (!locked && !isActive && !done) e.currentTarget.style.background = C.gray50; }}
                                onMouseLeave={e => { if (!isActive && !done) e.currentTarget.style.background = "transparent"; }}>
                                <div style={{ flexShrink:0 }}>
                                  {done
                                    ? <div style={{ width:18, height:18, borderRadius:"50%", background:"#16a34a", display:"flex", alignItems:"center", justifyContent:"center" }}><Icon name="check" size={11} color="#fff"/></div>
                                    : <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${locked ? C.gray200 : isActive ? C.primary : C.gray300}`, background:"transparent" }}/>
                                  }
                                </div>
                                <div style={{ flex:1, minWidth:0 }}>
                                  <div style={{ fontSize:13, fontWeight: isActive || done ? 600 : 400, color: locked ? C.gray400 : C.gray900, lineHeight:1.4 }}>{isQuiz ? "Assessment" : session.title}</div>
                                  <div style={{ fontSize:12, color: C.gray400, marginTop:2 }}>
                                    {isQuiz ? (() => { const qc = Array.isArray(l.questions) ? l.questions.length : (l.questions||0); return `${qc} question${qc!==1?"s":""}`; })() : <LessonDuration vimeoUrl={l.vimeoUrl || session.vimeoUrl} fallback={l.duration}/>}
                                  </div>
                                </div>
                                {locked && <Icon name="lock" size={13} color={C.gray300}/>}
                              </div>
                            </div>
                          );
                        })}
                        {(SESSION_RESOURCES[session.id] || {})[sec.title]?.map(r => {
                          const isDone = !!downloaded[r.id];
                          const typeColor = r.type==="PDF" ? { bg:"#fef2f2", color:"#dc2626" } : r.type==="PPTX" ? { bg:"#fff7ed", color:"#ea580c" } : r.type==="ZIP" ? { bg:"#f5f3ff", color:"#7c3aed" } : { bg:C.primaryLight, color:C.primary };
                          return (
                            <div key={r.id} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"10px 16px", background:"transparent", borderLeft:"3px solid transparent", transition:"background .1s" }}
                              onMouseEnter={e => e.currentTarget.style.background = C.gray50}
                              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                              <div style={{ marginTop:1, width:18, height:18, borderRadius:4, background:typeColor.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                                <Icon name="paperclip" size={12} color={typeColor.color}/>
                              </div>
                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ fontSize:12, fontWeight:400, color:C.gray900, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.title}</div>
                                <div style={{ display:"flex", gap:5, alignItems:"center", marginTop:2 }}>
                                  <span style={{ fontSize:12, fontWeight:700, color:typeColor.color, background:typeColor.bg, borderRadius:4, padding:"1px 5px" }}>{r.type}</span>
                                  <span style={{ fontSize:12, color:C.gray400 }}>{r.size}</span>
                                </div>
                              </div>
                              <button onClick={() => { setDownloaded(d=>({...d,[r.id]:true})); toast({ type:"success", message:`Downloading ${r.title}` }); }}
                                style={{ width:26, height:26, borderRadius:"50%", border:"none", cursor: isDone?"default":"pointer", display:"flex", alignItems:"center", justifyContent:"center", background: isDone ? C.successLight : C.gray100, flexShrink:0, marginTop:1 }}
                                onMouseEnter={e => { if (!isDone) e.currentTarget.style.background = C.primaryLight; }}
                                onMouseLeave={e => { if (!isDone) e.currentTarget.style.background = C.gray100; }}>
                                <Icon name={isDone?"check":"download"} size={12} color={isDone ? C.success : C.gray500}/>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
          </div>{/* end floating panel */}
        </div>

        {/* ── Video Player + Content (RIGHT) ── */}
        <div className="sd-video-panel" style={{ flex:1, minWidth:0, padding:"16px 16px 16px 12px", height:"100%", overflow:"hidden", boxSizing:"border-box" }}>
          {/* Unified Card — scrolls as one unit */}
          <div className="sd-video-card" style={{ background:C.white, borderRadius:20, boxShadow:"0 2px 16px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05)", height:"100%", overflowY:"auto", overflowX:"hidden", display:"flex", flexDirection:"column" }}>

          {panelMode === "assessment" ? (
            /* ── Assessment Panel ── */
            <InlineAssessment session={session} quizState={quizState} onFinish={onFinishAssessment} toast={toast} onCertificateClick={onCertificateClick}/>
          ) : (<>

            {/* Video with padding so card corners show */}
            <div className="sd-video-wrap" style={{ padding:"16px 16px 0", flexShrink:0 }}>
              <div style={{ borderRadius:12, overflow:"hidden", background:"#000" }}>
        <div ref={videoRef} style={{ position:"relative", background:"#0f172a", paddingBottom:"56.25%", height:0 }}>
            <div style={{ position:"absolute", inset:0 }}>
              {(session.vimeoUrl || lesson?.vimeoUrl) ? (
                <VimeoPlayer url={session.vimeoUrl || lesson?.vimeoUrl} initialProgress={session.progress || 0} sessionId={session.id} userId={userEmail || adminName || undefined} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onProgress={pct => {
                  setProgress(pct);
                  latestPctRef.current = pct;
                  if (pct >= 80) { setUnlockedIndices(prev => { const next = new Set(prev); next.add(activeLesson + 1); return next; }); }
                  // Throttle Supabase saves to once every 5s; always save on milestone crossings
                  const isMilestone = (pct >= 75 && lastSavedPctRef.current < 75) || (pct >= 100 && lastSavedPctRef.current < 100);
                  if (isMilestone) {
                    lastSavedPctRef.current = pct;
                    onUpdateProgress?.(session.id, pct, activeLesson);
                  } else if (!saveThrottleRef.current) {
                    saveThrottleRef.current = setTimeout(() => {
                      saveThrottleRef.current = null;
                      const cur = latestPctRef.current; // read latest, not stale closure value
                      lastSavedPctRef.current = cur;
                      onUpdateProgress?.(session.id, cur, activeLesson);
                    }, 5000);
                  }
                }}/>
              ) : (
                <>
                  <SessionThumb id={session.id} height="100%" overlay={!playing}/>
                  <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <button onClick={() => setPlaying(p => !p)}
                      style={{ width:58, height:58, borderRadius:"50%", background:"rgba(0,0,0,0.5)", backdropFilter:"blur(8px)", border:"2px solid rgba(255,255,255,0.45)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"transform .2s" }}
                      onMouseEnter={e => e.currentTarget.style.transform="scale(1.1)"}
                      onMouseLeave={e => e.currentTarget.style.transform=""}>
                      <Icon name={playing ? "pause" : "play"} size={22} color="#fff"/>
                    </button>
                  </div>
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"linear-gradient(transparent, rgba(0,0,0,0.75))", padding:"24px 14px 10px", display:"flex", flexDirection:"column", gap:6 }}>
                    <div style={{ position:"relative", height:4, background:"rgba(255,255,255,0.3)", borderRadius:2, cursor:"pointer" }}
                      onClick={e => { const r = e.currentTarget.getBoundingClientRect(); const pct = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)); setProgress(pct * 100); onUpdateProgress?.(session.id, pct * 100, activeLesson); }}>
                      <div style={{ height:"100%", width:`${progress || 0}%`, background:"#6490E8", borderRadius:2, transition:"width 0.1s" }}/>
                      <div style={{ position:"absolute", top:"50%", left:`${progress || 0}%`, transform:"translate(-50%,-50%)", width:12, height:12, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,0.4)" }}/>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <button onClick={() => setPlaying(p => !p)} style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex", flexShrink:0 }}>
                        <Icon name={playing ? "pause" : "play"} size={18} color="#fff"/>
                      </button>
                      <span style={{ fontSize:11, color:"rgba(255,255,255,0.8)", fontFamily:"'Inter',sans-serif", flexShrink:0 }}>
                        {Math.floor((progress||0)/100 * (session.durationSec||0) / 60)}:{String(Math.floor((progress||0)/100 * (session.durationSec||0) % 60)).padStart(2,"0")} / {Math.floor((session.durationSec||0)/60)}:{String((session.durationSec||0)%60).padStart(2,"0")}
                      </span>
                      <div style={{ flex:1 }}/>
                      <button style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex" }}
                        onClick={() => { const el = videoRef.current; if (el?.requestFullscreen) el.requestFullscreen(); }}>
                        <Icon name="corners-out" size={16} color="#fff"/>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
              </div>{/* end video inner rounded */}
            </div>{/* end video padding wrapper */}

            {/* Title row */}
            <div style={{ padding:"16px 24px 0", flexShrink:0 }}>
              <h2 style={{ margin:0, fontSize:18, fontWeight:700, color:C.gray900, lineHeight:1.4, fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif" }}>{session.title}</h2>
            </div>

            {/* Tab bar — sticky within card */}
          <div className="sd-tabs-bar" style={{ display:"flex", padding:"4px 20px 0", borderBottom:"1px solid rgba(0,0,0,0.07)", background:C.white, gap:4, marginTop:12, position:"sticky", top:0, zIndex:10 }}>
          {[
            { key:"overview",    label:"Overview"    },
            { key:"instructor",  label:"Instructor"  },
            { key:"community",   label:"Community"   },
          ].map(tab => {
            const isActive = bottomTab === tab.key;
            return (
              <button key={tab.key} onClick={() => setBottomTab(tab.key)}
                style={{ padding:"12px 16px", border:"none", background: isActive ? C.white : "transparent", cursor:"pointer", fontSize:13, fontWeight: isActive ? 700 : 500, color: isActive ? C.gray900 : C.gray500, borderBottom: isActive ? `2px solid ${C.primary}` : "2px solid transparent", marginBottom:-1, whiteSpace:"nowrap", transition:"color .15s", borderRadius:"8px 8px 0 0" }}>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview */}
        {bottomTab === "overview" && (
          <div className="sd-tab-content" style={{ padding:"20px 24px 24px" }}>
            {(session.duration || session.category) && (
              <div className="sd-overview-stats" style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
                {session.duration && (
                  <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:12, fontWeight:600, color:C.gray600, background:C.gray100, borderRadius:99, padding:"5px 12px" }}>
                    <Icon name="clock" size={12} color={C.gray500}/>{session.duration}
                  </span>
                )}
                {session.category && (
                  <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:12, fontWeight:600, color:C.primary, background:C.primaryLight, borderRadius:99, padding:"5px 12px" }}>
                    {session.category}
                  </span>
                )}
              </div>
            )}
            {session.description ? (
              <p style={{ margin:0, fontSize:14, color:C.gray600, lineHeight:1.85 }}>{session.description}</p>
            ) : (
              <p style={{ margin:0, fontSize:14, color:C.gray400, lineHeight:1.85, fontStyle:"italic" }}>No description provided for this session.</p>
            )}
          </div>
        )}

        {/* Instructor */}
        {bottomTab === "instructor" && (
          <div className="sd-tab-content" style={{ padding:"22px 24px" }}>
            {session.instructor ? (
              <div className="sd-instructor-header" style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
                <Avatar name={session.instructor} src={session.instructorImage || undefined} size={68}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:800, fontSize:18, color:C.gray900, marginBottom:2 }}>{session.instructor?.split("|")[0]?.trim()}</div>
                  {session.instructorDesignation && <div style={{ fontSize:13, color:C.primary, fontWeight:600, marginBottom:6 }}>{session.instructorDesignation}</div>}
                  {session.instructorBio && (
                    <p style={{ margin:"0 0 4px", fontSize:14, color:C.gray600, lineHeight:1.8 }}>{session.instructorBio}</p>
                  )}
                  <InstructorSocialIcons instr={{ linkedin: session.instructorLinkedin, instagram: session.instructorInstagram, facebook: session.instructorFacebook, website: session.instructorWebsite, podcast: session.instructorPodcast }} T={{ border: C.gray200, bg: C.gray50 }}/>
                </div>
              </div>
            ) : (
              <div style={{ fontSize:14, color:C.gray500 }}>No instructor has been added for this session.</div>
            )}
          </div>
        )}

        {/* Community */}
        {bottomTab === "community" && (
          <div className="sd-tab-content" style={{ padding:0, minHeight:400 }}>
            <div style={{ padding:"20px 24px" }}>
              {/* Post input */}
              <div style={{ background:isDark?"rgba(255,255,255,0.05)":C.white, borderRadius:12, border:`1px solid ${isDark?"rgba(255,255,255,0.1)":C.gray200}`, padding:"12px 14px", marginBottom:16, display:"flex", gap:10, alignItems:"center" }}>
                <Avatar name={adminName||"You"} src={adminAvatar} size={32}/>
                <input ref={chatInputRef} value={sdNewComment} onChange={e=>setSdNewComment(e.target.value)}
                  onKeyDown={async e=>{ if(e.key==="Enter" && sdNewComment.trim() && !sdPosting) { const body=sdNewComment.trim(); const tempId="tmp-"+Date.now(); const optimistic={id:tempId,session_id:String(session.id),session_title:session.title,author_name:adminName||"You",body,likes:0,created_at:new Date().toISOString()}; setSdComments(prev=>[optimistic,...prev]); setSdNewComment(""); setSdPosting(true); const { data, error } = await supabase.from("session_comments").insert({ session_id:String(session.id), session_title:session.title, author_name:adminName||"Anonymous", body }).select().single(); if(!error && data) setSdComments(prev=>prev.map(c=>c.id===tempId?data:c)); else if(error) toast({ type:"error", message:"Could not save comment. Please create the session_comments table in Supabase." }); setSdPosting(false); toast({ type:"success", message:"Comment posted!" }); }}}
                  placeholder="Share a thought about this session…"
                  style={{ flex:1, padding:"8px 12px", border:"none", borderRadius:8, fontSize:14, outline:"none", color:isDark?"#fff":C.gray700, background:"transparent" }}/>
                <button onClick={async ()=>{ if(!sdNewComment.trim()||sdPosting) return; const body=sdNewComment.trim(); const tempId="tmp-"+Date.now(); const optimistic={id:tempId,session_id:String(session.id),session_title:session.title,author_name:adminName||"You",body,likes:0,created_at:new Date().toISOString()}; setSdComments(prev=>[optimistic,...prev]); setSdNewComment(""); setSdPosting(true); const { data, error } = await supabase.from("session_comments").insert({ session_id:String(session.id), session_title:session.title, author_name:adminName||"Anonymous", body }).select().single(); if(!error && data) setSdComments(prev=>prev.map(c=>c.id===tempId?data:c)); else if(error) toast({ type:"error", message:"Could not save comment. Please create the session_comments table in Supabase." }); setSdPosting(false); }}
                  style={{ flexShrink:0, padding:"8px 18px", borderRadius:8, background:sdNewComment.trim()&&!sdPosting?C.primary:C.gray200, border:"none", cursor:sdNewComment.trim()&&!sdPosting?"pointer":"default", fontSize:13, fontWeight:700, color:"#fff", transition:"background 0.15s", whiteSpace:"nowrap" }}>
                  {sdPosting ? "Posting…" : "Post"}
                </button>
              </div>
              {/* Comments count */}
              <div style={{ fontSize:13, fontWeight:700, color:C.gray500, marginBottom:12, letterSpacing:.3 }}>
                {sdCommentsLoading ? "Loading…" : sdComments.length === 0 ? "0 Comments" : `${sdComments.length} Comment${sdComments.length!==1?"s":""}`}
              </div>
              {/* Comments list */}
              {!sdCommentsLoading && sdComments.length === 0 && (
                <div style={{ background:isDark?"rgba(255,255,255,0.05)":C.white, borderRadius:12, border:`1px solid ${isDark?"rgba(255,255,255,0.1)":C.gray200}`, padding:"40px 24px", textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center" }}>
                  <Icon name="chat-circle-dots" size={40} color={C.gray300}/>
                  <div style={{ marginTop:12, fontSize:14, fontWeight:600, color:C.gray500 }}>No comments yet</div>
                  <div style={{ fontSize:13, color:C.gray400, marginTop:4 }}>Be the first to share your thoughts!</div>
                </div>
              )}
              {sdComments.map(c => (
                <div key={c.id} style={{ background:isDark?"rgba(255,255,255,0.05)":C.white, borderRadius:12, border:`1px solid ${isDark?"rgba(255,255,255,0.09)":C.gray200}`, marginBottom:8, padding:"12px 14px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <Avatar name={c.author_name} src={c.author_name===adminName?adminAvatar:undefined} size={28}/>
                      <div>
                        <span style={{ fontWeight:700, fontSize:13, color:isDark?"#fff":C.gray900 }}>{c.author_name}</span>
                        <span style={{ fontSize:11, color:isDark?"rgba(255,255,255,0.35)":C.gray400, marginLeft:8 }}>{c.created_at ? new Date(c.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : "just now"}</span>
                      </div>
                    </div>
                    {(c.author_name === adminName || c.author_name === "You" || c.author_name === "Anonymous") && (
                      <button onClick={()=>setSdDeleteConfirm(c.id)}
                        style={{ width:24, height:24, borderRadius:6, border:"none", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}
                        onMouseEnter={e=>e.currentTarget.style.background=isDark?"rgba(255,255,255,0.08)":C.gray100} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <Icon name="trash" size={13} color={C.error}/>
                      </button>
                    )}
                  </div>
                  <div style={{ fontSize:14, color:isDark?"rgba(255,255,255,0.75)":C.gray700, lineHeight:1.6, marginLeft:36, marginBottom:8 }}>{c.body}</div>
                  <div style={{ marginLeft:36 }}>
                    <button onClick={async ()=>{ const newLikes=(c.likes||0)+1; await supabase.from("session_comments").update({likes:newLikes}).eq("id",c.id); setSdComments(prev=>prev.map(x=>x.id===c.id?{...x,likes:newLikes}:x)); }}
                      style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"4px 10px", borderRadius:99, border:`1px solid ${isDark?"rgba(255,255,255,0.1)":C.gray200}`, background:"transparent", color:isDark?"rgba(255,255,255,0.5)":C.gray500, cursor:"pointer", fontSize:12, fontWeight:600 }}>
                      <Icon name="heart" size={12} color={C.gray400}/>{c.likes||0}
                    </button>
                  </div>
                </div>
              ))}
            </div>

              {/* Delete confirmation modal */}
              {sdDeleteConfirm && (
                <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={()=>setSdDeleteConfirm(null)}>
                  <div style={{ background:"#fff", borderRadius:16, padding:"28px 28px 20px", width:360, boxShadow:"0 24px 60px rgba(0,0,0,0.2)" }} onClick={e=>e.stopPropagation()}>
                    <div style={{ fontWeight:800, fontSize:18, color:C.gray900, marginBottom:8 }}>Delete comment?</div>
                    <p style={{ margin:"0 0 24px", fontSize:14, color:C.gray500, lineHeight:1.6 }}>This cannot be undone.</p>
                    <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
                      <button onClick={()=>setSdDeleteConfirm(null)} style={{ padding:"9px 20px", borderRadius:10, border:`1px solid ${C.gray200}`, background:C.white, fontSize:14, fontWeight:600, color:C.gray700, cursor:"pointer" }}>Cancel</button>
                      <button onClick={async ()=>{ await supabase.from("session_comments").delete().eq("id",sdDeleteConfirm); setSdComments(prev=>prev.filter(c=>c.id!==sdDeleteConfirm)); setSdDeleteConfirm(null); toast({type:"success",message:"Comment deleted."}); }}
                        style={{ padding:"9px 20px", borderRadius:10, border:"none", background:"#ef4444", fontSize:14, fontWeight:600, color:"#fff", cursor:"pointer" }}>Delete</button>
                    </div>
                  </div>
                </div>
              )}

          </div>
        )}

          </>)}
          </div>{/* end unified card */}
        </div>{/* end right column */}
      </div>{/* end top row */}

    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   COMMUNITY PAGE
───────────────────────────────────────────────────────────────────────────── */
function CommunityPage({ toast, userName = "", userAvatar = null, sessions = [] }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSession, setFilterSession] = useState("all");
  const [newBody, setNewBody] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [posting, setPosting] = useState(false);
  const [sessionDropOpen, setSessionDropOpen] = useState(false);
  const sessionDropRef = React.useRef(null);

  useEffect(() => {
    if (!sessionDropOpen) return;
    function handleClick(e) { if (sessionDropRef.current && !sessionDropRef.current.contains(e.target)) setSessionDropOpen(false); }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [sessionDropOpen]);

  useEffect(() => {
    setLoading(true);
    supabase.from("session_comments").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setComments(data || []); setLoading(false); });
  }, []);

  async function submitPost() {
    if (!newBody.trim() || !selectedSession) return;
    const session = sessions.find(s => String(s.id) === selectedSession);
    const body = newBody.trim();
    const tempId = "tmp-" + Date.now();
    const optimistic = { id:tempId, session_id:selectedSession, session_title:session?.title||"", author_name:userName||"You", body, likes:0, created_at:new Date().toISOString() };
    setComments(prev => [optimistic, ...prev]);
    setNewBody("");
    setPosting(true);
    const { data, error } = await supabase.from("session_comments").insert({ session_id:selectedSession, session_title:session?.title||"", author_name:userName||"Anonymous", body }).select().single();
    if (!error && data) setComments(prev => prev.map(c => c.id === tempId ? data : c));
    else if (error) toast({ type:"error", message:"Could not save — check Supabase table." });
    setPosting(false);
    toast({ type:"success", message:"Comment posted!" });
  }

  const sessionGroups = [];
  const seenIds = {};
  comments.forEach(c => {
    if (!seenIds[c.session_id]) { seenIds[c.session_id] = true; sessionGroups.push({ id: c.session_id, title: c.session_title }); }
  });

  const filtered = filterSession === "all" ? comments : comments.filter(c => c.session_id === filterSession);

  return (
    <div style={{ padding:"28px 32px", background:C.gray50, minHeight:"100%", boxSizing:"border-box", display:"flex", gap:24, alignItems:"flex-start" }}>

      {/* Left — composer */}
      <div style={{ width:300, flexShrink:0, position:"sticky", top:24 }}>
        <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.gray200}`, padding:"12px 16px" }}>
          {/* Avatar + textarea row */}
          <div style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:12 }}>
            <Avatar name={userName||"You"} src={userAvatar} size={36}/>
            <textarea value={newBody} onChange={e=>setNewBody(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter" && e.metaKey) submitPost(); }}
              placeholder="Share something about this session…"
              rows={3}
              style={{ flex:1, padding:0, border:"none", fontSize:14, color:C.gray800, background:"transparent", outline:"none", resize:"none", lineHeight:1.6, fontFamily:"inherit" }}/>
          </div>

          {/* Divider */}
          <div style={{ height:1, background:C.gray100, marginBottom:12 }}/>

          {/* Session audience pill + Post button row */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
            {/* Twitter-style audience pill */}
            <div ref={sessionDropRef} style={{ position:"relative", flex:1 }}>
              <button onClick={()=>setSessionDropOpen(o=>!o)}
                style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 12px 5px 10px", borderRadius:99, border:`1.5px solid ${selectedSession?C.primary:C.gray300}`, background:selectedSession?C.primaryLight:"transparent", color:selectedSession?C.primary:C.gray500, fontSize:12, fontWeight:700, cursor:"pointer", maxWidth:"100%", overflow:"hidden" }}>
                <Icon name="play-circle" size={13} color={selectedSession?C.primary:C.gray400} weight={selectedSession?"fill":"regular"}/>
                <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:140 }}>
                  {selectedSession ? (sessions.find(s=>String(s.id)===selectedSession)?.title || "Session") : "Choose session"}
                </span>
                <Icon name="caret-down" size={11} color={selectedSession?C.primary:C.gray400}/>
              </button>
              {sessionDropOpen && (
                <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, boxShadow:"0 8px 32px rgba(0,0,0,0.12)", zIndex:200, width:260, maxHeight:280, overflowY:"auto" }}>
                  <div style={{ padding:"12px 14px 6px", fontSize:13, fontWeight:800, color:C.gray900 }}>Choose session</div>
                  {sessions.map(s => (
                    <button key={s.id} onClick={()=>{ setSelectedSession(String(s.id)); setSessionDropOpen(false); }}
                      style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 14px", border:"none", background:selectedSession===String(s.id)?C.primaryLight:"transparent", cursor:"pointer", textAlign:"left" }}
                      onMouseEnter={e=>{ if(selectedSession!==String(s.id)) e.currentTarget.style.background=C.gray50; }} onMouseLeave={e=>{ if(selectedSession!==String(s.id)) e.currentTarget.style.background="transparent"; }}>
                      <div style={{ width:32, height:32, borderRadius:8, background:C.primaryLight, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <Icon name="play-circle" size={15} color={C.primary} weight="fill"/>
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:C.gray900, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.title}</div>
                      </div>
                      {selectedSession===String(s.id) && <Icon name="check" size={14} color={C.primary}/>}
                    </button>
                  ))}
                  <div style={{ height:6 }}/>
                </div>
              )}
            </div>

            <button onClick={submitPost} disabled={!newBody.trim()||!selectedSession||posting}
              style={{ flexShrink:0, padding:"7px 20px", borderRadius:99, border:"none", background:newBody.trim()&&selectedSession&&!posting?C.primary:C.gray200, color:"#fff", fontSize:13, fontWeight:700, cursor:newBody.trim()&&selectedSession&&!posting?"pointer":"default", transition:"background .15s" }}>
              {posting ? "…" : "Post"}
            </button>
          </div>
        </div>
      </div>

      {/* Right — feed */}
      <div style={{ flex:1, minWidth:0 }}>

        {loading && (
          <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, padding:"40px 24px", textAlign:"center", color:C.gray400, fontSize:14 }}>Loading…</div>
        )}
        {!loading && filtered.length === 0 && (
          <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, padding:"48px 24px", textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center" }}>
            <Icon name="chat-circle-dots" size={44} color={C.gray300}/>
            <div style={{ marginTop:14, fontSize:15, fontWeight:700, color:C.gray500 }}>No posts yet</div>
            <div style={{ fontSize:13, color:C.gray400, marginTop:4 }}>Be the first to share your thoughts!</div>
          </div>
        )}
        {!loading && filtered.map((c, i) => {
          const prevC = filtered[i-1];
          const showSessionHeader = !prevC || prevC.session_id !== c.session_id;
          return (
            <React.Fragment key={c.id}>
              {showSessionHeader && (
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10, marginTop: i > 0 ? 20 : 0 }}>
                  <div style={{ flex:1, height:1, background:C.gray200 }}/>
                  <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 12px", borderRadius:99, background:C.white, border:`1px solid ${C.gray200}` }}>
                    <Icon name="play-circle" size={12} color={C.primary} weight="fill"/>
                    <span style={{ fontSize:12, fontWeight:700, color:C.gray700, maxWidth:360, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.session_title}</span>
                  </div>
                  <div style={{ flex:1, height:1, background:C.gray200 }}/>
                </div>
              )}
              <div style={{ background:C.white, borderRadius:12, border:`1px solid ${C.gray200}`, marginBottom:8, padding:"12px 14px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <Avatar name={c.author_name} src={c.author_name===userName?userAvatar:undefined} size={28}/>
                    <div>
                      <span style={{ fontWeight:700, fontSize:13, color:C.gray900 }}>{c.author_name}</span>
                      <span style={{ fontSize:11, color:C.gray400, marginLeft:8 }}>{c.created_at ? new Date(c.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : ""}</span>
                    </div>
                  </div>
                </div>
                <div style={{ fontSize:14, color:C.gray700, lineHeight:1.6, marginLeft:36, marginBottom:8 }}>{c.body}</div>
                <div style={{ marginLeft:36 }}>
                  <button onClick={async ()=>{ const newLikes=(c.likes||0)+1; await supabase.from("session_comments").update({likes:newLikes}).eq("id",c.id); setComments(prev=>prev.map(x=>x.id===c.id?{...x,likes:newLikes}:x)); }}
                    style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"4px 10px", borderRadius:99, border:`1px solid ${C.gray200}`, background:"transparent", color:C.gray500, cursor:"pointer", fontSize:12, fontWeight:600 }}>
                    <Icon name="heart" size={12} color={C.gray400}/>{c.likes||0}
                  </button>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PROFILE PAGE HELPERS  (defined outside so React doesn't remount on re-render)
───────────────────────────────────────────────────────────────────────────── */
function ProfileToggle({ on, onToggle }) {
  return (
    <button onClick={onToggle} style={{ width:44, height:24, borderRadius:99, border:"none", cursor:"pointer", background: on ? C.primary : C.gray200, position:"relative", flexShrink:0, transition:"background .2s" }}>
      <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left: on ? 23 : 3, transition:"left .2s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }}/>
    </button>
  );
}

function ProfileSection({ icon, label, children }) {
  return (
    <div style={{ background:C.white, borderRadius:20, border:`1px solid ${C.gray200}`, padding:"28px 32px", marginBottom:20 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <div style={{ width:38, height:38, borderRadius:"50%", background:C.primaryLight, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <Icon name={icon} size={18} color={C.primary}/>
        </div>
        <h3 style={{ margin:0, fontSize:16, fontWeight:800, color:C.gray900 }}>{label}</h3>
      </div>
      {children}
    </div>
  );
}

function ProfileField({ label, children }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <label style={{ fontSize:12, fontWeight:700, color:C.gray500, letterSpacing:.8, textTransform:"uppercase" }}>{label}</label>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PROFILE PAGE
───────────────────────────────────────────────────────────────────────────── */
function DeactivateModal({ onClose, onConfirm }) {
  const [typed, setTyped] = useState("");
  const CONFIRM_WORD = "deactivate";
  const ready = typed.trim().toLowerCase() === CONFIRM_WORD;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:1200, background:"rgba(15,23,42,0.6)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:440, boxShadow:"0 24px 60px rgba(0,0,0,0.18)", overflow:"hidden" }}>
        {/* Header */}
        <div style={{ padding:"24px 24px 0", display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:"#fef2f2", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Icon name="warning" size={22} color="#ef4444" weight="fill"/>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, border:`1px solid ${C.gray200}`, background:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", marginLeft:"auto" }}>
            <Icon name="x" size={14} color={C.gray500}/>
          </button>
        </div>
        {/* Body */}
        <div style={{ padding:"16px 24px 24px" }}>
          <h3 style={{ margin:"0 0 6px", fontSize:18, fontWeight:800, color:C.gray900 }}>Deactivate your account?</h3>
          <p style={{ margin:"0 0 20px", fontSize:14, color:C.gray500, lineHeight:1.6 }}>
            This will <strong style={{ color:C.gray800 }}>permanently delete</strong> your profile, all learning progress, certificates, and quiz data. <strong style={{ color:C.error }}>This action cannot be undone.</strong>
          </p>
          {/* Type to confirm */}
          <div style={{ background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:10, padding:"14px 16px", marginBottom:16 }}>
            <p style={{ margin:"0 0 10px", fontSize:13, color:"#7f1d1d", lineHeight:1.5 }}>
              To confirm, type <strong style={{ letterSpacing:.5 }}>"{CONFIRM_WORD}"</strong> below:
            </p>
            <input
              value={typed}
              onChange={e => setTyped(e.target.value)}
              placeholder={CONFIRM_WORD}
              autoFocus
              style={{ width:"100%", padding:"10px 12px", border:`1.5px solid ${ready ? "#ef4444" : "#fca5a5"}`, borderRadius:8, fontSize:14, outline:"none", fontFamily:"inherit", color:C.gray900, background:"#fff", boxSizing:"border-box", transition:"border-color .15s" }}
            />
          </div>
          {/* Actions */}
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={onClose}
              style={{ flex:1, padding:"11px 0", borderRadius:9, border:`1px solid ${C.gray200}`, background:"#fff", fontSize:14, fontWeight:600, color:C.gray700, cursor:"pointer", fontFamily:"inherit" }}>
              Cancel
            </button>
            <button onClick={ready ? onConfirm : undefined} disabled={!ready}
              style={{ flex:1, padding:"11px 0", borderRadius:9, border:"none", background: ready ? "#ef4444" : "#fca5a5", fontSize:14, fontWeight:700, color:"#fff", cursor: ready ? "pointer" : "not-allowed", fontFamily:"inherit", transition:"background .15s" }}>
              Deactivate account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfilePage({ toast, userName = "", userEmail = "", userAvatar = null, onNameChange, onBack, userTimezone = "", onTimezoneChange }) {
  const [activeSection, setActiveSection] = useState("personal");
  const [form, setForm] = useState({ name:userName, title:"", email:userEmail, phone:"" });
  const [notifEmail,   setNotifEmail]   = useState(true);
  const [notifMentor,  setNotifMentor]  = useState(true);
  const [publicProfile,setPublicProfile]= useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [twoFA,        setTwoFA]        = useState(true);
  const [photoUrl,     setPhotoUrl]     = useState(userAvatar);
  const [changingPassword, setChangingPassword] = useState(false);
  const [pwForm, setPwForm] = useState({ current:"", newPw:"", confirm:"" });
  const [mobileDrilled, setMobileDrilled] = useState(false);
  const [nameAlreadyChanged, setNameAlreadyChanged] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.name_changed) setNameAlreadyChanged(true);
    });
  }, []);

  const photoInputRef = useRef(null);

  // Sync if auth data loads after mount
  useEffect(() => {
    setForm(f => ({ ...f, name: userName, email: userEmail }));
    if (userAvatar) setPhotoUrl(userAvatar);
  }, [userName, userEmail, userAvatar]);

  function handlePhotoFile(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast({ type:"error", title:"Invalid file", message:"Please select a PNG, JPG, or GIF image." }); return; }
    if (file.size > 5 * 1024 * 1024) { toast({ type:"error", title:"File too large", message:"Image must be under 5MB." }); return; }
    const reader = new FileReader();
    reader.onload = e => { setPhotoUrl(e.target.result); toast({ type:"success", title:"Photo updated", message:"Your profile photo has been changed." }); };
    reader.readAsDataURL(file);
  }

  async function save() {
    userProfile.name = form.name;
    const isNameChange = form.name !== userName;
    if (isNameChange && nameAlreadyChanged) {
      toast({ type:"error", title:"Name already changed", message:"Your name can only be changed once." });
      return;
    }
    const { error } = await supabase.auth.updateUser({
      data: { full_name: form.name, name: form.name, ...(isNameChange ? { name_changed: true } : {}) }
    });
    if (error) {
      toast({ type:"error", title:"Save failed", message: error.message });
      return;
    }
    if (isNameChange) setNameAlreadyChanged(true);
    onNameChange?.(form.name);
    toast({ type:"success", title:"Profile saved", message:"Your changes have been updated." });
  }

  const sidebarNav = [
    { id:"personal",       icon:"user-circle", label:"Personal details" },
    { id:"security",       icon:"lock",        label:"Password and security" },
    { id:"danger",         icon:"trash",       label:"Deactivate account" },
  ];

  const inputSt = { width:"100%", padding:"10px 12px", border:`1px solid ${C.gray200}`, borderRadius:8, fontSize:14, color:C.gray900, background:C.white, outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"border-color .15s" };

  function renderContent() {
    if (activeSection === "personal") return (
      <div>
        <div style={{ marginBottom:24 }}>
          <h2 style={{ margin:"0 0 4px", fontSize:20, fontWeight:800, color:C.gray900 }}>Personal details</h2>
          <p style={{ margin:0, fontSize:14, color:C.gray500 }}>Manage your name, photo and contact information.</p>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, marginTop:10, background:"#fffbeb", border:"1px solid rgba(245,158,11,0.35)", borderRadius:8, padding:"6px 12px" }}>
            <svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2zm.75 11.5h-1.5v-5h1.5v5zm0-6.5h-1.5V5.5h1.5V7z" fill="#d97706"/></svg>
            <span style={{ fontSize:12, color:"#92400e", fontWeight:500 }}>Personal details can only be changed once. Please review carefully before saving.</span>
          </div>
        </div>

        {/* Photo row */}
        <input ref={photoInputRef} type="file" accept="image/*" style={{ display:"none" }}
          onChange={e => { handlePhotoFile(e.target.files?.[0]); e.target.value=""; }}/>
        <div style={{ display:"flex", alignItems:"center", gap:16, padding:"16px 0", borderBottom:`1px solid ${C.gray200}`, marginBottom:8 }}>
          {photoUrl
            ? <img src={photoUrl} alt="Profile" style={{ width:56, height:56, borderRadius:14, objectFit:"cover" }}/>
            : <div style={{ width:56, height:56, borderRadius:14, background:`linear-gradient(135deg,${C.primary},#a855f7)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:900, color:"#fff" }}>{form.name.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase()}</div>
          }
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.gray900 }}>Profile photo</div>
            <div style={{ fontSize:12, color:C.gray500 }}>PNG or JPG, max 5MB</div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>photoInputRef.current?.click()} style={{ padding:"7px 14px", background:C.gray100, border:"none", borderRadius:8, fontSize:13, fontWeight:600, color:C.gray700, cursor:"pointer" }}>Upload</button>
            {photoUrl && <button onClick={()=>{setPhotoUrl(null);toast({type:"warning",message:"Photo removed."});}} style={{ padding:"7px 14px", background:"none", border:`1px solid ${C.errorBorder}`, borderRadius:8, fontSize:13, fontWeight:600, color:C.error, cursor:"pointer" }}>Remove</button>}
          </div>
        </div>

        {/* Fields */}
        <div className="profile-fields-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
          {[
            { label:"Full name",          key:"name",  type:"text"  },
            { label:"Professional title", key:"title", type:"text"  },
            { label:"Email address",      key:"email", type:"email" },
            { label:"Phone number",       key:"phone", type:"tel"   },
          ].map(f => (
            <div key={f.key}>
              <div style={{ fontSize:13, fontWeight:600, color:C.gray600, marginBottom:6, display:"flex", alignItems:"center", gap:6 }}>
                {f.label}
                {f.key==="name" && nameAlreadyChanged && (
                  <span style={{ fontSize:11, fontWeight:500, color:"#9ca3af", background:"#f3f4f6", borderRadius:4, padding:"1px 6px" }}>locked</span>
                )}
              </div>
              <input type={f.type}
                style={{ ...inputSt, ...((f.key==="name" && nameAlreadyChanged) || f.key==="email" ? { background:"#f9fafb", color:C.gray400, cursor:"not-allowed" } : {}) }}
                value={form[f.key]}
                readOnly={(f.key==="name" && nameAlreadyChanged) || f.key==="email"}
                onChange={e => { if((f.key==="name" && nameAlreadyChanged) || f.key==="email") return; setForm(v=>({...v,[f.key]:e.target.value})); }}
                onFocus={e=>{ if((f.key==="name" && nameAlreadyChanged) || f.key==="email") return; e.target.style.borderColor=C.primary; }}
                onBlur={e=>e.target.style.borderColor=C.gray200}/>
              {f.key==="name" && nameAlreadyChanged && (
                <p style={{ fontSize:12, color:"#9ca3af", margin:"4px 0 0" }}>Your name can only be changed once and has already been updated.</p>
              )}
            </div>
          ))}
        </div>
        {/* Timezone */}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:13, fontWeight:600, color:C.gray600, marginBottom:6 }}>Timezone</div>
          <select value={userTimezone} onChange={async e=>{ const tz=e.target.value; onTimezoneChange && onTimezoneChange(tz); await supabase.auth.updateUser({ data:{ timezone:tz } }); toast({type:"success",message:"Timezone updated."}); }}
            style={{ ...inputSt, appearance:"none", cursor:"pointer" }}>
            {COMMON_TIMEZONES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <p style={{ fontSize:12, color:C.gray400, margin:"4px 0 0" }}>All session times are shown in your selected timezone. Sessions run on Pacific Time (PST/PDT).</p>
        </div>

        <div style={{ paddingTop:20, display:"flex", justifyContent:"flex-end" }}>
          <Btn onClick={save}>Save</Btn>
        </div>
      </div>
    );

    if (activeSection === "security") {
      if (changingPassword) return (
        <div>
          {/* Back header */}
          <div style={{ marginBottom:28 }}>
            <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:C.gray900 }}>Change your password</h2>
          </div>

          {/* Current password */}
          <div style={{ borderBottom:`1px solid ${C.gray200}`, paddingBottom:16, marginBottom:16 }}>
            <input type="password" placeholder="Current password" value={pwForm.current}
              onChange={e=>setPwForm(v=>({...v,current:e.target.value}))}
              style={inputSt}
              onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>e.target.style.borderColor=C.gray200}/>
            <button onClick={()=>toast({type:"info",message:"Password reset email sent."})}
              style={{ background:"none", border:"none", color:C.primary, fontSize:13, fontWeight:600, cursor:"pointer", marginTop:8, padding:0, fontFamily:"inherit" }}>
              Forgot password?
            </button>
          </div>

          {/* New password */}
          <div style={{ borderBottom:`1px solid ${C.gray200}`, paddingBottom:16, marginBottom:16 }}>
            <input type="password" placeholder="New password" value={pwForm.newPw}
              onChange={e=>setPwForm(v=>({...v,newPw:e.target.value}))}
              style={inputSt}
              onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>e.target.style.borderColor=C.gray200}/>
          </div>

          {/* Confirm password */}
          <div style={{ borderBottom:`1px solid ${C.gray200}`, paddingBottom:16, marginBottom:16 }}>
            <input type="password" placeholder="Confirm password" value={pwForm.confirm}
              onChange={e=>setPwForm(v=>({...v,confirm:e.target.value}))}
              style={inputSt}
              onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>e.target.style.borderColor=C.gray200}/>
          </div>

          {/* Info */}
          <div style={{ borderBottom:`1px solid ${C.gray200}`, paddingBottom:16, marginBottom:20 }}>
            <p style={{ margin:0, fontSize:13, color:C.gray500, lineHeight:1.6 }}>
              Changing your password will log you out of all your active sessions except the one you're using at this time.
            </p>
          </div>

          {/* Save */}
          <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
            <button onClick={()=>{ setChangingPassword(false); setPwForm({current:"",newPw:"",confirm:""}); }}
              style={{ padding:"0 20px", height:38, background:"transparent", color:C.gray600, border:`1px solid ${C.gray200}`, borderRadius:8, fontSize:14, fontWeight:500, cursor:"pointer", transition:"background .12s, border-color .12s" }}
              onMouseEnter={e=>{ e.currentTarget.style.background=C.gray100; e.currentTarget.style.borderColor=C.gray300; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor=C.gray200; }}>
              Cancel
            </button>
            <Btn onClick={()=>{
              if (!pwForm.current) { toast({type:"error",message:"Please enter your current password."}); return; }
              if (pwForm.newPw.length < 8) { toast({type:"error",message:"New password must be at least 8 characters."}); return; }
              if (pwForm.newPw !== pwForm.confirm) { toast({type:"error",message:"Passwords don't match."}); return; }
              toast({type:"success",title:"Password updated",message:"Your password has been changed successfully."});
              setChangingPassword(false); setPwForm({current:"",newPw:"",confirm:""});
            }}>Save</Btn>
          </div>
        </div>
      );

      return (
        <div>
          <div style={{ marginBottom:24 }}>
            <h2 style={{ margin:"0 0 4px", fontSize:20, fontWeight:800, color:C.gray900 }}>Password and security</h2>
            <p style={{ margin:0, fontSize:14, color:C.gray500 }}>Manage your passwords, login preferences and recovery methods.</p>
          </div>
          <div style={{ border:`1px solid ${C.gray200}`, borderRadius:14, overflow:"hidden" }}>
            {[
              { label:"Change password", sub:"Last updated 3 months ago", action:()=>setChangingPassword(true), toggle:null },
            ].map((row,i,arr) => (
              <div key={row.label}
                style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:i<arr.length-1?`1px solid ${C.gray200}`:"none", gap:12, cursor:row.action?"pointer":"default", background:C.white, transition:"background .12s" }}
                onClick={row.action||undefined}
                onMouseEnter={e=>{ if(row.action) e.currentTarget.style.background=C.gray50; }}
                onMouseLeave={e=>{ e.currentTarget.style.background=C.white; }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:C.gray900 }}>{row.label}</div>
                  <div style={{ fontSize:12, color:C.gray500, marginTop:2 }}>{row.sub}</div>
                </div>
                {row.toggle || <Icon name="caret-right" size={16} color={C.gray400}/>}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeSection === "danger") return (
      <div>
        <div style={{ marginBottom:24 }}>
          <h2 style={{ margin:"0 0 4px", fontSize:20, fontWeight:800, color:C.gray900 }}>Deactivate account</h2>
          <p style={{ margin:0, fontSize:14, color:C.gray500 }}>Permanently delete your account and all associated data.</p>
        </div>
        <div style={{ border:`1px solid ${C.gray200}`, borderRadius:14, overflow:"hidden" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", gap:16, background:C.white }}>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:C.error }}>Deactivate Account</div>
              <div style={{ fontSize:12, color:C.gray500, marginTop:2 }}>Permanently remove your profile and all learning progress. This cannot be undone.</div>
            </div>
            <button onClick={() => setShowDeactivateModal(true)}
              style={{ padding:"8px 18px", background:"transparent", color:C.error, border:`1px solid ${C.errorBorder}`, borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>
              Deactivate
            </button>
          </div>
        </div>
      </div>
    );
  }

  function handleMobileNav(id) {
    setActiveSection(id);
    setMobileDrilled(true);
  }

  const sectionLabels = { personal:"Personal details", security:"Password and security", danger:"Deactivate account" };

  return (
    <>
    <div style={{ minHeight:"100%", background:C.gray50, display:"flex", flexDirection:"column", fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif" }}>
      <style>{`
        .profile-wrap { max-width:960px; width:100%; margin:0 auto; display:flex; gap:0; align-items:stretch; flex:1; box-sizing:border-box; }
        .profile-sidebar { width:260px; flex-shrink:0; margin-right:8px; padding:32px 24px; box-sizing:border-box; }
        .profile-divider { width:1px; background:${C.gray200}; flex-shrink:0; margin:0 24px; align-self:stretch; }
        .profile-content { flex:1; min-width:0; padding:32px 24px; box-sizing:border-box; }
        .profile-fields-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }
        .profile-mobile-hub { display:none; }
        .profile-mobile-detail { display:none; }
        @media(max-width:700px){
          .profile-wrap { display:none !important; }
          .profile-mobile-hub { display:block; }
          .profile-mobile-detail { display:block; }
          .profile-fields-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      {/* ── Mobile: Hub (section list) ── */}
      {!mobileDrilled && (
        <div className="profile-mobile-hub" style={{ flex:1 }}>
          <div style={{ padding:"16px 16px 12px" }}>
            <button onClick={onBack} style={{ display:"inline-flex", alignItems:"center", gap:6, background:"none", border:"none", padding:"0 0 12px", cursor:"pointer", color:C.gray500, fontSize:13, fontWeight:600, fontFamily:"inherit" }}>
              <Icon name="arrow-left" size={16} color={C.gray500}/>
              Back
            </button>
            <div style={{ fontSize:24, fontWeight:800, color:C.gray900, letterSpacing:-0.5 }}>Account settings</div>
          </div>
          <div style={{ margin:"0 16px", border:`1px solid ${C.gray200}`, borderRadius:16, overflow:"hidden", background:C.white }}>
            {sidebarNav.map((item, i, arr) => (
              <button key={item.id} onClick={() => handleMobileNav(item.id)}
                style={{ display:"flex", alignItems:"center", gap:16, width:"100%", padding:"14px 18px", background:"none", border:"none", borderBottom: i < arr.length-1 ? `1px solid ${C.gray200}` : "none", cursor:"pointer", textAlign:"left", fontFamily:"inherit", transition:"background .12s" }}
                onMouseEnter={e=>e.currentTarget.style.background=C.gray50}
                onMouseLeave={e=>e.currentTarget.style.background="none"}>
                <Icon name={item.icon} size={24} color={item.id === "danger" ? C.error : C.gray700}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:500, color: item.id === "danger" ? C.error : C.gray900 }}>{item.label}</div>
                </div>
                <Icon name="caret-right" size={16} color={C.gray400}/>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Mobile: Drilled-in section ── */}
      {mobileDrilled && (
        <div className="profile-mobile-detail" style={{ flex:1 }}>
          <div className="profile-content" style={{ padding:"20px 16px" }}>
            <button onClick={() => setMobileDrilled(false)}
              style={{ display:"inline-flex", alignItems:"center", gap:6, background:"none", border:"none", padding:"0 0 16px", cursor:"pointer", color:C.gray500, fontSize:13, fontWeight:600, fontFamily:"inherit" }}>
              <Icon name="arrow-left" size={16} color={C.gray500}/>
              Back
            </button>
            {renderContent()}
          </div>
        </div>
      )}

      {/* ── Desktop layout ── */}
      <div className="profile-wrap">

        {/* ── Sidebar ── */}
        <div className="profile-sidebar">
          <div style={{ marginBottom:20, paddingLeft:12 }}>
            <div style={{ fontSize:18, fontWeight:900, color:C.gray900 }}>Account Centre</div>
            <div style={{ fontSize:13, color:C.gray500, marginTop:4, lineHeight:1.5 }}>Manage your account settings and preferences.</div>
          </div>
          <nav style={{ display:"flex", flexDirection:"column", gap:2 }}>
            {sidebarNav.map(item => {
              const active = activeSection === item.id;
              return (
                <button key={item.id} onClick={()=>setActiveSection(item.id)}
                  style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", borderRadius:10, border:"none", background: active ? C.gray200 : "transparent", color: active ? C.gray900 : C.gray600, fontSize:14, fontWeight: active ? 700 : 500, cursor:"pointer", textAlign:"left", fontFamily:"inherit", transition:"background .12s, color .12s" }}
                  onMouseEnter={e=>{ if(!active) e.currentTarget.style.background=C.gray100; }}
                  onMouseLeave={e=>{ if(!active) e.currentTarget.style.background="transparent"; }}>
                  <Icon name={item.icon} size={18} color={active ? C.gray900 : C.gray500}/>
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── Divider ── */}
        <div className="profile-divider"/>

        {/* ── Content ── */}
        <div className="profile-content">
          {renderContent()}
        </div>

      </div>
    </div>

    {showDeactivateModal && (
      <DeactivateModal
        onClose={() => setShowDeactivateModal(false)}
        onConfirm={async () => {
          setShowDeactivateModal(false);
          await supabase.auth.signOut();
          toast({ type:"success", title:"Account deactivated", message:"Your account has been removed." });
          onBack();
        }}
      />
    )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   REWARDS
───────────────────────────────────────────────────────────────────────────── */
function PastSessionsTab({ onOpenSeason, sessions = [], seasons = SEASONS }) {
  const [filterSeason, setFilterSeason] = useState("all");
  const [filterYear,   setFilterYear]   = useState("all");
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  // Only show seasons that have at least one real session
  const filledSeasons = seasons.filter(s => sessions.some(sess => s.sessionIds.includes(sess.id)));
  const seasonOptions = [...new Set(filledSeasons.map(s => s.name.split(" ")[0]))];
  const yearOptions   = [...new Set(filledSeasons.map(s => s.name.split(" ")[1]))].sort((a,b) => b - a);

  const filtered = filledSeasons.filter(season => {
    const [sName, sYear] = season.name.split(" ");
    if (filterSeason !== "all" && sName !== filterSeason) return false;
    if (filterYear   !== "all" && sYear !== filterYear)   return false;
    return true;
  });

  return (
    <div className="pst-wrap" style={{ background:C.gray50, minHeight:"100%", fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif", display:"flex", flexDirection:"column" }}>
      {/* Header row */}
      <style>{`
        .pst-wrap { padding: 24px; }
        @media(max-width:600px){
          .pst-wrap { padding: 16px 12px; }
          .ps-header-row { flex-direction:column !important; align-items:flex-start !important; }
          .ps-filters { width:100%; }
          .ps-filters > div { flex:1; }
          .ps-filters select { width:100%; }
        }
      `}</style>
      {filledSeasons.length > 0 && (
      <div className="ps-header-row" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, gap:10 }}>
        <div style={{ fontSize:20, fontWeight:700, color:C.gray900, fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif", letterSpacing:-0.3 }}>Past Sessions</div>
        <div className="ps-filters" style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ position:"relative", display:"inline-flex", alignItems:"center" }}>
            <select value={filterSeason} onChange={e=>setFilterSeason(e.target.value)}
              style={{ appearance:"none", WebkitAppearance:"none", background:C.white, border:`1px solid ${C.gray200}`, borderRadius:8, padding:"5px 28px 5px 10px", fontSize:13, fontWeight:500, color:C.gray900, cursor:"pointer", outline:"none", fontFamily:"inherit" }}>
              <option value="all">All Seasons</option>
              {seasonOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <Icon name="caret-down" size={13} color="#71717a" style={{ position:"absolute", right:8, pointerEvents:"none" }}/>
          </div>
          <div style={{ position:"relative", display:"inline-flex", alignItems:"center" }}>
            <select value={filterYear} onChange={e=>setFilterYear(e.target.value)}
              style={{ appearance:"none", WebkitAppearance:"none", background:C.white, border:`1px solid ${C.gray200}`, borderRadius:8, padding:"5px 28px 5px 10px", fontSize:13, fontWeight:500, color:C.gray900, cursor:"pointer", outline:"none", fontFamily:"inherit" }}>
              <option value="all">All Years</option>
              {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <Icon name="caret-down" size={13} color="#71717a" style={{ position:"absolute", right:8, pointerEvents:"none" }}/>
          </div>
        </div>
      </div>
      )}

      {filledSeasons.length === 0 ? (
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 32px", textAlign:"center", minHeight:400 }}>
          <div style={{ width:72, height:72, borderRadius:20, background:"rgba(100,144,232,0.10)", border:"1.5px solid rgba(100,144,232,0.2)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
            <Icon name="clock" size={34} color="#6490E8"/>
          </div>
          <div style={{ fontSize:18, fontWeight:800, color:C.gray900, marginBottom:10 }}>No past sessions yet</div>
          <div style={{ fontSize:14, color:C.gray500, lineHeight:1.7, maxWidth:340 }}>
            Completed summit seasons will appear here once they wrap up.
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <Empty fullPage>
          <EmptyMedia variant="icon" color="#6490E8"><Icon name="funnel" size={22} color="#6490E8"/></EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No seasons match</EmptyTitle>
            <EmptyDescription>Try adjusting your filters to find what you're looking for.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:16 }}>
          {filtered.map(season => {
            const thumbSrc = INSTRUCTOR_AVATARS[sessions.find(s => season.sessionIds.includes(s.id))?.instructor]
              || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=340&fit=crop";
            return (
              <div key={season.id}
                onClick={() => onOpenSeason?.(season.id)}
                style={{ borderRadius:16, border:`1px solid ${C.gray200}`, background:C.white, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", cursor:"pointer" }}>
                <div style={{ position:"relative", height:144, overflow:"hidden", background:"#1f2937" }}>
                  <img src={thumbSrc} alt={season.name}
                    style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 20%" }}
                    onError={e => e.currentTarget.src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=340&fit=crop"}/>
                  <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.25)" }}/>
                </div>
                <div style={{ padding:"16px 16px 10px" }}>
                  <div style={{ fontSize:17, fontWeight:800, color:C.gray900, lineHeight:1.3, marginBottom:10 }}>{season.name}</div>
                  <p style={{ margin:"0 0 10px", fontSize:13, color:C.gray600, lineHeight:1.6 }}>{season.description}</p>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    <span style={{ fontSize:11, fontWeight:600, color:C.gray700, background:C.gray200, borderRadius:8, padding:"3px 10px" }}>{season.sessionIds.length} sessions</span>
                    {season.updatedAt && <span style={{ fontSize:11, fontWeight:600, color:C.gray700, background:C.gray200, borderRadius:8, padding:"3px 10px" }}>Updated {season.updatedAt}</span>}
                  </div>
                </div>
                <div style={{ padding:"10px 16px", borderTop:`1px solid ${C.gray100}`, display:"flex", alignItems:"center", justifyContent:"flex-end" }}>
                  <span style={{ fontSize:12, fontWeight:600, color:C.primary }}>View all →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CertificationsPage({ quizStates = {}, enrolledIds = new Set(), onCertificateClick, userName = "", sessions = [], seasons = SEASONS }) {
  const [activeSeason,  setActiveSeason]  = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [shareCert, setShareCert] = useState(null); // { certUrl, sessionTitle }
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  const allSeasonIds = new Set(seasons.flatMap(s => s.sessionIds));
  const looseSessionsPassed = sessions.filter(s => !allSeasonIds.has(s.id) && quizStates[s.id]?.status === "passed").length;
  const totalEarned = looseSessionsPassed + seasons.reduce((acc, season) => {
    return acc + season.sessionIds.filter(id => quizStates[id]?.status === "passed" && sessions.some(s => s.id === id)).length;
  }, 0);

  /* ── Session Detail (lesson quizzes + final assessment) ── */
  if (activeSeason && activeSession) {
    const season  = seasons.find(s => s.id === activeSeason);
    const session = sessions.find(s => s.id === activeSession);
    const lessonQuizzes = (session.lessons || []).filter(l => l.type === "quiz");
    const qs = quizStates[session.id];
    const finalPassed = qs?.status === "passed";
    const hasFinal = getSessionQuestions(session).length > 0;

    function lessonQuizStatus(l) {
      if (l.status === "completed") return { label:"Completed", color:C.success, bg:C.successLight };
      if (l.status === "active")    return { label:"In Progress", color:C.warning, bg:"#fffbeb" };
      return { label:"Locked", color:C.gray400, bg:C.gray100 };
    }

    return (
      <>
      <div style={{ padding:"16px 16px", background:C.gray50, minHeight:"100%" }}>
        <style>{`
          @media(max-width:600px){
            .cert-detail-actions { flex-wrap: wrap; }
            .cert-detail-actions button { flex: 1; justify-content: center; }
          }
        `}</style>
        {/* Breadcrumb */}
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:20, flexWrap:"wrap" }}>
          {[
            { label:"My Certificates", onClick:()=>{ setActiveSession(null); setActiveSeason(null); } },
            { label:season.name,       onClick:()=>setActiveSession(null) },
            { label:session.title },
          ].map((crumb, i) => (
            <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
              {i > 0 && <span style={{ color:C.gray300, fontSize:13 }}>›</span>}
              {crumb.onClick ? (
                <button onClick={crumb.onClick}
                  style={{ background:"none", border:"none", padding:0, cursor:"pointer", fontSize:13, fontWeight:500, color:C.gray500, fontFamily:"inherit" }}
                  onMouseEnter={e=>e.currentTarget.style.color=C.gray700}
                  onMouseLeave={e=>e.currentTarget.style.color=C.gray500}>
                  {crumb.label}
                </button>
              ) : (
                <span style={{ fontSize:13, fontWeight:600, color:C.gray900, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:320 }}>
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:22 }}>
          <div style={{ width:52, height:36, borderRadius:8, overflow:"hidden", flexShrink:0 }}>
            <SessionThumb id={session.id} height={36} noPlayHover/>
          </div>
          <div>
            <div style={{ fontSize:15, fontWeight:800, color:C.gray900, lineHeight:1.3 }}>{session.title}</div>
            <div style={{ fontSize:12, color:C.gray400 }}>{session.instructor}</div>
          </div>
        </div>

        {/* Lesson quizzes */}
        {lessonQuizzes.length > 0 && (
          <>
            <div style={{ fontSize:12, fontWeight:700, color:C.gray400, letterSpacing:.8, marginBottom:10, textTransform:"uppercase" }}>Knowledge Checks</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
              {lessonQuizzes.map((l, i) => {
                const st = lessonQuizStatus(l);
                return (
                  <div key={l.id} style={{ background:C.white, borderRadius:12, border:`1px solid ${C.gray200}`, display:"flex", alignItems:"center", gap:12, padding:"12px 16px" }}>
                    <div style={{ width:32, height:32, borderRadius:8, background: st.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Icon name={l.status==="completed" ? "check-circle" : l.status==="active" ? "pencil" : "lock"} size={15} color={st.color}/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:C.gray800, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.title}</div>
                      <div style={{ fontSize:12, color:C.gray400 }}>{Array.isArray(l.questions) ? l.questions.length : (l.questions||0)} questions</div>
                    </div>
                    {l.status === "completed" ? (
                      <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                        <button onClick={() => { const certId = `SS-${session.id}-${l.id}`; setShareCert({ certUrl:`spedsummit.com/cert/${certId}`, sessionTitle:l.title }); }}
                          style={{ padding:"7px 12px", borderRadius:8, border:`1px solid ${C.gray200}`, background:C.white, color:C.gray600, fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap" }}>
                          <Icon name="share-network" size={13} color={C.gray500}/> Share
                        </button>
                        <button onClick={()=>downloadCertificate({ recipientName:userName, sessionTitle:session.title, instructor:session.instructor, quizTitle:l.title, description:session.description, duration:session.duration })}
                          style={{ padding:"7px 12px", borderRadius:8, border:"none", background:C.primary, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap" }}>
                          <Icon name="download" size={13} color="#fff"/> Download
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize:11, fontWeight:600, color:st.color, background:st.bg, padding:"4px 10px", borderRadius:99, whiteSpace:"nowrap" }}>{st.label}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Final assessment / certificate */}
        {hasFinal && (
          <>
            <div style={{ fontSize:12, fontWeight:700, color:C.gray400, letterSpacing:.8, marginBottom:10, textTransform:"uppercase" }}>Final Certificate</div>
            <div style={{ background:C.white, borderRadius:12, border:`1px solid ${finalPassed ? C.primaryBorder : C.gray200}`, display:"flex", alignItems:"center", gap:12, padding:"14px 16px" }}>
              <div style={{ width:38, height:38, borderRadius:10, background: finalPassed ? C.successLight : C.gray100, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon name="certificate" size={19} color={finalPassed ? C.success : C.gray400}/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.gray900 }}>Course Certificate</div>
                <div style={{ fontSize:12, color:C.gray400, marginTop:1 }}>
                  {finalPassed ? `Score: ${qs.score}% — Passed` : "Pass the final assessment to earn this"}
                </div>
              </div>
              {finalPassed ? (
                <div className="cert-detail-actions" style={{ display:"flex", gap:8 }}>
                  <button onClick={()=>onCertificateClick && onCertificateClick(session)}
                    style={{ padding:"8px 14px", borderRadius:8, border:`1px solid ${C.gray200}`, background:C.white, color:C.gray600, fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap" }}>
                    <Icon name="certificate" size={13} color={C.gray500}/> View
                  </button>
                  <button onClick={() => { const certId = `SS-${session.id}${qs?.score}-2024`; setShareCert({ certUrl:`spedsummit.com/cert/${certId.toLowerCase()}`, sessionTitle:session.title }); }}
                    style={{ padding:"8px 14px", borderRadius:8, border:`1px solid ${C.gray200}`, background:C.white, color:C.gray600, fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap" }}>
                    <Icon name="share-network" size={13} color={C.gray500}/> Share
                  </button>
                  <button onClick={()=>downloadCertificate({ recipientName:userName, sessionTitle:session.title, instructor:session.instructor, duration:session.duration, score:qs?.score, description:session.description })}
                    style={{ padding:"8px 14px", borderRadius:8, border:"none", background:C.primary, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap" }}>
                    <Icon name="download" size={13} color="#fff"/> Download
                  </button>
                </div>
              ) : (
                <span style={{ fontSize:11, fontWeight:600, color:C.gray400, background:C.gray100, padding:"4px 10px", borderRadius:99, whiteSpace:"nowrap" }}>
                  {qs?.status === "in-progress" || qs?.status === "failed" ? "In Progress" : "Not available yet"}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {shareCert && (
        <ShareCertificateModal
          certUrl={shareCert.certUrl}
          sessionTitle={shareCert.sessionTitle}
          onClose={() => setShareCert(null)}
        />
      )}
    </>
    );
  }

  /* ── Season Detail ── */
  if (activeSeason) {
    const season = seasons.find(s => s.id === activeSeason);
    const seasonSessions = sessions.filter(s => season.sessionIds.includes(s.id));

    return (
      <div style={{ padding:"16px 16px", background:C.gray50, minHeight:"100%" }}>
        {/* Breadcrumb */}
        <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:4, marginBottom:20, fontSize:14, fontWeight:500, color:C.gray500 }}>
          <button onClick={()=>setActiveSeason(null)} style={{ background:"none", border:"none", cursor:"pointer", padding:0, fontSize:14, fontWeight:500, color:C.gray500 }}
            onMouseEnter={e=>e.currentTarget.style.color=C.gray900} onMouseLeave={e=>e.currentTarget.style.color=C.gray500}>
            Certifications
          </button>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="m14.413 10.663-6.25 6.25a.939.939 0 1 1-1.328-1.328L12.42 10 6.836 4.413a.939.939 0 1 1 1.328-1.328l6.25 6.25a.94.94 0 0 1-.001 1.328" fill="var(--c-gray400)"/>
          </svg>
          <span style={{ color:"#6490E8", fontWeight:600 }}>{season.name}</span>
        </div>

        <h2 style={{ margin:"0 0 18px", fontSize:18, fontWeight:800, color:C.gray900 }}>{season.name}</h2>

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {seasonSessions.map(s => {
            const qs = quizStates[s.id];
            const passed  = qs?.status === "passed";
            const inProg  = qs?.status === "in-progress" || qs?.status === "failed";
            const hasQuiz = getSessionQuestions(s).length > 0;
            const lessonQuizCount = (s.lessons || []).filter(l => l.type === "quiz").length;
            const lessonDoneCount = (s.lessons || []).filter(l => l.type === "quiz" && l.status === "completed").length;

            return (
              <div key={s.id} onClick={()=>setActiveSession(s.id)}
                style={{ background:C.white, borderRadius:14, border:`1px solid ${passed ? C.primaryBorder : C.gray200}`, display:"flex", alignItems:"center", gap:14, padding:"14px 18px", cursor:"pointer" }}>
                <div style={{ position:"relative", width:72, height:50, borderRadius:8, overflow:"hidden", flexShrink:0 }}>
                  <SessionThumb id={s.id} height={50} noPlayHover/>
                  {passed && (
                    <div style={{ position:"absolute", inset:0, background:"rgba(16,185,129,0.18)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Icon name="medal" size={18} color={C.success}/>
                    </div>
                  )}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:C.gray900, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.title}</div>
                  <div style={{ fontSize:12, color:C.gray600, marginTop:2 }}>{s.instructor}</div>
                  {lessonQuizCount > 0 && (
                    <div style={{ fontSize:11, color:C.gray600, marginTop:3 }}>{lessonDoneCount}/{lessonQuizCount} knowledge checks · {passed ? "Certificate earned" : hasQuiz ? "Final assessment pending" : "No final assessment"}</div>
                  )}
                </div>
                <Icon name="caret-right" size={16} color={C.gray500}/>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── Flat list overview: season headers + session rows ── */
  return (
    <div style={{ padding: isMobile ? "16px 16px" : "24px 24px", background:C.gray50, minHeight:"100%", display:"flex", flexDirection:"column" }}>
      <style>{`
        @media(max-width:600px){
          .cert-row { flex-wrap: wrap; gap: 10px !important; padding: 14px 14px !important; }
          .cert-row-text { white-space: normal !important; overflow: visible !important; text-overflow: unset !important; }
          .cert-row-actions { width: 100%; display: flex; gap: 8px; }
          .cert-row-actions button { flex: 1; justify-content: center; }
          .cert-season-wrap { padding: 0 !important; }
        }
      `}</style>

      {totalEarned === 0 && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 32px", textAlign:"center", minHeight:400 }}>
          <div style={{ width:72, height:72, borderRadius:20, background:"rgba(245,158,11,0.10)", border:"1.5px solid rgba(245,158,11,0.2)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
            <Icon name="certificate" size={34} color="#f59e0b"/>
          </div>
          <div style={{ fontSize:18, fontWeight:800, color:C.gray900, marginBottom:10 }}>No certificates yet</div>
          <div style={{ fontSize:14, color:C.gray500, lineHeight:1.7, maxWidth:340, marginBottom:28 }}>
            Complete a session and pass the final assessment to earn your first certificate.
          </div>
        </div>
      )}
      {totalEarned > 0 && <div style={{ display:"flex", flexDirection:"column", gap:32 }}>
        {seasons.filter(season => sessions.some(s => season.sessionIds.includes(s.id))).map(season => {
          const seasonSessions  = sessions.filter(s => season.sessionIds.includes(s.id));
          const withQuiz  = seasonSessions.filter(s => getSessionQuestions(s).length > 0);
          const earned    = withQuiz.filter(s => quizStates[s.id]?.status === "passed").length;
          const total     = withQuiz.length;
          const allEarned = total > 0 && earned === total;

          return (
            <div key={season.id}>
              {/* Season header */}
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <h2 style={{ margin:0, fontSize:20, fontWeight:700, color:C.gray900, fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif", letterSpacing:-0.3 }}>{season.name}</h2>
                {allEarned && (
                  <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:"rgba(16,185,129,0.1)", borderRadius:99, padding:"3px 10px" }}>
                    <Icon name="medal" size={12} color={C.success}/>
                    <span style={{ fontSize:11, fontWeight:700, color:C.success }}>All Earned</span>
                  </span>
                )}
                <span style={{ fontSize:12, color:C.gray600, marginLeft:"auto" }}>{earned}/{total} certificates</span>
              </div>

              {/* Session rows */}
              <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, overflow:"hidden" }}>
                {seasonSessions.map((s, i) => {
                  const qs = quizStates[s.id];
                  const passed   = qs?.status === "passed";
                  const hasQuiz  = getSessionQuestions(s).length > 0;
                  const lessonQuizCount = (s.lessons || []).filter(l => l.type === "quiz").length;
                  const lessonDoneCount = (s.lessons || []).filter(l => l.type === "quiz" && l.status === "completed").length;

                  return (
                    <div key={s.id} className="cert-row"
                      style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 20px", borderBottom: i < seasonSessions.length - 1 ? `1px solid ${C.gray100}` : "none" }}>

                      {/* Status icon */}
                      <div style={{ width:36, height:36, borderRadius:10, flexShrink:0, background:"rgba(37,99,235,0.07)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Icon name="certificate" size={18} color={C.gray500}/>
                      </div>

                      {/* Text */}
                      <div style={{ flex:1, minWidth:0 }}>
                        <div className="cert-row-text" style={{ fontSize:14, fontWeight:700, color:C.gray900, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.title}</div>
                        <div style={{ fontSize:12, color:C.gray600, marginTop:2 }}>{s.instructor}</div>
                        <div style={{ fontSize:11, color:C.gray600, marginTop:3 }}>
                          {passed ? "Certificate earned" : hasQuiz ? "Final assessment pending" : "No final assessment"}
                        </div>
                      </div>

                      {/* Actions */}
                      {passed ? (
                        <div className="cert-row-actions" style={{ display:"flex", gap:8, flexShrink:0 }}>
                          <button
                            onClick={() => { const certId = `SS-${s.id}-${qs?.score}-2026`; setShareCert({ certUrl:`spedsummit.com/cert/${certId.toLowerCase()}`, sessionTitle:s.title }); }}
                            style={{ padding:"6px 12px", borderRadius:8, border:`1px solid ${C.gray200}`, background:C.white, color:C.gray700, fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap", fontFamily:"inherit" }}>
                            <Icon name="share-network" size={13} color={C.gray600}/> Share
                          </button>
                          <button
                            onClick={() => downloadCertificate({ recipientName:userName, sessionTitle:s.title, instructor:s.instructor, duration:s.duration, score:qs?.score, description:s.description })}
                            style={{ padding:"6px 12px", borderRadius:8, border:"none", background:C.primary, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap", fontFamily:"inherit" }}>
                            <Icon name="download" size={13} color="#fff"/> Download
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize:11, fontWeight:600, color:C.gray600, background:C.gray200, borderRadius:99, padding:"4px 12px", whiteSpace:"nowrap", flexShrink:0 }}>Pending</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {/* Loose sessions (not in any season) that have passed */}
        {(() => {
          const loose = sessions.filter(s => !allSeasonIds.has(s.id) && quizStates[s.id]?.status === "passed");
          if (!loose.length) return null;
          return (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:16 }}>
          {loose.map(s => {
            const qs = quizStates[s.id];
            return (
              <div key={s.id} style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, overflow:"hidden", display:"flex", flexDirection:"column" }}>
                {/* Mini certificate preview */}
                <div style={{ position:"relative", background:"#fffdf9", borderBottom:`1px solid ${C.gray100}`, overflow:"hidden", padding:"20px 20px 16px", display:"flex", flexDirection:"column", gap:8 }}>
                  <div style={{ position:"absolute", top:-30, left:-30, width:140, height:140, borderRadius:"50%", background:"rgba(255,160,160,0.22)", pointerEvents:"none" }}/>
                  <div style={{ position:"absolute", top:-20, right:-20, width:110, height:110, borderRadius:"50%", background:"rgba(160,220,160,0.18)", pointerEvents:"none" }}/>
                  <div style={{ position:"absolute", bottom:-20, left:60, width:100, height:100, borderRadius:"50%", background:"rgba(255,210,120,0.18)", pointerEvents:"none" }}/>
                  <div style={{ position:"absolute", bottom:-20, right:20, width:90, height:90, borderRadius:"50%", background:"rgba(255,160,100,0.15)", pointerEvents:"none" }}/>
                  <div style={{ position:"relative", zIndex:1, textAlign:"center" }}>
                    <div style={{ fontSize:14, color:"#3b82f6", letterSpacing:2, marginBottom:4 }}>★ ★ ★</div>
                    <div style={{ fontSize:11, fontWeight:700, color:"#1a1a1a", lineHeight:1.4 }}>Certificate of Professional Development Hours</div>
                  </div>
                  <div style={{ position:"relative", zIndex:1, textAlign:"center" }}>
                    <div style={{ fontSize:22, fontWeight:900, color:"#1a1a1a", letterSpacing:-0.5, marginBottom:8 }}>{userName || "Certificate Holder"}</div>
                    <div style={{ height:1, background:"#d1d5db", margin:"0 0 8px" }}/>
                    <div style={{ fontSize:11, color:"#b45309", fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", paddingBottom:4 }}>{s.title}</div>
                  </div>
                </div>
                <div style={{ padding:"12px 16px 16px", display:"flex", flexDirection:"column", gap:10 }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, color:C.gray900 }}>{s.title}</div>
                    {qs?.score != null && <div style={{ fontSize:12, color:C.gray500, marginTop:3 }}>Score: {qs.score}%</div>}
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={()=>onCertificateClick && onCertificateClick(s)}
                      style={{ flex:1, padding:"8px 0", borderRadius:8, border:`1px solid ${C.gray200}`, background:C.white, color:C.gray700, fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:5, fontFamily:"inherit" }}>
                      <Icon name="eye" size={13} color={C.gray600}/> View
                    </button>
                    <button onClick={()=>downloadCertificate({ recipientName:userName, sessionTitle:s.title, instructor:s.instructor, duration:s.duration, score:qs?.score, description:s.description })}
                      style={{ flex:1, padding:"8px 0", borderRadius:8, border:"none", background:C.primary, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:5, fontFamily:"inherit" }}>
                      <Icon name="download" size={13} color="#fff"/> Download
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
          );
        })()}
      </div>}
      {shareCert && (
        <ShareCertificateModal
          certUrl={shareCert.certUrl}
          sessionTitle={shareCert.sessionTitle}
          onClose={() => setShareCert(null)}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   REVIEW MODAL
───────────────────────────────────────────────────────────────────────────── */
function ReviewModal({ session, passed, score, onClose, onSubmit }) {
  const [rating, setRating]   = useState(0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview]   = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (rating === 0) return;
    onSubmit({ sessionId: session.id, rating, review: review.trim() });
    setSubmitted(true);
    setTimeout(onClose, 1800);
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:C.white, borderRadius:20, width:"100%", maxWidth:440, padding:"36px 32px 28px", position:"relative", boxShadow:"0 24px 64px rgba(0,0,0,0.18)", animation:"fadeIn .2s ease" }}>

        {!submitted ? (<>
          {/* Header */}
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <div style={{ fontSize:36, marginBottom:10 }}>{passed ? "🏆" : "📚"}</div>
            <h2 style={{ margin:"0 0 6px", fontSize:20, fontWeight:800, color:C.gray900 }}>
              {passed ? "Assessment Passed!" : "Assessment Complete"}
            </h2>
            <p style={{ margin:0, fontSize:14, color:C.gray500 }}>
              You scored <strong style={{ color: passed ? C.success : C.warning }}>{score}%</strong>
              {passed ? " — great work!" : ". Keep going, you'll get it!"}
            </p>
          </div>

          {/* Divider */}
          <div style={{ borderTop:`1px solid ${C.gray100}`, margin:"0 0 22px" }}/>

          {/* Rate */}
          <div style={{ textAlign:"center", marginBottom:20 }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.gray700, marginBottom:12 }}>How would you rate this session?</div>
            <div style={{ display:"flex", justifyContent:"center", gap:8 }}>
              {[1,2,3,4,5].map(n => (
                <button key={n}
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHovered(n)}
                  onMouseLeave={() => setHovered(0)}
                  style={{ background:"none", border:"none", cursor:"pointer", padding:4, fontSize:32, lineHeight:1, transition:"transform .1s",
                           transform: (hovered || rating) >= n ? "scale(1.15)" : "scale(1)",
                           filter: (hovered || rating) >= n ? "none" : "grayscale(1) opacity(0.35)" }}>
                  ★
                </button>
              ))}
            </div>
            {rating > 0 && (
              <div style={{ fontSize:12, color:C.gray400, marginTop:6 }}>
                {["","Poor","Fair","Good","Great","Excellent"][rating]}
              </div>
            )}
          </div>

          {/* Text review */}
          <textarea
            value={review}
            onChange={e => setReview(e.target.value)}
            placeholder="Share your thoughts (optional)..."
            rows={3}
            style={{ width:"100%", boxSizing:"border-box", border:`1px solid ${C.gray200}`, borderRadius:10, padding:"10px 14px", fontSize:14, color:C.gray700, resize:"none", outline:"none", fontFamily:"inherit", lineHeight:1.5 }}
            onFocus={e => e.target.style.borderColor = C.primary}
            onBlur={e => e.target.style.borderColor = C.gray200}
          />

          {/* Actions */}
          <div style={{ display:"flex", gap:10, marginTop:18 }}>
            <button onClick={onClose}
              style={{ flex:1, padding:"11px 0", borderRadius:10, border:`1px solid ${C.gray200}`, background:C.white, color:C.gray500, fontSize:14, fontWeight:600, cursor:"pointer" }}>
              Skip
            </button>
            <button onClick={handleSubmit} disabled={rating === 0}
              style={{ flex:2, padding:"11px 0", borderRadius:10, border:"none", background: rating === 0 ? C.gray200 : C.primary, color: rating === 0 ? C.gray400 : "#fff", fontSize:14, fontWeight:700, cursor: rating === 0 ? "default" : "pointer", transition:"background .15s" }}>
              Submit Review
            </button>
          </div>
        </>) : (
          <div style={{ textAlign:"center", padding:"16px 0 8px" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🎉</div>
            <div style={{ fontSize:16, fontWeight:700, color:C.gray900 }}>Thanks for your review!</div>
            <div style={{ fontSize:13, color:C.gray400, marginTop:6 }}>Your feedback helps us improve.</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SHARE CERTIFICATE MODAL
───────────────────────────────────────────────────────────────────────────── */
function AddToCalendarModal({ item, onClose, onConfirm }) {
  const dark = document.querySelector("[data-theme='dark']") !== null;

  useEffect(() => { onConfirm(); }, []);

  function buildDatetime() {
    try {
      const year = new Date().getFullYear();
      const dateStr = item.date.replace(/(\d+)\w+/, "$1");
      const cleaned = dateStr.replace(/(\d+)\w*\s+(\w+)(\s+\d+)?/, (_, d, m, y) => `${d} ${m}${y||" "+year}`);
      const dt = new Date(`${cleaned} ${item.time}`);
      return isNaN(dt) ? new Date() : dt;
    } catch { return new Date(); }
  }

  const start = buildDatetime();
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  function pad(n) { return String(n).padStart(2, "0"); }
  function toICS(dt) { return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth()+1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00Z`; }
  function toGoogle(dt) { return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth()+1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00Z`; }

  const title   = encodeURIComponent(item.title);
  const details = encodeURIComponent(`SPED Summit Session\nInstructor: ${item.instructor}\nspedsummit.com`);
  const dates   = `${toGoogle(start)}/${toGoogle(end)}`;
  const googleUrl = `https://calendar.google.com/calendar/r/eventedit?text=${title}&dates=${dates}&details=${details}&sf=true&output=xml`;

  function downloadICS() {
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//SPED Summit//EN",
      "BEGIN:VEVENT",
      `DTSTART:${toICS(start)}`, `DTEND:${toICS(end)}`,
      `SUMMARY:${item.title}`,
      `DESCRIPTION:SPED Summit Session\\nInstructor: ${item.instructor}\\nspedsummit.com`,
      `URL:https://spedsummit.com`,
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    const blob = new Blob([ics], { type:"text/calendar" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${item.title.replace(/[^a-z0-9]/gi,"_").slice(0,40)}.ics`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const displayDate = start.toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric", year:"numeric" });
  const displayTime = start.toLocaleTimeString("en-US", { hour:"numeric", minute:"2-digit" });

  const bg    = dark ? "#1a1f36" : "#fff";
  const border = dark ? "rgba(255,255,255,0.08)" : C.gray100;
  const textPrimary = dark ? "#fff" : C.gray900;
  const textSecondary = dark ? "rgba(255,255,255,0.45)" : C.gray500;
  const rowBg = dark ? "rgba(255,255,255,0.04)" : "#fff";
  const rowBgHover = dark ? "rgba(255,255,255,0.08)" : C.gray50;
  const rowBorder = dark ? "rgba(255,255,255,0.1)" : C.gray200;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:900, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}
      onClick={onClose}>
      <div style={{ background:bg, borderRadius:20, width:"100%", maxWidth:400, boxShadow:"0 24px 60px rgba(0,0,0,0.3)", overflow:"hidden", position:"relative" }}
        onClick={e => e.stopPropagation()}>

        {/* Close */}
        <button onClick={onClose} style={{ position:"absolute", top:14, right:14, width:28, height:28, borderRadius:8, border:`1px solid ${border}`, background:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1 }}>
          <Icon name="x" size={14} color={textSecondary}/>
        </button>

        <>
            {/* Green confirmation header */}
            <div style={{ padding:"28px 24px 22px", borderBottom:`1px solid ${border}` }}>
              <div style={{ width:48, height:48, borderRadius:"50%", background:"rgba(16,185,129,0.12)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
                <Icon name="check-circle" size={26} color={C.success}/>
              </div>
              <div style={{ fontSize:22, fontWeight:900, color:textPrimary, marginBottom:5 }}>You're registered!</div>
              <div style={{ fontSize:13, color:textSecondary, lineHeight:1.5 }}>
                You're signed up for <strong style={{ color: dark?"rgba(255,255,255,0.85)":C.gray800 }}>{item.title}</strong>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:10, fontSize:12, color:textSecondary }}>
                <Icon name="calendar" size={13} color={textSecondary}/> {displayDate} · {displayTime}
              </div>
            </div>

            {/* Calendar options */}
            <div style={{ padding:"18px 24px 24px" }}>
              <div style={{ fontSize:11, fontWeight:700, color:textSecondary, letterSpacing:.8, textTransform:"uppercase", marginBottom:12 }}>Add to your calendar</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <a href={googleUrl} target="_blank" rel="noopener noreferrer"
                  onClick={onClose}
                  style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:12, border:`1px solid ${rowBorder}`, background:rowBg, cursor:"pointer", textDecoration:"none", transition:"background .15s" }}
                  onMouseEnter={e=>e.currentTarget.style.background=rowBgHover}
                  onMouseLeave={e=>e.currentTarget.style.background=rowBg}>
                  <div style={{ width:32, height:32, borderRadius:8, background:"#fff", border:`1px solid ${C.gray100}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 1px 3px rgba(0,0,0,0.08)" }}>
                    <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#4285F4" d="M44 20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8 20-20 0-1.3-.1-2.7-.4-4z"/><path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z"/><path fill="#FBBC05" d="M24 44c5.2 0 9.9-1.8 13.5-4.7l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7H6.3C9.7 39.6 16.3 44 24 44z"/><path fill="#EA4335" d="M44 20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.8l6.2 5.2C41.6 35.6 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"/></svg>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:textPrimary }}>Google Calendar</div>
                    <div style={{ fontSize:11, color:textSecondary, marginTop:1 }}>Opens in a new tab</div>
                  </div>
                  <Icon name="arrow-square-out" size={14} color={textSecondary}/>
                </a>

                <button onClick={() => { downloadICS(); onClose(); }}
                  style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:12, border:`1px solid ${rowBorder}`, background:rowBg, cursor:"pointer", transition:"background .15s", width:"100%" }}
                  onMouseEnter={e=>e.currentTarget.style.background=rowBgHover}
                  onMouseLeave={e=>e.currentTarget.style.background=rowBg}>
                  <div style={{ width:32, height:32, borderRadius:8, background:"#000", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.18 1.28-2.16 3.82.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.76M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  </div>
                  <div style={{ flex:1, textAlign:"left" }}>
                    <div style={{ fontSize:13, fontWeight:700, color:textPrimary }}>Apple Calendar / iCal</div>
                    <div style={{ fontSize:11, color:textSecondary, marginTop:1 }}>Downloads .ics file</div>
                  </div>
                  <Icon name="download" size={14} color={textSecondary}/>
                </button>
              </div>

              <button onClick={onClose} style={{ width:"100%", marginTop:12, padding:"10px", background:"none", border:"none", fontSize:13, color:textSecondary, cursor:"pointer" }}>
                Skip for now
              </button>
            </div>
          </>
      </div>
    </div>
  );
}

const COMMON_TIMEZONES = [
  { label:"Pacific Time (PST/PDT)",       value:"America/Los_Angeles" },
  { label:"Mountain Time (MST/MDT)",      value:"America/Denver" },
  { label:"Central Time (CST/CDT)",       value:"America/Chicago" },
  { label:"Eastern Time (EST/EDT)",       value:"America/New_York" },
  { label:"Alaska Time",                  value:"America/Anchorage" },
  { label:"Hawaii Time",                  value:"Pacific/Honolulu" },
  { label:"Atlantic Time",                value:"America/Halifax" },
  { label:"Newfoundland Time",            value:"America/St_Johns" },
  { label:"Philippines (PHT)",            value:"Asia/Manila" },
  { label:"Singapore (SGT)",              value:"Asia/Singapore" },
  { label:"India (IST)",                  value:"Asia/Kolkata" },
  { label:"UAE / Gulf (GST)",             value:"Asia/Dubai" },
  { label:"Central Europe (CET/CEST)",    value:"Europe/Berlin" },
  { label:"UK / Ireland (GMT/BST)",       value:"Europe/London" },
  { label:"Australia Eastern (AEST)",     value:"Australia/Sydney" },
  { label:"Australia Central (ACST)",     value:"Australia/Adelaide" },
  { label:"Australia Western (AWST)",     value:"Australia/Perth" },
  { label:"New Zealand (NZST)",           value:"Pacific/Auckland" },
  { label:"Japan / Korea (JST/KST)",      value:"Asia/Tokyo" },
  { label:"China (CST)",                  value:"Asia/Shanghai" },
  { label:"Brazil (BRT)",                 value:"America/Sao_Paulo" },
  { label:"Argentina (ART)",              value:"America/Argentina/Buenos_Aires" },
  { label:"Colombia / Peru (COT/PET)",    value:"America/Bogota" },
  { label:"Mexico City (CST/CDT)",        value:"America/Mexico_City" },
  { label:"South Africa (SAST)",          value:"Africa/Johannesburg" },
  { label:"Nigeria (WAT)",                value:"Africa/Lagos" },
  { label:"Kenya / Ethiopia (EAT)",       value:"Africa/Nairobi" },
  { label:"UTC / GMT",                    value:"UTC" },
];

function TimezoneModal({ detectedTz, onConfirm }) {
  const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // Build the options list, injecting the browser tz at the top if it's not already there
  const inList = COMMON_TIMEZONES.find(t => t.value === browserTz);
  const tzOptions = inList
    ? COMMON_TIMEZONES
    : [{ label: browserTz.replace(/_/g," "), value: browserTz }, ...COMMON_TIMEZONES];
  const [selected, setSelected] = useState(browserTz);

  function fmtNow(tz) {
    try {
      return new Date().toLocaleTimeString("en-US", { timeZone:tz, hour:"numeric", minute:"2-digit", hour12:true, timeZoneName:"short" });
    } catch { return ""; }
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:"#fff", borderRadius:20, padding:"36px 32px 28px", width:"100%", maxWidth:460, boxShadow:"0 20px 60px rgba(0,0,0,0.18)", fontFamily:"'Inter',-apple-system,sans-serif" }}>
        {/* Icon */}
        <div style={{ width:48, height:48, borderRadius:14, background:"#eff6ff", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6490E8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
          </svg>
        </div>
        <h2 style={{ margin:"0 0 8px", fontSize:20, fontWeight:800, color:"#111827", letterSpacing:-0.5 }}>Set your timezone</h2>
        <p style={{ margin:"0 0 24px", fontSize:14, color:"#6b7280", lineHeight:1.6 }}>
          All sessions are scheduled in <strong>Pacific Time (PST/PDT)</strong>. Select your timezone so we can show you the correct local times.
        </p>

        <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:6 }}>Your timezone</label>
        <select value={selected} onChange={e=>setSelected(e.target.value)}
          style={{ width:"100%", padding:"10px 12px", border:"1px solid #e5e7eb", borderRadius:10, fontSize:14, color:"#111827", background:"#fff", outline:"none", marginBottom:8, cursor:"pointer", boxSizing:"border-box" }}>
          {tzOptions.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <div style={{ fontSize:12, color:"#9ca3af", marginBottom:24 }}>Current time in selected zone: <strong style={{ color:"#374151" }}>{fmtNow(selected)}</strong></div>

        <button onClick={()=>onConfirm(selected)}
          style={{ width:"100%", padding:"0 0", height:44, background:"#6490E8", color:"#fff", border:"none", borderRadius:10, fontSize:15, fontWeight:700, cursor:"pointer", transition:"background .12s" }}
          onMouseEnter={e=>e.currentTarget.style.background="#4f7de0"}
          onMouseLeave={e=>e.currentTarget.style.background="#6490E8"}>
          Confirm timezone
        </button>
      </div>
    </div>
  );
}

function ShareCertificateModal({ certUrl, sessionTitle, onClose }) {
  const [copied, setCopied] = useState(false);
  const dark = document.querySelector("[data-theme='dark']") !== null;
  const fullUrl = `https://${certUrl}`;
  const text = encodeURIComponent(`I just earned a certificate in "${sessionTitle}" from SPED Summit! 🎓`);
  const encodedUrl = encodeURIComponent(fullUrl);

  const socials = [
    {
      label: "LinkedIn",
      color: "#0A66C2",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "Email",
      color: "#1a73e8",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      ),
      href: `mailto:?subject=${encodeURIComponent(`My SPED Summit Certificate – ${sessionTitle}`)}&body=${text}%0A%0A${encodedUrl}`,
    },
    {
      label: "WhatsApp",
      color: "#25D366",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
        </svg>
      ),
      href: `https://wa.me/?text=${text}%20${encodedUrl}`,
    },
    {
      label: "Facebook",
      color: "#1877F2",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "X",
      color: "#000",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      href: `https://x.com/intent/tweet?text=${text}&url=${encodedUrl}`,
    },
  ];

  function copyLink() {
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:800,
                  display:"flex", alignItems:"flex-end", justifyContent:"center" }}
         onClick={onClose}>
      <style>{`
        .share-modal-card {
          background: ${dark ? "#1e2647" : "#fff"};
          border-radius: 20px 20px 0 0;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 -8px 40px rgba(0,0,0,0.2);
          padding: 8px 24px 32px;
          position: relative;
        }
        @media(min-width: 600px) {
          .share-modal-wrap {
            align-items: center !important;
            padding: 24px;
          }
          .share-modal-card {
            border-radius: 16px;
            padding: 28px 28px 24px;
            max-width: 440px;
          }
          .share-modal-handle { display: none !important; }
        }
      `}</style>
      <div className="share-modal-wrap" style={{ display:"flex", alignItems:"flex-end", justifyContent:"center", width:"100%", position:"fixed", inset:0 }} onClick={onClose}>
        <div className="share-modal-card" onClick={e => e.stopPropagation()}>
          {/* Drag handle (mobile) */}
          <div className="share-modal-handle" style={{ width:36, height:4, borderRadius:2, background:"#e5e7eb", margin:"0 auto 20px" }}/>

          {/* Close */}
          <button onClick={onClose}
            style={{ position:"absolute", top:16, right:16, width:28, height:28, borderRadius:8,
                     border:`1px solid ${dark ? "rgba(255,255,255,0.12)" : C.gray200}`, background:"none", cursor:"pointer",
                     display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="x" size={14} color={dark ? "rgba(255,255,255,0.5)" : C.gray500}/>
          </button>

          <div style={{ fontSize:20, fontWeight:700, color: dark ? "#fff" : "#181c32", marginBottom:6 }}>Share this certificate</div>
          <div style={{ fontSize:13, color: dark ? "rgba(255,255,255,0.5)" : C.gray400, marginBottom:24 }}>Show your network what you've accomplished</div>

          {/* Social icons */}
          <div style={{ display:"flex", gap:0, justifyContent:"space-between", marginBottom:28 }}>
            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                 style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, textDecoration:"none", flex:1 }}>
                <div style={{ width:52, height:52, borderRadius:"50%", background:s.color,
                              display:"flex", alignItems:"center", justifyContent:"center",
                              boxShadow:"0 2px 8px rgba(0,0,0,0.2)", transition:"transform .15s" }}
                     onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
                     onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                  {s.icon}
                </div>
                <span style={{ fontSize:11, color: dark ? "rgba(255,255,255,0.5)" : C.gray500, fontWeight:500 }}>{s.label}</span>
              </a>
            ))}
          </div>

          {/* Copy link row */}
          <div style={{ display:"flex", alignItems:"center", border:`1px solid ${dark ? "rgba(255,255,255,0.1)" : C.gray200}`,
                        borderRadius:12, overflow:"hidden", background: dark ? "rgba(255,255,255,0.06)" : C.gray50 }}>
            <div style={{ flex:1, padding:"12px 14px", fontSize:13, color: dark ? "rgba(255,255,255,0.45)" : C.gray500,
                          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {fullUrl}
            </div>
            <button onClick={copyLink}
              style={{ padding:"12px 18px", background:"none", border:"none", borderLeft:`1px solid ${dark ? "rgba(255,255,255,0.1)" : C.gray200}`,
                       color: copied ? C.success : C.primary, fontSize:13, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>
              {copied ? "COPIED!" : "COPY"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PUBLIC CERTIFICATE PAGE (Supabase ID-based)
───────────────────────────────────────────────────────────────────────────── */
function PublicCertificatePageById({ certId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    supabase.from("certificates").select("cert_data").eq("id", certId).single()
      .then(({ data: row, error: err }) => {
        if (err || !row) setError(true);
        else setData(row.cert_data);
      });
  }, [certId]);
  if (error) return <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"sans-serif", color:"#6b7280" }}>Certificate not found.</div>;
  if (!data) return <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"sans-serif", color:"#6b7280" }}>Loading certificate…</div>;
  return <PublicCertificatePage data={data}/>;
}

/* ─────────────────────────────────────────────────────────────────────────────
   PUBLIC CERTIFICATE PAGE
───────────────────────────────────────────────────────────────────────────── */
function PublicCertificatePage({ data }) {
  const { recipientName, sessionTitle, instructor, instructorImage, duration, score, description, certId, date } = data;
  const instructorName = instructor ? instructor.split("|")[0].trim() : "";
  const instructorRole = instructor?.includes("|") ? instructor.split("|")[1].trim() : "";
  const descText = description
    ? `This session was presented by ${instructorName}. ${description} Participants receiving this certificate completed this session, including the subsequent assessments.`
    : `This session was presented by ${instructorName}. Participants receiving this certificate completed this session, including the subsequent assessments.`;
  const certUrl = `${window.location.origin}${window.location.pathname}?cert=${btoa(JSON.stringify(data))}`;
  const [copied, setCopied] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setIsLoggedIn(!!session));
  }, []);

  return (
    <div style={{ minHeight:"100vh", background:"#fff", fontFamily:"'Inter',-apple-system,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
        @media(max-width:768px){ .pub-two-col { grid-template-columns:1fr !important; } }
      `}</style>

      {/* Nav — matches landing page */}
      <header style={{ background:"#fff", borderBottom:"1px solid rgba(0,0,0,0.08)", padding:"0 32px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <img src="/Container.png" alt="SPED Summit" style={{ height:26, cursor:"pointer" }}
          onClick={()=>{ sessionStorage.setItem("showLanding","1"); window.location.href=window.location.origin; }}/>
        {isLoggedIn ? (
          <button onClick={()=>{ sessionStorage.setItem("page","dashboard"); sessionStorage.setItem("showLanding","0"); window.location.href=window.location.origin; }}
            style={{ padding:"0 18px", height:36, background:"#6490E8", color:"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:600, cursor:"pointer" }}>
            My Dashboard
          </button>
        ) : (
          <button onClick={()=>setShowAuth(true)}
            style={{ padding:"0 18px", height:36, background:"#6490E8", color:"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:600, cursor:"pointer" }}>
            Sign in
          </button>
        )}
      </header>
      {showAuth && <AuthModal onClose={()=>setShowAuth(false)} onLogin={()=>{ window.location.href = window.location.origin; }}/>}

      {/* Breadcrumb bar — shown when logged in */}
      {isLoggedIn && (
        <div style={{ background:"#fff", borderBottom:"1px solid #f0f0f0", padding:"0 28px" }}>
          <div style={{ maxWidth:1100, margin:"0 auto", height:44, display:"flex", alignItems:"center", gap:6, fontSize:13, color:"#6b7280" }}>
            <a href="#" onClick={e=>{ e.preventDefault(); sessionStorage.setItem("page","certifications"); sessionStorage.setItem("showLanding","0"); window.location.href=window.location.origin; }}
              style={{ color:"#6b7280", textDecoration:"none", fontWeight:500, transition:"color .12s" }}
              onMouseEnter={e=>e.currentTarget.style.color="#1a1a1a"}
              onMouseLeave={e=>e.currentTarget.style.color="#6b7280"}>
              My Certificates
            </a>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="m8 5 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{ color:"#1a1a1a", fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{sessionTitle}</span>
          </div>
        </div>
      )}

      {/* Content section */}
      <div style={{ background:"#F9FBF8" }}>
      {/* Breadcrumb */}
      <div style={{ padding:"28px 32px 0", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ fontSize:12, color:"#6b7280", fontWeight:600, marginBottom:8, textTransform:"uppercase", letterSpacing:.8 }}>Course Certificate</div>
        <h1 style={{ margin:"0 0 32px", fontSize:"clamp(22px,3vw,34px)", fontWeight:800, color:"#1a1a1a", lineHeight:1.2 }}>{sessionTitle}</h1>
      </div>

      {/* Two-column layout */}
      <div className="pub-two-col" style={{ maxWidth:1100, margin:"0 auto", padding:"0 32px 32px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, alignItems:"stretch" }}>

        {/* LEFT */}
        <div style={{ display:"flex", flexDirection:"column", gap:16, height:"100%" }}>

          {/* Completed card — warm tone */}
          <div style={{ background:"#fff", border:"1px solid rgba(0,0,0,0.08)", borderRadius:16, padding:"24px 28px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
              <div style={{ width:52, height:52, borderRadius:"50%", background:"rgba(245,158,11,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, position:"relative" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="#d97706"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                <div style={{ position:"absolute", bottom:0, right:0, width:18, height:18, borderRadius:"50%", background:"#10b981", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </div>
              </div>
              <div>
                <div style={{ fontSize:17, fontWeight:700, color:"#1a1a1a" }}>Completed by {recipientName}</div>
                <div style={{ fontSize:13, color:"#6b7280", marginTop:3 }}>{date} · {duration || "1 Hour"}</div>
              </div>
            </div>
            <div style={{ fontSize:14, color:"#374151", lineHeight:1.75 }}>
              <strong style={{ color:"#1a1a1a" }}>{recipientName}'s</strong> achievement is verified. SPED Summit confirms their successful completion of <strong style={{ color:"#1a1a1a" }}>{sessionTitle}</strong> — a professional development session for special educators.
            </div>
          </div>

          {/* Session card — landing page style, fills remaining height */}
          <div style={{ background:"#fff", border:"1px solid rgba(0,0,0,0.08)", borderRadius:14, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", flex:1, display:"flex", flexDirection:"column" }}>
            <div style={{ display:"flex", gap:0, flex:1 }}>
              {/* Instructor photo */}
              <div style={{ width:200, flexShrink:0, position:"relative", background:"#1f2937", overflow:"hidden", alignSelf:"stretch" }}>
                {instructorImage
                  ? <img src={instructorImage} alt={instructorName} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top center", display:"block", position:"absolute", inset:0 }} onError={e=>{ e.target.style.display="none"; }}/>
                  : <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,#1e3a5f,#2d5a9e)" }}/>
                }
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.80) 0%, transparent 55%)", pointerEvents:"none" }}/>
                <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"8px 12px" }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#fff", lineHeight:1.25 }}>{instructorName}{instructorRole ? ` | ${instructorRole}` : ""}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.75)", marginTop:2 }}>Instructor</div>
                </div>
              </div>
              <div style={{ padding:"14px 16px", flex:1, minWidth:0, display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                <div>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(245,158,11,0.10)", color:"#b45309", border:"1px solid rgba(245,158,11,0.25)", borderRadius:5, padding:"4px 10px", fontSize:11, fontWeight:700, marginBottom:10 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {date}
                  </div>
                  <div style={{ fontSize:14, fontWeight:700, color:"#1a1a1a", lineHeight:1.35, marginBottom:6 }}>{sessionTitle}</div>
                  {description && (
                    <div style={{ fontSize:12, color:"#6b7280", lineHeight:1.5, marginBottom:8, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{description}</div>
                  )}
                </div>
                {isLoggedIn ? (
                  <a href={window.location.origin}
                    style={{ marginTop:12, padding:"8px 16px", background:"#6490E8", color:"#fff", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", alignSelf:"flex-start", textDecoration:"none", display:"inline-block" }}>
                    Watch Now
                  </a>
                ) : (
                  <button onClick={()=>setShowAuth(true)}
                    style={{ marginTop:12, padding:"8px 16px", background:"#6490E8", color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", alignSelf:"flex-start" }}>
                    Register Now
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT: Certificate + actions below */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <div style={{ width:"100%", aspectRatio:"11/8.5", borderRadius:16, overflow:"hidden", boxShadow:"0 4px 24px rgba(0,0,0,0.10)", position:"relative", border:"1px solid #e5e7eb" }}>
          <img src="/Certificate Background.png" alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", display:"block", pointerEvents:"none" }}/>

          <div style={{ position:"absolute", inset:0, padding:"24px 32px 20px", display:"flex", flexDirection:"column", alignItems:"center", fontFamily:"'Poppins','Arial',sans-serif", zIndex:1, boxSizing:"border-box", overflow:"hidden" }}>
            <div style={{ display:"flex", gap:8, marginBottom:10 }}>
              {[0,1,2].map(i => <span key={i} style={{ fontSize:18, color:"#3b82f6" }}>★</span>)}
            </div>
            <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", textAlign:"center", lineHeight:1.3, marginBottom:4 }}>Certificate of Professional Development Hours</div>
            <div style={{ fontSize:10, fontWeight:400, color:"#555", marginBottom:6 }}>is presented to</div>
            <div style={{ fontSize:28, fontWeight:800, color:"#1a1a1a", letterSpacing:-0.5, lineHeight:1.1, textAlign:"center", marginBottom:10 }}>{recipientName}</div>
            <div style={{ width:"100%", height:1, background:"#d1d5db", marginBottom:8 }}/>
            <div style={{ textAlign:"center", fontSize:10, fontWeight:400, color:"#333", lineHeight:1.55, marginBottom:10 }}>
              <div>For their participation in the session titled:</div>
              <strong style={{ fontWeight:600, color:"#1a1a1a", fontSize:11 }}>{sessionTitle}</strong>
            </div>
            <div style={{ width:"100%", display:"flex", justifyContent:"space-between", fontSize:11, fontWeight:600, color:"#1a1a1a", marginBottom:8 }}>
              <div>Session time: {duration || "1 Hour"}</div>
              <div>{date}</div>
            </div>
            <div style={{ fontSize:9, fontWeight:400, color:"#374151", lineHeight:1.65, textAlign:"center", flex:1, overflow:"hidden", marginBottom:8 }}>{descText}</div>
            <div style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"flex-end", fontSize:9, fontWeight:400, color:"#555", paddingTop:8, borderTop:"1px solid #e5e7eb", flexShrink:0 }}>
              <div>
                <div>Certificate ID: <strong style={{ fontWeight:600 }}>{certId}</strong></div>
                <div style={{ marginTop:3 }}>Contact at <strong style={{ fontWeight:600 }}>support@spedsummit.com</strong></div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ marginBottom:2 }}>Verify at:</div>
                <a href={certUrl} target="_blank" rel="noopener noreferrer" style={{ color:"#6490E8", fontWeight:600, textDecoration:"underline", display:"block" }}>{window.location.hostname}</a>
              </div>
            </div>
          </div>
        </div>

          {/* Share + Download — below certificate */}
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>setShowShare(true)}
              style={{ flex:1, padding:"11px 16px", borderRadius:10, border:"1px solid rgba(0,0,0,0.12)", background:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
              <Icon name="share-network" size={16} color="#1a1a1a" weight="fill"/> Share
            </button>
            <button onClick={()=> downloadCertificate({ recipientName, sessionTitle, instructor, duration, score, description, existingCertId: certId, existingDate: date })}
              style={{ flex:1, padding:"11px 16px", borderRadius:10, border:"none", background:"#6490E8", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
              <Icon name="download" size={16} color="#fff" weight="fill"/> Download PDF
            </button>
          </div>
          {showShare && <ShareCertificateModal certUrl={certUrl.replace(/^https?:\/\//, "")} sessionTitle={sessionTitle} onClose={()=>setShowShare(false)}/>}
        </div>{/* end right column */}
      </div>

      </div>{/* end content section */}

      {/* Footer — same as dashboard footer */}
      <Footer onNavigate={()=>{}} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CERTIFICATE MODAL
───────────────────────────────────────────────────────────────────────────── */
function CertificateModal({ session, quizState, onClose, userName = "" }) {
  const score = quizState?.score ?? 0;
  const today = new Date().toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });
  const certId = `SS-${session.id}${score}-2024`;
  // Generate shareable cert URL with encoded data
  const certData = { recipientName:userName, sessionTitle:session.title, instructor:session.instructor, instructorImage:session.instructorImage||"", duration:session.duration, score, description:session.description, certId, date:today };
  const certUrl = `${window.location.origin}${window.location.pathname}?cert=${btoa(JSON.stringify(certData))}`;
  const [showShare, setShowShare] = useState(false);

  return (
    <>
    <style>{`
      @media(max-width:600px){
        .cert-modal-wrap { padding:0 !important; align-items:flex-end !important; }
        .cert-modal-box { border-radius:20px 20px 0 0 !important; max-height:92vh !important; overflow-y:auto !important; }
        .cert-modal-actions { flex-wrap:wrap !important; }
        .cert-modal-actions button { flex:1 !important; justify-content:center !important; }
      }
    `}</style>
    <div className="cert-modal-wrap" style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", zIndex:700,
                  display:"flex", alignItems:"center", justifyContent:"center", padding:24,
                  backdropFilter:"blur(3px)" }}>
      <div className="cert-modal-box" style={{ background:C.white, borderRadius:16, width:"100%", maxWidth:680,
                    boxShadow:"0 32px 80px rgba(0,0,0,0.3)", animation:"fadeIn .2s ease", overflow:"hidden" }}>

        {/* Modal top bar */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 20px", borderBottom:`1px solid ${C.gray100}`, position:"sticky", top:0, background:C.white, zIndex:10 }}>
          <span style={{ fontSize:14, fontWeight:700, color:C.gray700 }}>Certificate Preview</span>
          <button onClick={onClose}
            style={{ width:30, height:30, borderRadius:8, border:`1px solid ${C.gray200}`,
                     background:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="x" size={15} color={C.gray500}/>
          </button>
        </div>

        {/* ── Certificate Document — 11:8.5 aspect ratio ── */}
        <div style={{ margin:"16px 16px 0", borderRadius:12, overflow:"hidden", border:`1px solid ${C.gray200}`, position:"relative", aspectRatio:"11/8.5" }}>
          <img src="/Certificate Background.png" alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", display:"block", pointerEvents:"none" }}/>

          <div style={{ position:"absolute", inset:0, padding:"3% 5%", display:"flex", flexDirection:"column", alignItems:"center", fontFamily:"'Poppins','Arial',sans-serif", zIndex:1, boxSizing:"border-box", overflow:"hidden" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');`}</style>
            {/* Stars */}
            <div style={{ display:"flex", gap:8, marginBottom:"2%" }}>
              {[0,1,2].map(i => <span key={i} style={{ fontSize:"clamp(12px,2vw,20px)", color:"#3b82f6", lineHeight:1 }}>★</span>)}
            </div>
            <div style={{ textAlign:"center", fontSize:"clamp(9px,1.4vw,14px)", fontWeight:700, color:"#1a1a1a", lineHeight:1.25, marginBottom:"1%" }}>Certificate of Professional Development Hours</div>
            <div style={{ fontSize:"clamp(7px,1vw,10px)", fontWeight:400, color:"#555", marginBottom:"1%" }}>is presented to</div>
            <div style={{ fontSize:"clamp(18px,3.5vw,36px)", fontWeight:800, color:"#1a1a1a", letterSpacing:-0.5, lineHeight:1.1, textAlign:"center", marginBottom:"2%" }}>{userName}</div>
            <div style={{ width:"100%", height:1, background:"#ccc", marginBottom:"1.5%" }}/>
            <div style={{ textAlign:"center", fontSize:"clamp(7px,1vw,10px)", fontWeight:400, color:"#333", lineHeight:1.5, marginBottom:"1.5%" }}>
              <div>For their participation in the session titled:</div>
              <strong style={{ color:"#1a1a1a", fontWeight:600 }}>{session.title}</strong>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", width:"100%", fontSize:"clamp(7px,1.1vw,11px)", fontWeight:600, color:"#1a1a1a", marginBottom:"1.5%" }}>
              <div>Session time: {session.duration || "1 Hour"}</div>
              <div>{today}</div>
            </div>
            <div style={{ fontSize:"clamp(6px,0.85vw,9px)", fontWeight:400, color:"#374151", lineHeight:1.65, textAlign:"center", marginBottom:"1.5%", flex:1, overflow:"hidden" }}>
              {session.description
                ? `This session was presented by ${session.instructor?.split("|")[0]?.trim()}. ${session.description} Participants receiving this certificate completed this session, including the subsequent assessments.`
                : `This session was presented by ${session.instructor?.split("|")[0]?.trim()}. Participants receiving this certificate completed this session, including the subsequent assessments.`}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", width:"100%", fontSize:"clamp(6px,0.85vw,9px)", fontWeight:400, color:"#555", paddingTop:"1%", borderTop:"1px solid #e5e7eb", flexShrink:0 }}>
              <div>Contact at <strong style={{ fontWeight:600 }}>support@spedsummit.com</strong></div>
              <a href={certUrl} target="_blank" rel="noopener noreferrer" style={{ color:"#6490E8", fontWeight:600, textDecoration:"underline" }}>View Certificate ↗</a>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="cert-modal-actions" style={{ display:"flex", gap:10, padding:"16px 20px", justifyContent:"flex-end", position:"sticky", bottom:0, background:C.white, borderTop:`1px solid ${C.gray100}`, zIndex:10 }}>
          <Btn variant="outline" onClick={() => setShowShare(true)}>
            <Icon name="share-network" size={14} color={C.primary}/> Share
          </Btn>
          <Btn variant="outline" onClick={() => window.open(certUrl, "_blank")}>
            <Icon name="arrow-square-out" size={14} color={C.primary}/> View Certificate
          </Btn>
          <Btn onClick={() => { downloadCertificate({ sessionTitle: session.title, instructor: session.instructor, duration: session.duration, score }); }}>
            <Icon name="download" size={14} color="#fff"/> Download PDF
          </Btn>
        </div>
      </div>
    </div>

    {showShare && (
      <ShareCertificateModal
        certUrl={certUrl}
        sessionTitle={session.title}
        onClose={() => setShowShare(false)}
      />
    )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   QUIZ MODAL — interactive question-by-question flow
───────────────────────────────────────────────────────────────────────────── */
function QuizModal({ quiz, onClose, onFinish }) {
  const questions = QUIZ_QUESTIONS;
  const [currentQ, setCurrentQ] = useState(0);
  const [answers,  setAnswers]  = useState({});
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finalScore,  setFinalScore]  = useState(0);

  const q      = questions[currentQ];
  const isLast = currentQ === questions.length - 1;
  const pct    = Math.round((currentQ / questions.length) * 100);

  function selectAnswer(idx) {
    if (answers[currentQ] !== undefined) return; // already locked
    setSelected(idx);
  }

  function next() {
    if (selected === null && answers[currentQ] === undefined) return;
    const chosenIdx     = selected !== null ? selected : answers[currentQ];
    const newAnswers    = { ...answers, [currentQ]: chosenIdx };
    setAnswers(newAnswers);
    setSelected(null);

    if (isLast) {
      const correct = Object.entries(newAnswers).filter(
        ([qi, ans]) => QUIZ_QUESTIONS[Number(qi)].correct === ans
      ).length;
      const score = Math.round((correct / questions.length) * 100);
      setFinalScore(score);
      setShowResult(true);
    } else {
      setCurrentQ(q => q + 1);
    }
  }

  function handleFinish() {
    onFinish(quiz, finalScore);
  }

  /* option appearance helpers */
  function optionStyle(i) {
    const answered = answers[currentQ] !== undefined;
    const isSel    = selected === i || answers[currentQ] === i;
    const isCorrect = q.correct === i;

    let bg = C.white, border = C.gray200, textColor = C.gray700;

    if (answered) {
      if (isSel && isCorrect) { bg = C.successLight; border = C.successBorder; textColor = C.success; }
      else if (isSel)         { bg = C.errorLight;   border = C.errorBorder;   textColor = C.error;   }
      else if (isCorrect)     { bg = C.successLight; border = C.successBorder; textColor = C.success; }
    } else if (selected === i) {
      bg = C.primaryLight; border = C.primary; textColor = C.primary;
    }
    return { bg, border, textColor };
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:500,
                  display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:C.white, borderRadius:20, width:"100%", maxWidth:560,
                    boxShadow:"0 24px 64px rgba(0,0,0,0.22)", overflow:"hidden", animation:"fadeIn .2s ease" }}>

        {/* Header */}
        <div style={{ padding:"18px 24px", borderBottom:`1px solid ${C.gray100}`,
                      display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:12, fontWeight:700, letterSpacing:1.5, color:C.primary, marginBottom:3 }}>QUIZ</div>
            <div style={{ fontWeight:700, fontSize:14, color:C.gray900 }}>{quiz.title}</div>
          </div>
          <button onClick={onClose}
            style={{ width:32, height:32, borderRadius:8, border:`1px solid ${C.gray200}`,
                     background:C.white, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
            onMouseEnter={e=>e.currentTarget.style.background=C.gray50}
            onMouseLeave={e=>e.currentTarget.style.background=C.white}>
            <Icon name="x" size={16} color={C.gray500}/>
          </button>
        </div>

        {!showResult ? (
          <div style={{ padding:"24px" }}>
            {/* Progress bar */}
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.gray400, marginBottom:7 }}>
              <span>Question {currentQ + 1} of {questions.length}</span>
              <span>{pct}% complete</span>
            </div>
            <ProgressBar value={pct} height={5}/>

            {/* Question text */}
            <div style={{ margin:"22px 0 18px", fontSize:16, fontWeight:700, color:C.gray900, lineHeight:1.5 }}>
              {q.question}
            </div>

            {/* Options */}
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {q.options.map((opt, i) => {
                const { bg, border, textColor } = optionStyle(i);
                const answered = answers[currentQ] !== undefined;
                return (
                  <button key={i} onClick={() => selectAnswer(i)}
                    style={{ padding:"13px 16px", borderRadius:12, border:`2px solid ${border}`,
                             background:bg, color:textColor, fontSize:14, fontWeight:500,
                             textAlign:"left", cursor:answered?"default":"pointer",
                             transition:"all .15s", display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ width:26, height:26, borderRadius:"50%", border:`2px solid ${border}`,
                                   display:"flex", alignItems:"center", justifyContent:"center",
                                   fontSize:12, fontWeight:700, flexShrink:0, color:textColor }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Next / Finish */}
            <div style={{ marginTop:22, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:12, color:C.gray400 }}>
                {answers[currentQ] !== undefined
                  ? (q.correct === answers[currentQ] ? "✓ Correct!" : "✗ Incorrect")
                  : "Select an answer"}
              </span>
              <Btn onClick={next} disabled={selected === null && answers[currentQ] === undefined}>
                {isLast ? "Finish Quiz" : "Next"} <Icon name="caret-right" size={14} color="#fff"/>
              </Btn>
            </div>
          </div>
        ) : (
          /* Result screen */
          <div style={{ padding:"40px 24px", textAlign:"left" }}>
            <div style={{ fontSize:52, marginBottom:12 }}>
              {finalScore >= 80 ? "🏆" : finalScore >= 60 ? "🎯" : "📚"}
            </div>
            <h2 style={{ margin:"0 0 6px", fontSize:22, fontWeight:900, color:C.gray900 }}>
              {finalScore >= 80 ? "Great job!" : finalScore >= 60 ? "Good effort!" : "Keep practising!"}
            </h2>
            <p style={{ color:C.gray500, fontSize:14, margin:"0 0 6px" }}>
              You scored
            </p>
            <div style={{ fontSize:48, fontWeight:900,
                          color: finalScore >= 80 ? C.success : finalScore >= 60 ? C.warning : C.error,
                          marginBottom:20 }}>
              {finalScore}%
            </div>
            <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
              <Btn variant="outline" onClick={onClose}>Back to Quizzes</Btn>
              <Btn onClick={handleFinish}>Save Score</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   QUIZZES PAGE
───────────────────────────────────────────────────────────────────────────── */
function QuizzesPage({ toast }) {
  const [quizzes, setQuizzes] = useState(QUIZ_DATA);
  const [filter,    setFilter]    = useState("all");
  const [takingQuiz, setTakingQuiz] = useState(null);

  const completed = quizzes.filter(q => q.status === "completed").length;
  const total     = quizzes.length;
  const pct       = Math.round((completed / total) * 100);

  /* The "currently active" hero quiz */
  const heroQuiz = quizzes.find(q => q.id === 5 && q.status === "in-progress");

  const filtered = quizzes.filter(q => {
    if (filter === "pending")   return q.status !== "completed";
    if (filter === "completed") return q.status === "completed";
    return true;
  });

  function startQuiz(quiz) { setTakingQuiz(quiz); }

  function finishQuiz(quiz, score) {
    setQuizzes(prev => prev.map(q =>
      q.id === quiz.id ? { ...q, status:"completed", score, progress:100 } : q
    ));
    setTakingQuiz(null);
    toast({
      type: score >= 80 ? "success" : score >= 60 ? "warning" : "error",
      title: "Quiz Complete!",
      message: `You scored ${score}% on "${quiz.title}"`,
    });
  }

  /* Per-category colours */
  const CAT_COLORS = {
    TECHNOLOGY:    { c:"#1e1b4b", bg:"#eef3fd" },
    LEADERSHIP:    { c:"#7c3aed", bg:"#ede9fe" },
    MANAGEMENT:    { c:"#2563eb", bg:C.primaryLight },
    TEAMWORK:      { c:"#f97316", bg:"#fff7ed" },
    COMMUNICATION: { c:"#0ea5e9", bg:C.infoLight  },
    ACCESSIBILITY: { c:"#ec4899", bg:"#fdf2f8"     },
  };

  const STATUS_META = {
    "completed":   { label:"Completed",  c:C.success, bg:C.successLight },
    "in-progress": { label:"In Progress",c:C.warning, bg:C.warningLight },
    "not-started": { label:"Not Started",c:C.gray500, bg:C.gray100      },
  };

  /* ── Quiz Card ── */
  function QuizCard({ quiz }) {
    const sc = STATUS_META[quiz.status] || STATUS_META["not-started"];
    const cc = CAT_COLORS[quiz.category] || { c:C.primary, bg:C.primaryLight };
    const [hovered, setHovered] = useState(false);

    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`,
                 padding:"18px 20px", display:"flex", flexDirection:"column", gap:12,
                 transition:"transform .2s, box-shadow .2s",
                 transform: hovered ? "translateY(-3px)" : "none",
                 boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.10)" : "0 1px 3px rgba(0,0,0,0.06)" }}>

        {/* Icon + status badge */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div style={{ width:40, height:40, borderRadius:10, background:cc.bg,
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name={quiz.icon} size={20} color={cc.c}/>
          </div>
          <Badge label={sc.label} color={sc.c} bg={sc.bg} size={12}/>
        </div>

        {/* Text */}
        <div>
          <div style={{ fontWeight:700, fontSize:14, color:C.gray900, marginBottom:4, lineHeight:1.4 }}>
            {quiz.title}
          </div>
          <div style={{ fontSize:12, color:C.gray500, lineHeight:1.5 }}>{quiz.description}</div>
        </div>

        {/* Score / progress */}
        {quiz.status === "completed" && (
          <div style={{ fontSize:12, fontWeight:700, color:C.success }}>Score: {quiz.score}%</div>
        )}
        {quiz.status === "in-progress" && quiz.progress > 0 && (
          <ProgressBar value={quiz.progress} color={C.warning} height={4}/>
        )}

        {/* Footer */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                      borderTop:`1px solid ${C.gray100}`, paddingTop:12, marginTop:"auto" }}>
          <span style={{ fontSize:12, color:C.gray400, display:"flex", alignItems:"center", gap:4 }}>
            <Icon name="timer" size={12} color={C.gray400}/>
            {quiz.questions} Questions • {quiz.minutes}m
          </span>
          {quiz.status === "completed"
            ? <Btn variant="outline" size="sm" onClick={() => toast({ type:"info", title:"Review Mode", message:`Reviewing "${quiz.title}"` })}>Review</Btn>
            : quiz.status === "in-progress"
            ? <Btn size="sm" onClick={() => startQuiz(quiz)}><Icon name="play" size={13} color="#fff"/>Continue</Btn>
            : <Btn size="sm" onClick={() => startQuiz(quiz)}><Icon name="play" size={13} color="#fff"/>Start Quiz</Btn>
          }
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding:"24px", background:C.gray50, minHeight:"100%", boxSizing:"border-box" }}>
      {takingQuiz && (
        <QuizModal quiz={takingQuiz} onClose={() => setTakingQuiz(null)} onFinish={finishQuiz}/>
      )}

      <div style={{ maxWidth:1160, margin:"0 auto" }}>

        {/* ── Hero Header ── */}
        <div style={{ display:"flex", gap:20, marginBottom:28, flexWrap:"wrap", alignItems:"flex-start" }}>
          <div style={{ flex:1, minWidth:260 }}>
            <div style={{ fontSize:12, fontWeight:700, letterSpacing:2, color:C.primary, marginBottom:6 }}>
              SPED SUMMIT 2024
            </div>
            <h1 style={{ margin:"0 0 10px", fontSize:26, fontWeight:900, color:C.gray900 }}>
              Quizzes &amp; Assessments
            </h1>
            <p style={{ margin:0, color:C.gray500, fontSize:14, lineHeight:1.6, maxWidth:480 }}>
              Validate your knowledge across leadership, technology, and design.
              Complete all session assessments to earn your summit certification.
            </p>
          </div>

          {/* Progress widget */}
          <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.gray200}`,
                        padding:"20px 24px", flexShrink:0, minWidth:270,
                        boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:10 }}>
              <span style={{ fontSize:14, fontWeight:700, color:C.gray900 }}>Overall Progress</span>
              <span style={{ fontSize:22, fontWeight:900, color:C.primary }}>{pct}%</span>
            </div>
            <ProgressBar value={pct} height={8}/>
            <div style={{ marginTop:10, fontSize:12, color:C.gray500,
                          display:"flex", alignItems:"center", gap:6 }}>
              <Icon name="check-circle" size={14} color={C.success}/>
              {completed} of {total} assessments completed
            </div>
          </div>
        </div>

        {/* ── Bento grid ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:20 }}>

          {/* Left column */}
          <div style={{ display:"flex", flexDirection:"column", gap:20, minWidth:0 }}>

            {/* Active Quiz Hero Card */}
            {heroQuiz && (
              <div style={{ background:`linear-gradient(135deg, ${C.primary} 0%, #1d4ed8 100%)`,
                            borderRadius:16, padding:"28px 32px", position:"relative",
                            overflow:"hidden", boxShadow:"0 8px 28px rgba(37,99,235,0.28)" }}>
                {/* Decorative icon */}
                <div style={{ position:"absolute", right:-10, top:-10, opacity:0.07 }}>
                  <Icon name="medal" size={190} color="#fff"/>
                </div>
                <div style={{ position:"relative", zIndex:1, maxWidth:460 }}>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:6,
                                background:"rgba(255,255,255,0.18)", backdropFilter:"blur(8px)",
                                padding:"4px 14px", borderRadius:99, fontSize:12,
                                fontWeight:700, color:"#fff", marginBottom:16, letterSpacing:1 }}>
                    RECENTLY WORKING ON
                  </div>
                  <h2 style={{ margin:"0 0 8px", fontSize:20, fontWeight:800, color:"#fff" }}>
                    {heroQuiz.title}
                  </h2>
                  <p style={{ margin:"0 0 20px", color:"rgba(255,255,255,0.75)",
                               fontSize:14, lineHeight:1.5 }}>
                    {heroQuiz.description}
                  </p>
                  <div style={{ display:"flex", gap:22, marginBottom:22 }}>
                    <span style={{ display:"flex", alignItems:"center", gap:6,
                                   color:"rgba(255,255,255,0.9)", fontSize:14 }}>
                      <Icon name="timer" size={16} color="rgba(255,255,255,0.9)"/> 15 min left
                    </span>
                    <span style={{ display:"flex", alignItems:"center", gap:6,
                                   color:"rgba(255,255,255,0.9)", fontSize:14 }}>
                      <Icon name="question" size={16} color="rgba(255,255,255,0.9)"/>
                      {heroQuiz.currentQ || 10}/{heroQuiz.questions} questions
                    </span>
                  </div>
                  <Btn onClick={() => startQuiz(heroQuiz)}
                    style={{ background:"rgba(255,255,255,0.18)", color:"#fff",
                             border:"1px solid rgba(255,255,255,0.35)", backdropFilter:"blur(8px)" }}>
                    Resume Quiz <Icon name="caret-right" size={14} color="#fff"/>
                  </Btn>
                </div>
              </div>
            )}

            {/* Filter tabs + Catalog */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h3 style={{ margin:0, fontSize:16, fontWeight:800, color:C.gray900 }}>Session Catalog</h3>
              <div style={{ display:"flex", gap:6 }}>
                {["all","pending","completed"].map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    style={{ padding:"5px 14px", borderRadius:99, fontSize:12, fontWeight:600,
                             border:"none", cursor:"pointer",
                             background: filter===f ? C.primary : C.gray100,
                             color:      filter===f ? "#fff"    : C.gray500,
                             transition:"all .15s" }}
                    onMouseEnter={e=>{ if(filter!==f) e.currentTarget.style.background=C.gray200; }}
                    onMouseLeave={e=>{ if(filter!==f) e.currentTarget.style.background=C.gray100; }}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px,1fr))", gap:16 }}>
              {filtered.map(q => <QuizCard key={q.id} quiz={q}/>)}
              {filtered.length === 0 && (
                <div style={{ gridColumn:"1/-1", textAlign:"left", padding:"48px 20px", color:C.gray400 }}>
                  <Icon name="medal" size={36} color={C.gray300}/>
                  <p style={{ marginTop:12, fontSize:14 }}>No quizzes match this filter.</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

            {/* Performance Detail */}
            <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`,
                          padding:"20px", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
              <h3 style={{ margin:"0 0 16px", fontSize:16, fontWeight:800, color:C.gray900 }}>
                Performance Detail
              </h3>
              {[
                { label:"Avg. Accuracy", value:84, color:C.success, display:"84%" },
                { label:"Avg. Speed",    value:65, color:C.warning, display:"12m 4s" },
                { label:"Retake Rate",   value:12, color:C.primary, display:"12%" },
              ].map(m => (
                <div key={m.label} style={{ marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between",
                                fontSize:12, marginBottom:5 }}>
                    <span style={{ color:C.gray500 }}>{m.label}</span>
                    <span style={{ fontWeight:700, color:C.gray900 }}>{m.display}</span>
                  </div>
                  <ProgressBar value={m.value} color={m.color} height={5}/>
                </div>
              ))}
              <div style={{ marginTop:16, padding:"12px 14px", background:C.gray50,
                            borderRadius:10, border:`1px solid ${C.gray100}` }}>
                <div style={{ fontSize:12, fontWeight:700, color:C.gray400,
                              letterSpacing:1, marginBottom:6 }}>MENTOR TIP</div>
                <p style={{ margin:0, fontSize:12, color:C.gray500, lineHeight:1.5, fontStyle:"italic" }}>
                  "Focus on 'Product Strategy'—your quiz accuracy is slightly below your average in that area."
                </p>
              </div>
            </div>

            {/* Leaderboard */}
            <div style={{ background:C.gray50, borderRadius:14, border:`1px solid ${C.gray200}`,
                          padding:"20px" }}>
              <div style={{ display:"flex", justifyContent:"space-between",
                            alignItems:"center", marginBottom:16 }}>
                <h3 style={{ margin:0, fontSize:16, fontWeight:800, color:C.gray900 }}>Leaderboard</h3>
                <button style={{ fontSize:12, fontWeight:600, color:C.primary,
                                 background:"none", border:"none", cursor:"pointer" }}>
                  View All
                </button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {LEADERBOARD_DATA.map(u => (
                  <div key={u.rank}
                    style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 10px",
                             borderRadius:10,
                             background: u.isMe ? C.white : "transparent",
                             border:     u.isMe ? `1px solid ${C.primaryBorder}` : "none" }}>
                    <span style={{ fontSize:12, fontWeight:700,
                                   color:u.isMe ? C.primary : C.gray500, width:18, flexShrink:0 }}>
                      {u.rank}
                    </span>
                    <Avatar name={u.name} size={30}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, fontWeight:u.isMe?700:500, color:C.gray900,
                                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {u.name}
                      </div>
                      <div style={{ fontSize:12, color:C.gray400 }}>
                        {u.xp.toLocaleString()} XP
                      </div>
                    </div>
                    {u.rank === 1 && <Icon name="star"      size={16} color={C.warning}/>}
                    {u.isMe        && <Icon name="trend-up" size={16} color={C.success}/>}
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements widget */}
            <div style={{ background:`linear-gradient(135deg, ${C.warning} 0%, #b45309 100%)`,
                          borderRadius:14, padding:"20px",
                          boxShadow:"0 6px 20px rgba(245,158,11,0.28)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                <Icon name="star" size={18} color="#fff"/>
                <span style={{ fontSize:14, fontWeight:700, color:"#fff" }}>New Milestone Near</span>
              </div>
              <p style={{ margin:"0 0 18px", fontSize:12, color:"rgba(255,255,255,0.9)", lineHeight:1.5 }}>
                Complete 3 more quizzes with 90%+ score to unlock the 'Elite Architect' badge.
              </p>
              <div style={{ display:"flex", gap:6 }}>
                {[
                  { icon:"lightning", filled:true  },
                  { icon:"palette",   filled:true  },
                  { icon:"lock",      filled:false },
                ].map((b, i) => (
                  <div key={i}
                    style={{ width:34, height:34, borderRadius:"50%",
                             border:"2px solid rgba(255,255,255,0.4)",
                             background: b.filled ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.18)",
                             display:"flex", alignItems:"center", justifyContent:"center",
                             opacity: b.filled ? 1 : 0.55 }}>
                    <Icon name={b.icon} size={15} color="#fff"/>
                  </div>
                ))}
              </div>
            </div>

          </div>{/* end right sidebar */}
        </div>{/* end bento grid */}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   AUTH MODAL
───────────────────────────────────────────────────────────────────────────── */
const LEGAL_CONTENT = {
  terms: {
    title: "Terms of Service",
    sections: [
      { heading: "Acceptance of Terms", body: "By creating an account or accessing SPED Summit, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform." },
      { heading: "Use of the Platform", body: "SPED Summit grants you a limited, non-exclusive, non-transferable license to access and use the platform for your personal, non-commercial educational purposes. You may not share login credentials or redistribute course content." },
      { heading: "User Accounts", body: "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. We reserve the right to terminate accounts that violate these terms." },
      { heading: "Intellectual Property", body: "All content on SPED Summit — including videos, course materials, assessments, and graphics — is owned by SPED Summit or its content creators and is protected by copyright law. Unauthorized reproduction or distribution is prohibited." },
      { heading: "Certificates & Assessments", body: "Certificates of completion are issued upon passing the required assessments. SPED Summit reserves the right to revoke certificates if fraudulent activity is detected." },
      { heading: "Limitation of Liability", body: "SPED Summit is provided 'as is' without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform." },
      { heading: "Changes to Terms", body: "We may update these Terms at any time. Continued use of the platform after changes constitutes acceptance of the revised Terms." },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "June 2026",
    intro: "At SPED Summit, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains what information we collect, how we use it, and the steps we take to safeguard it. By using our website or registering for our events, you agree to the practices described below.",
    sections: [
      { heading: "Information We Collect", body: "We collect information that helps us provide a better experience for attendees, speakers, and visitors to our website.\n\nWhen you register for SPED Summit, subscribe to our emails, apply as a speaker, or contact us, you may voluntarily provide information such as your name, email address, professional role, organization, and other details relevant to your participation. This information helps us communicate with you, manage registrations, deliver certificates, and provide event-related services.\n\nLike most websites, we automatically collect certain technical information when you visit our site. This may include your IP address, browser type, device information, pages visited, and general website activity. This information helps us understand how visitors use the website and allows us to improve the overall user experience." },
      { heading: "How We Use Your Information", body: "The information we collect is used solely to operate and improve SPED Summit and related educational services. We may use your information to register you for summit events, provide access to sessions and resources, deliver professional development certificates, send event updates and reminders, respond to support requests, improve our website and attendee experience, and share information about future SPED Summit events.\n\nWe only use your information for legitimate educational and operational purposes related to the summit." },
      { heading: "Email Communications", body: "When you register for SPED Summit or subscribe to our mailing list, you may receive emails regarding your registration, summit schedules, speaker announcements, certificates, and future educational opportunities.\n\nWe strive to send relevant and useful communications and avoid excessive email marketing. You may unsubscribe from promotional emails at any time using the unsubscribe link included in our messages." },
      { heading: "Information Sharing", body: "Protecting attendee privacy is important to us. We do not sell, rent, or share personal information with advertisers, sponsors, or third parties for marketing purposes.\n\nYour information may only be shared with trusted service providers who help us operate the summit or when required by law. Any such providers are expected to handle your information securely and responsibly." },
      { heading: "Speakers and Third-Party Resources", body: "SPED Summit sessions may include links to speaker websites, social media profiles, downloadable resources, courses, or other external content.\n\nOnce you leave the SPED Summit website and visit a third-party website, their own privacy policies and practices apply. We encourage users to review those policies before sharing personal information." },
      { heading: "Cookies and Analytics", body: "Our website may use cookies and similar technologies to improve performance and better understand how visitors interact with our content.\n\nThese tools help us analyze website traffic, improve navigation, and enhance the attendee experience. You can manage or disable cookies through your browser settings if you prefer." },
      { heading: "Data Security", body: "We take reasonable precautions to protect your personal information from unauthorized access, misuse, disclosure, or alteration.\n\nWhile no online system can guarantee complete security, we use industry-standard practices and trusted technology providers to help keep your information secure." },
      { heading: "Data Retention", body: "We retain personal information only for as long as necessary to provide our services, maintain event records, issue certificates, and comply with legal obligations.\n\nWhen information is no longer needed for these purposes, it may be deleted or securely anonymized." },
      { heading: "Children's Privacy", body: "SPED Summit is intended for educators, therapists, clinicians, parents, and other adult professionals. Our services are not directed toward children under the age of 13.\n\nWe do not knowingly collect personal information from children. If we become aware that such information has been collected, we will take appropriate steps to remove it." },
      { heading: "Your Rights", body: "Depending on your location and applicable privacy laws, you may have the right to access, update, correct, or request deletion of your personal information.\n\nYou may also opt out of promotional communications at any time. We are committed to responding to privacy-related requests in a timely and respectful manner." },
      { heading: "Changes to This Privacy Policy", body: "As SPED Summit continues to grow, we may occasionally update this Privacy Policy to reflect changes in our services, technology, or legal requirements.\n\nAny updates will be posted on this page along with a revised \"Last Updated\" date so that users can stay informed about our privacy practices." },
      { heading: "Contact Us", body: "If you have any questions regarding this Privacy Policy, your personal information, or our privacy practices, please contact us:\n\nEmail: support@spedsummit.com\n\nWe appreciate your trust and thank you for being part of the SPED Summit community." },
    ],
  },
  tos: {
    title: "Terms of Service",
    lastUpdated: "June 2026",
    intro: "Welcome to SPED Summit. These Terms of Service (\"Terms\") govern your access to and use of the SPED Summit website, events, content, resources, and related services.\n\nBy accessing our website, registering for SPED Summit, or participating in any of our services, you agree to comply with these Terms. If you do not agree with these Terms, please do not use our website or services.",
    sections: [
      { heading: "About SPED Summit", body: "SPED Summit is a virtual professional development event designed for special educators, therapists, clinicians, administrators, paraprofessionals, parents, and other professionals who support diverse learners.\n\nOur goal is to provide high-quality educational content, practical strategies, and professional learning opportunities through expert-led presentations and resources." },
      { heading: "Eligibility", body: "SPED Summit is intended for individuals who are at least 18 years old or have the legal authority to enter into agreements within their jurisdiction.\n\nBy using our website and services, you confirm that the information you provide is accurate and that you are authorized to participate in the event." },
      { heading: "Registration and Account Information", body: "When registering for SPED Summit, you agree to provide accurate and complete information. This helps us deliver event access, certificates, important updates, and support services.\n\nYou are responsible for maintaining the accuracy of your registration information and ensuring that your email address remains current throughout the event." },
      { heading: "Event Access", body: "Registration grants access to the content and resources specified during the event registration process.\n\nCertain materials, recordings, resources, or bonus content may have separate access terms, availability periods, or participation requirements. Access details will be communicated through official SPED Summit channels." },
      { heading: "Professional Development Certificates", body: "SPED Summit may provide professional development certificates for eligible participants who meet the stated completion requirements.\n\nCertificate eligibility, requirements, and availability may vary by session. SPED Summit reserves the right to verify participation before issuing certificates." },
      { heading: "Intellectual Property", body: "All content provided through SPED Summit, including presentations, videos, graphics, documents, logos, website content, and educational materials, is protected by intellectual property laws.\n\nUnless specifically permitted, users may not copy, reproduce, distribute, sell, modify, publish, or commercially use summit content without prior written permission from the content owner or SPED Summit." },
      { heading: "Speaker Content", body: "Session presentations, handouts, and resources remain the intellectual property of their respective speakers unless otherwise stated.\n\nAttendees may view and use materials for personal educational purposes but may not redistribute, record, upload, or commercially share speaker content without permission." },
      { heading: "Acceptable Use", body: "We strive to maintain a professional, respectful, and inclusive learning environment.\n\nWhen using SPED Summit services, you agree not to: violate any applicable laws or regulations, misrepresent your identity, interfere with website operations, attempt unauthorized access to systems or content, share restricted event access with others, or engage in harassment, abuse, discrimination, or inappropriate conduct.\n\nWe reserve the right to restrict access to users who violate these guidelines." },
      { heading: "Third-Party Links and Resources", body: "SPED Summit may include links to external websites, speaker resources, social media accounts, educational tools, and third-party services.\n\nThese resources are provided for convenience and educational purposes. We are not responsible for the content, policies, practices, or availability of third-party websites." },
      { heading: "Educational Disclaimer", body: "The information provided during SPED Summit is intended for educational and informational purposes only.\n\nWhile presenters share professional expertise and practical strategies, attendees are responsible for exercising professional judgment and complying with their local regulations, district policies, licensing requirements, and workplace procedures." },
      { heading: "Event Changes", body: "We may occasionally make changes to speakers, schedules, session topics, event dates, website features, or other aspects of the summit.\n\nWhile we make every effort to communicate important updates promptly, SPED Summit reserves the right to modify event details when necessary." },
      { heading: "Limitation of Liability", body: "SPED Summit strives to provide a high-quality experience; however, we cannot guarantee uninterrupted access to our website, services, or event content.\n\nTo the fullest extent permitted by law, SPED Summit shall not be liable for any indirect, incidental, consequential, or special damages arising from the use of our website, services, or event materials." },
      { heading: "Indemnification", body: "By participating in SPED Summit, you agree to indemnify and hold harmless SPED Summit, its organizers, team members, partners, and affiliates from claims, liabilities, damages, or expenses arising from your misuse of the website or violation of these Terms.\n\nThis provision helps protect the summit and its stakeholders from improper use of the platform." },
      { heading: "Privacy", body: "Your use of SPED Summit is also governed by our Privacy Policy.\n\nWe encourage all users to review the Privacy Policy to understand how personal information is collected, used, and protected." },
      { heading: "Termination of Access", body: "SPED Summit reserves the right to suspend or terminate access to its services at any time if a user violates these Terms or engages in activities that may harm the summit, its participants, or its community.\n\nSuch actions may be taken without prior notice when necessary to protect the integrity of the event." },
      { heading: "Changes to These Terms", body: "We may update these Terms of Service periodically to reflect changes in our services, legal requirements, or operational practices.\n\nAny updates will be posted on this page along with a revised \"Last Updated\" date. Continued use of the website after updates constitutes acceptance of the revised Terms." },
      { heading: "Contact Us", body: "If you have any questions regarding these Terms of Service, please contact us:\n\nEmail: support@spedsummit.com\n\nThank you for being part of the SPED Summit community and helping us create a positive, professional learning experience for educators and support professionals worldwide." },
    ],
  },
};

function PrivacyPolicyPage({ onBack }) {
  const content = LEGAL_CONTENT.privacy;
  const returnLabel = sessionStorage.getItem("legalReturnTo") === "dashboard" ? "Dashboard" : "Home";
  return (
    <div style={{ minHeight:"100vh", background:"#fafafa", fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif" }}>
      {/* Header */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e5e7eb", padding:"14px 24px", position:"sticky", top:0, zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"#9ca3af" }}>
          <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, color:"#6b7280", padding:0, fontFamily:"inherit" }}
            onMouseEnter={e=>e.currentTarget.style.color="#111827"}
            onMouseLeave={e=>e.currentTarget.style.color="#6b7280"}>
            {returnLabel}
          </button>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          <span style={{ color:"#111827", fontWeight:600 }}>Privacy Policy</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:720, margin:"0 auto", padding:"48px 24px 80px" }}>
        <h1 style={{ fontSize:32, fontWeight:900, color:"#111827", margin:"0 0 8px", letterSpacing:-1 }}>Privacy Policy</h1>
        <p style={{ fontSize:13, color:"#9ca3af", margin:"0 0 32px" }}>Last updated: {content.lastUpdated || "June 2026"}</p>
        <p style={{ fontSize:15, color:"#5D636F", lineHeight:1.8, margin:"0 0 40px" }}>{content.intro}</p>
        {content.sections.map((s, i) => (
          <div key={i} style={{ marginBottom:32 }}>
            <h2 style={{ fontSize:18, fontWeight:800, color:"#111827", margin:"0 0 12px" }}>{s.heading}</h2>
            <p style={{ fontSize:15, color:"#5D636F", lineHeight:1.8, margin:0, whiteSpace:"pre-line" }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TermsOfServicePage({ onBack }) {
  const content = LEGAL_CONTENT.tos;
  const returnLabel = sessionStorage.getItem("legalReturnTo") === "dashboard" ? "Dashboard" : "Home";
  return (
    <div style={{ minHeight:"100vh", background:"#fafafa", fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif" }}>
      <div style={{ background:"#fff", borderBottom:"1px solid #e5e7eb", padding:"14px 24px", position:"sticky", top:0, zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"#9ca3af" }}>
          <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, color:"#6b7280", padding:0, fontFamily:"inherit" }}
            onMouseEnter={e=>e.currentTarget.style.color="#111827"}
            onMouseLeave={e=>e.currentTarget.style.color="#6b7280"}>
            {returnLabel}
          </button>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          <span style={{ color:"#111827", fontWeight:600 }}>Terms of Service</span>
        </div>
      </div>
      <div style={{ maxWidth:720, margin:"0 auto", padding:"48px 24px 80px" }}>
        <h1 style={{ fontSize:32, fontWeight:900, color:"#111827", margin:"0 0 8px", letterSpacing:-1 }}>Terms of Service</h1>
        <p style={{ fontSize:13, color:"#9ca3af", margin:"0 0 32px" }}>Last updated: {content.lastUpdated}</p>
        <p style={{ fontSize:15, color:"#5D636F", lineHeight:1.8, margin:"0 0 40px", whiteSpace:"pre-line" }}>{content.intro}</p>
        {content.sections.map((s, i) => (
          <div key={i} style={{ marginBottom:32 }}>
            <h2 style={{ fontSize:18, fontWeight:800, color:"#111827", margin:"0 0 12px" }}>{s.heading}</h2>
            <p style={{ fontSize:15, color:"#5D636F", lineHeight:1.8, margin:0, whiteSpace:"pre-line" }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LegalModal({ type, onClose }) {
  const content = LEGAL_CONTENT[type];
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:3000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:600, maxHeight:"80vh", display:"flex", flexDirection:"column", boxShadow:"0 20px 60px rgba(0,0,0,0.25)" }}
        onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 24px", borderBottom:"1px solid #e5e7eb", flexShrink:0 }}>
          <div style={{ fontWeight:800, fontSize:18, color:"#181c32" }}>{content.title}</div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, border:"1px solid #e5e7eb", background:"#f9fafb", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="x" size={16} color="#5D636F"/>
          </button>
        </div>
        {/* Body */}
        <div style={{ overflowY:"auto", padding:"20px 24px 28px" }}>
          <p style={{ fontSize:12, color:"#707685", marginTop:0, marginBottom:16 }}>Last updated: {content.lastUpdated || "June 2026"}</p>
          {content.intro && <p style={{ fontSize:14, color:"#5D636F", lineHeight:1.7, marginTop:0, marginBottom:20 }}>{content.intro}</p>}
          {content.sections.map((s,i) => (
            <div key={i} style={{ marginBottom:18 }}>
              <div style={{ fontWeight:700, fontSize:14, color:"#111827", marginBottom:6 }}>{s.heading}</div>
              <p style={{ fontSize:14, color:"#5D636F", lineHeight:1.7, margin:0, whiteSpace:"pre-line" }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PasswordResetModal({ onClose, toast }) {
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 8) { toast({ type:"error", message:"Password must be at least 8 characters." }); return; }
    if (password !== confirm) { toast({ type:"error", message:"Passwords do not match." }); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { toast({ type:"error", message: error.message }); return; }
    setDone(true);
    toast({ type:"success", title:"Password updated!", message:"You can now sign in with your new password." });
    setTimeout(() => onClose(), 2000);
  }

  const inp = { width:"100%", padding:"10px 14px", border:"1px solid #e2e8f0", borderRadius:8, fontSize:14, color:"#0f172a", outline:"none", boxSizing:"border-box", background:"#fff", fontFamily:"inherit" };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(15,23,42,0.55)", padding:20 }}>
      <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:400, padding:"32px", boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }}>
        <img src="/Container.png" alt="SPED Summit" style={{ height:20, display:"block", marginBottom:24 }}/>
        {done ? (
          <div style={{ textAlign:"center", padding:"16px 0" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>✓</div>
            <div style={{ fontSize:18, fontWeight:800, color:"#0f172a" }}>Password updated!</div>
            <div style={{ fontSize:14, color:"#64748b", marginTop:6 }}>Redirecting…</div>
          </div>
        ) : (
          <>
            <h2 style={{ margin:"0 0 6px", fontSize:20, fontWeight:800, color:"#0f172a" }}>Set new password</h2>
            <p style={{ margin:"0 0 20px", fontSize:13, color:"#64748b" }}>Choose a new password for your account.</p>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#2B2E33", marginBottom:5 }}>New Password</label>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min. 8 characters" required style={inp}
                  onFocus={e=>e.target.style.borderColor="#6490E8"} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#2B2E33", marginBottom:5 }}>Confirm Password</label>
                <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Repeat new password" required style={inp}
                  onFocus={e=>e.target.style.borderColor="#6490E8"} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
              </div>
              <button type="submit" disabled={loading}
                style={{ width:"100%", padding:"12px", borderRadius:8, border:"none", background:"#6490E8", color:"#fff", fontSize:14, fontWeight:700, cursor: loading?"not-allowed":"pointer", opacity: loading?0.7:1 }}>
                {loading ? "Updating…" : "Update Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function AuthModal({ onClose, onLogin, defaultStep = "user-auth", defaultMode = "signin", noOverlay = false }) {
  // step: "role-select" | "user-auth" | "forgot-password"
  const [step,       setStep]      = useState(defaultStep);
  const [mode,       setMode]      = useState(defaultMode);
  const [email,      setEmail]     = useState("");
  const [password,   setPassword]  = useState("");
  const [firstName,  setFirstName] = useState("");
  const [lastName,   setLastName]  = useState("");
  const [keepSigned, setKeepSigned]= useState(true);
  const [legalModal, setLegalModal]= useState(null);
  const [resetSent,  setResetSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    sessionStorage.removeItem("loggedOut"); // clear before OAuth redirect
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      console.error("Google login error:", error.message);
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setAuthLoading(true);
    setAuthError("");
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { first_name: firstName.trim(), last_name: lastName.trim(), full_name: `${firstName.trim()} ${lastName.trim()}`.trim() } },
        });
        if (error) { setAuthError(error.message); return; }
        setAuthError("✓ Check your email to confirm your account, then sign in.");
        setMode("signin");
        setPassword("");
      } else {
        sessionStorage.removeItem("loggedOut"); // clear before sign-in so SIGNED_IN event isn't blocked
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) { setAuthError(error.message); return; }
        onClose();
        onLogin("user");
      }
    } finally {
      setAuthLoading(false);
    }
  }

  const inp = {
    width:"100%", padding:"10px 14px", border:"1px solid #e2e8f0", borderRadius:8,
    fontSize:14, color:"#0f172a", outline:"none", boxSizing:"border-box",
    background:"#fff", fontFamily:"inherit", transition:"border-color .15s",
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", background: noOverlay ? "transparent" : "rgba(15,23,42,0.55)", padding:20 }}>
      <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:420, position:"relative", boxShadow:"0 20px 60px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.8) inset" }}>

        {/* ── ROLE SELECT ── */}
        {step === "role-select" && (
          <div style={{ padding:"32px 32px 28px" }}>
            {/* Logo + close row */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
              <img src="/Container.png" alt="SPED Summit" style={{ height:20, display:"block" }}/>
              <button onClick={onClose} style={{ width:28, height:28, borderRadius:7, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon name="x" size={13} color="#64748b"/>
              </button>
            </div>
            <div style={{ marginBottom:16 }}>
              <h2 style={{ margin:"0 0 3px", fontSize:20, fontWeight:800, color:"#0f172a", letterSpacing:"-0.4px" }}>Welcome back</h2>
              <p style={{ margin:0, fontSize:13, color:"#64748b" }}>Choose how you'd like to continue</p>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <button onClick={() => { setStep("user-auth"); setMode("signup"); }}
                style={{ width:"100%", padding:"14px 18px", borderRadius:10, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", textAlign:"left", fontFamily:"inherit", transition:"all .15s" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor="#2563eb"; e.currentTarget.style.background="#f8faff"; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor="#e2e8f0"; e.currentTarget.style.background="#fff"; }}>
                <div style={{ fontSize:14, fontWeight:700, color:"#0f172a" }}>Continue as User</div>
                <div style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>Create a new learner account</div>
              </button>

            </div>

            <p style={{ textAlign:"center", fontSize:12, color:"#94a3b8", margin:"24px 0 0", lineHeight:1.6 }}>
              By continuing you agree to our{" "}
              <span onClick={()=>setLegalModal("terms")} style={{ color:"#2563eb", cursor:"pointer", fontWeight:600 }}>Terms</span>
              {" "}and{" "}
              <span onClick={()=>setLegalModal("privacy")} style={{ color:"#2563eb", cursor:"pointer", fontWeight:600 }}>Privacy Policy</span>
            </p>
          </div>
        )}

        {/* ── FORGOT PASSWORD ── */}
        {step === "forgot-password" && (
          <div style={{ padding:"24px 32px 28px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
              <img src="/Container.png" alt="SPED Summit" style={{ height:20, display:"block" }}/>
              <button onClick={onClose} style={{ width:28, height:28, borderRadius:7, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon name="x" size={13} color="#64748b"/>
              </button>
            </div>
            {!resetSent ? (
              <>
                <h2 style={{ margin:"0 0 6px", fontSize:18, fontWeight:800, color:"#0f172a" }}>Reset your password</h2>
                <p style={{ margin:"0 0 20px", fontSize:13, color:"#94a3b8" }}>Enter your email and we'll send you a reset link.</p>
                <form onSubmit={async e => { e.preventDefault(); await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin }); setResetSent(true); }}>
                  <div style={{ marginBottom:16 }}>
                    <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#2B2E33", marginBottom:5 }}>Email</label>
                    <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Work Email" type="email" required style={{ width:"100%", padding:"10px 14px", border:"1px solid #e2e8f0", borderRadius:8, fontSize:14, color:"#0f172a", outline:"none", boxSizing:"border-box", background:"#fff", fontFamily:"inherit", transition:"border-color .15s" }}
                      onFocus={e=>e.target.style.borderColor="#6490E8"} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
                  </div>
                  <button type="submit"
                    style={{ width:"100%", padding:"12px", borderRadius:8, border:"none", background:"#6490E8", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit", marginBottom:12 }}
                    onMouseEnter={e=>e.currentTarget.style.background="#4f7de0"}
                    onMouseLeave={e=>e.currentTarget.style.background="#6490E8"}>
                    Send Reset Link
                  </button>
                  <button type="button" onClick={()=>{ setStep("user-auth"); }}
                    style={{ width:"100%", padding:"12px", borderRadius:8, border:"1px solid #e2e8f0", background:"#fff", color:"#64748b", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}
                    onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
                    onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                    Back to Sign In
                  </button>
                </form>
              </>
            ) : (
              <>
                <div style={{ textAlign:"center", padding:"16px 0 8px" }}>
                  <div style={{ width:56, height:56, borderRadius:"50%", background:"#f0fdf4", border:"1px solid #bbf7d0", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                    <Icon name="check-circle" size={28} color="#16a34a"/>
                  </div>
                  <h2 style={{ margin:"0 0 8px", fontSize:18, fontWeight:800, color:"#0f172a" }}>Check your email</h2>
                  <p style={{ margin:"0 0 24px", fontSize:13, color:"#94a3b8", lineHeight:1.6 }}>We sent a password reset link to <strong style={{ color:"#0f172a" }}>{email}</strong>. Check your inbox and follow the instructions.</p>
                  <button onClick={()=>{ setStep("user-auth"); setMode("signin"); setResetSent(false); }}
                    style={{ width:"100%", padding:"12px", borderRadius:8, border:"1px solid #e2e8f0", background:"#fff", color:"#64748b", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}
                    onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
                    onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                    Back to Sign In
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── AUTH FORM ── */}
        {step !== "role-select" && step !== "forgot-password" && (
          <>

            <div style={{ padding: "24px 32px 28px" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
                <img src="/Container.png" alt="SPED Summit" style={{ height:20, display:"block" }}/>
                <button onClick={onClose} style={{ width:28, height:28, borderRadius:7, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Icon name="x" size={13} color="#64748b"/>
                </button>
              </div>

              <h2 style={{ margin:"0 0 6px", fontSize:18, fontWeight:800, color:"#0f172a" }}>
                {mode === "signup" ? "Create your account" : "Welcome back"}
              </h2>
              <p style={{ margin:"0 0 20px", fontSize:13, color:"#94a3b8" }}>
                {mode === "signup" ? "Join thousands of SPED educators today." : "Sign in to access your account."}
              </p>

              {/* Sign in / Sign up toggle */}
              <div style={{ display:"flex", background:"#f1f5f9", borderRadius:8, padding:3, marginBottom:20 }}>
                {["signup","signin"].map(m => (
                  <button key={m} onClick={()=>{ setMode(m); setAuthError(""); }}
                    style={{ flex:1, padding:"7px 0", borderRadius:6, border:"none", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", transition:"all .15s",
                      background: mode===m ? "#fff" : "transparent",
                      color: mode===m ? "#0f172a" : "#94a3b8",
                      boxShadow: mode===m ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                    }}>
                    {m === "signup" ? "Create Account" : "Sign In"}
                  </button>
                ))}
              </div>

              {/* Google login */}
              <>
                <button onClick={handleGoogleLogin} disabled={googleLoading}
                  style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:10, padding:"11px 16px", border:"1px solid #e2e8f0", borderRadius:8, background:"#fff", fontSize:14, fontWeight:500, color:"#0f172a", cursor:googleLoading?"not-allowed":"pointer", marginBottom:16, fontFamily:"inherit", transition:"border-color .15s", opacity:googleLoading?0.7:1 }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="#6490E8"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor="#e2e8f0"}>
                  <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-3.59-13.46-8.71l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
                  {googleLoading ? "Redirecting to Google…" : mode === "signup" ? "Sign up with Google" : "Continue with Google"}
                </button>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                  <div style={{ flex:1, height:1, background:"#f1f5f9" }}/>
                  <span style={{ fontSize:12, color:"#94a3b8", fontWeight:500 }}>or</span>
                  <div style={{ flex:1, height:1, background:"#f1f5f9" }}/>
                </div>
              </>

              <form onSubmit={handleSubmit}>
                {/* Name fields — sign up only */}
                {mode === "signup" && (
                  <div style={{ display:"flex", gap:10, marginBottom:12 }}>
                    <div style={{ flex:1 }}>
                      <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#2B2E33", marginBottom:5 }}>First Name</label>
                      <input value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="Jane" type="text" required style={inp}
                        onFocus={e=>e.target.style.borderColor="#6490E8"} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
                    </div>
                    <div style={{ flex:1 }}>
                      <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#2B2E33", marginBottom:5 }}>Last Name</label>
                      <input value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Smith" type="text" required style={inp}
                        onFocus={e=>e.target.style.borderColor="#6490E8"} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
                    </div>
                  </div>
                )}
                <div style={{ marginBottom:12 }}>
                  <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#2B2E33", marginBottom:5 }}>Email</label>
                  <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Work Email" type="email" required style={inp}
                    onFocus={e=>e.target.style.borderColor="#6490E8"} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#2B2E33", marginBottom:5 }}>Password</label>
                  <div style={{ position:"relative" }}>
                    <input value={password} onChange={e=>setPassword(e.target.value)} placeholder={mode === "signup" ? "Create a password" : "Enter your password"} type={showPassword ? "text" : "password"} required style={{ ...inp, paddingRight:40 }}
                      onFocus={e=>e.target.style.borderColor="#6490E8"} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
                    <button type="button" onClick={()=>setShowPassword(v=>!v)}
                      style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", padding:0, display:"flex", alignItems:"center", color:"#94a3b8" }}>
                      {showPassword
                        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                </div>
                {authError && (
                  <div style={{ marginBottom:12, padding:"10px 12px", borderRadius:8, background: authError.startsWith("✓") ? "#f0fdf4" : "#fef2f2", border:`1px solid ${authError.startsWith("✓") ? "#bbf7d0" : "#fecaca"}`, fontSize:13, color: authError.startsWith("✓") ? "#16a34a" : "#dc2626", lineHeight:1.5 }}>
                    {authError}
                  </div>
                )}
                <button type="submit" disabled={authLoading}
                  style={{ width:"100%", padding:"12px", borderRadius:8, border:"none", background: authLoading ? "#a0b8f0" : "#6490E8", color:"#fff", fontSize:14, fontWeight:700, cursor: authLoading ? "not-allowed" : "pointer", fontFamily:"inherit", transition:"background .15s" }}
                  onMouseEnter={e=>{ if (!authLoading) e.currentTarget.style.background="#4f7de0"; }}
                  onMouseLeave={e=>{ if (!authLoading) e.currentTarget.style.background="#6490E8"; }}>
                  {authLoading ? "Please wait…" : mode === "signup" ? "Create Account" : "Sign In"}
                </button>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:12 }}>
                  <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
                    <input type="checkbox" checked={keepSigned} onChange={e=>setKeepSigned(e.target.checked)} style={{ width:14, height:14, accentColor:"#6490E8", cursor:"pointer" }}/>
                    <span style={{ fontSize:13, color:"#2B2E33" }}>Keep me signed in</span>
                  </label>
                  {mode === "signin" && <span onClick={()=>setStep("forgot-password")} style={{ fontSize:13, color:"#6490E8", cursor:"pointer", fontWeight:500, textDecoration:"underline" }}>Forgot password?</span>}
                </div>
              </form>

              <p style={{ textAlign:"center", fontSize:12, color:"#94a3b8", margin:"20px 0 0", lineHeight:1.6 }}>
                {new Date().getFullYear()} All Rights Reserved.{" "}
                <span onClick={()=>setLegalModal("privacy")} style={{ color:"#6490E8", cursor:"pointer" }}>Privacy</span>
                {" "}and{" "}
                <span onClick={()=>setLegalModal("terms")} style={{ color:"#6490E8", cursor:"pointer" }}>Terms</span>.
              </p>
            </div>
          </>
        )}
      </div>
      {legalModal && <LegalModal type={legalModal} onClose={()=>setLegalModal(null)}/>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LANDING PAGE
───────────────────────────────────────────────────────────────────────────── */
function SessionPublicPage({ session, onBack, onRegister, registerLabel, registered = false }) {
  const [collapsedSections, setCollapsedSections] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);

  function handleRegister() {
    onRegister && onRegister();
  }

  // Countdown from session.availableFrom if set
  const countdownTarget = session.availableFrom ? new Date(session.availableFrom).getTime() : null;
  const countdownLabel  = useCountdown(countdownTarget || 0);

  const pageRef = useRef(null);
  useEffect(() => {
    if (pageRef.current) {
      // Scroll the nearest scrollable ancestor to the top
      let el = pageRef.current.parentElement;
      while (el) {
        if (el.scrollTop > 0) { el.scrollTop = 0; break; }
        el = el.parentElement;
      }
    }
    window.scrollTo(0, 0);
  }, []);
  const gradients = ["linear-gradient(135deg,#1e3a5f,#6490E8)","linear-gradient(135deg,#1a3060,#4a77d4)","linear-gradient(135deg,#162850,#3b6fd4)","linear-gradient(135deg,#1c3566,#5580e8)","linear-gradient(135deg,#152d5a,#6490E8)"];
  const si = (session.id - 1) % gradients.length;

  // Group lessons into sections
  const sections = [];
  let cur = null;
  (session.lessons || []).forEach((l, i) => {
    if (l.sectionTitle) { cur = { title: l.sectionTitle, lessons:[] }; sections.push(cur); }
    else if (!cur) { cur = { title:"Introduction", lessons:[] }; sections.push(cur); }
    cur.lessons.push({ ...l, _index:i });
  });

  const totalVideos = session.lessons.filter(l=>l.type==="video").length;
  const totalQuizzes = session.lessons.filter(l=>l.type==="quiz").length;
  const sectionRes = SESSION_RESOURCES[session.id] || {};
  const totalResources = Object.values(sectionRes).reduce((n,arr)=>n+arr.length,0);

  return (
    <div ref={pageRef} style={{ background:"#FEF5EC", fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif" }}>
      <style>{`
        @media(max-width:680px){
          .spp-nav { padding:0 16px !important; }
          .spp-hero { padding:28px 16px 32px !important; }
          .spp-hero h1 { font-size:24px !important; }
          .spp-hero-stats { gap:18px !important; }
          .spp-body { padding:20px 16px !important; grid-template-columns:1fr !important; }
          .spp-sticky-card { position:static !important; margin-bottom:24px; }
          .spp-body-grid { display:flex !important; flex-direction:column-reverse; }
          .spp-rating-summary { flex-direction:column !important; gap:16px !important; align-items:stretch !important; }
          .spp-rating-big { text-align:center; display:flex; flex-direction:column; align-items:center; }
          .spp-preview-cta { flex-direction:column !important; gap:12px !important; }
          .spp-preview-cta button { width:100% !important; }
          .spp-instructor-row { align-items:flex-start !important; }
        }
      `}</style>

      {/* Preview Player Modal */}
      {previewOpen && (() => {
        const firstLesson = session.lessons?.find(l => l.type !== "quiz") || session.lessons?.[0];
        return (
          <div style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(0,0,0,0.88)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
            {/* Close */}
            <button onClick={() => setPreviewOpen(false)}
              style={{ position:"absolute", top:20, right:24, background:"rgba(255,255,255,0.1)", border:"none", borderRadius:"50%", width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#fff" }}>
              <Icon name="x" size={18} color="#fff"/>
            </button>

            {/* Player area */}
            <div style={{ width:"100%", maxWidth:780, padding:"0 24px" }}>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginBottom:8, letterSpacing:.5 }}>FREE PREVIEW</div>
              <div style={{ fontSize:18, fontWeight:700, color:"#fff", marginBottom:20 }}>{firstLesson?.title}</div>

              {/* Video placeholder */}
              <div style={{ width:"100%", aspectRatio:"16/9", background:gradients[si], borderRadius:12, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.3)" }}/>
                <div style={{ position:"relative", zIndex:1, width:64, height:64, borderRadius:"50%", background:"rgba(255,255,255,0.15)", border:"2px solid rgba(255,255,255,0.4)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name="play" size={28} color="#fff"/>
                </div>
                <div style={{ position:"relative", zIndex:1, marginTop:14, fontSize:14, color:"rgba(255,255,255,0.7)" }}>{firstLesson?.duration}</div>
              </div>

              {/* Register CTA */}
              <div className="spp-preview-cta" style={{ marginTop:20, padding:"20px 24px", background:"rgba(255,255,255,0.06)", borderRadius:12, border:"1px solid rgba(255,255,255,0.12)", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}>
                <div>
                  <div style={{ fontSize:16, fontWeight:700, color:"#fff", marginBottom:4 }}>Enjoying the preview?</div>
                  <div style={{ fontSize:14, color:"rgba(255,255,255,0.6)" }}>Register to unlock all {session.lessons?.length} lessons in this course.</div>
                </div>
                <button onClick={() => { setPreviewOpen(false); handleRegister(); }}
                  style={{ flexShrink:0, background:"#6490E8", border:"none", borderRadius:10, padding:"12px 24px", fontSize:14, fontWeight:700, color:"#fff", cursor:"pointer", whiteSpace:"nowrap" }}>
                  {registerLabel || "Register"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Nav */}
      <nav className="spp-nav" style={{ position:"sticky", top:0, zIndex:100, background:"rgba(254,245,236,0.95)", backdropFilter:"blur(8px)", borderBottom:"1px solid #f0e8df", padding:"0 48px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", cursor:"pointer" }} onClick={onBack}>
          <img src="/Container.png" alt="SPED Summit" style={{ height:28, width:"auto", display:"block" }}/>
        </div>
        {registered ? (
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 18px", background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, fontSize:14, fontWeight:700, color:"#15803d" }}>
            Registered
          </div>
        ) : (
          <button onClick={handleRegister}
            style={{ padding:"9px 22px", background:"#6490E8", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}
            onMouseEnter={e=>e.currentTarget.style.background="#4a77d4"} onMouseLeave={e=>e.currentTarget.style.background="#6490E8"}>
            {registerLabel || "Register"}
          </button>
        )}
      </nav>

      {/* Hero banner — full width */}
      <div className="spp-hero" style={{ background:gradients[si], padding:"40px 48px 48px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          {/* Breadcrumbs */}
          <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:4, marginBottom:20, fontSize:14, fontWeight:500, color:"rgba(255,255,255,0.65)" }}>
            {/* SPED Summit */}
            <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", padding:0, fontSize:14, fontWeight:500, color:"rgba(255,255,255,0.65)" }}
              onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.65)"}>
              SPED Summit
            </button>
            {/* Separator */}
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="m14.413 10.663-6.25 6.25a.939.939 0 1 1-1.328-1.328L12.42 10 6.836 4.413a.939.939 0 1 1 1.328-1.328l6.25 6.25a.94.94 0 0 1-.001 1.328" fill="rgba(255,255,255,0.35)"/>
            </svg>
            {/* Current page */}
            <span style={{ color:"#fff", fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:420 }}>
              {session.title.length > 52 ? session.title.slice(0,52)+"…" : session.title}
            </span>
          </div>

          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.18)", borderRadius:99, padding:"4px 12px", fontSize:12, fontWeight:700, color:"#fff", letterSpacing:.5, marginBottom:16 }}>
            {session.category}
          </div>
          <h1 className="spp-hero-h1" style={{ margin:"0 0 14px", fontSize:34, fontWeight:900, color:"#fff", lineHeight:1.2, maxWidth:680 }}>{session.title}</h1>
          <p style={{ margin:"0 0 20px", fontSize:14, color:"rgba(255,255,255,0.8)", lineHeight:1.7, maxWidth:600 }}>{session.description}</p>
          {/* Stats */}
          <div className="spp-hero-stats" style={{ display:"flex", gap:32, alignItems:"center", marginBottom:20, flexWrap:"wrap" }}>
            {[
              { value:"4.8", sub:"3,148 ratings", accent:"#ffc700", suffix:<Icon name="star" size={14} color="#ffc700"/> },
              { value:"1,240", sub:"Students", accent:"#fff", suffix:null },
              { value:session.duration, sub:"Total", accent:"#fff", suffix:null },
            ].map((s,i) => (
              <div key={i} style={{ display:"flex", flexDirection:"column" }}>
                <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:20, fontWeight:900, color:s.accent, lineHeight:1 }}>
                  {s.value}{s.suffix && <span style={{ marginLeft:2 }}>{s.suffix}</span>}
                </div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.6)", marginTop:3 }}>{s.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {/* Instructor profile image */}
            <div style={{ width:36, height:36, borderRadius:"50%", flexShrink:0, border:"2px solid rgba(255,255,255,0.5)", overflow:"hidden", background:"linear-gradient(135deg,rgba(255,255,255,0.3),rgba(255,255,255,0.1))", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 12px rgba(0,0,0,0.2)" }}>
              <span style={{ fontSize:13, fontWeight:900, color:"#fff", letterSpacing:-0.5 }}>
                {session.instructor?.split(" ").map(w=>w[0]).slice(0,2).join("")}
              </span>
            </div>
            <div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.6)", marginBottom:2 }}>Instructor</div>
              <div style={{ fontSize:14, fontWeight:700, color:"#fff" }}>{session.instructor}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="spp-body" style={{ maxWidth:1100, margin:"0 auto", padding:"40px 48px", display:"grid", gridTemplateColumns:"1fr 340px", gap:40, alignItems:"start" }}>

        {/* Left: about + curriculum */}
        <div>
          {/* About instructor */}
          <div style={{ marginBottom:40 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#9a9bb0", letterSpacing:1, marginBottom:18 }}>ABOUT THE INSTRUCTOR</div>
            {/* Instructor header row */}
            <div className="spp-instructor-row" style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
              <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#1e3a5f,#6490E8)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ fontSize:16, fontWeight:900, color:"#fff", letterSpacing:-0.5 }}>
                  {session.instructor?.split(" ").map(w=>w[0]).slice(0,2).join("")}
                </span>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:800, fontSize:16, color:"#181c32", lineHeight:1.2 }}>{session.instructor}</div>
                <div style={{ fontSize:12, color:"#9a9bb0", marginTop:2, marginBottom:8 }}>Special Education Specialist</div>
                {/* Social handles — now inside name col so they wrap below name on mobile */}
                <div className="spp-social-btns" style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {[
                  { label:"LinkedIn",
                    svg:<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                  { label:"Twitter",
                    svg:<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.732-8.855L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                  { label:"Website",
                    svg:<svg width="11" height="11" viewBox="0 0 256 256" fill="currentColor"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm87.63,96H175.8c-1.42-28.1-10.6-54.2-25.8-74.11A88.17,88.17,0,0,1,215.63,120ZM128,216c-19.27,0-37.07-28.68-39.73-72h79.46C165.07,187.32,147.27,216,128,216Zm-39.73-88C90.93,84.68,108.73,56,128,56s37.07,28.68,39.73,72ZM105.93,45.89C90.73,65.8,81.55,91.9,80.13,120H40.37A88.17,88.17,0,0,1,105.93,45.89ZM40.37,136H80.13c1.42,28.1,10.6,54.2,25.8,74.11A88.17,88.17,0,0,1,40.37,136Zm109.77,74.11c15.2-19.91,24.38-46,25.8-74.11h39.76A88.17,88.17,0,0,1,150.14,210.11Z"/></svg> },
                ].map(s => (
                  <button key={s.label}
                    style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:600, color:"#5e6278", background:"#fff", border:"1px solid #e4e6ef", borderRadius:8, padding:"5px 12px", cursor:"pointer", transition:"background .12s" }}
                    onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"}
                    onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                    <span style={{ color:"#9a9bb0", display:"flex", alignItems:"center" }}>{s.svg}</span>{s.label}
                  </button>
                ))}
              </div>
              </div>{/* end name col */}
            </div>{/* end instructor row */}
            {/* Bio paragraphs */}
            <div style={{ fontSize:14, color:"#3d3d4e", lineHeight:1.75 }}>
              {(session.instructorBio || "Expert instructor at SPED Summit with years of experience in special education.").split("\n\n").map((para, i) => (
                <p key={i} style={{ margin:"0 0 12px" }}>{para}</p>
              ))}
            </div>
            <InstructorSocialIcons instr={{ linkedin: session.instructorLinkedin, instagram: session.instructorInstagram, facebook: session.instructorFacebook, website: session.instructorWebsite, podcast: session.instructorPodcast }} T={{ border:"#e4e6ef", bg:"#f9fafb" }}/>
          </div>

          {/* Curriculum */}
          <div style={{ fontSize:12, fontWeight:700, color:"#181c32", letterSpacing:.5, marginBottom:16 }}>COURSE CURRICULUM</div>
          <div style={{ fontSize:14, color:"#5e6278", marginBottom:20 }}>
            {sections.length} sections · {session.lessons.length} lessons · {session.duration} total
          </div>
          <div style={{ border:"1px solid #f0e8df", borderRadius:14, overflow:"hidden", background:"#fff" }}>
            {sections.map((sec, si) => {
              const key = `s${si}`;
              const collapsed = collapsedSections[key];
              const secResources = (SESSION_RESOURCES[session.id] || {})[sec.title] || [];
              return (
                <div key={key} style={{ borderBottom: si < sections.length-1 ? "1px solid #f0e8df" : "none" }}>
                  {/* Section header */}
                  <button onClick={() => setCollapsedSections(s=>({...s,[key]:!s[key]}))}
                    style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", background:"#fff", border:"none", cursor:"pointer", textAlign:"left", gap:8 }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color:"#181c32" }}>{si===0?"":si+". "}{sec.title}</div>
                      <div style={{ fontSize:12, color:"#7e8299", marginTop:2 }}>
                        {sec.lessons.length} lesson{sec.lessons.length!==1?"s":""}
                        {secResources.length>0 ? ` · ${secResources.length} resource${secResources.length!==1?"s":""}` : ""}
                      </div>
                    </div>
                    <Icon name={collapsed?"caret-down":"caret-up"} size={14} color="#7e8299"/>
                  </button>
                  {!collapsed && (
                    <div>
                      {sec.lessons.map((l, li) => {
                        const isQuiz = l.type === "quiz";
                        const isFree = li === 0 && si === 0;
                        return (
                          <div key={String(l.id)} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 20px", borderTop:"1px solid #f0e8df",
                            background: "#fff" }}>
                            {/* Phosphor icon instead of plain circle */}
                            <div style={{ width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                              <Icon name={isQuiz ? "article" : "play-circle"} size={20} color={isQuiz ? "#6490E8" : "#707685"}/>
                            </div>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:14, color:"#181c32", lineHeight:1.4 }}>{l.title}</div>
                              <div style={{ fontSize:12, color: isQuiz?"#6490E8":"#707685", marginTop:2 }}>
                                {isQuiz ? `${l.questions} question${l.questions!==1?"s":""}` : <LessonDuration vimeoUrl={l.vimeoUrl || session.vimeoUrl} fallback={l.duration}/>}
                              </div>
                            </div>
                            {isFree && (
                              <span onClick={() => setPreviewOpen(true)}
                                style={{ fontSize:12, fontWeight:600, color:"#6490E8", background:"#eef3fd", borderRadius:6, padding:"2px 8px", flexShrink:0, cursor:"pointer" }}>
                                Preview
                              </span>
                            )}
                            {!isFree && <Icon name="lock" size={13} color="#d1d5db"/>}
                          </div>
                        );
                      })}
                      {secResources.map(r => {
                        const tc = r.type==="PDF"?{c:"#dc2626",b:"#fef2f2"}:r.type==="PPTX"?{c:"#ea580c",b:"#fff7ed"}:r.type==="ZIP"?{c:"#7c3aed",b:"#f5f3ff"}:{c:"#6490E8",b:"#eef3fd"};
                        const rIcon = r.type==="PDF" ? "file-pdf" : r.type==="PPTX" ? "article" : r.type==="ZIP" ? "paperclip" : "paperclip";
                        return (
                          <div key={r.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 20px", borderTop:"1px solid #f0e8df", background:"#fff" }}>
                            <div style={{ width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                              <Icon name={rIcon} size={18} color={tc.c}/>
                            </div>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:14, color:"#181c32" }}>{r.title}</div>
                              <div style={{ display:"flex", gap:6, alignItems:"center", marginTop:2 }}>
                                <span style={{ fontSize:12, fontWeight:700, color:tc.c, background:tc.b, borderRadius:4, padding:"1px 5px" }}>{r.type}</span>
                                <span style={{ fontSize:12, color:"#707685" }}>{r.size}</span>
                              </div>
                            </div>
                            <Icon name="lock" size={13} color="#d1d5db"/>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Learner Reviews ── */}
          <div style={{ marginTop:44 }}>
            <div style={{ fontSize:20, fontWeight:800, color:"#181c32", marginBottom:24 }}>Learner Reviews</div>

            {/* Rating summary */}
            <div className="spp-rating-summary" style={{ display:"flex", gap:32, alignItems:"center", marginBottom:28, padding:24, borderRadius:16, border:"1px solid #f0e8df", background:"#fff" }}>
              {/* Big number */}
              <div style={{ textAlign:"center", flexShrink:0 }}>
                <div style={{ fontSize:56, fontWeight:900, color:"#181c32", lineHeight:1 }}>4.8</div>
                <div style={{ fontSize:12, color:"#5e6278", marginTop:4 }}>out of 5</div>
                <div style={{ display:"flex", gap:2, justifyContent:"center", marginTop:6 }}>
                  {[1,2,3,4,5].map(i => (
                    <Icon key={i} name="star" size={14} color={i<=4?"#f59e0b":"#e4e6ef"}/>
                  ))}
                </div>
                <div style={{ fontSize:12, color:"#707685", marginTop:4 }}>3,148 ratings</div>
              </div>

              {/* Bars */}
              <div style={{ flex:1, display:"flex", flexDirection:"column", gap:7 }}>
                {[
                  { label:"5 star", pct:70 },
                  { label:"4 star", pct:20 },
                  { label:"3 star", pct:7  },
                  { label:"2 star", pct:2  },
                  { label:"1 star", pct:1  },
                ].map(r => (
                  <div key={r.label} style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ fontSize:12, color:"#5e6278", width:40, flexShrink:0 }}>{r.label}</div>
                    <div style={{ flex:1, height:8, borderRadius:99, background:"#e4e6ef", overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${r.pct}%`, borderRadius:99, background:"#f59e0b" }}/>
                    </div>
                    <div style={{ fontSize:12, color:"#5e6278", width:32, textAlign:"right", flexShrink:0 }}>{r.pct < 1 ? "<1%" : `${r.pct}%`}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Review cards */}
            {[
              { name:"April M.",            role:"SPED Educator", rating:5, date:"Mar 18, 2025", text:"This is, by far, the best presentation of the summit. It kept my attention the whole time." },
              { name:"Auhen Cleo Faith C.", role:"SPED Educator", rating:5, date:"Mar 10, 2025", text:"The session was highly informative and practical. The speaker presented evidence-based, neurodiversity-affirming strategies that were clearly explained and directly applicable to educational and therapeutic settings." },
              { name:"Erwin G. B.",         role:"SPED Educator", rating:5, date:"Feb 28, 2025", text:"The discussion reminded us that we cannot give our best to our students if we do not take care of ourselves first. It highlighted the value of setting healthy boundaries and preventing burnout." },
              { name:"Jea Cyrill C.",       role:"SPED Educator", rating:5, date:"Feb 14, 2025", text:"Thank you for clarifying the meaning and function of echolalia. The discussion deepened my understanding of echolalia as a communicative behavior rather than merely repetitive speech. I intend to apply the strategies presented in my own teaching practice." },
            ].map((r, i) => (
              <div key={i} style={{ padding:"20px 0", borderBottom: i < 3 ? "1px solid #f0e8df" : "none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                  <div style={{ width:40, height:40, borderRadius:"50%", background:`hsl(${i*67},60%,55%)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ fontSize:16, fontWeight:800, color:"#fff" }}>{r.name[0]}</span>
                  </div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:"#181c32" }}>{r.name}</div>
                    <div style={{ fontSize:12, color:"#707685" }}>{r.role}</div>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                  <div style={{ display:"flex", gap:2 }}>
                    {[1,2,3,4,5].map(s => (
                      <Icon key={s} name="star" size={13} color={s<=r.rating?"#f59e0b":"#e4e6ef"}/>
                    ))}
                  </div>
                  <span style={{ fontSize:12, color:"#707685" }}>{r.date}</span>
                </div>
                <div style={{ fontSize:14, color:"#2B2E33", lineHeight:1.65 }}>{r.text}</div>
                <div style={{ display:"flex", gap:16, marginTop:10 }}>
                  {["Helpful","Report"].map(action => (
                    <button key={action} style={{ background:"none", border:"none", fontSize:12, color:"#5e6278", cursor:"pointer", fontWeight:500, padding:0, display:"flex", alignItems:"center", gap:4 }}
                      onMouseEnter={e=>e.currentTarget.style.color="#181c32"} onMouseLeave={e=>e.currentTarget.style.color="#5e6278"}>
                      <Icon name={action==="Helpful"?"thumbs-up":"flag"} size={13} color="#707685"/>
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: single unified sticky card */}
        <div className="spp-sticky-card" style={{ position:"sticky", top:76 }}>
          <div style={{ border:"1px solid #f0e8df", borderRadius:16, overflow:"hidden", boxShadow:"0 4px 24px rgba(0,0,0,0.06)" }}>
            {/* Preview thumbnail */}
            <div style={{ height:150, position:"relative", overflow:"hidden" }}>
              <SessionThumb id={session.id} height={150} noPlayHover/>
            </div>
            <div style={{ padding:20 }}>
              {/* Stats */}
              <div style={{ display:"flex", gap:0, marginBottom:18, borderRadius:10, border:"1px solid #f0e8df", overflow:"hidden", background:"#fdf8f4" }}>
                {[
                  { val:"4.8", icon:<Icon name="star" size={12} color="#f59e0b"/>, sub:"ratings", valColor:"#b45309" },
                  { val:"1,240", sub:"Students", valColor:"#181c32" },
                  { val:session.duration, sub:"Total", valColor:"#181c32" },
                ].map((s,i) => (
                  <div key={i} style={{ flex:1, textAlign:"center", padding:"10px 4px", borderRight: i<2?"1px solid #f0e8df":"none" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:3, fontSize:16, fontWeight:800, color:s.valColor }}>{s.val}{s.icon}</div>
                    <div style={{ fontSize:12, color:"#707685", marginTop:2 }}>{s.sub}</div>
                  </div>
                ))}
              </div>
              {registered ? (
                <div style={{ marginBottom:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:"12px 16px", marginBottom:10 }}>
                    <div style={{ width:22, height:22, borderRadius:"50%", background:"#22c55e", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Icon name="check" size={13} color="#fff"/>
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#15803d" }}>You're registered!</div>
                      <div style={{ fontSize:12, color:"#16a34a" }}>You're all set for this session.</div>
                    </div>
                  </div>
                  {countdownTarget && countdownLabel ? (
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, fontSize:13, color:"#2B2E33", background:"#fff7ed", border:"1px solid #fed7aa", borderRadius:10, padding:"10px 16px" }}>
                      <Icon name="timer" size={14} color="#f97316"/>
                      Starting in <span style={{ fontWeight:700, color:"#f97316" }}>{countdownLabel}</span>
                    </div>
                  ) : (
                    <button onClick={onBack} style={{ width:"100%", padding:"11px 0", background:"#6490E8", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}>
                      Go to My Sessions
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <button onClick={handleRegister}
                    style={{ width:"100%", padding:"13px 0", background:"#6490E8", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:800, cursor:"pointer", marginBottom:8 }}
                    onMouseEnter={e=>e.currentTarget.style.background="#4a77d4"} onMouseLeave={e=>e.currentTarget.style.background="#6490E8"}>
                    {registerLabel || "Register"}
                  </button>
                  <div style={{ fontSize:12, textAlign:"center", color:"#707685", marginBottom:10 }}>No credit card required</div>
                </>
              )}
              <div style={{ fontSize:12, fontWeight:700, color:"#181c32", marginBottom:10 }}>This session includes:</div>
              <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                {[
                  { icon:"video",       text:`${totalVideos} video lessons` },
                  { icon:"article",     text:`${totalQuizzes} chapter quizzes` },
                  { icon:"paperclip",   text:`${totalResources} downloadable resources` },
                  { icon:"certificate", text:"Certificate of completion" },
                  { icon:"device-mobile", text:"Access on any device" },
                ].map(item => (
                  <div key={item.text} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:"#5e6278" }}>
                    <Icon name={item.icon} size={13} color="#6490E8"/>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LandingSessionCard({ s, imgSrc, onClick, availableFrom, sessionState }) {
  const [hov, setHov] = useState(false);
  const state = sessionState || "live";
  const isUpcoming = state === "upcoming";
  const isPast     = state === "past";
  const hasRec     = SESSION_AVAILABILITY[s.id]?.hasRecording;

  const availLabel = isUpcoming && availableFrom
    ? new Date(availableFrom).toLocaleString("en-US", { month:"short", day:"numeric", hour:"numeric", minute:"2-digit" })
    : null;

  const clickable = state === "live" || (isPast && hasRec);

  return (
    <div onClick={clickable ? onClick : undefined}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ borderRadius:14, overflow:"hidden", cursor: clickable ? "pointer" : "default",
               boxShadow:"0 2px 12px rgba(0,0,0,0.08)",
               opacity: isPast ? 0.78 : isUpcoming ? 0.9 : 1 }}>
      <div style={{ height:140, position:"relative", overflow:"hidden" }}>
        <img src={imgSrc} alt={s.title} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block",
          filter: (isPast || isUpcoming) ? "brightness(0.65) saturate(0.6)" : "none" }}/>
        <div style={{ position:"absolute", inset:0, background: hov && clickable ? "rgba(0,0,0,0.38)" : "rgba(0,0,0,0.18)", transition:"background .2s" }}/>

        {/* Play button — live sessions on hover */}
        {state === "live" && hov && (
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:44, height:44, borderRadius:"50%", background:"rgba(255,255,255,0.22)", backdropFilter:"blur(4px)", border:"2px solid rgba(255,255,255,0.5)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
        )}

        {/* Upcoming overlay */}
        {isUpcoming && (
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6 }}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:"rgba(255,255,255,0.18)", backdropFilter:"blur(4px)", border:"2px solid rgba(255,255,255,0.4)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div style={{ background:"rgba(0,0,0,0.6)", backdropFilter:"blur(6px)", borderRadius:20, padding:"4px 10px", fontSize:12, fontWeight:700, color:"#fff", letterSpacing:.3 }}>
              Available {availLabel}
            </div>
          </div>
        )}

        {/* Past overlay */}
        {isPast && (
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6 }}>
            <div style={{ background:"rgba(0,0,0,0.6)", backdropFilter:"blur(6px)", borderRadius:20, padding:"4px 10px", fontSize:12, fontWeight:700, letterSpacing:.3,
              color: hasRec ? "#86efac" : "#fca5a5" }}>
              {hasRec ? "▶ Watch Again" : "Recording Unavailable"}
            </div>
          </div>
        )}

        {/* Category pill */}
        <div style={{ position:"absolute", top:10, left:10, background:"rgba(0,0,0,0.45)", backdropFilter:"blur(4px)", borderRadius:6, padding:"3px 8px", fontSize:12, fontWeight:700, color:"#fff", letterSpacing:.5 }}>{s.category}</div>

        {/* State badge top-right */}
        {isPast && (
          <div style={{ position:"absolute", top:10, right:10, background:"rgba(0,0,0,0.55)", borderRadius:6, padding:"3px 8px", fontSize:12, fontWeight:700, color:"#d1d5db", letterSpacing:.5 }}>PAST SEASON</div>
        )}
      </div>

      <div style={{ background:"#fff", padding:"12px 14px" }}>
        <div style={{ fontSize:14, fontWeight:700, color:"#181c32", lineHeight:1.4, marginBottom:4, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{s.title}</div>
        <div style={{ fontSize:12, color: isPast ? "#c0c4cc" : "#a1a5b7" }}>{s.instructor} · {s.duration}</div>
      </div>
    </div>
  );
}

const DISPLAY_FONT = "'Outfit','Helvetica Neue',Helvetica,Arial,sans-serif";
const SERIF_FONT   = "'Playfair Display', Georgia, serif";
const CTA_ORANGE   = "#fe4d01";

/* ── Hero overlay: Watch card with live progress counter ── */
function WatchOverlay({ T }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    if (pct >= 100) return;
    const t = setTimeout(() => setPct(p => p + 1), 30);
    return () => clearTimeout(t);
  }, [pct]);
  const done = pct >= 100;
  return (
    <div className="animate-slide-up-overlay" style={{ opacity:0, position:"absolute", top:"50%", left:"50%", width:340, background:"#fff", borderRadius:18, padding:26, boxShadow:"0 24px 64px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.25)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
        <div className="pulse-dot" style={{ width:8, height:8, borderRadius:"50%", background: done ? "#059669" : "#ef4444" }}/>
        <span style={{ fontSize:11, fontWeight:700, color: done ? "#059669" : "#ef4444", textTransform:"uppercase", letterSpacing:.8 }}>
          {done ? "Session Complete" : "Live Now"}
        </span>
      </div>
      <div style={{ fontSize:16, fontWeight:700, color:T.text, marginBottom:5, lineHeight:1.35 }}>Mindfulness for SPED Educators</div>
      <div style={{ fontSize:13, color:T.muted, marginBottom:18 }}>Tara Roehl · SPED Wellness Institute</div>
      <div style={{ marginBottom:18 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7, fontSize:12, color:T.muted }}>
          <span>Session progress</span>
          <span style={{ fontWeight:700, color: done ? "#059669" : T.text, transition:"color .3s" }}>{pct}%</span>
        </div>
        <div style={{ height:6, background:T.hover, borderRadius:3, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, borderRadius:3, transition:"width 0.025s linear",
            background: done ? "linear-gradient(90deg,#059669,#10b981)" : "linear-gradient(90deg,#8a46ff,#e83e8c)" }}/>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        <div style={{ background:T.hover, borderRadius:10, padding:"10px 14px" }}>
          <div style={{ fontSize:11, color:T.muted, marginBottom:3 }}>Duration</div>
          <div style={{ fontSize:15, fontWeight:700, color:T.text }}>52 min</div>
        </div>
        <div style={{ background:T.hover, borderRadius:10, padding:"10px 14px" }}>
          <div style={{ fontSize:11, color:T.muted, marginBottom:3 }}>Watching</div>
          <div style={{ fontSize:15, fontWeight:700, color:T.text }}>1,204</div>
        </div>
      </div>
    </div>
  );
}

/* ── Hero overlay: Quiz card — fills to 100% then advances to cert tab ── */
function QuizOverlay({ T, onComplete }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    if (pct >= 100) {
      const done = setTimeout(onComplete, 700);
      return () => clearTimeout(done);
    }
    const t = setTimeout(() => setPct(p => p + 1), 30);
    return () => clearTimeout(t);
  }, [pct, onComplete]);
  const done = pct >= 100;
  return (
    <div className="animate-slide-up-overlay" style={{ opacity:0, position:"absolute", top:"50%", left:"50%", width:360, background:"#fff", borderRadius:18, padding:26, boxShadow:"0 24px 64px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.25)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <span style={{ fontSize:11, fontWeight:700, color: done ? "#059669" : "#8a46ff", textTransform:"uppercase", letterSpacing:.8 }}>
          {done ? "Quiz Complete!" : "Question 3 of 10"}
        </span>
        <span style={{ fontSize:13, fontWeight:600, color: done ? "#059669" : T.muted, display:"flex", alignItems:"center", gap:4 }}>
          {done
            ? <><Icon name="check-circle" size={14} color="#059669"/> Done</>
            : <><Icon name="timer" size={13} color={T.muted}/> 0:{String(Math.round((100-pct)/100*30)).padStart(2,"0")}</>
          }
        </span>
      </div>
      <div style={{ height:4, background:T.hover, borderRadius:2, overflow:"hidden", marginBottom:18 }}>
        <div style={{ height:"100%", width:`${pct}%`, borderRadius:2, transition:"width 0.02s linear",
          background: done ? "linear-gradient(90deg,#059669,#10b981)" : "linear-gradient(90deg,#8a46ff,#e83e8c)" }}/>
      </div>
      <div style={{ fontSize:15, fontWeight:600, color:T.text, marginBottom:16, lineHeight:1.45 }}>
        What does the abbreviation "IEP" stand for?
      </div>
      {[
        { label:"A", text:"Individual Education Plan",        correct:false },
        { label:"B", text:"Individualized Education Program", correct:true  },
        { label:"C", text:"Integrated Enhancement Program",   correct:false },
        { label:"D", text:"Independent Evaluation Protocol",  correct:false },
      ].map((opt,oi)=>(
        <div key={opt.label} className="stagger-in" style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 14px", borderRadius:8, marginBottom:7,
          border:`1px solid ${opt.correct ? "#8a46ff" : T.border}`,
          background: opt.correct ? "#f5f0ff" : T.bg,
          animationDelay:`${oi*0.08+0.3}s` }}>
          <span style={{ width:24, height:24, borderRadius:6, flexShrink:0, display:"inline-flex", alignItems:"center", justifyContent:"center",
            fontSize:11, fontWeight:700,
            background: opt.correct ? "#8a46ff" : T.hover,
            color:      opt.correct ? "#fff"    : T.muted }}>{opt.label}</span>
          <span style={{ fontSize:13, color: opt.correct ? "#7c3aed" : T.text, fontWeight: opt.correct ? 600 : 400 }}>{opt.text}</span>
          {opt.correct && <Icon name="check-circle" size={15} color="#8a46ff" style={{ marginLeft:"auto" }}/>}
        </div>
      ))}
    </div>
  );
}


/* ── Testimonial components defined at module level so Framer Motion never resets ── */
const V1_TESTIMONIALS = [
  { text:"This is, by far, the best presentation of the summit. It kept my attention the whole time.", name:"April M.", role:"SPED Educator", img:"" },
  { text:"The session was highly informative and practical. The speaker presented evidence-based, neurodiversity-affirming strategies that were clearly explained and directly applicable to educational and therapeutic settings.", name:"Auhen Cleo Faith C.", role:"SPED Educator", img:"" },
  { text:"The discussion reminded us that we cannot give our best to our students if we do not take care of ourselves first. It highlighted the value of setting healthy boundaries and preventing burnout.", name:"Erwin G. B.", role:"SPED Educator", img:"" },
  { text:"Thank you for clarifying the meaning and function of echolalia. The discussion deepened my understanding of echolalia as a communicative behavior rather than merely repetitive speech. I intend to apply the strategies presented in my own teaching practice.", name:"Jea Cyrill C.", role:"SPED Educator", img:"" },
  { text:"The mindfulness-based strategies and real classroom applications were especially helpful. Thank you for prioritizing both student and teacher wellness.", name:"Auhen Cleo Faith C.", role:"SPED Educator", img:"" },
  { text:"The session was valuable and inspiring, and it effectively supported professional growth in SPED practices.", name:"Jonal P. P.", role:"SPED Educator", img:"" },
  { text:"The speaker was engaging, knowledgeable, and provided practical strategies that can be applied directly in SPED settings.", name:"Rizza S. C.", role:"SPED Educator", img:"" },
  { text:"AbleSpace is a very useful tool to help me with IEP goals and assessments. It will be very helpful for creating and modifying plans according to the needs and skills of my students.", name:"Samantha Jane S. Z.", role:"SPED Educator", img:"" },
  { text:"The session was highly informative and practical. The speaker presented evidence-based, neurodiversity-affirming strategies that were clearly explained and directly applicable to educational and therapeutic settings.", name:"Auhen Cleo Faith C.", role:"SPED Educator", img:"" },
];
const V1_T_CARD_W = 320;

function V1TestiCard({ t, overrideWidth, fixedHeight }) {
  return (
    <div style={{ background:"#FEF5EC", border:"1px solid #E5E7EB", borderRadius:20, padding:24, width:overrideWidth ?? V1_T_CARD_W, height:fixedHeight ?? "auto", boxSizing:"border-box", boxShadow:"0 2px 12px rgba(0,0,0,0.03)", flexShrink:0, display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
      <p style={{ margin:"0 0 18px", fontSize:14, color:"#5D636F", lineHeight:1.7, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:5, WebkitBoxOrient:"vertical" }}>"{t.text}"</p>
      <div style={{ fontSize:14, fontWeight:700, color:"#2B2E33" }}>— {t.name}</div>
    </div>
  );
}

function V1TestiCol({ items, duration }) {
  const cls = `v1tcol-${duration}`;
  return (
    <div style={{ width:V1_T_CARD_W, flexShrink:0, overflow:"hidden" }}>
      <style>{`
        @keyframes ${cls} { from { transform: translateY(0); } to { transform: translateY(-50%); } }
        .${cls} { animation: ${cls} ${duration}s linear infinite; }
        .${cls}:hover { animation-play-state: paused; }
      `}</style>
      <div className={cls} style={{ display:"flex", flexDirection:"column" }}>
        {[0,1].map((_,pass)=>(
          <React.Fragment key={pass}>
            {items.map((t,i)=>(
              <div key={i} style={{ paddingBottom:20 }}>
                <V1TestiCard t={t}/>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

const V1_PRICING_FEATURES = [
  "Just $19/year — includes 1 month free trial",
  "Win 1 month free Ablespace Pro subscription",
  "Downloadable completion certificate",
];

const V1_PRICING_TESTI = V1_TESTIMONIALS.slice(0, 6).map((t, i) => ({
  id: i,
  name: t.name,
  role: t.role,
  content: t.text,
  rating: 5,
  avatar: t.img,
}));

function SubscribePage({ onBack, onGetStarted }) {
  return (
    <div style={{ background:"#fff", minHeight:"100%", padding:"32px 24px 64px" }}>
      <V1PricingCardOnly onGetStarted={onGetStarted} />
    </div>
  );
}

function V1PricingCardOnly({ onGetStarted, onClose, isLoggedIn = false }) {
  const [testiIdx, setTestiIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTestiIdx(p => (p + 1) % V1_PRICING_TESTI.length), 5000);
    return () => clearInterval(id);
  }, []);
  const testi = V1_PRICING_TESTI[testiIdx];
  return (
    <div style={{ fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif" }}>
      <style>{`
        .v1pco-wrap { display:flex; flex-direction:column; gap:0; }
        @media(min-width:700px){ .v1pco-wrap { flex-direction:row; } }
        .v1pco-left { flex:1; padding:36px 32px; background:#fff; display:flex; flex-direction:column; }
        .v1pco-right { flex:1; padding:36px 32px; background:#fff; border-top:1px solid #E5E7EB; display:flex; flex-direction:column; }
        @media(min-width:700px){
          .v1pco-right { border-top:none; border-left:1px solid #E5E7EB; }
          .v1pco-left { border-radius:20px 0 0 20px; }
          .v1pco-right { border-radius:0 20px 20px 0; }
        }
        @media(max-width:699px){
          .v1pco-left { border-radius:20px 20px 0 0; padding:24px 20px; }
          .v1pco-right { border-radius:0 0 20px 20px; padding:24px 20px; }
        }
      `}</style>
      <div style={{ borderRadius:20, overflow:"hidden", position:"relative" }}>
        {onClose && (
          <button onClick={onClose} aria-label="Close" className="v1pco-close-x"
            style={{ position:"absolute", top:14, right:14, zIndex:10, width:28, height:28, borderRadius:8, border:`1px solid ${C.gray200}`, background:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="x" size={14} color={C.gray500}/>
          </button>
        )}
        <style>{`.v1pco-close-x { display:flex; } @media(max-width:767px){ .v1pco-close-x { display:none !important; } }`}</style>
        <div className="v1pco-wrap">
          {/* Left */}
          <div className="v1pco-left">
            {onClose && (
              <button onClick={onClose} aria-label="Back" className="v1pco-back-btn"
                style={{ display:"none", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", color:C.gray600, fontSize:14, fontWeight:600, padding:"0 0 16px", fontFamily:"inherit" }}>
                <Icon name="arrow-left" size={16} color={C.gray600}/> Back
              </button>
            )}
            <style>{`@media(max-width:767px){ .v1pco-back-btn { display:flex !important; } }`}</style>
            <h3 style={{ margin:"0 0 8px", fontSize:22, fontWeight:800, color:"#111827", lineHeight:1.2 }}>Full Summit Access</h3>
            <p style={{ margin:"0 0 24px", fontSize:14, color:"#6B7280", lineHeight:1.6 }}>Build your next SPED skill set with this comprehensive free summit</p>
            <div style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:8 }}>
              <span style={{ fontSize:"clamp(44px,7vw,64px)", fontWeight:900, lineHeight:1, letterSpacing:-2, color:"#111827" }}>$19</span>
              <span style={{ fontSize:16, color:"#707685", marginBottom:6 }}>/year</span>
            </div>
            <div style={{ marginBottom:32, marginTop:8 }}>
              {[
                { label:"Free verified certificate included",     icon:<PhosphorIcons.Certificate size={16} color="#707685" weight="regular"/> },
                { label:"Created by educators for educators",     icon:<PhosphorIcons.Heart size={16} color="#707685" weight="regular"/> },
              ].map((b, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:13 }}>
                  {b.icon}
                  <span style={{ fontSize:14, color:"#2B2E33" }}>{b.label}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop:"auto" }}>
              <button
                onClick={onGetStarted}
                style={{ width:"100%", padding:"15px", fontSize:15, fontWeight:800, background:"#6490E8", color:"#fff", border:"none", borderRadius:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"background 0.15s, transform 0.12s" }}
                onMouseEnter={e=>{ e.currentTarget.style.background="#4f7de0"; e.currentTarget.style.transform="translateY(-1px)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="#6490E8"; e.currentTarget.style.transform="none"; }}
              >
                Start for free
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
          {/* Right */}
          <div className="v1pco-right">
            <div style={{ marginBottom:20 }}>
              <h4 style={{ margin:0, fontSize:15, fontWeight:700, color:"#111827" }}>Included Features</h4>
            </div>
            <div style={{ marginBottom:24, display:"flex", flexDirection:"column", gap:10 }}>
              {V1_PRICING_FEATURES.map((feat, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:20, height:20, borderRadius:"50%", background:"rgba(245,158,11,0.1)", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5.5l2.5 2.5 4.5-5" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span style={{ fontSize:14, color:"#2B2E33" }}>{feat}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop:"1px solid #E5E7EB", paddingTop:20, marginTop:"auto" }}>
              <AnimatePresence mode="wait">
                <motion.div key={testi.id}
                  initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
                  transition={{ duration:0.35 }}>
                  <p style={{ margin:"0 0 12px", fontSize:14, color:"#2B2E33", lineHeight:1.65, fontStyle:"italic" }}>"{testi.content}"</p>
                  <div style={{ fontSize:13, fontWeight:700, color:"#111827" }}>— {testi.name}</div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function V1PricingSection({ onGetStarted, isLoggedIn = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [testiIdx, setTestiIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTestiIdx(p => (p + 1) % V1_PRICING_TESTI.length), 5000);
    return () => clearInterval(id);
  }, []);

  const testi = V1_PRICING_TESTI[testiIdx];

  return (
    <section id="pricing" ref={ref} style={{ background:"#FEF5EC", padding:"80px 24px", borderBottom:"1px solid #E5E7EB" }}>
      <style>{`
        .v1pc-wrap { display:flex; flex-direction:column; gap:0; }
        @media(min-width:800px){ .v1pc-wrap { flex-direction:row; } }
        .v1pc-left { flex:1; padding:40px 36px; background:#FEF5EC; display:flex; flex-direction:column; }
        .v1pc-right { flex:1; padding:40px 36px; background:#FEF5EC; border-top:1px solid #E5E7EB; display:flex; flex-direction:column; }
        @media(min-width:800px){
          .v1pc-right { border-top:none; border-left:1px solid #E5E7EB; }
          .v1pc-left { border-radius:20px 0 0 20px; }
          .v1pc-right { border-radius:0 20px 20px 0; }
        }
        @media(max-width:799px){
          .v1pc-left { border-radius:20px 20px 0 0; }
          .v1pc-right { border-radius:0 0 20px 20px; }
        }
      `}</style>

      {/* Section header */}
      <div style={{ maxWidth:760, margin:"0 auto 48px", textAlign:"center" }}>
        <p style={{ margin:"0 0 12px", fontSize:13, fontWeight:700, color:"#6B7280", letterSpacing:1, textTransform:"uppercase" }}>Simple Pricing</p>
        <h2 style={{ margin:"0 0 16px", fontSize:"clamp(28px,4vw,48px)", fontWeight:900, color:"#111827", letterSpacing:-1.5, lineHeight:1.1 }}>
          One summit, endless possibilities
        </h2>
        <p style={{ margin:0, fontSize:17, color:"#6B7280", lineHeight:1.6, maxWidth:520, marginInline:"auto" }}>
          Everything you need to grow as a special education professional
        </p>
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity:0, y:30 }}
        animate={inView ? { opacity:1, y:0 } : {}}
        transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}
        style={{ maxWidth:860, margin:"0 auto", border:"1.5px solid #E5E7EB", borderRadius:20, overflow:"hidden", boxShadow:"0 4px 32px rgba(0,0,0,0.08)" }}
      >
        <div className="v1pc-wrap">

          {/* ── Left: price + benefits + CTA ── */}
          <div className="v1pc-left">
            {/* Title */}
            <h3 style={{ margin:"0 0 8px", fontSize:22, fontWeight:800, color:"#111827", lineHeight:1.2 }}>
              Full Summit Access
            </h3>
            <p style={{ margin:"0 0 24px", fontSize:14, color:"#6B7280", lineHeight:1.6 }}>
              Build your next SPED skill set with this comprehensive free summit
            </p>

            {/* Price */}
            <div style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:8 }}>
              <span style={{ fontSize:"clamp(44px,7vw,64px)", fontWeight:900, lineHeight:1, letterSpacing:-2, color:"#111827" }}>$19</span>
              <span style={{ fontSize:16, color:"#707685", marginBottom:6 }}>/year</span>
            </div>

            {/* Benefits */}
            <div style={{ marginBottom:32, marginTop:8 }}>
              {[
                { label:"Free verified certificate included",     icon:<PhosphorIcons.Certificate size={16} color="#707685" weight="regular"/> },
                { label:"Created by educators for educators",     icon:<PhosphorIcons.Heart size={16} color="#707685" weight="regular"/> },
              ].map((b, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:13 }}>
                  {b.icon}
                  <span style={{ fontSize:14, color:"#2B2E33" }}>{b.label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ marginTop:"auto" }}>
              <button
                onClick={onGetStarted}
                style={{ width:"100%", padding:"15px", fontSize:15, fontWeight:800, background:"#6490E8", color:"#fff", border:"none", borderRadius:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"background 0.15s, transform 0.12s" }}
                onMouseEnter={e=>{ e.currentTarget.style.background="#4f7de0"; e.currentTarget.style.transform="translateY(-1px)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="#6490E8"; e.currentTarget.style.transform="none"; }}
              >
                {isLoggedIn ? "Subscribe" : "Start for free"}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft:"auto" }}><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>

          {/* ── Right: features + testimonials ── */}
          <div className="v1pc-right">
            {/* Features title */}
            <div style={{ marginBottom:20 }}>
              <h4 style={{ margin:0, fontSize:15, fontWeight:700, color:"#111827" }}>Included Features</h4>
            </div>

            {/* Feature list */}
            <div style={{ marginBottom:24, display:"flex", flexDirection:"column", gap:10 }}>
              {V1_PRICING_FEATURES.map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity:0, x:20 }}
                  animate={inView ? { opacity:1, x:0 } : {}}
                  transition={{ delay: 0.4 + i * 0.05, duration:0.45 }}
                  style={{ display:"flex", alignItems:"center", gap:12 }}
                >
                  <div style={{ width:20, height:20, borderRadius:"50%", background:"rgba(245,158,11,0.1)", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5.5l2.5 2.5 4.5-5" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span style={{ fontSize:14, color:"#2B2E33" }}>{feat}</span>
                </motion.div>
              ))}
            </div>

            {/* Separator */}
            <div style={{ height:1, background:"#E5E7EB", margin:"4px 0 20px" }} />

            {/* Rotating testimonial */}
            <div style={{ position:"relative", minHeight:148, overflow:"hidden" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={testiIdx}
                  initial={{ opacity:0, y:16 }}
                  animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, y:-16 }}
                  transition={{ duration:0.45 }}
                  style={{ position:"absolute", inset:0, padding:"16px 0" }}
                >
                  <p style={{ margin:"0 0 14px", fontSize:13, color:"#5D636F", lineHeight:1.65, fontStyle:"italic" }}>"{testi.content}"</p>
                  <div style={{ fontSize:13, fontWeight:700, color:"#111827" }}>— {testi.name}</div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>{/* end right column */}
        </div>{/* end v1pc-wrap */}
      </motion.div>{/* end card */}
    </section>
  );
}

function SpAccordionFeature({ T }) {
  const FEATURES = [
    {
      id: 1,
      title: "IEP Goal Tracking",
      description: "No more carrying binders full of data sheets. AbleSpace allows you to collect data on your goals with a single click.",
      image: "/iep-goal-tracking.jpg",
    },
    {
      id: 2,
      title: "10+ Data Types",
      description: "Choose from 10+ data types to collect exactly the data you need for every goal.",
      image: "/10-data-types.jpg",
    },
    {
      id: 3,
      title: "Beautiful pre-built reports",
      description: "Data is automatically analyzed and beautiful reports are auto-generated to carry to your next IEP meeting.",
      image: "/pre-built-reports.jpg",
    },
    {
      id: 4,
      title: "Service Time Tracking",
      description: "Automatically track service time both at a session and goal levels. Service time tracking reports are automatically generated.",
      image: "/service-time-tracking.jpg",
    },
    {
      id: 5,
      title: "Creating Rotating Schedule",
      description: "Easily create and manage rotating schedules for your team, ensuring smooth coordination and coverage.",
      image: "/creating-rotating-schedule.jpg",
    },
    {
      id: 6,
      title: "Admin Dashboard",
      description: "Get a bird's-eye view of your team's progress, schedules, and data all in one place.",
      image: "/admin-dashboard.jpg",
    },
  ];
  const [activeId, setActiveId] = useState(1);
  const active = FEATURES.find(f => f.id === activeId);
  return (
    <section style={{ padding:"80px 24px 64px", borderBottom:`1px solid ${T.border}`, background:"#27385A" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <p style={{ margin:"0 0 10px", fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.6)", letterSpacing:1, textTransform:"uppercase" }}>AbleSpace Features</p>
          <h2 style={{ margin:"0 0 14px", fontSize:"clamp(28px,4vw,42px)", fontWeight:800, color:"#fff", letterSpacing:-1.2, lineHeight:1.15 }}>
            AI-Powered IEP Goal Tracking
          </h2>
          <p style={{ margin:"0 auto", fontSize:16, color:"rgba(255,255,255,0.7)", lineHeight:1.7, maxWidth:480 }}>
            Track IEP goals, services, and accommodations in one place - with AI-powered speed and accuracy.
          </p>
        </div>

        <style>{`
          .sp-acc-wrap { display:flex; gap:56px; align-items:stretch; min-height:580px; }
          .sp-acc-list { flex:1; display:flex; flex-direction:column; justify-content:center; }
          .sp-acc-img  { width:58%; flex-shrink:0; display:flex; align-items:center; }
          @media(max-width:768px){ .sp-acc-wrap { flex-direction:column; gap:32px; min-height:unset; } .sp-acc-img { display:none !important; } .sp-acc-mobile-img { display:block !important; } }
          @media(min-width:769px){ .sp-acc-mobile-img { display:none !important; } }
          .sp-acc-item { border-bottom:1px solid rgba(255,255,255,0.12); }
          .sp-acc-trigger { width:100%; background:none; border:none; cursor:pointer; padding:20px 0; display:flex; align-items:center; justify-content:space-between; gap:12; text-align:left; font-family:inherit; }
          .sp-acc-trigger:hover h6 { color:#fff !important; }
          .sp-acc-chevron { transition:transform 0.25s ease; flex-shrink:0; }
          .sp-acc-chevron.open { transform:rotate(180deg); }
          .sp-acc-content { overflow:hidden; transition:opacity 0.2s ease; }
        `}</style>

        <div className="sp-acc-wrap">
          {/* Left: accordion */}
          <div className="sp-acc-list">
            {FEATURES.map(f => {
              const isOpen = activeId === f.id;
              return (
                <div key={f.id} className="sp-acc-item">
                  <button className="sp-acc-trigger" onClick={() => setActiveId(f.id)}>
                    <h6 style={{ margin:0, fontSize:18, fontWeight:700, lineHeight:1.3, color: isOpen ? "#fff" : "rgba(255,255,255,0.55)", transition:"color 0.2s" }}>
                      {f.title}
                    </h6>
                    <svg className={`sp-acc-chevron${isOpen?" open":""}`} width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                  <div className="sp-acc-content" style={{ display: isOpen ? "block" : "none", opacity: isOpen ? 1 : 0 }}>
                    <p style={{ margin:"0 0 12px", fontSize:14, color:"rgba(255,255,255,0.6)", lineHeight:1.7 }}>{f.description}</p>
                    <a href="https://ablespace.io" target="_blank" rel="noopener noreferrer"
                      style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.75)", textDecoration:"none", marginBottom:16, transition:"color .15s" }}
                      onMouseEnter={e=>e.currentTarget.style.color="#fff"}
                      onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.75)"}>
                      Learn More
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                    {/* Mobile image — shown inline below description */}
                    <div className="sp-acc-mobile-img" style={{ marginBottom:20 }}>
                      <div style={{ width:"100%", aspectRatio:"1840/1424", overflow:"hidden", borderRadius:12 }}>
                        <img src={f.image} alt={f.title} style={{ width:"100%", height:"100%", objectFit:"contain", objectPosition:"top center", display:"block", borderRadius:12 }}/>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: image preview — fixed position, never moves */}
          <div className="sp-acc-img">
            <div style={{ width:"100%", borderRadius:16, overflow:"hidden", background:"#1e2d47", padding:"28px 28px 28px", boxShadow:"0 8px 40px rgba(0,0,0,0.35)" }}>
              <img src={active.image} alt={active.title}
                style={{ width:"100%", height:"auto", display:"block", borderRadius:10, transition:"opacity 0.3s ease" }}/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SpBentoChart({ T }) {
  const [hovered, setHovered] = useState(null);
  const CHART_DATA = [
    { month:"May",  desktop:56,  mobile:224 },
    { month:"Jun",  desktop:90,  mobile:300 },
    { month:"Jul",  desktop:126, mobile:252 },
    { month:"Aug",  desktop:205, mobile:410 },
    { month:"Sep",  desktop:200, mobile:126 },
    { month:"Oct",  desktop:400, mobile:800 },
  ];
  const W = 280, H = 110, pad = 8;
  const maxV = Math.max(...CHART_DATA.flatMap(d => [d.desktop, d.mobile]));
  function makePts(key) {
    return CHART_DATA.map((d,i) => [
      pad + (i / (CHART_DATA.length-1)) * (W - pad*2),
      H - pad - ((d[key] / maxV) * (H - pad*2)),
    ]);
  }
  function smoothPath(points) {
    let d = `M ${points[0][0]},${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      const p = points[i-1], c = points[i];
      const cp1x = p[0] + (c[0]-p[0]) * 0.4, cp2x = p[0] + (c[0]-p[0]) * 0.6;
      d += ` C ${cp1x},${p[1]} ${cp2x},${c[1]} ${c[0]},${c[1]}`;
    }
    return d;
  }
  const ptsD = makePts("desktop"), ptsM = makePts("mobile");
  const lineD = smoothPath(ptsD), lineM = smoothPath(ptsM);
  const areaD = lineD + ` L${ptsD[ptsD.length-1][0]},${H} L${ptsD[0][0]},${H} Z`;
  const areaM = lineM + ` L${ptsM[ptsM.length-1][0]},${H} L${ptsM[0][0]},${H} Z`;
  const h = hovered !== null ? CHART_DATA[hovered] : null;
  const hx = hovered !== null ? ptsD[hovered][0] : null;
  return (
    <div style={{ position:"relative", padding:"8px 0" }}>
      <svg viewBox={`0 0 ${W} ${H+12}`} style={{ width:"100%", height:"auto", overflow:"visible", display:"block" }}>
        <defs>
          <linearGradient id="spgd" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={T.blue} stopOpacity={0.35}/><stop offset="100%" stopColor={T.blue} stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="spgm" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.5}/><stop offset="100%" stopColor="#60a5fa" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <path d={areaM} fill="url(#spgm)"/>
        <path d={lineM} fill="none" stroke="#60a5fa" strokeWidth={2} strokeLinecap="round"/>
        <path d={areaD} fill="url(#spgd)"/>
        <path d={lineD} fill="none" stroke={T.blue} strokeWidth={2} strokeLinecap="round"/>
        {/* Month labels */}
        {CHART_DATA.map((d,i) => (
          <text key={i} x={ptsD[i][0]} y={H+10} textAnchor="middle" fontSize={8} fill={T.muted}>{d.month}</text>
        ))}
        {/* Hover vertical line */}
        {hovered !== null && (
          <line x1={hx} y1={pad} x2={hx} y2={H} stroke={T.muted} strokeWidth={1} strokeDasharray="3,2" opacity={0.5}/>
        )}
        {/* Hover dots */}
        {hovered !== null && <>
          <circle cx={hx} cy={ptsM[hovered][1]} r={4} fill="#fff" stroke="#60a5fa" strokeWidth={2}/>
          <circle cx={hx} cy={ptsD[hovered][1]} r={4} fill="#fff" stroke={T.blue} strokeWidth={2}/>
        </>}
        {/* Invisible hover hit areas */}
        {CHART_DATA.map((d,i) => (
          <rect key={i} x={ptsD[i][0] - (W/(CHART_DATA.length*2))} y={0} width={W/CHART_DATA.length} height={H}
            fill="transparent" style={{ cursor:"crosshair" }}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}/>
        ))}
      </svg>
      {/* Tooltip */}
      {h && (
        <div style={{
          position:"absolute", top:8,
          left: hovered > 3 ? "auto" : `calc(${(hx/W)*100}% + 8px)`,
          right: hovered > 3 ? `calc(${((W-hx)/W)*100}% + 8px)` : "auto",
          background:"#1f2028", color:"#fff", borderRadius:10, padding:"10px 14px",
          fontSize:11, boxShadow:"0 4px 16px rgba(0,0,0,0.25)", pointerEvents:"none", zIndex:10, minWidth:170,
        }}>
          <div style={{ fontWeight:700, marginBottom:6, fontSize:12 }}>{h.month}</div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
            <span style={{ width:8, height:8, borderRadius:2, background:"#60a5fa", display:"inline-block" }}/>
            <span style={{ color:"rgba(255,255,255,0.6)", flex:1 }}>Mobile sessions</span>
            <span style={{ fontWeight:700 }}>{h.mobile}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ width:8, height:8, borderRadius:2, background:T.blue, display:"inline-block" }}/>
            <span style={{ color:"rgba(255,255,255,0.6)", flex:1 }}>Desktop sessions</span>
            <span style={{ fontWeight:700 }}>{h.desktop}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function LandingPage({ onGetStarted, isLoggedIn = false, userName = "", userAvatar = null, onGoToDashboard, onLogout, onWatchSession, openInstructorName = null, onInstructorOpened, sessions = [], sessionsLoading = false, testimonialsData = [] }) {
  const v1Testimonials = testimonialsData.length > 0
    ? testimonialsData.map(t => ({ text:t.text, name:t.name, role:"SPED Educator", img:"" }))
    : V1_TESTIMONIALS;

  // Build experts from sessions FIRST — used in resolveInstructor which is called in useState init below
  const _expertsFromSessions = (() => {
    const seen = new Set();
    return sessions
      .filter(s => s.instructor && s.instructorImage)
      .slice().sort((a, b) => {
        const da = a.availableFrom ? new Date(a.availableFrom).getTime() : Infinity;
        const db = b.availableFrom ? new Date(b.availableFrom).getTime() : Infinity;
        return da - db;
      })
      .filter(s => { if (seen.has(s.instructor)) return false; seen.add(s.instructor); return true; })
      .map(s => {
        const parts = s.instructor.split("|").map(p => p.trim());
        return { name: parts[0] || s.instructor, role: s.instructorDesignation || parts[1] || "", org: "", img: s.instructorImage,
                 bio: s.instructorBio || "", session: s.title, sessionDesc: s.description || "", highlights: [],
                 linkedin: s.instructorLinkedin || "", instagram: s.instructorInstagram || "",
                 facebook: s.instructorFacebook || "", website: s.instructorWebsite || "", podcast: s.instructorPodcast || "" };
      });
  })();

  const [showAuth, setShowAuth] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const savedScrollY = useRef(0);
  const [faqOpen, setFaqOpen] = useState(null);
  const [scheduleTab, setScheduleTab] = useState("upcoming");
  const [instructorPage, setInstructorPage] = useState(0);
  const [testimonialPage, setTestimonialPage] = useState(0);
  const [heroTab, setHeroTab] = useState("watch");
  const [navOpen, setNavOpen] = useState(false);
  const [, setNow] = useState(() => Date.now());

  // Re-render when a session's availableFrom time arrives:
  // - removes it from the Upcoming section (it's now live)
  // - triggers the next timer for the session after that
  useEffect(() => {
    const upcoming = sessions.filter(s => {
      const from = s.availableFrom || s.available_from;
      return from && new Date(from) > new Date();
    });
    if (upcoming.length === 0) return;
    const nextUnlock = Math.min(...upcoming.map(s => new Date(s.availableFrom || s.available_from).getTime()));
    const delay = nextUnlock - Date.now();
    if (delay <= 0) return;
    const t = setTimeout(() => setNow(Date.now()), delay + 500);
    return () => clearTimeout(t);
  }, [sessions]);
  const [navScrolled, setNavScrolled] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(() => resolveInstructor(openInstructorName));

  useEffect(() => {
    if (!profileMenuOpen) return;
    const handler = (e) => { if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) setProfileMenuOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileMenuOpen]);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [navOpen]);

  // experts is already computed above as _expertsFromSessions (needed before useState init)
  const experts = _expertsFromSessions;

  const _expertsHardcoded = [
    { name:"Tara Roehl",         role:"Mindfulness & Wellness Specialist",   org:"SPED Wellness Institute",         img:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop&auto=format",
      bio:"Tara Roehl is a certified mindfulness instructor and special education advocate with over 15 years of classroom experience. She has helped thousands of educators integrate evidence-based wellness practices into their daily routines to reduce burnout and improve student outcomes.\n\nTara holds a Master's degree in Special Education and a certification in Mindfulness-Based Stress Reduction (MBSR). She is the founder of the SPED Wellness Institute, where she trains educators across the country.",
      session:"Mindfulness for SPED Educators", sessionDesc:"Practical mindfulness techniques you can use before, during, and after school to stay regulated and present for your students.",
      highlights:["Evidence-based mindfulness practices for the classroom","Managing stress and preventing SPED burnout","Building co-regulation skills with your students"] },
    { name:"Casey Harrison",     role:"Inclusion Specialist",                org:"National Inclusion Network",      img:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=300&fit=crop&auto=format",
      bio:"Casey Harrison has spent two decades designing inclusive learning environments across diverse school districts. As a nationally recognized inclusion specialist, Casey works with administrators, teachers, and families to create schools where every student belongs.\n\nCasey is the author of 'Belonging in Every Classroom' and a sought-after keynote speaker at educational conferences worldwide.",
      session:"Building Truly Inclusive Classrooms", sessionDesc:"A practical framework for designing learning environments where students with disabilities thrive alongside their peers.",
      highlights:["Universal Design for Learning (UDL) strategies","Collaborative co-teaching models","Family engagement in inclusive settings"] },
    { name:"Sydney Bassard",     role:"Dyslexia & Literacy Expert",          org:"Reading Rights Foundation",       img:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=300&fit=crop&auto=format",
      bio:"Sydney Bassard is a certified dyslexia specialist and literacy intervention expert who has worked with struggling readers for over 12 years. She is passionate about early identification and evidence-based reading instruction.\n\nSydney holds certifications in Orton-Gillingham and LETRS and regularly consults with school districts to build structured literacy programs.",
      session:"Unlocking Reading for Students with Dyslexia", sessionDesc:"Structured literacy approaches and early intervention strategies proven to accelerate reading growth in students with dyslexia.",
      highlights:["Orton-Gillingham fundamentals","Screening and early identification","Building a structured literacy program"] },
    { name:"Diana Williams",     role:"SPED Leadership Coach",               org:"EdLeaders Collaborative",         img:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop&auto=format",
      bio:"Diana Williams coaches special education directors and school leaders across the country to build high-performing SPED programs. With a background in both classroom teaching and district administration, Diana brings a unique systems-thinking perspective to leadership development.\n\nShe has led SPED programs in three states and currently coaches over 200 school leaders annually through the EdLeaders Collaborative.",
      session:"Leading High-Impact SPED Programs", sessionDesc:"How to build, sustain, and continuously improve a special education program that delivers real results for students and families.",
      highlights:["Data-driven program evaluation","Building strong IEP teams","Advocating for SPED at the district level"] },
    { name:"Farwa Husain",       role:"Curriculum & IEP Designer",           org:"Individualized Learning Co.",     img:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop&auto=format",
      bio:"Farwa Husain specializes in designing individualized curriculum and IEP goals that are both legally compliant and educationally meaningful. She has trained hundreds of special education teachers on writing measurable, standards-aligned IEPs.\n\nFarwa is a former SPED coordinator and current consultant who partners with school districts to streamline IEP processes and improve compliance outcomes.",
      session:"Writing IEPs That Actually Work", sessionDesc:"A step-by-step approach to writing IEP goals that are measurable, standards-aligned, and meaningful for each student.",
      highlights:["Present levels and baseline data","Writing SMART IEP goals","Connecting IEP goals to the general curriculum"] },
    { name:"Jordan Smith",       role:"Speech-Language Pathologist",         org:"CommunicateFirst SLP Group",      img:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&auto=format",
      bio:"Jordan Smith is a licensed Speech-Language Pathologist with a specialization in school-based communication disorders. Jordan has worked in both urban and rural school settings, supporting students with autism, language delays, and articulation disorders.\n\nJordan is a member of ASHA and frequently presents at state and national SLP conferences on practical, classroom-based communication strategies.",
      session:"Communication Strategies for Every SPED Classroom", sessionDesc:"How classroom teachers and SLPs can collaborate to support communication growth for all students, including those who are non-verbal.",
      highlights:["Core vocabulary in the classroom","Teacher-SLP collaboration strategies","Supporting non-verbal and minimally verbal students"] },
    { name:"Sam Parmelee",       role:"AAC Specialist & Consultant",         org:"Voices for All AAC Center",       img:"https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=300&fit=crop&auto=format",
      bio:"Sam Parmelee is one of the country's leading AAC (Augmentative and Alternative Communication) specialists, with over 10 years of experience implementing AAC systems in school and clinical settings. Sam works with students who rely on AAC as their primary means of communication.\n\nSam is a passionate advocate for presuming competence and has helped hundreds of families and educators unlock communication for non-speaking individuals.",
      session:"AAC Implementation That Transforms Lives", sessionDesc:"Practical strategies for implementing AAC in the classroom, building communication partners, and measuring progress.",
      highlights:["Choosing the right AAC system","Training communication partners","Data collection for AAC goals"] },
    { name:"Natasha Schaumburg", role:"Board Certified Behavior Analyst",    org:"Positive Behavior Solutions",    img:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop&auto=format",
      bio:"Natasha Schaumburg, BCBA, specializes in positive behavior support and applied behavior analysis in school settings. She has designed behavior intervention plans for hundreds of students and trained entire school staffs on trauma-informed, proactive behavior strategies.\n\nNatasha is a firm believer that behavior is communication, and she helps teams understand the function of behavior before designing any intervention.",
      session:"Behavior as Communication: A Positive Approach", sessionDesc:"Understanding the function of challenging behavior and designing proactive, positive behavior support plans that actually work.",
      highlights:["Functional behavior assessment (FBA) basics","Writing effective behavior intervention plans","Trauma-informed behavior support"] },
    { name:"Rose Karentina",     role:"Data & Assessment Specialist",        org:"Evidence-Based Ed Consulting",    img:"https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=300&fit=crop&auto=format",
      bio:"Rose Karentina is a data and assessment specialist who helps SPED teams use data to drive instruction and demonstrate student progress. With a background in educational psychology and statistics, Rose makes data accessible and actionable for classroom teachers.\n\nShe has worked with school districts nationwide to design data collection systems, progress monitoring protocols, and data-driven IEP review processes.",
      session:"Using Data to Drive SPED Instruction", sessionDesc:"How to collect meaningful data, monitor student progress, and use evidence to make better instructional decisions.",
      highlights:["Progress monitoring systems that work","Data visualization for IEP meetings","Making data-driven instructional adjustments"] },
  ];
  function resolveInstructor(name) {
    if (!name) return null;
    // Check dynamic experts first, then hardcoded fallback
    let match = _expertsFromSessions.find(e => e.name === name) || _expertsHardcoded.find(e => e.name === name);
    if (!match) {
      // Try matching against full "Name | Role" instructor field
      const s = sessions.find(s => {
        const n = s.instructor?.split("|")[0]?.trim();
        return n === name || s.instructor === name;
      }) || SESSIONS.find(s => s.instructor === name);
      if (s) match = {
        name,
        role: s.instructorDesignation || s.instructor?.split("|")[1]?.trim() || "",
        org: "",
        img: s.instructorImage || INSTRUCTOR_AVATARS[s.instructor] || "",
        bio: s.instructorBio || "No bio available.",
        session: s.title,
        sessionDesc: s.description || "",
        highlights: [],
        linkedin: s.instructorLinkedin || "", instagram: s.instructorInstagram || "",
        facebook: s.instructorFacebook || "", website: s.instructorWebsite || "", podcast: s.instructorPodcast || "",
      };
    }
    return match || null;
  }

  useEffect(() => {
    if (openInstructorName) {
      const match = resolveInstructor(openInstructorName);
      if (match) { setSelectedInstructor(match); window.scrollTo(0,0); onInstructorOpened?.(); }
    }
  }, [openInstructorName]);

  const testimonials = testimonialsData.length > 0
    ? testimonialsData.map(t => ({ stars:5, text:t.text, name:t.name, role:"SPED Educator", img:"" }))
    : [
        { stars:5, text:"This is, by far, the best presentation of the summit. It kept my attention the whole time.", name:"April M.", role:"SPED Educator", img:"" },
        { stars:5, text:"The session was highly informative and practical. The speaker presented evidence-based, neurodiversity-affirming strategies.", name:"Auhen Cleo Faith C.", role:"SPED Educator", img:"" },
        { stars:5, text:"The discussion reminded us that we cannot give our best to our students if we do not take care of ourselves first.", name:"Erwin G. B.", role:"SPED Educator", img:"" },
        { stars:5, text:"The mindfulness-based strategies and real classroom applications were especially helpful.", name:"Auhen Cleo Faith C.", role:"SPED Educator", img:"" },
      ];

  const faqs = [
    { q:"Is SPED Summit completely free?", a:"Yes! SPED Summit is completely free to attend. Registered attendees can access all summit sessions during the event and earn free PD certificates by completing the required assessments.\n\nA Plus Plan also includes access to PD certificates from previous years' SPED Summit sessions, along with premium content, extended access to recordings, and additional resources." },
    { q:"Can I rewatch if I am unable to attend live?", a:"Absolutely! All summit sessions remain available to watch on-demand throughout the event period, so you can learn at a time that works best for you.\n\nIf you'd like extended access beyond the summit dates, a Plus Plan includes access to session recordings after the event concludes." },
    { q:"How will I get the Completion Certificate?", a:"After completing a session and successfully passing the accompanying assessment, your PD certificate will be available directly within your SPED Summit account.\n\nPlus Plan members can also access certificates from eligible sessions in previous years' SPED Summit libraries." },
    { q:"Can I retake quizzes if I don't pass?", a:"Yes! If you don't pass an assessment on your first attempt, you can retake it. Our goal is to support your learning and help you successfully earn your PD certificate." },
    { q:"What topics are covered at SPED Summit?", a:"SPED Summit features expert-led sessions on a wide range of special education topics, including autism support, AAC and communication, IEP development, data collection, literacy and dyslexia, executive functioning, emotional regulation, inclusion, behavior support, student independence, family collaboration, transition planning, and much more." },
  ];

  useEffect(()=>{
    const TABS = ["watch","quiz","cert","win"];
    const t = setTimeout(()=>setHeroTab(cur=>TABS[(TABS.indexOf(cur)+1)%TABS.length]),4000);
    return ()=>clearTimeout(t);
  },[heroTab]);

  const T = {
    bg:        "#FEF5EC",
    bgSection: "#FEF5EC",
    bgHighlight:"#eef3fd",
    text:      "#2B2E33",
    secondary: "#2B2E33",
    muted:     "#5D636F",
    border:    "#eceded",
    borderStrong:"#a0a4a6",
    hover:     "#f9fbf8",
    blue:      "#6490E8",
    blueHov:   "#4a77d4",
    blueBg:    "#eef3fd",
    orange:    "#F59E0B",
    green:     "#10B981",
    purple:    "#6490E8",
    error:     "#EF4444",
  };

  if (selectedInstructor) {
    const instr = selectedInstructor;
    const paras = instr.bio.split("\n\n");
    const instrSession = sessions.find(s => s.instructor === instr.name || s.instructor?.split("|")[0]?.trim() === instr.name) || SESSIONS.find(s => s.instructor === instr.name);
    const instrSessionAvailable = instrSession ? isSessionAvailable(instrSession.id) : false;
    const instrSessionDate = instrSession?.date || instrSession?.scheduledDate || null;
    return (
      <div style={{ fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif", background:"#FEF5EC", color:T.text, minHeight:"100vh" }}>
        {/* Nav */}
        <nav style={{ position:"sticky", top:0, zIndex:100, background:"rgba(254,245,236,0.95)", backdropFilter:"blur(8px)", borderBottom:`1px solid ${T.border}`, height:60, display:"flex", alignItems:"center", padding:"0 24px" }}>
          <div style={{ maxWidth:1024, margin:"0 auto", width:"100%", display:"flex", alignItems:"center" }}>
            <button onClick={()=>{ setSelectedInstructor(null); requestAnimationFrame(()=>window.scrollTo(0, savedScrollY.current)); }}
              style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", fontSize:14, color:T.muted, cursor:"pointer", padding:"4px 8px", borderRadius:6, transition:"background .12s, color .12s" }}
              onMouseEnter={e=>{ e.currentTarget.style.background=T.hover; e.currentTarget.style.color=T.text; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="none"; e.currentTarget.style.color=T.muted; }}>
              <Icon name="arrow-left" size={16} color="currentColor"/>
              Back
            </button>
          </div>
        </nav>

        <style>{`.spk-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;padding:64px 24px;max-width:1024px;margin:0 auto;align-items:start}@media(max-width:767px){.spk-detail-grid{grid-template-columns:1fr!important;gap:32px!important;padding:24px 16px!important}}`}</style>
        <div className="spk-detail-grid">
          {/* Left: Instructor bio */}
          <div>
            {/* Header */}
            <div style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:24 }}>
              <div style={{ width:88, height:88, borderRadius:14, overflow:"hidden", flexShrink:0, background:T.hover }}>
                <img src={instr.img} alt={instr.name} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 20%", display:"block" }}/>
              </div>
              <div style={{ paddingTop:4 }}>
                <h1 style={{ margin:"0 0 6px", fontSize:22, fontWeight:700, color:T.text, letterSpacing:-.5 }}>{instr.name}</h1>
                <p style={{ margin:"0 0 4px", fontSize:14, color:T.muted }}>{instr.role}</p>
                <p style={{ margin:0, fontSize:12, color:T.muted }}>{instr.org}</p>
              </div>
            </div>
            {/* Bio paragraphs */}
            <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:20 }}>
              <p style={{ margin:"0 0 12px", fontSize:13, fontWeight:600, color:T.blue, letterSpacing:.5, textTransform:"uppercase" }}>About</p>
              {paras.map((p,i)=>(
                <p key={i} style={{ margin:"0 0 16px", fontSize:14, color:T.text, lineHeight:1.75 }}>{p}</p>
              ))}
            </div>
            {/* Social handles */}
            <InstructorSocialIcons instr={instr} T={T}/>
          </div>

          {/* Right: Session info */}
          <div style={{ paddingTop:0 }}>
            <p style={{ margin:"0 0 16px", fontSize:13, fontWeight:600, color:T.blue, letterSpacing:.5, textTransform:"uppercase" }}>Session</p>
            {(() => {
              const af = instrSession?.availableFrom || instrSession?.available_from;
              if (!af) return null;
              const d = new Date(af);
              const date = d.toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
              const time = d.toLocaleTimeString("en-US", { hour:"numeric", minute:"2-digit", hour12:true });
              return (
                <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(245,158,11,0.10)", border:"1px solid rgba(245,158,11,0.25)", borderRadius:7, padding:"5px 12px", fontSize:13, fontWeight:600, color:"#b45309", marginBottom:12 }}>
                  <Icon name="calendar" size={13} color="#b45309"/>
                  {date} · {time}
                </div>
              );
            })()}
            <h2 style={{ margin:"0 0 16px", fontSize:28, fontWeight:700, color:T.text, letterSpacing:-.5, lineHeight:1.2 }}>{instr.session}</h2>
            <p style={{ margin:"0 0 24px", fontSize:15, color:T.muted, lineHeight:1.7 }}>{instr.sessionDesc}</p>


            {isLoggedIn ? (
              instrSessionAvailable ? (
                <button onClick={()=>{ if(instrSession) { onWatchSession ? onWatchSession(instrSession) : onGetStarted(instrSession.id); } }}
                  style={{ padding:"0 24px", height:44, width:"100%", background:T.blue, color:"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:600, cursor:"pointer", transition:"background .12s", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
                  onMouseEnter={e=>e.currentTarget.style.background=T.blueHov}
                  onMouseLeave={e=>e.currentTarget.style.background=T.blue}>
                  <Icon name="play-circle" size={16} color="#fff" weight="fill"/>
                  Watch Now
                </button>
              ) : instrSessionDate ? (
                <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"10px 18px", background:T.bgHighlight, border:`1px solid ${T.border}`, borderRadius:8, fontSize:13, color:T.muted, fontWeight:600 }}>
                  <Icon name="clock" size={15} color={T.blue}/>
                  {`Available ${instrSessionDate}`}
                </div>
              ) : null
            ) : (
              <button onClick={()=>setShowAuth(true)}
                style={{ padding:"0 24px", height:42, background:T.blue, color:"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:600, cursor:"pointer", transition:"background .12s" }}
                onMouseEnter={e=>e.currentTarget.style.background=T.blueHov}
                onMouseLeave={e=>e.currentTarget.style.background=T.blue}>
                Register Now
              </button>
            )}
          </div>
        </div>{/* end spk-detail-grid */}
        {showAuth && <AuthModal onClose={()=>setShowAuth(false)} onLogin={(role)=>onGetStarted(null,role)}/>}
      </div>
    );
  }


  const sessionImgs = [
    "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=480&h=260&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=480&h=260&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=480&h=260&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=480&h=260&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=480&h=260&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=480&h=260&fit=crop&auto=format",
  ];
  return (
    <div style={{ minHeight:"100vh", fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif", background:T.bg, overflowX:"clip", color:T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        a { text-decoration: none; color: inherit; }
        .lp-hero-text { padding-top: 0; padding-bottom: 0; }
        .lp-sessions-grid { grid-template-columns: repeat(4, minmax(0,1fr)); }
        /* ── Tablet (≤900px) ── */
        @media(max-width:900px){
          .lp-sessions-grid { grid-template-columns:repeat(2, minmax(0,1fr)) !important; }
          .spk-grid { grid-template-columns:repeat(2,1fr) !important; }
        }
        /* ── Mobile (≤767px) ── */
        @media(max-width:767px){
          .lp-hero-h1 { font-size:32px !important; letter-spacing:-1px !important; line-height:1.15 !important; }
          .lp-hero-certified { font-size:48px !important; line-height:1.05 !important; }
          .lp-hero-sub { font-size:14px !important; line-height:1.55 !important; margin-bottom:24px !important; }
          .lp-hero-logo { height:24px !important; }
          .lp-welcome-block { margin-bottom:12px !important; }
          .lp-hero-text { padding:0 8px !important; }
          .lp-hero-cta-row { flex-direction:column !important; }
          .lp-hero-cta-row button { width:100% !important; min-width:unset !important; }
          .lp-trust-badge { flex-wrap:nowrap !important; justify-content:center !important; gap:6px !important; }
          .lp-trust-badge .lp-laurel { height:18px !important; }
          .lp-trust-badge .lp-trust-text { font-size:12px !important; white-space:nowrap !important; }
          .lp-trust-badge .lp-trust-avatars img { width:22px !important; height:22px !important; margin-left:-6px !important; }
          .lp-stats-strip { gap:20px !important; flex-wrap:wrap !important; justify-content:center !important; }
          .lp-bento-grid { grid-template-columns:1fr !important; grid-template-rows:auto !important; }
          .lp-bento-grid > * { grid-column:1 !important; grid-row:auto !important; }
          .lp-bento-card { height:160px !important; min-height:unset !important; }
          .lp-sessions-grid { grid-template-columns:repeat(2,minmax(0,1fr)) !important; }
          .lp-session-card { flex-direction:column !important; }
          .lp-session-card-img { width:100% !important; height:180px !important; flex-shrink:0 !important; }
          .lp-session-card > div:last-child { padding:12px 12px 14px !important; }
          .lp-apply-banner { flex-direction:column !important; align-items:flex-start !important; gap:14px !important; }
          .lp-apply-banner-btn { width:100% !important; justify-content:center !important; height:44px !important; }
          .lp-section-pad { padding:40px 16px !important; }
          .lp-section-pad-top { padding-top:40px !important; padding-left:16px !important; padding-right:16px !important; }
          .lp-social-strip { gap:20px !important; justify-content:flex-start !important; overflow-x:auto !important; padding-bottom:4px !important; }
          .lp-hero-collage { position:relative !important; bottom:auto !important; left:0 !important; right:0 !important; height:auto !important; overflow:hidden !important; margin-top:24px !important; }
          .lp-hero-collage-inner { justify-content:center !important; gap:6px !important; height:auto !important; padding:0 8px !important; }
          .lp-hero-collage-col { gap:6px !important; margin-top:0 !important; }
          .lp-hero-collage-card { width:calc(25vw - 10px) !important; height:calc(25vw - 10px) !important; border-radius:14px !important; }
          .lp-hero-collage-card-second { width:calc(25vw - 10px) !important; height:calc(25vw - 10px) !important; border-radius:14px !important; display:block !important; }
          .spk-grid { grid-template-columns:repeat(2,1fr) !important; }
          .spk-card { border-radius:14px !important; }
          .spk-card > div { height:260px !important; }
          .lp-footer-cta { padding:40px 16px !important; flex-direction:column !important; align-items:flex-start !important; gap:20px !important; }
          .lp-footer-cta-btns { display:flex !important; flex-direction:column !important; width:100% !important; gap:10px !important; }
          .lp-footer-cta-btns button { width:100% !important; }
          .lp-footer-cols-wrap { padding:32px 16px !important; }
          .lp-footer-cols { grid-template-columns:1fr 1fr !important; gap:24px !important; }
          .lp-footer-brand { grid-column:1 / -1 !important; }
          .lp-speakers-header { padding:0 16px !important; }
          .spk-section-inner { padding:0 16px !important; }
        }
        /* ── Small mobile (≤480px) ── */
        @media(max-width:480px){
          .lp-hero-h1 { font-size:26px !important; }
          .lp-hero-certified { font-size:38px !important; }
          .spk-grid { grid-template-columns:1fr !important; }
          .spk-card > div { height:300px !important; }
          .lp-sessions-grid { grid-template-columns:1fr !important; }
          .lp-session-card-img { height:220px !important; }
        }
      `}</style>

      {/* ── Nav ── */}
      <header style={{ position:"sticky", top:0, zIndex:100, width:"100%", borderBottom: navScrolled ? `1px solid ${T.border}` : "1px solid transparent", background: navScrolled ? "rgba(254,245,236,0.95)" : "transparent", backdropFilter: navScrolled ? "blur(12px)" : "none", transition:"background 0.2s, border-color 0.2s, backdrop-filter 0.2s" }}>
        <nav style={{ maxWidth:1024, margin:"0 auto", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px" }}>
          <div style={{ display:"flex", alignItems:"center", cursor:"pointer" }}
            onClick={()=>window.scrollTo({ top:0, behavior:"smooth" })}>
            <img src="/Container.png" alt="SPED Summit" style={{ height:26, width:"auto", display:"block" }}/>
          </div>
          {/* Desktop links */}
          <div style={{ display:"flex", alignItems:"center", gap:4 }} className="v1-nav-desktop">
            {[["Sessions","sessions"],["Speakers","instructors"]].map(([l,id])=>(
              <button key={l} onClick={()=>document.getElementById(id)?.scrollIntoView({ behavior:"smooth" })}
                style={{ background:"none", border:"none", fontSize:14, color:T.muted, fontWeight:500, cursor:"pointer", padding:"6px 14px", borderRadius:8, height:36, transition:"background .12s, color .12s" }}
                onMouseEnter={e=>{ e.currentTarget.style.background="rgba(245,158,11,0.1)"; e.currentTarget.style.color=T.text; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="none"; e.currentTarget.style.color=T.muted; }}>{l}</button>
            ))}
            {isLoggedIn && (
              <button onClick={()=>onGoToDashboard?.("dashboard")}
                style={{ background:"none", border:"none", fontSize:14, color:T.muted, fontWeight:500, cursor:"pointer", padding:"6px 14px", borderRadius:8, height:36, transition:"background .12s, color .12s" }}
                onMouseEnter={e=>{ e.currentTarget.style.background="rgba(245,158,11,0.1)"; e.currentTarget.style.color=T.text; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="none"; e.currentTarget.style.color=T.muted; }}>
                My Dashboard
              </button>
            )}
            {isLoggedIn ? (
              <div style={{ position:"relative", marginLeft:8 }} ref={profileMenuRef}>
                <button onClick={()=>setProfileMenuOpen(v=>!v)}
                  style={{ border:`1px solid ${T.border}`, background:"transparent", padding:"4px 10px 4px 4px", cursor:"pointer", borderRadius:99, display:"flex", alignItems:"center", gap:8, transition:"background .12s" }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,0.05)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <Avatar name={userName} src={userAvatar} size={28}/>
                  {userName && <span style={{ fontSize:13, fontWeight:600, color:T.text, maxWidth:80, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{userName.split(" ")[0]}</span>}
                  <Icon name="caret-down" size={12} color={T.muted}/>
                </button>
                {profileMenuOpen && (
                  <DropdownMenu anchorRef={profileMenuRef}
                    items={[
                      { icon:"house", label:"My Dashboard", action:()=>{ setProfileMenuOpen(false); onGoToDashboard?.("dashboard"); } },
                      { icon:"sign-out", label:"Log out", danger:true, action:()=>{ setProfileMenuOpen(false); onLogout?.(); } },
                    ]}
                    onClose={()=>setProfileMenuOpen(false)}
                  />
                )}
              </div>
            ) : (
              <button onClick={()=>setShowAuth(true)}
                style={{ marginLeft:8, padding:"0 16px", height:36, background:T.blue, color:"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:600, cursor:"pointer", transition:"background .12s" }}
                onMouseEnter={e=>e.currentTarget.style.background=T.blueHov}
                onMouseLeave={e=>e.currentTarget.style.background=T.blue}>
                Sign in
              </button>
            )}
          </div>
          {/* Mobile hamburger */}
          <button onClick={()=>setNavOpen(o=>!o)} className="v1-nav-hamburger"
            style={{ display:"none", alignItems:"center", justifyContent:"center", width:36, height:36, background:"none", border:"none", cursor:"pointer", padding:0 }}>
            {navOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            )}
          </button>
        </nav>
        <style>{`
          @media (max-width: 767px) { .v1-nav-hamburger { display: flex !important; } .v1-nav-desktop { display: none !important; } }
          @media (min-width: 768px) { .v1-nav-hamburger { display: none !important; } .v1-nav-desktop { display: flex !important; } }
        `}</style>
      </header>
      {/* Mobile menu portal */}
      {navOpen && createPortal(
        <div style={{ position:"fixed", top:56, left:0, right:0, bottom:0, zIndex:99, background:"rgba(254,245,236,0.97)", backdropFilter:"blur(12px)", borderTop:`1px solid ${T.border}`, display:"flex", flexDirection:"column", padding:"16px 24px 32px" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:4, flex:1 }}>
            {[["Sessions","sessions"],["Speakers","instructors"],["FAQ","help"],["Contact",null]].map(([l,id])=>(
              <button key={l} onClick={()=>{
                setNavOpen(false);
                if(l==="Contact"){ sessionStorage.setItem("page","contact"); sessionStorage.setItem("showLanding","0"); window.location.href=window.location.origin; return; }
                document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
              }}
                style={{ background:"none", border:"none", fontSize:16, color:T.text, fontWeight:600, cursor:"pointer", padding:"12px 16px", borderRadius:10, textAlign:"left", transition:"background .15s" }}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(245,158,11,0.1)"}
                onMouseLeave={e=>e.currentTarget.style.background="none"}>{l}</button>
            ))}
          </div>
          {isLoggedIn ? (
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              <button onClick={()=>{ setNavOpen(false); onGoToDashboard?.(); }}
                style={{ width:"100%", padding:"13px 16px", fontSize:15, fontWeight:700, background:T.blue, color:"#fff", border:"none", borderRadius:12, cursor:"pointer" }}>
                My Dashboard
              </button>
              <button onClick={()=>{ setNavOpen(false); onLogout?.(); }}
                style={{ width:"100%", padding:"13px 16px", fontSize:14, fontWeight:600, background:"none", color:"#e53e3e", border:`1px solid rgba(229,62,62,0.3)`, borderRadius:12, cursor:"pointer" }}>
                Log out
              </button>
            </div>
          ) : (
            <button onClick={()=>{ setNavOpen(false); setShowAuth(true); }}
              style={{ width:"100%", padding:"14px", fontSize:15, fontWeight:700, background:T.blue, color:"#fff", border:"none", borderRadius:12, cursor:"pointer", transition:"background .15s" }}
              onMouseEnter={e=>e.currentTarget.style.background=T.blueHov}
              onMouseLeave={e=>e.currentTarget.style.background=T.blue}>
              Sign in
            </button>
          )}
        </div>,
        document.body
      )}

      {/* ── Hero ── */}
      <section style={{ paddingTop:48, paddingBottom:64, background:T.bg, position:"relative", overflowX:"clip", height:900, marginTop:56 }} className="lp-hero-section">
        <style>{`@media(max-width:767px){ .lp-hero-section{ height:auto !important; min-height:unset !important; padding-top:4px !important; padding-bottom:0 !important; } .lp-hero-content{ position:relative !important; top:auto !important; left:auto !important; right:auto !important; bottom:auto !important; padding:4px 20px 0 !important; } }`}</style>


        {/* ── Centered content wrapper ── */}
        <div className="lp-hero-content" style={{ position:"absolute", top:0, left:0, right:0, bottom:340, zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start", padding:"0 32px 48px" }}>

        {/* ── Text block ── */}
        <div className="lp-hero-text" style={{ maxWidth:780, width:"100%", paddingTop:0, paddingBottom:0, paddingLeft:8, paddingRight:8, textAlign:"center" }}>

          {/* Rating badge */}
          <div className="animate-fade-in-up" style={{ opacity:0, animationDelay:"0.2s", marginBottom:16 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(245,158,11,0.10)", border:"1px solid rgba(245,158,11,0.28)", borderRadius:8, padding:"6px 14px" }}>
              <Icon name="calendar" size={13} color="#b45309"/>
              <span style={{ fontSize:13, fontWeight:700, color:"#b45309" }}>13th Jul – 12th Aug 2026</span>
            </div>
          </div>

          {/* Welcome to SPED Summit — inline below date */}
          <div className="lp-welcome-block" style={{ marginBottom:20 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:6 }}>
              <div style={{ flex:1, maxWidth:60, height:1.5, background:"linear-gradient(to right, transparent, #e8a030)" }}/>
              <p style={{ margin:0, fontSize:9, fontWeight:700, letterSpacing:2, color:"#c8872a", textTransform:"uppercase" }}>Welcome to</p>
              <div style={{ flex:1, maxWidth:60, height:1.5, background:"linear-gradient(to left, transparent, #e8a030)" }}/>
            </div>
            <img src="/Logo SPED Summit.png" alt="SPED Summit" className="lp-hero-logo" style={{ height:32, width:"auto", display:"block", margin:"0 auto" }}/>
          </div>

          {/* Main heading */}
          <h1 className="animate-fade-in-up lp-hero-h1" style={{ opacity:0, animationDelay:"0.3s", margin:"0 0 20px", paddingTop:0, paddingBottom:0, fontSize:72, fontWeight:800, color:T.text, lineHeight:1.08, letterSpacing:-3 }}>
            Watch. Learn. Earn.<br/>
            <span className="lp-hero-certified" style={{ backgroundImage:"linear-gradient(90deg, rgba(74, 119, 212, 1) 0%, rgba(74, 119, 212, 1) 100%)", WebkitBackgroundClip:"text", backgroundClip:"text", WebkitTextFillColor:"transparent", color:"transparent", fontSize:83, fontWeight:800, lineHeight:"75px", paddingTop:0, paddingBottom:0 }}>
              Get Certified.
            </span>
          </h1>

          {/* Sub heading */}
          <p className="animate-fade-in-up lp-hero-sub" style={{ opacity:0, animationDelay:"0.4s", margin:"0 0 32px", fontSize:18, color:T.muted, lineHeight:1.65, maxWidth:560, marginLeft:"auto", marginRight:"auto" }}>
            Learn from leading SPED experts, complete interactive quizzes, and earn real professional development certificates.
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up lp-hero-cta-row" style={{ opacity:0, animationDelay:"0.5s", display:"flex", gap:12, justifyContent:"center", alignItems:"center", flexWrap:"wrap" }}>
            <button onClick={()=>isLoggedIn ? onGoToDashboard?.("dashboard") : setShowAuth(true)}
              style={{ padding:"0 26px", height:44, minWidth:200, background:T.blue, color:"#fff", border:"none", borderRadius:10, fontSize:15, fontWeight:600, cursor:"pointer", transition:"background .12s" }}
              onMouseEnter={e=>e.currentTarget.style.background=T.blueHov}
              onMouseLeave={e=>e.currentTarget.style.background=T.blue}>
              {isLoggedIn ? "Go to Dashboard" : "Sign in"}
            </button>
            <button onClick={()=>document.getElementById("sessions")?.scrollIntoView({ behavior:"smooth" })}
              style={{ padding:"0 26px", height:44, minWidth:200, background:"transparent", color:T.text, border:`1.5px solid ${T.border}`, borderRadius:10, fontSize:15, fontWeight:500, cursor:"pointer", transition:"background .15s, border-color .15s" }}
              onMouseEnter={e=>{ e.currentTarget.style.background="rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor="#a0a4a6"; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor=T.border; }}>
              View sessions
            </button>
          </div>

          {/* Trusted badge */}
          <div className="lp-trust-badge" style={{ marginTop:20, display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
            {/* Left laurel */}
            <img className="lp-laurel" src="/laurel wreath.svg" alt="" style={{ height:28, width:"auto", flexShrink:0, filter:"brightness(0) saturate(100%) invert(58%) sepia(51%) saturate(500%) hue-rotate(5deg) brightness(90%) contrast(90%)" }}/>
            <div className="lp-trust-avatars" style={{ display:"flex", flexShrink:0 }}>
              {experts.slice(0,4).map((e,i) => (
                <img key={i} src={e.img} alt={e.name} style={{ width:32, height:32, borderRadius:"50%", border:"2px solid #fff", marginLeft:i===0?0:-10, objectFit:"cover" }}/>
              ))}
            </div>
            <span className="lp-trust-text" style={{ fontSize:14, color:T.muted }}>Trusted by <strong style={{ color:T.blue }}>30,000+</strong> educators worldwide</span>
            {/* Right laurel (mirrored) */}
            <img className="lp-laurel" src="/laurel wreath.svg" alt="" style={{ height:28, width:"auto", flexShrink:0, transform:"scaleX(-1)", filter:"brightness(0) saturate(100%) invert(58%) sepia(51%) saturate(500%) hue-rotate(5deg) brightness(90%) contrast(90%)" }}/>
          </div>
        </div>


        </div>{/* end centered content wrapper */}


        {/* Staggered collage — absolutely pinned to bottom */}
        {(()=>{
          const cols = [
            { mt:60  },
            { mt:0   },
            { mt:80  },
            { mt:20  },
            { mt:40  },
            { mt:70  },
            { mt:10  },
            { mt:50  },
            { mt:30  },
          ];
          const CARD_W = 150, CARD_H = 230;
          const n = experts.length;
          if (n === 0) return null;
          return (
            <div className="lp-hero-collage" style={{ position:"absolute", bottom:-80, left:0, right:0, height:420, overflow:"hidden", zIndex:2, background:"#FEF5EC" }}>
              <div className="lp-hero-collage-inner" style={{ display:"flex", justifyContent:"center", gap:10, height:400 }}>
                {[...cols, ...cols].map((col, ci) => {
                  const top = experts[ci % n];
                  const bot = experts[(ci + 5) % n];
                  return (
                    <div key={ci} className="lp-hero-collage-col" style={{ flexShrink:0, display:"flex", flexDirection:"column", gap:10, marginTop:col.mt }}>
                      <div className="lp-hero-collage-card" style={{ width:CARD_W, height:CARD_H, borderRadius:16, overflow:"hidden", boxShadow:"0 6px 24px rgba(0,0,0,0.10)", cursor:"pointer" }}
                        onMouseEnter={e=>e.currentTarget.querySelector("img").style.transform="scale(1.08)"}
                        onMouseLeave={e=>e.currentTarget.querySelector("img").style.transform="scale(1)"}>
                        <img src={top.img} alt={top.name} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 15%", display:"block", transition:"transform 0.4s ease" }}/>
                      </div>
                      <div className="lp-hero-collage-card lp-hero-collage-card-second" style={{ width:CARD_W, height:CARD_H, borderRadius:16, overflow:"hidden", boxShadow:"0 6px 24px rgba(0,0,0,0.10)", cursor:"pointer" }}
                        onMouseEnter={e=>e.currentTarget.querySelector("img").style.transform="scale(1.08)"}
                        onMouseLeave={e=>e.currentTarget.querySelector("img").style.transform="scale(1)"}>
                        <img src={bot.img} alt={bot.name} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 15%", display:"block", transition:"transform 0.4s ease" }}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

      </section>

      {/* ── Social proof strip ── */}
      <section style={{ borderBottom:`1px solid ${T.border}`, padding:"28px 24px" }}>
        <div style={{ maxWidth:1024, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"center", gap:48, flexWrap:"wrap" }}>
          <span style={{ fontSize:13, color:T.muted, fontWeight:500, whiteSpace:"nowrap" }}>Trusted by educators at</span>
          {[
            { icon:"house",        label:"Public Schools" },
            { icon:"heart",        label:"Children's Hospitals" },
            { icon:"student",      label:"Universities" },
            { icon:"brain",        label:"ABA Clinics" },
            { icon:"clipboard",    label:"IEP Teams" },
          ].map(({icon,label},i)=>(
            <span key={i} style={{ display:"flex", alignItems:"center", gap:6, fontSize:14, fontWeight:600, color:T.muted, whiteSpace:"nowrap" }}>
              <Icon name={icon} size={16} color={T.muted}/>
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* ── Social Proof Bento (moved below FAQ) ── */}
      {false && (() => {
        const CHART_DATA = [
          { month:"May",  desktop:56,  mobile:224 },
          { month:"Jun",  desktop:90,  mobile:300 },
          { month:"Jul",  desktop:126, mobile:252 },
          { month:"Aug",  desktop:205, mobile:410 },
          { month:"Sep",  desktop:200, mobile:126 },
          { month:"Oct",  desktop:400, mobile:800 },
        ];
        const W = 280, H = 110, pad = 8;
        const allVals = CHART_DATA.flatMap(d => [d.desktop, d.mobile]);
        const maxV = Math.max(...allVals);
        function makePts(key) {
          return CHART_DATA.map((d,i) => [
            pad + (i / (CHART_DATA.length-1)) * (W - pad*2),
            H - pad - ((d[key] / maxV) * (H - pad*2)),
          ]);
        }
        function smoothPath(points) {
          if (points.length < 2) return "";
          let d = `M ${points[0][0]},${points[0][1]}`;
          for (let i = 1; i < points.length; i++) {
            const prev = points[i-1], curr = points[i];
            const cp1x = prev[0] + (curr[0]-prev[0]) * 0.4;
            const cp2x = prev[0] + (curr[0]-prev[0]) * 0.6;
            d += ` C ${cp1x},${prev[1]} ${cp2x},${curr[1]} ${curr[0]},${curr[1]}`;
          }
          return d;
        }
        const ptsDesktop = makePts("desktop");
        const ptsMobile  = makePts("mobile");
        const lineDesktop = smoothPath(ptsDesktop);
        const lineMobile  = smoothPath(ptsMobile);
        const areaDesktop = lineDesktop + ` L${ptsDesktop[ptsDesktop.length-1][0]},${H} L${ptsDesktop[0][0]},${H} Z`;
        const areaMobile  = lineMobile  + ` L${ptsMobile[ptsMobile.length-1][0]},${H} L${ptsMobile[0][0]},${H} Z`;
        // keep legacy refs so SVG below compiles
        const pts = ptsDesktop;
        const linePath = lineDesktop;
        const area = areaDesktop;

        const NOTIFS = [
          { icon:"certificate", label:"Certificate Issued", sub:"Tara Roehl · Mindfulness session", grad:"linear-gradient(135deg,#6490E8,#a78bfa)", time:"2m ago" },
          { icon:"play-circle",  label:"New Session Live",  sub:"AAC Implementation · Dr. Sarah Kim", grad:"linear-gradient(135deg,#10B981,#6490E8)", time:"5m ago" },
          { icon:"star",         label:"Quiz Passed",       sub:"Behavior Strategies · 92% score",   grad:"linear-gradient(135deg,#F59E0B,#ef4444)", time:"11m ago" },
          { icon:"users",        label:"Community Post",    sub:"4,200+ educators are now enrolled",  grad:"linear-gradient(135deg,#e83e8c,#6490E8)", time:"18m ago" },
          { icon:"trophy",       label:"Giveaway Entry",    sub:"You're entered to win Ablespace Pro", grad:"linear-gradient(135deg,#F59E0B,#10B981)", time:"24m ago" },
        ];

        /* Dotted map SVG — simple grid of dots */
        const DOT_COLS = 36, DOT_ROWS = 18;
        /* approximate land mask by col/row — just skip obvious ocean zones */
        function isLand(c, r) {
          if (r < 2 || r > 15) return false;
          if (c < 2 || c > 33) return false;
          // rough patches to mimic continents
          if (r >= 2 && r <= 8  && c >= 3  && c <= 10) return true;  // N.America
          if (r >= 9 && r <= 14 && c >= 5  && c <= 9)  return true;  // S.America
          if (r >= 3 && r <= 10 && c >= 12 && c <= 18) return true;  // Europe/Africa
          if (r >= 3 && r <= 11 && c >= 19 && c <= 30) return true;  // Asia
          if (r >= 11&& r <= 15 && c >= 25 && c <= 32) return true;  // SE Asia / Australia
          return false;
        }
        const dots = [];
        for (let r = 0; r < DOT_ROWS; r++) {
          for (let c = 0; c < DOT_COLS; c++) {
            if (isLand(c, r)) dots.push({ cx: (c+0.5)*(100/DOT_COLS), cy: (r+0.5)*(50/DOT_ROWS) });
          }
        }

        return (
          <section style={{ padding:"80px 24px", borderBottom:`1px solid ${T.border}`, background:T.bg }}>
            <div style={{ maxWidth:1100, margin:"0 auto" }}>
              {/* Section header */}
              <div style={{ textAlign:"center", marginBottom:52 }}>
                <p style={{ margin:"0 0 10px", fontSize:13, fontWeight:700, color:T.muted, letterSpacing:1, textTransform:"uppercase" }}>AbleSpace Features</p>
                <h2 style={{ margin:"0 0 14px", fontSize:"clamp(28px,4vw,42px)", fontWeight:800, color:T.text, letterSpacing:-1.2, lineHeight:1.15 }}>
                  AI-Powered IEP Goal Tracking
                </h2>
                <p style={{ margin:"0 auto", fontSize:16, color:T.muted, lineHeight:1.7, maxWidth:480 }}>
                  Track IEP goals, services, and accommodations in one place - with AI-powered speed and accuracy.
                </p>
              </div>

              {/* 2×2 grid */}
              <style>{`
                .sp-bento { display:grid; grid-template-columns:1fr 1fr; grid-template-rows:auto auto; border-radius:20px; overflow:hidden; border:1px solid ${T.border}; box-shadow:0 4px 32px rgba(0,0,0,0.06); }
                @media(max-width:700px){ .sp-bento { grid-template-columns:1fr; } }
              `}</style>
              <div className="sp-bento">

                {/* Cell 1 — Map */}
                <div style={{ padding:"32px 28px", background:"#fff", borderRight:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7, fontSize:12, fontWeight:600, color:T.muted, marginBottom:12, textTransform:"uppercase", letterSpacing:0.8 }}>
                    <Icon name="globe" size={13} color={T.muted}/> Global reach
                  </div>
                  <h3 style={{ margin:"0 0 6px", fontSize:18, fontWeight:700, color:T.text, lineHeight:1.3 }}>
                    Educators from 40+ countries
                  </h3>
                  <p style={{ margin:"0 0 20px", fontSize:13, color:T.muted, lineHeight:1.6 }}>
                    SPED Summit connects specialists worldwide — live and on-demand.
                  </p>
                  {/* Map */}
                  <div style={{ position:"relative", background:"rgba(0,0,0,0.04)", borderRadius:12, padding:"16px 12px 8px" }}>
                    <svg viewBox="0 0 100 50" style={{ width:"100%", height:"auto" }}>
                      {dots.map((d,i) => <circle key={i} cx={d.cx} cy={d.cy} r={0.6} fill={T.blue} opacity={0.55}/>)}
                      {/* Highlight dots for key cities */}
                      <circle cx={18} cy={15} r={1.5} fill={T.blue} opacity={0.9}/>
                      <circle cx={47} cy={18} r={1.5} fill={T.orange} opacity={0.9}/>
                      <circle cx={65} cy={12} r={1.5} fill={T.blue} opacity={0.9}/>
                      <circle cx={75} cy={22} r={1.5} fill={T.green} opacity={0.9}/>
                    </svg>
                    <div style={{ position:"absolute", top:12, left:"50%", transform:"translateX(-50%)", background:"#fff", borderRadius:8, padding:"4px 10px", fontSize:11, fontWeight:600, color:T.text, boxShadow:"0 2px 8px rgba(0,0,0,0.1)", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:5 }}>
                      <span style={{ width:6, height:6, borderRadius:"50%", background:T.green, display:"inline-block" }}/>
                      Live: US, UK, AU, CA
                    </div>
                  </div>
                </div>

                {/* Cell 2 — Notification feed */}
                <div style={{ padding:"32px 28px", background:"#fff", borderBottom:`1px solid ${T.border}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7, fontSize:12, fontWeight:600, color:T.muted, marginBottom:12, textTransform:"uppercase", letterSpacing:0.8 }}>
                    <Icon name="bell" size={13} color={T.muted}/> Live activity
                  </div>
                  <h3 style={{ margin:"0 0 20px", fontSize:18, fontWeight:700, color:T.text, lineHeight:1.3 }}>
                    Something's always happening
                  </h3>
                  <div style={{ position:"relative", height:220, overflow:"hidden" }}>
                    <div style={{ position:"absolute", inset:"0 0 0 0", pointerEvents:"none", zIndex:2, background:"linear-gradient(to bottom, transparent 70%, #fff 100%)" }}/>
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      {NOTIFS.map((n,i) => (
                        <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", background:T.bg, borderRadius:10, border:`1px solid ${T.border}`, animation:`v2FadeSlideUp 0.4s ease both`, animationDelay:`${i*0.1}s` }}>
                          <div style={{ width:34, height:34, borderRadius:9, background:n.grad, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <Icon name={n.icon} size={16} color="#fff" weight="fill"/>
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:12, fontWeight:700, color:T.text, marginBottom:1 }}>{n.label}</div>
                            <div style={{ fontSize:11, color:T.muted, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{n.sub}</div>
                          </div>
                          <div style={{ fontSize:10, color:T.muted, flexShrink:0 }}>{n.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cell 3 — Chart */}
                <div style={{ padding:"32px 28px", background:"#fff", borderRight:`1px solid ${T.border}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7, fontSize:12, fontWeight:600, color:T.muted, marginBottom:12, textTransform:"uppercase", letterSpacing:0.8 }}>
                    <Icon name="trend-up" size={13} color={T.muted}/> Engagement
                  </div>
                  <h3 style={{ margin:"0 0 6px", fontSize:18, fontWeight:700, color:T.text, lineHeight:1.3 }}>
                    Completion rates keep climbing
                  </h3>
                  <p style={{ margin:"0 0 20px", fontSize:13, color:T.muted, lineHeight:1.6 }}>
                    Educators who start keep coming back — session after session.
                  </p>
                  {/* SVG area chart */}
                  <div style={{ background:T.bg, borderRadius:12, padding:"16px 12px 8px" }}>
                    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", overflow:"visible" }}>
                      <defs>
                        <linearGradient id="sp-chart-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={T.blue} stopOpacity={0.25}/>
                          <stop offset="100%" stopColor={T.blue} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <path d={area} fill="url(#sp-chart-grad)"/>
                      <polyline points={polyline} fill="none" stroke={T.blue} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round"/>
                      {pts.map(([x,y],i) => (
                        <circle key={i} cx={x} cy={y} r={3} fill="#fff" stroke={T.blue} strokeWidth={1.5}/>
                      ))}
                      {/* Month labels */}
                      {CHART_DATA.map((d,i) => {
                        const x = pad + (i / (CHART_DATA.length-1)) * (W - pad*2);
                        return <text key={i} x={x} y={H+2} textAnchor="middle" fontSize={8} fill={T.muted}>{d.month}</text>;
                      })}
                    </svg>
                  </div>
                </div>

                {/* Cell 4 — Two feature cards */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", background:T.bg }}>
                  {[
                    { icon:"certificate", title:"Free Certificate", sub:"Earn & download", desc:"Verified completion certificates for every session you finish.", grad:"linear-gradient(135deg,#6490E8,#a78bfa)" },
                    { icon:"trophy",      title:"Win Prizes",       sub:"$10k+ in prizes", desc:"Giveaway entries every time you complete a quiz or session.", grad:"linear-gradient(135deg,#F59E0B,#ef4444)" },
                  ].map((f,i) => (
                    <div key={i} style={{ padding:"28px 22px", borderLeft: i===1 ? `1px solid ${T.border}` : "none", display:"flex", flexDirection:"column", gap:12 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7, fontSize:12, fontWeight:600, color:T.muted, textTransform:"uppercase", letterSpacing:0.8 }}>
                        <Icon name={f.icon} size={13} color={T.muted}/> {f.sub}
                      </div>
                      <div>
                        <div style={{ fontSize:16, fontWeight:700, color:T.text, marginBottom:6 }}>{f.title}</div>
                        <div style={{ fontSize:12, color:T.muted, lineHeight:1.6 }}>{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </section>
        );
      })()}

      {/* ── Bento Features ── */}
      <section className="lp-section-pad" style={{ padding:"80px 24px", borderBottom:`1px solid ${T.border}`, background:T.bg }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>

          {/* Header */}
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <p style={{ margin:"0 0 8px", fontSize:13, fontWeight:700, color:T.muted, letterSpacing:1, textTransform:"uppercase" }}>Platform</p>
            <h2 style={{ margin:"0 0 10px", fontSize:"clamp(32px,4vw,48px)", fontWeight:900, color:T.text, letterSpacing:-1, lineHeight:1.15 }}>
              Built for SPED Professionals
            </h2>
            <p style={{ margin:0, fontSize:16, color:T.muted, maxWidth:480, marginInline:"auto", lineHeight:1.65 }}>
              Organize, track, and grow your expertise — completely free for educators.
            </p>
          </div>

          {/* Bento Grid */}
          {(() => {
            const cardBase = {
              background: T.bg,
              border: `1px solid ${T.border}`,
              borderRadius: 16,
              overflow: "hidden",
              height: "100%",
              boxSizing: "border-box",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            };
            const containerVariants = {
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
            };
            const itemVariants = {
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } },
            };

            return (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="lp-bento-grid"
              style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}
              >
                {/* Card 1 — Sessions Start Date */}
                {(() => {
                  const earliest = sessions.filter(s => s.availableFrom).sort((a,b) => new Date(a.availableFrom) - new Date(b.availableFrom))[0];
                  const startLabel = earliest ? new Date(earliest.availableFrom).toLocaleDateString("en-US", { day:"2-digit", month:"short", year:"numeric" }) : "Jul 13, 2026";
                  return (
                    <motion.div variants={itemVariants}>
                      <div className="lp-bento-card" style={{ ...cardBase, padding:"28px 28px 24px", display:"flex", alignItems:"center", gap:18 }}>
                        <div style={{ width:52, height:52, borderRadius:12, background:"rgba(249,115,22,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <Icon name="calendar" size={26} color="#f97316"/>
                        </div>
                        <div>
                          <div style={{ fontSize:16, fontWeight:600, color:T.text, lineHeight:1.4 }}>Sessions start</div>
                          <div style={{ fontSize:16, fontWeight:600, color:T.text, lineHeight:1.3 }}>{startLabel}</div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}

                {/* Card 2 — Speakers & Sessions count */}
                {(() => {
                  const speakerCount = new Set(sessions.filter(s=>s.instructor).map(s=>s.instructor)).size;
                  const sessionCount = sessions.length;
                  return (
                    <motion.div variants={itemVariants}>
                      <div className="lp-bento-card" style={{ ...cardBase, padding:"28px 28px 24px", display:"flex", alignItems:"center", gap:18 }}>
                        <div style={{ width:52, height:52, borderRadius:12, background:"rgba(249,115,22,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <Icon name="users" size={26} color="#f97316"/>
                        </div>
                        <div>
                          <div style={{ fontSize:16, fontWeight:600, color:T.text, lineHeight:1.3 }}>{speakerCount} speakers</div>
                          <div style={{ fontSize:16, fontWeight:600, color:T.text, lineHeight:1.4 }}>and {sessionCount} sessions</div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}

                {/* Card 3 — Professional Development Certificates */}
                <motion.div variants={itemVariants}>
                  <div className="lp-bento-card" style={{ ...cardBase, padding:"28px 28px 24px", display:"flex", alignItems:"center", gap:18 }}>
                    <div style={{ width:52, height:52, borderRadius:12, background:"rgba(249,115,22,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Icon name="certificate" size={26} color="#f97316"/>
                    </div>
                    <div>
                      <div style={{ fontSize:16, fontWeight:600, color:T.text, lineHeight:1.3 }}>Professional Development</div>
                      <div style={{ fontSize:16, fontWeight:600, color:T.text, lineHeight:1.4 }}>Certificates</div>
                    </div>
                  </div>
                </motion.div>

              </motion.div>
            );
          })()}
        </div>
      </section>

      {/* ── Instructors ── */}
      <section id="instructors" style={{ padding:"80px 0", borderBottom:`1px solid ${T.border}`, overflowX:"clip", position:"relative" }}>
        <style>{`
          @keyframes spk-marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(calc(-50% - 12px)); }
          }
          .spk-track {
            display: flex;
            gap: 20px;
            width: max-content;
            animation: spk-marquee 36s linear infinite;
          }
          .spk-track:hover { animation-play-state: paused; }

          /* Card = just the image container, no separate plate */
          .spk-card {
            width: 100%;
            border-radius: 20px;
            overflow: hidden;
            background: #e5e7eb;
            cursor: pointer;
            position: relative;
            transition: transform 220ms cubic-bezier(0.23,1,0.32,1), box-shadow 220ms cubic-bezier(0.23,1,0.32,1);
          }
          @media (hover: hover) and (pointer: fine) {
            .spk-card:hover {
              
              
            }
            /* Slightly stronger scrim on hover */
            .spk-card:hover .spk-overlay {
              background: linear-gradient(180deg, transparent 0%, rgba(43, 38, 32, 0.45) 35%, rgba(43, 38, 32, 0.94) 100%);
            }
          }
          .spk-card:active { transform: scale(0.97); }

          /* Full color always */
          .spk-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center 15%;
            display: block;
            filter: grayscale(0%);
            transition: transform 400ms cubic-bezier(0.23,1,0.32,1);
          }

          /* Name/role overlay — warm dark scrim on the photo */
          .spk-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 28px 16px 14px;
            background: linear-gradient(180deg, transparent 0%, rgba(43, 38, 32, 0.38) 40%, rgba(43, 38, 32, 0.88) 100%);
            border-radius: 0 0 20px 20px;
            transition: background 220ms ease;
          }
          .spk-overlay-name {
            font-weight: 700;
            font-size: 14px;
            color: #FEF5EC;
            line-height: 1.3;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .spk-overlay-role {
            font-size: 12px;
            color: rgba(254, 245, 236, 0.78);
            margin-top: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          @media (max-width: 900px) { .spk-grid { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 500px) { .spk-grid { grid-template-columns: 1fr !important; } }

          .spk-fade-l {
            position: absolute; top: 0; left: 0; z-index: 10;
            height: 100%; width: 120px;
            background: linear-gradient(to right, var(--spk-bg-fade), transparent);
            pointer-events: none;
          }
          .spk-fade-r {
            position: absolute; top: 0; right: 0; z-index: 10;
            height: 100%; width: 120px;
            background: linear-gradient(to left, var(--spk-bg-fade), transparent);
            pointer-events: none;
          }
        `}</style>

        {/* CSS vars for theme */}
        <div className="spk-section-inner" style={{ "--spk-border": T.border, "--spk-bg": T.bg, "--spk-bg-fade": T.bg, maxWidth:1200, margin:"0 auto", padding:"0 32px" }}>

          {/* Header */}
          <div style={{ maxWidth:1200, margin:"0 auto 56px", padding:"0 24px", display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:12 }}>
            <p style={{ margin:0, fontSize:13, fontWeight:700, color:T.muted, letterSpacing:1, textTransform:"uppercase" }}>Speakers</p>
            <h2 style={{ margin:0, fontSize:"clamp(32px,4vw,48px)", fontWeight:900, color:T.text, letterSpacing:-1, lineHeight:1.15 }}>
              {experts.length > 0 ? `${experts.length} experts.` : "Our experts."} Real strategies.
            </h2>
            <p style={{ margin:0, fontSize:16, color:T.muted, maxWidth:520, lineHeight:1.65 }}>
              People who have been there and done that — sharing practical tips you can use from the comfort of your home.
            </p>
          </div>

          {/* Responsive speaker grid */}
          <div className="spk-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:20, padding:"8px 0 16px" }}>
            {experts.map((e, i) => (
              <div key={i} className="spk-card"
                onClick={() => { savedScrollY.current = window.scrollY; setSelectedInstructor(e); window.scrollTo(0, 0); }}
                style={{ position:"relative", borderRadius:16, overflow:"hidden", cursor:"pointer" }}>
                <div style={{ height:"368px", overflow:"hidden" }}>
                  <img className="spk-img" src={e.img} alt={e.name}/>
                </div>
                <div className="spk-overlay">
                  <div className="spk-overlay-name">{e.name}</div>
                  <div className="spk-overlay-role">{e.role}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Apply banner */}
          <div style={{ maxWidth:1200, margin:"48px auto 0", padding:0 }}>
            <div className="lp-apply-banner" style={{ borderRadius:16, background:T.bg, border:`1px solid ${T.border}`, padding:"22px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:24 }}>
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                <div style={{ width:40, height:40, borderRadius:10, background:"rgba(245,158,11,0.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Icon name="student" size={20} color="#d97706"/>
                </div>
                <div>
                  <div style={{ fontWeight:700, fontSize:15, color:T.text, marginBottom:2 }}>Want to share your expertise in special education?</div>
                  <div style={{ fontSize:13, color:T.muted, lineHeight:1.5 }}>Join our speaker lineup at SPED Summit — applications are open.</div>
                </div>
              </div>
              <button onClick={()=>setShowAuth(true)}
                className="lp-apply-banner-btn"
                style={{ flexShrink:0, padding:"0 20px", height:40, background:"transparent", color:T.text, border:`1.5px solid ${T.border}`, borderRadius:10, fontSize:13, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap", transition:"border-color 150ms, background 150ms" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=T.blue; e.currentTarget.style.color=T.blue; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.text; }}>
                Apply to Speak
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Giveaways ── */}
      {(()=>{
        function SpotlightCard({ children, spotlightColor="rgba(0,0,0,0.06)", style={} }) {
          const ref = useRef(null);
          const [pos, setPos] = useState({ x:0, y:0 });
          const [opacity, setOpacity] = useState(0);
          return (
            <div ref={ref}
              style={{ position:"relative", overflow:"hidden", borderRadius:16, border:`1px solid ${T.border}`, background:"#FEF5EC", boxShadow:"0 1px 4px rgba(0,0,0,0.04)", ...style }}
            >
              <div style={{ position:"relative", zIndex:1 }}>{children}</div>
            </div>
          );
        }

        const prizes = [
          { icon:"coffee",   iconColor:"#d97706", iconBg:"#fef9c3", spotlight:"rgba(217,119,6,0.08)",   title:"Starbucks Gift Cards",       desc:"Fuel your grading sessions — $25 gift cards raffled every day of the summit.",         value:"$25 each" },
          { icon:"book-open",iconColor:"#2563eb", iconBg:"#dbeafe", spotlight:"rgba(37,99,235,0.08)",   title:"TpT Resource Bundles",       desc:"Premium Teachers Pay Teachers bundles handpicked for SPED classrooms.",               value:"$50 value" },
          { icon:"target",   iconColor:"#7c3aed", iconBg:"#ede9fe", spotlight:"rgba(124,58,237,0.08)",  title:"AbleSpace Pro Subscriptions",desc:"Full-year AbleSpace Pro access — IEP goal tracking built for special educators.",        value:"$120/yr" },
          { icon:"gift",     iconColor:"#be185d", iconBg:"#fce7f3", spotlight:"rgba(190,24,93,0.07)",   title:"Surprise Mystery Gifts",     desc:"Branded SPED Summit swag packs and surprise items revealed live during sessions.",      value:"Surprise!" },
          { icon:"trophy",   iconColor:"#059669", iconBg:"#d1fae5", spotlight:"rgba(5,150,105,0.08)",   title:"Grand Prize Bundle",         desc:"Complete the full summit + pass all quizzes to enter the $500 grand prize drawing.",    value:"$500+" },
          { icon:"star",     iconColor:"#ea580c", iconBg:"#ffedd5", spotlight:"rgba(234,88,12,0.08)",   title:"Quiz Champion Prizes",       desc:"Top quiz scorers each day win exclusive educator resource packs from our sponsors.",    value:"Daily" },
        ];

        return (
          <section style={{ padding:"80px 24px", borderBottom:`1px solid ${T.border}`, background:T.bg }}>
            <div style={{ maxWidth:1100, margin:"0 auto" }}>
              {/* Header */}
              <div style={{ textAlign:"center", marginBottom:64 }}>
                <p style={{ margin:"0 0 12px", fontSize:13, fontWeight:600, color:T.muted, letterSpacing:.5, textTransform:"uppercase" }}>Prizes & Giveaways</p>
                <h2 style={{ margin:"0 0 16px", fontSize:"clamp(32px,4vw,48px)", fontWeight:800, color:T.text, letterSpacing:-1.5, lineHeight:1.1 }}>
                  Win over <span style={{ background:"linear-gradient(90deg,#f59e0b,#e83e8c)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>$10,000+</span> in prizes
                </h2>
                <p style={{ margin:"0 auto", fontSize:17, color:T.muted, lineHeight:1.7, maxWidth:520 }}>
                  Learn, engage, and win. Multiple giveaways happen throughout the summit — the more you participate, the more chances you get.
                </p>
              </div>

              {/* Grid */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }} className="giveaway-grid">
                {prizes.map(({ icon, iconColor, iconBg, spotlight, title, desc, value }, i) => (
                  <SpotlightCard key={i} spotlightColor={spotlight}>
                    <div style={{ padding:"28px 28px 24px" }}>
                      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20 }}>
                        <div style={{ width:44, height:44, borderRadius:10, background:iconBg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <Icon name={icon} size={20} color={iconColor}/>
                        </div>
                        <span style={{ fontSize:11, fontWeight:700, color:iconColor, background:iconBg, border:`1px solid ${iconColor}30`, borderRadius:99, padding:"3px 10px", letterSpacing:.5 }}>
                          {value}
                        </span>
                      </div>
                      <h3 style={{ margin:"0 0 10px", fontSize:16, fontWeight:700, color:T.text, lineHeight:1.3 }}>{title}</h3>
                      <p style={{ margin:0, fontSize:13, color:T.muted, lineHeight:1.65 }}>{desc}</p>
                    </div>
                  </SpotlightCard>
                ))}
              </div>

              {/* CTA */}
              {!isLoggedIn && <div style={{ textAlign:"center", marginTop:48 }}>
                <button onClick={()=>setShowAuth(true)}
                  style={{ padding:"12px 32px", background:T.blue, color:"#fff", border:"none", borderRadius:10, fontSize:15, fontWeight:700, cursor:"pointer", transition:"background .12s" }}
                  onMouseEnter={e=>e.currentTarget.style.background=T.blueHov}
                  onMouseLeave={e=>e.currentTarget.style.background=T.blue}>
                  Sign in
                </button>
              </div>}
            </div>
            <style>{`@media(max-width:900px){.giveaway-grid{grid-template-columns:repeat(2,1fr)!important}} @media(max-width:600px){.giveaway-grid{grid-template-columns:1fr!important}}`}</style>
          </section>
        );
      })()}

      {/* ── Featured Sessions ── */}
      <section id="sessions" className="lp-section-pad" style={{ padding:"80px 24px", borderBottom:`1px solid ${T.border}`, background:T.bg }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom:40 }}>
            <p style={{ margin:"0 0 8px", fontSize:13, fontWeight:600, color:T.muted, letterSpacing:.5, textTransform:"uppercase" }}>Upcoming Schedule</p>
            <h2 style={{ margin:0, fontSize:"clamp(28px,4vw,40px)", fontWeight:800, color:T.text, letterSpacing:-1, lineHeight:1.1 }}>Spring 2026 Sessions</h2>
            <p style={{ margin:"8px 0 0", fontSize:15, color:T.muted }}>Register for these upcoming live sessions — free for all educators.</p>
          </div>

          {/* Session cards — sourced from Supabase via sessions prop */}
          {(()=>{
            const CAT_BADGE = {
              "TECHNOLOGY":    { label:"Technology",    bg:"rgba(234,179,8,0.15)",   color:"#fbbf24" },
              "ACCESSIBILITY": { label:"Accessibility", bg:"rgba(139,92,246,0.15)",  color:"#a78bfa" },
              "MANAGEMENT":    { label:"Management",    bg:"rgba(59,130,246,0.15)",  color:"#60a5fa" },
              "LEADERSHIP":    { label:"Leadership",    bg:"rgba(16,185,129,0.15)",  color:"#34d399" },
              "COMMUNICATION": { label:"Communication", bg:"rgba(249,115,22,0.15)",  color:"#fb923c" },
              "TEAMWORK":      { label:"Teamwork",      bg:"rgba(168,85,247,0.15)",  color:"#c084fc" },
            };

            // Format availableFrom date/time for display (local timezone)
            const fmtDateTime = (iso) => {
              if (!iso) return { date: "", time: "" };
              const d = parseLocalDate(iso);
              if (!d) return { date: "", time: "" };
              const date = d.toLocaleDateString("en-US", { month:"short", day:"numeric" });
              const time = d.toLocaleTimeString("en-US", { hour:"numeric", minute:"2-digit", hour12:true });
              return { date, time };
            };

            const now = new Date();
            // Show all admin-uploaded sessions. The availableFrom date controls button
            // state (Watch Now vs locked), not whether the card appears here.
            // Deduplicate at render to guard against any state timing issues
            const _seenIds = new Set();
            const gridSessions = sessions
              .filter(s => { if (_seenIds.has(s.id)) return false; _seenIds.add(s.id); return true; })
              .slice()
              .sort((a, b) => {
                const da = a.availableFrom ? new Date(a.availableFrom).getTime() : Infinity;
                const db = b.availableFrom ? new Date(b.availableFrom).getTime() : Infinity;
                return da - db;
              });

            if (sessionsLoading || gridSessions.length === 0) {
              return (
                <div style={{ textAlign:"center", padding:"48px 0", color:T.muted, fontSize:15 }}>
                  {sessionsLoading ? "Loading sessions…" : "No sessions uploaded yet. Check back soon."}
                </div>
              );
            }

            return (
              <div className="lp-sessions-grid" style={{ display:"grid", gap:16, width:"100%" }}>
                {gridSessions.map(s => {
                  const catBadge = CAT_BADGE[s.category] || { label:s.category || "Session", bg:C.gray100, color:C.gray700 };
                  const avatarSrc = s.instructorImage || INSTRUCTOR_AVATARS[s.instructor];
                  const sessionState = getSessionState(s);
                  const isAvailable = sessionState === "live";
                  const { date, time } = fmtDateTime(s.availableFrom || s.available_from);
                  const ctaLabel = isLoggedIn ? (isAvailable ? "Watch Now" : (date ? `Available ${date}` : "Coming Soon")) : "Register Now";
                  const cardClickable = !isLoggedIn || isAvailable;
                  const handleCardClick = () => {
                    if (isLoggedIn && isAvailable) { onWatchSession ? onWatchSession(s) : onGetStarted(s.id); }
                    else if (!isLoggedIn) { setShowAuth(true); }
                  };
                  return (
                    <div key={s.id} className="lp-session-card"
                      style={{ background:"#FEF5EC", border:`1px solid ${T.border}`, borderRadius:12, boxShadow:"0 8px 24px rgba(43, 46, 51, 0.08), 0 2px 6px rgba(43, 46, 51, 0.04)", display:"flex", flexDirection:"column", alignItems:"stretch", overflow:"hidden", cursor: cardClickable ? "pointer" : "default", height:"100%", opacity: 1 }}
                      onClick={handleCardClick}>

                      {/* ── Top: instructor image with name/role overlay ── */}
                      <div className="lp-session-card-img" style={{ flexShrink:0, width:"100%", height:220, position:"relative", background:C.gray200 }}>
                        {avatarSrc
                          ? <img src={avatarSrc} alt={s.instructor} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top center", display:"block" }}/>
                          : <div style={{ width:"100%", height:"100%", background:"linear-gradient(135deg,#1e3a5f,#2d5a9e)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                              <span style={{ fontSize:40, fontWeight:800, color:"rgba(255,255,255,0.3)" }}>{(s.instructor||"?")[0]}</span>
                            </div>
                        }
                        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)", pointerEvents:"none" }}/>
                        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"10px 12px 12px" }}>
                          <div style={{ fontSize:14, fontWeight:700, color:"#fff", lineHeight:1.2 }}>{s.instructor?.split("|")[0]?.trim()}</div>
                          {(s.instructorDesignation || s.instructor?.includes("|")) && (
                            <div style={{ fontSize:12, color:"rgba(255,255,255,0.75)", marginTop:2 }}>{s.instructorDesignation || s.instructor.split("|")[1]?.trim()}</div>
                          )}
                        </div>
                      </div>

                      {/* ── Bottom: session details ── */}
                      <div style={{ flex:1, minWidth:0, padding:"14px 16px 16px", display:"flex", flexDirection:"column", gap:8 }}>
                        {/* Date pill — highlighted, above title */}
                        {(date || time) && (
                          <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(245,158,11,0.12)", color:"#b45309", border:"1px solid rgba(245,158,11,0.25)", borderRadius:6, padding:"4px 9px", fontSize:11, fontWeight:700, marginBottom:8, alignSelf:"flex-start" }}>
                            <Icon name="calendar" size={11} color="#b45309"/>
                            {[date, time].filter(Boolean).join(" · ")}
                          </div>
                        )}
                        {/* Session title */}
                        <div style={{ fontSize:15, fontWeight:700, color:C.gray900, lineHeight:1.35, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{s.title}</div>
                        <div style={{ fontSize:12, color:C.gray600, lineHeight:1.5, flex:1, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                          {s.description}
                        </div>
                        <button
                          onClick={e=>{ e.stopPropagation(); handleCardClick(); }}
                          disabled={isLoggedIn && !isAvailable}
                          style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", padding:"0 13px", height:36, background: isLoggedIn && !isAvailable ? "#c0c4cc" : T.blue, color:"#fff", border:"none", borderRadius:7, fontSize:13, fontWeight:600, cursor: cardClickable ? "pointer" : "default", fontFamily:"inherit", transition:"background .12s" }}
                          onMouseEnter={e=>{ if(cardClickable) e.currentTarget.style.background=T.blueHov; }}
                          onMouseLeave={e=>{ if(cardClickable) e.currentTarget.style.background= isLoggedIn && !isAvailable ? "#c0c4cc" : T.blue; }}>
                          {ctaLabel}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </section>

      {/* ── Community ── */}
      <section style={{ padding:"80px 24px", borderBottom:`1px solid ${T.border}`, background:T.bg, textAlign:"center" }}>
        <div style={{ maxWidth:560, margin:"0 auto" }}>
          <p style={{ margin:"0 0 8px", fontSize:13, fontWeight:600, color:T.muted, letterSpacing:.5, textTransform:"uppercase" }}>Community</p>
          <h2 style={{ margin:"0 0 12px", fontSize:"clamp(32px,4vw,48px)", fontWeight:800, color:T.text, letterSpacing:-1, lineHeight:1.2 }}>Connect with educators across the country</h2>
          <p style={{ margin:"0 0 36px", fontSize:16, color:T.muted, lineHeight:1.6 }}>
            Stay in the loop — follow us for session updates, announcements, and community highlights.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:12, maxWidth:320, margin:"0 auto" }}>
            <button style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"0 20px", height:44, width:"100%", background:"#1877f2", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:600, cursor:"pointer", transition:"opacity .12s" }}
              onMouseEnter={e=>e.currentTarget.style.opacity=".88"}
              onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
              Join the Facebook Group
            </button>
            <button style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"0 20px", height:44, width:"100%", background:"linear-gradient(135deg,#e1306c,#f77737)", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:600, cursor:"pointer", transition:"opacity .12s" }}
              onMouseEnter={e=>e.currentTarget.style.opacity=".88"}
              onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              Follow on Instagram
            </button>
          </div>
        </div>
      </section>

      {/* ── Testimonials (V2 style) ── */}
      <section style={{ background:T.bg, padding:"80px 24px 48px", borderBottom:`1px solid ${T.border}` }}>
        <style>{`
          .t1-col2{display:none}.t1-col3{display:none}
          @media(min-width:768px){.t1-col2{display:block}}
          @media(min-width:1100px){.t1-col3{display:block}}
          .t1-desktop{display:flex}
          .t1-mobile{display:none}
          @media(max-width:767px){
            .t1-desktop{display:none !important}
            .t1-mobile{display:block !important}
            .t1-mobile-track { display:flex; gap:16px; animation:t1-hscroll 28s linear infinite; width:max-content; }
            .t1-mobile-track:hover { animation-play-state:paused; }
            @keyframes t1-hscroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
          }
        `}</style>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <p style={{ margin:"0 0 12px", fontSize:13, fontWeight:700, color:T.muted, letterSpacing:1, textTransform:"uppercase" }}>Testimonials</p>
            <h2 style={{ margin:"0 0 16px", fontSize:"clamp(28px,4vw,52px)", fontWeight:900, color:T.text, letterSpacing:-1.5, lineHeight:1.1 }}>
              What educators are saying
            </h2>
            <p style={{ margin:0, fontSize:16, color:T.muted, maxWidth:480, marginInline:"auto" }}>
              Real feedback from SPED educators who completed the summit.
            </p>
          </div>

          {/* Desktop: vertical scrolling columns */}
          <div className="t1-desktop" style={{ justifyContent:"center", gap:20, maxHeight:740, overflow:"hidden", maskImage:"linear-gradient(to bottom,transparent,black 15%,black 85%,transparent)", WebkitMaskImage:"linear-gradient(to bottom,transparent,black 15%,black 85%,transparent)" }}>
            <V1TestiCol items={v1Testimonials.slice(0,3)} duration={15}/>
            <div className="t1-col2"><V1TestiCol items={v1Testimonials.slice(3,6)} duration={19}/></div>
            <div className="t1-col3"><V1TestiCol items={v1Testimonials.slice(6,9)} duration={17}/></div>
          </div>

          {/* Mobile: horizontal auto-scrolling strip */}
          <div className="t1-mobile" style={{ overflow:"hidden", maskImage:"linear-gradient(to right,transparent,black 8%,black 92%,transparent)", WebkitMaskImage:"linear-gradient(to right,transparent,black 8%,black 92%,transparent)" }}>
            <div className="t1-mobile-track">
              {[...v1Testimonials, ...v1Testimonials].map((t,i) => (
                <div key={i} style={{ width:280, height:220, flexShrink:0, boxSizing:"border-box" }}>
                  <V1TestiCard t={t} overrideWidth={280} fixedHeight={220}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <V1PricingSection onGetStarted={onGetStarted} isLoggedIn={isLoggedIn} />

      {/* ── FAQ ── */}
      <section id="help" style={{ padding:"80px 24px", borderBottom:`1px solid ${T.border}`, background:T.bg }}>
        <div style={{ maxWidth:680, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <p style={{ margin:"0 0 8px", fontSize:13, fontWeight:600, color:T.muted, letterSpacing:.5, textTransform:"uppercase" }}>FAQ</p>
            <h2 style={{ margin:0, fontSize:"clamp(32px,4vw,48px)", fontWeight:800, color:T.text, letterSpacing:-1 }}>Frequently asked questions</h2>
          </div>
          {faqs.map((f,i)=>(
            <div key={i} style={{ borderBottom:`1px solid ${T.border}` }}>
              <button onClick={()=>setFaqOpen(faqOpen===i?null:i)}
                style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 0", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}
                onMouseEnter={e=>e.currentTarget.style.opacity=".85"}
                onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                <span style={{ fontSize:15, fontWeight:600, color:T.text, flex:1, paddingRight:16 }}>{f.q}</span>
                <span style={{ fontSize:18, color:T.muted, flexShrink:0, transform: faqOpen===i?"rotate(45deg)":"none", display:"block", transition:"transform .2s", lineHeight:1 }}>+</span>
              </button>
              {faqOpen===i && (
                <div style={{ fontSize:14, color:T.muted, lineHeight:1.7, paddingBottom:18, whiteSpace:"pre-line" }}>{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Accordion Feature Section ── */}
      <SpAccordionFeature T={T} />

      {/* ── Footer ── */}
      <footer style={{ background:T.bg }}>

        {/* CTA band */}
        <div style={{ padding:"80px 24px", borderBottom:`1px solid ${T.border}`, background:T.bg }}>
          <div className="lp-footer-cta" style={{ maxWidth:1024, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", gap:40, flexWrap:"wrap" }}>
            <div style={{ flex:1, minWidth:280 }}>
              <h2 style={{ margin:"0 0 12px", fontSize:"clamp(32px,4vw,48px)", fontWeight:800, color:T.text, lineHeight:1.1, letterSpacing:-1.5 }}>
                Connect with educators<br/>across the country?
              </h2>
              <p style={{ margin:0, fontSize:16, color:T.muted, lineHeight:1.6 }}>
                Join 4,200+ educators. Free sessions, real certificates, expert instructors.
              </p>
            </div>
            <div className="lp-footer-cta-btns" style={{ display:"flex", gap:10, flexShrink:0 }}>
              <button onClick={()=>isLoggedIn ? onGoToDashboard?.("dashboard") : setShowAuth(true)}
                style={{ padding:"0 24px", height:42, background:T.blue, color:"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:600, cursor:"pointer", transition:"background .12s" }}
                onMouseEnter={e=>e.currentTarget.style.background=T.blueHov}
                onMouseLeave={e=>e.currentTarget.style.background=T.blue}>
                {isLoggedIn ? "Go to Dashboard" : "Sign in"}
              </button>
              <button onClick={()=>document.getElementById("sessions")?.scrollIntoView({ behavior:"smooth" })}
                style={{ padding:"0 24px", height:42, background:"transparent", color:T.text, border:`1px solid ${T.border}`, borderRadius:8, fontSize:14, fontWeight:500, cursor:"pointer", transition:"background .15s, border-color .15s" }}
                onMouseEnter={e=>{ e.currentTarget.style.background="rgba(0,0,0,0.06)"; e.currentTarget.style.borderColor="rgba(0,0,0,0.3)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor=T.border; }}>
                View sessions
              </button>
            </div>
          </div>
        </div>

        {/* Footer columns */}
        <div className="lp-footer-cols-wrap" style={{ padding:"56px 24px 48px", borderBottom:`1px solid ${T.border}` }}>
          <div className="lp-footer-cols" style={{ maxWidth:1024, margin:"0 auto", display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:48 }}>
            {/* Brand column */}
            <div className="lp-footer-brand">
              <img src="/Container.png" alt="SPED Summit" style={{ height:26, display:"block", marginBottom:16 }}/>
              <p style={{ margin:"0 0 24px", fontSize:14, color:T.muted, lineHeight:1.7, maxWidth:280 }}>
                SPED Summit is a free professional development platform for Special Education professionals — built by educators, for educators.
              </p>
            </div>

            {/* About column */}
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:T.text, letterSpacing:.8, textTransform:"uppercase", marginBottom:16 }}>About</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {["Sessions","Speakers","FAQ","Contact"].map(l => (
                  <a key={l} href="#"
                    onClick={e=>{ e.preventDefault(); const sectionMap={"Sessions":"sessions","Speakers":"instructors","FAQ":"help"}; if(sectionMap[l]){ document.getElementById(sectionMap[l])?.scrollIntoView({behavior:"smooth"}); } if(l==="Contact"){ sessionStorage.setItem("page","contact"); sessionStorage.setItem("showLanding","0"); window.location.href=window.location.origin; } }}
                    style={{ fontSize:14, color:T.muted, textDecoration:"none", transition:"color .12s" }}
                    onMouseEnter={e=>e.currentTarget.style.color=T.text}
                    onMouseLeave={e=>e.currentTarget.style.color=T.muted}>{l}</a>
                ))}
              </div>
            </div>

            {/* Connect column */}
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:T.text, letterSpacing:.8, textTransform:"uppercase", marginBottom:16 }}>Connect</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {[
                  { label:"Facebook",  svg:"M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" },
                  { label:"Instagram", svg:"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                  { label:"YouTube",   svg:"M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" },
                ].map(({ label, svg }) => (
                  <a key={label} href="#" style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:14, color:T.muted, textDecoration:"none", transition:"color .12s" }}
                    onMouseEnter={e=>e.currentTarget.style.color=T.text}
                    onMouseLeave={e=>e.currentTarget.style.color=T.muted}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d={svg}/></svg>
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Legal column */}
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:T.text, letterSpacing:.8, textTransform:"uppercase", marginBottom:16 }}>Legal</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {["Privacy Policy","Terms of Service"].map(l => (
                  <a key={l} href="#"
                    onClick={e=>{ e.preventDefault(); if(l==="Privacy Policy"){ sessionStorage.setItem("page","privacy-policy"); sessionStorage.setItem("showLanding","0"); sessionStorage.setItem("legalReturnTo","landing"); window.location.href=window.location.origin; } if(l==="Terms of Service"){ sessionStorage.setItem("page","terms-of-service"); sessionStorage.setItem("showLanding","0"); sessionStorage.setItem("legalReturnTo","landing"); window.location.href=window.location.origin; } }}
                    style={{ fontSize:14, color:T.muted, textDecoration:"none", transition:"color .12s" }}
                    onMouseEnter={e=>e.currentTarget.style.color=T.text}
                    onMouseLeave={e=>e.currentTarget.style.color=T.muted}>{l}</a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright strip */}
        <div style={{ padding:"16px 24px", display:"flex", justifyContent:"center" }}>
          <span style={{ fontSize:12, color:T.muted }}>© 2026 SPED Summit. All rights reserved.</span>
        </div>

      </footer>

      {showAuth && <AuthModal onClose={()=>setShowAuth(false)} onLogin={(role)=>onGetStarted(null,role)}/>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LANDING PAGE V2  ·  Bold + Animated  (askape.com-inspired for education)
───────────────────────────────────────────────────────────────────────────── */
function LandingPageV2({ onGetStarted, sessions = [] }) {
  const [showAuth, setShowAuth] = useState(false);

  const T2 = {
    bg:      "#fffdf7",
    section: "#f0ece4",
    dark:    "#120a24",
    text:    "#1a1a1a",
    muted:   "#6b6375",
    border:  "rgba(0,0,0,0.08)",
    hover:   "rgba(0,0,0,0.04)",
    accent:  "#8a46ff",
    pink:    "#e83e8c",
    blue:    T.blue,
  };

  // Derive experts from sessions — deduplicated by instructor name, only those with images
  const seen_e = new Set();
  const experts = sessions
    .filter(s => s.instructor && s.instructorImage)
    .slice().sort((a, b) => {
      const da = a.availableFrom ? new Date(a.availableFrom).getTime() : Infinity;
      const db = b.availableFrom ? new Date(b.availableFrom).getTime() : Infinity;
      return da - db;
    })
    .filter(s => { if (seen_e.has(s.instructor)) return false; seen_e.add(s.instructor); return true; })
    .map(s => {
      const parts = s.instructor.split("|").map(p => p.trim());
      return { name: parts[0] || s.instructor, role: parts[1] || "", img: s.instructorImage,
               bio: s.instructorBio || "", session: s.title, sessionDesc: s.description || "", highlights: [] };
    });

  const BUBBLES = [
    { icon:"student",      size:70, bg:"linear-gradient(135deg,#8a46ff,#a855f7)", top:"14%", left:"7%",   dur:4.5, del:0    },
    { icon:"book-open",    size:52, bg:`linear-gradient(135deg,${T.blue},#3b82f6)`, top:"32%", left:"4%",   dur:5.2, del:0.8  },
    { icon:"star",         size:42, bg:"linear-gradient(135deg,#f59e0b,#fbbf24)", top:"58%", left:"8%",   dur:3.8, del:1.5  },
    { icon:"certificate",  size:56, bg:"linear-gradient(135deg,#059669,#10b981)", top:"74%", left:"5%",   dur:4.2, del:0.3  },
    { icon:"trophy",       size:62, bg:"linear-gradient(135deg,#f59e0b,#f97316)", top:"15%", right:"7%",  dur:3.9, del:1.2  },
    { icon:"lightning",    size:42, bg:"linear-gradient(135deg,#e83e8c,#ec4899)", top:"38%", right:"4%",  dur:5.5, del:0.5  },
    { icon:"gift",         size:50, bg:"linear-gradient(135deg,#6490E8,#8b5cf6)", top:"62%", right:"6%",  dur:4.0, del:2.0  },
    { icon:"medal",        size:46, bg:"linear-gradient(135deg,#0891b2,#06b6d4)", top:"80%", right:"8%",  dur:4.7, del:0.9  },
    { icon:"check-circle", size:30, bg:`linear-gradient(135deg,${T.green},${T.blue})`, top:"88%", left:"14%",  dur:3.5, del:0.4  },
    { icon:"users",        size:34, bg:"linear-gradient(135deg,#8a46ff,#e83e8c)", top:"8%",  right:"18%", dur:6.0, del:1.8  },
  ];

  const MARQUEE = ["9 Expert Sessions","Free Certificates","Win Ablespace Pro","Interactive Quizzes","SPED Specialists","4,200+ Educators","IEP Strategies","AAC Implementation","Behavior Support","Structured Literacy"];

  const FEATURES = [
    { icon:"play-circle",  title:"9 Expert Sessions",       desc:"Live and on-demand video from certified SPED specialists you can rewatch anytime." },
    { icon:"question",     title:"Interactive Quizzes",     desc:"Knowledge checks after every session to reinforce learning and track your progress." },
    { icon:"certificate",  title:"Real Certificates",       desc:"Downloadable completion certificates, automatically generated when you finish." },
    { icon:"gift",         title:"Win Prizes",              desc:"Pass all quizzes and your certificate enters you in the Ablespace Pro prize draw." },
    { icon:"users",        title:"9 SPED Experts",          desc:"Practitioners from mindfulness, AAC, behavior analysis, IEP design, and more." },
    { icon:"clock",        title:"Learn at Your Pace",      desc:"All sessions are recorded. Watch live or replay — no pressure, no deadlines." },
  ];

  const TESTIMONIALS = [
    { text:"This is, by far, the best presentation of the summit. It kept my attention the whole time.", name:"April M.", role:"SPED Educator", img:"" },
    { text:"The session was highly informative and practical. The speaker presented evidence-based, neurodiversity-affirming strategies that were clearly explained and directly applicable to educational and therapeutic settings.", name:"Auhen Cleo Faith C.", role:"SPED Educator", img:"" },
    { text:"The discussion reminded us that we cannot give our best to our students if we do not take care of ourselves first. It highlighted the value of setting healthy boundaries and preventing burnout.", name:"Erwin G. B.", role:"SPED Educator", img:"" },
  ];

  const S = { /* inline style helpers */
    section: (extra={}) => ({ padding:"96px 24px", ...extra }),
    inner:   (mw=1024)  => ({ maxWidth:mw, margin:"0 auto" }),
  };

  return (
    <div style={{ minHeight:"100vh", fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif", background:T2.bg, overflowX:"hidden", color:T2.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; } a { text-decoration: none; color: inherit; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:"rgba(255,253,247,0.95)", backdropFilter:"blur(8px)", borderBottom:`1px solid ${T2.border}`, height:60, display:"flex", alignItems:"center", padding:"0 24px" }}>
        <div style={{ maxWidth:1024, margin:"0 auto", width:"100%", display:"flex", alignItems:"center", gap:4 }}>
          <div style={{ marginRight:"auto", cursor:"pointer" }} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>
            <img src="/Container.png" alt="SPED Summit" style={{ height:28, display:"block" }}/>
          </div>
          {[["Sessions","sessions"],["Speakers","instructors-v2"],["FAQ","faq-v2"]].map(([l,id])=>(
            <button key={l} onClick={()=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"})}
              style={{ background:"none", border:"none", fontSize:14, color:T2.muted, cursor:"pointer", padding:"4px 12px", borderRadius:7, height:32, transition:"all .12s" }}
              onMouseEnter={e=>{ e.currentTarget.style.background=T2.hover; e.currentTarget.style.color=T2.text; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="none"; e.currentTarget.style.color=T2.muted; }}>{l}</button>
          ))}
          <button onClick={()=>setShowAuth(true)}
            style={{ marginLeft:8, padding:"0 18px", height:38, background:T2.accent, color:"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:700, cursor:"pointer", transition:"all .15s", boxShadow:`0 2px 0 0 #5b21b6` }}
            onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 4px 0 0 #5b21b6"; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 2px 0 0 #5b21b6"; }}>
            Sign in
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ paddingTop:60, minHeight:"100vh", background:T2.bg, position:"relative", overflow:"hidden", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>

        {/* Floating bubbles */}
        {BUBBLES.map((b,i)=>(
          <div key={i} style={{ position:"absolute", top:b.top, left:b.left||undefined, right:b.right||undefined, pointerEvents:"none", zIndex:0, animation:`floatBob ${b.dur}s ease-in-out ${b.del}s infinite` }}>
            <div style={{ width:b.size, height:b.size, borderRadius:"50%", background:b.bg, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 8px 28px rgba(0,0,0,0.18)", border:"3px solid rgba(255,255,255,0.7)" }}>
              <Icon name={b.icon} size={Math.round(b.size*0.44)} color="#fff" weight="fill"/>
            </div>
          </div>
        ))}

        {/* Content */}
        <div style={{ maxWidth:820, margin:"0 auto", padding:"100px 24px 80px", textAlign:"center", position:"relative", zIndex:1 }}>
          {/* Pill badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(138,70,255,0.1)", border:"1px solid rgba(138,70,255,0.22)", borderRadius:999, padding:"6px 18px", fontSize:13, fontWeight:600, color:T2.accent, marginBottom:36, animation:"v2FadeSlideUp 0.6s ease-out 0.1s both", opacity:0 }}>
            <Icon name="star" size={13} color={T2.accent} weight="fill"/> 100% Free · SPED Summit 2026
          </div>

          {/* Big headline */}
          <h1 style={{ margin:"0 0 28px", fontSize:"clamp(48px,7.5vw,84px)", fontWeight:900, color:T2.text, lineHeight:1.03, letterSpacing:-3.5, animation:"v2FadeSlideUp 0.7s ease-out 0.2s both", opacity:0 }}>
            The Best SPED<br/>
            Training.<br/>
            <span style={{ background:"linear-gradient(90deg,#8a46ff 0%,#c026d3 50%,#e83e8c 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              All Free.
            </span>
          </h1>

          {/* Sub */}
          <p style={{ margin:"0 0 44px", fontSize:19, color:T2.muted, lineHeight:1.65, maxWidth:540, marginLeft:"auto", marginRight:"auto", animation:"v2FadeSlideUp 0.7s ease-out 0.35s both", opacity:0 }}>
            9 expert sessions, interactive quizzes, real certificates, and a chance to win Ablespace Pro — completely free for SPED professionals.
          </p>

          {/* CTAs */}
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", marginBottom:32, animation:"v2FadeSlideUp 0.7s ease-out 0.5s both", opacity:0 }}>
            <button onClick={()=>setShowAuth(true)}
              style={{ padding:"0 36px", height:54, background:T2.accent, color:"#fff", border:"none", borderRadius:12, fontSize:16, fontWeight:700, cursor:"pointer", transition:"all .15s", boxShadow:`0 4px 0 0 #5b21b6, 0 8px 24px rgba(138,70,255,0.3)` }}
              onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 6px 0 0 #5b21b6, 0 12px 32px rgba(138,70,255,0.4)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 0 0 #5b21b6, 0 8px 24px rgba(138,70,255,0.3)"; }}>
              Start learning for free →
            </button>
            <button onClick={()=>document.getElementById("sessions")?.scrollIntoView({behavior:"smooth"})}
              style={{ padding:"0 32px", height:54, background:"transparent", color:T2.text, border:"2px solid rgba(0,0,0,0.14)", borderRadius:12, fontSize:16, fontWeight:600, cursor:"pointer", transition:"all .15s" }}
              onMouseEnter={e=>{ e.currentTarget.style.background=T2.hover; e.currentTarget.style.borderColor="rgba(0,0,0,0.28)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="rgba(0,0,0,0.14)"; }}>
              View sessions
            </button>
          </div>

          {/* Stacked avatars */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, animation:"v2FadeSlideUp 0.7s ease-out 0.65s both", opacity:0 }}>
            <div style={{ display:"flex" }}>
              {experts.slice(0,4).map((e,i)=>(
                <div key={i} style={{ width:34, height:34, borderRadius:"50%", overflow:"hidden", border:"2.5px solid #fff", marginLeft:i>0?-11:0, boxShadow:"0 2px 8px rgba(0,0,0,0.14)" }}>
                  <img src={e.img} alt={e.name} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 15%" }}/>
                </div>
              ))}
            </div>
            <span style={{ fontSize:14, color:T2.muted, fontWeight:500 }}>4,200+ educators enrolled</span>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ background:T2.dark, padding:"18px 0", overflow:"hidden" }}>
        <div style={{ display:"flex", animation:"marqueeLeft 25s linear infinite", width:"fit-content" }}>
          {[...MARQUEE,...MARQUEE].map((item,i)=>(
            <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"0 28px", fontSize:14, fontWeight:600, color:"rgba(255,255,255,0.7)", whiteSpace:"nowrap" }}>
              <span style={{ color:T2.accent, fontSize:16 }}>✦</span> {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── VALUE PROP ── */}
      <section style={{ ...S.section(), background:T2.section }}>
        <div style={{ ...S.inner(), display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }}>
          <div>
            <p style={{ margin:"0 0 12px", fontSize:13, fontWeight:700, color:T2.accent, textTransform:"uppercase", letterSpacing:1 }}>Why SPED Summit</p>
            <h2 style={{ margin:"0 0 20px", fontSize:"clamp(32px,4vw,52px)", fontWeight:900, color:T2.text, lineHeight:1.1, letterSpacing:-1.5 }}>
              Expert knowledge.<br/>Right here, right now.
            </h2>
            <p style={{ margin:"0 0 32px", fontSize:16, color:T2.muted, lineHeight:1.7 }}>
              Stop searching YouTube and Pinterest for SPED strategies. Get structured, evidence-based training from certified professionals who have spent careers in special education classrooms.
            </p>
            {["Watch 9 sessions from certified SPED specialists","Take quizzes to lock in your learning","Download your certificate of completion","Enter the Ablespace Pro prize draw automatically"].map((pt,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:14 }}>
                <div style={{ width:22, height:22, borderRadius:"50%", background:T2.accent, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                  <Icon name="check" size={12} color="#fff" weight="bold"/>
                </div>
                <span style={{ fontSize:15, color:T2.text, lineHeight:1.5 }}>{pt}</span>
              </div>
            ))}
          </div>
          {/* Visual: stacked feature cards */}
          <div style={{ position:"relative", height:420 }}>
            {[
              { top:0,   left:0,   right:40, bg:"#8a46ff", icon:"play-circle", label:"Session in progress", sub:"Mindfulness for SPED Educators", pct:65 },
              { top:160, left:40,  right:0,  bg:T.blue, icon:"certificate",  label:"Certificate earned",  sub:"Sarah Johnson · SPED Summit 2026", pct:100 },
              { top:290, left:0,   right:60, bg:"#059669", icon:"trophy",       label:"Prize draw entered",  sub:"Ablespace Pro · Jan 31 2026", pct:null },
            ].map((card,i)=>(
              <div key={i} style={{ position:"absolute", top:card.top, left:card.left, right:card.right, background:"#fff", borderRadius:18, padding:"18px 20px", boxShadow:"0 12px 40px rgba(0,0,0,0.1)", border:"1px solid rgba(0,0,0,0.05)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:card.pct!==null?12:0 }}>
                  <div style={{ width:40, height:40, borderRadius:12, background:card.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon name={card.icon} size={20} color="#fff"/>
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:T2.text }}>{card.label}</div>
                    <div style={{ fontSize:12, color:T2.muted }}>{card.sub}</div>
                  </div>
                </div>
                {card.pct !== null && (
                  <div style={{ height:4, background:T.hover, borderRadius:2, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${card.pct}%`, background:card.bg, borderRadius:2 }}/>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ ...S.section({ padding:"60px 24px" }), background:T2.bg, borderTop:`1px solid ${T2.border}`, borderBottom:`1px solid ${T2.border}` }}>
        <div style={{ ...S.inner(), display:"flex", justifyContent:"center", gap:80, flexWrap:"wrap" }}>
          {[{n:"4,200+",l:"educators enrolled"},{n:"9",l:"expert sessions"},{n:"100%",l:"free to attend"},{n:"$10k+",l:"in prizes"}].map((s,i)=>(
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ fontSize:48, fontWeight:900, color:T2.text, letterSpacing:-2, lineHeight:1 }}>{s.n}</div>
              <div style={{ fontSize:14, color:T2.muted, marginTop:6 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── INSTRUCTORS ── */}
      <section id="instructors-v2" style={{ ...S.section(), background:T2.section }}>
        <div style={{ ...S.inner(1200) }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <p style={{ margin:"0 0 12px", fontSize:13, fontWeight:700, color:T2.accent, textTransform:"uppercase", letterSpacing:1 }}>Speakers</p>
            <h2 style={{ margin:"0 0 14px", fontSize:"clamp(28px,4vw,48px)", fontWeight:900, color:T2.text, letterSpacing:-1.5, lineHeight:1.1 }}>
              Learn from the best.
            </h2>
            <p style={{ margin:0, fontSize:16, color:T2.muted }}>9 certified specialists who have spent careers in special education.</p>
          </div>
          {/* All 9 speakers — edge-to-edge same-height cards */}
          <div style={{ display:"flex", gap:0, overflowX:"auto", scrollbarWidth:"none", msOverflowStyle:"none", margin:"0 -24px", padding:"0 24px" }}>
            <style>{`.spk-v2-row::-webkit-scrollbar{display:none} .spk-v2-card:hover .spk-v2-img{transform:scale(1.06)}`}</style>
            <div className="spk-v2-row" style={{ display:"grid", gridTemplateColumns:`repeat(${experts.length},1fr)`, gap:0, width:"100%" }}>
              {experts.map((e,i)=>(
                <div key={i} className="spk-v2-card" style={{ position:"relative", overflow:"hidden", aspectRatio:"3/4", background:"#111", cursor:"pointer" }}
                  onClick={()=>setShowAuth(true)}>
                  <img className="spk-v2-img" src={e.img} alt={e.name} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 15%", display:"block", transition:"transform 0.5s ease" }}/>
                  {/* gradient overlay */}
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)" }}/>
                  {/* name / role */}
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"14px 12px" }}>
                    <div style={{ fontWeight:700, fontSize:13, color:"#fff", lineHeight:1.3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{e.name}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{e.role}</div>
                  </div>
                  {/* left divider except first */}
                  {i > 0 && <div style={{ position:"absolute", top:0, left:0, bottom:0, width:1, background:"rgba(255,255,255,0.1)" }}/>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ ...S.section(), background:T2.bg }}>
        <div style={{ ...S.inner() }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <p style={{ margin:"0 0 12px", fontSize:13, fontWeight:700, color:T2.accent, textTransform:"uppercase", letterSpacing:1 }}>Platform</p>
            <h2 style={{ margin:"0 0 14px", fontSize:"clamp(28px,4vw,48px)", fontWeight:900, color:T2.text, letterSpacing:-1.5 }}>Everything SPED teachers need.</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {FEATURES.map((f,i)=>(
              <div key={i} style={{ background:T2.bg, border:`1.5px solid ${T2.border}`, borderRadius:18, padding:"28px 24px", transition:"all .2s" }}
                onMouseEnter={e=>{ e.currentTarget.style.border=`1.5px solid rgba(138,70,255,0.3)`; e.currentTarget.style.boxShadow="0 8px 32px rgba(138,70,255,0.1)"; e.currentTarget.style.transform="translateY(-4px)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.border=`1.5px solid ${T2.border}`; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="translateY(0)"; }}>
                <div style={{ width:48, height:48, borderRadius:14, background:"rgba(138,70,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18 }}>
                  <Icon name={f.icon} size={24} color={T2.accent}/>
                </div>
                <div style={{ fontSize:16, fontWeight:700, color:T2.text, marginBottom:8 }}>{f.title}</div>
                <div style={{ fontSize:14, color:T2.muted, lineHeight:1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DARK CTA SECTION ── */}
      <section style={{ ...S.section(), background:T2.dark, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-30%", left:"50%", transform:"translateX(-50%)", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(138,70,255,0.18) 0%,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ ...S.inner(800), textAlign:"center", position:"relative", zIndex:1 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(138,70,255,0.2)", border:"1px solid rgba(138,70,255,0.35)", borderRadius:999, padding:"6px 18px", fontSize:13, fontWeight:600, color:"#c084fc", marginBottom:32 }}>
            <Icon name="gift" size={13} color="#c084fc"/> Win Ablespace Pro
          </div>
          <h2 style={{ margin:"0 0 20px", fontSize:"clamp(36px,5vw,64px)", fontWeight:900, color:"#fff", letterSpacing:-2, lineHeight:1.05 }}>
            Level up your<br/>
            <span style={{ background:"linear-gradient(90deg,#c084fc,#e83e8c)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>SPED game.</span>
          </h2>
          <p style={{ margin:"0 0 40px", fontSize:17, color:"rgba(255,255,255,0.6)", lineHeight:1.65 }}>
            Complete all sessions, pass the quizzes, and your certificate automatically enters you into the Ablespace Pro prize draw. No extra steps.
          </p>
          <button onClick={()=>setShowAuth(true)}
            style={{ padding:"0 40px", height:56, background:"#fff", color:T2.dark, border:"none", borderRadius:12, fontSize:16, fontWeight:800, cursor:"pointer", transition:"all .15s" }}
            onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 12px 32px rgba(0,0,0,0.3)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}>
            Sign in
          </button>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ ...S.section(), background:T2.section }}>
        <div style={{ ...S.inner() }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <h2 style={{ margin:0, fontSize:"clamp(28px,4vw,44px)", fontWeight:900, color:T2.text, letterSpacing:-1.5 }}>What educators are saying.</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {TESTIMONIALS.map((t,i)=>(
              <div key={i} style={{ background:"#fff", borderRadius:20, padding:"28px 24px", border:`1px solid ${T2.border}` }}>
                <div style={{ display:"flex", gap:2, marginBottom:16 }}>
                  {Array(5).fill(0).map((_,j)=><Icon key={j} name="star" size={16} color="#f59e0b" weight="fill"/>)}
                </div>
                <p style={{ margin:"0 0 20px", fontSize:15, color:T2.text, lineHeight:1.7 }}>"{t.text}"</p>
                <div style={{ fontSize:14, fontWeight:700, color:T2.text }}>— {t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq-v2" style={{ ...S.section(), background:T2.bg }}>
        <div style={{ ...S.inner(720) }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <h2 style={{ margin:0, fontSize:"clamp(28px,4vw,44px)", fontWeight:900, color:T2.text, letterSpacing:-1.5 }}>Frequently asked questions.</h2>
          </div>
          {[
            {q:"Is SPED Summit completely free?", a:"Yes — 100% free. Watch all sessions, take quizzes, and download your certificate at no cost."},
            {q:"Can I rewatch if I miss a live session?", a:"Absolutely. All sessions are recorded and available on-demand throughout January 2026."},
            {q:"How do I get my certificate?", a:"Complete all sessions and pass the assessments. Your certificate is generated automatically and ready to download."},
            {q:"How does the prize draw work?", a:"Your completion certificate is your entry. Pass all quizzes and you're automatically entered to win Ablespace Pro."},
            {q:"Who is this for?", a:"Special Ed teachers, SLPs, OTs, PTs, ABA professionals, SPED coordinators — anyone working in special education."},
          ].map((faq,i)=>(
            <details key={i} style={{ borderBottom:`1px solid ${T2.border}`, padding:"20px 0" }}>
              <summary style={{ fontSize:16, fontWeight:700, color:T2.text, cursor:"pointer", listStyle:"none", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                {faq.q} <Icon name="caret-down" size={18} color={T2.muted}/>
              </summary>
              <p style={{ margin:"12px 0 0", fontSize:15, color:T2.muted, lineHeight:1.7, whiteSpace:"pre-line" }}>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ ...S.section({ padding:"80px 24px" }), background:T2.dark }}>
        <div style={{ ...S.inner(640), textAlign:"center" }}>
          <div style={{ width:72, height:72, borderRadius:20, background:"linear-gradient(135deg,#8a46ff,#e83e8c)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 28px" }}>
            <Icon name="certificate" size={36} color="#fff"/>
          </div>
          <h2 style={{ margin:"0 0 16px", fontSize:"clamp(32px,4vw,52px)", fontWeight:900, color:"#fff", letterSpacing:-1.5 }}>Your SPED journey starts here.</h2>
          <p style={{ margin:"0 0 36px", fontSize:17, color:"rgba(255,255,255,0.55)", lineHeight:1.65 }}>Join 4,200+ educators. Watch, learn, earn your certificate — and maybe win Ablespace Pro.</p>
          <button onClick={()=>setShowAuth(true)}
            style={{ padding:"0 40px", height:54, background:T2.accent, color:"#fff", border:"none", borderRadius:12, fontSize:16, fontWeight:700, cursor:"pointer", transition:"all .15s", boxShadow:"0 4px 0 0 #5b21b6" }}
            onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 6px 0 0 #5b21b6"; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 0 0 #5b21b6"; }}>
            Sign in
          </button>
        </div>
      </section>

      {showAuth && <AuthModal onClose={()=>setShowAuth(false)} onLogin={(role)=>onGetStarted(null,role)}/>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SESSION QUIZ MODAL
   Renders the per-session assessment. Quiz questions come from session.quiz_questions
   as [{q, opts, a}] (a = correct option index). quizState persists progress across
   opens: { currentQ, answers, status, score }.
───────────────────────────────────────────────────────────────────────────── */
function getSessionQuestions(session) {
  if (session?.quiz_questions?.length) return session.quiz_questions;
  // Fall back to lesson-level questions added via CurriculumBuilder
  return (session?.lessons || []).flatMap(l =>
    (l.questions || [])
      .filter(q => q.text && q.options?.some(o => o))
      .map(q => ({ q: q.text, opts: q.options, a: q.correct ?? 0 }))
  );
}

function SessionQuizModal({ session, quizState, onClose, onSaveProgress, onFinish, onViewCertificate }) {
  const questions = getSessionQuestions(session);
  const [currentQ, setCurrentQ] = useState(quizState.currentQ || 0);
  const [answers,  setAnswers]  = useState(quizState.answers  || {});
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(quizState.status === "passed" || quizState.status === "failed");
  const [finalScore, setFinalScore] = useState(quizState.score || 0);

  if (!questions.length) {
    return (
      <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:500,
                    display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
        <div style={{ background:C.white, borderRadius:20, width:"100%", maxWidth:480, padding:40, textAlign:"center" }}>
          <div style={{ fontSize:40, marginBottom:16 }}>📋</div>
          <h2 style={{ margin:"0 0 8px", fontSize:20, fontWeight:800, color:C.gray900 }}>No Questions Yet</h2>
          <p style={{ color:C.gray500, fontSize:14, margin:"0 0 24px" }}>Assessment questions haven't been added for this session.</p>
          <Btn onClick={onClose}>Close</Btn>
        </div>
      </div>
    );
  }

  const q      = questions[currentQ] || {};
  const isLast = currentQ === questions.length - 1;
  const pct    = Math.round((currentQ / questions.length) * 100);

  function selectAnswer(idx) {
    if (answers[currentQ] !== undefined) return;
    setSelected(idx);
  }

  function next() {
    if (selected === null && answers[currentQ] === undefined) return;
    const chosenIdx  = selected !== null ? selected : answers[currentQ];
    const newAnswers = { ...answers, [currentQ]: chosenIdx };
    setAnswers(newAnswers);
    setSelected(null);
    onSaveProgress(session.id, { answers: newAnswers, currentQ: isLast ? 0 : currentQ + 1 });

    if (isLast) {
      const correct = Object.entries(newAnswers).filter(
        ([qi, ans]) => questions[Number(qi)]?.a === ans
      ).length;
      const score  = Math.round((correct / questions.length) * 100);
      const passed = score >= 80;
      setFinalScore(score);
      setShowResult(true);
      onFinish(session.id, score, passed);
    } else {
      setCurrentQ(q => q + 1);
    }
  }

  function optionStyle(i) {
    const answered   = answers[currentQ] !== undefined;
    const isSel      = selected === i || answers[currentQ] === i;
    const isCorrect  = q.a === i;

    let bg = C.white, border = C.gray200, textColor = C.gray700;
    if (answered) {
      if (isSel && isCorrect) { bg = C.successLight; border = C.successBorder; textColor = C.success; }
      else if (isSel)         { bg = C.errorLight;   border = C.errorBorder;   textColor = C.error;   }
      else if (isCorrect)     { bg = C.successLight; border = C.successBorder; textColor = C.success; }
    } else if (selected === i) {
      bg = C.primaryLight; border = C.primary; textColor = C.primary;
    }
    return { bg, border, textColor };
  }

  const passed = finalScore >= 80;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:500,
                  display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:C.white, borderRadius:20, width:"100%", maxWidth:560,
                    boxShadow:"0 24px 64px rgba(0,0,0,0.22)", overflow:"hidden", animation:"fadeIn .2s ease" }}>

        {/* Header */}
        <div style={{ padding:"18px 24px", borderBottom:`1px solid ${C.gray100}`,
                      display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:12, fontWeight:700, letterSpacing:1.5, color:C.primary, marginBottom:3 }}>ASSESSMENT</div>
            <div style={{ fontWeight:700, fontSize:14, color:C.gray900 }}>{session.title}</div>
          </div>
          <button onClick={onClose}
            style={{ width:32, height:32, borderRadius:8, border:`1px solid ${C.gray200}`,
                     background:C.white, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
            onMouseEnter={e=>e.currentTarget.style.background=C.gray50}
            onMouseLeave={e=>e.currentTarget.style.background=C.white}>
            <Icon name="x" size={16} color={C.gray500}/>
          </button>
        </div>

        {!showResult ? (
          <div style={{ padding:"24px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.gray400, marginBottom:7 }}>
              <span>Question {currentQ + 1} of {questions.length}</span>
              <span>{pct}% complete</span>
            </div>
            <ProgressBar value={pct} height={5}/>

            <div style={{ margin:"22px 0 18px", fontSize:16, fontWeight:700, color:C.gray900, lineHeight:1.5 }}>
              {q.q}
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {(q.opts || []).map((opt, i) => {
                const { bg, border, textColor } = optionStyle(i);
                const answered = answers[currentQ] !== undefined;
                return (
                  <button key={i} onClick={() => selectAnswer(i)}
                    style={{ padding:"13px 16px", borderRadius:12, border:`2px solid ${border}`,
                             background:bg, color:textColor, fontSize:14, fontWeight:500,
                             textAlign:"left", cursor:answered?"default":"pointer",
                             transition:"all .15s", display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ width:26, height:26, borderRadius:"50%", border:`2px solid ${border}`,
                                   display:"flex", alignItems:"center", justifyContent:"center",
                                   fontSize:12, fontWeight:700, flexShrink:0, color:textColor }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop:22, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:12, color:C.gray400 }}>
                {answers[currentQ] !== undefined
                  ? (q.a === answers[currentQ] ? "✓ Correct!" : "✗ Incorrect")
                  : "Select an answer"}
              </span>
              <Btn onClick={next} disabled={selected === null && answers[currentQ] === undefined}>
                {isLast ? "Finish Assessment" : "Next"} <Icon name="caret-right" size={14} color="#fff"/>
              </Btn>
            </div>
          </div>
        ) : (
          <div style={{ padding:"40px 24px", textAlign:"left" }}>
            <div style={{ fontSize:52, marginBottom:12 }}>
              {passed ? "🏆" : finalScore >= 60 ? "🎯" : "📚"}
            </div>
            <h2 style={{ margin:"0 0 6px", fontSize:22, fontWeight:900, color:C.gray900 }}>
              {passed ? "Assessment Passed!" : finalScore >= 60 ? "Good effort!" : "Keep practising!"}
            </h2>
            <p style={{ color:C.gray500, fontSize:14, margin:"0 0 6px" }}>
              {passed ? "You've earned your certificate for this session." : "You need 80% to pass. Review the material and try again."}
            </p>
            <div style={{ fontSize:48, fontWeight:900,
                          color: passed ? C.success : finalScore >= 60 ? C.warning : C.error,
                          marginBottom:24 }}>
              {finalScore}%
            </div>
            <div style={{ display:"flex", gap:12 }}>
              {!passed && (
                <Btn variant="outline" onClick={() => {
                  setCurrentQ(0); setAnswers({}); setSelected(null); setShowResult(false); setFinalScore(0);
                  onSaveProgress(session.id, { currentQ:0, answers:{} });
                }}>Try Again</Btn>
              )}
              <Btn onClick={passed ? () => { onClose(); onViewCertificate && onViewCertificate(session); } : onClose}>{passed ? "View Certificate" : "Close"}</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CONTACT PAGE
───────────────────────────────────────────────────────────────────────────── */
function ContactPage() {
  const cards = [
    {
      logo: "/Container.png",
      logoBg: "rgba(100,144,232,0.10)",
      iconColor: "#6490E8",
      title: "Talk to SPED Summit",
      subtitle: "Questions about sessions, certificates, or your learning journey?",
      body: "Reach out to our team and we'll get back to you within 24 hours.",
      email: "support@spedsummit.com",
      label: "support@spedsummit.com",
    },
    {
      logo: "/ablespace.svg",
      logoBg: "rgba(249,115,22,0.10)",
      iconColor: "#f97316",
      title: "Talk to AbleSpace",
      subtitle: "Interested in our platform or want to partner with us?",
      body: "Write to the AbleSpace team and one of our representatives will be in touch.",
      email: "hello@ablespace.io",
      label: "hello@ablespace.io",
    },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#FEF5EC", fontFamily:"'Inter',-apple-system,sans-serif" }}>
      {/* Header banner */}
      <div style={{ background:"#6490E8", padding:"56px 32px 48px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <p style={{ margin:"0 0 10px", fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.7)", letterSpacing:1.2, textTransform:"uppercase" }}>Get in touch</p>
          <h1 style={{ margin:"0 0 12px", fontSize:"clamp(28px,4vw,42px)", fontWeight:800, color:"#fff", lineHeight:1.15 }}>Have a question?<br/>We're here to help.</h1>
          <p style={{ margin:0, fontSize:16, color:"rgba(255,255,255,0.8)", lineHeight:1.6 }}>Choose the right team below and we'll make sure your message gets to the right place.</p>
        </div>
      </div>

      {/* Cards */}
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"48px 32px 64px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:24 }}>
          {cards.map(card => (
            <div key={card.title} style={{ background:"#fff", borderRadius:20, border:"1px solid rgba(0,0,0,0.07)", padding:"36px 32px", display:"flex", flexDirection:"column", gap:0 }}>
              {/* Logo */}
              <div style={{ width:64, height:64, borderRadius:16, background:card.logoBg, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24, padding:10, boxSizing:"border-box" }}>
                <img src={card.logo} alt="" style={{ width:"100%", height:"100%", objectFit:"contain" }}/>
              </div>
              {/* Title */}
              <div style={{ fontSize:20, fontWeight:800, color:"#1a1a1a", marginBottom:8 }}>{card.title}</div>
              {/* Subtitle */}
              <p style={{ margin:"0 0 16px", fontSize:14, fontStyle:"italic", color:"#6b7280", lineHeight:1.55 }}>{card.subtitle}</p>
              {/* Body */}
              <p style={{ margin:"0 0 24px", fontSize:15, color:"#374151", lineHeight:1.7 }}>{card.body}</p>
              {/* Email CTA */}
              <a href={`mailto:${card.email}`}
                style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"12px 20px", borderRadius:10, border:`1px solid ${card.iconColor}22`, background:card.logoBg, color:card.iconColor, fontSize:14, fontWeight:600, textDecoration:"none", transition:"filter .15s", marginTop:"auto" }}
                onMouseEnter={e=>e.currentTarget.style.filter="brightness(0.93)"}
                onMouseLeave={e=>e.currentTarget.style.filter="brightness(1)"}>
                <Icon name="envelope" size={15} color={card.iconColor} weight="fill"/>
                {card.label}
              </a>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p style={{ textAlign:"center", fontSize:13, color:"#9ca3af", marginTop:40, lineHeight:1.6 }}>
          You can also reach us on social media — we typically respond within a business day.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   APP
───────────────────────────────────────────────────────────────────────────── */
export default function App() {
  // ── Check for public certificate link ──
  const certParam = new URLSearchParams(window.location.search).get("cert");
  const certIdParam = new URLSearchParams(window.location.search).get("cert_id");
  if (certIdParam) return <PublicCertificatePageById certId={certIdParam}/>;
  if (certParam) {
    try {
      const certData = JSON.parse(decodeURIComponent(escape(atob(certParam))));
      return <PublicCertificatePage data={certData}/>;
    } catch(e) { /* invalid cert param, continue normally */ }
  }

  // ── ALL useState declarations MUST come before any useCallback/useEffect ──
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLanding, setShowLanding] = useState(() => sessionStorage.getItem("showLanding") !== "0");
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [openInstructorName, setOpenInstructorName] = useState(null);
  const [page, setPage] = useState(() => sessionStorage.getItem("page") || "dashboard");
  const navHistoryRef = useRef(["dashboard"]);
  const isDark = false;
  const [landingV, setLandingV] = useState(1);
  const [activeSession,   setActiveSession]   = useState(null);
  const [sessionSource,   setSessionSource]   = useState("sessions");
  const [sessionBackLabel, setSessionBackLabel] = useState(null);
  const { toasts, toast, remove } = useToast();
  const [quizStates, setQuizStates] = useState({});
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userAvatar, setUserAvatar] = useState(null);
  const [userTimezone, setUserTimezone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [showTimezoneModal, setShowTimezoneModal] = useState(false);
  const [scheduleRegistrations, setScheduleRegistrations] = useState({});
  const [sessionsDeepLink, setSessionsDeepLink] = useState(null);
  const [pastSeasonPageId, setPastSeasonPageId] = useState(null);
  const [pastSeasonOrigin, setPastSeasonOrigin] = useState("browse");
  const [showPricingOverlay, setShowPricingOverlay] = useState(false);
  const [dashFilter, setDashFilter] = useState({ season:"all", year:"all" });
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [, setTick] = useState(0);
  const [spring2026Ids, setSpring2026Ids] = useState([]);
  const [seasonsData, setSeasonsData] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [assessmentSession, setAssessmentSession] = useState(null);
  const [certSession,       setCertSession]       = useState(null);
  const [reviewSession,     setReviewSession]     = useState(null);
  const [,                  setReviews]           = useState({});
  const [testimonialsData,  setTestimonialsData]  = useState([]);

  useEffect(() => {
    const url = "https://eziioterdhlaqatrnubx.supabase.co/storage/v1/object/public/session%20resources/Comments/Curated_Landing_Page_Testimonials.xlsx";
    fetch(url)
      .then(r => r.arrayBuffer())
      .then(buf => {
        const wb = XLSX.read(buf, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
        // rows[0] is header: [Speaker, Name, Selected Testimonial]
        const parsed = rows.slice(1).filter(r => r[1] && r[2]).map(r => ({
          speaker: r[0] || "",
          name: r[1],
          text: r[2],
        }));
        setTestimonialsData(parsed);
      })
      .catch(() => {}); // silently fall back to hardcoded on error
  }, []);

  const fetchSessions = useCallback(() => {
    supabase.from("sessions").select("*").then(({ data, error }) => {
      if (error) { console.error("[Supabase] fetch error:", error.message, error.code, error.hint); return; }

      const toSession = s => ({
        id: s.id, title: s.title, category: s.category,
        instructor: s.instructor || "", instructorBio: s.instructor_bio || "", instructorImage: s.instructor_image || "",
        instructorDesignation: s.designation || "",
        instructorLinkedin: s.linkedin || "", instructorInstagram: s.instagram || "",
        instructorFacebook: s.facebook || "", instructorWebsite: s.website || "", instructorPodcast: s.podcast || "",
        duration: s.duration || "60 mins", resources: s.resources || 0,
        progress: 0, status: "not-started",
        description: s.description || "",
        vimeoUrl: s.vimeo_url || "",
        lessons: s.lessons || [],
        availableFrom: s.available_from || null,
        availableTo: s.available_to || null,
        quiz_questions: s.quiz_questions || null,
      });

      // Deduplicate by title and id
      const seenTitles = new Set();
      const seenIds = new Set();
      const rows = (data || []).filter(s => {
        if (seenTitles.has(s.title) || seenIds.has(s.id)) return false;
        seenTitles.add(s.title);
        seenIds.add(s.id);
        return true;
      });

      setSessions(prev => {
        return rows.map(s => {
          const existing = prev.find(p => p.id === s.id);
          return { ...toSession(s), progress: existing?.progress || 0, status: existing?.status || "not-started" };
        });
      });

      setSessionsLoading(false);

      setSpring2026Ids(prev => {
        const supabaseIds = new Set(rows.map(s => s.id));
        const surviving = prev.filter(id => supabaseIds.has(id));
        const toAdd = rows.filter(s => !s.available_from && !surviving.includes(s.id)).map(s => s.id);
        return [...surviving, ...toAdd];
      });
    });
  }, []);

  // Handle Google OAuth redirect — fires when user returns from Google sign-in
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        // User clicked password reset link — show reset form, don't log them in
        setShowPasswordReset(true);
        return;
      }
      if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") && session) {
        // On INITIAL_SESSION (page load/refresh), clear any stale loggedOut flag so cross-tab logins are picked up
        if (event === "INITIAL_SESSION") sessionStorage.removeItem("loggedOut");
        // Block session restoration after explicit logout in this tab (only applies to SIGNED_IN/TOKEN_REFRESHED)
        if (event !== "INITIAL_SESSION" && sessionStorage.getItem("loggedOut") === "1") return;
        sessionStorage.removeItem("loggedOut");
        const meta = session.user.user_metadata || {};
        const name = meta.full_name || meta.name || session.user.email || "User";
        setUserName(name);
        setUserEmail(session.user.email || "");
        setUserAvatar(meta.avatar_url || meta.picture || null);
        if (meta.timezone) { setUserTimezone(meta.timezone); } else if (event === "SIGNED_IN") { setShowTimezoneModal(true); }
        setIsLoggedIn(true);
        // Only redirect to dashboard on fresh sign-in (not token refresh on tab focus)
        if (event === "SIGNED_IN" && sessionStorage.getItem("loggedIn") !== "1") { setPage("dashboard"); setShowLanding(false); }
        sessionStorage.setItem("loggedIn", "1");
        fetchSessions();
        fetchUserProgress();
      }
      if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
        setShowLanding(true);
        setPage("dashboard");
        setUserName(""); setUserEmail(""); setUserAvatar(null);
        setEnrolledIds(new Set()); setScheduleRegistrations({}); setQuizStates({});
        setSessions(prev => prev.map(s => ({ ...s, progress: 0, status: "not-started" })));
        sessionStorage.removeItem("loggedIn");
        sessionStorage.setItem("showLanding", "1");
        sessionStorage.setItem("loggedOut", "1");
      }
    });
    return () => subscription.unsubscribe();
  }, [fetchSessions]);

  // Sync auth state across tabs — when another tab logs in/out via localStorage, re-check session here
  useEffect(() => {
    const onStorage = async (e) => {
      // Supabase stores its session under a key starting with "sb-"
      if (!e.key || !e.key.startsWith("sb-")) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (session && !isLoggedIn) {
        // Another tab logged in — sync this tab
        if (sessionStorage.getItem("loggedOut") === "1") return;
        const meta = session.user.user_metadata || {};
        setUserName(meta.full_name || meta.name || session.user.email || "User");
        setUserEmail(session.user.email || "");
        setUserAvatar(meta.avatar_url || meta.picture || null);
        if (meta.timezone) setUserTimezone(meta.timezone);
        setIsLoggedIn(true);
        sessionStorage.setItem("loggedIn", "1");
        fetchSessions();
        fetchUserProgress();
      } else if (!session && isLoggedIn) {
        // Another tab logged out — sync this tab
        setIsLoggedIn(false);
        setShowLanding(true);
        setPage("dashboard");
        setUserName(""); setUserEmail(""); setUserAvatar(null);
        setEnrolledIds(new Set()); setScheduleRegistrations({}); setQuizStates({});
        setSessions(prev => prev.map(s => ({ ...s, progress: 0, status: "not-started" })));
        sessionStorage.removeItem("loggedIn");
        sessionStorage.setItem("showLanding", "1");
        sessionStorage.setItem("loggedOut", "1");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [isLoggedIn, fetchSessions]);

  async function fetchUserProgress() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase.from("user_progress").select("*").eq("user_id", user.id);
    if (error) { console.error("[Supabase] progress fetch error:", error.message); return; }
    if (!data || data.length === 0) return;
    const newEnrolled = new Set();
    const newRegs = {};
    setSessions(prev => prev.map(s => {
      const row = data.find(r => r.session_id === s.id);
      if (!row) return s;
      if (row.enrolled) newEnrolled.add(s.id);
      if (row.registered) newRegs[s.id] = true;
      return { ...s, progress: row.progress ?? s.progress, status: row.status ?? s.status };
    }));
    setEnrolledIds(newEnrolled);
    setScheduleRegistrations(newRegs);
    setQuizStates(prev => {
      const next = { ...prev };
      data.forEach(row => {
        if (row.quiz_state && Object.keys(row.quiz_state).length > 0) {
          next[row.session_id] = row.quiz_state;
        } else {
          // Fallback: check localStorage
          try {
            const local = localStorage.getItem(`qs_${row.session_id}`);
            if (local) { const parsed = JSON.parse(local); if (parsed?.status) next[row.session_id] = parsed; }
          } catch(_) {}
        }
      });
      return next;
    });
  }

  async function saveUserProgress(sessionId, fields) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("user_progress").upsert(
      { user_id: user.id, session_id: sessionId, updated_at: new Date().toISOString(), ...fields },
      { onConflict: "user_id,session_id" }
    );
    if (error) console.error("[Supabase] saveUserProgress error:", error.message);
  }


  function setScheduleRegistrationsAndSave(updater) {
    setScheduleRegistrations(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      Object.keys(next).forEach(id => { if (!prev[id]) saveUserProgress(Number(id), { registered: true }); });
      return next;
    });
  }
  // Merged seasons — use Supabase data when available, fall back to hardcoded SEASONS
  const seasonsBase = seasonsData.length > 0 ? seasonsData : SEASONS;
  const seasons = seasonsBase.map(s => s.id === "spring-2026" ? { ...s, sessionIds: [...(s.sessionIds || []), ...spring2026Ids] } : s);


  // On mount, restore session only if the user did not explicitly log out
  useEffect(() => {
    if (sessionStorage.getItem("loggedOut") === "1") return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata || {};
        const name = meta.full_name || meta.name || session.user.email || "User";
        setUserName(name);
        setUserEmail(session.user.email || "");
        setUserAvatar(meta.avatar_url || meta.picture || null);
        if (meta.timezone) setUserTimezone(meta.timezone);
        setIsLoggedIn(true);
        sessionStorage.setItem("loggedIn", "1");
        fetchUserProgress();
      }
    });
  }, []);


  // Fetch seasons and schedule from Supabase on mount
  useEffect(() => {
    supabase.from("seasons").select("*").then(({ data, error }) => {
      if (error) { console.error("[Supabase] seasons fetch error:", error.message); return; }
      if (data && data.length > 0) {
        setSeasonsData(data.map(s => ({ ...s, sessionIds: s.session_ids || [] })));
      }
    });
    supabase.from("schedule").select("*").then(({ data, error }) => {
      if (error) { console.error("[Supabase] schedule fetch error:", error.message); return; }
      if (data && data.length > 0) setScheduleData(data);
    });
  }, []);

  // Fetch sessions on mount + realtime subscription for instant cross-device updates
  useEffect(() => {
    fetchSessions();

    // Realtime: any INSERT/UPDATE/DELETE on the sessions table triggers an immediate re-fetch
    const channel = supabase
      .channel("sessions-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "sessions" }, () => {
        fetchSessions();
      })
      .subscribe();

    // Fallback: re-fetch on tab focus (switching from admin site)
    const onVisible = () => { if (document.visibilityState === "visible") fetchSessions(); };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      supabase.removeChannel(channel);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [fetchSessions]);

  // Re-evaluate session states every minute so availability changes reflect without refresh
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  function enroll(sessionId) {
    setEnrolledIds(prev => new Set([...prev, sessionId]));
    saveUserProgress(sessionId, { enrolled: true });
    toast({ type:"success", title:"Enrolled!", message:"Session added to your courses." });
  }

  function updateQuizState(sessionId, updates) {
    setQuizStates(prev => {
      const next = { ...prev, [sessionId]: { ...(prev[sessionId] || { status:"not-taken" }), ...updates } };
      saveUserProgress(sessionId, { quiz_state: next[sessionId] });
      // Persist to localStorage as fallback
      try { localStorage.setItem(`qs_${sessionId}`, JSON.stringify(next[sessionId])); } catch(_) {}
      return next;
    });
  }

  function handleAssessmentClick(session) { setAssessmentSession(session); }
  async function handleCertificateClick(session) {
    const qs = quizStates[session.id] || {};
    const score = qs.score ?? 0;
    const today = new Date().toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });
    const certId = `SS-${session.id}${score}-2024`;
    const certData = { recipientName:userName, sessionTitle:session.title, instructor:session.instructor, instructorImage:session.instructorImage||"", duration:session.duration, score, description:session.description, certId, date:today };
    try {
      const dbId = await saveCertToSupabase(certData);
      window.open(`${window.location.origin}/?cert_id=${dbId}`, "_blank");
    } catch(e) {
      // Fallback to base64 URL if Supabase fails
      window.open(`${window.location.origin}/?cert=${btoa(JSON.stringify(certData))}`, "_blank");
    }
  }

  function handleSaveProgress(sessionId, partial) {
    updateQuizState(sessionId, partial);
  }

  function handleAssessmentFinish(sessionId, score, passed) {
    updateQuizState(sessionId, { status: passed ? "passed" : "failed", score, currentQ: 0, answers: {} });
    const session = sessions.find(s => s.id === sessionId) || SESSIONS.find(s => s.id === sessionId);
    if (session) setReviewSession({ session, score, passed });
    if (passed) {
      toast({ type:"success", title:"🏆 Assessment Passed!", message:`You scored ${score}% — your certificate is ready!` });
      // Re-fetch to ensure certificates page is in sync
      setTimeout(() => fetchUserProgress(), 1000);
    } else {
      toast({ type:"warning", title:"Assessment not passed", message:`You scored ${score}%. You need 80% to pass. Try again!` });
    }
  }

  const scrollContainerRef = useRef(null);

  // Seed the initial browser history entry so back never escapes the app.
  // IMPORTANT: only update the state object — never change the URL here.
  // Changing the URL (even just removing the hash) would strip Supabase's OAuth
  // callback params (?code= or #access_token=) before it can parse them.
  useEffect(() => {
    window.history.replaceState({ page: "dashboard", isApp: true }, "");
  }, []);

  // Persist showLanding so refresh restores the correct view
  useEffect(() => {
    sessionStorage.setItem("showLanding", showLanding ? "1" : "0");
  }, [showLanding]);

  function _applyPage(p, keepSession = false) {
    setPage(p); sessionStorage.setItem("page", p);
    if (!keepSession) { setActiveSession(null); }
    if (p === "sessions") setSessionsDeepLink(null);
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
  }

  function nav(p) {
    const prev = navHistoryRef.current[navHistoryRef.current.length - 1];
    if (prev !== p) {
      navHistoryRef.current = [...navHistoryRef.current, p];
      window.history.pushState({ page: p, isApp: true }, "", window.location.pathname);
    }
    _applyPage(p);
  }

  useEffect(() => {
    function handlePopState(e) {
      // If it's an app state entry, use it directly
      if (e.state?.isApp) {
        const targetPage = e.state.page;
        // Sync our history stack to match
        const idx = navHistoryRef.current.lastIndexOf(targetPage);
        if (idx >= 0) navHistoryRef.current = navHistoryRef.current.slice(0, idx + 1);
        else navHistoryRef.current = [targetPage];
        _applyPage(targetPage);
      } else {
        // Went back to initial entry — re-push a dashboard entry to prevent leaving the app
        window.history.pushState({ page: "dashboard", isApp: true }, "", window.location.pathname);
        navHistoryRef.current = ["dashboard"];
        _applyPage("dashboard");
      }
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  function navToSeason(seasonId) { setSessionsDeepLink(seasonId); setPage("sessions"); setActiveSession(null); }

  function updateProgress(sessionId, pct, activeLessonIdx) {
    const newStatus = pct >= 100 ? "completed" : "in-progress";
    setSessions(prev => prev.map(s => {
      if (s.id !== sessionId) return s;
      const updated = { ...s, progress: pct, status: newStatus };
      if (pct >= 80 && activeLessonIdx != null && s.lessons?.length > 0) {
        const lessons = s.lessons.map((l, i) => {
          if (i === activeLessonIdx) return { ...l, status: "completed" };
          if (i === activeLessonIdx + 1 && l.status === "locked") return { ...l, status: "active" };
          return l;
        });
        updated.lessons = lessons;
      }
      return updated;
    }));
    saveUserProgress(sessionId, { progress: pct, status: newStatus, enrolled: true });
  }

  function openSession(s, source) {
    const src = (source === "landing" ? "dashboard" : source) || page;
    setActiveSession(s);
    setSessionSource(src);
    const season = seasons.find(season => season.sessionIds.includes(s.id));
    setSessionBackLabel(season ? season.name : null);
    // Push session-detail to browser history so back returns to the source page
    navHistoryRef.current = [...navHistoryRef.current, "session-detail"];
    window.history.pushState({ page: "session-detail", isApp: true }, "", window.location.pathname);
    setPage("session-detail");
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
  }

  const quizProps = {
    quizStates,
    onAssessmentClick: handleAssessmentClick,
    onCertificateClick: handleCertificateClick,
  };

  function renderPage() {
    if (page==="session-detail" && activeSession) {
      const liveSession = sessions.find(s => s.id === activeSession.id) || activeSession;
      return <SessionDetail session={liveSession} onBack={()=>nav(sessionSource)} backLabel={sessionBackLabel} sessionSource={sessionSource} toast={toast} onAssessmentClick={handleAssessmentClick} onUpdateProgress={updateProgress} adminName={userName} adminAvatar={userAvatar} isDark={isDark} quizState={quizStates[liveSession.id]||{}} onFinishAssessment={handleAssessmentFinish} userEmail={userEmail} onCertificateClick={handleCertificateClick}/>;
    }
    if (page==="past-season" && pastSeasonPageId) {
      const season = seasons.find(s => s.id === pastSeasonPageId);
      const seasonSessions = sessions.filter(s => season?.sessionIds.includes(s.id));
      const INST_ROLES_PS = {
        "Tara Roehl":"Occupational Therapist","Casey Harrison":"Dyslexia Specialist","Jordan Smith":"Speech-Language Pathologist",
        "Morgan Lee":"Special Ed Educator","Dr. Emily Tran":"AI & Technology Educator","Dr. Sarah Kim":"AAC Specialist, BCBA",
        "Alex Rivera":"Behavior Intervention Specialist","Sam Parmelee":"DHH Education Specialist","Natasha S.":"Transition Planning Expert",
      };
      const CAT_BADGE_PS = {
        "MANAGEMENT":    {"label":"Management",    "bg":"rgba(59,130,246,0.15)",  "color":"#60a5fa"},
        "LEADERSHIP":    {"label":"Leadership",    "bg":"rgba(16,185,129,0.15)",  "color":"#34d399"},
        "COMMUNICATION": {"label":"Communication", "bg":"rgba(249,115,22,0.15)",  "color":"#fb923c"},
        "TEAMWORK":      {"label":"Teamwork",      "bg":"rgba(168,85,247,0.15)",  "color":"#c084fc"},
        "TECHNOLOGY":    {"label":"Technology",    "bg":"rgba(234,179,8,0.15)",   "color":"#fbbf24"},
        "ACCESSIBILITY": {"label":"Accessibility", "bg":"rgba(139,92,246,0.15)",  "color":"#a78bfa"},
      };
      return (
        <div style={{ padding:"24px 16px", background:C.gray50, minHeight:"100%", fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif" }}>
          <style>{`
            .ps-session-card { display:flex; flex-direction:row; align-items:stretch; height:235px; }
            .ps-session-thumb { flex-shrink:0; width:200px; position:relative; }
            .ps-session-thumb img { width:100%; height:100%; object-fit:cover; object-position:top center; display:block; }
            .ps-session-body { padding:20px; }
            @media(max-width:600px){
              .ps-session-card { flex-direction:column; height:auto; }
              .ps-session-thumb { width:100%; height:160px; flex-shrink:0; }
              .ps-session-body { padding:14px 12px; }
            }
          `}</style>
          {/* Back button — mobile only */}
          <button className="ps-back-btn" onClick={() => { setPastSeasonPageId(null); nav(pastSeasonOrigin); }}
            style={{ display:"none", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", padding:"0 0 16px", color:C.gray600, fontSize:14, fontWeight:600, fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif" }}>
            <Icon name="arrow-left" size={16} color={C.gray600}/>
            Back
          </button>
          <style>{`.ps-back-btn { display:none; } @media(max-width:767px){ .ps-back-btn { display:flex !important; } }`}</style>

          {/* Page title */}
          <div style={{ marginBottom:20 }}>
            <h1 style={{ margin:"0 0 4px", fontSize:20, fontWeight:700, color:C.gray900, fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif", letterSpacing:-0.3 }}>{season?.name}</h1>
            <div style={{ fontSize:13, color:C.gray500 }}>Past Season · {seasonSessions.length} session{seasonSessions.length!==1?"s":""}</div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {seasonSessions.length === 0 && (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"60vh", textAlign:"center" }}>
                <div style={{ width:72, height:72, borderRadius:20, background:C.gray100, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
                  <Icon name="video" size={32} color={C.gray300}/>
                </div>
                <div style={{ fontSize:17, fontWeight:700, color:C.gray700, marginBottom:8 }}>No sessions yet</div>
                <div style={{ fontSize:14, color:C.gray400, maxWidth:280, lineHeight:1.6 }}>Sessions for this season haven't been added yet. Check back soon.</div>
              </div>
            )}
            {seasonSessions.map(s => {
              const catBadge = CAT_BADGE_PS[s.category] || { label:s.category, bg:C.gray100, color:C.gray700 };
              const instrRole = s.instructorDesignation || INST_ROLES_PS[s.instructor] || "Instructor";
              return (
                <div key={s.id} className="ps-session-card"
                  style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:12, overflow:"hidden", cursor:"pointer" }}
                  onClick={()=>setShowPricingOverlay(true)}>
                  <div className="ps-session-thumb">
                    {(s.instructorImage) && <img src={s.instructorImage} alt={s.instructor}/>}
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.25) 45%,transparent 75%)" }}/>
                    <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"0 10px 10px" }}>
                      <div style={{ fontSize:15, fontWeight:700, color:"#fff", lineHeight:1.25 }}>{s.instructor}</div>
                      <div style={{ fontSize:13, color:"rgba(255,255,255,0.72)", marginTop:3, lineHeight:1.3 }}>{instrRole}</div>
                    </div>
                  </div>
                  <div className="ps-session-body" style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column" }}>
                    <div style={{ fontSize:17, fontWeight:700, color:C.gray900, lineHeight:1.3, marginBottom:6, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{s.title}</div>
                    <div style={{ fontSize:12, color:C.gray600, lineHeight:1.55, marginBottom:6, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                      {s.description}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:"auto", paddingTop:12 }}>
                      {(() => {
                        const state = getSessionState(s);
                        if (state === "live") return (
                          <button onClick={e=>{ e.stopPropagation(); openSession(s, "past-season"); }}
                            style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"7px 14px", background:C.primary, color:"#fff", border:"none", borderRadius:7, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"background 0.15s" }}
                            onMouseEnter={e=>e.currentTarget.style.background=C.primaryDark}
                            onMouseLeave={e=>e.currentTarget.style.background=C.primary}>
                            <Icon name="play" size={13} color="#fff"/> Watch Now
                          </button>
                        );
                        if (state === "upcoming") return (
                          <span style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"7px 14px", background:C.gray100, color:C.gray500, borderRadius:7, fontSize:13, fontWeight:700, fontFamily:"inherit" }}>
                            <Icon name="clock" size={13} color={C.gray500}/> Coming Soon
                          </span>
                        );
                        return (
                          <button onClick={e=>{ e.stopPropagation(); setShowPricingOverlay(true); }}
                            style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"7px 14px", background:C.primary, color:"#fff", border:"none", borderRadius:7, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"background 0.15s" }}
                            onMouseEnter={e=>e.currentTarget.style.background=C.primaryDark}
                            onMouseLeave={e=>e.currentTarget.style.background=C.primary}>
                            Subscribe
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    if (page==="dashboard") { return <Dashboard onNavigate={nav} onNavigateToSeason={navToSeason} onOpenPastSeason={(id)=>{ setPastSeasonPageId(id); nav("past-season"); }} onOpenSession={openSession} toast={toast} {...quizProps} enrolledIds={enrolledIds} onEnroll={enroll} scheduleRegistrations={scheduleRegistrations} setScheduleRegistrations={setScheduleRegistrationsAndSave} sessions={sessions} seasons={seasons} schedule={scheduleData.length > 0 ? scheduleData : SCHEDULE} externalFilter={dashFilter} onFilterChange={setDashFilter} sessionsLoading={sessionsLoading} testimonialsData={testimonialsData}/>; }
    if (page==="sessions")  return <SessionsPage onOpenSession={openSession} toast={toast} {...quizProps} enrolledIds={enrolledIds} onNavigate={nav} initialSeason={sessionsDeepLink} onSeasonChange={setSessionsDeepLink} scheduleRegistrations={scheduleRegistrations} setScheduleRegistrations={setScheduleRegistrationsAndSave} sessions={sessions} seasons={seasons} sessionsLoading={sessionsLoading}/>;
    if (page==="schedules") return <SchedulePage onOpenSession={openSession} toast={toast} scheduleRegistrations={scheduleRegistrations} setScheduleRegistrations={setScheduleRegistrationsAndSave} sessions={sessions} schedule={scheduleData.length > 0 ? scheduleData : SCHEDULE}/>;
    if (page==="quizzes")   return <QuizzesPage  toast={toast}/>;
    if (page==="community") return <CommunityPage toast={toast} userName={userName} userAvatar={userAvatar} sessions={sessions}/>;
    if (page==="certifications") return <CertificationsPage quizStates={quizStates} enrolledIds={enrolledIds} onCertificateClick={handleCertificateClick} userName={userName} sessions={sessions} seasons={seasons}/>;
    if (page==="past-sessions")  return <SessionsPage onOpenSession={openSession} toast={toast} {...quizProps} enrolledIds={enrolledIds} onNavigate={nav} initialSeason={sessionsDeepLink} onSeasonChange={setSessionsDeepLink} scheduleRegistrations={scheduleRegistrations} setScheduleRegistrations={setScheduleRegistrationsAndSave} sessions={sessions} seasons={seasons} sessionsLoading={sessionsLoading}/>;
    if (page==="notifications")  return <NotificationsPage />;
    if (page==="profile")   return <ProfilePage toast={toast} userName={userName} userEmail={userEmail} userAvatar={userAvatar} onNameChange={setUserName} onBack={() => nav("dashboard")} userTimezone={userTimezone} onTimezoneChange={setUserTimezone}/>;
    if (page==="contact")   return <ContactPage/>;
    if (page==="privacy-policy") return <PrivacyPolicyPage onBack={()=>{ const from=sessionStorage.getItem("legalReturnTo")||"landing"; sessionStorage.removeItem("legalReturnTo"); if(from==="dashboard"){ sessionStorage.setItem("showLanding","0"); sessionStorage.setItem("page","dashboard"); setShowLanding(false); setPage("dashboard"); } else { sessionStorage.setItem("showLanding","1"); sessionStorage.setItem("page","dashboard"); setShowLanding(true); setPage("dashboard"); } }}/>;
    if (page==="terms-of-service") return <TermsOfServicePage onBack={()=>{ const from=sessionStorage.getItem("legalReturnTo")||"landing"; sessionStorage.removeItem("legalReturnTo"); if(from==="dashboard"){ sessionStorage.setItem("showLanding","0"); sessionStorage.setItem("page","dashboard"); setShowLanding(false); setPage("dashboard"); } else { sessionStorage.setItem("showLanding","1"); sessionStorage.setItem("page","dashboard"); setShowLanding(true); setPage("dashboard"); } }}/>;
    return null;
  }

  const activePage = page==="session-detail" ? "sessions" : page;

  if (showLanding && page !== "contact" && page !== "privacy-policy" && page !== "terms-of-service") {
    const handleGetStarted = (sessionId) => {
      setIsLoggedIn(true);
      setShowLanding(false);
      setPage("dashboard");
      if (sessionId) enroll(sessionId);
    };
    const handleGoToPage = (p) => {
      setPage(p || "dashboard");
      setShowLanding(false);
    };
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
        <LandingPage onGetStarted={handleGetStarted} isLoggedIn={isLoggedIn} userName={userName} userAvatar={userAvatar} onGoToDashboard={handleGoToPage} onWatchSession={(s)=>{ setShowLanding(false); openSession(s, "landing"); }} onLogout={async ()=>{ sessionStorage.setItem("loggedOut","1"); sessionStorage.removeItem("loggedIn"); sessionStorage.setItem("showLanding","1"); sessionStorage.setItem("page","dashboard"); await supabase.auth.signOut(); setIsLoggedIn(false); setShowLanding(true); setPage("dashboard"); setUserName(""); setUserEmail(""); setUserAvatar(null); setEnrolledIds(new Set()); setQuizStates({}); }} openInstructorName={openInstructorName} onInstructorOpened={()=>setOpenInstructorName(null)} sessions={sessions} sessionsLoading={sessionsLoading} testimonialsData={testimonialsData}/>
      </>
    );
  }

  return (
    <>
    <div data-theme={isDark ? "dark" : "light"} style={{ height:"100vh", display:"flex", flexDirection:"column", fontFamily:"'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background:C.gray50 }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <TopBar
        toast={toast}
        isDark={isDark}
        onToggleDarkMode={() => setIsDark(v => !v)}
        onLogout={async () => {
          sessionStorage.setItem("loggedOut", "1");
          sessionStorage.removeItem("loggedIn");
          sessionStorage.setItem("showLanding", "1");
          sessionStorage.setItem("page", "dashboard");
          await supabase.auth.signOut();
          setIsLoggedIn(false); setShowLanding(true); setPage("dashboard");
          setUserName(""); setUserEmail(""); setUserAvatar(null);
          setEnrolledIds(new Set()); setQuizStates({});
        }}
        onNavigateProfile={() => nav("profile")}
        onOpenSession={openSession}
        onNavigate={nav}
        userName={userName}
        userAvatar={userAvatar}
        seasons={seasons}
        sessions={sessions}
        onGoHome={() => { setPage("dashboard"); setShowLanding(true); }}
        onOpenInstructor={(name) => { setOpenInstructorName(name); setShowLanding(true); }}
        onBrowseSelect={(season, year) => {
          if (season === "all") {
            // Year filter — find first season matching that year
            const match = seasons.find(s => s.name.includes(year));
            if (match) { setPastSeasonPageId(match.id); setPastSeasonOrigin("browse"); nav("past-season"); }
          } else {
            // Specific season name (e.g. "Spring", "Winter")
            const match = seasons.find(s => s.name === `${season} ${year}`);
            if (match) { setPastSeasonPageId(match.id); setPastSeasonOrigin("browse"); nav("past-season"); }
            else { setDashFilter({ season, year }); nav("sessions"); }
          }
        }}
      />
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <style>{`
          .app-tabbar-wrap { display: block; }
          .app-bottom-nav  { display: none; }
          @media(max-width: 767px) {
            .app-tabbar-wrap        { display: none !important; }
            .app-bottom-nav         { display: flex !important; }
            .app-scroll-area        { padding-bottom: 72px; }
            .app-scroll-area.no-bottom-nav { padding-bottom: 0 !important; }
            .topbar-browse          { display: none !important; }
            .topbar-notif           { display: none !important; }
            .topbar-search          { display: none !important; }
            .topbar-search-icon     { display: flex !important; }
            body.hide-bottom-nav .app-bottom-nav { display: none !important; }
          }
        `}</style>

        <div className="app-tabbar-wrap">
          {activePage !== "profile" && page !== "session-detail" && page !== "past-season" && page !== "contact" && page !== "privacy-policy" && page !== "terms-of-service" && <TabBar
            active={activePage}
            onChange={nav}
          />}
          {page === "past-season" && pastSeasonPageId && <TabBar
            active={activePage}
            onChange={nav}
            breadcrumbs={[
              { label: "My Learnings", onClick:() => { setPastSeasonPageId(null); nav("dashboard"); } },
              { label: "Past Sessions", onClick:() => { setPastSeasonPageId(null); nav("past-sessions"); } },
              { label: seasons.find(s => s.id === pastSeasonPageId)?.name || "Past Season" },
            ]}
          />}
        </div>

        <div ref={scrollContainerRef} className={`app-scroll-area${(page==="profile"||page==="session-detail"||page==="past-season"||activeSession||sessionsDeepLink)?" no-bottom-nav":""}`} style={{ flex:1, overflowY:"auto", overflowX:"clip", background:C.gray50 }}>{renderPage()}{page !== "profile" && page !== "session-detail" && !activeSession && <Footer onNavigate={nav}/>}</div>
      </div>

      {/* Mobile bottom nav — hidden when drilling into sub-pages */}
      {!(page === "profile" || page === "session-detail" || activeSession || sessionsDeepLink) && (
        <div className="app-bottom-nav" style={{ display:"none" }}>
          <LimelightBottomNav
            active={page === "notifications" ? "__notif__" : page === "past-season" ? "past-sessions" : activePage}
            onChange={nav}
            notifCount={NOTIF_DATA.filter(n => !n.read).length}
            onNotif={() => nav("notifications")}
          />
        </div>
      )}

      {/* Session Assessment Modal */}
      {assessmentSession && (
        <SessionQuizModal
          session={assessmentSession}
          quizState={quizStates[assessmentSession.id] || {}}
          onClose={() => setAssessmentSession(null)}
          onSaveProgress={handleSaveProgress}
          onFinish={handleAssessmentFinish}
          onViewCertificate={handleCertificateClick}
        />
      )}
      {/* Password Reset Modal */}
      {showPasswordReset && <PasswordResetModal onClose={()=>setShowPasswordReset(false)} toast={toast}/>}

      {/* Pricing Overlay / Page */}
      {showPricingOverlay && (
        window.innerWidth <= 767
          ? /* Mobile: full-screen page */
            <div style={{ position:"fixed", inset:0, zIndex:1000, background:"#fff", display:"flex", flexDirection:"column" }}>
              <TopBar
                toast={toast}
                isDark={isDark}
                onToggleDarkMode={() => setIsDark(v => !v)}
                onLogout={async () => { sessionStorage.setItem("loggedOut","1"); sessionStorage.removeItem("loggedIn"); sessionStorage.setItem("showLanding","1"); sessionStorage.setItem("page","dashboard"); await supabase.auth.signOut(); setIsLoggedIn(false); setShowLanding(true); setPage("dashboard"); setUserName(""); setUserEmail(""); setUserAvatar(null); setEnrolledIds(new Set()); setQuizStates({}); setShowPricingOverlay(false); }}
                onNavigateProfile={() => { setShowPricingOverlay(false); nav("profile"); }}
                onOpenSession={openSession}
                onNavigate={nav}
                userName={userName}
                userAvatar={userAvatar}
              />
              <div style={{ flex:1, overflowY:"auto" }}>
                <V1PricingCardOnly onGetStarted={() => setShowPricingOverlay(false)} onClose={() => setShowPricingOverlay(false)} />
                <Footer onNavigate={nav} />
              </div>
            </div>
          : /* Desktop: modal overlay */
            <div
              onClick={() => setShowPricingOverlay(false)}
              style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(0,0,0,0.55)", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}
            >
              <div onClick={e => e.stopPropagation()} style={{ maxWidth:880, width:"100%", maxHeight:"90vh", overflowY:"auto", borderRadius:20, background:"#fff" }}>
                <V1PricingCardOnly onGetStarted={() => setShowPricingOverlay(false)} onClose={() => setShowPricingOverlay(false)} />
              </div>
            </div>
      )}
      {/* Review Modal */}
      {reviewSession && (
        <ReviewModal
          session={reviewSession.session}
          passed={reviewSession.passed}
          score={reviewSession.score}
          onClose={() => setReviewSession(null)}
          onSubmit={({ sessionId, rating, review }) => {
            setReviews(r => ({ ...r, [sessionId]: { rating, review, date: new Date().toISOString() } }));
          }}
        />
      )}
      <ToastContainer toasts={toasts} onRemove={remove}/>
      <style>{`
        :root, [data-theme="light"] {
          --hero-bg: linear-gradient(120deg, #fff4f0, #ffe8e0);
          /* Brand Primary — mid-blue */
          --c-primary:#6490E8; --c-primaryDark:#4a77d4; --c-primaryLight:#eef3fd; --c-primaryBorder:#b8cef5;
          /* Accent coral */
          --c-accent:#FF8F6C; --c-accentBg:#FFF4F0;
          /* Feedback */
          --c-success:#10b981; --c-successLight:#ecfdf5; --c-successBorder:#6ee7b7;
          --c-warning:#f59e0b; --c-warningLight:#fffbeb; --c-warningBorder:#fcd34d;
          --c-error:#ef4444; --c-errorLight:#fef2f2; --c-errorBorder:#fca5a5;
          --c-info:#6490E8; --c-infoLight:#eef3fd; --c-infoBorder:#b8cef5;
          /* Text scale */
          --c-gray50:#f9fbf8; --c-gray100:#f3f4f6; --c-gray200:#eceded; --c-gray300:#d1d5db;
          --c-gray400:#a0a4a6; --c-gray500:#707685; --c-gray600:#5D636F; --c-gray700:#374151;
          --c-gray800:#2B2E33; --c-gray900:#2B2E33; --c-white:#ffffff;
          /* Typography scale */
          --fs-display-2xl:70px; --fs-display-xl:60px; --fs-display-lg:48px;
          --fs-display-md:36px; --fs-display-sm:30px;
          --fs-body-xl:20px; --fs-body-lg:18px; --fs-body-md:16px;
          --lh-display:1.25; --lh-body:1.5;
        }
        [data-theme="dark"] {
          --hero-bg: linear-gradient(120deg, #1a2035, #0f172a);
          --c-primary:#7aa3ee; --c-primaryDark:#6490E8; --c-primaryLight:#1a2540; --c-primaryBorder:#2d4a7a;
          --c-accent:#FF8F6C; --c-accentBg:#2a1a14;
          --c-success:#10b981; --c-successLight:#064e3b; --c-successBorder:#065f46;
          --c-warning:#f59e0b; --c-warningLight:#451a03; --c-warningBorder:#92400e;
          --c-error:#ef4444; --c-errorLight:#450a0a; --c-errorBorder:#7f1d1d;
          --c-info:#7aa3ee; --c-infoLight:#1a2540; --c-infoBorder:#2d4a7a;
          --c-gray50:#1e293b; --c-gray100:#1e293b; --c-gray200:#2d3748; --c-gray300:#4b5563;
          --c-gray400:#6b7280; --c-gray500:#9ca3af; --c-gray600:#d1d5db; --c-gray700:#e5e7eb;
          --c-gray800:#e2e8f0; --c-gray900:#f1f5f9; --c-white:#1e293b;
        }
        * { box-sizing: border-box; }
        @keyframes toastIn { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeIn  { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes skeleton-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e4e6ef; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #b5b5c3; }
        input, textarea, select { font-family: inherit; }
        button { font-family: inherit; }
        input[type="datetime-local"]::-webkit-calendar-picker-indicator { cursor: pointer; filter: brightness(0) saturate(100%) opacity(0.45); }
        input[type="datetime-local"]::-webkit-calendar-picker-indicator:hover { filter: brightness(0) saturate(100%) opacity(0.8); }
        [data-theme="dark"] input[type="datetime-local"]::-webkit-calendar-picker-indicator { filter: brightness(0) invert(1) opacity(0.45); }
        [data-theme="dark"] input[type="datetime-local"]::-webkit-calendar-picker-indicator:hover { filter: brightness(0) invert(1) opacity(0.85); }
        [data-theme="dark"] #spedLogoSvg { filter: brightness(0) invert(1); }
      `}</style>
    </div>
    {showTimezoneModal && (
      <TimezoneModal
        detectedTz={userTimezone}
        onConfirm={async (tz) => {
          setUserTimezone(tz);
          setShowTimezoneModal(false);
          await supabase.auth.updateUser({ data: { timezone: tz } });
        }}
      />
    )}
    <AgentationMount />
  </>
  );
}

function AgentationMount() {
  useEffect(() => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = ReactDOM.createRoot(container);
    root.render(React.createElement(Agentation));
    return () => {
      root.unmount();
      document.body.removeChild(container);
    };
  }, []);
  return null;
}
