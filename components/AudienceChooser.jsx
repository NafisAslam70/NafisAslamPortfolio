"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const COPY = {
  en: {
    title: "Choose a profile",
    description: "Pick what you'd like to explore.",
    industry: "Industry & product",
    industryDescription: "Software engineering, applied AI, and products built for real users.",
    research: "Research & academia",
    researchDescription: "Computer vision, medical imaging, and selected research projects.",
    close: "Close audience chooser",
  },
  ar: {
    title: "اختر الملف المناسب",
    description: "اختر ما ترغب في استكشافه.",
    industry: "المنتجات والهندسة",
    industryDescription: "هندسة البرمجيات والذكاء الاصطناعي التطبيقي ومنتجات للمستخدمين.",
    research: "البحث والأكاديميا",
    researchDescription: "الرؤية الحاسوبية والتصوير الطبي ومشاريع بحثية مختارة.",
    close: "إغلاق نافذة اختيار الملف",
  },
};

export default function AudienceChooser({ lang = "en" }) {
  const router = useRouter();
  const dialogRef = useRef(null);
  const [portalRoot, setPortalRoot] = useState(null);
  const [currentLang, setCurrentLang] = useState(lang);
  const copy = COPY[currentLang === "ar" ? "ar" : "en"];

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  useEffect(() => {
    setCurrentLang(lang);
  }, [lang]);

  useEffect(() => {
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  }, [portalRoot]);

  function closeDialog() {
    if (dialogRef.current?.open) dialogRef.current.close();
  }

  function selectLanguage(next) {
    if (next === currentLang) return;
    document.cookie = `lang=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    setCurrentLang(next);
    router.refresh();
  }

  if (!portalRoot) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      className="audience-dialog"
      aria-labelledby="audience-dialog-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) closeDialog();
      }}
    >
      <div className="audience-dialog-content" dir={currentLang === "ar" ? "rtl" : "ltr"}>
        <div className="audience-dialog-topline">
          <div className="audience-dialog-identity">
            <span className="audience-dialog-monogram" aria-hidden="true">NA</span>
            <span className="audience-dialog-brand">
              <strong>NAFIS ASLAM</strong>
            </span>
          </div>
          <LanguageSwitcher
            lang={currentLang}
            onChange={selectLanguage}
            className="audience-dialog-language"
          />
          <button
            type="button"
            className="audience-dialog-close"
            aria-label={copy.close}
            onClick={closeDialog}
          >
            ×
          </button>
        </div>

        <div className="audience-dialog-heading">
          <h2 id="audience-dialog-title">{copy.title}</h2>
          <p className="audience-dialog-description">{copy.description}</p>
        </div>

        <div className="audience-dialog-options">
          <button type="button" className="audience-dialog-option audience-dialog-industry" onClick={closeDialog}>
            <span className="audience-dialog-option-top">
              <span className="audience-dialog-option-icon" aria-hidden="true">01</span>
              <span className="audience-dialog-arrow" aria-hidden="true">↗</span>
            </span>
            <strong>{copy.industry}</strong>
            <small>{copy.industryDescription}</small>
          </button>
          <Link className="audience-dialog-option audience-dialog-research" href="/research">
            <span className="audience-dialog-option-top">
              <span className="audience-dialog-option-icon" aria-hidden="true">02</span>
              <span className="audience-dialog-arrow" aria-hidden="true">↗</span>
            </span>
            <strong>{copy.research}</strong>
            <small>{copy.researchDescription}</small>
          </Link>
        </div>
      </div>
    </dialog>,
    portalRoot,
  );
}
