import Link from "next/link";
import { allBlogs } from "contentlayer/generated";
import MdxRenderer from "@/components/MdxRenderer";

export function generateStaticParams() {
  return allBlogs.map(p => ({ slug: p._raw.flattenedPath.replace(/^blog\//,'').split('/') }));
}

export function generateMetadata({ params }) {
  const slug = (params.slug||[]).join("/");
  const post = allBlogs.find(p => p._raw.flattenedPath === `blog/${slug}`);
  if (!post) return {};
  return { title: `${post.title} • Blog`, description: post.summary || post.title };
}

export default function BlogPost({ params }){
  const slug = (params.slug||[]).join("/");
  const post = allBlogs.find(p => p._raw.flattenedPath === `blog/${slug}`);
  if(!post) return <div className="card">Not found.</div>;
  return (
    <article className="space-y-4">
      <div className="card">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <div className="muted text-sm">{new Date(post.date).toLocaleDateString()}</div>
          </div>
          <Link href="/blog" className="btn">← All posts</Link>
        </div>
        {post.summary && <p className="muted mt-2">{post.summary}</p>}
      </div>
      <div className="card-solid prose max-w-none">
        <MdxRenderer code={post.body.code} />
      </div>
    </article>
  );
}
