'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaBolt, FaCalendarAlt, FaRocket, FaUserAstronaut } from "react-icons/fa";
import VenturesTabs from "@/components/VenturesTabs";
import venturesJson from "@/content/ventures.json";

const benefits = [
  {
    title: "Set Goals",
    description:
      "Plan what you want to achieve—big or small—and let DeepWork AI guide every rep with clear prompts.",
    icon: "🎯",
  },
  {
    title: "Stay Focused",
    description:
      "Sprint in distraction-proof sessions. Gentle nudges pull you back when context switches try to steal the flow.",
    icon: "🧘",
  },
  {
    title: "See Results",
    description:
      "Scoreboards, streaks, and review loops show exactly how much sharper you’re getting week over week.",
    icon: "📊",
  },
];

const technicalSummary = [
  {
    title: "Why it matters",
    description:
      "Attention spans collapsed from 150 seconds in 2004 to 47 seconds today. Notifications, feeds, and endless content hijack our ability to go deep.",
  },
  {
    title: "What DeepWork AI does",
    description:
      "Turns Cal Newport’s deep work principles into a tangible system—rituals, Pomodoro sprints, and real-time nudges that make focus effortless.",
  },
  {
    title: "Three core modules",
    description:
      "Goal management to set intent, execution with webcam-powered focus scoring, and analytics to review trends and reflections.",
  },
  {
    title: "System architecture",
    description:
      "Next.js + Framer Motion UI, Flask backend, Neon Postgres via Drizzle ORM, and the Deep Lens Engine using OpenCV + YOLOv11 for distraction detection.",
  },
  {
    title: "Impact & potential",
    description:
      "Keeps students and professionals accountable, scales to classrooms and teams, and slots into edtech/productivity ecosystems.",
  },
];

const tabs = [
  { id: "what", label: "DeepWork OS", subtitle: "Why it exists", icon: FaBolt },
  { id: "calendar", label: "Deep Calendar", subtitle: "Plan the week", icon: FaCalendarAlt },
  { id: "try", label: "Try DeepWork", subtitle: "Sprint now", icon: FaRocket },
  { id: "story", label: "Origin Story", subtitle: "Founder notes", icon: FaUserAstronaut },
];

const ventureItems = Array.isArray(venturesJson)
  ? venturesJson
  : venturesJson?.items || [];

export default function DeepWorkAI() {
  const [activeTab, setActiveTab] = useState("what");

  const renderTabContent = () => {
    switch (activeTab) {
      case "what":
        return (
          <div className="space-y-12 md:space-y-16">
            <section className="grid gap-8 md:grid-cols-[1.35fr,1fr] md:items-center">
              <div
                className="overflow-hidden rounded-3xl border shadow-lg backdrop-blur-sm"
                style={{
                  borderColor: "rgb(var(--border))",
                  background: "rgb(var(--card) / 0.8)",
                }}
              >
                <div className="relative w-full pt-[56.25%]">
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src="https://www.youtube.com/embed/Je0_qLxRbX8?si=mpLl0WpdWwml0A15"
                    title="DeepWork AI technical overview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              </div>

              <div className="space-y-5">
                <span
                  className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted"
                  style={{
                    borderColor: "rgb(var(--fg) / 0.15)",
                    background: "rgb(var(--fg) / 0.05)",
                  }}
                >
                  Technical deep dive
                </span>
                <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
                  DeepWork AI: Intelligent Focus Engine
                </h2>
                <p className="text-muted md:text-base">
                  Final year intelligent computing project that tackles attention collapse head-on. This talk walks
                  through the core problems, the Deep Lens Engine setup, and how the platform keeps users in deep focus.
                </p>
                <ul className="space-y-3 text-sm text-muted md:text-base">
                  {technicalSummary.map((item) => (
                    <li
                      key={item.title}
                      className="rounded-2xl border px-4 py-3"
                      style={{
                        borderColor: "rgb(var(--border))",
                        background: "rgb(var(--card) / 0.72)",
                      }}
                    >
                      <span className="block font-semibold text-foreground">{item.title}</span>
                      <span className="block">{item.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section
              className="w-full space-y-6 rounded-3xl border p-8 shadow-sm backdrop-blur-sm md:flex md:items-center md:gap-8 md:p-10"
              style={{
                borderColor: "rgb(var(--border))",
                background: "rgb(var(--card) / 0.78)",
              }}
            >
              <div className="md:w-1/2">
                <div
                  className="relative rounded-3xl border bg-gradient-to-br from-indigo-200/40 via-transparent to-purple-200/30 p-4"
                  style={{ borderColor: "rgb(var(--border))" }}
                >
                  <div
                    className="rounded-2xl border bg-card/70 p-6 text-center text-lg font-semibold text-indigo-700 shadow-sm"
                    style={{ borderColor: "rgb(var(--border))" }}
                  >
                    🌟 A new way to focus
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 space-y-4">
                <h3 className="text-2xl font-semibold md:text-3xl">
                  Why DeepWork AI?
                </h3>
                <p className="text-muted">
                  If your calendar is loud and your attention is scattered, DeepWork AI turns ship-mode into
                  a game you can win daily. It acts like a personal coach—helping you set the right targets,
                  stay in flow, and celebrate the reps that matter.
                </p>
                <p className="text-muted">
                  Real-time prompts, webcam-assisted focus scoring, and reflective summaries mean every session
                  follows Cal Newport’s deep work rules: embrace boredom, ritualise focus, and be ruthless with distractions.
                </p>
              </div>
            </section>
      </div>
    );

      case "calendar":
        return (
          <div className="space-y-12 md:space-y-16">
            <section
              className="w-full space-y-6 rounded-3xl border p-8 shadow-sm backdrop-blur-sm md:p-10"
              style={{
                borderColor: "rgb(var(--border))",
                background: "rgb(var(--card) / 0.78)",
              }}
            >
              <div className="space-y-3 text-center md:text-left">
                <span
                  className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted"
                  style={{
                    borderColor: "rgb(var(--fg) / 0.15)",
                    background: "rgb(var(--fg) / 0.05)",
                  }}
                >
                  Deep Calendar overview
                </span>
                <h2 className="text-3xl font-semibold md:text-4xl">
                  Build and run your week with depth blocks
                </h2>
                <p className="text-muted md:text-base">
                  Deep Calendar is the planning wing of DeepWork AI: a focus-first calendar that treats every day like
                  a stack of depth blocks—Light, Medium, and Deep—so you always know the intensity that matches the moment.
                  Routines, single-day plans, and end-of-day journals keep you honest.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-3xl border p-5" style={{ borderColor: "rgb(var(--border))" }}>
                  <h3 className="text-lg font-semibold">Planning engine</h3>
                  <ul className="mt-3 space-y-2 text-sm text-muted">
                    <li>
                      🔁 Routine Builder sets open/close windows, standing blocks with goals, and warns when edits clash
                      with today’s already-open schedule.
                    </li>
                    <li>
                      🧱 Depth blocks (Light, Medium, Deep) layer on top of sprints and breaks so your week is intensity-balanced.
                    </li>
                    <li>
                      🗓️ Standing routines and Single-Day Plans cooperate—override today without touching the rest of the week.
                    </li>
                  </ul>
                </div>

                <div className="rounded-3xl border p-5" style={{ borderColor: "rgb(var(--border))" }}>
                  <h3 className="text-lg font-semibold">Execution layer</h3>
                  <ul className="mt-3 space-y-2 text-sm text-muted">
                    <li>
                      🚪 Daily Dashboard gates “open” and “shutdown” rituals, shows the active block live, and lets you flip tasks
                      between Active, Done, or Skipped with quick notes.
                    </li>
                    <li>
                      📈 Deep Calendar view renders a full-week timeline on desktop and a focused day view on mobile, highlighting overrides
                      and anything that drifts outside the routine.
                    </li>
                    <li>
                      🧭 Account tools manage color-coded goals, user settings, and a rotating public API key for integrations.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section
              className="grid gap-8 rounded-3xl border p-8 shadow-sm backdrop-blur-sm md:grid-cols-[1fr,0.9fr] md:items-center md:p-10"
              style={{
                borderColor: "rgb(var(--border))",
                background: "rgb(var(--card) / 0.72)",
              }}
            >
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold md:text-3xl">
                  Stay synced across web and mobile
                </h3>
                <p className="text-muted">
                  An Expo-powered mobile shell mirrors the web experience, giving you the same routine windows, sprint timers,
                  and day-close workflows on the go. The APK build is available for early testers while we prep the store launch.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="https://deep-calendar.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Launch Deep Calendar →
                  </Link>
                  <Link
                    href="mailto:hello@deepwork.ai?subject=Deep%20Calendar%20APK%20Request"
                    className="btn"
                  >
                    Request Android APK
                  </Link>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-3xl border" style={{ borderColor: "rgb(var(--border))" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10" />
                <div className="relative grid gap-4 p-6 text-sm text-muted">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
                      Daily open checklist
                    </div>
                    <p>✅ Energy scan • 📚 Review goals • 🔄 Sync standing blocks • 🎯 Declare today’s top three.</p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
                      Shutdown recap
                    </div>
                    <p>📝 Log wins • 🚧 Capture blockers • 🌗 Tag focus intensity • 🙏 Close with a one-line journal.</p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
                      Mobile companion
                    </div>
                    <p>
                      Adaptive day timeline, routine alerts, and quick task flips keep your plan intact between desktop sessions.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );

      case "story":
        return (
          <div className="space-y-12 md:space-y-16">
            <section
              className="w-full overflow-hidden rounded-3xl border shadow-lg backdrop-blur-sm"
              style={{
                borderColor: "rgb(var(--border))",
                background: "rgb(var(--card) / 0.78)",
              }}
            >
              <div className="relative w-full pt-[56.25%]">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://www.youtube.com/embed/YEI1MAditYg?si=rMM9_I7HxZWQdTVE"
                  title="Ma Ziyang's Story with DeepWork AI"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </section>

            <section className="w-full space-y-6 lg:max-w-5xl">
              <div className="space-y-4 text-center">
                <h2 className="text-3xl font-semibold md:text-4xl">
                  From overwhelm to distinction
                </h2>
                <p className="text-muted md:text-lg">
                  Ziyang was buried under deadlines and distractions—until a friend introduced DeepWork AI.
                  The system orchestrated his entire study sprint: goal selection, distraction-proof sessions,
                  gentle nudges, and reflective analytics that impressed his professor.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-3xl border p-5" style={{ borderColor: "rgb(var(--border))" }}>
                  <h3 className="text-lg font-semibold">Session flow</h3>
                  <ul className="mt-2 space-y-2 text-sm text-muted">
                    <li>🎯 Choose a live goal like “CMT426 final exam” or run a spontaneous deep work block.</li>
                    <li>⏱️ Run Pomodoro-driven focus sessions with live attention scoring in the corner.</li>
                    <li>🔔 If he picked up his phone or left the frame, DeepWork AI nudged—or ended—the session.</li>
                    <li>📝 Breaks, reflections, and auto-logged stats completed each loop.</li>
                  </ul>
                </div>

                <div className="rounded-3xl border p-5" style={{ borderColor: "rgb(var(--border))" }}>
                  <h3 className="text-lg font-semibold">Analytics that compound</h3>
                  <ul className="mt-2 space-y-2 text-sm text-muted">
                    <li>📈 Goal analytics reveal hours shipped, topics covered, and deadlines remaining.</li>
                    <li>🧠 Focus analytics show a rolling focus score, distraction breakdowns, and weekly trends.</li>
                    <li>🎬 Motivation vault serves curated videos when the grind gets heavy.</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-3xl border bg-foreground/5 p-6 text-center text-sm text-muted" style={{ borderColor: "rgb(var(--border))" }}>
                “Yes, DeepWork AI is strict. But greatness demands discipline—valuing attention enough to protect it.”
              </div>
            </section>
          </div>
        );

      case "try":
      default:
        return (
          <div className="space-y-12 md:space-y-16">
            <section className="text-center">
              <div
                className="mx-auto w-full space-y-5 rounded-3xl border bg-gradient-to-r from-indigo-100/60 via-white to-purple-100/60 p-8 shadow-sm backdrop-blur-sm md:p-10 lg:max-w-4xl"
                style={{ borderColor: "rgb(var(--border))" }}
              >
                <h2 className="text-2xl font-semibold text-indigo-800 md:text-3xl">
                  Ready to run your next deep work sprint?
                </h2>
                <p className="text-muted">
                  Treat your focus like a craft. DeepWork AI is the operating system to plan, execute, and review
                  sessions that actually move the needle.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link
                    href="https://deep-work-ai-nu.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Try DeepWork AI →
                  </Link>

                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-center text-3xl font-semibold text-indigo-700 md:text-4xl">
                How DeepWork AI keeps you shipping
              </h3>
              <div className="grid gap-5 md:grid-cols-3">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.title}
                    className="group relative overflow-hidden rounded-3xl border p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                    style={{
                      borderColor: "rgb(var(--border))",
                      background: "rgb(var(--card) / 0.82)",
                    }}
                  >
                    <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-indigo-200/30 blur-3xl transition group-hover:scale-125" />
                    <div className="relative flex flex-col items-center space-y-3 text-center">
                      <span className="text-4xl md:text-5xl" aria-hidden>
                        {benefit.icon}
                      </span>
                      <h4 className="text-xl font-semibold">{benefit.title}</h4>
                      <p className="text-sm text-muted md:text-base">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section
              className="flex flex-col gap-8 rounded-3xl border p-8 shadow-sm backdrop-blur-sm md:flex-row md:items-center md:p-10"
              style={{
                borderColor: "rgb(var(--border))",
                background: "rgb(var(--card) / 0.78)",
              }}
            >
              <div className="md:w-1/2">
                <div className="relative inline-flex transform transition hover:-translate-y-1 hover:rotate-1">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-400/40 to-purple-400/40 blur-lg" />
                  <div
                    className="relative overflow-hidden rounded-2xl border bg-card"
                    style={{ borderColor: "rgb(var(--border))" }}
                  >
                    <Image
                      src="/white2.jpg"
                      width={520}
                      height={520}
                      alt="Nafis Aslam, founder of DeepWork AI"
                      className="h-full w-full object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 space-y-4">
                <h3 className="text-2xl font-semibold md:text-3xl">
                  Why I built it — Nafis’s story
                </h3>
                <p className="text-muted">
                  In 2023 I was studying at Universiti Sains Malaysia, juggling labs, presentations, and client
                  work. My GPA sat at 3.11 and I felt permanently underwater. DeepWork AI began as a personal
                  system inspired by Cal Newport’s <em>Deep Work</em>.
                </p>
                <p className="text-muted">
                  Within a year the stack helped me climb to a 3.65 GPA. Now I’m making the same focus engine
                  available to students, builders, and creators who need to ship despite chaos.
                </p>
              </div>
            </section>
          </div>
        );
    }
  };

  return (
    <article className="mx-auto w-full space-y-12 px-4 py-10 md:space-y-16 md:px-6 md:py-14 lg:max-w-none">
      <VenturesTabs
        items={ventureItems}
        initialSlug="deepwork-ai"
        showDetailCard={false}
      />
      <header className="mx-auto w-full space-y-4 text-center lg:max-w-5xl">
        <span
          className="inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted"
          style={{ borderColor: "rgb(var(--fg) / 0.15)", background: "rgb(var(--fg) / 0.05)" }}
        >
          Focus OS • Product & case study
        </span>
        <h1 className="text-4xl font-semibold md:text-5xl">
          DeepWork AI
        </h1>
        <p className="text-muted md:text-lg">
          Intelligent coaching system that keeps your attention laser-sharp. Watch the technical deep dive, see the real-world
          story, or jump straight into a sprint—everything lives here.
        </p>
      </header>

      <nav
        role="tablist"
        aria-label="DeepWork AI sections"
        className="relative mx-auto flex max-w-4xl flex-wrap justify-center gap-3 rounded-[2.5rem] border border-indigo-200/50 bg-white/70 p-3 shadow-xl backdrop-blur-lg transition dark:border-white/10 dark:bg-white/[0.06]"
      >
        <span className="pointer-events-none absolute -left-16 top-2 h-28 w-28 rounded-full bg-indigo-300/40 blur-3xl dark:bg-indigo-500/25" />
        <span className="pointer-events-none absolute -right-14 bottom-2 h-24 w-24 rounded-full bg-purple-400/40 blur-3xl dark:bg-purple-600/25" />

        <div className="relative flex w-full flex-wrap justify-center gap-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative overflow-hidden rounded-3xl px-4 py-3 text-left transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${
                  isActive
                    ? "text-white shadow-lg shadow-indigo-500/40"
                    : "text-slate-600 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-200"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="deepwork-tab-highlight"
                    className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                {!isActive && (
                  <span className="absolute inset-0 -z-10 rounded-3xl border border-indigo-100/60 bg-white/70 transition duration-300 group-hover:border-indigo-300 group-hover:bg-white dark:border-white/10 dark:bg-white/[0.05] dark:group-hover:border-indigo-300/40" />
                )}
                <span className="flex min-w-[190px] items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl border text-base transition duration-300 ${
                      isActive
                        ? "border-white/60 bg-white/15 text-white"
                        : "border-indigo-200/60 bg-white/70 text-indigo-600 shadow-sm group-hover:border-indigo-300 dark:border-white/15 dark:bg-white/[0.08] dark:text-indigo-200"
                    }`}
                  >
                    <Icon />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold md:text-base">{tab.label}</span>
                    {tab.subtitle && (
                      <span
                        className={`text-[11px] uppercase tracking-[0.22em] ${
                          isActive ? "text-white/80" : "text-muted"
                        }`}
                      >
                        {tab.subtitle}
                      </span>
                    )}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="space-y-12 md:space-y-16">
        {renderTabContent()}
      </div>
    </article>
  );
}
