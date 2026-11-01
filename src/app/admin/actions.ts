"use server";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { IMAGES_BUCKET } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type FormState = { ok: boolean; message: string } | null;

/** Kthen klientin e adminit, ose mesazhin e gabimit */
async function adminOrError() {
  try {
    return { supabase: await adminOrThrow(), error: null };
  } catch (e) {
    unstable_rethrow(e); // lejo ridrejtimin te /admin/login
    return { supabase: null, error: (e as Error).message };
  }
}

async function adminOrThrow() {
  const ctx = await requireAdmin();
  if (!ctx.isAdmin) throw new Error("Nuk keni të drejta administratori.");
  return ctx.supabase;
}

const str = (fd: FormData, k: string) => {
  const v = String(fd.get(k) ?? "").trim();
  return v === "" ? null : v;
};
const int = (fd: FormData, k: string) => {
  const v = str(fd, k);
  if (v === null) return null;
  const n = parseInt(v.replace(/[^\d-]/g, ""), 10);
  return Number.isFinite(n) ? n : null;
};

/** Nga URL-ja publike e fotos → shtegu brenda bucket-it */
function storagePath(url: string) {
  const marker = `/storage/v1/object/public/${IMAGES_BUCKET}/`;
  const i = url.indexOf(marker);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length));
}

function revalidateAll() {
  revalidatePath("/", "layout");
}

// ---------- Makinat ----------
export async function saveCar(_prev: FormState, fd: FormData): Promise<FormState> {
  const { supabase, error: authError } = await adminOrError();
  if (!supabase) return { ok: false, message: authError ?? "Pa akses." };

  const id = str(fd, "id");
  const brand = str(fd, "brand");
  const model = str(fd, "model");
  const year = int(fd, "year");
  const price = int(fd, "price");
  if (!brand || !model || !year || price === null) {
    return { ok: false, message: "Plotësoni markën, modelin, vitin dhe çmimin." };
  }

  let images: string[] = [];
  try {
    images = JSON.parse(String(fd.get("images") ?? "[]"));
    if (!Array.isArray(images)) images = [];
  } catch {
    images = [];
  }

  const extra = (str(fd, "features_extra") ?? "")
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const features = [...new Set([...fd.getAll("features").map(String), ...extra])];

  const vin = str(fd, "vin");
  const showVin = fd.get("show_vin") === "on";
  const oldPrice = int(fd, "old_price");

  const row = {
    brand,
    model,
    version: str(fd, "version"),
    year,
    price,
    old_price: oldPrice && oldPrice > price ? oldPrice : null,
    fuel: str(fd, "fuel") ?? "Naftë",
    transmission: str(fd, "transmission") ?? "Manuale",
    mileage: int(fd, "mileage"),
    engine_cc: int(fd, "engine_cc"),
    power_hp: int(fd, "power_hp"),
    drive: str(fd, "drive"),
    body_type: str(fd, "body_type"),
    color: str(fd, "color"),
    doors: int(fd, "doors"),
    seats: int(fd, "seats"),
    condition: str(fd, "condition"),
    location: str(fd, "location"),
    vin: showVin ? vin : null,
    features,
    description: str(fd, "description"),
    images: images.filter((x) => typeof x === "string").slice(0, 40),
    video_url: str(fd, "video_url"),
    status: (["active", "reserved", "sold"].includes(String(fd.get("status"))) ? String(fd.get("status")) : "active") as
      | "active"
      | "reserved"
      | "sold",
    featured: fd.get("featured") === "on",
    published: fd.get("published") === "on",
  };

  let carId = id;
  if (id) {
    const { error } = await supabase.from("cars").update(row).eq("id", id);
    if (error) return { ok: false, message: "Gabim gjatë ruajtjes: " + error.message };
  } else {
    const { data, error } = await supabase.from("cars").insert(row).select("id").single();
    if (error || !data) return { ok: false, message: "Gabim gjatë ruajtjes: " + (error?.message ?? "") };
    carId = data.id as string;
  }

  // VIN-i i plotë + shënimet private
  await supabase
    .from("car_private")
    .upsert({ car_id: carId, vin, notes: str(fd, "notes") }, { onConflict: "car_id" });

  // Fshi nga storage fotot që admini hoqi
  try {
    const removed: string[] = JSON.parse(String(fd.get("removed_images") ?? "[]"));
    const paths = removed.filter((u) => !row.images.includes(u)).map(storagePath).filter((p): p is string => !!p);
    if (paths.length) await supabase.storage.from(IMAGES_BUCKET).remove(paths);
  } catch {
    /* nuk është kritike */
  }

  revalidateAll();
  redirect(`/admin/makinat?ruajtur=1`);
}

export async function deleteCar(id: string) {
  const supabase = await adminOrThrow();
  const { data } = await supabase.from("cars").select("images").eq("id", id).maybeSingle();
  const { error } = await supabase.from("cars").delete().eq("id", id);
  if (error) throw new Error(error.message);
  const paths = ((data?.images as string[] | undefined) ?? []).map(storagePath).filter((p): p is string => !!p);
  if (paths.length) await supabase.storage.from(IMAGES_BUCKET).remove(paths);
  revalidateAll();
  redirect("/admin/makinat?fshire=1");
}

export async function setCarStatus(id: string, status: "active" | "reserved" | "sold") {
  const supabase = await adminOrThrow();
  await supabase.from("cars").update({ status }).eq("id", id);
  revalidateAll();
}

export async function togglePublished(id: string, published: boolean) {
  const supabase = await adminOrThrow();
  await supabase.from("cars").update({ published }).eq("id", id);
  revalidateAll();
}

// ---------- Kërkesat ----------
export async function setInquiryHandled(id: string, handled: boolean) {
  const supabase = await adminOrThrow();
  await supabase.from("inquiries").update({ handled }).eq("id", id);
  revalidatePath("/admin", "layout");
}

export async function deleteInquiry(id: string) {
  const supabase = await adminOrThrow();
  await supabase.from("inquiries").delete().eq("id", id);
  revalidatePath("/admin", "layout");
}

// ---------- Cilësimet ----------
export async function saveSettings(_prev: FormState, fd: FormData): Promise<FormState> {
  const { supabase, error: authError } = await adminOrError();
  if (!supabase) return { ok: false, message: authError ?? "Pa akses." };
  const fields = [
    "site_name",
    "tagline",
    "phone",
    "whatsapp",
    "email",
    "address",
    "hours",
    "about",
    "logo_url",
    "facebook",
    "instagram",
    "map_url",
  ] as const;
  const row: Record<string, string | null> = {};
  for (const f of fields) row[f] = str(fd, f);
  if (!row.site_name) return { ok: false, message: "Emri i faqes është i detyrueshëm." };
  if (row.whatsapp) row.whatsapp = row.whatsapp.replace(/\D/g, "");

  const { error } = await supabase
    .from("settings")
    .update({ ...row, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) return { ok: false, message: "Gabim: " + error.message };
  revalidateAll();
  return { ok: true, message: "Cilësimet u ruajtën." };
}

// ---------- Dalja ----------
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
