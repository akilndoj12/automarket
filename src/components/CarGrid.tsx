import type { Car } from "@/lib/types";
import CarCard from "./CarCard";

export default function CarGrid({
  cars,
  empty = "Nuk u gjet asnjë makinë.",
  narrow = false,
}: {
  cars: Car[];
  empty?: string;
  narrow?: boolean;
}) {
  if (cars.length === 0) {
    return <div className="card p-10 text-center text-muted">{empty}</div>;
  }
  return (
    <div className={`grid gap-5 sm:grid-cols-2 ${narrow ? "xl:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-4"}`}>
      {cars.map((c) => (
        <CarCard key={c.id} car={c} />
      ))}
    </div>
  );
}
