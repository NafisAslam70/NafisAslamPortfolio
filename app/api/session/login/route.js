import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createSessionCookie } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    let authed = null;

    try {
      const [u] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
      if (u) {
        const ok = await bcrypt.compare(password, u.passwordHash);
        if (ok) authed = u;
      }
    } catch {}

    if (!authed) {
      const envEmail = process.env.ADMIN_EMAIL || process.env.ADMIN_USER || "";
      const envPass  = process.env.ADMIN_PASSWORD || process.env.ADMIN_PASS || "";
      if (envEmail && envPass && email.toLowerCase() === envEmail.toLowerCase() && password === envPass) {
        authed = { id: "env-admin", email: envEmail, role: "admin", name: "Admin" };
      }
    }

    if (!authed) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
    }

    const cookie = await createSessionCookie(authed);
    return new Response(JSON.stringify({ ok: true, role: authed.role }), {
      status: 200,
      headers: { "Set-Cookie": cookie },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "Server error" }), { status: 500 });
  }
}
