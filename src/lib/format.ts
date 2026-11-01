import type { Car } from "./types";

export function formatPrice(value: number | null | undefined) {
  if (value == null) return "";
  return value.toLocaleString("de-DE") + " €";
}

export function formatKm(value: number | null | undefined) {
  if (value == null) return "";
  return value.toLocaleString("de-DE") + " km";
}

export function carTitle(car: Pick<Car, "brand" | "model">) {
  return `${car.brand} ${car.model}`;
}

export function discountPercent(car: Pick<Car, "price" | "old_price">) {
  if (!car.old_price || car.old_price <= car.price) return 0;
  return Math.round(((car.old_price - car.price) / car.old_price) * 100);
}

export function whatsappLink(number: string | null | undefined, text: string) {
  const digits = (number ?? "").replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function telLink(number: string | null | undefined) {
  if (!number) return null;
  return `tel:${number.replace(/[^\d+]/g, "")}`;
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("sq-AL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
