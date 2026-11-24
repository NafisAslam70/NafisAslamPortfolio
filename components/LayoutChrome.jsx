"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import PersonalizedEntry from "@/components/PersonalizedEntry";

function SiteFooter({ lang = "en" }) {
  const ar = lang === "ar";
  return (
    <footer className="site-footer" dir={ar ? "rtl" : "ltr"}>
      <div className="site-footer-shell">
        <section className="site-footer-cta" aria-label={ar ? "ابدأ محادثة" : "Start a conversation"}>
          <div className="site-footer-cta-copy">
            <span className="site-footer-eyebrow"><i aria-hidden="true" />{ar ? "متاح لفرص المنتجات والذكاء الاصطناعي والأتمتة" : "OPEN TO PRODUCT, AI & AUTOMATION WORK"}</span>
            <h2>{ar ? "لنبنِ شيئاً مفيداً معاً." : "Let’s build something useful."}</h2>
            <p>{ar ? "هندسة منتجات برمجية وذكاء اصطناعي تطبيقي وأتمتة لسير العمل الحقيقي." : "Software products, applied AI, and automation for real-world workflows."}</p>
          </div>
          <div className="site-footer-cta-actions">
            <a href="https://wa.me/601137576465" target="_blank" rel="noopener noreferrer" className="site-footer-primary-link">
              {ar ? "ابدأ محادثة" : "Start a conversation"} <span aria-hidden="true">↗</span>
            </a>
            <Link href="/#projects" className="site-footer-secondary-link">
              {ar ? "استكشف المشاريع" : "Explore projects"} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <span className="site-footer-orbit" aria-hidden="true" />
        </section>

        <div className="site-footer-content">
          <div className="site-footer-brand">
            <div className="site-footer-brand-heading">
              <span className="site-footer-mark" aria-hidden="true">
                <Image src="/images/grad.png" alt="" fill sizes="44px" className="object-cover object-[center_20%]" />
              </span>
              <div>
                <h3>Nafis Aslam</h3>
                <span>{ar ? "مهندس منتجات برمجية" : "Software Product Engineer"}</span>
              </div>
            </div>
            <p>{ar ? "أبني منتجات برمجية متكاملة وأدمج الذكاء الاصطناعي والأتمتة حيث يضيفان قيمة حقيقية." : "Building end-to-end products and integrating AI where it creates real value."}</p>
          </div>

          <nav className="site-footer-navigation" aria-label={ar ? "روابط سريعة" : "Quick links"}>
            <h3>{ar ? "استكشف" : "Explore"}</h3>
            <ul>
              <li><Link href="/#experience">{ar ? "الخبرة" : "Experience"}</Link></li>
              <li><Link href="/#projects">{ar ? "المشاريع" : "Projects"}</Link></li>
              <li><Link href="/#expertise">{ar ? "التخصصات" : "Expertise"}</Link></li>
              <li><Link href="/#education">{ar ? "التعليم" : "Education"}</Link></li>
              <li><Link href="/research">{ar ? "الملف البحثي" : "Research profile"}</Link></li>
              <li><Link href="/#contact">{ar ? "تواصل" : "Contact"}</Link></li>
            </ul>
          </nav>

          <div className="site-footer-social">
            <h3>{ar ? "تواصل" : "Connect"}</h3>
            <p>{ar ? "تابع عملي أو تواصل معي مباشرة." : "Follow my work or get in touch."}</p>
            <div className="site-footer-social-links">
              <a href="https://github.com/NafisAslam70" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
              <a href="https://www.linkedin.com/in/nafis-aslam/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
          </div>
        </div>

        <div className="site-footer-bottom">
          <span>© {new Date().getFullYear()} Nafis Aslam. {ar ? "جميع الحقوق محفوظة." : "All rights reserved."}</span>
          <Link href="/#overview">{ar ? "العودة إلى الأعلى ↑" : "Back to top ↑"}</Link>
        </div>
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

  const chrome = (
    <>
      <PersonalizedEntry />
      {!isStandaloneRoute ? (
        <SiteHeader
          session={session}
          lang={lang}
          nav={[
            { href: "/", labelEn: "Overview", labelAr: "نظرة عامة" },
            { href: "/#experience", labelEn: "Experience", labelAr: "الخبرة" },
            { href: "/ventures", labelEn: "Projects", labelAr: "المشاريع" },
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
  return isPortfolioRoute ? <div className="portfolio-page-zoom">{chrome}</div> : chrome;
}
