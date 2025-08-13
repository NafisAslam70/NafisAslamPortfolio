// lib/auth.js
import { SignJWT, jwtVerify } from "jose";

export const COOKIE = "nb_session";

/** Create a signed session cookie (HS256) */
export async function createSessionCookie(user) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");
  const token = await new SignJWT({
    id: user.id ?? "0",
    email: user.email ?? "",
    role: user.role ?? "member",
    name: user.name ?? "",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);

  const isProd = process.env.NODE_ENV === "production";
  // HttpOnly + SameSite=Lax, add Secure in prod
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000;${isProd ? " Secure;" : ""}`;
}

/** Expire the session cookie */
export function clearSessionCookie() {
  const isProd = process.env.NODE_ENV === "production";
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0;${isProd ? " Secure;" : ""}`;
}

/** Low-level: verify a JWT string and return payload or null */
export async function verifyToken(token) {
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");
    const { payload } = await jwtVerify(token, secret);
    return payload; // { id, email, role, name, iat, exp }
  } catch {
    return null;
  }
}

/** Extract cookie from a Request (route handlers) and verify */
export async function getSessionFromRequest(req) {
  const cookieHeader = req.headers?.get?.("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${COOKIE}=([^;]+)`));
  return verifyToken(match?.[1]);
}

/** Convenience guard for admin-only APIs (route handlers) */
export async function requireAdmin(req) {
  const session = await getSessionFromRequest(req);
  return session && session.role === "admin";
}

/** For Next.js middleware (NextRequest) – use its cookie API */
export async function getSessionFromNextRequest(nextReq) {
  const token = nextReq.cookies?.get?.(COOKIE)?.value;
  return verifyToken(token);
}
