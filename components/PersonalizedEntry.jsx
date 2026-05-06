"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PersonalizedOverlay from "./PersonalizedOverlay";
import { PERSONALIZED_MESSAGES } from "@/content/personalised";

function EmployerPortfolioGate({ onDismiss, onSelectTrack }) {
  const [step, setStep] = useState("employer");

  return (
    <div className="fixed inset-0 z-[998] flex items-center justify-center bg-slate-950/78 px-4 backdrop-blur-md">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/95 p-6 shadow-[0_40px_90px_-50px_rgba(15,23,42,0.65)] dark:border-white/10 dark:bg-slate-950/95 sm:p-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-0 h-40 w-40 rounded-full bg-emerald-200/45 blur-3xl dark:bg-emerald-500/12" />
          <div className="absolute -right-10 bottom-0 h-44 w-44 rounded-full bg-slate-300/35 blur-3xl dark:bg-slate-700/20" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300/80 to-transparent dark:via-white/15" />
        </div>
        {step === "employer" ? (
          <div className="relative space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-600 dark:text-slate-300">
                Portfolio Router
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Are you an Employer/ or a Researcher?</h2>
              <p className="max-w-xl text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                I can show you a focused portfolio version for hiring decisions.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setStep("track")}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                Yes, continue
              </button>
              <button
                type="button"
                onClick={onDismiss}
                className="rounded-2xl border border-slate-300 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-white/15 dark:bg-white/[0.04] dark:text-slate-100 dark:hover:bg-white/10"
              >
                No, skip
              </button>
            </div>
          </div>
        ) : (
          <div className="relative space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-600 dark:text-slate-300">
                Role Direction
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Is the role research-focused or company-focused?
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                Select one and I will load the matching digital resume.
              </p>
            </div>
            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => onSelectTrack("company")}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-100 dark:hover:bg-white/[0.08]"
              >
                Company Job (Computer Vision / ML Engineer)
              </button>
              <button
                type="button"
                onClick={() => onSelectTrack("research")}
                className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200"
              >
                Research Role (AI/ML Research Student Path)
              </button>
            </div>
            <button
              type="button"
              onClick={() => setStep("employer")}
              className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PersonalizedEntry() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [dismissed, setDismissed] = useState(null);
  const [showEmployerGate, setShowEmployerGate] = useState(false);

  const slug = params?.get("for")?.toLowerCase() ?? null;
  const track = params?.get("track")?.toLowerCase() ?? null;
  const data = useMemo(() => (slug ? PERSONALIZED_MESSAGES[slug] : null), [slug]);
  const hasPersonalizedCard = Boolean(slug && data && dismissed !== slug);
  const isPublicPath = pathname ? !pathname.startsWith("/admin") && !pathname.startsWith("/api") : false;

  useEffect(() => {
    if (!isPublicPath) return;
    if (hasPersonalizedCard) return;
    if (pathname === "/hire-me") {
      setShowEmployerGate(!track);
      return;
    }

    try {
      const hidden = sessionStorage.getItem("portfolio-entry-dismissed");
      if (!hidden) setShowEmployerGate(true);
    } catch {
      setShowEmployerGate(true);
    }
  }, [pathname, hasPersonalizedCard, track, isPublicPath]);

  const dismissEmployerGate = () => {
    try {
      sessionStorage.setItem("portfolio-entry-dismissed", "1");
    } catch {}
    setShowEmployerGate(false);
    if (pathname !== "/") {
      router.push("/");
    }
  };

  const handleTrackSelect = (track) => {
    try {
      localStorage.setItem("preferred-portfolio-track", track);
      sessionStorage.setItem("portfolio-entry-dismissed", "1");
    } catch {}
    setShowEmployerGate(false);
    router.push(`/hire-me?track=${track}`);
  };

  if (hasPersonalizedCard) {
    return <PersonalizedOverlay data={data} onClose={() => setDismissed(slug)} />;
  }

  if (showEmployerGate) {
    return <EmployerPortfolioGate onDismiss={dismissEmployerGate} onSelectTrack={handleTrackSelect} />;
  }

  return null;
}
