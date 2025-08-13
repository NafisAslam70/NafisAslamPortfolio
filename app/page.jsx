import { allBlogs, allNows } from "contentlayer/generated";

// DB + schema (safe fallback if DB not configured)
import { db } from "@/lib/db";
import { reels as reelsTable } from "@/lib/schema";
import { desc } from "drizzle-orm";

// Content JSON (shape-agnostic fallbacks)
import venturesJson from "@/content/ventures.json";
import nbsMapJson from "@/content/nbs-map.json";

// Import the client component (adjust path if your components folder is different)
import ClientDashboard from "@/components/ClientDashboard";

export default async function HomePage() {
  // Blogs (Contentlayer)
  const posts = [...allBlogs]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

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

  // Pass all fetched data as props to the client component
  return (
    <ClientDashboard
      posts={posts}
      now={now}
      reels={reels}
      ventures={ventures}
      nbsNodes={nbsNodes}
    />
  );
}