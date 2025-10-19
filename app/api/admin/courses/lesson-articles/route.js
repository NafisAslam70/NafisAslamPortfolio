import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lessonArticles, courseLessons } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

function handleDbError(err) {
  if (process.env.NODE_ENV !== "production") {
    console.error("Lesson articles API error", err);
  }
  return NextResponse.json({ error: "Bad request" }, { status: 400 });
}

export async function POST(req){
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const lessonId = Number(body.lessonId || 0);
    const title = (body.title || "").toString().trim();
    const resourceUrl = (body.resourceUrl || "").toString().trim();
    const description = body.description !== undefined && body.description !== null ? body.description.toString() : null;
    const sortOrder = Number(body.order || 0) || null;
    if (!lessonId || !title || !resourceUrl) {
      return NextResponse.json({ error: "lessonId, title, resourceUrl required" }, { status: 400 });
    }
    const [lesson] = await db.select({ id: courseLessons.id }).from(courseLessons).where(eq(courseLessons.id, lessonId));
    if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    const [row] = await db.insert(lessonArticles).values({ lessonId, title, resourceUrl, description, sortOrder }).returning();
    return NextResponse.json({ success: true, article: row });
  } catch (err) {
    return handleDbError(err);
  }
}

export async function PATCH(req){
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const id = Number(body.id || 0);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const patch = {};
    if (body.title !== undefined) patch.title = body.title.toString();
    if (body.resourceUrl !== undefined) patch.resourceUrl = body.resourceUrl?.toString().trim() || null;
    if (body.description !== undefined) patch.description = body.description !== null ? body.description.toString() : null;
    if (body.order !== undefined) {
      const ord = Number(body.order);
      patch.sortOrder = ord > 0 ? ord : null;
    }
    await db.update(lessonArticles).set(patch).where(eq(lessonArticles.id, id));
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleDbError(err);
  }
}

export async function DELETE(req){
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const id = Number(body.id || 0);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    await db.delete(lessonArticles).where(eq(lessonArticles.id, id));
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleDbError(err);
  }
}

