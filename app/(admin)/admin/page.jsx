import Link from "next/link";

export const metadata = { title: "Admin • Nafees" };

export default function AdminHome(){
  return (
    <div className="space-y-6">
      <section className="card">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="muted">Manage content and courses.</p>
      </section>
      <section className="card-solid flex flex-wrap gap-2">
        <Link href="/admin/blog" className="btn">Blog</Link>
        <Link href="/admin/hire" className="btn">Hire Requests</Link>
        <Link href="/admin/courses" className="btn">Courses</Link>
      </section>
    </div>
  );
}
