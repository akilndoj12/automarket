import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: { default: `${s.site_name} — Makina në shitje`, template: `%s | ${s.site_name}` },
    description: s.tagline ?? "Makina në shitje me çmime të qarta.",
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
