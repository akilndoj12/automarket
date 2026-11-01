export type CarStatus = "active" | "reserved" | "sold";

export interface Car {
  id: string;
  brand: string;
  model: string;
  version: string | null;
  year: number;
  price: number;
  old_price: number | null;
  on_offer?: boolean;
  fuel: string;
  transmission: string;
  mileage: number | null;
  engine_cc: number | null;
  power_hp: number | null;
  drive: string | null;
  body_type: string | null;
  color: string | null;
  doors: number | null;
  seats: number | null;
  condition: string | null;
  location: string | null;
  vin: string | null;
  features: string[];
  description: string | null;
  images: string[];
  video_url: string | null;
  status: CarStatus;
  featured: boolean;
  published: boolean;
  sold_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  site_name: string;
  tagline: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  hours: string | null;
  about: string | null;
  logo_url: string | null;
  facebook: string | null;
  instagram: string | null;
  map_url: string | null;
}

export interface Inquiry {
  id: string;
  car_id: string | null;
  name: string;
  phone: string | null;
  email: string | null;
  message: string | null;
  handled: boolean;
  created_at: string;
  cars?: { brand: string; model: string; year: number } | null;
}

export interface CarFilters {
  brand?: string;
  model?: string;
  fuel?: string;
  transmission?: string;
  body?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  kmMax?: number;
  offer?: boolean;
  sort?: string;
  page?: number;
}
