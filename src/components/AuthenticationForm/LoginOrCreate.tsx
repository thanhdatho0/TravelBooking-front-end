// components/AuthenticationForm/LoginOrCreate.tsx
import { useState } from "react";
import { preRegister, validateEmail } from "../../api/auth";

export default function LoginOrCreate({
  onEmailConfirmed,
  onContinueToConfirm,
}: {
  onEmailConfirmed: (email: string) => void;
  onContinueToConfirm: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    const e = email.trim();
    if (!e) return;

    try {
      setErr(null);
      setLoading(true);

      // 1) kiểm tra email đã có account/password chưa
      await validateEmail(e);
      // 200 => login
      onEmailConfirmed(e);
    } catch (ex: any) {
      const status = ex?.response?.status;

      // 404 => chưa tồn tại / chưa xác nhận => gửi OTP
      if (status === 404) {
        await preRegister(e);
        onContinueToConfirm(e);
        return;
      }

      // 400 (email đã đăng ký & đã xác thực) => đi login luôn
      if (status === 400) {
        onEmailConfirmed(e);
        return;
      }

      setErr(ex?.response?.data?.message ?? ex?.message ?? "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="text-sm font-semibold text-slate-800">Email</div>
      <input
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
        placeholder="Nhập email"
        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200"
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
        {loading ? "Đang xử lý..." : "Tiếp tục"}
      </button>
    </div>
  );
}
