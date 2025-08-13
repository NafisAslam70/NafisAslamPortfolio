export const metadata = { title: "Courses • Nafees", description: "Coming soon." };

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <section className="card">
        <h1 className="text-3xl font-bold">Courses</h1>
        <p className="muted">Learn • Build • Uplift</p>
      </section>

      <section className="card-solid">
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="text-5xl">🚧</div>
          <h2 className="text-xl font-semibold">Coming soon</h2>
          <p className="muted max-w-md">
            We’re crafting practical, bilingual courses for real-world skills.
            Check back shortly!
          </p>
        </div>
      </section>
    </div>
  );
}
