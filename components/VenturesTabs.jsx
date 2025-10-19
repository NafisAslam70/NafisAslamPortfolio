'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const safeItems = Array.isArray(items) ? items : [];
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

  return (
    <div className="space-y-6">
      <section className="card flex flex-wrap items-center justify-between gap-3 p-4 sm:gap-4 sm:p-5">
        <h1 className="text-xl font-semibold sm:text-2xl">Ventures</h1>

        <div
          role="tablist"
          aria-label="Select a venture"
          className="flex flex-wrap gap-2"
        >
          {safeItems.map((v) => {
            const isActive = v.slug === activeSlug;
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
                className={`btn ${isActive ? "btn-primary" : ""}`}
              >
                {v.title}
              </button>
            );
          })}
        </div>
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
