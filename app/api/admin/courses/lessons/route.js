import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { courseLessons, courseSections } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

function handleDbError(err) {
  if (err && err.code === "42P01") {
    return NextResponse.json({
      error: "Course lessons table is missing. Run the latest database migrations to enable lessons.",
    }, { status: 500 });
  }
  if (process.env.NODE_ENV !== "production") {
    console.error("Course lessons API error", err);
  }
  return NextResponse.json({ error: "Bad request" }, { status: 400 });
}

export async function POST(req) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const sectionId = Number(body.sectionId);
    const rawTitle = body.title ?? "";
    const title = rawTitle.toString().trim();
    if (!sectionId || !title) {
      return NextResponse.json({ error: "sectionId and title required" }, { status: 400 });
    }

    const [section] = await db
      .select({ id: courseSections.id })
      .from(courseSections)
      .where(eq(courseSections.id, sectionId));
    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    const descriptionRaw = body.description ?? null;
    const videoProviderRaw = body.videoProvider ?? "youtube";
    const videoRefRaw = body.videoRef ?? null;
    const sourceUrlRaw = body.sourceUrl ?? null;
    const order = Number(body.order || 0);
    const durationSecondsMaybe = Number(body.durationSeconds || 0);

    const values = {
      sectionId,
      title,
      description: descriptionRaw !== null ? descriptionRaw.toString() : null,
      videoProvider: (videoProviderRaw || "youtube").toString(),
      videoRef: videoRefRaw !== null ? videoRefRaw.toString().trim() || null : null,
      sourceUrl: sourceUrlRaw !== null ? sourceUrlRaw.toString().trim() || null : null,
      durationSeconds: durationSecondsMaybe > 0 ? durationSecondsMaybe : null,
      freePreview: !!body.freePreview,
      sortOrder: order > 0 ? order : null,
    };

    const [row] = await db.insert(courseLessons).values(values).returning();
    return NextResponse.json({ success: true, lesson: row });
  } catch (err) {
    return handleDbError(err);
  }
}

export async function PATCH(req) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const id = Number(body.id);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const patch = {};
    if (body.title !== undefined) patch.title = body.title?.toString().trim() || "";
    if (body.description !== undefined) patch.description = body.description !== null ? body.description.toString() : null;
    if (body.videoProvider !== undefined) patch.videoProvider = (body.videoProvider || "youtube").toString();
    if (body.videoRef !== undefined) patch.videoRef = body.videoRef !== null ? body.videoRef.toString().trim() || null : null;
    if (body.sourceUrl !== undefined) patch.sourceUrl = body.sourceUrl !== null ? body.sourceUrl.toString().trim() || null : null;
    if (body.freePreview !== undefined) patch.freePreview = !!body.freePreview;
    if (body.durationSeconds !== undefined) {
      const n = Number(body.durationSeconds || 0);
      patch.durationSeconds = n > 0 ? n : null;
    }
    if (body.order !== undefined) {
      const ord = Number(body.order);
      patch.sortOrder = ord > 0 ? ord : null;
    }

    await db.update(courseLessons).set(patch).where(eq(courseLessons.id, id));
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleDbError(err);
  }
}

export async function DELETE(req) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const id = Number(body.id);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    await db.delete(courseLessons).where(eq(courseLessons.id, id));
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleDbError(err);
  }
}
