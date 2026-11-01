import Link from "next/link";
import { BODY_TYPES, FUELS, SORTS, TRANSMISSIONS } from "@/lib/options";
import type { CarFilters } from "@/lib/types";

const thisYear = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => thisYear - i);

/** Paneli i filtrave — formular GET, funksionon edhe pa JavaScript */
export default function Filters({ brands, f, idp = "f" }: { brands: string[]; f: CarFilters; idp?: string }) {
  return (
    <form action="/makinat" className="card space-y-4 p-4">
      <div>
        <label className="label" htmlFor={`${idp}-marka`}>Marka</label>
        <select id={`${idp}-marka`} name="marka" className="input" defaultValue={f.brand ?? ""}>
          <option value="">Të gjitha</option>
          {brands.map((b) => <option key={b}>{b}</option>)}
        </select>
      </div>
      <div>
        <label className="label" htmlFor={`${idp}-modeli`}>Modeli</label>
        <input id={`${idp}-modeli`} name="modeli" className="input" defaultValue={f.model ?? ""} placeholder="p.sh. Golf" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="label" htmlFor={`${idp}-vmin`}>Viti nga</label>
          <select id={`${idp}-vmin`} name="vitiMin" className="input" defaultValue={f.yearMin ?? ""}>
            <option value="">—</option>
            {YEARS.map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor={`${idp}-vmax`}>deri</label>
          <select id={`${idp}-vmax`} name="vitiMax" className="input" defaultValue={f.yearMax ?? ""}>
            <option value="">—</option>
            {YEARS.map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="label" htmlFor={`${idp}-cmin`}>Çmimi nga €</label>
          <input id={`${idp}-cmin`} name="cmimiMin" inputMode="numeric" className="input" defaultValue={f.priceMin ?? ""} />
        </div>
        <div>
          <label className="label" htmlFor={`${idp}-cmax`}>deri €</label>
          <input id={`${idp}-cmax`} name="cmimiMax" inputMode="numeric" className="input" defaultValue={f.priceMax ?? ""} />
        </div>
      </div>
      <div>
        <label className="label" htmlFor={`${idp}-km`}>Kilometrat deri</label>
        <input id={`${idp}-km`} name="kmMax" inputMode="numeric" className="input" defaultValue={f.kmMax ?? ""} placeholder="p.sh. 150000" />
      </div>
      <div>
        <label className="label" htmlFor={`${idp}-karb`}>Karburanti</label>
        <select id={`${idp}-karb`} name="karburanti" className="input" defaultValue={f.fuel ?? ""}>
          <option value="">Të gjitha</option>
          {FUELS.map((x) => <option key={x}>{x}</option>)}
        </select>
      </div>
      <div>
        <label className="label" htmlFor={`${idp}-kambio`}>Kambio</label>
        <select id={`${idp}-kambio`} name="kambio" className="input" defaultValue={f.transmission ?? ""}>
          <option value="">Të gjitha</option>
          {TRANSMISSIONS.map((x) => <option key={x}>{x}</option>)}
        </select>
      </div>
      <div>
        <label className="label" htmlFor={`${idp}-tipi`}>Tipi</label>
        <select id={`${idp}-tipi`} name="tipi" className="input" defaultValue={f.body ?? ""}>
          <option value="">Të gjitha</option>
          {BODY_TYPES.map((x) => <option key={x}>{x}</option>)}
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="oferta" value="1" defaultChecked={!!f.offer} className="h-4 w-4 accent-brand" />
        Vetëm makinat në ofertë
      </label>
      <div>
        <label className="label" htmlFor={`${idp}-rendit`}>Rendit sipas</label>
        <select id={`${idp}-rendit`} name="rendit" className="input" defaultValue={f.sort ?? "newest"}>
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>
      <div className="flex gap-2 pt-1">
        <button className="btn-primary flex-1">Apliko</button>
        <Link href="/makinat" className="btn-outline">Pastro</Link>
      </div>
    </form>
  );
}
