import { db } from "@/lib/db";
import { reels } from "@/lib/schema";
import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";

// Ensure this endpoint never gets statically cached
export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select().from(reels).orderBy(asc(reels.createdAt));

  // Normalize to the shape the frontend expects
  const items = rows.map(r => ({
    title: r.title,
    type: r.type,                             // "youtube" | "cloudinary"
    id: r.type === "youtube" ? r.ref : undefined,         // YouTube video id (NOT DB id)
    publicId: r.type === "cloudinary" ? r.ref : undefined // Cloudinary public_id
  }));

  return NextResponse.json({ items }, { status: 200 });
}
