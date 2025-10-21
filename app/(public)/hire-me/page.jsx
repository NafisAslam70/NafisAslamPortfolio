"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  FaArrowRight,
  FaBolt,
  FaCalendarAlt,
  FaChartBar,
  FaCode,
  FaEnvelope,
  FaExternalLinkAlt,
  FaFileAlt,
  FaFlask,
  FaGraduationCap,
  FaHome,
  FaLink,
  FaMedal,
  FaRocket,
  FaShapes,
  FaUsers,
  FaChalkboardTeacher,
  FaMagic,
} from "react-icons/fa";

const SURFACE =
  "rounded-3xl border border-indigo-200/60 bg-white/75 backdrop-blur-md shadow-[0_10px_30px_-12px_rgba(2,6,23,0.18)] dark:bg-white/[0.06] dark:border-white/10";
const SECTION_CONTAINER = "container mx-auto max-w-screen-2xl px-4 sm:px-6 md:px-10";
const HERO_ROLES = ["AI product engineer", "data systems strategist", "focus OS architect", "edtech operator"];
const RESUME_URL = "/pdfs/myResume.pdf";

const NAV_SECTIONS = [
  { id: "overview", label: "Overview", icon: FaHome },
  { id: "offerings", label: "Services", icon: FaRocket },
  { id: "builds", label: "Ventures & Products", icon: FaShapes },
  { id: "proof", label: "Why Hire Me", icon: FaMedal },
  { id: "resume", label: "Resume", icon: FaFileAlt },
  { id: "contact", label: "Start A Project", icon: FaEnvelope },
];

const PRODUCT_ACCENTS = {
  indigo: {
    ring: "border-indigo-200/70 hover:border-indigo-300",
    icon: "text-indigo-600 dark:text-indigo-300",
    glow: "from-indigo-400 via-purple-400 to-pink-400",
    bubble: "bg-indigo-500/20",
  },
  violet: {
    ring: "border-violet-200/70 hover:border-violet-300",
    icon: "text-violet-600 dark:text-violet-300",
    glow: "from-violet-400 via-indigo-400 to-purple-500",
    bubble: "bg-violet-500/20",
  },
  sky: {
    ring: "border-sky-200/70 hover:border-sky-300",
    icon: "text-sky-600 dark:text-sky-300",
    glow: "from-sky-400 via-cyan-400 to-sky-500",
    bubble: "bg-sky-500/25",
  },
  rose: {
    ring: "border-rose-200/70 hover:border-rose-300",
    icon: "text-rose-600 dark:text-rose-300",
    glow: "from-rose-400 via-pink-400 to-rose-500",
    bubble: "bg-rose-500/20",
  },
  amber: {
    ring: "border-amber-200/70 hover:border-amber-300",
    icon: "text-amber-600 dark:text-amber-300",
    glow: "from-amber-400 via-orange-400 to-amber-500",
    bubble: "bg-amber-500/20",
  },
  emerald: {
    ring: "border-emerald-200/70 hover:border-emerald-300",
    icon: "text-emerald-600 dark:text-emerald-300",
    glow: "from-emerald-400 via-teal-400 to-emerald-500",
    bubble: "bg-emerald-500/20",
  },
};

const SERVICE_ROLES = [
  {
    title: "AI & Web Developer",
    highlight: ["Product engineering", "Agentic UX", "Launch & handoff"],
    icon: FaCode,
    accent: "indigo",
  },
  {
    title: "AI Research + Model Building",
    highlight: ["Experiment design", "Model training & eval", "Guardrails & QA"],
    icon: FaFlask,
    accent: "violet",
  },
  {
    title: "Data Science & Analysis",
    highlight: ["Signal pipelines", "Exploratory insights", "Story-driven metrics"],
    icon: FaChartBar,
    accent: "sky",
  },
];

const CARD_HOVER_FLOAT = {
  y: -6,
  rotate: 0.25,
  scale: 1.01,
  transition: { type: "spring", stiffness: 260, damping: 20 },
};

const CARD_TAP_PRESS = { scale: 0.995, rotate: 0 };

function scrollToSection(id) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function useSectionObserver(ids, onActive) {
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const SCROLL_OFFSET = 130;
    let ticking = false;
    let lastActive = ids[0];

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(() => {
          ticking = false;
          const reachedBottom =
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;

          let current = lastActive;
          let closestId = lastActive;
          let closestDistance = Number.POSITIVE_INFINITY;

          for (const id of ids) {
            const el = document.getElementById(id);
            if (!el) continue;
            const rect = el.getBoundingClientRect();
            const pointerTop = SCROLL_OFFSET;
            const within =
              rect.top <= pointerTop && rect.bottom >= pointerTop;
            if (within) {
              current = id;
              closestDistance = 0;
              break;
            }

            const distance = Math.min(
              Math.abs(rect.top - pointerTop),
              Math.abs(rect.bottom - pointerTop),
            );
            if (distance < closestDistance) {
              closestDistance = distance;
              closestId = id;
            }
          }

          if (reachedBottom) {
            current = ids[ids.length - 1];
          } else if (closestDistance !== 0 && closestId !== lastActive) {
            current = closestId;
          }

          if (current !== lastActive) {
            lastActive = current;
            onActive(current);
          }
        });
      }
    };

    const handleResize = () => {
      ticking = false;
      handleScroll();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [ids, onActive]);
}

function LeftRailNav({ sections, active }) {
  return (
    <nav className="pointer-events-none fixed left-4 top-28 z-30 hidden lg:block">
      <div className="pointer-events-auto relative w-[210px] overflow-hidden rounded-[1.9rem] border border-indigo-200/50 bg-white/80 shadow-xl backdrop-blur dark:border-white/10 dark:bg-white/[0.05]">
        <div className="absolute -top-10 left-10 h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/20" />
        <div className="absolute -bottom-16 right-6 h-32 w-32 rounded-full bg-purple-400/20 blur-[110px] dark:bg-purple-500/20" />
        <div className="relative max-h-[calc(100vh-7rem)] overflow-y-auto p-4">
          <ul className="flex flex-col gap-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = section.id === active;
              return (
                <li key={section.id} className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="hire-nav-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-y-1 left-0 right-1 rounded-2xl bg-gradient-to-r from-indigo-500/95 via-violet-500/90 to-pink-500/90 shadow-[0_18px_38px_-22px_rgba(79,70,229,0.8)]"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => scrollToSection(section.id)}
                    className={`relative flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "text-white"
                        : "text-slate-600 hover:bg-indigo-50/60 dark:text-slate-200 dark:hover:bg-white/10"
                    }`}
                  >
                    <span className={`text-base ${isActive ? "text-white" : "text-indigo-500 dark:text-indigo-300"}`}>
                      <Icon />
                    </span>
                    {section.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}

function MobileTabs({ sections, active }) {
  return (
    <div className="sticky top-[72px] z-20 border-y border-indigo-200/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-950/80 lg:hidden">
      <div className="flex gap-2 overflow-x-auto px-3 py-3 scrollbar-none sm:px-4">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = active === section.id;
          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-medium transition ${
                isActive
                  ? "border-indigo-500 bg-indigo-500 text-white"
                  : "border-indigo-100/60 bg-white/70 text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200"
              }`}
            >
              <Icon className="h-4 w-4" />
              {section.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function QuickStat({ icon: Icon, label, value, hint }) {
  return (
    <motion.div className={`${SURFACE} h-full p-4 sm:p-5`} whileHover={CARD_HOVER_FLOAT} whileTap={CARD_TAP_PRESS}>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
          <Icon />
        </span>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
          <div className="text-xl font-semibold text-slate-900 dark:text-slate-100">{value}</div>
        </div>
      </div>
      {hint && <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
    </motion.div>
  );
}

function BuildLinkCard({ title, link, badge, highlight }) {
  const wrapperProps = link.external
    ? { href: link.href, target: "_blank", rel: "noreferrer" }
    : { href: link.href };

  const content = (
    <motion.div
      className={`${SURFACE} relative flex flex-col gap-4 overflow-hidden p-4 transition sm:flex-row sm:items-center sm:justify-between ${
        highlight ? "border-indigo-300/70 ring-2 ring-indigo-200/80 shadow-[0_18px_35px_-20px_rgba(79,70,229,0.45)]" : ""
      }`}
      whileHover={CARD_HOVER_FLOAT}
      whileTap={CARD_TAP_PRESS}
    >
      <div className="relative z-10 flex flex-col">
        <span className="text-sm font-semibold text-slate-900 dark:text-white">{title}</span>
        {badge && (
          <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-indigo-500">
            <FaMagic className="h-3 w-3" />
            {badge}
          </span>
        )}
      </div>
      <span className="relative z-10 inline-flex items-center gap-2 self-start text-xs font-semibold text-indigo-600 transition group-hover:text-indigo-500 dark:text-indigo-300 sm:self-auto">
        {link.label ?? "Open"}
        <FaArrowRight className="h-3 w-3" />
      </span>
      {highlight && (
        <span className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-gradient-to-r from-indigo-200/25 via-transparent to-purple-200/25 opacity-0 transition group-hover:opacity-100" />
      )}
    </motion.div>
  );

  if (link.external) {
    return (
      <a {...wrapperProps} className="group block">
        {content}
      </a>
    );
  }

  return (
    <Link {...wrapperProps} className="group block">
      {content}
    </Link>
  );
}

function ProofCard({ title, summary, actions, icon: Icon }) {
  return (
    <motion.div className={`${SURFACE} h-full p-5 sm:p-6`} whileHover={CARD_HOVER_FLOAT} whileTap={CARD_TAP_PRESS}>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
          <Icon className="h-5 w-5" />
        </span>
        <div className="text-lg font-semibold text-slate-900 dark:text-white">{title}</div>
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            target={action.external ? "_blank" : undefined}
            rel={action.external ? "noreferrer" : undefined}
            className={`btn w-full justify-center ${action.variant === "primary" ? "btn-primary" : ""} sm:w-auto`}
          >
            {action.label}
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

export default function HireMe() {
  const [activeSection, setActiveSection] = useState(NAV_SECTIONS[0].id);
  const [status, setStatus] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [typedRole, setTypedRole] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const sectionIds = useMemo(() => NAV_SECTIONS.map((section) => section.id), []);
  useSectionObserver(sectionIds, setActiveSection);
  const longestRole = useMemo(
    () => HERO_ROLES.reduce((longest, role) => (role.length > longest.length ? role : longest), HERO_ROLES[0]),
    [],
  );
  const displayRole = typedRole || HERO_ROLES[roleIndex];

  useEffect(() => {
    const current = HERO_ROLES[roleIndex];
    if (!current) return;
    const isComplete = typedRole === current;
    const delay = isDeleting ? 70 : isComplete ? 1400 : 120;

    const timeout = setTimeout(() => {
      if (isDeleting) {
        if (typedRole.length === 0) {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % HERO_ROLES.length);
        } else {
          setTypedRole((prev) => prev.slice(0, -1));
        }
      } else if (typedRole.length < current.length) {
        setTypedRole(current.slice(0, typedRole.length + 1));
      } else {
        setIsDeleting(true);
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [isDeleting, roleIndex, typedRole]);

  const quickStats = [
    {
      label: "Academic base",
      value: "MIT DSML + USM AI",
      hint: "Formal training in data, statistics, and machine learning.",
      icon: FaGraduationCap,
    },
    {
      label: "Products live",
      value: "DeepWork AI",
      hint: "Shipping calendar, accountability, and agent tools in production.",
      icon: FaRocket,
    },
    {
      label: "Operator reps",
      value: "Founder, Meed",
      hint: "Built a public school and learning systems for first-gen students.",
      icon: FaChalkboardTeacher,
    },
    {
      label: "Delivery rhythm",
      value: "Weekly check-ins",
      hint: "Scope, decisions, and shipped features on a fixed cadence.",
      icon: FaCalendarAlt,
    },
  ];

  const ventures = [
    { title: "DeepWork AI", link: { href: "/ventures/deepwork-ai", label: "Visit" } },
    { title: "Meed Public School", link: { href: "/ventures/meed-public-school", label: "Visit" } },
  ];

  const products = [
    {
      title: "Meedian AI Flow",
      badge: "New",
      highlight: true,
      link: { href: "https://meedian-ai-flow-v2.vercel.app/", label: "Launch", external: true },
    },
    { title: "DeepWork AI App", link: { href: "https://deep-work-ai-nu.vercel.app/", label: "Launch", external: true } },
    {
      title: "Deep Calendar",
      link: { href: "https://deep-calendar.vercel.app/auth/signin?next=%2F", label: "Launch", external: true },
    },
  ];

  const reasons = [
    {
      title: "MIT + USM Foundations",
      summary: "MIT DSML MicroMasters plus USM AI major—data, models, and research-grade rigor baked in.",
      actions: [{ href: RESUME_URL, label: "Review credentials", variant: "primary" }],
      icon: FaGraduationCap,
    },
    {
      title: "Disciplined Operator",
      summary: "Scopes, plans, and ships with weekly check-ins and clear decisions until we cross the finish line.",
      actions: [{ href: "/nbs", label: "See my rituals" }],
      icon: FaBolt,
    },
    {
      title: "Products In Market",
      summary: "DeepWork AI, Deep Calendar, and Meed Public School are operating today with active users.",
      actions: [
        { href: "/ventures", label: "Tour the products" },
        { href: "/reels", label: "Watch build logs" },
      ],
      icon: FaRocket,
    },
    {
      title: "Community Leadership",
      summary: "Founder of Meed—building first-gen talent pipelines and mentoring operators in the open.",
      actions: [
        { href: "/pdfs/meed-my-journey.pdf", label: "Read the mission", external: true },
        { href: "https://www.linkedin.com/in/nafis-aslam/", label: "Connect on LinkedIn", external: true },
      ],
      icon: FaUsers,
    },
  ];

  return (
    <div className="relative min-h-screen">
      <LeftRailNav sections={NAV_SECTIONS} active={activeSection} />
      <MobileTabs sections={NAV_SECTIONS} active={activeSection} />
      <main className="lg:ml-[240px]">
        <section id="overview" className="scroll-mt-32 py-16">
          <div className={SECTION_CONTAINER}>
            <div className={`${SURFACE} relative overflow-hidden px-7 py-10 md:px-12 md:py-14`}>
              <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-indigo-400/20 blur-[120px] dark:bg-indigo-500/20" />
              <div className="absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-purple-400/20 blur-[140px] dark:bg-purple-500/20" />
              <div className="relative z-10 grid gap-10 lg:grid-cols-[1.2fr,0.8fr]">
                <div>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl"
                  >
                    Ship your next build with a{" "}
                    <span className="relative inline-flex">
                      <span className="invisible select-none" aria-hidden="true">
                        {longestRole}
                      </span>
                      <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500">
                        {displayRole}
                      </span>
                    </span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mt-4 text-base text-slate-600 dark:text-slate-300"
                  >
                    I scope, build, and ship AI products on deadline. You hand me the brief, we agree on the weekly plan,
                    and you get working software without extra noise. MIT DSML MicroMasters + USM AI major keeps the work
                    grounded in research, while live ventures prove the delivery.
                  </motion.p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="btn btn-primary w-full justify-center sm:w-auto" onClick={() => scrollToSection("contact")}>
                      Start a project
                      <FaArrowRight className="ml-2 h-4 w-4" />
                    </button>
                    <Link href="/nbs" className="btn w-full justify-center sm:w-auto">
                      Explore NBS
                    </Link>
                    <Link href="/reels" className="btn w-full justify-center sm:w-auto">
                      Watch reels
                    </Link>
                  </div>
                  <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-indigo-200/70 bg-white/60 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.06]">
                    <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500 sm:text-[11px] sm:tracking-[0.3em]">
                      <FaMagic className="h-4 w-4" />
                      MeedianAI Flow — Take your team toward mastery
                    </h3>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Meedian AI Flow</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          One browser experience for tasks, collaboration rooms, deep rituals, chat, attendance, and meeting notes.
                        </p>
                      </div>
                      <Link
                        href="https://meedian-ai-flow-v2.vercel.app/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-indigo-300/70 bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600 transition hover:bg-indigo-100 dark:border-indigo-400/60 dark:bg-indigo-500/10 dark:text-indigo-200 sm:w-auto sm:justify-between sm:tracking-[0.25em]"
                      >
                        Launch app
                        <FaArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {quickStats.map((stat) => (
                    <QuickStat key={stat.label} {...stat} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="offerings" className="scroll-mt-32 py-16">
          <div className={`${SECTION_CONTAINER} space-y-8`}>
            <div className="flex flex-col items-start gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Services I Offer</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Choose the lane you need: ship a product, validate a model, or pull clean signal from your data.
                </p>
              </div>
              <Link
                href="#contact"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 sm:w-auto"
              >
                Discuss a project <FaExternalLinkAlt className="text-[11px]" />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {SERVICE_ROLES.map((service, idx) => {
                const accent = PRODUCT_ACCENTS[service.accent ?? "indigo"];
                const Icon = service.icon || FaBolt;
                return (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: idx * 0.08 }}
                    viewport={{ once: true }}
                    whileHover={CARD_HOVER_FLOAT}
                    whileTap={CARD_TAP_PRESS}
                    className={`${SURFACE} relative overflow-hidden p-5 transition hover:shadow-lg`}
                  >
                    {accent?.bubble && (
                      <div className={`pointer-events-none absolute -right-14 -bottom-12 h-24 w-24 rounded-full blur-[70px] ${accent.bubble}`} />
                    )}
                    <div className="relative flex items-start gap-3">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-2xl border text-base ${
                          accent?.ring ?? "border-indigo-200/70 hover:border-indigo-300"
                        }`}
                      >
                        <Icon className={accent?.icon ?? "text-indigo-600 dark:text-indigo-300"} />
                      </span>
                      <div className="space-y-1">
                        <span
                          className={`text-[10px] uppercase tracking-[0.28em] ${
                            accent?.icon ?? "text-indigo-600 dark:text-indigo-300"
                          }`}
                        >
                          Core Role
                        </span>
                        <h3
                          className={`text-xl font-semibold leading-tight text-transparent bg-clip-text bg-gradient-to-r ${
                            accent?.glow ?? "from-indigo-500 via-purple-500 to-pink-500"
                          }`}
                        >
                          {service.title}
                        </h3>
                        {Array.isArray(service.highlight) && service.highlight.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {service.highlight.map((point) => (
                              <span
                                key={point}
                                className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200 ${
                                  accent?.ring ?? "border-indigo-200/70 hover:border-indigo-300"
                                } ${accent?.bubble ?? "bg-indigo-500/15"}`}
                              >
                                {point}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="builds" className="scroll-mt-32 py-16">
          <div className={`${SECTION_CONTAINER} space-y-8`}>
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Ventures & Products</span>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">The systems I run and ship</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                These are live builds you can click into today. They show the shipping pace, rituals, and outcomes I run.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Ventures</h3>
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">Live</span>
                </div>
                <div className="grid gap-3">
                  {ventures.map((item) => (
                    <BuildLinkCard key={`venture-${item.title}`} {...item} />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Products</h3>
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">In Market</span>
                </div>
                <div className="grid gap-3">
                  {products.map((item) => (
                    <BuildLinkCard key={`product-${item.title}`} {...item} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="proof" className="scroll-mt-32 py-16">
          <div className={`${SECTION_CONTAINER} space-y-8`}>
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Why Hire Me</span>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Signals operators ask for first</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Evaluate me fast with the four things teams check: training, delivery rhythm, shipped products, and people leadership.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {reasons.map((reason) => (
                <ProofCard key={reason.title} {...reason} />
              ))}
            </div>
            <div className={`${SURFACE} overflow-hidden`}>
              <div className="grid gap-3 p-4 sm:p-6 md:grid-cols-2">
                <Image
                  src="https://github-readme-stats.vercel.app/api?username=NafisAslam70&show_icons=true&hide_border=true"
                  alt="GitHub Stats"
                  width={600}
                  height={320}
                  className="w-full rounded-2xl border border-white/10 bg-white/70 p-3 dark:bg-white/[0.03]"
                  loading="lazy"
                  unoptimized
                />
                <Image
                  src="https://github-readme-stats.vercel.app/api/top-langs/?username=NafisAslam70&layout=compact&hide_border=true"
                  alt="Top Languages"
                  width={600}
                  height={320}
                  className="w-full rounded-2xl border border-white/10 bg-white/70 p-3 dark:bg-white/[0.03]"
                  loading="lazy"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </section>
        <section id="resume" className="scroll-mt-32 pb-8 pt-4">
          <div className={SECTION_CONTAINER}>
            <div className={`${SURFACE} space-y-6 p-6 sm:p-8 md:p-12`}>
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Download</span>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Resume</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Download the latest deck covering roles, shipped products, and the operating cadence I bring to teams.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href={RESUME_URL} className="btn btn-primary" download>
                  Download resume
                  <FaArrowRight className="ml-2 h-4 w-4" />
                </a>
                <a href={RESUME_URL} className="btn" target="_blank" rel="noreferrer">
                  View in browser
                </a>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Updated {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short" })}. Need a tailored cut? Let me know in your note.
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-32 pb-20 pt-10">
          <div className={SECTION_CONTAINER}>
            <div className={`${SURFACE} p-6 sm:p-8 md:p-12`}>
              <div className="max-w-2xl space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Start a project</span>
                <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Tell me what you need built</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Share the outcome, constraints, and timeline. I’ll send back the plan and first steps.
                </p>
              </div>
              <form
                className="mt-6 grid gap-4 md:max-w-xl"
                onSubmit={async (event) => {
                  event.preventDefault();
                  setStatus("Sending…");
                  try {
                    const body = Object.fromEntries(new FormData(event.currentTarget));
                    const res = await fetch("/api/hire", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(body),
                    });
                    const ok = res.ok;
                    setStatus(ok ? "Thanks! I’ll reply shortly." : "Something went wrong.");
                    if (ok) event.currentTarget.reset();
                  } catch {
                    setStatus("Network error.");
                  }
                }}
              >
                <input name="name" placeholder="Your name" className="btn w-full" required />
                <input name="email" type="email" placeholder="Email" className="btn w-full" required />
                <input name="role" placeholder="Role / Company" className="btn w-full" />
                <textarea name="message" placeholder="What outcome are you chasing?" className="btn w-full h-36" required />
                <button className="btn btn-primary w-full justify-center sm:w-auto">
                  Send inquiry
                  <FaArrowRight className="ml-2 h-4 w-4" />
                </button>
                {status && <p className="text-sm text-slate-500 dark:text-slate-300">{status}</p>}
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
