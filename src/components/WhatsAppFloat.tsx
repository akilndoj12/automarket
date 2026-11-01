import { whatsappLink } from "@/lib/format";
import { WhatsAppIcon } from "./Icons";

export default function WhatsAppFloat({ number }: { number: string | null }) {
  const href = whatsappLink(number, "Përshëndetje! Dua informacion për makinat që keni në shitje.");
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Na shkruani në WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-105"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
