
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { eq } from "drizzle-orm";

// tiny md → html (swap for remark later if you want)
function mdToHtml(md = "") {
  return md
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    .replace(/`([^`]+)`/gim, "<code>$1</code>")
    .replace(/\n\n/g, "<br/><br/>");
}

export async function generateMetadata({ params }) {
  const slug = params.slug;
  const [post] = await db.select().from(posts).where(eq(posts.slug, slug));
  if (!post) return {};
  return {
    title: `${post.title} • Blog`,
    description: post.excerpt || post.title,
  };
}

export default async function PostPage({ params }) {
  const slug = params.slug;
  const [post] = await db.select().from(posts).where(eq(posts.slug, slug));

  if (!post || !post.published) return notFound();

  // If this is a link post, just send users to the external article
  if (post.externalUrl) {
    redirect(post.externalUrl);
  }

  const tags = Array.isArray(post.tags) ? post.tags : [];

  return (
    <div className="space-y-6">
      {/* Top bar with Back button */}
      <section className="flex items-center justify-between">
        <Link href="/blog" className="btn">← Back to Blog</Link>
      </section>

      {/* Title / Excerpt */}
      <section className="card">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        {post.excerpt && <p className="muted mt-1">{post.excerpt}</p>}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {tags.map((t, i) => (
              <Link key={i} href={`/blog?tag=${encodeURIComponent(t.toLowerCase().replace(/\s+/g, "-"))}`} className="btn btn-ghost text-xs">
                #{t}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Cover */}
      {post.coverUrl && (
        <div className="overflow-hidden rounded-2xl">
          <img src={post.coverUrl} alt={post.title} className="w-full object-cover" />
        </div>
      )}

      {/* Content */}
      <section className="card-solid prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: mdToHtml(post.contentMd || "") }} />
      </section>

      {/* Bottom back link too (nice for long posts) */}
      <section>
        <Link href="/blog" className="btn">← Back to Blog</Link>
      </section>
    </div>
  );
}
