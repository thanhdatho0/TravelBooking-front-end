import { useEffect, useState } from "react";
import {
  getTop8Accommodations,
  type AccomSummaryDto,
} from "../../api/accommodation";
import AccommodationCard from "./AccommodationCard";

export default function AccommodationGrid() {
  const [items, setItems] = useState<AccomSummaryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setError(null);
        const data = await getTop8Accommodations();
        if (mounted) setItems(data ?? []);
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

  return (
    // FIX 1: Container linh hoạt
    // w-full: chiếm hết chiều ngang cho phép
    // max-w-7xl: giới hạn tối đa để không bị bè ra quá mức trên màn hình siêu lớn
    // mx-auto: căn giữa container
    // px-4: lề an toàn cho mobile
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

      {/* FIX 2: Responsive Grid
          - sm:grid-cols-2: Tablet nhỏ (2 cột)
          - md:grid-cols-3: Tablet lớn / Laptop nhỏ (3 cột)
          - lg:grid-cols-4: Laptop / PC (4 cột)
          - gap-5: Khoảng cách đều giữa các cột
       */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                // Aspect ratio giúp placeholder không bị nhảy chiều cao
                className="aspect-[3/4] rounded-lg border bg-gray-100 animate-pulse"
              />
            ))
          : items
              .slice(0, 4)
              .map((x, i) => (
                <AccommodationCard key={x.id} item={x} index={i} />
              ))}
      </div>
    </section>
  );
}
