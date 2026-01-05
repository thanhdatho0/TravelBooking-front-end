import { useSearchParams, Link } from "react-router-dom";

export default function PaymentSuccessPage() {
  const [params] = useSearchParams();
  const id = params.get("paymentRecordId") || params.get("orderId");

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-lg w-full rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
        <div className="text-2xl font-extrabold text-emerald-700">
          Thanh toán thành công ✅
        </div>
        <div className="mt-2 text-sm text-slate-600">
          {id ? (
            <>
              Mã thanh toán: <b>{id}</b>
            </>
          ) : (
            "Cảm ơn bạn đã thanh toán."
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            to="/"
            className="rounded-xl bg-sky-600 text-white font-bold px-5 py-3"
          >
            Về trang chủ
          </Link>
          <Link
            to="/profile"
            className="rounded-xl bg-slate-900 text-white font-bold px-5 py-3"
          >
            Xem hồ sơ
          </Link>
        </div>
      </div>
    </div>
  );
}
