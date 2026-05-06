import "./globals.css";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import LayoutChrome from "@/components/LayoutChrome";

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
        <LayoutChrome session={session} lang={lang}>
          {children}
        </LayoutChrome>
      </body>
    </html>
  );
}
