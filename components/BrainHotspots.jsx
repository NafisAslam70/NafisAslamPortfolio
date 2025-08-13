"use client";
import { useMemo, useState } from "react";
import Tilt from "./Tilt";
import Link from "next/link";
import map from "@/content/nbs-map.json";

const SPOTS = {
  cs: { x: 30, y: 40, label: "Computer Science Block" },
  ds: { x: 63, y: 37, label: "Data Science Block" },
  versatility: { x: 45, y: 62, label: "Versatility Block" },
  world: { x: 50, y: 25, label: "World Building (Interface)" }
};

function Dot({ active }) {
  return <span className={`block h-3 w-3 rounded-full ring-2 ring-white ${active ? "bg-black" : "bg-white/90"}`} />;
}

export default function BrainHotspots() {
  const blocks = map?.blocks || [];
  const [selected, setSelected] = useState("cs");
  const selectedBlock = useMemo(() => blocks.find((b) => b.id === selected) || blocks[0], [blocks, selected]);
  const worldBuilding = useMemo(() => {
    const cs = blocks.find((b) => b.id === "cs");
    return cs?.buildings?.find((b) => b.id === "world") || null;
  }, [blocks]);

  function blockLabel(id) {
    return SPOTS[id]?.label || selectedBlock?.title || "Selected";
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Tilt className="rounded-2xl" max={14}>
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-slate-50 to-white">
          <svg viewBox="0 0 600 520" className="w-full h-auto" role="img" aria-label="Interactive brain map">
            <defs>
              <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#e5e7eb" stopOpacity="0.3" />
              </radialGradient>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#000" floodOpacity="0.15" />
              </filter>
            </defs>
            <g filter="url(#shadow)">
              <path
                d="M275 65c-45 0-85 23-109 63-21-9-46 1-58 22-12 21-8 47 8 63-21 19-26 51-12 76-16 26-10 60 14 78 1 34 28 62 62 64 12 34 45 58 84 58h74c39 0 72-24 84-58 34-2 61-30 62-64 24-18 30-52 14-78 14-25 9-57-12-76 16-16 20-42 8-63-12-21-37-31-58-22-24-40-64-63-109-63h-52z"
                fill="url(#glow)"
                className="stroke-slate-300"
                strokeWidth="2"
              />
            </g>
            {blocks.map((blk) => {
              const pos = SPOTS[blk.id];
              if (!pos) return null;
              const isActive = selected === blk.id;
              return (
                <g
                  key={blk.id}
                  onMouseEnter={() => setSelected(blk.id)}
                  onClick={() => setSelected(blk.id)}
                  style={{ cursor: "pointer", transition: "transform .15s ease-out" }}
                  transform={`translate(${pos.x * 6} ${pos.y * 5.2})`}
                >
                  <circle r={16} fill={isActive ? "black" : "white"} stroke="#0f172a" strokeWidth="2" opacity="0.9" />
                  <circle r={4} fill={isActive ? "white" : "#0f172a"} />
                </g>
              );
            })}
            <g
              onMouseEnter={() => setSelected("world")}
              onClick={() => setSelected("world")}
              style={{ cursor: "pointer", transition: "transform .15s ease-out" }}
              transform={`translate(${SPOTS.world.x * 6} ${SPOTS.world.y * 5.2})`}
            >
              <circle r={16} fill={selected === "world" ? "black" : "white"} stroke="#0f172a" strokeWidth="2" opacity="0.9" />
              <circle r={4} fill={selected === "world" ? "white" : "#0f172a"} />
            </g>
          </svg>
          <div className="absolute bottom-3 left-3 flex gap-2">
            {blocks.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelected(b.id)}
                className={`flex items-center gap-2 rounded-full border bg-white/70 backdrop-blur px-3 py-1 text-xs transition ${selected === b.id ? "ring-2 ring-black/10" : "hover:bg-white"}`}
              >
                <Dot active={selected === b.id} />
                <span className="text-slate-800">{SPOTS[b.id]?.label || b.title}</span>
              </button>
            ))}
            <button
              onClick={() => setSelected("world")}
              className={`flex items-center gap-2 rounded-full border bg-white/70 backdrop-blur px-3 py-1 text-xs transition ${selected === "world" ? "ring-2 ring-black/10" : "hover:bg-white"}`}
            >
              <Dot active={selected === "world"} />
              <span className="text-slate-800">{SPOTS.world.label}</span>
            </button>
          </div>
        </div>
      </Tilt>

      <div className="rounded-2xl border bg-white p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-gray-500">Selected</div>
            <h3 className="text-xl font-semibold">{blockLabel(selected)}</h3>
            {selected === "world" ? (
              <p className="text-gray-600 mt-1">Translation layer where internal knowledge becomes interviews, projects, systems, and decisions.</p>
            ) : (
              <p className="text-gray-600 mt-1">{selectedBlock?.description}</p>
            )}
          </div>
          <Link href="/nbs/architecture" className="text-sm px-3 py-1.5 rounded-full border hover:bg-gray-50">Full Map →</Link>
        </div>

        {selected === "world" ? (
          <div className="mt-4 space-y-3">
            {worldBuilding ? (
              worldBuilding.floors?.map((f, idx) => (
                <div key={idx} className="rounded-xl border p-3">
                  <div className="font-medium">{f.title}</div>
                  {f.rooms?.length ? (
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {f.rooms.map((r, i) => (
                        <li key={i} className="px-2 py-0.5 text-xs rounded bg-black/5">{r}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-xs text-gray-500">No rooms listed.</div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 mt-3">World Building not defined in nbs-map.json.</div>
            )}
          </div>
        ) : (
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            {(selectedBlock?.buildings || []).map((b) => (
              <div key={b.id} className="rounded-xl border p-3">
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  {b.type === "language" ? "Language" : b.type === "shared" ? "Shared" : "Core"}
                </div>
                <div className="font-medium">{b.title}</div>
                <div className="mt-2 text-xs text-gray-500">{b.floors?.length || 0} floors</div>
                {b.note && <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">{b.note}</div>}
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/nbs" className="px-3 py-2 rounded-lg border hover:bg-gray-50 text-sm">Read NBS Notes</Link>
          <Link href="/hire-me" className="px-3 py-2 rounded-lg bg-black text-white text-sm">Work With Me</Link>
        </div>
      </div>
    </div>
  );
}
