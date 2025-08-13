import Link from "next/link";
import ventures from "@/content/ventures.json";

export const metadata = { title: "Ventures • Nafees", description: "Active ventures and projects." };

export default function VenturesPage(){
  const items = ventures.items || [];
  return (
    <div className="space-y-6">
      <section className="card">
        <h1 className="text-3xl font-bold">Ventures</h1>
        <p className="muted">Focused bets I’m building long-term.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {items.map(v=>(
          <div key={v.slug} className="rounded-2xl p-5 border relative overflow-hidden" style={{borderColor:"rgb(var(--border))"}}>
            <div className={`absolute inset-0 bg-gradient-to-br ${v.accent} opacity-10`} />
            <div className="relative space-y-2">
              <h3 className="text-xl font-semibold">{v.title}</h3>
              <div className="muted">{v.tagline}</div>
              <p>{v.summary}</p>
              <div className="pt-2">
                <Link href={v.url || "#"} className="btn btn-primary">Open</Link>
              </div>
            </div>
          </div>
        ))}
        {items.length===0 && <div className="card">No ventures yet.</div>}
      </section>
    </div>
  );
}
