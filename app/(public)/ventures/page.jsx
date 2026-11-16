import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Projects • Nafis Aslam | Gulf Software & Applied AI Portfolio",
  description:
    "Selected software engineering, applied AI/ML, data science, retrieval, computer vision, and forecasting projects by Nafis Aslam.",
};

const projects = [
  {
    category: "Software Engineering & Full-Stack",
    items: [
      {
        title: "MeedianAI Flow v2",
        description:
          "School and community operations platform with role-based dashboards, schedules, routines, tasks, attendance, approvals, messaging, student enquiries, and reporting.",
        stack: "Next.js · React · PostgreSQL · Drizzle · Prisma · Redis · NextAuth · Tailwind",
        github: "https://github.com/NafisAslam70/MeedianAI-Flow-v2",
        live: "https://meedian-ai-flow-v222.vercel.app/",
        gallery: [
          "/images/meedian/1.png",
          "/images/meedian/2.png",
          "/images/meedian/3.png",
          "/images/meedian/Screenshot%202026-11-15%20at%205.28.30%E2%80%AFPM.png",
          "/images/meedian/Screenshot%202026-11-17%20at%203.08.42%E2%80%AFAM.png",
          "/images/meedian/Screenshot%202026-11-17%20at%203.09.07%E2%80%AFAM.png",
          "/images/meedian/Screenshot%202026-11-17%20at%203.10.07%E2%80%AFAM.png",
          "/images/meedian/Screenshot%202026-11-17%20at%203.07.19%E2%80%AFAM.png",
          "/images/meedian/Screenshot%202026-11-17%20at%203.08.30%E2%80%AFAM.png",
          "/images/meedian/Screenshot%202026-11-17%20at%203.05.38%E2%80%AFAM.png",
          "/images/meedian/Screenshot%202026-11-17%20at%203.07.11%E2%80%AFAM.png",
        ],
      },
      {
        title: "MEED International School Website",
        description:
          "School website covering admissions, programmes, faculty, hostel, and events, with multilingual content, Sanity CMS, and enquiry routes.",
        stack: "Next.js · React · Sanity · PostgreSQL/Neon · Drizzle · Tailwind",
        github: "https://github.com/NafisAslam70/meedSchoolWeb",
        live: "https://www.mymeedai.org/",
      },
      {
        title: "MEED Society Website",
        description: "Website for Meed Development Society.",
        stack: "Website · Meed Development Society",
      },
      {
        title: "DeepCalendar",
        description:
          "Cross-platform planning app for weekly routines, custom day plans, goal-linked work blocks, actual-time tracking, and end-of-day shutdown notes.",
        stack: "Next.js · React · TypeScript · PostgreSQL · Drizzle ORM · Expo · React Native",
        github: "https://github.com/NafisAslam70/deep-calendar",
        live: "https://deep-calendar.vercel.app",
      },
      {
        title: "MeedianAI Finance",
        description:
          "Student and class records, fee structures, dues, payments, transport charges, Excel imports, and reporting for school finance workflows.",
        stack: "React · Vite · TypeScript · Express · PostgreSQL · Drizzle",
        github: "https://github.com/NafisAslam70/MeedianAI-Finance",
      },
      {
        title: "MEED Recruitment",
        description:
          "Recruitment application workflow with PDF CV upload, text and OCR extraction, and candidate review.",
        stack: "Flask · Python · pdfplumber · Tesseract · pdf2image · spaCy",
        github: "https://github.com/NafisAslam70/meed-recruitment",
      },
    ],
  },
  {
    category: "AI & Machine Learning",
    items: [
      {
        title: "DELU-GPT",
        description: "Flask AI assistant for prompt replies and syllabus or task breakdown.",
        stack: "Python · Flask · Flask-CORS · Ollama-backed client",
        github: "https://github.com/NafisAslam70/delu-gpt",
      },
      {
        title: "VideoRAG — Unified Search & Reasoning Engine",
        description:
          "Layer 3 engine for multimodal Bengali recipe-video understanding, combining dense FAISS retrieval, BM25 lexical search, NetworkX knowledge-graph traversal, and Gemini / local Qwen2.5 generation with fallbacks. Validated on five benchmarks with 384 multimodal chunks and a graph of 59 nodes and 81 edges.",
        stack: "Python · FAISS · BM25 · NetworkX · Gemini · Qwen2.5 · Multimodal RAG",
        video: "LX_btzkvX60",
        videoTitle: "VideoRAG internship project demo · IDEAS-TIH, ISI Kolkata",
      },
      {
        title: "Anomaly Detection System",
        description: "Streamlit prototype for scoring anomalous transactions with Isolation Forest.",
        stack: "Python · scikit-learn · Streamlit",
        github: "https://github.com/NafisAslam70/anomaly-detection-system",
        private: true,
      },
      {
        title: "Naive Bayes Text Classification",
        description:
          "Twenty Newsgroups classification with TF-IDF and MultinomialNB. The scikit-learn baseline reached 82.10%; a custom implementation result was not recorded.",
        stack: "Python · scikit-learn · TF-IDF · MultinomialNB",
        github: "https://github.com/NafisAslam70/text_classification",
        private: true,
      },
      {
        title: "30 ML Projects",
        description:
          "Learning projects and experiments. Verified content includes a basic workflow and logistic-regression notebook; this is a practice collection rather than 30 finished products.",
        stack: "Python · Machine Learning",
        github: "https://github.com/NafisAslam70/30-ML-Projects",
        status: "Learning collection",
      },
      {
        title: "Handwritten Digit Prediction",
        description: "Independent handwritten digit recognition project.",
        stack: "Python · Machine Learning",
        github: "https://github.com/NafisAslam70/Hand-Written-Digit-Prediction",
        status: "Practice project",
      },
    ],
  },
  {
    category: "Data Science & Analytics",
    items: [
      {
        title: "HHS Care Forecast Dashboard",
        description:
          "Daily children-in-care forecasting pipeline with date reindexing, missing-date handling, lag and rolling features, and chronological evaluation. Persistence performed best (MAE 6.68; MAPE 0.30%).",
        stack: "Python · pandas · scikit-learn · statsmodels · Streamlit",
        github: "https://github.com/NafisAslam70/UF-Internship-hhs-care-forecast",
      },
      {
        title: "British Airways Review Analysis",
        description: "Scraped and cleaned 1,000 Skytrax reviews for analysis.",
        stack: "Python · Requests · BeautifulSoup · pandas · Jupyter",
        github: "https://github.com/NafisAslam70/BritishAirways",
      },
      {
        title: "Titanic Survival Prediction",
        description: "Data preprocessing and Logistic Regression survival prediction.",
        stack: "Python · pandas · scikit-learn · Logistic Regression",
        github: "https://github.com/NafisAslam70/Titanic-Survival-Prediction",
      },
      {
        title: "Iris Decision Tree & K-means",
        description: "Decision Tree classification on Iris and a standalone K-means implementation.",
        stack: "Python · Machine Learning",
        links: [
          { label: "Iris Decision Tree", href: "https://github.com/NafisAslam70/DecisionTreeOnIris" },
          { label: "K-means", href: "https://github.com/NafisAslam70/KmeansImplementation" },
        ],
      },
    ],
  },
  {
    category: "Research & Computer Vision",
    items: [
      {
        title: "DeepLens Engine for Focus",
        description:
          "Related real-time attention monitoring prototype combining YOLO classification, gaze and presence checks, and rolling windows.",
        stack: "Python · Streamlit · YOLO · MediaPipe · OpenCV",
        github: "https://github.com/NafisAslam70/deeplens-app",
        detail: "/ventures/deepwork-ai",
      },
      {
        title: "Bird Species Classifier",
        description: "Fine-tuned ResNet-50 classifier for 10 bird species; 90.91% validation accuracy across 396 validation images.",
        stack: "Python · PyTorch · ResNet-50",
      },
      {
        title: "Video Retrieval Using Knowledge Graphs",
        description: "Research project exploring video retrieval through knowledge graph representations.",
        stack: "Research · Knowledge Graphs · Video Retrieval",
      },
      {
        title: "WorldQuant University Computer Vision Lab Projects",
        description: "Computer-vision lab and project work completed through the WorldQuant University CV & Deep Learning programme. Individual project titles and results need verification before highlighting separately.",
        stack: "Computer Vision · Deep Learning · PyTorch",
        status: "Lab work",
      },
    ],
  },
  {
    category: "Algorithms & Applied Computing",
    items: [
      {
        title: "MongoDB Standalone vs Atlas (CPC451)",
        description:
          "Team comparison using YouTube Trending Video Statistics: 10 country CSVs, 11 category JSONs, 539.2 MB of source data, and about 285K processed records. Query results were consistent; no speed winner was claimed.",
        stack: "Python · Pandas · MongoDB Community 7.0.21 · Atlas 8.0.9 · Compass · AWS Singapore",
        links: [{ label: "Dataset", href: "https://www.kaggle.com/datasets/datasnaek/youtube-new" }],
      },
      {
        title: "Netflix Reviews: N-grams & Parts of Speech (CPC353)",
        description: "Individual NLP project; awarded 100/100 and Best in Class.",
        stack: "Natural Language Processing · N-grams · Parts of Speech",
      },
      {
        title: "DFA-Based Conference & Workshop Finder (CPT411)",
        description: "Python and DFA assignment; assignment score 96/100 and paper score 95/100.",
        stack: "Python · Deterministic Finite Automata",
      },
      {
        title: "USMWorld",
        description: "Campus community website for academics, exchange, campus life, offers, and maps.",
        stack: "HTML · CSS · JavaScript · Bootstrap",
        github: "https://github.com/NafisAslam70/USMWorld",
      },
      {
        title: "MalaysiaStock-Pro / BMPro-stock",
        description:
          "Malaysian listed-company information prototype with company profiles, news, and around one year of historical prices; scraper remains incomplete.",
        stack: "Node.js · Express · EJS · Axios · Cheerio · Puppeteer · SQLite",
        github: "https://github.com/NafisAslam70/BMPro-stock",
        private: true,
      },
    ],
  },
  {
    category: "Personal & Small Applications",
    items: [
      {
        title: "Personal Portfolio Website",
        description: "Personal portfolio presenting Nafis Aslam’s experience, projects, technical expertise, education, and contact information.",
        stack: "Next.js · React · Tailwind CSS",
        live: "https://nafis-aslam-portfolio.vercel.app/",
      },
      {
        title: "Weather Project",
        description: "Small weather application project.",
        stack: "Web application · Weather data",
        status: "Small project",
      },
      {
        title: "To-Do List",
        description: "Task-list application for creating and tracking to-do items.",
        stack: "Web application · Task management",
        status: "Small project",
      },
    ],
  },
  {
    category: "Planned Enterprise Automation Projects",
    items: [
      {
        title: "Intelligent Enterprise Invoice Automation",
        description: "Planned workflow for invoice extraction, duplicate detection, approval routing, exception handling, audit logs, and ERP simulation.",
        stack: "n8n · UiPath · OCR / AI · SQL",
        status: "Planned · Not yet built",
      },
      {
        title: "Industrial Predictive Maintenance & Operations Automation",
        description: "Planned system for sensor monitoring, anomaly alerts, maintenance tickets, and equipment-health dashboards using simulated IoT data.",
        stack: "Python · Machine Learning · IoT simulation · n8n",
        status: "Planned · Not yet built",
      },
    ],
  },
];

function ExternalLink({ href, children }) {
  return (
    <a className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700 dark:border-white/15 dark:text-slate-200 dark:hover:border-indigo-400" href={href} target="_blank" rel="noreferrer">
      {children} ↗
    </a>
  );
}

function ProjectCard({ project }) {
  const projectId = project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return (
    <article id={project.title === "MeedianAI Flow v2" ? "meedianai-flow" : projectId} className="flex h-full scroll-mt-24 flex-col rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{project.title}</h3>
        {(project.private || project.status) && <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-800 dark:bg-amber-300/10 dark:text-amber-200">{project.private ? "Private repo" : project.status}</span>}
      </div>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{project.description}</p>
      {project.stack && <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400"><span className="font-semibold text-slate-700 dark:text-slate-200">Stack:</span> {project.stack}</p>}
      {project.video && <div className="mt-4 w-full max-w-xs overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm dark:border-white/10 dark:bg-black/20"><div className="relative aspect-video"><iframe className="absolute inset-0 h-full w-full" src={`https://www.youtube-nocookie.com/embed/${project.video}`} title={project.videoTitle || `${project.title} demo`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div><p className="px-3 py-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">{project.videoTitle || `${project.title} demo`}</p></div>}
      {project.gallery && <div className="mt-4 grid grid-cols-2 gap-2">{project.gallery.map((src, index) => <div key={src} className="aspect-[1.5] overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-slate-950"><Image src={src} alt={`MeedianAI Flow interface ${index + 1}`} width={960} height={600} className="h-full w-full object-cover transition duration-300 hover:scale-105" /></div>)}</div>}
      <div className="mt-4 flex flex-wrap gap-2">
        {project.github && <ExternalLink href={project.github}>GitHub</ExternalLink>}
        {project.live && <ExternalLink href={project.live}>Live project</ExternalLink>}
        {project.detail && <Link className="rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500" href={project.detail}>Case study</Link>}
        {project.links?.map((link) => <ExternalLink key={link.href} href={link.href}>{link.label}</ExternalLink>)}
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  return (
    <main className="ventures-page w-full bg-[#f7f8fa] text-slate-900 dark:bg-[#090d13] dark:text-slate-100">
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <header className="mb-12 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">Nafis Aslam · Selected Work</p>
        <h1 className="mt-3 text-5xl font-bold tracking-tight text-slate-950 dark:text-white md:text-7xl">Projects</h1>
        <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300 md:text-lg">
          Practical software products and AI-driven systems across full-stack engineering, machine learning, computer vision, and data analytics. Each project includes its scope, tools, and available proof or project links.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ExternalLink href="https://github.com/NafisAslam70">GitHub profile</ExternalLink>
          <a className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900" href="mailto:nafisaslam70@gmail.com">Contact</a>
        </div>
      </header>

      <section className="mb-14 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-5 text-white shadow-xl dark:border-white/10 dark:bg-[#111923] md:p-8">
        <div className="grid gap-7 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-200">Featured project · AI + Product Engineering</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">DeepWork AI</h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-200">An AI-assisted productivity platform featuring focus sessions, goal tracking, webcam attention classification, distraction nudges, and analytics.</p>
            <p className="mt-4 text-sm leading-6 text-slate-300"><span className="font-semibold text-white">Technologies:</span> Next.js, React, Tailwind CSS, Flask, Python, PostgreSQL, Drizzle ORM, Clerk, YOLO, MediaPipe, OpenCV, PyTorch.</p>
            <p className="mt-3 text-sm text-indigo-100">Approximately 95% accuracy on 210 held-out images. The project collected 1,080 original webcam images and expanded the training set to around 3,000 with augmentation.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <ExternalLink href="https://github.com/NafisAslam70/DeepWorkAI">GitHub</ExternalLink>
              <ExternalLink href="https://deep-work-ai-nu.vercel.app/">Live project</ExternalLink>
              <ExternalLink href="https://youtu.be/Je0_qLxRbX8">Demo video</ExternalLink>
              <ExternalLink href="https://doi.org/10.5281/zenodo.19266394">Research paper</ExternalLink>
              <Link className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-indigo-950" href="/ventures/deepwork-ai">Full project case study →</Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-black/30">
            <div className="relative aspect-video">
              <iframe className="absolute inset-0 h-full w-full" src="https://www.youtube-nocookie.com/embed/Je0_qLxRbX8" title="DeepWork AI project demo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
            </div>
            <p className="px-4 py-3 text-xs text-slate-300">DeepWork AI project demo and technical overview</p>
          </div>
        </div>
      </section>

      <div className="space-y-12">
        {projects.map((group) => (
          <section key={group.category}>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-300">Project portfolio</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">{group.category}</h2>
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">{group.items.length} projects</span>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {group.items.map((project) => <ProjectCard key={project.title} project={project} />)}
            </div>
          </section>
        ))}
      </div>
      </div>
    </main>
  );
}
