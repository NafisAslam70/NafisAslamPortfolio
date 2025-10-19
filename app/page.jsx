import { allBlogs, allNows } from "contentlayer/generated";

// DB + schema (safe fallback if DB not configured)
import { db } from "@/lib/db";
import { posts as postsTable, reels as reelsTable } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";

// Content JSON (shape-agnostic fallbacks)
import venturesJson from "@/content/ventures.json";
import nbsMapJson from "@/content/nbs-map.json";

// Import the client component (adjust path if your components folder is different)
import ClientDashboard from "@/components/ClientDashboard";
import { fetchRssItems } from "@/lib/rss";

export default async function HomePage() {
  // Blog posts — prefer DB, fall back to Contentlayer
  let localPosts = [];
  try {
    const rows = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.published, true))
      .orderBy(desc(postsTable.createdAt))
      .limit(6);

    localPosts = rows.map((row) => ({
      id: row.id,
      title: row.title,
      summary: row.excerpt || (row.contentMd ? row.contentMd.slice(0, 160) : null),
      date: row.createdAt ? row.createdAt.toISOString() : null,
      tags: Array.isArray(row.tags) ? row.tags : [],
      href: row.externalUrl || `/blog/${row.slug}`,
      external: Boolean(row.externalUrl),
      cover: row.coverUrl || null,
      source: "nafis.aslam",
    }));
  } catch {
    localPosts = [];
  }

  let externalPosts = [];
  const feedUrls = (process.env.BLOG_EXTERNAL_FEEDS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (feedUrls.length) {
    try {
      const lists = await Promise.all(feedUrls.map(fetchRssItems));
      externalPosts = lists.flat().map((item, idx) => {
        const host = (() => {
          if (item.source) return item.source;
          if (!item.link) return "external";
          try {
            return new URL(item.link).hostname.replace("www.", "");
          } catch {
            return "external";
          }
        })();

        return {
          id: `external-${item.link ?? idx}`,
          title: item.title ?? "Untitled",
          summary: item.excerpt ?? null,
          date: item.pubDate ? new Date(item.pubDate).toISOString() : null,
          tags: Array.isArray(item.tags) ? item.tags : [],
          href: item.link ?? "#",
          external: true,
          cover: item.coverUrl ?? null,
          source: host,
        };
      });
    } catch {
      externalPosts = [];
    }
  }

  let posts = [...localPosts, ...externalPosts]
    .filter((p) => !!p.title && !!p.href)
    .sort((a, b) => {
      const aDate = a.date ? new Date(a.date).getTime() : 0;
      const bDate = b.date ? new Date(b.date).getTime() : 0;
      return bDate - aDate;
    })
    .slice(0, 3);

  if (!posts.length) {
    posts = [...allBlogs]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3)
      .map((post) => ({
        id: post._id,
        title: post.title,
        summary: post.summary ?? null,
        date: post.date ?? null,
        tags: Array.isArray(post.tags) ? post.tags : [],
        href: `/blog/${post._raw.flattenedPath.replace(/^blog\//, "")}`,
        external: false,
        cover: null,
        source: "nafis.aslam",
      }));
  }

  // Now (Contentlayer)
  const now = [...allNows]
    .sort((a, b) => new Date(b.updated) - new Date(a.updated))[0];

  // Reels (Drizzle) — graceful fallback if DB isn’t available yet
  let reels = [];
  try {
    reels = await db
      .select()
      .from(reelsTable)
      .orderBy(desc(reelsTable.createdAt))
      .limit(6);
  } catch {
    reels = [];
  }

  const normalizedReels = reels.map((reel) => ({
    ...reel,
    createdAt: reel.createdAt ? reel.createdAt.toISOString() : null,
    href:
      reel.type === "youtube"
        ? `https://www.youtube.com/watch?v=${reel.ref}`
        : "/reels",
  }));

  // Ventures preview (works whether file is an array or {items:[]})
  const ventures =
    Array.isArray(venturesJson) ? venturesJson : venturesJson?.items || [];

  // NBS stats (best-effort)
  const nbsNodes = Array.isArray(nbsMapJson?.nodes)
    ? nbsMapJson.nodes.length
    : Array.isArray(nbsMapJson)
    ? nbsMapJson.length
    : undefined;

  // Pass all fetched data as props to the client component
  return (
    <ClientDashboard
      posts={posts}
      now={now}
      reels={normalizedReels}
      ventures={ventures}
      nbsNodes={nbsNodes}
    />
  );
}
