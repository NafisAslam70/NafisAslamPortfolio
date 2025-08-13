import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const config = { matcher: ["/admin/:path*"] };

async function getSession(req) {
  const token = req.cookies.get("nb_session")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req) {
  const url = new URL(req.url);

  const session = await getSession(req);
  if (session?.role === "admin") return NextResponse.next();

  const user = process.env.ADMIN_EMAIL || process.env.ADMIN_USER || "";
  const pass = process.env.ADMIN_PASSWORD || process.env.ADMIN_PASS || "";

  // If no Basic creds configured, just send unauthenticated users to Login.
  if (!user || !pass) {
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(url.pathname + url.search)}`, req.url));
  }

  // Basic Auth fallback
  const auth = req.headers.get("authorization") || "";
  const [scheme, encoded] = auth.split(" ");
  if (scheme === "Basic" && encoded) {
    const [u, p] = atob(encoded).split(":");
    if (u === user && p === pass) return NextResponse.next();
  }

  return new NextResponse("Auth required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
  });
}
