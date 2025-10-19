import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { courses, courseSections, courseLessons, courseMaterials } from "@/lib/schema";
import { eq, inArray } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(req) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const id = Number(body.id || 0);
    if (!id) {
      return NextResponse.json({ error: "Course id required" }, { status: 400 });
    }

    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const sectionRows = await db
      .select({ id: courseSections.id })
      .from(courseSections)
      .where(eq(courseSections.courseId, id));
    const sectionIds = sectionRows.map((s) => s.id);

    if (sectionIds.length) {
      await db.delete(courseLessons).where(inArray(courseLessons.sectionId, sectionIds));
      await db.delete(courseMaterials).where(inArray(courseMaterials.sectionId, sectionIds));
      await db.delete(courseSections).where(inArray(courseSections.id, sectionIds));
    }

    await db.delete(courses).where(eq(courses.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete course", err);
    const message = err?.message === "Course not found" ? err.message : "Unable to delete course";
    const status = err?.message === "Course not found" ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
