import { db } from "@/lib/db";
import { courses } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(req){
  const body = await req.json();
  const { id, title, slug, description, coverUrl, isFree, priceCents, published } = body || {};
  if(!id || !title || !slug) return new Response(JSON.stringify({ error:"id, title, slug required" }), { status: 400 });
  await db.update(courses).set({
    title,
    slug,
    description: description || "",
    coverUrl: coverUrl || "",
    isFree: !!isFree,
    priceCents: Number(priceCents || 0),
    published: !!published
  }).where(eq(courses.id, Number(id)));
  return new Response(JSON.stringify({ ok:true }), { status: 200 });
}
