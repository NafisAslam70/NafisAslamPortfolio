import Link from "next/link";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { COOKIE, verifyToken } from "@/lib/auth";
import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import Row from "./Row.client";

export const metadata = { title: "Admin • Blog" };
export const dynamic = "force-dynamic";

/* ---------- helpers ---------- */
function parseTags(input = "") {
  return input
    .toString()
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.toLowerCase());
}

async function requireAdmin() {
  const token = cookies().get(COOKIE)?.value || null;
  const session = await verifyToken(token);
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

/* ---------- server actions ---------- */
export async function createPost(formData) {
  "use server";
  await requireAdmin();

  const title = (formData.get("title") || "").toString().trim();
  const slug = (formData.get("slug") || "").toString().trim();
  const excerpt = (formData.get("excerpt") || "").toString();
  const coverUrl = (formData.get("coverUrl") || "").toString();
  const externalUrl = (formData.get("externalUrl") || "").toString().trim() || null;
  const contentMd = (formData.get("contentMd") || "").toString();
  const published = !!formData.get("published");
  const tags = parseTags(formData.get("tags") || "");

  if (!title || !slug) throw new Error("Title and slug are required");

  await db.insert(posts).values({
    title,
    slug,
    excerpt,
    coverUrl,
    externalUrl,
    contentMd,
    published,
    tags: tags.length ? tags : null,
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function updatePost(formData) {
  "use server";
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!id) throw new Error("Invalid post id");

  const title = (formData.get("title") || "").toString().trim();
  const slug = (formData.get("slug") || "").toString().trim();
  const excerpt = (formData.get("excerpt") || "").toString();
  const coverUrl = (formData.get("coverUrl") || "").toString();
  const externalUrl = (formData.get("externalUrl") || "").toString().trim() || null;
  const contentMd = (formData.get("contentMd") || "").toString();
  const published = !!formData.get("published");
  const tags = parseTags(formData.get("tags") || "");

  if (!title || !slug) throw new Error("Title and slug are required");

  await db
    .update(posts)
    .set({
      title,
      slug,
      excerpt,
      coverUrl,
      externalUrl,
      contentMd,
      published,
      tags: tags.length ? tags : null,
    })
    .where(eq(posts.id, id));

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
}

export async function deletePost(formData) {
  "use server";
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!id) throw new Error("Invalid post id");

  const [row] = await db.select().from(posts).where(eq(posts.id, id));
  await db.delete(posts).where(eq(posts.id, id));

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  if (row?.slug) revalidatePath(`/blog/${row.slug}`);
}

/* ---------- page ---------- */
export default async function AdminBlogPage() {
  const rows = await db.select().from(posts).orderBy(desc(posts.createdAt));

  return (
    <div className="space-y-6">
      <section className="card flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="muted">Create a native post or link to Medium/Substack. Add tags to cluster content.</p>
        </div>
        <Link href="/blog" className="btn">Public Blog</Link>
      </section>

      {/* Create */}
      <section className="card-solid">
        <h2 className="mb-3 text-lg font-semibold">New Post</h2>
        <form action={createPost} className="grid gap-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="label">Title</label>
              <input name="title" className="input" required />
            </div>
            <div>
              <label className="label">Slug</label>
              <input name="slug" className="input" required />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="label">Tags (comma separated)</label>
              <input name="tags" className="input" placeholder="computer-science, life, data-science, muslims" />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input name="published" type="checkbox" /> Published
              </label>
            </div>
          </div>

          <div>
            <label className="label">Excerpt</label>
            <textarea name="excerpt" rows={2} className="input" />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="label">Cover URL</label>
              <input name="coverUrl" className="input" />
            </div>
            <div>
              <label className="label">External URL (optional)</label>
              <input name="externalUrl" className="input" placeholder="Paste Medium/Substack link if this post lives off-site" />
              <p className="muted mt-1 text-xs">If you fill this, content below is optional.</p>
            </div>
          </div>

          <div>
            <label className="label">Content (Markdown)</label>
            <textarea name="contentMd" rows={10} className="input" placeholder="# Heading\n\nWrite your post here..." />
          </div>

          <button className="btn btn-primary">Create</button>
        </form>
      </section>

      {/* List + client rows */}
      <section className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="muted text-left">
                <th className="py-2">Title</th>
                <th className="py-2">Slug</th>
                <th className="py-2">Published</th>
                <th className="py-2">Tags</th>
                <th className="py-2">External</th>
                <th className="py-2">Open</th>
                <th className="py-2">Edit</th>
                <th className="py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <Row key={p.id} post={p} updatePost={updatePost} deletePost={deletePost} />
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="py-6 text-center muted" colSpan={8}>No posts</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
