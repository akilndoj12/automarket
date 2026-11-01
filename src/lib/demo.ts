import type { Car, Settings } from "./types";

// Të dhëna shembull — shfaqen VETËM kur Supabase nuk është lidhur ende.
const base = {
  version: null,
  engine_cc: null,
  power_hp: null,
  drive: "2WD",
  color: null,
  doors: 5,
  seats: 5,
  condition: "Shumë e mirë",
  location: "Tiranë",
  vin: null,
  features: ["Kondicioner automatik", "Navigacion", "Kamera parkimi", "Bluetooth"],
  description:
    "Makinë shembull. Pasi të lidhësh Supabase dhe të shtosh makinat e tua nga paneli Admin, këto shembuj zhduken automatikisht.",
  images: [] as string[],
  video_url: null,
  featured: false,
  published: true,
  sold_at: null,
  updated_at: "2026-10-01T10:00:00Z",
};

export const DEMO_CARS: Car[] = [
  { ...base, id: "demo-1", brand: "Volkswagen", model: "Tiguan", year: 2018, price: 14500, old_price: null, fuel: "Naftë", transmission: "Automatike", mileage: 128000, engine_cc: 1968, power_hp: 150, body_type: "SUV", color: "Gri", status: "active", featured: true, created_at: "2026-10-20T10:00:00Z" },
  { ...base, id: "demo-2", brand: "Mercedes-Benz", model: "C-Class", version: "C220d", year: 2019, price: 19900, old_price: 21500, fuel: "Naftë", transmission: "Automatike", mileage: 96000, engine_cc: 1950, power_hp: 194, body_type: "Sedan", color: "E zezë", doors: 4, status: "active", featured: true, created_at: "2026-10-19T10:00:00Z" },
  { ...base, id: "demo-3", brand: "BMW", model: "X5", version: "xDrive30d", year: 2017, price: 27800, old_price: null, fuel: "Naftë", transmission: "Automatike", mileage: 142000, engine_cc: 2993, power_hp: 258, drive: "4WD", body_type: "SUV", color: "E bardhë", status: "reserved", created_at: "2026-10-18T10:00:00Z" },
  { ...base, id: "demo-4", brand: "Kia", model: "Sportage", year: 2020, price: 17200, old_price: 18400, fuel: "Benzinë", transmission: "Manuale", mileage: 61000, engine_cc: 1591, power_hp: 132, body_type: "SUV", color: "Blu", status: "active", created_at: "2026-10-17T10:00:00Z" },
  { ...base, id: "demo-5", brand: "Toyota", model: "Corolla", version: "Hybrid", year: 2021, price: 18600, old_price: null, fuel: "Hibrid", transmission: "Automatike", mileage: 48000, engine_cc: 1798, power_hp: 122, body_type: "Hatchback", color: "E bardhë", status: "active", created_at: "2026-10-16T10:00:00Z" },
  { ...base, id: "demo-6", brand: "Audi", model: "A4", version: "Avant 2.0 TDI", year: 2016, price: 13900, old_price: null, fuel: "Naftë", transmission: "Automatike", mileage: 175000, engine_cc: 1968, power_hp: 150, body_type: "Station Wagon", color: "Gri", status: "sold", sold_at: "2026-10-10T10:00:00Z", created_at: "2026-09-30T10:00:00Z" },
];

export const DEFAULT_SETTINGS: Settings = {
  site_name: "AUTO MARKET",
  tagline: "Makina të kontrolluara, me çmime të qarta",
  phone: "+355 69 000 0000",
  whatsapp: "355690000000",
  email: "info@automarket.al",
  address: "Tiranë, Shqipëri",
  hours: "E hënë – E shtunë, 09:00 – 19:00",
  about:
    "Jemi një kompani që importon dhe shet automjete të përzgjedhura. Çdo makinë kontrollohet para se të publikohet.",
  logo_url: null,
  facebook: null,
  instagram: null,
  map_url: null,
};
