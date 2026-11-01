import Link from "next/link";
import CarGrid from "@/components/CarGrid";
import SearchBox from "@/components/SearchBox";
import { getBrands, getLatestCars, getOfferCars, getSettings } from "@/lib/data";
import { BODY_TYPES } from "@/lib/options";

export default async function HomePage() {
  const [settings, brands, latest, offers] = await Promise.all([
    getSettings(),
    getBrands(),
    getLatestCars(8),
    getOfferCars(),
  ]);

  return (
    <>
      {/* Hero + kërkimi */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 80% at 85% 0%, #c9a96155 0%, transparent 60%), radial-gradient(50% 60% at 0% 100%, #2a2a2e 0%, transparent 70%)",
          }}
        />
        <div className="container-x relative pb-24 pt-16 sm:pt-24">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-brand">{settings.site_name}</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-light leading-tight sm:text-6xl">
            Automjete premium,<br />
            <span className="font-semibold">zgjedhur me kujdes.</span>
          </h1>
          {settings.tagline && <p className="mt-4 max-w-xl text-lg text-slate-300">{settings.tagline}</p>}
        </div>
      </section>
      <div className="container-x relative -mt-14">
        <SearchBox brands={brands} />
      </div>

      {/* Tipet e makinave */}
      <section className="container-x mt-10 flex flex-wrap gap-2">
        {BODY_TYPES.slice(0, 6).map((t) => (
          <Link key={t} href={`/makinat?tipi=${encodeURIComponent(t)}`} className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium hover:border-ink">
            {t}
          </Link>
        ))}
      </section>

      {/* Makinat më të fundit */}
      <section className="container-x mt-12">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-2xl font-extrabold">Makinat më të fundit</h2>
          <Link href="/makinat" className="text-sm font-semibold text-brand-dark hover:underline">Shiko të gjitha →</Link>
        </div>
        <CarGrid cars={latest} empty="Së shpejti do të publikojmë makinat e para." />
      </section>

      {/* Ofertat */}
      {offers.length > 0 && (
        <section className="container-x mt-16">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-2xl font-extrabold">Makinat në ofertë</h2>
            <Link href="/oferta" className="text-sm font-semibold text-brand-dark hover:underline">Të gjitha ofertat →</Link>
          </div>
          <CarGrid cars={offers.slice(0, 4)} />
        </section>
      )}

      {/* Pse ne */}
      <section className="container-x mt-16 grid gap-5 md:grid-cols-3">
        {[
          ["Marka europiane premium", "Land Rover, Mercedes-Benz, BMW, Porsche, Audi dhe më shumë."],
          ["Çmime të qarta", "Çmimi që shihni është çmimi real, pa surpriza."],
          ["Kontakt i shpejtë", "Na shkruani në WhatsApp për çdo automjet — përgjigjemi shpejt."],
        ].map(([t, d]) => (
          <div key={t} className="card p-6">
            <p className="font-bold">{t}</p>
            <p className="mt-1 text-sm text-slate-600">{d}</p>
          </div>
        ))}
      </section>
    </>
  );
}
