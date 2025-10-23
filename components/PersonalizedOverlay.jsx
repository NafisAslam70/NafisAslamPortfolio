"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function PersonalizedOverlay({ data, onClose }) {
  const slides = useMemo(() => {
    if (!data) return [];

    const result = [];

    const offers = (data.offers ?? []).map((offer, idx) => ({
      kind: "offer",
      index: idx,
      title: offer.title,
      bullets: offer.bullets ?? [],
    }));
    result.push(...offers);
    if ((data.qualities ?? []).length) {
      result.push({ kind: "qualities", qualities: data.qualities });
    }
    return result;
  }, [data]);

  const [slideIndex, setSlideIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(false);
  const [showOffersModal, setShowOffersModal] = useState(false);
  const totalSlides = slides.length;
  const currentSlide = totalSlides ? slides[Math.min(slideIndex, totalSlides - 1)] : null;
  const introText = data?.headline ?? "";
  const footerLinks = data?.footerLinks ?? [];
  const primaryOffer = data?.offers?.[0] ?? null;
  const primaryOfferHighlight = primaryOffer?.bullets?.[0] ?? null;
  const handleCloseOffersModal = () => {
    setShowOffersModal(false);
    setSlideIndex(0);
  };
  const mobileNextLabel = useMemo(() => {
    if (totalSlides <= 1) return null;
    const nextIndex = (slideIndex + 1) % totalSlides;
    const nextSlide = slides[nextIndex];
    if (!nextSlide) return "Next";
    if (nextSlide.kind === "offer") {
      return nextIndex === 0 ? "Back to first offer" : "Next offer";
    }
    if (nextSlide.kind === "qualities") {
      return "Why work with me";
    }
    return "Next";
  }, [slideIndex, slides, totalSlides]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (totalSlides > 0 && slideIndex >= totalSlides) {
      setSlideIndex(0);
    }
  }, [slideIndex, totalSlides]);

  useEffect(() => {
    if (showOffersModal) {
      setSlideIndex(0);
    }
  }, [showOffersModal]);

  if (!data) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] bg-slate-900/70 backdrop-blur-sm px-4 py-6 sm:px-6"
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.2 }}
          className="relative mx-auto flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-[#f8f9ff] text-slate-900 shadow-[0_45px_95px_-50px_rgba(79,70,229,0.55)] dark:border-white/15 dark:bg-slate-950 dark:text-slate-100"
        >
          <header className="flex flex-col gap-4 border-b border-slate-100 px-6 py-6 dark:border-white/10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <p className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                  Personalised card for
                </p>
                <h2 className="text-2xl font-semibold leading-tight text-slate-900 drop-shadow-[0_3px_12px_rgba(79,70,229,0.25)] dark:text-white">
                  {data.displayName ?? data.name}
                </h2>
                {data.roleLine ? (
                  <p className="text-sm text-slate-600 dark:text-slate-300">{data.roleLine}</p>
                ) : null}
                {introText ? (
                  <div className="space-y-2 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                    {introText.split(/\n+/).filter(Boolean).map((paragraph, idx) => {
                      const isVisible = showIntro || idx === 0;
                      if (!isVisible) return null;
                      return (
                        <p
                          key={idx}
                          className={`last:mb-0 ${
                            idx === 0
                              ? "font-semibold text-slate-900 drop-shadow-[0_2px_8px_rgba(79,70,229,0.25)] dark:text-slate-50"
                              : ""
                          }`.trim()}
                        >
                          {paragraph}
                        </p>
                      );
                    })}
                    {introText.split(/\n+/).filter(Boolean).length > 1 ? (
                      <button
                        type="button"
                        onClick={() => setShowIntro((prev) => !prev)}
                        className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-indigo-600 shadow-sm transition hover:bg-indigo-50 dark:border-white/15 dark:bg-white/10 dark:text-indigo-200"
                      >
                        {showIntro ? "Hide details" : "Show full intro"}
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-sm font-semibold hover:bg-slate-100 dark:border-white/15 dark:hover:bg-white/10"
                aria-label="Close personalised message"
              >
                ×
              </button>
            </div>
            {data.primaryLinks?.length ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                {data.primaryLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noreferrer" : undefined}
                    className="inline-flex items-center justify-center rounded-full border border-indigo-200/70 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-indigo-600 shadow-sm transition hover:bg-indigo-50 dark:border-white/15 dark:bg-white/10 dark:text-indigo-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
            {totalSlides > 1 ? (
              <div className="hidden w-full items-center gap-2 sm:flex">
                {slides.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1 flex-1 rounded-full transition ${
                      idx <= slideIndex
                        ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                        : "bg-slate-200/70 dark:bg-white/10"
                    }`}
                  />
                ))}
              </div>
            ) : null}
          </header>

      <div className="flex-1 overflow-auto bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.14),_transparent_58%)] px-4 py-4 lg:px-10 lg:py-8">
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-6">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-24 -left-14 h-40 w-40 rounded-full bg-indigo-300/25 blur-3xl" />
            <div className="absolute bottom-[-80px] right-[-30px] h-60 w-60 rounded-full bg-pink-300/25 blur-[110px]" />
          </div>
          <div className="flex w-full max-w-2xl flex-col items-center gap-4 rounded-3xl border border-indigo-200/70 bg-white/95 p-6 text-center shadow-[0_30px_70px_-45px_rgba(79,70,229,0.45)] backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100 sm:hidden">
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-200">
              Tailored plan inside
            </span>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              How I can add value to your organisation?
            </h3>
            <button
              type="button"
              onClick={() => setShowOffersModal(true)}
              disabled={!totalSlides}
              className="inline-flex w-full max-w-xs items-center justify-center rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold uppercase tracking-[0.28em] text-white shadow-[0_16px_30px_-22px_rgba(79,70,229,0.55)] transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-slate-900"
            >
              See what I can offer
            </button>
          </div>

          <motion.div
            key={slideIndex}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.25 }}
            className="hidden w-full max-w-3xl flex-col rounded-3xl border border-indigo-200/70 bg-gradient-to-br from-white via-indigo-50/40 to-white p-6 shadow-[0_45px_95px_-60px_rgba(79,70,229,0.45)] backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/40 max-h-[600px] sm:flex lg:max-h-[520px] lg:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-300">
              <span>
                Card {totalSlides ? slideIndex + 1 : 0} of {totalSlides}
              </span>
              {totalSlides > 1 ? (
                <div className="flex items-center gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides)}
                    className="inline-flex items-center justify-center rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-semibold tracking-[0.28em] text-indigo-600 shadow-sm transition hover:bg-indigo-50 dark:border-white/15 dark:bg-white/10 dark:text-indigo-200"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setSlideIndex((prev) => (prev + 1) % totalSlides)}
                    className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold tracking-[0.28em] text-white shadow-sm transition hover:bg-indigo-500"
                  >
                    Next
                  </button>
                </div>
              ) : null}
            </div>
            <div className="mt-2 flex min-h-[220px] flex-col gap-5">
              {!currentSlide ? (
                <div className="flex flex-1 items-center justify-center rounded-2xl border border-indigo-200/60 bg-white/90 p-6 text-sm text-slate-700 shadow-[0_20px_60px_-40px_rgba(79,70,229,0.35)] dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                  Personalised offers will be added here soon.
                </div>
              ) : null}

              {currentSlide?.kind === "offer" ? (
                <div className="space-y-4">
                  <div className="flex flex-col gap-3 rounded-2xl border border-indigo-200/60 bg-white p-5 shadow-[0_20px_50px_-40px_rgba(79,70,229,0.35)] dark:border-white/10 dark:bg-white/10">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-200">
                        Offer
                      </span>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{currentSlide.title}</h3>
                      {typeof currentSlide.index === "number" && currentSlide.index === 0 ? (
                        <Link
                          href="https://meedian-ai-flow-v2.vercel.app/"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center rounded-full border border-indigo-200/70 bg-gradient-to-r from-white via-indigo-50 to-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-indigo-600 shadow-[0_16px_30px_-22px_rgba(79,70,229,0.5)] transition hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-indigo-200"
                        >
                          Open Meedian AI Flow
                        </Link>
                      ) : null}
                    </div>
                  </div>
                  <ul className="space-y-2 rounded-2xl border border-indigo-200/60 bg-white p-5 text-base leading-relaxed text-slate-700 shadow-[0_20px_45px_-40px_rgba(79,70,229,0.35)] dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                    {currentSlide.bullets.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.8)] dark:bg-indigo-300" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {currentSlide?.kind === "qualities" ? (
                <div className="space-y-4 rounded-2xl border border-indigo-200/60 bg-white p-5 shadow-[0_20px_45px_-40px_rgba(79,70,229,0.35)] dark:border-white/10 dark:bg-white/10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.32em] text-indigo-600 dark:text-indigo-300">
                      Why work with me
                    </h3>
                  </div>
                  <ul className="space-y-2 text-base leading-relaxed text-slate-700 dark:text-slate-200">
                    {(currentSlide.qualities ?? []).map((quality, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.6)] dark:bg-indigo-300" />
                        <span>{quality}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/pdfs/myResume.pdf"
                    className="inline-flex w-full items-center justify-center rounded-full border border-indigo-200/70 bg-indigo-600 px-4 py-2 text-sm font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-indigo-500 dark:border-white/15"
                  >
                    Download my CV
                  </Link>
                </div>
              ) : null}
            </div>
          </motion.div>
        </div>
      </div>

          <footer className="flex flex-col gap-3 border-t border-slate-100 bg-white px-6 py-4 dark:border-white/10 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-300">
              Close this card any time — the whole site is ready underneath.
            </span>
            <div className="flex flex-row flex-wrap items-center justify-center gap-1.5 sm:flex-row sm:flex-nowrap sm:items-center sm:justify-end sm:gap-3">
              <a
                href="https://wa.me/601137576465"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-indigo-200 bg-white px-4 py-1.5 text-xs font-semibold text-indigo-600 shadow-sm transition hover:bg-indigo-50 dark:border-white/15 dark:bg-white/10 dark:text-indigo-200 sm:px-5 sm:py-2 sm:text-sm"
              >
                WhatsApp me
              </a>
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm transition sm:px-5 sm:py-2 sm:text-sm ${
                    link.primary
                      ? "bg-indigo-600 text-white hover:bg-indigo-500"
                      : "border border-indigo-200 bg-white text-indigo-600 hover:bg-indigo-50 dark:border-white/15 dark:bg-white/10 dark:text-indigo-200"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </footer>
        </motion.div>
        <AnimatePresence>
          {showOffersModal ? (
            <motion.div
              key="offers-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[1000] bg-slate-900/80 px-4 py-6 sm:px-6"
              role="dialog"
              aria-modal="true"
              onClick={handleCloseOffersModal}
            >
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.25 }}
                className="relative mx-auto flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-[#f8f9ff] text-slate-900 shadow-[0_45px_95px_-50px_rgba(79,70,229,0.55)] dark:border-white/15 dark:bg-slate-950 dark:text-slate-100"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-white/10">
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-indigo-500 dark:text-indigo-300">
                      Offers & plan
                    </p>
                    <h3 className="text-lg font-semibold leading-tight text-slate-900 dark:text-white">
                      {data.displayName ?? data.name}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseOffersModal}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-base font-semibold hover:bg-slate-100 dark:border-white/15 dark:hover:bg-white/10"
                    aria-label="Close offers modal"
                  >
                    ×
                  </button>
                </div>
                <div className="flex-1 overflow-auto bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.14),_transparent_58%)] px-4 py-4 lg:px-10 lg:py-8">
                  <div className="relative flex h-full w-full flex-col items-center justify-center gap-6">
                    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                      <div className="absolute -top-24 -left-14 h-40 w-40 rounded-full bg-indigo-300/25 blur-3xl" />
                      <div className="absolute bottom-[-80px] right-[-30px] h-60 w-60 rounded-full bg-pink-300/25 blur-[110px]" />
                    </div>

                    <div className="w-full space-y-4 sm:hidden">
                      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-300">
                        <span>
                          Card {totalSlides ? slideIndex + 1 : 0} of {totalSlides}
                        </span>
                        {totalSlides > 1 ? (
                          <span className="text-[11px] text-indigo-500 dark:text-indigo-200">Tap for more</span>
                        ) : null}
                      </div>
                      {!currentSlide ? (
                        <div className="rounded-2xl border border-indigo-200/60 bg-white/90 p-5 text-sm text-slate-700 shadow-[0_20px_45px_-40px_rgba(79,70,229,0.35)] dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                          Personalised offers will be added here soon.
                        </div>
                      ) : (
                        <div className="space-y-4 rounded-2xl border border-indigo-200/60 bg-white p-5 shadow-[0_20px_50px_-40px_rgba(79,70,229,0.35)] dark:border-white/10 dark:bg-white/10">
                          {currentSlide.kind === "offer" ? (
                            <>
                              <div className="flex flex-wrap items-center gap-3">
                                <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-200">
                                  Offer
                                </span>
                                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">{currentSlide.title}</h3>
                                {typeof currentSlide.index === "number" && currentSlide.index === 0 ? (
                                  <Link
                                    href="https://meedian-ai-flow-v2.vercel.app/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center rounded-full border border-indigo-200/70 bg-gradient-to-r from-white via-indigo-50 to-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-indigo-600 shadow-[0_16px_30px_-22px_rgba(79,70,229,0.5)] transition hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-indigo-200"
                                  >
                                    Open Meedian AI Flow
                                  </Link>
                                ) : null}
                              </div>
                              <ul className="space-y-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                                {currentSlide.bullets.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.8)] dark:bg-indigo-300" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : null}
                          {currentSlide.kind === "qualities" ? (
                            <>
                              <div className="flex items-center justify-between">
                                <h3 className="text-xs font-semibold uppercase tracking-[0.32em] text-indigo-600 dark:text-indigo-300">
                                  Why work with me
                                </h3>
                              </div>
                              <ul className="space-y-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                                {(currentSlide.qualities ?? []).map((quality, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.6)] dark:bg-indigo-300" />
                                    <span>{quality}</span>
                                  </li>
                                ))}
                              </ul>
                              <Link
                                href="/pdfs/myResume.pdf"
                                className="inline-flex w-full items-center justify-center rounded-full border border-indigo-200/70 bg-indigo-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-indigo-500 dark:border-white/15"
                              >
                                Download my CV
                              </Link>
                            </>
                          ) : null}
                        </div>
                      )}
                      {totalSlides > 1 && mobileNextLabel ? (
                        <button
                          type="button"
                          onClick={() => setSlideIndex((prev) => (prev + 1) % totalSlides)}
                          className="inline-flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-white shadow-[0_16px_30px_-22px_rgba(79,70,229,0.55)] transition hover:bg-indigo-500"
                        >
                          {mobileNextLabel}
                        </button>
                      ) : null}
                    </div>

                    <motion.div
                      key={slideIndex}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -24 }}
                      transition={{ duration: 0.25 }}
                      className="hidden w-full max-w-3xl flex-col rounded-3xl border border-indigo-200/70 bg-gradient-to-br from-white via-indigo-50/40 to-white p-6 shadow-[0_45px_95px_-60px_rgba(79,70,229,0.45)] backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/40 max-h-[600px] sm:flex lg:max-h-[520px] lg:p-8"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-300">
                        <span>
                          Card {totalSlides ? slideIndex + 1 : 0} of {totalSlides}
                        </span>
                        {totalSlides > 1 ? (
                          <div className="flex items-center gap-2 text-[11px]">
                            <button
                              type="button"
                              onClick={() => setSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides)}
                              className="inline-flex items-center justify-center rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-semibold tracking-[0.28em] text-indigo-600 shadow-sm transition hover:bg-indigo-50 dark:border-white/15 dark:bg-white/10 dark:text-indigo-200"
                            >
                              Previous
                            </button>
                            <button
                              type="button"
                              onClick={() => setSlideIndex((prev) => (prev + 1) % totalSlides)}
                              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold tracking-[0.28em] text-white shadow-sm transition hover:bg-indigo-500"
                            >
                              Next
                            </button>
                          </div>
                        ) : null}
                      </div>
                      <div className="mt-2 flex min-h-[220px] flex-col gap-5">
                        {!currentSlide ? (
                          <div className="flex flex-1 items-center justify-center rounded-2xl border border-indigo-200/60 bg-white/90 p-6 text-sm text-slate-700 shadow-[0_20px_60px_-40px_rgba(79,70,229,0.35)] dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                            Personalised offers will be added here soon.
                          </div>
                        ) : null}

                        {currentSlide?.kind === "offer" ? (
                          <div className="space-y-4">
                            <div className="flex flex-col gap-3 rounded-2xl border border-indigo-200/60 bg-white p-5 shadow-[0_20px_50px_-40px_rgba(79,70,229,0.35)] dark:border-white/10 dark:bg-white/10">
                              <div className="flex flex-wrap items-center gap-3">
                                <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-200">
                                  Offer
                                </span>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{currentSlide.title}</h3>
                                {typeof currentSlide.index === "number" && currentSlide.index === 0 ? (
                                  <Link
                                    href="https://meedian-ai-flow-v2.vercel.app/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center rounded-full border border-indigo-200/70 bg-gradient-to-r from-white via-indigo-50 to-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-indigo-600 shadow-[0_16px_30px_-22px_rgba(79,70,229,0.5)] transition hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-indigo-200"
                                  >
                                    Open Meedian AI Flow
                                  </Link>
                                ) : null}
                              </div>
                            </div>
                            <ul className="space-y-2 rounded-2xl border border-indigo-200/60 bg-white p-5 text-base leading-relaxed text-slate-700 shadow-[0_20px_45px_-40px_rgba(79,70,229,0.35)] dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                              {currentSlide.bullets.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.8)] dark:bg-indigo-300" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {currentSlide?.kind === "qualities" ? (
                          <div className="space-y-4 rounded-2xl border border-indigo-200/60 bg-white p-5 shadow-[0_20px_45px_-40px_rgba(79,70,229,0.35)] dark:border-white/10 dark:bg-white/10">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-semibold uppercase tracking-[0.32em] text-indigo-600 dark:text-indigo-300">
                                Why work with me
                              </h3>
                            </div>
                            <ul className="space-y-2 text-base leading-relaxed text-slate-700 dark:text-slate-200">
                              {(currentSlide.qualities ?? []).map((quality, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.6)] dark:bg-indigo-300" />
                                  <span>{quality}</span>
                                </li>
                              ))}
                            </ul>
                            <Link
                              href="/pdfs/myResume.pdf"
                              className="inline-flex w-full items-center justify-center rounded-full border border-indigo-200/70 bg-indigo-600 px-4 py-2 text-sm font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-indigo-500 dark:border-white/15"
                            >
                              Download my CV
                            </Link>
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
