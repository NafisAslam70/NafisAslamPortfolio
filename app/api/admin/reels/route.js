import { db } from "@/lib/db";
import { reels } from "@/lib/schema";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { asc } from "drizzle-orm";

export async function GET(req) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rows = await db.select().from(reels).orderBy(asc(reels.createdAt));
  return NextResponse.json({ items: rows }, { status: 200 });
}

export async function POST(req) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { title, type, ref } = await req.json();
    if (!title || !type || !ref) {
      return NextResponse.json({ error: "title, type, ref required" }, { status: 400 });
    }
    if (!["youtube", "cloudinary"].includes(type)) {
      return NextResponse.json({ error: "type must be youtube|cloudinary" }, { status: 400 });
    }
    const [row] = await db.insert(reels).values({ title, type, ref }).returning();
    return NextResponse.json({ success: true, reel: row }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
