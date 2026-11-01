import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { requireAdmin } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/format";
import type { Car, Inquiry } from "@/lib/types";

export default async function AdminHome() {
  const { supabase } = await requireAdmin();

  const countStatus = async (status: string) => {
    const { count } = await supabase
      .from("cars")
      .select("id", { count: "exact", head: true })
      .eq("status", status);
    return count ?? 0;
  };

  const [active, reserved, sold, newInquiries, latestRes, inqRes] = await Promise.all([
    countStatus("active"),
    countStatus("reserved"),
    countStatus("sold"),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("handled", false).then((r) => r.count ?? 0),
    supabase.from("cars").select("*").order("updated_at", { ascending: false }).limit(6),
    supabase.from("inquiries").select("*, cars(brand, model, year)").order("created_at", { ascending: false }).limit(5),
  ]);
  const latest = (latestRes.data ?? []) as Car[];
  const inquiries = (inqRes.data ?? []) as Inquiry[];

  const stats = [
    { label: "Makina aktive", value: active, href: "/admin/makinat?statusi=active" },
    { label: "Të rezervuara", value: reserved, href: "/admin/makinat?statusi=reserved" },
    { label: "Të shitura", value: sold, href: "/admin/makinat?statusi=sold" },
    { label: "Kërkesa të reja", value: newInquiries, href: "/admin/kerkesat" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Përmbledhja</h1>
        <Link href="/admin/makinat/e-re" className="btn-primary">+ Shto makinë</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-5 hover:shadow-md">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="mt-1 text-3xl font-black">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold">Ndryshuar së fundmi</h2>
            <Link href="/admin/makinat" className="text-sm font-semibold text-brand">Të gjitha →</Link>
          </div>
          {latest.length === 0 ? (
            <p className="text-sm text-slate-500">Ende nuk keni shtuar makina.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {latest.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <Link href={`/admin/makinat/${c.id}`} className="font-semibold hover:text-brand">
                    {c.brand} {c.model} {c.year}
                  </Link>
                  <span className="flex items-center gap-2">
                    <span className="text-slate-500">{formatPrice(c.price)}</span>
                    <StatusBadge status={c.status} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold">Kërkesat e fundit</h2>
            <Link href="/admin/kerkesat" className="text-sm font-semibold text-brand">Të gjitha →</Link>
          </div>
          {inquiries.length === 0 ? (
            <p className="text-sm text-slate-500">Asnjë kërkesë ende.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {inquiries.map((q) => (
                <li key={q.id} className="py-2.5 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="font-semibold">
                      {!q.handled && <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-brand" />}
                      {q.name}
                    </span>
                    <span className="text-xs text-slate-400">{formatDate(q.created_at)}</span>
                  </div>
                  <p className="text-slate-500">
                    {q.cars ? `${q.cars.brand} ${q.cars.model} ${q.cars.year} · ` : ""}
                    {q.phone ?? q.email}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
