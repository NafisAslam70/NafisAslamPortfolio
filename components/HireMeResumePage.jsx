"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const TABS = ["Overview", "Projects", "Experience", "Skills", "Education", "Achievements", "Vision & Mission"];
const BrainOrbMini = dynamic(() => import("@/components/BrainOrbMini"), { ssr: false });

const theme = {
  bg: "#08131a",
  panel: "#ffffff",
  border: "#dbe4e2",
  text: "#122321",
  muted: "#5d716d",
  hint: "#80928e",
  accent: "#178f6a",
  accentSoft: "#e0f3ec",
  violetSoft: "#efecff",
  violetBorder: "#bdb5f4",
  violetText: "#3b3486",
};

const sectionTitle = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: ".08em",
  textTransform: "uppercase",
  color: "var(--resume-hint)",
  marginBottom: 12,
};

const card = {
  background: "var(--resume-panel)",
  border: "1px solid var(--resume-border)",
  borderRadius: 14,
  padding: "1rem 1.1rem",
};

const HIRE_REASONS = [
  {
    title: "Built DeepWork AI, not just a model demo",
    text: "I turned the DLEF idea into a working focus system: real-time attention monitoring, product framing, analytics, and deployable execution beyond a notebook environment.",
  },
  {
    title: "Discipline-first execution",
    text: "My work is shaped by deep work, structured feedback, and consistency. I do not just experiment with models, I build systems around them and push them toward usable outcomes.",
  },
  {
    title: "Research thinking with builder instincts",
    text: "MIT training, USM AI grounding, a first-author preprint, and hands-on shipping experience let me move between research reasoning and product execution without losing rigor.",
  },
  {
    title: "Proof-backed, mission-driven work",
    text: "The claims here are linked to demos, research, and shipped systems. I care about AI that protects attention, improves learning, and solves real behavioral problems.",
  },
];

const ContactIcon = ({ type, color = "currentColor" }) => {
  const common = {
    width: 14,
    height: 14,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  if (type === "mail") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="M5 8l7 5 7-5" />
      </svg>
    );
  }

  if (type === "web") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3c2.7 2.7 4 5.7 4 9s-1.3 6.3-4 9c-2.7-2.7-4-5.7-4-9s1.3-6.3 4-9z" />
      </svg>
    );
  }

  if (type === "github") {
    return (
      <svg {...common}>
        <path d="M9 18c-4 1.2-4-2-6-2" />
        <path d="M15 21v-3.2c0-1 .1-1.4-.5-2 2-.2 4-.9 4-4.3 0-1-.4-2-1-2.7.1-.2.4-1.2-.1-2.5 0 0-.8-.3-2.7 1a9.5 9.5 0 0 0-5 0c-1.9-1.3-2.7-1-2.7-1-.5 1.3-.2 2.3-.1 2.5-.6.7-1 1.7-1 2.7 0 3.4 2 4.1 4 4.3-.6.6-.6 1.1-.6 2V21" />
      </svg>
    );
  }

  if (type === "linkedin") {
    return (
      <svg {...common}>
        <path d="M8 10v8" />
        <path d="M12 18v-4.5a2.5 2.5 0 0 1 5 0V18" />
        <path d="M12 13a2.5 2.5 0 0 1 5 0" />
        <circle cx="8" cy="7" r="1.2" fill={color} stroke="none" />
        <rect x="4" y="3" width="16" height="18" rx="2.5" />
      </svg>
    );
  }

  if (type === "medium") {
    return (
      <svg {...common}>
        <circle cx="8" cy="12" r="3.5" />
        <ellipse cx="14.5" cy="12" rx="2.6" ry="4.6" />
        <ellipse cx="19" cy="12" rx="1.2" ry="3.6" />
      </svg>
    );
  }

  if (type === "sun") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v3" />
        <path d="M12 19v3" />
        <path d="M2 12h3" />
        <path d="M19 12h3" />
        <path d="M4.9 4.9l2.1 2.1" />
        <path d="M17 17l2.1 2.1" />
        <path d="M19.1 4.9L17 7" />
        <path d="M7 17l-2.1 2.1" />
      </svg>
    );
  }

  if (type === "moon") {
    return (
      <svg {...common}>
        <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M10 13a5 5 0 0 0 7.5.4l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
      <path d="M14 11a5 5 0 0 0-7.5-.4l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
    </svg>
  );
};

const ContactBubble = ({ href, label, icon }) => (
  <a
    href={href}
    target={href.startsWith("mailto") ? undefined : "_blank"}
    rel="noopener noreferrer"
    title={label}
    aria-label={label}
    style={{
      width: 40,
      height: 40,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 999,
      border: "1px solid var(--resume-border)",
      color: "var(--resume-accent)",
      textDecoration: "none",
      background: "var(--resume-soft-panel)",
      boxShadow: "0 10px 20px -18px rgba(2,6,23,0.18)",
    }}
  >
    <ContactIcon type={icon} color="var(--resume-accent)" />
  </a>
);

const ProofTag = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontSize: 11,
      fontWeight: 600,
      padding: "3px 9px",
      borderRadius: 999,
      background: "var(--resume-proof-bg)",
      color: "var(--resume-proof-text)",
      border: "1px solid var(--resume-proof-border)",
      textDecoration: "none",
      marginLeft: 6,
    }}
  >
    {children} ↗
  </a>
);

const Pill = ({ href, children }) => (
  <a
    href={href}
    target={href.startsWith("mailto") ? undefined : "_blank"}
    rel="noopener noreferrer"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 12,
      fontWeight: 500,
      padding: "6px 11px",
      borderRadius: 999,
      border: "1px solid var(--resume-border)",
      color: "var(--resume-muted)",
      textDecoration: "none",
      background: "var(--resume-soft-panel)",
    }}
  >
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "var(--resume-accent)",
        display: "inline-block",
      }}
    />
    {children}
  </a>
);

const StackTag = ({ children }) => (
  <span
    style={{
      fontSize: 11,
      fontWeight: 600,
      padding: "3px 9px",
      borderRadius: 999,
      background: "var(--resume-proof-bg)",
      color: "var(--resume-proof-text)",
      border: "1px solid var(--resume-proof-border)",
      marginRight: 5,
      marginBottom: 5,
      display: "inline-block",
    }}
  >
    {children}
  </span>
);

const SkillTag = ({ children, hot }) => (
  <span
    style={{
      fontSize: 11,
      fontWeight: 600,
      padding: "4px 9px",
      borderRadius: 999,
      background: hot ? "var(--resume-accent-soft)" : "var(--resume-soft-panel)",
      border: hot ? "1px solid var(--resume-accent-border)" : "1px solid var(--resume-border)",
      color: hot ? "var(--resume-accent-strong)" : "var(--resume-muted)",
      marginRight: 5,
      marginBottom: 5,
      display: "inline-block",
    }}
  >
    {children}
  </span>
);

const MetaPill = ({ children, green }) => (
  <span
    style={{
      fontSize: 11,
      fontWeight: 600,
      padding: "4px 10px",
      borderRadius: 999,
      background: green ? "var(--resume-accent-soft)" : "var(--resume-soft-panel)",
      color: green ? "var(--resume-accent-strong)" : "var(--resume-muted)",
      border: green ? "1px solid var(--resume-accent-border)" : "1px solid var(--resume-border)",
      marginRight: 5,
      marginBottom: 5,
      display: "inline-block",
    }}
  >
    {children}
  </span>
);

const ExpItem = ({ title, company, date, bullets, last }) => (
  <div style={{ position: "relative", paddingLeft: 26, marginBottom: last ? 0 : 30 }}>
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 6,
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: "var(--resume-accent)",
        border: "2px solid var(--resume-panel)",
        boxShadow: "0 0 0 4px rgba(23,143,106,0.12)",
      }}
    />
    {!last && (
      <div
        style={{
          position: "absolute",
          left: 4.5,
          top: 18,
          bottom: -14,
          width: 1,
          background: "var(--resume-border)",
        }}
      />
    )}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--resume-text)" }}>{title}</div>
      <div style={{ fontSize: 11, color: "var(--resume-hint)", whiteSpace: "nowrap", marginTop: 3, fontWeight: 600 }}>{date}</div>
    </div>
    <div style={{ fontSize: 12, color: "var(--resume-accent)", marginBottom: 7, marginTop: 2, fontWeight: 600 }}>{company}</div>
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {bullets.map((b, i) => (
        <li key={i} style={{ fontSize: 13, color: "var(--resume-muted)", lineHeight: 1.6, padding: "2px 0 2px 14px", position: "relative" }}>
          <span style={{ position: "absolute", left: 2, color: "var(--resume-accent)" }}>·</span>
          {b}
        </li>
      ))}
    </ul>
  </div>
);

const AchRow = ({ icon, children }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      padding: "10px 0",
      borderBottom: "1px solid var(--resume-border)",
    }}
  >
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: "var(--resume-accent-soft)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontSize: 12,
        color: "var(--resume-accent-strong)",
        fontWeight: 700,
      }}
    >
      {icon}
    </div>
    <div style={{ fontSize: 13, lineHeight: 1.55, color: "var(--resume-muted)" }}>{children}</div>
  </div>
);

function Overview({ isMobile }) {
  return (
    <div>
      <div
        style={{
          background: theme.accentSoft,
          border: "1px solid #a5dcca",
          borderRadius: 14,
          padding: isMobile ? "0.9rem" : "1rem 1.1rem",
          fontSize: isMobile ? 13 : 14,
          lineHeight: 1.65,
          color: "#0f694f",
          marginBottom: 22,
        }}
      >
        A highly motivated ML/Computer Vision engineer who ships systems that work outside the lab: fast, deployable,
        and grounded in real problems. Built DeepWork AI powered by DLEF, a real-time attention monitoring system
        using YOLO + MediaPipe with &lt;50ms CPU inference, alongside a graduate-level MIT program and a full degree.
        Actively seeking Computer Vision / Machine Learning engineer or research roles across CV, AI, and applied AI.
      </div>

      <div style={sectionTitle}>Highlights</div>

      <AchRow icon="★">
        <strong style={{ color: "var(--resume-text)", fontWeight: 700 }}>Gold Award (Top 5%)</strong> — USM PIXEL 2025 for DeepWork AI powered by DLEF, a real-time attention monitoring system using YOLO + MediaPipe.
        <ProofTag href="https://doi.org/10.5281/zenodo.19266394">Preprint</ProofTag>
      </AchRow>
      <AchRow icon="★">
        <strong style={{ color: "var(--resume-text)", fontWeight: 700 }}>MIT MicroMasters</strong> — 16-month graduate-level Stats & Data Science program completed alongside full BSc.{" "}
        <MetaPill green>93% in Data Analysis</MetaPill>
      </AchRow>
      <AchRow icon="★">
        <strong style={{ color: "var(--resume-text)", fontWeight: 700 }}>First-Author Preprint</strong> — DeepLens Engine for Focus (DLEF), Zenodo 2026. Novel 20/30s temporal heuristic for attention modelling.
        <ProofTag href="https://doi.org/10.5281/zenodo.19266394">DOI</ProofTag>
      </AchRow>
      <AchRow icon="★">
        <strong style={{ color: "var(--resume-text)", fontWeight: 700 }}>Gold Honor (Top 2%)</strong> — International Youth Math Challenge 2020
      </AchRow>
      <AchRow icon="★">
        <strong style={{ color: "var(--resume-text)", fontWeight: 700 }}>Dean&apos;s List</strong> — 3 consecutive final semesters at USM. Major GPA: 9.55/10 (3.82/4.00)
      </AchRow>

      <div
        style={{
          marginTop: 28,
          background: `linear-gradient(120deg, ${theme.accent} 0%, #13a37b 100%)`,
          borderRadius: 14,
          padding: isMobile ? "1rem" : "1.2rem 1.35rem",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Open to remote ML/CV roles</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.85)", marginTop: 2 }}>Let&apos;s build something that works in the real world.</div>
        </div>
        <a
          href="mailto:nafisaslam1819@gmail.com"
          style={{
            background: "var(--resume-panel)",
            color: theme.accent,
            borderRadius: 10,
            padding: "8px 16px",
            fontSize: 13,
            fontWeight: 700,
            textDecoration: "none",
            whiteSpace: "nowrap",
            width: isMobile ? "100%" : "auto",
            textAlign: "center",
          }}
        >
          Get in touch
        </a>
      </div>
    </div>
  );
}

function Projects({ isMobile }) {
  return (
    <div>
      <div style={{ ...card, marginBottom: 14 }}>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6, gap: 10 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--resume-text)" }}>DeepWork AI / DeepLens Engine for Focus</div>
            <div style={{ fontSize: 12, color: "var(--resume-hint)", marginTop: 2 }}>2024-2025 · Flagship Project</div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: "#f9edd7", color: "#6a3b07", border: "1px solid #f6c773" }}>Gold Award</span>
        </div>
        <p style={{ fontSize: 13, color: "var(--resume-muted)", lineHeight: 1.6, margin: "0 0 10px" }}>
          Real-time CV system classifying 6 attention/behaviour states from webcam feed. Engineered a 20/30s temporal
          heuristic treating attention as a time-series signal, not per-frame output.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", margin: "8px 0" }}>
          {["YOLOv11n-cls", "MediaPipe", "OpenCV", "PyTorch", "Next.js", "Flask", "Docker"].map((t) => (
            <StackTag key={t}>{t}</StackTag>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,minmax(0,1fr))", gap: 8, margin: "10px 0" }}>
          {[["<50ms", "CPU latency"], ["6", "States"], ["0", "Video stored"]].map(([v, l]) => (
            <div key={l} style={{ background: "var(--resume-soft-panel)", borderRadius: 10, padding: 8, textAlign: "center", border: "1px solid var(--resume-border)" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: theme.accent }}>{v}</div>
              <div style={{ fontSize: 11, color: "var(--resume-hint)", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          <ProofTag href="https://doi.org/10.5281/zenodo.19266394">First-author preprint</ProofTag>
          <ProofTag href="https://nafisaslam.com">Live demo</ProofTag>
          <ProofTag href="https://github.com/NafisAslam70">GitHub</ProofTag>
        </div>
      </div>

      <div style={{ ...card, marginBottom: 14 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: "var(--resume-text)" }}>WorldQuant CV & DL Fellowship Projects</div>
        <div style={{ fontSize: 12, color: "var(--resume-hint)", marginBottom: 8 }}>2026-present</div>
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 10px" }}>
          {[
            "Wildlife camera-trap classification (Côte d'Ivoire) using multi-class CNN + cloud VM",
            "Crop disease classification (Uganda, 5 classes) with fine-tuned ResNet transfer learning",
            "MLP regression & classification from manual backprop to PyTorch implementation",
          ].map((b, i) => (
            <li key={i} style={{ fontSize: 13, color: "var(--resume-muted)", lineHeight: 1.6, padding: "2px 0 2px 14px", position: "relative" }}>
              <span style={{ position: "absolute", left: 4, color: "var(--resume-accent)" }}>·</span>{b}
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {["PyTorch", "ResNet", "Transfer Learning", "Cloud VM"].map((t) => (
            <StackTag key={t}>{t}</StackTag>
          ))}
        </div>
        <div style={{ marginTop: 10 }}>
          <ProofTag href="https://github.com/NafisAslam70">GitHub</ProofTag>
        </div>
      </div>

      <div style={card}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: "var(--resume-text)" }}>School Management Platform — Meed Public School</div>
        <div style={{ fontSize: 12, color: "var(--resume-hint)", marginBottom: 8 }}>Oct 2025-Feb 2026 · Freelance</div>
        <p style={{ fontSize: 13, color: "var(--resume-muted)", lineHeight: 1.6, margin: "0 0 10px" }}>
          Full-stack platform for 30+ users with real-time dashboards, role-based access, and an LLM assistant with
          offline inference.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {["Next.js", "Drizzle ORM", "NeonDB", "Twilio", "LLM (offline)"].map((t) => (
            <StackTag key={t}>{t}</StackTag>
          ))}
        </div>
      </div>
    </div>
  );
}

function Experience() {
  return (
    <div>
      <div style={sectionTitle}>Work & Research</div>
      <ExpItem
        title="Machine Learning Intern"
        company="Unified Mentor · Remote"
        date="Mar 2026-present"
        bullets={[
          "Built time-series forecasting pipeline (ARIMA, Random Forest, Gradient Boosting) on 3+ years of weekly government care load data.",
          "Developed learner segmentation (K-Means, Hierarchical) with feature engineering from clickstream logs.",
        ]}
      />
      <ExpItem
        title="CV & Deep Learning Fellow"
        company="WorldQuant University · Online"
        date="2026-present"
        bullets={[
          "Applied CNNs, transfer learning (ResNet), and PyTorch to real-world classification tasks.",
          "Explored MLP design, backprop, and optimizer behavior through applied projects.",
        ]}
      />
      <ExpItem
        title="Software Engineer (Freelance)"
        company="Meed Public School · India"
        date="Oct 2025-Feb 2026"
        bullets={[
          "Built full-stack platform (Next.js, Drizzle, NeonDB, Twilio) for 30+ users with dashboards and role access.",
        ]}
      />
      <ExpItem
        title="Software Engineering Intern"
        company="USM Speech Processing Group · Penang"
        date="Mar 2023-Aug 2023"
        last
        bullets={[
          "Built end-to-end stock analysis app (React, Node.js) with real-time processing and interactive visualization.",
        ]}
      />
    </div>
  );
}

function Skills({ isMobile }) {
  const cats = [
    {
      title: "Computer Vision",
      skills: [["YOLO v9/v11", true], ["MediaPipe", true], ["OpenCV", true], ["Gaze estimation", false], ["ByteTrack", false], ["Real-time detection", false], ["Transfer learning", false]],
    },
    {
      title: "Deep Learning",
      skills: [["PyTorch", true], ["CNNs", true], ["Transformers", false], ["GANs", false], ["Diffusion", false], ["Model pruning", false], ["ONNX", false]],
    },
    {
      title: "Machine Learning",
      skills: [["Scikit-learn", true], ["Ensembles", false], ["ARIMA", false], ["K-Means", false], ["Feature engineering", false], ["Pandas · NumPy", false]],
    },
    {
      title: "MLOps & Deploy",
      skills: [["Docker", true], ["Flask", true], ["Streamlit", false], ["Azure/GCP", false], ["Hugging Face", false], ["Next.js", false], ["Linux · Git", false]],
    },
  ];
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit,minmax(250px,1fr))", gap: 12, marginBottom: 20 }}>
        {cats.map(({ title, skills }) => (
          <div key={title} style={{ ...card, background: "var(--resume-soft-panel)" }}>
            <div style={sectionTitle}>{title}</div>
            {skills.map(([s, hot]) => (
              <SkillTag key={s} hot={hot}>{s}</SkillTag>
            ))}
          </div>
        ))}
      </div>
      <div style={sectionTitle}>Proven in production</div>
      <div style={{ fontSize: 13, color: "var(--resume-muted)", lineHeight: 1.8 }}>
        YOLO + MediaPipe → shipped real-time web app · Flask + Docker → on-device inference, zero video storage · Next.js + NeonDB → live school platform · ARIMA + GBM → forecasting pipeline
      </div>
    </div>
  );
}

function Education() {
  return (
    <div>
      <div style={{ ...card, marginBottom: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3, color: "var(--resume-text)" }}>Massachusetts Institute of Technology (MITx / edX)</div>
        <div style={{ fontSize: 13, color: "var(--resume-muted)", marginBottom: 6 }}>MicroMasters in Statistics and Data Science</div>
        <div style={{ fontSize: 12, color: "var(--resume-hint)", marginBottom: 10 }}>Aug 2024-Dec 2025 · 16 months · 10-15 hrs/week with full degree</div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <MetaPill green>Data Analysis: 93%</MetaPill>
          <MetaPill green>Machine Learning: 83%</MetaPill>
          <MetaPill>Probability: 78%</MetaPill>
          <MetaPill>Statistics: 60%</MetaPill>
          <MetaPill>Capstone: 73%</MetaPill>
        </div>
      </div>
      <div style={card}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3, color: "var(--resume-text)" }}>Universiti Sains Malaysia (USM)</div>
        <div style={{ fontSize: 13, color: "var(--resume-muted)", marginBottom: 6 }}>BSc (Hons.) Computer Science — Intelligent Computing (AI)</div>
        <div style={{ fontSize: 12, color: "var(--resume-hint)", marginBottom: 10 }}>2021-2025 · Penang, Malaysia</div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <MetaPill green>Major GPA: 9.55/10 · 3.82/4.00</MetaPill>
          <MetaPill>CGPA: 8.3/10 · 3.32/4.00</MetaPill>
          <MetaPill green>Dean&apos;s List × 3</MetaPill>
          <MetaPill green>Gold Award — PIXEL 2025 (top 5%)</MetaPill>
        </div>
        <div style={{ fontSize: 12, color: "var(--resume-hint)", marginTop: 8 }}>Trajectory: 3.49 → 3.65 → 3.73 → 3.82 (final 4 semesters)</div>
      </div>
    </div>
  );
}

function Achievements() {
  return (
    <div>
      <AchRow icon="P">
        <strong style={{ color: "var(--resume-text)", fontWeight: 700 }}>First-author preprint</strong> — DeepLens Engine for Focus, Zenodo 2026.
        <ProofTag href="https://doi.org/10.5281/zenodo.19266394">DOI: 10.5281/zenodo.19266394</ProofTag>
      </AchRow>
      <AchRow icon="G">
        <strong style={{ color: "var(--resume-text)", fontWeight: 700 }}>Gold Award (Top 5%)</strong> — USM PIXEL 2025 for DeepWork AI / DLEF system
      </AchRow>
      <AchRow icon="M">
        <strong style={{ color: "var(--resume-text)", fontWeight: 700 }}>Gold Honor (Top 2%)</strong> — International Youth Math Challenge 2020
      </AchRow>
      <AchRow icon="D">
        <strong style={{ color: "var(--resume-text)", fontWeight: 700 }}>Dean&apos;s List</strong> — 3 consecutive final semesters, USM. GPA trajectory: 3.49 → 3.82
      </AchRow>
      <AchRow icon="L">
        <strong style={{ color: "var(--resume-text)", fontWeight: 700 }}>Leadership</strong> — Superintendent, Meed Public School (2018-2022). Directed academics and operations for 300+ students.
      </AchRow>
      <AchRow icon="C">
        <strong style={{ color: "var(--resume-text)", fontWeight: 700 }}>Competitive programming</strong> — Active on LeetCode (~50 problems), Kaggle.
        <ProofTag href="https://github.com/NafisAslam70">GitHub</ProofTag>
      </AchRow>
      <AchRow icon="L">
        <strong style={{ color: "var(--resume-text)", fontWeight: 700 }}>Languages</strong> — English (fluent), Hindi (native), Urdu (native), Bahasa Malaysia (basic)
      </AchRow>
    </div>
  );
}

function VisionMission({ isMobile }) {
  return (
    <div>
      <div style={{ ...card, marginBottom: 14 }}>
        <div style={sectionTitle}>Core Idea</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--resume-text)", marginBottom: 8 }}>
          Build systems that protect attention and turn discipline into measurable progress.
        </div>
        <p style={{ fontSize: 13, color: "var(--resume-muted)", lineHeight: 1.7, margin: 0 }}>
          DeepWork AI came from a personal reset at USM: move from scattered effort to deliberate execution. That journey became a product, a research direction, and a wider mission around focus-first intelligent systems.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))", gap: 12, marginBottom: 14 }}>
        <div style={card}>
          <div style={sectionTitle}>Vision</div>
          <p style={{ fontSize: 13, color: "var(--resume-muted)", lineHeight: 1.7, margin: 0 }}>
            In a distraction-heavy world, attention is the real scarce resource. I want to build AI products that help people focus deeply, learn deliberately, and stay aligned with long-term goals.
          </p>
        </div>
        <div style={card}>
          <div style={sectionTitle}>Mission</div>
          <p style={{ fontSize: 13, color: "var(--resume-muted)", lineHeight: 1.7, margin: 0 }}>
            Use ML, CV, analytics, and product design to detect distraction, create feedback loops, and convert daily work into visible, compounding progress.
          </p>
        </div>
      </div>

      <div style={{ ...card, marginBottom: 14 }}>
        <div style={sectionTitle}>Why It Matters</div>
        <div style={{ display: "flex", flexWrap: "wrap", marginBottom: 10 }}>
          <MetaPill green>Attention as a scarce asset</MetaPill>
          <MetaPill green>AI for behavior change</MetaPill>
          <MetaPill green>Systems for disciplined learning</MetaPill>
          <MetaPill green>Rural and under-resourced impact</MetaPill>
        </div>
        <p style={{ fontSize: 13, color: "var(--resume-muted)", lineHeight: 1.7, margin: 0 }}>
          This work is not just about productivity dashboards. It is about building practical systems that help students, builders, and professionals operate with more clarity, consistency, and depth.
        </p>
      </div>

      <div style={card}>
        <div style={sectionTitle}>Execution Principles</div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {[
            "Measure focus quality, not just time spent.",
            "Turn distraction into feedback, not noise.",
            "Connect daily sessions with meaningful goals.",
            "Ship systems that work outside the lab.",
          ].map((item) => (
            <li key={item} style={{ fontSize: 13, color: "var(--resume-muted)", lineHeight: 1.65, padding: "6px 0 6px 14px", position: "relative" }}>
              <span style={{ position: "absolute", left: 0, color: "var(--resume-accent)" }}>•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const TAB_COMPONENTS = [Overview, Projects, Experience, Skills, Education, Achievements, VisionMission];

const PROFILE_CARDS = [
  {
    title: "Highly Disciplined",
    subtitle: "& Passionate about ML & CV",
    href: "/reels",
  },
  {
    title: "MIT Trained",
    subtitle: "& USM Malaysia Graduate",
    href: "https://www.linkedin.com/in/nafis-aslam/",
  },
  {
    title: "DeepWorkAI",
    subtitle: "Founder & Meed Co-Founder",
    href: "/ventures",
  },
  {
    title: "Dean's List x3",
    subtitle: "& Gold Awardee",
    href: "https://www.linkedin.com/in/nafis-aslam/",
  },
];

export default function HireMePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [showReasons, setShowReasons] = useState(false);
  const [popupReasonIndex, setPopupReasonIndex] = useState(0);
  const [isNight, setIsNight] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(1280);
  const searchParams = useSearchParams();
  const ActiveSection = TAB_COMPONENTS[activeTab];
  const isResearchTrack = searchParams.get("track") === "research";
  const cvHref = isResearchTrack ? "/pdfs/CV_research_resume.pdf" : "/pdfs/CV_job_resume_Final.pdf";
  const isMobile = viewportWidth < 768;
  const isTablet = viewportWidth < 1024;
  const trackLabel = isResearchTrack ? "Research Track" : "Industry Track";
  const floatingLabels = isResearchTrack
    ? [
        { label: "CV", left: "18%", top: "26%", delay: "0s" },
        { label: "DL", left: "72%", top: "62%", delay: "0.8s" },
        { label: "PAPER", left: "34%", top: "74%", delay: "1.4s" },
        { label: "LAB", left: "80%", top: "30%", delay: "0.5s" },
        { label: "DOI", left: "58%", top: "18%", delay: "1.9s" },
        { label: "PYTORCH", left: "12%", top: "62%", delay: "2.5s" },
      ]
    : [
        { label: "DL", left: "18%", top: "26%", delay: "0s" },
        { label: "CV", left: "72%", top: "62%", delay: "0.8s" },
        { label: "ML", left: "34%", top: "74%", delay: "1.4s" },
        { label: "YOLO", left: "80%", top: "30%", delay: "0.5s" },
        { label: "SHIP", left: "58%", top: "18%", delay: "1.9s" },
        { label: "DEPLOY", left: "12%", top: "62%", delay: "2.5s" },
      ];
  const sceneBackground = isNight
    ? isResearchTrack
      ? "radial-gradient(circle at top, #141a32 0%, #090f1e 42%, #050813 100%)"
      : "radial-gradient(circle at top, #10212d 0%, #08131a 42%, #050b10 100%)"
    : isResearchTrack
      ? "radial-gradient(circle at top, #f7f8ff 0%, #eaedf8 42%, #dde3f2 100%)"
      : "radial-gradient(circle at top, #f6fffc 0%, #e7f3f0 42%, #d8e8e5 100%)";
  const shellBackground = isNight
    ? isResearchTrack
      ? "linear-gradient(180deg, rgba(11,16,31,0.96) 0%, rgba(16,23,39,0.98) 100%)"
      : "linear-gradient(180deg, rgba(9,16,24,0.96) 0%, rgba(12,21,31,0.98) 100%)"
    : "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(245,250,249,0.98) 100%)";
  const shellBorder = isNight
    ? isResearchTrack
      ? "1px solid rgba(101, 117, 169, 0.52)"
      : "1px solid rgba(84, 118, 128, 0.58)"
    : `1px solid ${theme.border}`;
  const shellShadow = isNight
    ? isResearchTrack
      ? "0 30px 90px -40px rgba(2,6,23,0.94), 0 0 0 1px rgba(122,138,255,0.1) inset"
      : "0 30px 90px -40px rgba(2,6,23,0.92), 0 0 0 1px rgba(99,214,190,0.08) inset"
    : "0 26px 70px -42px rgba(2,6,23,0.22)";
  const heroPanelBackground = isNight
    ? isResearchTrack
      ? "linear-gradient(120deg, #12192f 0%, #17213d 100%)"
      : "linear-gradient(120deg, #0f1822 0%, #132230 100%)"
    : isResearchTrack
      ? "linear-gradient(120deg, #ffffff 0%, #f5f7ff 100%)"
      : "#ffffff";
  const hirePanelBackground = isNight
    ? isResearchTrack
      ? "linear-gradient(130deg, #1a2145 0%, #202a5a 100%)"
      : "linear-gradient(130deg, #10262a 0%, #1f2e54 100%)"
    : isResearchTrack
      ? "linear-gradient(130deg, #eef0ff 0%, #edf5ff 100%)"
      : "linear-gradient(130deg, #e8fff7 0%, #edf5ff 100%)";
  const hirePanelText = isNight ? "#ecfffa" : theme.text;
  const hirePanelMuted = isNight ? "rgba(229,246,255,0.88)" : theme.muted;
  const hirePanelLabel = isNight ? "rgba(224,255,246,0.72)" : theme.hint;
  const hireDotActive = isNight ? "#85ffd2" : theme.accent;
  const hireDotIdle = isNight ? "rgba(201,231,255,0.34)" : "rgba(23,143,106,0.2)";
  const contentBackground = isNight ? "rgba(10,17,25,0.82)" : "#ffffff";
  const stripBackground = isNight ? "rgba(62, 83, 92, 0.55)" : theme.border;
  const metricCardBackground = isNight ? "rgba(18, 29, 40, 0.92)" : "#fff";
  const nbsBackground = isNight
    ? isResearchTrack
      ? "linear-gradient(120deg, rgba(16,22,43,0.96) 0%, rgba(20,26,52,0.96) 100%)"
      : "linear-gradient(120deg, rgba(13,24,34,0.96) 0%, rgba(19,26,44,0.96) 100%)"
    : isResearchTrack
      ? "linear-gradient(120deg, #f5f6ff 0%, #eef2ff 100%)"
      : "linear-gradient(120deg, #f4fffb 0%, #f5f8ff 100%)";
  const tabRailBackground = isNight ? "rgba(15,24,34,0.78)" : "transparent";
  const tabActiveBackground = isNight
    ? isResearchTrack
      ? "rgba(38, 49, 97, 0.96)"
      : "rgba(26, 55, 53, 0.96)"
    : isResearchTrack
      ? "#eef0ff"
      : "#edf8f4";
  const tabActiveBorder = isNight
    ? isResearchTrack
      ? "rgba(130, 144, 236, 0.42)"
      : "rgba(90, 190, 161, 0.42)"
    : isResearchTrack
      ? "#d8def8"
      : "#c6e6da";

  useEffect(() => {
    const syncViewport = () => setViewportWidth(window.innerWidth);

    syncViewport();
    window.addEventListener("resize", syncViewport);

    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  const activePopupReason = HIRE_REASONS[popupReasonIndex];

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: sceneBackground,
        padding: isMobile ? "12px 8px 24px" : isTablet ? "18px 10px 32px" : "24px 12px 40px",
        position: "relative",
        overflow: "hidden",
        "--resume-panel": isNight ? "#0f1822" : "#ffffff",
        "--resume-soft-panel": isNight ? "#13202c" : "#f8fbfa",
        "--resume-border": isNight ? "rgba(84, 118, 128, 0.58)" : theme.border,
        "--resume-text": isNight ? "#ebf6f3" : theme.text,
        "--resume-muted": isNight ? "#aac0bb" : theme.muted,
        "--resume-hint": isNight ? "#7f9792" : theme.hint,
        "--resume-accent": isNight ? (isResearchTrack ? "#8ea2ff" : "#49d4a8") : isResearchTrack ? "#5969d8" : theme.accent,
        "--resume-accent-soft": isNight ? (isResearchTrack ? "rgba(142,162,255,0.14)" : "rgba(73,212,168,0.14)") : isResearchTrack ? "rgba(89,105,216,0.1)" : theme.accentSoft,
        "--resume-accent-strong": isNight ? (isResearchTrack ? "#d9e2ff" : "#9cf4d5") : isResearchTrack ? "#4551a8" : "#0f694f",
        "--resume-accent-border": isNight ? (isResearchTrack ? "rgba(142,162,255,0.28)" : "rgba(73,212,168,0.3)") : isResearchTrack ? "#c7cff4" : "#a5dcca",
        "--resume-proof-bg": isNight ? (isResearchTrack ? "rgba(94, 110, 204, 0.2)" : "rgba(77, 90, 168, 0.22)") : theme.violetSoft,
        "--resume-proof-text": isNight ? "#d9e2ff" : theme.violetText,
        "--resume-proof-border": isNight ? (isResearchTrack ? "rgba(142, 162, 255, 0.25)" : "rgba(135, 151, 255, 0.28)") : theme.violetBorder,
      }}
    >
      <style>{`
        @keyframes driftA {
          0% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(30px,-24px,0) scale(1.05); }
          100% { transform: translate3d(0,0,0) scale(1); }
        }
        @keyframes driftB {
          0% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(-26px,18px,0) scale(0.97); }
          100% { transform: translate3d(0,0,0) scale(1); }
        }
        @keyframes orbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes chipFloat {
          0%, 100% { transform: translate3d(0,0,0); }
          50% { transform: translate3d(0,-8px,0); }
        }
        @keyframes gridShift {
          0% { transform: translate3d(0,0,0); }
          100% { transform: translate3d(32px,32px,0); }
        }
        @keyframes sweep {
          0% { transform: translateX(-120%); opacity: 0; }
          40% { opacity: 0.22; }
          100% { transform: translateX(120%); opacity: 0; }
        }
        @keyframes pulseRing {
          0% { transform: scale(0.92); opacity: 0.14; }
          50% { transform: scale(1.05); opacity: 0.3; }
          100% { transform: scale(0.92); opacity: 0.14; }
        }
        @keyframes starBlink {
          0%, 100% { opacity: 0.18; transform: scale(1); }
          50% { opacity: 0.88; transform: scale(1.45); }
        }
        @keyframes dataStream {
          0% { transform: translateY(-16%); opacity: 0; }
          18% { opacity: 0.18; }
          100% { transform: translateY(116%); opacity: 0; }
        }
        @keyframes beamDrift {
          0% { transform: rotate(0deg) translateX(0); opacity: 0.05; }
          50% { transform: rotate(8deg) translateX(18px); opacity: 0.14; }
          100% { transform: rotate(0deg) translateX(0); opacity: 0.05; }
        }
      `}</style>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-120px",
            left: "-160px",
            width: isMobile ? 260 : 460,
            height: isMobile ? 260 : 460,
            borderRadius: "50%",
            background: isNight
              ? "radial-gradient(circle, rgba(35,216,183,0.18) 0%, rgba(35,216,183,0.02) 68%, transparent 100%)"
              : "radial-gradient(circle, rgba(23,143,106,0.16) 0%, rgba(23,143,106,0.02) 68%, transparent 100%)",
            animation: "driftA 12s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "-20% -10%",
            backgroundImage: isNight
              ? "linear-gradient(rgba(78,238,214,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(114,168,255,0.08) 1px, transparent 1px)"
              : "linear-gradient(rgba(23,143,106,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(122,103,255,0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            animation: "gridShift 24s linear infinite",
            opacity: isNight ? 0.18 : 0.16,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "6% 8%",
            borderRadius: "50%",
            border: isNight ? "1px solid rgba(88,211,255,0.1)" : "1px solid rgba(23,143,106,0.08)",
            boxShadow: isNight ? "0 0 120px rgba(53,160,255,0.08) inset" : "0 0 100px rgba(23,143,106,0.05) inset",
            animation: "pulseRing 9s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isNight
              ? "radial-gradient(circle at 22% 18%, rgba(93,243,211,0.14) 0, transparent 18%), radial-gradient(circle at 78% 22%, rgba(126,148,255,0.13) 0, transparent 16%), radial-gradient(circle at 64% 72%, rgba(62,182,255,0.12) 0, transparent 20%)"
              : "radial-gradient(circle at 22% 18%, rgba(23,143,106,0.12) 0, transparent 18%), radial-gradient(circle at 78% 22%, rgba(122,103,255,0.08) 0, transparent 16%), radial-gradient(circle at 64% 72%, rgba(62,182,255,0.08) 0, transparent 20%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "6%",
            top: "12%",
            width: "42%",
            height: "72%",
            background: isNight
              ? "linear-gradient(180deg, rgba(65,198,255,0.14) 0%, transparent 100%)"
              : "linear-gradient(180deg, rgba(23,143,106,0.12) 0%, transparent 100%)",
            clipPath: "polygon(0 0, 92% 0, 72% 100%, 0 100%)",
            filter: "blur(10px)",
            opacity: 0.14,
            animation: "beamDrift 10s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "18%",
              left: "-20%",
              width: "60%",
              height: 2,
              background: isNight
                ? "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.8) 48%, transparent 100%)"
                : "linear-gradient(90deg, transparent 0%, rgba(23,143,106,0.55) 48%, transparent 100%)",
              filter: "blur(.2px)",
              animation: "sweep 7.2s linear infinite",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            inset: "10% 14%",
            opacity: 0.24,
          }}
        >
          {Array.from({ length: 18 }).map((_, idx) => (
            <div
              key={`stream-${idx}`}
              style={{
                position: "absolute",
                left: `${6 + idx * 5.2}%`,
                top: `${(idx % 4) * 8}%`,
                width: 1,
                height: `${22 + (idx % 5) * 8}%`,
                background: isNight
                  ? "linear-gradient(180deg, rgba(111,245,222,0) 0%, rgba(111,245,222,0.5) 30%, rgba(111,245,222,0) 100%)"
                  : "linear-gradient(180deg, rgba(23,143,106,0) 0%, rgba(23,143,106,0.28) 30%, rgba(23,143,106,0) 100%)",
                animation: `dataStream ${7 + (idx % 5)}s linear ${idx * 0.35}s infinite`,
              }}
            />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            right: "-140px",
            top: "70px",
            width: isMobile ? 220 : 420,
            height: isMobile ? 220 : 420,
            borderRadius: "50%",
            background: isNight
              ? "radial-gradient(circle, rgba(109,133,255,0.16) 0%, rgba(109,133,255,0.02) 70%, transparent 100%)"
              : "radial-gradient(circle, rgba(122,103,255,0.12) 0%, rgba(122,103,255,0.02) 70%, transparent 100%)",
            animation: "driftB 14s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: isMobile ? "2%" : "8%",
            top: isMobile ? "12%" : "18%",
            width: isMobile ? 112 : 180,
            height: isMobile ? 112 : 180,
            borderRadius: "50%",
            border: "1px dashed rgba(23,143,106,0.28)",
            animation: "orbit 18s linear infinite",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            pointerEvents: "none",
            opacity: isMobile ? 0.45 : 1,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -18,
              left: "50%",
              transform: "translateX(-50%) rotate(0deg)",
              animation: "bob 4s ease-in-out infinite",
            }}
          >
            <BrainOrbMini size={isMobile ? 34 : 54} />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: isMobile ? "2%" : "10%",
            bottom: isMobile ? "10%" : "14%",
            width: isMobile ? 96 : 140,
            height: isMobile ? 96 : 140,
            borderRadius: "50%",
            border: "1px dashed rgba(122,103,255,0.24)",
            animation: "orbit 14s linear infinite reverse",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            pointerEvents: "none",
            opacity: isMobile ? 0.42 : 1,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -16,
              left: "50%",
              transform: "translateX(-50%) rotate(0deg)",
              animation: "bob 3.2s ease-in-out infinite",
            }}
          >
            <BrainOrbMini size={isMobile ? 28 : 46} />
          </div>
        </div>
        {!isMobile && floatingLabels.map((chip) => (
          <div
            key={chip.label}
            style={{
              position: "absolute",
              left: chip.left,
              top: chip.top,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: ".08em",
              padding: "5px 8px",
              borderRadius: 999,
              color: isNight ? "rgba(204,255,246,0.96)" : "rgba(17, 94, 89, 0.92)",
              border: isNight ? "1px solid rgba(111,245,222,0.28)" : "1px solid rgba(23,143,106,0.28)",
              background: isNight ? "rgba(5,18,26,0.54)" : "rgba(255,255,255,0.76)",
              boxShadow: isNight ? "0 0 22px rgba(37,196,171,0.12)" : "0 0 12px rgba(37,196,171,0.06)",
              animation: `chipFloat 5.6s ease-in-out ${chip.delay} infinite`,
              backdropFilter: "blur(3px)",
            }}
          >
            {chip.label}
          </div>
        ))}
        {!isMobile && [
          { left: "14%", top: "18%", delay: "0s" },
          { left: "28%", top: "34%", delay: "1.2s" },
          { left: "67%", top: "16%", delay: "0.6s" },
          { left: "74%", top: "48%", delay: "1.7s" },
          { left: "52%", top: "78%", delay: "0.9s" },
          { left: "18%", top: "70%", delay: "2.1s" },
        ].map((star, idx) => (
          <span
            key={`star-${idx}`}
            style={{
              position: "absolute",
              left: star.left,
              top: star.top,
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: isNight ? "#cffff6" : "#178f6a",
              boxShadow: isNight ? "0 0 12px rgba(130,255,235,0.78)" : "0 0 10px rgba(23,143,106,0.42)",
              animation: `starBlink ${3.8 + idx * 0.45}s ease-in-out ${star.delay} infinite`,
            }}
          />
        ))}
      </div>
        <div
          style={{
            background: shellBackground,
            width: "min(990px, 100%)",
            margin: "0 auto",
            borderRadius: isMobile ? 14 : 18,
            overflow: "hidden",
          position: "relative",
          fontFamily: "'DM Sans', 'Geist', system-ui, sans-serif",
          border: shellBorder,
          boxShadow: shellShadow,
          backdropFilter: isNight ? "blur(12px)" : "blur(6px)",
          zIndex: 1,
        }}
      >
        <div style={{ padding: isMobile ? "1rem" : isTablet ? "1.4rem 1.1rem 1.2rem" : "2rem 1.5rem 1.5rem", borderBottom: "1px solid var(--resume-border)" }}>
          <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "minmax(0,1.52fr) minmax(210px,0.42fr)", gap: isMobile ? 12 : 14 }}>
            <div
              style={{
                borderRadius: 16,
                border: "1px solid var(--resume-border)",
                background: heroPanelBackground,
                padding: isMobile ? 12 : 16,
                position: "relative",
              }}
            >
              <button
                type="button"
                onClick={() => setIsNight((prev) => !prev)}
                aria-label={isNight ? "Switch to day mode" : "Switch to night mode"}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  width: isMobile ? 38 : 42,
                  height: isMobile ? 38 : 42,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 999,
                  border: "1px solid var(--resume-border)",
                  color: "var(--resume-text)",
                  background: "var(--resume-panel)",
                  boxShadow: "0 14px 28px -20px rgba(2,6,23,0.2)",
                  cursor: "pointer",
                  zIndex: 2,
                }}
                title={isNight ? "Day Mode" : "Night Mode"}
              >
                <ContactIcon type={isNight ? "sun" : "moon"} color={theme.accent} />
              </button>
              <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center", gap: isMobile ? 12 : 16 }}>
                <div
                  style={{
                    width: isMobile ? "68%" : 176,
                    minHeight: isMobile ? 134 : undefined,
                    alignSelf: isMobile ? "auto" : "stretch",
                    borderRadius: 26,
                    border: "1px solid var(--resume-border)",
                    overflow: "hidden",
                    background: "var(--resume-soft-panel)",
                    boxShadow: "0 16px 36px -22px rgba(2,6,23,0.55)",
                    flexShrink: 0,
                    padding: isMobile ? 8 : 0,
                    margin: isMobile ? "0 auto" : 0,
                  }}
                >
                  <Image
                    src="/images/me1.jpg"
                    alt="Nafis Aslam"
                    width={176}
                    height={220}
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: isMobile ? 18 : 0 }}
                    priority
                  />
                </div>
                <div style={{ minWidth: 0, width: "100%", textAlign: isMobile ? "center" : "left" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: isMobile ? "center" : "flex-start", gap: 10, marginBottom: 8, flexWrap: "wrap", paddingRight: isMobile ? 44 : 0 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "5px 10px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: ".06em",
                        textTransform: "uppercase",
                        background: "var(--resume-accent-soft)",
                        border: "1px solid var(--resume-accent-border)",
                        color: "var(--resume-accent-strong)",
                      }}
                    >
                      {trackLabel}
                    </span>
                  </div>
                  <div style={{ fontSize: isMobile ? 28 : 38, fontWeight: 800, lineHeight: 1.02, marginBottom: 8, color: "var(--resume-text)" }}>Nafis Aslam</div>
                  <div style={{ fontSize: isMobile ? 12 : 13, color: "var(--resume-muted)", lineHeight: 1.65 }}>
                    ML / Computer Vision Engineer · Open to Remote
                    <br />
                    USM, Malaysia(AI Major) · MIT MicroMasters 
                  </div>
                  {isMobile ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10, alignItems: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 10,
                          width: "88%",
                        }}
                      >
                        <a
                          href={cvHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            fontSize: 12,
                            fontWeight: 700,
                            padding: "9px 14px",
                            borderRadius: 999,
                            textDecoration: "none",
                            color: "var(--resume-text)",
                            background: "var(--resume-panel)",
                            border: "1px solid var(--resume-border)",
                            boxShadow: "0 14px 28px -20px rgba(2,6,23,0.2)",
                            width: "calc(100% - 64px)",
                            flex: 1,
                          }}
                        >
                          Download CV
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            setPopupReasonIndex(0);
                            setShowReasons(true);
                          }}
                          style={{
                            width: 54,
                            height: 36,
                            borderRadius: 999,
                            border: "1px solid var(--resume-accent-border)",
                            background: "var(--resume-accent-soft)",
                            color: "var(--resume-accent-strong)",
                            boxShadow: "0 14px 28px -20px rgba(2,6,23,0.2)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            fontSize: 11,
                            fontWeight: 800,
                            lineHeight: 1,
                            cursor: "pointer",
                            padding: 0,
                            flexShrink: 0,
                          }}
                        >
                          Why Me?
                        </button>
                      </div>
                      <Link
                        href="/"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          fontSize: 13,
                          fontWeight: 700,
                          padding: "10px 16px",
                          borderRadius: 999,
                          textDecoration: "none",
                          color: "#ffffff",
                          background: `linear-gradient(120deg, ${theme.accent} 0%, #0f694f 100%)`,
                          boxShadow: "0 14px 28px -18px rgba(15,105,79,0.72)",
                          width: "88%",
                        }}
                      >
                        Return to Nafis&apos; World
                      </Link>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
                      <a
                        href={cvHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          fontSize: 13,
                          fontWeight: 700,
                          padding: "10px 16px",
                          borderRadius: 999,
                          textDecoration: "none",
                          color: "var(--resume-text)",
                          background: "var(--resume-panel)",
                          border: "1px solid var(--resume-border)",
                          boxShadow: "0 14px 28px -20px rgba(2,6,23,0.2)",
                        }}
                      >
                        Download CV
                      </a>
                      <Link
                        href="/"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          fontSize: 13,
                          fontWeight: 700,
                          padding: "10px 16px",
                          borderRadius: 999,
                          textDecoration: "none",
                          color: "#ffffff",
                          background: `linear-gradient(120deg, ${theme.accent} 0%, #0f694f 100%)`,
                          boxShadow: "0 14px 28px -18px rgba(15,105,79,0.72)",
                        }}
                      >
                        Return to Nafis&apos; World
                      </Link>
                    </div>
                  )}
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: isMobile ? "center" : "flex-start", gap: 8, marginTop: 10 }}>
                    <ContactBubble href="mailto:nafisaslam1819@gmail.com" label="nafisaslam1819@gmail.com" icon="mail" />
                    <ContactBubble href="https://nafisaslam.com" label="nafisaslam.com" icon="web" />
                    <ContactBubble href="https://github.com/NafisAslam70" label="github.com/NafisAslam70" icon="github" />
                    <ContactBubble href="https://www.linkedin.com/in/nafis-aslam/" label="linkedin.com/in/nafis-aslam" icon="linkedin" />
                    <ContactBubble href="https://medium.com/@nafisaslam" label="medium.com/@nafisaslam" icon="medium" />
                    <ContactBubble href="https://doi.org/10.5281/zenodo.19266394" label="Preprint DOI" icon="doi" />
                  </div>
                </div>
              </div>
            </div>
            {!isMobile ? (
              <div
                style={{
                  borderRadius: 16,
                  border: "1px solid var(--resume-border)",
                  background: hirePanelBackground,
                  padding: 14,
                  color: hirePanelText,
                  minHeight: 158,
                  maxWidth: isTablet ? "none" : 248,
                  justifySelf: isTablet ? "stretch" : "end",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: hirePanelLabel, fontWeight: 700 }}>
                  Why You Should Hire Me?
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{HIRE_REASONS[0].title}</div>
                  <p style={{ fontSize: 13, lineHeight: 1.58, color: hirePanelMuted }}>{HIRE_REASONS[0].text}</p>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {HIRE_REASONS.map((_, idx) => (
                    <span
                      key={`reason-dot-static-${idx}`}
                      style={{
                        width: idx === 0 ? 20 : 8,
                        height: 8,
                        borderRadius: 999,
                        background: idx === 0 ? hireDotActive : hireDotIdle,
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, minmax(0, 1fr))" : "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 10,
            background: "transparent",
            borderBottom: "1px solid var(--resume-border)",
            margin: isMobile ? "0 1rem" : "0 1.5rem",
            borderRadius: 12,
            padding: "10px 0 0",
          }}
        >
          {PROFILE_CARDS.map((item) => (
            <a
              key={item.title}
              href={item.href}
              style={{
                background: metricCardBackground,
                padding: isMobile ? "12px 10px" : "16px 14px",
                textDecoration: "none",
                display: "block",
                color: "inherit",
                border: "1px solid var(--resume-border)",
                borderRadius: 14,
                boxShadow: "0 14px 28px -24px rgba(2,6,23,0.28)",
              }}
            >
              <div
                style={{
                  fontSize: isMobile ? 13 : 18,
                  fontWeight: 700,
                  color: "var(--resume-accent)",
                  lineHeight: 1.15,
                  paddingBottom: 6,
                  marginBottom: 6,
                  borderBottom: "1px solid var(--resume-border)",
                }}
              >
                {item.title}
              </div>
              <div style={{ fontSize: isMobile ? 10 : 11, color: "var(--resume-hint)", lineHeight: 1.45 }}>{item.subtitle}</div>
            </a>
          ))}
        </div>

        <div
          style={{
            margin: "12px 1.5rem 0",
            marginInline: isMobile ? "1rem" : "1.5rem",
            borderRadius: 12,
            border: "1px solid var(--resume-border)",
            background: nbsBackground,
            padding: isMobile ? "12px" : "14px 16px",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: isMobile ? 72 : 84,
                height: isMobile ? 72 : 84,
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "1px solid var(--resume-border)",
                boxShadow: "0 14px 30px -22px rgba(2,6,23,0.28)",
                flexShrink: 0,
                position: "relative",
                overflow: "visible",
              }}
            >
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  animation: "bob 3.6s ease-in-out infinite",
                }}
              >
                <Image
                  src="/images/brain-badge.svg"
                  alt="NBS brain"
                  width={isMobile ? 54 : 62}
                  height={isMobile ? 54 : 62}
                  style={{ width: isMobile ? 54 : 62, height: isMobile ? 54 : 62 }}
                />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--resume-text)" }}>Nafees Brain Society</div>
              <div style={{ fontSize: 12, color: "var(--resume-muted)", lineHeight: 1.6, marginTop: 4 }}>
                For full brain architecture details, view it on the website.
              </div>
            </div>
          </div>
          <a
            href="/nbs"
            style={{
              whiteSpace: "nowrap",
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 700,
              color: "var(--resume-accent-strong)",
              background: metricCardBackground,
              border: "1px solid var(--resume-border)",
              borderRadius: 999,
              padding: "7px 12px",
              alignSelf: isMobile ? "flex-start" : "auto",
            }}
          >
            Open NBS →
          </a>
        </div>

        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--resume-border)",
            padding: isMobile ? "8px 1rem 0" : "8px 1.2rem 0",
            overflowX: "auto",
            gap: 6,
            background: tabRailBackground,
            position: "relative",
          }}
        >
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              style={{
                fontSize: isMobile ? 12 : 13,
                padding: "8px 14px",
                cursor: "pointer",
                color: activeTab === i ? theme.accent : theme.hint,
                background: activeTab === i ? tabActiveBackground : "transparent",
                border: activeTab === i ? `1px solid ${tabActiveBorder}` : "1px solid transparent",
                borderBottom: activeTab === i ? `1px solid ${tabActiveBorder}` : "1px solid transparent",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                fontWeight: activeTab === i ? 700 : 500,
                whiteSpace: "nowrap",
              }}
            >
              {tab}
            </button>
          ))}
          {isMobile ? (
            <div
              style={{
                position: "sticky",
                right: 0,
                display: "flex",
                alignItems: "center",
                paddingLeft: 10,
                marginLeft: -4,
                background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${contentBackground} 26%)`,
                pointerEvents: "none",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "4px 8px",
                  borderRadius: 999,
                  border: "1px solid var(--resume-accent-border)",
                  background: "var(--resume-accent-soft)",
                  color: "var(--resume-accent-strong)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                Swipe
              </span>
            </div>
          ) : null}
        </div>

        <div style={{ padding: isMobile ? "1rem" : "1.5rem", background: contentBackground }}>
          <ActiveSection isMobile={isMobile} isTablet={isTablet} />
        </div>
      </div>
      {showReasons ? (
        <div
          onClick={() => setShowReasons(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background: "rgba(2, 6, 23, 0.68)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "14px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(760px, 100%)",
              maxHeight: "88dvh",
              overflow: "auto",
              borderRadius: 18,
              border: "1px solid var(--resume-border)",
              background: shellBackground,
              boxShadow: shellShadow,
              padding: isMobile ? "14px" : "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--resume-hint)" }}>
                  Why You Should Hire Me?
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--resume-text)", marginTop: 4 }}>
                  Quick reasons
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowReasons(false)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 999,
                  border: "1px solid var(--resume-border)",
                  background: "var(--resume-panel)",
                  color: "var(--resume-text)",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 12 }}>
              <button
                type="button"
                onClick={() => setPopupReasonIndex((prev) => (prev - 1 + HIRE_REASONS.length) % HIRE_REASONS.length)}
                aria-label="Previous reason"
                style={{
                  width: isMobile ? 38 : 42,
                  height: isMobile ? 38 : 42,
                  borderRadius: 999,
                  border: "1px solid var(--resume-border)",
                  background: "var(--resume-panel)",
                  color: "var(--resume-text)",
                  cursor: "pointer",
                  flexShrink: 0,
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                ←
              </button>
              <article
                style={{
                  flex: 1,
                  border: "1px solid var(--resume-border)",
                  borderRadius: 14,
                  padding: isMobile ? "14px" : "16px",
                  background: popupReasonIndex % 2 === 0 ? "var(--resume-soft-panel)" : "var(--resume-panel)",
                  minHeight: isMobile ? 210 : 190,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--resume-hint)" }}>
                    Reason {popupReasonIndex + 1}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--resume-accent-strong)" }}>
                    {popupReasonIndex + 1} / {HIRE_REASONS.length}
                  </div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--resume-text)", marginBottom: 10 }}>
                  {activePopupReason.title}
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--resume-muted)", margin: 0 }}>
                  {activePopupReason.text}
                </p>
              </article>
              <button
                type="button"
                onClick={() => setPopupReasonIndex((prev) => (prev + 1) % HIRE_REASONS.length)}
                aria-label="Next reason"
                style={{
                  width: isMobile ? 38 : 42,
                  height: isMobile ? 38 : 42,
                  borderRadius: 999,
                  border: "1px solid var(--resume-border)",
                  background: "var(--resume-panel)",
                  color: "var(--resume-text)",
                  cursor: "pointer",
                  flexShrink: 0,
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                →
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
