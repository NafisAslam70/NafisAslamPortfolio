"use client";

import { useMemo, useState } from "react";

export default function InterviewerLinkBuilder() {
  const [baseUrl, setBaseUrl] = useState("https://www.nafisaslam.com");
  const [company, setCompany] = useState("");
  const [interviewer, setInterviewer] = useState("");
  const [interviewerEmail, setInterviewerEmail] = useState("");
  const [role, setRole] = useState("");
  const [round, setRound] = useState("");
  const [track, setTrack] = useState("technical");

  const link = useMemo(() => {
    const params = new URLSearchParams();
    if (company) params.set("c", company);
    if (interviewer) params.set("i", interviewer);
    if (interviewerEmail) params.set("e", interviewerEmail);
    if (role) params.set("r", role);
    if (round) params.set("rd", round);
    if (track) params.set("t", track);
    return `${baseUrl.replace(/\/$/, "")}/interviewer-feedback?${params.toString()}`;
  }, [baseUrl, company, interviewer, interviewerEmail, role, round, track]);

  const emailSubject = useMemo(() => {
    const companyTag = company ? ` - ${company}` : "";
    return `Interview Feedback Request${companyTag}`;
  }, [company]);

  const emailBody = useMemo(() => {
    const nameLine = interviewer ? `Hi ${interviewer},` : "Hi,";
    return [
      nameLine,
      "",
      "Thank you again for taking my interview.",
      "Could you please share your feedback using this short form?",
      "",
      link,
      "",
      "Your feedback means a lot and will help me improve.",
      "",
      "Best regards,",
      "Nafees",
    ].join("\n");
  }, [interviewer, link]);

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4 space-y-3">
      <h2 className="text-lg font-semibold">Interviewer Link Builder</h2>
      <div className="grid gap-2 md:grid-cols-2">
        <input className="border rounded px-3 py-2" placeholder="Base URL" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Interviewer Name" value={interviewer} onChange={(e) => setInterviewer(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Interviewer Email" value={interviewerEmail} onChange={(e) => setInterviewerEmail(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Round" value={round} onChange={(e) => setRound(e.target.value)} />
      </div>
      <div className="flex gap-4 text-sm">
        <label><input type="radio" name="track" checked={track === "technical"} onChange={() => setTrack("technical")} className="mr-2" />Technical</label>
        <label><input type="radio" name="track" checked={track === "behavioral"} onChange={() => setTrack("behavioral")} className="mr-2" />Behavioral</label>
      </div>
      <div className="rounded border bg-gray-50 p-3 text-sm break-all">{link}</div>
      <button
        type="button"
        className="px-3 py-2 rounded bg-black text-white text-sm"
        onClick={() => navigator.clipboard.writeText(link)}
      >
        Copy Link
      </button>
      <div className="rounded-lg border border-gray-300 bg-gray-50 p-3 space-y-2">
        <div className="text-sm font-semibold">Sample Email (Auto)</div>
        <div className="text-xs"><span className="font-semibold">To:</span> {interviewerEmail || "(add interviewer email above)"}</div>
        <div className="text-xs"><span className="font-semibold">Subject:</span> {emailSubject}</div>
        <pre className="text-xs whitespace-pre-wrap break-words bg-white border rounded p-2">{emailBody}</pre>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="px-3 py-2 rounded border text-sm"
            onClick={() => navigator.clipboard.writeText(`Subject: ${emailSubject}\n\n${emailBody}`)}
          >
            Copy Email Text
          </button>
          <a
            className="px-3 py-2 rounded border text-sm inline-flex items-center"
            href={`mailto:${encodeURIComponent(interviewerEmail)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
          >
            Open in Mail App
          </a>
        </div>
      </div>
    </div>
  );
}
