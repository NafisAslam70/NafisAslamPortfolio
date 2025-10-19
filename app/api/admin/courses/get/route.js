// import { db } from "@/lib/db";
// import { courses, courseSections } from "@/lib/schema";
// import { eq, and } from "drizzle-orm";

// export async function GET(req){
//   const { searchParams } = new URL(req.url);
//   const slug = searchParams.get("slug") || "";
//   if(!slug) return new Response(JSON.stringify({ error:"slug required" }), { status: 400 });
//   const [course] = await db.select().from(courses).where(eq(courses.slug, slug));
//   if(!course) return new Response(JSON.stringify({ course:null, sections:[] }), { status: 200 });
//   const sections = await db.select().from(courseSections).where(eq(courseSections.courseId, course.id));
//   return new Response(JSON.stringify({ course, sections }), { status: 200 });
// }


import { db } from "@/lib/db";
import { courses, courseSections, courseLessons, courseMaterials, lessonArticles } from "@/lib/schema";
import { asc, eq, inArray, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req){
  const { searchParams } = new URL(req.url);
  const idParam = Number(searchParams.get("id") || 0);
  const slugParam = searchParams.get("slug") || "";
  if (!idParam && !slugParam) return new Response(JSON.stringify({ error:"id or slug required" }), { status: 400 });

  let course;
  if (idParam) {
    [course] = await db.select().from(courses).where(eq(courses.id, idParam));
  } else {
    [course] = await db.select().from(courses).where(eq(courses.slug, slugParam));
  }
  if (!course) return new Response(JSON.stringify({ course:null, sections:[] }), { status: 200 });

  let sectionsRaw;
  let sectionIds = [];
  try {
    sectionsRaw = await db
      .select()
      .from(courseSections)
      .where(eq(courseSections.courseId, course.id))
      .orderBy(asc(courseSections.sortOrder), asc(courseSections.createdAt));
    sectionIds = sectionsRaw.map(s => s.id);
  } catch (err) {
    if (err?.code === "42703") {
      // Database schema is missing newer columns; fall back to a minimal select so UI still works.
      if (process.env.NODE_ENV !== "production") {
        console.warn("Course sections lookup falling back to legacy columns", err?.message);
      }
      const result = await db.execute(sql`
        SELECT
          id,
          course_id AS "courseId",
          title,
          content,
          created_at AS "createdAt"
        FROM course_sections
        WHERE course_id = ${course.id}
        ORDER BY created_at ASC
      `);
      sectionsRaw = (result.rows || []).map((row, idx) => ({
        ...row,
        sortOrder: idx + 1,
        videoType: null,
        videoRef: null,
        freePreview: false,
      }));
      sectionIds = sectionsRaw.map(s => s.id);
    } else {
      throw err;
    }
  }
  let lessonsBySection = {};
  let articlesByLesson = {};
  let materialsBySection = {};

  if (sectionIds.length) {
    try {
      const lessonsRaw = await db
        .select()
        .from(courseLessons)
        .where(inArray(courseLessons.sectionId, sectionIds))
        .orderBy(asc(courseLessons.sortOrder), asc(courseLessons.createdAt));

      const lessonIds = lessonsRaw.map(l => l.id);
      if (lessonIds.length) {
        try {
          const arts = await db
            .select()
            .from(lessonArticles)
            .where(inArray(lessonArticles.lessonId, lessonIds))
            .orderBy(asc(lessonArticles.sortOrder), asc(lessonArticles.createdAt));
          for (const art of arts) {
            const k = art.lessonId;
            if (!articlesByLesson[k]) articlesByLesson[k] = [];
            articlesByLesson[k].push({ ...art, order: art.sortOrder });
          }
        } catch (e) {
          if (process.env.NODE_ENV !== "production") {
            console.error("Lesson articles lookup failed", e);
          }
        }
      }

      for (const lesson of lessonsRaw) {
        const key = lesson.sectionId;
        if (!lessonsBySection[key]) lessonsBySection[key] = [];
        lessonsBySection[key].push({ ...lesson, order: lesson.sortOrder, articles: articlesByLesson[lesson.id] || [] });
      }
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Course lessons lookup failed", err);
      }
    }

    try {
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
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Course materials lookup failed", err);
      }
    }
  }

  // Map DB shape to UI shape: sortOrder -> order and attach nested resources
  const sections = sectionsRaw.map(s => ({
    ...s,
    order: s.sortOrder,
    lessons: lessonsBySection[s.id] || [],
    materials: materialsBySection[s.id] || [],
  }));
  return new Response(JSON.stringify({ course, sections }), {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
