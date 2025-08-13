import { db } from "@/lib/db";
import { courseSections } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req){
  const { courseId, title, content } = await req.json();
  if(!courseId || !title) return new Response(JSON.stringify({ error:"courseId and title required" }), { status: 400 });
  const [{ max }] = await db.execute(sql`select coalesce(max("order"),0) as max from ${courseSections} where ${courseSections.courseId} = ${courseId}`);
  const nextOrder = Number(max) + 1;
  await db.insert(courseSections).values({ courseId, title, content: content || "", order: nextOrder, published: true });
  return new Response(JSON.stringify({ ok:true }), { status: 200 });
}

export async function PATCH(req){
  const { id, title, content } = await req.json();
  if(!id) return new Response(JSON.stringify({ error:"id required" }), { status: 400 });
  const patch = {};
  if(typeof title === "string") patch.title = title;
  if(typeof content === "string") patch.content = content;
  if(!Object.keys(patch).length) return new Response(JSON.stringify({ error:"nothing to update" }), { status: 400 });
  await db.update(courseSections).set(patch).where(eq(courseSections.id, Number(id)));
  return new Response(JSON.stringify({ ok:true }), { status: 200 });
}

export async function DELETE(req){
  const { id } = await req.json();
  if(!id) return new Response(JSON.stringify({ error:"id required" }), { status: 400 });
  await db.delete(courseSections).where(eq(courseSections.id, Number(id)));
  return new Response(JSON.stringify({ ok:true }), { status: 200 });
}
