import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { courses } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";

export const metadata = { title: "Courses • Nafees", description: "Practical, bilingual learning." };

export default async function CoursesPage() {
  const rows = await db.select().from(courses).where(eq(courses.published, true)).orderBy(desc(courses.createdAt));

  return (
    <div className="space-y-6">
      <section className="card">
        <h1 className="text-3xl font-bold">Courses</h1>
        <p className="muted">Learn • Build • Uplift</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(c => (
          <Link key={c.id} href={`/courses/${c.slug}`} className="group overflow-hidden rounded-2xl border border-[color:var(--border)]">
            {c.coverUrl ? (
              <Image
                src={c.coverUrl}
                alt={c.title}
                width={600}
                height={320}
                className="h-44 w-full object-cover transition group-hover:scale-105"
                unoptimized
              />
            ) : (
              <div className="h-44 w-full bg-[color:var(--muted-200)]" />
            )}
            <div className="p-3">
              <div className="font-semibold">{c.title}</div>
              <div className="muted text-sm line-clamp-2">{c.description}</div>
              <div className="mt-2 text-sm">
                {c.isFree ? <span className="rounded bg-green-100 px-2 py-0.5 text-green-700">Free</span> : (c.priceCents ? `₹${(c.priceCents/100).toFixed(0)}` : "Paid")}
              </div>
            </div>
          </Link>
        ))}
        {rows.length === 0 && (
          <div className="card-solid">No courses yet.</div>
        )}
      </section>
    </div>
  );
}
