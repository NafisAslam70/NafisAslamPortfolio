import Link from "next/link";
import map from "@/content/nbs-map.json";

export const metadata = {
  title: "NBS Manifesto • Nafees",
  description: "How my brain is architected for mastery, speed, and real-world impact.",
};

function Card({ children, className = "" }) {
  return <div className={`card-solid ${className}`}>{children}</div>;
}

export default function NbsManifestoPage() {
  const blocks = map?.blocks || [];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Nafees Brain Society (NBS)</h1>
            <p className="muted mt-1">
              The brain is your story. I’ve designed mine as a city of{" "}
              <strong>Blocks → Buildings → Floors → Rooms</strong>.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/nbs" className="btn">← Back to NBS</Link>
            <Link href="/hire-me" className="btn btn-primary">Work With Me</Link>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/nbs/architecture" className="btn">Open Full Map</Link>
        </div>
      </section>

      {/* Core thesis */}
      <Card>
        <h2 className="text-xl font-semibold">Core Thesis</h2>
        <p className="muted mt-2">
          Life is an <strong>exchange of worth</strong>. The world rewards what it can feel. I become{" "}
          <strong>so good</strong> they can’t ignore me—through deliberate craft, zero-response-time recall,
          and clean application.
        </p>
      </Card>

      {/* How I’m different */}
      <Card>
        <h2 className="text-xl font-semibold">How I’m Different</h2>
        <ul className="mt-3 list-disc pl-5 space-y-2 muted">
          <li>
            <strong>Architecture over chaos:</strong> every skill has a precise address
            (Block/Building/Floor/Room).
          </li>
          <li>
            <strong>Zero-response-time wiring:</strong> I train retrieval speed × accuracy until it feels instant.
          </li>
          <li>
            <strong>World Building:</strong> a dedicated interface where knowledge becomes interviews, projects,
            and decisions.
          </li>
          <li>
            <strong>Craftsman &gt; passion:</strong> 4DX lead measures, scoreboard, cadence—discipline beats vibes.
          </li>
        </ul>
      </Card>

      {/* Craftsman OS */}
      <Card>
        <h2 className="text-xl font-semibold">My Craftsman Operating System</h2>
        <ol className="mt-3 list-decimal pl-5 space-y-2 muted">
          <li>
            <strong>Decide the Market (WIG):</strong> pick the arena where excellence pays.
          </li>
          <li>
            <strong>Build Career Capital (Lead Measures):</strong> thousands of deliberate hours.
          </li>
          <li>
            <strong>Isolate &amp; Focus:</strong> block noise, deepen the alley, love the grind.
          </li>
          <li>
            <strong>Compelling Scoreboard:</strong> professor-level tracking (hours, drills, outcomes).
          </li>
          <li>
            <strong>Cadence of Accountability:</strong> weekly reviews and feedback loops.
          </li>
        </ol>
      </Card>

      {/* Brain, mapped */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">My Brain, Mapped</h2>

        <div className="grid gap-4 md:grid-cols-3">
          {blocks.map((blk) => (
            <div
              key={blk.id}
              className={`rounded-2xl border p-5 bg-gradient-to-br ${blk.accent} text-white relative overflow-hidden`}
              style={{ borderColor: "var(--border)" }}
            >
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative space-y-2">
                <h3 className="text-lg font-semibold">{blk.title}</h3>
                <p className="text-white/85 text-sm">{blk.description}</p>

                <div className="flex flex-wrap gap-2 text-xs mt-2">
                  {(blk.buildings || []).slice(0, 4).map((b) => (
                    <span key={b.id} className="px-2 py-0.5 rounded-full bg-white/15">
                      {b.title}
                    </span>
                  ))}
                  {blk.buildings?.length > 4 && (
                    <span className="px-2 py-0.5 rounded-full bg-white/15">
                      +{blk.buildings.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link href="/nbs/architecture" className="btn mt-2 inline-block">
          Open Full Architecture →
        </Link>
      </section>
    </div>
  );
}
