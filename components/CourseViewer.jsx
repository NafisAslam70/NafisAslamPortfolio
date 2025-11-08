"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

function pickInitialSection(sections) {
  if (!sections.length) return null;
  return sections.find(section => section.lessons?.length) || sections[0];
}

function getInitialLesson(section) {
  if (!section) return null;
  return section.lessons?.find(lesson => lesson.videoRef) || section.lessons?.[0] || null;
}

function getVideoEmbed(lesson, section) {
  if (lesson && lesson.videoRef) {
    return { provider: lesson.videoProvider || "youtube", ref: lesson.videoRef };
  }
  if (section && section.videoRef) {
    return { provider: section.videoType || "youtube", ref: section.videoRef };
  }
  return null;
}

function buildLessonCatalog(sections) {
  const catalog = [];
  sections.forEach(section => {
    (section.lessons || []).forEach((lesson, index) => {
      catalog.push({
        sectionId: section.id,
        sectionTitle: section.title,
        lesson,
        indexInSection: index,
      });
    });
  });
  return catalog;
}

function VideoEmbed({ embed }) {
  if (!embed) {
    return (
      <div className="flex h-full items-center justify-center bg-[color:var(--muted-200)]/20 text-sm text-[color:var(--muted)]">
        No video yet. Add a lesson video or section video reference.
      </div>
    );
  }

  if (embed.provider === "youtube") {
    return (
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${embed.ref}`}
        title="Course video"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }
  if (embed.provider === "vimeo") {
    return (
      <iframe
        className="h-full w-full"
        src={`https://player.vimeo.com/video/${embed.ref}`}
        title="Course video"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }
  if (embed.provider === "cloudinary") {
    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const src = cloud
      ? `https://res.cloudinary.com/${cloud}/video/upload/f_auto,vc_auto,q_auto/${embed.ref}`
      : null;
    if (src) {
      return <video className="h-full w-full" controls src={src} />;
    }
  }
  return (
    <div className="flex h-full items-center justify-center bg-[color:var(--muted-200)]/20 text-sm text-[color:var(--muted)]">
      Unsupported provider: {embed.provider}
    </div>
  );
}

function ProgressBadge({ value, size = 'md' }) {
  const safe = Number.isFinite(value) ? Math.max(0, Math.min(100, Math.round(value))) : 0;
  const deg = safe * 3.6;
  const style = {
    background: `conic-gradient(rgb(var(--primary)) ${deg}deg, rgba(var(--border-rgb), 1) ${deg}deg)`
  };
  const outer = size === 'sm' ? 'h-8 w-8' : 'h-12 w-12';
  const innerPad = size === 'sm' ? 'inset-0.5 text-[10px]' : 'inset-1 text-xs';
  return (
    <div className={`relative ${outer} rounded-full`} style={style}>
      <div className={`absolute ${innerPad} flex items-center justify-center rounded-full bg-[rgb(var(--card))] font-semibold`}>
        {safe}%
      </div>
    </div>
  );
}

export default function CourseViewer({ course, sections }) {
  const initialSection = useMemo(() => pickInitialSection(sections), [sections]);
  const initialLesson = useMemo(() => getInitialLesson(initialSection), [initialSection]);

  const [openSectionId, setOpenSectionId] = useState(initialSection?.id || null);
  const [currentSectionId, setCurrentSectionId] = useState(initialSection?.id || null);
  const [currentLessonId, setCurrentLessonId] = useState(initialLesson?.id || null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile toggle
  const [wideSidebar, setWideSidebar] = useState(false); // give modules more space on desktop
  const [denseNav, setDenseNav] = useState(false); // compact navigation-only view
  const [completed, setCompleted] = useState(() => new Set());
  const autoTimerRef = useRef(null);

  useEffect(() => {
    setOpenSectionId(initialSection?.id || null);
    setCurrentSectionId(initialSection?.id || null);
    setCurrentLessonId(initialLesson?.id || null);
  }, [initialSection?.id, initialLesson?.id]);

  // Load saved progress from localStorage (per course)
  useEffect(() => {
    try {
      const key = `course_progress_${course?.id || course?.slug || 'unknown'}`;
      const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) setCompleted(new Set(arr));
      }
    } catch {}
  }, [course?.id, course?.slug]);

  const saveProgress = useCallback((next) => {
    try {
      const key = `course_progress_${course?.id || course?.slug || 'unknown'}`;
      localStorage.setItem(key, JSON.stringify(Array.from(next)));
    } catch {}
  }, [course?.id, course?.slug]);

  const markCurrentDone = useCallback(() => {
    if (!currentLessonId) return;
    setCompleted(prev => {
      const next = new Set(prev);
      next.add(currentLessonId);
      saveProgress(next);
      return next;
    });
  }, [currentLessonId, saveProgress]);

  const catalog = useMemo(() => buildLessonCatalog(sections), [sections]);
  const currentSection = useMemo(
    () => sections.find(section => section.id === currentSectionId) || initialSection || null,
    [currentSectionId, sections, initialSection]
  );
  const currentLesson = useMemo(() => {
    if (!currentSection) return null;
    const lessonList = currentSection.lessons || [];
    if (!lessonList.length) return null;
    return lessonList.find(lesson => lesson.id === currentLessonId) || lessonList[0] || null;
  }, [currentLessonId, currentSection]);

  const embed = getVideoEmbed(currentLesson, currentSection);

  // Auto-mark done when ~90% of durationSeconds has elapsed (best-effort for iframe providers)
  useEffect(() => {
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
    if (!currentLessonId) return;
    const duration = Number(currentLesson?.durationSeconds || 0);
    if (!duration || !Number.isFinite(duration)) return;
    const threshold = Math.max(1, Math.floor(duration * 0.9));
    let watched = 0;
    autoTimerRef.current = setInterval(() => {
      if (document.hidden) return;
      if (completed.has(currentLessonId)) {
        clearInterval(autoTimerRef.current);
        autoTimerRef.current = null;
        return;
      }
      watched += 1;
      if (watched >= threshold) {
        markCurrentDone();
        clearInterval(autoTimerRef.current);
        autoTimerRef.current = null;
      }
    }, 1000);
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    };
  }, [currentLessonId, currentLesson?.durationSeconds, completed, markCurrentDone]);

  const currentIndexWithinSection = currentSection
    ? (currentSection.lessons || []).findIndex(lesson => lesson.id === currentLesson?.id)
    : -1;
  const lessonCount = currentSection?.lessons?.length || 0;
  const progress = lessonCount > 0 && currentIndexWithinSection >= 0
    ? ((currentIndexWithinSection + 1) / lessonCount) * 100
    : 0;

  const flattened = catalog;
  const currentFlatIndex = currentLesson
    ? flattened.findIndex(item => item.lesson.id === currentLesson.id)
    : -1;
  const prevLesson = currentFlatIndex > 0 ? flattened[currentFlatIndex - 1] : null;
  const nextLesson = currentFlatIndex >= 0 && currentFlatIndex < flattened.length - 1
    ? flattened[currentFlatIndex + 1]
    : null;

  // Overall course progress from completed lessons
  const totalLessonsCount = flattened.length;
  const completedCount = useMemo(() => {
    if (!totalLessonsCount) return 0;
    let c = 0;
    flattened.forEach(item => { if (completed.has(item.lesson.id)) c += 1; });
    return c;
  }, [flattened, completed, totalLessonsCount]);
  const courseProgress = totalLessonsCount ? (completedCount / totalLessonsCount) * 100 : 0;

  const handleSelectSection = (section) => {
    setOpenSectionId(prev => (prev === section.id ? null : section.id));
    setCurrentSectionId(section.id);
    const firstLesson = getInitialLesson(section);
    setCurrentLessonId(firstLesson?.id || null);
  };

  const handleSelectLesson = (section, lesson) => {
    setCurrentSectionId(section.id);
    setCurrentLessonId(lesson.id);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <aside
        className={
          `space-y-4 ${wideSidebar ? 'lg:col-span-4' : 'lg:col-span-3'} ${sidebarOpen ? '' : 'hidden'} lg:block lg:sticky lg:top-24 min-w-0 overflow-hidden`
        }
      >
        <section className="card-solid space-y-3">
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              className="btn btn-ghost p-1 h-7 w-7 text-[10px]"
              onClick={() => setOpenSectionId(null)}
              aria-label="Collapse all modules"
              title="Collapse all"
            >
              ▾
            </button>
            <button
              type="button"
              className={`btn btn-ghost p-1 h-7 w-7 text-[10px] ${wideSidebar ? 'btn-primary' : ''}`}
              onClick={() => setWideSidebar(v => !v)}
              aria-label="Toggle wide sidebar"
              title={wideSidebar ? 'Narrow sidebar' : 'Wide sidebar'}
            >
              ↔
            </button>
            <button
              type="button"
              className={`btn btn-ghost p-1 h-7 w-7 text-[10px] ${denseNav ? 'btn-primary' : ''}`}
              onClick={() => setDenseNav(v => !v)}
              aria-label="Toggle quick navigation"
              title={denseNav ? 'Detailed view' : 'Quick nav'}
            >
              ≡
            </button>
          </div>
          <div className="flex items-center gap-2">
            <ProgressBadge value={courseProgress} size="sm" />
            <span className="text-xs text-[rgb(var(--muted))]">{Math.round(courseProgress)}%</span>
          </div>
          <div>
            <h2 className="text-base font-semibold">Modules</h2>
            <p className="text-xs text-[rgb(var(--muted))]">Click a module to explore its lessons.</p>
          </div>
          <div className="space-y-3 lg:max-h-[calc(100vh-240px)] lg:overflow-auto pr-1">
            {sections.map((section) => {
              const lessons = section.lessons || [];
              const videoCount = lessons.filter(lesson => lesson.videoRef).length;
              const articleCount = section.materials?.length || 0;
              const quizCount = section.quizzes?.length || 0;
              const isOpen = openSectionId === section.id;
              const isCurrent = currentSectionId === section.id;

              const sectionDone = lessons.filter(l => completed.has(l.id)).length;
              const lessonProgress = lessons.length ? (sectionDone / lessons.length) * 100 : 0;

              return (
                <div
                  key={section.id}
                  className={`rounded-xl border bg-[rgb(var(--card))] ${isCurrent ? 'border-[rgba(var(--primary-rgb),0.6)] bg-[rgba(var(--primary-rgb),0.06)]' : 'border-[color:var(--border)]'}`}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectSection(section)}
                    className={`flex w-full items-start justify-between gap-3 ${denseNav ? 'p-3' : 'p-4'} text-left`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold truncate`}>{section.title}</span>
                      </div>
                      {!denseNav && (
                        <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-wide text-[rgb(var(--muted))]">
                          <span>{videoCount} videos</span>
                          <span>{articleCount} materials</span>
                          {quizCount ? <span>{quizCount} mcqs</span> : null}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {!denseNav && lessons.length > 0 && (
                        <div className="text-xs text-[rgb(var(--muted))]">{Math.round(isCurrent ? lessonProgress : 0)}%</div>
                      )}
                      <span className={`text-lg transition ${isOpen ? "rotate-180" : ""}`}>⌄</span>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="border-t border-[color:var(--border)] bg-[rgb(var(--card-2))]">
                      {lessons.length === 0 ? (
                        <div className="px-4 py-3 text-xs text-[rgb(var(--muted))]">No lessons yet.</div>
                      ) : (
                        <ul className={`space-y-1 px-2 ${denseNav ? 'py-2' : 'py-3'} max-h-72 overflow-auto`}>
                          {lessons.map((lesson, index) => {
                            const isActiveLesson = currentLessonId === lesson.id;
                            return (
                              <li key={lesson.id}>
                                <button
                                  type="button"
                                  onClick={() => handleSelectLesson(section, lesson)}
                                  className={`flex w-full items-center gap-3 rounded-lg px-3 ${denseNav ? 'py-1.5' : 'py-2'} text-sm transition ${isActiveLesson ? "bg-[rgba(var(--primary-rgb),0.12)] text-[rgb(var(--primary))]" : "hover:bg-[rgba(var(--border-rgb),0.5)]"}`}
                                >
                                  <span className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${completed.has(lesson.id) ? 'bg-[rgba(var(--primary-rgb),0.12)] text-[rgb(var(--primary))] border-[rgba(var(--primary-rgb),0.4)]' : 'border-[rgba(var(--border-rgb),1)]'}`}>
                                    {completed.has(lesson.id) ? '✓' : index + 1}
                                  </span>
                                  <span className="flex-1 min-w-0 truncate text-left">{lesson.title}</span>
                                  {!denseNav && lesson.durationSeconds && (
                                    <span className="text-xs text-[rgb(var(--muted))]">
                                      {formatDuration(lesson.durationSeconds)}
                                    </span>
                                  )}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {sections.length === 0 && (
              <div className="rounded-xl border border-dashed border-[color:var(--border)] px-4 py-6 text-sm text-[rgb(var(--muted))]">
                No modules yet. Once lessons are added they will appear here.
              </div>
            )}
          </div>
        </section>
      </aside>

      <section className={`space-y-4 min-w-0 ${wideSidebar ? 'lg:col-span-8' : 'lg:col-span-9'}`}>
        {/* Mobile modules toggle */}
        <div className="flex items-center justify-between lg:hidden">
          <button type="button" className="btn" onClick={() => setSidebarOpen(o => !o)}>
            {sidebarOpen ? 'Hide modules' : 'Show modules'}
          </button>
        </div>
        <div className="card-solid space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wide text-[rgb(var(--muted))]">
                {currentSection ? currentSection.title : "Course"}
              </div>
              <h2 className="text-xl font-semibold">
                {currentLesson?.title || currentSection?.title || course.title}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-[rgb(var(--muted))]">
              <span>Watch the full lesson to record progress.</span>
              <button className="btn btn-ghost text-xs">Report</button>
            </div>
          </div>

          <div className="aspect-video overflow-hidden rounded-xl border border-[color:var(--border)] bg-black">
            <VideoEmbed embed={embed} />
          </div>

          <div className="flex items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2 text-xs text-[rgb(var(--muted))]">
              {currentLesson?.sourceUrl && (
                <Link href={currentLesson.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-xs">
                  Reference ↗
                </Link>
              )}
            </div>
            <div className="flex gap-2">
              {currentLessonId && (
                <button
                  type="button"
                  className={`btn text-xs ${completed.has(currentLessonId) ? 'btn-ghost' : ''}`}
                  onClick={markCurrentDone}
                  disabled={completed.has(currentLessonId)}
                  title={completed.has(currentLessonId) ? 'Completed' : 'Mark as done'}
                >
                  {completed.has(currentLessonId) ? '✓ Done' : '✓ Mark done'}
                </button>
              )}
              <button
                type="button"
                className="btn"
                disabled={!prevLesson}
                onClick={() => {
                  if (!prevLesson) return;
                  setCurrentSectionId(prevLesson.sectionId);
                  setCurrentLessonId(prevLesson.lesson.id);
                  setOpenSectionId(prevLesson.sectionId);
                }}
              >
                ← Prev
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!nextLesson}
                onClick={() => {
                  if (!nextLesson) return;
                  setCurrentSectionId(nextLesson.sectionId);
                  setCurrentLessonId(nextLesson.lesson.id);
                  setOpenSectionId(nextLesson.sectionId);
                }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {currentLesson?.description && (
          <section className="card space-y-2">
            <h3 className="text-lg font-semibold">Lesson Notes</h3>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{currentLesson.description}</p>
          </section>
        )}

        {(currentLesson?.articles?.length || 0) > 0 && (
          <section className="card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Articles</h3>
              <span className="text-xs uppercase tracking-wide text-[rgb(var(--muted))]">
                {currentLesson.articles.length} items
              </span>
            </div>
            <ul className="space-y-2">
              {currentLesson.articles.map(art => (
                <li key={art.id} className="rounded-xl border border-[color:var(--border)] px-4 py-3 text-sm break-words">
                  <div className="flex items-center justify-between gap-3">
                    <Link href={art.resourceUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-[rgb(var(--primary))] underline truncate">
                      {art.title}
                    </Link>
                  </div>
                  {art.description && (
                    <p className="mt-2 text-sm text-[rgb(var(--muted))] whitespace-pre-wrap break-words">
                      {art.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {currentSection?.content && (
          <section className="card space-y-2">
            <h3 className="text-lg font-semibold">Module Overview</h3>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap">
              {currentSection.content}
            </div>
          </section>
        )}

        {(currentSection?.materials?.length || 0) > 0 && (
          <section className="card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Resources</h3>
              <span className="text-xs uppercase tracking-wide text-[rgb(var(--muted))]">
                {currentSection.materials.length} items
              </span>
            </div>
            <ul className="space-y-2">
              {currentSection.materials.map(material => {
                const isInlineArticle = (material.resourceType === 'article') && (!material.resourceUrl || material.resourceUrl.trim() === '');
                return (
                  <li key={material.id} className="rounded-xl border border-[color(var(--border))] px-4 py-3 text-sm break-words">
                    <div className="flex items-center justify-between gap-3">
                      {isInlineArticle ? (
                        <span className="font-medium">{material.title}</span>
                      ) : (
                        <Link href={material.resourceUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-[rgb(var(--primary))] underline truncate">
                          {material.title}
                        </Link>
                      )}
                      {material.resourceType && (
                        <span className="rounded-full bg-[rgba(var(--primary-rgb),0.12)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[rgb(var(--primary))]">
                          {material.resourceType}
                        </span>
                      )}
                    </div>
                    {isInlineArticle ? (
                      <div className="prose prose-sm max-w-none mt-2 whitespace-pre-wrap">{material.description}</div>
                    ) : (
                      material.description && (
                        <p className="mt-2 text-sm text-[rgb(var(--muted))] whitespace-pre-wrap break-words">{material.description}</p>
                      )
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </section>
    </div>
  );
}

function formatDuration(totalSeconds) {
  if (!totalSeconds || !Number.isFinite(totalSeconds)) return null;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes && seconds) return `${minutes}m ${seconds}s`;
  if (minutes) return `${minutes}m`;
  return `${seconds}s`;
}
