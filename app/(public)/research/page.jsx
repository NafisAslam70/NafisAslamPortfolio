import { cookies } from "next/headers";
import Link from "next/link";

export const metadata = {
  title: "Computer Vision & Medical Imaging Research | Nafis Aslam",
  description:
    "Research profile of Nafis Aslam: human attention, computer vision, medical imaging, explainable AI, and multimodal video understanding.",
};

const COPY = {
  en: {
    back: "Industry profile",
    eyebrow: "RESEARCH PROFILE",
    title: "Computer Vision & Medical Imaging",
    intro:
      "I build and evaluate computer-vision systems around human attention, medical imaging, and video understanding. My work connects temporal reasoning and explainability with practical experiments—and makes the limits of each result clear.",
    cv: "Research CV",
    portfolio: "Research portfolio",
    paper: "Read first-author preprint",
    interestsEyebrow: "RESEARCH DIRECTION",
    interestsTitle: "Reliable vision for people and data",
    workEyebrow: "SELECTED RESEARCH",
    workTitle: "From sustained attention to medical imaging",
    experienceEyebrow: "EDUCATION & EXPERIENCE",
    experienceTitle: "Research foundations and practice",
    education: "B.Comp.Sc. (Hons.) · Intelligent Computing (AI)",
    usm: "Universiti Sains Malaysia · CGPA 3.32/4.00",
    mit: "MicroMasters in Statistics and Data Science",
    mitDetail: "MITx · Aug 2024–Dec 2025 · Data Analysis 93%",
    intern: "Advanced Data Science Intern",
    internDetail: "IDEAS – ISI Kolkata · May–Jul 2026",
    fellow: "Deep Learning and Computer Vision Research Fellow",
    fellowDetail: "WorldQuant University · 2026–present · Applied vision projects",
    award: "ICSC 2026 · International 2nd Rank",
    awardDetail: "Senior category · Top 1% globally · PIXEL 2025 Gold Award",
    contactEyebrow: "GET IN TOUCH",
    contactTitle: "Open to research conversations",
    contactText:
      "For research assistant roles, graduate study, and collaborations in human attention, medical imaging, and computer vision.",
    email: "Email me",
    viewProjects: "Browse all projects",
    themes: [
      {
        title: "Human attention over time",
        text: "Combine webcam, pose, and facial cues with temporal reasoning instead of treating every frame as an isolated prediction.",
      },
      {
        title: "Explainable medical imaging",
        text: "Explore MRI classification with Grad-CAM as a localisation aid, while being explicit that it is not diagnosis or segmentation.",
      },
      {
        title: "Evaluation with honest limits",
        text: "Report dataset scope, held-out results, class-level weaknesses, and the difference between a project result and clinical evidence.",
      },
    ],
    projects: [
      {
        title: "DeepWork AI / DeepLens Engine for Focus",
        label: "Human attention · Computer vision · PIXEL 2025 Gold",
        description:
          "A privacy-aware webcam system combining YOLOv11n-cls, MediaPipe pose and face signals, and temporal persistence rules to classify six attention states and support a live focus product.",
        evidence:
          "The portfolio reports 94.76% on one held-out run of 210 images (35 per class), not production accuracy. BadPosture was the weakest class at 83%.",
        paper:
          "Aslam, N. (2026). DeepLens Engine for Focus: A Multi-Layered Framework for Real-Time Attention Monitoring in Productivity Environments. Zenodo Preprint.",
        paperStatus: "Preprint · Zenodo · 2026",
        links: [
          { href: "https://doi.org/10.5281/zenodo.19266394", label: "Preprint ↗" },
          { href: "https://github.com/NafisAslam70/DeepWorkAI", label: "Code ↗" },
          { href: "https://youtu.be/Je0_qLxRbX8", label: "Demo ↗" },
        ],
      },
      {
        title: "Brain Tumor MRI Classification with Grad-CAM",
        label: "Medical imaging · Explainable AI",
        description:
          "A four-class public-dataset study using EfficientNetB1 transfer learning, OpenCV contour-based cropping, data augmentation, and Grad-CAM heatmaps to inspect image regions behind predictions.",
        evidence:
          "The portfolio describes a tutorial-based walkthrough run with about 99% test accuracy. This is not clinical evidence; Grad-CAM is a localisation aid, not a diagnosis or segmentation.",
        links: [
          { href: "/pdfs/Nafis_Aslam_Research_Portfolio_CV_Medical_Imaging_v5.pdf#page=8", label: "MRI project in portfolio ↗" },
          { href: "/pdfs/Nafis_Aslam_CV_Professors_Updated.pdf", label: "Research CV ↗" },
        ],
      },
      {
        title: "Multimodal Video RAG for Bengali Recipes",
        label: "Video understanding · IDEAS – ISI Kolkata",
        description:
          "A unified search-and-reasoning engine combining FAISS dense retrieval, BM25 lexical search, NetworkX graph traversal, and multiple answer-generation backends.",
        evidence:
          "Validated across five Bengali recipe-video benchmarks: 384 multimodal chunks and a knowledge graph with 59 nodes and 81 edges.",
        links: [{ href: "/ventures", label: "Project portfolio ↗" }],
      },
      {
        title: "Genomics & High-Dimensional Data",
        label: "MITx MicroMasters · 6.419x written report",
        description:
          "Explored 45,768-gene single-cell expression data with PCA, t-SNE, clustering, pseudo-labels, and regularised logistic regression to study cell types and subtypes.",
        evidence:
          "The report records 95.39% validation accuracy with 3-fold cross-validation. For feature selection, 100 model-selected genes scored 0.904, compared with 0.402 for 100 random genes and 0.934 for high-variance genes.",
        links: [
          { href: "/pdfs/Nafis_Aslam_Research_Portfolio_CV_Medical_Imaging_v5.pdf#page=10", label: "MITx analysis in portfolio ↗" },
        ],
      },
      {
        title: "Uncertainty-Aware Spatial Interpolation",
        label: "Gaussian Processes · MITx MicroMasters",
        description:
          "Implemented Gaussian Process regression for environmental measurements, using Cholesky factorisation, marginal-likelihood hyperparameter tuning, and predictive uncertainty maps.",
        links: [{ href: "/pdfs/Nafis_Aslam_CV_Professors_Updated.pdf", label: "Project details in CV ↗" }],
      },
      {
        title: "Wildlife & Crop-Disease Vision",
        label: "Applied computer vision · WorldQuant University",
        description:
          "Built PyTorch camera-trap classifiers for wildlife in Côte d’Ivoire and a five-class cassava disease classifier with pretrained ResNet50 for a crop-health workflow in Uganda.",
        links: [{ href: "/pdfs/Nafis_Aslam_CV_Professors_Updated.pdf", label: "Research experience in CV ↗" }],
      },
    ],
  },
  ar: {
    back: "الملف المهني",
    eyebrow: "الملف البحثي",
    title: "الرؤية الحاسوبية والتصوير الطبي",
    intro:
      "أطوّر وأقيّم أنظمة للرؤية الحاسوبية تركز على الانتباه البشري والتصوير الطبي وفهم الفيديو. يربط عملي الاستدلال الزمني بقابلية التفسير والتجارب العملية، مع توضيح حدود كل نتيجة.",
    cv: "تحميل السيرة البحثية",
    portfolio: "ملف الأبحاث الطبي",
    paper: "قراءة البحث المنشور باسمي الأول",
    interestsEyebrow: "التوجه البحثي",
    interestsTitle: "رؤية موثوقة للناس والبيانات",
    workEyebrow: "أبحاث مختارة",
    workTitle: "من الانتباه المستمر إلى التصوير الطبي",
    experienceEyebrow: "التعليم والخبرة",
    experienceTitle: "الأساس الأكاديمي والتطبيق البحثي",
    education: "بكالوريوس علوم الحاسوب مع مرتبة الشرف · الحوسبة الذكية (الذكاء الاصطناعي)",
    usm: "Universiti Sains Malaysia · المعدل التراكمي 3.32/4.00",
    mit: "MicroMasters في الإحصاء وعلوم البيانات",
    mitDetail: "MITx · أغسطس 2024–ديسمبر 2025 · تحليل البيانات 93٪",
    intern: "متدرب متقدم في علوم البيانات",
    internDetail: "IDEAS – ISI Kolkata · مايو–يوليو 2026",
    fellow: "زميل أبحاث في التعلم العميق والرؤية الحاسوبية",
    fellowDetail: "WorldQuant University · 2026–الآن · مشاريع رؤية تطبيقية",
    award: "المركز الدولي الثاني · ICSC 2026",
    awardDetail: "فئة الكبار · ضمن أفضل 1٪ عالمياً · الجائزة الذهبية PIXEL 2025",
    contactEyebrow: "تواصل",
    contactTitle: "منفتح على النقاشات البحثية",
    contactText:
      "لأدوار مساعد بحث والدراسات العليا والتعاون في الانتباه البشري والتصوير الطبي والرؤية الحاسوبية.",
    email: "راسلني",
    viewProjects: "استعراض جميع المشاريع",
    themes: [
      {
        title: "الانتباه البشري عبر الزمن",
        text: "دمج إشارات كاميرا الويب والوضعية والوجه مع الاستدلال الزمني بدلاً من التعامل مع كل إطار كتنبؤ منفصل.",
      },
      {
        title: "التصوير الطبي القابل للتفسير",
        text: "دراسة تصنيف صور الرنين المغناطيسي باستخدام Grad-CAM كوسيلة لتحديد المواقع، لا كتشخيص أو تقسيم للصورة.",
      },
      {
        title: "تقييم يوضح حدوده",
        text: "توضيح نطاق البيانات والنتائج والصفوف الأضعف، والفرق بين نتيجة مشروع ودليل سريري.",
      },
    ],
    projects: [
      {
        title: "DeepWork AI / DeepLens Engine for Focus",
        label: "الانتباه البشري · الرؤية الحاسوبية · ذهبية PIXEL 2025",
        description:
          "نظام كاميرا ويب يراعي الخصوصية ويجمع YOLOv11n-cls مع إشارات الوضعية والوجه من MediaPipe وقواعد الاستمرارية الزمنية لتصنيف ست حالات انتباه.",
        evidence:
          "يذكر ملف الأبحاث دقة 94.76٪ في اختبار واحد على 210 صور (35 لكل فئة)، وليس دقة إنتاجية. كانت فئة الوضعية السيئة الأضعف بنسبة 83٪.",
        paper:
          "Aslam, N. (2026). DeepLens Engine for Focus: A Multi-Layered Framework for Real-Time Attention Monitoring in Productivity Environments. Zenodo Preprint.",
        paperStatus: "بحث تمهيدي · Zenodo · 2026",
        links: [
          { href: "https://doi.org/10.5281/zenodo.19266394", label: "البحث ↗" },
          { href: "https://github.com/NafisAslam70/DeepWorkAI", label: "الكود ↗" },
          { href: "https://youtu.be/Je0_qLxRbX8", label: "عرض توضيحي ↗" },
        ],
      },
      {
        title: "تصنيف أورام الدماغ بالرنين المغناطيسي وGrad-CAM",
        label: "التصوير الطبي · الذكاء الاصطناعي القابل للتفسير",
        description:
          "دراسة عامة لأربع فئات باستخدام EfficientNetB1، وقصّ الصور عبر OpenCV، وزيادة البيانات، وخرائط Grad-CAM لفحص المناطق المؤثرة في التنبؤ.",
        evidence:
          "يعرض ملف الأبحاث نتيجة تقارب 99٪ في تجربة تعليمية على مجموعة عامة. ليست دليلاً سريرياً؛ Grad-CAM وسيلة لتحديد المواقع وليس تشخيصاً أو تقسيماً.",
        links: [
          { href: "/pdfs/Nafis_Aslam_Research_Portfolio_CV_Medical_Imaging_v5.pdf#page=8", label: "مشروع MRI في ملف الأبحاث ↗" },
          { href: "/pdfs/Nafis_Aslam_CV_Professors_Updated.pdf", label: "السيرة البحثية ↗" },
        ],
      },
      {
        title: "Video RAG متعدد الوسائط لوصفات بنغالية",
        label: "فهم الفيديو · IDEAS – ISI Kolkata",
        description:
          "محرك موحد للبحث والاستدلال يجمع استرجاع FAISS الدلالي وبحث BM25 واجتياز الرسوم المعرفية عبر NetworkX وعدة مصادر لتوليد الإجابات.",
        evidence:
          "تم التحقق عبر خمسة معايير لفيديوهات وصفات بنغالية: 384 مقطعاً متعدد الوسائط ورسم معرفي يضم 59 عقدة و81 رابطاً.",
        links: [{ href: "/ventures", label: "ملف المشاريع ↗" }],
      },
      {
        title: "الجينوميات والبيانات عالية الأبعاد",
        label: "MITx MicroMasters · تقرير 6.419x",
        description:
          "تحليل بيانات تعبير جيني أحادي الخلية تضم 45,768 جيناً باستخدام PCA وt-SNE والتجميع والتسميات التقريبية والانحدار اللوجستي المنظّم.",
        evidence:
          "يسجل التقرير دقة تحقق 95.39٪ باستخدام تحقق متقاطع من 3 طيات. وسجلت أفضل 100 ميزة مختارة 0.904 مقابل 0.402 لميزات عشوائية و0.934 لأعلى الميزات تبايناً.",
        links: [
          { href: "/pdfs/Nafis_Aslam_Research_Portfolio_CV_Medical_Imaging_v5.pdf#page=10", label: "تحليل MITx في ملف الأبحاث ↗" },
        ],
      },
      {
        title: "استيفاء مكاني يراعي عدم اليقين",
        label: "Gaussian Processes · MITx MicroMasters",
        description:
          "تنفيذ انحدار العمليات الغاوسية للقياسات البيئية باستخدام تحليل Cholesky وضبط المعلمات عبر الاحتمالية الهامشية وخرائط عدم اليقين التنبؤي.",
        links: [{ href: "/pdfs/Nafis_Aslam_CV_Professors_Updated.pdf", label: "تفاصيل المشروع في السيرة ↗" }],
      },
      {
        title: "رؤية الحياة البرية وأمراض المحاصيل",
        label: "رؤية حاسوبية تطبيقية · WorldQuant University",
        description:
          "بناء مصنفات PyTorch لصور كاميرات الحياة البرية في ساحل العاج، ومصنف من خمس فئات لأمراض الكسافا باستخدام ResNet50 في أوغندا.",
        links: [{ href: "/pdfs/Nafis_Aslam_CV_Professors_Updated.pdf", label: "الخبرة البحثية في السيرة ↗" }],
      },
    ],
  },
};

export default function ResearchPage() {
  const lang = cookies().get("lang")?.value === "ar" ? "ar" : "en";
  const copy = COPY[lang];

  return (
    <div className="research-page" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang}>
      <section className="research-hero">
        <div className="research-hero-inner">
          <Link href="/" className="research-back-link">← {copy.back}</Link>
          <p className="research-eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className="research-intro">{copy.intro}</p>
          <div className="research-actions">
            <a className="research-primary-action" href="/pdfs/Nafis_Aslam_CV_Professors_Updated.pdf" target="_blank" rel="noreferrer">{copy.cv} ↗</a>
            <a className="research-secondary-action" href="/pdfs/Nafis_Aslam_Research_Portfolio_CV_Medical_Imaging_v5.pdf" target="_blank" rel="noreferrer">{copy.portfolio} ↗</a>
            <a className="research-secondary-action" href="https://doi.org/10.5281/zenodo.19266394" target="_blank" rel="noreferrer">{copy.paper} ↗</a>
          </div>
        </div>
      </section>

      <main className="research-content">
        <section className="research-section">
          <p className="research-section-eyebrow">{copy.interestsEyebrow}</p>
          <h2>{copy.interestsTitle}</h2>
          <div className="research-theme-grid">
            {copy.themes.map((theme, index) => (
              <article className="research-theme-card" key={theme.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{theme.title}</h3>
                <p>{theme.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="research-section">
          <p className="research-section-eyebrow">{copy.workEyebrow}</p>
          <h2>{copy.workTitle}</h2>
          <div className="research-project-list">
            {copy.projects.map((project) => (
              <article className="research-project-card" key={project.title}>
                <p className="research-project-label">{project.label}</p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                {project.evidence && <p className="research-project-evidence">{project.evidence}</p>}
                {project.paper && (
                  <div className="research-citation">
                    <span>{project.paperStatus}</span>
                    <p>{project.paper}</p>
                  </div>
                )}
                <div className="research-project-links">
                  {project.links.map((link) => (
                    <a key={link.href} href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noreferrer" : undefined}>{link.label}</a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="research-section">
          <p className="research-section-eyebrow">{copy.experienceEyebrow}</p>
          <h2>{copy.experienceTitle}</h2>
          <div className="research-education-grid">
            <article><span>2021–2025</span><h3>{copy.education}</h3><p>{copy.usm}</p></article>
            <article><span>2024–2025</span><h3>{copy.mit}</h3><p>{copy.mitDetail}</p></article>
            <article><span>2026</span><h3>{copy.intern}</h3><p>{copy.internDetail}</p></article>
            <article><span>2026–present</span><h3>{copy.fellow}</h3><p>{copy.fellowDetail}</p></article>
            <article><span>2025–2026</span><h3>{copy.award}</h3><p>{copy.awardDetail}</p></article>
          </div>
        </section>

        <section className="research-contact">
          <p className="research-section-eyebrow">{copy.contactEyebrow}</p>
          <h2>{copy.contactTitle}</h2>
          <p>{copy.contactText}</p>
          <div className="research-actions">
            <a className="research-primary-action" href="mailto:nafisaslam70@gmail.com">{copy.email} ↗</a>
            <Link className="research-secondary-action" href="/ventures">{copy.viewProjects} ↗</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
