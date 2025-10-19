import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { courseMaterials, courseSections } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

function handleDbError(err) {
  if (err && err.code === "42P01") {
    return NextResponse.json({
      error: "Course materials table is missing. Run the latest database migrations to enable materials.",
    }, { status: 500 });
  }
  if (process.env.NODE_ENV !== "production") {
    console.error("Course materials API error", err);
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
    const rawUrl = body.resourceUrl ?? "";
    const resourceUrl = rawUrl.toString().trim();
    const resourceTypeRaw = body.resourceType ?? "link";
    const resourceType = (resourceTypeRaw || "link").toString();
    const descriptionRaw = body.description ?? null;
    const description = descriptionRaw !== null ? descriptionRaw.toString() : null;
    if (!sectionId || !title) {
      return NextResponse.json({ error: "sectionId and title required" }, { status: 400 });
    }
    // For non-article types, a URL is required. For articles, allow inline text only.
    if (resourceType !== 'article' && !resourceUrl) {
      return NextResponse.json({ error: "resourceUrl required for non-article resources" }, { status: 400 });
    }
    if (resourceType === 'article' && (!description || !description.trim())) {
      return NextResponse.json({ error: "Article content is required" }, { status: 400 });
    }

    const [section] = await db
      .select({ id: courseSections.id })
      .from(courseSections)
      .where(eq(courseSections.id, sectionId));
    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    const order = Number(body.order || 0);

    const values = {
      sectionId,
      title,
      resourceUrl: resourceUrl || null,
      resourceType,
      description,
      sortOrder: order > 0 ? order : null,
    };

    const [row] = await db.insert(courseMaterials).values(values).returning();
    return NextResponse.json({ success: true, material: row });
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
    if (body.resourceType !== undefined) patch.resourceType = (body.resourceType || "link").toString();
    if (body.resourceUrl !== undefined) patch.resourceUrl = body.resourceUrl !== null ? body.resourceUrl.toString().trim() || null : null;
    if (body.order !== undefined) {
      const ord = Number(body.order);
      patch.sortOrder = ord > 0 ? ord : null;
    }

    await db.update(courseMaterials).set(patch).where(eq(courseMaterials.id, id));
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
    await db.delete(courseMaterials).where(eq(courseMaterials.id, id));
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleDbError(err);
  }
}
