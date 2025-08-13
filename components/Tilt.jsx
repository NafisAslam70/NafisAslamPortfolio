"use client";
import { useRef } from "react";

export default function Tilt({ children, max = 12, glare = true, className = "" }) {
  const ref = useRef(null);
  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (py - 0.5) * 2 * max;
    const ry = (0.5 - px) * 2 * max;
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    if (glare) {
      el.style.setProperty("--glx", `${px * 100}%`);
      el.style.setProperty("--gly", `${py * 100}%`);
    }
  }
  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
  }
  return (
    <div onMouseMove={onMove} onMouseLeave={onLeave} className={className}>
      <div ref={ref} className="relative will-change-transform transition-transform duration-150 ease-out [--glx:50%] [--gly:50%]">
        {children}
        {glare && (
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-40"
            style={{ background: "radial-gradient(300px 300px at var(--glx) var(--gly), rgba(255,255,255,0.35), transparent 60%)" }}
          />
        )}
      </div>
    </div>
  );
}
