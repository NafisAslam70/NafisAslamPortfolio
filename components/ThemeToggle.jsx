"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light");
    const saved = localStorage.getItem("theme") || "system";
    const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved === "system" ? (sysDark ? "dark" : "light") : saved;
    root.dataset.theme = theme;
    root.classList.toggle("dark", theme === "dark");
    setIsLight(theme === "light");
  }, []);

  function toggle() {
    const root = document.documentElement;
    root.classList.remove("light");
    const nextTheme = isLight ? "dark" : "light";
    root.dataset.theme = nextTheme;
    root.classList.toggle("dark", nextTheme === "dark");
    localStorage.setItem("theme", nextTheme);
    setIsLight(nextTheme === "light");
  }

  return (
    <button onClick={toggle} className="btn" aria-pressed={isLight}>
      {isLight ? "🌞 Light" : "🌙 Dark"}
    </button>
  );
}
