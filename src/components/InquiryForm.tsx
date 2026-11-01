"use client";

import { useActionState } from "react";
import { submitInquiry, type InquiryState } from "@/app/(site)/actions";

export default function InquiryForm({ carId, defaultMessage = "" }: { carId?: string; defaultMessage?: string }) {
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitInquiry, null);

  if (state?.ok) {
    return <div className="rounded-lg bg-emerald-50 p-4 text-sm font-medium text-emerald-800">{state.message}</div>;
  }

  return (
    <form action={action} className="space-y-3">
      {carId && <input type="hidden" name="car_id" value={carId} />}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div>
        <label className="label" htmlFor="iq-name">Emri</label>
        <input id="iq-name" name="name" required className="input" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="iq-phone">Telefoni</label>
          <input id="iq-phone" name="phone" type="tel" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="iq-email">Email</label>
          <input id="iq-email" name="email" type="email" className="input" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="iq-msg">Mesazhi</label>
        <textarea id="iq-msg" name="message" rows={4} className="input" defaultValue={defaultMessage} />
      </div>
      {state && !state.ok && <p className="text-sm font-medium text-red-600">{state.message}</p>}
      <button disabled={pending} className="btn-dark w-full">
        {pending ? "Duke dërguar…" : "Dërgo kërkesën"}
      </button>
    </form>
  );
}
