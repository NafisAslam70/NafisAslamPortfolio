"use client";

import Link from "next/link";
import { useState } from "react";

export default function Row({ post, updatePost, deletePost }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const tagsCsv = Array.isArray(post.tags) ? post.tags.join(", ") : "";

  return (
    <>
      <tr className="border-t border-[color:var(--border)]">
        <td className="py-2">{post.title}</td>
        <td className="py-2">{post.slug}</td>
        <td className="py-2">{post.published ? "✅" : "—"}</td>
        <td className="py-2">
          {(Array.isArray(post.tags) ? post.tags : []).map((t, i) => (
            <span key={i} className="mr-1 inline-block rounded bg-[color:var(--card-2)] px-2 py-0.5 text-xs">
              {t}
            </span>
          ))}
        </td>
        <td className="py-2">{post.externalUrl ? "🌐" : "—"}</td>
        <td className="py-2">
          <div className="flex gap-2">
            {post.externalUrl ? (
              <a className="btn" href={post.externalUrl} target="_blank">View</a>
            ) : (
              <Link className="btn" href={`/blog/${post.slug}`} target="_blank">View</Link>
            )}
          </div>
        </td>
        <td className="py-2">
          <button className="btn" onClick={() => setOpen((v) => !v)}>{open ? "Close" : "Edit"}</button>
        </td>
        <td className="py-2">
          <form
            action={async (fd) => {
              setBusy(true);
              try { await deletePost(fd); } finally { setBusy(false); }
            }}
          >
            <input type="hidden" name="id" value={post.id} />
            <button
              className="btn"
              onClick={(e) => { if (!confirm("Delete this post?")) e.preventDefault(); }}
              disabled={busy}
            >
              {busy ? "Deleting…" : "Delete"}
            </button>
          </form>
        </td>
      </tr>

      {open && (
        <tr className="border-t border-[color:var(--border)]">
          <td colSpan={8} className="py-3">
            <form
              action={async (fd) => {
                setBusy(true);
                try { await updatePost(fd); setOpen(false); } finally { setBusy(false); }
              }}
              className="grid gap-3"
            >
              <input type="hidden" name="id" value={post.id} />

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="label">Title</label>
                  <input name="title" defaultValue={post.title || ""} className="input" />
                </div>
                <div>
                  <label className="label">Slug</label>
                  <input name="slug" defaultValue={post.slug || ""} className="input" />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="label">Tags (comma separated)</label>
                  <input name="tags" defaultValue={tagsCsv} className="input" />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input name="published" type="checkbox" defaultChecked={!!post.published} /> Published
                  </label>
                </div>
              </div>

              <div>
                <label className="label">Excerpt</label>
                <textarea name="excerpt" rows={2} defaultValue={post.excerpt || ""} className="input" />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="label">Cover URL</label>
                  <input name="coverUrl" defaultValue={post.coverUrl || ""} className="input" />
                </div>
                <div>
                  <label className="label">External URL (optional)</label>
                  <input name="externalUrl" defaultValue={post.externalUrl || ""} className="input" />
                </div>
              </div>

              <div>
                <label className="label">Content (Markdown)</label>
                <textarea name="contentMd" rows={8} defaultValue={post.contentMd || ""} className="input" />
              </div>

              <div className="flex gap-2">
                <button className="btn btn-primary" disabled={busy}>{busy ? "Saving…" : "Save Changes"}</button>
                <button type="button" className="btn" onClick={() => setOpen(false)}>Cancel</button>
              </div>
            </form>
          </td>
        </tr>
      )}
    </>
  );
}
