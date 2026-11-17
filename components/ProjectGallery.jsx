'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProjectGallery({ images = [], title = "Project screenshot", className = "" }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") setActiveIndex(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const activeImage = activeIndex === null ? null : images[activeIndex];
  const visibleImages = images.slice(startIndex, startIndex + 2);
  const canMoveBack = startIndex > 0;
  const canMoveForward = startIndex + 2 < images.length;

  return <>
    <div className={`project-gallery ${className}`}>
      <div className="project-gallery-track">
      {visibleImages.map((src, visibleIndex) => {
        const index = startIndex + visibleIndex;
        return <button key={src} type="button" onClick={() => setActiveIndex(index)} className="project-gallery-thumb" aria-label={`Expand ${title} ${index + 1}`}>
        <Image src={src} alt={`${title} ${index + 1}`} width={1200} height={800} className="h-full w-full object-cover" />
        <span>{String(index + 1).padStart(2, "0")}</span>
      </button>;
      })}
      </div>
      {images.length > 2 && <div className="project-gallery-controls"><button type="button" onClick={() => setStartIndex((value) => Math.max(0, value - 1))} disabled={!canMoveBack} aria-label="Previous screenshots">←</button><em>{String(startIndex + 1).padStart(2, "0")}–{String(Math.min(startIndex + 2, images.length)).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</em><button type="button" onClick={() => setStartIndex((value) => Math.min(images.length - 2, value + 1))} disabled={!canMoveForward} aria-label="Next screenshots">→</button></div>}
    </div>
    {activeImage && <div className="project-lightbox" role="dialog" aria-modal="true" aria-label={`${title} preview`} onMouseDown={() => setActiveIndex(null)}>
      <div className="project-lightbox-panel" onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="project-lightbox-close" onClick={() => setActiveIndex(null)} aria-label="Close image preview">×</button>
        <Image src={activeImage} alt={`${title} ${activeIndex + 1}`} width={1600} height={1100} className="max-h-[82vh] w-auto max-w-full object-contain" priority />
        <p>{activeIndex + 1} / {images.length}</p>
      </div>
    </div>}
  </>;
}
