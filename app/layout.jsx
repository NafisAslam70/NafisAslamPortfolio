import "./globals.css";
import Link from "next/link";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import SiteHeader from "@/components/SiteHeader";
import PersonalizedEntry from "@/components/PersonalizedEntry";
import { FaGithub, FaLinkedin, FaMedium, FaYoutube } from "react-icons/fa";

export const dynamic = "force-dynamic";


async function getSession() {
  const token = cookies().get("nb_session")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");
    const { payload } = await jwtVerify(token, secret);
    return payload; // { id, email, role, name }
  } catch {
    return null;
  }
}

function getLang() {
  const lang = cookies().get("lang")?.value;
  return lang === "hi" ? "hi" : "en";
}

function ThemeInitScript() {
  const code = `
    try {
      const st = localStorage.getItem("theme") || "system";
      const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const theme = st === "system" ? (sysDark ? "dark" : "light") : st;
      document.documentElement.dataset.theme = theme;
      document.documentElement.classList.remove("light");
      document.documentElement.classList.toggle("dark", theme === "dark");
    } catch {}
  `.replace(/\s+/g, " ");
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

function SiteFooter() {
  return (
    <footer className="border-t border-gray-300 dark:border-gray-700 mt-12 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
        
        {/* Brand Info */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Nafis Aslam</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Building AI-driven productivity & education systems with precision, creativity, and intent.
          </p>
        </div>

        {/* Quick Links */}
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

        {/* Social Links */}
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

export default async function RootLayout({ children }) {
  const session = await getSession();
  const lang = getLang();

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <ThemeInitScript />
        <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
      </head>
      <body className="min-h-screen antialiased flex flex-col">
        <PersonalizedEntry />
<SiteHeader
  session={session}
  lang={lang}
  nav={[
    { href: "/", labelEn: "Home", labelHi: "होम" },
    { href: "/reels", labelEn: "Videos", labelHi: "रील्स" },
    { href: "/nbs", labelEn: "NBS", labelHi: "NBS" },
    { href: "/ventures", labelEn: "Ventures", labelHi: "उद्यम" }, // ⬅️ changed
    { href: "/blog", labelEn: "Blog", labelHi: "ब्लॉग" },
    { href: "/hire-me", labelEn: "Hire Me", labelHi: "मुझे हायर करें", variant: "primary" },
  ]}
/>
        <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8 flex-grow pt-28 md:pt-32">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
