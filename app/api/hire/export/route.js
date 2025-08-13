import { db } from "@/lib/db";
import { hireRequests } from "@/lib/schema";
import { desc } from "drizzle-orm";

function csvEscape(v) {
  if (v == null) return "";
  const s = String(v).replaceAll('"', '""');
  return /[",\n]/.test(s) ? `"${s}"` : s;
}

export async function GET() {
  const rows = await db.select().from(hireRequests).orderBy(desc(hireRequests.createdAt));
  const headers = ["id","name","email","role","message","created_at"];
  const lines = [
    headers.join(","),
    ...rows.map(r =>
      [r.id, r.name, r.email, r.role ?? "", r.message ?? "", r.createdAt ?? ""]
        .map(csvEscape).join(","))
  ];
  const body = lines.join("\n");

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="hire_requests.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
