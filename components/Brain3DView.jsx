"use client";

import { useEffect, useMemo, useState } from "react";
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

export default function Brain3DView() {
  const blocks = useMemo(() => map?.blocks || [], []);
  const [selected, setSelected] = useState(null);

  const currentBlock = useMemo(
    () => (selected ? blocks.find((b) => b.id === selected) || null : null),
    [blocks, selected]
  );
  const worldFromCS = useMemo(() => {
    const cs = blocks.find((b) => b.id === "cs");
    return cs?.buildings?.find((b) => b.id === "world");
  }, [blocks]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash?.slice(1);
    if (hash && LABELS[hash]) setSelected(hash);
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (selected && LABELS[selected]) {
      history.replaceState(null, "", `#${selected}`);
    } else {
      history.replaceState(null, "", location.pathname);
    }
  }, [selected]);

  return (
    <>
      <div className="card mb-3 flex flex-wrap gap-2">
        {ORDER.map((id) => (
          <button
            key={id}
            onClick={() => setSelected(id)}
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

      <Brain3D selected={selected} onSelect={setSelected} />

      <section className="card-solid mt-6">
        <div className="flex items-start justify-between">
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
                : "Click a glowing dot on the brain to explore."}
            </p>
          </div>
          <Link href="/nbs/architecture" className="btn">Full Map →</Link>
        </div>

        {!selected ? (
          <div className="mt-4 text-sm muted">
            Tip: use the buttons above or click a dot on the brain to view details.
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
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
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
    </>
  );
}
