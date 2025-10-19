import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { courseLessons } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

function handleDbError(err) {
  if (err && err.code === "42P01") {
    return NextResponse.json({ error: "Course lessons table is missing. Run database migrations before reordering." }, { status: 500 });
  }
  if (process.env.NODE_ENV !== "production") {
    console.error("Course lesson reorder error", err);
  }
  return NextResponse.json({ error: "Bad request" }, { status: 400 });
}

export async function POST(req) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const sectionId = Number(body.sectionId);
    const order = Array.isArray(body.order) ? body.order : [];
    if (!sectionId || !order.length) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    for (const item of order) {
      const id = Number(item.id);
      if (!id) continue;
      const ord = Number(item.order) || null;
      await db
        .update(courseLessons)
        .set({ sortOrder: ord })
        .where(and(eq(courseLessons.id, id), eq(courseLessons.sectionId, sectionId)));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return handleDbError(err);
  }
}
