"use client";

import { useEffect, useState, useTransition } from "react";

export default function DeleteCourseButton({ courseId, courseTitle }) {
  const [stage, setStage] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (stage !== 1) return;
    const timer = setTimeout(() => {
      setStage(0);
      setFeedback("");
    }, 6000);
    return () => clearTimeout(timer);
  }, [stage]);

  const handleClick = () => {
    if (isPending) return;

    if (stage === 0) {
      const first = confirm(`Delete course "${courseTitle}"?`);
      if (first) {
        setStage(1);
        setFeedback("Click confirm within 6 seconds to delete everything.");
      }
      return;
    }

    const second = confirm("This cannot be undone. Delete everything for this course?");
    if (!second) {
      setStage(0);
      setFeedback("");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/courses/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: courseId }),
          credentials: "include",
        });
        if (!res.ok) {
          const j = await res.json().catch(() => null);
          setFeedback(j?.error || "Failed to delete course");
          setStage(0);
          return;
        }
        setFeedback("Deleted. Refreshing…");
        setStage(0);
        setTimeout(() => {
          window.location.reload();
        }, 600);
      } catch (err) {
        setFeedback("Network error deleting course");
        setStage(0);
      }
    });
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        className={`btn ${stage === 1 ? "btn-primary" : ""} border border-red-300 text-red-600 hover:border-red-500`}
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? "Deleting…" : stage === 1 ? "Confirm delete" : "Delete"}
      </button>
      {feedback && <span className="text-xs text-red-600">{feedback}</span>}
    </div>
  );
}
