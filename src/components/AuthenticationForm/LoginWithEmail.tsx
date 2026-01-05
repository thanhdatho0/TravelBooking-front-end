// components/AuthenticationForm/LoginWithEmail.tsx
import { useState } from "react";
import { login } from "../../api/auth";

export default function LoginWithEmail({
  prefilledEmail,
  onBack,
  onLoginSuccess,
}: {
  prefilledEmail: string;
  onBack: () => void;
  onLoginSuccess: () => void;
}) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    try {
      setErr(null);
      setLoading(true);

      // ✅ FIX: backend cần userNameOrEmail
      await login({
        userNameOrEmail: prefilledEmail.trim(),
        password,
      });

      onLoginSuccess();
    } catch (ex: any) {
      setErr(
        ex?.response?.data?.Message ??
          ex?.response?.data?.message ??
          ex?.message ??
          "Sai tài khoản/mật khẩu"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <button className="text-sky-700 font-bold" onClick={onBack}>
        ← Quay lại
      </button>

      <div className="mt-3 text-sm text-slate-600">
        Đăng nhập với: <b>{prefilledEmail}</b>
      </div>

      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mật khẩu"
        type="password"
        className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200"
      />

      {err ? (
        <div className="mt-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3">
          {err}
        </div>
      ) : null}

      <button
        type="button"
        onClick={submit}
        disabled={loading}
        className="mt-4 w-full rounded-xl bg-sky-600 text-white font-bold py-3 hover:bg-sky-700 disabled:opacity-60"
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </div>
  );
}
