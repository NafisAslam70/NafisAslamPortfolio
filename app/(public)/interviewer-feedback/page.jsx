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
  "How did Nafees handle ambiguity and follow-up questions?",
  "Did Nafees show ownership, accountability, and collaboration mindset?",
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
  const contextCompany = searchParams.get("company") || "";
  const contextRole = searchParams.get("role") || "";
  const contextRound = searchParams.get("round") || "";
  const contextTrack = searchParams.get("track");
  const prefilledContext = [contextCompany, contextRole, contextRound].filter(Boolean).join(" | ");
  const [reviewTrack, setReviewTrack] = useState(contextTrack === "technical" ? "technical" : "behavioral");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({
    interviewerName: "",
    interviewerEmail: "",
    companyRole: [contextCompany, contextRole].filter(Boolean).join(" - "),
    reasons: [],
    strengths: "",
    risk: "",
    hireDecision: "",
    overallRating: "8",
  });
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
        `Strongest Signal: ${form.strengths || "N/A"}`,
        `Risk Area: ${form.risk || "N/A"}`,
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
      setForm({
        interviewerName: "",
        interviewerEmail: "",
        companyRole: "",
        reasons: [],
        strengths: "",
        risk: "",
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
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-300 bg-white p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">Interviewer Feedback Form</h1>
          <Link href="/hire-me?track=research" className="rounded-full border border-slate-600 px-3 py-1.5 text-sm">
            Back to Digital Resume
          </Link>
        </div>
        {prefilledContext ? (
          <div className="mb-4 rounded-lg border border-slate-300 bg-slate-50 p-3 text-sm">
            <div className="font-semibold">Interview Context</div>
            <div className="mt-1">{prefilledContext}</div>
          </div>
        ) : null}
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

        <form onSubmit={submitReview} className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <input required placeholder="Interviewer name" value={form.interviewerName} onChange={(e) => setForm((p) => ({ ...p, interviewerName: e.target.value }))} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900" />
            <input required type="email" placeholder="Interviewer email" value={form.interviewerEmail} onChange={(e) => setForm((p) => ({ ...p, interviewerEmail: e.target.value }))} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900" />
          </div>
          {!prefilledContext ? (
            <input placeholder="Company + role" value={form.companyRole} onChange={(e) => setForm((p) => ({ ...p, companyRole: e.target.value }))} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900" />
          ) : null}
          <div className="pt-2 text-sm font-medium">Why choose me?</div>
          {RESUME_BASED_REASONS.map((item) => (
            <label key={item} className="block text-sm text-slate-700">
              <input type="checkbox" checked={form.reasons.includes(item)} onChange={() => toggleReason(item)} className="mr-2 accent-emerald-600" />
              {item}
            </label>
          ))}
          <div className="pt-2 text-sm font-medium">{reviewTrack === "technical" ? "Technical scores (1-5)" : "Behavioral scores (1-5)"}</div>
          {questionSet.map((q, i) => {
            const key = `score${i + 1}`;
            return (
              <div key={q} className="space-y-1">
                <div className="text-sm text-slate-700">{q}</div>
                <select required value={form[key] || ""} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900">
                  <option value="">Select score</option>
                  <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option>
                </select>
              </div>
            );
          })}
          <div className="pt-2 text-sm font-medium">Final decision</div>
          <div className="flex flex-wrap gap-3 text-sm">
            {["Strong Yes", "Yes", "Leaning No", "No"].map((d) => (
              <label key={d}>
                <input type="radio" required name="hireDecision" checked={form.hireDecision === d} onChange={() => setForm((p) => ({ ...p, hireDecision: d }))} className="mr-2" />
                {d}
              </label>
            ))}
          </div>
          <div className="text-sm">Overall rating: {form.overallRating}/10</div>
          <input type="range" min="1" max="10" value={form.overallRating} onChange={(e) => setForm((p) => ({ ...p, overallRating: e.target.value }))} className="w-full" />
          <textarea placeholder="Strongest signal" value={form.strengths} onChange={(e) => setForm((p) => ({ ...p, strengths: e.target.value }))} className="min-h-20 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900" />
          <textarea placeholder="Risk area / concern" value={form.risk} onChange={(e) => setForm((p) => ({ ...p, risk: e.target.value }))} className="min-h-20 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900" />
          <button type="submit" disabled={isSubmitting} className="rounded-full border border-emerald-500 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
          {status ? <div className="text-sm text-slate-700">{status}</div> : null}
        </form>
      </div>
    </main>
  );
}
