"use client";

import { useState, useTransition } from "react";

export default function CourseCreatePanel({ action }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData) => {
    startTransition(async () => {
      setStatus("Creating course…");
      try {
        await action(formData);
        setStatus("Course created.");
        setOpen(false);
      } catch (err) {
        console.error("Create course failed", err);
        setStatus("Unable to create course. Try again.");
      }
    });
  };

  return (
    <section className="card-solid space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">New Course</h3>
        <button type="button" className="btn" onClick={() => { setOpen(o => !o); setStatus(""); }}>
          {open ? "Hide" : "Add course"}
        </button>
      </div>
      {status && <div className="text-sm text-[rgb(var(--muted))]">{status}</div>}
      {open && (
        <form action={handleSubmit} className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm muted">Title</label>
            <input name="title" className="input w-full" required disabled={isPending} />
          </div>
          <div>
            <label className="text-sm muted">Slug</label>
            <input name="slug" className="input w-full" required disabled={isPending} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm muted">Description</label>
            <textarea name="description" rows={3} className="input w-full" disabled={isPending} />
          </div>
          <div>
            <label className="text-sm muted">Cover URL</label>
            <input name="coverUrl" className="input w-full" disabled={isPending} />
          </div>
          <div>
            <label className="text-sm muted">Price (cents)</label>
            <input name="priceCents" type="number" defaultValue={0} className="input w-full" disabled={isPending} />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input name="isFree" type="checkbox" disabled={isPending} /> Free
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input name="published" type="checkbox" disabled={isPending} /> Published
            </label>
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="btn btn-primary" disabled={isPending}>
              {isPending ? "Creating…" : "Create Course"}
            </button>
            <button type="button" className="btn" onClick={() => { setOpen(false); setStatus(""); }} disabled={isPending}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
