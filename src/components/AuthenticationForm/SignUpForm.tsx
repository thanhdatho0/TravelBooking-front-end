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

<<<<<<< HEAD
  const validateFullName = (name: string): boolean => {
    // Regex kiểm tra tên:
    // ^: Bắt đầu chuỗi
    // [\p{L}\s]+: Ít nhất một hoặc nhiều ký tự chữ cái (bao gồm Unicode như tiếng Việt) HOẶC khoảng trắng
    // $: Kết thúc chuỗi
    // u: cờ Unicode
    const regex = /^[\p{L}\s]{2,}$/u;

    // Loại bỏ khoảng trắng ở đầu/cuối trước khi kiểm tra độ dài và regex
    const trimmedName = name.trim();

    // Kiểm tra độ dài tối thiểu 2 ký tự VÀ khớp với regex (chỉ chứa chữ cái và khoảng trắng)
    return trimmedName.length >= 2 && regex.test(trimmedName);
  };

  const validateForm = (): boolean => {
    const emailResult = validateEmail(email);
    const passwordResult = validatePassword(password);
    const fullNameValid = validateFullName(fullName);

    // Nếu có lỗi → không cho submit
    if (!emailResult.isValid || !passwordResult.isValid || !fullNameValid) {
      return false;
    }
    return true;
  };

  // Xử lý submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Ngăn reload trang
    setSubmitAttempted(true);
    if (!validateForm()) {
      return; // Dừng lại nếu validate fail
=======
  const submit = async () => {
    if (password !== password2) {
      setErr("Mật khẩu nhập lại không khớp");
      return;
>>>>>>> e0a479b358b3510408cd8da52e3558f93b95a06a
    }

    try {
<<<<<<< HEAD
      const res = await fetch(
        "https://4ab83ec2e093.ngrok-free.app/api/Auth/pre-register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName, // Giả sử API cần field này
            email,
            password,
          }),
        }
      );
=======
      setErr(null);
      setLoading(true);

      await registerAccount({
        email: prefilledEmail,
        fullName: fullName.trim(),
        password,
      });
>>>>>>> e0a479b358b3510408cd8da52e3558f93b95a06a

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
