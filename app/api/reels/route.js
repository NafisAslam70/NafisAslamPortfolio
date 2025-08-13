import { db } from "@/lib/db";
import { reels } from "@/lib/schema";

export async function GET() {
  const rows = await db.select().from(reels).orderBy(reels.createdAt);
  const items = rows.map(r => ({
    title: r.title,
    type: r.type,                 // "youtube" | "cloudinary"
    id: r.type === "youtube" ? r.ref : undefined,
    publicId: r.type === "cloudinary" ? r.ref : undefined,
  }));
  return new Response(JSON.stringify({ items }), { status: 200 });
}
