export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
// Pranon emrin e vjetër (anon key) dhe të riun (publishable key) që vendos integrimi i Vercel
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

/** false = Supabase nuk është lidhur ende → faqja shfaq makina demo */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const IMAGES_BUCKET = "car-images";
