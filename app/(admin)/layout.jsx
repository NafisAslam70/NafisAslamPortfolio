// app/(admin)/admin/layout.jsx
import Link from "next/link";

export default function AdminLayout({ children }) {
  return (
    <div className="space-y-6">
      <section className="card">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin</h1>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin" className="btn">Home</Link>

            {/* Blog */}
            <Link href="/admin/blog" className="btn">Blog</Link>
            {/* (optional) remove /new if you also do inline blog creation later */}
            {/* <Link href="/admin/blog/new" className="btn btn-primary">New Post</Link> */}

            {/* Hire */}
            <Link href="/admin/hire" className="btn">Hire Requests</Link>

            {/* Courses */}
            <Link href="/admin/courses" className="btn">Courses</Link>

            {/* Reels */}
            <Link href="/admin/reels" className="btn">Reels</Link>

            {/* Public Site */}
            <Link href="/" className="btn">Site</Link>
          </div>
        </div>
      </section>
      {children}
    </div>
  );
}
