import { db } from "@/lib/db";
import { courseSections } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(req){
  const { courseId, order } = await req.json();
  if(!courseId || !Array.isArray(order)) return new Response(JSON.stringify({ error:"courseId and order[] required" }), { status: 400 });
  for(const row of order){
    if(!row?.id || typeof row.order !== "number") continue;
    await db.update(courseSections).set({ order: row.order }).where(eq(courseSections.id, Number(row.id)));
  }
  return new Response(JSON.stringify({ ok:true }), { status: 200 });
}
