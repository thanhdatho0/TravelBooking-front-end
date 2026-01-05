import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ImageCarousel from "../components/AccommodationDetail/ImageCarousel";
import {
  getAccommodationDetail,
  type AccomDetailDto,
  type RoomCategoryDto,
} from "../api/accommodationDetail";
import {
  createReview,
  getReviewsByAccommodation,
  updateReview,
  deleteReview,
  type ReviewDto,
} from "../api/reviews";

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

// ===== username display (Ưu tiên username, chỉ cắt email nếu bắt buộc) =====
function normalizeDisplayName(raw?: string | null) {
  if (!raw) return "User";
  if (raw.includes("@")) return raw.split("@")[0];
  return raw;
}
function displayUserName(rv: ReviewDto) {
  return normalizeDisplayName(rv.userName ?? rv.createdBy ?? "User");
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

  // ===== Reviews =====
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [rvLoading, setRvLoading] = useState(false);
  const [rvErr, setRvErr] = useState<string | null>(null);

  // current user
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem("accessToken");
  });
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    return localStorage.getItem("userId");
  });

  // form (create/edit)
  const [myReviewId, setMyReviewId] = useState<string | null>(null);
  const [myRating, setMyRating] = useState<number>(10);
  const [myReview, setMyReview] = useState<string>("");
  const [posting, setPosting] = useState(false);
  const [postErr, setPostErr] = useState<string | null>(null);

  // delete
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteErr, setDeleteErr] = useState<string | null>(null);

  const mode: "create" | "edit" = myReviewId ? "edit" : "create";

  useEffect(() => {
    const sync = () => {
      setIsLoggedIn(!!localStorage.getItem("accessToken"));
      setCurrentUserId(localStorage.getItem("userId"));
    };

    sync();

    const onAuthChanged = () => sync();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "accessToken" || e.key === "userId") sync();
    };

    window.addEventListener("auth-changed", onAuthChanged as EventListener);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(
        "auth-changed",
        onAuthChanged as EventListener
      );
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const loadReviews = async (accomId: string) => {
    try {
      setRvErr(null);
      setRvLoading(true);

      const list = await getReviewsByAccommodation(accomId);
      const arr = list ?? [];
      setReviews(arr);

      // auto detect my review -> edit mode
      const uid = localStorage.getItem("userId");
      if (uid) {
        const mine = arr.find((x) => x.userId === uid);
        if (mine) {
          setMyReviewId(mine.id);
          setMyRating(
            typeof mine.rating === "number" && !Number.isNaN(mine.rating)
              ? Math.max(1, Math.min(10, Math.round(mine.rating)))
              : 10
          );
          setMyReview(mine.review ?? "");
        } else {
          setMyReviewId(null);
          setMyRating(10);
          setMyReview("");
        }
      } else {
        setMyReviewId(null);
        setMyRating(10);
        setMyReview("");
      }
    } catch (e: any) {
      setRvErr(
        e?.response?.data?.message ?? e?.message ?? "Không tải được đánh giá"
      );
    } finally {
      setRvLoading(false);
    }
  };

  const onDeleteReview = async (reviewId: string) => {
    if (!id) return;

    const ok = window.confirm("Bạn chắc chắn muốn xoá đánh giá này?");
    if (!ok) return;

    try {
      setDeleteErr(null);
      setDeleteLoading(true);

      await deleteReview(reviewId);

      if (myReviewId === reviewId) {
        setMyReviewId(null);
        setMyRating(10);
        setMyReview("");
        setPostErr(null);
      }

      await loadReviews(id);
    } catch (e: any) {
      setDeleteErr(
        e?.response?.data?.message ?? e?.message ?? "Xoá đánh giá thất bại"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // Load detail
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

  // Load reviews
  useEffect(() => {
    if (!id) return;
    loadReviews(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isLoggedIn, currentUserId]);

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
        <ImageCarousel urls={imageUrls} intervalMs={3500} />

        {/* HEADER */}
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
          <div className="flex items-center justify-between gap-3">
            <div className="text-xl font-extrabold text-slate-900">
              Đánh giá
            </div>

            <button
              type="button"
              onClick={() => id && loadReviews(id)}
              className="text-sm font-bold text-sky-700 hover:text-sky-800"
              disabled={rvLoading}
            >
              {rvLoading ? "Đang tải..." : "Làm mới"}
            </button>
          </div>

          {deleteErr ? (
            <div className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 border border-rose-200">
              {deleteErr}
            </div>
          ) : null}

          {/* FORM */}
          {isLoggedIn ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-extrabold text-slate-900">
                  {mode === "edit"
                    ? "Đánh giá của bạn (Chỉnh sửa)"
                    : "Viết đánh giá của bạn"}
                </div>

                {mode === "edit" ? (
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Bạn đã đánh giá — chỉ có thể sửa / xoá
                  </span>
                ) : null}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <div className="text-sm font-bold text-slate-700 mr-2">
                  Chấm điểm:
                </div>

                {Array.from({ length: 10 }).map((_, i) => {
                  const v = i + 1;
                  const active = v === myRating;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setMyRating(v)}
                      className={[
                        "h-9 w-9 rounded-xl text-sm font-extrabold transition",
                        active
                          ? "bg-sky-600 text-white shadow-sm"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100",
                      ].join(" ")}
                      title={`Chấm ${v}/10`}
                      disabled={posting || deleteLoading}
                    >
                      {v}
                    </button>
                  );
                })}

                <span className="ml-2 text-sm font-bold text-emerald-700">
                  {myRating}/10
                </span>
              </div>

              <textarea
                value={myReview}
                onChange={(e) => setMyReview(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn..."
                className="mt-3 w-full min-h-[110px] rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200"
                disabled={posting || deleteLoading}
              />

              {postErr ? (
                <div className="mt-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3">
                  {postErr}
                </div>
              ) : null}

              <div className="mt-3 flex items-center justify-end gap-2">
                {mode === "edit" && myReviewId ? (
                  <button
                    type="button"
                    onClick={() => onDeleteReview(myReviewId)}
                    disabled={posting || deleteLoading}
                    className="px-4 py-2 rounded-xl font-bold text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 disabled:opacity-60"
                  >
                    {deleteLoading ? "Đang xoá..." : "Xoá đánh giá"}
                  </button>
                ) : null}

                <button
                  type="button"
                  disabled={posting || deleteLoading || !id}
                  onClick={async () => {
                    if (!id) return;

                    try {
                      setPostErr(null);
                      setDeleteErr(null);
                      setPosting(true);

                      const payload = {
                        rating: myRating,
                        review: myReview?.trim() || null,
                      };

                      if (mode === "edit" && myReviewId) {
                        await updateReview(myReviewId, payload);
                      } else {
                        await createReview(id, payload);
                      }

                      await loadReviews(id);
                    } catch (e: any) {
                      setPostErr(
                        e?.response?.data?.message ??
                          e?.response?.data ??
                          e?.message ??
                          (mode === "edit"
                            ? "Cập nhật đánh giá thất bại"
                            : "Gửi đánh giá thất bại")
                      );
                    } finally {
                      setPosting(false);
                    }
                  }}
                  className="px-5 py-2 rounded-xl bg-orange-500 text-white font-extrabold hover:bg-orange-600 disabled:opacity-60"
                >
                  {posting
                    ? "Đang xử lý..."
                    : mode === "edit"
                    ? "Lưu thay đổi"
                    : "Gửi đánh giá"}
                </button>
              </div>

              <div className="mt-2 text-xs text-slate-500">
                * Mỗi tài khoản chỉ được 1 đánh giá cho mỗi khách sạn.
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              Bạn cần <b>đăng nhập</b> để đánh giá khách sạn.
            </div>
          )}

          {/* LIST */}
          {rvErr ? (
            <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 border border-rose-200">
              {rvErr}
            </div>
          ) : null}

          {rvLoading ? (
            <div className="mt-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 rounded-xl border border-slate-100 bg-slate-100 animate-pulse"
                />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="mt-4 text-slate-400">Chưa có đánh giá</div>
          ) : (
            <div className="mt-4 space-y-4">
              {reviews.map((rv) => {
                const uid = localStorage.getItem("userId");
                const isMine = !!uid && rv.userId === uid;

                return (
                  <div
                    key={rv.id}
                    className={[
                      "rounded-xl border p-4 transition",
                      isMine
                        ? "bg-amber-50/40 border-amber-200"
                        : "border-slate-100 hover:bg-slate-50/60",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-slate-900">
                          {isMine ? "Bạn" : displayUserName(rv)}
                        </div>

                        <div className="mt-1 inline-flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 text-xs font-extrabold">
                            {(rv.rating ?? 0).toFixed(1)}/10
                          </span>

                          {isMine ? (
                            <span className="text-xs font-bold text-amber-700">
                              (Đánh giá của bạn)
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-xs text-slate-500">
                          {rv.createdAt
                            ? new Date(rv.createdAt).toLocaleString("vi-VN")
                            : ""}
                        </div>

                        {isMine ? (
                          <button
                            type="button"
                            className="text-xs font-bold px-3 py-1 rounded-full border border-rose-200 text-rose-700 bg-white hover:bg-rose-50 disabled:opacity-60"
                            onClick={() => onDeleteReview(rv.id)}
                            disabled={posting || deleteLoading}
                          >
                            {deleteLoading ? "..." : "Xoá"}
                          </button>
                        ) : null}
                      </div>
                    </div>

                    {rv.review ? (
                      <div className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">
                        {rv.review}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="h-10" />
      </div>
    </div>
  );
}
