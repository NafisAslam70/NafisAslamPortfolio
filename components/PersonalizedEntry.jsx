"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PersonalizedOverlay from "./PersonalizedOverlay";
import { PERSONALIZED_MESSAGES } from "@/content/personalised";

function EmployerPortfolioGate({ onDismiss, onSelectTrack }) {
  const [step, setStep] = useState("employer");

  return (
    <div className="fixed inset-0 z-[998] flex items-center justify-center bg-slate-950/75 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl border border-white/20 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-950 sm:p-8">
        {step === "employer" ? (
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-300">
                Portfolio Router
              </p>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Are you an employer?</h2>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                I can show you a focused portfolio version for hiring decisions.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setStep("track")}
                className="rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Yes, continue
              </button>
              <button
                type="button"
                onClick={onDismiss}
                className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-white/15 dark:text-slate-100 dark:hover:bg-white/10"
              >
                No, skip
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-300">
                Role Direction
              </p>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Is the role research-focused or company-focused?
              </h2>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Select one and I will load the matching digital resume.
              </p>
            </div>
            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => onSelectTrack("company")}
                className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-left text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-300/30 dark:bg-indigo-500/10 dark:text-indigo-200"
              >
                Company Job (Computer Vision / ML Engineer)
              </button>
              <button
                type="button"
                onClick={() => onSelectTrack("research")}
                className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-left text-sm font-semibold text-violet-700 transition hover:bg-violet-100 dark:border-violet-300/30 dark:bg-violet-500/10 dark:text-violet-200"
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

  useEffect(() => {
    if (pathname !== "/" && pathname !== "/hire-me") return;
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
  }, [pathname, hasPersonalizedCard, track]);

  const dismissEmployerGate = () => {
    try {
      sessionStorage.setItem("portfolio-entry-dismissed", "1");
    } catch {}
    setShowEmployerGate(false);
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
