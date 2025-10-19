"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function SiteHeader({ session, lang = "en", nav = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [curLang, setCurLang] = useState(lang);

  // hydrate theme from document (set in ThemeInitScript)
  useEffect(() => {
    const t = document.documentElement.dataset.theme || "light";
    setTheme(t);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function applyTheme(next) {
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch {}
    setTheme(next);
  }
  function toggleTheme() {
    applyTheme(theme === "dark" ? "light" : "dark");
  }

  function label(item) {
    return curLang === "hi" ? (item.labelHi || item.labelEn) : item.labelEn;
  }
  function setLang(next) {
    try { document.cookie = `lang=${next}; Path=/; Max-Age=31536000`; } catch {}
    setCurLang(next);
    router.refresh(); // server will set <html lang="...">
  }

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
      router.push("/");
      router.refresh();
    } catch {}
  }

  function isActive(href) {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 w-full bg-transparent">
        <div className="pointer-events-none absolute inset-0 -z-10 border-b border-white/30 bg-white/70 backdrop-blur-lg dark:border-slate-800/70 dark:bg-slate-950/75" />
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-indigo-200/40 via-transparent to-transparent dark:from-indigo-900/40" />
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          {/* Brand */}
          <Link href="/" className="group flex items-center gap-3">
            <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/70 bg-white/80 shadow-md transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg dark:border-white/10 dark:bg-white/[0.08]">
              <Image
                src="/my_gifFile.GIF"
                alt="Nafis Aslam logo"
                fill
                className="object-cover md:object-contain"
                sizes="(max-width: 768px) 48px, 56px"
                priority
              />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-semibold md:text-lg">Nafis Aslam</span>
              <span className="hidden text-[11px] uppercase tracking-[0.28em] text-indigo-600/80 dark:text-indigo-300/80 md:block">
                {curLang === "hi" ? "निर्माण मोड" : "Build Mode"}
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center md:flex">
            <div className="relative flex items-center gap-2 rounded-[2.25rem] border border-indigo-200/60 bg-white/70 px-3 py-2 shadow-lg shadow-indigo-500/5 backdrop-blur dark:border-white/10 dark:bg-white/[0.06]">
              {nav.map((item) => {
                const active = isActive(item.href);
                const isPrimary = item.variant === "primary";
                if (isPrimary) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition duration-300 hover:shadow-xl hover:brightness-105"
                    >
                      <span className="relative z-10">{label(item)}</span>
                      <span className="pointer-events-none absolute inset-0 bg-white/10 opacity-0 transition duration-300 group-hover:opacity-100" />
                    </Link>
                  );
                }
                return (
                  <div key={item.href} className="group relative">
                    {active && (
                      <motion.span
                        layoutId="site-header-active"
                        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_12px_30px_-18px_rgba(79,70,229,0.9)]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {!active && (
                      <span className="pointer-events-none absolute inset-0 rounded-2xl border border-indigo-100/70 bg-white/80 transition duration-300 group-hover:border-indigo-300 group-hover:bg-white dark:border-white/15 dark:bg-white/[0.06] dark:group-hover:border-indigo-300/40" />
                    )}
                    <Link
                      href={item.href}
                      className={`relative z-10 flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition duration-200 ${
                        active
                          ? "text-white"
                          : "text-slate-600 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-200"
                      }`}
                    >
                      {label(item)}
                    </Link>
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-2xl border border-indigo-200/60 bg-white/70 px-2 py-1 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.06]">
              {/* Lang toggle */}
              <button
                className="rounded-full border border-transparent bg-indigo-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-600 transition hover:-translate-y-0.5 hover:bg-indigo-500/25 dark:text-indigo-200"
                onClick={() => setLang(curLang === "hi" ? "en" : "hi")}
                title="Switch language"
              >
                {curLang === "hi" ? "EN" : "हिं"}
              </button>

              {/* Theme toggle */}
              <button
                className="rounded-full border border-transparent bg-indigo-500/15 px-2.5 py-1 text-base transition hover:-translate-y-0.5 hover:bg-indigo-500/25"
                onClick={toggleTheme}
                title="Toggle theme"
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
            </div>

            {/* Auth */}
            {session?.role === "admin" ? (
              <>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 rounded-2xl border border-indigo-200/70 bg-white/70 px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-500 dark:border-white/15 dark:bg-white/[0.08] dark:text-indigo-200"
                >
                  Admin
                </Link>
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-2 rounded-2xl border border-indigo-200/70 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600 dark:border-white/15 dark:bg-white/[0.08] dark:text-slate-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex overflow-hidden rounded-2xl border border-indigo-200/60 bg-white/70 px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-500 dark:border-white/15 dark:bg-white/[0.08] dark:text-indigo-200"
              >
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-indigo-200/70 bg-white/70 text-lg shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-500 dark:border-white/15 dark:bg-white/[0.08] md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <div className="border-t border-indigo-200/60 bg-white/80 shadow-lg shadow-indigo-500/10 backdrop-blur dark:border-white/10 dark:bg-slate-950/80 md:hidden">
            <nav className="mx-auto grid max-w-6xl gap-2 p-4">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    n.variant === "primary"
                      ? "border-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md"
                      : "border-indigo-200/60 bg-white/70 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-white/15 dark:bg-white/[0.06] dark:text-slate-200"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {label(n)}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
      <div className="h-20 md:h-24" aria-hidden />
    </>
  );
}
