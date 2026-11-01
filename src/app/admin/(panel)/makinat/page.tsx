import Link from "next/link";
import { CarPlaceholder } from "@/components/Icons";
import { requireAdmin } from "@/lib/auth";
import { formatKm, formatPrice } from "@/lib/format";
import { STATUS_LABEL } from "@/lib/options";
import type { Car } from "@/lib/types";
import RowActions from "./RowActions";

type SP = Promise<Record<string, string | undefined>>;

export default async function AdminCars({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const { supabase } = await requireAdmin();

  let q = supabase.from("cars").select("*");
  if (sp.statusi && ["active", "reserved", "sold"].includes(sp.statusi)) q = q.eq("status", sp.statusi);
  if (sp.k) {
    const term = sp.k.replace(/[%_,()]/g, " ").trim();
    if (term) q = q.or(`brand.ilike.%${term}%,model.ilike.%${term}%`);
  }
  const { data } = await q.order("created_at", { ascending: false }).limit(500);
  const cars = (data ?? []) as Car[];

  const tabs = [
    { v: "", l: "Të gjitha" },
    { v: "active", l: "Aktive" },
    { v: "reserved", l: "Rezervuar" },
    { v: "sold", l: "Shitur" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Menaxhimi i makinave</h1>
        <Link href="/admin/makinat/e-re" className="btn-primary">+ Shto makinë</Link>
      </div>

      {sp.ruajtur && <p className="rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-800">Makina u ruajt me sukses.</p>}
      {sp.fshire && <p className="rounded-lg bg-slate-100 p-3 text-sm font-medium text-slate-700">Makina u fshi.</p>}

      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <Link
            key={t.v}
            href={t.v ? `/admin/makinat?statusi=${t.v}` : "/admin/makinat"}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              (sp.statusi ?? "") === t.v ? "bg-ink text-white" : "border border-slate-300 bg-white"
            }`}
          >
            {t.l}
          </Link>
        ))}
        <form className="ml-auto flex gap-2">
          {sp.statusi && <input type="hidden" name="statusi" value={sp.statusi} />}
          <input name="k" defaultValue={sp.k ?? ""} placeholder="Kërko markë / model" className="input w-56" />
          <button className="btn-outline">Kërko</button>
        </form>
      </div>

      {cars.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          Nuk ka makina këtu. <Link href="/admin/makinat/e-re" className="font-semibold text-brand">Shto të parën →</Link>
        </div>
      ) : (
        <div className="card divide-y divide-slate-100">
          {cars.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center gap-4 p-3">
              <Link href={`/admin/makinat/${c.id}`} className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-200">
                {c.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.images[0]} alt="" className="h-full w-full object-cover" />
                ) : (
                  <CarPlaceholder />
                )}
              </Link>
              <div className="min-w-48 flex-1">
                <Link href={`/admin/makinat/${c.id}`} className="font-bold hover:text-brand">
                  {c.brand} {c.model} {c.year}
                </Link>
                <p className="text-sm text-slate-500">
                  {formatPrice(c.price)}
                  {c.old_price ? <span className="ml-1 line-through">{formatPrice(c.old_price)}</span> : null}
                  {c.mileage != null && ` · ${formatKm(c.mileage)}`}
                  {!c.published && <span className="ml-2 rounded bg-slate-200 px-1.5 text-xs text-slate-700">E fshehur</span>}
                  {c.featured && <span className="ml-2 rounded bg-amber-100 px-1.5 text-xs text-amber-800">E veçuar</span>}
                </p>
              </div>
              <RowActions id={c.id} status={c.status} published={c.published} />
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-slate-400">
        Statuset: {Object.values(STATUS_LABEL).join(" / ")}. “E fshehur” = nuk shfaqet në faqen publike.
      </p>
    </div>
  );
}
