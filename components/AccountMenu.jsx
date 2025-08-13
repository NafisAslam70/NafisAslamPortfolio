"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AccountMenu({ name = "You", role = "member", isAdmin = false }) {
  const [open, setOpen] = useState(false);
  const r = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    r.refresh();
  }

  const initials = name?.trim()?.split(/\s+/).map(s=>s[0]).join("").slice(0,2).toUpperCase() || "U";

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white hover:bg-gray-50"
        onClick={()=>setOpen(o=>!o)}
      >
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-black text-white text-xs">{initials}</span>
        <span className="text-sm">{name || "Account"}</span>
        <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-black/5">{isAdmin ? "admin" : role}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="p-2 text-xs text-gray-500">Signed in</div>
          <div className="px-2 pb-2 flex flex-col gap-1">
            <Link className="btn w-full justify-start" href="/member" onClick={()=>setOpen(false)}>Dashboard</Link>
            {isAdmin && <Link className="btn w-full justify-start" href="/admin" onClick={()=>setOpen(false)}>Admin</Link>}
            <button className="btn w-full justify-start" onClick={logout}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
}
