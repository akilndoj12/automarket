"use client";

import { useActionState } from "react";
import { saveSettings, type FormState } from "../../actions";
import type { Settings } from "@/lib/types";

const FIELDS: { name: keyof Settings; label: string; hint?: string; area?: boolean }[] = [
  { name: "site_name", label: "Emri i faqes *" },
  { name: "tagline", label: "Slogani" },
  { name: "phone", label: "Telefoni", hint: "Shfaqet në faqe, p.sh. +355 69 123 4567" },
  { name: "whatsapp", label: "Numri i WhatsApp", hint: "Vetëm shifra me prefiksin e shtetit, p.sh. 355691234567" },
  { name: "email", label: "Email" },
  { name: "address", label: "Adresa" },
  { name: "hours", label: "Orari" },
  { name: "logo_url", label: "Logoja (link i imazhit)", hint: "Bosh = shfaqet emri i faqes si tekst" },
  { name: "facebook", label: "Facebook (link)" },
  { name: "instagram", label: "Instagram (link)" },
  { name: "map_url", label: "Harta (link 'Embed' nga Google Maps)", hint: "Google Maps → Share → Embed a map → kopjo vetëm linkun te src=\"...\"" },
  { name: "about", label: "Teksti 'Rreth nesh'", area: true },
];

export default function SettingsForm({ s }: { s: Settings }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveSettings, null);
  return (
    <form action={action} className="card space-y-4 p-6">
      {FIELDS.map((f) => (
        <label key={f.name} className="block">
          <span className="label">{f.label}</span>
          {f.area ? (
            <textarea name={f.name} rows={6} defaultValue={s[f.name] ?? ""} className="input" />
          ) : (
            <input name={f.name} defaultValue={s[f.name] ?? ""} className="input" />
          )}
          {f.hint && <span className="mt-1 block text-xs text-slate-500">{f.hint}</span>}
        </label>
      ))}
      {state && (
        <p className={`rounded-lg p-3 text-sm font-medium ${state.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>
          {state.message}
        </p>
      )}
      <button disabled={pending} className="btn-primary">{pending ? "Duke ruajtur…" : "Ruaj cilësimet"}</button>
    </form>
  );
}
