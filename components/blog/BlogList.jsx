"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

function Badge({ children }) {
  return <span className="px-2 py-0.5 rounded-full text-xs bg-black/20">{children}</span>;
}

export default function BlogList({ posts }) {
  const [q, setQ] = useState("");
  const [activeTag, setActiveTag] = useState(null);

  const tags = useMemo(() => {
    const t = new Set();
    posts.forEach((p) => (p.tags || []).forEach((x) => t.add(x)));
    return Array.from(t).sort();
  }, [posts]);

  const filtered = posts.filter((p) => {
    const matchQ = !q || p.title.toLowerCase().includes(q.toLowerCase()) || (p.summary || "").toLowerCase().includes(q.toLowerCase());
    const matchTag = !activeTag || (p.tags || []).includes(activeTag);
    return matchQ && matchTag;
  });

  return (
    <div className="space-y-6">
      <section className="card">
        <h1 className="text-3xl font-bold">Blog</h1>
        <p className="muted mt-1">Articles, systems, and notes from the NBS lab.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search posts…" className="btn w-full sm:w-80" />
          <div className="flex flex-wrap gap-2">
            <button className={`btn ${!activeTag ? "bg-black text-white border-black" : ""}`} onClick={() => setActiveTag(null)}>All</button>
            {tags.map((t) => (
              <button key={t} onClick={() => setActiveTag(t)} className={`btn ${activeTag === t ? "bg-black text-white border-black" : ""}`}>#{t}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {filtered.map((p) => (
          <article key={p._id} className="card-solid">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">
                  <Link href={p.url} className="hover:opacity-90">{p.title}</Link>
                </h2>
                <div className="text-xs muted mt-1">
                  {new Date(p.date).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}
                </div>
              </div>
            </div>
            {p.summary && <p className="muted mt-3">{p.summary}</p>}
            {(p.tags || []).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {p.tags.map((t) => <Badge key={t}>#{t}</Badge>)}
              </div>
            )}
          </article>
        ))}
        {filtered.length === 0 && <div className="card col-span-full text-center muted">No posts match that.</div>}
      </section>
    </div>
  );
}
