import Link from "next/link";
import { allBlogs, allNows } from "contentlayer/generated";
import { useMDXComponent } from "next-contentlayer/hooks";

export default function HomePage() {
  const posts = [...allBlogs]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  const now = [...allNows]
    .sort((a, b) => new Date(b.updated) - new Date(a.updated))[0];

  const NowBody = now ? useMDXComponent(now.body.code) : null;

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Latest blogs and what I’m working on.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Latest Blogs</h2>
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p._id}>
              <Link href={`/blog/${p._raw.flattenedPath}`} className="text-blue-600 hover:underline">
                {p.title}
              </Link>
              <div className="text-sm text-gray-500">{p.date}</div>
              {p.summary && <p className="text-gray-700">{p.summary}</p>}
            </div>
          ))}
          {posts.length === 0 && <p className="text-gray-500">No posts yet.</p>}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Now / Current Work</h2>
        {now ? (
          <div className="prose">
            <div className="text-sm text-gray-500 mb-1">Updated: {now.updated}</div>
            <h3 className="font-semibold">{now.title}</h3>
            <NowBody />
          </div>
        ) : (
          <p className="text-gray-500">No current update yet.</p>
        )}
      </section>
    </div>
  );
}
