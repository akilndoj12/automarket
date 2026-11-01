import Link from "next/link";
import CarForm from "../CarForm";

export default function NewCarPage() {
  return (
    <div>
      <Link href="/admin/makinat" className="text-sm text-slate-500 hover:text-ink">← Makinat</Link>
      <h1 className="mb-6 mt-1 text-2xl font-extrabold">Shto automjet të ri</h1>
      <CarForm />
    </div>
  );
}
