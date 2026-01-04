import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ImageCarousel from "../components/AccommodationDetail/ImageCarousel";
import {
  getAccommodationDetail,
  type AccomDetailDto,
  type RoomCategoryDto,
} from "../api/accommodationDetail";

function formatVnd(v?: number | null) {
  if (v == null) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN").format(v) + " VND";
}
function stars(n?: number | null) {
  const k = Math.max(0, Math.min(5, n ?? 0));
  return "★".repeat(k) + "☆".repeat(5 - k);
}
function facilityText(x: any) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  return x.name ?? x.title ?? x.label ?? JSON.stringify(x);
}

function RoomCategoryBlock({ rc }: { rc: RoomCategoryDto }) {
  const img = rc.images?.[0]?.url ?? null;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-[0_4px_18px_rgba(15,23,42,0.06)] overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="text-lg font-extrabold text-slate-900">{rc.name}</div>
        {rc.about ? (
          <div className="mt-1 text-sm text-slate-600">{rc.about}</div>
        ) : null}
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: image + facilities */}
        <div>
          <div className="rounded-xl overflow-hidden bg-slate-100 aspect-[4/3]">
            {img ? (
              <img src={img} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                No image
              </div>
            )}
          </div>

          <div className="mt-4 space-y-3">
            {(rc.roomFacilities?.length ?? 0) > 0 && (
              <div>
                <div className="text-sm font-bold text-slate-800 mb-2">
                  Tiện nghi phòng
                </div>
                <div className="flex flex-wrap gap-2">
                  {(rc.roomFacilities ?? []).slice(0, 6).map((x, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {x}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(rc.bathAmenities?.length ?? 0) > 0 && (
              <div>
                <div className="text-sm font-bold text-slate-800 mb-2">
                  Tiện nghi phòng tắm
                </div>
                <div className="flex flex-wrap gap-2">
                  {(rc.bathAmenities ?? []).slice(0, 6).map((x, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {x}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: room table */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
            <div className="bg-sky-50 px-4 py-3 text-sm font-bold text-slate-700 grid grid-cols-12 gap-2 border-b border-sky-100">
              <div className="col-span-4">Phòng</div>
              <div className="col-span-2">Bữa sáng</div>
              <div className="col-span-3">Giá/đêm</div>
              <div className="col-span-2">Trạng thái</div>
              <div className="col-span-1"></div>
            </div>

            <div>
              {(rc.rooms ?? []).map((r) => (
                <div
                  key={r.id}
                  className="px-4 py-4 grid grid-cols-12 gap-2 border-t border-slate-100 items-center hover:bg-slate-50/60 transition"
                >
                  <div className="col-span-4">
                    <div className="font-semibold text-slate-900">{r.name}</div>
                    <div className="text-xs text-slate-500">
                      {r.bedTypeName ? `Giường: ${r.bedTypeName}` : ""}
                    </div>
                  </div>

                  <div className="col-span-2 text-sm text-slate-700">
                    {r.breakfast ? "Có" : "Không"}
                  </div>

                  <div className="col-span-3">
                    <div className="inline-flex items-center text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                      Cam kết giá tốt
                    </div>
                    <div className="text-lg font-extrabold text-orange-500">
                      {formatVnd(r.price)}
                    </div>
                    <div className="text-xs text-slate-400">
                      Chưa gồm thuế & phí
                    </div>
                  </div>

                  <div className="col-span-2">
                    {r.available ? (
                      <span className="text-emerald-700 font-bold">
                        Còn phòng
                      </span>
                    ) : (
                      <span className="text-rose-600 font-bold">Hết phòng</span>
                    )}
                  </div>

                  <div className="col-span-1 text-right">
                    <button className="rounded-lg bg-sky-600 text-white px-3 py-2 text-sm font-bold hover:bg-sky-700 active:scale-[0.99] transition">
                      Chọn
                    </button>
                  </div>
                </div>
              ))}

              {(rc.rooms?.length ?? 0) === 0 && (
                <div className="px-4 py-6 text-sm text-slate-400">
                  Chưa có phòng
                </div>
              )}
            </div>
          </div>

          {(rc.basicFacilities?.length ?? 0) > 0 && (
            <div className="mt-4">
              <div className="text-sm font-bold text-slate-800 mb-2">
                Tiện ích cơ bản
              </div>
              <div className="flex flex-wrap gap-2">
                {(rc.basicFacilities ?? []).slice(0, 8).map((x, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100"
                  >
                    {x}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AccommodationDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<AccomDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    (async () => {
      try {
        setErr(null);
        setLoading(true);
        const dto = await getAccommodationDetail(id);
        if (mounted) setData(dto);
      } catch (e: any) {
        if (mounted) setErr(e?.message ?? "Fetch failed");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  const minPrice = useMemo(() => {
    const prices: number[] = [];
    data?.roomCategories?.forEach((rc) =>
      rc.rooms?.forEach((r) => {
        if (typeof r.price === "number") prices.push(r.price);
      })
    );
    return prices.length ? Math.min(...prices) : null;
  }, [data]);

  const imageUrls = useMemo(() => {
    return (data?.images ?? []).map((x: any) => x?.url).filter(Boolean);
  }, [data]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="aspect-[16/7] rounded-2xl bg-slate-100 animate-pulse" />
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-48 rounded-2xl bg-slate-100 animate-pulse" />
          <div className="h-40 rounded-2xl bg-slate-100 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!data || err) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700 border border-rose-200">
          Không tải được chi tiết: {err ?? "No data"}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* TOP: Slider ảnh */}
        <ImageCarousel urls={imageUrls} intervalMs={3500} />

        {/* Header info overlay block */}
        <div className="-mt-14 relative z-10">
          <div className="rounded-2xl bg-white shadow-[0_6px_24px_rgba(15,23,42,0.08)] border border-slate-100 p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {data.name}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                  <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 font-bold border border-sky-100">
                    {data.accomTypeName ?? "Accommodation"}
                  </span>

                  <span className="text-yellow-500 font-bold">
                    {stars(data.star)}
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 font-bold">
                    {data.rating != null ? data.rating.toFixed(1) : "—"}/10
                  </span>
                </div>

                <div className="mt-3 text-sm text-slate-600">
                  📍 {data.address ?? data.location ?? ""}
                </div>
              </div>

              {/* Price box */}
              <div className="w-full lg:w-[360px] rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="text-sm text-slate-500">Giá/phòng/đêm từ</div>
                <div className="mt-1 text-3xl font-extrabold text-orange-500">
                  {formatVnd(minPrice)}
                </div>

                <button className="mt-3 w-full rounded-xl bg-orange-500 text-white font-extrabold py-3 hover:bg-orange-600 active:scale-[0.99] transition">
                  Chọn phòng
                </button>

                <div className="mt-2 text-xs text-slate-500">
                  Chưa bao gồm thuế & phí
                </div>
              </div>
            </div>

            {/* tiện ích tiêu biểu */}
            <div className="mt-6">
              <div className="text-sm font-bold text-slate-800 mb-2">
                Tiện ích tiêu biểu
              </div>
              <div className="flex flex-wrap gap-2">
                {(data.facilities ?? []).slice(0, 10).map((f, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {facilityText(f)}
                  </span>
                ))}
                {(!data.facilities || data.facilities.length === 0) && (
                  <span className="text-sm text-slate-400">
                    Chưa có tiện ích
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* POLICY + GENERAL INFO */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-5">
            <div className="font-extrabold text-slate-900 mb-2">Điều khoản</div>
            <div className="text-sm text-slate-600">
              {data.policy ? (
                <pre className="whitespace-pre-wrap text-xs text-slate-600">
                  {JSON.stringify(data.policy, null, 2)}
                </pre>
              ) : (
                "Chưa có dữ liệu"
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-5">
            <div className="font-extrabold text-slate-900 mb-2">
              Thông tin chung
            </div>
            <div className="text-sm text-slate-600">
              {data.generalInfo ? (
                <pre className="whitespace-pre-wrap text-xs text-slate-600">
                  {JSON.stringify(data.generalInfo, null, 2)}
                </pre>
              ) : (
                "Chưa có dữ liệu"
              )}
            </div>
          </div>
        </div>

        {/* ROOM CATEGORIES */}
        <div className="mt-8">
          <div className="text-xl font-extrabold text-slate-900 mb-4">
            Danh sách loại phòng
          </div>
          <div className="space-y-6">
            {(data.roomCategories ?? []).map((rc) => (
              <RoomCategoryBlock key={rc.id} rc={rc} />
            ))}
          </div>
        </div>

        {/* ALL FACILITIES */}
        <div className="mt-8 rounded-2xl border border-slate-100 bg-white shadow-sm p-5">
          <div className="text-xl font-extrabold text-slate-900 mb-3">
            Tất cả tiện ích
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-700">
            {(data.facilities ?? []).map((f, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-slate-400">•</span>
                <span>{facilityText(f)}</span>
              </div>
            ))}
            {(!data.facilities || data.facilities.length === 0) && (
              <div className="text-slate-400">Chưa có tiện ích</div>
            )}
          </div>
        </div>

        {/* REVIEWS */}
        <div className="mt-8 rounded-2xl border border-slate-100 bg-white shadow-sm p-5">
          <div className="text-xl font-extrabold text-slate-900 mb-3">
            Đánh giá
          </div>

          {(data.reviews ?? []).length === 0 ? (
            <div className="text-slate-400">Chưa có đánh giá</div>
          ) : (
            <div className="space-y-4">
              {data.reviews.map((rv: any, i: number) => (
                <div
                  key={rv.id ?? i}
                  className="rounded-xl border border-slate-100 p-4 hover:bg-slate-50/60 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-900">
                      {rv.userName ?? "User"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {rv.createdAt ?? ""}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-slate-700">
                    {rv.comment ?? rv.content ?? ""}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-10" />
      </div>
    </div>
  );
}
