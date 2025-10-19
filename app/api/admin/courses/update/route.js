import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { courses } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

export async function POST(req) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const id = Number(body.id);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const patch = {
      title: body.title?.toString(),
      slug: body.slug?.toString(),
      description: body.description?.toString() ?? null,
      coverUrl: body.coverUrl?.toString() ?? null,
      isFree: !!body.isFree,
      published: !!body.published,
      priceCents: Number(body.priceCents || 0),
    };

    await db.update(courses).set(patch).where(eq(courses.id, id));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

