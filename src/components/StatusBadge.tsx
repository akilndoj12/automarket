import { STATUS_LABEL } from "@/lib/options";

const STYLE: Record<string, string> = {
  active: "bg-emerald-600 text-white",
  reserved: "bg-amber-500 text-white",
  sold: "bg-slate-800 text-white",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-md px-2 py-1 text-xs font-bold ${STYLE[status] ?? "bg-slate-200"}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}
