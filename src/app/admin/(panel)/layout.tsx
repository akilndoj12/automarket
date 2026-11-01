import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signOut } from "../actions";

export const metadata: Metadata = { title: "Paneli Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Përmbledhja" },
  { href: "/admin/makinat", label: "Makinat" },
  { href: "/admin/makinat/e-re", label: "+ Shto makinë" },
  { href: "/admin/kerkesat", label: "Kërkesat" },
  { href: "/admin/cilesimet", label: "Cilësimet" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) {
    return (
      <div className="container-x max-w-xl py-20">
        <div className="card p-8">
          <h1 className="text-xl font-bold">Paneli Admin nuk është aktiv ende</h1>
          <p className="mt-3 text-sm text-slate-600">
            Lidhni databazën Supabase (shtoni <code>NEXT_PUBLIC_SUPABASE_URL</code> dhe{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>) sipas udhëzimeve në README.
          </p>
          <Link href="/" className="btn-outline mt-6">← Te faqja</Link>
        </div>
      </div>
    );
  }

  const { user, isAdmin } = await requireAdmin();

  if (!isAdmin) {
    return (
      <div className="container-x max-w-xl py-20">
        <div className="card p-8">
          <h1 className="text-xl font-bold">Nuk keni akses</h1>
          <p className="mt-3 text-sm text-slate-600">
            Llogaria <b>{user.email}</b> nuk është administrator. Shtojeni te tabela <code>admins</code> në Supabase.
          </p>
          <form action={signOut} className="mt-6">
            <button className="btn-outline">Dil</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-[230px_1fr]">
      <aside className="bg-ink text-slate-300 md:min-h-screen">
        <div className="flex items-center justify-between px-5 py-5 md:block">
          <Link href="/admin" className="text-lg font-black text-white">
            Paneli <span className="text-brand">Admin</span>
          </Link>
          <p className="hidden truncate pt-1 text-xs text-slate-500 md:block">{user.email}</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 text-sm md:block md:space-y-1">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="block shrink-0 whitespace-nowrap rounded-lg px-3 py-2 hover:bg-white/10 hover:text-white">
              {n.label}
            </Link>
          ))}
          <Link href="/" target="_blank" className="block shrink-0 whitespace-nowrap rounded-lg px-3 py-2 hover:bg-white/10 hover:text-white">
            Shiko faqen ↗
          </Link>
          <form action={signOut}>
            <button className="block w-full shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-left hover:bg-white/10 hover:text-white">Dil</button>
          </form>
        </nav>
      </aside>
      <main className="p-4 sm:p-8">{children}</main>
    </div>
  );
}
