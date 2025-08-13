export const dynamic = "force-dynamic";

import Link from "next/link";
import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { fetchRssItems } from "@/lib/rss";

function slugifyTag(t){ return t.toLowerCase().replace(/\s+/g, "-"); }
function unslugifyTag(s){ return s.replace(/-/g, " "); }

export function generateMetadata({ params }) {
  const input = decodeURIComponent(params.tag || "");
  const tag = unslugifyTag(input);
  return { title: `#${tag} • Blog`, description: `Posts tagged ${tag}` };
}

async function getExternal() {
  const feeds = (process.env.BLOG_EXTERNAL_FEEDS || "")
    .split(",").map(s => s.trim()).filter(Boolean);
  const lists = await Promise.all(feeds.map(fetchRssItems));
  return lists.flat();
}

export default async function TagPage({ params }) {
  // accept both raw tag and slugified tag in URL
  const raw = decodeURIComponent(params.tag || "");
  const wantSlug = raw === slugifyTag(raw);
  const wanted = wantSlug ? raw : slugifyTag(raw);
  const display = unslugifyTag(wanted);

  // Local posts (DB)
  const local = await db.select().from(posts).orderBy(desc(posts.createdAt));
  const localItems = local
    .filter(p => p.published)
    .map(p => ({
      type: "local",
      title: p.title,
      href: `/blog/${p.slug}`,
      date: p.createdAt ? new Date(p.createdAt).toISOString() : null,
      excerpt: p.excerpt || null,
      source: "nafis.brand",
      tags: Array.isArray(p.tags) ? p.tags : [],
    }))
    .filter(it => it.tags.some(t => slugifyTag(t) === wanted));

  // External (Medium via RSS)
  const external = await getExternal();
  const externalItems = external
    .map(e => ({
      type: "external",
      title: e.title,
      href: e.link,
      date: e.pubDate ? new Date(e.pubDate).toISOString() : null,
      excerpt: e.excerpt || null,
      source: e.source,
      tags: Array.isArray(e.tags) ? e.tags : [],
    }))
    .filter(it => it.tags.some(t => slugifyTag(t) === wanted));

  const postsForTag = [...localItems, ...externalItems]
    .sort((a,b)=> (b.date?+new Date(b.date):0) - (a.date?+new Date(a.date):0));

  return (
    <div className="space-y-6">
      <section className="card">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">#{display}</h1>
          <Link href="/blog" className="btn">← All posts</Link>
        </div>
      </section>

      <section className="space-y-3">
        {postsForTag.map((p, i) => (
          <article key={`${p.type}:${p.href}:${i}`} className="card-solid">
            <h2 className="text-lg font-semibold">
              <Link
                href={p.href}
                className="hover:opacity-90"
                target={p.type === "external" ? "_blank" : undefined}
              >
                {p.title}
              </Link>
            </h2>
            <div className="muted mt-1 text-xs">
              {p.date ? new Date(p.date).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}) : ""}
              {p.type === "external" ? " • External" : ""}
            </div>
            {p.excerpt && <p className="muted mt-2">{p.excerpt}</p>}
          </article>
        ))}
        {postsForTag.length === 0 && (
          <div className="card text-center muted">No posts for this tag.</div>
        )}
      </section>
    </div>
  );
}
