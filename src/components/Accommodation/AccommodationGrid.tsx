import { useEffect, useMemo, useState } from "react";
import {
  getTop8Accommodations,
  type AccomSummaryDto,
} from "../../api/accommodation";
import AccommodationCard from "./AccommodationCard";

const PROVINCES = [
  "Tất cả",
  "Đà Nẵng",
  "Nha Trang",
  "Phan Thiết",
  "TP. Hồ Chí Minh",
  "Vũng Tàu",
  "Hà Nội",
  "Huế",
  "Đà Lạt",
  "Sa Pa",
  "Hội An",
];

export default function AccommodationGrid() {
  const [items, setItems] = useState<AccomSummaryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [start, setStart] = useState(0);

  // NEW: tỉnh đang chọn -> sẽ map vào request.Q
  const [province, setProvince] = useState("Tất cả");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setError(null);
        setLoading(true);

        // map tỉnh -> request.Q
        // "Tất cả" => không gửi q
        const q = province === "Tất cả" ? undefined : province;

        const data = await getTop8Accommodations(q);

        if (mounted) {
          setItems((data ?? []).slice(0, 10));
          setStart(0);
        }
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "Fetch failed");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [province]);

  const windowSize = 4;
  const maxStart = useMemo(
    () => Math.max(0, items.length - windowSize),
    [items.length]
  );
  const canPrev = start > 0;
  const canNext = start < maxStart;

  const visibleItems = useMemo(
    () => items.slice(start, start + windowSize),
    [items, start]
  );

  return (
    <section className="w-full max-w-7xl mx-auto px-4">
      <div className="flex items-end justify-between mb-3">
        <h2 className="text-xl font-bold text-gray-800">
          Nhiều lựa chọn khách sạn
        </h2>

        <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded transition">
          Xem thêm ưu đãi khách sạn &gt;
        </button>
      </div>

      {/* NEW: Chips tỉnh */}
      <div className="mb-4 flex flex-wrap gap-2">
        {PROVINCES.map((p) => {
          const active = p === province;
          return (
            <button
              key={p}
              type="button"
              onClick={() => setProvince(p)}
              className={[
                "px-3 py-1.5 rounded-full text-sm font-semibold transition",
                active
                  ? "bg-sky-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200",
              ].join(" ")}
            >
              {p}
            </button>
          );
        })}
      </div>

      {error ? (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          Không tải được danh sách khách sạn: {error}
        </div>
      ) : null}

      <div className="relative">
        <button
          onClick={() => setStart((s) => Math.max(0, s - 1))}
          disabled={loading || !canPrev}
          aria-label="Previous"
          className={[
            "absolute left-0 top-1/2 -translate-y-1/2 z-10",
            "h-10 w-10 rounded-full border bg-white shadow-md",
            "flex items-center justify-center",
            "hover:bg-gray-50 transition",
            loading || !canPrev ? "opacity-40 cursor-not-allowed" : "",
          ].join(" ")}
          style={{ transform: "translate(-50%, -50%)" }}
          title="Trước"
        >
          ‹
        </button>

        <button
          onClick={() => setStart((s) => Math.min(maxStart, s + 1))}
          disabled={loading || !canNext}
          aria-label="Next"
          className={[
            "absolute right-0 top-1/2 -translate-y-1/2 z-10",
            "h-10 w-10 rounded-full border bg-white shadow-md",
            "flex items-center justify-center",
            "hover:bg-gray-50 transition",
            loading || !canNext ? "opacity-40 cursor-not-allowed" : "",
          ].join(" ")}
          style={{ transform: "translate(50%, -50%)" }}
          title="Sau"
        >
          ›
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: windowSize }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-lg border bg-gray-100 animate-pulse"
                />
              ))
            : visibleItems.map((x) => (
                <AccommodationCard key={x.id} item={x} />
              ))}
        </div>
      </div>
    </section>
  );
}
