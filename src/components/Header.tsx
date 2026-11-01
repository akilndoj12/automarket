import Link from "next/link";
import type { Settings } from "@/lib/types";
import { telLink } from "@/lib/format";
import { PhoneIcon } from "./Icons";

const NAV = [
  { href: "/makinat", label: "Automjetet" },
  { href: "/oferta", label: "Oferta" },
  { href: "/te-shitura", label: "Të shitura" },
  { href: "/rreth-nesh", label: "Rreth nesh" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Logo({ settings }: { settings: Settings }) {
  if (settings.logo_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={settings.logo_url} alt={settings.site_name} className="h-9 w-auto" />;
  }
  const [first, ...rest] = settings.site_name.split(" ");
  return (
    <span className="flex flex-col leading-none">
      <span className="text-lg font-light uppercase tracking-[0.3em]">{first}</span>
      {rest.length > 0 && (
        <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.55em] text-accent">{rest.join(" ")}</span>
      )}
    </span>
  );
}

export default function Header({ settings }: { settings: Settings }) {
  const tel = telLink(settings.phone);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="container-x flex h-20 items-center justify-between gap-4">
        <Link href="/" className="shrink-0">
          <Logo settings={settings} />
        </Link>

        <nav className="hidden items-center gap-8 text-xs font-medium uppercase tracking-[0.2em] md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-muted hover:text-fg">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {tel && (
            <a href={tel} className="btn-outline hidden sm:inline-flex">
              <PhoneIcon className="h-4 w-4" />
              {settings.phone}
            </a>
          )}
          <details className="relative md:hidden">
            <summary className="btn-outline list-none px-3 [&::-webkit-details-marker]:hidden" aria-label="Menu">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </summary>
            <nav className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-surface shadow-lg">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="block px-4 py-3 text-sm font-medium hover:bg-white/5">
                  {n.label}
                </Link>
              ))}
              {tel && (
                <a href={tel} className="block border-t border-line px-4 py-3 text-sm font-semibold text-accent">
                  Telefono: {settings.phone}
                </a>
              )}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
