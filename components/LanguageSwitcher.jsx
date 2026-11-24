"use client";

export default function LanguageSwitcher({ lang = "en", onChange, className = "" }) {
  return (
    <div
      className={`language-switcher ${className}`.trim()}
      dir="ltr"
      role="group"
      aria-label="Choose language"
    >
      <button
        type="button"
        aria-label="English"
        aria-pressed={lang === "en"}
        onClick={() => onChange("en")}
      >
        ENG
      </button>
      <button
        type="button"
        aria-label="Arabic"
        aria-pressed={lang === "ar"}
        onClick={() => onChange("ar")}
      >
        ARB
      </button>
    </div>
  );
}
