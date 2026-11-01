"use client";

import { useActionState, useState } from "react";
import { saveCar, type FormState } from "../../actions";
import { BODY_TYPES, COMMON_FEATURES, CONDITIONS, DRIVES, FUELS, TRANSMISSIONS } from "@/lib/options";
import { formatPrice } from "@/lib/format";
import type { Car } from "@/lib/types";
import ImageManager from "./ImageManager";

type Props = { car?: Car; privateVin?: string | null; notes?: string | null };

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="label">{label}</span>
      {children}
    </label>
  );
}

function Select({ name, options, value, empty }: { name: string; options: string[]; value?: string | null; empty?: string }) {
  return (
    <select name={name} defaultValue={value ?? ""} className="input">
      {empty !== undefined && <option value="">{empty}</option>}
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

export default function CarForm({ car, privateVin, notes }: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveCar, null);
  const [images, setImages] = useState<string[]>(car?.images ?? []);
  const [removed, setRemoved] = useState<string[]>([]);
  const [folder] = useState(() => car?.id ?? crypto.randomUUID());
  const [preview, setPreview] = useState({
    brand: car?.brand ?? "",
    model: car?.model ?? "",
    year: car?.year ? String(car.year) : "",
    price: car?.price != null ? String(car.price) : "",
    fuel: car?.fuel ?? FUELS[0],
    status: car?.status ?? "active",
  });

  const extraFeatures = (car?.features ?? []).filter((f) => !COMMON_FEATURES.includes(f));

  return (
    <form
      action={action}
      onInput={(e) => {
        const fd = new FormData(e.currentTarget);
        setPreview({
          brand: String(fd.get("brand") ?? ""),
          model: String(fd.get("model") ?? ""),
          year: String(fd.get("year") ?? ""),
          price: String(fd.get("price") ?? ""),
          fuel: String(fd.get("fuel") ?? ""),
          status: (String(fd.get("status") ?? "active") as Car["status"]),
        });
      }}
      className="grid gap-6 xl:grid-cols-[1fr_320px]"
    >
      {car && <input type="hidden" name="id" value={car.id} />}
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <input type="hidden" name="removed_images" value={JSON.stringify(removed)} />

      <div className="space-y-6">
        <section className="card p-5">
          <h2 className="mb-4 font-bold">Të dhënat kryesore</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Marka *"><input name="brand" required defaultValue={car?.brand} className="input" placeholder="Land Rover" list="brands" /></Field>
            <Field label="Modeli *"><input name="model" required defaultValue={car?.model} className="input" placeholder="Defender" /></Field>
            <Field label="Versioni"><input name="version" defaultValue={car?.version ?? ""} className="input" placeholder="110 D300 X-Dynamic" /></Field>
            <Field label="Viti *"><input name="year" type="number" min={1950} max={2100} required defaultValue={car?.year} className="input" /></Field>
            <Field label="Çmimi (€) *"><input name="price" type="number" min={0} required defaultValue={car?.price} className="input" /></Field>
            <Field label="Çmimi i mëparshëm (€) — për ofertë"><input name="old_price" type="number" min={0} defaultValue={car?.old_price ?? ""} className="input" placeholder="bosh = pa ofertë" /></Field>
            <Field label="Karburanti"><Select name="fuel" options={FUELS} value={car?.fuel} /></Field>
            <Field label="Kambio"><Select name="transmission" options={TRANSMISSIONS} value={car?.transmission} /></Field>
            <Field label="Kilometrat"><input name="mileage" type="number" min={0} defaultValue={car?.mileage ?? ""} className="input" /></Field>
          </div>
          <datalist id="brands">
            {["Audi", "BMW", "Mercedes-Benz", "Volkswagen", "Toyota", "Kia", "Hyundai", "Ford", "Opel", "Peugeot", "Renault", "Fiat", "Skoda", "Seat", "Nissan", "Land Rover", "Porsche", "Volvo"].map((b) => (
              <option key={b} value={b} />
            ))}
          </datalist>
        </section>

        <section className="card p-5">
          <h2 className="mb-4 font-bold">Fotografi dhe video</h2>
          <ImageManager
            folder={folder}
            images={images}
            onChange={setImages}
            onRemove={(u) => setRemoved((r) => [...r, u])}
          />
          <Field label="Video (link YouTube ose tjetër)" className="mt-4">
            <input name="video_url" type="url" defaultValue={car?.video_url ?? ""} className="input" placeholder="https://youtube.com/watch?v=..." />
          </Field>
        </section>

        <section className="card p-5">
          <h2 className="mb-4 font-bold">Të dhënat teknike</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Cilindrata (cm³)"><input name="engine_cc" type="number" min={0} defaultValue={car?.engine_cc ?? ""} className="input" /></Field>
            <Field label="Fuqia (kf)"><input name="power_hp" type="number" min={0} defaultValue={car?.power_hp ?? ""} className="input" /></Field>
            <Field label="Tërheqja"><Select name="drive" options={DRIVES} value={car?.drive} empty="—" /></Field>
            <Field label="Tipi"><Select name="body_type" options={BODY_TYPES} value={car?.body_type} empty="—" /></Field>
            <Field label="Ngjyra"><input name="color" defaultValue={car?.color ?? ""} className="input" /></Field>
            <Field label="Dyert"><input name="doors" type="number" min={1} max={9} defaultValue={car?.doors ?? ""} className="input" /></Field>
            <Field label="Ulëset"><input name="seats" type="number" min={1} max={60} defaultValue={car?.seats ?? ""} className="input" /></Field>
            <Field label="Gjendja teknike"><Select name="condition" options={CONDITIONS} value={car?.condition} empty="—" /></Field>
            <Field label="Vendndodhja"><input name="location" defaultValue={car?.location ?? ""} className="input" placeholder="Tiranë" /></Field>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="VIN (numri i shasisë)"><input name="vin" defaultValue={privateVin ?? car?.vin ?? ""} className="input font-mono uppercase" /></Field>
            <label className="flex items-center gap-2 pt-6 text-sm">
              <input type="checkbox" name="show_vin" defaultChecked={!!car?.vin} className="h-4 w-4 accent-brand" />
              Shfaqe VIN-in publikisht
            </label>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="mb-4 font-bold">Opsionet</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {COMMON_FEATURES.map((f) => (
              <label key={f} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="features" value={f} defaultChecked={car?.features.includes(f)} className="h-4 w-4 accent-brand" />
                {f}
              </label>
            ))}
          </div>
          <Field label="Opsione të tjera (të ndara me presje)" className="mt-4">
            <input name="features_extra" defaultValue={extraFeatures.join(", ")} className="input" placeholder="Tërheqëse, Head-up display" />
          </Field>
        </section>

        <section className="card p-5">
          <h2 className="mb-4 font-bold">Përshkrimi</h2>
          <textarea name="description" rows={6} defaultValue={car?.description ?? ""} className="input" placeholder="Historiku, servisi, gjendja e gomave, dokumentet…" />
          <Field label="Shënime private (nuk shfaqen në faqe)" className="mt-4">
            <textarea name="notes" rows={2} defaultValue={notes ?? ""} className="input" placeholder="p.sh. çmimi i blerjes, kontakti i shitësit" />
          </Field>
        </section>
      </div>

      {/* Kolona djathtas: publikimi + pamja paraprake */}
      <div className="space-y-4 xl:sticky xl:top-6 xl:self-start">
        <section className="card space-y-4 p-5">
          <h2 className="font-bold">Publikimi</h2>
          <Field label="Statusi">
            <select name="status" defaultValue={car?.status ?? "active"} className="input">
              <option value="active">Aktive</option>
              <option value="reserved">Rezervuar</option>
              <option value="sold">Shitur</option>
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={car?.published ?? true} className="h-4 w-4 accent-brand" />
            E publikuar (duket në faqe)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" defaultChecked={car?.featured ?? false} className="h-4 w-4 accent-brand" />
            E veçuar (del e para në listë)
          </label>
          {state && !state.ok && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.message}</p>}
          <button disabled={pending} className="btn-primary w-full py-3">
            {pending ? "Duke ruajtur…" : car ? "Ruaj ndryshimet" : "Publiko makinën"}
          </button>
        </section>

        <section className="card overflow-hidden">
          <p className="border-b border-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Pamje paraprake</p>
          <div className="aspect-[4/3] bg-slate-200">
            {images[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={images[0]} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <div className="p-4">
            <p className="font-bold">{[preview.brand, preview.model].filter(Boolean).join(" ") || "Marka Modeli"}</p>
            <p className="text-sm text-slate-500">{[preview.year, preview.fuel].filter(Boolean).join(" • ")}</p>
            <p className="mt-2 text-xl font-extrabold">{preview.price ? formatPrice(Number(preview.price)) : "— €"}</p>
          </div>
        </section>
      </div>
    </form>
  );
}
