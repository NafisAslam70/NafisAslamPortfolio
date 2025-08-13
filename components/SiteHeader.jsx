"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SiteHeader({ session, lang = "en", nav = [] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [curLang, setCurLang] = useState(lang);

  // hydrate theme from document (set in ThemeInitScript)
  useEffect(() => {
    const t = document.documentElement.dataset.theme || "light";
    setTheme(t);
  }, []);

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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[color:var(--border)] bg-[color:var(--bg)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold">Nafis Aslam</span>
          {/* <span className="hidden text-xs text-[color:var(--muted)] sm:inline">
            {curLang === "hi" ? "सीखो • बनाओ • उठो" : "Learn • Build • Uplift"}
          </span> */}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-2 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={n.variant === "primary" ? "btn btn-primary" : "btn btn-ghost"}
            >
              {label(n)}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Lang toggle */}
          <button
            className="btn btn-ghost text-xs"
            onClick={() => setLang(curLang === "hi" ? "en" : "hi")}
            title="Switch language"
          >
            {curLang === "hi" ? "EN" : "हिं"}
          </button>

          {/* Theme toggle */}
          <button
            className="btn btn-ghost text-xs"
            onClick={toggleTheme}
            title="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* Auth */}
          {session?.role === "admin" ? (
            <>
              <Link href="/admin" className="btn">Admin</Link>
              <button onClick={logout} className="btn btn-ghost">Logout</button>
            </>
          ) : (
            <Link href="/login" className="btn">Login</Link>
          )}

          {/* Mobile menu button */}
          <button
            className="btn md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="border-t border-[color:var(--border)] md:hidden">
          <nav className="mx-auto grid max-w-5xl gap-1 p-2">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={n.variant === "primary" ? "btn btn-primary justify-start" : "btn btn-ghost justify-start"}
                onClick={() => setOpen(false)}
              >
                {label(n)}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
