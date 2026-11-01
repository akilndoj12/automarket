"use client";

import { useEffect, useState } from "react";
import { CarPlaceholder } from "./Icons";

export default function Gallery({ images, title, dim }: { images: string[]; title: string; dim?: boolean }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState(false);
  const n = images.length;
  const prev = () => setI((x) => (x - 1 + n) % n);
  const next = () => setI((x) => (x + 1) % n);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(false);
      if (e.key === "ArrowLeft") setI((x) => (x - 1 + n) % n);
      if (e.key === "ArrowRight") setI((x) => (x + 1) % n);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom, n]);

  if (n === 0) {
    return (
      <div className="aspect-[4/3] overflow-hidden rounded-xl">
        <CarPlaceholder />
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[i]}
          alt={`${title} — foto ${i + 1}`}
          onClick={() => setZoom(true)}
          className={`h-full w-full cursor-zoom-in object-contain ${dim ? "grayscale" : ""}`}
        />
        {n > 1 && (
          <>
            <button onClick={prev} aria-label="Foto e mëparshme" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white">‹</button>
            <button onClick={next} aria-label="Foto tjetër" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white">›</button>
            <span className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white">
              {i + 1} / {n}
            </span>
          </>
        )}
      </div>
      {n > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, idx) => (
            <button
              key={src + idx}
              onClick={() => setI(idx)}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${idx === i ? "border-brand" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
      {zoom && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95" onClick={() => setZoom(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[i]} alt={title} className="max-h-[92vh] max-w-[95vw] object-contain" />
          {n > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-5xl text-white/80 hover:text-white" aria-label="Foto e mëparshme">‹</button>
              <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl text-white/80 hover:text-white" aria-label="Foto tjetër">›</button>
            </>
          )}
          <button className="absolute right-5 top-4 text-3xl text-white/80 hover:text-white" aria-label="Mbyll">×</button>
        </div>
      )}
    </div>
  );
}
