import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import type { Car } from "@/lib/types";
import CarForm from "../CarForm";
import DeleteCarButton from "./DeleteCarButton";

export default async function EditCarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { supabase } = await requireAdmin();

  const [{ data: car }, { data: priv }] = await Promise.all([
    supabase.from("cars").select("*").eq("id", id).maybeSingle(),
    supabase.from("car_private").select("vin, notes").eq("car_id", id).maybeSingle(),
  ]);
  if (!car) notFound();
  const c = car as Car;

  return (
    <div>
      <Link href="/admin/makinat" className="text-sm text-slate-500 hover:text-ink">← Makinat</Link>
      <div className="mb-6 mt-1 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">
          {c.brand} {c.model} {c.year}
        </h1>
        <div className="flex gap-2">
          <Link href={`/makinat/${c.id}`} target="_blank" className="btn-outline">Shiko në faqe ↗</Link>
          <DeleteCarButton id={c.id} />
        </div>
      </div>
      <CarForm car={c} privateVin={priv?.vin ?? null} notes={priv?.notes ?? null} />
    </div>
  );
}
