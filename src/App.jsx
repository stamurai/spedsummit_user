import { useState, useRef, useEffect, useCallback, useReducer } from "react";
import { createPortal } from "react-dom";
import * as PhosphorIcons from "@phosphor-icons/react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import LandingV2 from "./v2/LandingV2";
import { motion, useMotionValue, useMotionTemplate, useAnimationFrame } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   PHOSPHOR ICONS  (inline SVG, consistent 20px/24px strokes)
───────────────────────────────────────────────────────────────────────────── */
const ICON_MAP = {
  house: PhosphorIcons.House,
  "play-circle": PhosphorIcons.PlayCircle,
  calendar: PhosphorIcons.CalendarBlank,
  users: PhosphorIcons.Users,
  gift: PhosphorIcons.Gift,
  "magnifying-glass": PhosphorIcons.MagnifyingGlass,
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
};

const Icon = ({ name, size = 20, color = "currentColor", style: s = {} }) => {
  const IconCmp = ICON_MAP[name] || PhosphorIcons.Circle;
  return (
    <IconCmp
      size={size}
      color={color}
      weight="bold"
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

// Global mutable user name — updated by ProfilePage on save
export const userProfile = { name: "Alex Johnson" };

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

function useVimeoDuration(vimeoUrl) {
  const [dur, setDur] = useState(null);
  useEffect(() => {
    if (!vimeoUrl) return;
    const match = vimeoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (!match) return;
    fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${match[1]}`)
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
  const match = vimeoUrl?.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  const vimeoThumbSrc = match ? `https://vumbnail.com/${match[1]}.jpg` : null;
  const [src, setSrc] = useState(vimeoThumbSrc || fallbackSrc);
  useEffect(() => { setSrc(vimeoThumbSrc || fallbackSrc); }, [vimeoUrl]);
  const [hov, setHov] = useState(false);
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

async function downloadCertificate({ recipientName = "Alex Johnson", sessionTitle, instructor, duration = "", score = null, quizTitle = null, description = "" }) {
  const today  = new Date().toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });
  const certId = `SS-${Date.now().toString(36).toUpperCase()}`;
  const title  = quizTitle || sessionTitle;
  const pdHours = duration ? parseFloat(duration) || 1 : 1;
  const sealDataUrl = await loadSealAsPng(`${window.location.origin}/seal.svg`, 220);

  const W = 1122, H = 794;
  const el = document.createElement("div");
  el.style.cssText = `position:fixed;left:-9999px;top:-9999px;width:${W}px;height:${H}px;overflow:hidden;`;
  el.innerHTML = `
    <div style="position:relative;width:${W}px;height:${H}px;background:#ffffff;font-family:'Segoe UI',Roboto,sans-serif;box-sizing:border-box;padding:56px 80px 48px;display:flex;flex-direction:column;">

        <!-- Header row -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:36px;">
          <img src="${window.location.origin}/Container.png" style="height:42px;width:auto;" crossorigin="anonymous"/>
          <div style="text-align:right;font-size:11px;color:#a1a5b7;line-height:2;">
            <div>Certificate ID: ${certId}</div>
            <div>spedsummit.com/cert/${certId.toLowerCase()}</div>
            <div>Date Issued: ${today}</div>
          </div>
        </div>

        <!-- Certificate label -->
        <div style="font-size:11px;font-weight:700;color:#3699ff;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:20px;">Certificate of Completion</div>

        <!-- This certifies -->
        <div style="font-size:15px;color:#7e8299;margin-bottom:8px;">This certifies that</div>
        <div style="font-size:42px;font-weight:900;color:#181c32;letter-spacing:-0.5px;margin-bottom:8px;line-height:1.1;">${recipientName}</div>
        <div style="font-size:15px;color:#7e8299;margin-bottom:22px;">has successfully completed</div>

        <!-- Session title -->
        <div style="font-size:34px;font-weight:800;color:#181c32;line-height:1.2;margin-bottom:28px;max-width:800px;">${title}</div>

        <!-- Meta grid -->
        <div style="display:flex;gap:48px;margin-bottom:22px;">
          <div>
            <div style="font-size:10px;font-weight:700;color:#a1a5b7;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">Date</div>
            <div style="font-size:14px;font-weight:700;color:#181c32;">${today}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:700;color:#a1a5b7;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">Duration</div>
            <div style="font-size:14px;font-weight:700;color:#181c32;">${duration || "1 Hour"}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:700;color:#a1a5b7;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">PD Hours Earned</div>
            <div style="font-size:14px;font-weight:700;color:#181c32;">${pdHours}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:700;color:#a1a5b7;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">Provider</div>
            <div style="font-size:14px;font-weight:700;color:#181c32;">AbleSpace (SPED Summit)</div>
          </div>
          ${score !== null ? `<div>
            <div style="font-size:10px;font-weight:700;color:#a1a5b7;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">Score</div>
            <div style="font-size:14px;font-weight:700;color:#181c32;">${score}%</div>
          </div>` : ""}
        </div>

        ${description ? `<div style="font-size:13px;color:#5e6278;line-height:1.7;max-width:740px;margin-bottom:0;">${description}</div>` : ""}

        <!-- Divider -->
        <div style="height:1px;background:#e4e6ef;margin-top:auto;margin-bottom:22px;"></div>

        <!-- Footer -->
        <div style="display:flex;justify-content:space-between;align-items:flex-end;">
          <div>
            <div style="font-size:12px;color:#a1a5b7;margin-bottom:3px;">Authorized by</div>
            <div style="font-size:16px;font-weight:800;color:#181c32;">${instructor}</div>
            <div style="font-size:11px;color:#a1a5b7;margin-top:10px;">Certificate ID: ${certId}</div>
          </div>
          <img src="${sealDataUrl}" style="width:100px;height:100px;display:block;mix-blend-mode:multiply;"/>
        </div>

    </div>`;

  document.body.appendChild(el);

  try {
    const canvas = await html2canvas(el.firstElementChild, {
      scale: 2, useCORS: true, backgroundColor: "#ffffff", width: W, height: H,
    });
    const imgData = canvas.toDataURL("image/jpeg", 0.98);
    const pdf = new jsPDF({ orientation:"landscape", unit:"px", format:[W, H], hotfixes:["px_scaling"] });
    pdf.addImage(imgData, "JPEG", 0, 0, W, H);
    const filename = `SPED-Summit-Certificate-${title.replace(/[^a-z0-9]/gi,"_").slice(0,40)}.pdf`;
    pdf.save(filename);
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
];

const INSTRUCTOR_AVATARS = {
  "Tara Roehl":      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&auto=format",
  "Casey Harrison":  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&auto=format",
  "Jordan Smith":    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&auto=format",
  "Morgan Lee":      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop&auto=format",
  "Dr. Emily Tran":  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&fit=crop&auto=format",
  "Dr. Sarah Kim":   "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&auto=format",
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
    icon: "🌸",
  },
  {
    id: "winter-2025",
    name: "Winter 2025",
    tagline: "Past Season",
    description: "Recorded sessions from the Winter 2025 SPED Summit. Available recordings included.",
    sessionIds: [3, 4],
    color: "#6b7280",
    bg: "#f3f4f6",
    icon: "❄️",
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
function getSessionState(sessionId) {
  const avail = SESSION_AVAILABILITY[sessionId];
  if (!avail || !avail.availableFrom) return "unavailable";
  const now = new Date();
  if (avail.availableTo && now > new Date(avail.availableTo)) return "past";
  if (now < new Date(avail.availableFrom)) return "upcoming";
  return "live";
}

function isSessionAvailable(sessionId) { return getSessionState(sessionId) === "live"; }
function isSessionArchived(sessionId)  { return getSessionState(sessionId) === "past"; }

const SCHEDULE = [
  { id:1, date:"26th Mar", time:"09:00 AM", type:"OPENING", title:"Mental Health & Teacher Wellness in Special Education", description:"Sarah Habib—Occupational Therapist and founder of The Calm Caterpillar—shares practical, mindfulness-based strategies to support emotional regulation and wellness for both students and educators.", status:"past", cta:"Watch Again", instructor:"Tara Roehl" },
  { id:2, date:"26th Mar", time:"11:00 AM", type:"KEYNOTE", title:"Accommodations & Inclusion: Integrating Students into Mainstream", description:"Casey Harrison—Certified Dyslexia Specialist—shares practical, research-aligned strategies to support students with dyslexia and language-based learning differences.", status:"past", cta:"Resume Lesson", instructor:"Casey Harrison" },
  { id:3, date:"6th Jan 2025", time:"09:00 AM", type:"WORKSHOP", title:"Empowering Language and Literacy Skills with DHH Children", description:"Sydney Bassard—Speech-Language Pathologist—shares practical, evidence-informed strategies to build strong language and literacy foundations in children who are Deaf or Hard of Hearing.", status:"past", cta:"Recording Unavailable", instructor:"Jordan Smith" },
  { id:4, date:"7th Jan 2025", time:"02:00 PM", type:"NETWORKING", title:"Paraeducators & Team Collaboration: Training, Delegation & More", description:"Diana Williams shares practical, leadership-driven strategies for building strong, collaborative partnerships between teachers and paraeducators.", status:"past", cta:"Watch Again", instructor:"Morgan Lee" },
  { id:5, date:"15th Apr", time:"09:00 AM", type:"WORKSHOP", title:"AI and Advanced Technologies in SPED", description:"Join Dr. Emily Tran as she guides educators through the process of utilizing data to inform teaching practices and enhance student learning.", status:"upcoming", cta:"Registered", instructor:"Dr. Emily Tran" },
  { id:6, date:"15th Apr", time:"11:00 AM", type:"PANEL DISCUSSION", title:"Understanding & Supporting Communication for Students with AAC", description:"A panel of AAC specialists discuss implementation strategies, device selection, and how to create truly inclusive communication environments.", status:"upcoming", cta:"Register", instructor:"Dr. Sarah Kim" },
];

const SCHEDULE_TYPE_COLORS = { OPENING:{c:"#7c3aed",bg:"rgba(124,58,237,0.12)"}, KEYNOTE:{c:"#2563eb",bg:"rgba(37,99,235,0.12)"}, WORKSHOP:{c:"#059669",bg:"rgba(5,150,105,0.12)"}, NETWORKING:{c:"#d97706",bg:"rgba(217,119,6,0.12)"}, "PANEL DISCUSSION":{c:"#dc2626",bg:"rgba(220,38,38,0.12)"} };
const ADMIN_STATUS_COLORS = { LIVE:{c:"#fff",bg:"#10b981"}, DRAFT:{c:"#d97706",bg:"rgba(217,119,6,0.12)"}, ARCHIVED:{c:"#6b7280",bg:"rgba(107,114,128,0.12)"} };

const ADMIN_SESSIONS_DATA = [
  { id:1, title:"Mental Health & Teacher Wellness in Special Education", category:"SPED", status:"LIVE", date:"Mar 26, 2026", enrolled:1240, availableFrom:"2026-03-26T09:00", availableTo:"2027-12-31T23:59" },
  { id:2, title:"Accommodations & Inclusion: Integrating Students into Mainstream Education", category:"SPED", status:"LIVE", date:"Mar 26, 2026", enrolled:850, availableFrom:"2026-03-26T11:00", availableTo:"2027-12-31T23:59" },
  { id:3, title:"Empowering Language and Literacy Skills with DHH Children", category:"SPED", status:"ARCHIVED", date:"Jan 6, 2025", enrolled:620, availableFrom:"2025-01-06T09:00", availableTo:"2025-06-30T23:59" },
  { id:4, title:"Paraeducators & Team Collaboration: Training, Delegation & More", category:"SPED", status:"ARCHIVED", date:"Jan 7, 2025", enrolled:410, availableFrom:"2025-01-07T09:00", availableTo:"2025-06-30T23:59" },
  { id:5, title:"Introduction to Accessibility in SPED", category:"SPED", status:"ARCHIVED", date:"Archived Mar 2026", enrolled:320, availableFrom:"2025-01-01T09:00", availableTo:"2026-03-01T23:59" },
];

const COMMUNITY_POSTS_DATA = [
  { id:1, author:"Tara Roehl", role:"MENTOR", time:"2h ago", title:"The shifting landscape of Design Systems in 2024: Moving beyond tokens.", body:"I've been noticing a trend where teams focus too much on the plumbing and not enough on the patterns of use. How are you all balancing maintenance with creative evolution?", tags:["#Design-Systems","#UI-Design"], likes:124, replies:42, type:"post" },
  { id:2, author:"Sydney Bassard", role:"MENTOR", time:"5h ago", title:"Best practices for documenting handoff for remote developers?", body:"We're finding that just sending Figma links isn't enough. Any checklists you use?", tags:[], likes:89, replies:18, type:"question" },
  { id:3, author:"Alex Rivera", role:"USER", time:"1d ago", title:"Just finished the AI & SPED session — mind blown.", body:"The practical applications for AAC integration alone were worth the entire summit. Who else is implementing these strategies right now?", tags:["#AI-in-SPED","#AAC"], likes:67, replies:23, type:"post" },
];

/* ─────────────────────────────────────────────────────────────────────────────
   UTILITIES
───────────────────────────────────────────────────────────────────────────── */
function getCTA(s) {
  if (s.status==="locked") return { label:"Locked", disabled:true };
  if (s.status==="completed") return { label:"Watch Again", disabled:false };
  if (s.status==="in-progress") return { label:"Resume Lesson", disabled:false };
  return { label:"Start Session", disabled:false };
}

function Avatar({ name, src, size=36 }) {
  const [imgFailed, setImgFailed] = useState(false);
  const colors = ["#2563eb","#7c3aed","#059669","#d97706","#dc2626","#0891b2","#0d9488"];
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
  return <span style={{ fontSize:size, fontWeight:700, color, background:bg, padding:"2px 8px", borderRadius:99, letterSpacing:0.4, display:"inline-block", lineHeight:1.6 }}>{label}</span>;
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
      style={{ padding:sizes[size], borderRadius:8, fontSize:14, fontWeight:600, cursor:disabled?"not-allowed":"pointer",
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
function DropdownMenu({ items, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  return (
    <div ref={ref} style={{ position:"absolute", right:0, top:"110%", background:C.white, border:`1px solid ${C.gray200}`, borderRadius:12, boxShadow:"0 8px 24px rgba(0,0,0,0.12)", minWidth:170, zIndex:200, overflow:"hidden", animation:"fadeIn .15s ease" }}>
      {items.map((item, i) => (
        <button key={i} onClick={() => { item.action(); onClose(); }}
          style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 16px", background:"transparent", border:"none", fontSize:14, fontWeight:500, color:item.danger?C.error:C.gray700, cursor:"pointer", borderBottom:i<items.length-1?`1px solid ${C.gray100}`:"none", textAlign:"left" }}
          onMouseEnter={e=>e.currentTarget.style.background=C.gray50}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          {item.icon && <Icon name={item.icon} size={16} color={item.danger?C.error:C.gray500}/>}
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
const NOTIF_DATA = [
  { id:1, type:"session",  icon:"play-circle", color:C.primary,  bg:C.primaryLight,  title:"New session available",        body:"\"AI & Advanced Technologies in SPED\" is now unlocked for you.", time:"2m ago",  read:false },
  { id:2, type:"community",icon:"chat-circle", color:"#7c3aed",  bg:"#f5f3ff",       title:"Tara Roehl replied to your post", body:"\"Great point! The DHH strategies also apply here — check out…\"", time:"18m ago", read:false },
  { id:3, type:"reward",   icon:"star",        color:C.warning,  bg:C.warningLight,  title:"You earned a new badge 🏆",    body:"\"Knowledge Seeker\" — You completed 3 quizzes this week.",       time:"1h ago",  read:false },
  { id:4, type:"schedule", icon:"calendar",    color:C.success,  bg:C.successLight,  title:"Session starting in 30 min",   body:"\"Paraeducators & Team Collaboration\" starts at 2:00 PM EST.",   time:"30m ago", read:true  },
  { id:5, type:"system",   icon:"info",        color:C.gray500,  bg:C.gray100,       title:"Platform update",              body:"New analytics features are live. Check your admin dashboard.",    time:"3h ago",  read:true  },
];

function NotificationPopover({ onClose }) {
  const [notifs, setNotifs] = useState(NOTIF_DATA);
  const ref = useRef(null);
  const unreadCount = notifs.filter(n => !n.read).length;

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  function markRead(id) { setNotifs(ns => ns.map(n => n.id === id ? { ...n, read:true } : n)); }
  function markAllRead() { setNotifs(ns => ns.map(n => ({ ...n, read:true }))); }
  function dismiss(id) { setNotifs(ns => ns.filter(n => n.id !== id)); }

  return (
    <div ref={ref} style={{
      position:"absolute", top:"calc(100% + 8px)", right:0,
      width:420, background:C.white, borderRadius:16,
      border:`1px solid ${C.gray200}`, boxShadow:"0 16px 40px rgba(0,0,0,0.14)",
      zIndex:300, overflow:"hidden", animation:"fadeIn .18s ease"
    }}>
      {/* Header */}
      <div style={{ padding:"14px 16px 12px", borderBottom:`1px solid ${C.gray100}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontWeight:800, fontSize:16, color:C.gray900 }}>Notifications</span>
          {unreadCount > 0 && (
            <span style={{ background:C.error, color:"#fff", fontSize:12, fontWeight:800, padding:"1px 7px", borderRadius:99 }}>{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead}
            style={{ fontSize:12, fontWeight:600, color:C.primary, background:"none", border:"none", cursor:"pointer", padding:"2px 4px", borderRadius:5 }}
            onMouseEnter={e => e.currentTarget.style.background = C.primaryLight}
            onMouseLeave={e => e.currentTarget.style.background = "none"}>
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div style={{ maxHeight:400, overflowY:"auto" }}>
        {notifs.length === 0 && (
          <div style={{ padding:"40px 20px", textAlign:"left" }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🎉</div>
            <div style={{ fontWeight:600, fontSize:14, color:C.gray700 }}>All caught up!</div>
            <div style={{ fontSize:12, color:C.gray400, marginTop:4 }}>No new notifications.</div>
          </div>
        )}
        {notifs.map((n, i) => (
          <div key={n.id}
            onClick={() => markRead(n.id)}
            style={{
              display:"flex", alignItems:"flex-start", gap:12, padding:"12px 16px",
              borderBottom: i < notifs.length - 1 ? `1px solid ${C.gray100}` : "none",
              background: n.read ? C.white : "#f8faff",
              cursor:"pointer", transition:"background .15s", position:"relative"
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.gray50}
            onMouseLeave={e => e.currentTarget.style.background = n.read ? C.white : "#f8faff"}>
            {/* Icon badge */}
            <div style={{ width:36, height:36, borderRadius:10, background:n.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
              <Icon name={n.icon} size={17} color={n.color}/>
            </div>
            {/* Content */}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:6 }}>
                <span style={{ fontSize:14, fontWeight: n.read ? 500 : 700, color:C.gray900, lineHeight:1.3 }}>{n.title}</span>
                <span style={{ fontSize:12, color:C.gray400, whiteSpace:"nowrap", flexShrink:0 }}>{n.time}</span>
              </div>
              <p style={{ margin:"3px 0 0", fontSize:12, color:C.gray500, lineHeight:1.5, overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{n.body}</p>
            </div>
            {/* Unread dot */}
            {!n.read && (
              <div style={{ width:7, height:7, borderRadius:"50%", background:C.primary, flexShrink:0, marginTop:5 }}/>
            )}
            {/* Dismiss ×  */}
            <button
              onClick={e => { e.stopPropagation(); dismiss(n.id); }}
              style={{ position:"absolute", top:10, right:12, width:20, height:20, borderRadius:5, background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", opacity:0, transition:"opacity .15s" }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.background = C.gray100; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "0"; e.currentTarget.style.background = "none"; }}>
              <Icon name="x" size={12} color={C.gray500}/>
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      {notifs.length > 0 && (
        <div style={{ padding:"10px 16px", borderTop:`1px solid ${C.gray100}`, textAlign:"left" }}>
          <button style={{ fontSize:12, fontWeight:600, color:C.primary, background:"none", border:"none", cursor:"pointer" }}>
            View all notifications
          </button>
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
          xlinkHref="data:image/png;base64,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"/>
      </defs>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SEARCH BAR
───────────────────────────────────────────────────────────────────────────── */
const SEARCH_PAGES = [
  { id:"dashboard",        label:"My Learnings", icon:"house",       type:"page" },
  { id:"schedules",        label:"Schedules",    icon:"calendar",    type:"page" },
  { id:"certifications",   label:"My Certificates", icon:"certificate", type:"page" },
  { id:"profile",          label:"My Profile",   icon:"user-circle", type:"page" },
];

/* ─────────────────────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────────────────────── */
function Footer() {
  const muted = "#6b7280";
  const text  = "#111827";
  const border = "#e5e7eb";
  const bg = "#fff";
  const hover = "rgba(0,0,0,0.04)";
  return (
    <footer style={{ background:bg, borderTop:`1px solid ${border}`, fontFamily:"inherit", flexShrink:0 }}>
      <div style={{ maxWidth:1024, margin:"0 auto", padding:"56px 24px 48px", display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:48, borderBottom:`1px solid ${border}` }}>
        {/* Brand */}
        <div>
          <img src="/Container.png" alt="SPED Summit" style={{ height:26, display:"block", marginBottom:16 }}/>
          <p style={{ margin:"0 0 24px", fontSize:14, color:muted, lineHeight:1.7, maxWidth:280 }}>
            SPED Summit is a free professional development platform for Special Education professionals — built by educators, for educators.
          </p>
          <div style={{ display:"flex", gap:10 }}>
            {[
              { label:"YouTube",   svg:"M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" },
              { label:"Instagram", svg:"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
              { label:"Facebook",  svg:"M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" },
            ].map(({ label, svg }) => (
              <a key={label} href="#" aria-label={label}
                style={{ width:32, height:32, borderRadius:8, border:`1px solid ${border}`, background:bg, display:"flex", alignItems:"center", justifyContent:"center", transition:"background .12s", textDecoration:"none" }}
                onMouseEnter={e => e.currentTarget.style.background=hover}
                onMouseLeave={e => e.currentTarget.style.background=bg}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill={muted}><path d={svg}/></svg>
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {[
          { heading:"Platform", links:["Sessions","Instructors","Giveaways","Schedule","Community"] },
          { heading:"Company",  links:["About","Blog","Careers","Press","Contact"] },
          { heading:"Legal",    links:["Privacy Policy","Terms of Service","Cookie Policy","Accessibility"] },
        ].map(({ heading, links }) => (
          <div key={heading}>
            <div style={{ fontSize:11, fontWeight:600, color:muted, letterSpacing:.8, textTransform:"uppercase", marginBottom:16 }}>{heading}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {links.map(l => (
                <a key={l} href="#" style={{ fontSize:14, color:muted, textDecoration:"none", transition:"color .12s" }}
                  onMouseEnter={e => e.currentTarget.style.color=text}
                  onMouseLeave={e => e.currentTarget.style.color=muted}>{l}</a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Copyright */}
      <div style={{ padding:"16px 24px", display:"flex", justifyContent:"center" }}>
        <span style={{ fontSize:12, color:muted }}>© {new Date().getFullYear()} SPED Summit. All rights reserved.</span>
      </div>
    </footer>
  );
}

function SearchBar({ onOpenSession, onNavigate }) {
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

  const sessionResults = q.length < 1 ? [] : SESSIONS.filter(s =>
    s.title.toLowerCase().includes(q) ||
    s.instructor.toLowerCase().includes(q) ||
    s.category.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q)
  ).slice(0, 5);

  const pageResults = q.length < 1 ? [] : SEARCH_PAGES.filter(p =>
    p.label.toLowerCase().includes(q)
  );

  const instructorResults = q.length < 1 ? [] : [...new Map(
    SESSIONS.filter(s => s.instructor.toLowerCase().includes(q)).map(s => [s.instructor, s])
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
                <button key={s.instructor} onClick={() => pick(() => onOpenSession(s))}
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
              {SEARCH_PAGES.map(p => (
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

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:900, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}
      onClick={onClose}>
      <div style={{ background: dark ? "#1e2647" : "#fff", borderRadius:20, width:"100%", maxWidth:460, boxShadow:"0 24px 60px rgba(0,0,0,0.3)", overflow:"hidden", position:"relative" }}
        onClick={e => e.stopPropagation()}>

        {/* Close */}
        <button onClick={onClose} style={{ position:"absolute", top:14, right:14, width:28, height:28, borderRadius:8, border:`1px solid ${dark?"rgba(255,255,255,0.12)":C.gray200}`, background:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="x" size={14} color={dark ? "rgba(255,255,255,0.5)" : C.gray500}/>
        </button>

        {/* Header */}
        <div style={{ padding:"32px 28px 20px", textAlign:"center", borderBottom:`1px solid ${dark?"rgba(255,255,255,0.08)":C.gray100}` }}>
          <div style={{ width:56, height:56, borderRadius:16, background:"rgba(54,153,255,0.12)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
            <Icon name="gift" size={28} color={C.primary}/>
          </div>
          <div style={{ fontSize:20, fontWeight:800, color: dark ? "#fff" : C.gray900, marginBottom:8 }}>Refer Friends, Get Pro Free</div>
          <div style={{ fontSize:13, color: dark ? "rgba(255,255,255,0.55)" : C.gray500, lineHeight:1.6, maxWidth:320, margin:"0 auto" }}>
            Invite a friend to SPED Summit. When they join, <strong style={{ color:C.primary }}>you both get 6 months of Pro</strong> — or refer 3+ friends for a full year free.
          </div>
        </div>

        {/* Body */}
        <div style={{ padding:"24px 28px" }}>

          {/* Copy link */}
          <div style={{ fontSize:12, fontWeight:700, color: dark ? "rgba(255,255,255,0.5)" : C.gray500, marginBottom:8, letterSpacing:.5 }}>YOUR INVITATION LINK</div>
          <div style={{ display:"flex", gap:8, marginBottom:20 }}>
            <div style={{ flex:1, padding:"10px 14px", background: dark ? "rgba(255,255,255,0.06)" : C.gray50, border:`1px solid ${dark?"rgba(255,255,255,0.1)":C.gray200}`, borderRadius:10, fontSize:12, color: dark ? "rgba(255,255,255,0.45)" : C.gray500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {refLink}
            </div>
            <button onClick={copyLink}
              style={{ padding:"10px 18px", background: copied ? C.success : C.primary, color:"#fff", border:"none", borderRadius:10, fontSize:12, fontWeight:700, cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", gap:6, transition:"background .2s" }}>
              <Icon name="copy" size={13} color="#fff"/>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Email invite */}
          <div style={{ fontSize:12, fontWeight:700, color: dark ? "rgba(255,255,255,0.5)" : C.gray500, marginBottom:8, letterSpacing:.5 }}>EMAIL YOUR INVITATION</div>
          <div style={{ display:"flex", gap:8, marginBottom:24 }}>
            <input
              type="email" placeholder="friend@email.com" value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendInvite()}
              style={{ flex:1, padding:"10px 14px", background: dark ? "rgba(255,255,255,0.06)" : C.gray50, border:`1px solid ${dark?"rgba(255,255,255,0.1)":C.gray200}`, borderRadius:10, fontSize:13, color: dark ? "#fff" : C.gray900, outline:"none" }}/>
            <button onClick={sendInvite}
              style={{ padding:"10px 18px", background: sent ? C.success : C.primary, color:"#fff", border:"none", borderRadius:10, fontSize:12, fontWeight:700, cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", gap:6, transition:"background .2s" }}>
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

function TopBar({ onToggleAdmin, isAdmin, toast, isDark, onToggleDarkMode, onLogout, onNavigateProfile, onOpenSession, onNavigate, userName = "Alex Johnson", onBrowseSelect }) {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showReferModal, setShowReferModal] = useState(false);
  const [showBrowse, setShowBrowse] = useState(false);
  const browseRef = useRef(null);
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

  /* Derive seasons and years from SEASONS data */
  const browseSeasons = SEASONS.map(s => ({ id: s.id, name: s.name, tagline: s.tagline, color: s.color }));
  const browseYears   = [...new Set(SEASONS.map(s => s.name.split(" ")[1]))].sort((a,b) => b - a);
  const browseSeasonNames = [...new Set(SEASONS.map(s => s.name.split(" ")[0]))];

  return (
    <div style={{ height:60, background:C.white, borderBottom:`1px solid ${C.gray200}`, display:"flex", alignItems:"center", paddingLeft:12, paddingRight:12, position:"sticky", top:0, zIndex:100, flexShrink:0 }}>
      {/* Logo */}
      <div style={{ flexShrink:0, display:"flex", alignItems:"center", cursor:"pointer" }}
        onClick={()=>onNavigate(isAdmin ? "admin-overview" : "dashboard")}>
        <img src="/Container.png" alt="SPED Summit" style={{ height:28, width:"auto", display:"block" }}/>
      </div>

      {/* Browse button */}
      <div style={{ position:"relative", marginLeft:16, flexShrink:0 }} ref={browseRef}>
        <button
          onClick={() => setShowBrowse(v => !v)}
          style={{ display:"inline-flex", alignItems:"center", gap:5, background:"none", border:"none", cursor:"pointer", fontSize:14, fontWeight:600, color: showBrowse ? C.primary : C.gray700, padding:"6px 10px", borderRadius:8, fontFamily:"inherit", transition:"color .15s" }}
          onMouseEnter={e => { if (!showBrowse) e.currentTarget.style.color = C.gray900; }}
          onMouseLeave={e => { if (!showBrowse) e.currentTarget.style.color = C.gray700; }}>
          Browse
          <Icon name="caret-down" size={13} color={showBrowse ? C.primary : C.gray500}
            style={{ transition:"transform .2s", transform: showBrowse ? "rotate(180deg)" : "rotate(0deg)" }}/>
        </button>

        {showBrowse && (
          <div style={{ position:"absolute", top:"calc(100% + 8px)", left:0, background:"#fff", border:"1px solid #e4e4e7", borderRadius:14, boxShadow:"0 12px 40px rgba(0,0,0,0.12)", minWidth:400, zIndex:200, display:"flex", overflow:"hidden" }}>
            {/* Sessions column */}
            <div style={{ flex:1, padding:"12px 12px 10px" }}>
              <div style={{ fontSize:11, fontWeight:700, color:C.gray400, letterSpacing:.8, textTransform:"uppercase", marginBottom:4, paddingLeft:4 }}>Sessions</div>
              <div style={{ display:"flex", flexDirection:"column" }}>
                {browseSeasons.map(s => (
                  <button key={s.id}
                    onClick={() => { setShowBrowse(false); const [sn, sy] = s.name.split(" "); onBrowseSelect?.(sn, sy); }}
                    style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", background:"none", border:"none", cursor:"pointer", padding:"6px 8px", borderRadius:8, textAlign:"left", fontFamily:"inherit", transition:"background .12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f4f4f5"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}>
                    <span style={{ fontSize:14, fontWeight:600, color:C.gray900 }}>{s.name}</span>
                    <span style={{ fontSize:12, color:C.gray400, marginTop:1 }}>{s.tagline}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div style={{ width:1, background:"#f0f0f0", flexShrink:0 }}/>

            {/* Year column */}
            <div style={{ minWidth:100, padding:"12px 12px 10px" }}>
              <div style={{ fontSize:11, fontWeight:700, color:C.gray400, letterSpacing:.8, textTransform:"uppercase", marginBottom:4, paddingLeft:4 }}>Year</div>
              <div style={{ display:"flex", flexDirection:"column" }}>
                {browseYears.map(y => (
                  <button key={y}
                    onClick={() => { setShowBrowse(false); onBrowseSelect?.("all", y); }}
                    style={{ background:"none", border:"none", cursor:"pointer", padding:"6px 8px", borderRadius:8, fontSize:14, fontWeight:600, color:C.gray900, textAlign:"left", fontFamily:"inherit", transition:"background .12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f4f4f5"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}>
                    {y}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search — centered */}
      <div style={{ flex:1, display:"flex", justifyContent:"center", padding:"0 16px" }}>
        <SearchBar onOpenSession={onOpenSession} onNavigate={onNavigate}/>
      </div>

      {/* Right actions */}
      <div style={{ flexShrink:0, display:"flex", alignItems:"center", gap:6 }}>
        {/* Notification button + popover */}
        <div style={{ position:"relative" }} ref={notifBtnRef}>
          <button
            onClick={() => setShowNotif(v => !v)}
            style={{ width:36, height:36, borderRadius:"50%", border:"none", background: showNotif ? C.primaryLight : C.gray100, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", transition:"background .15s" }}
            onMouseEnter={e => { if (!showNotif) e.currentTarget.style.background = C.gray200; }}
            onMouseLeave={e => { if (!showNotif) e.currentTarget.style.background = C.gray100; }}>
            <Icon name="bell" size={18} color={showNotif ? C.primary : C.gray600}/>
            {unread > 0 && (
              <span style={{ position:"absolute", top:5, right:5, width:8, height:8, borderRadius:"50%", background:C.error, border:`2px solid ${C.white}` }}/>
            )}
          </button>
          {showNotif && <NotificationPopover onClose={() => setShowNotif(false)}/>}
        </div>


        {showReferModal && <ReferFriendsModal onClose={() => setShowReferModal(false)} userName={userName}/>}

        {/* Avatar */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowProfileMenu(v => !v)}
            style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer", borderRadius: "50%" }}>
            <Avatar name={userName} size={34}/>
          </button>
          {showProfileMenu && (
            <DropdownMenu
              items={[
                {
                  icon: "user-circle",
                  label: "My Profile",
                  action: () => { setShowProfileMenu(false); onNavigateProfile?.(); },
                },
                {
                  icon: isAdmin ? "house" : "gear",
                  label: isAdmin ? "Switch to User View" : "Switch to Admin Panel",
                  action: () => { onToggleAdmin(); setShowProfileMenu(false); },
                },
                {
                  icon: isDark ? "sun" : "moon",
                  label: isDark ? "Light Mode" : "Dark Mode",
                  action: () => onToggleDarkMode?.(),
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
function Sidebar({ active, onChange, isAdmin }) {
  const [hov, setHov] = useState(null);
  const userNav = [
    { id:"dashboard",      icon:"house",        label:"My Learnings"    },
    { id:"sessions",       icon:"play-circle",  label:"All Sessions"    },
    { id:"schedules",      icon:"calendar",     label:"Schedules"       },
    { id:"certifications", icon:"certificate",  label:"My Certificates" },
  ];
  const adminNav = [
    { id:"admin-overview",  icon:"house",       label:"Overview"    },
    { id:"admin-sessions",  icon:"play-circle", label:"My Sessions" },
    { id:"admin-analytics", icon:"chart-line",  label:"Analytics"   },
  ];
  const nav = isAdmin ? adminNav : userNav;

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
function TabBar({ active, onChange, isAdmin }) {
  const userNav = [
    { id:"dashboard",      label:"My Learnings"    },
    { id:"certifications", label:"My Certificates" },
  ];
  const adminNav = [
    { id:"admin-overview",  label:"Overview"    },
    { id:"admin-sessions",  label:"My Sessions" },
    { id:"admin-analytics", label:"Analytics"   },
  ];
  const nav = isAdmin ? adminNav : userNav;

  return (
    <>
      <style>{`
        .tabbar-wrap {
          background: #fff;
          border-bottom: 1px solid #e4e4e7;
          padding: 0 20px;
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
          color: #71717a;
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
          color: #18181b;
        }
        .tabbar-tab-active {
          color: #18181b;
          font-weight: 600;
        }
        .tabbar-tab-active::after {
          background: #18181b;
        }
      `}</style>
      <div className="tabbar-wrap">
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
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SESSION CARD
───────────────────────────────────────────────────────────────────────────── */
function SessionCard({ session, onClick, quizState = {}, onAssessmentClick, onCertificateClick }) {
  const cta = getCTA(session);
  const catColors = { MANAGEMENT:{c:"#2563eb",bg:"rgba(37,99,235,0.12)"}, LEADERSHIP:{c:"#7c3aed",bg:"rgba(124,58,237,0.12)"}, COMMUNICATION:{c:"#0ea5e9",bg:"rgba(14,165,233,0.12)"}, TEAMWORK:{c:"#f97316",bg:"rgba(249,115,22,0.12)"}, TECHNOLOGY:{c:"#6366f1",bg:"rgba(99,102,241,0.12)"}, ACCESSIBILITY:{c:"#ec4899",bg:"rgba(236,72,153,0.12)"} };
  const cc = catColors[session.category] || { c:C.primary, bg:"rgba(54,153,255,0.12)" };

  /* ── Determine assessment CTA ── */
  const qs = quizState.status; // "not-taken" | "in-progress" | "passed" | "failed" | undefined
  const hasAssessment = !!SESSION_QUIZZES[session.id];
  const watchedEnough = session.progress >= 80;
  const showAssessmentCTA = session.status === "completed" && hasAssessment && watchedEnough;

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
    if (cardClickable || showAssessmentCTA) {
      onClick(session);
    }
  }

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={()=>setCardHov(true)}
      onMouseLeave={()=>setCardHov(false)}
      style={{ background:C.white, borderRadius:14, overflow:"hidden",
               boxShadow:"0 1px 3px rgba(0,0,0,0.07)", cursor: cta.disabled ? "default" : "pointer",
               border:`1px solid ${C.gray200}`, display:"flex", flexDirection:"column" }}>

      {/* Thumbnail */}
      <div style={{ position:"relative", flexShrink:0 }}>
        <SessionThumb id={session.id} height={152} overlay={session.status==="locked"} noPlayHover vimeoUrl={session.vimeoUrl}/>
        {/* Play overlay on card hover */}
        {session.status !== "locked" && cardHov && (
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.15)", transition:"opacity .15s", pointerEvents:"none" }}>
            <div style={{ width:44, height:44, borderRadius:"50%", background:"rgba(255,255,255,0.22)", backdropFilter:"blur(4px)", border:"2px solid rgba(255,255,255,0.5)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
        )}
        {session.status==="completed" && qs !== "passed" && (
          <div style={{ position:"absolute", top:10, right:10, width:24, height:24, borderRadius:"50%",
                        background:C.success, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="check" size={14} color="#fff"/>
          </div>
        )}
        {qs === "passed" && (
          <div style={{ position:"absolute", top:10, right:10, display:"flex", alignItems:"center",
                        gap:4, background:"rgba(16,185,129,0.92)", backdropFilter:"blur(4px)",
                        padding:"4px 9px", borderRadius:99 }}>
            <Icon name="medal" size={12} color="#fff"/>
            <span style={{ fontSize:12, fontWeight:700, color:"#fff" }}>CERTIFIED</span>
          </div>
        )}
        {session.status==="locked" && (
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="lock" size={32} color="rgba(255,255,255,0.9)"/>
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding:"14px 16px 16px", flex:1, display:"flex", flexDirection:"column" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <Badge label={session.category} color={cc.c} bg={cc.bg} size={12}/>
          {session.status==="in-progress" && <span style={{ fontSize:12, color:C.gray400 }}>45m Left</span>}
          {qs === "failed" && <span style={{ fontSize:12, fontWeight:700, color:C.error }}>Assessment Failed</span>}
        </div>
        <div style={{ fontWeight:700, fontSize:14, color:C.gray900, marginBottom:4, lineHeight:1.4,
                      display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {session.title}
        </div>
        <div style={{ fontSize:12, color:C.gray500, marginBottom:10 }}>by {session.instructor}</div>

        <div style={{ marginTop:"auto" }}>
          {/* When assessment is in-progress, it replaces the video progress section */}
          {qs === "in-progress" ? (
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:C.gray600, fontWeight:600 }}>
                  <Icon name="timer" size={13} color={C.gray500}/>
                  Assessment in progress
                </div>
                <span style={{ fontSize:12, color:C.gray400 }}>
                  Q{(quizState.currentQ||0)+1}/{SESSION_QUIZZES[session.id]?.length||5}
                </span>
              </div>
              <ProgressBar value={Math.round(((quizState.currentQ||0) / (SESSION_QUIZZES[session.id]?.length||5)) * 100)} color={C.warning}/>
            </div>
          ) : (
            <>
              {session.progress > 0 && (
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontSize:12, color:C.gray500, fontWeight:600 }}>
                    {session.status==="completed" ? "COMPLETED" : "IN PROGRESS"}
                  </span>
                  <span style={{ fontSize:12, color:C.gray500 }}>{session.progress}%</span>
                </div>
              )}
              <ProgressBar value={session.progress}/>
            </>
          )}

          {/* Assessment passed score */}
          {qs === "passed" && quizState.score !== undefined && (
            <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:6,
                          fontSize:12, color:C.success, fontWeight:700 }}>
              <Icon name="check-circle" size={13} color={C.success}/>
              Assessment score: {quizState.score}%
            </div>
          )}

          {/* ── Assessment locked hint ── */}
          {session.status === "completed" && hasAssessment && !watchedEnough && (
            <div style={{ marginTop:10, display:"flex", alignItems:"center", gap:6, fontSize:12, color:C.gray500, background:C.gray100, borderRadius:8, padding:"7px 10px" }}>
              <Icon name="lock" size={13} color={C.gray400}/>
              Watch {80 - session.progress}% more to unlock assessment
            </div>
          )}

          {/* ── Primary CTA button ── */}
          {assessBtn ? (
            <button onClick={assessBtn.action}
              style={{ width:"100%", marginTop:10, padding:"9px 0", borderRadius:8,
                       border: assessBtn.border,
                       background: assessBtn.bg, color: assessBtn.color,
                       fontSize:14, fontWeight:600, cursor:"pointer",
                       display:"flex", alignItems:"center", justifyContent:"center", gap:7,
                       transition:"opacity .15s" }}
              onMouseEnter={e=>e.currentTarget.style.opacity=".88"}
              onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
              <Icon name={assessBtn.icon} size={14} color={assessBtn.color}/>
              {assessBtn.label}
            </button>
          ) : (
            <button onClick={e=>{ e.stopPropagation(); if(!cta.disabled) onClick(session); }}
              style={{ width:"100%", marginTop:12, padding:"9px 0", borderRadius:8,
                       border:cta.label==="Watch Again"?`1px solid ${C.gray300}`:"none",
                       background:cta.disabled?C.gray100:cta.label==="Watch Again"?C.white:C.primary,
                       color:cta.disabled?C.gray400:cta.label==="Watch Again"?C.gray700:"#fff",
                       fontSize:14, fontWeight:600, cursor:cta.disabled?"not-allowed":"pointer",
                       display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              {cta.disabled && <Icon name="lock" size={14} color={C.gray400}/>}
              {cta.label==="Watch Again"    && <Icon name="play" size={14} color={C.gray600}/>}
              {cta.label==="Resume Lesson"  && <Icon name="play" size={14} color="#fff"/>}
              {cta.label==="Start Session"  && <Icon name="play" size={14} color="#fff"/>}
              {cta.disabled ? "Locked" : cta.label}
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
function Dashboard({ onNavigate, onNavigateToSeason, onOpenSession, toast, quizStates, onAssessmentClick, onCertificateClick, enrolledIds = new Set([1,2,3]), onEnroll, scheduleRegistrations = {}, setScheduleRegistrations = ()=>{}, sessions = SESSIONS, externalFilter, onFilterChange }) {
  const [calendarItem, setCalendarItem] = useState(null);
  const [calDaySession, setCalDaySession] = useState(null);
  const [previewSession, setPreviewSession] = useState(null);
  const [contentTab, setContentTab] = useState("inprogress");
  const [calMonth, setCalMonth] = useState(() => new Date(2026, 3, 1));
  const [filterSeason, setFilterSeason] = useState(externalFilter?.season || "all");
  const [filterYear,   setFilterYear]   = useState(externalFilter?.year   || "all");

  useEffect(() => {
    if (externalFilter) {
      setFilterSeason(externalFilter.season);
      setFilterYear(externalFilter.year);
    }
  }, [externalFilter?.season, externalFilter?.year]);

  const enrolledSessions = SESSIONS.filter(s => enrolledIds.has(s.id));
  const upcomingSchedule = SCHEDULE.filter(i => i.status === "upcoming");
  const completed     = enrolledSessions.filter(s => s.status === "completed").length;
  const certsEarned   = enrolledSessions.filter(s => s.status === "completed").length;
  const totalEnrolled = enrolledSessions.length;
  const pct = totalEnrolled > 0 ? Math.round((completed / totalEnrolled) * 100) : 0;
  const hasStarted = enrolledSessions.some(s => s.progress > 0 || s.status === "completed" || s.status === "in-progress");
  const continueSession = enrolledSessions.find(s => s.progress > 0 && s.status !== "completed");
  const featuredSession = SESSIONS.find(s => s.status === "not-started") || SESSIONS[0];

  const LEARNING_PATH = SESSIONS.slice(0, 4).map(s => {
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
      available:    { icon:"play-circle",   iconColor:"#6366f1", iconBg:"rgba(99,102,241,0.1)", label:"Available",   labelColor:"#6366f1", labelBg:"rgba(99,102,241,0.1)"  },
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
  const DB_TESTIMONIALS = [
    { text:"SPED Summit gave me practical tools I could use in my classroom the very next day. Immediately applicable.", name:"Maria Gonzalez", role:"Special Ed Teacher", img:"https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=80&h=80&fit=crop&auto=format", color:"#dcfce7", accent:"#16a34a" },
    { text:"The AAC module completely changed how I support my non-verbal students. Research-backed and immediately usable.", name:"Priya Nair", role:"AAC Specialist, BCBA", img:"https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=80&h=80&fit=crop&auto=format", color:"#fef9c3", accent:"#ca8a04" },
    { text:"Best professional development I've attended. The sessions are structured perfectly and easy to follow.", name:"Devon Castillo", role:"Inclusion Facilitator", img:"https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&h=80&fit=crop&auto=format", color:"#e0e7ff", accent:"#4f46e5" },
    { text:"I loved how each session was visually clear and immediately applicable. The PD I always wished existed.", name:"Jordan Brooks", role:"Resource Room Specialist", img:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format", color:"#fce7f3", accent:"#be185d" },
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
        <div className="db-sidebar-goal" style={{ background:"linear-gradient(135deg, #1d4ed8 0%, #4f46e5 100%)", borderRadius:16, padding:"18px 18px" }}>
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
          <div className="db-hero" style={{ background:"linear-gradient(135deg, #1e40af 0%, #3b82f6 60%, #6366f1 100%)", borderRadius:20, padding:"36px 40px", position:"relative", overflow:"hidden" }}>
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
                  <Avatar name={featuredSession.instructor} src={INSTRUCTOR_AVATARS[featuredSession.instructor]} size={22}/>
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
                { icon:"note-pencil",  color:"#6366f1", bg:"rgba(99,102,241,0.1)",  n:"2", title:"Take the Quiz",    desc:"Test your knowledge with post-session assessments"    },
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
  const scheduledDates = SCHEDULE.map(item => ({ date: parseSessionDate(item.date), item })).filter(x => x.date);
  const calYear  = calMonth.getFullYear();
  const calMon   = calMonth.getMonth();
  const daysInMon = new Date(calYear, calMon + 1, 0).getDate();
  const startOffset = (new Date(calYear, calMon, 1).getDay() + 6) % 7; // Mon=0
  function sessionsOnDay(day) {
    return scheduledDates.filter(sd => sd.date.getDate()===day && sd.date.getMonth()===calMon && sd.date.getFullYear()===calYear);
  }
  const today = new Date();
  const inProgressSessions = enrolledSessions.filter(s => s.status === "in-progress" || s.status === "not-started");
  const completedSessions  = enrolledSessions.filter(s => s.status === "completed");

  /* ── Filter options derived from SEASONS ── */
  const seasonOptions = [...new Set(SEASONS.map(s => s.name.split(" ")[0]))];
  const yearOptions   = [...new Set(SEASONS.map(s => s.name.split(" ")[1]))].sort((a,b) => b - a);

  function sessionMatchesFilter(s) {
    if (filterSeason === "all" && filterYear === "all") return true;
    const season = SEASONS.find(se => se.sessionIds.includes(s.id));
    if (!season) return false;
    const [sName, sYear] = season.name.split(" ");
    if (filterSeason !== "all" && sName !== filterSeason) return false;
    if (filterYear   !== "all" && sYear !== filterYear)   return false;
    return true;
  }

  const filteredInProgress = inProgressSessions.filter(sessionMatchesFilter);
  const filteredCompleted  = completedSessions.filter(sessionMatchesFilter);
  const todayGoals = [
    { text:"Complete any 2 sessions",   done: completed >= 2 },
    { text:"Watch a session today",      done: hasStarted     },
    { text:"Take a session quiz",        done: Object.keys(quizStates||{}).length > 0 },
  ];

  return (
    <div style={{ minHeight:"100%", background:"#f8fafc" }}>
      <style>{CSS + `
        .db-course-row { transition:box-shadow 150ms ease; }
        .db-course-row:hover { box-shadow:0 2px 12px rgba(0,0,0,0.08); }
        .db-cal-day:hover { background:var(--c-gray100) !important; }
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
      <div style={{ flex:1, minWidth:0, padding:"28px 32px" }}>

        {/* Greeting header */}
        <div style={{ marginBottom:20 }}>
          <h1 style={{ margin:"0 0 4px", fontSize:22, fontWeight:900, color:C.gray900 }}>Good morning</h1>
          <div style={{ fontSize:13, color:C.gray500 }}>SPED Summit · Spring 2026</div>
        </div>

        {/* ── MY PROGRESS BANNER ── */}
        {(() => {
          const ringR = 28; const ringCirc = 2 * Math.PI * ringR;
          const ringColor = pct === 100 ? "#10b981" : C.primary;
          const sessionsLeft = Math.max(0, 2 - completed);
          const STATS = [
            { icon:"play-circle", label:"Sessions Watched",    val: completed,                            color:C.primary, bg:"rgba(37,99,235,0.08)"   },
            { icon:"certificate", label:"Certificates Earned", val: certsEarned,                         color:"#f59e0b", bg:"rgba(245,158,11,0.08)"   },
            { icon:"timer",       label:"Hours Learned",       val: `${(completed*0.75).toFixed(1)}h`,   color:"#10b981", bg:"rgba(16,185,129,0.08)"   },
          ];
          return (
            <div style={{ background:"#fff", border:`1px solid ${C.gray200}`, borderRadius:18, marginBottom:28, display:"flex", alignItems:"stretch", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>

              {/* ① Progress block */}
              <div style={{ flex:1, padding:"22px 28px", display:"flex", alignItems:"center", gap:18, background:"#fafbff", borderRight:`1px solid ${C.gray100}` }}>
                <div style={{ width:"100%" }}>
                  <div style={{ fontSize:15, fontWeight:800, color:C.gray900, marginBottom:3 }}>My Progress</div>
                  <div style={{ fontSize:12, color:C.gray500, marginBottom:8 }}>{completed} of {totalEnrolled} sessions</div>
                  {/* Progress bar */}
                  <div style={{ width:"100%", height:6, background:"#eef0f6", borderRadius:99, overflow:"hidden" }}>
                    <div style={{ width:`${pct}%`, height:"100%", background:ringColor, borderRadius:99, transition:"width 0.8s cubic-bezier(0.23,1,0.32,1)" }}/>
                  </div>
                  <div style={{ fontSize:12, fontWeight:700, color:ringColor, marginTop:5 }}>{pct}% complete</div>
                </div>
              </div>

              {/* ② Stats */}
              <div style={{ display:"flex", alignItems:"center", flex:1, justifyContent:"space-around", padding:"0 32px" }}>
                {STATS.map((row, i) => (
                  <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", gap:4 }}>
                    <div style={{ fontSize:28, fontWeight:900, color:C.gray900, lineHeight:1 }}>{row.val}</div>
                    <div style={{ fontSize:11, fontWeight:600, color:C.gray500, whiteSpace:"nowrap" }}>{row.label}</div>
                  </div>
                ))}
              </div>


            </div>
          );
        })()}

        {/* ── shared card badge map ── */}
        {(()=>{
          const CAT_BADGE_MAP = {
            "MANAGEMENT":    { label:"Management",    bg:"#dbeafe", color:"#1d4ed8" },
            "LEADERSHIP":    { label:"Leadership",    bg:"#d1fae5", color:"#065f46" },
            "COMMUNICATION": { label:"Communication", bg:"#fff7ed", color:"#c2410c" },
            "TEAMWORK":      { label:"Teamwork",      bg:"#fdf4ff", color:"#7e22ce" },
            "TECHNOLOGY":    { label:"Technology",    bg:"#fef3c7", color:"#b45309" },
            "ACCESSIBILITY": { label:"Accessibility", bg:"#ede9fe", color:"#6d28d9" },
          };
          function renderSessionCard(s, btnLabel) {
            const catBadge = CAT_BADGE_MAP[s.category] || { label:s.category, bg:"#f3f4f6", color:"#374151" };
            const instrRole = INST_ROLES[s.instructor] || "Instructor";
            const schedItem = SCHEDULE.find(i => i.id === s.id);
            const typeLabel = schedItem ? schedItem.type.charAt(0) + schedItem.type.slice(1).toLowerCase() : "Session";
            return (
              <div key={s.id} className="db-course-row"
                style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, display:"flex", alignItems:"stretch", overflow:"hidden", cursor:"pointer", minHeight:235 }}
                onClick={() => onOpenSession(s)}>
                <div style={{ flexShrink:0, width:200, position:"relative" }}>
                  <img src={INSTRUCTOR_AVATARS[s.instructor]} alt={s.instructor}
                    style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top center", display:"block" }}/>
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 45%, transparent 75%)" }}/>
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"0 10px 10px" }}>
                    <div style={{ fontSize:15, fontWeight:700, color:"#fff", lineHeight:1.25 }}>{s.instructor}</div>
                    <div style={{ fontSize:13, color:"rgba(255,255,255,0.72)", marginTop:3, lineHeight:1.3 }}>{instrRole}</div>
                  </div>
                </div>
                <div style={{ flex:1, minWidth:0, padding:20, display:"flex", flexDirection:"column" }}>
                  <div style={{ marginBottom:8 }}>
                    <span style={{ display:"inline-block", fontSize:11, fontWeight:600, padding:"2px 7px", borderRadius:4, background:catBadge.bg, color:catBadge.color, letterSpacing:.2 }}>
                      {catBadge.label}
                    </span>
                  </div>
                  <div style={{ fontSize:17, fontWeight:700, color:"#111827", lineHeight:1.3, marginBottom:6 }}>{s.title}</div>
                  <div style={{ fontSize:12, color:"#6b7280", lineHeight:1.55, marginBottom:s.progress > 0 && s.status!=="completed" ? 10 : 6, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                    {s.description}
                  </div>
                  {s.progress > 0 && s.status !== "completed" && (
                    <div style={{ marginBottom:16 }}>
                      <div style={{ height:3, background:"#e5e7eb", borderRadius:99, overflow:"hidden", maxWidth:280 }}>
                        <div style={{ width:`${s.progress}%`, height:"100%", background:C.primary, borderRadius:99 }}/>
                      </div>
                      <div style={{ fontSize:11, color:"#9ca3af", marginTop:4 }}>{s.progress}% complete · {s.duration}</div>
                    </div>
                  )}
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:"auto", paddingTop:12 }}>
                    <button
                      onClick={e=>{ e.stopPropagation(); onOpenSession(s); }}
                      style={{ display:"inline-flex", alignItems:"center", padding:"7px 13px", background:"#6366f1", color:"#fff", border:"none", borderRadius:7, fontSize:13, fontWeight:600, cursor:"pointer", transition:"background 0.15s" }}
                      onMouseEnter={e=>e.currentTarget.style.background="#4f46e5"}
                      onMouseLeave={e=>e.currentTarget.style.background="#6366f1"}>
                      {btnLabel}
                    </button>
                    {s.status==="completed" && (
                      <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:12, fontWeight:600, color:"#059669" }}>
                        <Icon name="check-circle" size={13} color="#059669"/> Certificate earned
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
                const instrRole = INST_ROLES[calDaySession.instructor] || "Instructor";
                const typeLabel = calDaySession.type.charAt(0) + calDaySession.type.slice(1).toLowerCase();
                return (
                  <div style={{ marginBottom:32 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                      <div style={{ fontSize:16, fontWeight:800, color:C.gray900 }}>Upcoming Session</div>
                      <button onClick={() => setCalDaySession(null)}
                        style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", fontSize:20, lineHeight:1, padding:"2px 6px" }}
                        aria-label="Close">×</button>
                    </div>
                    <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, display:"flex", alignItems:"stretch", overflow:"hidden", minHeight:235 }}>
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
                        <div style={{ fontSize:17, fontWeight:700, color:"#111827", lineHeight:1.3, marginBottom:6 }}>{calDaySession.title}</div>
                        <div style={{ fontSize:12, color:"#6b7280", lineHeight:1.55, marginBottom:6, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                          {calDaySession.description}
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:"auto", paddingTop:12 }}>
                          {registered ? (
                            <div style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:13, fontWeight:700, color:"#059669", background:"rgba(16,185,129,0.10)", padding:"7px 16px", borderRadius:7 }}>
                              <Icon name="check-circle" size={14} color="#059669"/> Registered
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setScheduleRegistrations(r => ({ ...r, [calDaySession.id]: true }));
                                toast({ type:"success", title:"Registered!", message:`You're registered for "${calDaySession.title.slice(0,40)}"` });
                              }}
                              style={{ display:"inline-flex", alignItems:"center", padding:"7px 13px", background:"#6366f1", color:"#fff", border:"none", borderRadius:7, fontSize:13, fontWeight:600, cursor:"pointer", transition:"background 0.15s" }}
                              onMouseEnter={e=>e.currentTarget.style.background="#4f46e5"}
                              onMouseLeave={e=>e.currentTarget.style.background="#6366f1"}>
                              Register Now
                            </button>
                          )}
                          <span style={{ fontSize:12, color:"#9ca3af" }}>{calDaySession.date} · {calDaySession.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ── CONTINUE LEARNING ── */}
              <div style={{ marginBottom:32 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, gap:10 }}>
                  <div style={{ fontSize:16, fontWeight:800, color:C.gray900 }}>Continue Learning</div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    {/* Season dropdown */}
                    <div style={{ position:"relative", display:"inline-flex", alignItems:"center" }}>
                      <select
                        value={filterSeason}
                        onChange={e => { setFilterSeason(e.target.value); onFilterChange?.({ season: e.target.value, year: filterYear }); }}
                        style={{ appearance:"none", WebkitAppearance:"none", background:"#fff", border:"1px solid #e4e4e7", borderRadius:8, padding:"5px 28px 5px 10px", fontSize:13, fontWeight:500, color:"#18181b", cursor:"pointer", outline:"none", fontFamily:"inherit" }}>
                        <option value="all">All Seasons</option>
                        {seasonOptions.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <Icon name="caret-down" size={13} color="#71717a" style={{ position:"absolute", right:8, pointerEvents:"none" }}/>
                    </div>
                    {/* Year dropdown */}
                    <div style={{ position:"relative", display:"inline-flex", alignItems:"center" }}>
                      <select
                        value={filterYear}
                        onChange={e => { setFilterYear(e.target.value); onFilterChange?.({ season: filterSeason, year: e.target.value }); }}
                        style={{ appearance:"none", WebkitAppearance:"none", background:"#fff", border:"1px solid #e4e4e7", borderRadius:8, padding:"5px 28px 5px 10px", fontSize:13, fontWeight:500, color:"#18181b", cursor:"pointer", outline:"none", fontFamily:"inherit" }}>
                        <option value="all">All Years</option>
                        {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                      <Icon name="caret-down" size={13} color="#71717a" style={{ position:"absolute", right:8, pointerEvents:"none" }}/>
                    </div>
                  </div>
                </div>
                {filteredInProgress.length > 0 ? (
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    {filteredInProgress.map(s => {
                      const lbl = s.status==="in-progress" ? "Resume" : "Start";
                      return renderSessionCard(s, lbl);
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign:"center", padding:"32px 24px", background:"#fff", border:"1px solid #e5e7eb", borderRadius:12 }}>
                    <Icon name="play-circle" size={36} color={C.gray300}/>
                    <div style={{ fontSize:14, fontWeight:600, color:C.gray500, marginTop:10 }}>No sessions in progress</div>
                    <button className="db-btn-primary" style={{ marginTop:16 }} onClick={() => onNavigate("sessions")}>Browse All Sessions</button>
                  </div>
                )}
              </div>

              {/* ── PAST SESSIONS ── */}
              {filteredCompleted.length > 0 && (
                <div>
                  <div style={{ fontSize:16, fontWeight:800, color:C.gray900, marginBottom:16 }}>Past Sessions</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    {filteredCompleted.map(s => renderSessionCard(s, "Watch Again"))}
                  </div>
                </div>
              )}
            </>
          );
        })()}

      </div>

      {/* ── dead section banners removed (hero/instructors/testimonials/challenges/community now replaced by this layout) ── */}
      <div style={{ display:"none" }}>
      <div className="db-hero" style={{ background: hasStarted ? "linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 50%,#3b82f6 100%)" : "linear-gradient(135deg,#1e40af 0%,#3b82f6 60%,#6366f1 100%)", padding:"40px 32px", position:"relative", overflow:"hidden" }}>
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
      <div style={{ padding:"52px 32px", background:"#fff", borderBottom:`1px solid ${C.gray100}` }}>
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
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:24 }}>
            {SESSIONS.slice(0,3).map(s => {
              const enrolled = enrolledIds.has(s.id);
              const stMap = {
                "completed":   { label:"Completed",   bg:"rgba(16,185,129,0.12)", color:"#059669" },
                "in-progress": { label:"In Progress",  bg:C.primaryLight,          color:C.primary  },
                "not-started": { label:"Available",    bg:"rgba(99,102,241,0.10)", color:"#6366f1"  },
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
      <div style={{ padding:"52px 32px", background:"#f8fafc", borderBottom:`1px solid ${C.gray100}` }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ marginBottom:32 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.primary, letterSpacing:1.2, textTransform:"uppercase", marginBottom:5 }}>Expert Faculty</div>
            <div style={{ fontSize:22, fontWeight:800, color:C.gray900 }}>Learn from SPED experts</div>
            <div style={{ fontSize:14, color:C.gray500, marginTop:5 }}>Top educators sharing research-backed strategies for special education</div>
          </div>
          <div style={{ display:"flex", gap:44, overflowX:"auto", paddingBottom:8 }}>
            {Object.entries(INSTRUCTOR_AVATARS).map(([name, img]) => (
              <div key={name} className="db-instr-pill" style={{ textAlign:"center", flexShrink:0 }}>
                <div style={{ width:88, height:88, borderRadius:"50%", overflow:"hidden", border:"3px solid #fff", boxShadow:"0 3px 14px rgba(0,0,0,0.12)", margin:"0 auto 10px" }}>
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
        <div style={{ padding:"52px 32px", background:"#fff", borderBottom:`1px solid ${C.gray100}` }}>
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
      <div style={{ padding:"52px 32px", background:"#f8fafc", borderBottom:`1px solid ${C.gray100}` }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ marginBottom:32 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.primary, letterSpacing:1.2, textTransform:"uppercase", marginBottom:5 }}>Social Proof</div>
            <div style={{ fontSize:22, fontWeight:800, color:C.gray900 }}>Hear straight from our learners</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:18 }}>
            {DB_TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background:t.color, borderRadius:16, padding:"22px 20px", display:"flex", flexDirection:"column", gap:14 }}>
                <div style={{ display:"flex", gap:2 }}>
                  {[0,1,2,3,4].map(j => <Icon key={j} name="star" size={13} color={t.accent} weight="fill"/>)}
                </div>
                <p style={{ margin:0, fontSize:13, color:"#1f2937", lineHeight:1.65, flex:1 }}>"{t.text}"</p>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", overflow:"hidden", flexShrink:0, border:`2px solid ${t.accent}` }}>
                    <img src={t.img} alt={t.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  </div>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:"#1f2937" }}>{t.name}</div>
                    <div style={{ fontSize:11, color:"#6b7280" }}>{t.role}</div>
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
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:18 }}>
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
      <div style={{ padding:"52px 32px", background:"#fff", borderBottom:`1px solid ${C.gray100}` }}>
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
      <div style={{ padding:"52px 32px 72px", background:"linear-gradient(135deg,#1e40af 0%,#6366f1 100%)" }}>
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
function SessionsPage({ onOpenSession, toast, quizStates, onAssessmentClick, onCertificateClick, enrolledIds = new Set(), onNavigate, initialSeason = null, onSeasonChange, scheduleRegistrations = {}, setScheduleRegistrations = ()=>{}, sessions = SESSIONS, seasons = SEASONS }) {
  const [activeSeason, setActiveSeason] = useState(initialSeason);
  const [hoveredSeason, setHoveredSeason] = useState(null);
  function changeSeason(id) { setActiveSeason(id); onSeasonChange?.(id); }

  /* ── Season Detail View ── */
  if (activeSeason) {
    const season = seasons.find(s => s.id === activeSeason);
    const seasonSessions   = sessions.filter(s => season.sessionIds.includes(s.id));
    const liveSessions     = seasonSessions.filter(s => enrolledIds.has(s.id));
    const upcomingSessions = seasonSessions.filter(s => getSessionState(s.id) === "upcoming");
    const pastSessions     = seasonSessions.filter(s => getSessionState(s.id) === "past");

    return (
      <div style={{ padding:24, background:C.gray50, minHeight:"100%" }}>
        {/* Breadcrumb */}
        <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:4, marginBottom:20, fontSize:14, fontWeight:500, color:C.gray500 }}>
          <button onClick={()=>changeSeason(null)} style={{ background:"none", border:"none", cursor:"pointer", padding:0, fontSize:14, fontWeight:500, color:C.gray500 }}
            onMouseEnter={e=>e.currentTarget.style.color=C.gray900} onMouseLeave={e=>e.currentTarget.style.color=C.gray500}>
            Sessions
          </button>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="m14.413 10.663-6.25 6.25a.939.939 0 1 1-1.328-1.328L12.42 10 6.836 4.413a.939.939 0 1 1 1.328-1.328l6.25 6.25a.94.94 0 0 1-.001 1.328" fill="#CBD5E1"/>
          </svg>
          <span style={{ color:"#6366f1", fontWeight:600 }}>{season.name}</span>
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
          <div style={{ textAlign:"center", padding:"48px 0", color:C.gray400, fontSize:14 }}>No sessions in this season yet.</div>
        )}
      </div>
    );
  }

  /* ── Seasons Overview ── */
  return (
    <div style={{ padding:24, background:C.gray50, minHeight:"100%" }}>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:12, color:C.primary, fontWeight:700, letterSpacing:1, marginBottom:4 }}>FEATURED SERIES</div>
        <h1 style={{ margin:"0 0 4px", fontSize:24, fontWeight:900, color:C.gray900 }}>Summit Sessions</h1>
        <p style={{ margin:0, color:C.gray500, fontSize:14, lineHeight:1.5 }}>Browse sessions by season — each season is a curated collection of expert-led content.</p>
      </div>

      {/* Newly published sessions not in any season */}
      {(() => {
        const allSeasonIds = new Set(seasons.flatMap(s => s.sessionIds));
        const loose = sessions.filter(s => !allSeasonIds.has(s.id));
        if (!loose.length) return null;
        return (
          <div style={{ marginBottom:28 }}>
            <div style={{ fontSize:14, fontWeight:800, color:C.gray900, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
              New Sessions
              <span style={{ fontSize:11, fontWeight:700, color:"#fff", background:"#10b981", padding:"2px 8px", borderRadius:99 }}>● LIVE</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:16 }}>
              {loose.map(s => <SessionCard key={s.id} session={s} onClick={onOpenSession} quizState={quizStates?.[s.id]||{}} onAssessmentClick={onAssessmentClick} onCertificateClick={onCertificateClick}/>)}
            </div>
          </div>
        );
      })()}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:20 }}>
        {seasons.map(season => {
          const seasonSessions = sessions.filter(s => season.sessionIds.includes(s.id));
          const liveCount     = seasonSessions.filter(s => getSessionState(s.id) === "live").length;
          const upcomingCount = seasonSessions.filter(s => getSessionState(s.id) === "upcoming").length;
          const pastCount     = seasonSessions.filter(s => getSessionState(s.id) === "past").length;
          const statusLabel   = liveCount > 0     ? { label:"● LIVE NOW", color:"#fff",    bg:"#10b981" }
                              : upcomingCount > 0 ? { label:"UPCOMING",   color:"#2563eb", bg:"#dbeafe" }
                              : { label:"PAST SEASON", color:"#6b7280", bg:"#f3f4f6" };
          const firstSession  = seasonSessions[0];

          const hov = hoveredSeason === season.id;
          return (
            <div key={season.id}
              onClick={()=>changeSeason(season.id)}
              onMouseEnter={()=>setHoveredSeason(season.id)}
              onMouseLeave={()=>setHoveredSeason(null)}
              style={{ background:C.white, borderRadius:16, border:`1px solid ${C.gray200}`, overflow:"hidden", cursor:"pointer" }}>

              {/* ── Stacked playlist thumbnail ── */}
              <div style={{ position:"relative", width:"100%", paddingBottom:"56.25%", background:"#1f2937" }}>
                {/* Back stack layers */}
                {seasonSessions.length > 1 && (
                  <div style={{ position:"absolute", bottom:-4, left:"6%", right:"6%", height:"100%", borderRadius:10, overflow:"hidden", opacity:0.5, transform:"scale(0.94)" }}>
                    <SessionThumb id={seasonSessions[1]?.id || seasonSessions[0].id} height="100%" noPlayHover/>
                  </div>
                )}
                {/* Main thumbnail */}
                <div style={{ position:"absolute", inset:0, borderRadius:0, overflow:"hidden" }}>
                  {firstSession && <SessionThumb id={firstSession.id} height="100%" noPlayHover/>}
                  {/* Dark overlay */}
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)" }}/>
                  {/* Status badge top-left */}
                  <div style={{ position:"absolute", top:10, left:10 }}>
                    <span style={{ fontSize:11, fontWeight:700, color:statusLabel.color, background:statusLabel.bg, padding:"3px 9px", borderRadius:99 }}>{statusLabel.label}</span>
                  </div>
                  {/* Session count pill top-right (YouTube style) */}
                  <div style={{ position:"absolute", top:10, right:10, background:"rgba(0,0,0,0.65)", backdropFilter:"blur(4px)", borderRadius:8, padding:"4px 10px", display:"flex", alignItems:"center", gap:5 }}>
                    <Icon name="list" size={12} color="#fff"/>
                    <span style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{seasonSessions.length}</span>
                  </div>
                  {/* Season name bottom overlay */}
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"12px 14px" }}>
                    <div style={{ fontSize:18, fontWeight:900, color:"#fff", letterSpacing:-.2, textShadow:"0 1px 4px rgba(0,0,0,0.5)" }}>{season.name}</div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.75)", marginTop:2 }}>{season.tagline}</div>
                  </div>
                </div>
              </div>

              {/* ── Card footer ── */}
              <div style={{ padding:"14px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ fontSize:12, color:C.gray600 }}>
                  {seasonSessions.length > 0 ? <span>{seasonSessions.length} recorded</span> : <span>No sessions yet</span>}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, fontWeight:600, color:C.primary, textDecoration: hov ? "underline" : "none" }}>
                  View all <Icon name="caret-right" size={13} color={C.primary}/>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SCHEDULE PAGE
───────────────────────────────────────────────────────────────────────────── */
function SchedulePage({ onOpenSession, toast, scheduleRegistrations = {}, setScheduleRegistrations = ()=>{} }) {
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
      const s = SESSIONS.find(s=>s.id===item.id);
      if (s) onOpenSession(s);
      else toast({ type:"info", title:"Opening session…", message:item.title.slice(0,50) });
      return;
    }
    if (cta==="Register") { setCalendarItem(item); return; }
    if (cta==="Remind Me") { setBtnStates(b=>({...b,[item.id]:"Reminded ✓"})); toast({ type:"success", title:"Reminder set! 🔔", message:`We'll notify you before "${item.title.slice(0,40)}…" starts.` }); return; }
    if (cta==="Reminded ✓") { setBtnStates(b=>({...b,[item.id]:"Remind Me"})); toast({ type:"info", message:"Reminder removed." }); return; }
  }

  // Group items by date label
  const filtered = SCHEDULE.filter(item => item.status === activeTab);
  const grouped = filtered.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});
  const dateGroups = Object.entries(grouped);

  const upcomingCount = SCHEDULE.filter(i => i.status === "upcoming").length;
  const pastCount = SCHEDULE.filter(i => i.status === "past").length;

  return (
    <div style={{ padding:24, background:C.gray50, minHeight:"100%" }}>
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
        <div style={{ textAlign:"center", padding:"60px 0", color:C.gray400 }}>
          <Icon name="calendar" size={36} color={C.gray300}/>
          <div style={{ marginTop:12, fontSize:15, fontWeight:600 }}>No {activeTab} sessions</div>
        </div>
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
function VimeoPlayer({ url, onPlay, onPause, onProgress }) {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  const videoId = match ? match[1] : null;
  const iframeRef = useRef(null);
  const storageKey = videoId ? `vimeo_pos_${videoId}` : null;
  const savedTime = storageKey ? (parseFloat(localStorage.getItem(storageKey)) || 0) : 0;
  const onProgressRef = useRef(onProgress);
  useEffect(() => { onProgressRef.current = onProgress; }, [onProgress]);
  const [embedError, setEmbedError] = useState(null);

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
          iframeRef.current.contentWindow.postMessage(JSON.stringify({ method:"addEventListener", value:"timeupdate" }), "https://player.vimeo.com");
          iframeRef.current.contentWindow.postMessage(JSON.stringify({ method:"addEventListener", value:"play" }), "https://player.vimeo.com");
          iframeRef.current.contentWindow.postMessage(JSON.stringify({ method:"addEventListener", value:"pause" }), "https://player.vimeo.com");
          if (savedTime > 0) {
            iframeRef.current.contentWindow.postMessage(JSON.stringify({ method:"setCurrentTime", value: savedTime }), "https://player.vimeo.com");
          }
        }
        if (d.event === "play")  { onPlay?.();  }
        if (d.event === "pause") { onPause?.(); }
        if (d.event === "timeupdate" && d.data?.seconds != null) {
          localStorage.setItem(storageKey, d.data.seconds);
          if (d.data.percent != null) {
            const pct = Math.round(d.data.percent * 100);
            onProgressRef.current?.(pct);
          }
        }
      } catch {}
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [videoId]);

  if (!videoId) {
    return (
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"#0f172a", color:"rgba(255,255,255,0.5)", fontSize:14 }}>
        Invalid Vimeo URL
      </div>
    );
  }

  const embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=0&title=0&byline=0&portrait=0&dnt=1&api=1`;

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

function SessionDetail({ session, onBack, backLabel, sessionSource, toast, onAssessmentClick, onUpdateProgress }) {
  const [playing, setPlaying] = useState(false);
  const [activeLesson, setActiveLesson] = useState(() => session.lessons.findIndex(l=>l.status==="active" && l.type!=="quiz")||0);
  const [progress, setProgress] = useState(session.progress || 0);
  const [unlockedIndices, setUnlockedIndices] = useState(() =>
    new Set(session.lessons.map((l, i) => (l.status !== "locked" || l.type === "material") ? i : null).filter(x => x !== null))
  );
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { user:"Alex Rivera", color:"#3b82f6", text:"Any recommendations for async documentation tools?", time:"2m ago" },
    { user:"Sam Chen", color:"#10b981", text:"The 'invisible ceiling' quote really hit home for me.", time:"5m ago" },
    { user:"Maria Garcia", color:"#f97316", text:"This module is fantastic so far!", time:"12m ago" },
  ]);
  const [followed, setFollowed] = useState(false);
  const [downloaded, setDownloaded] = useState({});
  const [bottomTab, setBottomTab] = useState("overview");
  const [collapsedSections, setCollapsedSections] = useState({});
  const [communityPosts, setCommunityPosts] = useState(COMMUNITY_POSTS_DATA.map(p=>({...p,liked:false,saved:false})));
  const [communityNewPost, setCommunityNewPost] = useState("");
  const [communityOpenMenu, setCommunityOpenMenu] = useState(null);
  const [communityReplyingTo, setCommunityReplyingTo] = useState(null);
  const [communityReplyText, setCommunityReplyText] = useState("");
  const chatRef = useRef(null);
  const chatInputRef = useRef(null);
  const lesson = session.lessons[activeLesson] || session.lessons[0];

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (bottomTab === "community") chatInputRef.current?.focus();
  }, [bottomTab]);

  function sendMessage() {
    if (!message.trim()) return;
    setMessages(m=>[...m,{user:"You",color:"#6366f1",text:message,time:"now"}]);
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
      onAssessmentClick && onAssessmentClick(session); return;
    }
    setActiveLesson(idx);
    setProgress(l.status==="completed"?100:0);
    setPlaying(false);
  }

  // Responsive: detect if the container is narrow
  const containerRef = useRef(null);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      setNarrow(entry.contentRect.width < 780);
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
        <Avatar name={session.instructor} src={INSTRUCTOR_AVATARS[session.instructor]} size={40}/>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:700, fontSize:14, color:C.gray900, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{session.instructor}</div>
          <div style={{ fontSize:12, color:C.gray400, marginTop:1 }}>Special Ed Instructor</div>
        </div>
        <div style={{ display:"flex", gap:8, flexShrink:0 }}>
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
    <div ref={containerRef} style={{ display:"flex", height:"100%", background:C.gray50 }}>

      {/* ── Main scroll area ── */}
      <div style={{ flex:1, overflowY:"auto", padding: narrow ? 14 : 20, minWidth:0 }}>

        {/* Breadcrumb */}
        {(() => {
          const sourceLabels = { dashboard:"My Learnings", sessions:"All Sessions", schedules:"Schedules", certifications:"My Certificates" };
          const rootLabel = sourceLabels[sessionSource] || "Sessions";
          const crumbs = [
            { label: rootLabel, onClick: onBack },
            ...(backLabel ? [{ label: backLabel }] : []),
            { label: session.title },
          ];
          return (
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:16, flexWrap:"wrap" }}>
              {crumbs.map((crumb, i) => (
                <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
                  {i > 0 && <span style={{ color:C.gray300, fontSize:13, userSelect:"none" }}>›</span>}
                  {crumb.onClick ? (
                    <button onClick={crumb.onClick}
                      style={{ background:"none", border:"none", padding:0, cursor:"pointer", fontSize:13, fontWeight:500, color:C.gray500, fontFamily:"inherit" }}
                      onMouseEnter={e => e.currentTarget.style.color = C.gray700}
                      onMouseLeave={e => e.currentTarget.style.color = C.gray500}>
                      {crumb.label}
                    </button>
                  ) : (
                    <span style={{ fontSize:13, fontWeight: i === crumbs.length - 1 ? 600 : 500, color: i === crumbs.length - 1 ? C.gray900 : C.gray500,
                      ...(i === crumbs.length - 1 ? { overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:320 } : {}) }}>
                      {crumb.label}
                    </span>
                  )}
                </span>
              ))}
            </div>
          );
        })()}


        {/* ── Video Player ── */}
        <div style={{ borderRadius:16, overflow:"hidden", marginBottom:18, position:"relative", background:"#0f172a", boxShadow:"0 4px 24px rgba(0,0,0,0.15)", paddingBottom:"56.25%", height:0 }}>
          <div style={{ position:"absolute", inset:0 }}>
            {(session.vimeoUrl || lesson?.vimeoUrl) ? (
              <VimeoPlayer url={session.vimeoUrl || lesson?.vimeoUrl} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onProgress={pct => { setProgress(pct); onUpdateProgress?.(session.id, pct); if (pct >= 80) { setUnlockedIndices(prev => { const next = new Set(prev); next.add(activeLesson + 1); return next; }); } }}/>
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
              </>
            )}
          </div>
        </div>

        {/* ── Bottom Tabs (Udemy-style) ── */}
        <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, overflow:"hidden", marginBottom:20 }}>
          {/* Tab bar */}
          <div style={{ display:"flex", borderBottom:`1px solid ${C.gray200}` }}>
            {[
              { key:"overview",   label:"Overview"   },
              { key:"instructor", label:"Instructor" },
              { key:"community",  label:"Community"  },
            ].map(tab => {
              const isActive = bottomTab === tab.key;
              return (
                <button key={tab.key} onClick={() => setBottomTab(tab.key)}
                  style={{ padding:"14px 20px", border:"none", background:"none", cursor:"pointer", fontSize:14, fontWeight: isActive ? 700 : 500, color: isActive ? C.gray900 : C.gray500, borderBottom: isActive ? `2px solid ${C.gray900}` : "2px solid transparent", marginBottom:-1, whiteSpace:"nowrap", transition:"color .15s", display:"flex", alignItems:"center", gap:6 }}>
                  {tab.label}
                  {tab.count > 0 && <span style={{ fontSize:12, fontWeight:700, color: isActive ? C.primary : C.gray400, background: isActive ? C.primaryLight : C.gray100, borderRadius:99, padding:"1px 7px" }}>{tab.count}</span>}
                </button>
              );
            })}
          </div>

          {/* ── Overview ── */}
          {bottomTab === "overview" && (
            <div style={{ padding:"22px 24px" }}>
              <h2 style={{ margin:"0 0 14px", fontSize:20, fontWeight:700, color:C.gray900, lineHeight:1.4 }}>{session.title}</h2>
              <div style={{ display:"flex", gap:28, marginBottom:18 }}>
                <div>
                  <div style={{ fontSize:22, fontWeight:800, color:"#b45309" }}>4.8 <span style={{ fontSize:16 }}>★</span></div>
                  <div style={{ fontSize:12, color:C.gray400 }}>3,148 ratings</div>
                </div>
                <div>
                  <div style={{ fontSize:22, fontWeight:800, color:C.gray900 }}>1,240</div>
                  <div style={{ fontSize:12, color:C.gray400 }}>Students</div>
                </div>
                <div>
                  <div style={{ fontSize:22, fontWeight:800, color:C.gray900 }}>{session.duration}</div>
                  <div style={{ fontSize:12, color:C.gray400 }}>Total</div>
                </div>
              </div>
              <p style={{ margin:"0 0 16px", fontSize:14, color:C.gray600, lineHeight:1.75 }}>{session.description}</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {["Special Education","IEP Strategies","Inclusive Classrooms","MTSS","Behavior Support"].map(tag => (
                  <span key={tag} style={{ padding:"4px 12px", background:C.gray100, borderRadius:99, fontSize:12, color:C.gray600, fontWeight:500 }}>{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* ── Instructor ── */}
          {bottomTab === "instructor" && (
            <div style={{ padding:"22px 24px" }}>
              <div style={{ display:"flex", gap:16, alignItems:"flex-start", marginBottom:20 }}>
                <Avatar name={session.instructor} src={INSTRUCTOR_AVATARS[session.instructor]} size={68}/>
                <div>
                  <div style={{ fontWeight:800, fontSize:18, color:C.gray900, marginBottom:2 }}>{session.instructor}</div>
                  <div style={{ fontSize:14, color:C.gray500, marginBottom:10 }}>Special Education Instructor · SPED Summit Faculty</div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {[
                      { label:"Twitter", color:"#000",
                        svg:<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.732-8.855L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                      { label:"LinkedIn", color:"#0a66c2",
                        svg:<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                      { label:"Website", color:"#5e6278",
                        svg:<svg width="12" height="12" viewBox="0 0 256 256" fill="currentColor"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm87.63,96H175.8c-1.42-28.1-10.6-54.2-25.8-74.11A88.17,88.17,0,0,1,215.63,120ZM128,216c-19.27,0-37.07-28.68-39.73-72h79.46C165.07,187.32,147.27,216,128,216Zm-39.73-88C90.93,84.68,108.73,56,128,56s37.07,28.68,39.73,72ZM105.93,45.89C90.73,65.8,81.55,91.9,80.13,120H40.37A88.17,88.17,0,0,1,105.93,45.89ZM40.37,136H80.13c1.42,28.1,10.6,54.2,25.8,74.11A88.17,88.17,0,0,1,40.37,136Zm109.77,74.11c15.2-19.91,24.38-46,25.8-74.11h39.76A88.17,88.17,0,0,1,150.14,210.11Z"/></svg> },
                    ].map(s => (
                      <button key={s.label} onClick={() => toast({ type:"info", message:`Opening ${s.label}…` })}
                        style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 12px", border:`1px solid ${C.gray200}`, borderRadius:99, fontSize:12, fontWeight:600, color:s.color, background:C.white, cursor:"pointer" }}>
                        <span style={{ color:s.color, display:"flex", alignItems:"center" }}>{s.svg}</span>{s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display:"flex", gap:0, padding:"14px 0", borderTop:`1px solid ${C.gray100}`, borderBottom:`1px solid ${C.gray100}`, marginBottom:18 }}>
                {[
                  { val:"4.8 ★", label:"Rating"   },
                  { val:"4,200+", label:"Students" },
                  { val:"12",     label:"Sessions" },
                  { val:"Gold",   label:"Faculty Tier" },
                ].map((s,i) => (
                  <div key={s.label} style={{ flex:1, textAlign:"center", borderLeft: i > 0 ? `1px solid ${C.gray100}` : "none", padding:"4px 0" }}>
                    <div style={{ fontWeight:800, fontSize:16, color:C.gray900 }}>{s.val}</div>
                    <div style={{ fontSize:12, color:C.gray400, marginTop:2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <p style={{ margin:0, fontSize:14, color:C.gray600, lineHeight:1.8 }}>
                {session.instructor} is a nationally recognized special education expert with over 15 years of classroom and leadership experience. Specializing in IEP development, inclusive instructional design, and MTSS frameworks, they have trained thousands of educators across the country. Their evidence-based approach blends practical strategies with the latest research to empower teachers and improve outcomes for students with disabilities.
              </p>
            </div>
          )}

          {/* ── Community ── */}
          {bottomTab === "community" && (
            <div style={{ padding:"20px 24px", background:C.gray50, minHeight:400 }}>
              {/* Quick post */}
              <div style={{ background:C.white, borderRadius:12, border:`1px solid ${C.gray200}`, padding:"12px 14px", marginBottom:14, display:"flex", gap:10, alignItems:"center" }}>
                <Avatar name={userProfile.name} size={32}/>
                <input ref={chatInputRef} value={communityNewPost} onChange={e=>setCommunityNewPost(e.target.value)}
                  onKeyDown={e=>{ if(e.key==="Enter" && communityNewPost.trim()) {
                    setCommunityPosts(ps=>[{id:Date.now(),author:"You",role:"USER",time:"just now",title:communityNewPost.slice(0,80),body:"",tags:[],likes:0,replies:0,type:"post",liked:false,saved:false},...ps]);
                    setCommunityNewPost("");
                    toast({ type:"success", message:"Posted!" });
                  }}}
                  placeholder="Share something with the community…"
                  style={{ flex:1, padding:"8px 12px", border:`1px solid ${C.gray200}`, borderRadius:8, fontSize:14, outline:"none", color:C.gray700, background:C.white }}/>
                <Btn size="sm" onClick={() => {
                  if (!communityNewPost.trim()) return;
                  setCommunityPosts(ps=>[{id:Date.now(),author:"You",role:"USER",time:"just now",title:communityNewPost.slice(0,80),body:"",tags:[],likes:0,replies:0,type:"post",liked:false,saved:false},...ps]);
                  setCommunityNewPost("");
                  toast({ type:"success", message:"Posted!" });
                }}>Post</Btn>
              </div>

              {/* Posts */}
              {communityPosts.map(post => (
                <div key={post.id} style={{ background:C.white, borderRadius:12, border:`1px solid ${C.gray200}`, padding:"16px 18px", marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <Avatar name={post.author} size={36}/>
                      <div>
                        <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
                          <span style={{ fontWeight:700, fontSize:14, color:C.gray900 }}>{post.author}</span>
                          {post.role==="MENTOR" && <Badge label="MENTOR" color={C.success} bg={C.successLight} size={12}/>}
                          {post.type==="question" && <Badge label="QUESTION" color={C.primary} bg={C.primaryLight} size={12}/>}
                        </div>
                        <div style={{ fontSize:12, color:C.gray400 }}>{post.time}</div>
                      </div>
                    </div>
                    <div style={{ position:"relative" }}>
                      <button onClick={()=>setCommunityOpenMenu(communityOpenMenu===post.id?null:post.id)}
                        style={{ width:28, height:28, borderRadius:6, border:"none", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
                        onMouseEnter={e=>e.currentTarget.style.background=C.gray100} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <Icon name="dots-three" size={16} color={C.gray500}/>
                      </button>
                      {communityOpenMenu===post.id && (
                        <DropdownMenu
                          items={[
                            { icon:"bookmark", label:post.saved?"Unsave":"Save", action:()=>{ setCommunityPosts(ps=>ps.map(p=>p.id===post.id?{...p,saved:!p.saved}:p)); toast({type:"success",message:post.saved?"Removed":"Saved!"}); setCommunityOpenMenu(null); } },
                            { icon:"share-network", label:"Share", action:()=>{ toast({type:"info",message:"Link copied!"}); setCommunityOpenMenu(null); } },
                            { icon:"flag", label:"Report", action:()=>{ toast({type:"warning",message:"Report submitted."}); setCommunityOpenMenu(null); } },
                            ...(post.author==="You"?[{ icon:"trash", label:"Delete", danger:true, action:()=>{ setCommunityPosts(ps=>ps.filter(p=>p.id!==post.id)); toast({type:"success",message:"Deleted."}); setCommunityOpenMenu(null); } }]:[]),
                          ]}
                          onClose={()=>setCommunityOpenMenu(null)}
                        />
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize:14, fontWeight:700, color:C.gray900, marginBottom:5, lineHeight:1.4 }}>{post.title}</div>
                  {post.body && <p style={{ margin:"0 0 8px", fontSize:14, color:C.gray600, lineHeight:1.6, overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{post.body}</p>}
                  {post.tags.length>0 && <div style={{ display:"flex", gap:6, marginBottom:8 }}>{post.tags.map(t=><span key={t} style={{ fontSize:12, background:C.gray100, color:C.gray600, padding:"2px 8px", borderRadius:99 }}>{t}</span>)}</div>}
                  <div style={{ display:"flex", gap:2, paddingTop:10, borderTop:`1px solid ${C.gray100}` }}>
                    <button onClick={()=>setCommunityPosts(ps=>ps.map(p=>p.id===post.id?{...p,liked:!p.liked,likes:p.liked?p.likes-1:p.likes+1}:p))}
                      style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 10px", borderRadius:8, border:"none", background:post.liked?C.errorLight:"transparent", color:post.liked?C.error:C.gray500, cursor:"pointer", fontSize:12, fontWeight:600 }}>
                      <Icon name={post.liked?"heart":"heart-straight"} size={14} color={post.liked?C.error:C.gray500}/>{post.likes}
                    </button>
                    <button onClick={()=>setCommunityReplyingTo(communityReplyingTo===post.id?null:post.id)}
                      style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 10px", borderRadius:8, border:"none", background:"transparent", color:C.gray500, cursor:"pointer", fontSize:12, fontWeight:600 }}
                      onMouseEnter={e=>e.currentTarget.style.background=C.gray100} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <Icon name="chat-circle" size={14} color={C.gray500}/>{post.replies}
                    </button>
                    <button onClick={()=>toast({type:"info",message:"Link copied!"})}
                      style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 10px", borderRadius:8, border:"none", background:"transparent", color:C.gray500, cursor:"pointer", fontSize:12, fontWeight:600 }}
                      onMouseEnter={e=>e.currentTarget.style.background=C.gray100} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <Icon name="share-network" size={14} color={C.gray500}/>Share
                    </button>
                    {post.saved && <Icon name="bookmark" size={15} color={C.primary} style={{ marginLeft:"auto", alignSelf:"center" }}/>}
                  </div>
                  {/* Inline reply */}
                  {communityReplyingTo===post.id && (
                    <div style={{ marginTop:10, display:"flex", gap:8 }}>
                      <Avatar name={userProfile.name} size={26}/>
                      <div style={{ flex:1, display:"flex", gap:8 }}>
                        <input value={communityReplyText} onChange={e=>setCommunityReplyText(e.target.value)}
                          onKeyDown={e=>{ if(e.key==="Enter" && communityReplyText.trim()) {
                            setCommunityPosts(ps=>ps.map(p=>p.id===post.id?{...p,replies:p.replies+1}:p));
                            setCommunityReplyingTo(null); setCommunityReplyText("");
                            toast({type:"success",message:"Reply posted!"});
                          }}}
                          placeholder="Write a reply…"
                          style={{ flex:1, padding:"6px 10px", border:`1px solid ${C.gray200}`, borderRadius:8, fontSize:12, outline:"none", color:C.gray700, background:C.white }}/>
                        <Btn size="sm" onClick={()=>{ if(!communityReplyText.trim()) return; setCommunityPosts(ps=>ps.map(p=>p.id===post.id?{...p,replies:p.replies+1}:p)); setCommunityReplyingTo(null); setCommunityReplyText(""); toast({type:"success",message:"Reply posted!"}); }}>Reply</Btn>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* ── Right panel: Course Content (lessons only) ── */}
      <div style={{
        width: narrow ? "100%" : 272,
        borderLeft: `1px solid ${C.gray200}`,
        background: C.white,
        display: narrow ? "none" : "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}>
        <div style={{ padding:"14px 16px 12px", borderBottom:`1px solid ${C.gray100}`, flexShrink:0 }}>
          <div style={{ fontWeight:700, fontSize:14, color:C.gray900 }}>Course Content</div>
          <div style={{ fontSize:12, color:C.gray400, marginTop:2 }}>{session.lessons.length} lessons · {session.duration}</div>
        </div>
        <div style={{ flex:1, overflowY:"auto" }}>
          {(() => {
            // Group lessons into sections by sectionTitle markers
            const sections = [];
            let currentSection = null;
            session.lessons.forEach((l, i) => {
              if (l.sectionTitle) {
                currentSection = { title: l.sectionTitle, lessons: [] };
                sections.push(currentSection);
              } else if (!currentSection) {
                currentSection = { title: "Introduction", lessons: [] };
                sections.push(currentSection);
              }
              currentSection.lessons.push({ ...l, _index: i });
            });

            return sections.map((sec, si) => {
              const secKey = `sec-${si}`;
              const isCollapsed = collapsedSections[secKey];
              const completedCount = sec.lessons.filter(l => l.status === "completed").length;
              return (
                <div key={secKey} style={{ borderBottom:`1px solid ${C.gray100}` }}>
                  {/* Section header */}
                  <button
                    onClick={() => setCollapsedSections(s => ({ ...s, [secKey]: !s[secKey] }))}
                    style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
                      padding:"12px 16px", background:C.gray50, border:"none", cursor:"pointer", textAlign:"left",
                      gap:8 }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:C.gray900 }}>
                        {si === 0 ? "" : `${si}. `}{sec.title}
                      </div>
                      <div style={{ fontSize:12, color:C.gray400, marginTop:1 }}>
                        {sec.lessons.length} lesson{sec.lessons.length!==1?"s":""}{completedCount>0 ? ` · ${completedCount} done` : ""}
                      </div>
                    </div>
                    <Icon name={isCollapsed ? "caret-down" : "caret-up"} size={13} color={C.gray400}/>
                  </button>

                  {/* Lessons */}
                  {!isCollapsed && (
                    <div style={{ padding:"4px 0 8px" }}>
                      {sec.lessons.map(l => {
                        const i = l._index;
                        const isActive = i === activeLesson && l.type !== "quiz";
                        const locked = !unlockedIndices.has(i) && l.type !== "material";
                        const isQuiz = l.type === "quiz";
                        const quizDone = isQuiz && l.status === "completed";
                        const quizAvailable = isQuiz && (l.status === "active" || l.status === "available");
                        const isPreview = i === 0 || l.status === "available";
                        return (
                          <div key={String(l.id)} onClick={() => switchLesson(i)}
                            style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"10px 16px",
                              background: isActive ? C.primaryLight : "transparent",
                              borderLeft: isActive ? `3px solid ${C.primary}` : "3px solid transparent",
                              cursor: locked ? "default" : "pointer", transition:"background .1s" }}
                            onMouseEnter={e => { if (!locked && !isActive) e.currentTarget.style.background = C.gray50; }}
                            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>

                            {/* Status icon */}
                            <div style={{ marginTop:1, flexShrink:0 }}>
                              {l.status === "completed" || quizDone
                                ? <div style={{ width:18, height:18, borderRadius:"50%", background:C.success, display:"flex", alignItems:"center", justifyContent:"center" }}>
                                    <Icon name="check" size={12} color="#fff"/>
                                  </div>
                                : locked
                                  ? <Icon name="lock" size={14} color={C.gray300}/>
                                  : isActive
                                    ? <div style={{ width:18, height:18, borderRadius:"50%", background:C.primary, display:"flex", alignItems:"center", justifyContent:"center" }}>
                                        <Icon name="play" size={12} color="#fff"/>
                                      </div>
                                    : <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${C.gray300}` }}/>
                              }
                            </div>

                            {/* Content */}
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:12, fontWeight: isActive ? 700 : 400, color: locked ? C.gray400 : isQuiz ? "#7c3aed" : C.gray900, lineHeight:1.4 }}>{l.title}</div>
                              <div style={{ fontSize:12, color: isQuiz ? "#a855f7" : C.gray400, marginTop:2 }}>
                                {isQuiz ? (() => { const qc = Array.isArray(l.questions) ? l.questions.length : (l.questions||0); return `${qc} question${qc!==1?"s":""}`; })() : <LessonDuration vimeoUrl={l.vimeoUrl || session.vimeoUrl} fallback={l.duration}/>}
                              </div>
                              {isPreview && !locked && !isActive && (
                                <span style={{ display:"inline-block", fontSize:12, fontWeight:600, color:C.gray500, background:C.gray100, borderRadius:4, padding:"1px 6px", marginTop:3 }}>Preview</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {/* Section resources — same row style as lessons */}
                      {(SESSION_RESOURCES[session.id] || {})[sec.title]?.map(r => {
                        const isDone = !!downloaded[r.id];
                        const typeColor = r.type==="PDF" ? { bg:"#fef2f2", color:"#dc2626" } : r.type==="PPTX" ? { bg:"#fff7ed", color:"#ea580c" } : r.type==="ZIP" ? { bg:"#f5f3ff", color:"#7c3aed" } : { bg:C.primaryLight, color:C.primary };
                        return (
                          <div key={r.id}
                            style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"10px 16px", background:"transparent", borderLeft:"3px solid transparent", transition:"background .1s" }}
                            onMouseEnter={e => e.currentTarget.style.background = C.gray50}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            {/* File icon chip */}
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
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   COMMUNITY PAGE
───────────────────────────────────────────────────────────────────────────── */
function CommunityPage({ toast }) {
  const [posts, setPosts] = useState(COMMUNITY_POSTS_DATA.map(p=>({...p, liked:false, saved:false})));
  const [newPost, setNewPost] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [followed, setFollowed] = useState({});

  function toggleLike(id) {
    setPosts(ps=>ps.map(p=>p.id===id?{...p, liked:!p.liked, likes:p.liked?p.likes-1:p.likes+1}:p));
  }

  function addPost() {
    if (!newPost.trim()) return;
    setPosts(ps=>[{id:Date.now(),author:"You",role:"USER",time:"just now",title:newPost.slice(0,80),body:"",tags:[],likes:0,replies:0,type:"post",liked:false,saved:false},...ps]);
    setNewPost("");
    toast({ type:"success", title:"Posted! 🎉", message:"Your discussion is now live." });
  }

  function sendReply(id) {
    if (!replyText.trim()) return;
    setPosts(ps=>ps.map(p=>p.id===id?{...p,replies:p.replies+1}:p));
    setReplyingTo(null); setReplyText("");
    toast({ type:"success", message:"Reply posted!" });
  }

  function toggleFollow(name) {
    setFollowed(f=>({ ...f, [name]: !f[name] }));
    toast({ type: followed[name] ? "info" : "success", message: followed[name] ? `Unfollowed ${name.split(" ")[0]}` : `Now following ${name.split(" ")[0]}!` });
  }

  return (
    <div style={{ display:"flex", gap:20, padding:24, background:C.gray50, minHeight:"100%" }}>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:12, color:C.primary, fontWeight:700, letterSpacing:1, marginBottom:4 }}>COLLABORATIVE HUB</div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
            <h1 style={{ margin:0, fontSize:24, fontWeight:900, color:C.gray900 }}>Join the <span style={{ color:C.primary }}>conversation.</span></h1>
            <Btn onClick={addPost}><Icon name="plus" size={14} color="#fff"/> Start a Discussion</Btn>
          </div>
          <p style={{ margin:"6px 0 0", color:C.gray500, fontSize:14, lineHeight:1.5 }}>A dedicated space to share insights and solve roadblocks at Spread Summit.</p>
        </div>
        {/* Quick post */}
        <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, padding:"14px 16px", marginBottom:16, display:"flex", gap:12 }}>
          <Avatar name={userProfile.name} size={34}/>
          <input value={newPost} onChange={e=>setNewPost(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addPost()} placeholder="Share something with the community…" style={{ flex:1, padding:"8px 12px", border:`1px solid ${C.gray200}`, borderRadius:8, fontSize:14, outline:"none", color:C.gray700, background:C.white }}/>
          <Btn size="sm" onClick={addPost}>Post</Btn>
        </div>
        {/* Posts */}
        {posts.map(post=>(
          <div key={post.id} style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, padding:"18px 20px", marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <Avatar name={post.author} size={38}/>
                <div>
                  <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                    <span style={{ fontWeight:700, fontSize:14, color:C.gray900 }}>{post.author}</span>
                    {post.role==="MENTOR" && <Badge label="MENTOR" color={C.success} bg={C.successLight} size={12}/>}
                    {post.type==="question" && <Badge label="QUESTION" color={C.primary} bg={C.primaryLight} size={12}/>}
                  </div>
                  <div style={{ fontSize:12, color:C.gray400 }}>{post.time}</div>
                </div>
              </div>
              <div style={{ position:"relative" }}>
                <button onClick={()=>setOpenMenu(openMenu===post.id?null:post.id)}
                  style={{ width:30, height:30, borderRadius:8, border:"none", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
                  onMouseEnter={e=>e.currentTarget.style.background=C.gray100} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <Icon name="dots-three" size={18} color={C.gray500}/>
                </button>
                {openMenu===post.id && (
                  <DropdownMenu
                    items={[
                      { icon:"bookmark", label:post.saved?"Unsave":"Save", action:()=>{ setPosts(ps=>ps.map(p=>p.id===post.id?{...p,saved:!p.saved}:p)); toast({type:"success",message:post.saved?"Removed from saved":"Saved to your collection!"}); } },
                      { icon:"share-network", label:"Share", action:()=>toast({type:"info",message:"Link copied to clipboard!"}) },
                      { icon:"flag", label:"Report", action:()=>toast({type:"warning",title:"Report submitted",message:"We'll review this post shortly."}) },
                      ...(post.author==="You"?[{ icon:"trash", label:"Delete", danger:true, action:()=>{ setPosts(ps=>ps.filter(p=>p.id!==post.id)); toast({type:"success",message:"Post deleted."}); } }]:[]),
                    ]}
                    onClose={()=>setOpenMenu(null)}
                  />
                )}
              </div>
            </div>
            <div style={{ fontSize:14, fontWeight:700, color:C.gray900, marginBottom:6, lineHeight:1.4, overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{post.title}</div>
            {post.body && <p style={{ margin:"0 0 10px", fontSize:14, color:C.gray600, lineHeight:1.6, overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{post.body}</p>}
            {post.tags.length>0 && <div style={{ display:"flex", gap:6, marginBottom:10 }}>{post.tags.map(t=><span key={t} style={{ fontSize:12, background:C.gray100, color:C.gray600, padding:"3px 10px", borderRadius:99 }}>{t}</span>)}</div>}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:10, borderTop:`1px solid ${C.gray100}` }}>
              <div style={{ display:"flex", gap:4 }}>
                {/* Like */}
                <button onClick={()=>toggleLike(post.id)}
                  style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:8, border:"none", background:post.liked?C.errorLight:"transparent", color:post.liked?C.error:C.gray500, cursor:"pointer", fontSize:12, fontWeight:600, transition:"all .15s" }}>
                  <Icon name={post.liked?"heart":"heart-straight"} size={15} color={post.liked?C.error:C.gray500}/>{post.likes}
                </button>
                {/* Reply */}
                <button onClick={()=>setReplyingTo(replyingTo===post.id?null:post.id)}
                  style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:8, border:"none", background:"transparent", color:C.gray500, cursor:"pointer", fontSize:12, fontWeight:600 }}
                  onMouseEnter={e=>e.currentTarget.style.background=C.gray100} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <Icon name="chat-circle" size={15} color={C.gray500}/>{post.replies}
                </button>
                {/* Share */}
                <button onClick={()=>toast({type:"info",message:"Link copied!"})}
                  style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:8, border:"none", background:"transparent", color:C.gray500, cursor:"pointer", fontSize:12, fontWeight:600 }}
                  onMouseEnter={e=>e.currentTarget.style.background=C.gray100} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <Icon name="share-network" size={15} color={C.gray500}/>Share
                </button>
              </div>
              {post.saved && <Icon name="bookmark" size={16} color={C.primary}/>}
            </div>
            {/* Inline reply */}
            {replyingTo===post.id && (
              <div style={{ marginTop:12, display:"flex", gap:8 }}>
                <Avatar name={userProfile.name} size={28}/>
                <div style={{ flex:1, display:"flex", gap:8 }}>
                  <input value={replyText} onChange={e=>setReplyText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendReply(post.id)} placeholder="Write a reply…" style={{ flex:1, padding:"7px 12px", border:`1px solid ${C.gray200}`, borderRadius:8, fontSize:12, outline:"none", color:C.gray700, background:C.white }}/>
                  <Btn size="sm" onClick={()=>sendReply(post.id)}>Reply</Btn>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Sidebar */}
      <div style={{ width:230, flexShrink:0 }}>
        <div style={{ background:"linear-gradient(135deg,#d97706,#b45309)", borderRadius:14, padding:16, color:"#fff", marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
            <Icon name="lightning" size={20} color="#fff"/>
            <Badge label="WEEKLY GOAL" color="#fff" bg="rgba(255,255,255,0.2)" size={12}/>
          </div>
          <div style={{ fontWeight:800, fontSize:16, marginBottom:4 }}>Community Momentum</div>
          <div style={{ fontSize:12, opacity:.9, marginBottom:12, lineHeight:1.5 }}>You're in the top 5% of active contributors this week!</div>
          <ProgressBar value={72} color="#fff" height={5}/>
        </div>
        <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, padding:16, marginBottom:14 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.gray400, letterSpacing:.5, marginBottom:12 }}>TOP MENTORS</div>
          {["Marcus Chen","Sydney Bassard","Amanda Schaumburg"].map(name=>(
            <div key={name} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
              <div style={{ position:"relative" }}>
                <Avatar name={name} size={34}/>
                <div style={{ width:8,height:8,borderRadius:"50%",background:C.success,position:"absolute",bottom:0,right:0,border:"2px solid #fff" }}/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:600, color:C.gray900, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{name}</div>
                <div style={{ fontSize:12, color:C.gray400 }}>Special Ed Ins…</div>
              </div>
              <button onClick={()=>toggleFollow(name)}
                style={{ padding:"4px 10px", background:followed[name]?C.successLight:"none", border:`1px solid ${followed[name]?C.successBorder:C.gray300}`, borderRadius:6, fontSize:12, fontWeight:600, cursor:"pointer", color:followed[name]?C.success:C.gray600, display:"flex", alignItems:"center", gap:4 }}>
                {followed[name] && <Icon name="check" size={12} color={C.success}/>}
                {followed[name]?"Following":"Follow"}
              </button>
            </div>
          ))}
        </div>
        <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, padding:16 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.gray400, letterSpacing:.5, marginBottom:10 }}>RISING STARS</div>
          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            {["Sarah K","Luis M","Emma T"].map((n,i)=>(
              <div key={n} style={{ width:32,height:32,borderRadius:"50%",background:["#f97316","#10b981","#6366f1"][i],border:"2px solid #fff",marginLeft:i>0?-8:0,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:12 }}>{n[0]}</div>
            ))}
            <span style={{ marginLeft:8, fontWeight:700, color:C.gray700, fontSize:14 }}>+2.4k</span>
          </div>
        </div>
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
function ProfilePage({ toast, userName = "Alex Johnson", onNameChange }) {
  const [form, setForm] = useState({ name:userName, title:"Special Education Teacher", email:"alex.johnson@school.edu", phone:"+1 (555) 123-4567", language:"English (US)" });
  const [notifEmail,   setNotifEmail]   = useState(true);
  const [notifMentor,  setNotifMentor]  = useState(true);
  const [publicProfile,setPublicProfile]= useState(false);
  const [twoFA,        setTwoFA]        = useState(true);
  const [photoUrl,     setPhotoUrl]     = useState(null);

  const photoInputRef = useRef(null);

  function handlePhotoFile(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast({ type:"error", title:"Invalid file", message:"Please select a PNG, JPG, or GIF image." }); return; }
    if (file.size > 5 * 1024 * 1024) { toast({ type:"error", title:"File too large", message:"Image must be under 5MB." }); return; }
    const reader = new FileReader();
    reader.onload = e => { setPhotoUrl(e.target.result); toast({ type:"success", title:"Photo updated", message:"Your profile photo has been changed." }); };
    reader.readAsDataURL(file);
  }

  function save() {
    userProfile.name = form.name;
    onNameChange?.(form.name);
    toast({ type:"success", title:"Profile saved", message:"Your changes have been updated." });
  }

  const inputSt = { width:"100%", padding:"12px 14px", border:`1.5px solid ${C.gray200}`, borderRadius:12, fontSize:14, color:C.gray900, background:C.gray50, outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"border-color .15s" };

  return (
    <div style={{ padding:28, background:C.gray50, minHeight:"100%", overflowY:"auto" }}>
      <div style={{ maxWidth:760, margin:"0 auto" }}>

        {/* Page header */}
        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:12, color:C.primary, fontWeight:700, letterSpacing:1, marginBottom:4 }}>ACCOUNT</div>
          <h1 style={{ margin:"0 0 4px", fontSize:24, fontWeight:900, color:C.gray900 }}>Your Profile</h1>
          <p style={{ margin:0, fontSize:14, color:C.gray500, lineHeight:1.5 }}>Manage your personal information, security, and preferences.</p>
        </div>

        {/* ── Photo ── */}
        <input ref={photoInputRef} type="file" accept="image/*" style={{ display:"none" }}
          onChange={e => { handlePhotoFile(e.target.files?.[0]); e.target.value = ""; }}/>
        <div style={{ background:C.white, borderRadius:20, border:`1px solid ${C.gray200}`, padding:"28px 32px", marginBottom:20, display:"flex", alignItems:"center", gap:24, flexWrap:"wrap" }}>
          <div style={{ position:"relative", flexShrink:0 }}>
            {photoUrl
              ? <img src={photoUrl} alt="Profile" style={{ width:88, height:88, borderRadius:20, objectFit:"cover", display:"block" }}/>
              : <div style={{ width:88, height:88, borderRadius:20, background:`linear-gradient(135deg,${C.primary},#a855f7)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, fontWeight:900, color:"#fff" }}>{form.name.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase()}</div>
            }
            <button onClick={() => photoInputRef.current?.click()}
              style={{ position:"absolute", bottom:-6, right:-6, width:28, height:28, borderRadius:8, background:C.primary, border:"2px solid #fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="pencil" size={13} color="#fff"/>
            </button>
          </div>
          <div style={{ flex:1, minWidth:180 }}>
            <div style={{ fontWeight:800, fontSize:16, color:C.gray900, marginBottom:4 }}>Profile Photo</div>
            <div style={{ fontSize:14, color:C.gray500, marginBottom:14 }}>PNG or JPG, max 5MB. Used across your profile and certificates.</div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => photoInputRef.current?.click()}
                style={{ padding:"8px 18px", background:C.primary, color:"#fff", border:"none", borderRadius:99, fontSize:12, fontWeight:700, cursor:"pointer" }}>
                Upload Photo
              </button>
              {photoUrl && (
                <button onClick={() => { setPhotoUrl(null); toast({ type:"warning", message:"Photo removed." }); }}
                  style={{ padding:"8px 18px", background:"none", color:C.error, border:"none", borderRadius:99, fontSize:12, fontWeight:700, cursor:"pointer" }}>
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Personal Info ── */}
        <ProfileSection icon="user-circle" label="Personal Information">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <ProfileField label="Full Name">
              <input style={inputSt} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>e.target.style.borderColor=C.gray200}/>
            </ProfileField>
            <ProfileField label="Professional Title">
              <input style={inputSt} value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}
                onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>e.target.style.borderColor=C.gray200}/>
            </ProfileField>
            <ProfileField label="Email Address">
              <div style={{ position:"relative" }}>
                <input style={{...inputSt, paddingRight:40}} value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                  onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>e.target.style.borderColor=C.gray200}/>
                <div style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)" }}>
                  <Icon name="check-circle" size={16} color={C.success}/>
                </div>
              </div>
            </ProfileField>
            <ProfileField label="Phone Number">
              <input style={inputSt} value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}
                onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>e.target.style.borderColor=C.gray200}/>
            </ProfileField>
            <ProfileField label="Interface Language">
              <select style={{...inputSt, appearance:"none"}} value={form.language} onChange={e=>setForm(f=>({...f,language:e.target.value}))}>
                {["English (US)","Spanish","French","German","Mandarin"].map(l=><option key={l}>{l}</option>)}
              </select>
            </ProfileField>
          </div>
        </ProfileSection>

        {/* ── Security ── */}
        <ProfileSection icon="lock" label="Security & Privacy">
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {[
              { label:"Password", sub:"Last updated 3 months ago", action:()=>toast({type:"info",message:"Password reset email sent."}), btn:"Change Password" },
            ].map(row=>(
              <div key={row.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", background:C.gray50, borderRadius:14, flexWrap:"wrap", gap:10 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:C.gray900 }}>{row.label}</div>
                  <div style={{ fontSize:12, color:C.gray400, marginTop:2 }}>{row.sub}</div>
                </div>
                <button onClick={row.action} style={{ padding:"8px 18px", background:C.gray100, border:"none", borderRadius:99, fontSize:12, fontWeight:700, color:C.gray700, cursor:"pointer" }}>{row.btn}</button>
              </div>
            ))}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", background:C.gray50, borderRadius:14, flexWrap:"wrap", gap:10 }}>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:C.gray900 }}>Two-Factor Authentication</div>
                <div style={{ fontSize:12, color:C.gray400, marginTop:2 }}>Enhanced security for your account</div>
              </div>
              <ProfileToggle on={twoFA} onToggle={()=>setTwoFA(v=>!v)}/>
            </div>
          </div>
        </ProfileSection>

        {/* ── Preferences ── */}
        <ProfileSection icon="bell" label="Preferences & Notifications">
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[
              { label:"Email Notifications", sub:"Updates on course progress and activity", on:notifEmail, toggle:()=>setNotifEmail(v=>!v) },
              { label:"Mentor Messages",      sub:"Real-time chat alerts and mentorship pings", on:notifMentor, toggle:()=>setNotifMentor(v=>!v) },
              { label:"Public Profile",       sub:"Make your profile visible to other students", on:publicProfile, toggle:()=>setPublicProfile(v=>!v) },
            ].map(row=>(
              <div key={row.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", background:C.gray50, borderRadius:14, gap:16 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:C.gray900 }}>{row.label}</div>
                  <div style={{ fontSize:12, color:C.gray400, marginTop:2 }}>{row.sub}</div>
                </div>
                <ProfileToggle on={row.on} onToggle={row.toggle}/>
              </div>
            ))}
          </div>
        </ProfileSection>

        {/* Save */}
        <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:32 }}>
          <Btn onClick={save}><Icon name="floppy-disk" size={14} color="#fff"/> Save Changes</Btn>
        </div>

        {/* ── Danger Zone ── */}
        <div style={{ borderTop:`1px solid ${C.errorBorder}`, paddingTop:24 }}>
          <div style={{ background:C.errorLight, border:`1px solid ${C.errorBorder}`, borderRadius:20, padding:"24px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
            <div>
              <div style={{ fontWeight:800, fontSize:16, color:C.error, marginBottom:4 }}>Deactivate Account</div>
              <div style={{ fontSize:14, color:C.gray500 }}>Permanently remove your profile and all learning progress. This cannot be undone.</div>
            </div>
            <button onClick={()=>toast({type:"error",title:"Are you sure?",message:"This action is permanent."})}
              style={{ padding:"10px 22px", background:C.white, color:C.error, border:`1px solid ${C.errorBorder}`, borderRadius:99, fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
              <Icon name="trash" size={14} color={C.error}/> Deactivate Account
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   REWARDS
───────────────────────────────────────────────────────────────────────────── */
function CertificationsPage({ quizStates = {}, enrolledIds = new Set(), onCertificateClick, userName = "Alex Johnson" }) {
  const [activeSeason,  setActiveSeason]  = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [shareCert, setShareCert] = useState(null); // { certUrl, sessionTitle }

  const totalEarned = SEASONS.reduce((acc, season) => {
    return acc + season.sessionIds.filter(id => quizStates[id]?.status === "passed").length;
  }, 0);

  /* ── Session Detail (lesson quizzes + final assessment) ── */
  if (activeSeason && activeSession) {
    const season  = SEASONS.find(s => s.id === activeSeason);
    const session = SESSIONS.find(s => s.id === activeSession);
    const lessonQuizzes = (session.lessons || []).filter(l => l.type === "quiz");
    const qs = quizStates[session.id];
    const finalPassed = qs?.status === "passed";
    const hasFinal = !!SESSION_QUIZZES[session.id];

    function lessonQuizStatus(l) {
      if (l.status === "completed") return { label:"Completed", color:C.success, bg:C.successLight };
      if (l.status === "active")    return { label:"In Progress", color:C.warning, bg:"#fffbeb" };
      return { label:"Locked", color:C.gray400, bg:C.gray100 };
    }

    return (
      <>
      <div style={{ padding:24, background:C.gray50, minHeight:"100%" }}>
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
                <div style={{ display:"flex", gap:8 }}>
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
    const season = SEASONS.find(s => s.id === activeSeason);
    const sessions = SESSIONS.filter(s => season.sessionIds.includes(s.id));

    return (
      <div style={{ padding:24, background:C.gray50, minHeight:"100%" }}>
        {/* Breadcrumb */}
        <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:4, marginBottom:20, fontSize:14, fontWeight:500, color:C.gray500 }}>
          <button onClick={()=>setActiveSeason(null)} style={{ background:"none", border:"none", cursor:"pointer", padding:0, fontSize:14, fontWeight:500, color:C.gray500 }}
            onMouseEnter={e=>e.currentTarget.style.color=C.gray900} onMouseLeave={e=>e.currentTarget.style.color=C.gray500}>
            Certifications
          </button>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="m14.413 10.663-6.25 6.25a.939.939 0 1 1-1.328-1.328L12.42 10 6.836 4.413a.939.939 0 1 1 1.328-1.328l6.25 6.25a.94.94 0 0 1-.001 1.328" fill="#CBD5E1"/>
          </svg>
          <span style={{ color:"#6366f1", fontWeight:600 }}>{season.name}</span>
        </div>

        <h2 style={{ margin:"0 0 18px", fontSize:18, fontWeight:800, color:C.gray900 }}>{season.name}</h2>

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {sessions.map(s => {
            const qs = quizStates[s.id];
            const passed  = qs?.status === "passed";
            const inProg  = qs?.status === "in-progress" || qs?.status === "failed";
            const hasQuiz = !!SESSION_QUIZZES[s.id];
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
    <div style={{ padding:"28px 32px", background:C.gray50, minHeight:"100%" }}>

      <div style={{ display:"flex", flexDirection:"column", gap:32 }}>
        {SEASONS.map(season => {
          const sessions  = SESSIONS.filter(s => season.sessionIds.includes(s.id));
          const withQuiz  = sessions.filter(s => !!SESSION_QUIZZES[s.id]);
          const earned    = withQuiz.filter(s => quizStates[s.id]?.status === "passed").length;
          const total     = withQuiz.length;
          const allEarned = total > 0 && earned === total;

          return (
            <div key={season.id}>
              {/* Season header */}
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <h2 style={{ margin:0, fontSize:15, fontWeight:800, color:C.gray900 }}>{season.name}</h2>
                {allEarned && (
                  <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:"rgba(16,185,129,0.1)", borderRadius:99, padding:"3px 10px" }}>
                    <Icon name="medal" size={12} color={C.success}/>
                    <span style={{ fontSize:11, fontWeight:700, color:C.success }}>All Earned</span>
                  </span>
                )}
                <span style={{ fontSize:12, color:C.gray400, marginLeft:"auto" }}>{earned}/{total} certificates</span>
              </div>

              {/* Session rows */}
              <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, overflow:"hidden" }}>
                {sessions.map((s, i) => {
                  const qs = quizStates[s.id];
                  const passed   = qs?.status === "passed";
                  const hasQuiz  = !!SESSION_QUIZZES[s.id];
                  const lessonQuizCount = (s.lessons || []).filter(l => l.type === "quiz").length;
                  const lessonDoneCount = (s.lessons || []).filter(l => l.type === "quiz" && l.status === "completed").length;

                  return (
                    <div key={s.id}
                      style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 20px", borderBottom: i < sessions.length - 1 ? `1px solid ${C.gray100}` : "none" }}>

                      {/* Status icon */}
                      <div style={{ width:36, height:36, borderRadius:10, flexShrink:0, background:"rgba(37,99,235,0.07)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Icon name="certificate" size={18} color={C.gray400}/>
                      </div>

                      {/* Text */}
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:14, fontWeight:700, color:C.gray900, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.title}</div>
                        <div style={{ fontSize:12, color:C.gray500, marginTop:2 }}>{s.instructor}</div>
                        <div style={{ fontSize:11, color: C.gray400, marginTop:3 }}>
                          {passed ? "Certificate earned" : hasQuiz ? "Final assessment pending" : "No final assessment"}
                        </div>
                      </div>

                      {/* Actions */}
                      {passed ? (
                        <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                          <button
                            onClick={() => { const certId = `SS-${s.id}-${qs?.score}-2026`; setShareCert({ certUrl:`spedsummit.com/cert/${certId.toLowerCase()}`, sessionTitle:s.title }); }}
                            style={{ padding:"6px 12px", borderRadius:8, border:`1px solid ${C.gray200}`, background:C.white, color:C.gray600, fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap" }}>
                            <Icon name="share-network" size={13} color={C.gray500}/> Share
                          </button>
                          <button
                            onClick={() => downloadCertificate({ recipientName:userName, sessionTitle:s.title, instructor:s.instructor, duration:s.duration, score:qs?.score, description:s.description })}
                            style={{ padding:"6px 12px", borderRadius:8, border:"none", background:C.primary, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap" }}>
                            <Icon name="download" size={13} color="#fff"/> Download
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize:11, fontWeight:600, color:C.gray400, background:C.gray100, borderRadius:99, padding:"4px 12px", whiteSpace:"nowrap", flexShrink:0 }}>Pending</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ADMIN OVERVIEW
───────────────────────────────────────────────────────────────────────────── */
function AdminOverview({ onNavigate, onEditSession, toast }) {
  const [showEngagement, setShowEngagement] = useState(false);
  return (
    <div style={{ padding:24, background:C.gray50, minHeight:"100%" }}>
      <div style={{ marginBottom:22 }}>
        <h1 style={{ margin:"0 0 4px", fontSize:22, fontWeight:900, color:C.gray900 }}>Overview</h1>
        <p style={{ margin:0, color:C.gray500, fontSize:14, lineHeight:1.5 }}>Your teaching performance at a glance.</p>
      </div>

      {/* Metrics */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:14, marginBottom:24 }}>
        {[
          {label:"COURSE ENROLLMENTS", val:"12,842", delta:"↑ 15% from last month", color:C.primary,   icon:"users"},
          {label:"STUDENT RATING",     val:"8.4/10", delta:"Top 1% of Educators",   color:"#7c3aed",   icon:"star"},
          {label:"TOTAL SITE VISITS",  val:"83",     delta:"↑ 23 Today",            color:C.success,   icon:"eye"},
          {label:"TOTAL REVENUE",      val:"$4,210", delta:"↑ 8% this month",       color:C.warning,   icon:"lightning"},
        ].map(m=>(
          <div key={m.label} style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, padding:"18px 20px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <Icon name={m.icon} size={16} color={m.color}/>
              <span style={{ fontSize:12, fontWeight:700, color:C.gray400, letterSpacing:.5 }}>{m.label}</span>
            </div>
            <div style={{ fontSize:30, fontWeight:900, color:m.color, marginBottom:4 }}>{m.val}</div>
            <div style={{ fontSize:12, color:C.success, fontWeight:600 }}>{m.delta}</div>
          </div>
        ))}
      </div>

      {/* Recent activity + growth */}
      <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:14, marginBottom:14 }}>
        {/* Recent sessions snapshot */}
        <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, padding:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <h2 style={{ margin:0, fontSize:16, fontWeight:800, color:C.gray900 }}>Recent Sessions</h2>
            <button onClick={()=>onNavigate("admin-sessions")} style={{ background:"none", border:"none", color:C.primary, fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
              View all <Icon name="caret-right" size={13} color={C.primary}/>
            </button>
          </div>
          {ADMIN_SESSIONS_DATA.map((s,i,arr)=>{
            const sc = ADMIN_STATUS_COLORS[s.status] || ADMIN_STATUS_COLORS.DRAFT;
            return (
              <div key={s.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:i<arr.length-1?`1px solid ${C.gray100}`:"none" }}>
                <AdminThumb idx={i}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600, fontSize:14, color:C.gray900, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.title}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:3 }}>
                    <Badge label={s.status} color={sc.c} bg={sc.bg} size={12}/>
                    <span style={{ fontSize:12, color:C.gray400 }}>{s.date}</span>
                  </div>
                </div>
                <button onClick={() => onEditSession?.(s)}
                  title="Edit session"
                  style={{ width:28, height:28, borderRadius:8, border:`1px solid ${C.gray200}`, background:C.white, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Icon name="pencil" size={13} color={C.gray500}/>
                </button>
              </div>
            );
          })}
        </div>

        {/* Quick stats */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ background:"linear-gradient(135deg,#eef2ff,#e0e7ff)", borderRadius:14, padding:20, border:"1px solid #c7d2fe" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <Icon name="medal" size={18} color="#f59e0b"/>
              <span style={{ fontWeight:800, fontSize:14, color:"#1e1b4b" }}>Instructor Growth Program</span>
            </div>
            <p style={{ margin:"0 0 12px", fontSize:12, color:"#4b5563", lineHeight:1.6 }}>You're almost at "Gold Level" — get 15% off fees and priority placement.</p>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, fontSize:12, fontWeight:600, color:"#374151" }}><span>Reach Gold</span><span>70%</span></div>
            <ProgressBar value={70} color={C.primary} height={5} trackColor="#fff"/>
          </div>
          <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, padding:18 }}>
            <div style={{ display:"flex", gap:10, marginBottom:8 }}>
              <div style={{ width:32,height:32,borderRadius:9,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <Icon name="lightning" size={18} color={C.primary}/>
              </div>
              <div style={{ fontWeight:700, fontSize:14, color:C.gray900, alignSelf:"center" }}>Teaching Tip</div>
            </div>
            <p style={{ margin:"0 0 10px", fontSize:12, color:C.gray600, lineHeight:1.6, fontStyle:"italic" }}>"Sessions between 10 AM–2 PM EST see 40% higher live attendance."</p>
            <Btn variant="outline" size="sm" onClick={() => setShowEngagement(true)} style={{ width:"100%", justifyContent:"center" }}>View engagement guide</Btn>
          </div>
        </div>
      </div>

      {/* Engagement Guide Modal */}
      {showEngagement && (
        <div onClick={() => setShowEngagement(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:900, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background:C.white, borderRadius:20, width:"100%", maxWidth:520, maxHeight:"90vh", boxShadow:"0 20px 60px rgba(0,0,0,0.18)", overflow:"hidden", display:"flex", flexDirection:"column" }}>
            {/* Header */}
            <div style={{ background:"#f0f4ff", borderBottom:`1px solid #dde5ff`, padding:"24px 28px 20px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, color:"#6366f1", marginBottom:4 }}>INSTRUCTOR RESOURCE</div>
                  <h2 style={{ margin:0, fontSize:20, fontWeight:900, color:"#1e1b4b" }}>Engagement Guide</h2>
                  <p style={{ margin:"6px 0 0", fontSize:13, color:"#4b5563" }}>Proven tactics to boost attendance and completion rates.</p>
                </div>
                <button onClick={() => setShowEngagement(false)} style={{ background:"#fff", border:`1px solid #dde5ff`, color:"#6b7280", width:32, height:32, borderRadius:8, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
              </div>
            </div>
            {/* Tips */}
            <div style={{ padding:"20px 28px 28px", display:"flex", flexDirection:"column", gap:14, overflowY:"auto" }}>
              {[
                { icon:"clock",            color:"#f59e0b", title:"Optimal Scheduling",       body:"Sessions at 10 AM–2 PM EST see 40% higher live attendance. Avoid Friday afternoons and weekends for new releases." },
                { icon:"bell",             color:"#3b82f6", title:"Pre-Session Reminders",    body:"Send reminders 24h and 1h before. Learners who receive both show 2× higher show-up rates." },
                { icon:"chat-circle-dots", color:"#10b981", title:"Live Interaction",          body:"Ask a poll or question in the first 5 minutes. Sessions with early interaction have 60% lower drop-off." },
                { icon:"trophy",           color:"#8b5cf6", title:"Certificates & Rewards",   body:"Offering a certificate increases completion by 35%. Highlight it in your session description." },
                { icon:"megaphone",        color:"#ef4444", title:"Promote Before Going Live", body:"Share a teaser post 3 days before. Learners who see a preview are 50% more likely to register." },
              ].map((tip, i) => (
                <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                  <div style={{ width:34, height:34, borderRadius:10, background:`${tip.color}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon name={tip.icon} size={16} color={tip.color}/>
                  </div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, color:C.gray900, marginBottom:2 }}>{tip.title}</div>
                    <div style={{ fontSize:12, color:C.gray500, lineHeight:1.6 }}>{tip.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ADMIN SESSIONS PAGE
───────────────────────────────────────────────────────────────────────────── */
function AdminSessionsPage({ onNavigate, onEditSession, toast, adminSessions = ADMIN_SESSIONS_DATA, setAdminSessions }) {
  const [filter, setFilter] = useState("ALL");
  const statuses = ["ALL", "LIVE", "DRAFT", "ARCHIVED"];
  const filtered = filter === "ALL" ? adminSessions :
                   adminSessions.filter(s => s.status === filter);

  return (
    <div style={{ padding:24, background:C.gray50, minHeight:"100%" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
        <div>
            <h1 style={{ margin:"0 0 4px", fontSize:22, fontWeight:900, color:C.gray900 }}>My Sessions</h1>
          <p style={{ margin:0, color:C.gray500, fontSize:14, lineHeight:1.5 }}>Manage, publish and track all your content.</p>
        </div>
        <Btn onClick={()=>onNavigate("admin-create")}><Icon name="plus" size={14} color="#fff"/>New Session</Btn>
      </div>

      {/* Summary stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:20 }}>
        {[
          {label:"Total",    val:adminSessions.length,                                    color:C.gray700},
          {label:"Live",     val:adminSessions.filter(s=>s.status==="LIVE").length,       color:C.success},
          {label:"Drafts",   val:adminSessions.filter(s=>s.status==="DRAFT").length,      color:C.warning},
          {label:"Archived", val:adminSessions.filter(s=>s.status==="ARCHIVED").length,   color:C.gray500},
        ].map(s=>(
          <div key={s.label} style={{ background:C.white, borderRadius:12, border:`1px solid ${C.gray200}`, padding:"18px 20px" }}>
            <div style={{ fontSize:30, fontWeight:900, color:s.color, marginBottom:4 }}>{s.val}</div>
            <div style={{ fontSize:12, fontWeight:700, color:C.gray400, letterSpacing:.5, textTransform:"uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
        {statuses.map(s=>(
          <button key={s} onClick={()=>setFilter(s)}
            style={{ padding:"6px 14px", borderRadius:99, border:`1px solid ${filter===s?C.primary:C.gray200}`, background:filter===s?C.primary:C.white, color:filter===s?"#fff":C.gray500, fontSize:12, fontWeight:600, cursor:"pointer" }}>
            {s === "ALL" ? "All" : s.charAt(0)+s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Archived notice */}
      {filter === "ARCHIVED" && archived.length > 0 && (
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:"#f9fafb", borderRadius:10, border:"1px solid #e5e7eb", marginBottom:16 }}>
          <Icon name="info" size={14} color={C.gray500}/>
          <span style={{ fontSize:12, color:C.gray600, lineHeight:1.5 }}>
            Archived sessions are <strong>not visible to students</strong>. To restore a session, open it and update the <strong>Available To</strong> date to a future date.
          </span>
        </div>
      )}

      {/* Sessions list */}
      <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, overflow:"hidden" }}>
        {filtered.length === 0 && (
          <div style={{ padding:"48px 20px", color:C.gray400, fontSize:14 }}>No sessions match this filter.</div>
        )}
        {filtered.map((s,i)=>{
          const sc = ADMIN_STATUS_COLORS[s.status] || ADMIN_STATUS_COLORS.DRAFT;
          return (
            <div key={s.id} style={{ display:"flex", alignItems:"center", gap:16, padding:"16px 20px", borderBottom:i<filtered.length-1?`1px solid ${C.gray100}`:"none", opacity: s.status==="ARCHIVED" ? 0.72 : 1 }}
              onMouseEnter={e=>e.currentTarget.style.background=C.gray50}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <AdminThumb idx={i}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                  <Badge label={s.status} color={sc.c} bg={sc.bg} size={12}/>
                  <span style={{ fontSize:12, color:C.gray400 }}>{s.category}</span>
                  {s.availableFrom && s.availableTo && s.status !== "ARCHIVED" && (
                    <span style={{ fontSize:12, color:C.gray400 }}>
                      {new Date(s.availableFrom).toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})} – {new Date(s.availableTo).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}
                    </span>
                  )}
                </div>
                <div style={{ fontWeight:600, fontSize:14, color:C.gray900, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.title}</div>
                <div style={{ fontSize:12, color:C.gray400, marginTop:3, display:"flex", gap:12 }}>
                  {s.enrolled && <span style={{ display:"flex",alignItems:"center",gap:3 }}><Icon name="users" size={12} color={C.gray400}/>{s.enrolled.toLocaleString()} Enrolled</span>}
                  {s.rating   && <span style={{ display:"flex",alignItems:"center",gap:3 }}><Icon name="star"  size={12} color={C.warning}/>{s.rating} Stars</span>}
                  <span style={{ display:"flex",alignItems:"center",gap:3 }}><Icon name="calendar" size={12} color={C.gray400}/>{s.date}</span>
                </div>
              </div>
              <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                <button onClick={()=>onEditSession(s)}
                  style={{ padding:"6px 12px", borderRadius:7, border:`1px solid ${C.gray200}`, background:C.white, cursor:"pointer", display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:600, color:C.gray600 }}>
                  <Icon name="pencil" size={13} color={C.gray500}/>Edit
                </button>
                <button onClick={()=>toast({type:"info",message:"More options coming soon."})}
                  style={{ width:30,height:30,borderRadius:7,border:`1px solid ${C.gray200}`,background:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <Icon name="dots-three-vertical" size={14} color={C.gray500}/>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ANALYTICS
───────────────────────────────────────────────────────────────────────────── */

function LineAreaChart({ data, color = C.primary }) {
  const [hov, setHov] = useState(null);
  const W = 1000, H = 200, pL = 40, pR = 16, pT = 16, pB = 32;
  const iW = W - pL - pR, iH = H - pT - pB;
  const maxV = Math.max(...data.map(d => d.v), 1);
  const xOf  = i => pL + (i / (data.length - 1)) * iW;
  const yOf  = v => pT + iH - (v / maxV) * iH;
  const step = data.length > 10 ? Math.ceil(data.length / 7) : 1;
  const gid  = "waveGrad";

  // Build smooth cubic bezier path (catmull-rom → bezier)
  const pts = data.map((d, i) => ({ x: xOf(i), y: yOf(d.v) }));
  function smoothLinePath(ps) {
    if (ps.length < 2) return "";
    let d = `M ${ps[0].x} ${ps[0].y}`;
    for (let i = 0; i < ps.length - 1; i++) {
      const p0 = ps[Math.max(0, i - 1)];
      const p1 = ps[i];
      const p2 = ps[i + 1];
      const p3 = ps[Math.min(ps.length - 1, i + 2)];
      const cp1x = p1.x + (p2.x - p0.x) / 5;
      const cp1y = p1.y + (p2.y - p0.y) / 5;
      const cp2x = p2.x - (p3.x - p1.x) / 5;
      const cp2y = p2.y - (p3.y - p1.y) / 5;
      d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
    }
    return d;
  }
  const linePath = smoothLinePath(pts);
  const areaPath = `${linePath} L ${pts[pts.length-1].x} ${pT+iH} L ${pts[0].x} ${pT+iH} Z`;

  return (
    <div style={{ position:"relative" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", display:"block", overflow:"visible" }}
        onMouseLeave={() => setHov(null)}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity=".28"/>
            <stop offset="85%"  stopColor={color} stopOpacity=".07"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>

        {/* Dashed grid lines */}
        {[0, .25, .5, .75, 1].map(pct => {
          const y = pT + iH - pct * iH;
          const label = pct === 0 ? "0" : pct === 1
            ? (maxV >= 1000 ? `${(maxV/1000).toFixed(0)}K` : maxV)
            : (Math.round(pct * maxV) >= 1000 ? `${(Math.round(pct * maxV)/1000).toFixed(0)}K` : Math.round(pct * maxV));
          return (
            <g key={pct}>
              <line x1={pL} y1={y} x2={W - pR} y2={y}
                stroke="var(--c-gray200)" strokeWidth="1" strokeDasharray="5,4"/>
              <text x={pL - 6} y={y + 4} textAnchor="end" fontSize="12" fill="var(--c-gray400)" fontFamily="inherit">
                {label}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill={`url(#${gid})`}/>

        {/* Smooth wave line */}
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.5"
          strokeLinejoin="round" strokeLinecap="round"/>

        {/* X-axis labels */}
        {data.map((d, i) => {
          if (i % step !== 0 && i !== data.length - 1) return null;
          return (
            <text key={i} x={xOf(i)} y={H - 5} textAnchor="middle"
              fontSize="12" fill="var(--c-gray400)" fontFamily="inherit">
              {d.label}
            </text>
          );
        })}

        {/* Invisible hover zones */}
        {data.map((d, i) => (
          <rect key={i} x={xOf(i) - iW / (data.length * 2)} y={pT}
            width={iW / data.length} height={iH} fill="transparent"
            onMouseEnter={() => setHov(i)}/>
        ))}

        {/* Hover indicator */}
        {hov !== null && (() => {
          const x = xOf(hov), y = yOf(data[hov].v);
          return (
            <g>
              <line x1={x} y1={pT} x2={x} y2={pT + iH}
                stroke="var(--c-gray200)" strokeWidth="1.5" strokeDasharray="4,3"/>
              <circle cx={x} cy={y} r={5.5} fill={color} stroke="#fff" strokeWidth="2.5"/>
            </g>
          );
        })()}
      </svg>

      {/* Tooltip */}
      {hov !== null && (() => {
        const d = data[hov];
        const leftPct = ((hov / (data.length - 1)) * 100).toFixed(1);
        return (
          <div style={{ position:"absolute", top:4, left:`${leftPct}%`, transform:"translateX(-50%)",
            background:C.white, border:`1px solid ${C.gray200}`, borderRadius:12,
            padding:"10px 16px", boxShadow:"0 8px 28px rgba(0,0,0,0.12)",
            pointerEvents:"none", whiteSpace:"nowrap", zIndex:30 }}>
            <div style={{ fontSize:12, color:C.gray400, marginBottom:2 }}>{d.label}</div>
            <div style={{ fontSize:22, fontWeight:900, color:C.gray900, lineHeight:1.15 }}>{d.v.toLocaleString()}</div>
            <div style={{ fontSize:12, color:C.gray500, marginTop:1 }}>views</div>
          </div>
        );
      })()}
    </div>
  );
}

function MiniBarChart48({ data }) {
  const maxV = Math.max(...data, 1);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:1.5, height:40 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex:1, borderRadius:"2px 2px 0 0", minWidth:2,
          background: v > 0 ? C.primary : C.gray100,
          height:`${Math.max((v / maxV) * 100, v > 0 ? 14 : 5)}%`,
          opacity: v > 0 ? 0.85 : 1 }}/>
      ))}
    </div>
  );
}

function AnalyticsPage({ onEditSession }) {
  const [range,     setRange]     = useState("28d");
  const [showRange, setShowRange] = useState(false);

  const RANGES = [
    { key:"7d",  label:"Last 7 days",  dates:"Mar 17 – Mar 23, 2026" },
    { key:"28d", label:"Last 28 days", dates:"Feb 23 – Mar 22, 2026" },
    { key:"90d", label:"Last 90 days", dates:"Dec 22 – Mar 22, 2026" },
  ];
  const activeRange = RANGES.find(r => r.key === range);

  const TREND = {
    "7d": [
      {v:245,label:"Mon"},{v:312,label:"Tue"},{v:198,label:"Wed"},
      {v:400,label:"Thu"},{v:350,label:"Fri"},{v:190,label:"Sat"},{v:280,label:"Sun"},
    ],
    "28d": [
      {v:82,label:"Feb 23"},{v:95,label:"Feb 24"},{v:140,label:"Feb 25"},{v:110,label:"Feb 26"},
      {v:88,label:"Feb 27"},{v:75,label:"Feb 28"},{v:200,label:"Mar 1"},{v:180,label:"Mar 2"},
      {v:145,label:"Mar 3"},{v:220,label:"Mar 4"},{v:195,label:"Mar 5"},{v:160,label:"Mar 6"},
      {v:180,label:"Mar 7"},{v:210,label:"Mar 8"},{v:175,label:"Mar 9"},{v:140,label:"Mar 10"},
      {v:310,label:"Mar 11"},{v:280,label:"Mar 12"},{v:240,label:"Mar 13"},{v:190,label:"Mar 14"},
      {v:350,label:"Mar 15"},{v:320,label:"Mar 16"},{v:280,label:"Mar 17"},{v:240,label:"Mar 18"},
      {v:190,label:"Mar 19"},{v:220,label:"Mar 20"},{v:260,label:"Mar 21"},{v:310,label:"Mar 22"},
    ],
    "90d": [
      {v:180,label:"Dec 22"},{v:210,label:"Dec 29"},{v:240,label:"Jan 5"},
      {v:280,label:"Jan 12"},{v:260,label:"Jan 19"},{v:300,label:"Jan 26"},
      {v:320,label:"Feb 2"},{v:350,label:"Feb 9"},{v:380,label:"Feb 16"},
      {v:360,label:"Feb 23"},{v:400,label:"Mar 1"},{v:420,label:"Mar 15"},{v:310,label:"Mar 22"},
    ],
  };

  const STATS = {
    "7d":  { views:4821,  watch:382,  completion:64, enrolled:12842, viewsDelta:"+12%", watchDelta:"+8%",  compDelta:"+5%"  },
    "28d": { views:18200, watch:1430, completion:71, enrolled:12842, viewsDelta:"+18%", watchDelta:"+14%", compDelta:"+9%"  },
    "90d": { views:54000, watch:4200, completion:76, enrolled:12842, viewsDelta:"+28%", watchDelta:"+22%", compDelta:"+15%" },
  };
  const stat  = STATS[range];
  const trend = TREND[range];

  const TOP_SESSIONS = SESSIONS.slice(0, 4).map((s, i) => ({
    ...s,
    avgDuration: ["18:24","14:52","22:10","8:45"][i],
    avgPct:      ["78%","45%","91%","24%"][i],
    views:       [850,410,320,240][i],
  }));

  const INSIGHTS = [
    { icon:"trend-up",     title:"User activity up this week",              body:`Returning learners drove ${stat.viewsDelta} growth. Peak days are Tuesday–Thursday.` },
    { icon:"timer",        title:"Watch time drops on weekends",             body:"Sat–Sun see 40% fewer hours. Schedule new releases Mon–Thu for best reach." },
    { icon:"check-circle", title:`Completion at all-time high: ${stat.completion}%`, body:"Sessions with attached quizzes see 23% higher completion. Add quizzes to remaining sessions." },
    { icon:"star",         title:"\"AI in SPED\" needs a push",              body:"Enrolled: 34%, Started: 0%. A notification or teaser clip would drive first clicks." },
  ];

  return (
    <div style={{ padding:24, background:C.gray50, minHeight:"100%" }}>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
        <div>
            <h1 style={{ margin:"0 0 4px", fontSize:22, fontWeight:900, color:C.gray900 }}>Analytics</h1>
          <p style={{ margin:0, color:C.gray500, fontSize:14, lineHeight:1.5 }}>Track engagement, performance and learner outcomes.</p>
        </div>
        {/* Date range picker */}
        <div style={{ position:"relative" }}>
          <button onClick={() => setShowRange(v => !v)}
            style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:2,
              background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10,
              padding:"10px 14px", cursor:"pointer" }}>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <span style={{ fontSize:12, color:C.gray500 }}>{activeRange.dates}</span>
              <Icon name="caret-right" size={12} color={C.gray500} style={{ transform:"rotate(90deg)" }}/>
            </div>
            <span style={{ fontSize:14, fontWeight:700, color:C.gray900 }}>{activeRange.label}</span>
          </button>
          {showRange && (
            <div style={{ position:"absolute", right:0, top:"calc(100% + 4px)", background:C.white,
              border:`1px solid ${C.gray200}`, borderRadius:10,
              boxShadow:"0 8px 24px rgba(0,0,0,0.10)", zIndex:60, minWidth:160, overflow:"hidden" }}>
              {RANGES.map(r => (
                <button key={r.key} onClick={() => { setRange(r.key); setShowRange(false); }}
                  style={{ display:"block", width:"100%", padding:"10px 16px",
                    background:range===r.key ? C.gray50 : "none", border:"none", cursor:"pointer",
                    fontSize:14, color:range===r.key ? C.gray900 : C.gray600,
                    fontWeight:range===r.key ? 700 : 400, textAlign:"left" }}>
                  {r.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Metric cards — same style as Overview */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:14, marginBottom:24 }}>
        {[
          { label:"TOTAL VIEWS",      val:stat.views.toLocaleString(), delta:stat.viewsDelta+" vs prev period", color:C.primary,  icon:"eye"          },
          { label:"WATCH TIME (HRS)", val:stat.watch.toLocaleString(), delta:stat.watchDelta+" vs prev period", color:"#7c3aed",  icon:"timer"         },
          { label:"COMPLETION RATE",  val:`${stat.completion}%`,       delta:stat.compDelta+" vs prev period",  color:C.success,  icon:"check-circle"  },
          { label:"ENROLLED",         val:stat.enrolled.toLocaleString(), delta:"Active learners",             color:C.warning,  icon:"users"         },
        ].map(m => (
          <div key={m.label} style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, padding:"18px 20px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <Icon name={m.icon} size={16} color={m.color}/>
              <span style={{ fontSize:12, fontWeight:700, color:C.gray400, letterSpacing:.5 }}>{m.label}</span>
            </div>
            <div style={{ fontSize:30, fontWeight:900, color:m.color, marginBottom:4 }}>{m.val}</div>
            <div style={{ fontSize:12, color:C.success, fontWeight:600 }}>{m.delta}</div>
          </div>
        ))}
      </div>

      {/* Views over time — linear gradient chart */}
      <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, padding:"20px 24px", marginBottom:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <h2 style={{ margin:0, fontSize:16, fontWeight:800, color:C.gray900 }}>Views over time</h2>
          <span style={{ fontSize:12, color:C.gray400 }}>{activeRange.dates}</span>
        </div>
        <LineAreaChart data={trend} color={C.primary}/>
      </div>

      {/* Bottom row: top sessions + smart insights */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>

        {/* Top sessions */}
        <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, padding:20 }}>
          <h2 style={{ margin:"0 0 14px", fontSize:16, fontWeight:800, color:C.gray900 }}>Top Sessions</h2>
          {/* Header */}
          <div style={{ display:"grid", gridTemplateColumns:"16px 56px 1fr 72px 44px", gap:"0 10px",
            padding:"4px 0 8px", borderBottom:`1px solid ${C.gray100}`, marginBottom:2 }}>
            <span style={{ gridColumn:"1 / 4", fontSize:12, color:C.gray400, fontWeight:700, letterSpacing:.3 }}>Content</span>
            <span style={{ fontSize:12, color:C.gray400, fontWeight:700, letterSpacing:.3 }}>Duration</span>
            <span style={{ fontSize:12, color:C.gray400, fontWeight:700, letterSpacing:.3 }}>Views</span>
          </div>
          {TOP_SESSIONS.map((s,i) => {
            const grads = ["linear-gradient(135deg,#1e3a5f,#3699ff)","linear-gradient(135deg,#4c1d95,#a855f7)","linear-gradient(135deg,#166534,#50cd89)","linear-gradient(135deg,#7c2d12,#f97316)"];
            return (
              <div key={i}
                onClick={() => onEditSession?.(s)}
                style={{ display:"grid", gridTemplateColumns:"16px 56px 1fr 72px 44px", gap:"0 10px",
                  padding:"10px 0", borderBottom:i<TOP_SESSIONS.length-1?`1px solid ${C.gray100}`:"none",
                  alignItems:"center", cursor:"pointer", borderRadius:8 }}
                onMouseEnter={e=>e.currentTarget.style.background=C.gray50}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <span style={{ fontSize:12, color:C.gray400, fontWeight:500 }}>{i+1}</span>
                {/* Thumbnail */}
                <div style={{ width:56, height:36, borderRadius:6, background:grads[i], flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name="play" size={12} color="rgba(255,255,255,0.8)"/>
                </div>
                {/* Title — constrained width */}
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:C.gray900, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:160 }}>{s.title}</div>
                  <div style={{ fontSize:12, color:C.gray400, marginTop:2 }}>{s.avgPct} completed</div>
                </div>
                <span style={{ fontSize:12, color:C.gray600 }}>{s.avgDuration}</span>
                <span style={{ fontSize:14, fontWeight:700, color:C.gray900 }}>{s.views}</span>
              </div>
            );
          })}
        </div>

        {/* Smart Insights */}
        <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, padding:20 }}>
          <h2 style={{ margin:"0 0 20px", fontSize:16, fontWeight:800, color:C.gray900 }}>Smart Insights</h2>
          {INSIGHTS.map((ins,i) => (
            <div key={i} style={{ display:"flex", gap:10, marginBottom:14,
              paddingBottom:14, borderBottom:i<INSIGHTS.length-1?`1px solid ${C.gray100}`:"none" }}>
              <div style={{ width:32, height:32, borderRadius:9, background:C.primaryLight,
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                <Icon name={ins.icon} size={15} color={C.primary}/>
              </div>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:C.gray900, lineHeight:1.4, marginBottom:3 }}>{ins.title}</div>
                <div style={{ fontSize:12, color:C.gray500, lineHeight:1.55 }}>{ins.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


/* ─────────────────────────────────────────────────────────────────────────────
   ADMIN CREATE SESSION
───────────────────────────────────────────────────────────────────────────── */
function FormSection({ icon, title, subtitle, children }) {
  return (
    <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, padding:24, marginBottom:16 }}>
      <div style={{ display:"flex", gap:12, marginBottom:20, alignItems:"flex-start" }}>
        <div style={{ width:36,height:36,borderRadius:10,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><Icon name={icon} size={18} color={C.primary}/></div>
        <div><div style={{ fontWeight:800, fontSize:16, color:C.gray900 }}>{title}</div><div style={{ fontSize:12, color:C.gray400, marginTop:2 }}>{subtitle}</div></div>
      </div>
      {children}
    </div>
  );
}

function Label({ children, required }) {
  return <div style={{ fontSize:12, fontWeight:700, color:C.gray500, letterSpacing:.5, marginBottom:5, display:"flex", gap:4 }}>{children}{required&&<span style={{ color:C.error }}>*</span>}</div>;
}

const inputSt = { width:"100%", padding:"9px 12px", border:`1px solid ${C.gray200}`, borderRadius:8, fontSize:14, color:C.gray700, outline:"none", background:C.gray50, boxSizing:"border-box", fontFamily:"inherit" };

/* ─────────────────────────────────────────────────────────────────────────────
   CURRICULUM BUILDER
───────────────────────────────────────────────────────────────────────────── */
const CB_Q_TYPES = [
  { key:"short-answer",    label:"Short answer",    icon:"minus"             },
  { key:"paragraph",       label:"Paragraph",       icon:"text-align-left"   },
  { key:"multiple-choice", label:"Multiple choice", icon:"radio-button"      },
  { key:"checkboxes",      label:"Checkboxes",      icon:"check-square"      },
  { key:"dropdown",        label:"Dropdown",        icon:"caret-circle-down" },
];

function CurriculumBuilder({ toast, initialSections, onSectionsChange }) {
  const [sections,         setSections]         = useState(() => {
    if (initialSections && initialSections.length) return initialSections;
    return [{ id:1, title:"Introduction", collapsed:false, resources:[], lessons:[
      { id:101, title:"Welcome & course overview", type:"video", duration:"", status:"draft", vimeoUrl:"", questions:[], quizExpanded:false },
      { id:102, title:"New Quiz", type:"quiz", duration:"", status:"draft", vimeoUrl:"", questions:[], quizExpanded:false },
    ]}];
  });

  useEffect(() => { onSectionsChange?.(sections); }, [sections]);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingLessonId,  setEditingLessonId]  = useState(null);
  const [vimeoLinkId,      setVimeoLinkId]      = useState(null); // { secId, lesId }
  const [vimeoInputVal,    setVimeoInputVal]    = useState("");
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [draggingId,       setDraggingId]       = useState(null);
  const [dragOverId,       setDragOverId]       = useState(null);
  const dragRef            = useRef(null);
  const resourceInputRef   = useRef(null);
  const materialInputRef   = useRef(null);
  const [uploadingResourceSecId, setUploadingResourceSecId] = useState(null);
  const [uploadingMaterialId,    setUploadingMaterialId]    = useState(null);
  const [matDropOver,            setMatDropOver]            = useState(false);
  const materialDropInputRef = useRef(null);

  // ── helpers ──────────────────────────────────────────────────────────────
  function patchLesson(secId, lesId, patch) {
    setSections(s => s.map(sec => sec.id!==secId ? sec : {
      ...sec, lessons: sec.lessons.map(l => l.id!==lesId ? l : {...l, ...patch})
    }));
  }


  function triggerResourceUpload(secId) {
    setUploadingResourceSecId(secId);
    setTimeout(() => resourceInputRef.current?.click(), 0);
  }
  function handleResourceChosen(e) {
    const file = e.target.files?.[0];
    if (!file || !uploadingResourceSecId) return;
    e.target.value = "";
    const ext = file.name.split(".").pop().toUpperCase();
    const size = file.size > 1024*1024 ? `${(file.size/1024/1024).toFixed(1)} MB` : `${Math.round(file.size/1024)} KB`;
    const icon = ext==="PDF"?"📄": ext==="PPTX"||ext==="PPT"?"📊": ext==="DOCX"||ext==="DOC"?"📝": ext==="ZIP"?"🗂️":"📎";
    const newRes = { id:Date.now(), title:file.name.replace(/\.[^.]+$/, ""), type:ext, size, icon, file };
    setSections(s => s.map(sec => sec.id!==uploadingResourceSecId ? sec : { ...sec, resources:[...sec.resources, newRes] }));
    toast({ type:"success", message:`"${newRes.title}" added to resources.` });
    setUploadingResourceSecId(null);
  }
  function removeResource(secId, resId) {
    setSections(s => s.map(sec => sec.id!==secId ? sec : { ...sec, resources:sec.resources.filter(r=>r.id!==resId) }));
  }
  function handleMaterialChosen(e) {
    const file = e.target.files?.[0];
    if (!file || !uploadingMaterialId) return;
    e.target.value = "";
    const { secId, lesId } = uploadingMaterialId;
    patchLesson(secId, lesId, { materialFile:file });
    toast({ type:"success", message:`"${file.name}" attached.` });
    setUploadingMaterialId(null);
  }

  // ── section helpers ───────────────────────────────────────────────────────
  function addSection() {
    const id = Date.now();
    setSections(s => [...s, { id, title:"New Section", collapsed:false, resources:[], lessons:[] }]);
    setEditingSectionId(id);
  }
  function updateSectionTitle(id, title) { setSections(s => s.map(sec => sec.id===id ? {...sec,title} : sec)); }
  function deleteSection(id)             { setSections(s => s.filter(sec => sec.id!==id)); }
  function toggleCollapse(id)            { setSections(s => s.map(sec => sec.id===id ? {...sec,collapsed:!sec.collapsed} : sec)); }

  function addLesson(secId, type) {
    const id = Date.now();
    setSections(s => s.map(sec => sec.id!==secId ? sec : {
      ...sec, lessons:[...sec.lessons, { id, title: type==="quiz"?"New Quiz": type==="material"?"New Material":"New Lesson", type, duration:"", status:"draft", vimeoUrl:"", questions:[], quizExpanded: type==="quiz" }]
    }));
    setEditingLessonId(id);
  }
  function deleteLesson(secId, lesId) {
    setSections(s => s.map(sec => sec.id!==secId ? sec : { ...sec, lessons:sec.lessons.filter(l=>l.id!==lesId) }));
  }

  // ── drag-and-drop helpers ─────────────────────────────────────────────────
  function moveSection(fromId, toId) {
    if (fromId === toId) return;
    setSections(s => {
      const arr = [...s];
      const fi = arr.findIndex(x => x.id===fromId);
      const ti = arr.findIndex(x => x.id===toId);
      if (fi<0||ti<0) return s;
      const [item] = arr.splice(fi,1);
      arr.splice(ti,0,item);
      return arr;
    });
  }
  function moveLesson(secId, fromId, toId) {
    if (fromId === toId) return;
    setSections(s => s.map(sec => {
      if (sec.id!==secId) return sec;
      const arr = [...sec.lessons];
      const fi = arr.findIndex(x => x.id===fromId);
      const ti = arr.findIndex(x => x.id===toId);
      if (fi<0||ti<0) return sec;
      const [item] = arr.splice(fi,1);
      arr.splice(ti,0,item);
      return {...sec, lessons:arr};
    }));
  }

  // ── quiz question helpers ─────────────────────────────────────────────────
  function addQuestion(secId, lesId) {
    const q = { id:Date.now(), type:"multiple-choice", text:"", options:["","","",""], correct:0 };
    setSections(s => s.map(sec => sec.id!==secId ? sec : {
      ...sec, lessons: sec.lessons.map(l => l.id!==lesId ? l : { ...l, questions:[...l.questions, q] })
    }));
    setEditingQuestionId(q.id);
  }
  function patchQuestion(secId, lesId, qid, patch) {
    setSections(s => s.map(sec => sec.id!==secId ? sec : {
      ...sec, lessons: sec.lessons.map(l => l.id!==lesId ? l : {
        ...l, questions: l.questions.map(q => q.id!==qid ? q : {...q,...patch})
      })
    }));
  }
  function deleteQuestion(secId, lesId, qid) {
    setSections(s => s.map(sec => sec.id!==secId ? sec : {
      ...sec, lessons: sec.lessons.map(l => l.id!==lesId ? l : { ...l, questions:l.questions.filter(q=>q.id!==qid) })
    }));
  }

  const totalLessons   = sections.reduce((n,s) => n + s.lessons.filter(l=>l.type==="video").length, 0);
  const totalQuizzes   = sections.reduce((n,s) => n + s.lessons.filter(l=>l.type==="quiz").length, 0);
  const totalMaterials = sections.reduce((n,s) => n + s.lessons.filter(l=>l.type==="material").length, 0);

  // flat lessons across all sections
  const allLessons = sections.flatMap(sec => sec.lessons.map(l => ({ ...l, _secId: sec.id })));

  function addFlatLesson(type) {
    if (sections.length === 0) {
      const secId = Date.now();
      setSections([{ id: secId, title:"Section 1", collapsed:false, resources:[], lessons:[{ id: secId+1, title: type==="quiz"?"New Quiz": type==="material"?"New Material":"New Lesson", type, duration:"", status:"draft", vimeoUrl:"", questions:[], quizExpanded:false }] }]);
    } else {
      addLesson(sections[sections.length-1].id, type);
    }
  }

  function deleteFlatLesson(secId, lesId) { deleteLesson(secId, lesId); }

  function addMaterialWithFile(file) {
    const lesId = Date.now();
    const name  = file ? file.name.replace(/\.[^.]+$/, "") : "New Material";
    const mat   = { id:lesId, title:name, type:"material", duration:"", status:"draft", vimeoUrl:"", questions:[], quizExpanded:false, materialFile:file||null, materialFileName:name };
    if (sections.length === 0) {
      const secId = lesId + 1;
      setSections([{ id:secId, title:"Section 1", collapsed:false, resources:[], lessons:[mat] }]);
    } else {
      setSections(s => s.map((sec,i) => i < s.length-1 ? sec : { ...sec, lessons:[...sec.lessons, mat] }));
    }
  }

  const nonMaterialLessons = allLessons.filter(l => l.type !== "material");
  const materialLessons    = allLessons.filter(l => l.type === "material");

  return (
    <div style={{ padding:"0" }}>
      {/* Hidden file inputs */}
      <input ref={resourceInputRef} type="file" accept="application/pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip" style={{ display:"none" }} onChange={handleResourceChosen}/>
      <input ref={materialInputRef} type="file" accept="application/pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.mp3,.mp4" style={{ display:"none" }} onChange={handleMaterialChosen}/>
      <input ref={materialDropInputRef} type="file" accept="application/pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.mp3,.mp4" style={{ display:"none" }}
        onChange={e=>{ const f=e.target.files?.[0]; if(f){ e.target.value=""; addMaterialWithFile(f); } }}/>

      {/* Lesson / Quiz cards */}
      {nonMaterialLessons.map((l, li) => (
        <div key={l.id} style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:14, marginBottom:16, padding:24 }}>

          {/* Card header — FormSection style */}
          <div style={{ display:"flex", gap:12, marginBottom:20, alignItems:"flex-start" }}>
            <div style={{ width:36, height:36, borderRadius:10, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
              background: l.type==="video" ? C.primaryLight : "#ede9fe" }}>
              <Icon name={l.type==="video"?"video":"article"} size={18} color={l.type==="video"?C.primary:"#7c3aed"}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, fontSize:16, color:C.gray900 }}>{l.type==="quiz"?"Assessment":"Lesson"}</div>
              <div style={{ fontSize:12, color:C.gray400, marginTop:2 }}>{l.type==="quiz"?"Add questions for this assessment":"Add a title and video link"}</div>
            </div>
          </div>

          <Label>TITLE</Label>
          <input value={l.title} onChange={e=>patchLesson(l._secId,l.id,{title:e.target.value})}
            placeholder="Enter title…"
            style={{...inputSt, marginBottom:16}}/>

          {/* Video content */}
          {l.type==="video" && <>
            <Label>LESSON CONTENT</Label>
            <input value={l.vimeoUrl||""} onChange={e=>patchLesson(l._secId,l.id,{vimeoUrl:e.target.value})}
              placeholder="https://vimeo.com/…"
              style={inputSt}/>
            <div style={{ fontSize:11, color:C.gray400, marginTop:5 }}>Supported: Vimeo, YouTube, and more.</div>
          </>}

          {/* Quiz questions — compact rows + inline edit panel */}
          {l.type==="quiz" && <>
            <Label>QUESTIONS</Label>
            <div>
                {l.questions.map((q, qi) => {
                  const isEditing = editingQuestionId === q.id;
                  const answerLetters = ["A","B","C","D","E","F"];
                  return (
                    <div key={q.id} style={{ marginBottom:8 }}>
                      {/* Compact row */}
                      {!isEditing && (
                        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", border:`1px solid ${C.gray200}`, borderRadius:10, background:C.white }}>
                          <div style={{ width:30, height:30, borderRadius:8, background:C.gray100, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:C.gray600, flexShrink:0 }}>{qi+1}</div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:14, fontWeight:600, color:C.gray900, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{q.text || "Untitled question"}</div>
                            <div style={{ fontSize:12, color:C.gray400, marginTop:2 }}>{q.options.filter(o=>o).length} answers</div>
                          </div>
                          <button onClick={()=>setEditingQuestionId(q.id)} style={{ width:28,height:28,borderRadius:7,border:`1px solid ${C.gray200}`,background:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><Icon name="pencil" size={13} color={C.gray500}/></button>
                          <button onClick={()=>deleteQuestion(l._secId,l.id,q.id)} style={{ width:28,height:28,borderRadius:7,border:`1px solid ${C.gray200}`,background:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><Icon name="trash" size={13} color={C.error}/></button>
                        </div>
                      )}
                      {/* Edit question panel */}
                      {isEditing && (
                        <div style={{ border:`1px solid ${C.gray200}`, borderRadius:10, overflow:"hidden", background:C.white }}>
                          <div style={{ padding:"16px 18px", borderBottom:`1px solid ${C.gray100}` }}>
                            <div style={{ fontSize:12, fontWeight:700, color:C.gray500, letterSpacing:.5, marginBottom:6 }}>QUESTION</div>
                            <input value={q.text} onChange={e=>patchQuestion(l._secId,l.id,q.id,{text:e.target.value})}
                              placeholder="Enter your question…"
                              style={{ width:"100%", padding:"9px 12px", border:`1px solid ${C.gray200}`, borderRadius:8, fontSize:14, color:C.gray700, outline:"none", background:C.gray50, boxSizing:"border-box", fontFamily:"inherit" }}/>
                          </div>
                          <div style={{ padding:"16px 18px", borderBottom:`1px solid ${C.gray100}` }}>
                            <div style={{ fontSize:12, fontWeight:700, color:C.gray500, letterSpacing:.5, marginBottom:12 }}>ANSWERS</div>
                            {q.options.map((opt, oi) => (
                              <div key={oi} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                                <div style={{ display:"flex", alignItems:"center", flex:1, border:`1px solid ${C.gray200}`, borderRadius:8, background:C.gray50, overflow:"hidden" }}>
                                  <span style={{ fontSize:12, fontWeight:700, color:C.gray400, padding:"0 10px", borderRight:`1px solid ${C.gray200}`, alignSelf:"stretch", display:"flex", alignItems:"center", background:C.white, flexShrink:0 }}>{answerLetters[oi]||oi+1}</span>
                                  <input value={opt} onChange={e=>{ const opts=[...q.options]; opts[oi]=e.target.value; patchQuestion(l._secId,l.id,q.id,{options:opts}); }}
                                    placeholder={`Answer ${answerLetters[oi]||oi+1}`}
                                    style={{ flex:1, padding:"9px 12px", border:"none", outline:"none", fontSize:13, color:C.gray700, background:"transparent", fontFamily:"inherit" }}/>
                                </div>
                                {/* Right / Wrong toggles */}
                                <button onClick={()=>patchQuestion(l._secId,l.id,q.id,{correct:oi})}
                                  style={{ padding:"5px 10px", borderRadius:"6px 0 0 6px", border:`1px solid ${q.correct===oi ? C.primary : C.gray200}`, borderRight:"none", fontSize:12, fontWeight:700, cursor:"pointer", background: q.correct===oi ? C.primary : C.white, color: q.correct===oi ? "#fff" : C.gray600 }}>
                                  Right
                                </button>
                                <button onClick={()=>{ if(q.correct===oi) patchQuestion(l._secId,l.id,q.id,{correct:-1}); }}
                                  style={{ padding:"5px 10px", borderRadius:"0 6px 6px 0", border:`1px solid ${q.correct!==oi ? C.primary : C.gray200}`, fontSize:12, fontWeight:700, cursor:"pointer", background: q.correct!==oi ? C.primary : C.white, color: q.correct!==oi ? "#fff" : C.gray600 }}>
                                  Wrong
                                </button>
                                <button onClick={()=>{ const opts=q.options.filter((_,i)=>i!==oi); patchQuestion(l._secId,l.id,q.id,{options:opts, correct: q.correct===oi?-1: q.correct>oi?q.correct-1:q.correct}); }}
                                  style={{ width:26,height:26,borderRadius:6,border:`1px solid ${C.gray200}`,background:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                                  <Icon name="x" size={11} color={C.gray400}/>
                                </button>
                              </div>
                            ))}
                            <button onClick={()=>{ const opts=[...q.options,""]; patchQuestion(l._secId,l.id,q.id,{options:opts}); }}
                              style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 12px", border:`1px solid ${C.gray200}`, borderRadius:8, background:C.white, cursor:"pointer", color:C.gray600, fontSize:13, fontWeight:600, marginTop:4 }}>
                              <Icon name="plus" size={12} color={C.gray500}/> New answer
                            </button>
                            {q.correct===-1 && <div style={{ fontSize:12, color:"#dc2626", marginTop:8 }}>You must have at least one right answer.</div>}
                          </div>
                          <div style={{ display:"flex", justifyContent:"flex-end", gap:8, padding:"12px 16px" }}>
                            <button onClick={()=>setEditingQuestionId(null)}
                              style={{ padding:"7px 16px", borderRadius:8, border:`1px solid ${C.gray200}`, background:C.white, color:C.gray700, fontSize:13, fontWeight:600, cursor:"pointer" }}>
                              Discard
                            </button>
                            <button onClick={()=>setEditingQuestionId(null)}
                              style={{ padding:"7px 16px", borderRadius:8, border:"none", background:C.primary, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                              Save
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            <div onClick={()=>addQuestion(l._secId,l.id)} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px 2px", cursor:"pointer" }}>
              <div style={{ width:30, height:30, borderRadius:8, background:C.gray100, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon name="plus" size={13} color={C.gray500}/>
              </div>
              <span style={{ fontSize:14, fontWeight:600, color:C.gray700 }}>New question</span>
            </div>
          </div>
          </>}
        </div>
      ))}
      {/* ── Materials section ── */}
      {materialLessons.map((l, mi) => (
        <div key={l.id} style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:14, marginBottom:16, padding:24 }}>

          {/* Card header — FormSection style */}
          <div style={{ display:"flex", gap:12, marginBottom:20, alignItems:"flex-start" }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"#ecfdf5", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Icon name="file-pdf" size={18} color="#059669"/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, fontSize:16, color:C.gray900 }}>Material</div>
              <div style={{ fontSize:12, color:C.gray400, marginTop:2 }}>Upload files for this lesson</div>
            </div>
            <button onClick={()=>deleteFlatLesson(l._secId,l.id)}
              style={{ width:28,height:28,borderRadius:7,border:`1px solid ${C.gray200}`,background:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              <Icon name="trash" size={13} color={C.error}/>
            </button>
          </div>

          <Label>TITLE</Label>
          <input value={l.title} onChange={e=>patchLesson(l._secId,l.id,{title:e.target.value})}
            placeholder="Enter title…"
            style={{...inputSt, marginBottom:16}}/>
          <Label>MATERIAL</Label>
            <div
              onDragOver={e=>{ e.preventDefault(); patchLesson(l._secId,l.id,{_dropOver:true}); }}
              onDragLeave={()=>patchLesson(l._secId,l.id,{_dropOver:false})}
              onDrop={e=>{ e.preventDefault(); patchLesson(l._secId,l.id,{_dropOver:false}); const f=e.dataTransfer.files?.[0]; if(f) patchLesson(l._secId,l.id,{materialFile:f,title:l.title||f.name.replace(/\.[^.]+$/,"")}); }}
              onClick={()=>{ setUploadingMaterialId({secId:l._secId,lesId:l.id}); setTimeout(()=>materialInputRef.current?.click(),0); }}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, padding:"24px 16px", border:`2px dashed ${l._dropOver?"#059669": l.materialFile?"#bbf7d0":C.gray200}`, borderRadius:10, background: l._dropOver?"#f0fdf4": l.materialFile?"#f0fdf4":C.gray50, cursor:"pointer", transition:"all .15s" }}>
              <Icon name="cloud-arrow-up" size={26} color={l.materialFile?"#059669":C.gray400}/>
              {l.materialFile
                ? <span style={{ fontSize:13, fontWeight:600, color:"#059669" }}>{l.materialFile.name}</span>
                : <>
                    <span style={{ fontSize:13, fontWeight:600, color:C.gray700 }}>Click here or drag to add materials</span>
                    <span style={{ fontSize:12, color:C.gray400 }}>Any document or zip file, max size 10MB</span>
                  </>
              }
            </div>
        </div>
      ))}

      {/* Add material button */}
      <button onClick={()=>addMaterialWithFile(null)}
        style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", border:"none", borderRadius:8, background:C.primary, fontSize:13, fontWeight:600, color:"#fff", cursor:"pointer" }}>
        <Icon name="plus" size={12} color="#fff"/> Add Material
      </button>
    </div>
  );
}


function AdminCreateSession({ onBack, toast, onSave }) {
  const [tab,  setTab]  = useState("details");
  const [form, setForm] = useState({
    title:"", category:"SPED", lang:"English", desc:"",
    availableFrom:"", availableTo:"",
    instructorName:"", bio:"",
    vimeoUrl:"",
    discussion:true, qa:true, spinWheel:false, certificate:false, commentVisibility:"visible",
  });
  const upd = (k,v) => setForm(f=>({...f,[k]:v}));
  const sectionsRef = useRef(null);
  function handleSectionsChange(secs) { sectionsRef.current = secs; }
  const initialSections = null;

  const [questions,  setQuestions]  = useState([]);
  const [typeMenuId, setTypeMenuId] = useState(null);

  const Q_TYPES = [
    { key:"short-answer",    label:"Short answer",    icon:"minus",             group:1 },
    { key:"paragraph",       label:"Paragraph",       icon:"text-align-left",   group:1 },
    { key:"multiple-choice", label:"Multiple choice", icon:"radio-button",      group:2 },
    { key:"checkboxes",      label:"Checkboxes",      icon:"check-square",      group:2 },
    { key:"dropdown",        label:"Dropdown",        icon:"caret-circle-down", group:2 },
  ];

  function addQuestion() {
    setQuestions(qs => [...qs, { id:Date.now(), type:"multiple-choice", text:"", options:["","","",""], correct:0, correctArr:[] }]);
  }
  function updateQuestion(id, text) { setQuestions(qs => qs.map(q => q.id===id ? {...q,text} : q)); }
  function updateOption(id, oi, value) {
    setQuestions(qs => qs.map(q => { if(q.id!==id) return q; const opts=[...q.options]; opts[oi]=value; return {...q,options:opts}; }));
  }
  function setCorrect(id, oi) { setQuestions(qs => qs.map(q => q.id===id ? {...q,correct:oi} : q)); }
  function duplicateQuestion(id) {
    setQuestions(qs => { const idx=qs.findIndex(q=>q.id===id); const copy={...qs[idx],id:Date.now()}; const next=[...qs]; next.splice(idx+1,0,copy); return next; });
  }
  function setQuestionType(id, type) { setQuestions(qs => qs.map(q => q.id===id?{...q,type,correct:0,correctArr:[]}:q)); setTypeMenuId(null); }
  function toggleCheckbox(id, oi) {
    setQuestions(qs => qs.map(q => { if(q.id!==id) return q; const arr=q.correctArr.includes(oi)?q.correctArr.filter(i=>i!==oi):[...q.correctArr,oi]; return {...q,correctArr:arr}; }));
  }
  function deleteQuestion(id) { setQuestions(qs => qs.filter(q=>q.id!==id)); }

  const Toggle = ({ fieldKey }) => (
    <div onClick={()=>upd(fieldKey,!form[fieldKey])}
      style={{ width:42,height:23,borderRadius:99,background:form[fieldKey]?C.primary:C.gray300,
        position:"relative",cursor:"pointer",transition:"background .2s",flexShrink:0 }}>
      <div style={{ width:17,height:17,borderRadius:"50%",background:"#fff",position:"absolute",
        top:3,left:form[fieldKey]?22:3,transition:"left .2s" }}/>
    </div>
  );

  function save(publish=false) {
    if (!form.title.trim()) { toast({ type:"error", title:"Title required", message:"Please add a session title before saving." }); return; }
    onSave && onSave(form, publish, sectionsRef.current);
    if (publish) { toast({ type:"success", title:"Session published! 🚀", message:`"${form.title}" is now live.` }); }
    else { toast({ type:"info", title:"Draft saved", message:`"${form.title}" saved as draft.` }); }
    setTimeout(onBack, 800);
  }

  const TABS = [
    { key:"details",      label:"Details"      },
    { key:"curriculum",   label:"Lessons"      },
    { key:"availability", label:"Availability" },
  ];

  return (
    <div style={{ background:C.gray50, minHeight:"100%", display:"flex", flexDirection:"column" }}>

      {/* Header + Tabs combined */}
      <div style={{ background:C.white, borderBottom:`1px solid ${C.gray200}`, flexShrink:0 }}>
        <div style={{ padding:"16px 28px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:4, fontSize:14, fontWeight:500, color:C.gray500 }}>
            <button type="button" aria-label="Home" onClick={onBack}
              style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex", alignItems:"center" }}
              onMouseEnter={e=>e.currentTarget.style.opacity=".7"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 7.609c.352 0 .69.122.96.343l.111.1 6.25 6.25v.001a1.5 1.5 0 0 1 .445 1.071v7.5a.89.89 0 0 1-.891.891H9.125a.89.89 0 0 1-.89-.89v-7.5l.006-.149a1.5 1.5 0 0 1 .337-.813l.1-.11 6.25-6.25c.285-.285.67-.444 1.072-.444Zm5.984 7.876L16 9.5l-5.984 5.985v6.499h11.968z" fill="#475569" stroke="#475569" strokeWidth=".094"/>
              </svg>
            </button>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="m14.413 10.663-6.25 6.25a.939.939 0 1 1-1.328-1.328L12.42 10 6.836 4.413a.939.939 0 1 1 1.328-1.328l6.25 6.25a.94.94 0 0 1-.001 1.328" fill="#CBD5E1"/>
            </svg>
            <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", padding:0, fontSize:14, fontWeight:500, color:C.gray500 }}
              onMouseEnter={e=>e.currentTarget.style.color=C.gray900} onMouseLeave={e=>e.currentTarget.style.color=C.gray500}>
              Sessions
            </button>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="m14.413 10.663-6.25 6.25a.939.939 0 1 1-1.328-1.328L12.42 10 6.836 4.413a.939.939 0 1 1 1.328-1.328l6.25 6.25a.94.94 0 0 1-.001 1.328" fill="#CBD5E1"/>
            </svg>
            <span style={{ color:"#6366f1", fontWeight:600 }}>Create New Session</span>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn variant="outline" onClick={()=>save(false)}>Save Draft</Btn>
            <Btn onClick={()=>save(true)}><Icon name="lightning" size={14} color="#fff"/>Publish Session</Btn>
          </div>
        </div>
        <div style={{ display:"flex", gap:20, padding:"0 28px" }}>
          {TABS.map(t => {
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={()=>setTab(t.key)}
                style={{ padding:"12px 0", background:"none", border:"none",
                  borderBottom: active ? `2px solid ${C.primary}` : "2px solid transparent",
                  cursor:"pointer", fontSize:14, fontWeight: active ? 700 : 500,
                  color: active ? C.primary : C.gray500, marginBottom:-1 }}>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ flex:1, overflowY:"auto", padding: tab==="curriculum" ? "20px" : "20px" }}>

        {/* ── SESSION DETAILS tab ── */}
        {tab === "details" && <>

          <FormSection icon="info" title="General Information" subtitle="Set the foundational details for your curated recorded course.">
            <Label required>COURSE TITLE</Label>
            <input value={form.title} onChange={e=>upd("title",e.target.value)} placeholder="e.g. Advanced Figma Auto-Layout Masterclass" style={{...inputSt,marginBottom:14}}/>
            <Label>DESCRIPTION</Label>
            <textarea value={form.desc} onChange={e=>upd("desc",e.target.value)} placeholder="Deep dive into the nuances of the course content…" rows={4} style={{...inputSt,resize:"vertical",marginBottom:14}}/>
          </FormSection>

          <FormSection icon="user-circle" title="Instructor Profile" subtitle="Share your expertise and background with your students.">
            <div style={{ display:"grid", gridTemplateColumns:"160px 1fr", gap:20 }}>
              <div>
                <Label>PROFILE PICTURE</Label>
                <UploadZone accept="image/*" icon="image" label="Upload photo" hint="JPG/PNG" height={140}/>
              </div>
              <div>
                <Label required>INSTRUCTOR NAME</Label>
                <input value={form.instructorName} onChange={e=>upd("instructorName",e.target.value)} placeholder="e.g. Jane Doe" style={{...inputSt,marginBottom:12}}/>
                <Label>PROFESSIONAL BIO</Label>
                <textarea value={form.bio} onChange={e=>upd("bio",e.target.value)} placeholder="Write a short bio about your career and achievements…" rows={3} style={{...inputSt,resize:"vertical",marginBottom:12}}/>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <input placeholder="LinkedIn username" style={inputSt}/>
                  <input placeholder="X (Twitter) handle" style={inputSt}/>
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection icon="chat-circle" title="Engagement Settings" subtitle="Configure how learners interact with this session.">
            {/* Certificate */}
            {[
              { key:"certificate", label:"Certificate",   desc:"Send students a certificate when they complete all lessons." },
              { key:"spinWheel",   label:"Spin the Wheel", desc:"Enable a spin the wheel activity for students to win rewards." },
            ].map(item => (
              <div key={item.key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 0", borderBottom:`1px solid ${C.gray100}` }}>
                <div style={{ fontWeight:700, fontSize:14, color:C.gray900 }}>{item.label}</div>
                <Toggle fieldKey={item.key}/>
              </div>
            ))}
            {/* Comment visibility */}
            <div style={{ padding:"16px 0" }}>
              <div style={{ fontWeight:700, fontSize:14, color:C.gray900, marginBottom:14 }}>Community visibility</div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {[
                  { val:"visible", label:"Visible", desc:"All comments are shown and new ones can be posted." },
                  { val:"hidden",  label:"Hidden",  desc:"No comments are shown and new ones can't be posted." },
                  { val:"locked",  label:"Locked",  desc:"Existing comments are shown, but students cannot leave new ones." },
                ].map(opt => (
                  <div key={opt.val} onClick={()=>upd("commentVisibility", opt.val)}
                    style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, cursor:"pointer" }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:C.gray900 }}>{opt.label}</div>
                      <div style={{ fontSize:12, color:C.gray400, marginTop:2, lineHeight:1.5 }}>{opt.desc}</div>
                    </div>
                    <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${form.commentVisibility===opt.val ? C.primary : C.gray300}`, background: form.commentVisibility===opt.val ? C.primary : C.white, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {form.commentVisibility===opt.val && <div style={{ width:6, height:6, borderRadius:"50%", background:"#fff" }}/>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FormSection>
        </>}

        {/* ── AVAILABILITY tab ── */}
        {tab === "availability" && (
          <FormSection icon="calendar" title="Availability" subtitle="Set the access window. The session goes live on the start date and auto-archives after the end date.">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:C.gray500, letterSpacing:.5, marginBottom:4 }}>AVAILABLE FROM</div>
                <input type="datetime-local" value={form.availableFrom} onChange={e=>upd("availableFrom",e.target.value)} style={inputSt}/>
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:C.gray500, letterSpacing:.5, marginBottom:4 }}>AVAILABLE TO</div>
                <input type="datetime-local" value={form.availableTo} onChange={e=>upd("availableTo",e.target.value)} style={inputSt}/>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 12px", background:C.primaryLight, borderRadius:8, border:`1px solid ${C.primaryBorder}` }}>
              <Icon name="info" size={14} color={C.primary}/>
              <span style={{ fontSize:12, color:C.primary, lineHeight:1.5 }}>
                When the <strong>Available To</strong> date passes, this session is automatically moved to <strong>Archive</strong> and hidden from students. Leave blank for no expiry.
              </span>
            </div>
          </FormSection>
        )}

        {/* ── LESSONS tab ── */}
        {tab === "curriculum" && (
          <CurriculumBuilder toast={toast} initialSections={initialSections} onSectionsChange={handleSectionsChange}/>
        )}

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ADMIN EDIT SESSION
───────────────────────────────────────────────────────────────────────────── */
function AdminEditSession({ session, onBack, toast, onSave }) {
  const [tab,  setTab]  = useState("details");
  const [form, setForm] = useState({
    title:          session.title          || "",
    category:       session.category       || "UI Design",
    lang:           session.lang           || "English",
    desc:           session.desc           || "",
    availableFrom:  session.availableFrom  || "",
    availableTo:    session.availableTo    || "",
    instructorName: session.instructor     || "",
    bio:            session.bio            || "",
    vimeoUrl:       session.vimeoUrl       || "",
    discussion:     session.discussion !== undefined ? session.discussion : true,
    qa:             session.qa         !== undefined ? session.qa         : true,
    spinWheel:      session.spinWheel  !== undefined ? session.spinWheel  : false,
    certificate:    session.certificate !== undefined ? session.certificate : false,
    commentVisibility: session.commentVisibility || "visible",
  });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Capture curriculum sections so vimeoUrls on lessons are saved
  const sectionsRef = useRef(null);
  function handleSectionsChange(secs) { sectionsRef.current = secs; }

  // Build initialSections from session.lessons (flat list → one section)
  const initialSections = session.lessons && session.lessons.length ? [{
    id: 1, title: "Session", collapsed: false, resources: [],
    lessons: session.lessons.map(l => ({
      id: l.id, title: l.title, type: l.type || "video",
      duration: l.duration || "", status: l.status || "draft",
      vimeoUrl: l.vimeoUrl || "", questions: l.questions || [], quizExpanded: false,
    })),
  }] : null;

  const [questions, setQuestions] = useState(session.questions || []);

  const [typeMenuId, setTypeMenuId] = useState(null);

  const Q_TYPES = [
    { key:"short-answer",    label:"Short answer",    icon:"minus",             group:1 },
    { key:"paragraph",       label:"Paragraph",       icon:"text-align-left",   group:1 },
    { key:"multiple-choice", label:"Multiple choice", icon:"radio-button",      group:2 },
    { key:"checkboxes",      label:"Checkboxes",      icon:"check-square",      group:2 },
    { key:"dropdown",        label:"Dropdown",        icon:"caret-circle-down", group:2 },
  ];

  function addQuestion() {
    setQuestions(qs => [...qs, {
      id: Date.now(), type:"multiple-choice",
      text:"", options:["","","",""], correct:0, correctArr:[],
    }]);
  }
  function updateQuestion(id, text) {
    setQuestions(qs => qs.map(q => q.id===id ? {...q, text} : q));
  }
  function updateOption(id, oi, value) {
    setQuestions(qs => qs.map(q => {
      if (q.id !== id) return q;
      const opts = [...q.options]; opts[oi] = value; return {...q, options:opts};
    }));
  }
  function setCorrect(id, oi) {
    setQuestions(qs => qs.map(q => q.id===id ? {...q, correct:oi} : q));
  }
  function duplicateQuestion(id) {
    setQuestions(qs => {
      const idx = qs.findIndex(q => q.id===id);
      const copy = {...qs[idx], id: Date.now()};
      const next = [...qs]; next.splice(idx+1, 0, copy); return next;
    });
  }
  function setQuestionType(id, type) {
    setQuestions(qs => qs.map(q => q.id===id ? {...q, type, correct:0, correctArr:[]} : q));
    setTypeMenuId(null);
  }
  function toggleCheckbox(id, oi) {
    setQuestions(qs => qs.map(q => {
      if (q.id !== id) return q;
      const arr = q.correctArr.includes(oi)
        ? q.correctArr.filter(i => i!==oi)
        : [...q.correctArr, oi];
      return {...q, correctArr: arr};
    }));
  }
  function deleteQuestion(id) {
    setQuestions(qs => qs.filter(q => q.id!==id));
  }

  function save() {
    if (!form.title.trim()) { toast({ type:"error", title:"Title required", message:"Please add a session title before saving." }); return; }
    if (onSave) onSave(session.id, form, sectionsRef.current);
    toast({ type:"success", title:"Changes saved", message:`"${form.title}" has been updated.` });
    setTimeout(onBack, 1200);
  }

  function discard() {
    toast({ type:"info", message:"Changes discarded." });
    onBack();
  }


  const TABS = [
    { key:"details",      label:"Details"      },
    { key:"curriculum",   label:"Lessons"      },
    { key:"availability", label:"Availability" },
  ];

  const Toggle = ({ fieldKey }) => (
    <div onClick={()=>upd(fieldKey,!form[fieldKey])}
      style={{ width:42,height:23,borderRadius:99,background:form[fieldKey]?C.primary:C.gray300,
        position:"relative",cursor:"pointer",transition:"background .2s",flexShrink:0 }}>
      <div style={{ width:17,height:17,borderRadius:"50%",background:"#fff",position:"absolute",
        top:3,left:form[fieldKey]?22:3,transition:"left .2s" }}/>
    </div>
  );

  return (
    <div style={{ background:C.gray50, minHeight:"100%", display:"flex", flexDirection:"column" }}>

      {/* Header + Tabs combined */}
      <div style={{ background:C.white, borderBottom:`1px solid ${C.gray200}`, flexShrink:0 }}>
        <div style={{ padding:"16px 28px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:4, fontSize:14, fontWeight:500, color:C.gray500 }}>
            <button type="button" aria-label="Home" onClick={onBack}
              style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex", alignItems:"center" }}
              onMouseEnter={e=>e.currentTarget.style.opacity=".7"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 7.609c.352 0 .69.122.96.343l.111.1 6.25 6.25v.001a1.5 1.5 0 0 1 .445 1.071v7.5a.89.89 0 0 1-.891.891H9.125a.89.89 0 0 1-.89-.89v-7.5l.006-.149a1.5 1.5 0 0 1 .337-.813l.1-.11 6.25-6.25c.285-.285.67-.444 1.072-.444Zm5.984 7.876L16 9.5l-5.984 5.985v6.499h11.968z" fill="#475569" stroke="#475569" strokeWidth=".094"/>
              </svg>
            </button>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="m14.413 10.663-6.25 6.25a.939.939 0 1 1-1.328-1.328L12.42 10 6.836 4.413a.939.939 0 1 1 1.328-1.328l6.25 6.25a.94.94 0 0 1-.001 1.328" fill="#CBD5E1"/>
            </svg>
            <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", padding:0, fontSize:14, fontWeight:500, color:C.gray500 }}
              onMouseEnter={e=>e.currentTarget.style.color=C.gray900} onMouseLeave={e=>e.currentTarget.style.color=C.gray500}>
              Sessions
            </button>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="m14.413 10.663-6.25 6.25a.939.939 0 1 1-1.328-1.328L12.42 10 6.836 4.413a.939.939 0 1 1 1.328-1.328l6.25 6.25a.94.94 0 0 1-.001 1.328" fill="#CBD5E1"/>
            </svg>
            <span style={{ color:"#6366f1", fontWeight:600, maxWidth:300, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{session.title}</span>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn variant="outline" onClick={discard}>Discard</Btn>
            <Btn onClick={save}><Icon name="floppy-disk" size={14} color="#fff"/>Save Changes</Btn>
          </div>
        </div>
        <div style={{ display:"flex", padding:"0 28px", gap:20 }}>
          {TABS.map(t => {
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={()=>setTab(t.key)}
                style={{ padding:"12px 0", background:"none", border:"none",
                  borderBottom: active ? `2px solid ${C.primary}` : "2px solid transparent",
                  cursor:"pointer", fontSize:14, fontWeight: active ? 700 : 500,
                  color: active ? C.primary : C.gray500, marginBottom:-1 }}>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ flex:1, overflowY:"auto", padding: tab==="curriculum" ? "20px" : "20px" }}>

        {/* ── SESSION DETAILS tab ── */}
        {tab === "details" && <>

          {/* General Information */}
          <FormSection icon="info" title="General Information" subtitle="Edit the foundational details for this session.">
            <Label required>SESSION TITLE</Label>
            <input value={form.title} onChange={e=>upd("title",e.target.value)}
              placeholder="e.g. Advanced Figma Auto-Layout Masterclass" style={{...inputSt,marginBottom:14}}/>
            <Label>DESCRIPTION</Label>
            <textarea value={form.desc} onChange={e=>upd("desc",e.target.value)}
              placeholder="Describe what students will learn in this session…" rows={4} style={{...inputSt,resize:"vertical"}}/>
          </FormSection>

          {/* Instructor Profile */}
          <FormSection icon="user-circle" title="Instructor Profile" subtitle="Your profile information shown to learners for this session.">
            <div style={{ display:"grid", gridTemplateColumns:"160px 1fr", gap:20 }}>
              <div>
                <Label>PROFILE PICTURE</Label>
                <UploadZone accept="image/*" icon="image" label="Change photo" hint="JPG/PNG" height={140}/>
              </div>
              <div>
                <Label required>INSTRUCTOR NAME</Label>
                <input value={form.instructorName} onChange={e=>upd("instructorName",e.target.value)}
                  placeholder="e.g. Jane Doe" style={{...inputSt,marginBottom:12}}/>
                <Label>PROFESSIONAL BIO</Label>
                <textarea value={form.bio} onChange={e=>upd("bio",e.target.value)}
                  placeholder="Write a short bio about your career and achievements…"
                  rows={3} style={{...inputSt,resize:"vertical",marginBottom:12}}/>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <input placeholder="LinkedIn username" style={inputSt}/>
                  <input placeholder="X (Twitter) handle" style={inputSt}/>
                </div>
              </div>
            </div>
          </FormSection>


          {/* Engagement Settings */}
          <FormSection icon="chat-circle" title="Engagement Settings" subtitle="Configure how learners interact with this session.">
            {[
              { key:"certificate", label:"Certificate",      desc:"Send students a certificate when they complete all lessons." },
              { key:"discussion",  label:"Discussion Forum", desc:"Allow students to ask questions and discuss with peers." },
              { key:"qa",          label:"Q&A Section",      desc:"Moderate and answer student questions individually." },
            ].map(item => (
              <div key={item.key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 0", borderBottom:`1px solid ${C.gray100}` }}>
                <div style={{ fontWeight:700, fontSize:14, color:C.gray900 }}>{item.label}</div>
                <Toggle fieldKey={item.key}/>
              </div>
            ))}
            {/* Comment visibility */}
            <div style={{ padding:"16px 0" }}>
              <div style={{ fontWeight:700, fontSize:14, color:C.gray900, marginBottom:14 }}>Community visibility</div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {[
                  { val:"visible", label:"Visible", desc:"All comments are shown and new ones can be posted." },
                  { val:"hidden",  label:"Hidden",  desc:"No comments are shown and new ones can't be posted." },
                  { val:"locked",  label:"Locked",  desc:"Existing comments are shown, but students cannot leave new ones." },
                ].map(opt => (
                  <div key={opt.val} onClick={()=>upd("commentVisibility", opt.val)}
                    style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, cursor:"pointer" }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:C.gray900 }}>{opt.label}</div>
                      <div style={{ fontSize:12, color:C.gray400, marginTop:2, lineHeight:1.5 }}>{opt.desc}</div>
                    </div>
                    <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${form.commentVisibility===opt.val ? C.primary : C.gray300}`, background: form.commentVisibility===opt.val ? C.primary : C.white, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {form.commentVisibility===opt.val && <div style={{ width:6, height:6, borderRadius:"50%", background:"#fff" }}/>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FormSection>
        </>}

        {/* ── AVAILABILITY tab ── */}
        {tab === "availability" && (
          <FormSection icon="calendar" title="Availability" subtitle="Set the access window. The session goes live on the start date and auto-archives after the end date.">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:C.gray500, letterSpacing:.5, marginBottom:4 }}>AVAILABLE FROM</div>
                <input type="datetime-local" value={form.availableFrom} onChange={e=>upd("availableFrom",e.target.value)} style={inputSt}/>
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:C.gray500, letterSpacing:.5, marginBottom:4 }}>AVAILABLE TO</div>
                <input type="datetime-local" value={form.availableTo} onChange={e=>upd("availableTo",e.target.value)} style={inputSt}/>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 12px", background:C.primaryLight, borderRadius:8, border:`1px solid ${C.primaryBorder}` }}>
              <Icon name="info" size={14} color={C.primary}/>
              <span style={{ fontSize:12, color:C.primary, lineHeight:1.5 }}>
                The session goes live at the <strong>Available From</strong> date &amp; time and auto-archives after <strong>Available To</strong>. Leave blank for no expiry.
              </span>
            </div>
          </FormSection>
        )}

        {/* ── LESSONS tab ── */}
        {tab === "curriculum" && (
          <CurriculumBuilder toast={toast} initialSections={initialSections} onSectionsChange={handleSectionsChange}/>
        )}

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────────────────────
   QUIZ DATA
───────────────────────────────────────────────────────────────────────────── */
const QUIZ_DATA = [
  { id:1, title:"AI in Design Foundations",        description:"Mastering the prompting landscape for creative tools.",                           category:"TECHNOLOGY",   icon:"lightning",    status:"in-progress",  questions:15, minutes:20, score:null, progress:40,  currentQ:6  },
  { id:2, title:"Sustainable Architectures",        description:"Building long-term digital systems with scale in mind.",                         category:"LEADERSHIP",   icon:"check-circle", status:"completed",    questions:15, minutes:20, score:92,   progress:100 },
  { id:3, title:"Product Strategy 101",             description:"Defining the value proposition in a crowded market.",                            category:"MANAGEMENT",   icon:"student",      status:"not-started",  questions:12, minutes:15, score:null, progress:0   },
  { id:4, title:"High-Performance Culture",         description:"Creating environments where top talent thrives.",                                category:"TEAMWORK",     icon:"users",        status:"not-started",  questions:20, minutes:30, score:null, progress:0   },
  { id:5, title:"Leadership in Hybrid Teams",       description:"Session 4: Managing cross-functional collaboration in remote environments.",     category:"LEADERSHIP",   icon:"users",        status:"in-progress",  questions:25, minutes:30, score:null, progress:40,  currentQ:10 },
  { id:6, title:"Mental Health & Wellness",         description:"Mindfulness-based strategies to support emotional regulation and wellness.",     category:"MANAGEMENT",   icon:"heart",        status:"completed",    questions:10, minutes:12, score:88,   progress:100 },
];

const QUIZ_QUESTIONS = [
  {
    id:1,
    question:"What is the primary benefit of AI-assisted design tools in special education?",
    options:["Speed of content creation","Personalization of learning materials","Reduced teacher workload","Lower technology costs"],
    correct:1
  },
  {
    id:2,
    question:"Which communication approach is most effective for DHH students in mainstream classrooms?",
    options:["Oral only","Sign language only","Total Communication","Written only"],
    correct:2
  },
  {
    id:3,
    question:"What does AAC stand for?",
    options:["Adapted Assistance Communication","Augmentative and Alternative Communication","Assisted Academic Communication","Advanced Accessibility Communication"],
    correct:1
  },
  {
    id:4,
    question:"Which strategy best supports paraeducator effectiveness?",
    options:["Minimal supervision","Clear role definition and ongoing training","Rotating assignments weekly","Limiting direct student interaction"],
    correct:1
  },
  {
    id:5,
    question:"What is a key principle of Universal Design for Learning (UDL)?",
    options:["Separate curriculum by ability","Multiple means of representation and engagement","Standardised one-size-fits-all testing","Remedial instruction only"],
    correct:1
  },
];

const LEADERBOARD_DATA = [
  { rank:1,  name:"Sarah Jenkins",   xp:3120, isMe:false },
  { rank:2,  name:"Marcus Chen",     xp:2980, isMe:false },
  { rank:3,  name:"Elena Rodriguez", xp:2840, isMe:false },
  { rank:14, name:"You (Alex)",      xp:2450, isMe:true  },
];


/* ─────────────────────────────────────────────────────────────────────────────
   SESSION QUIZZES  (5 questions per session, keyed by session id)
───────────────────────────────────────────────────────────────────────────── */
const SESSION_QUIZZES = {
  1: [
    { q:"What does a 'window of tolerance' refer to in trauma-informed teaching?", opts:["The classroom noise level","The zone of optimal arousal for learning","Break time between lessons","Window ventilation policy"], a:1 },
    { q:"Which mindfulness strategy is most suitable for in-classroom use?", opts:["30-minute meditation","Box breathing exercises","Silent retreats","Yoga sessions"], a:1 },
    { q:"Teacher burnout is BEST prevented by:", opts:["Working longer hours","Ignoring student behaviour","Proactive self-care routines","Reducing lesson planning"], a:2 },
    { q:"Somatic awareness in the classroom primarily helps students:", opts:["Memorise content faster","Recognise physical signs of stress","Improve handwriting","Complete homework faster"], a:1 },
    { q:"Which approach reflects a trauma-informed classroom practice?", opts:["Zero-tolerance discipline","Predictable routines and co-regulation","Frequent surprise tests","Competitive grading"], a:1 },
  ],
  2: [
    { q:"The term 'least restrictive environment' (LRE) means:", opts:["Fewest rules in the classroom","Students learn in settings as close to general ed as appropriate","No assistive technology","Unlimited accommodation"], a:1 },
    { q:"Which accommodation is most commonly used for students with dyslexia?", opts:["Reduced recess","Extended time on tests","Smaller font size","Fewer subjects"], a:1 },
    { q:"Co-teaching models BEST support inclusive classrooms by:", opts:["Separating students by ability","Having two teachers share instruction for all students","Giving IEP students a separate room","Using only visual materials"], a:1 },
    { q:"Universal Design for Learning (UDL) primarily focuses on:", opts:["One-size-fits-all curriculum","Multiple means of engagement, representation, and action","Physical classroom layout","Standardised test scores"], a:1 },
    { q:"An IEP is a legally binding document that:", opts:["Replaces the general curriculum","Outlines individualised goals and services for a student","Restricts a student's participation","Is optional for public schools"], a:1 },
  ],
  3: [
    { q:"DHH stands for:", opts:["Differently Hearing Humans","Deaf and Hard of Hearing","Dual Hearing Hierarchy","Dynamic Hearing Help"], a:1 },
    { q:"Total Communication in DHH education combines:", opts:["Only sign language","Multiple modes including speech, sign, and visual aids","Only oral speech","Written language only"], a:1 },
    { q:"Phonological awareness is important for DHH learners primarily because:", opts:["It replaces sign language","It supports literacy and reading development","It improves hearing","It eliminates the need for captioning"], a:1 },
    { q:"Which tool BEST supports DHH students in a mainstream classroom?", opts:["Louder teacher voice","FM system or sound field amplification","Removing all distractions","Sending notes home"], a:1 },
    { q:"Language deprivation in early childhood can result in:", opts:["Faster language acquisition later","Lifelong gaps in language development","No impact on learning","Better visual skills"], a:1 },
  ],
  4: [
    { q:"Effective paraeducator supervision starts with:", opts:["Trial and error","Clear role definitions and expectations","Daily observation reports","Reducing their responsibilities"], a:1 },
    { q:"Which delegation model works BEST in special education settings?", opts:["Delegating everything to paraeducators","Task-specific delegation with clear guidance and feedback","Allowing paraeducators to set their own goals","Avoiding delegation entirely"], a:1 },
    { q:"Communication between teachers and paraeducators should be:", opts:["Only during IEP meetings","Ongoing, structured, and collaborative","Handled entirely by administration","Limited to written notes"], a:1 },
    { q:"Which practice MOST supports student independence in the classroom?", opts:["Constant one-on-one paraeducator support","Fading prompts systematically over time","Paraeducator completing tasks for the student","Removing all support immediately"], a:1 },
    { q:"Paraeducators should primarily be trained in:", opts:["Curriculum design","Behaviour management and instructional strategies","Administrative tasks","Parent communication only"], a:1 },
  ],
  5: [
    { q:"Which AI tool is MOST commonly used for personalised learning in SPED?", opts:["Social media platforms","Adaptive learning software","Generic search engines","Word processors"], a:1 },
    { q:"Text-to-speech technology MOST benefits students with:", opts:["High reading ability","Reading disabilities and visual impairments","No accommodations needed","Advanced math skills"], a:1 },
    { q:"When implementing AI tools in SPED, educators should prioritise:", opts:["Speed of implementation","Student data privacy and ethical use","Using the most expensive tools","Replacing human instruction entirely"], a:1 },
    { q:"Predictive text and word banks primarily support students with:", opts:["Hearing impairments","Motor difficulties and expressive language challenges","Vision impairments","Behavioural challenges"], a:1 },
    { q:"The BEST approach when evaluating an AI tool for classroom use is:", opts:["Adopt immediately if popular","Pilot with a small group and assess impact on student outcomes","Rely solely on vendor claims","Avoid all AI tools"], a:1 },
  ],
  6: [
    { q:"AAC stands for:", opts:["Adapted Academic Curriculum","Augmentative and Alternative Communication","Accessible Audio Content","Applied Assistive Concepts"], a:1 },
    { q:"Which students MOST benefit from AAC devices?", opts:["Students with advanced reading skills","Students with complex communication needs","Students who prefer writing","Students learning a second language"], a:1 },
    { q:"The principle of 'presumed competence' in AAC means:", opts:["Assuming students cannot learn","Assuming all students have the potential to communicate and learn","Waiting until a student proves ability before providing AAC","Only using AAC after all other options fail"], a:1 },
    { q:"Modelling language on an AAC device is BEST described as:", opts:["Telling students what to say","The teacher using the device to demonstrate language naturally","Restricting device use to break times","Letting students explore without guidance"], a:1 },
    { q:"Which is a key barrier to successful AAC implementation?", opts:["Having too many vocabulary options","Lack of training and consistent use across environments","Using high-tech devices","Involving families in the process"], a:1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────────────────
   SESSION QUIZ MODAL
   • Loads session-specific questions
   • Saves progress on close (in-progress)
   • 80% threshold for pass
───────────────────────────────────────────────────────────────────────────── */
function SessionQuizModal({ session, quizState = {}, onClose, onSaveProgress, onFinish }) {
  const questions = SESSION_QUIZZES[session.id] || [];
  const resumeQ   = quizState.currentQ || 0;
  const resumeAns = quizState.answers  || {};

  const [currentQ,  setCurrentQ]  = useState(resumeQ);
  const [answers,   setAnswers]    = useState(resumeAns);
  const [selected,  setSelected]   = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const q      = questions[currentQ];
  const isLast = currentQ === questions.length - 1;
  const pct    = Math.round((currentQ / questions.length) * 100);
  const answered = answers[currentQ] !== undefined;

  function choose(idx) {
    if (answered) return;
    setSelected(idx);
  }

  function next() {
    const choice = selected !== null ? selected : answers[currentQ];
    if (choice === undefined) return;
    const newAns = { ...answers, [currentQ]: choice };
    setAnswers(newAns);
    setSelected(null);

    if (isLast) {
      const correct = Object.entries(newAns).filter(
        ([qi, a]) => questions[Number(qi)].a === a
      ).length;
      const score = Math.round((correct / questions.length) * 100);
      setFinalScore(score);
      setShowResult(true);
    } else {
      setCurrentQ(q => q + 1);
    }
  }

  /* Save progress and close (mid-quiz) */
  function handleClose() {
    if (!showResult && currentQ < questions.length) {
      onSaveProgress(session.id, { status:"in-progress", currentQ, answers });
    }
    onClose();
  }

  /* Final save */
  function handleFinish() {
    const passed = finalScore >= 80;
    onFinish(session.id, finalScore, passed);
    onClose();
  }

  /* Option visual state */
  function optStyle(i) {
    const isCorrect = q && q.a === i;
    if (answered) {
      const wasChosen = answers[currentQ] === i;
      if (wasChosen && isCorrect) return { bg: C.successLight, border: C.successBorder, color: C.success };
      if (wasChosen)              return { bg: C.errorLight,   border: C.errorBorder,   color: C.error   };
      if (isCorrect)              return { bg: C.successLight, border: C.successBorder, color: C.success };
    }
    if (selected === i)           return { bg: C.primaryLight, border: C.primary,       color: C.primary  };
    return { bg: C.white, border: C.gray200, color: C.gray700 };
  }

  if (!questions.length) return null;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:600,
                  display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:C.white, borderRadius:20, width:"100%", maxWidth:560,
                    maxHeight:"90vh", overflowY:"auto",
                    boxShadow:"0 28px 72px rgba(0,0,0,0.22)", animation:"fadeIn .2s ease" }}>

        {/* ── Header ── */}
        <div style={{ padding:"18px 22px 14px", borderBottom:`1px solid ${C.gray100}`,
                      display:"flex", justifyContent:"space-between", alignItems:"flex-start",
                      position:"sticky", top:0, background:C.white, zIndex:1, borderRadius:"20px 20px 0 0" }}>
          <div>
            <div style={{ fontSize:12, fontWeight:700, letterSpacing:1.5, color:C.primary, marginBottom:3 }}>
              SESSION ASSESSMENT
            </div>
            <div style={{ fontWeight:700, fontSize:14, color:C.gray900, lineHeight:1.3, maxWidth:380 }}>
              {session.title}
            </div>
          </div>
          <button onClick={handleClose}
            style={{ width:32, height:32, borderRadius:8, border:`1px solid ${C.gray200}`,
                     background:C.white, cursor:"pointer", display:"flex",
                     alignItems:"center", justifyContent:"center", flexShrink:0, marginLeft:12 }}
            onMouseEnter={e=>e.currentTarget.style.background=C.gray50}
            onMouseLeave={e=>e.currentTarget.style.background=C.white}>
            <Icon name="x" size={16} color={C.gray500}/>
          </button>
        </div>

        {/* ── Pass threshold notice ── */}
        {!showResult && (
          <div style={{ margin:"14px 22px 0",
                        background:C.warningLight, border:`1px solid ${C.warningBorder}`,
                        borderRadius:10, padding:"9px 14px",
                        display:"flex", alignItems:"center", gap:8 }}>
            <Icon name="info" size={14} color={C.warning}/>
            <span style={{ fontSize:12, color:C.gray700, fontWeight:500 }}>
              You need <strong>75%</strong> or more to unlock your certificate for this session.
            </span>
          </div>
        )}

        {!showResult ? (
          <div style={{ padding:"18px 22px 24px" }}>
            {/* Progress */}
            <div style={{ display:"flex", justifyContent:"space-between",
                          fontSize:12, color:C.gray400, marginBottom:7 }}>
              <span>Question {currentQ + 1} of {questions.length}</span>
              <span>{pct}% complete</span>
            </div>
            <ProgressBar value={pct} height={5}/>

            {/* Question */}
            <div style={{ margin:"22px 0 18px", fontSize:16, fontWeight:700,
                          color:C.gray900, lineHeight:1.55 }}>
              {q.q}
            </div>

            {/* Options */}
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {q.opts.map((opt, i) => {
                const { bg, border, color } = optStyle(i);
                return (
                  <button key={i} onClick={() => choose(i)}
                    style={{ padding:"13px 16px", borderRadius:12, border:`2px solid ${border}`,
                             background:bg, color, fontSize:14, fontWeight:500,
                             textAlign:"left", cursor:answered?"default":"pointer",
                             transition:"border-color .15s, background .15s",
                             display:"flex", alignItems:"center", gap:12 }}>
                    <span style={{ width:28, height:28, borderRadius:"50%", border:`2px solid ${border}`,
                                   display:"flex", alignItems:"center", justifyContent:"center",
                                   fontSize:12, fontWeight:700, flexShrink:0, color }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                    {answered && q.a === i && (
                      <Icon name="check-circle" size={16} color={C.success} style={{ marginLeft:"auto" }}/>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback + Next */}
            <div style={{ marginTop:20, display:"flex",
                          justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:12,
                             color: answered
                               ? (q.a === (answers[currentQ] ?? selected) ? C.success : C.error)
                               : C.gray400,
                             fontWeight: answered ? 600 : 400 }}>
                {answered
                  ? (q.a === answers[currentQ] ? "✓ Correct!" : "✗ Incorrect — see highlighted answer")
                  : selected !== null ? "Ready to confirm" : "Select an answer"}
              </span>
              <Btn onClick={next}
                disabled={selected === null && !answered}>
                {isLast ? "Finish" : "Next"} <Icon name="caret-right" size={14} color="#fff"/>
              </Btn>
            </div>
          </div>
        ) : (
          /* ── Result screen ── */
          <div style={{ padding:"40px 28px 36px", textAlign:"left" }}>
            <div style={{ fontSize:56, marginBottom:14, lineHeight:1 }}>
              {finalScore >= 80 ? "🏆" : finalScore >= 50 ? "🎯" : "📚"}
            </div>
            <h2 style={{ margin:"0 0 6px", fontSize:22, fontWeight:900, color:C.gray900 }}>
              {finalScore >= 80 ? "Assessment Passed!" : "Not Quite There Yet"}
            </h2>
            <p style={{ color:C.gray500, fontSize:14, margin:"0 0 10px" }}>
              {finalScore >= 80
                ? "Congratulations! You've unlocked your certificate."
                : "Review the material and give it another shot."}
            </p>
            <div style={{ fontSize:52, fontWeight:900, marginBottom:6,
                          color: finalScore >= 80 ? C.success : finalScore >= 50 ? C.warning : C.error }}>
              {finalScore}%
            </div>
            <div style={{ fontSize:12, color:C.gray400, marginBottom:28 }}>
              Pass threshold: 75%
            </div>
            <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
              <Btn variant="outline" onClick={onClose}>Close</Btn>
              {finalScore >= 80
                ? <Btn onClick={handleFinish}><Icon name="star" size={14} color="#fff"/> Save &amp; Get Certificate</Btn>
                : <Btn variant="danger" onClick={handleFinish}><Icon name="arrow-left" size={14} color={C.error}/> Save &amp; Try Again Later</Btn>
              }
            </div>
          </div>
        )}
      </div>
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
                  display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}
         onClick={onClose}>
      <div style={{ background: dark ? "#1e2647" : "#fff", borderRadius:16, width:"100%", maxWidth:440,
                    boxShadow:"0 24px 60px rgba(0,0,0,0.4)", padding:"28px 28px 24px", position:"relative" }}
           onClick={e => e.stopPropagation()}>
        {/* Close */}
        <button onClick={onClose}
          style={{ position:"absolute", top:14, right:14, width:28, height:28, borderRadius:8,
                   border:`1px solid ${dark ? "rgba(255,255,255,0.12)" : C.gray200}`, background:"none", cursor:"pointer",
                   display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="x" size={14} color={dark ? "rgba(255,255,255,0.5)" : C.gray500}/>
        </button>

        <div style={{ fontSize:20, fontWeight:700, color: dark ? "#fff" : "#181c32", marginBottom:6 }}>Share this certificate</div>
        <div style={{ fontSize:13, color: dark ? "rgba(255,255,255,0.5)" : C.gray400, marginBottom:24 }}>Show your network what you've accomplished</div>

        {/* Social icons */}
        <div style={{ display:"flex", gap:16, justifyContent:"center", marginBottom:24 }}>
          {socials.map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
               style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, textDecoration:"none" }}>
              <div style={{ width:50, height:50, borderRadius:"50%", background:s.color,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            boxShadow:"0 2px 8px rgba(0,0,0,0.25)", transition:"transform .15s" }}
                   onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
                   onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                {s.icon}
              </div>
              <span style={{ fontSize:11, color: dark ? "rgba(255,255,255,0.5)" : C.gray500, fontWeight:500 }}>{s.label}</span>
            </a>
          ))}
        </div>

        {/* Copy link row */}
        <div style={{ display:"flex", alignItems:"center", gap:0, border:`1px solid ${dark ? "rgba(255,255,255,0.1)" : C.gray200}`,
                      borderRadius:10, overflow:"hidden", background: dark ? "rgba(255,255,255,0.06)" : C.gray50 }}>
          <div style={{ flex:1, padding:"10px 14px", fontSize:12, color: dark ? "rgba(255,255,255,0.45)" : C.gray500,
                        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {fullUrl}
          </div>
          <button onClick={copyLink}
            style={{ padding:"10px 16px", background:"none", border:"none", borderLeft:`1px solid ${dark ? "rgba(255,255,255,0.1)" : C.gray200}`,
                     color: copied ? C.success : C.primary, fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>
            {copied ? "COPIED!" : "COPY"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CERTIFICATE MODAL
───────────────────────────────────────────────────────────────────────────── */
function CertificateModal({ session, quizState, onClose }) {
  const score = quizState?.score ?? 0;
  const today = new Date().toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });
  const certId = `SS-${session.id}${score}-2024`;
  const certUrl = `spedsummit.com/cert/${certId.toLowerCase()}`;
  const [showShare, setShowShare] = useState(false);

  return (
    <>
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", zIndex:700,
                  display:"flex", alignItems:"center", justifyContent:"center", padding:24,
                  backdropFilter:"blur(3px)" }}>
      <div style={{ background:C.white, borderRadius:16, width:"100%", maxWidth:680,
                    boxShadow:"0 32px 80px rgba(0,0,0,0.3)", animation:"fadeIn .2s ease", overflow:"hidden" }}>

        {/* Modal top bar */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 20px", borderBottom:`1px solid ${C.gray100}` }}>
          <span style={{ fontSize:14, fontWeight:700, color:C.gray700 }}>Certificate Preview</span>
          <button onClick={onClose}
            style={{ width:30, height:30, borderRadius:8, border:`1px solid ${C.gray200}`,
                     background:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="x" size={15} color={C.gray500}/>
          </button>
        </div>

        {/* ── Certificate Document ── */}
        <div style={{ margin:"20px 20px 0", background:"#f7f7f7", borderRadius:12, overflow:"hidden", border:`1px solid ${C.gray200}` }}>

          <div style={{ padding:"32px 36px 36px", background:"#FEF5EC", position:"relative" }}>
            {/* Texture overlay — diagonal wavy lines via repeating gradient */}
            <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(135deg, transparent, transparent 18px, rgba(0,0,0,0.06) 18px, rgba(0,0,0,0.06) 19px)", pointerEvents:"none" }}/>
            <div style={{ position:"relative", zIndex:1 }}>

              {/* Header row: logo left, cert meta right */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:40 }}>
                {/* Logo */}
                <img src="/Container.png" alt="SPED Summit" style={{ height:36, width:"auto" }}/>
                {/* Cert meta */}
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:12, color:"#a1a5b7", lineHeight:1.8 }}>Certificate no: {certId}</div>
                  <div style={{ fontSize:12, color:"#a1a5b7", lineHeight:1.8 }}>Certificate url: {certUrl}</div>
                  <div style={{ fontSize:12, color:"#a1a5b7", lineHeight:1.8 }}>Reference Number: 0001</div>
                </div>
              </div>

              {/* Certificate label */}
              <div style={{ fontSize:12, fontWeight:700, color:"#7e8299", letterSpacing:2, textTransform:"uppercase", marginBottom:10 }}>
                Certificate of Completion
              </div>

              {/* Session title — large */}
              <div style={{ fontSize:34, fontWeight:900, color:"#181c32", lineHeight:1.15, marginBottom:16, letterSpacing:-.5, maxWidth:480 }}>
                {session.title}
              </div>

              {/* Instructor */}
              <div style={{ fontSize:14, color:"#5e6278", marginBottom:48 }}>
                Instructor&nbsp;&nbsp;<strong style={{ color:"#181c32" }}>{session.instructor}</strong>
                &nbsp;&nbsp;·&nbsp;&nbsp;{session.duration}
              </div>

              {/* Divider */}
              <div style={{ height:1, background:"#e4e6ef", marginBottom:24 }}/>

              {/* Student name + details */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
                <div>
                  <div style={{ fontSize:28, fontWeight:900, color:"#181c32", letterSpacing:-.3, marginBottom:6 }}>
                    Alex Johnson
                  </div>
                  <div style={{ fontSize:12, color:"#5e6278", lineHeight:2 }}>
                    <span style={{ color:"#7e8299" }}>Date&nbsp;&nbsp;</span><strong style={{ color:"#181c32" }}>{today}</strong>
                  </div>
                  <div style={{ fontSize:12, color:"#5e6278", lineHeight:2 }}>
                    <span style={{ color:"#7e8299" }}>Score&nbsp;&nbsp;</span><strong style={{ color:"#181c32" }}>{score}%</strong>
                  </div>
                </div>
                {/* Seal */}
                <div style={{ textAlign:"center" }}>
                  <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,#7c3aed,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 6px" }}>
                    <Icon name="medal" size={28} color="#fff"/>
                  </div>
                  <div style={{ fontSize:12, fontWeight:700, color:"#a1a5b7", letterSpacing:1 }}>VERIFIED</div>
                </div>
              </div>

          </div>{/* end relative wrapper */}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:"flex", gap:10, padding:"16px 20px", justifyContent:"flex-end" }}>
          <Btn variant="outline" onClick={onClose}>Close</Btn>
          <Btn variant="outline" onClick={() => setShowShare(true)}>
            <Icon name="share-network" size={14} color={C.primary}/> Share Certificate
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
    TECHNOLOGY:    { c:"#1e1b4b", bg:"#e0e7ff" },
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
    sections: [
      { heading: "Information We Collect", body: "We collect information you provide when registering (name, email address), your learning activity (progress, quiz results, certificates earned), and technical data (device type, browser, IP address) to operate and improve the platform." },
      { heading: "How We Use Your Information", body: "Your information is used to provide and personalize your learning experience, issue certificates, send important account and course updates, and improve our platform through anonymized analytics." },
      { heading: "Data Sharing", body: "We do not sell your personal data. We may share data with trusted service providers who assist in operating our platform, subject to strict confidentiality agreements. We may disclose data when required by law." },
      { heading: "Cookies", body: "We use cookies and similar technologies to keep you logged in, remember your preferences, and understand how users interact with the platform. You can control cookie settings through your browser." },
      { heading: "Data Retention", body: "We retain your account and learning data for as long as your account is active. You may request deletion of your account and associated data by contacting our support team." },
      { heading: "Your Rights", body: "Depending on your location, you may have rights to access, correct, or delete your personal data. To exercise these rights, please contact us at privacy@spedsummit.com." },
      { heading: "Security", body: "We use industry-standard security measures including encryption in transit and at rest to protect your data. However, no method of transmission over the internet is 100% secure." },
      { heading: "Contact Us", body: "If you have questions about this Privacy Policy, please contact us at privacy@spedsummit.com." },
    ],
  },
};

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
            <Icon name="x" size={16} color="#6b7280"/>
          </button>
        </div>
        {/* Body */}
        <div style={{ overflowY:"auto", padding:"20px 24px 28px" }}>
          <p style={{ fontSize:12, color:"#9ca3af", marginTop:0, marginBottom:20 }}>Last updated: January 2025</p>
          {content.sections.map((s,i) => (
            <div key={i} style={{ marginBottom:18 }}>
              <div style={{ fontWeight:700, fontSize:14, color:"#111827", marginBottom:6 }}>{s.heading}</div>
              <p style={{ fontSize:14, color:"#4b5563", lineHeight:1.7, margin:0 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuthModal({ onClose, onLogin }) {
  const [mode, setMode] = useState("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [legalModal, setLegalModal] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    onLogin();
  }

  function handleGoogle() {
    onLogin();
  }

  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(75,82,99,0.7)", padding:20 }}>
      <div style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:480, padding:"36px 40px 28px", position:"relative", boxShadow:"0 24px 64px rgba(0,0,0,0.18)" }}>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", cursor:"pointer", color:"#9ca3af", fontSize:18, lineHeight:1, padding:4 }}>✕</button>

        <h2 style={{ margin:"0 0 24px", fontSize:20, fontWeight:800, color:"#181c32", textAlign:"center" }}>
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h2>

        {/* Google */}
        <button onClick={handleGoogle}
          style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:12, padding:"13px 16px", border:"1.5px solid #e4e6ef", borderRadius:12, background:"#fff", fontSize:14, fontWeight:500, color:"#181c32", cursor:"pointer", marginBottom:10, transition:"border-color .15s" }}
          onMouseEnter={e=>e.currentTarget.style.borderColor="#3699ff"}
          onMouseLeave={e=>e.currentTarget.style.borderColor="#e4e6ef"}>
          <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-3.59-13.46-8.71l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
          Continue with Google
        </button>

        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <div style={{ flex:1, height:1, background:"#e4e6ef" }}/>
          <span style={{ fontSize:12, color:"#a1a5b7", fontWeight:500 }}>or</span>
          <div style={{ flex:1, height:1, background:"#e4e6ef" }}/>
        </div>

        <form onSubmit={handleSubmit}>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" type="email" required
            style={{ width:"100%", padding:"13px 16px", border:"1.5px solid #e4e6ef", borderRadius:12, fontSize:14, color:"#181c32", outline:"none", marginBottom:10, boxSizing:"border-box", background:"#fff" }}
            onFocus={e=>e.target.style.borderColor="#3699ff"} onBlur={e=>e.target.style.borderColor="#e4e6ef"}/>
          <div style={{ marginBottom:6 }}>
            <input value={password} onChange={e=>setPassword(e.target.value)} placeholder={mode==="signup"?"Create password":"Password"} type="password" required
              style={{ width:"100%", padding:"13px 16px", border:"1.5px solid #e4e6ef", borderRadius:12, fontSize:14, color:"#181c32", outline:"none", boxSizing:"border-box", background:"#fff" }}
              onFocus={e=>e.target.style.borderColor="#3699ff"} onBlur={e=>e.target.style.borderColor="#e4e6ef"}/>
            {mode==="signup" && <div style={{ fontSize:12, color:"#a1a5b7", marginTop:5, marginLeft:4 }}>Password must be at least 6 characters long.</div>}
          </div>
          {mode==="signup" && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
              <input value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="First name"
                style={{ padding:"13px 16px", border:"1.5px solid #e4e6ef", borderRadius:12, fontSize:14, color:"#181c32", outline:"none", boxSizing:"border-box", background:"#fff" }}
                onFocus={e=>e.target.style.borderColor="#3699ff"} onBlur={e=>e.target.style.borderColor="#e4e6ef"}/>
              <input value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Last name"
                style={{ padding:"13px 16px", border:"1.5px solid #e4e6ef", borderRadius:12, fontSize:14, color:"#181c32", outline:"none", boxSizing:"border-box", background:"#fff" }}
                onFocus={e=>e.target.style.borderColor="#3699ff"} onBlur={e=>e.target.style.borderColor="#e4e6ef"}/>
            </div>
          )}
          <button type="submit"
            style={{ width:"100%", padding:"15px", borderRadius:12, border:"none", background:"#50cd89", color:"#fff", fontSize:16, fontWeight:800, cursor:"pointer", marginTop:10, marginBottom:16, transition:"background .15s" }}
            onMouseEnter={e=>e.currentTarget.style.background="#3cb97a"}
            onMouseLeave={e=>e.currentTarget.style.background="#50cd89"}>
            {mode==="signup" ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign:"center", fontSize:14, color:"#5e6278", margin:"0 0 16px" }}>
          {mode==="signup" ? "Already a member? " : "Don't have an account? "}
          <button onClick={()=>setMode(mode==="signup"?"login":"signup")}
            style={{ background:"none", border:"none", color:"#3699ff", fontWeight:700, fontSize:14, cursor:"pointer", padding:0 }}>
            {mode==="signup" ? "Sign In" : "Sign Up"}
          </button>
        </p>

        {mode==="signup" && (
          <p style={{ textAlign:"center", fontSize:12, color:"#a1a5b7", margin:0, lineHeight:1.6 }}>
            By signing up you agree to Sped Summit's{" "}
            <span onClick={()=>setLegalModal("terms")} style={{ fontWeight:700, color:"#181c32", cursor:"pointer", textDecoration:"underline" }}>Terms of Service</span>
            {" "}and{" "}
            <span onClick={()=>setLegalModal("privacy")} style={{ fontWeight:700, color:"#181c32", cursor:"pointer", textDecoration:"underline" }}>Privacy Policy</span>.
          </p>
        )}
      </div>
      {legalModal && <LegalModal type={legalModal} onClose={()=>setLegalModal(null)}/>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LANDING PAGE
───────────────────────────────────────────────────────────────────────────── */
function SessionPublicPage({ session, onBack, onRegister, registerLabel }) {
  const [collapsedSections, setCollapsedSections] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [registered, setRegistered] = useState(false);

  function handleRegister() {
    onRegister && onRegister();
    setRegistered(true);
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
  const gradients = ["linear-gradient(135deg,#1e3a5f,#3699ff)","linear-gradient(135deg,#4c1d95,#a855f7)","linear-gradient(135deg,#166534,#50cd89)","linear-gradient(135deg,#7c2d12,#f97316)","linear-gradient(135deg,#164e63,#06b6d4)"];
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
    <div ref={pageRef} style={{ minHeight:"100vh", background:"#fff", fontFamily:"'Roboto','Segoe UI',system-ui,sans-serif" }}>

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
              <div style={{ marginTop:20, padding:"20px 24px", background:"rgba(255,255,255,0.06)", borderRadius:12, border:"1px solid rgba(255,255,255,0.12)", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}>
                <div>
                  <div style={{ fontSize:16, fontWeight:700, color:"#fff", marginBottom:4 }}>Enjoying the preview?</div>
                  <div style={{ fontSize:14, color:"rgba(255,255,255,0.6)" }}>Register to unlock all {session.lessons?.length} lessons in this course.</div>
                </div>
                <button onClick={() => { setPreviewOpen(false); handleRegister(); }}
                  style={{ flexShrink:0, background:"linear-gradient(135deg,#3699ff,#a855f7)", border:"none", borderRadius:10, padding:"12px 24px", fontSize:14, fontWeight:700, color:"#fff", cursor:"pointer", whiteSpace:"nowrap" }}>
                  {registerLabel || "Register"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Nav */}
      <nav style={{ position:"sticky", top:0, zIndex:100, background:"rgba(255,255,255,0.95)", backdropFilter:"blur(8px)", borderBottom:"1px solid #f0e8df", padding:"0 48px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", cursor:"pointer" }} onClick={onBack}>
          <img src="/Container.png" alt="SPED Summit" style={{ height:28, width:"auto", display:"block" }}/>
        </div>
        {registered ? (
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 18px", background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, fontSize:14, fontWeight:700, color:"#15803d" }}>
            Registered
          </div>
        ) : (
          <button onClick={handleRegister}
            style={{ padding:"9px 22px", background:"#3699ff", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}
            onMouseEnter={e=>e.currentTarget.style.background="#187de4"} onMouseLeave={e=>e.currentTarget.style.background="#3699ff"}>
            {registerLabel || "Register"}
          </button>
        )}
      </nav>

      {/* Hero banner — full width */}
      <div style={{ background:gradients[si], padding:"40px 48px 48px" }}>
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
          <h1 style={{ margin:"0 0 14px", fontSize:34, fontWeight:900, color:"#fff", lineHeight:1.2, maxWidth:680 }}>{session.title}</h1>
          <p style={{ margin:"0 0 20px", fontSize:14, color:"rgba(255,255,255,0.8)", lineHeight:1.7, maxWidth:600 }}>{session.description}</p>
          {/* Stats */}
          <div style={{ display:"flex", gap:32, alignItems:"center", marginBottom:20, flexWrap:"wrap" }}>
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
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"40px 48px", display:"grid", gridTemplateColumns:"1fr 340px", gap:40, alignItems:"start" }}>

        {/* Left: about + curriculum */}
        <div>
          {/* About instructor */}
          <div style={{ marginBottom:40 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#9a9bb0", letterSpacing:1, marginBottom:18 }}>ABOUT THE INSTRUCTOR</div>
            {/* Instructor header row */}
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
              <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#3699ff,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ fontSize:16, fontWeight:900, color:"#fff", letterSpacing:-0.5 }}>
                  {session.instructor?.split(" ").map(w=>w[0]).slice(0,2).join("")}
                </span>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:800, fontSize:16, color:"#181c32", lineHeight:1.2 }}>{session.instructor}</div>
                <div style={{ fontSize:12, color:"#9a9bb0", marginTop:2 }}>Special Education Specialist</div>
              </div>
              {/* Social handles */}
              <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                {[
                  { label:"LinkedIn", color:"#0a66c2",
                    svg:<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                  { label:"Twitter",  color:"#000",
                    svg:<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.732-8.855L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                  { label:"Website",  color:"#5e6278",
                    svg:<svg width="11" height="11" viewBox="0 0 256 256" fill="currentColor"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm87.63,96H175.8c-1.42-28.1-10.6-54.2-25.8-74.11A88.17,88.17,0,0,1,215.63,120ZM128,216c-19.27,0-37.07-28.68-39.73-72h79.46C165.07,187.32,147.27,216,128,216Zm-39.73-88C90.93,84.68,108.73,56,128,56s37.07,28.68,39.73,72ZM105.93,45.89C90.73,65.8,81.55,91.9,80.13,120H40.37A88.17,88.17,0,0,1,105.93,45.89ZM40.37,136H80.13c1.42,28.1,10.6,54.2,25.8,74.11A88.17,88.17,0,0,1,40.37,136Zm109.77,74.11c15.2-19.91,24.38-46,25.8-74.11h39.76A88.17,88.17,0,0,1,150.14,210.11Z"/></svg> },
                ].map(s => (
                  <button key={s.label}
                    style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, fontWeight:600, color:s.color, background:"none", border:`1px solid ${s.color}33`, borderRadius:20, padding:"3px 10px", cursor:"pointer" }}>
                    <span style={{ color:s.color, display:"flex", alignItems:"center" }}>{s.svg}</span>{s.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Bio paragraphs */}
            <div style={{ fontSize:14, color:"#3d3d4e", lineHeight:1.75 }}>
              {(session.instructorBio || "Expert instructor at SPED Summit with years of experience in special education.").split("\n\n").map((para, i) => (
                <p key={i} style={{ margin:"0 0 12px" }}>{para}</p>
              ))}
            </div>
          </div>

          {/* Curriculum */}
          <div style={{ fontSize:12, fontWeight:700, color:"#181c32", letterSpacing:.5, marginBottom:16 }}>COURSE CURRICULUM</div>
          <div style={{ fontSize:14, color:"#5e6278", marginBottom:20 }}>
            {sections.length} sections · {session.lessons.length} lessons · {session.duration} total
          </div>
          <div style={{ border:"1px solid #e4e6ef", borderRadius:14, overflow:"hidden" }}>
            {sections.map((sec, si) => {
              const key = `s${si}`;
              const collapsed = collapsedSections[key];
              const secResources = (SESSION_RESOURCES[session.id] || {})[sec.title] || [];
              return (
                <div key={key} style={{ borderBottom: si < sections.length-1 ? "1px solid #e4e6ef" : "none" }}>
                  {/* Section header */}
                  <button onClick={() => setCollapsedSections(s=>({...s,[key]:!s[key]}))}
                    style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", background:"#f9fafb", border:"none", cursor:"pointer", textAlign:"left", gap:8 }}>
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
                          <div key={String(l.id)} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 20px", borderTop:"1px solid #f3f4f6",
                            background: isFree ? "#f0f7ff" : "#fff" }}>
                            {/* Phosphor icon instead of plain circle */}
                            <div style={{ width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                              <Icon name={isQuiz ? "article" : "play-circle"} size={20} color={isQuiz ? "#a855f7" : "#9ca3af"}/>
                            </div>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:14, color:"#181c32", lineHeight:1.4 }}>{l.title}</div>
                              <div style={{ fontSize:12, color: isQuiz?"#a855f7":"#9ca3af", marginTop:2 }}>
                                {isQuiz ? `${l.questions} question${l.questions!==1?"s":""}` : <LessonDuration vimeoUrl={l.vimeoUrl || session.vimeoUrl} fallback={l.duration}/>}
                              </div>
                            </div>
                            {isFree && (
                              <span onClick={() => setPreviewOpen(true)}
                                style={{ fontSize:12, fontWeight:600, color:"#3699ff", background:"#e1f0ff", borderRadius:6, padding:"2px 8px", flexShrink:0, cursor:"pointer" }}>
                                Preview
                              </span>
                            )}
                            {!isFree && <Icon name="lock" size={13} color="#d1d5db"/>}
                          </div>
                        );
                      })}
                      {secResources.map(r => {
                        const tc = r.type==="PDF"?{c:"#dc2626",b:"#fef2f2"}:r.type==="PPTX"?{c:"#ea580c",b:"#fff7ed"}:r.type==="ZIP"?{c:"#7c3aed",b:"#f5f3ff"}:{c:"#3699ff",b:"#e1f0ff"};
                        const rIcon = r.type==="PDF" ? "file-pdf" : r.type==="PPTX" ? "article" : r.type==="ZIP" ? "paperclip" : "paperclip";
                        return (
                          <div key={r.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 20px", borderTop:"1px solid #f3f4f6", background:"#fff" }}>
                            <div style={{ width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                              <Icon name={rIcon} size={18} color={tc.c}/>
                            </div>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:14, color:"#181c32" }}>{r.title}</div>
                              <div style={{ display:"flex", gap:6, alignItems:"center", marginTop:2 }}>
                                <span style={{ fontSize:12, fontWeight:700, color:tc.c, background:tc.b, borderRadius:4, padding:"1px 5px" }}>{r.type}</span>
                                <span style={{ fontSize:12, color:"#9ca3af" }}>{r.size}</span>
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
            <div style={{ display:"flex", gap:32, alignItems:"center", marginBottom:28, padding:24, borderRadius:16, border:"1px solid #e4e6ef", background:"#fafafa" }}>
              {/* Big number */}
              <div style={{ textAlign:"center", flexShrink:0 }}>
                <div style={{ fontSize:56, fontWeight:900, color:"#181c32", lineHeight:1 }}>4.8</div>
                <div style={{ fontSize:12, color:"#5e6278", marginTop:4 }}>out of 5</div>
                <div style={{ display:"flex", gap:2, justifyContent:"center", marginTop:6 }}>
                  {[1,2,3,4,5].map(i => (
                    <Icon key={i} name="star" size={14} color={i<=4?"#f59e0b":"#e4e6ef"}/>
                  ))}
                </div>
                <div style={{ fontSize:12, color:"#9ca3af", marginTop:4 }}>3,148 ratings</div>
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
              { name:"Maria Gonzalez",   role:"Special Ed Teacher",            rating:5, date:"Mar 18, 2025", text:"Absolutely loved this session. The strategies were practical and immediately applicable in my classroom. Highly recommend to any SPED educator." },
              { name:"Jordan Brooks",    role:"Resource Room Specialist",       rating:5, date:"Mar 10, 2025", text:"The quality of instruction is outstanding. I learned strategies I hadn't encountered in years of professional development." },
              { name:"Alex Reinholt",    role:"Learning & Development Manager", rating:4, date:"Feb 28, 2025", text:"Very informative overall. Covers the 'what' and 'why' well — would love a deeper dive into the 'how' in a follow-up session." },
              { name:"Priya Nair",       role:"Curriculum Coordinator",         rating:5, date:"Feb 14, 2025", text:"Engaging content, well-paced, and the instructor's passion really comes through. Worth every minute." },
            ].map((r, i) => (
              <div key={i} style={{ padding:"20px 0", borderBottom: i < 3 ? "1px solid #f3f4f6" : "none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                  <div style={{ width:40, height:40, borderRadius:"50%", background:`hsl(${i*67},60%,55%)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ fontSize:16, fontWeight:800, color:"#fff" }}>{r.name[0]}</span>
                  </div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:"#181c32" }}>{r.name}</div>
                    <div style={{ fontSize:12, color:"#9ca3af" }}>{r.role}</div>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                  <div style={{ display:"flex", gap:2 }}>
                    {[1,2,3,4,5].map(s => (
                      <Icon key={s} name="star" size={13} color={s<=r.rating?"#f59e0b":"#e4e6ef"}/>
                    ))}
                  </div>
                  <span style={{ fontSize:12, color:"#9ca3af" }}>{r.date}</span>
                </div>
                <div style={{ fontSize:14, color:"#374151", lineHeight:1.65 }}>{r.text}</div>
                <div style={{ display:"flex", gap:16, marginTop:10 }}>
                  {["Helpful","Report"].map(action => (
                    <button key={action} style={{ background:"none", border:"none", fontSize:12, color:"#5e6278", cursor:"pointer", fontWeight:500, padding:0, display:"flex", alignItems:"center", gap:4 }}
                      onMouseEnter={e=>e.currentTarget.style.color="#181c32"} onMouseLeave={e=>e.currentTarget.style.color="#5e6278"}>
                      <Icon name={action==="Helpful"?"thumbs-up":"flag"} size={13} color="#9ca3af"/>
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: single unified sticky card */}
        <div style={{ position:"sticky", top:76 }}>
          <div style={{ border:"1px solid #e4e6ef", borderRadius:16, overflow:"hidden", boxShadow:"0 4px 24px rgba(0,0,0,0.08)" }}>
            {/* Preview thumbnail */}
            <div style={{ height:150, position:"relative", overflow:"hidden" }}>
              <SessionThumb id={session.id} height={150} noPlayHover/>
            </div>
            <div style={{ padding:20 }}>
              {/* Stats */}
              <div style={{ display:"flex", gap:0, marginBottom:18, borderRadius:10, border:"1px solid #f0e8df", overflow:"hidden" }}>
                {[
                  { val:"4.8", icon:<Icon name="star" size={12} color="#f59e0b"/>, sub:"ratings", valColor:"#b45309" },
                  { val:"1,240", sub:"Students", valColor:"#181c32" },
                  { val:session.duration, sub:"Total", valColor:"#181c32" },
                ].map((s,i) => (
                  <div key={i} style={{ flex:1, textAlign:"center", padding:"10px 4px", borderRight: i<2?"1px solid #f0e8df":"none" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:3, fontSize:16, fontWeight:800, color:s.valColor }}>{s.val}{s.icon}</div>
                    <div style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>{s.sub}</div>
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
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, fontSize:13, color:"#374151", background:"#fff7ed", border:"1px solid #fed7aa", borderRadius:10, padding:"10px 16px" }}>
                      <Icon name="timer" size={14} color="#f97316"/>
                      Starting in <span style={{ fontWeight:700, color:"#f97316" }}>{countdownLabel}</span>
                    </div>
                  ) : (
                    <button onClick={onBack} style={{ width:"100%", padding:"11px 0", background:"#3699ff", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}>
                      Go to My Sessions
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <button onClick={handleRegister}
                    style={{ width:"100%", padding:"13px 0", background:"#3699ff", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:800, cursor:"pointer", marginBottom:8 }}
                    onMouseEnter={e=>e.currentTarget.style.background="#187de4"} onMouseLeave={e=>e.currentTarget.style.background="#3699ff"}>
                    {registerLabel || "Register"}
                  </button>
                  <div style={{ fontSize:12, textAlign:"center", color:"#9ca3af", marginBottom:10 }}>No credit card required</div>
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
                    <Icon name={item.icon} size={13} color="#3699ff"/>
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
        <div style={{ height:6, background:"#f1f0ef", borderRadius:3, overflow:"hidden" }}>
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
      <div style={{ height:4, background:"#f1f0ef", borderRadius:2, overflow:"hidden", marginBottom:18 }}>
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
            background: opt.correct ? "#8a46ff" : "#f1f0ef",
            color:      opt.correct ? "#fff"    : T.muted }}>{opt.label}</span>
          <span style={{ fontSize:13, color: opt.correct ? "#7c3aed" : T.text, fontWeight: opt.correct ? 600 : 400 }}>{opt.text}</span>
          {opt.correct && <Icon name="check-circle" size={15} color="#8a46ff" style={{ marginLeft:"auto" }}/>}
        </div>
      ))}
    </div>
  );
}

// Fixed card dimensions — every card shares these so the stack is uniform
const CARD_W = 340;
const CARD_H = 440;
const CARD_STYLE_BASE = {
  width: CARD_W, height: CARD_H,
  background: "#fff", borderRadius: 18,
  border: "1px solid #e5e7eb",
  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
  overflow: "hidden",
  display: "flex", flexDirection: "column",
};

function HeroCardStack({ T }) {
  const CARDS = [
    {
      id: "watch",
      render: () => (
        <div style={{ ...CARD_STYLE_BASE, padding: 24 }}>
          {/* header */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, flexShrink:0 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#6366f1,#8a46ff)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Icon name="play-circle" size={20} color="#fff"/>
            </div>
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:"#8a46ff", letterSpacing:.5, textTransform:"uppercase" }}>Now Playing</div>
              <div style={{ fontSize:14, fontWeight:700, color:T.text, lineHeight:1.3 }}>Mindfulness for SPED Educators</div>
            </div>
          </div>
          {/* thumbnail — flex-grows to fill remaining space */}
          <div style={{ flex:1, borderRadius:12, overflow:"hidden", marginBottom:14 }}>
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=300&fit=crop&auto=format" alt="Session" style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 15%", display:"block" }}/>
          </div>
          {/* instructor row */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10, flexShrink:0 }}>
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&auto=format" alt="" style={{ width:26, height:26, borderRadius:"50%", objectFit:"cover" }}/>
            <span style={{ fontSize:12, color:T.muted }}>Tara Roehl · 45 min</span>
          </div>
          {/* progress */}
          <div style={{ flexShrink:0 }}>
            <div style={{ height:5, background:"#e5e7eb", borderRadius:99, overflow:"hidden", marginBottom:4 }}>
              <div style={{ width:"62%", height:"100%", background:"linear-gradient(90deg,#6366f1,#8a46ff)", borderRadius:99 }}/>
            </div>
            <div style={{ fontSize:11, color:T.muted }}>62% complete</div>
          </div>
        </div>
      )
    },
    {
      id: "quiz",
      render: () => (
        <div style={{ ...CARD_STYLE_BASE, padding: 24 }}>
          {/* header */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, flexShrink:0 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#0ea5e9,#6366f1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Icon name="question" size={20} color="#fff"/>
            </div>
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:"#0ea5e9", letterSpacing:.5, textTransform:"uppercase" }}>Knowledge Check</div>
              <div style={{ fontSize:14, fontWeight:700, color:T.text }}>Question 2 of 5</div>
            </div>
          </div>
          {/* question */}
          <div style={{ fontSize:15, fontWeight:700, color:T.text, marginBottom:18, lineHeight:1.5, flexShrink:0 }}>
            Which technique helps regulate the nervous system before class?
          </div>
          {/* answers — flex:1 to fill */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", gap:10 }}>
            {[
              { label:"Box breathing exercises", correct:true  },
              { label:"Checking emails quickly", correct:false },
              { label:"Skipping your morning coffee", correct:false },
              { label:"Reviewing your lesson plan", correct:false },
            ].map((opt, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px", borderRadius:12, background: opt.correct ? "rgba(16,185,129,0.08)" : "#f9fafb", border: opt.correct ? "1.5px solid rgba(16,185,129,0.4)" : "1.5px solid #e5e7eb" }}>
                <div style={{ width:18, height:18, borderRadius:"50%", flexShrink:0, background: opt.correct ? "#10b981" : "#e5e7eb", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {opt.correct && <Icon name="check" size={10} color="#fff"/>}
                </div>
                <span style={{ fontSize:13, color: opt.correct ? "#059669" : T.muted, fontWeight: opt.correct ? 600 : 400 }}>{opt.label}</span>
              </div>
            ))}
          </div>
          {/* score */}
          <div style={{ marginTop:14, fontSize:12, color:"#10b981", fontWeight:700, display:"flex", alignItems:"center", gap:5, flexShrink:0 }}>
            <Icon name="check-circle" size={13} color="#10b981"/> Correct! · Score: 92%
          </div>
        </div>
      )
    },
    {
      id: "cert",
      render: () => (
        <div style={{ ...CARD_STYLE_BASE, padding: 32, alignItems:"center", justifyContent:"center", textAlign:"center" }}>
          {/* badge */}
          <div style={{ width:72, height:72, borderRadius:22, background:"linear-gradient(135deg,#8a46ff,#e83e8c)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18, flexShrink:0 }}>
            <Icon name="certificate" size={36} color="#fff"/>
          </div>
          <div style={{ fontSize:10, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:1.5, marginBottom:10, flexShrink:0 }}>Certificate of Completion</div>
          <div style={{ fontSize:26, fontWeight:800, color:T.text, letterSpacing:-.5, marginBottom:6, flexShrink:0 }}>Sarah Johnson</div>
          <div style={{ fontSize:13, color:T.muted, lineHeight:1.7, marginBottom:24, flexShrink:0 }}>
            Successfully completed all 9 sessions of<br/>
            <strong style={{ color:T.text }}>SPED Summit 2026</strong>
          </div>
          <div style={{ width:"100%", background:"rgba(99,102,241,0.06)", border:"1px solid rgba(99,102,241,0.2)", borderRadius:14, padding:"14px 16px", marginBottom:20, flexShrink:0 }}>
            {["9 sessions watched","All quizzes passed","Certificate issued Jan 2026"].map((s,i)=>(
              <div key={i} style={{ fontSize:12, color:"#6366f1", fontWeight:600, display:"flex", alignItems:"center", gap:6, marginBottom:i<2?6:0 }}>
                <Icon name="check-circle" size={12} color="#6366f1"/> {s}
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:8, width:"100%", flexShrink:0 }}>
            <button style={{ flex:1, padding:"11px 0", background:"#6366f1", color:"#fff", border:"none", borderRadius:10, fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              <Icon name="download" size={13} color="#fff"/> Download
            </button>
            <button style={{ flex:1, padding:"11px 0", background:"#f9fafb", color:T.text, border:`1px solid ${T.border}`, borderRadius:10, fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              <Icon name="share-network" size={13} color={T.text}/> Share
            </button>
          </div>
        </div>
      )
    },
    {
      id: "win",
      render: () => (
        <div style={{ ...CARD_STYLE_BASE, padding: 28, alignItems:"center", justifyContent:"center", textAlign:"center" }}>
          {/* trophy */}
          <div style={{ width:72, height:72, borderRadius:22, background:"linear-gradient(135deg,#f59e0b,#f97316)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18, flexShrink:0 }}>
            <Icon name="trophy" size={36} color="#fff"/>
          </div>
          <div style={{ fontSize:20, fontWeight:800, color:T.text, marginBottom:8, letterSpacing:-.3, flexShrink:0 }}>You're in the Draw!</div>
          <div style={{ fontSize:13, color:T.muted, lineHeight:1.7, marginBottom:22, flexShrink:0 }}>
            Your certificate entered you in the <strong style={{ color:T.text }}>Ablespace Pro</strong> prize draw.<br/>Good luck! 🎉
          </div>
          {/* checklist */}
          <div style={{ width:"100%", background:"rgba(245,158,11,0.07)", border:"1px solid rgba(245,158,11,0.25)", borderRadius:14, padding:"16px 18px", textAlign:"left", marginBottom:20, flexShrink:0 }}>
            {["Watch all 9 expert sessions ✓","Pass every knowledge check ✓","Certificate = your entry ticket ✓"].map((s,i)=>(
              <div key={i} style={{ fontSize:13, color:"#92400e", fontWeight:600, marginBottom:i<2?10:0 }}>{s}</div>
            ))}
          </div>
          {/* draw info strip */}
          <div style={{ width:"100%", background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:12, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
            <div style={{ textAlign:"left" }}>
              <div style={{ fontSize:11, color:T.muted, fontWeight:500 }}>Draw date</div>
              <div style={{ fontSize:13, fontWeight:700, color:T.text }}>Jan 31, 2026</div>
            </div>
            <div style={{ width:1, height:32, background:T.border }}/>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:11, color:T.muted, fontWeight:500 }}>Winners</div>
              <div style={{ fontSize:13, fontWeight:700, color:T.text }}>Multiple</div>
            </div>
          </div>
        </div>
      )
    },
  ];

  const [cards, setCards] = useState(CARDS);

  const moveToEnd = (idx) => setCards(prev => [...prev.slice(idx + 1), prev[idx]]);

  useEffect(() => {
    const t = setInterval(() => moveToEnd(0), 3500);
    return () => clearInterval(t);
  }, []);

  // Back cards fan DOWNWARD — like a physical deck on a table
  // i=0 is front (highest zIndex), i=1,2,3 peek below it
  const OFFSET   = 18;   // px each card shifts down
  const SCALE_S  = 0.055; // scale shrinks per step
  const spring = { type:"spring", stiffness:160, damping:24 };

  // Container height = card height + total bottom peek of all back cards
  const containerH = CARD_H + OFFSET * (cards.length - 1);

  return (
    <div style={{ display:"flex", justifyContent:"center", paddingTop:16, paddingBottom:64 }}>
      <div style={{ position:"relative", width:CARD_W, height:containerH }}>
        {/* Render back-to-front so front card sits on top visually */}
        {[...cards].reverse().map(({ id, render }, ri) => {
          const i = cards.length - 1 - ri; // real depth index (0=front)
          return (
            <motion.div
              key={id}
              style={{
                position:"absolute", left:0,
                width:"100%", height:CARD_H,
                cursor: i === 0 ? "grab" : "default",
                userSelect:"none",
              }}
              animate={{
                top: i * OFFSET,                                   // back cards shift DOWN
                scale: 1 - i * SCALE_S,                            // back cards shrink
                filter: `brightness(${Math.max(0.55, 1 - i * 0.15)})`, // back cards dim
                zIndex: cards.length - i,                          // front = highest zIndex
              }}
              transition={spring}
              drag={i === 0 ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragMomentum={false}
              onDragEnd={() => moveToEnd(0)}
              whileDrag={{ rotate: -2, scale: 1.02, zIndex: 99 }}
            >
              {render()}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function LandingPage({ onGetStarted }) {
  const [showAuth, setShowAuth] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [faqOpen, setFaqOpen] = useState(null);
  const [scheduleTab, setScheduleTab] = useState("upcoming");
  const [instructorPage, setInstructorPage] = useState(0);
  const [testimonialPage, setTestimonialPage] = useState(0);
  const [heroTab, setHeroTab] = useState("watch");
  const heroMouseX = useMotionValue(0);
  const heroMouseY = useMotionValue(0);
  const [heroMaskCx, setHeroMaskCx] = useState("50%");
  const [heroMaskCy, setHeroMaskCy] = useState("50%");
  useEffect(()=>{
    const un = heroMouseX.on("change", v => {
      setHeroMaskCx(`${(v / window.innerWidth * 100).toFixed(1)}%`);
    });
    return un;
  },[heroMouseX]);
  useEffect(()=>{
    const un = heroMouseY.on("change", v => {
      setHeroMaskCy(`${(v / window.innerHeight * 100).toFixed(1)}%`);
    });
    return un;
  },[heroMouseY]);
  const [navOpen, setNavOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

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

  const experts = [
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
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  const testimonials = [
    { stars:5, text:"SPED Summit gave me the practical tools I could use in my classroom the very next day. The sessions are so mindful and packed with the right content.", name:"Maria Gonzalez", role:"Special Ed Teacher", img:"https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=80&h=80&fit=crop&auto=format" },
    { stars:5, text:"The quality of speakers is outstanding. I learned strategies for supporting DHH students that I had not encountered in years of professional development.", name:"Jordan Brooks", role:"Resource Room Specialist", img:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format" },
    { stars:5, text:"The AAC module changed how I work with my non-verbal students. Practical, research-backed, and delivered by someone who truly understands the classroom.", name:"Priya Nair", role:"AAC Specialist, BCBA", img:"https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=80&h=80&fit=crop&auto=format" },
    { stars:5, text:"I loved how each session was structured — easy to follow, visually clear, and immediately applicable. This is the PD I have always wished existed.", name:"Devon Castillo", role:"Inclusion Facilitator", img:"https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&h=80&fit=crop&auto=format" },
  ];

  const faqs = [
    { q:"Is SPED Summit completely free?",               a:"SPED Summit is free to join. The core sessions and community are available at no cost. A Plus plan unlocks certificates and premium content." },
    { q:"Can I rewatch if I am unable to attend live?",  a:"Yes! All sessions are recorded and available on demand so you can watch at your own pace." },
    { q:"How will I get the Completion Certificate?",    a:"After completing all sessions and passing the assessments, a downloadable certificate is automatically generated for you." },
    { q:"Can I retake quizzes if I don't pass?",         a:"Absolutely. You can retake any quiz as many times as needed until you feel confident." },
    { q:"What topics are covered at SPED Summit?",       a:"We cover mindfulness, inclusion, AAC, behavior strategies, AI in SPED, literacy, IEP planning, and much more." },
  ];

  useEffect(()=>{
    const TABS = ["watch","quiz","cert","win"];
    const t = setTimeout(()=>setHeroTab(cur=>TABS[(TABS.indexOf(cur)+1)%TABS.length]),4000);
    return ()=>clearTimeout(t);
  },[heroTab]);

  if (selectedInstructor) {
    const instr = selectedInstructor;
    const paras = instr.bio.split("\n\n");
    return (
      <div style={{ minHeight:"100vh", fontFamily:"Inter,'Segoe UI',system-ui,sans-serif", background:"#fff", color:"#37352f" }}>
        {/* Nav */}
        <nav style={{ position:"sticky", top:0, zIndex:100, background:"rgba(255,255,255,0.95)", backdropFilter:"blur(8px)", borderBottom:"1px solid rgba(55,53,47,0.09)", height:60, display:"flex", alignItems:"center", padding:"0 24px" }}>
          <div style={{ maxWidth:1024, margin:"0 auto", width:"100%", display:"flex", alignItems:"center" }}>
            <button onClick={()=>{ setSelectedInstructor(null); window.scrollTo(0,0); }}
              style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", fontSize:14, color:"#787774", cursor:"pointer", padding:"4px 8px", borderRadius:6, transition:"background .12s, color .12s" }}
              onMouseEnter={e=>{ e.currentTarget.style.background="rgba(55,53,47,0.06)"; e.currentTarget.style.color="#37352f"; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="none"; e.currentTarget.style.color="#787774"; }}>
              <Icon name="arrow-left" size={16} color="currentColor"/>
              Back
            </button>
          </div>
        </nav>

        <div style={{ maxWidth:1024, margin:"0 auto", padding:"64px 24px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"start" }}>
          {/* Left: Instructor bio */}
          <div>
            {/* Header */}
            <div style={{ display:"flex", alignItems:"flex-start", gap:20, marginBottom:32 }}>
              <div style={{ width:120, height:120, borderRadius:16, overflow:"hidden", flexShrink:0, background:"#f1f0ef" }}>
                <img src={instr.img} alt={instr.name} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 20%", display:"block" }}/>
              </div>
              <div style={{ paddingTop:4 }}>
                <h1 style={{ margin:"0 0 6px", fontSize:28, fontWeight:700, color:"#37352f", letterSpacing:-.5 }}>{instr.name}</h1>
                <p style={{ margin:"0 0 4px", fontSize:15, color:"#787774" }}>{instr.role}</p>
                <p style={{ margin:0, fontSize:13, color:"#787774" }}>{instr.org}</p>
              </div>
            </div>
            {/* Bio paragraphs */}
            <div style={{ borderTop:"1px solid rgba(55,53,47,0.09)", paddingTop:28 }}>
              {paras.map((p,i)=>(
                <p key={i} style={{ margin:"0 0 20px", fontSize:15, color:"#37352f", lineHeight:1.75 }}>{p}</p>
              ))}
            </div>
          </div>

          {/* Right: Session info */}
          <div style={{ paddingTop:8 }}>
            <p style={{ margin:"0 0 8px", fontSize:13, fontWeight:600, color:"#0070d7", letterSpacing:.5, textTransform:"uppercase" }}>Session</p>
            <h2 style={{ margin:"0 0 16px", fontSize:28, fontWeight:700, color:"#37352f", letterSpacing:-.5, lineHeight:1.2 }}>{instr.session}</h2>
            <p style={{ margin:"0 0 24px", fontSize:15, color:"#787774", lineHeight:1.7 }}>{instr.sessionDesc}</p>

            <p style={{ margin:"0 0 14px", fontSize:14, color:"#37352f", fontWeight:500 }}>In this session:</p>
            <ul style={{ margin:"0 0 36px", padding:0, listStyle:"none", display:"flex", flexDirection:"column", gap:12 }}>
              {instr.highlights.map((h,i)=>(
                <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, fontSize:14, color:"#37352f", lineHeight:1.6 }}>
                  <span style={{ color:"#8a46ff", fontWeight:700, flexShrink:0, marginTop:1 }}>•</span>
                  {h}
                </li>
              ))}
            </ul>

            <button onClick={()=>setShowAuth(true)}
              style={{ padding:"0 20px", height:40, background:"#0070d7", color:"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:600, cursor:"pointer", transition:"background .12s" }}
              onMouseEnter={e=>e.currentTarget.style.background="#005bb5"}
              onMouseLeave={e=>e.currentTarget.style.background="#0070d7"}>
              Register for this session
            </button>
          </div>
        </div>
        {showAuth && <AuthModal onClose={()=>setShowAuth(false)} onLogin={()=>onGetStarted(null)}/>}
      </div>
    );
  }

  if (selectedSession) {
    const _pastIds = new Set([1,2,3,4]); // sessions in the "past" schedule tab
    const _isPastSession = _pastIds.has(selectedSession.id);
    return (
      <>
        <SessionPublicPage
          session={selectedSession}
          onBack={() => setSelectedSession(null)}
          onRegister={() => setShowAuth(true)}
          registerLabel={_isPastSession ? "View Recording" : "Register"}
        />
        {showAuth && <AuthModal onClose={()=>setShowAuth(false)} onLogin={()=>onGetStarted(selectedSession?.id)}/>}
      </>
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
  const allSessions = SESSIONS.filter(s => !isSessionArchived(s.id));

  const T = {
    bg:       "#ffffff",
    text:     "#1e293b",
    muted:    "#6b7280",
    border:   "#e5e7eb",
    hover:    "#f3f4f6",
    blue:     "#6366f1",
    blueHov:  "#4f46e5",
    pink:     "#818cf8",
  };

  return (
    <div style={{ minHeight:"100vh", fontFamily:"Inter,'Segoe UI',system-ui,sans-serif", background:T.bg, overflowX:"clip", color:T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        a { text-decoration: none; color: inherit; }
      `}</style>

      {/* ── Nav ── */}
      <header style={{ position:"sticky", top:0, zIndex:100, width:"100%", borderBottom: navScrolled ? `1px solid ${T.border}` : "1px solid transparent", background: navScrolled ? "rgba(255,255,255,0.95)" : "transparent", backdropFilter: navScrolled ? "blur(12px)" : "none", transition:"background 0.2s, border-color 0.2s, backdrop-filter 0.2s" }}>
        <nav style={{ maxWidth:1024, margin:"0 auto", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px" }}>
          <div style={{ display:"flex", alignItems:"center", cursor:"pointer", borderRadius:8, padding:"6px 8px", transition:"background .12s" }}
            onClick={()=>window.scrollTo({ top:0, behavior:"smooth" })}
            onMouseEnter={e=>e.currentTarget.style.background=T.hover}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <img src="/Container.png" alt="SPED Summit" style={{ height:26, width:"auto", display:"block" }}/>
          </div>
          {/* Desktop links */}
          <div style={{ display:"flex", alignItems:"center", gap:4 }} className="v1-nav-desktop">
            {[["Sessions","sessions"],["Instructors","instructors"],["FAQ","help"]].map(([l,id])=>(
              <button key={l} onClick={()=>document.getElementById(id)?.scrollIntoView({ behavior:"smooth" })}
                style={{ background:"none", border:"none", fontSize:14, color:T.muted, fontWeight:500, cursor:"pointer", padding:"6px 14px", borderRadius:8, height:36, transition:"background .12s, color .12s" }}
                onMouseEnter={e=>{ e.currentTarget.style.background=T.hover; e.currentTarget.style.color=T.text; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="none"; e.currentTarget.style.color=T.muted; }}>{l}</button>
            ))}
            <button onClick={()=>setShowAuth(true)}
              style={{ marginLeft:8, padding:"0 16px", height:36, background:T.blue, color:"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:600, cursor:"pointer", transition:"background .12s" }}
              onMouseEnter={e=>e.currentTarget.style.background=T.blueHov}
              onMouseLeave={e=>e.currentTarget.style.background=T.blue}>
              Get started free
            </button>
          </div>
          {/* Mobile hamburger */}
          <button onClick={()=>setNavOpen(o=>!o)} className="v1-nav-hamburger"
            style={{ display:"none", alignItems:"center", justifyContent:"center", width:36, height:36, borderRadius:8, border:`1px solid ${T.border}`, background:"#fff", cursor:"pointer", color:T.text }}>
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transition:"transform 300ms ease-in-out", transform: navOpen ? "rotate(-45deg)" : "rotate(0deg)" }}>
              <path d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
                style={{ transition:"stroke-dasharray 300ms ease-in-out, stroke-dashoffset 300ms ease-in-out", strokeDasharray: navOpen ? "20 300" : "12 63", strokeDashoffset: navOpen ? "-32.42px" : "0" }}/>
              <path d="M7 16 27 16"/>
            </svg>
          </button>
        </nav>
        <style>{`
          @media (max-width: 767px) { .v1-nav-hamburger { display: flex !important; } .v1-nav-desktop { display: none !important; } }
          @media (min-width: 768px) { .v1-nav-hamburger { display: none !important; } .v1-nav-desktop { display: flex !important; } }
        `}</style>
      </header>
      {/* Mobile menu portal */}
      {navOpen && createPortal(
        <div style={{ position:"fixed", top:56, left:0, right:0, bottom:0, zIndex:99, background:"rgba(255,255,255,0.97)", backdropFilter:"blur(12px)", borderTop:`1px solid ${T.border}`, display:"flex", flexDirection:"column", padding:"16px 24px 32px" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:4, flex:1 }}>
            {[["Sessions","sessions"],["Instructors","instructors"],["FAQ","help"]].map(([l,id])=>(
              <button key={l} onClick={()=>{ document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); setNavOpen(false); }}
                style={{ background:"none", border:"none", fontSize:16, color:T.text, fontWeight:600, cursor:"pointer", padding:"12px 16px", borderRadius:10, textAlign:"left", transition:"background .15s" }}
                onMouseEnter={e=>e.currentTarget.style.background=T.hover}
                onMouseLeave={e=>e.currentTarget.style.background="none"}>{l}</button>
            ))}
          </div>
          <button onClick={()=>{ setNavOpen(false); setShowAuth(true); }}
            style={{ width:"100%", padding:"14px", fontSize:15, fontWeight:700, background:T.blue, color:"#fff", border:"none", borderRadius:12, cursor:"pointer" }}>
            Get started free
          </button>
        </div>,
        document.body
      )}

      {/* ── Hero ── */}
      <section style={{ paddingTop:0, paddingBottom:72, background:T.bg, position:"relative", overflow:"hidden" }}
        onMouseMove={e=>{ heroMouseX.set(e.clientX); heroMouseY.set(e.clientY); }}>

        {/* ── Infinite grid background ── */}
        {(()=>{
          const CELL = 40;
          return (
            <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0 }} aria-hidden="true">
              <defs>
                <pattern id="hero-grid" x="0" y="0" width={CELL} height={CELL} patternUnits="userSpaceOnUse">
                  <path d={`M ${CELL} 0 L 0 0 0 ${CELL}`} fill="none" stroke={T.text} strokeWidth="0.5"/>
                </pattern>
                <radialGradient id="hero-grid-reveal" cx={heroMaskCx} cy={heroMaskCy} r="28%" gradientUnits="objectBoundingBox">
                  <stop offset="0%" stopColor="white" stopOpacity="0.07"/>
                  <stop offset="100%" stopColor="white" stopOpacity="0"/>
                </radialGradient>
                <mask id="hero-grid-mask">
                  <rect width="100%" height="100%" fill="url(#hero-grid-reveal)"/>
                </mask>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-grid)" opacity="0.04"/>
              <rect width="100%" height="100%" fill="url(#hero-grid)" mask="url(#hero-grid-mask)"/>
            </svg>
          );
        })()}

        {/* ── Text block ── */}
        <div style={{ maxWidth:780, margin:"0 auto", padding:"80px 24px 48px", textAlign:"center", position:"relative", zIndex:1 }}>

          {/* Rating badge */}
          <div className="animate-fade-in-up" style={{ opacity:0, animationDelay:"0.2s", marginBottom:24 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#f1f0ef", border:`1px solid ${T.border}`, borderRadius:8, padding:"5px 14px" }}>
              <div style={{ width:22, height:22, border:`1px solid ${T.border}`, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon name="star" size={12} color="#f59e0b"/>
              </div>
              <span style={{ fontSize:13, fontWeight:500, color:T.text }}>4.9 rating from 4,200+ educators</span>
            </div>
          </div>

          {/* Main heading */}
          <h1 className="animate-fade-in-up" style={{ opacity:0, animationDelay:"0.3s", margin:"0 0 20px", fontSize:72, fontWeight:800, color:T.text, lineHeight:1.08, letterSpacing:-3 }}>
            Watch. Learn. Earn.<br/>
            <span style={{ background:"linear-gradient(90deg,#8a46ff 0%,#c026d3 50%,#e83e8c 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              Get Certified.
            </span>
          </h1>

          {/* Sub heading */}
          <p className="animate-fade-in-up" style={{ opacity:0, animationDelay:"0.4s", margin:"0 0 32px", fontSize:18, color:T.muted, lineHeight:1.65, maxWidth:560, marginLeft:"auto", marginRight:"auto" }}>
            Expert-led SPED sessions, interactive quizzes, and real downloadable certificates — plus a chance to win an Ablespace Pro subscription.
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up" style={{ opacity:0, animationDelay:"0.5s", display:"flex", gap:12, justifyContent:"center", alignItems:"center", flexWrap:"wrap" }}>
            <button onClick={()=>setShowAuth(true)}
              style={{ padding:"0 26px", height:44, background:T.blue, color:"#fff", border:"none", borderRadius:10, fontSize:15, fontWeight:600, cursor:"pointer", transition:"background .12s" }}
              onMouseEnter={e=>e.currentTarget.style.background=T.blueHov}
              onMouseLeave={e=>e.currentTarget.style.background=T.blue}>
              Start learning — it's free
            </button>
            <button onClick={()=>document.getElementById("sessions")?.scrollIntoView({ behavior:"smooth" })}
              style={{ padding:"0 26px", height:44, background:"transparent", color:T.text, border:`1px solid rgba(55,53,47,0.2)`, borderRadius:10, fontSize:15, fontWeight:500, cursor:"pointer", transition:"background .12s" }}
              onMouseEnter={e=>e.currentTarget.style.background=T.hover}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              View sessions
            </button>
          </div>
          <p style={{ margin:"16px 0 0", fontSize:13, color:T.muted }}>No signup required to preview sessions</p>
        </div>

        {/* ── Card Stack ── */}
        <HeroCardStack T={T}/>

      </section>

      {/* ── Social proof strip ── */}
      <section style={{ borderTop:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}`, padding:"28px 24px" }}>
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

      {/* ── Stats strip ── */}
      <section style={{ padding:"40px 24px", borderBottom:`1px solid ${T.border}` }}>
        <div style={{ maxWidth:1024, margin:"0 auto", display:"flex", justifyContent:"center", gap:64, flexWrap:"wrap" }}>
          {[
            { n:"4,200+", label:"educators enrolled" },
            { n:"9",      label:"expert sessions" },
            { n:"100%",   label:"free to attend" },
            { n:"$10k+",  label:"in prizes" },
          ].map((s,i)=>(
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ fontSize:36, fontWeight:800, color:T.text, letterSpacing:-1.5, lineHeight:1 }}>{s.n}</div>
              <div style={{ fontSize:14, color:T.muted, marginTop:6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bento Features ── */}
      <section style={{ padding:"80px 24px", borderBottom:`1px solid ${T.border}`, background:"#ffffff" }}>
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
                style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gridTemplateRows:"repeat(3, minmax(160px,auto))", gap:20 }}
              >
                {/* Slot 1 — Certificate System (tall, col 1, rows 1-3) */}
                <motion.div variants={itemVariants} style={{ gridColumn:"1", gridRow:"1 / 4" }}>
                  <div style={{ ...cardBase, display:"flex", flexDirection:"column", height:"100%" }}>
                    <div style={{ padding:"24px 24px 0" }}>
                      <div style={{ width:48, height:48, borderRadius:12, background:"rgba(245,158,11,0.12)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
                        <Icon name="certificate" size={24} color="#f59e0b"/>
                      </div>
                      <div style={{ fontSize:18, fontWeight:800, color:T.text, marginBottom:8, lineHeight:1.3 }}>Instant Certificates</div>
                      <div style={{ fontSize:14, color:T.muted, lineHeight:1.65 }}>
                        Complete a session, pass the quiz, and download a verified PDF certificate — instantly. No waiting, no chasing approvals.
                      </div>
                    </div>
                    <div style={{ marginTop:"auto", padding:"0 24px 24px" }}>
                      {/* Mini certificate preview */}
                      <div style={{ marginTop:24, borderRadius:12, border:`1px solid ${T.border}`, padding:"14px 16px", background:"#fffbeb" }}>
                        <div style={{ fontSize:10, fontWeight:700, color:"#92400e", letterSpacing:1.5, textTransform:"uppercase", marginBottom:6 }}>Certificate of Completion</div>
                        <div style={{ fontSize:13, fontWeight:700, color:"#78350f", marginBottom:2 }}>Alex Johnson</div>
                        <div style={{ fontSize:11, color:"#a16207" }}>Foundations of Inclusion · SPED Summit</div>
                        <div style={{ marginTop:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <div style={{ fontSize:10, color:"#a16207" }}>Spring 2026</div>
                          <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(245,158,11,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <Icon name="check" size={13} color="#f59e0b"/>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>

                {/* Slot 2 — Learners Connected (col 2, row 1) */}
                <motion.div variants={itemVariants} style={{ gridColumn:"2", gridRow:"1" }}>
                  <div style={{ ...cardBase, padding:"22px 22px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                    <div>
                      <div style={{ fontSize:15, fontWeight:700, color:T.text, marginBottom:3 }}>Learners Connected</div>
                      <div style={{ fontSize:13, color:T.muted }}>4,200+ Active Educators</div>
                    </div>
                    <div style={{ display:"flex", marginTop:16 }}>
                      {[
                        "photo-1573497491208-6b1acb260507",
                        "photo-1531746020798-e6953c6e8e04",
                        "photo-1580489944761-15a19d654956",
                        "photo-1560250097-0b93528c311a",
                        "photo-1494790108377-be9c29b29330",
                      ].map((id, i) => (
                        <img key={i} src={`https://images.unsplash.com/${id}?w=80&h=80&fit=crop&auto=format`}
                          style={{ width:34, height:34, borderRadius:"50%", objectFit:"cover", marginLeft: i === 0 ? 0 : -10, border:"2px solid #fff", flexShrink:0 }}/>
                      ))}
                      <div style={{ width:34, height:34, borderRadius:"50%", background:"#e0e7ff", border:"2px solid #fff", marginLeft:-10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#4338ca" }}>+4k</div>
                    </div>
                  </div>
                </motion.div>

                {/* Slot 3 — Big stat (col 3, row 1) */}
                <motion.div variants={itemVariants} style={{ gridColumn:"3", gridRow:"1" }}>
                  <div style={{ ...cardBase, position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {/* Dot grid background */}
                    <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(0,0,0,0.12) 1px, transparent 1px)", backgroundSize:"16px 16px", opacity:0.5 }}/>
                    <div style={{ position:"relative", textAlign:"center" }}>
                      <div style={{ fontSize:64, fontWeight:900, color:T.text, letterSpacing:-3, lineHeight:1 }}>100%</div>
                      <div style={{ fontSize:13, color:T.muted, marginTop:4, fontWeight:500 }}>Free to attend</div>
                    </div>
                  </div>
                </motion.div>

                {/* Slot 4 — Progress (col 2, row 2) */}
                <motion.div variants={itemVariants} style={{ gridColumn:"2", gridRow:"2" }}>
                  <div style={{ ...cardBase, padding:"22px 22px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
                      <div>
                        <div style={{ fontSize:15, fontWeight:700, color:T.text, marginBottom:2 }}>Completion Rate</div>
                        <div style={{ fontSize:13, color:T.muted }}>Summit-wide average</div>
                      </div>
                      <span style={{ fontSize:11, fontWeight:700, color:"#2563eb", background:"rgba(37,99,235,0.1)", padding:"3px 9px", borderRadius:99 }}>Live</span>
                    </div>
                    <div>
                      <div style={{ fontSize:52, fontWeight:900, color:T.text, lineHeight:1, letterSpacing:-2 }}>78%</div>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:T.muted, marginTop:6 }}>
                        <span>Sessions finished</span><span>This quarter</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Slot 5 — Self-paced (col 3, row 2) */}
                <motion.div variants={itemVariants} style={{ gridColumn:"3", gridRow:"2" }}>
                  <div style={{ ...cardBase, padding:"22px 22px", display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:"rgba(16,185,129,0.1)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
                      <Icon name="play-circle" size={20} color="#10b981"/>
                    </div>
                    <div style={{ fontSize:15, fontWeight:700, color:T.text, marginBottom:6 }}>Learn at Your Pace</div>
                    <div style={{ fontSize:13, color:T.muted, lineHeight:1.55 }}>
                      All sessions recorded. Rewatch anytime, on any device.
                    </div>
                  </div>
                </motion.div>

                {/* Slot 6 — Quick Access (col 2-3, row 3) */}
                <motion.div variants={itemVariants} style={{ gridColumn:"2 / 4", gridRow:"3" }}>
                  <div style={{ ...cardBase, padding:"22px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:24, flexWrap:"wrap" }}>
                    <div>
                      <div style={{ fontSize:15, fontWeight:700, color:T.text, marginBottom:4 }}>Everything Included</div>
                      <div style={{ fontSize:13, color:T.muted }}>Sessions · Quizzes · Certificates · Community · Replays · Giveaways</div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                      {["Sessions", "Quizzes", "Certs"].map((label, i) => (
                        <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"center", height:32, padding:"0 12px", borderRadius:8, border:`1px solid ${T.border}`, background:T.bg, fontSize:12, fontWeight:600, color:T.muted }}>
                          {label}
                        </div>
                      ))}

                    </div>
                  </div>
                </motion.div>

              </motion.div>
            );
          })()}
        </div>
      </section>

      {/* ── Instructors ── */}
      <section id="instructors" style={{ padding:"80px 0", borderBottom:`1px solid ${T.border}`, overflow:"hidden", position:"relative" }}>
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
            width: 256px;
            flex-shrink: 0;
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
            /* Reveal full color on hover */
            .spk-card:hover .spk-img { filter: grayscale(0%);  }
            /* Overlay always visible, slightly more opaque on hover */
            .spk-card:hover .spk-overlay { background: rgba(245,245,245,0.92); }
          }
          .spk-card:active { transform: scale(0.97); }

          /* Full grayscale by default */
          .spk-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center 15%;
            display: block;
            filter: grayscale(100%);
            transition: filter 350ms ease, transform 400ms cubic-bezier(0.23,1,0.32,1);
          }

          /* Name/role overlay pinned to the bottom of the image */
          .spk-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 10px 14px 12px;
            background: rgba(245,245,245,0.88);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            border-radius: 0 0 20px 20px;
            transition: background 200ms ease;
          }

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
        <div style={{ "--spk-border": T.border, "--spk-bg": T.bg, "--spk-bg-fade": T.bg }}>

          {/* Header */}
          <div style={{ maxWidth:1200, margin:"0 auto 56px", padding:"0 24px", display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:12 }}>
            <p style={{ margin:0, fontSize:13, fontWeight:700, color:T.muted, letterSpacing:1, textTransform:"uppercase" }}>Speakers</p>
            <h2 style={{ margin:0, fontSize:"clamp(32px,4vw,48px)", fontWeight:900, color:T.text, letterSpacing:-1, lineHeight:1.15 }}>
              9 experts. Real strategies.
            </h2>
            <p style={{ margin:0, fontSize:16, color:T.muted, maxWidth:520, lineHeight:1.65 }}>
              People who have been there and done that — sharing practical tips you can use from the comfort of your home.
            </p>
          </div>

          {/* Marquee track */}
          <div style={{ position:"relative" }}>
            <div className="spk-fade-l"/>
            <div className="spk-fade-r"/>
            <div style={{ overflow:"hidden", padding:"8px 0 16px" }}>
              <div className="spk-track">
                {/* Duplicate cards for seamless loop */}
                {[...experts, ...experts].map((e, i) => (
                  <div key={i} className="spk-card"
                    onClick={() => { setSelectedInstructor(e); window.scrollTo(0, 0); }}>
                    {/* Full-height portrait image */}
                    <div style={{ height:"368px", overflow:"hidden" }}>
                      <img className="spk-img" src={e.img} alt={e.name}/>
                    </div>
                    {/* Name/role as overlay at bottom of image */}
                    <div className="spk-overlay">
                      <div style={{ fontWeight:700, fontSize:14, color:"#111", lineHeight:1.3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{e.name}</div>
                      <div style={{ fontSize:12, color:"#555", marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{e.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Apply banner */}
          <div style={{ maxWidth:1200, margin:"48px auto 0", padding:"0 24px" }}>
            <div style={{ borderRadius:16, border:`1px solid ${T.border}`, background:"rgba(250,250,250,1)", padding:24, display:"flex", alignItems:"center", gap:24 }}>
              <div style={{ width:56, height:56, borderRadius:12, background:"#ede9fe", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon name="student" size={28} color="#7c3aed"/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:17, color:T.text, marginBottom:4 }}>Want to share your expertise in special education?</div>
                <div style={{ fontSize:14, color:T.muted, lineHeight:1.5 }}>Apply to be a speaker at SPED Summit!</div>
              </div>
              <button onClick={()=>setShowAuth(true)}
                style={{ flexShrink:0, display:"flex", alignItems:"center", gap:8, padding:"0 20px", height:40, background:T.blue, color:"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:600, cursor:"pointer", transition:"background 150ms ease, transform 160ms cubic-bezier(0.23,1,0.32,1)", whiteSpace:"nowrap" }}
                onMouseEnter={e=>e.currentTarget.style.background=T.blueHov}
                onMouseLeave={e=>e.currentTarget.style.background=T.blue}
                onMouseDown={e=>e.currentTarget.style.transform="scale(0.97)"}
                onMouseUp={e=>e.currentTarget.style.transform=""}>
                Apply
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
              onMouseMove={e=>{ const r=ref.current.getBoundingClientRect(); setPos({ x:e.clientX-r.left, y:e.clientY-r.top }); }}
              onMouseEnter={e=>{ setOpacity(1); e.currentTarget.style.borderColor=T.border; e.currentTarget.style.boxShadow="0 4px 24px rgba(0,0,0,0.08)"; }}
              onMouseLeave={e=>{ setOpacity(0); e.currentTarget.style.borderColor=T.border; e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.04)"; }}
              style={{ position:"relative", overflow:"hidden", borderRadius:16, border:`1px solid ${T.border}`, background:"#ffffff", transition:"box-shadow 0.2s, border-color 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.04)", ...style }}
            >
              <div style={{ pointerEvents:"none", position:"absolute", inset:-1, transition:"opacity 0.3s", opacity, background:`radial-gradient(500px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 40%)`, zIndex:0 }}/>
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
          <section style={{ padding:"80px 24px", borderBottom:`1px solid ${T.border}`, background:"#ffffff" }}>
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
              <div style={{ textAlign:"center", marginTop:48 }}>
                <button onClick={()=>setShowAuth(true)}
                  style={{ padding:"12px 32px", background:T.blue, color:"#fff", border:"none", borderRadius:10, fontSize:15, fontWeight:700, cursor:"pointer", transition:"background .12s" }}
                  onMouseEnter={e=>e.currentTarget.style.background=T.blueHov}
                  onMouseLeave={e=>e.currentTarget.style.background=T.blue}>
                  Register free to enter all giveaways
                </button>
              </div>
            </div>
            <style>{`@media(max-width:900px){.giveaway-grid{grid-template-columns:repeat(2,1fr)!important}} @media(max-width:600px){.giveaway-grid{grid-template-columns:1fr!important}}`}</style>
          </section>
        );
      })()}

      {/* ── Featured Sessions ── */}
      <section id="sessions" style={{ padding:"80px 24px", borderBottom:`1px solid ${T.border}`, background:T.bg }}>
        <div style={{ maxWidth:1024, margin:"0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom:40 }}>
            <p style={{ margin:"0 0 8px", fontSize:13, fontWeight:600, color:T.muted, letterSpacing:.5, textTransform:"uppercase" }}>Upcoming Schedule</p>
            <h2 style={{ margin:0, fontSize:"clamp(28px,4vw,40px)", fontWeight:800, color:T.text, letterSpacing:-1, lineHeight:1.1 }}>Spring 2026 Sessions</h2>
            <p style={{ margin:"8px 0 0", fontSize:15, color:T.muted }}>Register for these upcoming live sessions — free for all educators.</p>
          </div>

          {/* Session cards — pixel-matched to reference design */}
          {(()=>{
            const SD = {
              5:{ date:"Apr 15", time:"09:00 AM", sessionType:"Workshop" },
              6:{ date:"Apr 15", time:"11:00 AM", sessionType:"Panel Discussion" },
            };
            /* Category badge: short topic label, amber-toned like the reference */
            const CAT_BADGE = {
              "TECHNOLOGY":    { label:"Technology",    bg:"#fef3c7", color:"#b45309" },
              "ACCESSIBILITY": { label:"Accessibility", bg:"#ede9fe", color:"#6d28d9" },
              "MANAGEMENT":    { label:"Management",    bg:"#dbeafe", color:"#1d4ed8" },
              "LEADERSHIP":    { label:"Leadership",    bg:"#d1fae5", color:"#065f46" },
              "COMMUNICATION": { label:"Communication", bg:"#fff7ed", color:"#c2410c" },
              "TEAMWORK":      { label:"Teamwork",      bg:"#fdf4ff", color:"#7e22ce" },
            };
            const INSTRUCTOR_ROLES = {
              "Dr. Emily Tran": "AI & Technology Educator",
              "Dr. Sarah Kim":  "AAC Specialist, BCBA",
            };
            const upcomingItems = SESSIONS.filter(s => SD[s.id]);
            return (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {upcomingItems.map(s => {
                  const d        = SD[s.id];
                  const catBadge = CAT_BADGE[s.category] || { label:s.category, bg:"#f3f4f6", color:"#374151" };
                  const avatarSrc= INSTRUCTOR_AVATARS[s.instructor];
                  const schedItem= SCHEDULE.find(i => i.id === s.id);
                  const ctaLabel = "Register Now";
                  const instrRole= INSTRUCTOR_ROLES[s.instructor] || "Instructor";
                  return (
                    <div key={s.id}
                      style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, display:"flex", alignItems:"stretch", overflow:"hidden", cursor:"pointer" }}
                      onClick={()=>setSelectedSession(s)}>

                      {/* ── Left: image fills full card height, name+role overlaid via gradient ── */}
                      <div style={{ flexShrink:0, width:200, position:"relative" }}>
                        <img src={avatarSrc} alt={s.instructor}
                          style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top center", display:"block" }}/>
                        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 45%, transparent 75%)" }}/>
                        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"0 10px 10px" }}>
                          <div style={{ fontSize:15, fontWeight:700, color:"#fff", lineHeight:1.25 }}>{s.instructor}</div>
                          <div style={{ fontSize:13, color:"rgba(255,255,255,0.72)", marginTop:3, lineHeight:1.3 }}>{instrRole}</div>
                        </div>
                      </div>

                      {/* ── Right: content with own padding ── */}
                      <div style={{ flex:1, minWidth:0, padding:20 }}>
                        <div style={{ marginBottom:8 }}>
                          <span style={{ display:"inline-block", fontSize:11, fontWeight:600, padding:"2px 7px", borderRadius:4, background:catBadge.bg, color:catBadge.color, letterSpacing:.2 }}>
                            {catBadge.label}
                          </span>
                        </div>
                        <div style={{ fontSize:17, fontWeight:700, color:"#111827", lineHeight:1.3, marginBottom:6 }}>{s.title}</div>
                        <div style={{ fontSize:13, fontWeight:500, color:"#374151", marginBottom:6 }}>
                          {d.sessionType} with {s.instructor} ({instrRole})
                        </div>
                        <div style={{ fontSize:12, color:"#6b7280", lineHeight:1.55, marginBottom:28, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                          {schedItem?.description || s.description}
                        </div>
                        <button
                          onClick={e=>{ e.stopPropagation(); setSelectedSession(s); }}
                          style={{ display:"inline-flex", alignItems:"center", padding:"7px 13px", background:"#6366f1", color:"#fff", border:"none", borderRadius:7, fontSize:13, fontWeight:600, cursor:"pointer", transition:"background 0.15s" }}
                          onMouseEnter={e=>e.currentTarget.style.background="#4f46e5"}
                          onMouseLeave={e=>e.currentTarget.style.background="#6366f1"}>
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
      <section style={{ padding:"80px 24px", borderBottom:`1px solid ${T.border}`, background:"#ffffff", textAlign:"center" }}>
        <div style={{ maxWidth:560, margin:"0 auto" }}>
          <p style={{ margin:"0 0 8px", fontSize:13, fontWeight:600, color:T.muted, letterSpacing:.5, textTransform:"uppercase" }}>Community</p>
          <h2 style={{ margin:"0 0 12px", fontSize:"clamp(32px,4vw,48px)", fontWeight:800, color:T.text, letterSpacing:-1, lineHeight:1.2 }}>Connect with educators across the country</h2>
          <p style={{ margin:"0 0 36px", fontSize:16, color:T.muted, lineHeight:1.6 }}>
            Stay in the loop — follow us for session updates, announcements, and community highlights.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <button style={{ display:"flex", alignItems:"center", gap:8, padding:"0 20px", height:40, background:"#1877f2", color:"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:600, cursor:"pointer", transition:"opacity .12s" }}
              onMouseEnter={e=>e.currentTarget.style.opacity=".88"}
              onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
              Join the Facebook Group
            </button>
            <button style={{ display:"flex", alignItems:"center", gap:8, padding:"0 20px", height:40, background:"linear-gradient(135deg,#e1306c,#f77737)", color:"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:600, cursor:"pointer", transition:"opacity .12s" }}
              onMouseEnter={e=>e.currentTarget.style.opacity=".88"}
              onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              Follow on Instagram
            </button>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      {(()=>{
        const ALL_T = [
          { text:"SPED Summit gave me the practical tools I could use in my classroom the very next day. The sessions are so mindful and packed with the right content.", name:"Maria Gonzalez", role:"Special Ed Teacher", img:"https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=80&h=80&fit=crop&auto=format" },
          { text:"The quality of speakers is outstanding. I learned strategies for supporting DHH students that I had not encountered in years of professional development.", name:"Jordan Brooks", role:"Resource Room Specialist", img:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format" },
          { text:"The AAC module changed how I work with my non-verbal students. Practical, research-backed, and delivered by someone who truly understands the classroom.", name:"Priya Nair", role:"AAC Specialist, BCBA", img:"https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=80&h=80&fit=crop&auto=format" },
          { text:"I loved how each session was structured — easy to follow, visually clear, and immediately applicable. This is the PD I have always wished existed.", name:"Devon Castillo", role:"Inclusion Facilitator", img:"https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&h=80&fit=crop&auto=format" },
          { text:"The IEP writing session alone was worth it. I finally have a framework I can use with confidence for every student on my caseload.", name:"Sandra Kim", role:"SPED Coordinator", img:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&auto=format" },
          { text:"I appreciated that every session was free. No hidden fees, no upsells — just incredibly valuable professional development for educators who need it.", name:"Tyrone Washington", role:"Behavior Interventionist", img:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format" },
          { text:"The certificate gave me something concrete to show my district. It opened the door to a conversation about expanding our inclusive practices school-wide.", name:"Anita Patel", role:"Instructional Coach", img:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format" },
          { text:"Watching on-demand meant I could fit it around my schedule. I finished all 9 sessions in two weeks and immediately started applying what I learned.", name:"Luke Ramirez", role:"Para-educator", img:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&auto=format" },
          { text:"The mindfulness session was transformative. I was sceptical at first, but the research-backed techniques helped me stay regulated even on the hardest days.", name:"Claire Nguyen", role:"Early Intervention Specialist", img:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format" },
        ];
        const col1 = ALL_T.slice(0,3), col2 = ALL_T.slice(3,6), col3 = ALL_T.slice(6,9);

        function TCard({ t }) {
          return (
            <motion.div
              whileHover={{ scale:1.03, y:-8, boxShadow:"0 25px 50px -12px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)", transition:{ type:"spring", stiffness:400, damping:17 } }}
              style={{ padding:32, borderRadius:24, border:`1px solid ${T.border}`, boxShadow:"0 2px 12px rgba(0,0,0,0.05)", background:"#ffffff", maxWidth:300, width:"100%", cursor:"default", userSelect:"none" }}
            >
              <p style={{ margin:"0 0 24px", fontSize:14, color:T.text, lineHeight:1.75 }}>{t.text}</p>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <img src={t.img} alt={t.name} width={40} height={40} style={{ width:40, height:40, borderRadius:"50%", objectFit:"cover", border:`2px solid ${T.border}`, flexShrink:0 }}/>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:T.text, lineHeight:1.2 }}>{t.name}</div>
                  <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          );
        }

        function TCol({ items, duration }) {
          return (
            <div style={{ overflow:"visible" }}>
              <motion.div
                animate={{ translateY:"-50%" }}
                transition={{ duration, repeat:Infinity, ease:"linear", repeatType:"loop" }}
                style={{ display:"flex", flexDirection:"column", gap:24, paddingBottom:24 }}
              >
                {[0,1].map(pass=>(
                  <div key={pass} style={{ display:"flex", flexDirection:"column", gap:24 }}>
                    {items.map((t,i)=><TCard key={`${pass}-${i}`} t={t}/>)}
                  </div>
                ))}
              </motion.div>
            </div>
          );
        }

        return (
          <section style={{ padding:"96px 24px", borderBottom:`1px solid ${T.border}` }}>
            <motion.div
              initial={{ opacity:0, y:40 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, amount:0.15 }}
              transition={{ duration:1, ease:[0.16,1,0.3,1] }}
              style={{ maxWidth:1100, margin:"0 auto" }}
            >
              {/* Header */}
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", maxWidth:540, margin:"0 auto 64px", textAlign:"center" }}>
                <p style={{ margin:"0 0 8px", fontSize:13, fontWeight:600, color:T.muted, letterSpacing:.5, textTransform:"uppercase" }}>Testimonials</p>
                <h2 style={{ margin:"0 0 16px", fontSize:"clamp(32px,4vw,48px)", fontWeight:800, color:T.text, letterSpacing:-1.5, lineHeight:1.1 }}>
                  Loved by educators
                </h2>
                <p style={{ margin:0, fontSize:17, color:T.muted, lineHeight:1.7 }}>
                  Hear from thousands of SPED educators who have already transformed their practice.
                </p>
              </div>

              {/* Scrolling columns */}
              <style>{`.tcol2{display:none} .tcol3{display:none} @media(min-width:768px){.tcol2{display:block}} @media(min-width:1024px){.tcol3{display:block}}`}</style>
              <div style={{ display:"flex", justifyContent:"center", gap:24, maxHeight:740, overflow:"hidden", WebkitMaskImage:"linear-gradient(to bottom,transparent,black 10%,black 90%,transparent)", maskImage:"linear-gradient(to bottom,transparent,black 10%,black 90%,transparent)" }}>
                <TCol items={col1} duration={15}/>
                <div className="tcol2"><TCol items={col2} duration={19}/></div>
                <div className="tcol3"><TCol items={col3} duration={17}/></div>
              </div>
            </motion.div>
          </section>
        );
      })()}

      {/* ── FAQ ── */}
      <section id="help" style={{ padding:"80px 24px", borderBottom:`1px solid ${T.border}`, background:"#ffffff" }}>
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
                <div style={{ fontSize:14, color:T.muted, lineHeight:1.7, paddingBottom:18 }}>{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background:T.bg }}>

        {/* CTA band */}
        <div style={{ padding:"80px 24px", borderBottom:`1px solid ${T.border}`, background:T.bg }}>
          <div style={{ maxWidth:1024, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", gap:40, flexWrap:"wrap" }}>
            <div style={{ flex:1, minWidth:280 }}>
              <h2 style={{ margin:"0 0 12px", fontSize:"clamp(32px,4vw,48px)", fontWeight:800, color:T.text, lineHeight:1.1, letterSpacing:-1.5 }}>
                Connect with educators<br/>across the country?
              </h2>
              <p style={{ margin:0, fontSize:16, color:T.muted, lineHeight:1.6 }}>
                Join 4,200+ educators. Free sessions, real certificates, expert instructors.
              </p>
            </div>
            <div style={{ display:"flex", gap:10, flexShrink:0 }}>
              <button onClick={()=>setShowAuth(true)}
                style={{ padding:"0 24px", height:42, background:T.blue, color:"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:600, cursor:"pointer", transition:"background .12s" }}
                onMouseEnter={e=>e.currentTarget.style.background=T.blueHov}
                onMouseLeave={e=>e.currentTarget.style.background=T.blue}>
                Start for free
              </button>
              <button onClick={()=>document.getElementById("sessions")?.scrollIntoView({ behavior:"smooth" })}
                style={{ padding:"0 24px", height:42, background:"transparent", color:T.text, border:`1px solid ${T.border}`, borderRadius:8, fontSize:14, fontWeight:500, cursor:"pointer", transition:"background .12s" }}
                onMouseEnter={e=>e.currentTarget.style.background=T.hover}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                View sessions
              </button>
            </div>
          </div>
        </div>

        {/* Footer columns */}
        <div style={{ padding:"56px 24px 48px", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ maxWidth:1024, margin:"0 auto", display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:48 }}>
            {/* Brand column */}
            <div>
              <img src="/Container.png" alt="SPED Summit" style={{ height:26, display:"block", marginBottom:16 }}/>
              <p style={{ margin:"0 0 24px", fontSize:14, color:T.muted, lineHeight:1.7, maxWidth:280 }}>
                SPED Summit is a free professional development platform for Special Education professionals — built by educators, for educators.
              </p>
              <div style={{ display:"flex", gap:10 }}>
                {[
                  { label:"YouTube",   icon:null, svg:"M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" },
                  { label:"Instagram", icon:null, svg:"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                  { label:"Facebook",  icon:null, svg:"M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" },
                ].map(({ label, icon, svg }) => (
                  <a key={label} href="#" aria-label={label}
                    style={{ width:32, height:32, borderRadius:8, border:`1px solid ${T.border}`, background:T.bg, display:"flex", alignItems:"center", justifyContent:"center", transition:"background .12s", textDecoration:"none" }}
                    onMouseEnter={e=>e.currentTarget.style.background=T.hover}
                    onMouseLeave={e=>e.currentTarget.style.background=T.bg}>
                    {icon ? <Icon name={icon} size={14} color={T.muted}/> : <svg width="14" height="14" viewBox="0 0 24 24" fill={T.muted}><path d={svg}/></svg>}
                  </a>
                ))}
              </div>
            </div>

            {/* Links columns */}
            {[
              { heading:"Platform", links:["Sessions","Instructors","Giveaways","Schedule","Community"] },
              { heading:"Company",  links:["About","Blog","Careers","Press","Contact"] },
              { heading:"Legal",    links:["Privacy Policy","Terms of Service","Cookie Policy","Accessibility"] },
            ].map(({ heading, links }) => (
              <div key={heading}>
                <div style={{ fontSize:11, fontWeight:600, color:T.muted, letterSpacing:.8, textTransform:"uppercase", marginBottom:16 }}>{heading}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {links.map(l => (
                    <a key={l} href="#" style={{ fontSize:14, color:T.muted, textDecoration:"none", transition:"color .12s" }}
                      onMouseEnter={e=>e.currentTarget.style.color=T.text}
                      onMouseLeave={e=>e.currentTarget.style.color=T.muted}>{l}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright strip */}
        <div style={{ padding:"16px 24px", display:"flex", justifyContent:"center" }}>
          <span style={{ fontSize:12, color:T.muted }}>© 2026 SPED Summit. All rights reserved.</span>
        </div>

      </footer>

      {showAuth && <AuthModal onClose={()=>setShowAuth(false)} onLogin={()=>onGetStarted(null)}/>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LANDING PAGE V2  ·  Bold + Animated  (askape.com-inspired for education)
───────────────────────────────────────────────────────────────────────────── */
function LandingPageV2({ onGetStarted }) {
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
    blue:    "#0070d7",
  };

  const experts = [
    { name:"Tara Roehl",       role:"Mindfulness & Wellness", img:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&auto=format" },
    { name:"Casey Harrison",   role:"Inclusion Specialist",   img:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&auto=format" },
    { name:"Sydney Bassard",   role:"Dyslexia & Literacy",    img:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&auto=format" },
    { name:"Diana Williams",   role:"SPED Leadership Coach",  img:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&auto=format" },
    { name:"Farwa Husain",     role:"IEP Designer",           img:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&auto=format" },
    { name:"Jordan Smith",     role:"Speech-Language Path.",  img:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format" },
    { name:"Sam Parmelee",     role:"AAC Specialist",         img:"https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&fit=crop&auto=format" },
    { name:"Natasha Schaumburg",role:"BCBA",                  img:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&auto=format" },
    { name:"Rose Karentina",   role:"Data & Assessment",      img:"https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop&auto=format" },
  ];

  const BUBBLES = [
    { icon:"student",      size:70, bg:"linear-gradient(135deg,#8a46ff,#a855f7)", top:"14%", left:"7%",   dur:4.5, del:0    },
    { icon:"book-open",    size:52, bg:"linear-gradient(135deg,#0070d7,#3b82f6)", top:"32%", left:"4%",   dur:5.2, del:0.8  },
    { icon:"star",         size:42, bg:"linear-gradient(135deg,#f59e0b,#fbbf24)", top:"58%", left:"8%",   dur:3.8, del:1.5  },
    { icon:"certificate",  size:56, bg:"linear-gradient(135deg,#059669,#10b981)", top:"74%", left:"5%",   dur:4.2, del:0.3  },
    { icon:"trophy",       size:62, bg:"linear-gradient(135deg,#f59e0b,#f97316)", top:"15%", right:"7%",  dur:3.9, del:1.2  },
    { icon:"lightning",    size:42, bg:"linear-gradient(135deg,#e83e8c,#ec4899)", top:"38%", right:"4%",  dur:5.5, del:0.5  },
    { icon:"gift",         size:50, bg:"linear-gradient(135deg,#6366f1,#8b5cf6)", top:"62%", right:"6%",  dur:4.0, del:2.0  },
    { icon:"medal",        size:46, bg:"linear-gradient(135deg,#0891b2,#06b6d4)", top:"80%", right:"8%",  dur:4.7, del:0.9  },
    { icon:"check-circle", size:30, bg:"linear-gradient(135deg,#059669,#0070d7)", top:"88%", left:"14%",  dur:3.5, del:0.4  },
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
    { text:"SPED Summit gave me practical tools I could use the very next day.", name:"Maria Gonzalez", role:"Special Ed Teacher", img:"https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=80&h=80&fit=crop&auto=format" },
    { text:"The AAC module changed how I work with my non-verbal students.", name:"Priya Nair", role:"AAC Specialist, BCBA", img:"https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=80&h=80&fit=crop&auto=format" },
    { text:"Best professional development I've ever attended. And it was free!", name:"Devon Castillo", role:"Inclusion Facilitator", img:"https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&h=80&fit=crop&auto=format" },
  ];

  const S = { /* inline style helpers */
    section: (extra={}) => ({ padding:"96px 24px", ...extra }),
    inner:   (mw=1024)  => ({ maxWidth:mw, margin:"0 auto" }),
  };

  return (
    <div style={{ minHeight:"100vh", fontFamily:"Inter,'Segoe UI',system-ui,sans-serif", background:T2.bg, overflowX:"hidden", color:T2.text }}>
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
          {[["Sessions","sessions"],["Instructors","instructors-v2"],["FAQ","faq-v2"]].map(([l,id])=>(
            <button key={l} onClick={()=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"})}
              style={{ background:"none", border:"none", fontSize:14, color:T2.muted, cursor:"pointer", padding:"4px 12px", borderRadius:7, height:32, transition:"all .12s" }}
              onMouseEnter={e=>{ e.currentTarget.style.background=T2.hover; e.currentTarget.style.color=T2.text; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="none"; e.currentTarget.style.color=T2.muted; }}>{l}</button>
          ))}
          <button onClick={()=>setShowAuth(true)}
            style={{ marginLeft:8, padding:"0 18px", height:38, background:T2.accent, color:"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:700, cursor:"pointer", transition:"all .15s", boxShadow:`0 2px 0 0 #5b21b6` }}
            onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 4px 0 0 #5b21b6"; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 2px 0 0 #5b21b6"; }}>
            Get started free
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
              { top:160, left:40,  right:0,  bg:"#0070d7", icon:"certificate",  label:"Certificate earned",  sub:"Sarah Johnson · SPED Summit 2026", pct:100 },
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
                  <div style={{ height:4, background:"#f1f0ef", borderRadius:2, overflow:"hidden" }}>
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
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {experts.slice(0,6).map((e,i)=>(
              <div key={i} style={{ background:"#fff", borderRadius:20, overflow:"hidden", border:`1px solid ${T2.border}` }}>
                <div style={{ height:220, overflow:"hidden", background:"#f0ece4" }}>
                  <img src={e.img} alt={e.name} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 15%", display:"block", transition:"transform 0.4s ease" }}
                    onMouseEnter={e=>e.currentTarget.style.transform="scale(1.06)"}
                    onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>
                </div>
                <div style={{ padding:"16px 18px" }}>
                  <div style={{ fontWeight:700, fontSize:15, color:T2.text }}>{e.name}</div>
                  <div style={{ fontSize:13, color:T2.muted, marginTop:3 }}>{e.role}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:32 }}>
            <button onClick={()=>setShowAuth(true)}
              style={{ padding:"0 28px", height:46, background:T2.accent, color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer", transition:"all .15s", boxShadow:"0 2px 0 0 #5b21b6" }}
              onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 4px 0 0 #5b21b6"; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 2px 0 0 #5b21b6"; }}>
              Meet all 9 speakers →
            </button>
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
            Start for free — it only takes 30 seconds
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
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <img src={t.img} alt={t.name} style={{ width:40, height:40, borderRadius:"50%", objectFit:"cover" }}/>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:T2.text }}>{t.name}</div>
                    <div style={{ fontSize:12, color:T2.muted }}>{t.role}</div>
                  </div>
                </div>
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
              <p style={{ margin:"12px 0 0", fontSize:15, color:T2.muted, lineHeight:1.7 }}>{faq.a}</p>
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
            Get started free →
          </button>
        </div>
      </section>

      {showAuth && <AuthModal onClose={()=>setShowAuth(false)} onLogin={()=>onGetStarted(null)}/>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   APP
───────────────────────────────────────────────────────────────────────────── */
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem("loggedIn") === "1");
  const [page, setPage] = useState(() => sessionStorage.getItem("page") || "dashboard");
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem("isAdmin") === "1");
  const [isDark, setIsDark] = useState(false);
  const [landingV, setLandingV] = useState(1);
  const [activeSession,   setActiveSession]   = useState(null);
  const [sessionSource,   setSessionSource]   = useState("sessions");
  const [sessionBackLabel, setSessionBackLabel] = useState(null);
  const [editingSession,  setEditingSession]  = useState(null);
  const { toasts, toast, remove } = useToast();

  /* ── Enrolled sessions (pre-seeded with sessions that have progress) ── */
  const [enrolledIds, setEnrolledIds] = useState(new Set([1, 2, 3]));
  const [userName, setUserName] = useState("Alex Johnson");
  const [scheduleRegistrations, setScheduleRegistrations] = useState({});
  const [sessionsDeepLink, setSessionsDeepLink] = useState(null);
  const [dashFilter, setDashFilter] = useState({ season:"all", year:"all" });
  const [adminSessions, setAdminSessions] = useState(() => {
    try { const s = localStorage.getItem("adminSessions"); return s ? JSON.parse(s) : ADMIN_SESSIONS_DATA; } catch { return ADMIN_SESSIONS_DATA; }
  });
  const [sessions, setSessions] = useState(() => {
    try { const s = localStorage.getItem("sessions"); return s ? JSON.parse(s) : SESSIONS; } catch { return SESSIONS; }
  });
  const [spring2026Ids, setSpring2026Ids] = useState(() => {
    try { return JSON.parse(localStorage.getItem("spring2026Ids") || "[]"); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem("spring2026Ids", JSON.stringify(spring2026Ids)); }, [spring2026Ids]);
  // Merged seasons — Spring 2026 gets any newly created sessions without a date
  const seasons = SEASONS.map(s => s.id === "spring-2026" ? { ...s, sessionIds: [...s.sessionIds, ...spring2026Ids] } : s);

  useEffect(() => { try { localStorage.setItem("sessions", JSON.stringify(sessions)); } catch {} }, [sessions]);
  useEffect(() => { try { localStorage.setItem("adminSessions", JSON.stringify(adminSessions)); } catch {} }, [adminSessions]);

  function addAdminSession(form, publish, sections) {
    const newId = Date.now();
    const dateLabel = form.availableFrom
      ? new Date(form.availableFrom).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" })
      : new Date().toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });

    // Add to admin sessions list
    const adminEntry = {
      id: newId,
      title: form.title,
      category: form.category || "SPED",
      status: publish ? "LIVE" : "DRAFT",
      date: dateLabel,
      enrolled: 0,
      availableFrom: form.availableFrom || "",
      availableTo: form.availableTo || "",
      instructor: form.instructorName || "",
      vimeoUrl: form.vimeoUrl || "",
      desc: form.desc || "",
    };
    setAdminSessions(prev => [adminEntry, ...prev]);

    // If published, also add to user-facing sessions list
    if (publish) {
      const sessionEntry = {
        id: newId,
        title: form.title,
        category: form.category || "SPED",
        instructor: form.instructorName || "",
        instructorBio: form.bio || "",
        instructorQuote: "",
        duration: "60 mins",
        resources: 0,
        progress: 0,
        status: "not-started",
        description: form.desc || "",
        vimeoUrl: form.vimeoUrl || "",
        lessons: sections && sections.length
          ? sections.flatMap(sec => sec.lessons.map(l => ({
              id: l.id, sectionTitle: sec.title, title: l.title,
              duration: l.duration || "60:00", status: "available", type: l.type || "video",
              vimeoUrl: l.vimeoUrl || form.vimeoUrl || "",
            })))
          : [{ id:1, sectionTitle:"Session", title:"Full Session", duration:"60:00", status:"available", type:"video", vimeoUrl: form.vimeoUrl || "" }],
      };
      setSessions(prev => [...prev, sessionEntry]);
      // If no date set, add to Spring 2026 bucket
      if (!form.availableFrom) {
        setSpring2026Ids(prev => [...prev, newId]);
      }
    }
  }

  function enroll(sessionId) {
    setEnrolledIds(prev => new Set([...prev, sessionId]));
    toast({ type:"success", title:"Enrolled!", message:"Session added to your courses." });
  }

  /* ── Quiz state: { [sessionId]: { status, score, currentQ, answers } } ── */
  const [quizStates,        setQuizStates]        = useState({ 1: { status:"passed", score:92 } });
  const [assessmentSession, setAssessmentSession] = useState(null);
  const [certSession,       setCertSession]       = useState(null);
  const [reviewSession,     setReviewSession]     = useState(null);
  const [,                  setReviews]           = useState({});

  function updateQuizState(sessionId, updates) {
    setQuizStates(prev => ({ ...prev, [sessionId]: { ...(prev[sessionId] || { status:"not-taken" }), ...updates } }));
  }

  function handleAssessmentClick(session) { setAssessmentSession(session); }
  function handleCertificateClick(session) { setCertSession(session); }

  function handleSaveProgress(sessionId, partial) {
    updateQuizState(sessionId, partial);
  }

  function handleAssessmentFinish(sessionId, score, passed) {
    updateQuizState(sessionId, { status: passed ? "passed" : "failed", score, currentQ: 0, answers: {} });
    const session = SESSIONS.find(s => s.id === sessionId);
    if (session) setReviewSession({ session, score, passed });
    if (passed) {
      toast({ type:"success", title:"🏆 Assessment Passed!", message:`You scored ${score}% — your certificate is ready!` });
    } else {
      toast({ type:"warning", title:"Assessment not passed", message:`You scored ${score}%. You need 80% to pass. Try again!` });
    }
  }

  function nav(p) { setPage(p); sessionStorage.setItem("page", p); setActiveSession(null); setEditingSession(null); }
  function navToSeason(seasonId) { setSessionsDeepLink(seasonId); setPage("sessions"); setActiveSession(null); }

  function openEdit(s) {
    const full = sessions.find(sess => sess.id === s.id);
    setEditingSession(full ? { ...s, lessons: full.lessons, vimeoUrl: full.vimeoUrl || s.vimeoUrl } : s);
    setPage("admin-edit");
  }

  function updateProgress(sessionId, pct) {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, progress: pct, status: pct >= 100 ? "completed" : "in-progress" } : s));
  }

  function updateSession(id, form, sections) {
    const updatedLessons = sections
      ? sections.flatMap(sec => sec.lessons.map(l => ({
          id: l.id, sectionTitle: sec.title, title: l.title,
          duration: l.duration || "60:00", status: l.status === "draft" ? "available" : l.status,
          type: l.type || "video", vimeoUrl: l.vimeoUrl || "",
          questions: l.questions || [],
        })))
      : undefined;
    setSessions(prev => prev.map(s => s.id === id ? {
      ...s, title: form.title, category: form.category, instructor: form.instructorName,
      instructorBio: form.bio, description: form.desc, vimeoUrl: form.vimeoUrl,
      availableFrom: form.availableFrom, availableTo: form.availableTo,
      ...(updatedLessons ? { lessons: updatedLessons } : {}),
    } : s));
    setAdminSessions(prev => prev.map(s => s.id === id ? { ...s, title: form.title, category: form.category, instructor: form.instructorName, vimeoUrl: form.vimeoUrl, availableFrom: form.availableFrom, availableTo: form.availableTo } : s));
  }

  function openSession(s, source) {
    setActiveSession(s);
    setSessionSource(source || page);
    const season = SEASONS.find(season => season.sessionIds.includes(s.id));
    setSessionBackLabel(season ? season.name : null);
    setPage("session-detail");
  }

  function toggleAdmin() {
    const next = !isAdmin;
    setIsAdmin(next);
    sessionStorage.setItem("isAdmin", next ? "1" : "0");
    const p = next ? "admin-overview" : "dashboard";
    setPage(p);
    sessionStorage.setItem("page", p);
    setActiveSession(null);
  }

  const quizProps = {
    quizStates,
    onAssessmentClick: handleAssessmentClick,
    onCertificateClick: handleCertificateClick,
  };

  function renderPage() {
    if (page==="session-detail" && activeSession) {
      const liveSession = sessions.find(s => s.id === activeSession.id) || activeSession;
      return <SessionDetail session={liveSession} onBack={()=>nav(isAdmin?"admin-sessions":sessionSource)} backLabel={sessionBackLabel} sessionSource={sessionSource} toast={toast} onAssessmentClick={handleAssessmentClick} onUpdateProgress={updateProgress}/>;
    }
    if (isAdmin) {
      if (page==="admin-overview") return <AdminOverview onNavigate={nav} onEditSession={openEdit} toast={toast}/>;
      if (page==="admin-sessions") return <AdminSessionsPage onNavigate={nav} onEditSession={openEdit} toast={toast} adminSessions={adminSessions} setAdminSessions={setAdminSessions}/>;
      if (page==="admin-create") return <AdminCreateSession onBack={()=>nav("admin-sessions")} toast={toast} onSave={addAdminSession}/>;
      if (page==="admin-edit" && editingSession) return <AdminEditSession session={editingSession} onBack={()=>nav("admin-sessions")} toast={toast} onSave={updateSession}/>;
      if (page==="admin-analytics") return <AnalyticsPage onEditSession={openEdit}/>;
    }
    if (page==="dashboard") return <Dashboard onNavigate={nav} onNavigateToSeason={navToSeason} onOpenSession={openSession} toast={toast} {...quizProps} enrolledIds={enrolledIds} onEnroll={enroll} scheduleRegistrations={scheduleRegistrations} setScheduleRegistrations={setScheduleRegistrations} sessions={sessions} externalFilter={dashFilter} onFilterChange={setDashFilter}/>;
    if (page==="sessions")  return <SessionsPage onOpenSession={openSession} toast={toast} {...quizProps} enrolledIds={enrolledIds} onNavigate={nav} initialSeason={sessionsDeepLink} onSeasonChange={setSessionsDeepLink} scheduleRegistrations={scheduleRegistrations} setScheduleRegistrations={setScheduleRegistrations} sessions={sessions} seasons={seasons}/>;
    if (page==="schedules") return <SchedulePage onOpenSession={openSession} toast={toast} scheduleRegistrations={scheduleRegistrations} setScheduleRegistrations={setScheduleRegistrations}/>;
    if (page==="quizzes")   return <QuizzesPage  toast={toast}/>;
    if (page==="community") return <CommunityPage toast={toast}/>;
    if (page==="certifications") return <CertificationsPage quizStates={quizStates} enrolledIds={enrolledIds} onCertificateClick={handleCertificateClick} userName={userName}/>;
    if (page==="profile")   return <ProfilePage toast={toast} userName={userName} onNameChange={setUserName}/>;
    return null;
  }

  const activePage = page==="session-detail" ? (isAdmin?"admin-sessions":"sessions") : page;

  if (!isLoggedIn) {
    const handleGetStarted = (sessionId) => {
      setIsLoggedIn(true);
      sessionStorage.setItem("loggedIn", "1");
      if (sessionId) enroll(sessionId);
    };
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet"/>
        {landingV === 1
          ? <LandingPage onGetStarted={handleGetStarted}/>
          : <LandingV2 onGetStarted={handleGetStarted}/>
        }
        {/* Version switcher */}
        <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", gap:6, background:"rgba(26,10,36,0.92)", backdropFilter:"blur(8px)", borderRadius:100, padding:"5px 6px", boxShadow:"0 8px 32px rgba(0,0,0,0.25)", border:"1px solid rgba(255,255,255,0.1)" }}>
          {[1,2].map(v=>(
            <button key={v} onClick={()=>setLandingV(v)}
              style={{ width:80, height:34, borderRadius:100, border:"none", fontSize:13, fontWeight:700, cursor:"pointer", transition:"all .2s",
                background: landingV===v ? "#8a46ff" : "transparent",
                color:      landingV===v ? "#fff"    : "rgba(255,255,255,0.45)" }}>
              {v === 1 ? "Version 1" : "Version 2 ✨"}
            </button>
          ))}
        </div>
      </>
    );
  }

  return (
    <div data-theme={isDark ? "dark" : "light"} style={{ height:"100vh", display:"flex", flexDirection:"column", fontFamily:"'Roboto', 'Segoe UI', system-ui, sans-serif", background:C.gray50, overflow:"hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet"/>
      <TopBar
        onToggleAdmin={toggleAdmin}
        isAdmin={isAdmin}
        toast={toast}
        isDark={isDark}
        onToggleDarkMode={() => setIsDark(v => !v)}
        onLogout={() => {
          sessionStorage.clear();
          setIsLoggedIn(false); setPage("dashboard"); setIsAdmin(false);
          setEnrolledIds(new Set([1,2,3])); setQuizStates({});
        }}
        onNavigateProfile={() => nav("profile")}
        onOpenSession={openSession}
        onNavigate={nav}
        userName={userName}
        onBrowseSelect={(season, year) => { setDashFilter({ season, year }); nav("dashboard"); }}
      />
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <TabBar active={activePage} onChange={nav} isAdmin={isAdmin}/>
        <div style={{ flex:1, overflowY:"auto" }}>{renderPage()}<Footer/></div>
      </div>
      {/* Session Assessment Modal */}
      {assessmentSession && (
        <SessionQuizModal
          session={assessmentSession}
          quizState={quizStates[assessmentSession.id] || {}}
          onClose={() => setAssessmentSession(null)}
          onSaveProgress={handleSaveProgress}
          onFinish={handleAssessmentFinish}
        />
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
      {/* Certificate Modal */}
      {certSession && (
        <CertificateModal
          session={certSession}
          quizState={quizStates[certSession.id] || {}}
          onClose={() => setCertSession(null)}
        />
      )}
      <ToastContainer toasts={toasts} onRemove={remove}/>
      <style>{`
        :root, [data-theme="light"] {
          --hero-bg: linear-gradient(120deg, #e0e7ff, #ede9fe);
          /* Indigo Primary */
          --c-primary:#6366f1; --c-primaryDark:#4f46e5; --c-primaryLight:#e0e7ff; --c-primaryBorder:#c7d2fe;
          /* Feedback */
          --c-success:#10b981; --c-successLight:#ecfdf5; --c-successBorder:#6ee7b7;
          --c-warning:#f59e0b; --c-warningLight:#fffbeb; --c-warningBorder:#fcd34d;
          --c-error:#ef4444; --c-errorLight:#fef2f2; --c-errorBorder:#fca5a5;
          --c-info:#6366f1; --c-infoLight:#e0e7ff; --c-infoBorder:#c7d2fe;
          /* Slate/Gray Scale */
          --c-gray50:#f8fafc; --c-gray100:#f3f4f6; --c-gray200:#e5e7eb; --c-gray300:#d1d5db;
          --c-gray400:#9ca3af; --c-gray500:#6b7280; --c-gray600:#4b5563; --c-gray700:#374151;
          --c-gray800:#1f2937; --c-gray900:#1e293b; --c-white:#ffffff;
        }
        [data-theme="dark"] {
          --hero-bg: linear-gradient(120deg, #1e1b4b, #0f172a);
          /* Indigo Primary (dark) */
          --c-primary:#818cf8; --c-primaryDark:#6366f1; --c-primaryLight:#1e1b4b; --c-primaryBorder:#3730a3;
          /* Feedback (dark) */
          --c-success:#10b981; --c-successLight:#064e3b; --c-successBorder:#065f46;
          --c-warning:#f59e0b; --c-warningLight:#451a03; --c-warningBorder:#92400e;
          --c-error:#ef4444; --c-errorLight:#450a0a; --c-errorBorder:#7f1d1d;
          --c-info:#818cf8; --c-infoLight:#1e1b4b; --c-infoBorder:#3730a3;
          /* Dark Slate Scale */
          --c-gray50:#1e293b; --c-gray100:#1e293b; --c-gray200:#2d3748; --c-gray300:#4b5563;
          --c-gray400:#6b7280; --c-gray500:#9ca3af; --c-gray600:#d1d5db; --c-gray700:#e5e7eb;
          --c-gray800:#e2e8f0; --c-gray900:#e2e8f0; --c-white:#1e293b;
        }
        * { box-sizing: border-box; }
        @keyframes toastIn { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeIn  { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
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
  );
}
