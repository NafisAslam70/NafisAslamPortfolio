'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaBolt,
  FaCalendarAlt,
  FaChartLine,
  FaExternalLinkAlt,
  FaLink,
  FaFilm,
  FaHome,
  FaPlayCircle,
  FaPenFancy,
  FaRegClock,
  FaRocket,
  FaArrowRight,
  FaMagic,
  FaWhatsapp,
  FaCode,
  FaFlask,
  FaChartBar,
} from "react-icons/fa";

const DC_ORIGIN = "https://deep-calendar.vercel.app";
const DC_TOKEN = "18e42020c705668bbfd96cabe813ba61d229abe75dea2d7d";
const HERO_ROLES = ["data scientist", "AI developer", "AI researcher", "focus systems architect"];
const GITHUB_USERNAME = "NafisAslam70"; // GitHub handle
const NAV_SECTIONS = [
  { id: "overview", label: "Overview", icon: FaHome },
  { id: "stats", label: "Quick Stats", icon: FaRegClock },
  { id: "systems", label: "Focus Systems", icon: FaCalendarAlt },
  { id: "reels", label: "Reels", icon: FaFilm },
  { id: "writing", label: "Writing", icon: FaPenFancy },
  { id: "builds", label: "Ventures & Products", icon: FaBolt },
  { id: "services", label: "Services", icon: FaRocket },
];

const BUILD_TABS = [
  { id: "ventures", label: "Ventures" },
  { id: "products", label: "Products" },
];

// ---------- Design tokens ----------

const sparkleKeyframes = `
@keyframes hire-card-sparkle {
  0% { transform: translateX(-140%) scale(0.85); opacity: 0; }
  35% { opacity: 0.8; }
  55% { opacity: 0.45; }
  100% { transform: translateX(140%) scale(1.05); opacity: 0; }
}
@keyframes hire-card-pulse {
  0%, 100% { box-shadow: 0 0 0 rgba(99,102,241,0.0); }
  50% { box-shadow: 0 0 26px rgba(99,102,241,0.45); }
}
.hire-cta-card {
  position: relative;
  overflow: hidden;
  animation: hire-card-pulse 4.2s ease-in-out infinite;
  will-change: box-shadow;
}
.hire-cta-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent 5%, rgba(255,255,255,0.8) 45%, transparent 80%);
  transform: translateX(-140%);
  animation: hire-card-sparkle 3.2s linear infinite;
  pointer-events: none;
  mix-blend-mode: screen;
}
`;

const SURFACE =
  "rounded-3xl border border-indigo-200/50 bg-white/75 backdrop-blur-md shadow-[0_10px_30px_-12px_rgba(2,6,23,0.15)] dark:bg-white/[0.05] dark:border-white/10";
const SECTION_CONTAINER = "container mx-auto max-w-screen-2xl px-6 md:px-10";

const PRODUCT_LINKS = [
  {
    label: "Meedian AI Flow",
    href: "https://meedian-ai-flow-v2.vercel.app/",
    description:
      "One browser experience across the team for managing tasks, collaboration rooms, deep rituals, chat, attendance, and meeting notes.",
    icon: FaLink,
    accent: "sky",
    badge: "New",
    highlight: true,
  },
  {
    label: "DeepWork AI",
    href: "https://deep-work-ai-nu.vercel.app/",
    description: "Focus OS with sprint rooms, nudges, and reflections.",
    icon: FaBolt,
    accent: "indigo",
  },
  {
    label: "Deep Calendar",
    href: "https://deep-calendar.vercel.app/auth/signin?next=%2F",
    description: "Depth blocks and day-close ritual planner.",
    icon: FaCalendarAlt,
    accent: "violet",
  },
  {
    label: "Meed Public School",
    href: "https://www.mymeedai.org/",
    description: "Systems-first schooling blueprint in Kuala Lumpur.",
    icon: FaRocket,
    accent: "rose",
  },
];

const CONTACT_LINKS = [
  {
    label: "Email",
    href: "mailto:nafisaslam70@gmail.com",
    hoverText: "nafisaslam70@gmail.com",
    icon: FaLink,
    accent: "amber",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/60172641454",
    hoverText: "+60 17-264 1454",
    icon: FaWhatsapp,
    accent: "emerald",
  },
];

const PRODUCT_ACCENTS = {
  indigo: {
    ring: "border-indigo-200/70 hover:border-indigo-300",
    icon: "text-indigo-600 dark:text-indigo-300",
    hover: "hover:text-indigo-600 dark:hover:text-indigo-300",
    glow: "from-indigo-400 via-purple-400 to-pink-400",
    bubble: "bg-indigo-500/20",
  },
  violet: {
    ring: "border-violet-200/70 hover:border-violet-300",
    icon: "text-violet-600 dark:text-violet-300",
    hover: "hover:text-violet-600 dark:hover:text-violet-300",
    glow: "from-violet-400 via-indigo-400 to-purple-500",
    bubble: "bg-violet-500/20",
  },
  sky: {
    ring: "border-sky-200/70 hover:border-sky-300",
    icon: "text-sky-600 dark:text-sky-300",
    hover: "hover:text-sky-600 dark:hover:text-sky-300",
    glow: "from-sky-400 via-cyan-400 to-sky-500",
    bubble: "bg-sky-500/25",
  },
  rose: {
    ring: "border-rose-200/70 hover:border-rose-300",
    icon: "text-rose-600 dark:text-rose-300",
    hover: "hover:text-rose-600 dark:hover:text-rose-300",
    glow: "from-rose-400 via-pink-400 to-rose-500",
    bubble: "bg-rose-500/20",
  },
  amber: {
    ring: "border-amber-200/70 hover:border-amber-300",
    icon: "text-amber-600 dark:text-amber-300",
    hover: "hover:text-amber-600 dark:hover:text-amber-300",
    glow: "from-amber-400 via-orange-400 to-amber-500",
    bubble: "bg-amber-500/20",
  },
  emerald: {
    ring: "border-emerald-200/70 hover:border-emerald-300",
    icon: "text-emerald-600 dark:text-emerald-300",
    hover: "hover:text-emerald-600 dark:hover:text-emerald-300",
    glow: "from-emerald-400 via-teal-400 to-emerald-500",
    bubble: "bg-emerald-500/20",
  },
};

const SERVICE_ROLES = [
  {
    title: "AI & Web Developer",
    highlight: ["Product engineering", "Agentic UX", "Launch & handoff"],
    icon: FaCode,
    accent: "indigo",
  },
  {
    title: "AI Research + Model Building",
    highlight: ["Experiment design", "Model training & eval", "Guardrails & QA"],
    icon: FaFlask,
    accent: "violet",
  },
  {
    title: "Data Science & Analysis",
    highlight: ["Signal pipelines", "Exploratory insights", "Story-driven metrics"],
    icon: FaChartBar,
    accent: "sky",
  },
];

const CARD_HOVER_FLOAT = {
  y: -6,
  rotate: 0.2,
  scale: 1.01,
  transition: { type: "spring", stiffness: 260, damping: 20 },
};

const CARD_TAP_PRESS = { scale: 0.995, rotate: 0 };

// ---------- Utils ----------
function dcUrl(path) {
  const base = DC_ORIGIN.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}/api/public/${DC_TOKEN}${p}`;
}

async function getJsonAbs(url) {
  try {
    const r = await fetch(url, { mode: "cors", cache: "no-store" });
    if (!r.ok) throw new Error(String(r.status));
    return await r.json();
  } catch {
    return null;
  }
}

function formatDate(d) {
  try {
    const dt = typeof d === "string" ? new Date(d) : d;
    return dt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return d ?? "";
  }
}

function fromMinutes(m) {
  const H = String(Math.floor(m / 60)).padStart(2, "0");
  const M = String(m % 60).padStart(2, "0");
  return `${H}:${M}`;
}

function humanMinutes(mins) {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function depthBadge(d) {
  if (d === 3) return { text: "Deep", border: "#6366f1", bg: "#6366f11a" };
  if (d === 2) return { text: "Medium", border: "#0ea5e9", bg: "#0ea5e91a" };
  return { text: "Light", border: "#f59e0b", bg: "#f59e0b1a" };
}

function reelYoutubeId(reel) {
  if (!reel) return null;
  const url = reel.ref || reel.url;
  const explicitId =
    reel.youtubeId ||
    reel.youtube_id ||
    (reel.type && /youtube/i.test(reel.type) && typeof reel.id === "string" ? reel.id : null);

  if (explicitId) return explicitId;
  if (typeof url !== "string") return null;
  const match = url.match(/(?:v=|youtu\.be\/|shorts\/)([A-Za-z0-9_-]{6,})/);
  return match ? match[1] : null;
}

function reelThumbnail(reel) {
  if (!reel) return "/white2.jpg";
  if (typeof reel.thumbnail === "string" && reel.thumbnail.trim()) return reel.thumbnail.trim();
  const id = reelYoutubeId(reel);
  if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  return "/white2.jpg";
}

function reelEmbedUrl(reel) {
  const id = reelYoutubeId(reel);
  if (!id) return null;
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${id}`;
}

const fadeIn = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } },
};

// ---------- Small shared components ----------
function GradientDivider() {
  return (
    <div className={`${SECTION_CONTAINER} py-6`}>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-200/70 to-transparent dark:via-white/10" />
    </div>
  );
}

function StatCard({ icon, label, value, hint }) {
  return (
    <motion.div className={`${SURFACE} p-5`} whileHover={CARD_HOVER_FLOAT} whileTap={CARD_TAP_PRESS}>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
          {icon}
        </span>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</div>
          <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">{value}</div>
        </div>
      </div>
      {hint ? (
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          {hint}
        </div>
      ) : null}
    </motion.div>
  );
}

function ActiveBlockView({ item }) {
  const badge = depthBadge(item.depthLevel);
  const durMin = Math.max(1, item.endMin - item.startMin);
  return (
    <div
      className="rounded-2xl border px-3 py-2 text-sm shadow-sm"
      style={{ borderColor: badge.border, background: badge.bg }}
      title={`Depth ${badge.text}`}
    >
      <div className="flex items-center justify-between text-xs font-semibold text-gray-800 dark:text-gray-100">
        <span className="truncate">{item.label ?? "Deep block"}</span>
        <span>{fromMinutes(item.startMin)}–{fromMinutes(item.endMin)}</span>
      </div>
      <div className="mt-1 flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-300">
        <span>{badge.text}</span>
        <span>{humanMinutes(durMin)}</span>
      </div>
    </div>
  );
}

function RoutineModal({ open, onClose, items, window, goalById }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-950">
        <div className="flex items-center justify-between border-b px-5 py-4 dark:border-slate-800">
          <div className="text-sm font-semibold">Today’s Deep Calendar • {formatDate(new Date())}</div>
          <button onClick={onClose} className="rounded-full border px-3 py-1 text-xs hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-900">
            Close
          </button>
        </div>
        <div className="max-h-[70vh] overflow-auto px-5 py-4 space-y-4">
          <div className="rounded-2xl bg-gray-50 px-4 py-3 text-xs text-gray-600 dark:bg-slate-900 dark:text-gray-300">
            Window: {window ? <b>{fromMinutes(window.openMin)} – {fromMinutes(window.closeMin)}</b> : "—"}
          </div>
          {Array.isArray(items) && items.length ? (
            <ul className="space-y-2 text-sm">
              {items.map((it, idx) => {
                const badge = depthBadge(it.depthLevel);
                const durMin = Math.max(1, it.endMin - it.startMin);
                const goalLabel = it.goalId && goalById[it.goalId]?.label ? goalById[it.goalId].label : null;
                return (
                  <li
                    key={it.id ?? idx}
                    className="rounded-2xl border px-4 py-3"
                    style={{ borderColor: badge.border, background: badge.bg }}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>{fromMinutes(it.startMin)} – {fromMinutes(it.endMin)}</span>
                      <span>{badge.text}</span>
                    </div>
                    <div className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {it.label ?? "Focus block"}
                    </div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                      {goalLabel ? `Goal: ${goalLabel}` : "Unassigned"} • {humanMinutes(durMin)}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-sm text-gray-600 dark:text-gray-300">No blocks scheduled for today.</div>
          )}
          <div className="rounded-2xl bg-gray-50 px-4 py-3 text-xs text-gray-600 dark:bg-slate-900 dark:text-gray-300">
            Powered by <span className="font-semibold text-indigo-600 dark:text-indigo-400">Deep Calendar</span>.{" "}
            <a href={DC_ORIGIN} target="_blank" rel="noreferrer" className="text-indigo-600 underline dark:text-indigo-400">
              Explore the planner →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsModal({ open, onClose, goals, stats7d, summary30d }) {
  if (!open) return null;
  const total7h = ((stats7d?.totalSec ?? stats7d?.totals?.totalSec ?? stats7d?.total_seconds ?? 0) / 3600).toFixed(1);
  const total30h = ((summary30d?.totalSec ?? summary30d?.totals?.totalSec ?? summary30d?.total_seconds ?? 0) / 3600).toFixed(1);
  const byGoal = (() => {
    const raw = summary30d?.goals || summary30d?.byGoal || [];
    if (Array.isArray(raw) && raw.length) {
      return raw
        .map((g) => ({
          id: g.id ?? g.goalId,
          label: g.label ?? g.name ?? `Goal #${g.id ?? g.goalId}`,
          hours: (g.totalSec ?? g.seconds ?? 0) / 3600,
        }))
        .sort((a, b) => b.hours - a.hours);
    }
    return (goals || []).map((g) => ({ id: g.id, label: g.label, hours: 0 }));
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-1">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-950">
        <div className="flex items-center justify-between border-b px-5 py-4 text-sm font-semibold dark:border-slate-800">
          Focus analytics
          <button onClick={onClose} className="rounded-full border px-3 py-1 text-xs hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-900">
            Close
          </button>
        </div>
        <div className="max-h-[70vh] overflow-auto px-5 py-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border p-4 text-sm shadow-sm dark:border-slate-800">
              <div className="text-xs uppercase tracking-wide text-gray-500">Total focus (7 days)</div>
              <div className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-100">{total7h} hrs</div>
            </div>
            <div className="rounded-2xl border p-4 text-sm shadow-sm dark:border-slate-800">
              <div className="text-xs uppercase tracking-wide text-gray-500">Total focus (30 days)</div>
              <div className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-100">{total30h} hrs</div>
            </div>
          </div>
          <div className="rounded-2xl border p-4 shadow-sm dark:border-slate-800">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Goals — last 30 days</div>
            {byGoal.length ? (
              <ul className="mt-3 space-y-2 text-sm">
                {byGoal.map((g) => (
                  <li key={g.id} className="flex items-center justify-between">
                    <span className="truncate text-gray-800 dark:text-gray-200">{g.label}</span>
                    <span className="ml-2 shrink-0 text-gray-500">{g.hours.toFixed(1)}h</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">No goal data yet.</div>
            )}
          </div>
          <div className="rounded-2xl bg-gray-50 px-4 py-3 text-xs text-gray-600 dark:bg-slate-900 dark:text-gray-300">
            Insights powered by <span className="font-semibold text-indigo-600 dark:text-indigo-400">Deep Calendar</span>.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClientDashboard({ posts = [], now, reels = [], ventures = [], nbsNodes }) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("hire-sparkle-animation")) {
      const style = document.createElement("style");
      style.id = "hire-sparkle-animation";
      style.innerHTML = sparkleKeyframes;
      document.head.appendChild(style);
    }
  }, []);

  const [dcLoading, setDcLoading] = useState(true);
  const [todayItems, setTodayItems] = useState([]);
  const [todayWindow, setTodayWindow] = useState(null);
  const [goals, setGoals] = useState([]);
  const [stats7d, setStats7d] = useState(null);
  const [summary30d, setSummary30d] = useState(null);
  const [modalDayOpen, setModalDayOpen] = useState(false);
  const [modalStatsOpen, setModalStatsOpen] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [typedRole, setTypedRole] = useState("");
  const [isDeletingRole, setIsDeletingRole] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [activeBuildTab, setActiveBuildTab] = useState(BUILD_TABS[0].id);
  const [hoveredReel, setHoveredReel] = useState(null);
  const heroVideoRef = useRef(null);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    const ensurePlayback = () => {
      video.defaultMuted = true;
      video.muted = true;
      video.playsInline = true;
      video.setAttribute("muted", "");
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.catch(() => {
          /* autoplay blocked by browser; ignore */
        });
      }
    };

    if (video.readyState >= 2) {
      requestAnimationFrame(ensurePlayback);
    } else {
      const handleCanPlay = () => requestAnimationFrame(ensurePlayback);
      video.addEventListener("canplay", handleCanPlay, { once: true });
      return () => {
        video.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, []);

  useEffect(() => {
    (async () => {
      setDcLoading(true);
      const weekday = new Date().getDay();
      const [routineRes, goalsRes, statsRes, sumRes] = await Promise.all([
        getJsonAbs(dcUrl(`/routine?weekday=${weekday}`)),
        getJsonAbs(dcUrl(`/goals`)),
        getJsonAbs(dcUrl(`/stats?range=7d`)),
        getJsonAbs(dcUrl(`/summary?range=30d`)),
      ]);

      if (routineRes) {
        const items = Array.isArray(routineRes.items) ? routineRes.items : [];
        setTodayItems(items.sort((a, b) => a.startMin - b.startMin));
        setTodayWindow(routineRes.window ?? null);
      }
      if (goalsRes) setGoals(Array.isArray(goalsRes) ? goalsRes : goalsRes.goals ?? []);
      if (statsRes) setStats7d(statsRes);
      if (sumRes) setSummary30d(sumRes);

      setDcLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-50% 0px -45% 0px", threshold: 0.1 },
    );

    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const currentRole = HERO_ROLES[roleIndex] || "";
    let delay = isDeletingRole ? 70 : 120;

    if (!isDeletingRole && typedRole === currentRole) {
      delay = 1400;
    } else if (isDeletingRole && typedRole === "") {
      delay = 400;
    }

    const timeout = setTimeout(() => {
      if (!isDeletingRole) {
        const next = currentRole.slice(0, typedRole.length + 1);
        setTypedRole(next);
        if (next === currentRole) setIsDeletingRole(true);
      } else {
        const next = currentRole.slice(0, Math.max(typedRole.length - 1, 0));
        setTypedRole(next);
        if (next === "") {
          setIsDeletingRole(false);
          setRoleIndex((prev) => (prev + 1) % HERO_ROLES.length);
        }
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [typedRole, isDeletingRole, roleIndex]);

  const nowMin = useMemo(() => {
    const n = new Date();
    return n.getHours() * 60 + n.getMinutes();
  }, []);

  const activeBlock = useMemo(
    () => todayItems.find((b) => b.startMin <= nowMin && nowMin < b.endMin) || null,
    [todayItems, nowMin],
  );

  const goalById = useMemo(() => {
    const map = {};
    (goals || []).forEach((g) => { map[g.id] = g; });
    return map;
  }, [goals]);

  const blocksToday = todayItems.length;

  const quickStats = [
    {
      label: "Products shipped",
      value: "4",
      hint: (
        <Link href="#builds" className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200">
          Explore builds
          <FaExternalLinkAlt className="text-[10px]" />
        </Link>
      ),
      icon: <FaRocket />,
    },
    {
      label: "Blocks today",
      value: dcLoading ? "…" : blocksToday || "0",
      hint: todayWindow
        ? `Window ${fromMinutes(todayWindow.openMin)} – ${fromMinutes(todayWindow.closeMin)}`
        : "No window set yet.",
      icon: <FaCalendarAlt />,
    },
    {
      label: "Ventures live",
      value: ventures.length ? `${ventures.length}` : "—",
      hint: "DeepWork AI, Meed Public School in rural Jharkhand, and more to come.",
      icon: <FaBolt />,
    },
    {
      label: "NBS network",
      value: typeof nbsNodes === "number" ? `${nbsNodes}` : "Growing",
      hint: "Nodes inside the Nafis Builder Society map.",
      icon: <FaChartLine />,
    },
  ];

  const featurePosts = posts.slice(0, 3);
  const featureReels = Array.isArray(reels) ? reels.slice(0, 3) : [];
  const ventureSpotlight = [
    {
      title: "DeepWork AI",
      summary: "Accountability rooms, focus nudges, and reflections engineered for distraction-proof execution.",
      actions: [
        { href: "/ventures/deepwork-ai", label: "Product tour", external: false, variant: "solid" },
        { href: "https://deep-work-ai-nu.vercel.app/", label: "Launch app", external: true, variant: "ghost" },
      ],
      variant: "primary",
    },
    {
      title: "Meed Public School",
      summary: "Remote Jharkhand school built from the ground up—serving 300+ families with disciplined operating systems.",
      actions: [
        { href: "/ventures/meed-public-school", label: "Explore case study", external: false, variant: "solid" },
        { href: "/pdfs/meed-my-journey.pdf", label: "Read the vision", external: true, variant: "ghost" },
      ],
    },
  ];
  const activeIndex = useMemo(
    () => Math.max(0, NAV_SECTIONS.findIndex((section) => section.id === activeSection)),
    [activeSection],
  );
  const handleNavClick = (id) => {
    if (typeof window === "undefined") return;
    const el = document.getElementById(id);
    if (!el) return;
    setActiveSection(id);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen">
      <nav className="pointer-events-none fixed left-2 top-24 z-40 hidden lg:block">
        <div className="pointer-events-auto relative w-[192px] overflow-hidden rounded-[1.8rem] border border-indigo-200/60 bg-white/80 p-3.5 shadow-xl backdrop-blur dark:border-white/10 dark:bg-white/[0.06]">
          <div className="absolute -left-24 top-10 h-36 w-36 rounded-full bg-indigo-400/25 blur-3xl dark:bg-indigo-500/25" />
          <div className="absolute -right-28 bottom-0 h-32 w-32 rounded-full bg-purple-400/25 blur-[110px] dark:bg-purple-600/20" />
          <div className="absolute left-[30px] top-6 bottom-16 w-px bg-gradient-to-b from-indigo-300/80 via-indigo-500/50 to-pink-400/50" />
          <ul className="relative flex flex-col gap-4">
            {NAV_SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <li key={section.id} className="relative pl-4">
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute left-0 right-3 top-1/2 h-12 -translate-y-1/2 rounded-2xl bg-gradient-to-r from-indigo-500/95 via-purple-500/85 to-pink-500/85 shadow-[0_18px_40px_-20px_rgba(79,70,229,0.85)]"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => handleNavClick(section.id)}
                    className={`group relative flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition duration-300 ${
                      isActive
                        ? "text-white"
                        : "text-slate-600 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-200"
                    }`}
                    aria-label={section.label}
                    aria-current={isActive ? "true" : undefined}
                    title={section.label}
                  >
                    <span
                      className={`relative flex h-10 w-10 items-center justify-center rounded-2xl border text-base transition duration-300 ${
                        isActive
                          ? "border-white/60 bg-white/15 text-white"
                          : "border-indigo-200/70 bg-white/80 text-indigo-600 shadow-sm group-hover:border-indigo-400 group-hover:bg-white dark:border-white/10 dark:bg-white/[0.08] dark:text-indigo-200"
                      }`}
                    >
                      <Icon />
                      {!isActive && (
                        <span className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100 dark:from-white/10" />
                      )}
                    </span>
                    <span
                      className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                        isActive
                          ? "max-w-[150px] opacity-95"
                          : "max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-90"
                      }`}
                    >
                      {section.label}
                    </span>
                    <span
                      className={`absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-400 to-pink-400 shadow-sm transition ${
                        isActive ? "scale-100 opacity-100" : "scale-50 opacity-0 group-hover:scale-90 group-hover:opacity-60"
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.08 }}
            className="mt-8 flex items-center justify-center gap-2 rounded-2xl border border-white/50 bg-white/70 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-indigo-600 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:text-indigo-200"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400" />
            {NAV_SECTIONS[activeIndex]?.label ?? "Overview"}
          </motion.div>
        </div>
      </nav>
      <aside className="pointer-events-none fixed right-2 top-24 z-40 hidden xl:block">
        <div className="pointer-events-auto flex flex-col items-end gap-4">
          <div className="relative w-[164px] overflow-visible rounded-[1.6rem] border border-indigo-200/60 bg-white/85 p-3 shadow-xl backdrop-blur dark:border-white/10 dark:bg-white/[0.08]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-purple-200/25 opacity-70 dark:from-white/[0.04] dark:via-indigo-900/30 dark:to-purple-900/25" />
            <div className="relative space-y-3 text-center">
              <div className="space-y-1">
                <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-indigo-500 dark:text-indigo-300">
                  Quick Access
                </div>
                <div className="mx-auto h-px w-10 bg-gradient-to-r from-indigo-400/80 to-purple-400/80" />
              </div>
              <ul className="flex flex-col items-center gap-3">
                {PRODUCT_LINKS.map((item) => {
                  const Icon = item.icon || FaLink;
                  const accent = PRODUCT_ACCENTS[item.accent ?? "indigo"];
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        title={item.label}
                        aria-label={item.label}
                        className={`group relative flex h-12 w-12 items-center justify-center rounded-2xl border bg-white/85 text-indigo-600 shadow-sm transition hover:-translate-y-1 dark:border-white/10 dark:bg-white/[0.1] ${accent?.ring ?? "border-indigo-200/70 hover:border-indigo-300"}`}
                      >
                        <Icon className={accent?.icon ?? "text-indigo-600 dark:text-indigo-300"} />
                        <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100 dark:from-white/10" />
                        <span className="pointer-events-none absolute right-full top-1/2 -translate-y-1/2 -translate-x-2 whitespace-nowrap rounded-md bg-slate-900 px-4 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 dark:bg-white/90 dark:text-slate-900">
                          {item.label}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
              <div className="pt-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-indigo-500 dark:text-indigo-300">
                  Contact
                </div>
                <div className="mx-auto mt-1 h-px w-8 bg-gradient-to-r from-indigo-400/60 to-purple-400/60" />
                <ul className="mt-3 flex flex-col items-center gap-3">
                  {CONTACT_LINKS.map((item) => {
                    const Icon = item.icon || FaLink;
                    const accent = PRODUCT_ACCENTS[item.accent ?? "indigo"];
                    return (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                          title={item.hoverText ?? item.label}
                          aria-label={item.hoverText ?? item.label}
                          className={`group relative flex h-12 w-12 items-center justify-center rounded-2xl border bg-white/85 text-indigo-600 shadow-sm transition hover:-translate-y-1 dark:border-white/10 dark:bg-white/[0.1] ${accent?.ring ?? "border-indigo-200/70 hover:border-indigo-300"}`}
                        >
                          <Icon className={accent?.icon ?? "text-indigo-600 dark:text-indigo-300"} />
                          <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100 dark:from-white/10" />
                          <span className="pointer-events-none absolute right-full top-1/2 -translate-y-1/2 -translate-x-2 whitespace-nowrap rounded-md bg-slate-900 px-4 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 dark:bg-white/90 dark:text-slate-900">
                            {item.hoverText ?? item.label}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div className="hire-cta-card relative w-[164px] overflow-hidden rounded-2xl border border-indigo-200/70 bg-gradient-to-br from-white/90 via-indigo-100/55 to-purple-100/45 p-4 text-center text-[11px] shadow-lg ring-1 ring-transparent transition duration-300 hover:shadow-indigo-300/35 hover:ring-indigo-200/60 dark:border-white/10 dark:from-white/[0.08] dark:via-indigo-900/25 dark:to-purple-900/20">
            <div className="font-semibold uppercase tracking-[0.28em] text-indigo-600 dark:text-indigo-300">Need a Builder?</div>
            <p className="mt-2 text-[11px] font-medium text-slate-600 dark:text-slate-200">Let’s scope your next sprint together.</p>
            <Link
              href="/hire-me"
              className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-indigo-600 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-white transition duration-300 hover:bg-indigo-500"
            >
              Hire Me
            </Link>
          </div>
        </div>
      </aside>

      {/* ---------- HERO ---------- */}
      <motion.section
        id="overview"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className={`${SECTION_CONTAINER} scroll-mt-32 pt-12 md:pt-16 lg:pt-24`}
      >
        <div className={`${SURFACE} relative overflow-hidden px-8 py-12 md:px-12 md:py-16`}>
          {/* soft inner gradient wash */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-indigo-200/20 to-purple-200/25 dark:from-white/[0.02] dark:via-indigo-900/10 dark:to-purple-900/15" />
          </div>

          <div className="relative grid gap-12 lg:grid-cols-[1.05fr,0.95fr] lg:items-center">
            {/* Left column */}
            <div className="order-2 space-y-8 text-gray-900 lg:order-1 dark:text-gray-100">
              <div className="flex items-start gap-8">
                <div className="min-w-0 flex-1">
                  <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                    Hi, I’m{" "}
                    <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      Nafis Aslam
                    </span>
                    <span className="mt-4 block text-lg font-medium text-slate-900 md:text-2xl dark:text-slate-200">
                      a {typedRole || ""}
                      <span className="ml-1 inline-block h-5 w-1 animate-pulse rounded bg-indigo-500/80 align-middle" />
                    </span>
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-900 md:text-base dark:text-slate-200">
                    <span className="inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-200">
                      Deep Work First
                    </span>{" "}
                    AI systems engineer focused on disciplined execution. Computer Science (AI) @ USM · MIT Data Science
                    MicroMasters. Founder of{" "}
                    <Link
                      href="/ventures/deepwork-ai"
                      className="font-serif text-base font-semibold text-slate-900 transition hover:text-indigo-500 dark:text-slate-100 dark:hover:text-indigo-200 md:text-lg"
                    >
                      DeepWork AI
                    </Link>{" "}
                    and co-founder at{" "}
                    <Link
                      href="/ventures/meed-public-school"
                      className="font-serif text-base font-semibold text-slate-900 transition hover:text-indigo-500 dark:text-slate-100 dark:hover:text-indigo-200 md:text-lg"
                    >
                      Meed
                    </Link>
                    . Open to data and AI roles where craft, rigor, and operating systems matter.
                  </p>
                </div>

                {/* Inline portrait (bigger, blended, with soft wave) */}
                <div className="hidden md:block shrink-0">
                  <div className="relative h-56 w-56 lg:h-72 lg:w-72">
                    <div className="absolute -inset-6 -z-10 rounded-[2.25rem] bg-gradient-to-br from-indigo-500/35 via-purple-500/25 to-pink-500/20 blur-2xl" />
                    <div className="relative h-full w-full overflow-hidden rounded-[2rem] border-4 border-white/80 shadow-[0_45px_120px_-45px_rgba(79,70,229,0.6)] dark:border-white/15">
                      <Image
                        src="/images/me1.jpg"
                        alt="Nafis portrait"
                        fill
                        className="object-cover scale-110"
                        priority
                      />
                      <div
                        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-70"
                        style={{
                          backgroundImage:
                            "radial-gradient(120% 80% at 10% 10%, rgba(255,255,255,.25) 0%, rgba(255,255,255,0) 60%)",
                        }}
                      />
                      <svg
                        className="pointer-events-none absolute inset-0 opacity-35 mix-blend-soft-light"
                        viewBox="0 0 400 400"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <defs>
                          <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d="M0,300 C70,270 140,330 210,300 C280,270 340,300 400,280 L400,400 L0,400 Z" fill="url(#waveGrad)" />
                        <path d="M0,260 C70,230 140,290 210,260 C280,230 340,260 400,240" fill="none" stroke="url(#waveGrad)" strokeWidth="6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature cards */}
              <div className="grid gap-3 text-sm text-slate-900 dark:text-slate-200 sm:grid-cols-3">
                <motion.div
                  className="relative overflow-hidden rounded-3xl border border-indigo-300/60 bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 px-4 py-4 text-white shadow-lg"
                  whileHover={CARD_HOVER_FLOAT}
                  whileTap={CARD_TAP_PRESS}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <FaMagic /> Meedian AI Flow
                    <span className="inline-flex items-center rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.3em]">New</span>
                  </div>
                  <p className="mt-2 text-xs text-white/85">
                    One workspace for tasks, rituals, chat, attendance, and notes.
                  </p>
                  <Link
                    href="https://meedian-ai-flow-v2.vercel.app/"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-indigo-600 transition hover:bg-white"
                  >
                    Launch app
                    <FaArrowRight className="h-3 w-3" />
                  </Link>
                </motion.div>
                <motion.div className={`${SURFACE} px-4 py-3 transition`} whileHover={CARD_HOVER_FLOAT} whileTap={CARD_TAP_PRESS}>
                  <div className="flex items-center gap-2 font-semibold text-indigo-700 dark:text-indigo-300">
                    <FaBolt /> DeepWork AI
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Focus rooms, accountability nudges, and reflections that protect shipping streaks.
                  </p>
                </motion.div>
                <motion.div className={`${SURFACE} px-4 py-3 transition`} whileHover={CARD_HOVER_FLOAT} whileTap={CARD_TAP_PRESS}>
                  <div className="flex items-center gap-2 font-semibold text-indigo-700 dark:text-indigo-300">
                    <FaChartLine /> MPS Society
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Remote Jharkhand school proving systems-first education for 300+ families.
                  </p>
                </motion.div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="https://meedian-ai-flow-v2.vercel.app/"
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
                  target="_blank"
                  rel="noreferrer"
                >
                  Launch Meedian AI Flow <FaExternalLinkAlt className="text-[11px]" />
                </Link>
                <Link
                  href="/ventures/deepwork-ai"
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
                >
                  Explore DeepWork AI <FaExternalLinkAlt className="text-[11px]" />
                </Link>
                <Link
                  href="/ventures"
                  className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:text-gray-200 dark:hover:bg-slate-900"
                >
                  All ventures <FaExternalLinkAlt className="text-[11px]" />
                </Link>
              </div>
            </div>

            {/* Right column – hero reel */}
            <div className="order-1 flex justify-center lg:order-2">
              <Link
                href="/reels"
                className="relative w-full max-w-3xl overflow-hidden rounded-[2.5rem] border border-white/60 shadow-[0_45px_120px_-45px_rgba(79,70,229,0.6)] transition hover:-translate-y-1"
              >
                <div className="relative" style={{ aspectRatio: "16 / 9" }}>
                  <video
                    ref={heroVideoRef}
                    className="absolute inset-0 h-full w-full object-cover"
                    src="/myvdo1.mov"
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/white2.jpg"
                    preload="auto"
                    style={{ pointerEvents: "none" }}
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/15 via-transparent to-purple-500/25" />
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      <GradientDivider />

      {/* ---------- QUICK STATS ---------- */}
      <section id="stats" className={`${SECTION_CONTAINER} scroll-mt-32`}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickStats.map((stat) => (
            <StatCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} hint={stat.hint} />
          ))}
        </div>
      </section>

      <GradientDivider />

      {/* ---------- 2-COLUMN BLOCK (Ventures card removed) ---------- */}
      <motion.section
        id="systems"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className={`${SECTION_CONTAINER} scroll-mt-32`}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {/* GitHub Overview */}
          <div className={`${SURFACE} space-y-4 p-6`}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">GitHub overview</h2>
              <span className="text-xs text-gray-500">Live snapshots</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Stats */}
              <div className="rounded-2xl border p-3">
                <div className="mb-2 text-xs text-gray-500">Stats</div>
                <Image
                  src={`https://github-readme-stats.vercel.app/api?username=${GITHUB_USERNAME}&show_icons=true&rank_icon=github&hide_title=false&theme=transparent`}
                  alt="GitHub Stats"
                  width={640}
                  height={320}
                  className="w-full rounded-md"
                  unoptimized
                />
              </div>

              {/* Top languages + Streak */}
              <div className="space-y-4">
                <div className="rounded-2xl border p-3">
                  <div className="mb-2 text-xs text-gray-500">Top languages</div>
                  <Image
                    src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${GITHUB_USERNAME}&layout=compact&langs_count=8&card_width=360&theme=transparent`}
                    alt="Top Languages"
                    width={640}
                    height={320}
                    className="w-full rounded-md"
                    unoptimized
                  />
                </div>
                <div className="rounded-2xl border p-3">
                  <div className="mb-2 text-xs text-gray-500">Streak</div>
                  <Image
                    src={`https://github-readme-streak-stats.herokuapp.com/?user=${GITHUB_USERNAME}&theme=transparent`}
                    alt="GitHub Streak"
                    width={640}
                    height={240}
                    className="w-full rounded-md"
                    unoptimized
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Open GitHub
              </Link>
              <Link
                href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-900"
              >
                View repositories
              </Link>
            </div>
          </div>

          {/* DeepCalendar */}
          <div className={`${SURFACE} space-y-4 p-6`}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">My Calendar (DeepCalendar)</h2>
            <div className="rounded-2xl border border-indigo-100/50 bg-indigo-50/50 px-4 py-3 text-xs text-indigo-700 dark:border-indigo-400/40 dark:bg-indigo-500/10 dark:text-indigo-200">
              {todayWindow
                ? <>Window {fromMinutes(todayWindow.openMin)} – {fromMinutes(todayWindow.closeMin)}</>
                : "Set a window to tell Deep Calendar when you’re open for deep work."}
            </div>
            <div className="space-y-2">
              {dcLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 animate-pulse rounded-2xl bg-gray-100 dark:bg-slate-900" />
                  ))}
                </div>
              ) : activeBlock ? (
                <ActiveBlockView item={activeBlock} />
              ) : (
                <div className="rounded-2xl border border-dashed px-4 py-6 text-center text-sm text-gray-500 dark:border-slate-700">
                  No active deep block.
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setModalDayOpen(true)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-white dark:text-black"
              >
                View my day
              </button>
              <a
                href={DC_ORIGIN}
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:text-gray-200 dark:hover:bg-slate-900"
              >
                Open planner
              </a>
            </div>
            <div className="pt-1 text-[11px] text-gray-500">
              Powered by{" "}
              <a className="text-indigo-600 underline" href={DC_ORIGIN} target="_blank" rel="noreferrer">
                DeepCalendar
              </a>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ---------- SHORT HITS ---------- */}
      <motion.section
        id="reels"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className={`${SECTION_CONTAINER} scroll-mt-32`}
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Short hits you can binge</h2>
            <Link href="/reels" className="text-sm text-indigo-600 hover:underline dark:text-indigo-300">
              Browse all videos
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featureReels.length ? (
              featureReels.map((reel, index) => {
                const thumbSrc = reelThumbnail(reel);
                const embedUrl = reelEmbedUrl(reel);
                const cardKey = reel.id ?? reel.youtubeId ?? `reel-${index}`;
                return (
                  <Link key={cardKey} href="/reels" className="group block">
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: index * 0.08 }}
                      viewport={{ once: true }}
                      whileHover={CARD_HOVER_FLOAT}
                      whileTap={CARD_TAP_PRESS}
                      onHoverStart={() => setHoveredReel(cardKey)}
                      onHoverEnd={() => setHoveredReel(null)}
                      className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950 text-white shadow-lg transition-transform duration-300"
                    >
                      <div className="relative overflow-hidden rounded-[2.3rem] border border-white/10 bg-black/60">
                        <div className="relative aspect-[9/16] w-full">
                          {embedUrl && hoveredReel === cardKey ? (
                            <iframe
                              title={reel.title ?? `Reel ${index + 1}`}
                              src={embedUrl}
                              className="absolute inset-0 h-full w-full pointer-events-none"
                              loading="lazy"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <>
                              <div
                                className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat transition duration-700 ease-out group-hover:scale-110"
                                style={{ backgroundImage: `url(${thumbSrc})` }}
                                aria-hidden="true"
                              />
                            </>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/35 to-black/80 opacity-90 transition duration-500 group-hover:opacity-95" />
                          <div className="absolute inset-x-5 bottom-5 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-xs text-white/70">
                              <FaPlayCircle className="text-sm" />
                              <span>{reel.type ?? "Video"}</span>
                              {reel.createdAt && (
                                <>
                                  <span>•</span>
                                  <span>{formatDate(reel.createdAt)}</span>
                                </>
                              )}
                            </div>
                            <div className="space-y-3">
                              <div className="text-lg font-semibold leading-snug">{reel.title}</div>
                              <div className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition group-hover:bg-white/25">
                                Watch on /reels <FaExternalLinkAlt className="text-[11px]" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })
            ) : (
              <div className={`${SURFACE} rounded-3xl p-5 text-sm text-gray-600 dark:text-gray-300`}>
                More videos are being produced – subscribe on YouTube to catch them first.
              </div>
            )}
          </div>
        </div>
      </motion.section>

      <GradientDivider />

      {/* ---------- LATEST WRITING ---------- */}
      <motion.section
        id="writing"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className={`${SECTION_CONTAINER} scroll-mt-32`}
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Latest writing</h2>
            <Link href="/blog" className="text-sm text-indigo-600 hover:underline dark:text-indigo-300">Visit the blog</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featurePosts.length ? (
              featurePosts.map((post, index) => (
                <motion.article
                  key={post.id ?? post._id ?? index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  whileHover={CARD_HOVER_FLOAT}
                  whileTap={CARD_TAP_PRESS}
                  className={`${SURFACE} overflow-hidden transition hover:shadow-md`}
                >
                  {post.cover && (
                    <div className="relative mb-4 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-gray-200/60 bg-gray-100 dark:border-slate-800 dark:bg-slate-900">
                      <Image
                        src={post.cover}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 360px"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500">
                    {post.source && (
                      <span className="font-semibold text-indigo-600 dark:text-indigo-300">
                        {post.source}
                      </span>
                    )}
                    {post.source && post.date && <span>•</span>}
                    {post.date && <span>{formatDate(post.date)}</span>}
                  </div>
                  {post.href ? (
                    <Link
                      href={post.href}
                      className="mt-2 block text-lg font-semibold text-indigo-700 hover:underline dark:text-indigo-300"
                      target={post.external ? "_blank" : undefined}
                      rel={post.external ? "noreferrer" : undefined}
                    >
                      {post.title}
                      {post.external && <FaExternalLinkAlt className="ml-2 inline align-middle text-[11px]" />}
                    </Link>
                  ) : (
                    <div className="mt-2 text-lg font-semibold text-indigo-700 dark:text-indigo-300">{post.title}</div>
                  )}
                  {post.summary && (
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{post.summary}</p>
                  )}
                  {Array.isArray(post.tags) && post.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-full border border-gray-200 px-3 py-1 dark:border-slate-700">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.article>
              ))
            ) : (
              <div className={`${SURFACE} p-5 text-sm text-gray-600 dark:text-gray-300`}>
                New essays are in the works — check back soon.
              </div>
            )}
          </div>
        </div>
      </motion.section>

      <GradientDivider />

      {/* ---------- BUILDS ---------- */}
      <motion.section
        id="builds"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className={`${SECTION_CONTAINER} scroll-mt-32`}
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Ventures & Products</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Focus OS builds, learning ventures, and AI tools running live with operators and students.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              {activeBuildTab === "ventures" ? (
                <Link
                  href="/ventures"
                  className="inline-flex items-center gap-2 rounded-full border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 dark:border-indigo-400/40 dark:text-indigo-200 dark:hover:bg-indigo-500/10"
                >
                  Browse all ventures <FaExternalLinkAlt className="text-[11px]" />
                </Link>
              ) : (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Quick access shortcuts to the tools I maintain.
                </span>
              )}
              <div className="inline-flex items-center rounded-full border border-indigo-200/60 bg-white/85 p-1 text-xs font-semibold shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.08]">
                {BUILD_TABS.map((tab) => {
                  const isActive = tab.id === activeBuildTab;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveBuildTab(tab.id)}
                      className={`relative rounded-full px-4 py-2 transition ${
                        isActive
                          ? "text-white"
                          : "text-slate-600 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-200"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="client-build-tab"
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_12px_30px_-16px_rgba(79,70,229,0.7)]"
                        />
                      )}
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <motion.div
            key={activeBuildTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {activeBuildTab === "ventures" ? (
              <div className="grid gap-6 lg:grid-cols-3">
                {ventureSpotlight.map((card, idx) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: idx * 0.08 }}
                    viewport={{ once: true }}
                    whileHover={CARD_HOVER_FLOAT}
                    whileTap={CARD_TAP_PRESS}
                    className={
                      card.variant === "primary"
                        ? "relative overflow-hidden rounded-3xl border bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-500 p-6 text-white shadow-lg"
                        : `${SURFACE} flex flex-col p-6`
                    }
                  >
                    {card.variant === "primary" && (
                      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                    )}
                    <div className="relative space-y-3">
                      <span
                        className={
                          card.variant === "primary"
                            ? "inline-flex items-center rounded-full bg-white/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide"
                            : "inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300"
                        }
                      >
                        Venture
                      </span>
                      <h3
                        className={
                          card.variant === "primary"
                            ? "text-3xl font-semibold"
                            : "text-xl font-semibold text-gray-900 dark:text-gray-100"
                        }
                      >
                        {card.title}
                      </h3>
                      <p
                        className={
                          card.variant === "primary"
                            ? "text-sm text-white/85"
                            : "text-sm text-gray-600 dark:text-gray-300"
                        }
                      >
                        {card.summary}
                      </p>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      {card.actions.map((action) => {
                        const baseClass =
                          action.variant === "solid"
                            ? card.variant === "primary"
                              ? "inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-white/90"
                              : "inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                            : card.variant === "primary"
                              ? "inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                              : "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:text-gray-200 dark:hover:bg-slate-900";

                        if (action.external) {
                          return (
                            <a
                              key={action.label}
                              className={baseClass}
                              href={action.href}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {action.label}
                            </a>
                          );
                        }
                        return (
                          <Link key={action.label} className={baseClass} href={action.href}>
                            {action.label}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {PRODUCT_LINKS.map((product, idx) => (
                  <motion.div
                    key={product.label}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.06 }}
                    viewport={{ once: true }}
                    whileHover={CARD_HOVER_FLOAT}
                    whileTap={CARD_TAP_PRESS}
                    className={`${SURFACE} relative flex flex-col gap-4 p-6 ${
                      product.highlight ? "border-indigo-300/70 ring-2 ring-indigo-200/80 shadow-[0_18px_35px_-20px_rgba(79,70,229,0.45)]" : ""
                    }`}
                  >
                    {product.highlight && (
                      <span className="absolute left-6 top-6 inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                        <FaMagic className="h-3 w-3" />
                        {product.badge}
                      </span>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-xl text-indigo-600 dark:text-indigo-300">
                        <product.icon />
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{product.label}</h3>
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          {product.accent === "indigo"
                            ? "Deep focus OS"
                            : product.accent === "violet"
                            ? "Calendar rituals"
                            : product.accent === "sky"
                            ? "AI assistance"
                            : product.accent === "rose"
                            ? "Learning system"
                            : "Product"}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{product.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={product.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-black"
                      >
                        Open product
                        <FaExternalLinkAlt className="text-[11px]" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </motion.section>

      <GradientDivider />

      {/* ---------- SERVICES ---------- */}
      <motion.section
        id="services"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className={`${SECTION_CONTAINER} scroll-mt-32 pb-20`}
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Services I Offer</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Build with me—custom AI systems, full-stack execution, and data intelligence stitched end-to-end.
              </p>
            </div>
            <Link
              href="/hire-me"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
            >
              Discuss a project <FaExternalLinkAlt className="text-[11px]" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {SERVICE_ROLES.map((service, idx) => {
              const accent = PRODUCT_ACCENTS[service.accent ?? "indigo"];
              const Icon = service.icon || FaBolt;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  viewport={{ once: true }}
                  whileHover={CARD_HOVER_FLOAT}
                  whileTap={CARD_TAP_PRESS}
                  className={`${SURFACE} relative overflow-hidden p-5 transition hover:shadow-lg`}
                >
                  {accent?.bubble && (
                    <div className={`pointer-events-none absolute -right-14 -bottom-12 h-24 w-24 rounded-full blur-[70px] ${accent.bubble}`} />
                  )}
                  <div className="relative flex items-start gap-3">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-2xl border text-base ${
                        accent?.ring ?? "border-indigo-200/70 hover:border-indigo-300"
                      }`}
                    >
                      <Icon className={accent?.icon ?? "text-indigo-600 dark:text-indigo-300"} />
                    </span>
                    <div className="space-y-1">
                      <span className={`text-[10px] uppercase tracking-[0.28em] ${accent?.icon ?? "text-indigo-600 dark:text-indigo-300"}`}>
                        Core Role
                      </span>
                      <h3
                        className={`text-xl font-semibold leading-tight text-transparent bg-clip-text bg-gradient-to-r ${
                          accent?.glow ?? "from-indigo-500 via-purple-500 to-pink-500"
                        }`}
                      >
                        {service.title}
                      </h3>
                      {Array.isArray(service.highlight) && service.highlight.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {service.highlight.map((point) => (
                            <span
                              key={point}
                              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200 ${
                                accent?.ring ?? "border-indigo-200/70 hover:border-indigo-300"
                              } ${accent?.bubble ?? "bg-indigo-500/15"}`}
                            >
                              {point}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Modals */}
      <RoutineModal
        open={modalDayOpen}
        onClose={() => setModalDayOpen(false)}
        items={todayItems}
        window={todayWindow}
        goalById={goalById}
      />
      <StatsModal
        open={modalStatsOpen}
        onClose={() => setModalStatsOpen(false)}
        goals={goals}
        stats7d={stats7d}
        summary30d={summary30d}
      />
    </div>
  );
}
