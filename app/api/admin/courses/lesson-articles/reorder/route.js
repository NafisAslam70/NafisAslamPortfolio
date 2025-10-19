import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lessonArticles } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

export async function POST(req) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const lessonId = Number(body.lessonId || 0);
    const order = Array.isArray(body.order) ? body.order : [];
    if (!lessonId || order.length === 0) {
      return NextResponse.json({ error: "lessonId and order required" }, { status: 400 });
    }
    for (const item of order) {
      const id = Number(item.id || 0);
      const ord = Number(item.order || 0) || null;
      if (!id) continue;
      await db.update(lessonArticles).set({ sortOrder: ord }).where(eq(lessonArticles.id, id));
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Lesson articles reorder failed", err);
    }
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

