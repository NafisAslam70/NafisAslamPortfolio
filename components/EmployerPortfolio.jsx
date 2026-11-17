'use client';

import Image from "next/image";
import Link from "next/link";
import ProjectGallery from "@/components/ProjectGallery";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import { FaGithub, FaArrowUpRightFromSquare, FaEnvelope, FaWhatsapp, FaLinkedinIn } from "react-icons/fa6";
import { mitMicroMastersProjects, researchProjectPreviews } from "@/content/academicProjects";

function TiltCard({ children, className = "", style = {}, dir, id }) {
  const reduceMotion = useReducedMotion();
  const rotateX = useSpring(0, { stiffness: 180, damping: 18, mass: 0.4 });
  const rotateY = useSpring(0, { stiffness: 180, damping: 18, mass: 0.4 });

  function handlePointerMove(event) {
    if (reduceMotion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    rotateY.set((x - 0.5) * 9);
    rotateX.set((0.5 - y) * 7);
  }

  function resetTilt() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.article
      id={id}
      dir={dir}
      className={`portfolio-tilt ${className}`}
      style={{ ...style, rotateX, rotateY, transformPerspective: 1100 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduceMotion ? undefined : { y: -5, scale: 1.012 }}
      whileTap={reduceMotion ? undefined : { scale: 0.995 }}
    >
      <div className="portfolio-tilt-content"><div className="scroll-reveal-content">{children}</div></div>
    </motion.article>
  );
}

const HERO_ROLES = {
  en: [
    { article: "a", title: "Software Engineer" },
    { article: "an", title: "AI Automation Engineer" },
    { article: "a", title: "Junior Researcher" },
    { article: "a", title: "Full-Stack Developer" },
  ],
  ar: [
    { article: "", title: "مهندس برمجيات" },
    { article: "", title: "مهندس أتمتة الذكاء الاصطناعي" },
    { article: "", title: "باحث مبتدئ" },
    { article: "", title: "مطور برمجيات متكاملة" },
  ],
};
const MOBILE_NAV_SECTION_IDS = ["overview", "experience", "projects", "education", "contact"];

function TypedHeroRole({ lang }) {
  const roles = HERO_ROLES[lang] || HERO_ROLES.en;
  const [text, setText] = useState(roles[0].title);
  const [article, setArticle] = useState(roles[0].article);

  useEffect(() => {
    setText(roles[0].title);
    setArticle(roles[0].article);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    let phraseIndex = 0;
    let characterIndex = roles[0].title.length;
    let deleting = false;
    let pause = 18;
    const timer = window.setInterval(() => {
      if (pause > 0) {
        pause -= 1;
        return;
      }
      const phrase = roles[phraseIndex].title;
      if (!deleting) {
        characterIndex += 1;
        setText(phrase.slice(0, characterIndex));
        if (characterIndex >= phrase.length) {
          deleting = true;
          pause = 18;
        }
      } else {
        characterIndex -= 1;
        setText(phrase.slice(0, characterIndex));
        if (characterIndex <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % roles.length;
          setArticle(roles[phraseIndex].article);
          pause = 3;
        }
      }
    }, 75);
    return () => window.clearInterval(timer);
  }, [roles]);

  const prefix = lang === "ar" ? "أنا" : `I'm ${article}`;
  const accessibleRoles = roles.map(({ article: roleArticle, title }) => lang === "ar" ? title : `${roleArticle} ${title}`).join(", ");
  return <p className="hero-typed-role" aria-label={`${lang === "ar" ? "أنا" : "I'm"} ${accessibleRoles}`} dir={lang === "ar" ? "rtl" : "ltr"}><span>{prefix}</span><span className="hero-typed-role-title">{text}</span><i aria-hidden="true" /></p>;
}

function ScrollExperience() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const openProjectsPage = (event) => {
      if (event.target.closest(".experience-primary-project-link")) {
        event.preventDefault();
        window.location.assign("/ventures");
      }
    };
    document.addEventListener("click", openProjectsPage);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    const context = gsap.context(() => {
      gsap.to(".portfolio-scroll-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: prefersReducedMotion ? false : 0.35,
          onUpdate: prefersReducedMotion ? (self) => gsap.set(".portfolio-scroll-progress", { scaleX: self.progress }) : undefined,
        },
      });

      if (!prefersReducedMotion) {
        gsap.set(".scroll-orbit-ring-one", { transformOrigin: "50% 50%" });
        gsap.set(".scroll-orbit-ring-two", { transformOrigin: "50% 50%" });
        gsap.set(".scroll-orbit-core", { transformOrigin: "50% 50%" });
        gsap.to(".scroll-orbit-ring-one", {
          rotation: 720,
          ease: "none",
          scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: true },
        });
        gsap.to(".scroll-orbit-ring-two", {
          rotation: -1080,
          ease: "none",
          scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: true },
        });
        gsap.fromTo(".scroll-orbit-core", { scale: 0.86 }, {
          scale: 1.08,
          ease: "none",
          scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: true },
        });
        gsap.utils.toArray(".scroll-reveal-content").forEach((element, index) => {
          gsap.fromTo(element, {
            opacity: 0.62,
            y: 20,
            scale: 0.99,
            rotateX: 1.2,
            filter: "blur(2px)",
            transformPerspective: 900,
          }, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 0.68,
            delay: (index % 3) * 0.07,
            ease: "power2.out",
            scrollTrigger: { trigger: element.closest(".portfolio-tilt"), start: "top 92%", once: true },
          });
        });
      }

      ScrollTrigger.refresh();
    });

    return () => {
      context.revert();
      document.removeEventListener("click", openProjectsPage);
    };
  }, []);

  return (
    <>
      <div className="portfolio-scroll-progress" aria-hidden="true" />
      <div className="portfolio-scroll-orbit" aria-hidden="true">
        <div className="scroll-orbit-ring scroll-orbit-ring-one" />
        <div className="scroll-orbit-ring scroll-orbit-ring-two" />
        <div className="scroll-orbit-core">
          <span />
        </div>
        <i className="scroll-orbit-node scroll-orbit-node-one" />
        <i className="scroll-orbit-node scroll-orbit-node-two" />
        <i className="scroll-orbit-node scroll-orbit-node-three" />
      </div>
    </>
  );
}

const experience = [
  {
    order: 4,
    role: "Technology Lead – Organisational Digital Ecosystem",
    organization: "Meed Public School Society (MPS Society) · Jharkhand, India",
    period: "Aug 2025 – May 2026",
    projectLink: "#projects",
    resourceLink: "/ventures/meed-public-school#resources",
    gallery: [
      "/images/meedian/1.png",
      "/images/meedian/2.png",
      "/images/meedian/3.png",
    ],
    github: "https://github.com/NafisAslam70/MeedianAI-Flow-v2",
    live: "https://meedian-ai-flow-v222.vercel.app/",
    points: [
      "Designed the organisation-wide technology roadmap and architecture across three audiences: institutional teams, parents and families, and public-facing school/community audiences.",
      "Led MeedianAI Flow as the central operating platform, bringing daily operations, role-based access, attendance, schedules, tasks, approvals, reporting, parent communication, and team workflows into one system.",
      "Delivered supporting digital products: the MEED International School website, MeedianAI Finance for accounts and fee operations, and the Meed Society public website.",
      "Owned the ecosystem end to end: product flows, information architecture, frontend and backend systems, data models, deployment, and iterative improvement with operational teams.",
      "Connected the institutional day lifecycle in MeedianAI Flow: day opening, scheduled activities, attendance capture, task and routine completion, day-close submissions, and managerial review.",
      "Built configurable programmes, schedules, QR attendance, operational dashboards, and reporting for managers and frontline teams.",
      "Integrated notifications, team chat, real-time updates, Twilio workflows, and human-approved WhatsApp communication for parent and team coordination.",
    ],
    more: [
      "Built configurable programmes and schedules with time slots, staff roles, post codes, and class-by-period assignments.",
      "Implemented QR-based session attendance and staff gate in/out records, with administrative and managerial monitoring screens.",
      "Integrated notifications, chat, Socket.IO real-time features, Twilio telephony workflows, and human-approved WhatsApp notifications.",
      "Worked across Next.js App Router, shared UI components, domain-organised API routes, PostgreSQL, Drizzle schema, NextAuth, role-aware access, debugging, and Vercel deployment.",
      "Helped shape a configurable institutional product supporting different programmes, operating rules, role structures, workflows, and branding.",
      "Technology: Next.js 15, React 19, JavaScript, PostgreSQL, Drizzle ORM, NextAuth, REST APIs, Socket.IO, Twilio, Git/GitHub, Vercel.",
    ],
  },
  {
    order: 1,
    role: "Superintendent – School Operations & Community Leadership",
    organization: "Meed Public School · Jharkhand, India",
    period: "Jan 2018 – 2021",
    resourceLink: "/pdfs/Nafis-Aslam-Meed-Story-Portfolio-Style.pdf",
    resourceLabel: "Read My Meed Journey ↗",
    points: [
      "Led academic, residential, administrative, and parent-facing operations at a rural school serving more than 300 students and families, including 100+ hostel residents.",
      "Built an operating structure across office, academic, and hostel teams; introduced daily reporting, review rhythms, clear ownership, and practical performance management.",
      "Strengthened parent engagement through regular meetings, term-end reviews, student progress reports, and daily communication with guardians.",
      "Helped grow the organisation from 80–100 students to 300+, and from a 6–7 person team to 30–35 team members.",
      "Expanded operating capacity with a computer lab, library, dining hall, school transport, and annual budget growth from approximately ₹10–12 lakh to ₹70–80 lakh.",
    ],
    more: [
      "Helped grow the organisation from 80–100 students to 300+, and from a 6–7 person team to 30–35 team members.",
      "Managed school planning, staff coordination, recruitment, residential routines, student welfare, fee follow-up, and community trust-building in a remote setting.",
      "Expanded facilities and operating capacity, including a computer lab, library, dining hall, and school transport; annual budget grew from approximately ₹10–12 lakh to ₹70–80 lakh.",
      "Applied a continuous improvement approach: observe the problem, design an intervention, measure the result, and refine the process with staff and families.",
    ],
  },
  {
    order: 6,
    role: "CV & Deep Learning Fellow",
    organization: "WorldQuant University · Online",
    period: "2026 – Present",
    points: [
      "Developing end-to-end classification, GAN, and diffusion-model pipelines using PyTorch and cloud experimentation workflows.",
      "Built wildlife camera-trap classification and crop-disease detection systems using CNNs, transfer learning, and cloud VMs.",
      "Working with reproducible deployment workflows using Flask, Streamlit, and Docker.",
    ],
  },
  {
    order: 5,
    role: "Advanced Data Science Intern",
    organization: "IDEAS-TIH · Indian Statistical Institute (ISI), Kolkata, India",
    period: "May 2026 – Jul 2026",
    demo: "https://youtu.be/LX_btzkvX60",
    demoThumb: "https://i.ytimg.com/vi/LX_btzkvX60/hqdefault.jpg",
    report: "/images/IDEAS/Nafis_Aslam_final_report_Summer_Internship.pdf",
    github: "https://github.com/Shibashis-Mandal/Multimodal-Video-Retrieval-Augmented-Generation-Video-RAG-/tree/main",
    points: [
      "Developed the Layer 3 unified search and reasoning engine for a multimodal Video RAG system for recipe-video understanding.",
      "Combined FAISS dense retrieval, BM25 lexical search, and NetworkX knowledge-graph traversal behind a modular VideoRAGEngine interface.",
      "Evaluated five Bengali recipe-video benchmarks: 384 multimodal chunks and a knowledge graph with 59 nodes and 81 edges; integrated Gemini, local Qwen2.5, and fallback generation paths.",
      "Designed a unified answer(query) interface that synthesises labelled retrieval context using templates, Gemini, or locally hosted Qwen2.5.",
      "Contributed to the technical report and project demonstration video documenting the architecture, validation, and engineering decisions.",
    ],
    more: [
      "Designed a unified answer(query) interface that synthesises labelled retrieval context and supports configurable templates, Google Gemini, and locally hosted Qwen2.5 generation.",
      "Added recursive ingredient extraction and normalisation for inconsistent schemas, with graceful fallback to BM25 and knowledge-graph retrieval when FAISS or the embedding model is unavailable.",
      "Validated cross-lingual queries and retrieval of relevant video segments, keyframe paths, and timestamps.",
      "Contributed to the technical report and produced the project demonstration video documenting architecture, engineering decisions, validation, and outcomes.",
      "Technology: Python, FAISS, SentenceTransformers, BM25Okapi, NetworkX, Google Gemini API, Hugging Face Transformers, Qwen2.5, JSON.",
    ],
  },
  {
    order: 2,
    role: "Web Developer · Malaysia Equity Market Platform",
    organization: "Speech Processing Group, School of Computer Sciences · Universiti Sains Malaysia",
    project: "Algorithmic Trading Project · Penang, Malaysia",
    period: "1 Mar 2023 – 31 Aug 2023",
    github: "https://github.com/NafisAslam70/malaysia-equity-market",
    previewGallery: [
      "/images/malaysiaEquity/Screenshot%202026-11-17%20at%205.35.35%E2%80%AFPM.png",
      "/images/malaysiaEquity/Screenshot%202026-11-17%20at%205.35.56%E2%80%AFPM.png",
      "/images/malaysiaEquity/Screenshot%202026-11-17%20at%205.36.10%E2%80%AFPM.png",
    ],
    points: [
      "During a Web Developer internship, contributed to frontend and backend development of a Malaysia equity market website providing stock updates and company-related news.",
      "Built company search and routing features, with server-rendered pages for company listings, profiles, historical market data, and news.",
      "Developed Express routes and dynamic EJS views for the landing page, company directory, company details, and unsupported-search handling.",
      "Integrated separate modules for price history, company profiles, and news using Axios, Cheerio, Puppeteer, and SQLite.",
    ],
    more: [
      "Implemented company lookup from the landing page: normalized the company query, mapped it to an equity symbol, and routed users to the matching company page.",
      "Developed Express routes for the landing page, company directory, company details, and an error page for unsupported searches.",
      "Created dynamic EJS views that render company listings, profile information, historical data, and related news.",
      "Connected separate retrieval modules for historical stock information, company profiles, and news, keeping data responsibilities outside the main route handler.",
      "Used Axios and Cheerio in the data retrieval workflow, Puppeteer for browser-based collection tasks, and SQLite in the application storage workflow.",
      "Served stylesheets and images through Express and added development/production startup commands, including Nodemon for development.",
      "Technology: Node.js, Express.js, EJS, JavaScript, SQLite, Axios, Cheerio, Puppeteer, HTML, CSS, Nodemon.",
    ],
  },
];

const expertise = [
  { title: "Software Engineering", skills: ["JavaScript", "TypeScript", "Python", "React", "Next.js", "Node.js", "Express.js", "Flask", "HTML/CSS", "Tailwind CSS", "EJS", "REST APIs"] },
  { title: "Backend & Databases", skills: ["PostgreSQL", "SQLite", "Drizzle ORM", "Authentication", "Role-based access", "Socket.IO", "Twilio", "Data integration", "Approval workflows", "Reporting"] },
  { title: "Applied AI / ML", skills: ["RAG", "Sentence Transformers", "FAISS", "BM25", "NetworkX", "PyTorch", "TensorFlow", "Scikit-learn", "YOLO", "OpenCV", "PCA", "Gaussian Processes"] },
  { title: "Data, Vision & Delivery", skills: ["Pandas", "NumPy", "Forecasting", "Statistical analysis", "MediaPipe", "Git/GitHub", "Docker", "Linux", "Jupyter", "Vercel", "Azure/GCP VMs"] },
];

const proofLink = "inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700 dark:border-white/15 dark:text-slate-200 dark:hover:border-indigo-300";

const COPY = {
  en: {
    greeting: "Hi, I am",
    intro: "MIT-trained Computer Science graduate from Universiti Sains Malaysia, Malaysia, specialising in Intelligent Computing (AI). I build practical web platforms, AI-powered workflows, retrieval systems, computer-vision tools, and business automation for real operational needs. Based in India and available to relocate across the Gulf.",
    contact: "Contact me", cv: "Download CV ↗", explore: "Explore projects ↓", bsc: "Bachelor of Computer Science (Honours) — Intelligent Computing (AI)", mit: "Statistics and Data Science MicroMasters (online)", award: "ICSC 2026 · International 2nd Rank · 2nd National Award · Top 1%",
    research: "Selected research", paper: "Read first-author preprint ↗", career: "Career history", experience: "Experience", selected: "Selected work", projects: "Projects with proof", projectIntro: "A closer look at systems I designed, built, evaluated, and documented.", allProjects: "View complete project portfolio ↗", toolkit: "Technical toolkit", expertise: "Expertise", educationEyebrow: "Education & recognition", education: "Academic foundation", next: "Next step", discuss: "Let’s discuss how I can contribute.", discussText: "For AI, machine learning, computer vision, data science, and software engineering opportunities.",
    flagship: "Software products", forecast: "Applied AI", shipped: "Automation & intelligence", focus: "Institutional platforms", focusText: "Role-aware web systems for operations, attendance, approvals, reporting, and parent or team workflows.", forecastTitle: "AI retrieval & reasoning", forecastText: "RAG systems combining semantic search, lexical retrieval, knowledge graphs, and reliable response workflows.", fullStack: "Automation that fits real work", fullStackText: "Web apps, data pipelines, AI-assisted tools, and measurable workflows built around operational needs.",
    cvProject: "Applied AI · Retrieval & Reasoning", platform: "Software Engineering · Product", data: "Data Science · Forecasting", fellowship: "Personal Product · Planning", live: "Live project ↗", video: "Demo video ↗", paperLink: "Paper ↗", github: "GitHub ↗", profile: "GitHub profile ↗", language: "English", location: "Based in India · Available to relocate across the Gulf",
  },
  ar: {
    greeting: "مرحباً، أنا",
    intro: "خريج علوم الحاسوب ومدرّب من MIT من Universiti Sains Malaysia في ماليزيا، بتخصص الحوسبة الذكية والذكاء الاصطناعي. أبني منصات ويب عملية وسير عمل مدعوماً بالذكاء الاصطناعي وأنظمة استرجاع وأدوات رؤية حاسوبية وأتمتة أعمال لمتطلبات تشغيلية حقيقية. أقيم في الهند ومتاح للانتقال والعمل في أنحاء دول الخليج.",
    contact: "تواصل معي", cv: "تحميل السيرة الذاتية ↗", explore: "استكشف المشاريع ↓", bsc: "بكالوريوس علوم الحاسوب مع مرتبة الشرف — الحوسبة الذكية (الذكاء الاصطناعي)", mit: "برنامج MicroMasters في الإحصاء وعلوم البيانات (عبر الإنترنت)", award: "المركز الدولي الثاني · الجائزة الوطنية الثانية · ضمن أفضل 1٪ في ICSC 2026",
    research: "أبحاث مختارة", paper: "قراءة البحث المنشور باسمي الأول ↗", career: "المسيرة المهنية", experience: "الخبرة", selected: "مشاريع مختارة", projects: "مشاريع مختارة", projectIntro: "نظرة على الأنظمة التي صممتها وطورتها وقيّمتها ووثّقتها.", allProjects: "عرض portfolio المشاريع بالكامل ↗", toolkit: "الأدوات التقنية", expertise: "التخصصات", educationEyebrow: "التعليم والإنجازات", education: "الأساس الأكاديمي", next: "الخطوة التالية", discuss: "لنتحدث عن كيفية مساهمتي في فريقكم.", discussText: "فرص في الذكاء الاصطناعي وتعلم الآلة والرؤية الحاسوبية وعلوم البيانات وهندسة البرمجيات.",
    flagship: "منتجات برمجية", forecast: "ذكاء اصطناعي تطبيقي", shipped: "أتمتة وذكاء تشغيلي", focus: "منصات مؤسسية", focusText: "أنظمة ويب بصلاحيات مخصصة لإدارة العمليات والحضور والموافقات والتقارير وسير عمل الفرق والأسر.", forecastTitle: "الاسترجاع والاستدلال بالذكاء الاصطناعي", forecastText: "أنظمة RAG تجمع البحث الدلالي والاسترجاع المعجمي والرسوم المعرفية وسير العمل الموثوق للإجابات.", fullStack: "أتمتة تناسب العمل الفعلي", fullStackText: "تطبيقات ويب ومسارات بيانات وأدوات مدعومة بالذكاء الاصطناعي وسير عمل قابل للقياس مبني حول الاحتياجات التشغيلية.",
    cvProject: "ذكاء اصطناعي تطبيقي · استرجاع واستدلال", platform: "هندسة البرمجيات · منتج", data: "علوم البيانات · التنبؤ", fellowship: "منتج شخصي · تخطيط", live: "المشروع المباشر ↗", video: "فيديو العرض ↗", paperLink: "البحث ↗", github: "GitHub ↗", profile: "ملف GitHub ↗", language: "العربية", location: "مقيم في الهند · متاح للانتقال إلى دول الخليج",
  },
};

const PROJECT_DETAIL_COPY = {
  en: {
    meedian: [
      "Built for Meed Public School Society to bring day-to-day school operations into one configurable platform, from schedules and staff coordination to attendance, tasks, approvals, communication, and reporting.",
      "Designed role-specific workspaces for Administrators, Managers, Team Managers, and Members, with permissions and workflows tailored to configuration, supervision, and execution.",
      "Connected the institutional day lifecycle: opening, scheduled activities, attendance, routine/task completion, day-close submissions, and managerial review.",
      "Implemented programme and schedule configuration, recurring tasks, progress updates, tickets, escalations, leave requests, and supervisor-chain approvals; added QR attendance and staff gate in/out tracking.",
      "Integrated notifications, chat, Socket.IO real-time features, Twilio telephony workflows, human-approved WhatsApp notifications, and DELU-GPT backend assistant endpoints.",
      "Technology: Next.js 15, React 19, JavaScript, PostgreSQL, Drizzle ORM, NextAuth, REST APIs, Socket.IO, Twilio, Git/GitHub, Vercel.",
    ],
    videoRag: [
      "Developed the Layer 3 Unified Search & Reasoning Engine as a standalone VideoRAGEngine for multimodal Bengali recipe-video understanding.",
      "Unified FAISS dense semantic retrieval, BM25 sparse keyword retrieval, and NetworkX knowledge-graph traversal behind one answer(query) interface.",
      "Synthesised labelled retrieval context and supported configurable template generation, Google Gemini, and locally hosted Qwen2.5 backends.",
      "Added recursive ingredient extraction and schema normalisation, with graceful retrieval fallback when the FAISS index or embedding model was unavailable.",
      "Validated five benchmarks using 384 multimodal chunks and a graph of 59 nodes / 81 edges; checked cross-lingual retrieval of video segments, keyframe paths, and timestamps.",
      "Technology: Python, FAISS, SentenceTransformers, BM25Okapi, NetworkX, Google Gemini API, Hugging Face Transformers, Qwen2.5, JSON. Demo: https://youtu.be/LX_btzkvX60",
    ],
    forecast: [
      "Built a daily care-load and discharge-demand forecasting workflow, preparing dates and missing days before generating lag, rolling-window, and weekday features.",
      "Compared Persistence, Random Forest, SARIMA, and linear regression using chronological train/test evaluation to avoid future-data leakage.",
      "Persistence was the strongest reported benchmark at MAE 6.68 and MAPE 0.30%; the result is presented as a baseline rather than a claim that complex models won.",
      "Technology: Python, pandas, scikit-learn, statsmodels, Streamlit. Project repository contains the dashboard and research report.",
    ],
  },
  ar: {
    meedian: [
      "بُنيت المنصة لصالح Meed Public School Society لتوحيد العمليات المدرسية اليومية، من الجداول وتنسيق الموظفين إلى الحضور والمهام والموافقات والتواصل والتقارير.",
      "إنشاء مساحات عمل حسب الأدوار للمسؤولين والمديرين ومديري الفرق والأعضاء، بصلاحيات ومسارات مناسبة للإعداد والإشراف والتنفيذ.",
      "ربط دورة اليوم المؤسسي: الافتتاح والأنشطة المجدولة والحضور وإنجاز المهام والروتين وتسليمات إغلاق اليوم والمراجعة الإدارية.",
      "تنفيذ إعداد البرامج والجداول والمهام المتكررة وتحديث التقدم والتذاكر والتصعيد وطلبات الإجازة وموافقات المشرفين؛ وإضافة الحضور عبر QR وتسجيل دخول وخروج الموظفين.",
      "تكامل الإشعارات والمحادثة وSocket.IO الفوري وسير اتصالات Twilio وإشعارات WhatsApp المعتمدة بشرياً ونقاط المساعد الخلفية DELU-GPT.",
      "التقنيات: Next.js 15 وReact 19 وJavaScript وPostgreSQL وDrizzle ORM وNextAuth وREST APIs وSocket.IO وTwilio وGit/GitHub وVercel.",
    ],
    videoRag: [
      "تطوير محرك البحث والاستدلال الموحد من الطبقة الثالثة، VideoRAGEngine مستقلاً لفهم مقاطع وصفات بنغالية متعددة الوسائط.",
      "توحيد الاسترجاع الدلالي الكثيف عبر FAISS واسترجاع الكلمات عبر BM25 واستكشاف الرسم المعرفي باستخدام NetworkX ضمن واجهة answer(query) واحدة.",
      "دمج سياق الاسترجاع المصنف ودعم توليد الإجابات عبر القوالب وGoogle Gemini وQwen2.5 المستضاف محلياً.",
      "إضافة استخراج متكرر للمكونات وتوحيد المخططات المختلفة، مع بدائل للاسترجاع عند عدم توفر فهرس FAISS أو نموذج التضمين.",
      "التحقق باستخدام خمس مجموعات مرجعية و384 مقطعاً متعدد الوسائط ورسم معرفي يضم 59 عقدة و81 حافة؛ واختبار الاسترجاع متعدد اللغات للمقاطع والمسارات الزمنية والصور المفتاحية.",
      "التقنيات: Python وFAISS وSentenceTransformers وBM25Okapi وNetworkX وGoogle Gemini API وHugging Face Transformers وQwen2.5 وJSON. فيديو العرض متاح في رابط المشروع.",
    ],
    forecast: [
      "بناء مسار للتنبؤ اليومي بحِمل الرعاية والطلب على الخروج، مع تجهيز التواريخ والأيام المفقودة وإنشاء ميزات التأخر والنوافذ المتحركة وأيام الأسبوع.",
      "مقارنة Persistence وRandom Forest وSARIMA والانحدار الخطي باستخدام تقسيم زمني للتدريب والاختبار لتجنب تسرب معلومات المستقبل.",
      "كان Persistence أفضل خط أساس مُبلغ عنه بنتيجة MAE 6.68 وMAPE 0.30٪؛ ويُعرض ذلك كخط أساس لا كادعاء تفوق النماذج المعقدة.",
      "التقنيات: Python وpandas وscikit-learn وstatsmodels وStreamlit. يحتوي المستودع على لوحة العرض والتقرير البحثي.",
    ],
    deepWork: [
      "مشروع التخرج في Universiti Sains Malaysia (CAT405)؛ حاز الجائزة الذهبية في USM PIXEL 2025، وأُعدّ عنه بحث أول باسم المؤلف.",
      "يتكون DeepLens Engine for Focus من أربع طبقات: تصنيف الحالة، والتحقق البصري، والتصفية الزمنية، وتقديم ملاحظات تراعي السياق.",
      "يصنف YOLOv11n-cls ست حالات: التركيز، والهاتف، والغياب، والنعاس، والنظر بعيداً، ووضعية الجلوس السيئة. جُمعت 1,080 صورة أساسية وزيدت بالتحسين إلى نحو 3,000؛ دقة التحقق المعلنة 94.76٪.",
      "تشمل الإشارات المساعدة معالم وضعية MediaPipe وتتبع القزحية عبر FaceMesh ونسبة Eye Aspect Ratio وYOLOv8 وOpenCV. تُصفّى التغيرات العابرة قبل التنبيهات الصوتية أو المرئية.",
      "يتضمن المنتج جلسات تركيز واستراحة بأسلوب Pomodoro وأهدافاً وملخصات للجلسات وتحليلات للتقدم. تعالج إطارات الفيديو محلياً، وتصف الوثائق حفظ المقاييس المستنتجة بدلاً من تسجيلات الفيديو.",
      "التقنيات: Next.js وReact وTailwind CSS وFlask وPython وPostgreSQL وDrizzle ORM وClerk وPyTorch وUltralytics YOLO وMediaPipe وOpenCV.",
    ],
    deepCalendar: [
      "تطبيق ويب باستخدام Next.js 15 وReact 19 وTypeScript وقاعدة PostgreSQL مشتركة، مع تطبيق مرافق للهاتف باستخدام Expo وReact Native.",
      "إدارة الأهداف والروتين الأسبوعي القابل لإعادة الاستخدام وخطط اليوم الواحد ونوافذ الروتين وكتل العمل اليومية بثلاثة مستويات للتركيز.",
      "تعديل مرن للخطة بالدمج أو الاستبدال؛ وحالات للكتل: مخططة ونشطة ومنجزة ومتجاوزة، مع تسجيل الوقت الفعلي وملاحظات نهاية اليوم والتدوين.",
      "تقويم أسبوعي لسطح المكتب وجدول يومي للهاتف، إلى جانب لوحة تحكم وباني الروتين والأهداف والحساب وواجهات الإعداد الأولي.",
      "نموذج بيانات Drizzle ORM وواجهات API للمصادقة والأهداف والروتين وخطط الأيام وتحديث الكتل والملخصات العامة للقراءة فقط. جلسات ملفات تعريف الارتباط للويب ورموز Bearer للهاتف.",
      "التقنيات: Next.js 15 وReact 19 وTypeScript وPostgreSQL وDrizzle ORM وTailwind CSS وExpo وReact Native وExpo Router وJWT.",
    ],
  },
};

function LocalizedProjectDetails({ lang, kind, children }) {
  if (lang === "en" && children) return children;
  const points = PROJECT_DETAIL_COPY[lang]?.[kind] || [];
  return <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600" dir={lang === "ar" ? "rtl" : "ltr"}>{points.map((point) => <li key={point}>{point}</li>)}</ul>;
}

function MeedRelatedProducts({ lang }) {
  const flowImages = ["/images/meedian/1.png", "/images/meedian/2.png", "/images/meedian/3.png"];
  const products = lang === "ar"
    ? [
        { title: "MEED International School Website", text: "موقع القبول والبرامج والهيئة التعليمية والفعاليات والاستفسارات.", href: "/ventures#meed-international-school-website", image: "/images/meedInternational/Screenshot%202026-11-17%20at%205.26.39%E2%80%AFPM.png" },
        { title: "موقع Meed Society", text: "موقع عام لعرض رسالة المجتمع ومبادراته وأثره.", href: "/ventures#meed-society-website", image: "/images/society/Screenshot%202026-11-17%20at%205.20.42%E2%80%AFPM.png" },
        { title: "MeedianAI Finance", text: "نظام للحسابات ورسوم الطلاب والمدفوعات والتقارير.", href: "/ventures#meedianai-finance", image: "/images/meedFinance/Screenshot%202026-11-17%20at%205.53.58%E2%80%AFPM.png" },
      ]
    : [
        { title: "MEED International School Website", text: "Admissions, programmes, faculty, events, and enquiry platform.", href: "/ventures#meed-international-school-website", image: "/images/meedInternational/Screenshot%202026-11-17%20at%205.26.39%E2%80%AFPM.png" },
        { title: "Meed Society Website", text: "Public website for the society’s mission, initiatives, and community impact.", href: "/ventures#meed-society-website", image: "/images/society/Screenshot%202026-11-17%20at%205.20.42%E2%80%AFPM.png" },
        { title: "MeedianAI Finance", text: "Accounts, student fees, payments, dues, and reporting workflows.", href: "/ventures#meedianai-finance", image: "/images/meedFinance/Screenshot%202026-11-17%20at%205.53.58%E2%80%AFPM.png" },
      ];
  return <div className="mt-4"><Link href="/ventures#meedianai-flow" className="experience-flow-product"><div><strong>MeedianAI Flow</strong><small>{lang === "ar" ? "منصة موحدة للعمليات اليومية والحضور والمهام والموافقات والتقارير." : "Unified platform for daily operations, attendance, tasks, approvals, and reporting."}</small></div><div className="experience-flow-previews">{flowImages.map((src, index) => <Image key={src} src={src} alt={`MeedianAI Flow preview ${index + 1}`} width={180} height={110} />)}</div><b>{lang === "ar" ? "عرض تفاصيل المشروع ←" : "View project details →"}</b></Link><div className="experience-related-products mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <Link key={product.title} href={product.href} className="experience-related-product">{product.image && <Image src={product.image} alt={`${product.title} preview`} width={200} height={120} className="experience-product-thumb" />}<strong>{product.title}</strong><small>{product.text}</small></Link>)}</div></div>;
}

function ExperienceProofLinks({ item, lang }) {
  const isMalaysia = item.role.includes("Malaysia") || item.role.includes("ماليزيا") || item.role.includes("سوق الأسهم");
  const isSuperintendent = item.role.includes("Superintendent") || item.role.includes("مشرف عام");
  const videoRagGithub = "https://github.com/Shibashis-Mandal/Multimodal-Video-Retrieval-Augmented-Generation-Video-RAG-/tree/main";
  return (
    <div className="experience-proof-links mt-3">
      {item.gallery ? <a href="https://github.com/NafisAslam70/MeedianAI-Flow-v2" target="_blank" rel="noreferrer"><FaGithub /> GitHub</a> : null}
      {item.gallery ? <a href="https://meedian-ai-flow-v222.vercel.app/" target="_blank" rel="noreferrer"><FaArrowUpRightFromSquare /> {lang === "ar" ? "المنصة المباشرة" : "Live platform"}</a> : null}
      {item.demo ? <a href={videoRagGithub} target="_blank" rel="noreferrer"><FaGithub /> GitHub</a> : null}
      {item.demo ? <a href={item.demo} target="_blank" rel="noreferrer">Video · {lang === "ar" ? "التدريب" : "Internship"}</a> : null}
      {item.demo && item.report ? <a href={item.report} target="_blank" rel="noreferrer">PDF · {lang === "ar" ? "التقرير" : "Report"}</a> : null}
      {isMalaysia && <a href="https://github.com/NafisAslam70/malaysia-equity-market" target="_blank" rel="noreferrer"><FaGithub /> GitHub</a>}
      {isSuperintendent && <a href={item.resourceLink || "/pdfs/Nafis-Aslam-Meed-Story-Portfolio-Style.pdf"} target="_blank" rel="noreferrer">PDF {lang === "ar" ? "رحلة Meed" : "My Meed Journey"}</a>}
    </div>
  );
}

function ExperienceVisualProof({ item, lang }) {
  const isMalaysia = item.role.includes("Malaysia") || item.role.includes("ماليزيا") || item.role.includes("سوق الأسهم");
  const malaysiaImages = [
    "/images/malaysiaEquity/Screenshot%202026-11-17%20at%205.35.35%E2%80%AFPM.png",
    "/images/malaysiaEquity/Screenshot%202026-11-17%20at%205.35.56%E2%80%AFPM.png",
    "/images/malaysiaEquity/Screenshot%202026-11-17%20at%205.36.10%E2%80%AFPM.png",
  ];
  if (!isMalaysia) return null;
  return <div className="experience-visual-proof mt-4"><ProjectGallery images={item.previewGallery || malaysiaImages} title="Malaysia Equity Market Platform" className="grid grid-cols-3 gap-2" /><Link href="/ventures#malaysia-equity-market-platform" className="experience-gallery-link mt-3 inline-flex items-center gap-2">{lang === "ar" ? "عرض تفاصيل المشروع كاملة ←" : "View project details →"}</Link></div>;
}

function ExperienceHighlights({ item, lang }) {
  const visibleCount = item.role.includes("Technology Lead") || item.role.includes("قائد التقنية") ? 3 : 2;
  const visiblePoints = item.points.slice(0, visibleCount);
  const hiddenPoints = [...item.points.slice(visibleCount), ...(item.more || [])];
  return <>
    <ul className="space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
      {visiblePoints.map((point) => <li key={point} className="flex gap-2"><span className="text-indigo-600">•</span><span>{point}</span></li>)}
    </ul>
    {hiddenPoints.length > 0 && <details className="experience-points-toggle mt-4"><summary aria-label={lang === "ar" ? "عرض النقاط المتبقية" : "Show remaining highlights"} title={lang === "ar" ? "عرض النقاط المتبقية" : "Show remaining highlights"}><span className="sr-only">{lang === "ar" ? "عرض النقاط المتبقية" : "Show remaining highlights"}</span><i aria-hidden="true" /></summary><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{hiddenPoints.map((point) => <li key={point} className="flex gap-2"><span className="text-indigo-600">•</span><span>{point}</span></li>)}</ul></details>}
  </>;
}

function ContactCard({ href, icon: Icon, title, detail, className = "", external = false }) {
  return (
    <a
      className={`group flex min-w-0 items-center gap-4 rounded-2xl border p-4 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${className}`}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/90 text-xl shadow-sm transition duration-300 group-hover:scale-110"><Icon aria-hidden="true" /></span>
      <span className="min-w-0"><span className="block text-[11px] font-bold uppercase tracking-[0.16em] opacity-70">{title}</span><span className="mt-1 block truncate text-sm font-semibold">{detail}</span></span>
      <FaArrowUpRightFromSquare className="ml-auto shrink-0 text-xs opacity-50 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" aria-hidden="true" />
    </a>
  );
}

function HireValueGraphic({ kind }) {
  if (kind === "product") return <div className="hire-corporate-graphic hire-graphic-product" aria-hidden="true"><span /><i /><b /><em /></div>;
  if (kind === "automation") return <div className="hire-corporate-graphic hire-graphic-automation" aria-hidden="true"><span>IN</span><i /><b>AI</b><i /><em>OUT</em></div>;
  if (kind === "lead") return <div className="hire-corporate-graphic hire-graphic-lead" aria-hidden="true"><span>01</span><i /><b>02</b><i /><em>03</em></div>;
  if (kind === "research") return <div className="hire-corporate-graphic hire-graphic-research" aria-hidden="true"><span>R</span><i /><b>+</b><em>✓</em></div>;
  return null;
}

function MobileHireOverlay({ lang }) {
  const [open, setOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const reasons = lang === "ar" ? [
    ["01", "سأبني منتجات برمجية لشركتك", ["تخطيط", "بناء", "إطلاق"], "indigo", "product"],
    ["02", "سأؤتمت عمليات شركتك", ["تحديد", "أتمتة", "توسيع"], "emerald", "automation"],
    ["03", "امنحني مشروعاً لأقوده من البداية إلى النهاية", ["تخطيط", "قيادة", "تسليم"], "sky", "lead"],
    ["04", "أبحث وأبتكر عندما يتطلب المشروع ذلك", ["استكشاف", "بحث", "ابتكار"], "violet", "research"],
  ] : [
    ["01", "I will build a software product for your company", ["Plan", "Build", "Launch"], "indigo", "product"],
    ["02", "I will automate your company’s processes", ["Map", "Automate", "Scale"], "emerald", "automation"],
    ["03", "Give me a project; I’ll lead it end to end", ["Plan", "Lead", "Deliver"], "sky", "lead"],
    ["04", "I can research and innovate when required", ["Explore", "Research", "Innovate"], "violet", "research"],
  ];
  const title = lang === "ar" ? "لماذا توظفني؟" : "Why hire me?";
  const activeSlide = Math.min(slide, reasons.length - 1);
  const [number, heading, steps, tone, kind] = reasons[activeSlide];
  const toneClasses = {
    indigo: "border-indigo-200 bg-gradient-to-br from-indigo-100 via-violet-50 to-white text-indigo-950",
    emerald: "border-emerald-200 bg-gradient-to-br from-emerald-100 via-teal-50 to-white text-emerald-950",
    sky: "border-sky-200 bg-gradient-to-br from-sky-100 via-blue-50 to-white text-sky-950",
    violet: "border-violet-200 bg-gradient-to-br from-violet-100 via-fuchsia-50 to-white text-violet-950",
  };
  const nextSlide = (direction = 1) => setSlide((current) => (current + direction + reasons.length) % reasons.length);
  const handleTouchEnd = (event) => {
    if (touchStartX === null) return;
    const difference = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(difference) > 45) nextSlide(difference > 0 ? -1 : 1);
    setTouchStartX(null);
  };

  return (
    <div className="mobile-hire-overlay fixed inset-x-0 bottom-3 z-[80] px-4 md:hidden" dir={lang === "ar" ? "rtl" : "ltr"}>
      {open && <button aria-label={lang === "ar" ? "إغلاق" : "Close"} className="fixed inset-0 -z-10 bg-slate-950/30 backdrop-blur-[2px]" onClick={() => setOpen(false)} />}
      {open && <div className="absolute bottom-0 left-3 right-3 overflow-hidden rounded-[1.8rem] border border-white/60 bg-white/95 p-4 shadow-2xl shadow-indigo-950/30 backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">Nafis Aslam</p><h2 className="mt-0.5 text-xl font-bold text-slate-950">{title}</h2></div><button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg font-medium text-slate-700" onClick={() => setOpen(false)} aria-label={lang === "ar" ? "إغلاق" : "Close"}>×</button></div>
        <div key={number} onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)} onTouchEnd={handleTouchEnd} className={`relative overflow-hidden rounded-2xl border p-5 ${toneClasses[tone]}`}>
          <span className="absolute -right-2 -top-8 text-[8rem] font-black leading-none opacity-[0.09]" aria-hidden="true">{number}</span>
          <div className="relative"><div className="flex items-end justify-between"><span className="text-5xl font-black tracking-tighter">{number}</span><span className="rounded-full bg-white/75 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]">{lang === "ar" ? "اسحب" : "Swipe"} ↔</span></div><h3 className="mt-2 text-2xl font-black tracking-tight">{heading}</h3><HireValueGraphic kind={kind} /><div className="mt-4 flex items-center justify-between gap-1">{steps.map((step, index) => <div key={step} className="flex min-w-0 flex-1 items-center gap-1"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/90 text-xs font-black shadow-sm">{index + 1}</span><span className="text-[11px] font-bold leading-4">{step}</span>{index < 2 && <i className="mx-0.5 h-px min-w-2 flex-1 bg-current opacity-25" />}</div>)}</div></div>
        </div>
        <div className="mt-4 flex items-center justify-between"><div className="flex gap-1.5">{reasons.map(([itemNumber], index) => <button key={itemNumber} onClick={() => setSlide(index)} aria-label={`${title} ${index + 1}`} className={`h-2 rounded-full transition-all ${activeSlide === index ? "w-6 bg-indigo-600" : "w-2 bg-slate-200"}`} />)}</div><div className="flex gap-2"><button onClick={() => nextSlide(-1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white font-bold text-slate-700" aria-label="Previous">←</button><button onClick={() => nextSlide()} className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 font-bold text-white" aria-label="Next">→</button></div></div>
        <a href="#contact" onClick={() => setOpen(false)} className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">{lang === "ar" ? "لنتحدث" : "Let’s talk"} <FaArrowUpRightFromSquare aria-hidden="true" /></a>
      </div>}
      {!open && <button onClick={() => setOpen(true)} className="mobile-hire-trigger group mx-auto flex w-full max-w-sm items-center justify-between rounded-2xl border border-indigo-200/80 bg-slate-950 px-4 py-3 text-left text-white shadow-xl shadow-indigo-950/25"><span className="flex items-center gap-3"><span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 text-xs font-extrabold"><i className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-300 ring-2 ring-slate-950" />01</span><span><span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-200">Nafis Aslam</span><span className="block text-sm font-bold">{title}</span></span></span><span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-100">{lang === "ar" ? "اضغط" : "Tap"} →</span></button>}
    </div>
  );
}

function MobileScrollNavigator({ lang }) {
  const sections = lang === "ar"
    ? [["overview", "البداية"], ["experience", "الخبرة"], ["projects", "المشاريع"], ["education", "التعليم"], ["contact", "تواصل"]]
    : [["overview", "Overview"], ["experience", "Experience"], ["projects", "Projects"], ["education", "Education"], ["contact", "Contact"]];
  const [activeIndex, setActiveIndex] = useState(0);
  const progressFillRef = useRef(null);
  const waterFillRef = useRef(null);

  useEffect(() => {
    let frameId = 0;
    const updateNavigation = () => {
      frameId = 0;
      const marker = window.innerHeight * 0.37;
      let selected = 0;
      MOBILE_NAV_SECTION_IDS.forEach((id, index) => {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= marker) selected = index;
      });
      setActiveIndex(selected);

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1) : 0;
      progressFillRef.current?.style.setProperty("transform", `scaleY(${progress})`);
      waterFillRef.current?.style.setProperty("transform", `scaleY(${progress})`);
    };
    const scheduleUpdate = () => {
      if (!frameId) frameId = window.requestAnimationFrame(updateNavigation);
    };

    updateNavigation();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [lang]);

  const navigate = (index) => document.getElementById(sections[index][0])?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <div
      className="mobile-scroll-navigator fixed z-40 md:hidden"
      dir={lang === "ar" ? "rtl" : "ltr"}
      aria-label={lang === "ar" ? "التنقل بين الأقسام" : "Page navigation"}
    >
      <div className="mobile-scroll-water-capsule relative isolate flex flex-col items-center gap-2 rounded-full border border-white/80 bg-white/80 p-1.5 shadow-lg shadow-indigo-950/10 backdrop-blur-xl dark:border-white/15 dark:bg-slate-950/85 dark:shadow-black/40">
        <span className="mobile-scroll-water" aria-hidden="true">
          <span ref={waterFillRef} className="mobile-scroll-water-fill" />
        </span>
        <button
          onClick={() => navigate(Math.max(activeIndex - 1, 0))}
          disabled={activeIndex === 0}
          aria-label="Previous section"
          className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-sm text-slate-500 disabled:opacity-25 dark:text-slate-300"
        >
          ↑
        </button>
        <div className="mobile-scroll-sections relative z-10 flex flex-col items-center gap-1.5 py-1">
          <span className="mobile-scroll-track" aria-hidden="true">
            <span
              ref={progressFillRef}
              className="mobile-scroll-track-fill"
            />
          </span>
          {sections.map(([id, label], index) => {
            const isActive = index === activeIndex;
            const isComplete = index < activeIndex;
            return (
              <button
                key={id}
                onClick={() => navigate(index)}
                aria-label={label}
                aria-current={isActive ? "step" : undefined}
                className={`relative z-10 flex items-center justify-center rounded-full transition-all ${
                  isActive
                    ? "h-7 w-7 bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/40 ring-4 ring-indigo-200/70 dark:ring-indigo-400/20"
                    : isComplete
                      ? "h-3 w-3 bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-md shadow-indigo-500/30"
                      : "h-3 w-3 bg-indigo-100 hover:bg-indigo-300 dark:bg-white/10 dark:hover:bg-white/20"
                }`}
              >
                <i
                  aria-hidden="true"
                  className={`rounded-full ${
                    isActive
                      ? "h-2 w-2 bg-white shadow-sm"
                      : isComplete
                        ? "h-1.5 w-1.5 bg-white/90"
                        : "h-1.5 w-1.5 bg-indigo-400 dark:bg-indigo-200"
                  }`}
                />
              </button>
            );
          })}
        </div>
        <button
          onClick={() => navigate(Math.min(activeIndex + 1, sections.length - 1))}
          disabled={activeIndex === sections.length - 1}
          aria-label="Next section"
          className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-sm text-slate-500 disabled:opacity-25 dark:text-slate-300"
        >
          ↓
        </button>
        <span className="mobile-scroll-count relative z-10 mb-1 text-[8px] font-black tracking-[0.08em] text-indigo-600 dark:text-indigo-300">
          {String(activeIndex + 1).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

export default function EmployerPortfolio({ lang = "en" }) {
  const c = COPY[lang] || COPY.en;
  const cvHref = lang === "ar"
    ? "/pdfs/Nafis_Aslam_Gulf_CV_Arabic_Bilingual_With_LinkedIn.pdf"
    : "/pdfs/Nafis_Aslam_Gulf_CV_English_Master_With_LinkedIn.pdf";
  const roles = lang === "ar" ? [
    { role: "قائد التقنية – المنظومة الرقمية للمؤسسة", organization: "Meed Public School Society · جهارخاند، الهند", period: "أغسطس 2025 – مايو 2026", gallery: ["/images/meedian/1.png", "/images/meedian/2.png", "/images/meedian/3.png"], points: ["وضع خارطة الطريق التقنية والمعمارية للمنظومة الرقمية عبر ثلاثة جماهير: فرق المؤسسة، وأولياء الأمور والأسر، والجمهور المدرسي والمجتمعي.", "قيادة MeedianAI Flow كمنصة التشغيل المركزية، لتوحيد العمليات اليومية والصلاحيات والحضور والجداول والمهام والموافقات والتقارير وتواصل أولياء الأمور وسير عمل الفرق.", "تطوير منتجات رقمية مساندة: موقع MEED International School ومنصة MeedianAI Finance للحسابات والرسوم وموقع Meed Society العام."], more: ["تخطيط وتصميم وتطوير المنظومة من البداية إلى النهاية: تدفقات المنتج وهندسة المعلومات والواجهات والأنظمة الخلفية ونماذج البيانات والنشر والتحسين المتواصل مع فرق التشغيل.", "ربط دورة اليوم المؤسسي في MeedianAI Flow: فتح اليوم والأنشطة المجدولة والحضور وإتمام المهام والروتين وتقديم إغلاق اليوم والمراجعة الإدارية.", "إعداد البرامج والجداول القابلة للضبط، وسجلات الحضور عبر QR، ولوحات التشغيل، والتقارير، والإشعارات والدردشة والتكاملات الفورية وTwilio وWhatsApp بموافقة بشرية.", "التقنيات: Next.js 15 وReact 19 وJavaScript وPostgreSQL وDrizzle ORM وNextAuth وREST APIs وSocket.IO وTwilio وGit/GitHub وVercel."] },
    { role: "مشرف عام – عمليات المدرسة وقيادة المجتمع", organization: "Meed Public School · جهارخاند، الهند", period: "يناير 2018 – 2021", points: ["قيادة العمليات الأكاديمية والسكنية والإدارية والتواصل مع أولياء الأمور في مدرسة ريفية خدمت أكثر من 300 طالب وأسرة، منهم أكثر من 100 طالب مقيم.", "بناء هيكل تشغيلي لفرق المكتب والأكاديميات والسكن، مع تقارير يومية واجتماعات مراجعة وملكية واضحة وإدارة عملية للأداء.", "تعزيز مشاركة أولياء الأمور عبر الاجتماعات الدورية والمراجعات الفصلية وتقارير تقدم الطلاب والتواصل اليومي مع أولياء الأمور."], more: ["المساهمة في نمو المؤسسة من 80–100 طالب إلى أكثر من 300 طالب، ومن فريق من 6–7 إلى 30–35 عضواً.", "إدارة تخطيط المدرسة وتنسيق الموظفين والتوظيف والروتين السكني ورفاه الطلاب ومتابعة الرسوم وبناء الثقة المجتمعية في بيئة نائية.", "توسيع المرافق والقدرة التشغيلية، بما فيها مختبر الحاسوب والمكتبة وقاعة الطعام والنقل المدرسي؛ ونما الميزانية السنوية من نحو 10–12 إلى 70–80 lakh روبية.", "اتباع منهج للتحسين المستمر: ملاحظة المشكلة وتصميم تدخل وقياس النتيجة وتحسين العملية مع الموظفين والأسر."] },
    { role: "زميل مختبر تطبيقي للرؤية الحاسوبية والتعلم العميق", organization: "WorldQuant University · عبر الإنترنت", period: "2026 – حتى الآن", points: ["تطوير مسارات تصنيف وشبكات GAN ونماذج انتشار باستخدام PyTorch وتجارب سحابية.", "بناء أنظمة لتصنيف صور كاميرات الحياة البرية واكتشاف أمراض المحاصيل باستخدام CNN ونقل التعلم والأجهزة الافتراضية السحابية.", "إعداد مسارات عمل قابلة لإعادة الإنتاج باستخدام Flask وStreamlit وDocker."] },
    { role: "متدرب علوم بيانات متقدمة", organization: "IDEAS-TIH · المعهد الإحصائي الهندي (ISI)، كولكاتا، الهند", period: "مايو 2026 – يوليو 2026", demo: "https://youtu.be/LX_btzkvX60", points: ["تطوير محرك البحث والاستدلال الموحد لمشروع Video RAG متعدد الوسائط لفهم مقاطع وصفات الطعام.", "دمج FAISS للاسترجاع الكثيف وBM25 للاسترجاع المعجمي وNetworkX لاستكشاف الرسم المعرفي ضمن VideoRAGEngine معياري.", "اختبار خمس مجموعات مرجعية لوصفات بنغالية: 384 مقطعاً متعدد الوسائط ورسم معرفي من 59 عقدة و81 حافة، مع Gemini وQwen2.5 وآليات رجوع."] },
    { role: "مطور ويب · منصة سوق الأسهم الماليزية", organization: "مجموعة معالجة الكلام، كلية علوم الحاسوب · Universiti Sains Malaysia", project: "مشروع التداول الخوارزمي · بينانغ، ماليزيا", period: "1 مارس 2023 – 31 أغسطس 2023", points: ["خلال تدريب تطوير الويب، ساهمت في تطوير الواجهة والخلفية لموقع سوق الأسهم الماليزية لتقديم تحديثات الأسهم والأخبار المرتبطة بالشركات.", "بناء البحث عن الشركات والتنقل إلى صفحاتها، مع صفحات ديناميكية لقائمة الشركات والملفات التعريفية والبيانات التاريخية والأخبار."], more: ["تنفيذ البحث من الصفحة الرئيسية: معالجة اسم الشركة وتوحيدها وربطها برمز السهم ثم توجيه المستخدم إلى صفحة الشركة المناسبة.", "تطوير مسارات Express للصفحة الرئيسية ودليل الشركات وصفحات التفاصيل وصفحة خطأ لعمليات البحث غير المدعومة.", "إنشاء قوالب EJS ديناميكية لعرض القوائم والملفات التعريفية والبيانات التاريخية والأخبار.", "ربط وحدات منفصلة لجلب بيانات الأسعار التاريخية وملفات الشركات والأخبار، مع إبقاء هذه المهام خارج معالج المسارات الرئيسي.", "استخدام Axios وCheerio لجلب البيانات وPuppeteer لمهام الجمع عبر المتصفح وSQLite ضمن تخزين التطبيق.", "تقديم ملفات CSS والصور عبر Express وإضافة أوامر تشغيل للتطوير والإنتاج، بما فيها Nodemon أثناء التطوير.", "التقنيات: Node.js وExpress.js وEJS وJavaScript وSQLite وAxios وCheerio وPuppeteer وHTML وCSS وNodemon."] },
  ] : experience;
  const experienceOrder = {
    "Technology Lead – Organisational Digital Ecosystem": 5,
    "Advanced Data Science Intern": 4,
    "CV & Deep Learning Fellow": 2,
    "Web Developer · Malaysia Equity Market Platform": 3,
    "Superintendent – School Operations & Community Leadership": 1,
    "قائد التقنية – المنظومة الرقمية للمؤسسة": 5,
    "متدرب علوم بيانات متقدمة": 4,
    "زميل مختبر تطبيقي للرؤية الحاسوبية والتعلم العميق": 2,
    "مطور ويب · منصة سوق الأسهم الماليزية": 3,
    "مشرف عام – عمليات المدرسة وقيادة المجتمع": 1,
  };
  const orderedRoles = [...roles].sort((a, b) => (experienceOrder[b.role] || 0) - (experienceOrder[a.role] || 0));
  return (
    <main className="employer-portfolio bg-[#f7f8fa] text-slate-900 dark:bg-[#090d13] dark:text-slate-100">
      <ScrollExperience />
      <section id="overview" dir="ltr" className="hero-science relative isolate mx-auto grid max-w-6xl items-start gap-10 overflow-hidden px-5 pb-8 pt-2 md:grid-cols-[minmax(0,1fr)_minmax(320px,410px)] md:gap-14 md:px-8 md:pb-10 md:pt-3">
        <div aria-hidden="true" className="hero-science-glow hero-science-glow-one" />
        <div aria-hidden="true" className="hero-science-glow hero-science-glow-two" />
        <div aria-hidden="true" className="hero-science-art">
          <div className="hero-orbital-system">
            <div className="hero-orbital-halo" />
            <div className="hero-orbital-sphere">
              <span className="hero-sphere-latitude hero-sphere-latitude-one" />
              <span className="hero-sphere-latitude hero-sphere-latitude-two" />
              <span className="hero-sphere-longitude hero-sphere-longitude-one" />
              <span className="hero-sphere-longitude hero-sphere-longitude-two" />
              <span className="hero-sphere-shine" />
            </div>
            <span className="hero-orbit-track hero-orbit-track-one" />
            <span className="hero-orbit-track hero-orbit-track-two" />
            <i className="hero-orbital-satellite satellite-one" />
            <i className="hero-orbital-satellite satellite-two" />
            <div className="hero-type-signal"><span>BUILDING</span><b>APPLIED AI</b><i /></div>
          </div>
          <svg className="hero-science-network" viewBox="0 0 900 620" fill="none" preserveAspectRatio="xMidYMid slice">
            <path className="science-line science-line-a" d="M46 438 188 322 314 371 430 208 574 255 718 126 858 190" />
            <path className="science-line science-line-b" d="m188 322 28-185 214 71 144-111 144 29M314 371l65 166 195-282 144 88 140-153" />
            <path className="science-line science-line-c" d="m46 438 121 113 212-14 125-282 214 21 140-86" />
            <circle className="science-node node-a" cx="188" cy="322" r="5" /><circle className="science-node node-b" cx="314" cy="371" r="4" />
            <circle className="science-node node-c" cx="430" cy="208" r="6" /><circle className="science-node node-d" cx="574" cy="255" r="4" />
            <circle className="science-node node-e" cx="718" cy="126" r="5" /><circle className="science-node node-f" cx="718" cy="126" r="18" />
            <circle className="science-node node-g" cx="379" cy="537" r="4" /><circle className="science-node node-h" cx="858" cy="190" r="4" />
            <ellipse className="science-orbit orbit-a" cx="710" cy="300" rx="120" ry="42" transform="rotate(-28 710 300)" />
            <ellipse className="science-orbit orbit-b" cx="710" cy="300" rx="168" ry="64" transform="rotate(-28 710 300)" />
          </svg>
          <div className="science-data science-data-top"><span>NEURAL SYSTEMS</span><i>01 / 04</i></div>
          <div className="science-data science-data-bottom"><span>AI · DATA · SYSTEMS</span><i>● LIVE MODEL</i></div>
          <span className="science-crosshair crosshair-one" /><span className="science-crosshair crosshair-two" />
        </div>
        <div dir={lang === "ar" ? "rtl" : "ltr"}>
          <div dir="ltr" className="hero-name-row mt-5 flex items-center justify-start md:block">
            <h1 className="hero-name font-bold tracking-tight"><span className="hero-name-greeting" dir={lang === "ar" ? "rtl" : "ltr"}>{c.greeting}</span><span className="hero-name-person">Nafis Aslam</span></h1>
            <div className="hero-mobile-avatar relative shrink-0 overflow-hidden border-4 border-white shadow-xl ring-1 ring-indigo-200 dark:border-slate-900 dark:ring-indigo-400/40 md:hidden">
              <Image src="/images/me1.jpg" alt="Nafis Aslam" width={1734} height={1678} priority className="h-full w-full object-cover object-[center_22%]" />
            </div>
          </div>
          <TypedHeroRole lang={lang} />
          <p className="portfolio-hero-intro mt-5 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">{c.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="inline-flex items-center rounded-full bg-indigo-700 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-600" href="https://wa.me/601137576465" target="_blank" rel="noreferrer">{c.contact}</a>
            <a className={proofLink} href={cvHref} target="_blank" rel="noreferrer">{c.cv}</a>
            <Link className={proofLink} href="/#projects">{c.explore}</Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-slate-200 pt-6 text-sm dark:border-white/10">
            <span className="portfolio-hero-degree max-w-sm"><strong className="text-slate-950 dark:text-white">Universiti Sains Malaysia (USM), Malaysia</strong><span className="ml-2 text-slate-500">{c.bsc}</span></span>
            <span className="max-w-xs"><strong className="text-slate-950 dark:text-white">Massachusetts Institute of Technology</strong><span className="ml-2 text-slate-500">{c.mit}</span></span>
            <span><strong className="text-slate-950 dark:text-white">{lang === "ar" ? "إنجاز" : "Recognition"}</strong><span className="ml-2 text-slate-500">{c.award}</span></span>
          </div>
        </div>
        <TiltCard dir="ltr" className="relative hidden w-full max-w-[410px] justify-self-end md:block">
          <div aria-hidden="true" className="absolute -inset-3 rounded-[2.25rem] bg-gradient-to-br from-indigo-300/60 via-sky-200/40 to-transparent blur-xl dark:from-indigo-500/20 dark:via-sky-400/10" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white bg-slate-200 shadow-2xl shadow-indigo-950/15 ring-1 ring-slate-200/80 dark:border-white/10 dark:bg-slate-900 dark:ring-white/10">
          <Image src="/images/me1.jpg" alt="Nafis Aslam" fill priority sizes="(max-width: 768px) 90vw, 410px" className="object-cover object-[center_22%]" />
          <div className="absolute left-4 top-4 rounded-full border border-white/50 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-lg backdrop-blur dark:border-white/15 dark:bg-slate-950/70 dark:text-white">
            {lang === "ar" ? "الهند · متاح للانتقال إلى الخليج" : "India · Gulf relocation available"}
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent p-6 pt-28 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200">{c.research}</p>
            <p className="mt-1 text-lg font-semibold">DeepLens Engine for Focus</p>
            <a className="mt-2 inline-block text-sm text-white/80 underline decoration-white/40 underline-offset-4 hover:text-white" href="https://www.youtube.com/watch?v=Je0_qLxRbX8&t=118s" target="_blank" rel="noreferrer">{c.video}</a>
          </div>
          </div>
        </TiltCard>
      </section>

      <section className="border-y border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.025]">
        <div className="mx-auto grid max-w-6xl gap-5 px-5 py-12 md:grid-cols-3 md:px-8">
          <TiltCard className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-indigo-50/80 p-6 shadow-sm dark:border-white/10 dark:from-white/[0.07] dark:to-indigo-400/[0.04]"><p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">{c.flagship}</p><h2 className="mt-2 text-xl font-bold">{c.focus}</h2><p className="portfolio-highlight-copy mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{c.focusText}</p></TiltCard>
          <TiltCard className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-sky-50/80 p-6 shadow-sm dark:border-white/10 dark:from-white/[0.07] dark:to-sky-400/[0.04]"><p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">{c.forecast}</p><h2 className="mt-2 text-xl font-bold">{c.forecastTitle}</h2><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{c.forecastText}</p></TiltCard>
          <TiltCard className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-violet-50/80 p-6 shadow-sm dark:border-white/10 dark:from-white/[0.07] dark:to-violet-400/[0.04]"><p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">{c.shipped}</p><h2 className="mt-2 text-xl font-bold">{c.fullStack}</h2><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{c.fullStackText}</p></TiltCard>
        </div>
      </section>

      <section id="experience" className="portfolio-science-section mx-auto max-w-6xl scroll-mt-20 px-5 py-16 md:px-8">
        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">{c.career}</p><h2 className="mt-2 text-3xl font-bold md:text-4xl">{c.experience}</h2></div><span className="experience-ledger">{lang === "ar" ? "سجل المسار المهني · 2018 حتى الآن" : "Career record · 2018—present"}</span></div>
        <div className={`experience-journey ${lang === "ar" ? "experience-journey-rtl" : ""}`}>
          {orderedRoles.map((item, index) => <TiltCard key={item.role} dir={lang === "ar" ? "ltr" : undefined} className="experience-card relative grid gap-5 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-900/5 dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-indigo-300/30 md:grid-cols-[240px,1fr] md:gap-8">
            <span className="experience-node" aria-hidden="true"><i>{String(index + 1).padStart(2, "0")}</i></span>
            <div dir={lang === "ar" ? "rtl" : undefined} className="experience-meta"><span className="experience-label">{lang === "ar" ? "محطة مهنية" : "Career chapter"}</span><h3 className="mt-2 font-bold">{item.role}</h3><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.organization}</p><ExperienceProofLinks item={item} lang={lang} />{item.project && <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">{item.project}</p>}<p className="mt-3 text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">{item.period}</p>{item.gallery && <Link href="/ventures" className="experience-primary-project-link mt-3">{lang === "ar" ? "استكشف مشاريع المنظومة ↓" : "Explore ecosystem projects ↓"}</Link>}{item.demo && <div className="experience-proof-row mt-3"><a className="experience-demo-thumb" href={item.demo} target="_blank" rel="noreferrer" aria-label={lang === "ar" ? "فيديو مشروع التدريب" : "Internship project video"}><img src="https://i.ytimg.com/vi/LX_btzkvX60/hqdefault.jpg" alt="VideoRAG internship project video thumbnail" /><span>▶</span><small>{lang === "ar" ? "فيديو المشروع" : "Internship project video"}</small></a>{item.report && <a className="experience-report-thumb" href={item.report} target="_blank" rel="noreferrer"><span>PDF</span><div><small>{lang === "ar" ? "توثيق التدريب" : "Internship documentation"}</small><strong>{lang === "ar" ? "عرض التقرير" : "View report"}</strong></div></a>}</div>}</div>
            <div dir={lang === "ar" ? "rtl" : undefined}><ExperienceHighlights item={item} lang={lang} />{item.resourceLabel && <a href={item.resourceLink} target="_blank" rel="noreferrer" className="experience-pdf-preview mt-3" aria-label={lang === "ar" ? "فتح معاينة رحلة Meed" : "Open My Meed Journey PDF"}><div className="experience-pdf-sheet"><iframe src={`${item.resourceLink}#page=1&toolbar=0&navpanes=0&scrollbar=0`} title="My Meed Journey PDF preview" tabIndex="-1" /></div><span><b>PDF</b><small>{lang === "ar" ? "معاينة رحلة Meed" : "My Meed Journey · Preview"}</small></span><i>↗</i></a>}{item.gallery && <MeedRelatedProducts lang={lang} />}{item.gallery && <Link href={item.resourceLink || "/ventures/meed-public-school#resources"} className="experience-primary-project-link mt-4">{lang === "ar" ? "عرض مشروع المدرسة ←" : "View school venture →"}</Link>}<ExperienceVisualProof item={item} lang={lang} /></div>
          </TiltCard>)}
        </div>
      </section>

      <section id="projects" className="projects-showcase relative isolate scroll-mt-20 overflow-hidden border-y border-indigo-100/80 dark:border-indigo-300/10">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-300">{c.selected}</p><h2 className="mt-2 text-3xl font-bold md:text-4xl">{c.projects}</h2><p className="mt-3 max-w-2xl text-slate-300">{c.projectIntro}</p></div><Link className="inline-flex w-fit rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-indigo-100" href="/ventures">{c.allProjects}</Link></div>
          <div className={`project-journey mt-10 ${lang === "ar" ? "project-journey-rtl" : ""}`}>
            <TiltCard className="project-journey-card project-journey-featured rounded-3xl border border-indigo-200/80 bg-gradient-to-br from-white to-indigo-50/90 p-7 shadow-xl shadow-indigo-950/10 md:p-8"><span className="project-journey-index">01</span><div className="text-xs font-bold uppercase tracking-widest text-indigo-700">{c.cvProject}</div><h3 className="mt-3 text-2xl font-bold text-slate-950 md:text-3xl">{lang === "ar" ? "DeepWork AI / محرك DeepLens للتركيز" : "DeepWork AI / DeepLens Engine"}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{lang === "ar" ? "تصنيف الانتباه والسلوك عبر كاميرا الويب ضمن ست حالات، باستخدام YOLO وMediaPipe ونهج زمني مدته 20/30 ثانية. صُمم للاستدلال على الجهاز دون تخزين الفيديو." : "Webcam attention classification across six behaviours, combining YOLO and MediaPipe with temporal validation and context-aware nudges. Focus sessions, goal-linked work, analytics, and privacy-aware local frame processing."}</p><div className="mt-5 flex flex-wrap gap-2"><a className="rounded-full bg-indigo-700 px-4 py-2 text-xs font-semibold text-white" href="https://deep-work-ai-nu.vercel.app/" target="_blank" rel="noreferrer">{c.live}</a><a className="rounded-full border border-indigo-200 bg-white/70 px-4 py-2 text-xs font-semibold text-indigo-700" href="https://youtu.be/Je0_qLxRbX8" target="_blank" rel="noreferrer">{c.video}</a><a className="rounded-full border border-indigo-200 bg-white/70 px-4 py-2 text-xs font-semibold text-indigo-700" href="https://doi.org/10.5281/zenodo.19266394" target="_blank" rel="noreferrer">{c.paperLink}</a></div><details className="portfolio-disclosure portfolio-icon-disclosure mt-5"><summary aria-label={lang === "ar" ? "تفاصيل المشروع" : "Project details"} title={lang === "ar" ? "تفاصيل المشروع" : "Project details"}><span className="sr-only">{lang === "ar" ? "تفاصيل المشروع" : "Project details"}</span></summary><LocalizedProjectDetails lang={lang} kind="deepWork"><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600"><li>Final-year project at Universiti Sains Malaysia (CAT405); Gold Award, USM PIXEL 2025; first-author research preprint.</li><li>DeepLens Engine for Focus: four layers for primary state classification, visual validation, temporal filtering, and context-aware feedback.</li><li>YOLOv11n-cls recognises Focused, Phone, Absent, Drowsy, LookingAway, and BadPosture. Dataset: 1,080 labelled base images, augmented to approximately 3,000; reported validation accuracy 94.76%.</li><li>Auxiliary signals use MediaPipe pose landmarks, FaceMesh iris tracking, Eye Aspect Ratio, YOLOv8, and OpenCV. Transient frame changes are filtered before selected audio/visual nudges.</li><li>Product features include Pomodoro-style focus/break sessions, goals, session summaries, focus analytics, and progress views. Video is processed locally; documentation describes storing derived metrics rather than video recordings.</li><li>Technology: Next.js, React, Tailwind CSS, Flask, Python, PostgreSQL, Drizzle ORM, Clerk, PyTorch, Ultralytics YOLO, MediaPipe, OpenCV.</li></ul></LocalizedProjectDetails></details></TiltCard>
            <TiltCard className="project-journey-card rounded-3xl border border-amber-200/80 bg-gradient-to-br from-white to-amber-50/90 p-6 shadow-lg shadow-amber-950/10 md:mt-20"><span className="project-journey-index">02</span><div className="text-xs font-bold uppercase tracking-widest text-amber-700">{lang === "ar" ? "أتمتة الذكاء الاصطناعي · تجربة العملاء" : "AI automation · customer operations"}</div><h3 className="mt-3 text-2xl font-bold text-slate-950">{lang === "ar" ? "موظف استقبال صوتي بالذكاء الاصطناعي" : "AI Voice Receptionist"}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{lang === "ar" ? "نظام استقبال صوتي لإدارة العملاء الجدد والحجوزات وتعديل المواعيد وإجابات قاعدة المعرفة مع تسجيل كامل للمكالمة." : "A voice front desk for new customers, appointments, rescheduling, knowledge-base questions, and complete call logging."}</p><div className="mt-5"><Link className="rounded-full border border-amber-200 bg-white/70 px-4 py-2 text-xs font-semibold text-amber-800" href="/ventures#ai-voice-receptionist">{lang === "ar" ? "عرض سير العمل ←" : "View workflow →"}</Link></div></TiltCard>
            <TiltCard className="project-journey-card rounded-3xl border border-sky-200/80 bg-gradient-to-br from-white to-sky-50/90 p-6 shadow-lg shadow-sky-950/10"><span className="project-journey-index">03</span><div className="text-xs font-bold uppercase tracking-widest text-indigo-700">{c.platform}</div><h3 className="mt-3 text-2xl font-bold text-slate-950">MeedianAI Flow</h3><p className="mt-3 text-sm leading-6 text-slate-600">{lang === "ar" ? "منصة لإدارة عمليات المدارس والمجتمعات بصلاحيات حسب الأدوار، وتشمل الجداول والمهام والحضور والرسائل والاستفسارات والتقارير." : "Role-based school and community operations platform spanning schedules, routines, tasks, attendance, messaging, enquiries, and reporting."}</p><div className="mt-5 flex flex-wrap gap-2"><a className="rounded-full bg-indigo-700 px-4 py-2 text-xs font-semibold text-white" href="https://meedian-ai-flow-v222.vercel.app/" target="_blank" rel="noreferrer">{c.live}</a><a className="rounded-full border border-indigo-200 bg-white/70 px-4 py-2 text-xs font-semibold text-indigo-700" href="https://github.com/NafisAslam70/MeedianAI-Flow-v2" target="_blank" rel="noreferrer">{c.github}</a></div></TiltCard>
            <TiltCard className="project-journey-card rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-white to-emerald-50/90 p-6 shadow-lg shadow-emerald-950/10 md:mt-16"><span className="project-journey-index">04</span><div className="text-xs font-bold uppercase tracking-widest text-emerald-700">{lang === "ar" ? "أتمتة الذكاء الاصطناعي · المالية" : "AI automation · finance"}</div><h3 className="mt-3 text-2xl font-bold text-slate-950">{lang === "ar" ? "أتمتة معالجة الفواتير بالذكاء الاصطناعي" : "AI Invoice Processing Automation"}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{lang === "ar" ? "يتابع مجلد الفواتير، ويستخرج بيانات PDF، وينظم الحقول باستخدام الذكاء الاصطناعي، ثم يسجلها ويرسل إشعاراً لفريق الفوترة." : "A workflow that watches incoming invoices, extracts PDF text, structures the important fields with AI, records them, and alerts the billing team."}</p><div className="mt-5"><Link className="rounded-full border border-emerald-200 bg-white/70 px-4 py-2 text-xs font-semibold text-emerald-800" href="/ventures#ai-invoice-processing-automation">{lang === "ar" ? "عرض سير العمل ←" : "View workflow →"}</Link></div></TiltCard>
            <TiltCard dir={lang === "ar" ? "rtl" : undefined} className="project-journey-card rounded-3xl border border-indigo-200/80 bg-gradient-to-br from-white to-indigo-50/90 p-6 shadow-xl shadow-indigo-950/10">
              <span className="project-journey-index">05</span>
              <p className="academic-project-eyebrow">{lang === "ar" ? "مشاريع جامعية وبحثية" : "UNIVERSITY & RESEARCH"}</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950">{lang === "ar" ? "مشاريع البحث" : "Research Projects"}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{lang === "ar" ? "أعمال مختارة في الرؤية الحاسوبية والتعلم الآلي واسترجاع الفيديو." : "Selected work in computer vision, machine learning, and knowledge-graph video retrieval."}</p>
              <details className="portfolio-disclosure mt-4">
                <summary>{lang === "ar" ? "عرض 3 معاينات للمشاريع" : "Show 3 project previews"}</summary>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {researchProjectPreviews.slice(0, 3).map((project) => <li key={project.title}>{project.title}</li>)}
                </ul>
              </details>
              <Link className="academic-project-cta mt-4" href="/ventures#research-university-projects">
                {lang === "ar" ? "التفاصيل الكاملة في صفحة المشاريع" : "Full details on project page"} <FaArrowUpRightFromSquare aria-hidden="true" />
              </Link>
            </TiltCard>
            <TiltCard dir={lang === "ar" ? "rtl" : undefined} className="project-journey-card rounded-3xl border border-violet-200/80 bg-gradient-to-br from-white to-violet-50/90 p-6 shadow-xl shadow-indigo-950/10">
              <span className="project-journey-index">06</span>
              <p className="academic-project-eyebrow">{lang === "ar" ? "ماجستير مصغر في الإحصاء وعلوم البيانات" : "MITx MICROMASTERS · STATISTICS & DATA SCIENCE"}</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950">{lang === "ar" ? "مشاريع MIT" : "MIT Projects"}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{lang === "ar" ? "أربعة مشاريع تطبيقية في النمذجة الاحتمالية والبيانات والشبكات والتنبؤ." : "Four applied projects in probabilistic modelling, genomics, forecasting, and network analysis."}</p>
              <details className="portfolio-disclosure mt-4">
                <summary>{lang === "ar" ? "عرض 3 معاينات للمشاريع" : "Show 3 project previews"}</summary>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {mitMicroMastersProjects.slice(0, 3).map((project) => <li key={project.title}>{project.title}</li>)}
                </ul>
              </details>
              <Link className="academic-project-cta mt-4" href="/ventures#mitx-micromasters-projects">
                {lang === "ar" ? "التفاصيل الكاملة في صفحة المشاريع" : "Full details on project page"} <FaArrowUpRightFromSquare aria-hidden="true" />
              </Link>
            </TiltCard>
          </div>
          <div className="mt-10 flex justify-center"><Link className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-indigo-950/15 transition hover:-translate-y-1 hover:bg-indigo-50" href="/ventures">{lang === "ar" ? "استكشف كل المشاريع" : "Explore all projects"} <FaArrowUpRightFromSquare aria-hidden="true" /></Link></div>
        </div>
      </section>

      <section id="expertise" className="capability-map portfolio-science-section mx-auto max-w-6xl scroll-mt-20 px-5 py-16 md:px-8">
        <div className="relative z-10"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">{lang === "ar" ? "خريطة القدرات · 04 مجالات" : "Capability map · 04 domains"}</p><h2 className="mt-2 text-3xl font-bold md:text-4xl">{c.expertise}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">{lang === "ar" ? "مجالاتي التقنية مترابطة: من بناء المنتجات والأنظمة إلى تطبيق الذكاء الاصطناعي وتحويل البيانات إلى قرارات." : "A connected skill set spanning product engineering, reliable data systems, applied AI, and delivery."}</p></div>
        <svg aria-hidden="true" className="capability-links" viewBox="0 0 1000 500" fill="none"><path d="M150 120 500 250 850 120M150 380 500 250 850 380M150 120 150 380M850 120 850 380" /><circle cx="500" cy="250" r="8" /></svg>
        <div className="capability-cards relative z-10 mt-8 grid gap-4 sm:grid-cols-2">{expertise.map((item, index) => {
          const titlesAr = ["هندسة البرمجيات", "الأنظمة الخلفية وقواعد البيانات", "الذكاء الاصطناعي والتعلم الآلي التطبيقي", "البيانات والرؤية وتسليم الحلول"];
          return <TiltCard key={item.title} className="capability-card relative overflow-hidden rounded-2xl border border-indigo-100 bg-white/90 p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/80"><span className="capability-index">0{index + 1}</span><span className="capability-orbit" aria-hidden="true"><i /><i /><i /></span><h3 className="relative z-10 max-w-[80%] font-bold">{lang === "ar" ? titlesAr[index] : item.title}</h3><div className="relative z-10 mt-4 flex flex-wrap gap-2">{item.skills.slice(0, 5).map((skill) => <span key={skill} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">{skill}</span>)}</div><details className="portfolio-disclosure relative z-10 mt-4"><summary>{lang === "ar" ? "عرض مجموعة المهارات" : `View all ${item.skills.length} skills`}</summary><div className="mt-3 flex flex-wrap gap-2">{item.skills.slice(5).map((skill) => <span key={skill} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">{skill}</span>)}</div></details></TiltCard>;
        })}</div>
      </section>

      <section id="education" className="education-showcase border-y border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.025]">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">{c.educationEyebrow}</p><h2 className="mt-2 text-3xl font-bold md:text-4xl">{c.education}</h2><div className="education-journey mt-12 grid gap-5 md:grid-cols-3">
          <TiltCard className="education-step rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-indigo-50/70 p-6 shadow-sm dark:border-white/10 dark:from-white/[0.06] dark:to-indigo-400/[0.03]"><span className="education-step-index">01</span><h3 className="text-lg font-bold">Massachusetts Institute of Technology</h3><p className="mt-1 text-slate-700 dark:text-slate-300">{lang === "ar" ? "برنامج MicroMasters في الإحصاء وعلوم البيانات" : "MicroMasters Programme in Statistics and Data Science"}</p><p className="mt-2 text-sm text-slate-500">{lang === "ar" ? "مقدم عبر معهد البيانات والأنظمة والمجتمع (IDSS)" : "Offered through the Massachusetts Institute of Technology’s Institute for Data, Systems, and Society (IDSS)"} <span className="text-xs">({lang === "ar" ? "عبر الإنترنت" : "Online"})</span></p><p className="mt-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300">{lang === "ar" ? "أغسطس 2024 – ديسمبر 2025 · 16 شهراً" : "Aug 2024 – Dec 2025 · 16 months"}</p><p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{lang === "ar" ? "تحليل البيانات 93٪ · تعلم الآلة 83٪" : "Data Analysis 93% · Machine Learning 83%"}</p></TiltCard>
          <TiltCard className="education-step rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-sky-50/70 p-6 shadow-sm dark:border-white/10 dark:from-white/[0.06] dark:to-sky-400/[0.03]"><span className="education-step-index">02</span><h3 className="text-lg font-bold">Universiti Sains Malaysia (USM), Malaysia</h3><p className="mt-1 text-slate-700 dark:text-slate-300">{lang === "ar" ? "بكالوريوس علوم الحاسوب مع مرتبة الشرف — الحوسبة الذكية (الذكاء الاصطناعي)" : "Bachelor of Computer Science (Honours) — Intelligent Computing (AI)"}</p><p className="mt-2 text-sm text-slate-500">2021 – 2025 · Penang, Malaysia</p><p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{lang === "ar" ? "المعدل التراكمي 3.32/4.00 · معدل السنة النهائية 3.78 · قائمة العميد 3 مرات" : "CGPA 3.32/4.00 · Final-year GPA 3.78 · Dean’s List × 3"}</p></TiltCard>
          <TiltCard className="education-step rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-violet-50/70 p-6 shadow-sm dark:border-white/10 dark:from-white/[0.06] dark:to-violet-400/[0.03]"><span className="education-step-index">03</span><h3 className="text-lg font-bold">Indira Gandhi National Open University</h3><p className="mt-1 text-slate-700 dark:text-slate-300">{lang === "ar" ? "بكالوريوس الآداب مع مرتبة الشرف في اللغة الإنجليزية" : "Bachelor of Arts (Honours) in English (B.A. Hons.)"}</p><p className="mt-2 text-sm text-slate-500">2020 – 2024 · {lang === "ar" ? "التقدير: الدرجة الأولى" : "First Division"}</p></TiltCard>
        </div></div>
      </section>

      <section id="recognition" className="portfolio-science-section mx-auto max-w-6xl scroll-mt-20 px-5 py-14 md:px-8"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">{lang === "ar" ? "الجوائز والتقدير" : "Awards & recognition"}</p><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TiltCard className="rounded-2xl border border-amber-300/70 bg-gradient-to-br from-amber-50 to-yellow-100/60 p-5 shadow-md dark:border-amber-300/20 dark:from-amber-300/[0.08] dark:to-orange-300/[0.025]"><h3 className="font-bold">{lang === "ar" ? "المركز الدولي الثاني · ICSC 2026" : "International 2nd Rank · ICSC 2026"}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{lang === "ar" ? "فئة الكبار؛ تقدير ذهبي ضمن أفضل 1٪ من نحو 4,300 مشارك. سفير المسابقة لمنطقة كولكاتا." : "Senior category; Gold Honour, top 1% among approximately 4,300 participants. Selected as Kolkata-region ambassador."}</p></TiltCard>
        <TiltCard className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-indigo-50/70 p-5 shadow-sm dark:border-white/10 dark:from-white/[0.06] dark:to-indigo-400/[0.03]"><h3 className="font-bold">{lang === "ar" ? "الجائزة الذهبية · USM PIXEL 2025" : "Gold Award · USM PIXEL 2025"}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{lang === "ar" ? "عن DeepWork AI وDeepLens Engine for Focus." : "For DeepWork AI and the DeepLens Engine for Focus."}</p></TiltCard>
        <TiltCard className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-100 p-5 shadow-sm dark:border-white/10 dark:from-white/[0.06] dark:to-white/[0.02]"><h3 className="font-bold">{lang === "ar" ? "إنجازات أكاديمية وتقنية" : "Academic & technical recognition"}</h3><div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{lang === "ar" ? "تقدير ذهبي في IYMC (أفضل 2٪) · جوائز أفضل واجب من USM · Coding Ninjas: 250+ مسألة DSA." : "IYMC Gold Honour (top 2%) · USM Best Assignment Awards · Coding Ninjas: 250+ DSA problems."}<details className="portfolio-disclosure mt-3"><summary>{lang === "ar" ? "المزيد من الإنجازات" : "More achievements & leadership"}</summary><ul className="mt-3 space-y-2"><li>ICSC 2026 Kolkata-region ambassador: mentoring students, guiding coding and problem-solving, and supporting workshops.</li><li>2nd National Award, India, at ICSC 2026.</li><li>Ashoka Young Changemaker, The Impactful Journey with Meed Public School (2020), for founding and leading a residential school serving 300+ underserved students in rural Jharkhand.</li><li>Superintendent, Meed Public School (2018–2021): academic, residential, and operational leadership for 300+ students and families; this experience later informed the DeepLens attention research.</li><li>Dean’s List for three consecutive final semesters: Semester II 2023/2024, Semester I 2024/2025, Semester II 2024/2025.</li><li>Best Assignment Awards: CST235 (Computer Networks and Information Security, 2022) and CPC353 (Natural Language Processing, 2023); Coding Ninjas 100-day challenge, 250+ DSA problems, and approximately 50 LeetCode problems.</li></ul></details></div></TiltCard>
      </div></section>

      <section id="contact" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 md:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-5 py-10 text-center shadow-[0_24px_70px_-36px_rgba(79,70,229,0.45)] sm:px-8 md:py-14">
          <div className="absolute -left-16 top-0 h-40 w-40 rounded-full bg-violet-300/35 blur-3xl" aria-hidden="true" />
          <div className="absolute -right-12 bottom-0 h-40 w-40 rounded-full bg-cyan-300/35 blur-3xl" aria-hidden="true" />
          <div className="relative"><p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-700">{c.next}</p><h2 className="mt-2 text-3xl font-bold text-slate-950 md:text-4xl">{c.discuss}</h2><p className="contact-opportunities mx-auto mt-3 max-w-xl text-slate-600">{c.discussText}</p></div>
          <div className="relative mx-auto mt-8 grid max-w-4xl gap-3 text-slate-900 sm:grid-cols-2">
            <ContactCard href="mailto:nafisaslam70@gmail.com" icon={FaEnvelope} title={lang === "ar" ? "البريد الإلكتروني" : "Email"} detail="nafisaslam70@gmail.com" className="border-indigo-200 bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-950 hover:border-indigo-400" />
            <ContactCard href="https://wa.me/601137576465" icon={FaWhatsapp} title="WhatsApp" detail="+60 11-3757 6465" external className="border-emerald-200 bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-950 hover:border-emerald-400" />
            <ContactCard href="https://www.linkedin.com/in/nafis-aslam/" icon={FaLinkedinIn} title="LinkedIn" detail="/in/nafis-aslam" external className="border-sky-200 bg-gradient-to-br from-sky-100 to-blue-100 text-sky-950 hover:border-sky-400" />
            <ContactCard href="https://github.com/NafisAslam70" icon={FaGithub} title="GitHub" detail="@NafisAslam70" external className="border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-900 hover:border-slate-400" />
          </div>
        </div>
      </section>
      <MobileScrollNavigator lang={lang} />
      <MobileHireOverlay lang={lang} />
    </main>
  );
}
