'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function ProjectGallery({ images = [], title = "Project screenshot", className = "" }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const swipeStart = useRef(null);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") setActiveIndex(null);
      if (activeIndex !== null && event.key === "ArrowLeft") {
        setActiveIndex((index) => index === null ? null : (index - 1 + images.length) % images.length);
      }
      if (activeIndex !== null && event.key === "ArrowRight") {
        setActiveIndex((index) => index === null ? null : (index + 1) % images.length);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, images.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeIndex]);

  const activeImage = activeIndex === null ? null : images[activeIndex];
  const visibleImages = images.slice(startIndex, startIndex + 2);
  const canMoveBack = startIndex > 0;
  const canMoveForward = startIndex + 2 < images.length;
  const showPreviousImage = () => {
    setActiveIndex((index) => index === null ? null : (index - 1 + images.length) % images.length);
  };
  const showNextImage = () => {
    setActiveIndex((index) => index === null ? null : (index + 1) % images.length);
  };
  const handlePointerDown = (event) => {
    swipeStart.current = { x: event.clientX, y: event.clientY };
    if (event.pointerType !== "mouse") event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const handlePointerUp = (event) => {
    if (!swipeStart.current) return;
    const deltaX = event.clientX - swipeStart.current.x;
    const deltaY = event.clientY - swipeStart.current.y;
    swipeStart.current = null;
    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    if (deltaX < 0) showNextImage();
    else showPreviousImage();
  };

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
      <div
        className="project-lightbox-panel"
        onMouseDown={(event) => event.stopPropagation()}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <button type="button" className="project-lightbox-close" onClick={() => setActiveIndex(null)} aria-label="Close image preview">×</button>
        {images.length > 1 && <button type="button" className="project-lightbox-nav project-lightbox-prev" onClick={showPreviousImage} aria-label="Previous image">‹</button>}
        <Image src={activeImage} alt={`${title} ${activeIndex + 1}`} width={1600} height={1100} className="max-h-[82vh] w-auto max-w-full object-contain" priority />
        {images.length > 1 && <button type="button" className="project-lightbox-nav project-lightbox-next" onClick={showNextImage} aria-label="Next image">›</button>}
        <p>{activeIndex + 1} / {images.length}</p>
      </div>
    </div>}
  </>;
}
