import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { courses, courseSections, courseLessons, courseMaterials } from "@/lib/schema";
import { eq, inArray, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

const ALLOWED = ["draft", "design", "preview", "published"];

export async function POST(req) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const id = Number(body.id);
    const status = (body.status || "").toString();
    if (!id || !ALLOWED.includes(status)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Load course to validate transitions based on content readiness
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    // Check readiness
    let sections;
    try {
      sections = await db.select().from(courseSections).where(eq(courseSections.courseId, id));
    } catch (err) {
      if (err?.code === "42703") {
        if (process.env.NODE_ENV !== "production") {
          console.warn("Course sections readiness check falling back to legacy columns", err?.message);
        }
        const result = await db.execute(sql`
          SELECT
            id,
            course_id AS "courseId",
            title,
            content,
            created_at AS "createdAt"
          FROM course_sections
          WHERE course_id = ${id}
        `);
        sections = (result.rows || []).map(row => ({
          ...row,
          sortOrder: null,
          videoType: null,
          videoRef: null,
          freePreview: false,
        }));
      } else {
        throw err;
      }
    }
    const sectionIds = sections.map(s => s.id);
    const hasSections = sections.length > 0;

    let hasLessonMedia = false;
    let hasMaterials = false;
    if (sectionIds.length) {
      try {
        const lessons = await db
          .select({ videoRef: courseLessons.videoRef, sectionId: courseLessons.sectionId })
          .from(courseLessons)
          .where(inArray(courseLessons.sectionId, sectionIds));
        hasLessonMedia = lessons.some(l => l.videoRef && l.videoRef.trim());
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Course lesson readiness check failed", err);
        }
      }

      try {
        const materials = await db
          .select({ id: courseMaterials.id })
          .from(courseMaterials)
          .where(inArray(courseMaterials.sectionId, sectionIds));
        hasMaterials = materials.length > 0;
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Course material readiness check failed", err);
        }
      }
    }

    const hasDesigned = sections.some(s => (s.content && s.content.trim()) || (s.videoRef && s.videoRef.trim()))
      || hasLessonMedia
      || hasMaterials;

    // Enforce gating
    if (status === 'design' && !hasSections) {
      return NextResponse.json({ error: "Add at least one section before moving to Design" }, { status: 400 });
    }
    if ((status === 'preview' || status === 'published') && !hasDesigned) {
      return NextResponse.json({ error: "Add content, a lesson video, or material to at least one section before Preview/Publish" }, { status: 400 });
    }

    const patch = { status, published: status === "published" };
    await db.update(courses).set(patch).where(eq(courses.id, id));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
