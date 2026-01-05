import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api, withApiPrefix } from "../api/api";

export default function PaymentVnpayReturnPage() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const [err, setErr] = useState<string | null>(null);

  // ✅ chống chạy 2 lần trong React.StrictMode (dev)
  const ran = useRef(false);

  const responseCode = params.get("vnp_ResponseCode"); // "00"
  const txnStatus = params.get("vnp_TransactionStatus"); // "00"
  const txnRef = params.get("vnp_TxnRef"); // nếu BE set

  const localPaymentRecordId =
    localStorage.getItem("pendingPaymentRecordId") || "";

  const paymentRecordId = txnRef || localPaymentRecordId;

  const queryString = useMemo(() => {
    const qs = params.toString();
    return qs ? `?${qs}` : "";
  }, [params]);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    // ✅ Nếu query báo success thì navigate ngay (UI mượt),
    // đồng thời có thể verify/ cập nhật BE ở bước sau.
    const isSuccess = responseCode === "00" && txnStatus === "00";

    (async () => {
      try {
        setErr(null);

        // (khuyến nghị) verify chữ ký + update PaymentRecord ở BE
        // Nếu BE bạn chưa có endpoint này, bạn có thể tạm comment đoạn này.
        await api.get(withApiPrefix(`/Vnpay/return${queryString}`));

        if (isSuccess) {
          nav(
            `/payment/success${
              paymentRecordId
                ? `?paymentRecordId=${encodeURIComponent(paymentRecordId)}`
                : ""
            }`,
            { replace: true }
          );
        } else {
          setErr(
            `Thanh toán không thành công. vnp_ResponseCode=${
              responseCode ?? "?"
            }, vnp_TransactionStatus=${txnStatus ?? "?"}`
          );
          // nếu bạn có fail page:
          // nav(`/payment/fail`, { replace: true });
        }
      } catch (e: any) {
        // Nếu verify BE lỗi, vẫn có thể cho user đi success dựa vào query,
        // nhưng tốt nhất là bạn quyết định theo nhu cầu.
        if (isSuccess) {
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

        setErr(
          e?.response?.data?.message ??
            e?.response?.data ??
            e?.message ??
            "Không xử lý được kết quả thanh toán."
        );
      }
    })();
  }, [nav, queryString, responseCode, txnStatus, paymentRecordId]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-lg w-full rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
        <div className="text-xl font-extrabold text-slate-900">
          Đang xử lý kết quả thanh toán...
        </div>

        <div className="mt-2 text-sm text-slate-600">
          responseCode: <b>{String(responseCode)}</b> — transactionStatus:{" "}
          <b>{String(txnStatus)}</b>
        </div>

        {err ? (
          <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 border border-rose-200">
            {err}
          </div>
        ) : null}
      </div>
    </div>
  );
}
