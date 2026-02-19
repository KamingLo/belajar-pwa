"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Gagal login");

      // Redirect sukses
      router.push(result.redirect);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl shadow-lg shadow-blue-900/20">
            📡
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">PWA Absensi</h1>
          <p className="text-slate-400 mt-2">Masuk ke sistem absensi modern</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm rounded-xl text-center font-medium animate-shake">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
            <input 
              name="email" 
              type="email" 
              required
              disabled={loading}
              placeholder="admin@pwa.com" 
              className="w-full p-3 mt-1 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50" 
            />
          </div>
          
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
            <input 
              name="password" 
              type="password" 
              required
              disabled={loading}
              placeholder="••••••••" 
              className="w-full p-3 mt-1 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-900/40 transition-all active:scale-95 mt-4 disabled:bg-blue-800 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing...
              </span>
            ) : "Sign In Now"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-700/50 text-center text-[11px] text-slate-500">
           Sistem Absensi v2.0 &bull; 2026
        </div>
      </div>
    </div>
  );
}