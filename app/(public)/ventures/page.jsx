import Link from "next/link";
import ventures from "@/content/ventures.json";

export const metadata = {
  title: "Ventures • Nafees",
  description: "Active ventures and projects.",
};

export default function VenturesPage() {
  const items = ventures.items || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="card">
        <h1 className="text-3xl font-bold">Ventures</h1>
        <p className="muted">Focused bets I’m building long-term.</p>
      </section>

      {/* Ventures grid */}
      <section className="grid gap-4 md:grid-cols-2">
        {items.map((v) => (
          <div
            key={v.slug}
            className="relative overflow-hidden rounded-2xl border p-5"
            style={{ borderColor: "rgb(var(--border))" }}
          >
            {/* soft accent wash */}
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${v.accent || "from-indigo-500/20 to-fuchsia-500/20"} opacity-15`} />
            <div className="relative space-y-2">
              <h3 className="text-xl font-semibold">{v.title}</h3>
              <div className="muted">{v.tagline}</div>
              {v.summary && <p>{v.summary}</p>}
              <div className="pt-2">
                <Link href={v.url || "#"} className="btn btn-primary">
                  Open
                </Link>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="card">No ventures yet.</div>}
      </section>

      {/* Courses callout */}
      <section className="card">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex-1 space-y-2">
            <h2 className="text-xl font-semibold">Explore my courses</h2>
            <p className="text-sm text-[color:rgb(var(--muted))] max-w-prose">
              Practical, no-fluff programs on building, productivity and the creator tech stack —
              packed with systems, templates and real workflows.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link href="/courses" className="btn btn-primary">
                Browse Courses
              </Link>
              <Link href="/blog/tags/learning" className="btn">
                Why I teach
              </Link>
            </div>
          </div>

          {/* optional mini highlights — edit or remove freely */}
          <ul className="w-full md:w-72 space-y-2">
            <li className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "rgb(var(--border))" }}>
              ✅ Systems over hacks
            </li>
            <li className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "rgb(var(--border))" }}>
              ✅ Actionable templates & checklists
            </li>
            <li className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "rgb(var(--border))" }}>
              ✅ Lifetime updates
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
