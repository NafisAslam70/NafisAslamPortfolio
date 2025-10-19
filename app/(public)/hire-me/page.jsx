"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaBolt,
  FaBookOpen,
  FaCalendarAlt,
  FaChartLine,
  FaDownload,
  FaEnvelope,
  FaFileAlt,
  FaGithub,
  FaHome,
  FaLinkedin,
  FaPenFancy,
  FaPlayCircle,
  FaRocket,
  FaShapes,
} from "react-icons/fa";

const SURFACE =
  "rounded-3xl border border-indigo-200/60 bg-white/75 backdrop-blur-md shadow-[0_10px_30px_-12px_rgba(2,6,23,0.18)] dark:bg-white/[0.06] dark:border-white/10";
const SECTION_CONTAINER = "container mx-auto max-w-screen-2xl px-6 md:px-10";
const HERO_ROLES = ["systems architect", "AI developer", "focus OS designer", "content operator"];
const RESUME_URL = "/pdfs/myResume.pdf";

const NAV_SECTIONS = [
  { id: "overview", label: "Overview", icon: FaHome },
  { id: "offerings", label: "What I Ship", icon: FaRocket },
  { id: "systems", label: "Execution Systems", icon: FaShapes },
  { id: "proof", label: "Proof & Signals", icon: FaChartLine },
  { id: "resume", label: "Resume", icon: FaFileAlt },
  { id: "contact", label: "Start A Project", icon: FaEnvelope },
];

function scrollToSection(id) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function useSectionObserver(ids, onActive) {
  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (inView[0]?.target?.id) onActive(inView[0].target.id);
      },
      { rootMargin: "-55% 0px -35% 0px", threshold: [0.15, 0.4, 0.7] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids, onActive]);
}

function LeftRailNav({ sections, active }) {
  return (
    <nav className="pointer-events-none fixed left-4 top-28 z-30 hidden lg:block">
      <div className="pointer-events-auto relative w-[210px] overflow-hidden rounded-[1.9rem] border border-indigo-200/50 bg-white/80 p-4 shadow-xl backdrop-blur dark:border-white/10 dark:bg-white/[0.05]">
        <div className="absolute -top-10 left-10 h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/20" />
        <div className="absolute -bottom-16 right-6 h-32 w-32 rounded-full bg-purple-400/20 blur-[110px] dark:bg-purple-500/20" />
        <ul className="relative flex flex-col gap-2">
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

function ServiceCard({ title, blurb, points }) {
  return (
    <div className={`${SURFACE} h-full p-6`}>
      <div className="text-lg font-semibold text-slate-900 dark:text-white">{title}</div>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{blurb}</p>
      <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SystemCard({ eyebrow, title, description, link, icon: Icon }) {
  return (
    <motion.div whileHover={{ y: -4 }} className={`${SURFACE} h-full p-6 transition`}>
      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-indigo-500">
        <Icon className="h-4 w-4" />
        {eyebrow}
      </div>
      <div className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{title}</div>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
      <Link
        href={link.href}
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-300"
        target={link.external ? "_blank" : undefined}
        rel={link.external ? "noreferrer" : undefined}
      >
        {link.label}
        <FaArrowRight className="h-3 w-3" />
      </Link>
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
      label: "Focus systems shipped",
      value: "DeepWork AI",
      hint: "Operator-grade OS for accountability pods.",
      icon: FaBolt,
    },
    {
      label: "Ventures live",
      value: "4 products",
      hint: "Deep Calendar, Meed School, Meedian AI Flow.",
      icon: FaRocket,
    },
    {
      label: "Content velocity",
      value: "150+ reels",
      hint: "Structured storytelling sprints & repurposing loops.",
      icon: FaPlayCircle,
    },
    {
      label: "Shipping cadence",
      value: "Weekly releases",
      hint: "NBS rituals keep execution focused & traceable.",
      icon: FaCalendarAlt,
    },
  ];

  const services = [
    {
      title: "Brand & Web Systems",
      blurb: "Narrative, positioning, and conversion-driven experiences built in Next.js + AI copilots.",
      points: ["Strategic positioning & messaging", "Design + build + analytics", "Conversion loops & SEO hygiene"],
    },
    {
      title: "Content & Distribution",
      blurb: "Short-form reels, long-form writing, and distribution dashboards without chaos.",
      points: ["Topic map & storytelling spine", "Repurposing + scheduling workflows", "Analytics feedback loops"],
    },
    {
      title: "Learning Products & EdTech",
      blurb: "Cohorts and self-paced systems engineered for progress and retention.",
      points: ["Curriculum & assessments", "Recording + delivery stacks", "Onboarding, payments, community"],
    },
  ];

  const systems = [
    {
      eyebrow: "Focus OS",
      title: "DeepWork AI",
      description: "Accountability rooms, nudges, and reflection funnels to keep your team in deep work mode.",
      link: { href: "/ventures/deepwork-ai", label: "Tour the build →" },
      icon: FaBolt,
    },
    {
      eyebrow: "Execution Rituals",
      title: "Nafis Builder Society",
      description: "The operating cadence I run with founders—weekly synthesis, scorecards, and idea lab notes.",
      link: { href: "/nbs", label: "See the system →" },
      icon: FaPenFancy,
    },
    {
      eyebrow: "Content Engine",
      title: "Reels Lab",
      description: "Pipeline that takes raw ideas to finished reels + blogs with measurable velocity.",
      link: { href: "/reels", label: "Watch samples →" },
      icon: FaPlayCircle,
    },
  ];

  const proofSignals = [
    {
      title: "GitHub Signals",
      summary: "Active repos across AI, data viz, and full-stack experimentation. Shipping happens in public.",
      actions: [
        { href: "https://github.com/NafisAslam70", label: "View GitHub", external: true, variant: "primary" },
      ],
      icon: FaGithub,
    },
    {
      title: "Ventures & Case Studies",
      summary: "Systems-first builds for education, focus, and productivity. Each venture doubles as a live lab.",
      actions: [
        { href: "/ventures", label: "Explore ventures" },
        { href: "/pdfs/meed-my-journey.pdf", label: "Read Meed vision", external: true },
      ],
      icon: FaRocket,
    },
    {
      title: "Writing & Thinking",
      summary: "Weekly essays, maps, and research notes capturing how I reason about shipping useful software.",
      actions: [
        { href: "/blog", label: "Browse articles" },
        { href: "/now", label: "Current focus" },
      ],
      icon: FaBookOpen,
    },
    {
      title: "Social Proof",
      summary: "Progress logs, behind-the-scenes clips, and operator updates across LinkedIn and the network.",
      actions: [
        { href: "https://www.linkedin.com/in/nafis-aslam/", label: "LinkedIn", external: true },
        { href: "https://wa.me/601156000000", label: "WhatsApp", external: true },
      ],
      icon: FaLinkedin,
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
                    Ship with a{" "}
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
                    I help founders and teams focus—shipping products, content, and learning systems that compound.
                    Everything runs on{" "}
                    <Link href="/nbs" className="link font-semibold">
                      NBS rituals
                    </Link>{" "}
                    so we can see signal, make decisions fast, and build momentum with calm execution.
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
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-indigo-500">What I Ship</span>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Operator-grade execution services</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Embed me alongside your team or drop me into a sprint. Expect clarity, speed, and docs that survive handover.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.title} {...service} />
              ))}
            </div>
          </div>
        </section>

        <section id="systems" className="scroll-mt-32 py-16">
          <div className={`${SECTION_CONTAINER} space-y-8`}>
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Execution Systems</span>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Proven loops you can plug into tomorrow</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Use my operating systems as-is or let’s adapt them to your stack. Each system is live, measurable, and
                already compounding inside ventures.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {systems.map((system) => (
                <SystemCard key={system.title} {...system} />
              ))}
            </div>
          </div>
        </section>

        <section id="proof" className="scroll-mt-32 py-16">
          <div className={`${SECTION_CONTAINER} space-y-8`}>
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Proof & Signals</span>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">What partners look at before we start</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Browse the public artifacts if you want to see how I think, build, and run teams. Everything stays transparent.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {proofSignals.map((signal) => (
                <ProofCard key={signal.title} {...signal} />
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
