"use client";

import { useTransition } from "react";
import { deleteCar } from "../../../actions";

export default function DeleteCarButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm("Ta fshij përgjithmonë këtë makinë dhe fotot e saj?\n\nNëse thjesht është shitur, më mirë ndrysho statusin në “Shitur”.")) {
          start(() => deleteCar(id));
        }
      }}
      className="btn border border-red-200 bg-white text-red-600 hover:bg-red-50"
    >
      {pending ? "Duke fshirë…" : "Fshi"}
    </button>
  );
}
