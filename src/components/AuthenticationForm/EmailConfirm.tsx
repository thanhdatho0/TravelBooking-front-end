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
<<<<<<< HEAD
      const res = await fetch(
        "https://4ab83ec2e093.ngrok-free.app/api/Auth/verify-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Email: email, Code: code }),
        }
      );

      if (res.ok) {
        alert("Xác thực thành công!");
        onSuccess?.();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Xác thực thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Lỗi gọi API:", err);
      alert("Lỗi kết nối. Vui lòng kiểm tra mạng.");
=======
      setErr(null);
      setLoading(true);
      await verifyEmail(email, code.trim());
      onSuccess();
    } catch (ex: any) {
      setErr(ex?.response?.data ?? ex?.message ?? "OTP không đúng");
>>>>>>> e0a479b358b3510408cd8da52e3558f93b95a06a
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
<<<<<<< HEAD
      const res = await fetch(
        "https://4ab83ec2e093.ngrok-free.app/api/Auth/pre-register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Email: email }),
        }
      );

      if (res.ok) {
        alert("Đã gửi lại mã xác minh!");
        setCountdown(30); // Reset countdown
        setCanResend(false);
      } else {
        alert("Không thể gửi lại mã. Vui lòng thử lại.");
      }
    } catch (err) {
      alert("Lỗi kết nối.");
    } finally {
      setIsResending(false);
=======
      setErr(null);
      await preRegister(email);
    } catch (ex: any) {
      setErr(
        ex?.response?.data?.message ?? ex?.message ?? "Không thể gửi lại mã"
      );
>>>>>>> e0a479b358b3510408cd8da52e3558f93b95a06a
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
