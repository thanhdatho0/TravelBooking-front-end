// components/AuthenticationForm/EmailConfirm.tsx
import { useState } from "react";
import { preRegister, verifyEmail } from "../../api/auth";

export default function EmailConfirm({
  email,
  onBack,
  onSuccess,
}: {
  email: string;
  onBack: () => void;
  onSuccess: () => void;
}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    try {
      setErr(null);
      setLoading(true);
      await verifyEmail(email, code.trim());
      onSuccess();
    } catch (ex: any) {
      setErr(ex?.response?.data ?? ex?.message ?? "OTP không đúng");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      setErr(null);
      await preRegister(email);
    } catch (ex: any) {
      setErr(
        ex?.response?.data?.message ?? ex?.message ?? "Không thể gửi lại mã"
      );
    }
  };

  return (
    <div className="p-6">
      <button className="text-sky-700 font-bold" onClick={onBack}>
        ← Quay lại
      </button>

      <div className="mt-3 text-sm text-slate-600">
        Nhập mã xác thực đã gửi tới: <b>{email}</b>
      </div>

      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Nhập mã OTP (4 số)"
        className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200"
      />

      {err ? (
        <div className="mt-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3">
          {String(err)}
        </div>
      ) : null}

      <button
        type="button"
        onClick={submit}
        disabled={loading}
        className="mt-4 w-full rounded-xl bg-sky-600 text-white font-bold py-3 hover:bg-sky-700 disabled:opacity-60"
      >
        {loading ? "Đang xác thực..." : "Xác thực"}
      </button>

      <button
        type="button"
        onClick={resend}
        className="mt-3 w-full rounded-xl border border-slate-200 py-3 font-bold text-slate-700 hover:bg-slate-50"
      >
        Gửi lại mã
      </button>
    </div>
  );
}
