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
  { ...base, id: "demo-1", brand: "Land Rover", model: "Defender", version: "110 D300 X-Dynamic", year: 2022, price: 89500, old_price: null, fuel: "Naftë", transmission: "Automatike", mileage: 38000, engine_cc: 2997, power_hp: 300, drive: "4WD", body_type: "SUV", color: "E zezë", status: "active", featured: true, created_at: "2026-10-20T10:00:00Z" },
  { ...base, id: "demo-2", brand: "Mercedes-Benz", model: "G-Class", version: "G 400 d AMG Line", year: 2021, price: 132000, old_price: 139000, fuel: "Naftë", transmission: "Automatike", mileage: 52000, engine_cc: 2925, power_hp: 330, drive: "4WD", body_type: "SUV", color: "Gri", status: "active", featured: true, created_at: "2026-10-19T10:00:00Z" },
  { ...base, id: "demo-3", brand: "Land Rover", model: "Range Rover Sport", version: "D350 Dynamic SE", year: 2023, price: 104900, old_price: null, fuel: "Naftë", transmission: "Automatike", mileage: 21000, engine_cc: 2997, power_hp: 350, drive: "4WD", body_type: "SUV", color: "E bardhë", status: "reserved", created_at: "2026-10-18T10:00:00Z" },
  { ...base, id: "demo-4", brand: "Porsche", model: "Cayenne", version: "E-Hybrid", year: 2020, price: 68500, old_price: 72900, fuel: "Hibrid", transmission: "Automatike", mileage: 64000, engine_cc: 2995, power_hp: 462, drive: "AWD", body_type: "SUV", color: "Blu", status: "active", created_at: "2026-10-17T10:00:00Z" },
  { ...base, id: "demo-5", brand: "BMW", model: "X7", version: "xDrive40d M Sport", year: 2022, price: 84900, old_price: null, fuel: "Naftë", transmission: "Automatike", mileage: 45000, engine_cc: 2993, power_hp: 340, drive: "AWD", body_type: "SUV", color: "E zezë", seats: 7, status: "active", created_at: "2026-10-16T10:00:00Z" },
  { ...base, id: "demo-6", brand: "Audi", model: "RS6", version: "Avant performance", year: 2021, price: 98000, old_price: null, fuel: "Benzinë", transmission: "Automatike", mileage: 33000, engine_cc: 3996, power_hp: 600, drive: "AWD", body_type: "Station Wagon", color: "Gri", status: "sold", sold_at: "2026-10-10T10:00:00Z", created_at: "2026-09-30T10:00:00Z" },
];

export const DEFAULT_SETTINGS: Settings = {
  site_name: "PRESTIGE MOTORS",
  tagline: "European Brands | Global Luxury — Koleksion ekskluziv i automjeteve premium.",
  phone: "+355 69 444 8881",
  whatsapp: "355694448881",
  email: null,
  address: "Tiranë, Shqipëri",
  hours: "E hënë – E shtunë, 09:00 – 19:00",
  about:
    "Prestige Motors Albania sjell në Tiranë një koleksion ekskluziv automjetesh premium nga markat më të njohura europiane. Çdo automjet përzgjidhet dhe kontrollohet me kujdes para se të ofrohet.",
  logo_url: null,
  facebook: null,
  instagram: "https://instagram.com/prestige.motors.al",
  map_url: null,
};
