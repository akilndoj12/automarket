const thisYear = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => thisYear - i);
const PRICES = [5000, 10000, 15000, 20000, 25000, 30000, 40000, 50000, 75000];

/** Kërkimi i shpejtë në kryefaqe — dërgon te /makinat me filtrat */
export default function SearchBox({ brands }: { brands: string[] }) {
  return (
    <form action="/makinat" className="card grid gap-3 p-4 shadow-xl sm:grid-cols-2 lg:grid-cols-5 lg:p-5">
      <div>
        <label className="label" htmlFor="sb-marka">Marka</label>
        <select id="sb-marka" name="marka" className="input" defaultValue="">
          <option value="">Të gjitha</option>
          {brands.map((b) => <option key={b}>{b}</option>)}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="sb-modeli">Modeli</label>
        <input id="sb-modeli" name="modeli" className="input" placeholder="p.sh. Tiguan" />
      </div>
      <div>
        <label className="label" htmlFor="sb-viti">Viti nga</label>
        <select id="sb-viti" name="vitiMin" className="input" defaultValue="">
          <option value="">Çdo vit</option>
          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="sb-cmimi">Çmimi deri</label>
        <select id="sb-cmimi" name="cmimiMax" className="input" defaultValue="">
          <option value="">Pa limit</option>
          {PRICES.map((p) => <option key={p} value={p}>{p.toLocaleString("de-DE")} €</option>)}
        </select>
      </div>
      <div className="flex items-end">
        <button className="btn-primary w-full py-2.5">Kërko makina</button>
      </div>
    </form>
  );
}
