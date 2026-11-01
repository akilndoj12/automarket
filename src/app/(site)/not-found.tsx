import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <p className="text-6xl font-black text-brand">404</p>
      <h1 className="mt-4 text-2xl font-bold">Faqja nuk u gjet</h1>
      <p className="mt-2 text-slate-500">Makina mund të jetë hequr nga publikimi.</p>
      <Link href="/makinat" className="btn-primary mt-6">Shiko makinat</Link>
    </div>
  );
}
