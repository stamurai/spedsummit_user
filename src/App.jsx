import { useState, useRef, useEffect, useCallback, useReducer } from "react";
import * as PhosphorIcons from "@phosphor-icons/react";

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
  "caret-right": PhosphorIcons.CaretRight,
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
  clock:                PhosphorIcons.Clock,
  trophy:               PhosphorIcons.Trophy,
  "chat-circle-dots":   PhosphorIcons.ChatCircleDots,
  megaphone:            PhosphorIcons.Megaphone,
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

function SessionThumb({ id = 1, height = 160, overlay = false, noPlayHover = false }) {
  const photo = THUMB_PHOTOS[(id - 1) % THUMB_PHOTOS.length];
  const src = `https://images.unsplash.com/${photo}?w=640&h=360&fit=crop&auto=format`;
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ width:"100%", height, position:"relative", overflow:"hidden", background:"#e5e7eb" }}>
      <img src={src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
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
  { id:4, date:"7th Jan 2025", time:"02:00 PM", type:"NETWORKING", title:"Paraeducators & Team Collaboration: Training, Delegation & More", description:"Diana Williams shares practical, leadership-driven strategies for building strong, collaborative partnerships between teachers and paraeducators.", status:"past", cta:"Watch Recording", instructor:"Morgan Lee" },
  { id:5, date:"28th Mar", time:"09:00 AM", type:"WORKSHOP", title:"AI and Advanced Technologies in SPED", description:"Join Dr. Emily Tran as she guides educators through the process of utilizing data to inform teaching practices and enhance student learning.", status:"upcoming", cta:"Registered", instructor:"Dr. Emily Tran" },
  { id:6, date:"28th Mar", time:"11:00 AM", type:"PANEL DISCUSSION", title:"Understanding & Supporting Communication for Students with AAC", description:"A panel of AAC specialists discuss implementation strategies, device selection, and how to create truly inclusive communication environments.", status:"upcoming", cta:"Register", instructor:"Dr. Sarah Kim" },
];

const SCHEDULE_TYPE_COLORS = { OPENING:{c:"#7c3aed",bg:"#ede9fe"}, KEYNOTE:{c:"#2563eb",bg:"#dbeafe"}, WORKSHOP:{c:"#059669",bg:"#d1fae5"}, NETWORKING:{c:"#d97706",bg:"#fef3c7"}, "PANEL DISCUSSION":{c:"#dc2626",bg:"#fee2e2"} };
const ADMIN_STATUS_COLORS = { LIVE:{c:"#fff",bg:"#10b981"}, DRAFT:{c:"#92400e",bg:"#fef3c7"}, ARCHIVED:{c:"#6b7280",bg:"#f3f4f6"} };

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

function Avatar({ name, size=36 }) {
  const colors = ["#2563eb","#7c3aed","#059669","#d97706","#dc2626","#0891b2","#0d9488"];
  const c = colors[name.charCodeAt(0) % colors.length];
  const initials = name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
  return <div style={{ width:size, height:size, borderRadius:"50%", background:c, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:size*0.36, flexShrink:0, letterSpacing:0.5 }}>{initials}</div>;
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
      style={{ height, border:`2px dashed ${dragging ? C.primary : C.gray300}`, borderRadius:12, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", background:dragging?C.primaryLight:"#fafafa", transition:"all .2s", position:"relative", overflow:"hidden" }}>
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
          <Icon name={icon||"cloud-arrow-up"} size={28} color={dragging?C.primary:C.gray400}/>
          <span style={{ fontSize:14, color:C.gray600, fontWeight:600, marginTop:8 }}>{label||"Click or drag to upload"}</span>
          {hint && <span style={{ fontSize:12, color:C.gray400, marginTop:4 }}>{hint}</span>}
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
      width:360, background:C.white, borderRadius:16,
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
  { id:"dashboard",        label:"Dashboard",    icon:"house",       type:"page" },
  { id:"schedules",        label:"Schedules",    icon:"calendar",    type:"page" },
  { id:"rewards",          label:"Rewards",      icon:"gift",        type:"page" },
  { id:"profile",          label:"My Profile",   icon:"user-circle", type:"page" },
];

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
                  <Avatar name={s.instructor} size={28}/>
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

function TopBar({ onToggleAdmin, isAdmin, toast, isDark, onToggleDarkMode, onLogout, onNavigateProfile, onOpenSession, onNavigate, userName = "Alex Johnson" }) {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const unread = NOTIF_DATA.filter(n => !n.read).length;
  const notifBtnRef = useRef(null);

  return (
    <div style={{ height:60, background:C.white, borderBottom:`1px solid ${C.gray200}`, display:"flex", alignItems:"center", paddingLeft:20, paddingRight:20, position:"sticky", top:0, zIndex:100, flexShrink:0 }}>
      {/* Logo */}
      <div style={{ flexShrink:0, display:"flex", alignItems:"center", cursor:"pointer" }}
        onClick={()=>onNavigate(isAdmin ? "admin-overview" : "dashboard")}>
        <img src="/Container.png" alt="SPED Summit" style={{ height:28, width:"auto", display:"block" }}/>
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
    { id:"dashboard", icon:"house",        label:"Dashboard" },
    { id:"sessions",  icon:"play-circle",  label:"Sessions"  },
    { id:"schedules", icon:"calendar",     label:"Schedules" },
    { id:"rewards",   icon:"gift",         label:"Rewards"   },
  ];
  const adminNav = [
    { id:"admin-overview",  icon:"house",       label:"Overview"    },
    { id:"admin-sessions",  icon:"play-circle", label:"My Sessions" },
    { id:"admin-analytics", icon:"chart-line",  label:"Analytics"   },
  ];
  const nav = isAdmin ? adminNav : userNav;

  return (
    <div style={{ width:52, background:C.white, borderRight:`1px solid ${C.gray200}`, display:"flex", flexDirection:"column", alignItems:"center", padding:"10px 0 12px", flexShrink:0, height:"100%", gap:2 }}>
      {/* Nav items */}
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
            {/* Tooltip */}
            {isHov && (
              <div style={{ position:"absolute", left:"calc(100% + 10px)", top:"50%", transform:"translateY(-50%)", background:"#181c32", color:"#fff", fontSize:12, fontWeight:600, padding:"5px 9px", borderRadius:7, whiteSpace:"nowrap", pointerEvents:"none", zIndex:999, boxShadow:"0 2px 8px rgba(0,0,0,0.18)" }}>
                {item.label}
                <div style={{ position:"absolute", right:"100%", top:"50%", transform:"translateY(-50%)", borderWidth:"4px 5px 4px 0", borderStyle:"solid", borderColor:"transparent #181c32 transparent transparent" }}/>
              </div>
            )}
          </div>
        );
      })}
      <div style={{ marginTop:"auto", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}/>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SESSION CARD
───────────────────────────────────────────────────────────────────────────── */
function SessionCard({ session, onClick, quizState = {}, onAssessmentClick, onCertificateClick }) {
  const cta = getCTA(session);
  const catColors = { MANAGEMENT:{c:"#2563eb",bg:C.primaryLight}, LEADERSHIP:{c:"#7c3aed",bg:"#ede9fe"}, COMMUNICATION:{c:"#0ea5e9",bg:C.infoLight}, TEAMWORK:{c:"#f97316",bg:"#fff7ed"}, TECHNOLOGY:{c:"#1e1b4b",bg:"#e0e7ff"}, ACCESSIBILITY:{c:"#ec4899",bg:"#fdf2f8"} };
  const cc = catColors[session.category] || { c:C.primary, bg:C.primaryLight };

  /* ── Determine assessment CTA ── */
  const qs = quizState.status; // "not-taken" | "in-progress" | "passed" | "failed" | undefined
  const hasAssessment = !!SESSION_QUIZZES[session.id];
  const showAssessmentCTA = session.status === "completed" && hasAssessment;

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
        action: e => { e.stopPropagation(); onAssessmentClick && onAssessmentClick(session); },
      };
    } else if (qs === "failed") {
      assessBtn = {
        label: "Try Again",
        icon: "arrow-left",
        bg: C.errorLight, color: C.error, border: `1px solid ${C.errorBorder}`,
        action: e => { e.stopPropagation(); onAssessmentClick && onAssessmentClick(session); },
      };
    } else {
      assessBtn = {
        label: "Take Assessment",
        icon: "article",
        bg: "#1e40af", color: "#fff", border: "none",
        action: e => { e.stopPropagation(); onAssessmentClick && onAssessmentClick(session); },
      };
    }
  }

  const [cardHov, setCardHov] = useState(false);
  const cardClickable = !cta.disabled;

  return (
    <div
      onClick={() => cardClickable && onClick(session)}
      onMouseEnter={()=>setCardHov(true)}
      onMouseLeave={()=>setCardHov(false)}
      style={{ background:C.white, borderRadius:14, overflow:"hidden",
               boxShadow:"0 1px 3px rgba(0,0,0,0.07)", cursor: cta.disabled ? "default" : "pointer",
               border:`1px solid ${C.gray200}`, display:"flex", flexDirection:"column" }}>

      {/* Thumbnail */}
      <div style={{ position:"relative", flexShrink:0 }}>
        <SessionThumb id={session.id} height={152} overlay={session.status==="locked"} noPlayHover/>
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
function Dashboard({ onNavigate, onNavigateToSeason, onOpenSession, toast, quizStates, onAssessmentClick, onCertificateClick, enrolledIds = new Set([1,2,3]), onEnroll, scheduleRegistrations = {}, setScheduleRegistrations = ()=>{} }) {
  const enrolledSessions  = SESSIONS.filter(s => enrolledIds.has(s.id) && getSessionState(s.id) === "live");
  const upcomingSessions  = SESSIONS.filter(s => getSessionState(s.id) === "upcoming");
  const pastSessions      = SESSIONS.filter(s => getSessionState(s.id) === "past");
  const discoverSessions  = SESSIONS.filter(s => !enrolledIds.has(s.id) && getSessionState(s.id) === "live");
  const completed = enrolledSessions.filter(s=>s.status==="completed").length;
  const total = enrolledSessions.length;
  const pct = total > 0 ? Math.round((completed/total)*100) : 0;
  // First-time user: no enrolled sessions with any progress
  const hasStarted = enrolledSessions.some(s => s.progress > 0 || s.status === "completed" || s.status === "in-progress");
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [previewSession, setPreviewSession] = useState(null);

  function spin() {
    if (spinning) return;
    setSpinning(true);
    setRotation(r => r + 1440 + Math.floor(Math.random()*360));
    setTimeout(() => {
      setSpinning(false);
      const prizes = ["$5 Cashback 🎉","$10 Cashback 🎉","50 Bonus XP ✦","Better luck next time!","$25 Cashback 🎉","Quiz Unlock 🔓"];
      const prize = prizes[Math.floor(Math.random()*prizes.length)];
      toast({ type: prize.includes("luck")?"warning":"success", title:"Spin Result!", message:`You won: ${prize}` });
    }, 1500);
  }

  if (previewSession) {
    return (
      <SessionPublicPage
        session={previewSession}
        onBack={() => setPreviewSession(null)}
        onRegister={() => { onEnroll && onEnroll(previewSession.id); setPreviewSession(null); }}
        registerLabel="Enroll Now"
      />
    );
  }

  return (
    <div style={{ display:"flex", gap:20, padding:"24px", minHeight:"100%", background:C.gray50, boxSizing:"border-box" }}>
      <div style={{ flex:1, minWidth:0 }}>

        {/* Welcome */}
        <div style={{ background:"var(--hero-bg)", border:`1px solid ${C.primaryBorder}`, borderRadius:16, padding:"24px 28px", marginBottom:24, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:C.warningLight, color:"#92400e", fontSize:12, fontWeight:700, padding:"3px 10px", borderRadius:99, marginBottom:12 }}>
              <Icon name="timer" size={12} color="#92400e"/> WATCHED 4 DAYS AGO
            </div>
            <h1 style={{ margin:"0 0 6px", fontSize:26, fontWeight:900, color:C.gray900 }}>Welcome back, <span style={{ color:C.primary }}>Alex!</span></h1>
            <p style={{ margin:"0 0 18px", color:C.gray500, fontSize:14, lineHeight:1.6 }}>You've completed <strong style={{ color:C.gray800 }}>{completed} of {enrolledSessions.length}</strong> live sessions{upcomingSessions.length > 0 ? ` · ${upcomingSessions.length} upcoming` : ""}. Your next milestone is just one lesson away.</p>
            <Btn onClick={() => onOpenSession(SESSIONS[1])}>
              <Icon name="play" size={14} color="#fff"/> Resume Last Session
            </Btn>
          </div>
          <div style={{ width:88, height:88, borderRadius:"50%", border:`6px solid ${C.primaryBorder}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:C.white, flexShrink:0 }}>
            <span style={{ fontSize:18, fontWeight:900, color:C.gray900 }}>{pct}%</span>
            <span style={{ fontSize:12, color:C.gray400, letterSpacing:.5, marginTop:1 }}>PROGRESS</span>
          </div>
        </div>

        {/* My Enrolled Sessions — only show when user has started something */}
        {hasStarted && (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <h2 style={{ margin:0, fontSize:16, fontWeight:800, color:C.gray900 }}>My Sessions <span style={{ fontSize:12, fontWeight:600, color:C.gray400, marginLeft:6 }}>{enrolledSessions.length} enrolled</span></h2>
              <Btn variant="ghost" size="sm" onClick={() => {
                const primarySeason = SEASONS.reduce((best, s) => {
                  const n = s.sessionIds.filter(id => enrolledIds.has(id)).length;
                  const bestN = best ? best.sessionIds.filter(id => enrolledIds.has(id)).length : 0;
                  return n > bestN ? s : best;
                }, null);
                if (primarySeason && onNavigateToSeason) onNavigateToSeason(primarySeason.id);
                else onNavigate("sessions");
              }}>View All <Icon name="caret-right" size={14} color={C.primary}/></Btn>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:16, marginBottom:28 }}>
              {enrolledSessions.map(s => <SessionCard key={s.id} session={s} onClick={onOpenSession} quizState={quizStates[s.id]||{}} onAssessmentClick={onAssessmentClick} onCertificateClick={onCertificateClick}/>)}
            </div>
          </>
        )}

        {/* First-time user: past season recordings */}
        {!hasStarted && pastSessions.length > 0 && (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <h2 style={{ margin:0, fontSize:16, fontWeight:800, color:C.gray900 }}>
                Past Sessions
                <span style={{ fontSize:12, fontWeight:700, color:C.gray500, background:C.gray100, padding:"2px 8px", borderRadius:99, marginLeft:8 }}>RECORDINGS</span>
              </h2>
              <Btn variant="ghost" size="sm" onClick={() => onNavigate("sessions")}>Browse All <Icon name="caret-right" size={14} color={C.primary}/></Btn>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
              {pastSessions.map(s => {
                const hasRec = SESSION_AVAILABILITY[s.id]?.hasRecording;
                return (
                  <div key={s.id} style={{ background:C.white, borderRadius:12, border:`1px solid ${C.gray200}`, display:"flex", alignItems:"center", gap:14, padding:"14px 16px", opacity: hasRec ? 1 : 0.7 }}>
                    <div style={{ position:"relative", width:80, height:52, borderRadius:8, overflow:"hidden", flexShrink:0 }}>
                      <SessionThumb id={s.id} height={52} noPlayHover/>
                      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.32)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Icon name={hasRec?"play":"warning-circle"} size={16} color="rgba(255,255,255,0.85)"/>
                      </div>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:C.gray900, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.title}</div>
                      <div style={{ fontSize:12, color:C.gray500, marginTop:2 }}>{s.instructor} · {s.duration}</div>
                    </div>
                    {hasRec ? (
                      <button onClick={()=>onOpenSession(s)}
                        style={{ padding:"8px 14px", borderRadius:8, border:`1px solid ${C.gray300}`, background:C.white, color:C.gray700, fontSize:12, fontWeight:700, cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap" }}>
                        <Icon name="play" size={13} color={C.gray600}/> Watch
                      </button>
                    ) : (
                      <div style={{ padding:"7px 12px", borderRadius:8, background:C.gray100, fontSize:12, fontWeight:600, color:C.gray400, flexShrink:0, display:"flex", alignItems:"center", gap:5 }}>
                        <Icon name="warning-circle" size={13} color={C.gray400}/> Unavailable
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Upcoming sessions */}
        {upcomingSessions.length > 0 && (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <h2 style={{ margin:0, fontSize:16, fontWeight:800, color:C.gray900 }}>
                Coming Up
                <span style={{ fontSize:12, fontWeight:700, color:"#2563eb", background:"#dbeafe", padding:"2px 8px", borderRadius:99, marginLeft:8, letterSpacing:.3 }}>UPCOMING</span>
              </h2>
              <Btn variant="ghost" size="sm" onClick={()=>onNavigate("schedules")}>View Schedule <Icon name="caret-right" size={14} color={C.primary}/></Btn>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
              {upcomingSessions.map(s => {
                const avail = SESSION_AVAILABILITY[s.id];
                const releaseLabel = avail?.availableFrom
                  ? new Date(avail.availableFrom).toLocaleString("en-US", { weekday:"short", month:"short", day:"numeric", hour:"numeric", minute:"2-digit" })
                  : "Date TBD";
                const registered = !!scheduleRegistrations[s.id];
                return (
                  <div key={s.id} style={{ background:C.white, borderRadius:12, border:`1px solid ${C.gray200}`, display:"flex", alignItems:"center", gap:14, padding:"14px 16px" }}>
                    <div style={{ width:80, height:52, borderRadius:8, overflow:"hidden", flexShrink:0 }}>
                      <SessionThumb id={s.id} height={52} noPlayHover/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:C.gray900, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.title}</div>
                      <div style={{ fontSize:12, color:"#2563eb", fontWeight:600, marginTop:2 }}>{releaseLabel}</div>
                    </div>
                    {registered ? (
                      <div style={{ width:34, height:34, borderRadius:8, border:`1px solid ${C.primary}`, background:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }} title="Registered">
                        <Icon name="bell" size={15} color={C.primary}/>
                      </div>
                    ) : (
                      <button onClick={()=>{ setScheduleRegistrations(r=>({...r,[s.id]:true})); toast({ type:"success", title:"Registered! 🎉", message:`Added "${s.title.slice(0,40)}…" to your schedule.` }); }}
                        style={{ padding:"8px 14px", borderRadius:8, border:`1px solid ${C.primary}`, background:"transparent", color:C.primary, fontSize:12, fontWeight:700, cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap" }}>
                        <Icon name="bell" size={13} color={C.primary}/> Register
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Discover More Sessions */}
        {discoverSessions.length > 0 && (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <h2 style={{ margin:0, fontSize:16, fontWeight:800, color:C.gray900 }}>Discover More Sessions</h2>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:28 }}>
              {discoverSessions.map(s => {
                const catColors = { MANAGEMENT:{c:"#2563eb",bg:C.primaryLight}, LEADERSHIP:{c:"#7c3aed",bg:"#ede9fe"}, COMMUNICATION:{c:"#0ea5e9",bg:C.infoLight}, TEAMWORK:{c:"#f97316",bg:"#fff7ed"}, TECHNOLOGY:{c:"#1e1b4b",bg:"#e0e7ff"}, ACCESSIBILITY:{c:"#ec4899",bg:"#fdf2f8"} };
                const cc = catColors[s.category] || { c:C.primary, bg:C.primaryLight };
                const gradients = ["linear-gradient(135deg,#1e3a5f,#3699ff)","linear-gradient(135deg,#4c1d95,#a855f7)","linear-gradient(135deg,#166534,#50cd89)","linear-gradient(135deg,#7c2d12,#f97316)","linear-gradient(135deg,#164e63,#06b6d4)"];
                const grad = gradients[(s.id-1)%gradients.length];
                return (
                  <div key={s.id} onClick={() => setPreviewSession(s)}
                    style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, display:"flex", alignItems:"center", gap:16, padding:"14px 16px", overflow:"hidden", cursor:"pointer", transition:"box-shadow .15s" }}
                    onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 18px rgba(0,0,0,0.08)"}
                    onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                    {/* Thumbnail */}
                    <div style={{ width:68, height:68, borderRadius:10, background:grad, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Icon name="play-circle" size={28} color="rgba(255,255,255,0.8)"/>
                    </div>
                    {/* Info */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                        <span style={{ fontSize:12, fontWeight:700, color:cc.c, background:cc.bg, padding:"2px 7px", borderRadius:99 }}>{s.category}</span>
                      </div>
                      <div style={{ fontSize:14, fontWeight:700, color:C.gray900, lineHeight:1.3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.title}</div>
                      <div style={{ fontSize:12, color:C.gray500, marginTop:3 }}>{s.instructor} · {s.duration}</div>
                    </div>
                    <Icon name="caret-right" size={16} color={C.gray300}/>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Knowledge Checks — only show when user has started something */}
        {hasStarted && <><h2 style={{ margin:"0 0 12px", fontSize:16, fontWeight:800, color:C.gray900 }}>Knowledge Checks</h2>
        <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, overflow:"hidden" }}>
          {[
            { session: SESSIONS.find(s=>s.id===1), title:"AI and Advanced Tech in SPED Quiz", instructor:"Tara Roehl", questions:15 },
            { session: SESSIONS.find(s=>s.id===2), title:"Remote Team Dynamics", instructor:"Farwa Husain", questions:15 },
          ].map((q,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", padding:"14px 20px", borderBottom:i===0?`1px solid ${C.gray100}`:"none", gap:14 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:C.primaryLight, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon name="medal" size={20} color={C.primary}/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:600, fontSize:14, color:C.gray900, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{q.title}</div>
                <div style={{ fontSize:12, color:C.gray400, marginTop:2 }}>{q.instructor} · {q.questions} Questions</div>
              </div>
              <Btn size="sm" onClick={() => q.session && onAssessmentClick(q.session)}>
                <Icon name="article" size={14} color="#fff"/> Start Assessment
              </Btn>
            </div>
          ))}
        </div>
        </>}
      </div>

      {/* Right sidebar */}
      <div style={{ width:230, flexShrink:0, display:"flex", flexDirection:"column", gap:14 }}>

        {/* Your Progress */}
        <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, padding:"18px 16px" }}>
          <div style={{ fontWeight:800, fontSize:16, color:C.gray900, marginBottom:14 }}>Your Progress</div>
          {[
            { icon:"article", label:"Sessions Completed", sub:"THIS SEASON", value:`${completed}/${enrolledSessions.length}` },
            { icon:"timer",   label:"Total Time",         sub:"TOTAL HOURS",  value:"42.5h" },
          ].map((row, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom: i===0 ? `1px solid ${C.gray100}` : "none" }}>
              <div style={{ width:32, height:32, borderRadius:9, background:C.gray100, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon name={row.icon} size={17} color={C.gray400}/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:600, color:C.gray700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"block" }}>{row.label}</div>
                <div style={{ fontSize:12, color:C.gray400, fontWeight:600, letterSpacing:.5, marginTop:1 }}>{row.sub}</div>
              </div>
              <div style={{ fontSize:18, fontWeight:900, color:C.primary }}>{row.value}</div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, padding:"18px 16px" }}>
          <div style={{ fontWeight:800, fontSize:16, color:C.gray900, marginBottom:14 }}>Summit Stats</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:18 }}>
            <div style={{ background:C.successLight, borderRadius:10, padding:"14px 12px", textAlign:"left" }}>
              <Icon name="fire" size={18} color={C.success}/>
              <div style={{ fontSize:24, fontWeight:900, color:C.gray900, margin:"6px 0 3px" }}>12</div>
              <div style={{ fontSize:12, color:C.success, fontWeight:700, letterSpacing:.6 }}>Day Streak</div>
            </div>
            <div style={{ background:C.primaryLight, borderRadius:10, padding:"14px 12px", textAlign:"left" }}>
              <Icon name="star" size={18} color={C.primary}/>
              <div style={{ fontSize:24, fontWeight:900, color:C.gray900, margin:"6px 0 3px" }}>320</div>
              <div style={{ fontSize:12, color:C.primary, fontWeight:700, letterSpacing:.6 }}>Exp Points</div>
            </div>
          </div>
          <div style={{ fontSize:12, fontWeight:700, color:C.gray400, letterSpacing:.8, marginBottom:12, textTransform:"uppercase" }}>Upcoming Sessions</div>
          {[{date:"OCT 14",title:"Q&A with Founders",time:"10:00 AM EST"},{date:"OCT 16",title:"Workshop: IEP Planning",time:"02:00 PM EST"}].map((s,i)=>(
            <div key={i} style={{ display:"flex", gap:12, marginBottom:12, alignItems:"center" }}>
              <div style={{ background:C.primary, color:"#fff", borderRadius:8, padding:"5px 8px", textAlign:"center", flexShrink:0, minWidth:38 }}>
                <div style={{ fontSize:12, fontWeight:700, opacity:.85, letterSpacing:.5 }}>{s.date.split(" ")[0]}</div>
                <div style={{ fontSize:16, fontWeight:900, lineHeight:1.1 }}>{s.date.split(" ")[1]}</div>
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:C.gray800, lineHeight:1.4 }}>{s.title}</div>
                <div style={{ fontSize:12, color:C.gray500, marginTop:1 }}>{s.time}</div>
              </div>
            </div>
          ))}
          <Btn variant="ghost" size="sm" onClick={()=>onNavigate("schedules")} style={{ width:"100%", justifyContent:"center", marginTop:6 }}>View all</Btn>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SESSIONS PAGE
───────────────────────────────────────────────────────────────────────────── */
function SessionsPage({ onOpenSession, toast, quizStates, onAssessmentClick, onCertificateClick, enrolledIds = new Set(), onNavigate, initialSeason = null, scheduleRegistrations = {}, setScheduleRegistrations = ()=>{} }) {
  const [activeSeason, setActiveSeason] = useState(initialSeason);

  /* ── Season Detail View ── */
  if (activeSeason) {
    const season = SEASONS.find(s => s.id === activeSeason);
    const sessions = SESSIONS.filter(s => season.sessionIds.includes(s.id));
    const liveSessions     = sessions.filter(s => enrolledIds.has(s.id) && getSessionState(s.id) === "live");
    const upcomingSessions = sessions.filter(s => getSessionState(s.id) === "upcoming");
    const pastSessions     = sessions.filter(s => getSessionState(s.id) === "past");

    return (
      <div style={{ padding:24, background:C.gray50, minHeight:"100%" }}>
        {/* Back + header */}
        <button onClick={()=>setActiveSeason(null)}
          style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", color:C.primary, fontSize:13, fontWeight:600, cursor:"pointer", marginBottom:20, padding:0 }}>
          <Icon name="arrow-left" size={15} color={C.primary}/> All Seasons
        </button>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28 }}>
          <div style={{ width:52, height:52, borderRadius:14, background:season.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>
            {season.icon}
          </div>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:season.color, letterSpacing:1, marginBottom:2 }}>{season.tagline.toUpperCase()}</div>
            <h1 style={{ margin:"0 0 2px", fontSize:22, fontWeight:900, color:C.gray900 }}>{season.name}</h1>
            <p style={{ margin:0, fontSize:13, color:C.gray500 }}>{season.description}</p>
          </div>
        </div>

        {/* Live */}
        {liveSessions.length > 0 && (
          <div style={{ marginBottom:28 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
              <span style={{ fontSize:14, fontWeight:800, color:C.gray900 }}>Live Now</span>
              <span style={{ fontSize:11, fontWeight:700, color:"#fff", background:"#10b981", padding:"2px 8px", borderRadius:99 }}>● LIVE</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:16 }}>
              {liveSessions.map(s => <SessionCard key={s.id} session={s} onClick={onOpenSession} quizState={quizStates[s.id]||{}} onAssessmentClick={onAssessmentClick} onCertificateClick={onCertificateClick}/>)}
            </div>
          </div>
        )}

        {/* Upcoming */}
        {upcomingSessions.length > 0 && (
          <div style={{ marginBottom:28 }}>
            <div style={{ fontSize:14, fontWeight:800, color:C.gray900, marginBottom:14 }}>Upcoming</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {upcomingSessions.map(s => {
                const avail = SESSION_AVAILABILITY[s.id];
                const releaseLabel = avail?.availableFrom
                  ? new Date(avail.availableFrom).toLocaleString("en-US", { weekday:"short", month:"short", day:"numeric", hour:"numeric", minute:"2-digit" })
                  : "Date TBD";
                return (
                  <div key={s.id} style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, display:"flex", alignItems:"center", gap:16, padding:"16px 20px" }}>
                    <div style={{ width:96, height:64, borderRadius:8, overflow:"hidden", flexShrink:0 }}>
                      <SessionThumb id={s.id} height={64}/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:"#2563eb", letterSpacing:.5, marginBottom:3 }}>UPCOMING · {releaseLabel}</div>
                      <div style={{ fontSize:14, fontWeight:700, color:C.gray900, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.title}</div>
                      <div style={{ fontSize:12, color:C.gray500, marginTop:2 }}>{s.instructor} · {s.duration}</div>
                    </div>
                    {scheduleRegistrations[s.id] ? (
                      <div style={{ width:34, height:34, borderRadius:8, border:`1px solid ${C.primary}`, background:"transparent", display:"flex", alignItems:"center", justifyContent:"center" }} title="Registered">
                        <Icon name="bell" size={15} color={C.primary}/>
                      </div>
                    ) : (
                      <button onClick={()=>{ setScheduleRegistrations(r=>({...r,[s.id]:true})); toast({ type:"success", title:"Registered! 🎉", message:`Added "${s.title.slice(0,40)}…" to your schedule.` }); }}
                        style={{ padding:"8px 16px", borderRadius:8, border:`1px solid ${C.primary}`, background:"transparent", color:C.primary, fontSize:12, fontWeight:700, cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap" }}>
                        <Icon name="bell" size={13} color={C.primary}/> Register
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Past */}
        {pastSessions.length > 0 && (
          <div style={{ marginBottom:28 }}>
            <div style={{ fontSize:14, fontWeight:800, color:C.gray900, marginBottom:14 }}>Sessions</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {pastSessions.map(s => {
                const avail = SESSION_AVAILABILITY[s.id];
                const hasRec = avail?.hasRecording;
                return (
                  <div key={s.id} style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, display:"flex", alignItems:"center", gap:16, padding:"16px 20px", opacity:0.85 }}>
                    <div style={{ position:"relative", width:96, height:64, borderRadius:8, overflow:"hidden", flexShrink:0 }}>
                      <SessionThumb id={s.id} height={64}/>
                      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.35)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Icon name={hasRec?"play":"warning-circle"} size={18} color="rgba(255,255,255,0.85)"/>
                      </div>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:C.gray700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.title}</div>
                      <div style={{ fontSize:12, color:C.gray400, marginTop:2 }}>{s.instructor} · {s.duration}</div>
                    </div>
                    {hasRec ? (
                      <button onClick={()=>onOpenSession(s)}
                        style={{ padding:"8px 16px", borderRadius:8, border:`1px solid ${C.gray300}`, background:C.white, color:C.gray700, fontSize:12, fontWeight:700, cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap" }}>
                        <Icon name="play" size={13} color={C.gray600}/> Watch Recording
                      </button>
                    ) : (
                      <div style={{ padding:"8px 14px", borderRadius:8, background:C.gray100, fontSize:12, fontWeight:600, color:C.gray400, flexShrink:0, display:"flex", alignItems:"center", gap:6 }}>
                        <Icon name="warning-circle" size={13} color={C.gray400}/> Recording unavailable
                      </div>
                    )}
                  </div>
                );
              })}
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

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:20 }}>
        {SEASONS.map(season => {
          const sessions     = SESSIONS.filter(s => season.sessionIds.includes(s.id));
          const liveCount     = sessions.filter(s => getSessionState(s.id) === "live").length;
          const upcomingCount = sessions.filter(s => getSessionState(s.id) === "upcoming").length;
          const pastCount     = sessions.filter(s => getSessionState(s.id) === "past").length;
          const statusLabel   = liveCount > 0     ? { label:"● LIVE NOW", color:"#fff",    bg:"#10b981" }
                              : upcomingCount > 0 ? { label:"UPCOMING",   color:"#2563eb", bg:"#dbeafe" }
                              : { label:"PAST SEASON", color:"#6b7280", bg:"#f3f4f6" };
          const firstSession  = sessions[0];

          return (
            <div key={season.id}
              onClick={()=>setActiveSeason(season.id)}
              style={{ background:C.white, borderRadius:16, border:`1px solid ${C.gray200}`, overflow:"hidden", cursor:"pointer", transition:"box-shadow .15s, transform .15s" }}
              onMouseEnter={e=>{ e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,0.10)"; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform=""; }}>

              {/* ── Stacked playlist thumbnail ── */}
              <div style={{ position:"relative", width:"100%", paddingBottom:"56.25%", background:"#1f2937" }}>
                {/* Back stack layers */}
                {sessions.length > 1 && (
                  <div style={{ position:"absolute", bottom:-4, left:"6%", right:"6%", height:"100%", borderRadius:10, overflow:"hidden", opacity:0.5, transform:"scale(0.94)" }}>
                    <SessionThumb id={sessions[1]?.id || sessions[0].id} height="100%" noPlayHover/>
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
                    <span style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{sessions.length}</span>
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
                <div style={{ display:"flex", gap:12, fontSize:12, color:C.gray400 }}>
                  {liveCount > 0     && <span style={{ color:"#10b981", fontWeight:600 }}>● {liveCount} live</span>}
                  {upcomingCount > 0 && <span style={{ color:"#2563eb", fontWeight:600 }}>{upcomingCount} upcoming</span>}
                  {pastCount > 0     && <span>{pastCount} recorded</span>}
                  {liveCount === 0 && upcomingCount === 0 && pastCount === 0 && <span>No sessions yet</span>}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, fontWeight:600, color:C.primary }}>
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
    if (cta==="Register") { setScheduleRegistrations(r=>({...r,[item.id]:true})); toast({ type:"success", title:"Registered! 🎉", message:`Added "${item.title.slice(0,40)}…" to your schedule.` }); return; }
    if (cta==="Remind Me") { setBtnStates(b=>({...b,[item.id]:"Reminded ✓"})); toast({ type:"success", title:"Reminder set! 🔔", message:`We'll notify you before "${item.title.slice(0,40)}…" starts.` }); return; }
    if (cta==="Reminded ✓") { setBtnStates(b=>({...b,[item.id]:"Remind Me"})); toast({ type:"info", message:"Reminder removed." }); return; }
  }

  function ctaVariant(cta) {
    if (cta==="Reminded ✓") return "success";
    if (cta==="Remind Me"||cta==="Register") return "primary";
    return "outline";
  }

  return (
    <div style={{ padding:24, background:C.gray50, minHeight:"100%" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 }}>
        <div>
          <div style={{ fontSize:12, color:C.primary, fontWeight:700, letterSpacing:1, marginBottom:4 }}>EVENT PROGRAMMING</div>
          <h1 style={{ margin:"0 0 6px", fontSize:24, fontWeight:900, color:C.gray900 }}>Spread Summit Schedule</h1>
          <p style={{ margin:0, color:C.gray500, fontSize:14, lineHeight:1.5 }}>Explore the full lineup of sessions, workshops, and keynote events.</p>
        </div>
        <div style={{ display:"flex", gap:24 }}>
          {[{label:"TOTAL SESSIONS",val:"42"},{label:"SPEAKERS",val:"18"}].map(s=>(
            <div key={s.label} style={{ textAlign:"right" }}>
              <div style={{ fontSize:12, color:C.gray400, fontWeight:600 }}>{s.label}</div>
              <div style={{ fontSize:28, fontWeight:900, color:C.gray900 }}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {SCHEDULE.map(item => {
          const tc = SCHEDULE_TYPE_COLORS[item.type] || {c:C.gray500,bg:C.gray100};
          const cta = getCta(item);
          const isPast = item.status === "past";
          // Parse date label into parts e.g. "26th Mar" → month "MAR", day "26"
          const dateParts = item.date.match(/(\d+)\w*\s+(\w+)/);
          const dayNum  = dateParts ? dateParts[1] : item.date;
          const monthAb = dateParts ? dateParts[2].toUpperCase().slice(0,3) : "";
          return (
            <div key={item.id}
              style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:16, padding:"18px 20px", display:"flex", alignItems:"center", gap:16, transition:"box-shadow .15s", opacity: isPast ? 0.82 : 1 }}
              onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.08)"}
              onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>

              {/* Date block */}
              <div style={{ flexShrink:0, width:52, background: isPast ? C.gray100 : C.primaryLight, borderRadius:12, padding:"8px 0", display:"flex", flexDirection:"column", alignItems:"center", border:`1px solid ${isPast ? C.gray200 : C.primaryBorder}` }}>
                <span style={{ fontSize:12, fontWeight:700, color: isPast ? C.gray400 : C.primary, letterSpacing:.5 }}>{monthAb}</span>
                <span style={{ fontSize:22, fontWeight:900, color: isPast ? C.gray600 : C.gray900, lineHeight:1.1 }}>{dayNum}</span>
                <span style={{ fontSize:12, color: isPast ? C.gray400 : C.gray500, marginTop:1 }}>{item.time.split(" ")[0]}</span>
              </div>

              {/* Thumbnail */}
              <div style={{ width:100, height:64, borderRadius:10, overflow:"hidden", flexShrink:0 }}>
                <SessionThumb id={item.id} height={64} noPlayHover/>
              </div>

              {/* Content */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
                  <Badge label={item.type} color={tc.c} bg={tc.bg} size={12}/>
                  {isPast && <Badge label="PAST" color={C.gray500} bg={C.gray100} size={12}/>}
                  {!isPast && <Badge label="UPCOMING" color={C.primary} bg={C.primaryLight} size={12}/>}
                </div>
                <div style={{ fontSize:14, fontWeight:700, color: isPast ? C.gray600 : C.gray900, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:3 }}>{item.title}</div>
                <div style={{ fontSize:12, color:C.gray400, display:"flex", alignItems:"center", gap:6 }}>
                  <Avatar name={item.instructor} size={18}/>
                  <span>{item.instructor}</span>
                  <span style={{ color:C.gray200 }}>·</span>
                  <Icon name="clock" size={12} color={C.gray400}/>
                  <span>{item.time}</span>
                </div>
              </div>

              {/* CTA */}
              <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
                {cta === "Recording Unavailable" ? (
                  <div style={{ padding:"8px 14px", borderRadius:8, background:C.gray100, fontSize:12, fontWeight:600, color:C.gray400, flexShrink:0, whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:6 }}>
                    <Icon name="warning-circle" size={13} color={C.gray400}/>
                    Recording unavailable
                  </div>
                ) : cta==="Registered" ? (
                  <div style={{ width:34, height:34, borderRadius:8, border:`1px solid ${C.primary}`, background:"transparent", display:"flex", alignItems:"center", justifyContent:"center" }}
                    title="Registered">
                    <Icon name="bell" size={15} color={C.primary}/>
                  </div>
                ) : cta==="Register" ? (
                  <button onClick={()=>handleCta(item)}
                    style={{ padding:"8px 16px", borderRadius:8, border:`1px solid ${C.primary}`, background:"transparent", color:C.primary, fontSize:12, fontWeight:700, cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap" }}>
                    <Icon name="bell" size={13} color={C.primary}/> Register
                  </button>
                ) : (
                <Btn variant={ctaVariant(cta)} onClick={()=>handleCta(item)} size="sm">
                  {(cta==="Remind Me"||cta==="Reminded ✓") && <Icon name="bell" size={13} color={cta==="Reminded ✓"?C.success:"#fff"}/>}
                  {(cta==="Watch Again"||cta==="Resume Lesson"||cta==="Watch Recording") && <Icon name="play" size={13} color={C.gray600}/>}
                  {cta}
                </Btn>
                )}
                {(cta==="Remind Me"||cta==="Reminded ✓") && (
                  <button onClick={()=>toast({type:"success",title:"Added to calendar 📅",message:`"${item.title.slice(0,40)}…" saved to your calendar.`})}
                    style={{ width:30, height:30, borderRadius:8, border:`1px solid ${C.gray200}`, background:C.white, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon name="calendar" size={14} color={C.gray500}/>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
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
function SessionDetail({ session, onBack, toast, onAssessmentClick }) {
  const [playing, setPlaying] = useState(false);
  const [activeLesson, setActiveLesson] = useState(() => session.lessons.findIndex(l=>l.status==="active" && l.type!=="quiz")||0);
  const [progress, setProgress] = useState(28);
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
    if (!l || l.status==="locked") { toast({ type:"warning", title:"Lesson locked", message:"Complete previous lessons to unlock this one." }); return; }
    if (l.type==="quiz") { onAssessmentClick && onAssessmentClick(session); return; }
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
        <Avatar name={session.instructor} size={40}/>
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

        {/* Back */}
        <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", color:C.gray500, cursor:"pointer", fontSize:14, marginBottom:14, padding:"4px 0" }}>
          <Icon name="arrow-left" size={16} color={C.gray500}/> Back
        </button>


        {/* ── Video Player ── */}
        <div style={{ borderRadius:16, overflow:"hidden", marginBottom:18, position:"relative", background:"#0f172a", boxShadow:"0 4px 24px rgba(0,0,0,0.15)", paddingBottom:"56.25%", height:0 }}>
          <div style={{ position:"absolute", inset:0 }}>
          <SessionThumb id={session.id} height="100%" overlay={!playing}/>
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <button onClick={() => setPlaying(p => !p)}
              style={{ width:58, height:58, borderRadius:"50%", background:"rgba(0,0,0,0.5)", backdropFilter:"blur(8px)", border:"2px solid rgba(255,255,255,0.45)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"transform .2s" }}
              onMouseEnter={e => e.currentTarget.style.transform="scale(1.1)"}
              onMouseLeave={e => e.currentTarget.style.transform=""}>
              <Icon name={playing ? "pause" : "play"} size={22} color="#fff"/>
            </button>
          </div>
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
                <Avatar name={session.instructor} size={68}/>
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
                        const locked = l.status === "locked";
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
                                {isQuiz ? `${l.questions} question${l.questions!==1?"s":""}` : l.duration}
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
function RewardsPage({ toast }) {
  const badges = [
    {icon:"star",name:"First Session",earned:true,desc:"Complete your first session"},
    {icon:"fire",name:"7-Day Streak",earned:true,desc:"Log in 7 days in a row"},
    {icon:"article",name:"Knowledge Seeker",earned:true,desc:"Complete 3 quizzes"},
    {icon:"heart",name:"Top Contributor",earned:false,desc:"Get 50 community likes"},
    {icon:"medal",name:"Summit Champion",earned:false,desc:"Complete all sessions"},
    {icon:"student",name:"Mentor",earned:false,desc:"Answer 10 community questions"},
  ];
  const emojiMap = {star:"⭐",fire:"🔥",article:"📚",heart:"❤️",medal:"🏆",student:"🎓"};
  return (
    <div style={{ padding:24, background:C.gray50, minHeight:"100%" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
        <div>
          <h1 style={{ margin:"0 0 4px", fontSize:22, fontWeight:900, color:C.gray900, display:"flex", alignItems:"center", gap:8 }}><Icon name="gift" size={22} color={C.primary}/>Your Rewards</h1>
          <p style={{ margin:0, color:C.gray500, fontSize:14, lineHeight:1.5 }}>Track achievements and redeem your points.</p>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:14, marginBottom:28 }}>
        {[{label:"Total Points",val:"320",icon:"star",color:C.primary},{label:"Day Streak",val:"12",icon:"fire",color:C.error},{label:"Badges Earned",val:"3/6",icon:"medal",color:C.warning}].map(s=>(
          <div key={s.label} style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray200}`, padding:"18px 20px", display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:46,height:46,borderRadius:12,background:s.color+"18",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <Icon name={s.icon} size={22} color={s.color}/>
            </div>
            <div>
              <div style={{ fontSize:24, fontWeight:900, color:s.color }}>{s.val}</div>
              <div style={{ fontSize:12, color:C.gray400 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
      <h2 style={{ margin:"0 0 16px", fontSize:16, fontWeight:800, color:C.gray900 }}>Badges</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap:12 }}>
        {badges.map(b=>(
          <div key={b.name} onClick={()=>!b.earned&&toast({type:"info",message:`Complete requirements to earn "${b.name}"`})}
            style={{ background:C.white, borderRadius:14, border:`1px solid ${b.earned?C.primaryBorder:C.gray200}`, padding:"18px 16px", textAlign:"left", opacity:b.earned?1:.55, cursor:b.earned?"default":"pointer", transition:"all .2s" }}
            onMouseEnter={e=>{ if(!b.earned) e.currentTarget.style.opacity="0.7"; }} onMouseLeave={e=>{ if(!b.earned) e.currentTarget.style.opacity="0.55"; }}>
            <div style={{ fontSize:36, marginBottom:8 }}>{emojiMap[b.icon]}</div>
            <div style={{ fontWeight:700, fontSize:14, color:C.gray900, marginBottom:4 }}>{b.name}</div>
            <div style={{ fontSize:12, color:C.gray400, lineHeight:1.4 }}>{b.desc}</div>
            {b.earned && <div style={{ marginTop:10, display:"flex", alignItems:"center", justifyContent:"center", gap:4, fontSize:12, color:C.success, fontWeight:700 }}><Icon name="check-circle" size={12} color={C.success}/>Earned</div>}
          </div>
        ))}
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
        <div style={{ fontSize:12, color:C.primary, fontWeight:700, letterSpacing:1, marginBottom:4 }}>ADMIN PANEL</div>
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
function AdminSessionsPage({ onNavigate, onEditSession, toast }) {
  const [filter, setFilter] = useState("ALL");
  const statuses = ["ALL", "LIVE", "DRAFT", "ARCHIVED"];
  const archived = ADMIN_SESSIONS_DATA.filter(s => s.status === "ARCHIVED");
  const filtered = filter === "ALL" ? ADMIN_SESSIONS_DATA :
                   ADMIN_SESSIONS_DATA.filter(s => s.status === filter);

  return (
    <div style={{ padding:24, background:C.gray50, minHeight:"100%" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
        <div>
          <div style={{ fontSize:12, color:C.primary, fontWeight:700, letterSpacing:1, marginBottom:4 }}>ADMIN PANEL</div>
          <h1 style={{ margin:"0 0 4px", fontSize:22, fontWeight:900, color:C.gray900 }}>My Sessions</h1>
          <p style={{ margin:0, color:C.gray500, fontSize:14, lineHeight:1.5 }}>Manage, publish and track all your content.</p>
        </div>
        <Btn onClick={()=>onNavigate("admin-create")}><Icon name="plus" size={14} color="#fff"/>New Session</Btn>
      </div>

      {/* Summary stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:20 }}>
        {[
          {label:"Total",    val:ADMIN_SESSIONS_DATA.length,                                    color:C.gray700},
          {label:"Live",     val:ADMIN_SESSIONS_DATA.filter(s=>s.status==="LIVE").length,       color:C.success},
          {label:"Drafts",   val:ADMIN_SESSIONS_DATA.filter(s=>s.status==="DRAFT").length,      color:C.warning},
          {label:"Archived", val:ADMIN_SESSIONS_DATA.filter(s=>s.status==="ARCHIVED").length,   color:C.gray500},
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
          <div style={{ fontSize:12, color:C.primary, fontWeight:700, letterSpacing:1, marginBottom:4 }}>ADMIN PANEL</div>
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

function CurriculumBuilder({ toast }) {
  const [sections,         setSections]         = useState([
    { id:1, title:"Introduction", collapsed:false, resources:[], lessons:[
      { id:101, title:"Welcome & course overview", type:"video", duration:"", status:"draft", vimeoUrl:"", questions:[], quizExpanded:false },
    ]},
  ]);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingLessonId,  setEditingLessonId]  = useState(null);
  const [vimeoLinkId,      setVimeoLinkId]      = useState(null); // { secId, lesId }
  const [vimeoInputVal,    setVimeoInputVal]    = useState("");
  const [draggingId,       setDraggingId]       = useState(null);
  const [dragOverId,       setDragOverId]       = useState(null);
  const dragRef            = useRef(null);
  const resourceInputRef   = useRef(null);
  const materialInputRef   = useRef(null);
  const [uploadingResourceSecId, setUploadingResourceSecId] = useState(null);
  const [uploadingMaterialId,    setUploadingMaterialId]    = useState(null);

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

  return (
    <div>
      {/* Hidden file inputs */}
      <input ref={resourceInputRef} type="file" accept="application/pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip" style={{ display:"none" }} onChange={handleResourceChosen}/>
      <input ref={materialInputRef} type="file" accept="application/pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.mp3,.mp4" style={{ display:"none" }} onChange={handleMaterialChosen}/>

      {/* Summary bar */}
      <div style={{ display:"flex", gap:12, marginBottom:18 }}>
        {[{ label:"Sections", val:sections.length },{ label:"Lessons", val:totalLessons },{ label:"Quizzes", val:totalQuizzes },{ label:"Materials", val:totalMaterials }].map(s=>(
          <div key={s.label} style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10, padding:"10px 18px", display:"flex", gap:10, alignItems:"center" }}>
            <span style={{ fontSize:20, fontWeight:800, color:C.primary }}>{s.val}</span>
            <span style={{ fontSize:12, color:C.gray500, fontWeight:600 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Sections */}
      {sections.map((sec, si) => (
        <div key={sec.id}
          draggable
          onDragStart={e=>{ dragRef.current={type:"section",id:sec.id}; setDraggingId("s-"+sec.id); e.dataTransfer.effectAllowed="move"; }}
          onDragOver={e=>{ e.preventDefault(); if(dragRef.current?.type==="section") setDragOverId("s-"+sec.id); }}
          onDragLeave={()=>setDragOverId(null)}
          onDrop={e=>{ e.preventDefault(); setDragOverId(null); setDraggingId(null); if(dragRef.current?.type==="section") moveSection(dragRef.current.id,sec.id); dragRef.current=null; }}
          onDragEnd={()=>{ setDraggingId(null); setDragOverId(null); dragRef.current=null; }}
          style={{ background:C.white, border:`2px solid ${dragOverId==="s-"+sec.id?C.primary:C.gray200}`, borderRadius:14, marginBottom:12, overflow:"hidden", opacity:draggingId==="s-"+sec.id?0.45:1, transition:"opacity .15s,border-color .1s" }}>
          {/* Section header */}
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"13px 18px", borderBottom:sec.collapsed?"none":`1px solid ${C.gray100}`, background:C.gray50 }}>
            <span style={{ cursor:"grab", display:"flex", alignItems:"center" }} onMouseDown={e=>e.stopPropagation()}>
              <Icon name="dots-six-vertical" size={16} color={C.gray400}/>
            </span>
            {editingSectionId===sec.id
              ? <input autoFocus value={sec.title} onChange={e=>updateSectionTitle(sec.id,e.target.value)}
                  onBlur={()=>setEditingSectionId(null)} onKeyDown={e=>e.key==="Enter"&&setEditingSectionId(null)}
                  style={{ flex:1, fontSize:14, fontWeight:700, border:`1px solid ${C.primary}`, borderRadius:7, padding:"4px 10px", outline:"none", color:C.gray900, background:C.white }}/>
              : <div style={{ flex:1, fontSize:14, fontWeight:700, color:C.gray900, cursor:"text" }} onClick={()=>setEditingSectionId(sec.id)}>
                  {si===0?"":si+". "}{sec.title}
                  <span style={{ fontSize:12, color:C.gray400, fontWeight:400, marginLeft:8 }}>{sec.lessons.length} item{sec.lessons.length!==1?"s":""}</span>
                </div>
            }
            <div style={{ display:"flex", gap:4 }}>
              <button onClick={()=>setEditingSectionId(sec.id)} style={{ width:28,height:28,borderRadius:7,border:`1px solid ${C.gray200}`,background:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Icon name="pencil" size={13} color={C.gray500}/></button>
              <button onClick={()=>deleteSection(sec.id)}       style={{ width:28,height:28,borderRadius:7,border:`1px solid ${C.gray200}`,background:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Icon name="trash"  size={13} color={C.error}/></button>
              <button onClick={()=>toggleCollapse(sec.id)}      style={{ width:28,height:28,borderRadius:7,border:`1px solid ${C.gray200}`,background:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Icon name={sec.collapsed?"caret-down":"caret-up"} size={13} color={C.gray500}/></button>
            </div>
          </div>

          {/* Lessons */}
          {!sec.collapsed && (
            <div>
              {sec.lessons.map(l => (
                <div key={l.id}
                  draggable
                  onDragStart={e=>{ dragRef.current={type:"lesson",secId:sec.id,id:l.id}; setDraggingId("l-"+l.id); e.dataTransfer.effectAllowed="move"; }}
                  onDragOver={e=>{ e.preventDefault(); if(dragRef.current?.type==="lesson"&&dragRef.current?.secId===sec.id) setDragOverId("l-"+l.id); }}
                  onDragLeave={()=>setDragOverId(null)}
                  onDrop={e=>{ e.preventDefault(); setDragOverId(null); setDraggingId(null); if(dragRef.current?.type==="lesson"&&dragRef.current?.secId===sec.id) moveLesson(sec.id,dragRef.current.id,l.id); dragRef.current=null; }}
                  onDragEnd={()=>{ setDraggingId(null); setDragOverId(null); dragRef.current=null; }}
                  style={{ opacity:draggingId==="l-"+l.id?0.45:1, transition:"opacity .15s" }}>
                  {/* Lesson row */}
                  <div style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 18px", borderBottom:`1px solid ${dragOverId==="l-"+l.id?C.primary:C.gray100}`, borderLeft:dragOverId==="l-"+l.id?`3px solid ${C.primary}`:"3px solid transparent", background:dragOverId==="l-"+l.id?C.primaryLight:"transparent", transition:"border-color .1s,background .1s" }}>
                    <span style={{ cursor:"grab", display:"flex", alignItems:"center" }}>
                      <Icon name="dots-six-vertical" size={14} color={C.gray400}/>
                    </span>

                    {/* Thumbnail or type icon */}
                    {l.type==="video" ? (
                      <div style={{ width:52, height:30, borderRadius:5, background:`linear-gradient(135deg,${C.primary},#a855f7)`, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Icon name="video" size={14} color="#fff"/>
                      </div>
                    ) : l.type==="material" ? (
                      <div style={{ width:52, height:30, borderRadius:5, background:"#ecfdf5", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Icon name="file-pdf" size={14} color="#059669"/>
                      </div>
                    ) : (
                      <div style={{ width:52, height:30, borderRadius:5, background:"#ede9fe", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Icon name="article" size={14} color="#7c3aed"/>
                      </div>
                    )}

                    {/* Title */}
                    {editingLessonId===l.id
                      ? <input autoFocus value={l.title} onChange={e=>patchLesson(sec.id,l.id,{title:e.target.value})}
                          onBlur={()=>setEditingLessonId(null)} onKeyDown={e=>e.key==="Enter"&&setEditingLessonId(null)}
                          style={{ flex:1, fontSize:14, border:`1px solid ${C.primary}`, borderRadius:7, padding:"4px 10px", outline:"none", color:C.gray900, background:C.white }}/>
                      : <div style={{ flex:1, minWidth:0, display:"flex", alignItems:"center", gap:6, cursor:"text" }} onClick={()=>setEditingLessonId(l.id)}>
                          <div style={{ minWidth:0 }}>
                            <div style={{ fontSize:14, fontWeight:500, color:C.gray900, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.title}</div>
                            {l.duration && <div style={{ fontSize:12, color:C.gray400, marginTop:1 }}>{l.duration}</div>}
                          </div>
                          {l.type==="quiz" && (
                            <button onClick={e=>{ e.stopPropagation(); patchLesson(sec.id,l.id,{quizExpanded:!l.quizExpanded}); }}
                              style={{ background:"none", border:"none", cursor:"pointer", padding:"2px 4px", display:"flex", alignItems:"center", flexShrink:0 }}>
                              <Icon name={l.quizExpanded?"caret-up":"caret-down"} size={14} color="#7c3aed"/>
                            </button>
                          )}
                        </div>
                    }

                    {/* Type badge */}
                    <span style={{ fontSize:12, fontWeight:700, padding:"2px 8px", borderRadius:99,
                      background: l.type==="quiz"?"#ede9fe": l.type==="material"?"#ecfdf5":C.primaryLight,
                      color:      l.type==="quiz"?"#7c3aed": l.type==="material"?"#059669":C.primary,
                      flexShrink:0 }}>
                      {l.type==="quiz"?"Quiz": l.type==="material"?"Material":"Video"}
                    </span>

                    {/* Material upload button */}
                    {l.type==="material" && (
                      <button onClick={()=>{ setUploadingMaterialId({secId:sec.id,lesId:l.id}); setTimeout(()=>materialInputRef.current?.click(),0); }}
                        style={{ fontSize:12, fontWeight:600, color: l.materialFile?C.success:C.primary, background:"none", border:`1px solid ${l.materialFile?C.success:C.gray200}`, borderRadius:7, padding:"4px 10px", cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", gap:4 }}>
                        <Icon name={l.materialFile?"check":"paperclip"} size={12} color={l.materialFile?C.success:C.primary}/>
                        {l.materialFile ? l.materialFile.name.slice(0,16)+"…" : "Upload File"}
                      </button>
                    )}

                    {/* Vimeo link control (video type only) */}
                    {l.type==="video" && (() => {
                      const isEditing = vimeoLinkId?.secId===sec.id && vimeoLinkId?.lesId===l.id;
                      if (isEditing) {
                        return (
                          <div style={{ display:"flex", alignItems:"center", gap:4, flexShrink:0 }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="#1ab7ea"><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.568 8.16c-.169 1.858-1.387 3.915-3.653 6.173-2.347 2.355-4.332 3.532-5.956 3.532-.999 0-1.847-.926-2.541-2.778L4.56 11.605C4.04 9.753 3.483 8.826 2.888 8.826c-.132 0-.593.278-1.384.832L.72 8.544c.871-.765 1.729-1.53 2.573-2.297C4.527 5.138 5.55 4.63 6.18 4.564c1.557-.149 2.514.917 2.87 3.196.386 2.456.655 3.985.806 4.588.447 2.039.938 3.058 1.473 3.058.416 0 1.043-.659 1.881-1.977.837-1.317 1.286-2.318 1.347-3.004.12-1.138-.328-1.708-1.347-1.708-.479 0-.974.111-1.481.333.984-3.225 2.864-4.79 5.641-4.696 2.058.063 3.029 1.39 2.918 3.798l-.02.008z"/></svg>
                            <input autoFocus value={vimeoInputVal}
                              onChange={e=>setVimeoInputVal(e.target.value)}
                              onKeyDown={e=>{ if(e.key==="Enter"){ patchLesson(sec.id,l.id,{vimeoUrl:vimeoInputVal}); setVimeoLinkId(null); toast({type:"success",message:"Vimeo link saved."}); } if(e.key==="Escape") setVimeoLinkId(null); }}
                              onBlur={()=>{ patchLesson(sec.id,l.id,{vimeoUrl:vimeoInputVal}); setVimeoLinkId(null); if(vimeoInputVal) toast({type:"success",message:"Vimeo link saved."}); }}
                              placeholder="https://vimeo.com/…"
                              style={{ width:180, fontSize:12, border:`1px solid ${C.primary}`, borderRadius:7, padding:"4px 8px", outline:"none", color:C.gray900, background:C.white }}/>
                          </div>
                        );
                      }
                      return l.vimeoUrl ? (
                        <button onClick={()=>{ setVimeoLinkId({secId:sec.id,lesId:l.id}); setVimeoInputVal(l.vimeoUrl); }}
                          style={{ fontSize:12, fontWeight:600, color:C.success, background:"none", border:`1px solid ${C.success}`, borderRadius:7, padding:"4px 10px", cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", gap:4 }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="#50cd89"><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.568 8.16c-.169 1.858-1.387 3.915-3.653 6.173-2.347 2.355-4.332 3.532-5.956 3.532-.999 0-1.847-.926-2.541-2.778L4.56 11.605C4.04 9.753 3.483 8.826 2.888 8.826c-.132 0-.593.278-1.384.832L.72 8.544c.871-.765 1.729-1.53 2.573-2.297C4.527 5.138 5.55 4.63 6.18 4.564c1.557-.149 2.514.917 2.87 3.196.386 2.456.655 3.985.806 4.588.447 2.039.938 3.058 1.473 3.058.416 0 1.043-.659 1.881-1.977.837-1.317 1.286-2.318 1.347-3.004.12-1.138-.328-1.708-1.347-1.708-.479 0-.974.111-1.481.333.984-3.225 2.864-4.79 5.641-4.696 2.058.063 3.029 1.39 2.918 3.798l-.02.008z"/></svg>
                          Linked ✓
                        </button>
                      ) : (
                        <button onClick={()=>{ setVimeoLinkId({secId:sec.id,lesId:l.id}); setVimeoInputVal(""); }}
                          style={{ fontSize:12, fontWeight:600, color:C.primary, background:"none", border:`1px solid ${C.gray200}`, borderRadius:7, padding:"4px 10px", cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", gap:4 }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="#3699ff"><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.568 8.16c-.169 1.858-1.387 3.915-3.653 6.173-2.347 2.355-4.332 3.532-5.956 3.532-.999 0-1.847-.926-2.541-2.778L4.56 11.605C4.04 9.753 3.483 8.826 2.888 8.826c-.132 0-.593.278-1.384.832L.72 8.544c.871-.765 1.729-1.53 2.573-2.297C4.527 5.138 5.55 4.63 6.18 4.564c1.557-.149 2.514.917 2.87 3.196.386 2.456.655 3.985.806 4.588.447 2.039.938 3.058 1.473 3.058.416 0 1.043-.659 1.881-1.977.837-1.317 1.286-2.318 1.347-3.004.12-1.138-.328-1.708-1.347-1.708-.479 0-.974.111-1.481.333.984-3.225 2.864-4.79 5.641-4.696 2.058.063 3.029 1.39 2.918 3.798l-.02.008z"/></svg>
                          Link Vimeo
                        </button>
                      );
                    })()}

                    <button onClick={()=>deleteLesson(sec.id,l.id)} style={{ width:26,height:26,borderRadius:7,border:`1px solid ${C.gray200}`,background:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                      <Icon name="x" size={12} color={C.gray400}/>
                    </button>
                  </div>

                  {/* Inline quiz builder */}
                  {l.type==="quiz" && l.quizExpanded && (
                    <div style={{ background:C.gray50, borderBottom:`1px solid ${C.gray100}`, padding:"16px 18px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                        <div style={{ fontSize:14, fontWeight:700, color:"#7c3aed" }}>
                          Questions · {l.questions.length} total
                        </div>
                        <button onClick={()=>addQuestion(sec.id,l.id)}
                          style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 12px", background:"#7c3aed", color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer" }}>
                          <Icon name="plus" size={12} color="#fff"/> Add Question
                        </button>
                      </div>

                      {l.questions.length===0 && (
                        <div style={{ textAlign:"center", padding:"20px 0", color:C.gray400, fontSize:14 }}>
                          No questions yet. Click "Add Question" to get started.
                        </div>
                      )}

                      {l.questions.map((q, qi) => (
                        <div key={q.id} style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:12, marginBottom:10, overflow:"hidden" }}>
                          <div style={{ padding:"14px 16px" }}>
                            {/* Q header */}
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                              <span style={{ fontSize:12, fontWeight:700, color:C.gray400, letterSpacing:.3 }}>QUESTION {qi+1}</span>
                              <div style={{ display:"flex", gap:6 }}>
                                <select value={q.type} onChange={e=>patchQuestion(sec.id,l.id,q.id,{type:e.target.value,correct:0,options:["","","",""]})}
                                  style={{ fontSize:12, border:`1px solid ${C.gray200}`, borderRadius:6, padding:"4px 28px 4px 10px", outline:"none", color:C.gray700, background:C.white, cursor:"pointer", appearance:"auto" }}>
                                  {CB_Q_TYPES.map(t=><option key={t.key} value={t.key}>{t.label}</option>)}
                                </select>
                                <button onClick={()=>deleteQuestion(sec.id,l.id,q.id)}
                                  style={{ width:26,height:26,borderRadius:7,border:`1px solid ${C.gray200}`,background:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
                                  <Icon name="trash" size={12} color={C.error}/>
                                </button>
                              </div>
                            </div>
                            {/* Question text */}
                            <input value={q.text} onChange={e=>patchQuestion(sec.id,l.id,q.id,{text:e.target.value})}
                              placeholder="Enter your question…"
                              style={{ width:"100%", padding:"8px 10px", border:`1px solid ${C.gray200}`, borderRadius:8, fontSize:14, color:C.gray900, outline:"none", background:C.gray50, boxSizing:"border-box", marginBottom:10, fontFamily:"inherit" }}/>
                            {/* Options */}
                            {(q.type==="multiple-choice"||q.type==="checkboxes"||q.type==="dropdown") && q.options.map((opt,oi)=>(
                              <div key={oi} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                                {q.type==="dropdown"
                                  ? <span style={{ fontSize:12, color:C.gray400, width:18, textAlign:"right", flexShrink:0 }}>{oi+1}.</span>
                                  : <input type={q.type==="checkboxes"?"checkbox":"radio"} checked={q.correct===oi} onChange={()=>patchQuestion(sec.id,l.id,q.id,{correct:oi})} style={{ accentColor:"#7c3aed", width:14, height:14, flexShrink:0 }}/>
                                }
                                <input value={opt} onChange={e=>{ const opts=[...q.options]; opts[oi]=e.target.value; patchQuestion(sec.id,l.id,q.id,{options:opts}); }}
                                  placeholder={`Option ${oi+1}`}
                                  style={{ flex:1, padding:"6px 10px", border:`1px solid ${C.gray200}`, borderRadius:7, fontSize:12, color:C.gray700, outline:"none", background: q.correct===oi&&q.type!=="dropdown"?"#faf5ff":C.white, fontFamily:"inherit" }}/>
                                {q.correct===oi && q.type!=="dropdown" && <span style={{ fontSize:12, fontWeight:700, color:"#7c3aed", background:"#ede9fe", borderRadius:99, padding:"2px 8px" }}>Correct</span>}
                              </div>
                            ))}
                            {(q.type==="short-answer") && (
                              <input placeholder="Student types a short answer here…" disabled style={{ width:"100%", padding:"7px 10px", border:`1.5px dashed ${C.gray200}`, borderRadius:8, fontSize:12, color:C.gray400, background:C.gray50, boxSizing:"border-box", fontFamily:"inherit" }}/>
                            )}
                            {q.type==="paragraph" && (
                              <textarea placeholder="Student writes a longer response here…" disabled rows={3} style={{ width:"100%", padding:"7px 10px", border:`1.5px dashed ${C.gray200}`, borderRadius:8, fontSize:12, color:C.gray400, background:C.gray50, boxSizing:"border-box", resize:"none", fontFamily:"inherit" }}/>
                            )}
                            {q.type==="dropdown" && (
                              <div style={{ fontSize:12, color:C.gray400, marginTop:4 }}>Students will pick from the options above in a dropdown menu.</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Add lesson / quiz / material */}
              <div style={{ padding:"10px 18px", display:"flex", gap:8 }}>
                <button onClick={()=>addLesson(sec.id,"video")}
                  style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 14px",border:`1px solid ${C.gray200}`,borderRadius:8,background:C.white,fontSize:12,fontWeight:600,color:C.gray700,cursor:"pointer" }}>
                  <Icon name="video" size={13} color={C.gray500}/> Add Lesson
                </button>
                <button onClick={()=>addLesson(sec.id,"quiz")}
                  style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 14px",border:`1px solid #e9d5ff`,borderRadius:8,background:"#faf5ff",fontSize:12,fontWeight:600,color:"#7c3aed",cursor:"pointer" }}>
                  <Icon name="article" size={13} color="#7c3aed"/> Add Quiz
                </button>
                <button onClick={()=>addLesson(sec.id,"material")}
                  style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 14px",border:`1px solid #a7f3d0`,borderRadius:8,background:"#ecfdf5",fontSize:12,fontWeight:600,color:"#059669",cursor:"pointer" }}>
                  <Icon name="file-pdf" size={13} color="#059669"/> Add Material
                </button>
              </div>
              {/* Section resources */}
              {(sec.resources && sec.resources.length > 0) && (
                <div style={{ margin:"0 18px 12px", borderRadius:10, border:`1px solid ${C.gray200}`, overflow:"hidden" }}>
                  <div style={{ padding:"8px 14px", background:C.gray50, borderBottom:`1px solid ${C.gray200}`, fontSize:12, fontWeight:700, color:C.gray500, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span>Resources</span>
                    <button onClick={()=>triggerResourceUpload(sec.id)} style={{ fontSize:12, fontWeight:600, color:C.primary, background:"none", border:`1px solid ${C.gray200}`, borderRadius:6, padding:"3px 8px", cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
                      <Icon name="plus" size={12} color={C.primary}/> Add
                    </button>
                  </div>
                  {sec.resources.map((r, ri) => (
                    <div key={r.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 14px", borderBottom: ri < sec.resources.length-1 ? `1px solid ${C.gray100}` : "none", background:C.white }}>
                      <span style={{ fontSize:18, flexShrink:0 }}>{r.icon}</span>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:12, fontWeight:500, color:C.gray900, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.title}</div>
                        <div style={{ display:"flex", gap:6, alignItems:"center", marginTop:2 }}>
                          <span style={{ fontSize:12, fontWeight:700, color:C.primary, background:C.primaryLight, borderRadius:4, padding:"1px 5px" }}>{r.type}</span>
                          <span style={{ fontSize:12, color:C.gray400 }}>{r.size}</span>
                        </div>
                      </div>
                      <button onClick={()=>removeResource(sec.id, r.id)} style={{ width:24, height:24, borderRadius:6, border:`1px solid ${C.gray200}`, background:C.white, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <Icon name="x" size={12} color={C.gray400}/>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {/* Add resource button (when no resources yet) */}
            </div>
          )}
        </div>
      ))}

      {/* Add Section */}
      <button onClick={addSection}
        style={{ width:"100%", padding:"13px", border:`2px dashed ${C.gray200}`, borderRadius:14, background:"transparent", fontSize:14, fontWeight:700, color:C.primary, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
        <Icon name="plus" size={15} color={C.primary}/> Add Section
      </button>
    </div>
  );
}


function AdminCreateSession({ onBack, toast }) {
  const [tab,  setTab]  = useState("details");
  const [form, setForm] = useState({
    title:"", category:"UI Design", lang:"English", desc:"",
    availableFrom:"", availableTo:"",
    instructorName:"", bio:"",
    discussion:true, qa:true, spinWheel:false, certificate:false,
  });
  const upd = (k,v) => setForm(f=>({...f,[k]:v}));

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
    if (publish) { toast({ type:"success", title:"Session published! 🚀", message:`"${form.title}" is now live.` }); setTimeout(onBack, 1200); }
    else toast({ type:"info", title:"Draft saved", message:`"${form.title}" saved as draft.` });
  }

  const TABS = [
    { key:"details",    label:"Session Details" },
    { key:"curriculum", label:"Curriculum"      },
  ];

  return (
    <div style={{ background:C.gray50, minHeight:"100%", display:"flex", flexDirection:"column" }}>

      {/* Header */}
      <div style={{ padding:"16px 28px", background:C.white, borderBottom:`1px solid ${C.gray200}`,
        display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={onBack} style={{ width:32,height:32,borderRadius:8,border:`1px solid ${C.gray200}`,
            background:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <Icon name="arrow-left" size={16} color={C.gray600}/>
          </button>
          <div>
            <div style={{ fontSize:12, color:C.primary, fontWeight:700, letterSpacing:1 }}>ADMIN PANEL</div>
            <h2 style={{ margin:0, fontSize:16, fontWeight:800, color:C.gray900, lineHeight:1.3 }}>Create New Session</h2>
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <Btn variant="outline" onClick={()=>save(false)}>Save Draft</Btn>
          <Btn onClick={()=>save(true)}><Icon name="lightning" size={14} color="#fff"/>Publish Session</Btn>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display:"flex", background:C.white, borderBottom:`1px solid ${C.gray200}`,
        padding:"0 28px", flexShrink:0 }}>
        {TABS.map(t => {
          const active = tab === t.key;
          return (
            <button key={t.key} onClick={()=>setTab(t.key)}
              style={{ padding:"14px 20px", background:"none", border:"none",
                borderBottom: active ? `2px solid ${C.primary}` : "2px solid transparent",
                cursor:"pointer", fontSize:14, fontWeight: active ? 700 : 500,
                color: active ? C.primary : C.gray500, marginBottom:-1 }}>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div style={{ flex:1, overflowY:"auto", padding:"24px 28px 36px" }}>

        {/* ── SESSION DETAILS tab ── */}
        {tab === "details" && <>

          <FormSection icon="info" title="General Information" subtitle="Set the foundational details for your curated recorded course.">
            <Label required>COURSE TITLE</Label>
            <input value={form.title} onChange={e=>upd("title",e.target.value)} placeholder="e.g. Advanced Figma Auto-Layout Masterclass" style={{...inputSt,marginBottom:14}}/>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
              <div><Label>CATEGORY</Label><select value={form.category} onChange={e=>upd("category",e.target.value)} style={inputSt}>{["UI Design","Management","Leadership","Marketing","Sales","UX Research","Accessibility"].map(c=><option key={c}>{c}</option>)}</select></div>
              <div><Label>LANGUAGE</Label><select value={form.lang} onChange={e=>upd("lang",e.target.value)} style={inputSt}>{["English","Spanish","French","Hindi","Portuguese"].map(l=><option key={l}>{l}</option>)}</select></div>
            </div>
            <Label>DESCRIPTION</Label>
            <textarea value={form.desc} onChange={e=>upd("desc",e.target.value)} placeholder="Deep dive into the nuances of the course content…" rows={4} style={{...inputSt,resize:"vertical"}}/>
          </FormSection>

          <FormSection icon="calendar" title="Availability" subtitle="Set the access window. The session goes live on the start date and auto-archives after the end date.">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:8 }}>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:C.gray500, letterSpacing:.5, marginBottom:4 }}>AVAILABLE FROM</div>
                <input type="datetime-local" value={form.availableFrom} onChange={e=>upd("availableFrom",e.target.value)} style={inputSt}/>
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:C.gray500, letterSpacing:.5, marginBottom:4 }}>AVAILABLE TO</div>
                <input type="datetime-local" value={form.availableTo} onChange={e=>upd("availableTo",e.target.value)} style={inputSt}/>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 12px", background:"#f0f9ff", borderRadius:8, border:"1px solid #bae6fd" }}>
              <Icon name="info" size={14} color="#0369a1"/>
              <span style={{ fontSize:12, color:"#0369a1", lineHeight:1.5 }}>
                When the <strong>Available To</strong> date passes, this session is automatically moved to <strong>Archive</strong> and hidden from students. Leave blank for no expiry.
              </span>
            </div>
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

          <FormSection icon="chat-circle" title="Engagement Settings" subtitle="Configure how you will interact with your audience.">
            {[
              { key:"discussion", label:"Enable Discussion Forum",  desc:"Allow students to ask questions and discuss with peers" },
              { key:"qa",         label:"Enable Q&A Section",       desc:"Moderate and answer student questions individually"   },
            ].map(item=>(
              <div key={item.key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"14px 0", borderBottom:`1px solid ${C.gray100}` }}>
                <div>
                  <div style={{ fontWeight:600, fontSize:14, color:C.gray900 }}>{item.label}</div>
                  <div style={{ fontSize:12, color:C.gray400, marginTop:2 }}>{item.desc}</div>
                </div>
                <Toggle fieldKey={item.key}/>
              </div>
            ))}
          </FormSection>
        </>}

        {/* ── CURRICULUM tab ── */}
        {tab === "curriculum" && (
          <FormSection icon="list" title="Course Curriculum" subtitle="Build your course structure with sections, lessons, and quizzes.">
            <CurriculumBuilder toast={toast}/>
          </FormSection>
        )}

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ADMIN EDIT SESSION
───────────────────────────────────────────────────────────────────────────── */
function AdminEditSession({ session, onBack, toast }) {
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
    discussion:     session.discussion !== undefined ? session.discussion : true,
    qa:             session.qa         !== undefined ? session.qa         : true,
    spinWheel:      session.spinWheel  !== undefined ? session.spinWheel  : false,
    certificate:    session.certificate !== undefined ? session.certificate : false,
  });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

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
    toast({ type:"success", title:"Changes saved", message:`"${form.title}" has been updated.` });
    setTimeout(onBack, 1200);
  }

  function discard() {
    toast({ type:"info", message:"Changes discarded." });
    onBack();
  }


  const TABS = [
    { key:"details",    label:"Session Details" },
    { key:"curriculum", label:"Curriculum"      },
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

      {/* Header */}
      <div style={{ padding:"16px 28px", background:C.white, borderBottom:`1px solid ${C.gray200}`,
        display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={onBack} style={{ width:32,height:32,borderRadius:8,border:`1px solid ${C.gray200}`,
            background:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <Icon name="arrow-left" size={16} color={C.gray600}/>
          </button>
          <div>
            <div style={{ fontSize:12, color:C.primary, fontWeight:700, letterSpacing:1 }}>EDITING SESSION</div>
            <h2 style={{ margin:0, fontSize:16, fontWeight:800, color:C.gray900, lineHeight:1.3,
              maxWidth:480, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {session.title}
            </h2>
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <Btn variant="outline" onClick={discard}>Discard</Btn>
          <Btn onClick={save}><Icon name="floppy-disk" size={14} color="#fff"/>Save Changes</Btn>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display:"flex", background:C.white, borderBottom:`1px solid ${C.gray200}`,
        padding:"0 28px", flexShrink:0 }}>
        {TABS.map(t => {
          const active = tab === t.key;
          return (
            <button key={t.key} onClick={()=>setTab(t.key)}
              style={{ padding:"14px 20px", background:"none", border:"none",
                borderBottom: active ? `2px solid ${C.primary}` : "2px solid transparent",
                cursor:"pointer", fontSize:14, fontWeight: active ? 700 : 500,
                color: active ? C.primary : C.gray500, marginBottom:-1 }}>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div style={{ flex:1, overflowY:"auto", padding:"24px 28px 36px" }}>

        {/* ── SESSION DETAILS tab ── */}
        {tab === "details" && <>

          {/* General Information */}
          <FormSection icon="info" title="General Information" subtitle="Edit the foundational details for this session.">
            <Label required>SESSION TITLE</Label>
            <input value={form.title} onChange={e=>upd("title",e.target.value)}
              placeholder="e.g. Advanced Figma Auto-Layout Masterclass" style={{...inputSt,marginBottom:14}}/>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
              <div>
                <Label>CATEGORY</Label>
                <select value={form.category} onChange={e=>upd("category",e.target.value)} style={inputSt}>
                  {["UI Design","Management","Leadership","Marketing","Sales","UX Research","Accessibility","Content Strategy","Life Skills","Design Systems"].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <Label>LANGUAGE</Label>
                <select value={form.lang} onChange={e=>upd("lang",e.target.value)} style={inputSt}>
                  {["English","Spanish","French","Hindi","Portuguese"].map(l=><option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <Label>DESCRIPTION</Label>
            <textarea value={form.desc} onChange={e=>upd("desc",e.target.value)}
              placeholder="Describe what students will learn in this session…" rows={4} style={{...inputSt,resize:"vertical"}}/>
          </FormSection>

          {/* Availability */}
          <FormSection icon="calendar" title="Availability" subtitle="Set the access window. The session goes live on the start date and auto-archives after the end date.">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:8 }}>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:C.gray500, letterSpacing:.5, marginBottom:4 }}>AVAILABLE FROM</div>
                <input type="datetime-local" value={form.availableFrom} onChange={e=>upd("availableFrom",e.target.value)} style={inputSt}/>
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:C.gray500, letterSpacing:.5, marginBottom:4 }}>AVAILABLE TO</div>
                <input type="datetime-local" value={form.availableTo} onChange={e=>upd("availableTo",e.target.value)} style={inputSt}/>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 12px", background:"#f0f9ff", borderRadius:8, border:"1px solid #bae6fd" }}>
              <Icon name="info" size={14} color="#0369a1"/>
              <span style={{ fontSize:12, color:"#0369a1", lineHeight:1.5 }}>
                The session goes live at the <strong>Available From</strong> date &amp; time and auto-archives after <strong>Available To</strong>. Leave blank for no expiry.
              </span>
            </div>
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
              { key:"discussion", label:"Enable Discussion Forum",  desc:"Allow students to ask questions and discuss with peers" },
              { key:"qa",         label:"Enable Q&A Section",       desc:"Moderate and answer student questions individually"   },
            ].map(item => (
              <div key={item.key} style={{ display:"flex", justifyContent:"space-between",
                alignItems:"center", padding:"14px 0",
                borderBottom:`1px solid ${C.gray100}` }}>
                <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:14, color:C.gray900 }}>{item.label}</div>
                    <div style={{ fontSize:12, color:C.gray400, marginTop:2 }}>{item.desc}</div>
                  </div>
                </div>
                <Toggle fieldKey={item.key}/>
              </div>
            ))}
          </FormSection>
        </>}

        {/* ── CURRICULUM tab ── */}
        {tab === "curriculum" && (
          <FormSection icon="list" title="Course Curriculum" subtitle="Build your course structure with sections, lessons, and quizzes.">
            <CurriculumBuilder toast={toast}/>
          </FormSection>
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
   CERTIFICATE MODAL
───────────────────────────────────────────────────────────────────────────── */
function CertificateModal({ session, quizState, onClose }) {
  const score = quizState?.score ?? 0;
  const today = new Date().toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });
  const certId = `SS-${session.id}${score}-2024`;
  const certUrl = `spedsummit.com/cert/${certId.toLowerCase()}`;

  return (
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

          <div style={{ padding:"32px 36px 36px", background:"#FEF5EC" }}>

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

          </div>
        </div>

        {/* Actions */}
        <div style={{ display:"flex", gap:10, padding:"16px 20px", justifyContent:"flex-end" }}>
          <Btn variant="outline" onClick={onClose}>Close</Btn>
          <Btn onClick={() => { alert("Certificate download would trigger here in production!"); onClose(); }}>
            <Icon name="download" size={14} color="#fff"/> Download PDF
          </Btn>
        </div>
      </div>
    </div>
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
                <button onClick={() => { setPreviewOpen(false); onRegister(); }}
                  style={{ flexShrink:0, background:"linear-gradient(135deg,#3699ff,#a855f7)", border:"none", borderRadius:10, padding:"12px 24px", fontSize:14, fontWeight:700, color:"#fff", cursor:"pointer", whiteSpace:"nowrap" }}>
                  {registerLabel || "Register for this course"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Nav — only shown on public landing page, not when opened from dashboard */}
      {!registerLabel && (
        <nav style={{ position:"sticky", top:0, zIndex:100, background:"rgba(255,255,255,0.95)", backdropFilter:"blur(8px)", borderBottom:"1px solid #f0e8df", padding:"0 48px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", cursor:"pointer" }} onClick={onBack}>
            <img src="/Container.png" alt="SPED Summit" style={{ height:28, width:"auto", display:"block" }}/>
          </div>
          <button onClick={onRegister}
            style={{ padding:"9px 22px", background:"#181c32", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}
            onMouseEnter={e=>e.currentTarget.style.background="#3699ff"} onMouseLeave={e=>e.currentTarget.style.background="#181c32"}>
            Register for Free →
          </button>
        </nav>
      )}

      {/* Hero banner — full width */}
      <div style={{ background:gradients[si], padding:"40px 48px 48px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          {/* Breadcrumbs */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
            {[
              { label:"SPED Summit", onClick: onBack },
              { label: session.title.length > 52 ? session.title.slice(0,52)+"…" : session.title, current: true },
            ].map((crumb, i, arr) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:6, minWidth:0, flexShrink: i===arr.length-1?1:0 }}>
                {crumb.onClick
                  ? <button onClick={crumb.onClick} style={{ background:"none", border:"none", cursor:"pointer", fontSize:14, fontWeight:600, color:"rgba(255,255,255,0.85)", padding:0, whiteSpace:"nowrap" }}
                      onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.85)"}>
                      {crumb.label}
                    </button>
                  : <span style={{ fontSize:14, fontWeight: crumb.current ? 700 : 400, color: crumb.current ? "#fff" : "rgba(255,255,255,0.7)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {crumb.label}
                    </span>
                }
                {i < arr.length-1 && <Icon name="caret-right" size={12} color="rgba(255,255,255,0.4)"/>}
              </div>
            ))}
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
            <div style={{ width:52, height:52, borderRadius:"50%", flexShrink:0, border:"2px solid rgba(255,255,255,0.5)", overflow:"hidden", background:"linear-gradient(135deg,rgba(255,255,255,0.3),rgba(255,255,255,0.1))", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 12px rgba(0,0,0,0.2)" }}>
              <span style={{ fontSize:20, fontWeight:900, color:"#fff", letterSpacing:-0.5 }}>
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
                                {isQuiz ? `${l.questions} question${l.questions!==1?"s":""}` : l.duration}
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
            {/* Gradient preview thumbnail */}
            <div style={{ background:gradients[si], height:150, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", position:"relative" }}
              onClick={onRegister}>
              <div style={{ width:50, height:50, borderRadius:"50%", background:"rgba(255,255,255,0.25)", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid rgba(255,255,255,0.5)" }}>
                <Icon name="play" size={20} color="#fff"/>
              </div>
              <div style={{ position:"absolute", bottom:10, left:0, right:0, textAlign:"center", fontSize:12, color:"rgba(255,255,255,0.75)", fontWeight:500 }}>Preview this session</div>
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
              <button onClick={onRegister}
                style={{ width:"100%", padding:"13px 0", background:"#181c32", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:800, cursor:"pointer", marginBottom:8 }}
                onMouseEnter={e=>e.currentTarget.style.background="#3699ff"} onMouseLeave={e=>e.currentTarget.style.background="#181c32"}>
                {registerLabel || "Register for Free"}
              </button>
              {!registerLabel && <div style={{ fontSize:12, textAlign:"center", color:"#9ca3af", marginBottom:18 }}>No credit card required</div>}
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
              {hasRec ? "▶ Watch Recording" : "Recording Unavailable"}
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

function LandingPage({ onGetStarted }) {
  const [showAuth, setShowAuth] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [faqOpen, setFaqOpen] = useState(null);
  const [featuredPage, setFeaturedPage] = useState(0);
  const [testimonialPage, setTestimonialPage] = useState(0);

  const experts = [
    { name:"Tara Roehl",         role:"Mindfulness & Wellness",   img:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop&auto=format" },
    { name:"Casey Harrison",     role:"Inclusion Specialist",     img:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=300&fit=crop&auto=format" },
    { name:"Sydney Bassard",     role:"Dyslexia Expert",          img:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=300&fit=crop&auto=format" },
    { name:"Diana Williams",     role:"Leadership Coach",         img:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop&auto=format" },
    { name:"Farwa Husain",       role:"Curriculum Designer",      img:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop&auto=format" },
    { name:"Jordan Smith",       role:"Speech-Language Path.",    img:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&auto=format" },
    { name:"Sam Parmelee",       role:"AAC Specialist",           img:"https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=300&fit=crop&auto=format" },
    { name:"Natasha Schaumburg", role:"Behavior Analyst",         img:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop&auto=format" },
    { name:"Rose Karentina",     role:"Data & Assessment",        img:"https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=300&fit=crop&auto=format" },
  ];

  const steps = [
    { n:"01", title:"Create Your Free Account",      desc:"Sign up in seconds and get instant access to the portal." },
    { n:"02", title:"Watch Expert-Led Sessions",     desc:"Access recordings from certified SPED professionals." },
    { n:"03", title:"Take Interactional Quizzes",    desc:"Test your knowledge and reinforce what you've learned." },
    { n:"04", title:"Track Your Progress",           desc:"Monitor completion rates and earn badges as you grow." },
    { n:"05", title:"Earn Your Certificate",         desc:"Complete all sessions and download your certificate." },
  ];

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

  if (selectedSession) {
    return (
      <>
        <SessionPublicPage
          session={selectedSession}
          onBack={() => setSelectedSession(null)}
          onRegister={() => setShowAuth(true)}
        />
        {showAuth && <AuthModal onClose={()=>setShowAuth(false)} onLogin={()=>onGetStarted(selectedSession?.id)}/>}
      </>
    );
  }

  return (
    <div style={{ minHeight:"100vh", fontFamily:"'Roboto','Segoe UI',system-ui,sans-serif", background:"#fffaf6", overflowX:"hidden", paddingTop:60 }}>

      {/* ── Nav ── */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:"rgba(255,250,246,0.92)", backdropFilter:"blur(8px)", borderBottom:"1px solid #f0e8df", padding:"0 48px", height:60, display:"flex", alignItems:"center", gap:32 }}>
        <div style={{ display:"flex", alignItems:"center", marginRight:"auto", cursor:"pointer" }}
          onClick={()=>window.scrollTo({ top:0, behavior:"smooth" })}>
          <img src="/Container.png" alt="SPED Summit" style={{ height:28, width:"auto", display:"block" }}/>
        </div>
        {[["Sessions","sessions"],["Instructors","instructors"],["Help","help"]].map(([l,id])=>(
          <button key={l} onClick={()=>document.getElementById(id)?.scrollIntoView({ behavior:"smooth" })}
            style={{ background:"none", border:"none", fontSize:14, color:"#5e6278", fontWeight:500, cursor:"pointer", padding:"4px 2px" }}
            onMouseEnter={e=>e.currentTarget.style.color="#181c32"}
            onMouseLeave={e=>e.currentTarget.style.color="#5e6278"}>{l}</button>
        ))}
        <button onClick={()=>setShowAuth(true)}
          style={{ marginLeft:16, padding:"9px 22px", background:"#3699ff", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer", transition:"background .15s" }}
          onMouseEnter={e=>e.currentTarget.style.background="#187de4"}
          onMouseLeave={e=>e.currentTarget.style.background="#3699ff"}>
          Go to Dashboard →
        </button>
      </nav>

      {/* ── Hero ── */}
      <section style={{ padding:"80px 48px 60px", maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 420px", gap:48, alignItems:"center" }}>
        <div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#e1f0ff", borderRadius:99, padding:"5px 14px", fontSize:12, fontWeight:700, color:"#3699ff", marginBottom:20, letterSpacing:.3 }}>
            <Icon name="star" size={13} color="#3699ff"/> 9 Science-Backed · 100% Free
          </div>
          <h1 style={{ margin:"0 0 16px", fontSize:52, fontWeight:900, color:"#181c32", lineHeight:1.1, letterSpacing:-1 }}>
            Learn from the<br/>best in <span style={{ color:"#3699ff" }}>SPED</span>
          </h1>
          <p style={{ margin:"0 0 32px", fontSize:16, color:"#5e6278", lineHeight:1.7, maxWidth:460 }}>
            Practical professional development in special education. Watch sessions, take quizzes, earn your certificate.
          </p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <button onClick={()=>setShowAuth(true)}
              style={{ padding:"14px 28px", background:"#3699ff", color:"#fff", border:"none", borderRadius:12, fontSize:16, fontWeight:700, cursor:"pointer", transition:"background .15s" }}
              onMouseEnter={e=>e.currentTarget.style.background="#187de4"}
              onMouseLeave={e=>e.currentTarget.style.background="#3699ff"}>
              Continue Learning →
            </button>
            <button onClick={()=>setShowAuth(true)}
              style={{ padding:"14px 28px", background:"transparent", color:"#5e6278", border:"1.5px solid #e4e6ef", borderRadius:12, fontSize:16, fontWeight:600, cursor:"pointer" }}>
              Explore Sessions
            </button>
          </div>
          <div style={{ marginTop:28, display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ display:"flex" }}>
              {[
                "https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=56&h=56&fit=crop&auto=format",
                "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=56&h=56&fit=crop&auto=format",
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=56&h=56&fit=crop&auto=format",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=56&h=56&fit=crop&auto=format",
                "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=56&h=56&fit=crop&auto=format",
              ].map((src,i)=>(
                <img key={i} src={src} alt="" style={{ width:28, height:28, borderRadius:"50%", objectFit:"cover", border:"2px solid #fffaf6", marginLeft:i?-8:0, display:"block" }}/>
              ))}
            </div>
            <span style={{ fontSize:14, color:"#7e8299" }}>Join <strong style={{ color:"#181c32" }}>4,200+</strong> educators already learning</span>
          </div>
        </div>
        {/* Hero visual */}
        <div style={{ position:"relative" }}>
          <div style={{ background:"linear-gradient(135deg,#e1f0ff 0%,#ede9fe 100%)", borderRadius:24, aspectRatio:"4/5", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", position:"relative" }}>
            <img src="/LandingPage.png" alt="Educator" style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top", display:"block" }}/>
            <div style={{ position:"absolute", bottom:20, left:20, right:20, background:"rgba(255,255,255,0.92)", borderRadius:14, padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:"#50cd89", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon name="check-circle" size={18} color="#fff"/>
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:"#181c32" }}>Certificate Earned!</div>
                <div style={{ fontSize:12, color:"#7e8299" }}>Mindfulness in SPED · Session 1</div>
              </div>
            </div>
          </div>
          <div style={{ position:"absolute", top:-12, right:-12, background:"#ffc700", borderRadius:12, padding:"8px 14px", fontSize:12, fontWeight:800, color:"#181c32", boxShadow:"0 4px 16px rgba(0,0,0,0.12)" }}>🏆 Top Rated</div>
        </div>
      </section>

      {/* ── Featured Sessions ── */}
      <section id="sessions" style={{ padding:"48px 48px", background:"#fff", borderTop:"1px solid #f0e8df", borderBottom:"1px solid #f0e8df" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:28 }}>
            <div>
              <div style={{ fontSize:12, color:"#3699ff", fontWeight:700, letterSpacing:1, marginBottom:8 }}>FEATURED SESSIONS</div>
              <h2 style={{ margin:0, fontSize:32, fontWeight:900, color:"#181c32" }}>Start watching today</h2>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              {(() => {
                const allSessions = SESSIONS.filter(s => !isSessionArchived(s.id));
                return [["chevron-left", () => setFeaturedPage(p => Math.max(0, p-1)), featuredPage === 0],
                  ["chevron-right", () => setFeaturedPage(p => Math.min(Math.ceil(allSessions.length/4)-1, p+1)), featuredPage >= Math.ceil(allSessions.length/4)-1]
                ].map(([icon, onClick, disabled], idx) => (
                  <button key={idx} onClick={onClick} disabled={disabled}
                    style={{ width:48, height:48, borderRadius:"50%", border:"1.5px solid #e8ddd5", background:"#fdf8f4", display:"flex", alignItems:"center", justifyContent:"center", cursor:disabled?"not-allowed":"pointer", opacity:disabled?0.4:1, transition:"border-color .15s, background .15s" }}
                    onMouseEnter={e=>{ if(!disabled){ e.currentTarget.style.borderColor="#c4b5a5"; e.currentTarget.style.background="#f5ede6"; }}}
                    onMouseLeave={e=>{ e.currentTarget.style.borderColor="#e8ddd5"; e.currentTarget.style.background="#fdf8f4"; }}>
                    <Icon name={icon} size={16} color="#8a9ab0"/>
                  </button>
                ));
              })()}
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px,1fr))", gap:16 }}>
            {(() => {
              const sessionImgs = [
                "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=480&h=260&fit=crop&auto=format",
                "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=480&h=260&fit=crop&auto=format",
                "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=480&h=260&fit=crop&auto=format",
                "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=480&h=260&fit=crop&auto=format",
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=480&h=260&fit=crop&auto=format",
                "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=480&h=260&fit=crop&auto=format",
              ];
              const allSessions = SESSIONS.filter(s => !isSessionArchived(s.id));
              return allSessions.slice(featuredPage*4, featuredPage*4+4).map((s,i)=>{
                const imgIdx = featuredPage*4+i;
                const avail = SESSION_AVAILABILITY[s.id];
                return (
                  <LandingSessionCard key={s.id} s={s} imgSrc={sessionImgs[imgIdx % sessionImgs.length]} onClick={()=>setSelectedSession(s)} availableFrom={avail?.availableFrom} sessionState={getSessionState(s.id)}/>
                );
              });
            })()}
          </div>
        </div>
      </section>

      {/* ── Experts ── */}
      <section id="instructors" style={{ padding:"64px 48px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ fontSize:12, color:"#3699ff", fontWeight:700, letterSpacing:1, marginBottom:8 }}>WORLD-CLASS INSTRUCTORS</div>
        <h2 style={{ margin:"0 0 36px", fontSize:32, fontWeight:900, color:"#181c32" }}>9 Experts. Real strategies.</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16 }}>
          {experts.map((e,i)=>(
            <div key={i} style={{ borderRadius:16, overflow:"hidden", position:"relative", cursor:"pointer", transition:"transform .15s", boxShadow:"0 2px 12px rgba(0,0,0,0.07)" }}
              onMouseEnter={ev=>ev.currentTarget.style.transform="scale(1.02)"}
              onMouseLeave={ev=>ev.currentTarget.style.transform=""}>
              <div style={{ height:180, position:"relative", overflow:"hidden" }}>
                <img src={e.img} alt={e.name} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top", display:"block" }}/>
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)" }}/>
              </div>
              <div style={{ background:"#fff", padding:"12px 16px", borderTop:"1px solid #f0f0f0" }}>
                <div style={{ fontWeight:700, fontSize:14, color:"#181c32" }}>{e.name}</div>
                <div style={{ fontSize:12, color:"#7e8299", marginTop:2 }}>{e.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Giveaways ── */}
      <section style={{ padding:"72px 48px", background:"#fff", borderTop:"1px solid #f0f0f0" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>
          {/* Left */}
          <div>
            <div style={{ fontSize:12, color:"#3699ff", fontWeight:700, letterSpacing:1, marginBottom:12 }}>PRIZES & GIVEAWAYS</div>
            <h2 style={{ margin:"0 0 16px", fontSize:36, fontWeight:900, color:"#181c32", lineHeight:1.2 }}>
              Starbucks Gift Cards, TpT Resources, AbleSpace Subscriptions, <span style={{ color:"#3699ff" }}>and much more…</span>
            </h2>
            <p style={{ margin:"0 0 28px", fontSize:16, color:"#7e8299", lineHeight:1.7 }}>
              We have multiple giveaways lined up for you during the entire conference. Raffles, quizzes, and surprise gifts. Get ready to learn and get ready to win!
            </p>
            <button onClick={()=>setShowAuth(true)}
              style={{ padding:"14px 30px", background:"#3699ff", color:"#fff", border:"none", borderRadius:12, fontSize:14, fontWeight:700, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8, transition:"background .15s" }}
              onMouseEnter={e=>e.currentTarget.style.background="#187de4"}
              onMouseLeave={e=>e.currentTarget.style.background="#3699ff"}>
              Register for Free →
            </button>
          </div>

          {/* Right — prize visual */}
          <div style={{ position:"relative", height:320 }}>
            <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center", zIndex:2 }}>
              <div style={{ fontSize:48, fontWeight:900, color:"#181c32", lineHeight:1 }}>$10,000<span style={{ color:"#3699ff" }}>+</span></div>
              <div style={{ fontSize:14, fontWeight:600, color:"#7e8299", marginTop:4, letterSpacing:.5 }}>in Prizes & Giveaways</div>
            </div>
            {[
              { label:"Starbucks", emoji:"☕", bg:"#00704a", color:"#fff", top:"4%",  left:"56%", size:72 },
              { label:"TpT",       emoji:"📚", bg:"#ff6d00", color:"#fff", top:"62%", left:"68%", size:60 },
              { label:"AbleSpace", emoji:"🎯", bg:"#3699ff", color:"#fff", top:"70%", left:"8%",  size:64 },
              { label:"Gift Card", emoji:"🎁", bg:"#7c3aed", color:"#fff", top:"8%",  left:"10%", size:58 },
              { label:"Cash",      emoji:"💵", bg:"#059669", color:"#fff", top:"38%", left:"78%", size:54 },
            ].map((b,i) => (
              <div key={i} style={{ position:"absolute", top:b.top, left:b.left, width:b.size, height:b.size, borderRadius:"50%", background:b.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", boxShadow:"0 8px 24px rgba(0,0,0,0.14)", zIndex:1 }}>
                <span style={{ fontSize:b.size*0.36, lineHeight:1 }}>{b.emoji}</span>
              </div>
            ))}
            {[
              { top:"2%",  left:"42%", size:12, bg:"#ffc700", opacity:.8 },
              { top:"78%", left:"40%", size:10, bg:"#3699ff", opacity:.5 },
              { top:"22%", left:"72%", size:8,  bg:"#f1416c", opacity:.6 },
            ].map((s,i) => (
              <div key={i} style={{ position:"absolute", top:s.top, left:s.left, width:s.size, height:s.size, borderRadius:3, background:s.bg, opacity:s.opacity, transform:"rotate(20deg)" }}/>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ padding:"80px 48px", background:"#fffaf6", borderTop:"1px solid #f0e8df", borderBottom:"1px solid #f0e8df" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <h2 style={{ margin:"0 0 12px", fontSize:32, fontWeight:900, color:"#1a2e2a", textAlign:"center" }}>How it works</h2>
          <p style={{ margin:"0 0 64px", fontSize:16, color:"#6b7280", textAlign:"center" }}>From sign-up to certificate in four simple steps.</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:40 }}>
            {[
              { n:"01", title:"Create account",  desc:"Sign up for free in seconds. No credit card required." },
              { n:"02", title:"Watch sessions",  desc:"Stream expert-led video sessions at your own pace." },
              { n:"03", title:"Take quizzes",    desc:"Test your knowledge with interactive quizzes after each session." },
              { n:"04", title:"Get certified",   desc:"Pass all quizzes with 75%+ and download your certificate." },
            ].map((s,i)=>(
              <div key={i}>
                <div style={{ fontSize:72, fontWeight:900, color:"#d1dbd9", lineHeight:1, marginBottom:20, letterSpacing:-2 }}>{s.n}</div>
                <div style={{ fontWeight:800, fontSize:16, color:"#1a2e2a", marginBottom:10 }}>{s.title}</div>
                <div style={{ fontSize:14, color:"#6b7280", lineHeight:1.65 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sponsor: AbleSpace ── */}
      <section style={{ padding:"80px 48px", background:"linear-gradient(135deg,#eef6ff,#f0f9ff)", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:280, height:280, borderRadius:"50%", background:"rgba(54,153,255,0.08)" }}/>
        <div style={{ position:"absolute", bottom:-50, left:-50, width:220, height:220, borderRadius:"50%", background:"rgba(54,153,255,0.06)" }}/>
        <div style={{ position:"relative", maxWidth:560, margin:"0 auto" }}>
          <div style={{ marginBottom:20 }}>
            <img src="/ablespace.svg" alt="AbleSpace" style={{ height:56, display:"block", margin:"0 auto" }}/>
          </div>
          <h2 style={{ margin:"0 0 12px", fontSize:28, fontWeight:900, color:"#181c32" }}>Sponsored by AbleSpace</h2>
          <p style={{ margin:"0 0 32px", fontSize:14, color:"#5e6278", lineHeight:1.7 }}>
            An IEP Goal Tracking app built for special education professionals. Spend less time on paperwork and more time with your students using AbleSpace.
          </p>
          <a href="https://ablespace.io" target="_blank" rel="noopener noreferrer"
            style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"14px 32px", background:"#3699ff", color:"#fff", border:"none", borderRadius:12, fontSize:14, fontWeight:700, cursor:"pointer", textDecoration:"none", boxShadow:"0 4px 16px rgba(54,153,255,0.35)" }}
            onMouseEnter={e=>{ e.currentTarget.style.background="#187de4"; e.currentTarget.style.transform="translateY(-1px)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="#3699ff"; e.currentTarget.style.transform="none"; }}>
            Start Using AbleSpace for FREE
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding:"64px 48px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:36 }}>
          <div>
            <div style={{ fontSize:12, color:"#3699ff", fontWeight:700, letterSpacing:1, marginBottom:8 }}>LOVED BY EDUCATORS</div>
            <h2 style={{ margin:0, fontSize:32, fontWeight:900, color:"#181c32" }}>What Educators Are Saying</h2>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            {[["chevron-left", () => setTestimonialPage(p => Math.max(0, p-1)), testimonialPage === 0],
              ["chevron-right", () => setTestimonialPage(p => Math.min(Math.ceil(testimonials.length/2)-1, p+1)), testimonialPage >= Math.ceil(testimonials.length/2)-1]
            ].map(([icon, onClick, disabled], idx) => (
              <button key={idx} onClick={onClick} disabled={disabled}
                style={{ width:48, height:48, borderRadius:"50%", border:"1.5px solid #e8ddd5", background:"#fdf8f4", display:"flex", alignItems:"center", justifyContent:"center", cursor:disabled?"not-allowed":"pointer", opacity:disabled?0.4:1, transition:"border-color .15s, background .15s" }}
                onMouseEnter={e=>{ if(!disabled){ e.currentTarget.style.borderColor="#c4b5a5"; e.currentTarget.style.background="#f5ede6"; }}}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor="#e8ddd5"; e.currentTarget.style.background="#fdf8f4"; }}>
                <Icon name={icon} size={16} color="#8a9ab0"/>
              </button>
            ))}
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
          {testimonials.slice(testimonialPage*2, testimonialPage*2+2).map((t,i)=>(
            <div key={i} style={{ background:"#fff", borderRadius:16, padding:"24px 28px", border:"1px solid #f0e8df", boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ display:"flex", gap:3, marginBottom:14 }}>
                {Array(t.stars).fill(0).map((_,j)=><span key={j} style={{ color:"#ffc700", fontSize:16 }}>★</span>)}
              </div>
              <p style={{ margin:"0 0 20px", fontSize:14, color:"#5e6278", lineHeight:1.7, fontStyle:"italic" }}>"{t.text}"</p>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <img src={t.img} alt={t.name} style={{ width:36, height:36, borderRadius:"50%", objectFit:"cover", flexShrink:0 }}/>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:"#181c32" }}>{t.name}</div>
                  <div style={{ fontSize:12, color:"#a1a5b7" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Social Community ── */}
      <section style={{ padding:"72px 48px", background:"#fff", textAlign:"center" }}>
        <div style={{ maxWidth:680, margin:"0 auto" }}>
          <div style={{ fontSize:12, color:"#3699ff", fontWeight:700, letterSpacing:1.5, marginBottom:14 }}>COMMUNITY</div>
          <h2 style={{ margin:"0 0 16px", fontSize:36, fontWeight:900, color:"#181c32", lineHeight:1.15 }}>Connect with other educators on social media</h2>
          <p style={{ margin:"0 0 40px", fontSize:16, color:"#7e8299", lineHeight:1.65 }}>
            Stay in the loop! Follow us for updates, announcements, and<br/>community highlights.
          </p>
          <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
            {/* Facebook */}
            <button style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 28px", background:"#1877f2", color:"#fff", border:"none", borderRadius:40, fontSize:16, fontWeight:700, cursor:"pointer", transition:"opacity .15s" }}
              onMouseEnter={e=>e.currentTarget.style.opacity="0.88"}
              onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
              Join the Facebook Group
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
              </svg>
            </button>
            {/* Instagram */}
            <button style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 28px", background:"linear-gradient(135deg,#e1306c,#f77737)", color:"#fff", border:"none", borderRadius:40, fontSize:16, fontWeight:700, cursor:"pointer", transition:"opacity .15s" }}
              onMouseEnter={e=>e.currentTarget.style.opacity="0.88"}
              onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
              Follow on Instagram
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="help" style={{ padding:"64px 48px", borderTop:"1px solid #f0e8df" }}>
        <div style={{ maxWidth:720, margin:"0 auto" }}>
          <h2 style={{ margin:"0 0 36px", fontSize:32, fontWeight:900, color:"#181c32", textAlign:"center" }}>Frequently Asked Questions</h2>
          {faqs.map((f,i)=>(
            <div key={i} style={{ borderBottom:"1px solid #f0e8df" }}>
              <button onClick={()=>setFaqOpen(faqOpen===i?null:i)}
                style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 0", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}>
                <span style={{ fontSize:14, fontWeight:600, color:"#181c32", flex:1, paddingRight:16 }}>{f.q}</span>
                <span style={{ fontSize:18, color:"#a1a5b7", transform: faqOpen===i?"rotate(45deg)":"none", transition:"transform .2s", flexShrink:0 }}>+</span>
              </button>
              {faqOpen===i && (
                <div style={{ fontSize:14, color:"#7e8299", lineHeight:1.7, paddingBottom:18 }}>{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ padding:"80px 48px", background:"linear-gradient(135deg,#181c32,#1e3a5f)", textAlign:"center" }}>
        <h2 style={{ margin:"0 0 12px", fontSize:36, fontWeight:900, color:"#fff", letterSpacing:-.5 }}>
          Ready to level up your <span style={{ color:"#3699ff" }}>SPED practice</span>?
        </h2>
        <p style={{ margin:"0 0 32px", fontSize:16, color:"#a1a5b7", lineHeight:1.6 }}>Join thousands of educators already transforming their classrooms.</p>
        <button onClick={()=>setShowAuth(true)}
          style={{ padding:"16px 40px", background:"#3699ff", color:"#fff", border:"none", borderRadius:14, fontSize:16, fontWeight:800, cursor:"pointer", transition:"background .15s" }}
          onMouseEnter={e=>e.currentTarget.style.background="#187de4"}
          onMouseLeave={e=>e.currentTarget.style.background="#3699ff"}>
          Go to Dashboard →
        </button>
      </section>

      {showAuth && <AuthModal onClose={()=>setShowAuth(false)} onLogin={()=>onGetStarted(null)}/>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   APP
───────────────────────────────────────────────────────────────────────────── */
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [activeSession,   setActiveSession]   = useState(null);
  const [sessionSource,   setSessionSource]   = useState("sessions");
  const [editingSession,  setEditingSession]  = useState(null);
  const { toasts, toast, remove } = useToast();

  /* ── Enrolled sessions (pre-seeded with sessions that have progress) ── */
  const [enrolledIds, setEnrolledIds] = useState(new Set([1, 2, 3]));
  const [userName, setUserName] = useState("Alex Johnson");
  const [scheduleRegistrations, setScheduleRegistrations] = useState({});
  const [sessionsDeepLink, setSessionsDeepLink] = useState(null);

  function enroll(sessionId) {
    setEnrolledIds(prev => new Set([...prev, sessionId]));
    toast({ type:"success", title:"Enrolled!", message:"Session added to your courses." });
  }

  /* ── Quiz state: { [sessionId]: { status, score, currentQ, answers } } ── */
  const [quizStates,        setQuizStates]        = useState({});
  const [assessmentSession, setAssessmentSession] = useState(null);
  const [certSession,       setCertSession]       = useState(null);

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
    if (passed) {
      toast({ type:"success", title:"🏆 Assessment Passed!", message:`You scored ${score}% — your certificate is ready!` });
    } else {
      toast({ type:"warning", title:"Assessment not passed", message:`You scored ${score}%. You need 80% to pass. Try again!` });
    }
  }

  function nav(p) { setPage(p); setActiveSession(null); setEditingSession(null); }
  function navToSeason(seasonId) { setSessionsDeepLink(seasonId); setPage("sessions"); setActiveSession(null); }

  function openEdit(s) { setEditingSession(s); setPage("admin-edit"); }

  function openSession(s, source) {
    setActiveSession(s);
    setSessionSource(source || page);
    setPage("session-detail");
  }

  function toggleAdmin() {
    const next = !isAdmin;
    setIsAdmin(next);
    setPage(next ? "admin-overview" : "dashboard");
    setActiveSession(null);
  }

  const quizProps = {
    quizStates,
    onAssessmentClick: handleAssessmentClick,
    onCertificateClick: handleCertificateClick,
  };

  function renderPage() {
    if (page==="session-detail" && activeSession)
      return <SessionDetail session={activeSession} onBack={()=>nav(isAdmin?"admin-sessions":sessionSource)} toast={toast} onAssessmentClick={handleAssessmentClick}/>;
    if (isAdmin) {
      if (page==="admin-overview") return <AdminOverview onNavigate={nav} onEditSession={openEdit} toast={toast}/>;
      if (page==="admin-sessions") return <AdminSessionsPage onNavigate={nav} onEditSession={openEdit} toast={toast}/>;
      if (page==="admin-create") return <AdminCreateSession onBack={()=>nav("admin-sessions")} toast={toast}/>;
      if (page==="admin-edit" && editingSession) return <AdminEditSession session={editingSession} onBack={()=>nav("admin-sessions")} toast={toast}/>;
      if (page==="admin-analytics") return <AnalyticsPage onEditSession={openEdit}/>;
    }
    if (page==="dashboard") return <Dashboard onNavigate={nav} onNavigateToSeason={navToSeason} onOpenSession={openSession} toast={toast} {...quizProps} enrolledIds={enrolledIds} onEnroll={enroll} scheduleRegistrations={scheduleRegistrations} setScheduleRegistrations={setScheduleRegistrations}/>;
    if (page==="sessions")  return <SessionsPage onOpenSession={openSession} toast={toast} {...quizProps} enrolledIds={enrolledIds} onNavigate={nav} initialSeason={sessionsDeepLink} scheduleRegistrations={scheduleRegistrations} setScheduleRegistrations={setScheduleRegistrations}/>;
    if (page==="schedules") return <SchedulePage onOpenSession={openSession} toast={toast} scheduleRegistrations={scheduleRegistrations} setScheduleRegistrations={setScheduleRegistrations}/>;
    if (page==="quizzes")   return <QuizzesPage  toast={toast}/>;
    if (page==="community") return <CommunityPage toast={toast}/>;
    if (page==="rewards")   return <RewardsPage toast={toast}/>;
    if (page==="profile")   return <ProfilePage toast={toast} userName={userName} onNameChange={setUserName}/>;
    return null;
  }

  const activePage = page==="session-detail" ? (isAdmin?"admin-sessions":"sessions") : page;

  if (!isLoggedIn) {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet"/>
        <LandingPage onGetStarted={(sessionId) => {
          setIsLoggedIn(true);
          if (sessionId) enroll(sessionId);
        }}/>
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
          setIsLoggedIn(false); setPage("dashboard"); setIsAdmin(false);
          setEnrolledIds(new Set([1,2,3])); setQuizStates({});
        }}
        onNavigateProfile={() => nav("profile")}
        onOpenSession={openSession}
        onNavigate={nav}
        userName={userName}
      />
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        <Sidebar active={activePage} onChange={nav} isAdmin={isAdmin}/>
        <div style={{ flex:1, overflowY:"auto" }}>{renderPage()}</div>
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
          --hero-bg: linear-gradient(120deg, #e1f0ff, #d6ebff);
          /* Metronic Primary Blue */
          --c-primary:#3699ff; --c-primaryDark:#187de4; --c-primaryLight:#e1f0ff; --c-primaryBorder:#b0d4ff;
          /* Metronic Feedback */
          --c-success:#50cd89; --c-successLight:#e8fff3; --c-successBorder:#b5f0d0;
          --c-warning:#ffc700; --c-warningLight:#fff8dd; --c-warningBorder:#ffe47d;
          --c-error:#f1416c; --c-errorLight:#fff5f8; --c-errorBorder:#ffbccd;
          --c-info:#7239ea; --c-infoLight:#f8f5ff; --c-infoBorder:#cbbcf5;
          /* Metronic Typography Gray Scale */
          --c-gray50:#f5f8fa; --c-gray100:#eff2f5; --c-gray200:#e4e6ef; --c-gray300:#b5b5c3;
          --c-gray400:#a1a5b7; --c-gray500:#7e8299; --c-gray600:#5e6278; --c-gray700:#3f4254;
          --c-gray800:#3f4254; --c-gray900:#181c32; --c-white:#ffffff;
        }
        [data-theme="dark"] {
          --hero-bg: linear-gradient(120deg, #1e2647, #151b30);
          /* Metronic Primary Blue (dark) */
          --c-primary:#3699ff; --c-primaryDark:#5eaeff; --c-primaryLight:#1c2e4a; --c-primaryBorder:#1e3a5f;
          /* Metronic Feedback (dark) */
          --c-success:#50cd89; --c-successLight:#0e2d1f; --c-successBorder:#1a5c3a;
          --c-warning:#ffc700; --c-warningLight:#2a1f00; --c-warningBorder:#5a4200;
          --c-error:#f1416c; --c-errorLight:#2d0f18; --c-errorBorder:#5c1a2c;
          --c-info:#7239ea; --c-infoLight:#1e1530; --c-infoBorder:#3d2170;
          /* Metronic Sidebar Dark Scale */
          --c-gray50:#1e1e2d; --c-gray100:#2b2b40; --c-gray200:#3a3a53; --c-gray300:#474761;
          --c-gray400:#565674; --c-gray500:#7e8299; --c-gray600:#a1a5b7; --c-gray700:#cdcde0;
          --c-gray800:#e4e6ef; --c-gray900:#f5f8fa; --c-white:#1e1e2d;
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
