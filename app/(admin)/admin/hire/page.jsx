import { db } from "@/lib/db";
import { hireRequests } from "@/lib/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";

export default async function AdminHirePage() {
  const rows = await db
    .select()
    .from(hireRequests)
    .orderBy(desc(hireRequests.createdAt));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Hire Requests</h1>

      <div className="flex items-center gap-3">
        <Link href="/api/hire/export" className="px-3 py-2 rounded bg-black text-white">
          Download CSV
        </Link>
        <span className="text-sm text-gray-600">{rows.length} total</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Message</th>
              <th className="p-2 border">Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="align-top">
                <td className="p-2 border">{r.id}</td>
                <td className="p-2 border">{r.name}</td>
                <td className="p-2 border">
                  <a className="text-blue-600 underline" href={`mailto:${r.email}`}>{r.email}</a>
                </td>
                <td className="p-2 border">{r.role || "-"}</td>
                <td className="p-2 border whitespace-pre-wrap">{r.message}</td>
                <td className="p-2 border">{r.createdAt?.toISOString?.() ?? String(r.createdAt)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td className="p-3 text-center text-gray-500" colSpan={6}>No submissions yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
