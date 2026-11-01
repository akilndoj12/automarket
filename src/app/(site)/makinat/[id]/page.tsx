import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CarGrid from "@/components/CarGrid";
import Gallery from "@/components/Gallery";
import { PhoneIcon, WhatsAppIcon } from "@/components/Icons";
import InquiryForm from "@/components/InquiryForm";
import StatusBadge from "@/components/StatusBadge";
import { getCar, getSettings, getSimilarCars } from "@/lib/data";
import {
  carTitle,
  discountPercent,
  formatKm,
  formatPrice,
  siteUrl,
  telLink,
  whatsappLink,
} from "@/lib/format";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const car = await getCar(id);
  if (!car) return { title: "Makina nuk u gjet" };
  const title = `${carTitle(car)} ${car.year} — ${formatPrice(car.price)}`;
  return {
    title,
    description: [car.fuel, car.transmission, formatKm(car.mileage), car.location].filter(Boolean).join(" • "),
    openGraph: { title, images: car.images[0] ? [car.images[0]] : undefined },
  };
}

function videoEmbed(url: string | null) {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  return null;
}

export default async function CarPage({ params }: { params: Params }) {
  const { id } = await params;
  const [car, settings] = await Promise.all([getCar(id), getSettings()]);
  if (!car) notFound();

  const similar = await getSimilarCars(car);
  const title = carTitle(car);
  const off = discountPercent(car);
  const sold = car.status === "sold";
  const link = siteUrl() ? `${siteUrl()}/makinat/${car.id}` : "";
  const waText = `Përshëndetje! Jam i interesuar për ${title} ${car.year} (${formatPrice(car.price)}). ${link}`.trim();
  const wa = whatsappLink(settings.whatsapp, waText);
  const tel = telLink(settings.phone);
  const embed = videoEmbed(car.video_url);

  const specs: [string, string | number | null | undefined][] = [
    ["Viti", car.year],
    ["Kilometrat", formatKm(car.mileage)],
    ["Karburanti", car.fuel],
    ["Kambio", car.transmission],
    ["Cilindrata", car.engine_cc ? `${car.engine_cc.toLocaleString("de-DE")} cm³` : null],
    ["Fuqia", car.power_hp ? `${car.power_hp} kf` : null],
    ["Tërheqja", car.drive],
    ["Tipi", car.body_type],
    ["Ngjyra", car.color],
    ["Dyert", car.doors],
    ["Ulëset", car.seats],
    ["Gjendja", car.condition],
    ["Vendndodhja", car.location],
    ["VIN", car.vin],
  ];

  return (
    <div className="container-x py-8">
      <nav className="mb-4 text-sm text-muted">
        <Link href="/makinat" className="hover:text-fg">Makinat</Link>
        <span className="mx-2">/</span>
        <Link href={`/makinat?marka=${encodeURIComponent(car.brand)}`} className="hover:text-fg">{car.brand}</Link>
        <span className="mx-2">/</span>
        <span className="text-fg">{car.model}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <Gallery images={car.images} title={title} dim={sold} />

          <section className="card mt-6 p-6">
            <h2 className="mb-4 text-lg font-bold">Të dhënat teknike</h2>
            <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {specs
                .filter(([, v]) => v !== null && v !== undefined && v !== "")
                .map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-line pb-2 text-sm">
                    <dt className="text-muted">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
            </dl>
          </section>

          {car.features.length > 0 && (
            <section className="card mt-6 p-6">
              <h2 className="mb-4 text-lg font-bold">Opsionet</h2>
              <ul className="grid gap-2 text-sm sm:grid-cols-2">
                {car.features.map((x) => (
                  <li key={x} className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span> {x}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {car.description && (
            <section className="card mt-6 p-6">
              <h2 className="mb-3 text-lg font-bold">Përshkrimi</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted">{car.description}</p>
            </section>
          )}

          {car.video_url && (
            <section className="card mt-6 p-6">
              <h2 className="mb-3 text-lg font-bold">Video</h2>
              {embed ? (
                <div className="aspect-video overflow-hidden rounded-lg">
                  <iframe src={embed} title={title} className="h-full w-full" allowFullScreen />
                </div>
              ) : (
                <a href={car.video_url} target="_blank" rel="noreferrer" className="font-semibold text-accent hover:underline">
                  Shiko videon →
                </a>
              )}
            </section>
          )}
        </div>

        {/* Kolona e çmimit dhe kontaktit */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="card p-6">
            <div className="flex items-center gap-2">
              <StatusBadge status={car.status} />
              {off > 0 && !sold && <span className="rounded-md bg-brand px-2 py-1 text-xs font-bold text-fg">Ofertë -{off}%</span>}
            </div>
            <h1 className="mt-3 text-2xl font-light uppercase tracking-wide leading-tight">
              {title}
              {car.version && <span className="block text-base font-medium text-muted">{car.version}</span>}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {[car.year, car.fuel, car.transmission, formatKm(car.mileage)].filter(Boolean).join(" • ")}
            </p>
            <div className="mt-4 flex items-end gap-3">
              <span className="text-3xl font-semibold text-accent">{formatPrice(car.price)}</span>
              {off > 0 && <span className="pb-1 text-muted line-through">{formatPrice(car.old_price)}</span>}
            </div>

            {!sold ? (
              <div className="mt-5 space-y-2">
                {wa && (
                  <a href={wa} target="_blank" rel="noreferrer" className="btn-whatsapp w-full py-3">
                    <WhatsAppIcon /> Pyet në WhatsApp
                  </a>
                )}
                {tel && (
                  <a href={tel} className="btn-outline w-full py-3">
                    <PhoneIcon /> Telefono {settings.phone}
                  </a>
                )}
              </div>
            ) : (
              <p className="mt-5 rounded-lg bg-white/5 p-3 text-sm text-muted">
                Kjo makinë është shitur. <Link href="/makinat" className="font-semibold text-accent">Shiko makinat e tjera →</Link>
              </p>
            )}
          </div>

          {!sold && (
            <div className="card p-6">
              <h2 className="mb-3 font-bold">Na lini një mesazh</h2>
              <InquiryForm carId={car.id} defaultMessage={`Jam i interesuar për ${title} ${car.year}.`} />
            </div>
          )}
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 text-2xl font-light uppercase tracking-wide">Makina të ngjashme</h2>
          <CarGrid cars={similar} />
        </section>
      )}
    </div>
  );
}
