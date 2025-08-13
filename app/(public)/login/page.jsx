"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);

  async function onSubmit(e){
    e.preventDefault();
    setStatus("Signing in...");
    try{
const res = await fetch("/api/local-login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password })
});

      const data = await res.json();
      if(res.ok){ window.location.assign(data.role==="admin"?"/admin":"/member"); }
      else setStatus(data.error || "Failed");
    }catch{ setStatus("Network error"); }
  }

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <section className="card">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="muted">Use email/password or continue with Google/Facebook.</p>
      </section>

      <form onSubmit={onSubmit} className="card-solid space-y-3">
        <input className="btn w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="btn w-full" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="btn btn-primary" type="submit">Login</button>
        {status && <div className="muted text-sm">{status}</div>}
        <div className="text-sm">No account? <Link className="link" href="/register">Register</Link></div>
      </form>

      <div className="card-solid space-y-2">
        <a className="btn w-full justify-center"
           href="/api/auth/signin/google?callbackUrl=/api/auth/bridge">Continue with Google</a>
        <a className="btn w-full justify-center"
           href="/api/auth/signin/facebook?callbackUrl=/api/auth/bridge">Continue with Facebook</a>
      </div>
    </div>
  );
}
