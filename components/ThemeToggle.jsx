"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      document.documentElement.classList.add("light");
      setIsLight(true);
    }
  }, []);

  function toggle() {
    const root = document.documentElement;
    if (root.classList.contains("light")) {
      root.classList.remove("light");
      localStorage.setItem("theme", "dark");
      setIsLight(false);
    } else {
      root.classList.add("light");
      localStorage.setItem("theme", "light");
      setIsLight(true);
    }
  }

  return (
    <button onClick={toggle} className="btn" aria-pressed={isLight}>
      {isLight ? "🌞 Light" : "🌙 Dark"}
    </button>
  );
}
