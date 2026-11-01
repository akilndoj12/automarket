import type { Metadata } from "next";
import CarGrid from "@/components/CarGrid";
import Filters from "@/components/Filters";
import Pagination from "@/components/Pagination";
import { PAGE_SIZE, getBrands, getCars, parseFilters } from "@/lib/data";

export const metadata: Metadata = { title: "Të gjitha makinat" };

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function CarsPage({ searchParams }: { searchParams: SP }) {
  const params = await searchParams;
  const f = parseFilters(params);
  const [{ cars, total }, brands] = await Promise.all([getCars(f), getBrands()]);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="container-x py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-3xl font-extrabold">{f.offer ? "Makinat në ofertë" : "Të gjitha makinat"}</h1>
          <p className="mt-1 text-sm text-slate-500">{total} makina të gjetura</p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside>
          <details className="lg:hidden" open={false}>
            <summary className="btn-outline mb-3 w-full cursor-pointer list-none">Filtrat</summary>
            <Filters brands={brands} f={f} idp="fm" />
          </details>
          <div className="hidden lg:sticky lg:top-20 lg:block">
            <Filters brands={brands} f={f} />
          </div>
        </aside>
        <section>
          <CarGrid cars={cars} narrow empty="Nuk u gjet asnjë makinë me këto filtra. Provoni t'i ndryshoni." />
          <Pagination page={f.page ?? 1} totalPages={totalPages} params={params} />
        </section>
      </div>
    </div>
  );
}
