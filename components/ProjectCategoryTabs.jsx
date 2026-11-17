"use client";

import { Children, useState } from "react";

export default function ProjectCategoryTabs({ categories, children }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const panels = Children.toArray(children);

  return <>
    <nav aria-label="Project categories" className="project-category-tabs mb-8 flex gap-2 overflow-x-auto pb-2" role="tablist">
      {categories.map((category, index) => (
        <button
          key={category.id}
          type="button"
          role="tab"
          aria-selected={activeIndex === index}
          aria-controls={category.id}
          onClick={() => setActiveIndex(index)}
          className={activeIndex === index ? "project-category-tab project-category-tab-active" : "project-category-tab"}
        >
          <span>{String(index + 1).padStart(2, "0")}</span><b>{category.label}</b>
        </button>
      ))}
    </nav>
    {panels[activeIndex]}
  </>;
}
