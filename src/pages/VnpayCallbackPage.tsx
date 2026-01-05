import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/api";

function isGuid(id: string) {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    id
  );
}

// ✅ gọi API update-status (không body)
async function updatePaymentRecordStatusToSuccess(paymentRecordId: string) {
  // dùng URL ngrok bạn đưa
  const url = `https://889de656cbdb.ngrok-free.app/api/PaymentRecord/${paymentRecordId}/update-status`;

  await api.put(url, null, {
    headers: {
      accept: "*/*",
    },
  });
}

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
  const vnpTxnRef = params.get("vnp_TxnRef");

  // ✅ id hiển thị ở trang success/fail (có thể là số)
  const paymentRecordIdForDisplay =
    orderId ||
    vnpTxnRef ||
    localStorage.getItem("pendingPaymentRecordId") ||
    "";

  // ✅ id để update DB (bắt buộc GUID) -> ưu tiên localStorage
  const pendingPaymentRecordId =
    localStorage.getItem("pendingPaymentRecordId") || "";
  const paymentRecordIdForUpdate = isGuid(pendingPaymentRecordId)
    ? pendingPaymentRecordId
    : isGuid(paymentRecordIdForDisplay)
    ? paymentRecordIdForDisplay
    : "";

  // ✅ điều kiện thành công
  const isSuccess =
    status === "00" ||
    (vnpResponseCode === "00" &&
      (vnpTxnStatus == null || vnpTxnStatus === "00"));

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      if (isSuccess) {
        try {
          setMsg(
            "Thanh toán thành công. Đang cập nhật trạng thái (status=1)..."
          );

          if (paymentRecordIdForUpdate) {
            await updatePaymentRecordStatusToSuccess(paymentRecordIdForUpdate);
          } else {
            console.warn("Không có paymentRecordId GUID để update-status");
          }

          setMsg("Cập nhật xong. Đang chuyển sang trang thành công...");

          // optional cleanup
          localStorage.removeItem("pendingReturnUrl");
          localStorage.removeItem("pendingVnpayPaymentId");
          // localStorage.removeItem("pendingPaymentRecordId");

          nav(
            `/payment/success${
              paymentRecordIdForDisplay
                ? `?paymentRecordId=${encodeURIComponent(
                    paymentRecordIdForDisplay
                  )}`
                : ""
            }`,
            { replace: true }
          );
        } catch (e: any) {
          console.error("update-status failed:", e);

          // không stuck: vẫn redirect success để user đi tiếp
          setMsg(
            "Đã thanh toán nhưng cập nhật status thất bại. Đang chuyển trang..."
          );

          nav(
            `/payment/success${
              paymentRecordIdForDisplay
                ? `?paymentRecordId=${encodeURIComponent(
                    paymentRecordIdForDisplay
                  )}`
                : ""
            }`,
            { replace: true }
          );
        }
        return;
      }

      setMsg("Thanh toán thất bại. Đang chuyển trang...");
      nav(
        `/payment/fail${
          paymentRecordIdForDisplay
            ? `?paymentRecordId=${encodeURIComponent(
                paymentRecordIdForDisplay
              )}`
            : "?"
        }&code=${encodeURIComponent(status || vnpResponseCode || "unknown")}`,
        { replace: true }
      );
    })();
  }, [
    nav,
    isSuccess,
    paymentRecordIdForDisplay,
    paymentRecordIdForUpdate,
    status,
    vnpResponseCode,
    vnpTxnStatus,
  ]);

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
          paymentRecordId(display):{" "}
          <b>{paymentRecordIdForDisplay || "(none)"}</b>
          <br />
          paymentRecordId(update GUID):{" "}
          <b>{paymentRecordIdForUpdate || "(none)"}</b>
        </div>
      </div>
    </div>
  );
}
