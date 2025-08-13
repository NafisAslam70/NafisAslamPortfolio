import Link from "next/link";
import dynamic from "next/dynamic";

export const metadata = {
  title: "NBS • Nafees",
  description: "Nafees Brain Society — 3D brain view, architecture, and manifesto."
};

const Brain3DView = dynamic(() => import("@/components/Brain3DView"), {
  ssr: false,
  loading: () => (
    <div className="card text-center text-sm muted">Loading 3D…</div>
  ),
});

export default function NbsPage() {
  return (
    <div className="space-y-6">
      <section className="card">
        <h1 className="text-3xl font-bold">The Brain Is Your Story</h1>
        <p className="muted mt-1">
          3D interactive brain — click hotspots to see how my mind is architected for mastery.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/nbs/architecture" className="btn">Architecture Map</Link>
          <Link href="/nbs/manifesto" className="btn">Manifesto</Link>
          <Link href="/hire-me" className="btn btn-primary">Work With Me</Link>
        </div>
      </section>

      <Brain3DView />

      <section className="card-solid">
        <h2 className="text-xl font-semibold">What makes this different?</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1 muted">
          <li><strong>Blocks → Buildings → Floors → Rooms:</strong> everything has a precise place.</li>
          <li><strong>Zero-response-time wiring:</strong> recall speed + accuracy trained like a sport.</li>
          <li><strong>World Building:</strong> knowledge becomes interview answers, projects, decisions.</li>
        </ul>
      </section>
    </div>
  );
}
