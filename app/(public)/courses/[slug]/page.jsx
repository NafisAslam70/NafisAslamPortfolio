import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { courses, courseSections, courseLessons, courseMaterials, enrollments } from "@/lib/schema";
import { asc, eq, inArray } from "drizzle-orm";
import CourseViewer from "@/components/CourseViewer";

export async function generateMetadata({ params }){
  const slug = params.slug;
  const [course] = await db.select().from(courses).where(eq(courses.slug, slug));
  return {
    title: course ? `${course.title} • Course` : "Course",
    description: course?.description || "Course",
  };
}

import { cookies } from "next/headers";
import { COOKIE, verifyToken } from "@/lib/auth";


export default async function CoursePage({ params, searchParams }){
  const slug = params.slug;
  const [course] = await db.select().from(courses).where(eq(courses.slug, slug));
  // Get user session
  const token = cookies().get(COOKIE)?.value || null;
  const session = await verifyToken(token);
  let isEnrolled = false;
  if (session && session.id && course) {
    const enrolled = await db.select().from(enrollments).where({ userId: session.id, courseId: course.id });
    isEnrolled = enrolled.length > 0;
  }
  const preview = searchParams?.preview === '1';

  // allow preview for admins even if not published
  let canPreview = false;
  if (preview) {
    canPreview = !!(session && session.role === 'admin');
  }

  if (!course || (!course.published && !canPreview)) {
    return (
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Course</h1>
            <p className="muted">Not found or not published</p>
          </div>
          <Link href="/courses" className="btn">← Courses</Link>
        </div>
      </div>
    );
  }

  const sectionsRaw = await db
    .select()
    .from(courseSections)
    .where(eq(courseSections.courseId, course.id))
    .orderBy(asc(courseSections.sortOrder), asc(courseSections.createdAt));

  const sectionIds = sectionsRaw.map(s => s.id);
  let lessonsBySection = {};
  let materialsBySection = {};

  if (sectionIds.length) {
    const lessonsRaw = await db
      .select()
      .from(courseLessons)
      .where(inArray(courseLessons.sectionId, sectionIds))
      .orderBy(asc(courseLessons.sortOrder), asc(courseLessons.createdAt));
    for (const lesson of lessonsRaw) {
      const key = lesson.sectionId;
      if (!lessonsBySection[key]) lessonsBySection[key] = [];
      lessonsBySection[key].push({ ...lesson, order: lesson.sortOrder });
    }

    const materialsRaw = await db
      .select()
      .from(courseMaterials)
      .where(inArray(courseMaterials.sectionId, sectionIds))
      .orderBy(asc(courseMaterials.sortOrder), asc(courseMaterials.createdAt));
    for (const material of materialsRaw) {
      const key = material.sectionId;
      if (!materialsBySection[key]) materialsBySection[key] = [];
      materialsBySection[key].push({ ...material, order: material.sortOrder });
    }
  }

  const sections = sectionsRaw.map(s => ({
    ...s,
    order: s.sortOrder,
    lessons: lessonsBySection[s.id] || [],
    materials: materialsBySection[s.id] || [],
  }));

  const courseForClient = {
    ...course,
    createdAt: course.createdAt?.toISOString?.() || course.createdAt,
  };

  const sectionsForClient = sections.map((section, idx) => ({
    ...section,
    order: section.order ?? section.sortOrder ?? idx + 1,
    createdAt: section.createdAt?.toISOString?.() || section.createdAt,
    lessons: (section.lessons || []).map(lesson => ({
      ...lesson,
      createdAt: lesson.createdAt?.toISOString?.() || lesson.createdAt,
    })),
    materials: (section.materials || []).map(material => ({
      ...material,
      createdAt: material.createdAt?.toISOString?.() || material.createdAt,
    })),
  }));

  // Only show course content if signed in and enrolled
  if (!session || !session.id) {
    return (
      <div className="card">
        <h1 className="text-2xl font-bold">Sign in required</h1>
        <p className="muted">You must sign in to view and enroll in this course.</p>
        <Link href="/login" className="btn-primary mt-4">Sign in</Link>
      </div>
    );
  }
  if (!isEnrolled) {
    return (
      <div className="card">
        <h1 className="text-2xl font-bold">Enroll to access</h1>
        <p className="muted">You must enroll in this course to view its content.</p>
        <form action="/api/enroll" method="POST" className="mt-4">
          <input type="hidden" name="courseId" value={course.id} />
          <button type="submit" className="btn-primary">{course.isFree ? "Enroll for Free" : "Enroll & Pay"}</button>
        </form>
      </div>
    );
  }
  // Show course content if enrolled
  return (
    <div className="space-y-6">
      <section className="card">
        <div className="flex gap-4">
          {course.coverUrl && (
            <Image
              src={course.coverUrl}
              alt={course.title}
              width={240}
              height={240}
              className="h-24 w-24 rounded-xl object-cover"
              unoptimized
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <p className="muted">{course.description}</p>
            <div className="mt-2 text-sm">
              {course.isFree ? <span className="rounded bg-green-100 px-2 py-0.5 text-green-700">Free</span> : (course.priceCents ? `Price: ₹${(course.priceCents/100).toFixed(0)}` : "Paid")}
            </div>
            {!course.published && canPreview && (
              <div className="mt-2 text-xs rounded bg-amber-100 px-2 py-0.5 text-amber-700">Preview mode</div>
            )}
          </div>
        </div>
      </section>

      <CourseViewer course={courseForClient} sections={sectionsForClient} />
    </div>
  );
}
