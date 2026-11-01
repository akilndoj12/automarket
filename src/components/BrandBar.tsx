import Link from "next/link";

const PREMIUM = [
  "Aston Martin", "Audi", "Bentley", "BMW", "Ferrari", "Lamborghini", "Land Rover",
  "Maserati", "McLaren", "Mercedes-Benz", "Porsche", "Rolls-Royce", "Volvo",
];
const CATEGORIES = [
  { label: "SUV", href: "/makinat?tipi=SUV" },
  { label: "Elektrike", href: "/makinat?karburanti=Elektrike" },
  { label: "Hibrid", href: "/makinat?karburanti=Hibrid" },
  { label: "Kabriolet", href: "/makinat?tipi=Kabriolet" },
  { label: "Coupe", href: "/makinat?tipi=Coupe" },
  { label: "Ofertat", href: "/oferta" },
];

/** Rreshti i markave dhe kategorive (si filtër i shpejtë) */
export default function BrandBar({ brands }: { brands: string[] }) {
  const all = [...new Set([...brands, ...PREMIUM])].sort((a, b) => a.localeCompare(b));
  const available = new Set(brands);
  return (
    <section className="border-y border-line bg-black/40">
      <div className="container-x flex gap-2 overflow-x-auto py-4 [scrollbar-width:none]">
        {CATEGORIES.map((c) => (
          <Link key={c.label} href={c.href} className="shrink-0 rounded-full border border-brand/50 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-accent hover:bg-brand hover:text-black">
            {c.label}
          </Link>
        ))}
        <span className="mx-2 w-px shrink-0 bg-line" />
        {all.map((b) => (
          <Link
            key={b}
            href={`/makinat?marka=${encodeURIComponent(b)}`}
            className={`shrink-0 rounded-full border border-line px-4 py-2 text-xs font-medium uppercase tracking-widest hover:border-brand hover:text-fg ${available.has(b) ? "text-fg" : "text-muted"}`}
          >
            {b}
          </Link>
        ))}
      </div>
    </section>
  );
}
