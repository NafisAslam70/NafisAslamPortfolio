// app/api/auth/logout/route.js
import { NextResponse } from "next/server";

const COOKIE = "nb_session";

export async function POST() {
  const isProd = process.env.NODE_ENV === "production";
  // Expire the cookie
  const expired = `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; ${isProd ? "Secure;" : ""}`;
  const res = NextResponse.json({ success: true }, { status: 200 });
  res.headers.append("Set-Cookie", expired);
  return res;
}

