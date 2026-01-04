import { useEffect, useMemo, useState } from "react";
import {
  getTop8Accommodations,
  type AccomSummaryDto,
} from "../../api/accommodation";
import AccommodationCard from "./AccommodationCard";

export default function AccommodationGrid() {
  const [items, setItems] = useState<AccomSummaryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // vị trí bắt đầu của "cửa sổ" hiển thị
  const [start, setStart] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setError(null);
        setLoading(true);
        const data = await getTop8Accommodations();

        if (mounted) {
          // yêu cầu: tối đa 10 khách sạn nổi bật
          const top10 = (data ?? []).slice(0, 10);
          setItems(top10);
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
  }, []);

  const windowSize = 4;

  const maxStart = useMemo(() => {
    return Math.max(0, items.length - windowSize); // 10 -> 6
  }, [items.length]);

  const canPrev = start > 0;
  const canNext = start < maxStart;

  const visibleItems = useMemo(() => {
    return items.slice(start, start + windowSize);
  }, [items, start]);

  return (
    <section className="w-full max-w-7xl mx-auto px-4">
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Khách sạn nổi bật</h2>

        <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded transition">
          Xem thêm ưu đãi khách sạn &gt;
        </button>
      </div>

      {error ? (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          Không tải được danh sách khách sạn: {error}
        </div>
      ) : null}

      {/* Wrapper relative để đặt nút trái/phải đè lên grid */}
      <div className="relative">
        {/* NÚT TRÁI */}
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
          style={{ transform: "translate(-50%, -50%)" }} // kéo ra ngoài 1 chút
          title="Trước"
        >
          ‹
        </button>

        {/* NÚT PHẢI */}
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
          style={{ transform: "translate(50%, -50%)" }} // kéo ra ngoài 1 chút
          title="Sau"
        >
          ›
        </button>

        {/* GRID */}
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
