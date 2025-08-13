import { allBlogs, allNotes } from "contentlayer/generated";

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticEntries = ["","blog","nbs","reels","ventures","hire-me"].map(p => ({
    url: `${base}/${p}`,
    lastModified: new Date().toISOString(),
  }));

  const blogEntries = allBlogs.map(p => ({
    url: `${base}/blog/${p.slug || p._raw.flattenedPath.replace(/^blog\//,'')}`,
    lastModified: p.date,
  }));

  const noteEntries = (allNotes || []).map(n => ({
    url: `${base}/nbs/${n.slug || n._raw.flattenedPath.replace(/^nbs\//,'')}`,
    lastModified: n.date,
  }));

  return [...staticEntries, ...blogEntries, ...noteEntries];
}
