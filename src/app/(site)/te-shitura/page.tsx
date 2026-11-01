import type { Metadata } from "next";
import CarGrid from "@/components/CarGrid";
import { getSoldCars } from "@/lib/data";

export const metadata: Metadata = { title: "Makinat e shitura" };

export default async function SoldPage() {
  const cars = await getSoldCars();
  return (
    <div className="container-x py-10">
      <h1 className="text-3xl font-light uppercase tracking-wide">Makinat e shitura</h1>
      <p className="mb-6 mt-1 text-sm text-muted">Disa nga makinat që kanë gjetur pronarin e ri.</p>
      <CarGrid cars={cars} empty="Ende nuk ka makina të shitura për t'u shfaqur." />
    </div>
  );
}
