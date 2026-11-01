"use server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/server";

export type InquiryState = { ok: boolean; message: string } | null;

export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  // fushë e fshehur kundër robotëve (spam)
  if (String(formData.get("website") ?? "")) return { ok: true, message: "Faleminderit!" };

  const name = String(formData.get("name") ?? "").trim().slice(0, 120);
  const phone = String(formData.get("phone") ?? "").trim().slice(0, 40) || null;
  const email = String(formData.get("email") ?? "").trim().slice(0, 200) || null;
  const message = String(formData.get("message") ?? "").trim().slice(0, 3000) || null;
  const carIdRaw = String(formData.get("car_id") ?? "");
  const car_id = /^[0-9a-f-]{36}$/i.test(carIdRaw) ? carIdRaw : null;

  if (!name) return { ok: false, message: "Ju lutem shkruani emrin." };
  if (!phone && !email) return { ok: false, message: "Lini të paktën një numër telefoni ose email." };

  if (!isSupabaseConfigured) {
    return { ok: true, message: "Faleminderit! (Demo: kërkesa nuk u ruajt sepse databaza nuk është lidhur ende.)" };
  }

  const { error } = await createPublicClient().from("inquiries").insert({ name, phone, email, message, car_id });
  if (error) {
    console.error("submitInquiry:", error.message);
    return { ok: false, message: "Ndodhi një gabim. Ju lutem na telefononi ose na shkruani në WhatsApp." };
  }
  return { ok: true, message: "Faleminderit! Do t'ju kontaktojmë së shpejti." };
}
