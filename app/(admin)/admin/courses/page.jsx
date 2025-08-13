// app/(admin)/admin/courses/page.jsx
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { courses } from "@/lib/schema";
import { desc, asc } from "drizzle-orm";
import { cookies } from "next/headers";
import { COOKIE, verifyToken } from "@/lib/auth";

export const metadata = { title: "Admin • Courses" };

// --- server action: create course (same file) ---
async function createCourse(formData) {
  "use server";

  const token = cookies().get(COOKIE)?.value || null;
  const session = await verifyToken(token);
  if (!session || session.role !== "admin") throw new Error("Unauthorized");

  const title = (formData.get("title") || "").toString().trim();
  const slug  = (formData.get("slug")  || "").toString().trim();
  const description = (formData.get("description") || "").toString();
  const coverUrl    = (formData.get("coverUrl")    || "").toString();
  const isFree      = formData.get("isFree") ? true : false;
  const published   = formData.get("published") ? true : false;
  const priceCents  = Number(formData.get("priceCents") || 0);

  if (!title || !slug) throw new Error("Title and slug are required");

  await db.insert(courses).values({
    title, slug, description, coverUrl, isFree, published, priceCents,
  });

  revalidatePath("/admin/courses");
}

export default async function AdminCoursesIndex(){
  const rows = await db.select().from(courses).orderBy(desc(courses.createdAt));

  return (
    <div className="space-y-6">
      <section className="card">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Courses</h2>
          <div className="flex gap-2">
            {/* removed /new button; creation is inline */}
            <Link href="/courses" className="btn">Public Courses</Link>
          </div>
        </div>
      </section>

      {/* Inline create form */}
      <section className="card-solid">
        <h3 className="text-lg font-semibold mb-3">New Course</h3>
        <form action={createCourse} className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm muted">Title</label>
            <input name="title" className="input w-full" required />
          </div>
          <div>
            <label className="text-sm muted">Slug</label>
            <input name="slug" className="input w-full" required />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm muted">Description</label>
            <textarea name="description" rows={3} className="input w-full" />
          </div>
          <div>
            <label className="text-sm muted">Cover URL</label>
            <input name="coverUrl" className="input w-full" />
          </div>
          <div>
            <label className="text-sm muted">Price (cents)</label>
            <input name="priceCents" type="number" defaultValue={0} className="input w-full" />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input name="isFree" type="checkbox" /> Free
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input name="published" type="checkbox" /> Published
            </label>
          </div>
          <div className="md:col-span-2">
            <button className="btn btn-primary">Create Course</button>
          </div>
        </form>
      </section>

      {/* List table (unchanged) */}
      <section className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left muted">
                <th className="py-2">Title</th>
                <th className="py-2">Slug</th>
                <th className="py-2">Published</th>
                <th className="py-2">Free</th>
                <th className="py-2">Price</th>
                <th className="py-2">Open</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(c => (
                <tr key={c.id} className="border-t border-[color:var(--border)]">
                  <td className="py-2">{c.title}</td>
                  <td className="py-2">{c.slug}</td>
                  <td className="py-2">{c.published ? "✅" : "—"}</td>
                  <td className="py-2">{c.isFree ? "✅" : "—"}</td>
                  <td className="py-2">{c.priceCents ? `₹${(c.priceCents/100).toFixed(0)}` : "—"}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <Link className="btn" href={`/admin/courses/${c.slug}`}>Manage</Link>
                      <Link className="btn" href={`/courses/${c.slug}`} target="_blank">View</Link>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="py-6 text-center muted" colSpan={6}>No courses</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
