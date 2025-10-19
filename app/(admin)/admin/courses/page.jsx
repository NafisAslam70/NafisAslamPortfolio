// app/(admin)/admin/courses/page.jsx
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { courses } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { cookies } from "next/headers";
import { COOKIE, verifyToken } from "@/lib/auth";
import DeleteCourseButton from "@/components/admin/DeleteCourseButton";
import CourseCreatePanel from "@/components/admin/CourseCreatePanel";

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
    title, slug, description, coverUrl, isFree, priceCents,
    status: 'draft',
    published: false,
  });

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
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
      <CourseCreatePanel action={createCourse} />

      {/* List table (unchanged) */}
      <section className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left muted">
                <th className="py-2">Title</th>
                <th className="py-2">Slug</th>
                <th className="py-2">Status</th>
                <th className="py-2">Published</th>
                <th className="py-2">Free</th>
                <th className="py-2">Price</th>
                <th className="py-2">Open</th>
                <th className="py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(c => (
                <tr key={c.id} className="border-t border-[color:var(--border)]">
                  <td className="py-2">{c.title}</td>
                  <td className="py-2">{c.slug}</td>
                  <td className="py-2">{c.status || 'draft'}</td>
                  <td className="py-2">{c.published ? "✅" : "—"}</td>
                  <td className="py-2">{c.isFree ? "✅" : "—"}</td>
                  <td className="py-2">{c.priceCents ? `₹${(c.priceCents/100).toFixed(0)}` : "—"}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <Link className="btn" href={`/admin/courses/${c.slug}`}>Manage</Link>
                      <Link className="btn" href={`/courses/${c.slug}`} target="_blank">View</Link>
                    </div>
                  </td>
                  <td className="py-2">
                    <DeleteCourseButton courseId={c.id} courseTitle={c.title} />
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="py-6 text-center muted" colSpan={8}>No courses</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
