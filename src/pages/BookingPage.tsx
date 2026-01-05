import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getAccommodationDetail,
  type AccomDetailDto,
} from "../api/accommodationDetail";

// ✅ lấy profile giống ProfilePage
import { getUserById, type UserPersonalInfoDto } from "../api/user";

// ✅ gọi API bằng axios instance của bạn
import { api, withApiPrefix } from "../api/api";

function formatVnd(v?: number | null) {
  if (v == null) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN").format(v) + " VND";
}

type BookingRoomState = {
  roomId: string;
  roomName: string;
  price?: number | null;
  breakfast?: boolean;
  accomName?: string;
};

type LocationState = {
  selectedRoom?: BookingRoomState;
};

function classNames(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ");
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function toDateInputValue(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatDateVi(d: Date) {
  return d.toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ✅ response từ /Vnpay
type VnpayResponse = {
  paymentId?: unknown;
  paymentUrl: string;
};

// ✅ POST /api/Vnpay body = number
async function createVnpay(amountVnd: number) {
  const amount = Math.round(amountVnd);

  const res = await api.post<VnpayResponse>(withApiPrefix("/Vnpay"), amount, {
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
  });

  return res.data;
}

// ✅ PaymentRecord create DTO (khớp controller bạn đưa)
// ✅ thêm status để set Pending = 0 (hết lỗi TS)
type PaymentRecordCreateDto = {
  roomId: string;
  roomName?: string | null;
  price: number; // ✅ CHỈ TIỀN PHÒNG (không thuế/phí)
  paymentMethodId?: string | null;
  status?: number; // ✅ Pending = 0
};

// ✅ POST /api/PaymentRecord -> trả về Guid (string)
async function createPaymentRecord(dto: PaymentRecordCreateDto) {
  const res = await api.post<string>(withApiPrefix("/PaymentRecord"), dto, {
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
  });
  return res.data;
}

export default function BookingPage() {
  const { accomId } = useParams();
  const nav = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const userId = localStorage.getItem("userId") || "";

  const [accom, setAccom] = useState<AccomDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // ✅ profile
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileErr, setProfileErr] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserPersonalInfoDto | null>(null);

  const selectedRoom = state.selectedRoom;

  // dates & guests
  const [checkIn, setCheckIn] = useState<string>(() =>
    toDateInputValue(addDays(new Date(), 1))
  );
  const [checkOut, setCheckOut] = useState<string>(() =>
    toDateInputValue(addDays(new Date(), 2))
  );
  const [roomsCount, setRoomsCount] = useState<number>(1);
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);

  // ✅ form values (auto fill from profile, và không cho sửa)
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [guestName, setGuestName] = useState("");

  // requests
  const [reqNoSmoking, setReqNoSmoking] = useState(false);
  const [reqConnecting, setReqConnecting] = useState(false);
  const [reqHighFloor, setReqHighFloor] = useState(false);

  // validation
  const [submitErr, setSubmitErr] = useState<string | null>(null);

  // ✅ payment states
  const [paying, setPaying] = useState(false);
  const [payErr, setPayErr] = useState<string | null>(null);

  const nights = useMemo(() => {
    const a = new Date(checkIn);
    const b = new Date(checkOut);
    const diff = Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
    return Number.isFinite(diff) && diff > 0 ? diff : 1;
  }, [checkIn, checkOut]);

  const roomPrice = selectedRoom?.price ?? null;

  // ✅ CHỈ TIỀN PHÒNG
  const roomTotal = useMemo(() => {
    if (roomPrice == null) return null;
    return roomPrice * nights * Math.max(1, roomsCount);
  }, [roomPrice, nights, roomsCount]);

  // Load accom detail
  useEffect(() => {
    if (!accomId) return;

    (async () => {
      try {
        setErr(null);
        setLoading(true);
        const dto = await getAccommodationDetail(accomId);
        setAccom(dto);
      } catch (e: any) {
        setErr(e?.message ?? "Không tải được dữ liệu khách sạn");
      } finally {
        setLoading(false);
      }
    })();
  }, [accomId]);

  // Fix checkOut
  useEffect(() => {
    const a = new Date(checkIn);
    const b = new Date(checkOut);
    if (b.getTime() <= a.getTime()) {
      setCheckOut(toDateInputValue(addDays(a, 1)));
    }
  }, [checkIn]); // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ Load profile giống ProfilePage
  useEffect(() => {
    if (!userId) {
      setProfileErr("Chưa có userId. Bạn hãy đăng nhập lại.");
      return;
    }

    let mounted = true;

    (async () => {
      try {
        setProfileErr(null);
        setProfileLoading(true);

        const dto = await getUserById(userId);
        if (!mounted) return;

        setProfile(dto);

        const fullName = String((dto as any)?.fullName ?? "").trim();

        const rawEmail = String(
          (dto as any)?.email ?? (dto as any)?.userName ?? ""
        ).trim();
        const email = rawEmail.includes("@") ? rawEmail : "";

        const phone = String(
          (dto as any)?.phoneNumber ?? (dto as any)?.phone ?? ""
        ).trim();

        setContactName(fullName);
        setContactEmail(email);
        setContactPhone(phone);
        setGuestName(fullName);
      } catch (e: any) {
        if (mounted) {
          setProfileErr(
            e?.response?.data?.message ??
              e?.response?.data ??
              e?.message ??
              "Không tải được hồ sơ"
          );
        }
      } finally {
        if (mounted) setProfileLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userId]);

  const invalidProfile = {
    contactName: !contactName.trim(),
    contactPhone: !contactPhone.trim(),
    contactEmail: !contactEmail.trim() || !contactEmail.includes("@"),
    guestName: !guestName.trim(),
  };

  const needUpdateProfile = Object.values(invalidProfile).some(Boolean);

  // ✅ bấm tiếp tục -> tạo PaymentRecord(Pending) -> gọi VNPAY -> redirect
  // ✅ BỎ THUẾ & PHÍ: amount = roomTotal
  const onSubmit = async () => {
    setSubmitErr(null);
    setPayErr(null);

    if (profileLoading) {
      setSubmitErr("Đang tải hồ sơ, vui lòng thử lại sau vài giây.");
      return;
    }

    if (!selectedRoom) {
      setSubmitErr("Vui lòng chọn phòng trước.");
      return;
    }

    if (profileErr) {
      setSubmitErr("Không tải được hồ sơ. Vui lòng thử đăng nhập lại.");
      return;
    }

    if (needUpdateProfile) {
      setSubmitErr(
        "Hồ sơ của bạn chưa đầy đủ (Họ tên / SĐT / Email). Vui lòng cập nhật hồ sơ trước khi đặt phòng."
      );
      return;
    }

    const amount = roomTotal; // ✅ chỉ tiền phòng

    if (amount == null || !Number.isFinite(amount) || amount <= 0) {
      setSubmitErr("Không xác định được tiền phòng để thanh toán.");
      return;
    }

    if (!selectedRoom.roomId) {
      setSubmitErr("RoomId không hợp lệ.");
      return;
    }

    try {
      setPaying(true);

      // 1) tạo PaymentRecord (Pending)
      const paymentRecordId = await createPaymentRecord({
        roomId: selectedRoom.roomId,
        roomName: selectedRoom.roomName ?? null,
        price: Math.round(amount),
        paymentMethodId: null,
        status: 0, // ✅ Pending
      });

      localStorage.setItem("pendingPaymentRecordId", String(paymentRecordId));

      // 2) gọi VNPAY (body chỉ là 1 số)
      const data = await createVnpay(Math.round(amount));
      if (!data?.paymentUrl) throw new Error("Không nhận được paymentUrl");

      if (data.paymentId != null) {
        localStorage.setItem("pendingVnpayPaymentId", String(data.paymentId));
      }

      // 3) redirect sang VNPAY
      window.location.href = data.paymentUrl;
    } catch (e: any) {
      setPayErr(
        e?.response?.data?.message ??
          e?.response?.data ??
          e?.message ??
          "Tạo thanh toán thất bại"
      );
    } finally {
      setPaying(false);
    }
  };

  if (!accomId) return null;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-10 w-1/2 rounded-xl bg-slate-100 animate-pulse" />
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 h-80 rounded-2xl bg-slate-100 animate-pulse" />
          <div className="lg:col-span-4 h-80 rounded-2xl bg-slate-100 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!accom || err) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700 border border-rose-200">
          Không tải được trang đặt phòng: {err ?? "No data"}
        </div>
      </div>
    );
  }

  const TopBar = (
    <div className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-extrabold text-slate-900 truncate">
            {accom.name}
          </div>
          <div className="text-xs text-slate-500 truncate">
            {selectedRoom?.roomName ?? "Phòng đã chọn"}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="px-2 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
            1
          </span>
          <span className="text-slate-600">Xem lại</span>
          <span className="text-slate-300">—</span>
          <span className="px-2 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-100">
            2
          </span>
          <span className="text-slate-600">Thanh toán</span>
        </div>

        <button
          type="button"
          onClick={() => nav(-1)}
          className="text-sm font-bold text-sky-700 hover:text-sky-800"
        >
          Quay lại
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      {TopBar}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {profileErr ? (
          <div className="mt-4 rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
            {String(profileErr)}
          </div>
        ) : profileLoading ? (
          <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-700">
            Đang tải hồ sơ...
          </div>
        ) : needUpdateProfile ? (
          <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 flex items-center justify-between gap-3">
            <div className="font-bold">
              Hồ sơ chưa đầy đủ. Vui lòng cập nhật Họ tên / SĐT / Email để đặt
              phòng.
            </div>
            <button
              type="button"
              onClick={() => nav("/profile")}
              className="text-sm font-extrabold text-amber-700 hover:text-amber-800"
            >
              Cập nhật hồ sơ
            </button>
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-8 space-y-5">
            <section className="rounded-2xl border border-slate-100 bg-white shadow-sm p-5">
              <div className="font-extrabold text-slate-900">
                Liên hệ đặt chỗ
              </div>
              <div className="text-sm text-slate-500 mt-1">
                Thông tin được lấy từ hồ sơ cá nhân (không thể chỉnh sửa tại
                đây).
              </div>

              {submitErr ? (
                <div className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 border border-rose-200">
                  {submitErr}
                </div>
              ) : null}

              {payErr ? (
                <div className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 border border-rose-200">
                  {String(payErr)}
                </div>
              ) : null}

              <div className="mt-4 grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Họ tên<span className="text-rose-600">*</span>
                  </label>
                  <input
                    value={contactName}
                    disabled
                    className={classNames(
                      "mt-1 w-full rounded-xl border px-4 py-2.5 outline-none",
                      invalidProfile.contactName
                        ? "border-rose-300 bg-rose-50"
                        : "border-slate-200 bg-slate-50"
                    )}
                    placeholder="(Trống) — Vui lòng cập nhật hồ sơ"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-5">
                    <label className="text-sm font-bold text-slate-700">
                      Điện thoại di động<span className="text-rose-600">*</span>
                    </label>
                    <input
                      value={contactPhone}
                      disabled
                      className={classNames(
                        "mt-1 w-full rounded-xl border px-4 py-2.5 outline-none",
                        invalidProfile.contactPhone
                          ? "border-rose-300 bg-rose-50"
                          : "border-slate-200 bg-slate-50"
                      )}
                      placeholder="(Trống) — Vui lòng cập nhật hồ sơ"
                    />
                  </div>

                  <div className="sm:col-span-7">
                    <label className="text-sm font-bold text-slate-700">
                      Email<span className="text-rose-600">*</span>
                    </label>
                    <input
                      value={contactEmail}
                      disabled
                      className={classNames(
                        "mt-1 w-full rounded-xl border px-4 py-2.5 outline-none",
                        invalidProfile.contactEmail
                          ? "border-rose-300 bg-rose-50"
                          : "border-slate-200 bg-slate-50"
                      )}
                      placeholder="(Trống) — Vui lòng cập nhật hồ sơ"
                    />
                  </div>
                </div>

                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Tôi đặt chỗ cho chính mình
                </label>
              </div>
            </section>

            {/* Guest info */}
            <section className="rounded-2xl border border-slate-100 bg-white shadow-sm p-5">
              <div className="font-extrabold text-slate-900">
                Thông tin Khách hàng
              </div>
              <div className="text-sm text-slate-500 mt-1">
                Tên khách lưu trú được lấy từ hồ sơ cá nhân.
              </div>

              <div className="mt-4">
                <label className="text-sm font-bold text-slate-700">
                  Họ tên<span className="text-rose-600">*</span>
                </label>
                <input
                  value={guestName}
                  disabled
                  className={classNames(
                    "mt-1 w-full rounded-xl border px-4 py-2.5 outline-none",
                    invalidProfile.guestName
                      ? "border-rose-300 bg-rose-50"
                      : "border-slate-200 bg-slate-50"
                  )}
                  placeholder="(Trống) — Vui lòng cập nhật hồ sơ"
                />
              </div>
            </section>

            {/* Special requests */}
            <section className="rounded-2xl border border-slate-100 bg-white shadow-sm p-5">
              <div className="font-extrabold text-slate-900">
                Yêu cầu đặc biệt
              </div>
              <div className="text-sm text-slate-500 mt-1">
                Gửi yêu cầu và khách sạn sẽ cố gắng đáp ứng (không đảm bảo).
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={reqNoSmoking}
                    onChange={(e) => setReqNoSmoking(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Phòng không hút thuốc
                </label>

                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={reqConnecting}
                    onChange={(e) => setReqConnecting(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Phòng liền thông
                </label>

                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={reqHighFloor}
                    onChange={(e) => setReqHighFloor(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Tầng lầu
                </label>
              </div>
            </section>

            {/* Policy */}
            <section className="rounded-2xl border border-slate-100 bg-white shadow-sm p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="font-extrabold text-slate-900">
                  Chính sách Chỗ ở
                </div>
                <button className="text-sm font-bold text-sky-700 hover:text-sky-800">
                  Đọc tất cả
                </button>
              </div>

              <div className="mt-3 text-sm text-slate-600">
                <div className="font-bold text-slate-800">
                  Hướng Dẫn Nhận Phòng Chung
                </div>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li>
                    Khách có thể cần xuất trình giấy tờ tuỳ thân khi nhận phòng.
                  </li>
                  <li>
                    Giờ nhận phòng/trả phòng tuỳ theo chính sách khách sạn.
                  </li>
                  <li>
                    Yêu cầu đặc biệt tuỳ thuộc tình trạng phòng và có thể phát
                    sinh phí.
                  </li>
                </ul>
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4">
            <div className="sticky top-[72px] space-y-4">
              {/* summary */}
              <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-5">
                <div className="text-xs font-bold text-sky-700">
                  {selectedRoom ? "Bạn đã chọn phòng" : "Chưa chọn phòng"}
                </div>

                <div className="mt-1 font-extrabold text-slate-900">
                  {selectedRoom?.roomName ?? "—"}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-slate-200 p-3">
                    <div className="text-xs text-slate-500">Nhận phòng</div>
                    <div className="font-bold text-slate-900">
                      {formatDateVi(new Date(checkIn))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-3">
                    <div className="text-xs text-slate-500">Trả phòng</div>
                    <div className="font-bold text-slate-900">
                      {formatDateVi(new Date(checkOut))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-12 gap-3 text-sm">
                  <div className="col-span-6">
                    <label className="text-xs font-bold text-slate-600">
                      Số phòng
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={roomsCount}
                      onChange={(e) =>
                        setRoomsCount(Math.max(1, Number(e.target.value) || 1))
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-200"
                    />
                  </div>

                  <div className="col-span-3">
                    <label className="text-xs font-bold text-slate-600">
                      NL
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={adults}
                      onChange={(e) =>
                        setAdults(Math.max(1, Number(e.target.value) || 1))
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-200"
                    />
                  </div>

                  <div className="col-span-3">
                    <label className="text-xs font-bold text-slate-600">
                      TE
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={children}
                      onChange={(e) =>
                        setChildren(Math.max(0, Number(e.target.value) || 0))
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-200"
                    />
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <label className="text-xs font-bold text-slate-600">
                      Check-in
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600">
                      Check-out
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-200"
                    />
                  </div>
                </div>

                <div className="mt-3 text-xs text-emerald-700 font-bold">
                  {selectedRoom?.breakfast
                    ? "🍳 Có bữa sáng"
                    : "🍽️ Không gồm bữa sáng"}
                </div>

                <div className="mt-2 text-xs text-slate-500">
                  {nights} đêm · {roomsCount} phòng
                </div>
              </div>

              {/* price detail (NO tax/fee) */}
              <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-5">
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-slate-900">
                    Chi tiết giá
                  </div>
                  <span className="text-xs text-slate-500">{nights} đêm</span>
                </div>

                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Giá phòng</span>
                    <span className="font-bold text-slate-900">
                      {roomTotal == null ? "—" : formatVnd(roomTotal)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-slate-900 font-extrabold">
                      Tổng cộng
                    </span>
                    <span className="text-orange-500 font-extrabold text-lg">
                      {roomTotal == null ? "—" : formatVnd(roomTotal)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onSubmit}
                  className="mt-4 w-full rounded-xl bg-sky-600 text-white font-extrabold py-3 hover:bg-sky-700 active:scale-[0.99] transition disabled:opacity-60"
                  disabled={!selectedRoom || profileLoading || paying}
                  title={
                    !selectedRoom ? "Vui lòng chọn phòng trước" : "Tiếp tục"
                  }
                >
                  {paying ? "Đang chuyển tới VNPAY..." : "Tiếp tục"}
                </button>

                <div className="mt-3 text-xs text-slate-500">
                  Bằng cách tiến hành thanh toán, bạn đã đồng ý với Điều khoản &
                  Chính sách.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-10" />
      </div>
    </div>
  );
}
