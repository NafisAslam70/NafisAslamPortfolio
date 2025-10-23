"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import PersonalizedOverlay from "./PersonalizedOverlay";
import { PERSONALIZED_MESSAGES } from "@/content/personalised";

export default function PersonalizedEntry() {
  const params = useSearchParams();
  const [dismissed, setDismissed] = useState(null);

  const slug = params?.get("for")?.toLowerCase() ?? null;
  const data = useMemo(() => (slug ? PERSONALIZED_MESSAGES[slug] : null), [slug]);

  if (!slug || !data || dismissed === slug) return null;

  return <PersonalizedOverlay data={data} onClose={() => setDismissed(slug)} />;
}
