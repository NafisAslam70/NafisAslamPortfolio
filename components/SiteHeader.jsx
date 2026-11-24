"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Briefcase, Folder, GraduationCap, Home, Lightbulb, Mail } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const NAV_ICONS = {
  "/": Home,
  "/#experience": Briefcase,
  "/ventures": Folder,
  "/#expertise": Lightbulb,
  "/#education": GraduationCap,
  "/#contact": Mail,
};

export default function SiteHeader({ session, lang = "en", nav = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [curLang, setCurLang] = useState(lang);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    setCurLang(lang);
  }, [lang]);

  function selectLanguage(next) {
    if (next === curLang) return;
    document.cookie = `lang=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    setCurLang(next);
    router.refresh();
  }

  function label(item) {
    return curLang === "ar" ? (item.labelAr || item.labelEn) : item.labelEn;
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
      <header className="site-header fixed inset-x-0 top-0 z-50 w-full bg-transparent">
        <div className="site-header-aura pointer-events-none absolute inset-x-0 top-0 -z-10 h-16 md:h-[5.5rem]" />
        <div className="site-header-shell mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-3 md:px-4">
          {/* Brand */}
          <Link href="/" className="site-brand group flex items-center gap-3">
            <span className="site-brand-mark relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl">
              <Image
                src="/my_gifFile.GIF"
                alt="Nafis Aslam logo"
                fill
                className="object-cover md:object-contain"
                sizes="(max-width: 768px) 48px, 56px"
                priority
              />
            </span>
            <div className="site-brand-copy flex flex-col items-center text-center leading-tight">
              <span className="site-brand-heading" dir="ltr">
                <span className="site-brand-name text-2xl font-bold md:text-3xl">Nafis Aslam</span>
              </span>
              <span className="site-brand-subtitle-track">
                <span className="site-brand-subtitle">{curLang === "ar" ? "هدف · موعد نهائي · تفانٍ · إنجاز" : "Goal. Deadline. Dedication. Deliver."}</span>
                <span className="site-brand-target" aria-hidden="true"><i /></span>
                <span className="site-brand-projectile" aria-hidden="true" />
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav dir={curLang === "ar" ? "rtl" : "ltr"} className="hidden items-center md:flex">
            <div className="site-nav-dock relative flex items-center gap-1 p-1.5">
              {nav.map((item) => {
                const active = isActive(item.href);
                const isPrimary = item.variant === "primary";
                const Icon = NAV_ICONS[item.href];
                if (isPrimary) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="site-nav-primary group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-4 py-2 text-sm font-semibold text-white transition duration-300"
                    >
                      {Icon && <Icon aria-hidden="true" size={15} strokeWidth={2.2} />}
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
                        className="site-nav-active-indicator pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-500 shadow-[0_10px_24px_-15px_rgba(79,70,229,.75)]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {!active && (
                      <span className="pointer-events-none absolute inset-0 rounded-full transition duration-300 group-hover:bg-slate-100/80 dark:group-hover:bg-indigo-500/20" />
                    )}
                    <Link
                      href={item.href}
                      className={`site-nav-link relative z-10 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition duration-200 ${
                        active
                          ? "text-white"
                          : "text-slate-600 hover:text-indigo-700 dark:text-slate-200 dark:hover:text-indigo-200"
                      }`}
                    >
                      {Icon && <Icon aria-hidden="true" size={15} strokeWidth={2.2} />}
                      {label(item)}
                    </Link>
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Actions */}
          <div className="site-header-actions flex items-center gap-2">
            <LanguageSwitcher
              lang={curLang}
              onChange={selectLanguage}
              className="site-header-language"
            />

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
            ) : null}

            {/* Mobile menu button */}
            <button
              className="site-menu-trigger inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg transition md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="site-mobile-menu"
            >
              <span className={`site-menu-icon ${open ? "is-open" : ""}`} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <div id="site-mobile-menu" className="site-mobile-menu mx-3 mt-1 rounded-2xl md:hidden">
            <nav dir={curLang === "ar" ? "rtl" : "ltr"} className="mx-auto grid max-w-6xl gap-2 p-3">
              {nav.map((n) => {
                const Icon = NAV_ICONS[n.href];
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`site-mobile-link flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      n.variant === "primary"
                        ? "border-transparent bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md"
                        : "border-slate-100 bg-white/70 text-slate-600 hover:border-indigo-300 hover:text-indigo-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-indigo-300 dark:hover:text-indigo-200"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {Icon && <Icon aria-hidden="true" size={16} strokeWidth={2.2} />}
                    {label(n)}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>
      <div className="h-16 md:h-[5.5rem]" aria-hidden />
    </>
  );
}
