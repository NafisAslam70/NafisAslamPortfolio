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
    const order = Array.isArray(body.order) ? body.order : [];
    if (!courseId || !order.length) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

    // Update each section's sortOrder; small N so sequential is fine
    for (const item of order) {
      const id = Number(item.id);
      const ord = Number(item.order) || null;
      if (!id) continue;
      await db.update(courseSections).set({ sortOrder: ord }).where(eq(courseSections.id, id));
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

