"use client";

import { Children, useEffect, useState } from "react";

export default function ProjectCategoryTabs({ categories, children }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const panels = Children.toArray(children);

  useEffect(() => {
    const activateHashCategory = () => {
      const id = window.location.hash.slice(1);
      const index = categories.findIndex((category) => category.id === id);
      if (index < 0) return;

      setActiveIndex(index);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          document.getElementById(id)?.scrollIntoView({ block: "start" });
        });
      });
    };

    activateHashCategory();
    window.addEventListener("hashchange", activateHashCategory);
    return () => window.removeEventListener("hashchange", activateHashCategory);
  }, [categories]);

  return <>
    <nav aria-label="Project categories" className="project-category-tabs mb-8 flex gap-2 overflow-x-auto pb-2" role="tablist">
      {categories.map((category, index) => (
        <button
          key={category.id}
          type="button"
          role="tab"
          aria-selected={activeIndex === index}
          aria-controls={category.id}
          onClick={() => {
            setActiveIndex(index);
            window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${category.id}`);
          }}
          className={activeIndex === index ? "project-category-tab project-category-tab-active" : "project-category-tab"}
        >
          <span>{String(index + 1).padStart(2, "0")}</span><b>{category.label}</b>
        </button>
      ))}
    </nav>
    {panels[activeIndex]}
  </>;
}
