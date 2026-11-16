"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import SiteHeader from "@/components/SiteHeader";
import PersonalizedEntry from "@/components/PersonalizedEntry";

function SiteFooter({ lang = "en" }) {
  const ar = lang === "ar";
  return (
    <footer className="border-t border-slate-200 bg-white py-8 dark:border-white/10 dark:bg-[#090d13]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">Nafis Aslam</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {ar ? "ملف مهني في الذكاء الاصطناعي وتعلم الآلة والرؤية الحاسوبية." : "AI, machine learning, and computer vision engineering portfolio."}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">{ar ? "روابط سريعة" : "Quick Links"}</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="/#experience" className="hover:text-primary transition">{ar ? "الخبرة" : "Experience"}</Link></li>
            <li><Link href="/#projects" className="hover:text-primary transition">{ar ? "المشاريع" : "Projects"}</Link></li>
            <li><Link href="/#expertise" className="hover:text-primary transition">{ar ? "التخصصات" : "Expertise"}</Link></li>
            <li><Link href="/#education" className="hover:text-primary transition">{ar ? "التعليم" : "Education"}</Link></li>
            <li><Link href="/#contact" className="hover:text-primary transition">{ar ? "تواصل" : "Contact"}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">{ar ? "تواصل" : "Connect"}</h3>
          <div className="flex space-x-4 text-xl">
            <a href="https://github.com/NafisAslam70" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              <FaGithub />
            </a>
            <a href="https://www.linkedin.com/in/nafis-aslam/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} Nafis Aslam. {ar ? "جميع الحقوق محفوظة." : "All rights reserved."}
      </div>
    </footer>
  );
}

export default function LayoutChrome({ session, lang, children }) {
  const pathname = usePathname();
  const isResumeRoute = pathname?.startsWith("/hire-me");
  const isInterviewerFeedbackRoute = pathname?.startsWith("/interviewer-feedback");
  const isStandaloneRoute = isResumeRoute || isInterviewerFeedbackRoute;
  const isPortfolioRoute = pathname === "/" || pathname === "/ventures";

  return (
    <>
      <PersonalizedEntry />
      {!isStandaloneRoute ? (
        <SiteHeader
          session={session}
          lang={lang}
          nav={[
            { href: "/", labelEn: "Overview", labelAr: "نظرة عامة" },
            { href: "/#experience", labelEn: "Experience", labelAr: "الخبرة" },
            { href: "/#projects", labelEn: "Projects", labelAr: "المشاريع" },
            { href: "/#expertise", labelEn: "Expertise", labelAr: "التخصصات" },
            { href: "/#education", labelEn: "Education", labelAr: "التعليم" },
            { href: "/#contact", labelEn: "Contact", labelAr: "تواصل", variant: "primary" },
          ]}
        />
      ) : null}
      <main className={isStandaloneRoute || isPortfolioRoute ? "w-full flex-grow" : "mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8 flex-grow pt-12 md:pt-16"}>
        {children}
      </main>
      {!isStandaloneRoute ? <SiteFooter lang={lang} /> : null}
    </>
  );
}
