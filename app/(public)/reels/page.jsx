"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export default function ReelsPage(){
  const [items, setItems] = useState([]);
  const [mode, setMode] = useState("grid");
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";

  // --- helpers ---
  const cleanYouTubeId = (raw="") => {
    let s = String(raw).trim();
    // If full URL, extract v= or youtu.be/<id>
    try {
      if (s.startsWith("http")) {
        const u = new URL(s);
        if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "");
        if (u.searchParams.get("v")) return u.searchParams.get("v");
      }
    } catch {}
    // strip query/hash if someone pasted "ID?si=..."
    s = s.split("?")[0].split("&")[0].split("#")[0];
    return s;
  };

  // Fetch + normalize items
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/reels", { cache: "no-store" });
        const j = await res.json();
        const arr = Array.isArray(j.items) ? j.items : [];
        const normalized = arr.map((r) => {
          if (r.type === "youtube") {
            const ytId = cleanYouTubeId(r.id || r.ref || "");
            return { ...r, ytId };
          } else {
            return { ...r, publicId: r.publicId || r.ref };
          }
        });
        if (alive) setItems(normalized);
      } catch {
        if (alive) setItems([]);
      }
    })();
    return () => { alive = false; };
  }, []);

  // Enter viewer mode at clicked index
  useEffect(() => {
    if (mode !== "viewer") return;
    const id = setTimeout(() => {
      const el = cardRefs.current[activeIndex];
      if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
    }, 0);
    return () => clearTimeout(id);
  }, [mode, activeIndex]);

  // Observe active card in viewer
  useEffect(() => {
    if (mode !== "viewer") return;
    const root = containerRef.current || undefined;
    const cards = cardRefs.current.filter(Boolean);
    if (!cards.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const top = entries.slice().sort((a,b)=>b.intersectionRatio - a.intersectionRatio)[0];
        if (top?.isIntersecting) {
          const idx = Number(top.target.dataset.index);
          if (!Number.isNaN(idx)) setActiveIndex(idx);
        }
      },
      { root, threshold: [0.35, 0.6, 0.85] }
    );

    cards.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [mode, items]);

  const scrollToIndex = useCallback((idx) => {
    const el = cardRefs.current[idx];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    if (mode !== "viewer") return;
    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); setMode("grid"); return; }
      if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); scrollToIndex(Math.min(activeIndex + 1, items.length - 1)); }
      else if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); scrollToIndex(Math.max(activeIndex - 1, 0)); }
      else if (e.key === " ") {
        e.preventDefault();
        const el = cardRefs.current[activeIndex]?.querySelector("video");
        if (el) el.paused ? el.play() : el.pause();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, activeIndex, items.length, scrollToIndex]);

  // ---- inline renderers ----
  function CloudinaryReel({ r, active }){
    const vidRef = useRef(null);
    useEffect(() => {
      const v = vidRef.current;
      if (!v) return;
      if (active) {
        v.muted = true;
        const play = async () => { try { await v.play(); } catch {} };
        play();
      } else v.pause();
    }, [active]);
    return (
      <div className="relative h-screen w-full snap-start overflow-hidden bg-black">
        <video
          ref={vidRef}
          playsInline
          loop
          muted
          preload="metadata"
          className="h-full w-full object-cover"
          src={`https://res.cloudinary.com/${cloudName}/video/upload/${r.publicId}.mp4`}
          onClick={() => {
            const v = vidRef.current; if (!v) return;
            v.paused ? v.play() : v.pause();
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="space-y-1">
            <div className="text-sm text-white/70">Reel</div>
            <div className="text-lg font-semibold">{r.title}</div>
          </div>
          <div className="pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const v = vidRef.current; if (!v) return;
                v.muted = !v.muted;
              }}
              className="rounded-full bg-white/20 px-3 py-2 text-xs text-white backdrop-blur"
            >
              mute
            </button>
          </div>
        </div>
      </div>
    );
  }

  function YouTubeReel({ r, active }){
    const [src, setSrc] = useState("");
    useEffect(() => {
      if (active && r.ytId) {
        setSrc(`https://www.youtube.com/embed/${r.ytId}?autoplay=1&mute=1&playsinline=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${r.ytId}`);
      } else {
        setSrc("");
      }
    }, [active, r.ytId]);
    return (
      <div className="relative h-screen w-full snap-start overflow-hidden bg-black">
        {src ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={src}
            title={r.title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : <div className="absolute inset-0" />}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="space-y-1">
            <div className="text-sm text-white/70">Reel</div>
            <div className="text-lg font-semibold">{r.title}</div>
          </div>
        </div>
      </div>
    );
  }

  // ---- UI sections ----
  if (mode === "grid") {
    return (
      <div className="space-y-6 p-4 md:p-8">
        <section className="card bg-transparent border-0 p-0">
          <h1 className="text-3xl font-bold">Reels</h1>
          <p className="muted">Tap a reel to enter immersive view.</p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((r, i) => {
            const key = `${r.type}:${r.publicId || r.ytId || r.id || r.ref || i}`;
            return (
              <button
                key={key}
                onClick={() => { setActiveIndex(i); setMode("viewer"); }}
                className="group relative overflow-hidden rounded-2xl border border-[color:var(--border)]"
              >
                {r.type === "cloudinary" ? (
                  <img
                    className="h-56 w-full object-cover transition group-hover:scale-105"
                    src={`https://res.cloudinary.com/${cloudName}/video/upload/${r.publicId}.jpg`}
                    alt={r.title}
                    loading="lazy"
                  />
                ) : (
                  <img
                    className="h-56 w-full object-cover transition group-hover:scale-105"
                    src={`https://img.youtube.com/vi/${r.ytId}/hqdefault.jpg`}
                    alt={r.title}
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent p-3 text-left text-white">
                  <div className="line-clamp-2 text-sm font-medium">{r.title}</div>
                </div>
              </button>
            );
          })}
          {items.length === 0 && <div className="card">No reels yet</div>}
        </section>
      </div>
    );
  }

  // viewer mode
  return (
    <div className="relative bg-black text-white">
      {/* top bar */}
      <div className="pointer-events-auto absolute left-0 right-0 top-0 z-20 flex items-center justify-between p-3">
        <button
          onClick={() => setMode("grid")}
          className="rounded-full bg-white/15 px-3 py-1 text-sm backdrop-blur"
        >
          ← Back
        </button>
        <div className="text-sm opacity-80">
          {activeIndex + 1}/{items.length}
        </div>
        <div />
      </div>

      {/* vertical scroller */}
      <div
        ref={containerRef}
        className="h-screen w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth"
      >
        {items.map((r, i) => {
          const key = `${r.type}:${r.publicId || r.ytId || r.id || r.ref || i}`;
          return (
            <div
              key={key}
              ref={(el) => (cardRefs.current[i] = el)}
              data-index={i}
              className="h-screen w-full"
            >
              {r.type === "cloudinary"
                ? <CloudinaryReel r={r} active={i === activeIndex} />
                : <YouTubeReel r={r} active={i === activeIndex} />
              }
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="flex h-screen w-full items-center justify-center text-white/70">
            No reels yet
          </div>
        )}
      </div>
    </div>
  );
}
