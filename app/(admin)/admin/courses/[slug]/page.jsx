"use client";
import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import CourseViewer from "@/components/CourseViewer";

export default function AdminCourseManage({ params }){
  const slug = params.slug;
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [addedNotice, setAddedNotice] = useState("");
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [creatingLessonFor, setCreatingLessonFor] = useState(null);
  const [creatingMaterialFor, setCreatingMaterialFor] = useState(null);
  const [activeStage, setActiveStage] = useState("draft");
  const [designOpenSectionId, setDesignOpenSectionId] = useState(null);
  const [designFocusMode, setDesignFocusMode] = useState(false);
  const [designPanelState, setDesignPanelState] = useState({}); // per-section collapses
  const lastStatusRef = useRef(null);
  const previewPayloadRef = useRef(null);
  const dataRef = useRef(null);
  const sectionResyncAttemptsRef = useRef(0);
  const lastMutationRef = useRef(null);
  function normalizeYouTubeRef(input){
    if(!input) return "";
    const str = String(input).trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;
    try {
      if (str.includes("youtu.be/") || str.includes("youtube.com")) {
        const url = new URL(str.startsWith("http") ? str : `https://${str}`);
        if (url.hostname.includes("youtu.be")) {
          const id = url.pathname.split("/").filter(Boolean)[0] || "";
          if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
        }
        const v = url.searchParams.get("v");
        if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
        const parts = url.pathname.split("/").filter(Boolean);
        const embedIdx = parts.indexOf("embed");
        if (embedIdx >= 0 && parts[embedIdx+1] && /^[a-zA-Z0-9_-]{11}$/.test(parts[embedIdx+1])) return parts[embedIdx+1];
      }
    } catch {}
    return str;
  }
  function normalizeVideoRef(provider, ref){
    if (!ref) return ref;
    if ((provider || "").toLowerCase() === "youtube") return normalizeYouTubeRef(ref);
    return ref;
  }

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  async function load(){
    try {
      // Prefer fetching by id (stable), fallback to slug on first load
      const currentData = dataRef.current;
      const qs = currentData?.course?.id
        ? `id=${encodeURIComponent(String(currentData.course.id))}`
        : `slug=${encodeURIComponent(slug)}`;
      const r = await fetch(`/api/admin/courses/get?${qs}&t=${Date.now()}`,
        { cache: "no-store" }
      );
      const j = await r.json().catch(() => null);
      if (!r.ok || !j) {
        setStatusMsg(j?.error || "Unable to refresh course data");
        return;
      }
      if (!j.course) {
        setStatusMsg("Course data unavailable; keeping previous state.");
        return;
      }
      const nextSections = Array.isArray(j.sections) ? j.sections : [];
      const prevSections = Array.isArray(currentData?.sections) ? currentData.sections : [];
      const prevSectionsCount = prevSections.length;
      const mutation = lastMutationRef.current;

      if (process.env.NODE_ENV !== 'production') {
        console.log('[admin course load]', {
          nextCount: nextSections.length,
          prevCount: prevSectionsCount,
          mutation,
          retries: sectionResyncAttemptsRef.current,
        });
      }

      if (mutation === 'create-section') {
        if (nextSections.length < prevSectionsCount) {
          if (sectionResyncAttemptsRef.current > 0) {
            sectionResyncAttemptsRef.current -= 1;
            setStatusMsg("Waiting for new modules to sync…");
            setTimeout(() => {
              load();
            }, 450);
            return;
          }
          // All retries exhausted; keep optimistic state rather than clearing.
          setStatusMsg("Module creation detected; keeping local draft.");
          return;
        }
        lastMutationRef.current = null;
        sectionResyncAttemptsRef.current = 0;
      } else if (mutation === 'delete-section') {
        if (nextSections.length <= prevSectionsCount - 1) {
          lastMutationRef.current = null;
        }
      } else {
        if (nextSections.length < prevSectionsCount) {
          if (sectionResyncAttemptsRef.current <= 0) {
            sectionResyncAttemptsRef.current = 2;
          }
          sectionResyncAttemptsRef.current -= 1;
          setStatusMsg("Detected out-of-sync module list; retrying…");
          setTimeout(() => {
            load();
          }, 450);
          return;
        }
        sectionResyncAttemptsRef.current = 0;
      }

      setData({
        course: j.course,
        sections: nextSections,
      });
    } catch (e) {
      // keep prior data if fetch fails; surface minimal info in UI via statusMsg
      setStatusMsg("Failed to refresh sections. Check network/API.");
    }
  }
  useEffect(() => { load(); }, [slug]);

  const course = data?.course;
  const sectionsRaw = data?.sections || [];
  const sections = useMemo(() => {
    if (!Array.isArray(sectionsRaw)) return [];
    const sortByOrder = (a, b) => {
      const ao = (a?.order ?? a?.sortOrder ?? Number.MAX_SAFE_INTEGER);
      const bo = (b?.order ?? b?.sortOrder ?? Number.MAX_SAFE_INTEGER);
      if (ao !== bo) return ao - bo;
      return (a?.id ?? 0) - (b?.id ?? 0);
    };
    return sectionsRaw
      .map(section => ({
        ...section,
        lessons: Array.isArray(section.lessons)
          ? [...section.lessons].sort(sortByOrder)
          : [],
        materials: Array.isArray(section.materials)
          ? [...section.materials].sort(sortByOrder)
          : [],
      }))
      .sort(sortByOrder);
  }, [sectionsRaw]);
  const hasSections = sectionsRaw.length > 0;
  const hasDesigned = sections.some(s => (
    (s.content && s.content.trim())
    || (s.videoRef && s.videoRef.trim())
    || (s.lessons && s.lessons.some(l => l.videoRef && l.videoRef.trim()))
    || (s.materials && s.materials.length > 0)
  ));
  const canDesign = hasSections;
  const canPreview = hasDesigned;
  const canPublish = hasDesigned;

  const totals = useMemo(() => {
    const fallbackLen = previewPayloadRef.current?.sections?.length || 0;
    let lessons = 0;
    let materials = 0;
    let sectionsReady = 0;
    const list = sections.length ? sections : (previewPayloadRef.current?.sections || []);
    list.forEach(section => {
      lessons += section.lessons.length;
      materials += section.materials.length;
      const hasContent = (section.content && section.content.trim())
        || (section.videoRef && section.videoRef.trim())
        || section.lessons.some(l => l.videoRef && l.videoRef.trim())
        || section.materials.length > 0;
      if (hasContent) sectionsReady += 1;
    });
    return { lessons, materials, sectionsReady, count: list.length || fallbackLen };
  }, [sections]);

  useEffect(() => {
    const next = course?.status || "draft";
    if (lastStatusRef.current !== next) {
      lastStatusRef.current = next;
      setActiveStage(next);
    }
  }, [course?.status]);

  useEffect(() => {
    if (!course) {
      previewPayloadRef.current = null;
      return;
    }
    const courseData = {
      ...course,
      createdAt: typeof course.createdAt === "string" ? course.createdAt : course.createdAt?.toISOString?.() || null,
    };
    const sectionsData = sections.map((section, idx) => ({
      ...section,
      order: section.order ?? section.sortOrder ?? idx + 1,
      createdAt: typeof section.createdAt === "string" ? section.createdAt : section.createdAt?.toISOString?.() || null,
      lessons: (section.lessons || []).map(lesson => ({
        ...lesson,
        createdAt: typeof lesson.createdAt === "string" ? lesson.createdAt : lesson.createdAt?.toISOString?.() || null,
      })),
      materials: (section.materials || []).map(material => ({
        ...material,
        createdAt: typeof material.createdAt === "string" ? material.createdAt : material.createdAt?.toISOString?.() || null,
      })),
    }));
    previewPayloadRef.current = { course: courseData, sections: sectionsData };
  }, [course, sections]);

  useEffect(() => {
    if (activeStage === 'design' && sections.length) {
      setDesignOpenSectionId(prev => {
        if (prev && sections.some(section => section.id === prev)) return prev;
        return sections[0].id;
      });
    }
    if (activeStage !== 'design') {
      setDesignOpenSectionId(null);
      setDesignFocusMode(false);
    }
  }, [activeStage, sections]);

  function panelOpen(sectionId, key){
    const s = designPanelState[sectionId];
    if (!s || s[key] === undefined) return true;
    return !!s[key];
  }
  function togglePanel(sectionId, key){
    setDesignPanelState(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [key]: !(prev[sectionId]?.[key] ?? true) }
    }));
  }

  async function setStatus(next){
    if (!course) return;
    setStatusSaving(true);
    try{
      const r = await fetch('/api/admin/courses/status', {
        method: 'POST', headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ id: course.id, status: next })
      });
      const j = await r.json().catch(()=>({}));
      if (!r.ok) {
        setStatusMsg(j.error || 'Unable to change status');
      } else {
        setStatusMsg(`Moved to ${next}`);
        await load();
        lastStatusRef.current = next;
        setActiveStage(next);
      }
    } finally {
      setStatusSaving(false);
    }
  }

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
    const formEl = e.currentTarget; // capture before any await (SyntheticEvent pooling)
    setCreating(true);
    try {
      const form = Object.fromEntries(new FormData(formEl));
      const r = await fetch("/api/admin/courses/sections", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ courseId: course.id, title: form.title, content: form.content })
      });
      if (r.ok) {
        const j = await r.json().catch(()=>null);
        const t = j?.section?.title || form.title || "Section";
        setAddedNotice(`Added: ${t}`);
        // optimistic: insert into local list so count updates immediately
        if (j?.section) {
          setData(prev => prev ? {
            ...prev,
            sections: [
              ...(prev.sections || []),
              { ...j.section, order: j.section.sortOrder, lessons: [], materials: [] }
            ]
          } : prev);
        }
        sectionResyncAttemptsRef.current = 3;
        lastMutationRef.current = 'create-section';
        // auto-clear after a few seconds
        setTimeout(() => setAddedNotice(""), 3500);
        formEl.reset();
        await load();
        setActiveStage("design");
        // Auto-advance status from draft to design once there's at least one section
        if (course?.status === 'draft') {
          try { await setStatus('design'); } catch {}
        }
      }
    } finally {
      setCreating(false);
    }
  }

  async function updateSection(s, patch){
    const body = { id: s.id, ...patch };
    if (body.videoRef !== undefined) {
      const provider = body.videoType || s.videoType;
      body.videoRef = normalizeVideoRef(provider, body.videoRef);
    }
    const r = await fetch("/api/admin/courses/sections", {
      method: "PATCH",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify(body)
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
    lastMutationRef.current = 'delete-section';
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

  async function createLesson(e, sectionId){
    e.preventDefault();
    const formEl = e.currentTarget;
    setCreatingLessonFor(sectionId);
    try {
      const fd = new FormData(formEl);
      const title = (fd.get("title") || "").toString().trim();
      if (!title) return;
      const description = (fd.get("description") || "").toString();
      const videoProvider = (fd.get("videoProvider") || "youtube").toString();
      const rawVideoRef = (fd.get("videoRef") || "").toString().trim();
      const sourceUrl = (fd.get("sourceUrl") || "").toString().trim();
      const durationSecondsRaw = Number(fd.get("durationSeconds") || 0);
      const freePreview = fd.get("freePreview") ? true : false;
      const section = sections.find(s => s.id === sectionId);
      const order = section ? (section.lessons?.length || 0) + 1 : 1;
      const payload = {
        sectionId,
        title,
        description,
        videoProvider,
        videoRef: normalizeVideoRef(videoProvider, rawVideoRef),
        sourceUrl,
        durationSeconds: durationSecondsRaw > 0 ? durationSecondsRaw : null,
        freePreview,
        order,
      };
      const r = await fetch("/api/admin/courses/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json().catch(() => null);
      if (!r.ok) {
        setStatusMsg(j?.error || "Unable to add lesson");
        return;
      }
      if (j?.lesson) {
        const newLesson = { ...j.lesson, order: j.lesson.sortOrder };
        setData(prev => prev ? {
          ...prev,
          sections: prev.sections?.map(sec => sec.id === sectionId
            ? { ...sec, lessons: [ ...(sec.lessons || []), newLesson ] }
            : sec
          ),
        } : prev);
      }
      formEl.reset();
      await load();
    } finally {
      setCreatingLessonFor(null);
    }
  }

  async function updateLesson(lesson, patch){
    const body = { id: lesson.id, ...patch };
    if (body.durationSeconds !== undefined) {
      const n = Number(body.durationSeconds || 0);
      body.durationSeconds = n > 0 ? n : null;
    }
    if (body.videoRef !== undefined) {
      const provider = body.videoProvider || lesson.videoProvider;
      body.videoRef = normalizeVideoRef(provider, body.videoRef);
    }
    const r = await fetch("/api/admin/courses/lessons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (r.ok) {
      load();
    } else {
      const j = await r.json().catch(() => null);
      setStatusMsg(j?.error || "Unable to update lesson");
    }
  }

  async function deleteLesson(sectionId, lessonId){
    if(!confirm("Delete lesson?")) return;
    const r = await fetch("/api/admin/courses/lessons", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: lessonId }),
    });
    if (r.ok) {
      setData(prev => prev ? {
        ...prev,
        sections: prev.sections?.map(sec => sec.id === sectionId
          ? { ...sec, lessons: (sec.lessons || []).filter(l => l.id !== lessonId) }
          : sec
        ),
      } : prev);
      load();
    } else {
      const j = await r.json().catch(() => null);
      setStatusMsg(j?.error || "Unable to delete lesson");
    }
  }

  async function moveLesson(section, lessonId, dir){
    const list = Array.isArray(section?.lessons) ? [...section.lessons] : [];
    const idx = list.findIndex(l => l.id === lessonId);
    if (idx < 0) return;
    const targetIdx = dir === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const reordered = list.map((l, i) => ({ id: l.id, order: i + 1 }));
    const temp = reordered[idx].order;
    reordered[idx].order = reordered[targetIdx].order;
    reordered[targetIdx].order = temp;
    const r = await fetch("/api/admin/courses/lessons/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectionId: section.id, order: reordered }),
    });
    if (r.ok) {
      load();
    } else {
      const j = await r.json().catch(() => null);
      setStatusMsg(j?.error || "Unable to reorder lessons");
    }
  }

  async function createMaterial(e, sectionId){
    e.preventDefault();
    const formEl = e.currentTarget;
    setCreatingMaterialFor(sectionId);
    try {
      const fd = new FormData(formEl);
      const title = (fd.get("title") || "").toString().trim();
      if (!title) return;
      const description = (fd.get("description") || "").toString();
      const resourceType = (fd.get("resourceType") || "link").toString();
      const resourceUrl = (fd.get("resourceUrl") || "").toString().trim();
      if (resourceType !== 'article' && !resourceUrl) {
        setStatusMsg("Resource URL is required for non-article resources");
        return;
      }
      if (resourceType === 'article' && !description.trim()) {
        setStatusMsg("Please paste the article text in the description field");
        return;
      }
      const section = sections.find(s => s.id === sectionId);
      const order = section ? (section.materials?.length || 0) + 1 : 1;
      const payload = {
        sectionId,
        title,
        description,
        resourceType,
        resourceUrl,
        order,
      };
      const r = await fetch("/api/admin/courses/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json().catch(() => null);
      if (!r.ok) {
        setStatusMsg(j?.error || "Unable to add material");
        return;
      }
      if (j?.material) {
        const newMat = { ...j.material, order: j.material.sortOrder };
        setData(prev => prev ? {
          ...prev,
          sections: prev.sections?.map(sec => sec.id === sectionId
            ? { ...sec, materials: [ ...(sec.materials || []), newMat ] }
            : sec
          ),
        } : prev);
      }
      formEl.reset();
      await load();
    } finally {
      setCreatingMaterialFor(null);
    }
  }

  async function updateMaterial(material, patch){
    const body = { id: material.id, ...patch };
    const r = await fetch("/api/admin/courses/materials", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (r.ok) {
      load();
    } else {
      const j = await r.json().catch(() => null);
      setStatusMsg(j?.error || "Unable to update material");
    }
  }

  async function deleteMaterial(sectionId, materialId){
    if(!confirm("Delete material?")) return;
    const r = await fetch("/api/admin/courses/materials", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: materialId }),
    });
    if (r.ok) {
      setData(prev => prev ? {
        ...prev,
        sections: prev.sections?.map(sec => sec.id === sectionId
          ? { ...sec, materials: (sec.materials || []).filter(m => m.id !== materialId) }
          : sec
        ),
      } : prev);
      load();
    } else {
      const j = await r.json().catch(() => null);
      setStatusMsg(j?.error || "Unable to delete material");
    }
  }

  async function moveMaterial(section, materialId, dir){
    const list = Array.isArray(section?.materials) ? [...section.materials] : [];
    const idx = list.findIndex(m => m.id === materialId);
    if (idx < 0) return;
    const targetIdx = dir === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const reordered = list.map((m, i) => ({ id: m.id, order: i + 1 }));
    const temp = reordered[idx].order;
    reordered[idx].order = reordered[targetIdx].order;
    reordered[targetIdx].order = temp;
    const r = await fetch("/api/admin/courses/materials/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectionId: section.id, order: reordered }),
    });
    if (r.ok) {
      load();
    } else {
      const j = await r.json().catch(() => null);
      setStatusMsg(j?.error || "Unable to reorder materials");
    }
  }

  // Lesson articles (per-lesson resources)
  async function createLessonArticle(e, lesson){
    e.preventDefault();
    const formEl = e.currentTarget;
    try {
      const fd = new FormData(formEl);
      const title = (fd.get("title") || "").toString().trim();
      const resourceUrl = (fd.get("resourceUrl") || "").toString().trim();
      const description = (fd.get("description") || "").toString();
      if (!title || !resourceUrl) return;
      const order = (lesson.articles?.length || 0) + 1;
      const payload = { lessonId: lesson.id, title, resourceUrl, description, order };
      const r = await fetch("/api/admin/courses/lesson-articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json().catch(() => null);
      if (!r.ok) { setStatusMsg(j?.error || "Unable to add article"); return; }
      formEl.reset();
      await load();
    } finally {}
  }

  async function updateLessonArticle(article, patch){
    const body = { id: article.id, ...patch };
    const r = await fetch("/api/admin/courses/lesson-articles", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (r.ok) { load(); } else {
      const j = await r.json().catch(()=>null);
      setStatusMsg(j?.error || "Unable to update article");
    }
  }

  async function deleteLessonArticle(articleId){
    if (!confirm("Delete article?")) return;
    const r = await fetch("/api/admin/courses/lesson-articles", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: articleId }),
    });
    if (r.ok) { load(); } else {
      const j = await r.json().catch(()=>null);
      setStatusMsg(j?.error || "Unable to delete article");
    }
  }

  async function moveLessonArticle(lesson, articleId, dir){
    const list = Array.isArray(lesson?.articles) ? [...lesson.articles] : [];
    const idx = list.findIndex(a => a.id === articleId);
    if (idx < 0) return;
    const targetIdx = dir === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const reordered = list.map((a, i) => ({ id: a.id, order: i + 1 }));
    const temp = reordered[idx].order; reordered[idx].order = reordered[targetIdx].order; reordered[targetIdx].order = temp;
    const r = await fetch("/api/admin/courses/lesson-articles/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: lesson.id, order: reordered }),
    });
    if (r.ok) { load(); } else {
      const j = await r.json().catch(()=>null);
      setStatusMsg(j?.error || "Unable to reorder articles");
    }
  }

  if(!data) return <div className="card">Loading…</div>;
  if(!course) return <div className="card">Course not found</div>;

  const stageOrder = ["draft", "design", "preview", "published"];
  const stageLabels = {
    draft: "Draft",
    design: "Design",
    preview: "Preview",
    published: "Published",
  };
  const currentStageIndex = stageOrder.indexOf(course.status || "draft");
  const safeStageIndex = currentStageIndex === -1 ? 0 : currentStageIndex;

  const renderDraftSections = () => (
    <section id="sections" className="card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Modules / Sections</h2>
        <span className="muted text-sm">{(sections.length || previewPayloadRef.current?.sections?.length || 0)} total</span>
      </div>
      <p className="text-sm text-[rgb(var(--muted))]">
        Name each module to outline the course structure. You can add content after moving to the Design stage.
      </p>
      {addedNotice && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {addedNotice}
        </div>
      )}
      <div className="space-y-2">
        {sections.map((section, index) => (
          <div key={section.id} className="rounded-xl border border-[color:var(--border)] bg-[rgb(var(--card))] p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <input
                defaultValue={section.title}
                onBlur={(e)=>updateSection(section,{ title: e.target.value })}
                className="btn w-full"
                placeholder={`Module ${index + 1} title`}
              />
              <div className="flex items-center gap-2">
                <button type="button" className="btn" onClick={()=>move(section.id,"up")} disabled={index===0}>↑</button>
                <button type="button" className="btn" onClick={()=>move(section.id,"down")} disabled={index===sections.length-1}>↓</button>
                <button type="button" className="btn" onClick={()=>deleteSection(section.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {sections.length === 0 && (
          <div className="rounded-xl border border-dashed border-[color:var(--border)] px-4 py-6 text-sm text-[rgb(var(--muted))]">
            No modules yet. Use the form below to start outlining the course.
          </div>
        )}
      </div>
      <form onSubmit={createSection} className="grid gap-2">
        <input name="title" placeholder="New module title" className="btn" required />
        <button className="btn btn-primary" disabled={creating}>{creating ? "Creating…" : "Add Module"}</button>
      </form>
    </section>
  );

  const renderDesignSections = () => (
    <section id="sections" className="space-y-4">
      <div className="card flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Design Modules</h2>
          <p className="text-sm text-[rgb(var(--muted))]">Add lessons, videos, and resources to each module.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="muted text-sm">{(sections.length || previewPayloadRef.current?.sections?.length || 0)} total</span>
          <button
            type="button"
            className={`btn ${designFocusMode ? 'btn-primary' : ''}`}
            onClick={()=> setDesignFocusMode(v => !v)}
            title={designFocusMode ? 'Show all modules' : 'Hide other modules'}
          >
            {designFocusMode ? 'Show all' : 'Focus mode'}
          </button>
        </div>
      </div>
      {addedNotice && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {addedNotice}
        </div>
      )}
      <div className="space-y-3">
        {sections.map((section, index) => {
          const lessons = section.lessons || [];
          const materials = section.materials || [];
          const videoCount = lessons.filter(lesson => lesson.videoRef).length;
          const isOpen = designOpenSectionId === section.id;
          const ready = (section.content && section.content.trim()) || videoCount > 0 || materials.length > 0;
          const hiddenByFocus = designFocusMode && !isOpen;

          if (hiddenByFocus) return null;

          return (
            <div key={section.id} className="rounded-2xl border border-[color:var(--border)] bg-[rgb(var(--card))]">
              <div className="flex flex-wrap items-start justify-between gap-3 p-4">
                <div className="space-y-1">
                  <div className="text-sm font-semibold flex items-center gap-2">
                    <span>{section.title || `Module ${index + 1}`}</span>
                    {ready && <span className="rounded-full bg-[rgba(var(--primary-rgb),0.12)] px-2 text-xs text-[rgb(var(--primary))]">Ready</span>}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wide text-[rgb(var(--muted))]">
                    <span>{lessons.length} lessons</span>
                    <span>{videoCount} videos</span>
                    <span>{materials.length} materials</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" className="btn" onClick={()=>move(section.id,"up")} disabled={index===0}>↑</button>
                  <button type="button" className="btn" onClick={()=>move(section.id,"down")} disabled={index===sections.length-1}>↓</button>
                  <button type="button" className="btn" onClick={()=>deleteSection(section.id)}>Delete</button>
                  <button
                    type="button"
                    className={`btn ${isOpen ? 'btn-primary' : ''}`}
                    onClick={() => {
                      if (isOpen) {
                        setDesignOpenSectionId(null);
                        setDesignFocusMode(false);
                      } else {
                        setDesignOpenSectionId(section.id);
                        setDesignFocusMode(true);
                      }
                    }}
                  >
                    {isOpen ? 'Close design' : 'Design section'}
                  </button>
                  {!designFocusMode && !isOpen && (
                    <button
                      type="button"
                      className="btn"
                      onClick={() => { setDesignOpenSectionId(section.id); setDesignFocusMode(true); }}
                      title="Hide other modules"
                    >
                      Focus this
                    </button>
                  )}
                </div>
              </div>
              {isOpen && (
                <div className="border-t border-[color:var(--border)] bg-[rgb(var(--card-2))] p-4 space-y-4">
                  {/* Module details header */}
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Module details</h4>
                    <button type="button" className="btn btn-ghost text-xs" onClick={()=>togglePanel(section.id,'details')}>
                      {panelOpen(section.id,'details') ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {panelOpen(section.id,'details') && (
                  <>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-xs muted">Module title</label>
                      <input
                        defaultValue={section.title}
                        onBlur={(e)=>updateSection(section,{ title: e.target.value })}
                        className="btn w-full"
                        placeholder="Module title"
                      />
                    </div>
                    <div>
                      <label className="text-xs muted">Module video (optional)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          defaultValue={section.videoType || ""}
                          onChange={(e)=>updateSection(section,{ videoType: e.target.value || null })}
                          className="btn"
                        >
                          <option value="">None</option>
                          <option value="youtube">YouTube</option>
                          <option value="cloudinary">Cloudinary</option>
                        </select>
                        <input
                          defaultValue={section.videoRef || ""}
                          onBlur={(e)=>updateSection(section,{ videoRef: e.target.value })}
                          className="btn"
                          placeholder="Video reference"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
                    <div>
                      <label className="text-xs muted">Module overview</label>
                      <textarea
                        defaultValue={section.content || ""}
                        onBlur={(e)=>updateSection(section,{ content: e.target.value })}
                        rows={4}
                        className="btn w-full"
                        placeholder="Describe what this module covers"
                      />
                    </div>
                    <label className="mt-6 flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        defaultChecked={!!section.freePreview}
                        onChange={(e)=>updateSection(section,{ freePreview: e.target.checked })}
                      />
                      Mark as free preview module
                    </label>
                  </div>
                  </>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h4 className="text-sm font-semibold">Lessons</h4>
                        <span className="muted text-xs">{lessons.length} total</span>
                      </div>
                      <button type="button" className="btn btn-ghost text-xs" onClick={()=>togglePanel(section.id,'lessons')}>
                        {panelOpen(section.id,'lessons') ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    {panelOpen(section.id,'lessons') && (
                    <div className="space-y-2">
                      {lessons.map((lesson, idx) => (
                        <div key={lesson.id} className="rounded-lg border border-[color:var(--border)] bg-[rgb(var(--card))] p-3 space-y-2">
                          <div className="flex items-start gap-2">
                            <input
                              defaultValue={lesson.title || ""}
                              onBlur={(e)=>updateLesson(lesson,{ title: e.target.value })}
                              className="btn w-full"
                              placeholder="Lesson title"
                            />
                            <div className="flex items-center gap-2">
                              <button type="button" className="btn" onClick={()=>moveLesson(section, lesson.id, "up")} disabled={idx===0}>↑</button>
                              <button type="button" className="btn" onClick={()=>moveLesson(section, lesson.id, "down")} disabled={idx===lessons.length-1}>↓</button>
                              <button type="button" className="btn" onClick={()=>deleteLesson(section.id, lesson.id)}>Delete</button>
                            </div>
                          </div>
                          <textarea
                            defaultValue={lesson.description || ""}
                            onBlur={(e)=>updateLesson(lesson,{ description: e.target.value })}
                            rows={3}
                            className="btn w-full"
                            placeholder="Lesson description"
                          />
                          <div className="grid gap-2 md:grid-cols-3">
                            <div>
                              <label className="text-xs muted">Video provider</label>
                              <select
                                defaultValue={lesson.videoProvider || "youtube"}
                                onChange={(e)=>updateLesson(lesson,{ videoProvider: e.target.value })}
                                className="btn w-full"
                              >
                                <option value="youtube">YouTube</option>
                                <option value="vimeo">Vimeo</option>
                                <option value="cloudinary">Cloudinary</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs muted">Video reference</label>
                              <input
                                defaultValue={lesson.videoRef || ""}
                                onBlur={(e)=>updateLesson(lesson,{ videoRef: e.target.value })}
                                className="btn w-full"
                                placeholder="dQw4w9WgXcQ"
                              />
                            </div>
                            <div className="flex items-center gap-3">
                              <input
                                type="number"
                                min="0"
                                defaultValue={lesson.durationSeconds || ""}
                                onBlur={(e)=>updateLesson(lesson,{ durationSeconds: e.target.value })}
                                className="btn w-full"
                                placeholder="Duration (s)"
                              />
                              <label className="flex items-center gap-2 text-xs">
                                <input
                                  type="checkbox"
                                  defaultChecked={!!lesson.freePreview}
                                  onChange={(e)=>updateLesson(lesson,{ freePreview: e.target.checked })}
                                />
                                Preview
                              </label>
                            </div>
                          </div>
                          <div className="grid gap-2 md:grid-cols-2">
                            <div>
                              <label className="text-xs muted">Reference URL</label>
                              <input
                                type="url"
                                defaultValue={lesson.sourceUrl || ""}
                                onBlur={(e)=>updateLesson(lesson,{ sourceUrl: e.target.value })}
                                className="btn w-full"
                                placeholder="https://..."
                              />
                            </div>
                          </div>
                          {/* Lesson-level articles */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs uppercase tracking-wide text-[rgb(var(--muted))]">Articles</h5>
                              <span className="muted text-xs">{(lesson.articles || []).length} total</span>
                            </div>
                            <div className="space-y-2">
                              {(lesson.articles || []).map((art, aidx) => (
                                <div key={art.id} className="rounded border border-[color:var(--border)] p-2">
                                  <div className="flex items-start gap-2">
                                    <input
                                      defaultValue={art.title || ''}
                                      onBlur={(e)=>updateLessonArticle(art,{ title: e.target.value })}
                                      className="btn w-full"
                                      placeholder="Article title"
                                    />
                                    <div className="flex items-center gap-1">
                                      <button type="button" className="btn" onClick={()=>moveLessonArticle(lesson, art.id, 'up')} disabled={aidx===0}>↑</button>
                                      <button type="button" className="btn" onClick={()=>moveLessonArticle(lesson, art.id, 'down')} disabled={aidx===(lesson.articles?.length||0)-1}>↓</button>
                                      <button type="button" className="btn" onClick={()=>deleteLessonArticle(art.id)}>Delete</button>
                                    </div>
                                  </div>
                                  <div className="grid gap-2 md:grid-cols-2 mt-2">
                                    <input
                                      type="url"
                                      defaultValue={art.resourceUrl || ''}
                                      onBlur={(e)=>updateLessonArticle(art,{ resourceUrl: e.target.value })}
                                      className="btn w-full"
                                      placeholder="https://..."
                                    />
                                    <textarea
                                      defaultValue={art.description || ''}
                                      onBlur={(e)=>updateLessonArticle(art,{ description: e.target.value })}
                                      rows={2}
                                      className="btn w-full"
                                      placeholder="Optional notes"
                                    />
                                  </div>
                                </div>
                              ))}
                              {(lesson.articles || []).length === 0 && (
                                <div className="rounded border border-dashed border-[color:var(--border)] px-3 py-2 text-xs text-[rgb(var(--muted))]">
                                  No articles yet. Use the form below to add one.
                                </div>
                              )}
                            </div>
                            <form onSubmit={(e)=>createLessonArticle(e, lesson)} className="space-y-2 rounded-lg border border-dashed border-[color:var(--border)] bg-[color:var(--muted-100)] p-2">
                              <input name="title" placeholder="Article title" className="btn" required />
                              <input name="resourceUrl" type="url" placeholder="https://..." className="btn" required />
                              <textarea name="description" rows={2} placeholder="Article notes (optional)" className="btn" />
                              <button className="btn btn-primary">Add Article</button>
                            </form>
                          </div>
                        </div>
                      ))}
                      {lessons.length === 0 && (
                        <div className="rounded border border-dashed border-[color:var(--border)] px-3 py-2 text-xs text-[rgb(var(--muted))]">
                          No lessons yet. Use the form below to add one.
                        </div>
                      )}
                    </div>
                    )}
                    {panelOpen(section.id,'lessons') && (
                    <form onSubmit={(e)=>createLesson(e, section.id)} className="space-y-2 rounded-lg border border-dashed border-[color:var(--border)] bg-[color:var(--muted-100)] p-3">
                      <div className="grid gap-2 md:grid-cols-2">
                        <input name="title" placeholder="Lesson title" className="btn" required />
                        <select name="videoProvider" defaultValue="youtube" className="btn">
                          <option value="youtube">YouTube</option>
                          <option value="vimeo">Vimeo</option>
                          <option value="cloudinary">Cloudinary</option>
                        </select>
                      </div>
                      <div className="grid gap-2 md:grid-cols-2">
                        <input name="videoRef" placeholder="Video reference" className="btn" required />
                        <input name="durationSeconds" type="number" min="0" placeholder="Duration (seconds)" className="btn" />
                      </div>
                      <div className="grid gap-2 md:grid-cols-2">
                        <input name="sourceUrl" type="url" placeholder="Reference URL (optional)" className="btn" />
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" name="freePreview" />
                          Free preview lesson
                        </label>
                      </div>
                      <textarea name="description" rows={3} placeholder="Lesson description (optional)" className="btn" />
                      <button className="btn btn-primary" disabled={creatingLessonFor === section.id}>{creatingLessonFor === section.id ? "Adding…" : "Add Lesson"}</button>
                    </form>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h4 className="text-sm font-semibold">Resources</h4>
                        <span className="muted text-xs">{materials.length} total</span>
                      </div>
                      <button type="button" className="btn btn-ghost text-xs" onClick={()=>togglePanel(section.id,'resources')}>
                        {panelOpen(section.id,'resources') ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    {panelOpen(section.id,'resources') && (
                    <div className="space-y-2">
                      {materials.map((material, idx) => (
                        <div key={material.id} className="rounded-lg border border-[color:var(--border)] bg-[rgb(var(--card))] p-3 space-y-2">
                          <div className="flex items-start gap-2">
                            <input
                              defaultValue={material.title || ""}
                              onBlur={(e)=>updateMaterial(material,{ title: e.target.value })}
                              className="btn w-full"
                              placeholder="Resource title"
                            />
                            <div className="flex items-center gap-2">
                              <button type="button" className="btn" onClick={()=>moveMaterial(section, material.id, "up")} disabled={idx===0}>↑</button>
                              <button type="button" className="btn" onClick={()=>moveMaterial(section, material.id, "down")} disabled={idx===materials.length-1}>↓</button>
                              <button type="button" className="btn" onClick={()=>deleteMaterial(section.id, material.id)}>Delete</button>
                            </div>
                          </div>
                          <div className="grid gap-2 md:grid-cols-3">
                            <div>
                              <label className="text-xs muted">Type</label>
                              <select
                                defaultValue={material.resourceType || "link"}
                                onChange={(e)=>updateMaterial(material,{ resourceType: e.target.value })}
                                className="btn w-full"
                              >
                                <option value="link">Link</option>
                                <option value="article">Article</option>
                                <option value="pdf">PDF</option>
                              </select>
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-xs muted">Resource URL (optional for articles)</label>
                              <input
                                type="url"
                                defaultValue={material.resourceUrl || ""}
                                onBlur={(e)=>updateMaterial(material,{ resourceUrl: e.target.value })}
                                className="btn w-full"
                                placeholder="https://..."
                              />
                            </div>
                          </div>
                          <textarea
                            defaultValue={material.description || ""}
                            onBlur={(e)=>updateMaterial(material,{ description: e.target.value })}
                            rows={3}
                            className="btn w-full"
                            placeholder="Article content or notes"
                          />
                        </div>
                      ))}
                      {materials.length === 0 && (
                        <div className="rounded border border-dashed border-[color:var(--border)] px-3 py-2 text-xs text-[rgb(var(--muted))]">
                          No materials yet. Use the form below to add supporting content.
                        </div>
                      )}
                    </div>
                    )}
                    {panelOpen(section.id,'resources') && (
                    <form onSubmit={(e)=>createMaterial(e, section.id)} className="space-y-2 rounded-lg border border-dashed border-[color:var(--border)] bg-[color:var(--muted-100)] p-3">
                      <input name="title" placeholder="Resource title" className="btn" required />
                      <div className="grid gap-2 md:grid-cols-2">
                        <select name="resourceType" defaultValue="link" className="btn">
                          <option value="link">Link</option>
                          <option value="article">Article</option>
                          <option value="pdf">PDF</option>
                        </select>
                        <input name="resourceUrl" type="url" placeholder="https://... (not required for article)" className="btn" />
                      </div>
                      <textarea name="description" rows={3} placeholder="If type is Article, paste article text here" className="btn" />
                      <button className="btn btn-primary" disabled={creatingMaterialFor === section.id}>{creatingMaterialFor === section.id ? "Adding…" : "Add Resource"}</button>
                    </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {sections.length === 0 && (
          <div className="rounded-xl border border-dashed border-[color:var(--border)] px-4 py-6 text-sm text-[rgb(var(--muted))]">
            No modules yet. Switch back to Draft to outline your curriculum.
          </div>
        )}
      </div>
      <form onSubmit={createSection} className="grid gap-2 rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--muted-100)] p-4">
        <div className="flex flex-col gap-2 md:flex-row">
          <input name="title" placeholder="New module title" className="btn flex-1" required />
          <button className="btn btn-primary md:w-40" disabled={creating}>{creating ? "Creating…" : "Add Module"}</button>
        </div>
        <textarea name="content" rows={3} placeholder="Optional module summary" className="btn" />
      </form>
    </section>
  );

  function renderStageOverview(stage) {
    if (!course) return null;
    const isCurrent = course.status === stage;
    const busy = statusSaving;

    const transitionDisabled = (() => {
      if (stage === 'design') return busy || !canDesign;
      if (stage === 'preview') return busy || !canPreview;
      if (stage === 'published') return busy || !canPublish;
      return busy;
    })();

    const transitionTooltip = (() => {
      if (stage === 'design' && !canDesign) return 'Add at least one section to move into Design.';
      if (stage === 'preview' && !canPreview) return 'Add content, a lesson video, or material to any section before Preview.';
      if (stage === 'published' && !canPublish) return 'Add content, a lesson video, or material to any section before Publishing.';
      return '';
    })();

    const actionLabel = isCurrent ? `Currently ${stageLabels[stage]}` : `Set status to ${stageLabels[stage]}`;

    const baseStats = (
      <ul className="list-disc pl-5 text-sm">
        <li>{totals.count} sections total</li>
        <li>{totals.lessons} lessons planned</li>
        <li>{totals.materials} materials attached</li>
        <li>{totals.sectionsReady} sections ready for preview</li>
      </ul>
    );

    if (stage === 'draft') {
      return (
        <div className="space-y-3 text-sm">
          <p>Draft is the planning space. Define the course outline and ensure fundamentals like title, slug, and pricing are correct.</p>
          {baseStats}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`btn ${isCurrent ? 'btn-ghost' : 'btn-primary'}`}
              disabled={transitionDisabled || isCurrent}
              onClick={() => setStatus('draft')}
            >
              {actionLabel}
            </button>
            <a href="#sections" className="btn">Jump to Sections</a>
          </div>
        </div>
      );
    }

    if (stage === 'design') {
      return (
        <div className="space-y-3 text-sm">
          <p>Design the curriculum by enriching each section with lessons, videos, and supporting materials.</p>
          {baseStats}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`btn ${isCurrent ? 'btn-ghost' : 'btn-primary'}`}
              disabled={transitionDisabled || isCurrent}
              onClick={() => setStatus('design')}
              title={transitionTooltip || undefined}
            >
              {actionLabel}
            </button>
            <a href="#sections" className="btn btn-primary">Open Sections Workspace</a>
          </div>
          {!canDesign && (
            <div className="rounded border border-dashed border-[color:var(--border)] bg-[color:var(--muted-100)] px-3 py-2 text-xs">
              Add at least one section to enable the Design stage.
            </div>
          )}
        </div>
      );
    }

    if (stage === 'preview') {
      return (
        <div className="space-y-3 text-sm">
          <p>Preview lets admins review the full course experience before publishing.</p>
          {baseStats}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`btn ${isCurrent ? 'btn-ghost' : 'btn-primary'}`}
              disabled={transitionDisabled || isCurrent}
              onClick={() => setStatus('preview')}
              title={transitionTooltip || undefined}
            >
              {actionLabel}
            </button>
            <Link
              href={`/courses/${course.slug}?preview=1`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              Open Preview Page ↗
            </Link>
          </div>
          {!canPreview && (
            <div className="rounded border border-dashed border-[color:var(--border)] bg-[color:var(--muted-100)] px-3 py-2 text-xs">
              Add content, a lesson video, or a material to any section before moving to Preview.
            </div>
          )}
        </div>
      );
    }

    // published
    return (
      <div className="space-y-3 text-sm">
        <p>Publish makes the course visible on the public site for everyone (unless marked free preview).</p>
        {baseStats}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`btn ${isCurrent ? 'btn-ghost' : 'btn-primary'}`}
            disabled={transitionDisabled || isCurrent}
            onClick={() => setStatus('published')}
            title={transitionTooltip || undefined}
          >
            {actionLabel}
          </button>
          <Link
            href={`/courses/${course.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            View Public Page ↗
          </Link>
        </div>
        {!canPublish && (
          <div className="rounded border border-dashed border-[color:var(--border)] bg-[color:var(--muted-100)] px-3 py-2 text-xs">
            Add content, a lesson video, or materials to at least one section before publishing.
          </div>
        )}
      </div>
    );
  }

  function renderStageContent() {
    if (!course) return null;

    if (activeStage === 'draft') {
      return (
        <>
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
          {renderDraftSections()}
        </>
      );
    }

    if (activeStage === 'design') {
      return (
        <>
          {renderDesignSections()}
          {previewPayloadRef.current ? (
            <section className="card-solid space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-semibold">Design Preview</h2>
                  <p className="text-xs text-[rgb(var(--muted))]">Live view of the curriculum layout as learners will experience it.</p>
                </div>
                <div className="text-xs text-[rgb(var(--muted))] flex items-center gap-2">
                  <span>Updates sync automatically</span>
                  <span className="h-2 w-2 rounded-full bg-[rgb(var(--primary))] animate-pulse" aria-hidden="true" />
                </div>
              </div>
              <CourseViewer course={previewPayloadRef.current.course} sections={previewPayloadRef.current.sections} />
            </section>
          ) : (
            <section className="card text-sm text-[rgb(var(--muted))]">
              Add modules and content to see the live preview.
            </section>
          )}
        </>
      );
    }

    if (activeStage === 'preview' || activeStage === 'published') {
      return (
        <section className="card-solid space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold">Preview Experience</h2>
              <p className="text-xs text-[rgb(var(--muted))]">Review the learner-facing course before sharing or publishing.</p>
            </div>
            <button
              type="button"
              className="btn"
              onClick={() => setActiveStage('design')}
            >
              Back to Design
            </button>
          </div>
          {previewPayloadRef.current ? (
            <CourseViewer course={previewPayloadRef.current.course} sections={previewPayloadRef.current.sections} />
          ) : (
            <div className="rounded-lg border border-dashed border-[color:var(--border)] bg-[color:var(--muted-100)] px-3 py-4 text-sm text-[rgb(var(--muted))]">
              Add modules, lessons, or materials in Design to generate a preview.
            </div>
          )}
        </section>
      );
    }

    return (
      <section className="card text-sm text-[rgb(var(--muted))]">
        Select a stage to manage the course workflow.
      </section>
    );
  }

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

      {/* Draft helper: show quick summary and a Design CTA once sections exist */}
      {course.status === 'draft' && hasSections && (
        <section className="card-solid space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-medium">Sections added</div>
            <div className="text-sm muted">{sections.length} total</div>
          </div>
          <ul className="list-disc pl-5 text-sm">
            {sections.slice(0,6).map(s => (
              <li key={s.id}>{s.title}</li>
            ))}
            {sections.length > 6 && (
              <li className="muted">and {sections.length - 6} more…</li>
            )}
          </ul>
          <div className="flex gap-2">
            <a href="#sections" className="btn">Go to Design</a>
            <button type="button" className="btn btn-primary" onClick={()=>setStatus('design')}>
              Design Now
            </button>
          </div>
        </section>
      )}

      <section className="card-solid space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm">Workflow</div>
          <span className="rounded bg-gray-100 px-2 py-1 text-xs uppercase tracking-wide text-gray-700">
            Status: {course.status || 'draft'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {stageOrder.map((stage, idx) => {
            const isActive = activeStage === stage;
            const reached = idx <= safeStageIndex;
            return (
              <button
                key={stage}
                type="button"
                className={`btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveStage(stage)}
              >
                {stageLabels[stage]}{reached ? ' ✓' : ''}
              </button>
            );
          })}
        </div>
        <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--muted-50)] p-4">
          {renderStageOverview(activeStage)}
        </div>
        {statusMsg && (
          <div className="rounded-lg border px-3 py-2 text-sm"
               style={{ borderColor: 'var(--border)' }}>
            {statusMsg}
          </div>
        )}
      </section>

      {renderStageContent()}
    </div>
  );
}
