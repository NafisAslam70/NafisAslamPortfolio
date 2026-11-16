'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion, useSpring } from "framer-motion";

function TiltCard({ children, className = "", style = {}, dir }) {
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

function ScrollExperience() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
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
        gsap.utils.toArray(".scroll-reveal-content").forEach((element) => {
          gsap.fromTo(element, { y: 26, rotateX: 4, transformPerspective: 900 }, {
            y: 0,
            rotateX: 0,
            duration: 0.78,
            ease: "power3.out",
            scrollTrigger: { trigger: element.closest(".portfolio-tilt"), start: "top 92%", once: true },
          });
        });
      }

      ScrollTrigger.refresh();
    });

    return () => {
      context.revert();
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
    role: "Software Engineer – Educational Technology",
    organization: "Meed Public School Society (MPS Society) · Jharkhand, India",
    period: "Aug 2025 – May 2026",
    points: [
      "Built MeedianAI Flow, an institutional operations platform with role-specific workspaces and permissions for administrators, managers, team managers, and frontline staff.",
      "Implemented schedules, attendance, recurring tasks, progress tracking, tickets, escalations, leave requests, and supervisor-chain approvals.",
      "Developed operational dashboards and reporting views; contributed AI-assisted support through DELU-GPT and backend assistant integrations.",
    ],
    more: [
      "Connected the institutional day lifecycle: day opening, scheduled activities, attendance capture, task and routine completion, day-close submissions, and managerial review.",
      "Built configurable programmes and schedules with time slots, staff roles, post codes, and class-by-period assignments.",
      "Implemented QR-based session attendance and staff gate in/out records, with administrative and managerial monitoring screens.",
      "Integrated notifications, chat, Socket.IO real-time features, Twilio telephony workflows, and human-approved WhatsApp notifications.",
      "Worked across Next.js App Router, shared UI components, domain-organised API routes, PostgreSQL, Drizzle schema, NextAuth, role-aware access, debugging, and Vercel deployment.",
      "Helped shape a configurable institutional product supporting different programmes, operating rules, role structures, workflows, and branding.",
      "Technology: Next.js 15, React 19, JavaScript, PostgreSQL, Drizzle ORM, NextAuth, REST APIs, Socket.IO, Twilio, Git/GitHub, Vercel.",
    ],
  },
  {
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
    role: "Advanced Data Science Intern",
    organization: "IDEAS-TIH · Indian Statistical Institute (ISI), Kolkata, India",
    period: "May 2026 – Jul 2026",
    demo: "https://youtu.be/LX_btzkvX60",
    points: [
      "Developed the Layer 3 unified search and reasoning engine for a multimodal Video RAG system for recipe-video understanding.",
      "Combined FAISS dense retrieval, BM25 lexical search, and NetworkX knowledge-graph traversal behind a modular VideoRAGEngine interface.",
      "Evaluated five Bengali recipe-video benchmarks: 384 multimodal chunks and a knowledge graph with 59 nodes and 81 edges; integrated Gemini, local Qwen2.5, and fallback generation paths.",
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
    role: "Web Developer Intern · Malaysia Equity Market Platform",
    organization: "Speech Processing Group, School of Computer Sciences · Universiti Sains Malaysia",
    project: "Algorithmic Trading Project · Penang, Malaysia",
    period: "1 Mar 2023 – 31 Aug 2023",
    points: [
      "Contributed to frontend and backend development of a Malaysia equity market website providing stock updates and company-related news.",
      "Built company search and routing features, with server-rendered pages for company listings, profiles, historical market data, and news.",
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
  },  {
    role: "AI & Machine Learning Intern",
    organization: "YBI Foundation",
    period: "Jun 2024 – Jul 2024",
    points: [
      "Built a time-series forecasting pipeline with date reindexing, missing-date handling, lag and rolling features, weekday features, and chronological train/test split.",
      "Benchmarked persistence, Random Forest, SARIMA, and linear regression; persistence performed best at MAE 6.68 and MAPE 0.30%.",
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
    field: "Software Engineering · Applied AI / ML · Data Science & Analytics",
    role: "Research engineer and full-stack software developer building institutional platforms, data systems, and applied AI solutions for digital health and community-centred technology.",
    intro: "Computer Science graduate in Intelligent Computing (AI), with hands-on experience across full-stack software, backend systems, retrieval and reasoning, computer vision, and data pipelines. Based in India and available to relocate across the Gulf.",
    contact: "Contact me", cv: "Download CV ↗", explore: "Explore projects ↓", bsc: "Bachelor of Computer Science (Honours) — Intelligent Computing (AI)", mit: "MicroMasters programme · Online", award: "ICSC 2026 · International 2nd Rank · 2nd National Award · Top 1%",
    research: "Selected research", paper: "Read first-author preprint ↗", career: "Career history", experience: "Experience", selected: "Selected work", projects: "Projects with proof", projectIntro: "A closer look at systems I designed, built, evaluated, and documented.", allProjects: "View complete project portfolio ↗", toolkit: "Technical toolkit", expertise: "Expertise", educationEyebrow: "Education & recognition", education: "Academic foundation", next: "Next step", discuss: "Let’s discuss how I can contribute.", discussText: "For AI, machine learning, computer vision, data science, and software engineering opportunities.",
    flagship: "Institutional product delivery", forecast: "Applied AI / ML", shipped: "Research engineering", focus: "MeedianAI Flow", focusText: "Full-stack institutional operations platform with role-specific access, approvals, attendance, task workflows, and management reporting.", forecastTitle: "Video RAG search & reasoning", forecastText: "Layered retrieval combining FAISS, BM25, and knowledge-graph traversal for multimodal Bengali recipe-video understanding.", fullStack: "DeepWork AI / DLEF", fullStackText: "Computer-vision attention monitoring paired with a productivity platform; recipient of the USM PIXEL 2025 Gold Award.",
    cvProject: "Applied AI · Retrieval & Reasoning", platform: "Software Engineering · Product", data: "Data Science · Forecasting", fellowship: "Personal Product · Planning", live: "Live project ↗", video: "Demo video ↗", paperLink: "Paper ↗", github: "GitHub ↗", profile: "GitHub profile ↗", language: "English", location: "Based in India · Available to relocate across the Gulf",
  },
  ar: {
    field: "هندسة البرمجيات · الذكاء الاصطناعي التطبيقي · علوم البيانات والتحليلات",
    role: "مهندس أبحاث ومطور برمجيات متكاملة، أبني منصات مؤسسية وأنظمة بيانات وحلول ذكاء اصطناعي تطبيقي للصحة الرقمية والتقنيات المجتمعية.",
    intro: "خريج علوم الحاسوب بتخصص الحوسبة الذكية والذكاء الاصطناعي، لدي خبرة عملية في تطوير البرمجيات المتكاملة والأنظمة الخلفية والاسترجاع والاستدلال والرؤية الحاسوبية ومسارات البيانات. أقيم في الهند ومتاح للانتقال والعمل في أنحاء دول الخليج.",
    contact: "تواصل معي", cv: "تحميل السيرة الذاتية ↗", explore: "استكشف المشاريع ↓", bsc: "بكالوريوس علوم الحاسوب مع مرتبة الشرف — الحوسبة الذكية (الذكاء الاصطناعي)", mit: "برنامج MicroMasters · عبر الإنترنت", award: "المركز الدولي الثاني · الجائزة الوطنية الثانية · ضمن أفضل 1٪ في ICSC 2026",
    research: "أبحاث مختارة", paper: "قراءة البحث المنشور باسمي الأول ↗", career: "المسيرة المهنية", experience: "الخبرة", selected: "مشاريع مختارة", projects: "مشاريع مختارة", projectIntro: "نظرة على الأنظمة التي صممتها وطورتها وقيّمتها ووثّقتها.", allProjects: "عرض portfolio المشاريع بالكامل ↗", toolkit: "الأدوات التقنية", expertise: "التخصصات", educationEyebrow: "التعليم والإنجازات", education: "الأساس الأكاديمي", next: "الخطوة التالية", discuss: "لنتحدث عن كيفية مساهمتي في فريقكم.", discussText: "فرص في الذكاء الاصطناعي وتعلم الآلة والرؤية الحاسوبية وعلوم البيانات وهندسة البرمجيات.",
    flagship: "تطوير منتجات مؤسسية", forecast: "الذكاء الاصطناعي التطبيقي", shipped: "هندسة البحث", focus: "MeedianAI Flow", focusText: "منصة متكاملة لإدارة العمليات المؤسسية بصلاحيات حسب الأدوار، والموافقات، والحضور، والمهام، والتقارير الإدارية.", forecastTitle: "البحث والاستدلال عبر Video RAG", forecastText: "استرجاع متعدد الطبقات يجمع FAISS وBM25 واستكشاف الرسم البياني المعرفي لفهم مقاطع وصفات بنغالية متعددة الوسائط.", fullStack: "DeepWork AI / DLEF", fullStackText: "مراقبة الانتباه بالرؤية الحاسوبية ضمن منصة إنتاجية؛ حاز المشروع الجائزة الذهبية في USM PIXEL 2025.",
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

export default function EmployerPortfolio({ lang = "en" }) {
  const c = COPY[lang] || COPY.en;
  const cvHref = lang === "ar"
    ? "/pdfs/Nafis_Aslam_Gulf_CV_Arabic_Bilingual_With_LinkedIn.pdf"
    : "/pdfs/Nafis_Aslam_Gulf_CV_English_Master_With_LinkedIn.pdf";
  const roles = lang === "ar" ? [
    { role: "مهندس برمجيات – تقنيات التعليم", organization: "Meed Public School Society · جهارخاند، الهند", period: "أغسطس 2025 – مايو 2026", points: ["بناء MeedianAI Flow، منصة تشغيل مؤسسية بمساحات عمل وصلاحيات مخصصة للإدارة والمديرين والموظفين.", "تنفيذ الجداول والحضور والمهام المتكررة وتتبع التقدم والتذاكر والتصعيد وطلبات الإجازة والموافقات الإدارية.", "تطوير لوحات تشغيل وتقارير، والمساهمة في دعم مؤسسي بمساعدة الذكاء الاصطناعي عبر DELU-GPT وتكاملات المساعد الخلفي."] },
    { role: "زميل مختبر تطبيقي للرؤية الحاسوبية والتعلم العميق", organization: "WorldQuant University · عبر الإنترنت", period: "2026 – حتى الآن", points: ["تطوير مسارات تصنيف وشبكات GAN ونماذج انتشار باستخدام PyTorch وتجارب سحابية.", "بناء أنظمة لتصنيف صور كاميرات الحياة البرية واكتشاف أمراض المحاصيل باستخدام CNN ونقل التعلم والأجهزة الافتراضية السحابية.", "إعداد مسارات عمل قابلة لإعادة الإنتاج باستخدام Flask وStreamlit وDocker."] },
    { role: "متدرب علوم بيانات متقدمة", organization: "IDEAS-TIH · المعهد الإحصائي الهندي (ISI)، كولكاتا، الهند", period: "مايو 2026 – يوليو 2026", demo: "https://youtu.be/LX_btzkvX60", points: ["تطوير محرك البحث والاستدلال الموحد لمشروع Video RAG متعدد الوسائط لفهم مقاطع وصفات الطعام.", "دمج FAISS للاسترجاع الكثيف وBM25 للاسترجاع المعجمي وNetworkX لاستكشاف الرسم المعرفي ضمن VideoRAGEngine معياري.", "اختبار خمس مجموعات مرجعية لوصفات بنغالية: 384 مقطعاً متعدد الوسائط ورسم معرفي من 59 عقدة و81 حافة، مع Gemini وQwen2.5 وآليات رجوع."] },
    { role: "متدرب تطوير ويب · منصة سوق الأسهم الماليزية", organization: "مجموعة معالجة الكلام، كلية علوم الحاسوب · Universiti Sains Malaysia", project: "مشروع التداول الخوارزمي · بينانغ، ماليزيا", period: "1 مارس 2023 – 31 أغسطس 2023", points: ["المساهمة في تطوير الواجهة والخلفية لموقع سوق الأسهم الماليزية لتقديم تحديثات الأسهم والأخبار المرتبطة بالشركات.", "بناء البحث عن الشركات والتنقل إلى صفحاتها، مع صفحات ديناميكية لقائمة الشركات والملفات التعريفية والبيانات التاريخية والأخبار."], more: ["تنفيذ البحث من الصفحة الرئيسية: معالجة اسم الشركة وتوحيدها وربطها برمز السهم ثم توجيه المستخدم إلى صفحة الشركة المناسبة.", "تطوير مسارات Express للصفحة الرئيسية ودليل الشركات وصفحات التفاصيل وصفحة خطأ لعمليات البحث غير المدعومة.", "إنشاء قوالب EJS ديناميكية لعرض القوائم والملفات التعريفية والبيانات التاريخية والأخبار.", "ربط وحدات منفصلة لجلب بيانات الأسعار التاريخية وملفات الشركات والأخبار، مع إبقاء هذه المهام خارج معالج المسارات الرئيسي.", "استخدام Axios وCheerio لجلب البيانات وPuppeteer لمهام الجمع عبر المتصفح وSQLite ضمن تخزين التطبيق.", "تقديم ملفات CSS والصور عبر Express وإضافة أوامر تشغيل للتطوير والإنتاج، بما فيها Nodemon أثناء التطوير.", "التقنيات: Node.js وExpress.js وEJS وJavaScript وSQLite وAxios وCheerio وPuppeteer وHTML وCSS وNodemon."] },
    { role: "متدرب ذكاء اصطناعي وتعلم آلي", organization: "YBI Foundation", period: "يونيو 2024 – يوليو 2024", points: ["بناء مسار للتنبؤ الزمني شمل تجهيز التواريخ والميزات الزمنية وتقسيماً زمنياً للتدريب والاختبار لمنع تسرب البيانات.", "مقارنة Persistence وRandom Forest وSARIMA والانحدار الخطي؛ حقق Persistence أفضل نتيجة: MAE 6.68 وMAPE 0.30٪."] },
  ] : experience;
  return (
    <main className="employer-portfolio bg-[#f7f8fa] text-slate-900 dark:bg-[#090d13] dark:text-slate-100">
      <ScrollExperience />
      <section id="overview" dir="ltr" className="hero-science relative isolate mx-auto grid min-h-[78vh] max-w-6xl items-center gap-10 overflow-hidden px-5 py-10 md:grid-cols-[minmax(0,1fr)_minmax(320px,410px)] md:gap-14 md:px-8 md:py-14">
        <div aria-hidden="true" className="hero-science-glow hero-science-glow-one" />
        <div aria-hidden="true" className="hero-science-glow hero-science-glow-two" />
        <div aria-hidden="true" className="hero-science-art">
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
          <p className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700 dark:border-indigo-300/20 dark:bg-indigo-400/10 dark:text-indigo-200">{c.field}</p>
          <div dir="ltr" className="mt-5 flex items-center justify-between gap-4 md:block">
            <h1 className="text-4xl font-bold tracking-tight md:text-7xl">Nafis Aslam</h1>
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-xl ring-1 ring-indigo-200 dark:border-slate-900 dark:ring-indigo-400/40 md:hidden">
              <Image src="/images/me1.jpg" alt="Nafis Aslam" width={1734} height={1678} priority className="h-full w-full object-cover object-[center_22%]" />
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-xl font-medium leading-relaxed text-slate-700 dark:text-slate-200 md:text-2xl">{c.role}</p>
          <p className="mt-5 max-w-2xl leading-7 text-slate-600 dark:text-slate-400">{c.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="inline-flex items-center rounded-full bg-indigo-700 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-600" href="mailto:nafisaslam70@gmail.com">{c.contact}</a>
            <a className={proofLink} href={cvHref} target="_blank" rel="noreferrer">{c.cv}</a>
            <Link className={proofLink} href="/#projects">{c.explore}</Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-slate-200 pt-6 text-sm dark:border-white/10">
            <span className="max-w-sm"><strong className="text-slate-950 dark:text-white">Universiti Sains Malaysia (USM), Malaysia</strong><span className="ml-2 text-slate-500">{c.bsc}</span></span>
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
          <TiltCard className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-indigo-50/80 p-6 shadow-sm dark:border-white/10 dark:from-white/[0.07] dark:to-indigo-400/[0.04]"><p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">{c.flagship}</p><h2 className="mt-2 text-xl font-bold">{c.focus}</h2><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{c.focusText}</p></TiltCard>
          <TiltCard className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-sky-50/80 p-6 shadow-sm dark:border-white/10 dark:from-white/[0.07] dark:to-sky-400/[0.04]"><p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">{c.forecast}</p><h2 className="mt-2 text-xl font-bold">{c.forecastTitle}</h2><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{c.forecastText}</p></TiltCard>
          <TiltCard className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-violet-50/80 p-6 shadow-sm dark:border-white/10 dark:from-white/[0.07] dark:to-violet-400/[0.04]"><p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">{c.shipped}</p><h2 className="mt-2 text-xl font-bold">{c.fullStack}</h2><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{c.fullStackText}</p></TiltCard>
        </div>
      </section>

      <section id="experience" className="portfolio-science-section mx-auto max-w-6xl scroll-mt-28 px-5 py-16 md:px-8">
        <div className="mb-8 max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">{c.career}</p><h2 className="mt-2 text-3xl font-bold md:text-4xl">{c.experience}</h2></div>
        <div className="space-y-4">
          {roles.map((item) => <TiltCard key={item.role} dir={lang === "ar" ? "ltr" : undefined} className="experience-card grid gap-3 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-900/5 dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-indigo-300/30 md:grid-cols-[240px,1fr] md:gap-8">
            <div dir={lang === "ar" ? "rtl" : undefined}><h3 className="font-bold">{item.role}</h3><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.organization}</p>{item.project && <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">{item.project}</p>}<p className="mt-2 text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">{item.period}</p>{item.demo && <a className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 underline decoration-indigo-300 underline-offset-4 dark:text-indigo-300" href={item.demo} target="_blank" rel="noreferrer">{lang === "ar" ? "فيديو المشروع ↗" : "Internship project video ↗"}</a>}</div>
            <div dir={lang === "ar" ? "rtl" : undefined}><ul className="space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.points.map((point) => <li key={point} className="flex gap-2"><span className="text-indigo-600">•</span><span>{point}</span></li>)}</ul>{item.more?.length > 0 && <details className="portfolio-disclosure mt-4"><summary>{lang === "ar" ? "المزيد من التفاصيل والتقنيات" : "More details & technology"}</summary><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.more.map((point) => <li key={point} className="flex gap-2"><span className="text-indigo-600">•</span><span>{point}</span></li>)}</ul></details>}</div>
          </TiltCard>)}
        </div>
      </section>

      <section id="projects" className="projects-showcase relative isolate scroll-mt-28 overflow-hidden border-y border-indigo-100/80 dark:border-indigo-300/10">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-300">{c.selected}</p><h2 className="mt-2 text-3xl font-bold md:text-4xl">{c.projects}</h2><p className="mt-3 max-w-2xl text-slate-300">{c.projectIntro}</p></div><Link className="inline-flex w-fit rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-indigo-100" href="/ventures">{c.allProjects}</Link></div>
          <div className={`project-journey mt-10 ${lang === "ar" ? "project-journey-rtl" : ""}`}>
            <TiltCard className="project-journey-card project-journey-featured rounded-3xl border border-indigo-200/80 bg-gradient-to-br from-white to-indigo-50/90 p-7 shadow-xl shadow-indigo-950/10 md:p-8"><span className="project-journey-index">01</span><div className="text-xs font-bold uppercase tracking-widest text-indigo-700">{c.cvProject}</div><h3 className="mt-3 text-2xl font-bold text-slate-950 md:text-3xl">{lang === "ar" ? "DeepWork AI / محرك DeepLens للتركيز" : "DeepWork AI / DeepLens Engine"}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{lang === "ar" ? "تصنيف الانتباه والسلوك عبر كاميرا الويب ضمن ست حالات، باستخدام YOLO وMediaPipe ونهج زمني مدته 20/30 ثانية. صُمم للاستدلال على الجهاز دون تخزين الفيديو." : "Webcam attention classification across six behaviours, combining YOLO and MediaPipe with temporal validation and context-aware nudges. Focus sessions, goal-linked work, analytics, and privacy-aware local frame processing."}</p><div className="mt-5 flex flex-wrap gap-2"><a className="rounded-full bg-indigo-700 px-4 py-2 text-xs font-semibold text-white" href="https://deep-work-ai-nu.vercel.app/" target="_blank" rel="noreferrer">{c.live}</a><a className="rounded-full border border-indigo-200 bg-white/70 px-4 py-2 text-xs font-semibold text-indigo-700" href="https://youtu.be/Je0_qLxRbX8" target="_blank" rel="noreferrer">{c.video}</a><a className="rounded-full border border-indigo-200 bg-white/70 px-4 py-2 text-xs font-semibold text-indigo-700" href="https://doi.org/10.5281/zenodo.19266394" target="_blank" rel="noreferrer">{c.paperLink}</a></div><details className="portfolio-disclosure portfolio-icon-disclosure mt-5"><summary aria-label={lang === "ar" ? "تفاصيل المشروع" : "Project details"} title={lang === "ar" ? "تفاصيل المشروع" : "Project details"}><span className="sr-only">{lang === "ar" ? "تفاصيل المشروع" : "Project details"}</span></summary><LocalizedProjectDetails lang={lang} kind="deepWork"><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600"><li>Final-year project at Universiti Sains Malaysia (CAT405); Gold Award, USM PIXEL 2025; first-author research preprint.</li><li>DeepLens Engine for Focus: four layers for primary state classification, visual validation, temporal filtering, and context-aware feedback.</li><li>YOLOv11n-cls recognises Focused, Phone, Absent, Drowsy, LookingAway, and BadPosture. Dataset: 1,080 labelled base images, augmented to approximately 3,000; reported validation accuracy 94.76%.</li><li>Auxiliary signals use MediaPipe pose landmarks, FaceMesh iris tracking, Eye Aspect Ratio, YOLOv8, and OpenCV. Transient frame changes are filtered before selected audio/visual nudges.</li><li>Product features include Pomodoro-style focus/break sessions, goals, session summaries, focus analytics, and progress views. Video is processed locally; documentation describes storing derived metrics rather than video recordings.</li><li>Technology: Next.js, React, Tailwind CSS, Flask, Python, PostgreSQL, Drizzle ORM, Clerk, PyTorch, Ultralytics YOLO, MediaPipe, OpenCV.</li></ul></LocalizedProjectDetails></details></TiltCard>
            <TiltCard className="project-journey-card rounded-3xl border border-sky-200/80 bg-gradient-to-br from-white to-sky-50/90 p-6 shadow-lg shadow-sky-950/10 md:mt-20"><span className="project-journey-index">02</span><div className="text-xs font-bold uppercase tracking-widest text-indigo-700">{c.platform}</div><h3 className="mt-3 text-2xl font-bold text-slate-950">MeedianAI Flow</h3><p className="mt-3 text-sm leading-6 text-slate-600">{lang === "ar" ? "منصة لإدارة عمليات المدارس والمجتمعات بصلاحيات حسب الأدوار، وتشمل الجداول والمهام والحضور والرسائل والاستفسارات والتقارير." : "Role-based school and community operations platform spanning schedules, routines, tasks, attendance, messaging, enquiries, and reporting."}</p><div className="mt-5 flex flex-wrap gap-2"><a className="rounded-full bg-indigo-700 px-4 py-2 text-xs font-semibold text-white" href="https://meedian-ai-flow-v222.vercel.app/" target="_blank" rel="noreferrer">{c.live}</a><a className="rounded-full border border-indigo-200 bg-white/70 px-4 py-2 text-xs font-semibold text-indigo-700" href="https://github.com/NafisAslam70/MeedianAI-Flow-v2" target="_blank" rel="noreferrer">{c.github}</a></div><details className="portfolio-disclosure portfolio-icon-disclosure mt-5"><summary aria-label={lang === "ar" ? "تفاصيل المشروع" : "Project details"} title={lang === "ar" ? "تفاصيل المشروع" : "Project details"}><span className="sr-only">{lang === "ar" ? "تفاصيل المشروع" : "Project details"}</span></summary><LocalizedProjectDetails lang={lang} kind="meedian"/></details></TiltCard>
            <TiltCard className="project-journey-card rounded-3xl border border-violet-200/80 bg-gradient-to-br from-white to-violet-50/90 p-6 shadow-lg shadow-violet-950/10"><span className="project-journey-index">03</span><div className="text-xs font-bold uppercase tracking-widest text-indigo-700">{c.cvProject}</div><h3 className="mt-3 text-2xl font-bold text-slate-950">{lang === "ar" ? "VideoRAG · البحث والاستدلال الموحد" : "VideoRAG · Unified Search & Reasoning"}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{lang === "ar" ? "محرك معياري لفهم مقاطع وصفات بنغالية متعددة الوسائط. جمع FAISS وBM25 واستكشاف الرسم البياني عبر NetworkX، واختُبر على 384 مقطعاً و59 عقدة و81 حافة." : "Modular engine for multimodal Bengali recipe-video understanding. Combined FAISS, BM25, and NetworkX graph traversal; evaluated on 384 chunks and a graph with 59 nodes and 81 edges."}</p><div className="mt-5"><span className="rounded-full border border-violet-200 bg-white/70 px-4 py-2 text-xs font-semibold text-violet-800">IDEAS · ISI Kolkata</span><a className="rounded-full border border-violet-200 bg-white/70 px-4 py-2 text-xs font-semibold text-violet-800" href="https://youtu.be/LX_btzkvX60" target="_blank" rel="noreferrer">{c.video}</a></div><details className="portfolio-disclosure portfolio-icon-disclosure mt-5"><summary aria-label={lang === "ar" ? "تفاصيل المشروع" : "Project details"} title={lang === "ar" ? "تفاصيل المشروع" : "Project details"}><span className="sr-only">{lang === "ar" ? "تفاصيل المشروع" : "Project details"}</span></summary><LocalizedProjectDetails lang={lang} kind="videoRag"/></details></TiltCard>
            <TiltCard className="project-journey-card rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-white to-emerald-50/90 p-6 shadow-lg shadow-emerald-950/10 md:mt-16"><span className="project-journey-index">04</span><div className="text-xs font-bold uppercase tracking-widest text-indigo-700">{c.data}</div><h3 className="mt-3 text-2xl font-bold text-slate-950">{lang === "ar" ? "YBI · التنبؤ بحِمل الرعاية" : "YBI Care-Load Forecasting"}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{lang === "ar" ? "مسار تنبؤ زمني مع ميزات التأخر والمتوسطات المتحركة وتقسيم زمني للبيانات. حقق نموذج Persistence أفضل نتيجة: MAE 6.68 وMAPE 0.30٪." : "Time-series pipeline with lag and rolling features and chronological evaluation. Persistence was the strongest benchmark: MAE 6.68 and MAPE 0.30%."}</p><div className="mt-5"><a className="rounded-full border border-emerald-200 bg-white/70 px-4 py-2 text-xs font-semibold text-emerald-800" href="https://github.com/NafisAslam70/UF-Internship-hhs-care-forecast" target="_blank" rel="noreferrer">{c.github}</a></div><details className="portfolio-disclosure portfolio-icon-disclosure mt-5"><summary aria-label={lang === "ar" ? "تفاصيل المشروع" : "Project details"} title={lang === "ar" ? "تفاصيل المشروع" : "Project details"}><span className="sr-only">{lang === "ar" ? "تفاصيل المشروع" : "Project details"}</span></summary><LocalizedProjectDetails lang={lang} kind="forecast"/></details></TiltCard>
            <TiltCard className="project-journey-card rounded-3xl border border-amber-200/80 bg-gradient-to-br from-white to-amber-50/90 p-6 shadow-lg shadow-amber-950/10"><span className="project-journey-index">05</span><div className="text-xs font-bold uppercase tracking-widest text-indigo-700">{c.fellowship}</div><h3 className="mt-3 text-2xl font-bold text-slate-950">DeepCalendar</h3><p className="mt-3 text-sm leading-6 text-slate-600">{lang === "ar" ? "تطبيق ويب وهاتف للتخطيط يجمع الروتين الأسبوعي والخطط اليومية وفترات العمل المرتبطة بالأهداف وتتبع الوقت الفعلي وملاحظات نهاية اليوم." : "Planning companion to DeepWork AI in the DPM productivity ecosystem, connecting long-term goals with weekly routines and actionable daily work plans."}</p><div className="mt-5 flex flex-wrap gap-2"><a className="rounded-full border border-amber-200 bg-white/70 px-4 py-2 text-xs font-semibold text-amber-800" href="https://deep-calendar.vercel.app" target="_blank" rel="noreferrer">{c.live}</a><a className="rounded-full border border-amber-200 bg-white/70 px-4 py-2 text-xs font-semibold text-amber-800" href="https://github.com/NafisAslam70/deep-calendar" target="_blank" rel="noreferrer">{c.github}</a></div><details className="portfolio-disclosure portfolio-icon-disclosure mt-5"><summary aria-label={lang === "ar" ? "تفاصيل المشروع" : "Project details"} title={lang === "ar" ? "تفاصيل المشروع" : "Project details"}><span className="sr-only">{lang === "ar" ? "تفاصيل المشروع" : "Project details"}</span></summary><LocalizedProjectDetails lang={lang} kind="deepCalendar"><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600"><li>Web application built with Next.js 15, React 19, TypeScript, and a shared PostgreSQL backend; companion Expo/React Native mobile app.</li><li>Goal management, reusable weekly routines, custom single-day plans, routine time windows, and daily work blocks across three focus-depth levels.</li><li>Flexible merge-or-replace planning; planned, active, done, and skipped block states; actual-time recording, shutdown notes, and journaling.</li><li>Desktop weekly calendar and mobile single-day timeline, plus dashboard, routine builder, goals, account, and onboarding interfaces.</li><li>Drizzle ORM data model and APIs for authentication, goals, routines, day plans, block updates, and token-managed public read-only summaries. Cookie sessions for web and bearer tokens for mobile.</li><li>Technology: Next.js 15, React 19, TypeScript, PostgreSQL, Drizzle ORM, Tailwind CSS, Expo, React Native, Expo Router, JWT.</li></ul></LocalizedProjectDetails></details></TiltCard>
          </div>
        </div>
      </section>

      <section id="expertise" className="capability-map portfolio-science-section mx-auto max-w-6xl scroll-mt-28 px-5 py-16 md:px-8">
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

      <section id="recognition" className="portfolio-science-section mx-auto max-w-6xl scroll-mt-28 px-5 py-14 md:px-8"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">{lang === "ar" ? "الجوائز والتقدير" : "Awards & recognition"}</p><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TiltCard className="rounded-2xl border border-amber-300/70 bg-gradient-to-br from-amber-50 to-yellow-100/60 p-5 shadow-md dark:border-amber-300/20 dark:from-amber-300/[0.08] dark:to-orange-300/[0.025]"><h3 className="font-bold">{lang === "ar" ? "المركز الدولي الثاني · ICSC 2026" : "International 2nd Rank · ICSC 2026"}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{lang === "ar" ? "فئة الكبار؛ تقدير ذهبي ضمن أفضل 1٪ من نحو 4,300 مشارك. سفير المسابقة لمنطقة كولكاتا." : "Senior category; Gold Honour, top 1% among approximately 4,300 participants. Selected as Kolkata-region ambassador."}</p></TiltCard>
        <TiltCard className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-indigo-50/70 p-5 shadow-sm dark:border-white/10 dark:from-white/[0.06] dark:to-indigo-400/[0.03]"><h3 className="font-bold">{lang === "ar" ? "الجائزة الذهبية · USM PIXEL 2025" : "Gold Award · USM PIXEL 2025"}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{lang === "ar" ? "عن DeepWork AI وDeepLens Engine for Focus." : "For DeepWork AI and the DeepLens Engine for Focus."}</p></TiltCard>
        <TiltCard className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-100 p-5 shadow-sm dark:border-white/10 dark:from-white/[0.06] dark:to-white/[0.02]"><h3 className="font-bold">{lang === "ar" ? "إنجازات أكاديمية وتقنية" : "Academic & technical recognition"}</h3><div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{lang === "ar" ? "تقدير ذهبي في IYMC (أفضل 2٪) · جوائز أفضل واجب من USM · Coding Ninjas: 250+ مسألة DSA." : "IYMC Gold Honour (top 2%) · USM Best Assignment Awards · Coding Ninjas: 250+ DSA problems."}<details className="portfolio-disclosure mt-3"><summary>{lang === "ar" ? "المزيد من الإنجازات" : "More achievements & leadership"}</summary><ul className="mt-3 space-y-2"><li>ICSC 2026 Kolkata-region ambassador: mentoring students, guiding coding and problem-solving, and supporting workshops.</li><li>2nd National Award, India, at ICSC 2026.</li><li>Ashoka Young Changemaker, The Impactful Journey with Meed Public School (2020), for founding and leading a residential school serving 300+ underserved students in rural Jharkhand.</li><li>Superintendent, Meed Public School (2018–2022): academic operations and student welfare for 300+ residential students; this experience later informed the DeepLens attention research.</li><li>Dean’s List for three consecutive final semesters: Semester II 2023/2024, Semester I 2024/2025, Semester II 2024/2025.</li><li>Best Assignment Awards: CST235 (Computer Networks and Information Security, 2022) and CPC353 (Natural Language Processing, 2023); Coding Ninjas 100-day challenge, 250+ DSA problems, and approximately 50 LeetCode problems.</li></ul></details></div></TiltCard>
      </div></section>

      <section id="leadership" className="border-y border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.025]"><div className="mx-auto max-w-6xl px-5 py-14 md:px-8"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">{lang === "ar" ? "القيادة" : "Leadership"}</p><h2 className="mt-2 text-3xl font-bold">{lang === "ar" ? "إدارة العمليات والفرق" : "School operations & team leadership"}</h2><p className="mt-4 max-w-4xl leading-7 text-slate-600 dark:text-slate-400">{lang === "ar" ? "مشرف · Meed Public School · جهارخاند، الهند · 2018–2022. قيادة العمليات الأكاديمية والسكنية والإدارية اليومية في مدرسة داخلية؛ دعم تعليم وسلامة ورفاه أكثر من 300 طالب. تنسيق الأنشطة الأكاديمية والموظفين وروتين الطلاب والسكن، وقيادة التوظيف مع نمو الفريق من نحو 6–7 إلى 30–40 عضواً." : "Superintendent · Meed Public School · Jharkhand, India · 2018–2022. Led day-to-day academic, residential, and administrative operations at a fully residential school, supporting the education, safety, and welfare of 300+ students. Coordinated school planning and staff responsibilities; led recruitment as the team grew from around 6–7 to 30–40 members."}</p></div></section>
      <section id="contact" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-16 text-center md:px-8"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">{c.next}</p><h2 className="mt-2 text-3xl font-bold md:text-4xl">{c.discuss}</h2><p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">{c.discussText}</p><div className="mt-6 flex flex-wrap justify-center gap-3"><a className="rounded-full bg-indigo-700 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-600" href="mailto:nafisaslam70@gmail.com">nafisaslam70@gmail.com</a><a className={proofLink} href="https://wa.me/601137576465" target="_blank" rel="noreferrer">WhatsApp · +60 11-3757 6465 ↗</a><a className={proofLink} href="https://www.linkedin.com/in/nafis-aslam/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a className={proofLink} href="https://github.com/NafisAslam70" target="_blank" rel="noreferrer">GitHub ↗</a></div></section>
    </main>
  );
}
