"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaBolt,
  FaCalendarAlt,
  FaChartBar,
  FaCode,
  FaDownload,
  FaEnvelope,
  FaExternalLinkAlt,
  FaFileAlt,
  FaFlask,
  FaGraduationCap,
  FaHome,
  FaLink,
  FaMedal,
  FaPenFancy,
  FaRocket,
  FaShapes,
  FaUsers,
  FaChalkboardTeacher,
} from "react-icons/fa";

const SURFACE =
  "rounded-3xl border border-indigo-200/60 bg-white/75 backdrop-blur-md shadow-[0_10px_30px_-12px_rgba(2,6,23,0.18)] dark:bg-white/[0.06] dark:border-white/10";
const SECTION_CONTAINER = "container mx-auto max-w-screen-2xl px-6 md:px-10";
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

const BUILD_TABS = [
  { id: "ventures", label: "Ventures" },
  { id: "products", label: "Products" },
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

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(() => {
          ticking = false;
          const pointer = SCROLL_OFFSET;
          const reachedBottom =
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;

          let current = ids[0];
          for (const id of ids) {
            const el = document.getElementById(id);
            if (!el) continue;
            const { top, bottom } = el.getBoundingClientRect();
            const abovePointer = top - pointer <= 0;
            const pointerInside = abovePointer && bottom - pointer > 0;
            if (pointerInside) {
              current = id;
              break;
            }
            if (abovePointer) {
              current = id;
              continue;
            }
            break;
          }

          if (reachedBottom) {
            current = ids[ids.length - 1];
          }

          onActive(current);
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
      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none">
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
    <div className={`${SURFACE} h-full p-5`}>
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
    </div>
  );
}

function ProductCard({ eyebrow, title, description, link, icon: Icon }) {
  return (
    <motion.div whileHover={{ y: -4 }} className={`${SURFACE} h-full p-6 transition`}>
      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-indigo-500">
        <Icon className="h-4 w-4" />
        {eyebrow}
      </div>
      <div className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{title}</div>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
      {link.external ? (
        <a
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-300"
        >
          {link.label}
          <FaArrowRight className="h-3 w-3" />
        </a>
      ) : (
        <Link
          href={link.href}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-300"
        >
          {link.label}
          <FaArrowRight className="h-3 w-3" />
        </Link>
      )}
    </motion.div>
  );
}

function ProofCard({ title, summary, actions, icon: Icon }) {
  return (
    <div className={`${SURFACE} h-full p-6`}>
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
            className={`btn ${action.variant === "primary" ? "btn-primary" : ""}`}
          >
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function HireMe() {
  const [activeSection, setActiveSection] = useState(NAV_SECTIONS[0].id);
  const [status, setStatus] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [typedRole, setTypedRole] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeBuildTab, setActiveBuildTab] = useState(BUILD_TABS[0].id);

  const sectionIds = useMemo(() => NAV_SECTIONS.map((section) => section.id), []);
  useSectionObserver(sectionIds, setActiveSection);

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
      label: "Academic rigor",
      value: "MIT MicroMasters",
      hint: "Data, Statistics & Machine Learning (CINEC) + USM AI major graduate.",
      icon: FaGraduationCap,
    },
    {
      label: "Products operating",
      value: "DeepWork AI suite",
      hint: "Deep Calendar, accountability pods, and AI prompts live with users.",
      icon: FaRocket,
    },
    {
      label: "Education leadership",
      value: "Founder, Meed",
      hint: "Built Meed Public School & learning systems for first-gen students.",
      icon: FaChalkboardTeacher,
    },
    {
      label: "Delivery rhythm",
      value: "Deadline locked",
      hint: "Disciplined, hardworking, skilled—weekly reports until the job ships.",
      icon: FaCalendarAlt,
    },
  ];

  const ventures = [
    {
      eyebrow: "Venture",
      title: "DeepWork AI",
      description: "Focus OS that powers accountability pods, deep work sprints, and operator dashboards.",
      link: { href: "/ventures/deepwork-ai", label: "Explore venture →" },
      icon: FaBolt,
    },
    {
      eyebrow: "Venture",
      title: "Meed Public School",
      description: "Outcomes-first school for first-gen students with AI-augmented mentorship and rituals.",
      link: { href: "/ventures/meed-public-school", label: "View case study →" },
      icon: FaChalkboardTeacher,
    },
    {
      eyebrow: "Community",
      title: "Nafis Builder Society",
      description: "Invite-only operator community running weekly deep work scorecards and synthesis labs.",
      link: { href: "/nbs", label: "See NBS rituals →" },
      icon: FaPenFancy,
    },
  ];

  const products = [
    {
      eyebrow: "Product",
      title: "DeepWork AI App",
      description: "Production build with sprint rooms, nudges, and reflections for builders who want flow.",
      link: { href: "https://deep-work-ai-nu.vercel.app/", label: "Launch app →", external: true },
      icon: FaBolt,
    },
    {
      eyebrow: "Product",
      title: "Deep Calendar",
      description: "Depth block planner with shutdown scorecards and weekly alignment rituals baked in.",
      link: { href: "https://deep-calendar.vercel.app/auth/signin?next=%2F", label: "Open planner →", external: true },
      icon: FaCalendarAlt,
    },
    {
      eyebrow: "Product",
      title: "Meedian AI Flow",
      description: "LLM copilots that turn chaotic backlogs into structured execution for students and teams.",
      link: { href: "https://meedian-ai-flow-v2.vercel.app/", label: "Start flow →", external: true },
      icon: FaLink,
    },
  ];

  const reasons = [
    {
      title: "MIT + USM Foundations",
      summary:
        "MIT Data, Statistics & Machine Learning MicroMasters (CINEC) plus USM AI major gives you research-backed execution.",
      actions: [{ href: RESUME_URL, label: "Review credentials", variant: "primary" }],
      icon: FaGraduationCap,
    },
    {
      title: "Disciplined Operator",
      summary: "I scope, timeline, and ship. Weekly reports, clear decisions, no missed deadlines.",
      actions: [{ href: "/nbs", label: "See my rituals" }],
      icon: FaBolt,
    },
    {
      title: "Products In Market",
      summary: "DeepWork AI, Deep Calendar, and Meed Public School run live with users across focus and education.",
      actions: [
        { href: "/ventures", label: "Tour the products" },
        { href: "/reels", label: "Watch build logs" },
      ],
      icon: FaRocket,
    },
    {
      title: "Community Leadership",
      summary: "Founder & principal at Meed—building pathways for first-gen students and mentoring young operators.",
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
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500">
                      {typedRole || HERO_ROLES[0]}
                    </span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mt-4 text-base text-slate-600 dark:text-slate-300"
                  >
                    MIT Data, Statistics & Machine Learning MicroMasters (CINEC) grad and USM AI major. Disciplined,
                    hardworking, and obsessed with delivering on time. You hand me the brief, we lock the deadline, and
                    you get shippable software, content, or curriculum without noise. Everything runs on{" "}
                    <Link href="/nbs" className="link font-semibold">
                      NBS rituals
                    </Link>{" "}
                    so we can see signal, make decisions fast, and build compounding execution.
                  </motion.p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="btn btn-primary" onClick={() => scrollToSection("contact")}>
                      Start a project
                      <FaArrowRight className="ml-2 h-4 w-4" />
                    </button>
                    <Link href="/nbs" className="btn">
                      Explore NBS
                    </Link>
                    <Link href="/reels" className="btn">
                      Watch reels
                    </Link>
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
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Services I Offer</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Build with me—custom AI systems, full-stack execution, and data intelligence stitched end-to-end.
                </p>
              </div>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
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
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Ventures & Products</span>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">The systems I run and ship</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Toggle between live ventures and product builds. Everything is maintained, documented, and ready to
                  adapt to your team.
                </p>
              </div>
              <div className="inline-flex items-center rounded-full border border-indigo-200/60 bg-white/80 p-1 text-sm font-semibold shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.06]">
                {BUILD_TABS.map((tab) => {
                  const isActive = tab.id === activeBuildTab;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveBuildTab(tab.id)}
                      className={`relative rounded-full px-4 py-2 transition ${
                        isActive
                          ? "text-white"
                          : "text-slate-600 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-200"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="build-tab-pill"
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_12px_30px_-16px_rgba(79,70,229,0.7)]"
                        />
                      )}
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <motion.div
              key={activeBuildTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="grid gap-4 md:grid-cols-3"
            >
              {(activeBuildTab === "ventures" ? ventures : products).map((item) => (
                <ProductCard key={`${activeBuildTab}-${item.title}`} {...item} />
              ))}
            </motion.div>
          </div>
        </section>

        <section id="proof" className="scroll-mt-32 py-16">
          <div className={`${SECTION_CONTAINER} space-y-8`}>
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Why Hire Me</span>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Signals operators ask for first</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                If you’re evaluating me for a build, here’s the shortlist—credentials, delivery history, operating
                systems, and the communities I steward.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {reasons.map((reason) => (
                <ProofCard key={reason.title} {...reason} />
              ))}
            </div>
            <div className={`${SURFACE} overflow-hidden`}>
              <div className="grid gap-3 p-6 md:grid-cols-2">
                <img
                  src="https://github-readme-stats.vercel.app/api?username=NafisAslam70&show_icons=true&hide_border=true"
                  alt="GitHub Stats"
                  className="w-full rounded-2xl border border-white/10 bg-white/70 p-3 dark:bg-white/[0.03]"
                  loading="lazy"
                />
                <img
                  src="https://github-readme-stats.vercel.app/api/top-langs/?username=NafisAslam70&layout=compact&hide_border=true"
                  alt="Top Languages"
                  className="w-full rounded-2xl border border-white/10 bg-white/70 p-3 dark:bg-white/[0.03]"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
        <section id="resume" className="scroll-mt-32 pb-8 pt-4">
          <div className={SECTION_CONTAINER}>
            <div className={`${SURFACE} grid gap-8 p-8 md:grid-cols-[1fr,0.75fr] md:p-12`}>
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Download</span>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Resume / Capabilities Deck</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  If you need my resume, it’s right here—current roles, venture outcomes, and the NBS operating cadence in one deck.
                </p>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <FaFileAlt className="mt-0.5 h-4 w-4 text-indigo-500" />
                    <span>Project snapshots across DeepWork AI, Deep Calendar, Meed Public School.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaPenFancy className="mt-0.5 h-4 w-4 text-indigo-500" />
                    <span>NBS rituals, sprint formats, and core systems I embed with teams.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaDownload className="mt-0.5 h-4 w-4 text-indigo-500" />
                    <span>PDF formatted for investors, partners, and procurement workflows.</span>
                  </li>
                </ul>
                <div className="flex flex-wrap gap-3">
                  <a href={RESUME_URL} className="btn btn-primary" download>
                    Download resume
                    <FaArrowRight className="ml-2 h-4 w-4" />
                  </a>
                  <a href={RESUME_URL} className="btn" target="_blank" rel="noreferrer">
                    View in browser
                  </a>
                </div>
              </div>
              <div className={`${SURFACE} flex flex-col justify-between gap-4 rounded-3xl border border-indigo-200/60 bg-white/60 p-6 text-sm dark:border-white/10 dark:bg-white/[0.04]`}>
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Snapshot</div>
                  <p className="text-slate-600 dark:text-slate-300">
                    Last updated {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short" })}. Want a tailored or newer version? Mention it when you reach out and I’ll send the latest.
                  </p>
                </div>
                <div className="rounded-2xl border border-dashed border-indigo-200/70 p-5 text-slate-600 dark:border-white/10 dark:text-slate-200">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Missing the file?</p>
                  <p className="mt-2 text-sm">
                    Swap the PDF at <code className="rounded bg-slate-900/5 px-2 py-1 dark:bg-white/10">public/pdfs/myResume.pdf</code> or update <code className="rounded bg-slate-900/5 px-2 py-1 dark:bg-white/10">RESUME_URL</code>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-32 pb-20 pt-10">
          <div className={SECTION_CONTAINER}>
            <div className={`${SURFACE} p-8 md:p-12`}>
              <div className="max-w-2xl space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Start a project</span>
                <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Tell me what you need built</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Share the outcome you want and any context around your team. I’ll reply with a snapshot of how we can run it.
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
                <button className="btn btn-primary">
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
