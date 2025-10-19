import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { createSessionCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const formData = await req.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Check if user exists
  const existing = await db.select().from(users).where({ email });
  if (existing.length) {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 });
  }

  // Hash password
  const hash = await bcrypt.hash(password, 10);
  const [user] = await db.insert(users).values({ name, email, password: hash }).returning();

  // Set session cookie
  const cookie = await createSessionCookie(user);
  return NextResponse.redirect("/login", {
    headers: { "Set-Cookie": cookie },
  });
}
