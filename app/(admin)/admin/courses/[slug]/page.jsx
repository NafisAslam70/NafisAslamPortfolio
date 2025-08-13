"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

export default function AdminCourseManage({ params }){
  const slug = params.slug;
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);

  async function load(){
    const r = await fetch(`/api/admin/courses/get?slug=${encodeURIComponent(slug)}`, { cache: "no-store" });
    const j = await r.json();
    setData(j);
  }
  useEffect(() => { load(); }, [slug]);

  const course = data?.course;
  const sections = useMemo(() => (data?.sections || []).sort((a,b)=>a.order-b.order), [data]);

  async function saveMeta(e){
    e.preventDefault();
    setSaving(true);
    const form = Object.fromEntries(new FormData(e.currentTarget));
    form.priceCents = Number(form.priceCents || 0);
    form.isFree = !!form.isFree;
    form.published = !!form.published;
    const r = await fetch("/api/admin/courses/update", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ id: course.id, ...form })
    });
    setSaving(false);
    if(r.ok) load();
  }

  async function createSection(e){
    e.preventDefault();
    setCreating(true);
    const form = Object.fromEntries(new FormData(e.currentTarget));
    const r = await fetch("/api/admin/courses/sections", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ courseId: course.id, title: form.title, content: form.content })
    });
    setCreating(false);
    if(r.ok){ e.currentTarget.reset(); load(); }
  }

  async function updateSection(s, patch){
    const r = await fetch("/api/admin/courses/sections", {
      method: "PATCH",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ id: s.id, ...patch })
    });
    if(r.ok) load();
  }

  async function deleteSection(id){
    if(!confirm("Delete section?")) return;
    const r = await fetch("/api/admin/courses/sections", {
      method: "DELETE",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ id })
    });
    if(r.ok) load();
  }

  async function move(id, dir){
    const idx = sections.findIndex(s=>s.id===id);
    if(idx<0) return;
    const targetIdx = dir==="up" ? idx-1 : idx+1;
    if(targetIdx<0 || targetIdx>=sections.length) return;
    const reordered = sections.map((s,i)=>({ id: s.id, order: i+1 }));
    const a = reordered[idx].order;
    reordered[idx].order = reordered[targetIdx].order;
    reordered[targetIdx].order = a;
    const r = await fetch("/api/admin/courses/sections/reorder", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ courseId: course.id, order: reordered })
    });
    if(r.ok) load();
  }

  if(!data) return <div className="card">Loading…</div>;
  if(!course) return <div className="card">Course not found</div>;

  return (
    <div className="space-y-6">
      <section className="card">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold">Manage: {course.title}</h1>
            <p className="muted">Edit course details and curriculum</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/courses" className="btn">← Courses</Link>
            <Link href={`/courses/${course.slug}`} className="btn" target="_blank">View</Link>
          </div>
        </div>
      </section>

      <form onSubmit={saveMeta} className="card-solid space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm muted">Title</label>
            <input name="title" defaultValue={course.title} className="btn w-full" required />
          </div>
          <div>
            <label className="text-sm muted">Slug</label>
            <input name="slug" defaultValue={course.slug} className="btn w-full" required />
          </div>
        </div>
        <div>
          <label className="text-sm muted">Description</label>
          <textarea name="description" defaultValue={course.description} rows={4} className="btn w-full" />
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm muted">Cover URL</label>
            <input name="coverUrl" defaultValue={course.coverUrl || ""} className="btn w-full" />
          </div>
          <div>
            <label className="text-sm muted">Price (cents)</label>
            <input name="priceCents" type="number" defaultValue={course.priceCents||0} className="btn w-full" />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm"><input name="isFree" type="checkbox" defaultChecked={course.isFree} />Free</label>
            <label className="flex items-center gap-2 text-sm"><input name="published" type="checkbox" defaultChecked={course.published} />Published</label>
          </div>
        </div>
        <button className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Save Details"}</button>
      </form>

      <section className="card">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Sections</h2>
          <span className="muted text-sm">{sections.length} total</span>
        </div>
        <div className="mt-3 space-y-2">
          {sections.map((s, i) => (
            <div key={s.id} className="border rounded-xl p-3 border-[color:var(--border)]">
              <div className="flex items-center justify-between gap-2">
                <input
                  defaultValue={s.title}
                  onBlur={(e)=>updateSection(s,{ title: e.target.value })}
                  className="btn w-full"
                />
                <div className="flex items-center gap-2">
                  <button className="btn" onClick={()=>move(s.id,"up")} disabled={i===0}>↑</button>
                  <button className="btn" onClick={()=>move(s.id,"down")} disabled={i===sections.length-1}>↓</button>
                  <button className="btn" onClick={()=>deleteSection(s.id)}>Delete</button>
                </div>
              </div>
              <textarea
                defaultValue={s.content || ""}
                onBlur={(e)=>updateSection(s,{ content: e.target.value })}
                rows={6}
                className="btn w-full mt-2"
                placeholder="Section content"
              />
            </div>
          ))}
          {sections.length===0 && <div className="muted">No sections yet</div>}
        </div>
        <form onSubmit={createSection} className="mt-4 grid gap-2">
          <input name="title" placeholder="New section title" className="btn" required />
          <textarea name="content" rows="4" placeholder="Content (supports plain text for now)" className="btn" />
          <button className="btn btn-primary" disabled={creating}>{creating ? "Creating…" : "Add Section"}</button>
        </form>
      </section>
    </div>
  );
}
