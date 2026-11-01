"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { IMAGES_BUCKET } from "@/lib/supabase/config";

/** Zvogëlon foton (max 1600px, JPEG) para ngarkimit — fotot e telefonit janë shumë të rënda */
async function compress(file: File, max = 1600, quality = 0.82): Promise<Blob> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", quality));
    return blob ?? file;
  } catch {
    return file;
  }
}

export default function ImageManager({
  folder,
  images,
  onChange,
  onRemove,
}: {
  folder: string;
  images: string[];
  onChange: (imgs: string[]) => void;
  onRemove: (url: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    const supabase = createClient();
    const list = Array.from(files);
    setUploading(list.length);
    const added: string[] = [];
    for (const file of list) {
      try {
        const blob = await compress(file);
        const ext = blob.type === "image/jpeg" ? "jpg" : (file.name.split(".").pop() ?? "jpg").toLowerCase();
        const path = `cars/${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage
          .from(IMAGES_BUCKET)
          .upload(path, blob, { contentType: blob.type || file.type, cacheControl: "31536000" });
        if (error) throw error;
        added.push(supabase.storage.from(IMAGES_BUCKET).getPublicUrl(path).data.publicUrl);
      } catch (e) {
        setError(`Fotoja "${file.name}" nuk u ngarkua: ${(e as Error).message}`);
      }
      setUploading((n) => n - 1);
    }
    onChange([...images, ...added]);
    if (input.current) input.current.value = "";
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    onChange(next);
  }

  function remove(i: number) {
    onRemove(images[i]);
    onChange(images.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((src, i) => (
          <div
            key={src}
            draggable
            onDragStart={() => setDragIdx(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragIdx !== null) move(dragIdx, i);
              setDragIdx(null);
            }}
            className="group relative aspect-[4/3] cursor-move overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
            {i === 0 && <span className="absolute left-2 top-2 rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">KRYESORE</span>}
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/60 p-1">
              <span className="flex gap-1">
                <button type="button" onClick={() => move(i, i - 1)} className="rounded px-2 text-white hover:bg-white/20" aria-label="Majtas">←</button>
                <button type="button" onClick={() => move(i, i + 1)} className="rounded px-2 text-white hover:bg-white/20" aria-label="Djathtas">→</button>
              </span>
              <span className="flex gap-1">
                {i !== 0 && (
                  <button type="button" onClick={() => move(i, 0)} className="rounded px-2 text-xs text-white hover:bg-white/20">Kryesore</button>
                )}
                <button type="button" onClick={() => remove(i)} className="rounded px-2 text-white hover:bg-red-600" aria-label="Fshi">✕</button>
              </span>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="flex aspect-[4/3] flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-sm font-semibold text-slate-500 hover:border-brand hover:text-brand"
        >
          <span className="text-3xl leading-none">+</span>
          {uploading > 0 ? `Duke ngarkuar (${uploading})…` : "Shto foto"}
        </button>
      </div>
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <p className="mt-2 text-xs text-slate-500">
        Fotoja e parë shfaqet si kryesore. Rendit me shigjeta ose duke i tërhequr. Fotot zvogëlohen automatikisht.
      </p>
    </div>
  );
}
