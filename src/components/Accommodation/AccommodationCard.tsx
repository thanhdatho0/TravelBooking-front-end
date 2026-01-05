import { useEffect, useMemo, useState } from "react";
import type { AccomSummaryDto } from "../../api/accommodation";
// Import hàm API lấy ảnh bạn vừa tạo
import { getImageById } from "../../api/image";
import { Link } from "react-router-dom";

// Cache tạm thời để tránh gọi API lại khi component re-render
const imageCache = new Map<string, string>();

function formatVnd(v: number | null | undefined) {
  if (v == null) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN").format(v) + " VND";
}

function stars(n?: number | null) {
  const k = Math.max(0, Math.min(5, n ?? 0));
  return "★".repeat(k) + "☆".repeat(5 - k);
}

export default function AccommodationCard({
  item,
}: {
  item: AccomSummaryDto;
  index?: number;
}) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  const oldPrice = useMemo(() => {
    return Math.round(item.price / 0.75 / 1000) * 1000;
  }, [item.price]);

  // --- LOGIC LẤY ẢNH TỪ API ---
  useEffect(() => {
    let mounted = true;

    async function load() {
      // 1. Nếu không có ID ảnh thì thôi
      if (!item.coverImageId) return;

      // 2. Kiểm tra Cache xem đã tải chưa
      const cached = imageCache.get(item.coverImageId);
      if (cached) {
        if (mounted) setImgUrl(cached);
        return;
      }

      // 3. Gọi API lấy thông tin ảnh thật
      try {
        const dto = await getImageById(item.coverImageId);
        // Server trả về dto.url (đường dẫn ảnh)
        const url = dto.url ?? null;

        if (url) {
          imageCache.set(item.coverImageId, url);
          if (mounted) setImgUrl(url);
        }
      } catch (err) {
        console.error("Failed to load image for:", item.name, err);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [item.coverImageId]);

  return (
    <Link to={`/accommodations/${item.id}`} className="block">
      <div className="w-full h-full flex flex-col rounded-xl overflow-hidden bg-white shadow-sm border hover:shadow-md transition group relative">
        {/* --- PHẦN ẢNH --- */}
        <div className="relative h-48 w-full bg-gray-200 shrink-0">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={item.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                // Xử lý khi ảnh bị lỗi (404)
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/600x400?text=No+Image";
              }}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
              Loading...
            </div>
          )}

          {/* Badge Tỉnh/Thành phố */}
          <div className="absolute left-2 top-2 bg-gray-900/60 backdrop-blur-[2px] text-white text-[11px] font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1 shadow-sm max-w-[calc(100%-16px)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-3 h-3 text-white shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="truncate">{item.location ?? "Việt Nam"}</span>
          </div>
        </div>

        {/* --- CAM KẾT GIÁ TỐT --- */}
        <div className="bg-blue-800 py-1 text-center text-[12px] font-semibold text-white shrink-0">
          Cam kết giá tốt
        </div>

        {/* --- NỘI DUNG (FILL HẾT Ô) --- */}
        <div className="p-3 flex flex-col flex-1 justify-between bg-white">
          {/* Thông tin trên */}
          <div className="flex flex-col gap-1">
            <div className="font-bold text-[14px] leading-tight text-gray-800 line-clamp-2">
              {item.name}
            </div>

            <div className="text-yellow-500 text-[12px] leading-none">
              {stars(item.star)}
            </div>

            <div className="text-[12px] leading-none">
              <span className="font-semibold text-blue-700">
                {item.rating ? item.rating.toFixed(1) : "—"}/10
              </span>
              <span className="text-gray-500"> • đánh giá</span>
            </div>
          </div>

          {/* Giá (nằm đáy) */}
          <div className="mt-3 pt-2 border-t border-dashed border-gray-100">
            <div className="text-[12px] text-gray-400 line-through">
              {formatVnd(oldPrice)}
            </div>

            <div className="text-[18px] leading-tight font-extrabold text-[#d4111e]">
              {formatVnd(item.price)}
            </div>

            <div className="text-[11px] text-gray-500 font-light mt-0.5">
              Đã bao gồm thuế và phí
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
