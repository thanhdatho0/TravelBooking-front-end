import { useEffect, useMemo, useState } from "react";

export default function ImageCarousel({
  urls,
}: {
  urls: string[];
  intervalMs?: number; // giữ prop cho khỏi lỗi chỗ gọi, nhưng không dùng auto
}) {
  const images = useMemo(() => {
    const clean = (urls ?? []).filter(Boolean);
    return Array.from(new Set(clean));
  }, [urls]);

  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setIdx(0);
  }, [images.length]);

  // ESC để đóng modal + khóa scroll khi mở
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, images.length]);

  const prev = () => {
    if (images.length <= 1) return;
    setIdx((i) => (i - 1 + images.length) % images.length);
  };

  const next = () => {
    if (images.length <= 1) return;
    setIdx((i) => (i + 1) % images.length);
  };

  const active = images[idx] ?? null;

  const thumbs = useMemo(() => {
    if (images.length <= 1) return [];
    const out: string[] = [];
    for (let k = 1; k <= Math.min(4, images.length - 1); k++) {
      out.push(images[(idx + k) % images.length]);
    }
    return out;
  }, [images, idx]);

  if (!images.length) {
    return (
      <div className="rounded-2xl bg-slate-100 border border-slate-200 h-[260px] md:h-[360px] lg:h-[420px] flex items-center justify-center text-slate-400">
        No images
      </div>
    );
  }

  const ImageEl = ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className: string;
  }) => (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="eager"
      onClick={() => setOpen(true)}
      role="button"
    />
  );

  return (
    <>
      {/* ===== MAIN CAROUSEL ===== */}
      {images.length === 1 ? (
        <div className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 shadow-[0_6px_24px_rgba(15,23,42,0.08)]">
          <div className="h-[260px] md:h-[360px] lg:h-[420px] cursor-zoom-in">
            <ImageEl
              src={images[0]}
              alt="Accommodation"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden border border-slate-100 bg-white shadow-[0_6px_24px_rgba(15,23,42,0.08)]">
          <div className="grid grid-cols-12 gap-2 p-2 bg-white">
            {/* LEFT: main image */}
            <div className="col-span-12 md:col-span-8 relative overflow-hidden rounded-xl bg-slate-100 h-[260px] md:h-[360px] lg:h-[420px] cursor-zoom-in">
              {active ? (
                <ImageEl
                  src={active}
                  alt="Accommodation main"
                  className="w-full h-full object-cover"
                />
              ) : null}

              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-transparent" />

              {/* nav buttons: ONLY click arrow to change */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-slate-800 font-black transition"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-slate-800 font-black transition"
              >
                ›
              </button>
            </div>

            {/* RIGHT: thumbnails (click = open modal, NOT change) */}
            <div className="col-span-12 md:col-span-4 grid grid-rows-2 gap-2 h-[220px] md:h-[360px] lg:h-[420px]">
              <div className="grid grid-cols-2 gap-2">
                {thumbs.slice(0, 2).map((u) => (
                  <div
                    key={u}
                    className="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-100 hover:border-sky-200 transition cursor-zoom-in"
                    onClick={() => setOpen(true)}
                    role="button"
                  >
                    <img src={u} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {thumbs.slice(2, 4).map((u) => (
                  <div
                    key={u}
                    className="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-100 hover:border-sky-200 transition cursor-zoom-in"
                    onClick={() => setOpen(true)}
                    role="button"
                  >
                    <img src={u} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* thanh vị trí (không số trang) */}
          <div className="px-4 pb-3">
            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-sky-500 transition-all duration-300"
                style={{
                  width: `${Math.max(10, 100 / images.length)}%`,
                  transform: `translateX(${(100 / images.length) * idx}%)`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL PREVIEW (center image + blurred background) ===== */}
      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          {/* nền mờ */}
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />

          {/* content */}
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-2xl overflow-hidden bg-black shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
              <img
                src={active ?? ""}
                alt="Preview"
                className="w-full max-h-[80vh] object-contain bg-black"
              />

              {/* close */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-slate-800 font-black transition"
                aria-label="Close"
                title="Đóng (Esc)"
              >
                ✕
              </button>

              {/* modal arrows */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-slate-800 font-black transition"
                    aria-label="Previous image"
                    title="Trước (←)"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-slate-800 font-black transition"
                    aria-label="Next image"
                    title="Sau (→)"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
