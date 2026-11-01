import type { Metadata } from "next";
import CarGrid from "@/components/CarGrid";
import { getOfferCars } from "@/lib/data";

export const metadata: Metadata = { title: "Makinat në ofertë" };

export default async function OffersPage() {
  const cars = await getOfferCars();
  return (
    <div className="container-x py-10">
      <h1 className="text-3xl font-light uppercase tracking-wide">Makinat në ofertë</h1>
      <p className="mb-6 mt-1 text-sm text-muted">Automjete me çmim të ulur për një kohë të kufizuar.</p>
      <CarGrid cars={cars} empty="Për momentin nuk ka oferta. Kthehuni së shpejti!" />
    </div>
  );
}
