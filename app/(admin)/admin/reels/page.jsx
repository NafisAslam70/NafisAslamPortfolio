import Link from "next/link";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { COOKIE, verifyToken } from "@/lib/auth";
import { db } from "@/lib/db";
import { reels } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { cloudinary } from "@/lib/cloudinary";

export const metadata = { title: "Admin • Reels" };

/** server action: create a record (YouTube or Cloudinary publicId) */
async function createReel(formData) {
  "use server";

  const token = cookies().get(COOKIE)?.value || null;
  const session = await verifyToken(token);
  if (!session || session.role !== "admin") throw new Error("Unauthorized");

  const title = (formData.get("title") || "").toString().trim();
  const source = (formData.get("source") || "youtube").toString(); // 'youtube' | 'cloudinary'
  const ytId  = (formData.get("youtubeId") || "").toString().trim();

  if (!title) throw new Error("Title required");

  if (source === "youtube") {
    if (!ytId) throw new Error("YouTube video ID required");
    await db.insert(reels).values({ title, type: "youtube", ref: ytId });
  } else {
    // Cloudinary path: we either receive a file OR a manual publicId
    const publicIdInput = (formData.get("publicId") || "").toString().trim();
    const file = formData.get("file"); // Blob or null

    let publicId = publicIdInput;

    if (!publicId && file && typeof file === "object" && "arrayBuffer" in file) {
      // Upload file to Cloudinary (video)
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const folder = "nafees-brand/reels"; // keep assets organized
      const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || undefined;

      // Cloudinary SDK upload
      const res = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder,
            upload_preset: uploadPreset, // if you set one; otherwise omit
          },
          (err, result) => (err ? reject(err) : resolve(result))
        ).end(buffer);
      });

      publicId = res.public_id; // e.g., 'nafees-brand/reels/xyz123'
    }

    if (!publicId) throw new Error("Public ID or file required");
    await db.insert(reels).values({ title, type: "cloudinary", ref: publicId });
  }

  revalidatePath("/admin/reels");
}

export default async function AdminReelsPage(){
  const items = await db.select().from(reels).orderBy(asc(reels.createdAt));

  return (
    <div className="space-y-6">
      <section className="card flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reels</h1>
          <p className="muted">Post new reels and manage existing ones.</p>
        </div>
        <Link href="/" className="btn">Site</Link>
      </section>

      {/* Create form (one page) */}
      <section className="card-solid">
        <h2 className="text-lg font-semibold mb-3">New Reel</h2>
        <form action={createReel} className="grid gap-4 md:grid-cols-2" encType="multipart/form-data">
          <div className="md:col-span-2">
            <label className="label">Title</label>
            <input name="title" className="input w-full" required />
          </div>

          <div>
            <label className="label">Source</label>
            <select name="source" className="input w-full" defaultValue="youtube">
              <option value="youtube">YouTube (enter Video ID)</option>
              <option value="cloudinary">Cloudinary (upload or publicId)</option>
            </select>
          </div>

          {/* YouTube input */}
          <div>
            <label className="label">YouTube Video ID</label>
            <input name="youtubeId" className="input w-full" placeholder="e.g., dQw4w9WgXcQ" />
          </div>

          {/* Cloudinary inputs (either file OR publicId) */}
          <div>
            <label className="label">Upload Video (Cloudinary)</label>
            <input name="file" type="file" accept="video/*" className="input w-full" />
            <p className="muted text-xs mt-1">Optional — upload a video file</p>
          </div>

          <div>
            <label className="label">Or Cloudinary Public ID</label>
            <input name="publicId" className="input w-full" placeholder="folder/my-reel" />
            <p className="muted text-xs mt-1">If you already uploaded via Cloudinary console</p>
          </div>

          <div className="md:col-span-2">
            <button className="btn btn-primary">Save</button>
          </div>
        </form>
      </section>

      {/* List */}
      <section className="card-solid">
        {items.length === 0 && <div className="muted">No reels yet.</div>}
        <ul className="space-y-3">
          {items.map((r)=>(
            <li key={r.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{r.title}</div>
                <div className="text-xs muted">
                  {r.type} • {r.ref}
                </div>
              </div>
              {/* placeholders for future edit/delete */}
              <div className="flex gap-2">
                <button className="btn btn-ghost" disabled>Edit</button>
                <button className="btn btn-ghost" disabled>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
