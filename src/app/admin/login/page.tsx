"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isSupabaseConfigured) {
      setError("Databaza (Supabase) nuk është lidhur ende. Shiko udhëzimet në README.");
      return;
    }
    setLoading(true);
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Email ose fjalëkalim i gabuar.");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-dark">Paneli Admin</p>
        <h1 className="mt-1 text-2xl font-black">Hyr në llogari</h1>
        <div className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="password">Fjalëkalimi</label>
            <input id="password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
          </div>
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          <button disabled={loading} className="btn-primary w-full py-3">
            {loading ? "Duke hyrë…" : "Hyr"}
          </button>
        </div>
        <Link href="/" className="mt-6 block text-center text-sm text-slate-500 hover:text-ink">← Kthehu te faqja</Link>
      </form>
    </div>
  );
}
