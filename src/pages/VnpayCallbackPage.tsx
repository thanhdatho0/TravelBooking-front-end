import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function VnpayCallbackPage() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const ran = useRef(false);

  const [msg, setMsg] = useState("Đang xử lý kết quả thanh toán...");

  // ✅ dạng bạn tự set
  const status = params.get("status"); // "00"
  const orderId = params.get("orderId"); // vd: 6390...

  // ✅ dạng VNPAY trả về chuẩn
  const vnpResponseCode = params.get("vnp_ResponseCode"); // "00"
  const vnpTxnStatus = params.get("vnp_TransactionStatus"); // "00"
  const vnpTxnRef = params.get("vnp_TxnRef"); // mã ref

  // ✅ lấy id hiển thị ở trang success/fail
  const paymentRecordId =
    orderId ||
    vnpTxnRef ||
    localStorage.getItem("pendingPaymentRecordId") ||
    "";

  // ✅ điều kiện thành công: ưu tiên status, nếu không có thì dùng vnp_*
  const isSuccess =
    status === "00" ||
    (vnpResponseCode === "00" &&
      (vnpTxnStatus == null || vnpTxnStatus === "00"));

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    if (isSuccess) {
      setMsg("Thanh toán thành công. Đang chuyển trang...");
      nav(
        `/payment/success${
          paymentRecordId
            ? `?paymentRecordId=${encodeURIComponent(paymentRecordId)}`
            : ""
        }`,
        { replace: true }
      );
      return;
    }

    setMsg("Thanh toán thất bại. Đang chuyển trang...");
    nav(
      `/payment/fail${
        paymentRecordId
          ? `?paymentRecordId=${encodeURIComponent(paymentRecordId)}`
          : ""
      }&code=${encodeURIComponent(status || vnpResponseCode || "unknown")}`,
      { replace: true }
    );
  }, [nav, isSuccess, paymentRecordId, status, vnpResponseCode, vnpTxnStatus]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-lg w-full rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
        <div className="text-xl font-extrabold text-slate-900">
          Đang xử lý thanh toán...
        </div>
        <div className="mt-2 text-sm text-slate-600">{msg}</div>

        <div className="mt-4 text-xs text-slate-500">
          status: <b>{String(status ?? vnpResponseCode ?? "(none)")}</b>
          <br />
          paymentRecordId/orderId: <b>{paymentRecordId || "(none)"}</b>
        </div>
      </div>
    </div>
  );
}
