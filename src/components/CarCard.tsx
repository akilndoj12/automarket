import Link from "next/link";
import type { Car } from "@/lib/types";
import { carTitle, discountPercent, formatKm, formatPrice } from "@/lib/format";
import { CarPlaceholder } from "./Icons";
import StatusBadge from "./StatusBadge";

export default function CarCard({ car }: { car: Car }) {
  const off = discountPercent(car);
  const sold = car.status === "sold";
  return (
    <Link
      href={`/makinat/${car.id}`}
      className="group card flex flex-col overflow-hidden transition hover:border-brand/60"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        {car.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={car.images[0]}
            alt={carTitle(car)}
            loading="lazy"
            className={`h-full w-full object-cover transition duration-300 group-hover:scale-105 ${sold ? "grayscale" : ""}`}
          />
        ) : (
          <CarPlaceholder />
        )}
        <div className="absolute left-3 top-3 flex gap-1.5">
          {car.status !== "active" && <StatusBadge status={car.status} />}
          {off > 0 && !sold && (
            <span className="rounded-md bg-brand px-2 py-1 text-xs font-bold text-fg">-{off}%</span>
          )}
        </div>
        {car.images.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white">
            {car.images.length} foto
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-semibold leading-tight">
          {carTitle(car)}
          {car.version && <span className="font-normal text-muted"> {car.version}</span>}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {[car.year, formatKm(car.mileage), car.fuel, car.transmission, car.drive].filter(Boolean).join(" · ")}
        </p>
        <div className="mt-auto flex items-end gap-2 pt-3">
          <span className="text-xl font-semibold text-accent">{formatPrice(car.price)}</span>
          {off > 0 && (
            <span className="pb-0.5 text-sm text-muted line-through">{formatPrice(car.old_price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
