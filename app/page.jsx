import Link from "next/link";
import { allBlogs, allNows } from "contentlayer/generated";
import { useMDXComponent } from "next-contentlayer/hooks";

// DB + schema (safe fallback if DB not configured)
import { db } from "@/lib/db";
import { reels as reelsTable } from "@/lib/schema";
import { desc } from "drizzle-orm";

// Content JSON (shape-agnostic fallbacks)
import venturesJson from "@/content/ventures.json";
import nbsMapJson from "@/content/nbs-map.json";

function formatDate(d) {
  try {
    const dt = typeof d === "string" ? new Date(d) : d;
    return dt.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return d ?? "";
  }
}

export default async function HomePage() {
  // Blogs (Contentlayer)
  const posts = [...allBlogs]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  // Now (Contentlayer)
  const now = [...allNows]
    .sort((a, b) => new Date(b.updated) - new Date(a.updated))[0];
  const NowBody = now ? useMDXComponent(now.body.code) : null;

  // Reels (Drizzle) — graceful fallback if DB isn’t available yet
  let reels = [];
  try {
    reels = await db
      .select()
      .from(reelsTable)
      .orderBy(desc(reelsTable.createdAt))
      .limit(3);
  } catch {
    reels = [];
  }

  // Ventures preview (works whether file is an array or {items:[]})
  const ventures =
    Array.isArray(venturesJson) ? venturesJson : venturesJson?.items || [];

  // NBS stats (best-effort)
  const nbsNodes = Array.isArray(nbsMapJson?.nodes)
    ? nbsMapJson.nodes.length
    : Array.isArray(nbsMapJson)
    ? nbsMapJson.length
    : undefined;

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Quick snapshot of what’s live across the site.
        </p>
      </section>

      {/* Top Grid: Now + Quick Links */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border p-5">
          <h2 className="text-xl font-semibold mb-3">Now / Current Work</h2>
          {now ? (
            <div className="prose max-w-none">
              <div className="text-sm text-gray-500 mb-1">
                Updated: {formatDate(now.updated)}
              </div>
              <h3 className="font-semibold">{now.title}</h3>
              <NowBody />
            </div>
          ) : (
            <p className="text-gray-500">No current update yet.</p>
          )}
        </div>

        <div className="rounded-2xl border p-5 space-y-3">
          <h3 className="font-semibold">Quick Links</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link className="underline hover:no-underline" href="/blog">
              Blog
            </Link>
            <Link className="underline hover:no-underline" href="/reels">
              Reels
            </Link>
            <Link className="underline hover:no-underline" href="/courses">
              Courses
            </Link>
            <Link className="underline hover:no-underline" href="/ventures">
              Ventures
            </Link>
            <Link className="underline hover:no-underline" href="/nbs">
              NBS
            </Link>
            <Link className="underline hover:no-underline" href="/hire-me">
              Hire Me
            </Link>
          </div>
          <div className="text-xs text-gray-500">
            {typeof nbsNodes === "number" ? (
              <span>NBS graph: {nbsNodes} nodes</span>
            ) : (
              <span>Explore the NBS →</span>
            )}
          </div>
        </div>
      </section>

      {/* Latest Blogs */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Latest Blogs</h2>
          <Link className="text-sm underline" href="/blog">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {posts.length > 0 ? (
            posts.map((p) => (
              <article key={p._id} className="rounded-xl border p-4">
                <Link
                  href={`/blog/${p._raw.flattenedPath}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {p.title}
                </Link>
                <div className="text-sm text-gray-500">
                  {formatDate(p.date)}
                </div>
                {p.summary && (
                  <p className="text-gray-700 mt-1">{p.summary}</p>
                )}
                {Array.isArray(p.tags) && p.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs rounded-full border px-2 py-0.5 text-gray-600"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))
          ) : (
            <p className="text-gray-500">No posts yet.</p>
          )}
        </div>
      </section>

      {/* Reels Preview */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Featured Reels</h2>
          <Link className="text-sm underline" href="/reels">
            Browse all
          </Link>
        </div>
        {reels.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reels.map((r) => (
              <div key={r.id} className="rounded-xl border p-4 space-y-1">
                <div className="text-sm text-gray-500">
                  {r.type || "reel"} • {formatDate(r.createdAt)}
                </div>
                <div className="font-medium">{r.title}</div>
                {r.ref && (
                  <a
                    href={r.ref}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    Watch
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No reels yet. Add some in <code>/admin/reels</code>.
          </p>
        )}
      </section>

      {/* Ventures Snapshot */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Ventures</h2>
          <Link className="text-sm underline" href="/ventures">
            See all
          </Link>
        </div>
        {ventures.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {ventures.slice(0, 2).map((v, i) => (
              <div key={v.slug || i} className="rounded-xl border p-4">
                <div className="text-sm text-gray-500">
                  {v.stage || v.status || "Active"}
                </div>
                <div className="font-medium">
                  <Link
                    href={
                      v.slug
                        ? `/ventures/${v.slug}`
                        : "/ventures"
                    }
                    className="hover:underline"
                  >
                    {v.title || v.name || "Venture"}
                  </Link>
                </div>
                {v.description && (
                  <p className="text-gray-700 mt-1">{v.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No ventures listed yet.</p>
        )}
      </section>
    </div>
  );
}
