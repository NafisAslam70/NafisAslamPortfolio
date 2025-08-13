"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import {
  Rocket, Sparkles, ArrowRight, BookOpenText, Layout, Blocks,
  Github, Linkedin, PlayCircle, PenSquare, GraduationCap, Mail
} from "lucide-react";

/* ================= helpers ================= */
function scrollToSection(id, offsetPx = 112) {
  const el = document.getElementById(id);
  if (!el) return;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const offset = isMobile ? 96 : offsetPx;
  const y = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: y, behavior: "smooth" });
}

/* ================= 3D hero ================= */
function Knot() {
  return (
    <Float speed={1.1} rotationIntensity={0.6} floatIntensity={0.9}>
      <mesh rotation={[0.4, 0.2, 0]}>
        <torusKnotGeometry args={[1.1, 0.35, 220, 32]} />
        <meshStandardMaterial color={"#7c83ff"} metalness={0.25} roughness={0.25} />
      </mesh>
    </Float>
  );
}
function ThreeBG() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 3, 3]} intensity={1.0} />
        <Knot />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </div>
  );
}

/* ============ scroll spy for tabs ============ */
function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const mid = window.innerHeight / 2;
        let best = null, bestDist = Infinity;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const r = e.target.getBoundingClientRect();
          const dist = Math.abs((r.top + r.height / 2) - mid);
          if (dist < bestDist) { bestDist = dist; best = e; }
        }
        if (best?.target?.id) setActive(best.target.id);
      },
      { threshold: [0.15, 0.3, 0.6], rootMargin: "-20% 0px -50% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

/* ============== top horizontal tabs ============== */
function TopTabs({ sections }) {
  const ids = useMemo(() => sections.map((s) => s.id), [sections]);
  const active = useScrollSpy(ids);
  const barRef = useRef(null);

  useEffect(() => {
    const i = sections.findIndex((s) => s.id === active);
    const el = barRef.current?.querySelector(`[data-tab="${sections[i]?.id}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active, sections]);

  return (
    <div className="sticky top-16 z-30 backdrop-blur">
      <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)]">
        <div
          ref={barRef}
          className="flex gap-2 overflow-x-auto px-3 py-2 scrollbar-none"
          style={{ scrollSnapType: "x proximity" }}
        >
          {sections.map((s) => {
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                data-tab={s.id}
                onClick={() => scrollToSection(s.id, 112)}
                className={`shrink-0 rounded-xl px-3 py-2 text-sm flex items-center gap-2 transition border
                  ${isActive
                    ? "border-[color:var(--ring)] bg-[color:var(--card-2)]"
                    : "border-transparent hover:bg-[color:var(--card-2)]"
                  }`}
                style={{ scrollSnapAlign: "center" }}
                title={s.title}
              >
                <span className={`h-4 w-4 ${isActive ? "opacity-100" : "opacity-70"}`}>{s.icon}</span>
                <span className={isActive ? "font-semibold" : ""}>{s.title}</span>
              </button>
            );
          })}
        </div>
        <div className="h-px w-full bg-[color:var(--border)]" />
      </div>
    </div>
  );
}

/* ================= UI atoms (consistent cards) ================= */
function InfoCard({ icon, title, desc, points = [] }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="h-full rounded-2xl border p-4 border-[color:var(--border)] bg-[color:var(--card)]"
    >
      <div className="flex items-center gap-2 text-lg font-semibold">{icon} {title}</div>
      {desc && <p className="muted text-sm mt-1">{desc}</p>}
      {points.length > 0 && (
        <ul className="mt-2 text-sm list-disc pl-5">
          {points.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      )}
    </motion.div>
  );
}
function BentoCard({ href, title, subtitle, icon, external = false }) {
  const Cmp = external ? "a" : Link;
  const props = external ? { href, target: "_blank", rel: "noreferrer" } : { href };
  return (
    <motion.div whileHover={{ y: -3 }} className="h-full">
      <Cmp
        {...props}
        className="group block h-full rounded-2xl border p-4 transition hover:opacity-90 border-[color:var(--border)] bg-[color:var(--card)]"
      >
        <div className="flex items-center gap-2 text-sm muted">
          {icon} <span>{external ? "External" : "Internal"}</span>
        </div>
        <div className="mt-1 text-lg font-semibold flex items-center gap-2">
          {title} <ArrowRight className="h-4 w-4 opacity-60 group-hover:translate-x-0.5 transition" />
        </div>
        <p className="muted text-sm mt-1">{subtitle}</p>
      </Cmp>
    </motion.div>
  );
}
function StatCard({ src, alt }) {
  return (
    <div className="h-full rounded-2xl border p-3 border-[color:var(--border)] bg-[color:var(--card)]">
      <img className="w-full rounded-lg" src={src} alt={alt} loading="lazy" />
    </div>
  );
}

/* ================= page ================= */
const GITHUB_USER = "NafisAslam70";

export default function HireMe() {
  const [status, setStatus] = useState("");

  const sections = [
    { id: "hero", title: "Why Hire Me", icon: <Sparkles /> },
    { id: "services", title: "My Services", icon: <Layout /> },
    { id: "bento", title: "Bento", icon: <Blocks /> },
    { id: "github", title: "GitHub", icon: <Github /> },
    { id: "contact", title: "Contact", icon: <Mail /> },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 md:px-6 space-y-8">
      {/* sticky top tabs */}
      <TopTabs sections={sections} />

      {/* HERO */}
      <section id="hero" className="scroll-mt-28 relative overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)]">
        <ThreeBG />
        <div className="relative z-10 p-6 md:p-10">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-2xl">
              <motion.h1 initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .5 }}
                className="text-3xl md:text-4xl font-bold flex items-center gap-2">
                <Sparkles className="h-7 w-7 text-[rgb(var(--primary))]" />
                Hire Me
              </motion.h1>
              <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: .1 } }} className="muted mt-2">
                <span className="font-semibold">The single reason you must hire me:</span>{" "}
                I bring clarity and execution through <Link href="/nbs" className="link font-semibold">NBS</Link> — a practical,
                no-nonsense system to ship fast, maintain quality, and focus on what truly moves the needle.
              </motion.p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/nbs" className="btn"><Blocks className="mr-2 h-4 w-4" /> Learn NBS</Link>
                <Link href="/reels" className="btn"><PlayCircle className="mr-2 h-4 w-4" /> Watch Reels</Link>
                <button className="btn btn-primary" onClick={() => scrollToSection("contact", 112)}>
                  Start a Project <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
            <Link href="/nbs" className="btn hidden sm:inline">NBS Overview →</Link>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="scroll-mt-28 card-solid">
        <h2 className="text-xl font-semibold mb-3">My Services</h2>
        {/* equal heights across cards */}
        <div className="grid gap-3 md:grid-cols-3 [grid-auto-rows:1fr]">
          <InfoCard
            icon={<Layout className="h-5 w-5" />}
            title="Brand & Website"
            desc="Personal brand systems, landers, high-converting sites."
            points={["Positioning & messaging","Design + Next.js build","Analytics & SEO basics"]}
          />
          <InfoCard
            icon={<PenSquare className="h-5 w-5" />}
            title="Content Systems"
            desc="Reels/blog pipelines that publish consistently without chaos."
            points={["Topic map & calendar","Repurposing workflows","Dashboard & metrics"]}
          />
          <InfoCard
            icon={<GraduationCap className="h-5 w-5" />}
            title="EdTech & Courses"
            desc="Course structure, curriculum, minimal LMS that scale."
            points={["Curriculum & sections","Recording + delivery","Onboarding & payments"]}
          />
        </div>
      </section>

      {/* BENTO */}
      <section id="bento" className="scroll-mt-28 card">
        <h2 className="text-xl font-semibold mb-3">Bento</h2>
        {/* equal heights across bento tiles */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 [grid-auto-rows:1fr]">
          <BentoCard href="/nbs" icon={<Blocks className="h-5 w-5" />} title="NBS" subtitle="Ship fast, keep quality high." />
          <BentoCard href="/reels" icon={<PlayCircle className="h-5 w-5" />} title="Reels" subtitle="Shorts & micro-lessons." />
          <BentoCard href="/blog" icon={<BookOpenText className="h-5 w-5" />} title="Blog" subtitle="Notes, essays, ideas." />
          <BentoCard href="/courses" icon={<GraduationCap className="h-5 w-5" />} title="Courses" subtitle="Bilingual skills (soon)" />
          <BentoCard external href={`https://github.com/${GITHUB_USER}`} icon={<Github className="h-5 w-5" />} title="GitHub" subtitle="Projects & code" />
          <BentoCard external href="https://www.linkedin.com/in/nafis-aslam/" icon={<Linkedin className="h-5 w-5" />} title="LinkedIn" subtitle="Experience & updates" />
          <BentoCard href="/hire-me" icon={<Rocket className="h-5 w-5" />} title="Consult" subtitle="Strategy + execution" />
        </div>
      </section>

      {/* GITHUB (stats images for speed; consistent tiles) */}
      <section id="github" className="scroll-mt-28 card-solid">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">GitHub Dashboard</h2>
            <p className="muted text-sm">Live activity & recent languages.</p>
          </div>
          <a href={`https://github.com/${GITHUB_USER}`} target="_blank" className="btn">
            <Github className="mr-2 h-4 w-4" /> View Profile
          </a>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 [grid-auto-rows:1fr]">
          <StatCard src={`https://github-readme-stats.vercel.app/api?username=${GITHUB_USER}&show_icons=true&hide_border=true`} alt="GitHub Stats" />
          <StatCard src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${GITHUB_USER}&layout=compact&hide_border=true`} alt="Top Languages" />
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="scroll-mt-38 card-solid max-w-l">
        <h2 className="text-xl font-semibold mb-3 flex items-center"><Mail className="mr-2 h-5 w-5" /> Tell me briefly what you need</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setStatus("Sending…");
            try {
              const body = Object.fromEntries(new FormData(e.currentTarget));
              const res = await fetch("/api/hire", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
              const ok = res.ok;
              setStatus(ok ? "Thanks! I’ll get back to you." : "Something went wrong.");
              if (ok) e.currentTarget.reset();
            } catch {
              setStatus("Network error.");
            }
          }}
          className="space-y-3"
        >
          <input name="name" placeholder="Your name" className="btn w-full" required />
          <input name="email" type="email" placeholder="Email" className="btn w-full" required />
          <input name="role" placeholder="Role / Company" className="btn w-full" />
          <textarea name="message" placeholder="What do you need?" className="btn w-full h-32" required />
          <button className="btn btn-primary">Send <ArrowRight className="ml-2 h-4 w-4" /></button>
          {status && <p className="muted text-sm">{status}</p>}
        </form>
      </section>
    </div>
  );
}
