import { cookies } from "next/headers";
import EmployerPortfolio from "@/components/EmployerPortfolio";

export const metadata = {
  title: "Nafis Aslam | AI & Machine Learning Engineer",
  description:
    "Employer-focused portfolio of Nafis Aslam: machine learning, computer vision, forecasting, full-stack engineering, experience, projects, and research.",
};

export default function HomePage() {
  const lang = cookies().get("lang")?.value === "ar" ? "ar" : "en";
  return <EmployerPortfolio lang={lang} />;
}
