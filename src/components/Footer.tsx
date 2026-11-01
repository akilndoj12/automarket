import Link from "next/link";
import type { Settings } from "@/lib/types";
import { MailIcon, PhoneIcon, PinIcon } from "./Icons";

export default function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="mt-20 bg-ink text-slate-300">
      <div className="container-x grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="text-xl font-light uppercase tracking-[0.3em] text-white">{settings.site_name}</p>
          {settings.tagline && <p className="mt-2 max-w-sm text-sm">{settings.tagline}</p>}
          <div className="mt-4 flex gap-4 text-sm">
            {settings.facebook && <a href={settings.facebook} target="_blank" rel="noreferrer" className="hover:text-white">Facebook</a>}
            {settings.instagram && <a href={settings.instagram} target="_blank" rel="noreferrer" className="hover:text-white">Instagram</a>}
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Faqet</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/makinat" className="hover:text-white">Të gjitha makinat</Link></li>
            <li><Link href="/oferta" className="hover:text-white">Makinat në ofertë</Link></li>
            <li><Link href="/te-shitura" className="hover:text-white">Makinat e shitura</Link></li>
            <li><Link href="/rreth-nesh" className="hover:text-white">Rreth nesh</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Kontakt</p>
          <ul className="space-y-2 text-sm">
            {settings.phone && <li className="flex gap-2"><PhoneIcon className="h-4 w-4 shrink-0" />{settings.phone}</li>}
            {settings.email && <li className="flex gap-2"><MailIcon className="h-4 w-4 shrink-0" />{settings.email}</li>}
            {settings.address && <li className="flex gap-2"><PinIcon className="h-4 w-4 shrink-0" />{settings.address}</li>}
            {settings.hours && <li className="text-slate-400">{settings.hours}</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {settings.site_name}. Të gjitha të drejtat e rezervuara.
      </div>
    </footer>
  );
}
