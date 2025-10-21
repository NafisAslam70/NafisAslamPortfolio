'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import VenturesTabs from "@/components/VenturesTabs";
import venturesJson from "@/content/ventures.json";

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.21, 1, 0.35, 1] },
  },
};

const stats = [
  {
    label: "Families served",
    value: "320+ households",
    detail: "Wardha, Pulgaon, and neighbouring districts",
  },
  {
    label: "Annual revenue",
    value: "₹7.8M",
    detail: "Scaled from ₹1M in three academic cycles",
  },
  {
    label: "Retention rate",
    value: "82%",
    detail: "Students returning each year post-turnaround",
  },
  {
    label: "Teacher NPS",
    value: "26",
    detail: "Against a national benchmark of 41",
  },
];

const resourceCards = [
  {
    title: "My Journey",
    description:
      "Full story of how Meed grew from a neighbourhood experiment in Sahibganj into a systems-first school.",
    href: "/pdfs/meed-my-journey.pdf",
    featured: true,
  },
  {
    title: "Vision & Mission",
    description:
      "The beliefs, goals, and operating guardrails that steer every decision at Meed.",
    href: "/pdfs/meed-vision-mission.pdf",
  },
  {
    title: "Guidelines & Playbooks",
    description:
      "Daily rituals, culture playbooks, and stakeholder charters that keep execution sharp.",
    href: "/pdfs/meed-guidelines.pdf",
  },
];

const ventureItems = Array.isArray(venturesJson)
  ? venturesJson
  : venturesJson?.items || [];

export default function MeedPublicSchool() {
  return (
    <article className="max-w-5xl mx-auto px-4 py-10 space-y-10 md:space-y-16">
      <VenturesTabs
        items={ventureItems}
        initialSlug="meed-public-school"
        showDetailCard={false}
      />

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={sectionVariants}
        className="rounded-3xl border bg-[rgba(var(--fg)_/_0.045)] p-7 md:p-9"
        style={{ borderColor: "rgb(var(--border))" }}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="space-y-3 md:w-2/3">
            <span
              className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted"
              style={{ borderColor: "rgba(var(--fg) / 0.15)", background: "rgba(var(--fg) / 0.04)" }}
            >
              Spotlight
            </span>
            <h2 className="text-2xl md:text-3xl font-semibold">My Journey</h2>
            <div className="space-y-3 text-muted text-sm md:text-base">
              <p>
                From a teenager volunteering at a neighbourhood school to leading a systems-first institution
                in Sahibganj—this deck captures the full story, the doubts, the breakthroughs, and the people
                who made Meed real.
              </p>
              <p>
                If you want the unfiltered play-by-play, including early experiments, failures, and the turnaround
                blueprint, start here. This clip features our English faculty reflecting on the journey.
              </p>
            </div>
          </div>
          <div className="md:w-1/3">
            <Link
              href="/pdfs/meed-my-journey.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full justify-center py-3 text-base"
            >
              View My Journey PDF
            </Link>
          </div>
        </div>
        <div
          className="mt-4 flex flex-wrap items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-wide text-muted"
          style={{ borderColor: "rgba(var(--fg) / 0.18)", background: "rgba(var(--fg) / 0.05)" }}
        >
          <span className="font-semibold text-[color:rgb(var(--primary))]">FYI</span>
          <span>Records and metrics shown span 2012–2022; I now study in Malaysia while the team runs daily ops.</span>
        </div>
      </motion.section>

      <motion.header
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={sectionVariants}
        className="relative overflow-hidden rounded-3xl border bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_55%)] p-8 md:p-12"
        style={{ borderColor: "rgb(var(--border))" }}
      >
        <div className="space-y-6 max-w-3xl">
          <span
            className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted"
            style={{
              borderColor: "rgba(var(--fg) / 0.12)",
              background: "rgba(var(--fg) / 0.04)",
            }}
          >
            Venture Case Study
          </span>
          <h1 className="text-3xl md:text-5xl font-semibold leading-snug">
            Meed Public School: an outcomes-first school for first-generation learners.
          </h1>
          <p className="text-base md:text-lg text-muted max-w-prose">
            We took a sleepy, under-enrolled school in the Sahibganj belt of Jharkhand and turned it
            into a thriving ecosystem for 300+ families. This is the operating system, playbooks,
            and culture that made it stick.
          </p>
          <div
            className="mt-6 overflow-hidden rounded-3xl border"
            style={{ borderColor: "rgb(var(--border))" }}
          >
            <div className="relative w-full pt-[56.25%]">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/iXarFnrGw3k?si=cEyUj0RCl5ssyUQM"
                title="Meed English Faculty sharing the journey"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>

          <dl className="grid gap-4 text-sm md:grid-cols-3">
            <div
              className="space-y-1 rounded-2xl border p-4 backdrop-blur-sm"
              style={{
                borderColor: "rgb(var(--border))",
                background: "rgba(var(--card) / 0.7)",
              }}
            >
              <dt className="muted uppercase tracking-wide">Role</dt>
              <dd className="font-medium">Co-founder · School Director</dd>
            </div>
            <div
              className="space-y-1 rounded-2xl border p-4 backdrop-blur-sm"
              style={{
                borderColor: "rgb(var(--border))",
                background: "rgba(var(--card) / 0.7)",
              }}
            >
              <dt className="muted uppercase tracking-wide">Location</dt>
              <dd className="font-medium leading-snug">
                Shrikund, Gumani<br />
                Sahibganj, Jharkhand 816101
              </dd>
            </div>
            <div
              className="space-y-1 rounded-2xl border p-4 backdrop-blur-sm"
              style={{
                borderColor: "rgb(var(--border))",
                background: "rgba(var(--card) / 0.7)",
              }}
            >
              <dt className="muted uppercase tracking-wide">Timeline</dt>
              <dd className="font-medium">2012 → Present</dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="mailto:managingshaikhzifan@gmail.com" className="btn btn-primary">
              Book a walkthrough
            </Link>
            <Link href="tel:+916377000000" className="btn">
              Speak with the team
            </Link>
          </div>
        </div>
      </motion.header>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="space-y-6"
      >
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Impact snapshot (2012–2022)</h2>
          <p className="text-sm text-muted max-w-2xl">
            Core numbers across Sahibganj, and neighbouring districts while I was on the ground.
            The leadership team continues to build on this base today.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border p-6 backdrop-blur-sm"
              style={{
                borderColor: "rgb(var(--border))",
                background: "rgba(var(--card) / 0.78)",
              }}
            >
              <div className="text-sm uppercase tracking-wide text-muted">
                {stat.label}
              </div>
              <div className="text-2xl md:text-3xl font-semibold mt-2">
                {stat.value}
              </div>
              <p className="mt-2 text-sm text-muted">{stat.detail}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={sectionVariants}
        className="rounded-3xl border bg-[rgba(var(--fg)_/_0.04)] p-6 md:p-8"
        style={{ borderColor: "rgb(var(--border))" }}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-sm font-semibold uppercase tracking-wide" style={{ borderColor: "rgba(var(--fg) / 0.18)" }}>
            FYI
          </div>
          <div className="space-y-3 text-sm text-muted md:text-base">
            <strong className="text-xs uppercase tracking-wide text-muted">
              Snapshot window
            </strong>
            <p>
              All figures, testimonials, and operational records highlighted on this page reflect the
              period from 2012 through the 2022 academic session. After 2022 I moved to Malaysia to
              continue my studies, while the on-ground leadership team keeps the Meed systems running.
            </p>
            <p>
              For updates after 2022, use the contact buttons above and we’ll connect you with the
              current leadership for the latest metrics.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="space-y-6"
      >
        <h2 className="text-2xl font-semibold">Deep dives</h2>
        <p className="text-muted max-w-2xl">
          Download the full decks to see the journey, the operating philosophy, and the ground rules
          that power Meed Public School. Each PDF opens in a new tab for easy viewing and sharing.
        </p>
        <div className="grid gap-5 md:grid-cols-3">
          {resourceCards.map((card) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="card flex h-full flex-col space-y-4"
            >
              <div>
                {card.featured && (
                  <span
                    className="inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted"
                    style={{
                      borderColor: "rgba(var(--fg) / 0.15)",
                      background: "rgba(var(--fg) / 0.04)",
                    }}
                  >
                    Spotlight
                  </span>
                )}
                <h3 className="text-xl font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm text-muted">{card.description}</p>
              </div>
              <div className="pt-2">
                <Link
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full justify-center"
                >
                  View PDF
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>
    </article>
  );
}
