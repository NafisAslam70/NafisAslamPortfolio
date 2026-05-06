"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGithub, FaLinkedin, FaMedium, FaYoutube } from "react-icons/fa";
import SiteHeader from "@/components/SiteHeader";
import PersonalizedEntry from "@/components/PersonalizedEntry";

function SiteFooter() {
  return (
    <footer className="border-t border-gray-300 dark:border-gray-700 mt-12 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">Nafis Aslam</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Building AI-driven productivity & education systems with precision, creativity, and intent.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="/" className="hover:text-primary transition">Home</Link></li>
            <li><Link href="/nbs" className="hover:text-primary transition">NBS</Link></li>
            <li><Link href="/courses" className="hover:text-primary transition">Courses</Link></li>
            <li><Link href="/blog" className="hover:text-primary transition">Blog</Link></li>
            <li><Link href="/hire-me" className="hover:text-primary transition">Hire Me</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Connect</h3>
          <div className="flex space-x-4 text-xl">
            <a href="https://github.com/NafisAslam70" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              <FaGithub />
            </a>
            <a href="https://www.linkedin.com/in/nafis-aslam/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              <FaLinkedin />
            </a>
            <a href="https://medium.com/@nafisaslam" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              <FaMedium />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Nafis Aslam. All rights reserved.
      </div>
    </footer>
  );
}

export default function LayoutChrome({ session, lang, children }) {
  const pathname = usePathname();
  const isResumeRoute = pathname?.startsWith("/hire-me");

  return (
    <>
      <PersonalizedEntry />
      {!isResumeRoute ? (
        <SiteHeader
          session={session}
          lang={lang}
          nav={[
            { href: "/", labelEn: "Home", labelHi: "होम" },
            { href: "/reels", labelEn: "Videos", labelHi: "रील्स" },
            { href: "/nbs", labelEn: "NBS", labelHi: "NBS" },
            { href: "/ventures", labelEn: "Ventures", labelHi: "उद्यम" },
            { href: "/blog", labelEn: "Blog", labelHi: "ब्लॉग" },
            { href: "/hire-me", labelEn: "Hire Me", labelHi: "मुझे हायर करें", variant: "primary" },
          ]}
        />
      ) : null}
      <main className={isResumeRoute ? "w-full flex-grow" : "mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8 flex-grow pt-28 md:pt-32"}>
        {children}
      </main>
      {!isResumeRoute ? <SiteFooter /> : null}
    </>
  );
}
