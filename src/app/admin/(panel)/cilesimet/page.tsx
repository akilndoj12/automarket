import { requireAdmin } from "@/lib/auth";
import { DEFAULT_SETTINGS } from "@/lib/demo";
import type { Settings } from "@/lib/types";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("settings").select("*").eq("id", 1).maybeSingle();
  const s = { ...DEFAULT_SETTINGS, ...((data ?? {}) as Partial<Settings>) } as Settings;
  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-extrabold">Cilësimet e faqes</h1>
      <SettingsForm s={s} />
    </div>
  );
}
