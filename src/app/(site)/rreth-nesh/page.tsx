import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Rreth nesh" };

export default async function AboutPage() {
  const s = await getSettings();
  return (
    <div className="container-x max-w-3xl py-12">
      <h1 className="text-3xl font-light uppercase tracking-wide">Rreth nesh</h1>
      <div className="card mt-6 p-8">
        <p className="whitespace-pre-line leading-relaxed text-muted">{s.about}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/makinat" className="btn-primary">Shiko makinat</Link>
          <Link href="/kontakt" className="btn-outline">Na kontaktoni</Link>
        </div>
      </div>
    </div>
  );
}
