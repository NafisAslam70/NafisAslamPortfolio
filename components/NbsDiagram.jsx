"use client";
import { useMemo, useState } from "react";

function Pill({ children }) {
  return <span className="px-2 py-0.5 text-xs rounded-full bg-black/5">{children}</span>;
}

export default function NbsDiagram({ data }) {
  const [activeBlock, setActiveBlock] = useState(data.blocks[0]?.id || null);
  const [activeBuilding, setActiveBuilding] = useState(null);
  const currentBlock = useMemo(
    () => data.blocks.find(b => b.id === activeBlock) || data.blocks[0],
    [data, activeBlock]
  );
  const currentBuilding = useMemo(
    () => currentBlock?.buildings.find(b => b.id === activeBuilding) || null,
    [currentBlock, activeBuilding]
  );

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="rounded-2xl p-6 bg-gradient-to-br from-slate-50 to-white border">
        <h1 className="text-3xl font-bold">{data.title}</h1>
        <p className="text-gray-600 mt-1">{data.subtitle}</p>
      </section>

      {/* Blocks Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.blocks.map((blk) => (
          <button
            key={blk.id}
            onClick={() => { setActiveBlock(blk.id); setActiveBuilding(null); }}
            className={`text-left rounded-2xl p-5 border transition hover:shadow-sm bg-gradient-to-br ${blk.accent} text-white relative overflow-hidden
              ${activeBlock === blk.id ? "ring-2 ring-black/20" : "opacity-95"}`}
          >
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative">
              <h2 className="text-xl font-semibold">{blk.title}</h2>
              <p className="text-white/85 text-sm mt-1">{blk.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {blk.buildings.slice(0,3).map(b => <Pill key={b.id}>{b.title}</Pill>)}
                {blk.buildings.length > 3 && <Pill>+{blk.buildings.length - 3} more</Pill>}
              </div>
            </div>
          </button>
        ))}
      </section>

      {/* Buildings + Details */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Buildings list */}
        <div className="rounded-2xl border p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">{currentBlock?.title} — Buildings</h3>
            <div className="text-xs text-gray-500">{currentBlock?.buildings?.length || 0} total</div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {currentBlock?.buildings?.map((b) => (
              <button
                key={b.id}
                onClick={() => setActiveBuilding(b.id)}
                className={`rounded-xl border p-4 text-left transition hover:shadow-sm
                  ${activeBuilding === b.id ? "ring-2 ring-black/10" : ""}`}
              >
                <div className="text-sm text-gray-500 mb-1 uppercase tracking-wide">
                  {b.type === "language" ? "Language" : b.type === "shared" ? "Shared" : "Core"}
                </div>
                <div className="font-medium">{b.title}</div>
                <div className="mt-2 text-xs text-gray-500">
                  {b.floors?.length || 0} floors
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div className="rounded-2xl border p-4 bg-white">
          {!currentBuilding ? (
            <div className="text-gray-500 text-sm">Select a building to see floors & rooms.</div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{currentBuilding.title}</h3>
                {currentBuilding.note && <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">{currentBuilding.note}</span>}
              </div>

              {/* Floors */}
              <div className="space-y-3">
                {currentBuilding.floors?.map((f, idx) => (
                  <div key={idx} className="rounded-xl border p-3">
                    <div className="font-medium">{f.title}</div>
                    {f.rooms?.length ? (
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {f.rooms.map((r, i) => (
                          <li key={i} className="px-2 py-0.5 text-xs rounded bg-black/5">{r}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-xs text-gray-500">No rooms listed yet.</div>
                    )}
                  </div>
                ))}
                {!currentBuilding.floors?.length && (
                  <div className="text-sm text-gray-500">No floors yet — add some in <code>content/nbs-map.json</code>.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Guidance card */}
      <section className="rounded-2xl border p-5 bg-white">
        <h4 className="font-semibold">How to extend this map</h4>
        <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-1 mt-2">
          <li>Edit <code>content/nbs-map.json</code> to add blocks, buildings, floors, rooms.</li>
          <li>Use the <em>World Building</em> to store interview/system-design/project layers.</li>
          <li>Link specific rooms to MDX notes later (e.g., <code>/nbs/your-note-slug</code>).</li>
        </ol>
      </section>
    </div>
  );
}
