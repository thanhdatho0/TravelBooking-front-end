import { useEffect, useState } from "react";
import { getUserById, updateUser, type UserPersonalInfoDto } from "../api/user";
import { api, withApiPrefix } from "../api/api";

function Spinner() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-sky-600 animate-spin" />
    </div>
  );
}

type PaymentStatus = 0 | 1 | number;

interface PaymentRecordDto {
  id: string;
  userId: string;
  roomId: string;
  roomName?: string | null;
  price: number; // ✅ giá 1 đêm (base)
  paymentMethodId?: string | null;
  paymentMethodName?: string | null;
  status: PaymentStatus;
  checkInDate: string; // "YYYY-MM-DD"
  checkOutDate: string; // "YYYY-MM-DD"
}

function formatVnd(v?: number | null) {
  if (v == null) return "—";
  return new Intl.NumberFormat("vi-VN").format(v) + " VND";
}

function statusLabel(s: PaymentStatus) {
  if (s === 1)
    return {
      text: "Thành công",
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  if (s === 0)
    return {
      text: "Đang chờ",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
    };
  return {
    text: `Trạng thái ${s}`,
    cls: "bg-slate-50 text-slate-700 border-slate-200",
  };
}

// ✅ số ngày = checkOut - checkIn (tối thiểu 1)
function calcNights(checkIn: string, checkOut: string) {
  const a = new Date(checkIn);
  const b = new Date(checkOut);

  const diff = Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
  return Number.isFinite(diff) && diff > 0 ? diff : 1;
}

export default function ProfilePage() {
  const userId = localStorage.getItem("userId") || "";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const [data, setData] = useState<UserPersonalInfoDto | null>(null);

  // form state
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState<string>(""); // yyyy-mm-dd
  const [sex, setSex] = useState<"male" | "female" | "unset">("unset");

  // ✅ NEW: phone
  const [phoneNumber, setPhoneNumber] = useState("");

  // ✅ payment record list
  const [payLoading, setPayLoading] = useState(false);
  const [payErr, setPayErr] = useState<string | null>(null);
  const [payments, setPayments] = useState<PaymentRecordDto[]>([]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setErr("Chưa có userId. Bạn hãy đăng nhập lại.");
      return;
    }

    let mounted = true;
    (async () => {
      try {
        setErr(null);
        setOk(null);
        setLoading(true);

        const dto = await getUserById(userId);
        if (!mounted) return;

        setData(dto);
        setFullName(dto.fullName ?? "");
        setBirthDate(dto.birthDate ?? "");

        // ✅ NEW: map phone robust
        const phone = String(
          (dto as any)?.phoneNumber ?? (dto as any)?.phone ?? ""
        ).trim();
        setPhoneNumber(phone);

        if (dto.sex === true) setSex("male");
        else if (dto.sex === false) setSex("female");
        else setSex("unset");
      } catch (e: any) {
        if (mounted) {
          setErr(e?.response?.data ?? e?.message ?? "Không tải được hồ sơ");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userId]);

  // ✅ load payment record(s) của user
  useEffect(() => {
    if (!userId) return;

    let mounted = true;

    (async () => {
      try {
        setPayErr(null);
        setPayLoading(true);

        // GET /api/PaymentRecord/user (có thể trả 1 record hoặc array)
        const res = await api.get<PaymentRecordDto | PaymentRecordDto[]>(
          withApiPrefix("/PaymentRecord/user"),
          { headers: { accept: "*/*" } }
        );

        if (!mounted) return;

        const body = res.data as any;
        const list = Array.isArray(body) ? body : body ? [body] : [];
        setPayments(list);
      } catch (e: any) {
        if (!mounted) return;
        setPayErr(
          e?.response?.data?.message ??
            e?.response?.data ??
            e?.message ??
            "Không tải được danh sách thanh toán"
        );
        setPayments([]);
      } finally {
        if (mounted) setPayLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userId]);

  const onSave = async () => {
    if (!userId) return;

    try {
      setErr(null);
      setOk(null);
      setSaving(true);

      // ✅ basic normalize phone: chỉ trim (tuỳ bạn muốn filter số)
      const phone = phoneNumber.trim();

      await updateUser(userId, {
        fullName: fullName.trim(),
        birthDate: birthDate ? birthDate : null,
        sex: sex === "unset" ? null : sex === "male",
        // ✅ NEW: gửi phoneNumber lên backend
        phoneNumber: phone === "" ? null : phone,
      } as any);

      setOk("Lưu hồ sơ thành công!");
    } catch (e: any) {
      setErr(
        e?.response?.data?.message ??
          e?.response?.data ??
          e?.message ??
          "Lưu thất bại"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="h-6 w-40 bg-slate-100 rounded animate-pulse" />
          <div className="mt-4 h-10 bg-slate-100 rounded animate-pulse" />
          <div className="mt-3 h-10 bg-slate-100 rounded animate-pulse" />
          <div className="mt-3 h-10 bg-slate-100 rounded animate-pulse" />
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-[60vh]">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* PROFILE CARD */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-sky-50 border-b border-sky-100">
            <div className="text-xl font-extrabold text-slate-900">
              Thông tin cá nhân
            </div>
            <div className="text-sm text-slate-600 mt-1">
              Cập nhật hồ sơ để đặt phòng nhanh hơn
            </div>
          </div>

          <div className="p-6 space-y-4">
            {err ? (
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">
                {String(err)}
              </div>
            ) : null}

            {ok ? (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700">
                {ok}
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-bold text-slate-800">
                Email
              </label>
              <input
                value={data?.email ?? ""}
                disabled
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none"
              />
            </div>

            {/* ✅ NEW: Phone number */}
            <div>
              <label className="block text-sm font-bold text-slate-800">
                Số điện thoại
              </label>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Nhập số điện thoại"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200"
              />
              <div className="mt-1 text-xs text-slate-500">
                Dùng để liên hệ khi đặt phòng.
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800">
                Họ và tên
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nhập họ và tên"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-800">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800">
                  Giới tính
                </label>

                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSex("unset")}
                    className={[
                      "px-4 py-3 rounded-xl border text-sm font-bold transition",
                      sex === "unset"
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    Chưa chọn
                  </button>

                  <button
                    type="button"
                    onClick={() => setSex("male")}
                    className={[
                      "px-4 py-3 rounded-xl border text-sm font-bold transition",
                      sex === "male"
                        ? "bg-sky-600 text-white border-sky-600"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    Nam
                  </button>

                  <button
                    type="button"
                    onClick={() => setSex("female")}
                    className={[
                      "px-4 py-3 rounded-xl border text-sm font-bold transition",
                      sex === "female"
                        ? "bg-pink-600 text-white border-pink-600"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    Nữ
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="rounded-xl bg-orange-500 text-white font-extrabold px-6 py-3 hover:bg-orange-600 disabled:opacity-60"
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>

        {/* ✅ PAYMENT RECORDS CARD */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <div className="text-lg font-extrabold text-slate-900">
              Lịch sử thanh toán
            </div>
          </div>

          <div className="p-6">
            {payErr ? (
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">
                {String(payErr)}
              </div>
            ) : null}

            {payLoading ? (
              <Spinner />
            ) : payments.length === 0 ? (
              <div className="text-sm text-slate-600">
                Chưa có payment record nào.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="max-h-[312px] overflow-y-auto rounded-xl border border-slate-200">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-white z-10">
                      <tr className="text-center text-slate-600 border-b border-slate-200">
                        <th className="py-2 px-3">Phòng</th>
                        <th className="py-2 px-3">Giá</th>
                        <th className="py-2 px-3">Số đêm</th>
                        <th className="py-2 px-3">Check-in</th>
                        <th className="py-2 px-3">Check-out</th>
                        <th className="py-2 px-3">Trạng thái</th>
                      </tr>
                    </thead>

                    <tbody className="text-center">
                      {payments.map((p) => {
                        const st = statusLabel(p.status);
                        const nights = calcNights(
                          p.checkInDate,
                          p.checkOutDate
                        );
                        const totalPrice = (p.price ?? 0) * nights;

                        return (
                          <tr key={p.id} className="border-b border-slate-100">
                            <td className="py-3 px-3">
                              <div className="font-bold text-slate-900">
                                {p.roomName ?? "(Không có tên phòng)"}
                              </div>
                            </td>

                            <td className="py-3 px-3 font-bold text-slate-900">
                              {formatVnd(totalPrice)}
                            </td>

                            <td className="py-3 px-3">{nights}</td>
                            <td className="py-3 px-3">{p.checkInDate}</td>
                            <td className="py-3 px-3">{p.checkOutDate}</td>

                            <td className="py-3 px-3">
                              <span
                                className={[
                                  "inline-flex items-center px-2 py-1 rounded-full border text-xs font-bold",
                                  st.cls,
                                ].join(" ")}
                              >
                                {st.text}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="h-10" />
      </div>
    </div>
  );
}
