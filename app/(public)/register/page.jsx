import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="card max-w-md mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form action="/api/register" method="POST" className="space-y-4">
        <input type="text" name="name" placeholder="Name" className="input w-full" required />
        <input type="email" name="email" placeholder="Email" className="input w-full" required />
        <input type="password" name="password" placeholder="Password" className="input w-full" required />
        <button type="submit" className="btn-primary w-full">Register</button>
      </form>
      <div className="mt-4 text-center">
        <Link href="/login" className="text-blue-600 underline">Already have an account? Sign In</Link>
      </div>
    </div>
  );
}
