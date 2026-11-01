import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

/**
 * Kontrollon që përdoruesi është i identifikuar DHE është në tabelën "admins".
 * Përdoret në çdo faqe dhe veprim të panelit — siguria nuk mbështetet vetëm te middleware.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  return { supabase, user, isAdmin: isAdmin === true };
}
