import Link from "next/link";

export default function Pagination({
  page,
  totalPages,
  params,
}: {
  page: number;
  totalPages: number;
  params: Record<string, string | string[] | undefined>;
}) {
  if (totalPages <= 1) return null;
  const href = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      const val = Array.isArray(v) ? v[0] : v;
      if (val && k !== "faqja") sp.set(k, val);
    }
    if (p > 1) sp.set("faqja", String(p));
    const qs = sp.toString();
    return qs ? `/makinat?${qs}` : "/makinat";
  };
  return (
    <nav className="mt-8 flex flex-wrap justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={href(p)}
          className={`min-w-10 rounded-lg border px-3 py-2 text-center text-sm font-semibold ${
            p === page ? "border-ink bg-ink text-white" : "border-slate-300 bg-white hover:border-slate-400"
          }`}
        >
          {p}
        </Link>
      ))}
    </nav>
  );
}
