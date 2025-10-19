"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { FaCloud, FaFilm, FaPlayCircle, FaYoutube } from "react-icons/fa";

const SECTION_CONTAINER =
  "relative mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-6 pb-20 pt-16 md:px-10 lg:px-12 lg:gap-16";
const FULL_BLEED =
  "relative left-1/2 w-screen -translate-x-1/2";
const GLASS_CARD =
  "relative overflow-hidden border border-slate-200/70 bg-white/90 backdrop-blur-2xl shadow-[0_30px_60px_-35px_rgba(15,23,42,0.12)] transition dark:border-white/12 dark:bg-white/[0.05] dark:shadow-[0_30px_60px_-35px_rgba(15,23,42,0.75)]";
const PANEL =
  "rounded-3xl border border-slate-200/70 bg-white/90 px-5 py-5 sm:px-8 backdrop-blur-2xl shadow-[0_24px_52px_-35px_rgba(15,23,42,0.12)] dark:border-white/12 dark:bg-white/[0.06] dark:shadow-[0_24px_52px_-35px_rgba(15,23,42,0.75)]";
const STAT_CARD =
  "flex min-w-[160px] items-center gap-4 rounded-3xl border border-slate-200/60 bg-white/85 px-5 py-4 backdrop-blur-2xl shadow-[0_20px_45px_-32px_rgba(15,23,42,0.12)] dark:border-white/12 dark:bg-white/[0.08] dark:shadow-[0_20px_45px_-30px_rgba(15,23,42,0.8)]";
const OVERLAY_CARD =
  "rounded-3xl border border-white/15 bg-black/55 backdrop-blur-2xl shadow-[0_30px_80px_-40px_rgba(2,6,23,0.9)]";

const FILTERS = [
  { id: "all", label: "All sequences", icon: FaFilm },
  { id: "cloudinary", label: "Studio rituals", icon: FaCloud },
  { id: "youtube", label: "Shared reflections", icon: FaYoutube },
];

const DEFAULT_META = {
  label: "Reel",
  dot: "bg-indigo-400",
  accent: "from-indigo-500/35 via-purple-500/20 to-transparent",
};

const TYPE_META = {
  cloudinary: {
    label: "Studio cut",
    dot: "bg-sky-400",
    accent: "from-sky-500/40 via-cyan-400/25 to-transparent",
  },
  youtube: {
    label: "YouTube drop",
    dot: "bg-rose-400",
    accent: "from-rose-500/40 via-purple-500/25 to-transparent",
  },
};

function cleanYouTubeId(raw = "") {
  let s = String(raw).trim();
  try {
    if (s.startsWith("http")) {
      const u = new URL(s);
      if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "");
      if (u.searchParams.get("v")) return u.searchParams.get("v");
    }
  } catch {}
  return s.split("?")[0].split("&")[0].split("#")[0];
}

export default function ReelsPage() {
  const [items, setItems] = useState([]);
  const [mode, setMode] = useState("grid");
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewerItems, setViewerItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";

  useEffect(() => {
    let alive = true;
    setIsLoading(true);
    (async () => {
      try {
        const res = await fetch("/api/reels", { cache: "no-store" });
        const j = await res.json();
        const arr = Array.isArray(j.items) ? j.items : [];
        const normalized = arr.map((r) => {
          if (r.type === "youtube") {
            const ytId = cleanYouTubeId(r.id || r.ref || "");
            return { ...r, ytId };
          }
          return { ...r, publicId: r.publicId || r.ref };
        });
        if (alive) {
          setItems(normalized);
        }
      } catch {
        if (alive) setItems([]);
      } finally {
        if (alive) setIsLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const decoratedItems = useMemo(() => {
    return items.map((r, idx) => {
      const meta = TYPE_META[r.type] ?? DEFAULT_META;
      const key = `${r.type}:${r.publicId || r.ytId || r.id || r.ref || idx}`;
      const thumb =
        r.type === "cloudinary"
          ? cloudName
            ? `https://res.cloudinary.com/${cloudName}/video/upload/${r.publicId}.jpg`
            : ""
          : r.ytId
          ? `https://img.youtube.com/vi/${r.ytId}/hqdefault.jpg`
          : "";
      return {
        ...r,
        __index: idx,
        __key: key,
        __thumb: thumb,
        __meta: meta,
      };
    });
  }, [items, cloudName]);

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return decoratedItems;
    return decoratedItems.filter((item) => item.type === activeFilter);
  }, [decoratedItems, activeFilter]);

  const heroCollection = filteredItems.length ? filteredItems : decoratedItems;
  const heroReel = heroCollection[0];
  const heroMeta = heroReel?.__meta ?? DEFAULT_META;
  const heroThumb = heroReel?.__thumb ?? "";
  const heroIndex = heroReel
    ? heroCollection.findIndex((item) => item.__index === heroReel.__index)
    : -1;
  const hasItems = heroCollection.length > 0;
  const recentTitle = decoratedItems[0]?.title;

  const typeCounts = useMemo(() => {
    const total = decoratedItems.length;
    const studio = decoratedItems.filter((item) => item.type === "cloudinary").length;
    const youtube = decoratedItems.filter((item) => item.type === "youtube").length;
    return { total, studio, youtube };
  }, [decoratedItems]);

  const viewerCollection = useMemo(() => {
    if (mode !== "viewer") return [];
    return viewerItems.length ? viewerItems : decoratedItems;
  }, [mode, viewerItems, decoratedItems]);

  const viewerLength = viewerCollection.length;

  const exitViewer = useCallback(() => {
    cardRefs.current = [];
    setViewerItems([]);
    setActiveIndex(0);
    setMode("grid");
  }, []);

  const scrollToIndex = useCallback(
    (idx) => {
      if (!viewerLength) return;
      const clamped = Math.max(0, Math.min(idx, viewerLength - 1));
      const el = cardRefs.current[clamped];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [viewerLength]
  );

  const openViewer = useCallback((collection, idx) => {
    if (!collection.length) return;
    const safeIndex = Math.max(0, Math.min(idx, collection.length - 1));
    const snapshot = collection.map((item) => ({ ...item }));
    cardRefs.current = [];
    setViewerItems(snapshot);
    setActiveIndex(safeIndex);
    setMode("viewer");
  }, []);

  useEffect(() => {
    if (mode !== "viewer" || !viewerLength) return;
    let raf;
    const tryScroll = (attempt = 0) => {
      const el = cardRefs.current[activeIndex];
      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
      } else if (attempt < 20) {
        raf = requestAnimationFrame(() => tryScroll(attempt + 1));
      }
    };
    tryScroll();
    return () => cancelAnimationFrame(raf);
  }, [mode, activeIndex, viewerLength]);

  useEffect(() => {
    if (mode !== "viewer") return;
    setActiveIndex((idx) => {
      if (!viewerLength) return 0;
      return Math.min(idx, viewerLength - 1);
    });
  }, [mode, viewerLength]);

  useEffect(() => {
    if (mode !== "viewer" || !viewerLength) return;
    const root = containerRef.current || undefined;
    const cards = cardRefs.current.slice(0, viewerLength).filter(Boolean);
    if (!cards.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const top = entries
          .slice()
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (top?.isIntersecting) {
          const idx = Number(top.target.dataset.index);
          if (!Number.isNaN(idx)) setActiveIndex(idx);
        }
      },
      { root, threshold: [0.35, 0.6, 0.85], rootMargin: "0px 0px -10% 0px" }
    );
    cards.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [mode, viewerLength, viewerCollection]);

  useEffect(() => {
    if (mode !== "viewer" || !viewerLength) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        exitViewer();
        return;
      }
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        scrollToIndex(activeIndex + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        scrollToIndex(activeIndex - 1);
      } else if (e.key === " ") {
        e.preventDefault();
        const el = cardRefs.current[activeIndex]?.querySelector("video");
        if (el) el.paused ? el.play() : el.pause();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, viewerLength, activeIndex, scrollToIndex, exitViewer]);

  function ReelOverlay({ r, actionSlot }) {
    const meta = r.__meta ?? DEFAULT_META;
    return (
      <>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-8 sm:px-10 sm:pb-12">
          <div className={`${OVERLAY_CARD} pointer-events-auto space-y-4 px-6 py-6`}>
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.32em] text-white/70">
              <span className="inline-flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
              {actionSlot ? <div className="flex items-center gap-2">{actionSlot}</div> : null}
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold leading-tight text-white sm:text-3xl">
                {r.title || "Untitled reel"}
              </h2>
              {r.description ? (
                <p className="text-sm text-white/70 sm:text-base">{r.description}</p>
              ) : null}
            </div>
          </div>
        </div>
      </>
    );
  }

  function CloudinaryReel({ r, active }) {
    const vidRef = useRef(null);
    useEffect(() => {
      const v = vidRef.current;
      if (!v) return;
      if (active) {
        v.muted = true;
        const play = async () => {
          try {
            await v.play();
          } catch {}
        };
        play();
      } else {
        v.pause();
      }
    }, [active]);
    const src =
      cloudName && r.publicId
        ? `https://res.cloudinary.com/${cloudName}/video/upload/f_auto,vc_auto,q_auto/${r.publicId}`
        : "";
    const toggleMute = useCallback(
      (event) => {
        event.stopPropagation();
        const v = vidRef.current;
        if (!v) return;
        v.muted = !v.muted;
      },
      []
    );
    return (
      <div className="relative h-screen w-full bg-black">
        {src ? (
          <video
            ref={vidRef}
            playsInline
            loop
            muted
            preload="metadata"
            className="h-full w-full object-cover"
            src={src}
            onClick={() => {
              const v = vidRef.current;
              if (!v) return;
              v.paused ? v.play() : v.pause();
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/60">
            Missing Cloudinary config
          </div>
        )}
        <ReelOverlay
          r={r}
          actionSlot={
            <button
              type="button"
              onClick={toggleMute}
              className="rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80 transition hover:bg-white/20"
            >
              mute
            </button>
          }
        />
      </div>
    );
  }

  function YouTubeReel({ r, active }) {
    const [src, setSrc] = useState("");
    useEffect(() => {
      if (active && r.ytId) {
        setSrc(
          `https://www.youtube.com/embed/${r.ytId}?autoplay=1&mute=1&playsinline=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${r.ytId}`
        );
      } else {
        setSrc("");
      }
    }, [active, r.ytId]);
    return (
      <div className="relative h-screen w-full bg-black">
        {src ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={src}
            title={r.title || "YouTube reel"}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={r.ytId ? `https://img.youtube.com/vi/${r.ytId}/hqdefault.jpg` : ""}
            alt={r.title || "thumbnail"}
          />
        )}
        <ReelOverlay r={r} />
      </div>
    );
  }

  if (mode === "grid") {
    return (
      <section className={FULL_BLEED}>
        <div className="relative min-h-screen overflow-hidden bg-[rgb(var(--bg))] text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-slate-100">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.18),_transparent_62%)] dark:bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.28),_transparent_60%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.10),_transparent_58%)] dark:bg-[radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.16),_transparent_55%)]" />
          <div className={SECTION_CONTAINER}>
            <section className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <span className="inline-flex items-center gap-3 rounded-full border border-slate-200/50 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/[0.08] dark:text-indigo-100/80">
                  <FaFilm className="text-sm text-indigo-500 dark:text-indigo-300" />
                  Discipline reels
                </span>
                <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-[rgb(var(--fg))] md:text-5xl">
                  Discipline in motion. Deep work on camera.
                </h1>
                <p className="max-w-xl text-base text-[rgb(var(--muted))] md:text-lg">
                  These reels capture focus systems, deep-work rituals, and the daily reps that build long-term compounds—an archive of the grind rather than client hype.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className={STAT_CARD}>
                    <div className="rounded-2xl bg-indigo-500/10 p-3 text-2xl text-indigo-600 dark:bg-indigo-500/30 dark:text-indigo-200">
                      <FaPlayCircle />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-indigo-100/70">Focus sequences</p>
                      <p className="text-2xl font-semibold text-slate-900 dark:text-white">{typeCounts.total}</p>
                    </div>
                  </div>
                  <div className={STAT_CARD}>
                    <div className="rounded-2xl bg-sky-500/10 p-3 text-2xl text-sky-600 dark:bg-sky-500/25 dark:text-sky-200">
                      <FaCloud />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-indigo-100/70">Studio rituals logged</p>
                      <p className="text-2xl font-semibold text-slate-900 dark:text-white">{typeCounts.studio}</p>
                    </div>
                  </div>
                  <div className={STAT_CARD}>
                    <div className="rounded-2xl bg-rose-500/10 p-3 text-2xl text-rose-600 dark:bg-rose-500/25 dark:text-rose-200">
                      <FaYoutube />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-indigo-100/70">Reflections shared</p>
                      <p className="text-2xl font-semibold text-slate-900 dark:text-white">{typeCounts.youtube}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {hasItems ? (
                <motion.button
                  type="button"
                  onClick={() => openViewer(heroCollection, heroIndex >= 0 ? heroIndex : 0)}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className={`group ${GLASS_CARD} hidden rounded-[32px] text-left shadow-[0_40px_70px_-40px_rgba(59,130,246,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 dark:shadow-[0_40px_70px_-40px_rgba(59,130,246,0.45)] lg:block`}
                >
                  <div className="relative aspect-[10/13] w-full overflow-hidden">
                    {heroThumb ? (
                      <img
                        src={heroThumb}
                        alt={heroReel.title || "Reel preview"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500/20 via-transparent to-transparent text-slate-400 dark:text-white/50">
                        <FaPlayCircle className="text-4xl" />
                      </div>
                    )}
                    <div className={`absolute inset-0 bg-gradient-to-t ${heroMeta.accent}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80">
                        <span className={`h-2 w-2 rounded-full ${heroMeta.dot}`} />
                        {heroMeta.label}
                      </span>
                      <h2 className="mt-3 text-2xl font-semibold leading-tight text-white">
                        {heroReel.title || "Untitled reel"}
                      </h2>
                      {heroReel.description ? (
                        <p className="mt-2 line-clamp-2 text-sm text-white/70">{heroReel.description}</p>
                      ) : null}
                      <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
                        Enter immersive
                        <FaPlayCircle className="text-base" />
                      </div>
                    </div>
                  </div>
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className={`${GLASS_CARD} hidden h-full items-center justify-center rounded-[32px] text-center text-slate-600 dark:text-white/70 lg:flex`}
                >
                  <div className="space-y-4 px-10">
                    <h2 className="text-xl font-semibold">Reels coming soon</h2>
                    <p className="text-sm text-slate-500 dark:text-white/60">
                      Once clips are published, they will appear here with the same dashboard treatment.
                    </p>
                  </div>
                </motion.div>
              )}
            </section>

            <section className={PANEL}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {FILTERS.map((filter) => {
                    const Icon = filter.icon;
                    const isActive = activeFilter === filter.id;
                    return (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => setActiveFilter(filter.id)}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] transition ${
                          isActive
                            ? "border-transparent bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
                            : "border-slate-200/70 bg-white/80 text-slate-600 hover:bg-white dark:border-white/12 dark:bg-white/[0.05] dark:text-white/70 dark:hover:bg-white/[0.12]"
                        }`}
                      >
                        <Icon className="text-base" />
                        {filter.label}
                      </button>
                    );
                  })}
                </div>
                {hasItems ? (
                  <button
                    type="button"
                    onClick={() => openViewer(heroCollection, heroIndex >= 0 ? heroIndex : 0)}
                    className="inline-flex items-center gap-3 rounded-full border border-slate-200/70 bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-600 shadow-sm transition hover:bg-white/90 dark:border-white/12 dark:bg-white/[0.08] dark:text-white/80 dark:hover:bg-white/[0.15]"
                  >
                    Launch immersive
                    <FaPlayCircle className="text-base" />
                  </button>
                ) : null}
              </div>
              {recentTitle ? (
                <p className="mt-4 text-sm text-slate-500 dark:text-white/60">
                  Latest drop: <span className="text-slate-700 dark:text-white/85">{recentTitle}</span>
                </p>
              ) : (
                <p className="mt-4 text-sm text-slate-400 dark:text-white/50">Add your first reel to populate this space.</p>
              )}
            </section>
            {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={`skeleton-${idx}`}
                  className={`${GLASS_CARD} h-[420px] animate-pulse rounded-[28px]`}
                />
              ))}
            </div>
          ) : hasItems ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((r, i) => {
                const meta = r.__meta ?? DEFAULT_META;
                return (
                  <motion.button
                    key={r.__key}
                    type="button"
                    onClick={() => openViewer(filteredItems, i)}
                    layout
                    whileHover={{ y: -6 }}
                    className={`group ${GLASS_CARD} rounded-[28px] text-left`}
                  >
                    <div className="relative aspect-[10/16] w-full overflow-hidden">
                      {r.__thumb ? (
                        <img
                          src={r.__thumb}
                          alt={r.title || "Reel thumbnail"}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent text-slate-400 dark:text-white/50">
                          <FaPlayCircle className="text-4xl" />
                        </div>
                      )}
                      <div className={`absolute inset-0 bg-gradient-to-t ${meta.accent}`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5">
                        <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-600 dark:text-white/70">
                          <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                          {meta.label}
                        </span>
                        <h3 className="text-xl font-semibold leading-tight text-slate-900 dark:text-white">
                          {r.title || "Untitled reel"}
                        </h3>
                        {r.description ? (
                          <p className="line-clamp-2 text-sm text-slate-600 dark:text-white/65">{r.description}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-200/60 px-5 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600 dark:border-white/10 dark:text-white/60">
                      <span>{r.type === "youtube" ? "Hosted on YouTube" : "Cloudinary studio"}</span>
                      <span className="inline-flex items-center gap-2 text-slate-700 dark:text-white/80">
                        Watch
                        <FaPlayCircle className="text-base" />
                      </span>
                    </div>
                    <div className="pointer-events-none absolute -inset-1 rounded-[30px] bg-gradient-to-br from-indigo-500/25 via-transparent to-transparent opacity-0 blur-3xl transition duration-500 group-hover:opacity-100" />
                  </motion.button>
                );
              })}
            </div>
          ) : (
            <div className={`${GLASS_CARD} flex flex-col items-center justify-center gap-3 rounded-[28px] px-10 py-16 text-center text-slate-600 dark:text-white/70`}>
              <FaFilm className="text-3xl text-slate-400 dark:text-white/50" />
              <p className="text-sm">No reels match this filter yet. Switch filters or add new content.</p>
            </div>
          )}
        </div>
      </div>
    </section>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.2),_transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(56,189,248,0.12),_transparent_55%)]" />
      <div className="pointer-events-auto absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-6 py-4 sm:px-10">
        <button
          type="button"
          onClick={exitViewer}
          className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/80 transition hover:bg-white/20"
        >
          ← Back to gallery
        </button>
        <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">
          {viewerLength ? `${activeIndex + 1}/${viewerLength}` : "0/0"}
        </div>
      </div>
      <div
        ref={containerRef}
        className="relative h-full w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth"
      >
        {viewerLength ? (
          viewerCollection.map((r, i) => {
            const ReelComponent = r.type === "cloudinary" ? CloudinaryReel : YouTubeReel;
            return (
              <div
                key={r.__key}
                ref={(el) => (cardRefs.current[i] = el)}
                data-index={i}
                className="h-screen w-full"
              >
                <ReelComponent r={r} active={i === activeIndex} />
              </div>
            );
          })
        ) : (
          <div className="flex h-full items-center justify-center text-white/60">
            No reels yet
          </div>
        )}
      </div>
    </div>
  );
}
