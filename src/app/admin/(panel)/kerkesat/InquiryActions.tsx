"use client";

import { useTransition } from "react";
import { deleteInquiry, setInquiryHandled } from "../../actions";

export default function InquiryActions({ id, handled }: { id: string; handled: boolean }) {
  const [pending, start] = useTransition();
  return (
    <div className={`flex gap-2 ${pending ? "opacity-50" : ""}`}>
      <button disabled={pending} onClick={() => start(() => setInquiryHandled(id, !handled))} className="btn-outline py-1.5">
        {handled ? "Shëno si të re" : "✓ E trajtuar"}
      </button>
      <button
        disabled={pending}
        onClick={() => {
          if (window.confirm("Ta fshij këtë kërkesë?")) start(() => deleteInquiry(id));
        }}
        className="btn border border-red-200 bg-white py-1.5 text-red-600 hover:bg-red-50"
      >
        Fshi
      </button>
    </div>
  );
}
