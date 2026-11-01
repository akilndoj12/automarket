import Link from "next/link";
import BrandBar from "@/components/BrandBar";
import CarGrid from "@/components/CarGrid";
import { WhatsAppIcon } from "@/components/Icons";
import SearchBox from "@/components/SearchBox";
import { getBrands, getLatestCars, getOfferCars, getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/format";

export default async function HomePage() {
  const [settings, brands, latest, offers] = await Promise.all([
    getSettings(),
    getBrands(),
    getLatestCars(9),
    getOfferCars(),
  ]);
  const wa = whatsappLink(settings.whatsapp, "Përshëndetje! Dua informacion për automjetet tuaja.");
  const hero = latest.find((c) => c.images[0])?.images[0];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {hero ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(55% 80% at 80% 0%, #c9a96133 0%, transparent 60%), radial-gradient(50% 70% at 0% 100%, #1f1f22 0%, transparent 70%)",
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
        <div className="container-x relative pb-16 pt-20 sm:pb-24 sm:pt-32">
          <p className="text-xs font-medium uppercase tracking-[0.45em] text-accent">European Brands · Global Luxury</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-light uppercase leading-[1.1] tracking-wide sm:text-6xl">
            Koleksion ekskluziv <br className="hidden sm:block" />
            <span className="font-semibold">automjetesh premium</span>
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/makinat" className="btn-primary px-6 py-3 uppercase tracking-widest">Shiko automjetet</Link>
            {wa && (
              <a href={wa} target="_blank" rel="noreferrer" className="btn-outline px-6 py-3 uppercase tracking-widest">
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      <BrandBar brands={brands} />

      {/* Ofertat e reja */}
      <section className="container-x mt-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-accent">Në stok</p>
            <h2 className="mt-2 text-3xl font-light uppercase tracking-wide">Ofertat e reja</h2>
          </div>
          <Link href="/makinat" className="text-sm uppercase tracking-widest text-muted hover:text-fg">Të gjitha →</Link>
        </div>
        <CarGrid cars={latest} narrow empty="Së shpejti do të publikojmë automjetet e para." />
      </section>

      {offers.length > 0 && (
        <section className="container-x mt-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-accent">Çmim i ulur</p>
              <h2 className="mt-2 text-3xl font-light uppercase tracking-wide">Ofertat speciale</h2>
            </div>
            <Link href="/oferta" className="text-sm uppercase tracking-widest text-muted hover:text-fg">Të gjitha →</Link>
          </div>
          <CarGrid cars={offers.slice(0, 3)} narrow />
        </section>
      )}

      {/* Na gjeni kudo */}
      <section className="container-x mt-24">
        <div className="card px-6 py-12 text-center sm:px-12">
          <h2 className="text-2xl font-light uppercase tracking-[0.2em]">Na gjeni kudo</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Na kontaktoni ose ndiqni ofertat tona më të fundit.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {wa && (
              <a href={wa} target="_blank" rel="noreferrer" className="btn-whatsapp px-6 py-3">
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noreferrer" className="btn-outline px-6 py-3">Instagram</a>
            )}
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noreferrer" className="btn-outline px-6 py-3">Facebook</a>
            )}
            <Link href="/kontakt" className="btn-outline px-6 py-3">Kontakt</Link>
          </div>
          <p className="mt-8 text-xs text-muted">
            Shikimi i automjeteve bëhet vetëm me takim paraprak. Të dhënat dhe çmimet mund të ndryshojnë pa njoftim.
          </p>
        </div>
      </section>
    </>
  );
}
