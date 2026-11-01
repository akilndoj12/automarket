import { cache } from "react";
import { DEFAULT_SETTINGS, DEMO_CARS } from "./demo";
import { isSupabaseConfigured } from "./supabase/config";
import { createPublicClient } from "./supabase/server";
import type { Car, CarFilters, Settings } from "./types";

export const PAGE_SIZE = 24;

export const getSettings = cache(async (): Promise<Settings> => {
  if (!isSupabaseConfigured) return DEFAULT_SETTINGS;
  const { data, error } = await createPublicClient()
    .from("settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...(data as Partial<Settings>) } as Settings;
});

/** Lista e makinave për faqen publike (aktive + të rezervuara) */
export async function getCars(
  filters: CarFilters,
): Promise<{ cars: Car[]; total: number }> {
  const page = Math.max(1, filters.page ?? 1);

  if (!isSupabaseConfigured) {
    const list = sortCars(
      DEMO_CARS.filter((c) => c.status !== "sold").filter((c) => matches(c, filters)),
      filters.sort,
    );
    return {
      cars: list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
      total: list.length,
    };
  }

  let q = createPublicClient()
    .from("cars")
    .select("*", { count: "exact" })
    .eq("published", true)
    .in("status", ["active", "reserved"]);

  if (filters.brand) q = q.eq("brand", filters.brand);
  if (filters.model) q = q.ilike("model", `%${escapeLike(filters.model)}%`);
  if (filters.fuel) q = q.eq("fuel", filters.fuel);
  if (filters.transmission) q = q.eq("transmission", filters.transmission);
  if (filters.body) q = q.eq("body_type", filters.body);
  if (filters.yearMin) q = q.gte("year", filters.yearMin);
  if (filters.yearMax) q = q.lte("year", filters.yearMax);
  if (filters.priceMin) q = q.gte("price", filters.priceMin);
  if (filters.priceMax) q = q.lte("price", filters.priceMax);
  if (filters.kmMax) q = q.lte("mileage", filters.kmMax);
  if (filters.offer) q = q.eq("on_offer", true);

  const sorted = (() => {
    switch (filters.sort) {
      case "price_asc":
        return q.order("price", { ascending: true });
      case "price_desc":
        return q.order("price", { ascending: false });
      case "year_desc":
        return q.order("year", { ascending: false });
      case "km_asc":
        return q.order("mileage", { ascending: true, nullsFirst: false });
      default:
        return q.order("featured", { ascending: false }).order("created_at", { ascending: false });
    }
  })();

  const from = (page - 1) * PAGE_SIZE;
  const { data, count, error } = await sorted.range(from, from + PAGE_SIZE - 1);
  if (error) {
    console.error("getCars:", error.message);
    return { cars: [], total: 0 };
  }
  const cars = (data ?? []) as Car[];
  return { cars, total: count ?? cars.length };
}

export async function getLatestCars(limit = 8): Promise<Car[]> {
  const { cars } = await getCars({ sort: "newest" });
  return cars.slice(0, limit);
}

export async function getOfferCars(): Promise<Car[]> {
  const { cars } = await getCars({ offer: true, sort: "newest" });
  return cars;
}

export async function getSoldCars(): Promise<Car[]> {
  if (!isSupabaseConfigured) return DEMO_CARS.filter((c) => c.status === "sold");
  const { data } = await createPublicClient()
    .from("cars")
    .select("*")
    .eq("published", true)
    .eq("status", "sold")
    .order("sold_at", { ascending: false, nullsFirst: false })
    .limit(60);
  return (data ?? []) as Car[];
}

export const getCar = cache(async (id: string): Promise<Car | null> => {
  if (!isSupabaseConfigured) return DEMO_CARS.find((c) => c.id === id) ?? null;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data } = await createPublicClient()
    .from("cars")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();
  return (data as Car) ?? null;
});

export async function getSimilarCars(car: Car, limit = 4): Promise<Car[]> {
  const { cars } = await getCars({ brand: car.brand });
  let list = cars.filter((c) => c.id !== car.id);
  if (list.length < limit) {
    const { cars: more } = await getCars({ body: car.body_type ?? undefined });
    for (const c of more) if (c.id !== car.id && !list.some((x) => x.id === c.id)) list.push(c);
  }
  list = list.slice(0, limit);
  return list;
}

/** Markat dhe modelet që ekzistojnë realisht (për filtrat) */
export async function getBrands(): Promise<string[]> {
  if (!isSupabaseConfigured) {
    return [...new Set(DEMO_CARS.map((c) => c.brand))].sort();
  }
  const { data } = await createPublicClient()
    .from("cars")
    .select("brand")
    .eq("published", true)
    .neq("status", "sold")
    .limit(2000);
  return [...new Set((data ?? []).map((r: { brand: string }) => r.brand))].sort((a, b) =>
    a.localeCompare(b),
  );
}

// ---------- ndihmëse ----------
function escapeLike(s: string) {
  return s.replace(/[%_\\]/g, (m) => "\\" + m);
}

function matches(c: Car, f: CarFilters) {
  if (f.brand && c.brand !== f.brand) return false;
  if (f.model && !c.model.toLowerCase().includes(f.model.toLowerCase())) return false;
  if (f.fuel && c.fuel !== f.fuel) return false;
  if (f.transmission && c.transmission !== f.transmission) return false;
  if (f.body && c.body_type !== f.body) return false;
  if (f.yearMin && c.year < f.yearMin) return false;
  if (f.yearMax && c.year > f.yearMax) return false;
  if (f.priceMin && c.price < f.priceMin) return false;
  if (f.priceMax && c.price > f.priceMax) return false;
  if (f.kmMax && (c.mileage ?? 0) > f.kmMax) return false;
  if (f.offer && !(c.old_price && c.old_price > c.price)) return false;
  return true;
}

function sortCars(list: Car[], sort?: string) {
  const l = [...list];
  switch (sort) {
    case "price_asc":
      return l.sort((a, b) => a.price - b.price);
    case "price_desc":
      return l.sort((a, b) => b.price - a.price);
    case "year_desc":
      return l.sort((a, b) => b.year - a.year);
    case "km_asc":
      return l.sort((a, b) => (a.mileage ?? 1e9) - (b.mileage ?? 1e9));
    default:
      return l.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          b.created_at.localeCompare(a.created_at),
      );
  }
}

/** Kthen searchParams (string | string[]) në filtra */
export function parseFilters(sp: Record<string, string | string[] | undefined>): CarFilters {
  const s = (k: string) => {
    const v = sp[k];
    const val = Array.isArray(v) ? v[0] : v;
    return val && val.trim() ? val.trim() : undefined;
  };
  const n = (k: string) => {
    const v = s(k);
    const num = v ? parseInt(v.replace(/\D/g, ""), 10) : NaN;
    return Number.isFinite(num) && num > 0 ? num : undefined;
  };
  return {
    brand: s("marka"),
    model: s("modeli"),
    fuel: s("karburanti"),
    transmission: s("kambio"),
    body: s("tipi"),
    yearMin: n("vitiMin"),
    yearMax: n("vitiMax"),
    priceMin: n("cmimiMin"),
    priceMax: n("cmimiMax"),
    kmMax: n("kmMax"),
    offer: s("oferta") === "1" || undefined,
    sort: s("rendit"),
    page: n("faqja"),
  };
}
