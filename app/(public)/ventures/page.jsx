import { redirect } from "next/navigation";

export const metadata = {
  title: "Ventures • Nafees",
  description: "Active ventures and projects.",
};

export default function VenturesPage() {
  redirect("/ventures/deepwork-ai");
}
