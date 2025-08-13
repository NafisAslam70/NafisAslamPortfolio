import map from "@/content/nbs-map.json";
import Link from "next/link";

export const metadata = {
  title: "NBS • Architecture",
  description: "Blocks → Buildings → Floors → Rooms — full architecture map."
};

export default function NbsArchitecturePage() {
  return (
    <div className="space-y-6">
      <section className="card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Architecture Map</h1>
            <p className="muted mt-1">Blocks → Buildings → Floors → Rooms.</p>
          </div>
          <Link href="/nbs" className="btn">← Back to NBS</Link>
        </div>
      </section>

      <section className="card-solid">
        <div className="space-y-4">
          {map.blocks.map((block) => (
            <div key={block.id} className="card">
              <h2 className="text-xl font-semibold">{block.title}</h2>
              {block.description && <p className="muted mt-1">{block.description}</p>}

              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                {block.buildings?.map((b) => (
                  <div key={b.id} className="card-solid">
                    <div className="text-xs uppercase muted">
                      {b.type === "language" ? "Language" : b.type === "shared" ? "Shared" : "Core"}
                    </div>
                    <div className="font-medium">{b.title}</div>

                    {b.floors?.length ? (
                      <div className="mt-2 space-y-2">
                        {b.floors.map((f, i) => (
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
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs muted mt-2">No floors yet.</div>
                    )}

                    {b.note && (
                      <div className="mt-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded px-2 py-1">
                        {b.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
