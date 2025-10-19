"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Brain3D from "@/components/Brain3D";
import map from "@/content/nbs-map.json";
import Link from "next/link";

const LABELS = {
  cs: "Computer Science Block",
  ds: "Data Science Block",
  versatility: "Versatility Block",
  world: "World Building (Interface)",
};
const ORDER = ["cs", "ds", "versatility", "world"];
const AUTOPLAY_INTERVAL = 7000;
const AUTOPLAY_RESUME_DELAY = 20000;

export default function Brain3DView() {
  const blocks = useMemo(() => map?.blocks || [], []);
  const [selected, setSelected] = useState(null);
  const [isAutoplaying, setIsAutoplaying] = useState(true);
  const [manualPauseUntil, setManualPauseUntil] = useState(0);
  const autoplayTimerRef = useRef(null);

  const currentBlock = useMemo(
    () => (selected ? blocks.find((b) => b.id === selected) || null : null),
    [blocks, selected]
  );
  const worldFromCS = useMemo(() => {
    const cs = blocks.find((b) => b.id === "cs");
    return cs?.buildings?.find((b) => b.id === "world");
  }, [blocks]);

  const handleUserInteract = useCallback(() => {
    if (typeof window === "undefined") return;
    const resumeAt = Date.now() + AUTOPLAY_RESUME_DELAY;
    setManualPauseUntil((prev) => (prev < resumeAt ? resumeAt : prev));
    setIsAutoplaying(false);
  }, []);

  const handleSelect = useCallback(
    (id, meta = {}) => {
      if (!id) return;
      setSelected((prev) => (prev === id ? prev : id));
      if (meta.origin !== "auto") {
        handleUserInteract();
      }
    },
    [handleUserInteract]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash?.slice(1);
    if (hash && LABELS[hash]) {
      handleSelect(hash, { origin: "user" });
    }
  }, [handleSelect]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (selected && LABELS[selected]) {
      history.replaceState(null, "", `#${selected}`);
    } else {
      history.replaceState(null, "", location.pathname);
    }
  }, [selected]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const availableIds = ORDER.filter(
      (id) => id === "world" || blocks.some((block) => block.id === id)
    );
    if (!availableIds.length) {
      if (autoplayTimerRef.current) window.clearTimeout(autoplayTimerRef.current);
      setIsAutoplaying(false);
      return undefined;
    }

    const now = Date.now();
    if (manualPauseUntil && now < manualPauseUntil) {
      if (autoplayTimerRef.current) window.clearTimeout(autoplayTimerRef.current);
      const delay = manualPauseUntil - now;
      autoplayTimerRef.current = window.setTimeout(() => {
        setManualPauseUntil(0);
        setIsAutoplaying(true);
      }, delay);
      return () => {
        if (autoplayTimerRef.current) window.clearTimeout(autoplayTimerRef.current);
      };
    }

    setIsAutoplaying(true);

    const currentIndex = selected ? availableIds.indexOf(selected) : -1;
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % availableIds.length : 0;
    const nextId = availableIds[nextIndex];
    const delay = selected ? AUTOPLAY_INTERVAL : 1800;

    if (autoplayTimerRef.current) window.clearTimeout(autoplayTimerRef.current);
    autoplayTimerRef.current = window.setTimeout(() => {
      handleSelect(nextId, { origin: "auto" });
    }, delay);

    return () => {
      if (autoplayTimerRef.current) window.clearTimeout(autoplayTimerRef.current);
    };
  }, [blocks, handleSelect, manualPauseUntil, selected]);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="card flex flex-wrap gap-2">
          {ORDER.map((id) => (
            <button
              key={id}
              onClick={() => handleSelect(id, { origin: "user" })}
              className={`btn ${selected === id ? "bg-black text-white border-black" : ""}`}
              aria-pressed={selected === id}
            >
              {LABELS[id]}
            </button>
          ))}
          <div className="ml-auto flex gap-2">
            <Link href="/nbs/architecture" className="btn">Architecture Map</Link>
            <Link href="/hire-me" className="btn btn-primary">Work With Me</Link>
          </div>
        </div>

        <Brain3D
          selected={selected}
          onSelect={handleSelect}
          onUserInteract={handleUserInteract}
          autoplaying={isAutoplaying}
        />
      </div>

      <section className="card-solid lg:sticky lg:top-4 lg:self-start">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wide muted">Selected</div>
            <h2 className="text-xl font-semibold">
              {selected ? (LABELS[selected] || currentBlock?.title) : "Select a hotspot"}
            </h2>
            <p className="muted mt-1">
              {selected
                ? selected === "world"
                  ? "Translation layer where internal knowledge becomes interviews, projects, systems, and decisions."
                  : currentBlock?.description || "—"
                : "Tap a luminous node or choose a block on the left to load its dossier."}
            </p>
          </div>
          <Link href="/nbs/architecture" className="btn shrink-0">Full Map →</Link>
        </div>

        {!selected ? (
          <div className="mt-4 text-sm muted">
            Tip: the cortex on the left will auto-tour, but you can override at any time.
          </div>
        ) : selected === "world" ? (
          <div className="mt-4 space-y-3">
            {worldFromCS ? (
              worldFromCS.floors?.map((f, i) => (
                <div key={i} className="card">
                  <div className="font-medium">{f.title}</div>
                  {f.rooms?.length ? (
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {f.rooms.map((r, idx) => (
                        <li key={idx} className="px-2 py-0.5 text-xs rounded bg-black/20">
                          {r}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-xs muted">No rooms listed.</div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-sm muted mt-3">World Building not defined in nbs-map.json.</div>
            )}
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {(currentBlock?.buildings || []).map((b) => (
              <div key={b.id} className="card">
                <div className="text-xs uppercase tracking-wide muted">
                  {b.type === "language" ? "Language" : b.type === "shared" ? "Shared" : "Core"}
                </div>
                <div className="font-medium">{b.title}</div>
                <div className="mt-2 text-xs muted">{b.floors?.length || 0} floors</div>
                {b.note && (
                  <div className="mt-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded px-2 py-1">
                    {b.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
