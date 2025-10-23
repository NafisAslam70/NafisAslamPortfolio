"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const ventureDetails = {
  "deepwork-ai": {
    spotlight: "Focus OS for shipping through chaos.",
    summary:
      "DeepWork AI is the execution engine that keeps students and operators in flow. Sprint rooms, Deep Calendar integration, and reflective loops turn Cal Newport’s deep work rules into daily reps.",
    bullets: [
      "Live sprint rooms with accountability nudges and webcam-assisted focus scoring.",
      "Deep Calendar handles weekly depth blocks, rituals, and end-of-day shutdown journals.",
      "Analytics, streaks, and reviews that show exactly how momentum compounds.",
    ],
    actions: [
      {
        label: "Open DeepWork AI",
        href: "https://deep-work-ai-nu.vercel.app/",
        variant: "primary",
        external: true,
      },
      {
        label: "Read technical deep-dive",
        href: "/ventures/deepwork-ai",
      },
    ],
  },
  "meed-public-school": {
    spotlight: "Outcome-first school for first-gen learners.",
    summary:
      "Meed Public School is a mission build in Jharkhand, co-designed with grassroots operators so first-gen learners can ship outcomes, not just tick grades. The playbook blends focus systems, community leadership, and tech-enabled measurement.",
    bullets: [
      "Core curriculum wrapped in project-based learning and weekly community design labs.",
      "Focus systems, reflections, and wellbeing protocols adapted from the DeepWork stack.",
      "Transparent dashboards and partnerships for scaling the model across the state.",
    ],
    actions: [
      {
        label: "Explore the venture",
        href: "/ventures/meed-public-school",
        variant: "primary",
      },
      {
        label: "Download vision + impact briefs",
        href: "/ventures/meed-public-school#resources",
      },
    ],
  },
};

function ActionButton({ action }) {
  const className = `btn ${action.variant === "primary" ? "btn-primary" : ""}`;

  if (action.external) {
    return (
      <a
        href={action.href}
        target="_blank"
        rel="noreferrer"
        className={className}
      >
        {action.label}
      </a>
    );
  }

  return (
    <Link href={action.href} className={className}>
      {action.label}
    </Link>
  );
}

export default function VenturesTabs({ items, initialSlug, showDetailCard = true }) {
  const safeItems = useMemo(() => (Array.isArray(items) ? items : []), [items]);
  const router = useRouter();
  const defaultSlug = useMemo(() => {
    if (safeItems.find((v) => v.slug === "deepwork-ai")) return "deepwork-ai";
    return safeItems[0]?.slug ?? "";
  }, [safeItems]);
  const firstSlug = useMemo(() => {
    if (!initialSlug) return defaultSlug;
    return safeItems.find((v) => v.slug === initialSlug)?.slug ?? defaultSlug;
  }, [initialSlug, safeItems, defaultSlug]);
  const [activeSlug, setActiveSlug] = useState(firstSlug);

  useEffect(() => {
    if (!safeItems.length) return;
    const wanted = safeItems.find((v) => v.slug === initialSlug)?.slug ?? defaultSlug;
    setActiveSlug((prev) => (prev === wanted ? prev : wanted));
  }, [initialSlug, safeItems, defaultSlug]);

  if (!safeItems.length) {
    return (
      <div className="card">
        <h1 className="text-3xl font-bold">Ventures</h1>
        <p className="muted">No ventures published yet.</p>
      </div>
    );
  }

  const activeItem =
    safeItems.find((v) => v.slug === activeSlug) ?? safeItems[0];
  const detail = ventureDetails[activeItem.slug] || {
    spotlight: activeItem.tagline,
    summary: activeItem.summary,
    bullets: [],
    actions: activeItem.url
      ? [
          {
            label: "Open venture",
            href: activeItem.url,
            variant: "primary",
          },
        ]
      : [],
  };

  const activeIndex = safeItems.findIndex((v) => v.slug === activeSlug);

  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_52px_-30px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-white/12 dark:bg-white/[0.06] dark:shadow-[0_24px_52px_-30px_rgba(15,23,42,0.68)] sm:p-8">
        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-600 shadow-sm dark:border-white/12 dark:bg-white/10 dark:text-indigo-100/80">
                Active ventures
                <span className="text-indigo-500 dark:text-indigo-300">• {safeItems.length}</span>
              </span>
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Ventures</h1>
            </div>
            <p className="max-w-sm text-sm text-slate-600 dark:text-indigo-100/75">
              Tap a card to flip the view. Each venture loads instantly with its spotlight, summary, and quick actions.
            </p>
          </div>
          <div
            role="tablist"
            aria-label="Select a venture"
            className="relative flex flex-wrap gap-2 rounded-2xl border border-slate-200/60 bg-white/70 p-2 dark:border-white/10 dark:bg-white/[0.04]"
          >
            {safeItems.map((v, idx) => {
                const isActive = v.slug === activeSlug;
                const detailMeta = ventureDetails[v.slug] || {};
                return (
                  <button
                    key={v.slug}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      if (v.slug === activeSlug) return;
                      setActiveSlug(v.slug);
                      router.replace(`/ventures/${v.slug}`, { scroll: false });
                    }}
                    className="relative inline-flex h-16 flex-1 min-w-[160px] items-center justify-between gap-3 overflow-hidden rounded-xl px-4 py-3 text-left transition"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="venture-pill"
                        className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-[0_20px_45px_-28px_rgba(79,70,229,0.55)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <div className="relative flex flex-col">
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-[0.28em] ${
                          isActive ? "text-white/80" : "text-slate-500 dark:text-indigo-100/60"
                        }`}
                      >
                        {detailMeta.spotlight || v.tagline || "Live venture"}
                      </span>
                      <span
                        className={`text-base font-semibold ${
                          isActive ? "text-white" : "text-slate-900 dark:text-white"
                        }`}
                      >
                        {v.title}
                      </span>
                    </div>
                    <span
                        className={`relative inline-flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-semibold uppercase ${
                          isActive
                            ? "border-white/60 text-white"
                            : "border-slate-200 text-slate-500 dark:border-white/15 dark:text-indigo-100/70"
                        }`}
                    >
                      {idx + 1}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/12 dark:bg-white/[0.07] dark:shadow-[0_18px_45px_-30px_rgba(15,23,42,0.72)] sm:p-8"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white md:text-3xl">
                  {activeItem.title}
                </h2>
                {detail.summary && (
                  <p className="max-w-2xl text-sm text-slate-600 dark:text-indigo-100/75">
                    {detail.summary}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {Array.isArray(detail.actions) &&
                  detail.actions.slice(0, 2).map((action) => (
                    <ActionButton key={action.href} action={action} />
                  ))}
              </div>
            </div>

            {Array.isArray(detail.bullets) && detail.bullets.length > 0 && (
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {detail.bullets.slice(0, 4).map((point) => (
                  <li
                    key={point}
                    className="rounded-xl border border-slate-200/60 bg-white/80 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/75"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {showDetailCard && (
        <section
          className="relative overflow-hidden rounded-3xl border p-8 shadow-sm md:p-10"
          style={{
            borderColor: "rgb(var(--border))",
            background: "rgba(var(--card) / 0.78)",
          }}
        >
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${
              activeItem.accent || "from-indigo-500/20 to-purple-500/20"
            } opacity-20`}
          />
          <div className="relative space-y-6 md:space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                {detail.spotlight}
              </span>
              <h2 className="text-3xl font-semibold md:text-4xl">
                {activeItem.title}
              </h2>
              {detail.summary && (
                <p className="text-lg text-muted">{detail.summary}</p>
              )}
            </div>

            {Array.isArray(detail.bullets) && detail.bullets.length > 0 && (
              <ul className="space-y-3 text-sm text-muted md:text-base">
                {detail.bullets.map((point) => (
                  <li
                    key={point}
                    className="rounded-2xl border px-4 py-3"
                    style={{
                      borderColor: "rgb(var(--border))",
                      background: "rgba(var(--card) / 0.72)",
                    }}
                  >
                    {point}
                  </li>
                ))}
              </ul>
            )}

            {Array.isArray(detail.actions) && detail.actions.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {detail.actions.map((action) => (
                  <ActionButton key={action.href} action={action} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
