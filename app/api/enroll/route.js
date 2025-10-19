import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { enrollments } from "@/lib/schema";
import { cookies } from "next/headers";
import { COOKIE, verifyToken } from "@/lib/auth";

export async function POST(req) {
  const formData = await req.formData();
  const courseId = Number(formData.get("courseId"));
  if (!courseId) return NextResponse.json({ error: "Missing courseId" }, { status: 400 });

  // Get user from session
  const token = cookies().get(COOKIE)?.value || null;
  const session = await verifyToken(token);
  if (!session || !session.id) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  // Check if already enrolled
  const already = await db.select().from(enrollments).where({ userId: session.id, courseId });
  if (already.length) {
    return NextResponse.json({ message: "Already enrolled" });
  }

  // Enroll user
  await db.insert(enrollments).values({ userId: session.id, courseId });
  return NextResponse.json({ message: "Enrolled successfully" });
}
