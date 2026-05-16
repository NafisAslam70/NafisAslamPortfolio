"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const REVIEW_TRACKS = [
  { id: "behavioral", label: "General Interaction / Behavioral" },
  { id: "technical", label: "Technical Interview" },
];

const RESUME_BASED_REASONS = [
  "MIT MicroMasters + USM degree profile",
  "DeepWork AI / DLEF product execution",
  "Strong communication and enthusiasm",
  "Research + engineering blend",
  "Overall fit for this role",
];

const BEHAVIORAL_QUESTIONS = [
  "How clearly did Nafees communicate ideas?",
  "How did he handle ambiguity and follow-up questions?",
  "Did he show ownership, accountability, and collaboration mindset?",
  "Would you trust Nafees with cross-functional communication?",
];

const TECHNICAL_QUESTIONS = [
  "How strong was Nafees' problem-solving approach (not only final answer)?",
  "How solid were Nafees' core ML/CV fundamentals for the role?",
  "How practical was Nafees' system thinking (deployment, tradeoffs, scalability)?",
  "Did Nafees' technical depth match his resume claims (DeepWork AI, research, shipped work)?",
];

export default function InterviewerFeedbackPage() {
  const searchParams = useSearchParams();
  const contextCompany = searchParams.get("c") || searchParams.get("company") || "";
  const contextInterviewer = searchParams.get("i") || searchParams.get("interviewer") || "";
  const contextInterviewerEmail = searchParams.get("e") || searchParams.get("interviewerEmail") || "";
  const contextRole = searchParams.get("r") || searchParams.get("role") || "";
  const contextRound = searchParams.get("rd") || searchParams.get("round") || "";
  const contextTrack = searchParams.get("t") || searchParams.get("track");
  const resumeTrack = searchParams.get("rt") || searchParams.get("resumeTrack") || "research";
  const hasPrefilledContext = Boolean(contextCompany || contextInterviewer || contextInterviewerEmail || contextRole || contextRound || contextTrack);
  const resumeHref = `/hire-me?track=${encodeURIComponent(resumeTrack)}&fromReview=1&returnToReview=${encodeURIComponent(`/interviewer-feedback?${searchParams.toString()}`)}`;
  const [reviewTrack, setReviewTrack] = useState(contextTrack === "technical" ? "technical" : "behavioral");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  const [form, setForm] = useState({
    interviewerName: contextInterviewer,
    interviewerEmail: contextInterviewerEmail,
    companyRole: [contextCompany, contextRole].filter(Boolean).join(" - "),
    reasons: [],
    overallComment: "",
    hireDecision: "",
    overallRating: "8",
  });
  const hasLockedIdentity = Boolean(contextInterviewer && contextInterviewerEmail);
  const questionSet = reviewTrack === "technical" ? TECHNICAL_QUESTIONS : BEHAVIORAL_QUESTIONS;

  const toggleReason = (value) => {
    setForm((prev) => ({
      ...prev,
      reasons: prev.reasons.includes(value) ? prev.reasons.filter((v) => v !== value) : [...prev.reasons, value],
    }));
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("");
    try {
      const scoreLines = questionSet.map((q, i) => `${q}: ${form[`score${i + 1}`] || "N/A"}/5`).join("\n");
      const message = [
        `Interview Track: ${reviewTrack === "technical" ? "Technical" : "Behavioral"}`,
        `Interviewer Role: ${form.companyRole || "N/A"}`,
        `Why choose me: ${form.reasons.join(", ") || "N/A"}`,
        "",
        "Scoring",
        scoreLines,
        "",
        `Hire Decision: ${form.hireDecision || "N/A"}`,
        `Overall Rating: ${form.overallRating}/10`,
        `Overall Comment (strengths, weaknesses, analysis): ${form.overallComment || "N/A"}`,
      ].join("\n");

      const res = await fetch("/api/hire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.interviewerName,
          email: form.interviewerEmail,
          role: `Interviewer Review (${reviewTrack})`,
          message,
          website: "",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Submit failed");
      setStatus("Submitted successfully.");
      setShowThankYou(true);
      setForm({
        interviewerName: contextInterviewer,
        interviewerEmail: contextInterviewerEmail,
        companyRole: "",
        reasons: [],
        overallComment: "",
        hireDecision: "",
        overallRating: "8",
      });
    } catch {
      setStatus("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-3 py-6 text-slate-900 sm:px-4 sm:py-10" style={{ fontFamily: "'Manrope', 'DM Sans', 'Geist', system-ui, sans-serif" }}>
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4">
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">How did Nafees do? Could you please help him analyze his progress? <span className="text-slate-500 font-semibold">(Review Form)</span></h1>
        </div>
        {hasPrefilledContext ? (
          <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm sm:p-4">
            <div className="font-extrabold tracking-tight text-slate-900">Interview Context</div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-md border border-slate-200 bg-white px-3 py-2"><span className="text-slate-500">Company:</span> <span className="font-medium">{contextCompany || "-"}</span></div>
              <div className="rounded-md border border-slate-200 bg-white px-3 py-2"><span className="text-slate-500">Interviewer:</span> <span className="font-medium">{contextInterviewer || "-"}</span></div>
              <div className="rounded-md border border-slate-200 bg-white px-3 py-2"><span className="text-slate-500">Round:</span> <span className="font-medium">{contextRound || "-"}</span></div>
            </div>
            <div className="mt-2 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-emerald-800">
              Track: {reviewTrack === "technical" ? "Technical" : "Behavioral"}
            </div>
          </div>
        ) : null}
        {!contextTrack ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {REVIEW_TRACKS.map((track) => (
              <button
                key={track.id}
                type="button"
                onClick={() => setReviewTrack(track.id)}
                className={`rounded-full border px-3 py-1.5 text-sm ${reviewTrack === track.id ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-slate-300 text-slate-700"}`}
              >
                {track.label}
              </button>
            ))}
          </div>
        ) : null}

        <form onSubmit={submitReview} className="space-y-4">
          {!hasLockedIdentity ? (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
              Missing locked interviewer identity in link. Please regenerate link from admin with interviewer name and email.
            </div>
          ) : null}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="mb-1 text-sm font-extrabold tracking-tight text-slate-900">Why did you give a chance to Nafees for this interview?</div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">(Select all that apply)</div>
            <div className="grid gap-2 sm:grid-cols-2">
              {RESUME_BASED_REASONS.map((item) => {
                const active = form.reasons.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleReason(item)}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${active ? "border-emerald-500 bg-emerald-50 text-emerald-900" : "border-slate-300 bg-white text-slate-700"}`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="pt-2 text-sm font-extrabold tracking-tight text-slate-900">{reviewTrack === "technical" ? "Technical scores (1-5)" : "Behavioral scores (1-5)"}</div>
          {questionSet.map((q, i) => {
            const key = `score${i + 1}`;
            return (
              <div key={q} className="space-y-1 rounded-lg border border-slate-200 bg-white p-3">
                <div className="text-sm text-slate-700">{q}</div>
                <select
                  required
                  value={form[key] || ""}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 !bg-white px-3 py-2 text-sm !text-slate-900 appearance-none dark:!bg-white dark:!text-slate-900"
                  style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
                >
                  <option value="">Select score</option>
                  <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option>
                </select>
              </div>
            );
          })}
          <div className="pt-2 text-sm font-extrabold tracking-tight text-slate-900">Final decision</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {["Strong Yes", "Yes", "I will let you know", "Leaning No", "No"].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setForm((p) => ({ ...p, hireDecision: d }))}
                className={`rounded-lg border px-3 py-2 text-sm font-semibold text-left ${
                  form.hireDecision === d
                    ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                    : "border-slate-300 bg-white text-slate-700"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="text-sm font-bold text-slate-900">Overall rating: {form.overallRating}/10</div>
          <input type="range" min="1" max="10" value={form.overallRating} onChange={(e) => setForm((p) => ({ ...p, overallRating: e.target.value }))} className="w-full" />
          <textarea
            placeholder="Overall comment: strengths, weaknesses, and general analysis"
            value={form.overallComment}
            onChange={(e) => setForm((p) => ({ ...p, overallComment: e.target.value }))}
            className="min-h-24 w-full rounded-lg border border-slate-300 !bg-white px-3 py-2 !text-slate-900 dark:!bg-white dark:!text-slate-900"
            style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
          />
          <button type="submit" disabled={isSubmitting || !hasLockedIdentity} className="rounded-full border border-emerald-500 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 disabled:opacity-50">
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
          {status ? <div className="text-sm text-slate-700">{status}</div> : null}
        </form>
        <div className="mt-6 border-t border-slate-200 pt-4">
          <Link href={resumeHref} className="inline-flex rounded-full border border-slate-400 px-4 py-2 text-sm font-semibold text-slate-800">
            Back to Digital Resume
          </Link>
        </div>
      </div>
      {showThankYou ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4">
          <div className="w-full max-w-md rounded-2xl border border-emerald-200 bg-white p-6 text-slate-900 shadow-2xl">
            <h2 className="text-xl font-bold">Thank You</h2>
            <p className="mt-2 text-sm text-slate-700">
              Thank you for sharing your feedback.
            </p>
            <p className="mt-2 text-sm text-slate-700">
              Message from Nafees: I truly appreciate your time and honest review. Your feedback helps me improve with clarity.
            </p>
            <div className="mt-4">
              <button onClick={() => setShowThankYou(false)} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold">
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
