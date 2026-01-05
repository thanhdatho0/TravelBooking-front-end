// components/AuthenticationForm/SignUpForm.tsx
import { useState } from "react";
import { registerAccount } from "../../api/auth";

export default function SignUpForm({
  prefilledEmail,
  onBack,
  onSignUpSuccess,
}: {
  prefilledEmail: string;
  onBack: () => void;
  onSignUpSuccess: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    if (password !== password2) {
      setErr("Mật khẩu nhập lại không khớp");
      return;
    }

    try {
      setErr(null);
      setLoading(true);

      await registerAccount({
        email: prefilledEmail,
        fullName: fullName.trim(),
        password,
      });

      onSignUpSuccess(); // đóng modal + set logged in (nếu bạn muốn login luôn thì gọi login ở đây)
    } catch (ex: any) {
      // backend bạn có thể trả Errors array, mình ưu tiên message trước
      const msg =
        ex?.response?.data?.message ??
        (Array.isArray(ex?.response?.data)
          ? JSON.stringify(ex.response.data)
          : null) ??
        ex?.message ??
        "Đăng ký thất bại";
      setErr(String(msg));
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
        Email: <b>{prefilledEmail}</b>
      </div>

      <div className="mt-4 space-y-3">
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Họ và tên"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu"
          type="password"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200"
        />
        <input
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          placeholder="Nhập lại mật khẩu"
          type="password"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200"
        />
      </div>

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
        {loading ? "Đang đăng ký..." : "Hoàn tất đăng ký"}
      </button>
    </div>
  );
}
