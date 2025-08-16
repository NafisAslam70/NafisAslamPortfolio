'use client';

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useMDXComponent } from "next-contentlayer/hooks";
import { useEffect, useMemo, useState } from "react";
import { FaGithub, FaCalendarAlt, FaBriefcase } from "react-icons/fa";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

/* ============ DeepCalendar public API ============ */
const DC_ORIGIN = "http://localhost:3001"; // ← change if hosted elsewhere
const DC_TOKEN  = "18e42020c705668bbfd96cabe813ba61d229abe75dea2d7d";

function dcUrl(path) {
  const base = DC_ORIGIN.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}/api/public/${DC_TOKEN}${p}`;
}
async function getJsonAbs(url) {
  try {
    const r = await fetch(url, { mode: "cors", cache: "no-store" });
    if (!r.ok) throw new Error(String(r.status));
    return await r.json();
  } catch {
    return null;
  }
}

/* ============ utils ============ */
function formatDate(d) {
  try {
    const dt = typeof d === "string" ? new Date(d) : d;
    return dt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch { return d ?? ""; }
}
const sectionVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
const cardVariants    = { hover: { scale: 1.02, transition: { duration: 0.3 } } };
function fromMinutes(m) { const H = String(Math.floor(m/60)).padStart(2,"0"); const M = String(m%60).padStart(2,"0"); return `${H}:${M}`; }
function depthBadge(d) {
  if (d === 3) return { text: "L3", border: "#6366f1", bg: "#6366f11a" };
  if (d === 2) return { text: "L2", border: "#0ea5e9", bg: "#0ea5e91a" };
  return { text: "L1", border: "#f59e0b", bg: "#f59e0b1a" };
}
function humanMinutes(mins) {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

/* ============ “View My Day” modal ============ */
function RoutineModal({ open, onClose, items, window, goalById }) {
  if (!open) return null;
  const now = new Date(); const nowMin = now.getHours() * 60 + now.getMinutes();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <div className="font-semibold">Today’s Routine — {formatDate(new Date())}</div>
          <button className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50" onClick={onClose}>Close</button>
        </div>
        <div className="max-h-[70vh] overflow-auto p-4">
          <div className="mb-3 text-sm text-gray-600">
            {window ? <>Window: <b>{fromMinutes(window.openMin)}–{fromMinutes(window.closeMin)}</b></> : "Window: —"}
          </div>

          {Array.isArray(items) && items.length ? (
            <ul className="space-y-2">
              {items.map((it, idx) => {
                const active = it.startMin <= nowMin && nowMin < it.endMin;
                const badge = depthBadge(it.depthLevel);
                const durMin = Math.max(1, (it.endMin - it.startMin));
                const goalLabel = it.goalId && goalById[it.goalId]?.label ? goalById[it.goalId].label : null;

                return (
                  <li
                    key={it.id ?? idx}
                    className={`rounded-lg border p-3 ${active ? "ring-2 ring-emerald-500" : ""}`}
                    style={{ background: badge.bg, borderColor: badge.border }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">
                        {fromMinutes(it.startMin)}–{fromMinutes(it.endMin)} • {it.label || "Block"}
                      </div>
                      <div className="ml-2 shrink-0 text-xs text-gray-700">{badge.text}</div>
                    </div>
                    <div className="mt-1 grid gap-1 text-xs text-gray-700 sm:grid-cols-3">
                      <div><span className="text-gray-500">Duration:</span> {humanMinutes(durMin)}</div>
                      <div><span className="text-gray-500">Depth:</span> {badge.text}</div>
                      <div className="truncate">
                        <span className="text-gray-500">Goal:</span> {goalLabel || (it.goalId ? `#${it.goalId}` : "—")}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-sm text-gray-600">No blocks scheduled for today.</div>
          )}

          {/* promo */}
          <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-700">
            Powered by <span className="font-medium">DeepCalendar</span>.{" "}
            <a className="text-indigo-600 underline" href={DC_ORIGIN} target="_blank" rel="noreferrer">
              Explore DeepCalendar →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ “View Stats” modal ============ */
function StatsModal({ open, onClose, goals, stats7d, summary30d }) {
  if (!open) return null;
  const total7h  = ((stats7d?.totalSec ?? stats7d?.totals?.totalSec ?? stats7d?.total_seconds ?? 0) / 3600).toFixed(1);
  const total30h = ((summary30d?.totalSec ?? summary30d?.totals?.totalSec ?? summary30d?.total_seconds ?? 0) / 3600).toFixed(1);

  const byGoal = (() => {
    const raw = summary30d?.goals || summary30d?.byGoal || [];
    if (Array.isArray(raw) && raw.length) {
      return raw
        .map(g => ({ id: g.id ?? g.goalId, label: g.label ?? g.name ?? `Goal#${g.id ?? g.goalId}`, hours: ((g.totalSec ?? g.seconds ?? 0) / 3600) }))
        .sort((a, b) => b.hours - a.hours);
    }
    return (goals || []).map(g => ({ id: g.id, label: g.label, hours: 0 }));
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <div className="font-semibold">Your Focus Stats</div>
          <button className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50" onClick={onClose}>Close</button>
        </div>
        <div className="max-h-[70vh] overflow-auto p-4 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-3">
              <div className="text-xs text-gray-500">Total Focus (7 days)</div>
              <div className="mt-1 text-lg font-semibold">{total7h} hrs</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-gray-500">Total Focus (30 days)</div>
              <div className="mt-1 text-lg font-semibold">{total30h} hrs</div>
            </div>
          </div>

          <div className="rounded-lg border p-3">
            <div className="mb-2 text-xs font-semibold text-gray-600">Goals (last 30 days)</div>
            {byGoal.length ? (
              <ul className="space-y-1 text-sm">
                {byGoal.map((g) => (
                  <li key={g.id} className="flex justify-between">
                    <span className="truncate">{g.label}</span>
                    <span className="ml-2 shrink-0 text-gray-600">{g.hours.toFixed(1)}h</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-gray-600">No goals yet.</div>
            )}
          </div>

          {/* promo */}
          <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-700">
            Powered by <span className="font-medium">DeepCalendar</span>.{" "}
            <a className="text-indigo-600 underline" href={DC_ORIGIN} target="_blank" rel="noreferrer">
              Explore DeepCalendar →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ main component ============ */
export default function ClientDashboard({ posts, now, reels, ventures }) {
  const NowBody = now ? useMDXComponent(now.body.code) : null;

  const yourName = "Nafis Aslam";
  const yourProfession = "Computer Science Graduate (AI Specialization, Management Minor)";
  const yourRoles = "Data Scientist, AI Builder, Founder of DeepWork AI";
  const subscriberCount = "180+";
  const yourBio =
    `Aspiring Data Scientist with a strong academic background in Computer Science (specialization in AI, minor in Management from Universiti Sains Malaysia). ` +
    `Recognized with a gold honor in Mathematics. Honed skills through MITx MicroMasters in Data Science, Coding Ninjas, GeeksforGeeks, and more. ` +
    `Passionate about AI, EdTech, productivity, Machine Learning, NLP, and Deep Learning. Building real-world tools like DeepWork AI, MeedFinance, and 30-ML-Projects. “Success is a war between discipline and distraction.” — Nafis Aslam 💥`;

  /* ---- DeepCalendar public data ---- */
  const [dcLoading, setDcLoading] = useState(true);
  const [todayItems, setTodayItems] = useState([]);
  const [todayWindow, setTodayWindow] = useState(null);
  const [goals, setGoals] = useState([]);
  const [stats7d, setStats7d] = useState(null);
  const [summary30d, setSummary30d] = useState(null);

  const [modalDayOpen, setModalDayOpen] = useState(false);
  const [modalStatsOpen, setModalStatsOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setDcLoading(true);
      const weekday = new Date().getDay(); // 0..6

      const [routineRes, goalsRes, statsRes, sumRes] = await Promise.all([
        getJsonAbs(dcUrl(`/routine?weekday=${weekday}`)),
        getJsonAbs(dcUrl(`/goals`)),
        getJsonAbs(dcUrl(`/stats?range=7d`)),
        getJsonAbs(dcUrl(`/summary?range=30d`)),
      ]);

      if (routineRes) {
        const items = Array.isArray(routineRes.items) ? routineRes.items : [];
        setTodayItems(items.sort((a, b) => a.startMin - b.startMin));
        setTodayWindow(routineRes.window ?? null);
      }
      if (goalsRes) setGoals(Array.isArray(goalsRes) ? goalsRes : goalsRes.goals ?? []);
      if (statsRes) setStats7d(statsRes);
      if (sumRes) setSummary30d(sumRes);

      setDcLoading(false);
    })();
  }, []);

  const nowMin = (() => { const n = new Date(); return n.getHours() * 60 + n.getMinutes(); })();
  const activeBlock = useMemo(() => todayItems.find(b => b.startMin <= nowMin && nowMin < b.endMin) || null, [todayItems, nowMin]);

  const goalById = useMemo(() => {
    const map = {};
    (goals || []).forEach(g => { map[g.id] = g; });
    return map;
  }, [goals]);

  return (
    <div className="space-y-12 md:space-y-16 relative">
      {/* Starry background */}
      <Canvas style={{ position: "absolute", inset: 0, zIndex: -1 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>

      {/* Hero */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}
        className="text-center space-y-4 md:space-y-6 relative z-10"
      >
        <div className="relative mx-auto h-24 w-24 md:h-32 md:w-32">
          <Image
            src="./images/white2.jpg"
            alt="Nafis Aslam"
            fill
            className="rounded-full object-cover shadow-md"
            priority
            unoptimized
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Hey Friends 👋</h1>
        <p className="mx-auto max-w-2xl text-lg md:text-xl text-gray-600">
          I’m {yourName}. I’m a {yourProfession} turned {yourRoles}.
        </p>
      </motion.section>

      {/* Current Work / Journal */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}
        className="relative z-10 rounded-2xl border p-5 shadow-sm"
      >
        <h2 className="mb-4 text-xl md:text-2xl font-semibold">My Current Work / Journal</h2>
        {now ? (
          <div className="prose mb-6 max-w-none">
            <div className="mb-2 text-xs text-gray-500">Updated: {formatDate(now.updated)}</div>
            {/* <h3 className="text-lg font-semibold">{now.title}</h3>
            <NowBody /> */}
          </div>
        ) : (
          <p className="mb-6 text-gray-600">No current update yet.</p>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* GitHub */}
          <motion.div
            variants={cardVariants} whileHover="hover"
            className="rounded-2xl border p-4 shadow-md transition hover:shadow-lg md:p-6"
          >
            <div className="mb-4 flex items-center gap-2">
              <FaGithub className="text-2xl text-indigo-600" />
              <h3 className="text-lg font-semibold">GitHub (My Daily Grind)</h3>
            </div>
            <div className="space-y-4">
              <h4 className="text-base font-medium">GitHub Streak</h4>
              <Image
                src="https://github-readme-streak-stats.herokuapp.com/?user=NafisAslam70&theme=transparent"
                alt="GitHub Streak"
                width={400}
                height={200}
                className="w-full rounded-lg shadow-sm"
                unoptimized
              />
            </div>
            <Link
              href="https://github.com/NafisAslam70"
              className="mt-4 block w-full rounded-lg border px-4 py-2 text-center text-sm hover:bg-gray-50"
              target="_blank" rel="noopener noreferrer"
            >
              Visit GitHub
            </Link>
          </motion.div>

          {/* DeepCalendar — minimal card */}
          <motion.div
            variants={cardVariants} whileHover="hover"
            className="space-y-3 rounded-2xl border p-4 shadow-md transition hover:shadow-lg"
          >
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-xl text-indigo-600" />
              <h3 className="text-base font-semibold">My Calendar (DeepCalendar)</h3>
            </div>

            {/* Right now ONLY */}
            <div className="rounded-lg border p-3 text-sm">
              <div className="mb-1 text-xs text-gray-500">Right now</div>
              {dcLoading ? (
                <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
              ) : activeBlock ? (
                <ActiveBlockView item={activeBlock} />
              ) : (
                <div className="text-gray-600">No active deep block</div>
              )}
            </div>

            {/* Actions → open modals */}
            <div className="flex flex-col gap-2 md:flex-row">
              <button
                className="flex-1 rounded-lg bg-black px-4 py-2 text-sm text-white hover:opacity-90"
                onClick={() => setModalDayOpen(true)}
              >
                View My Day
              </button>
              <button
                className="flex-1 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                onClick={() => setModalStatsOpen(true)}
              >
                View Stats
              </button>
            </div>

            {/* tiny promo under card */}
            <div className="pt-1 text-[11px] text-gray-500">
              Powered by{" "}
              <a className="text-indigo-600 underline" href={DC_ORIGIN} target="_blank" rel="noreferrer">
                DeepCalendar
              </a>
            </div>
          </motion.div>

          {/* Ventures (remote image to avoid 404) */}
          <motion.div
            variants={cardVariants} whileHover="hover"
            className="space-y-3 rounded-2xl border p-4 shadow-md transition hover:shadow-lg"
          >
            <div className="flex items-center gap-2">
              <FaBriefcase className="text-xl text-indigo-600" />
              <h3 className="text-base font-semibold">My Ventures</h3>
            </div>
            <div className="rounded-lg border bg-gray-50 p-3 text-center">
              <Image
                src="https://picsum.photos/300/200?random=2"
                alt="Ventures Visual"
                width={300}
                height={200}
                className="mx-auto rounded-md shadow-sm"
                unoptimized
              />
            </div>
            <div className="flex flex-col gap-2 md:flex-row">
              <Link href="/ventures" className="flex-1 rounded-lg border px-4 py-2 text-center text-sm hover:bg-gray-50">
                View Ventures
              </Link>
              <button className="flex-1 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
                Latest Updates
              </button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Popular resources (blogs) */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-semibold">Most Popular Resources</h2>
          <Link href="/blog" className="text-sm text-indigo-600 hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(posts) && posts.length ? (
            posts.map((p, index) => (
              <motion.article
                key={p._id ?? index}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}
                className="rounded-2xl border p-4 shadow-sm transition hover:shadow-md"
              >
                <Link href={`/blog/${p._raw?.flattenedPath ?? ""}`} className="mb-1 block font-medium text-indigo-700 hover:underline">
                  {p.title}
                </Link>
                <div className="text-xs text-gray-500">{formatDate(p.date)}</div>
                {p.summary && <p className="mt-2 text-sm text-gray-600">{p.summary}</p>}
                {Array.isArray(p.tags) && p.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">#{t}</span>
                    ))}
                  </div>
                )}
              </motion.article>
            ))
          ) : (
            <p className="text-gray-600">No posts yet.</p>
          )}
        </div>
      </motion.section>

      {/* Featured reels */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-semibold">Watch My Most Popular Videos</h2>
          <Link href="/reels" className="text-sm text-indigo-600 hover:underline">Watch More</Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(reels) && reels.length ? (
            reels.map((r, index) => (
              <motion.div
                key={r.id ?? index}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}
                className="rounded-2xl border p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="text-xs text-gray-500">{r.type || "reel"} • {formatDate(r.createdAt)}</div>
                <div className="mt-1 font-medium">{r.title}</div>
                {r.ref && (
                  <a href={r.ref} target="_blank" rel="noreferrer" className="mt-1 inline-flex text-sm text-indigo-600 hover:underline">
                    Watch →
                  </a>
                )}
              </motion.div>
            ))
          ) : (
            <p className="text-gray-600">No videos yet.</p>
          )}
        </div>
      </motion.section>

      {/* Ventures list */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-semibold">Check Out My Ventures & Projects</h2>
          <Link href="/ventures" className="text-sm text-indigo-600 hover:underline">See all</Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.isArray(ventures) && ventures.length ? (
            ventures.slice(0, 4).map((v, i) => (
              <motion.div
                key={v.slug || i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}
                className="rounded-2xl border p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="text-xs text-gray-500">{v.stage || v.status || "Active"}</div>
                <div className="mt-1 font-medium">
                  <Link href={v.slug ? `/ventures/${v.slug}` : "/ventures"} className="text-indigo-700 hover:underline">
                    {v.title || v.name || "Venture"}
                  </Link>
                </div>
                {v.description && <p className="mt-2 text-sm text-gray-600">{v.description}</p>}
              </motion.div>
            ))
          ) : (
            <p className="text-gray-600">No ventures listed yet.</p>
          )}
        </div>
      </motion.section>

      {/* Modals */}
      <RoutineModal
        open={modalDayOpen}
        onClose={() => setModalDayOpen(false)}
        items={todayItems}
        window={todayWindow}
        goalById={goalById}
      />
      <StatsModal
        open={modalStatsOpen}
        onClose={() => setModalStatsOpen(false)}
        goals={goals}
        stats7d={stats7d}
        summary30d={summary30d}
      />
    </div>
  );
}

function ActiveBlockView({ item }) {
  const badge = depthBadge(item.depthLevel);
  const durMin = Math.max(1, (item.endMin - item.startMin));
  return (
    <div className="rounded-md border px-2 py-1" style={{ borderColor: badge.border, background: badge.bg }} title={`Depth ${badge.text}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="truncate font-semibold">{item.label ?? "Deep block"}</span>
        <span className="ml-2 shrink-0">{fromMinutes(item.startMin)}–{fromMinutes(item.endMin)}</span>
      </div>
      <div className="mt-1 flex items-center justify-between text-[11px] opacity-80">
        <span>{badge.text}</span>
        <span>{humanMinutes(durMin)}</span>
      </div>
    </div>
  );
}
