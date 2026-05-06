"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const TABS = ["Overview", "Projects", "Experience", "Skills", "Education", "Achievements"];
const BrainOrbMini = dynamic(() => import("@/components/BrainOrbMini"), { ssr: false });

const theme = {
  bg: "#edf3f2",
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
  color: theme.hint,
  marginBottom: 12,
};

const card = {
  background: theme.panel,
  border: `1px solid ${theme.border}`,
  borderRadius: 14,
  padding: "1rem 1.1rem",
};

const HIRE_REASONS = [
  {
    title: "Reason 1 · Proven Real-time Delivery",
    text: "Built and shipped a real-time CV system with sub-50ms CPU inference, not just a notebook prototype.",
  },
  {
    title: "Reason 2 · Research + Execution Combo",
    text: "Strong academic grounding (MIT DSML + USM AI) plus practical product shipping discipline.",
  },
  {
    title: "Reason 3 · Evidence-linked Work",
    text: "Each major claim has proof: live demo, first-author preprint, and public code/research footprint.",
  },
  {
    title: "Reason 4 · Ownership Mindset",
    text: "Comfortable taking scoped goals end-to-end: build, validate, iterate, and ship usable outcomes.",
  },
];

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
      background: theme.violetSoft,
      color: theme.violetText,
      border: `1px solid ${theme.violetBorder}`,
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
      border: `1px solid ${theme.border}`,
      color: theme.muted,
      textDecoration: "none",
      background: "#f8fbfa",
    }}
  >
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: theme.accent,
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
      background: theme.violetSoft,
      color: theme.violetText,
      border: `1px solid ${theme.violetBorder}`,
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
      background: hot ? theme.accentSoft : "#f6f9f8",
      border: `1px solid ${hot ? "#a5dcca" : theme.border}`,
      color: hot ? "#0f694f" : theme.muted,
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
      background: green ? theme.accentSoft : "#f6f9f8",
      color: green ? "#0f694f" : theme.muted,
      border: `1px solid ${green ? "#a5dcca" : theme.border}`,
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
        background: theme.accent,
        border: "2px solid #fff",
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
          background: theme.border,
        }}
      />
    )}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>{title}</div>
      <div style={{ fontSize: 11, color: theme.hint, whiteSpace: "nowrap", marginTop: 3, fontWeight: 600 }}>{date}</div>
    </div>
    <div style={{ fontSize: 12, color: theme.accent, marginBottom: 7, marginTop: 2, fontWeight: 600 }}>{company}</div>
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {bullets.map((b, i) => (
        <li key={i} style={{ fontSize: 13, color: theme.muted, lineHeight: 1.6, padding: "2px 0 2px 14px", position: "relative" }}>
          <span style={{ position: "absolute", left: 2, color: theme.accent }}>·</span>
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
      borderBottom: `1px solid ${theme.border}`,
    }}
  >
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: theme.accentSoft,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontSize: 12,
        color: "#0f694f",
        fontWeight: 700,
      }}
    >
      {icon}
    </div>
    <div style={{ fontSize: 13, lineHeight: 1.55, color: theme.muted }}>{children}</div>
  </div>
);

function Overview() {
  return (
    <div>
      <div
        style={{
          background: theme.accentSoft,
          border: "1px solid #a5dcca",
          borderRadius: 14,
          padding: "1rem 1.1rem",
          fontSize: 14,
          lineHeight: 1.65,
          color: "#0f694f",
          marginBottom: 22,
        }}
      >
        A highly motivated ML/Computer Vision engineer who ships systems that work outside the lab: fast, deployable,
        and grounded in real problems. Built a real-time attention monitor (YOLO + MediaPipe, &lt;50ms CPU) with a
        first-author preprint, while completing a graduate-level MIT program self-funded alongside a full degree.
      </div>

      <div style={sectionTitle}>Highlights</div>

      <AchRow icon="★">
        <strong style={{ color: theme.text, fontWeight: 700 }}>Gold Award (Top 5%)</strong> — USM PIXEL 2025 for DeepWork AI, a real-time attention monitoring system using YOLO + MediaPipe.
        <ProofTag href="https://doi.org/10.5281/zenodo.19266394">Preprint</ProofTag>
      </AchRow>
      <AchRow icon="★">
        <strong style={{ color: theme.text, fontWeight: 700 }}>MIT MicroMasters</strong> — 16-month graduate-level Stats & Data Science program, self-funded alongside full BSc.{" "}
        <MetaPill green>93% in Data Analysis</MetaPill>
      </AchRow>
      <AchRow icon="★">
        <strong style={{ color: theme.text, fontWeight: 700 }}>First-Author Preprint</strong> — DeepLens Engine for Focus (DLEF), Zenodo 2026. Novel 20/30s temporal heuristic for attention modelling.
        <ProofTag href="https://doi.org/10.5281/zenodo.19266394">DOI</ProofTag>
      </AchRow>
      <AchRow icon="★">
        <strong style={{ color: theme.text, fontWeight: 700 }}>Gold Honor (Top 2%)</strong> — International Youth Math Challenge 2020
      </AchRow>
      <AchRow icon="★">
        <strong style={{ color: theme.text, fontWeight: 700 }}>Dean&apos;s List</strong> — 3 consecutive final semesters at USM. Major GPA: 9.55/10 (3.82/4.00)
      </AchRow>

      <div
        style={{
          marginTop: 28,
          background: `linear-gradient(120deg, ${theme.accent} 0%, #13a37b 100%)`,
          borderRadius: 14,
          padding: "1.2rem 1.35rem",
          display: "flex",
          alignItems: "center",
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
            background: "#fff",
            color: theme.accent,
            borderRadius: 10,
            padding: "8px 16px",
            fontSize: 13,
            fontWeight: 700,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          Get in touch
        </a>
      </div>
    </div>
  );
}

function Projects() {
  return (
    <div>
      <div style={{ ...card, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6, gap: 10 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>DeepWork AI / DeepLens Engine for Focus</div>
            <div style={{ fontSize: 12, color: theme.hint, marginTop: 2 }}>2024-2025 · Flagship Project</div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: "#f9edd7", color: "#6a3b07", border: "1px solid #f6c773" }}>Gold Award</span>
        </div>
        <p style={{ fontSize: 13, color: theme.muted, lineHeight: 1.6, margin: "0 0 10px" }}>
          Real-time CV system classifying 6 attention/behaviour states from webcam feed. Engineered a 20/30s temporal
          heuristic treating attention as a time-series signal, not per-frame output.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", margin: "8px 0" }}>
          {["YOLOv11n-cls", "MediaPipe", "OpenCV", "PyTorch", "Next.js", "Flask", "Docker"].map((t) => (
            <StackTag key={t}>{t}</StackTag>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 8, margin: "10px 0" }}>
          {[["<50ms", "CPU latency"], ["6", "States"], ["0", "Video stored"]].map(([v, l]) => (
            <div key={l} style={{ background: "#f6f9f8", borderRadius: 10, padding: 8, textAlign: "center", border: `1px solid ${theme.border}` }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: theme.accent }}>{v}</div>
              <div style={{ fontSize: 11, color: theme.hint, marginTop: 2 }}>{l}</div>
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
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: theme.text }}>WorldQuant CV & DL Fellowship Projects</div>
        <div style={{ fontSize: 12, color: theme.hint, marginBottom: 8 }}>2026-present</div>
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 10px" }}>
          {[
            "Wildlife camera-trap classification (Côte d'Ivoire) using multi-class CNN + cloud VM",
            "Crop disease classification (Uganda, 5 classes) with fine-tuned ResNet transfer learning",
            "MLP regression & classification from manual backprop to PyTorch implementation",
          ].map((b, i) => (
            <li key={i} style={{ fontSize: 13, color: theme.muted, lineHeight: 1.6, padding: "2px 0 2px 14px", position: "relative" }}>
              <span style={{ position: "absolute", left: 4, color: theme.accent }}>·</span>{b}
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
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: theme.text }}>School Management Platform — Meed Public School</div>
        <div style={{ fontSize: 12, color: theme.hint, marginBottom: 8 }}>Oct 2025-Feb 2026 · Freelance</div>
        <p style={{ fontSize: 13, color: theme.muted, lineHeight: 1.6, margin: "0 0 10px" }}>
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

function Skills() {
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 12, marginBottom: 20 }}>
        {cats.map(({ title, skills }) => (
          <div key={title} style={{ ...card, background: "#f8fbfa" }}>
            <div style={sectionTitle}>{title}</div>
            {skills.map(([s, hot]) => (
              <SkillTag key={s} hot={hot}>{s}</SkillTag>
            ))}
          </div>
        ))}
      </div>
      <div style={sectionTitle}>Proven in production</div>
      <div style={{ fontSize: 13, color: theme.muted, lineHeight: 1.8 }}>
        YOLO + MediaPipe → shipped real-time web app · Flask + Docker → on-device inference, zero video storage · Next.js + NeonDB → live school platform · ARIMA + GBM → forecasting pipeline
      </div>
    </div>
  );
}

function Education() {
  return (
    <div>
      <div style={{ ...card, marginBottom: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3, color: theme.text }}>Massachusetts Institute of Technology (MITx / edX)</div>
        <div style={{ fontSize: 13, color: theme.muted, marginBottom: 6 }}>MicroMasters in Statistics and Data Science</div>
        <div style={{ fontSize: 12, color: theme.hint, marginBottom: 10 }}>Aug 2024-Dec 2025 · 16 months · self-funded · 10-15 hrs/week with full degree</div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <MetaPill green>Data Analysis: 93%</MetaPill>
          <MetaPill green>Machine Learning: 83%</MetaPill>
          <MetaPill>Probability: 78%</MetaPill>
          <MetaPill>Statistics: 60%</MetaPill>
          <MetaPill>Capstone: 73%</MetaPill>
        </div>
      </div>
      <div style={card}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3, color: theme.text }}>Universiti Sains Malaysia (USM)</div>
        <div style={{ fontSize: 13, color: theme.muted, marginBottom: 6 }}>BSc (Hons.) Computer Science — Intelligent Computing (AI)</div>
        <div style={{ fontSize: 12, color: theme.hint, marginBottom: 10 }}>2021-2025 · Penang, Malaysia</div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <MetaPill green>Major GPA: 9.55/10 · 3.82/4.00</MetaPill>
          <MetaPill>CGPA: 8.3/10 · 3.32/4.00</MetaPill>
          <MetaPill green>Dean&apos;s List × 3</MetaPill>
          <MetaPill green>Gold Award — PIXEL 2025 (top 5%)</MetaPill>
        </div>
        <div style={{ fontSize: 12, color: theme.hint, marginTop: 8 }}>Trajectory: 3.49 → 3.65 → 3.73 → 3.82 (final 4 semesters)</div>
      </div>
    </div>
  );
}

function Achievements() {
  return (
    <div>
      <AchRow icon="P">
        <strong style={{ color: theme.text, fontWeight: 700 }}>First-author preprint</strong> — DeepLens Engine for Focus, Zenodo 2026.
        <ProofTag href="https://doi.org/10.5281/zenodo.19266394">DOI: 10.5281/zenodo.19266394</ProofTag>
      </AchRow>
      <AchRow icon="G">
        <strong style={{ color: theme.text, fontWeight: 700 }}>Gold Award (Top 5%)</strong> — USM PIXEL 2025 for DeepWork AI / DLEF system
      </AchRow>
      <AchRow icon="M">
        <strong style={{ color: theme.text, fontWeight: 700 }}>Gold Honor (Top 2%)</strong> — International Youth Math Challenge 2020
      </AchRow>
      <AchRow icon="D">
        <strong style={{ color: theme.text, fontWeight: 700 }}>Dean&apos;s List</strong> — 3 consecutive final semesters, USM. GPA trajectory: 3.49 → 3.82
      </AchRow>
      <AchRow icon="L">
        <strong style={{ color: theme.text, fontWeight: 700 }}>Leadership</strong> — Superintendent, Meed Public School (2018-2022). Directed academics and operations for 300+ students.
      </AchRow>
      <AchRow icon="C">
        <strong style={{ color: theme.text, fontWeight: 700 }}>Competitive programming</strong> — Active on LeetCode (~50 problems), Kaggle.
        <ProofTag href="https://github.com/NafisAslam70">GitHub</ProofTag>
      </AchRow>
      <AchRow icon="L">
        <strong style={{ color: theme.text, fontWeight: 700 }}>Languages</strong> — English (fluent), Hindi (native), Urdu (native), Bahasa Malaysia (basic)
      </AchRow>
    </div>
  );
}

const TAB_COMPONENTS = [Overview, Projects, Experience, Skills, Education, Achievements];

export default function HireMePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [reasonIndex, setReasonIndex] = useState(0);
  const ActiveSection = TAB_COMPONENTS[activeTab];

  useEffect(() => {
    const id = window.setInterval(() => {
      setReasonIndex((prev) => (prev + 1) % HIRE_REASONS.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: `linear-gradient(180deg, ${theme.bg} 0%, #f7fbfa 100%)`,
        padding: "24px 12px 40px",
        position: "relative",
        overflow: "hidden",
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
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(23,143,106,0.18) 0%, rgba(23,143,106,0.02) 68%, transparent 100%)",
            animation: "driftA 12s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "-20% -10%",
            backgroundImage:
              "linear-gradient(rgba(23,143,106,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(122,103,255,0.07) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            animation: "gridShift 18s linear infinite",
            opacity: 0.32,
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
              background: "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.8) 48%, transparent 100%)",
              filter: "blur(.2px)",
              animation: "sweep 7.2s linear infinite",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            right: "-140px",
            top: "70px",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(122,103,255,0.14) 0%, rgba(122,103,255,0.02) 70%, transparent 100%)",
            animation: "driftB 14s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "8%",
            top: "18%",
            width: 180,
            height: 180,
            borderRadius: "50%",
            border: "1px dashed rgba(23,143,106,0.28)",
            animation: "orbit 18s linear infinite",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            pointerEvents: "none",
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
            <BrainOrbMini size={54} />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: "10%",
            bottom: "14%",
            width: 140,
            height: 140,
            borderRadius: "50%",
            border: "1px dashed rgba(122,103,255,0.24)",
            animation: "orbit 14s linear infinite reverse",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            pointerEvents: "none",
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
            <BrainOrbMini size={46} />
          </div>
        </div>
        {[
          { label: "DL", left: "18%", top: "26%", delay: "0s" },
          { label: "CV", left: "72%", top: "62%", delay: "0.8s" },
          { label: "ML", left: "34%", top: "74%", delay: "1.4s" },
          { label: "YOLO", left: "80%", top: "30%", delay: "0.5s" },
          { label: "CNN", left: "58%", top: "18%", delay: "1.9s" },
          { label: "ViT", left: "12%", top: "62%", delay: "2.5s" },
        ].map((chip) => (
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
              color: "rgba(17, 94, 89, 0.92)",
              border: "1px solid rgba(23,143,106,0.28)",
              background: "rgba(255,255,255,0.72)",
              animation: `chipFloat 5.6s ease-in-out ${chip.delay} infinite`,
              backdropFilter: "blur(3px)",
            }}
          >
            {chip.label}
          </div>
        ))}
      </div>
      <div
        style={{
          background: theme.panel,
          width: "min(1080px, 100%)",
          margin: "0 auto",
          borderRadius: 18,
          overflow: "hidden",
          position: "relative",
          fontFamily: "'DM Sans', 'Geist', system-ui, sans-serif",
          border: `1px solid ${theme.border}`,
          boxShadow: "0 24px 64px -38px rgba(2,6,23,0.25)",
          zIndex: 1,
        }}
      >
        <div style={{ padding: "2rem 1.5rem 1.5rem", borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(280px,0.8fr)", gap: 16 }}>
            <div
              style={{
                borderRadius: 16,
                border: `1px solid ${theme.border}`,
                background: "linear-gradient(120deg, #f8fdfa 0%, #f5f8ff 100%)",
                padding: 14,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div
                  style={{
                    width: 122,
                    height: 122,
                    borderRadius: 22,
                    border: `1px solid ${theme.border}`,
                    overflow: "hidden",
                    background: "#f6f9f8",
                    boxShadow: "0 10px 24px -18px rgba(2,6,23,0.55)",
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src="/images/me1.jpg"
                    alt="Nafis Aslam"
                    width={122}
                    height={122}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    priority
                  />
                </div>
                <div>
                  <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.05, marginBottom: 6, color: theme.text }}>Nafis Aslam</div>
                  <div style={{ fontSize: 13, color: theme.muted, lineHeight: 1.65 }}>
                    ML / Computer Vision Engineer · Open to Remote
                    <br />
                    USM (AI Major) · MIT MicroMasters · First-Author Preprint
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
                    <a
                      href="mailto:nafisaslam1819@gmail.com"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        padding: "8px 14px",
                        borderRadius: 999,
                        border: `1px solid ${theme.border}`,
                        color: theme.muted,
                        textDecoration: "none",
                        background: "#f8fbfa",
                      }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: theme.accent, display: "inline-block" }} />
                      nafisaslam1819@gmail.com
                    </a>
                    <a
                      href="https://nafisaslam.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        padding: "8px 14px",
                        borderRadius: 999,
                        border: `1px solid ${theme.border}`,
                        color: theme.muted,
                        textDecoration: "none",
                        background: "#f8fbfa",
                      }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: theme.accent, display: "inline-block" }} />
                      nafisaslam.com
                    </a>
                    <a
                      href="https://github.com/NafisAslam70"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        padding: "8px 14px",
                        borderRadius: 999,
                        border: `1px solid ${theme.border}`,
                        color: theme.muted,
                        textDecoration: "none",
                        background: "#f8fbfa",
                      }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: theme.accent, display: "inline-block" }} />
                      github.com/NafisAslam70
                    </a>
                    <a
                      href="https://doi.org/10.5281/zenodo.19266394"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        padding: "8px 14px",
                        borderRadius: 999,
                        border: `1px solid ${theme.border}`,
                        color: theme.muted,
                        textDecoration: "none",
                        background: "#f8fbfa",
                      }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: theme.accent, display: "inline-block" }} />
                      Preprint DOI
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                borderRadius: 16,
                border: `1px solid ${theme.border}`,
                background: "linear-gradient(130deg, #10262a 0%, #1f2e54 100%)",
                padding: 14,
                color: "#ecfffa",
                minHeight: 158,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "rgba(224,255,246,0.72)", fontWeight: 700 }}>
                Why Should Hire Me
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{HIRE_REASONS[reasonIndex].title}</div>
                <p style={{ fontSize: 13, lineHeight: 1.58, color: "rgba(229,246,255,0.88)" }}>{HIRE_REASONS[reasonIndex].text}</p>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {HIRE_REASONS.map((_, idx) => (
                  <span
                    key={`reason-dot-${idx}`}
                    style={{
                      width: idx === reasonIndex ? 20 : 8,
                      height: 8,
                      borderRadius: 999,
                      transition: "all .25s ease",
                      background: idx === reasonIndex ? "#85ffd2" : "rgba(201,231,255,0.34)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 1,
            background: theme.border,
            borderBottom: `1px solid ${theme.border}`,
            margin: "0 1.5rem",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {[["<50ms", "CPU inference"], ["9.55", "Major GPA / 10"], ["16mo", "MIT ML training"], ["6", "Attention states"]].map(([n, l]) => (
            <div key={l} style={{ background: "#fff", padding: "10px 12px" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: theme.accent }}>{n}</div>
              <div style={{ fontSize: 11, color: theme.hint, marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            margin: "12px 1.5rem 0",
            borderRadius: 12,
            border: `1px solid ${theme.border}`,
            background: "linear-gradient(120deg, #eaf7f2 0%, #eef2ff 100%)",
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#ffffff",
                border: `1px solid ${theme.border}`,
              }}
            >
              <BrainOrbMini size={40} glow={false} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>NBS Brain</div>
              <div style={{ fontSize: 12, color: theme.muted }}>For full brain architecture details, view it on the website.</div>
            </div>
          </div>
          <a
            href="/nbs"
            style={{
              whiteSpace: "nowrap",
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 700,
              color: "#0f694f",
              background: "#ffffff",
              border: `1px solid ${theme.border}`,
              borderRadius: 999,
              padding: "7px 12px",
            }}
          >
            Open NBS →
          </a>
        </div>

        <div
          style={{
            display: "flex",
            borderBottom: `1px solid ${theme.border}`,
            padding: "8px 1.2rem 0",
            overflowX: "auto",
            gap: 6,
          }}
        >
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              style={{
                fontSize: 13,
                padding: "8px 14px",
                cursor: "pointer",
                color: activeTab === i ? theme.accent : theme.hint,
                background: activeTab === i ? "#e9f7f1" : "transparent",
                border: activeTab === i ? "1px solid #b7e5d5" : "1px solid transparent",
                borderBottom: activeTab === i ? "1px solid #b7e5d5" : "1px solid transparent",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                fontWeight: activeTab === i ? 700 : 500,
                whiteSpace: "nowrap",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ padding: "1.5rem" }}>
          <ActiveSection />
        </div>
      </div>
    </div>
  );
}
