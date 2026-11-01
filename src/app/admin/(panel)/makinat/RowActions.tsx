"use client";

import Link from "next/link";
import { useTransition } from "react";
import { setCarStatus, togglePublished } from "../../actions";
import type { CarStatus } from "@/lib/types";

export default function RowActions({ id, status, published }: { id: string; status: CarStatus; published: boolean }) {
  const [pending, start] = useTransition();
  return (
    <div className={`flex flex-wrap items-center gap-2 ${pending ? "opacity-50" : ""}`}>
      <select
        aria-label="Statusi"
        value={status}
        disabled={pending}
        onChange={(e) => start(() => setCarStatus(id, e.target.value as CarStatus))}
        className="input w-auto py-1.5"
      >
        <option value="active">Aktive</option>
        <option value="reserved">Rezervuar</option>
        <option value="sold">Shitur</option>
      </select>
      <button
        disabled={pending}
        onClick={() => start(() => togglePublished(id, !published))}
        className="btn-outline py-1.5"
      >
        {published ? "Fshih" : "Publiko"}
      </button>
      <Link href={`/admin/makinat/${id}`} className="btn-dark py-1.5">Ndrysho</Link>
    </div>
  );
}
