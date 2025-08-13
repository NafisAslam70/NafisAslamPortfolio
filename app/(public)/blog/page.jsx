export const dynamic = "force-dynamic";

import Link from "next/link";
import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { fetchRssItems } from "@/lib/rss";

export const metadata = { title: "Blog • Nafees", description: "Articles and notes." };

function slugifyTag(t){ return t.toLowerCase().replace(/\s+/g, "-"); }
function unslugifyTag(s){ return s.replace(/-/g, " "); }

async function getExternal() {
  const feeds = (process.env.BLOG_EXTERNAL_FEEDS || "")
    .split(",").map(s => s.trim()).filter(Boolean);
  const lists = await Promise.all(feeds.map(fetchRssItems));
  return lists.flat();
}

export default async function BlogIndex({ searchParams }){
  const selected = (searchParams?.tag || "").toString().toLowerCase();

  // Local posts
  const local = await db.select().from(posts).orderBy(desc(posts.createdAt));
  const localItems = local
    .filter(p => !!p.published)
    .map(p => ({
      type: "local",
      title: p.title,
      href: `/blog/${p.slug}`,
      date: p.createdAt?.toISOString?.() || null,
      cover: p.coverUrl || null,
      excerpt: p.excerpt || null,
      source: "nafis.personal.blogsite",
      tags: Array.isArray(p.tags) ? p.tags : [],
    }));

  // External (Medium)
  const external = await getExternal();
  const externalItems = external.map(e => ({
    type: "external",
    title: e.title,
    href: e.link,
    date: e.pubDate ? new Date(e.pubDate).toISOString() : null,
    cover: e.coverUrl || null,
    excerpt: e.excerpt || null,
    source: e.source,
    tags: Array.isArray(e.tags) ? e.tags : [],
  }));

  // Tag list
  const tagSet = new Set();
  for (const it of [...localItems, ...externalItems]) it.tags.forEach(t => tagSet.add(t));
  const allTags = Array.from(tagSet).sort();

  // Filter
  const filtered = selected
    ? [...localItems, ...externalItems].filter(it => it.tags.some(t => slugifyTag(t) === selected))
    : [...localItems, ...externalItems];

  // Sort by date desc
  const all = filtered.sort((a,b)=> (b.date?+new Date(b.date):0) - (a.date?+new Date(a.date):0));

  return (
    <div className="space-y-6">
      <section className="card">
        <h1 className="text-3xl font-bold">My Blogs</h1>
        <p className="muted">Articles from here and around the web.</p>
      </section>

      {/* Tag chips */}
      <section className="card-solid">
        <div className="flex flex-wrap gap-2">
          <Link href="/blog" className={`btn ${!selected ? "btn-primary" : "btn-ghost"}`}>All</Link>
          {allTags.map(tag => {
            const slug = slugifyTag(tag);
            return (
              <Link
                key={slug}
                href={`/blog?tag=${encodeURIComponent(slug)}`}
                className={`btn ${selected === slug ? "btn-primary" : "btn-ghost"}`}
              >
                {unslugifyTag(tag)}
              </Link>
            );
          })}
          {allTags.length === 0 && <span className="muted text-sm">No tags yet</span>}
        </div>
      </section>

      {/* Cards */}
      <section className="grid gap-4 sm:grid-cols-2">
        {all.map((it, i)=>(
          <article key={`${it.type}:${it.href}:${i}`} className="card-solid space-y-3">
            {it.cover && (
              <div className="overflow-hidden rounded-xl">
                <img src={it.cover} alt={it.title} className="h-48 w-full object-cover" />
              </div>
            )}
            <div className="text-xs uppercase tracking-wide text-[color:var(--muted)]">
              {it.source}{it.type==="external" ? " • External" : ""}
            </div>
            <h2 className="text-lg font-semibold">
              <Link href={it.href} target={it.type==="external" ? "_blank" : undefined} className="link">
                {it.title}
              </Link>
            </h2>
            {it.excerpt && <p className="muted text-sm">{it.excerpt}</p>}
            {it.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {it.tags.map((t,j)=>(
                  <Link
                    key={`${i}-${j}-${t}`}
                    href={`/blog?tag=${encodeURIComponent(slugifyTag(t))}`}
                    className="btn btn-ghost text-xs"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            )}
          </article>
        ))}
        {all.length===0 && <div className="card">No posts yet</div>}
      </section>
    </div>
  );
}
