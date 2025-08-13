// lib/rss.js
import { XMLParser } from "fast-xml-parser";

export async function fetchRssItems(feedUrl) {
  try {
    const res = await fetch(feedUrl, { cache: "no-store" });
    if (!res.ok) return [];
    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false });
    const data = parser.parse(xml);

    const channel = data?.rss?.channel;
    const raw = Array.isArray(channel?.item)
      ? channel.item
      : channel?.item
        ? [channel.item]
        : [];

    return raw.map((it) => {
      // tags from <category>
      const cats = Array.isArray(it.category) ? it.category : (it.category ? [it.category] : []);
      const tags = cats
        .map((c) => (typeof c === "string" ? c : (c?.["#text"] || "")))
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      return {
        source: new URL(feedUrl).hostname.replace("www.", ""),
        title: it.title,
        link: it.link,
        pubDate: it.pubDate || it["atom:updated"] || it.updated,
        coverUrl: extractImageFromContent(it["content:encoded"] || it.description || ""),
        excerpt: stripHtml(it.description || "").slice(0, 200),
        tags,
      };
    });
  } catch {
    return [];
  }
}

function stripHtml(html) {
  return html?.replace?.(/<[^>]*>/g, "") ?? "";
}

function extractImageFromContent(html) {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : undefined;
}
