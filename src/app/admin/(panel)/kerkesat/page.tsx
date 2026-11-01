import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { formatDate, whatsappLink } from "@/lib/format";
import type { Inquiry } from "@/lib/types";
import InquiryActions from "./InquiryActions";

export default async function InquiriesPage({ searchParams }: { searchParams: Promise<{ te?: string }> }) {
  const { te } = await searchParams;
  const { supabase } = await requireAdmin();
  let q = supabase.from("inquiries").select("*, cars(brand, model, year)");
  if (te !== "gjitha") q = q.eq("handled", false);
  const { data } = await q.order("created_at", { ascending: false }).limit(300);
  const list = (data ?? []) as Inquiry[];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold">Kërkesat e klientëve</h1>
      <div className="flex gap-2">
        <Link href="/admin/kerkesat" className={`rounded-full px-4 py-1.5 text-sm font-medium ${te !== "gjitha" ? "bg-ink text-white" : "border border-slate-300 bg-white"}`}>Të reja</Link>
        <Link href="/admin/kerkesat?te=gjitha" className={`rounded-full px-4 py-1.5 text-sm font-medium ${te === "gjitha" ? "bg-ink text-white" : "border border-slate-300 bg-white"}`}>Të gjitha</Link>
      </div>

      {list.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">Nuk ka kërkesa këtu.</div>
      ) : (
        <div className="space-y-3">
          {list.map((q) => {
            const wa = whatsappLink(q.phone, `Përshëndetje ${q.name}!`);
            return (
              <div key={q.id} className={`card p-4 ${q.handled ? "opacity-60" : ""}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">{q.name}</p>
                    <p className="text-xs text-slate-400">{formatDate(q.created_at)}</p>
                  </div>
                  <InquiryActions id={q.id} handled={q.handled} />
                </div>
                {q.cars && q.car_id && (
                  <Link href={`/admin/makinat/${q.car_id}`} className="mt-2 inline-block rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold hover:bg-slate-200">
                    {q.cars.brand} {q.cars.model} {q.cars.year}
                  </Link>
                )}
                {q.message && <p className="mt-2 whitespace-pre-line text-sm text-slate-700">{q.message}</p>}
                <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
                  {q.phone && <a href={`tel:${q.phone}`} className="text-ink hover:text-brand">📞 {q.phone}</a>}
                  {wa && <a href={wa} target="_blank" rel="noreferrer" className="text-[#128C7E] hover:underline">WhatsApp</a>}
                  {q.email && <a href={`mailto:${q.email}`} className="text-ink hover:text-brand">✉ {q.email}</a>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
