// app/api/hire/route.js
import { db } from "@/lib/db";
import { hireRequests } from "@/lib/schema";
import { Resend } from "resend";

const resendKey  = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM || "onboarding@resend.dev";
const adminTo    = process.env.RESEND_TO || "nafisaslam70@gmail.com";
const inDev      = process.env.NODE_ENV !== "production";

// tiny HTML escaper for safe email <pre> block
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;");
}

export async function POST(req) {
  const started = Date.now();

  try {
    const body = await req.json().catch(() => null);
    if (!body) return Response.json({ error: "Invalid JSON" }, { status: 400 });

    const { name, email, role, message, website } = body;

    // Honeypot: if filled, silently succeed
    if (website) return Response.json({ ok: true });

    if (!name || !email || !message) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    /* 1) Store in DB (non-fatal if it fails) */
    let dbOk = false, dbError = null;
    try {
      await db.insert(hireRequests).values({ name, email, role, message });
      dbOk = true;
    } catch (e) {
      dbError = e?.message || String(e);
      console.error("Hire API DB error:", e);
    }

    /* 2) Send email via Resend (non-fatal if it fails) */
    let emailOk = false, emailError = null, emailId = null;
    try {
      if (!resendKey) throw new Error("RESEND_API_KEY not set");

      const resend = new Resend(resendKey);
      const { data, error } = await resend.emails.send({
        from: `Nafees Brand <${resendFrom}>`,
        to: [adminTo],
        subject: `New “Hire Me” from ${name}${role ? ` (${role})` : ""}`,
        html: `
          <div style="font-family:system-ui,Arial,sans-serif;font-size:14px;line-height:1.6">
            <h2>New “Hire Me” Submission</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            ${role ? `<p><strong>Role:</strong> ${escapeHtml(role)}</p>` : ""}
            <p><strong>Message:</strong></p>
            <pre style="white-space:pre-wrap;background:#f8f8f8;padding:12px;border-radius:8px">${escapeHtml(message)}</pre>
          </div>
        `,
        reply_to: email,
      });

      if (error) {
        emailError = typeof error === "string" ? error : JSON.stringify(error);
      } else {
        emailOk = true;
        emailId = data?.id || null;
      }
    } catch (e) {
      emailError = e?.message || String(e);
      console.error("Hire API Email error:", e);
    }

    return Response.json(
      {
        ok: true,
        dbOk,
        emailOk,
        emailId,
        ...(inDev && { dbError, emailError, took: Date.now() - started }),
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Hire API fatal error:", e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
