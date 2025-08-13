import { allBlogs } from "contentlayer/generated";

export async function GET() {
  const posts = allBlogs
    .filter((p) => p.published !== false)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

  const site = "https://www.nafeesaslam.com";

  const items = posts.map((p) => {
    const url = site + p.url;
    return `
      <item>
        <title><![CDATA[${p.title}]]></title>
        <link>${url}</link>
        <guid>${url}</guid>
        <pubDate>${new Date(p.date).toUTCString()}</pubDate>
        <description><![CDATA[${p.summary || ""}]]></description>
      </item>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Nafees — Blog</title>
      <link>${site}/blog</link>
      <description>Articles by Nafees</description>
      ${items}
    </channel>
  </rss>`;

  return new Response(xml, { status: 200, headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
