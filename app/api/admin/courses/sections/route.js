import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { courseSections } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

export async function POST(req) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const courseId = Number(body.courseId);
    const title = (body.title || "").toString().trim();
    const content = (body.content || "").toString();
    const order = Number(body.order || 0);
    if (!courseId || !title) return NextResponse.json({ error: "courseId and title required" }, { status: 400 });
    const [row] = await db
      .insert(courseSections)
      .values({ courseId, title, content, sortOrder: order || null })
      .returning();
    return NextResponse.json({ success: true, section: row });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export async function PATCH(req) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const id = Number(body.id);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const patch = {};
    if (body.title !== undefined) patch.title = body.title.toString();
    if (body.content !== undefined) patch.content = body.content.toString();
    if (body.order !== undefined) patch.sortOrder = Number(body.order) || null;
    if (body.videoType !== undefined) patch.videoType = body.videoType?.toString() || null;
    if (body.videoRef !== undefined) patch.videoRef = body.videoRef?.toString() || null;
    if (body.freePreview !== undefined) patch.freePreview = !!body.freePreview;
    await db.update(courseSections).set(patch).where(eq(courseSections.id, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export async function DELETE(req) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const id = Number(body.id);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    await db.delete(courseSections).where(eq(courseSections.id, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

