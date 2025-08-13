// import { db } from "@/lib/db";
// import { courses, courseSections } from "@/lib/schema";
// import { eq, and } from "drizzle-orm";

// export async function GET(req){
//   const { searchParams } = new URL(req.url);
//   const slug = searchParams.get("slug") || "";
//   if(!slug) return new Response(JSON.stringify({ error:"slug required" }), { status: 400 });
//   const [course] = await db.select().from(courses).where(eq(courses.slug, slug));
//   if(!course) return new Response(JSON.stringify({ course:null, sections:[] }), { status: 200 });
//   const sections = await db.select().from(courseSections).where(eq(courseSections.courseId, course.id));
//   return new Response(JSON.stringify({ course, sections }), { status: 200 });
// }


import { db } from "@/lib/db";
import { courses, courseSections } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(req){
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") || "";
  if (!slug) return new Response(JSON.stringify({ error:"slug required" }), { status: 400 });

  const [course] = await db.select().from(courses).where(eq(courses.slug, slug));
  if (!course) return new Response(JSON.stringify({ course:null, sections:[] }), { status: 200 });

  const sections = await db.select().from(courseSections).where(eq(courseSections.courseId, course.id));
  return new Response(JSON.stringify({ course, sections }), { status: 200 });
}
