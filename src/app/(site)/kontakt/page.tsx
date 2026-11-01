import type { Metadata } from "next";
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/Icons";
import InquiryForm from "@/components/InquiryForm";
import { getSettings } from "@/lib/data";
import { telLink, whatsappLink } from "@/lib/format";

export const metadata: Metadata = { title: "Kontakt" };

export default async function ContactPage() {
  const s = await getSettings();
  const wa = whatsappLink(s.whatsapp, "Përshëndetje!");
  const tel = telLink(s.phone);

  return (
    <div className="container-x py-12">
      <h1 className="text-3xl font-extrabold">Kontakt</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card space-y-4 p-6">
          {s.phone && tel && (
            <a href={tel} className="flex items-center gap-3 font-semibold hover:text-brand">
              <PhoneIcon /> {s.phone}
            </a>
          )}
          {wa && (
            <a href={wa} target="_blank" rel="noreferrer" className="flex items-center gap-3 font-semibold text-[#128C7E] hover:underline">
              <WhatsAppIcon /> Na shkruani në WhatsApp
            </a>
          )}
          {s.email && (
            <a href={`mailto:${s.email}`} className="flex items-center gap-3 font-semibold hover:text-brand">
              <MailIcon /> {s.email}
            </a>
          )}
          {s.address && (
            <p className="flex items-center gap-3 font-semibold">
              <PinIcon /> {s.address}
            </p>
          )}
          {s.hours && <p className="text-sm text-slate-500">Orari: {s.hours}</p>}
          {s.map_url && (
            <div className="aspect-video overflow-hidden rounded-lg border border-slate-200">
              <iframe src={s.map_url} title="Harta" className="h-full w-full" loading="lazy" />
            </div>
          )}
        </div>
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-bold">Na dërgoni një mesazh</h2>
          <InquiryForm />
        </div>
      </div>
    </div>
  );
}
