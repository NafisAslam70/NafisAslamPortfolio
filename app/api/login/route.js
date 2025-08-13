import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const COOKIE = "nb_session";

async function createSessionCookie(user) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");
  const token = await new SignJWT({
    id: user.id || "1",
    email: user.email || "",
    role: user.role || "member",
    name: user.name || "",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);

  const isProd = process.env.NODE_ENV === "production";
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000; ${
    isProd ? "Secure;" : ""
  }`;
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPass) {
      return NextResponse.json(
        { error: "Server auth not configured" },
        { status: 500 }
      );
    }

    const isAdmin = email === adminEmail && password === adminPass;
    if (!isAdmin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const cookie = await createSessionCookie({
      id: "1",
      email: adminEmail,
      role: "admin",
      name: "Admin",
    });

    const res = NextResponse.json({ success: true, role: "admin" }, { status: 200 });
    res.headers.append("Set-Cookie", cookie);
    return res;
  } catch (e) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
