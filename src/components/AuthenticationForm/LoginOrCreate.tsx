// components/AuthenticationForm/LoginOrCreate.tsx
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import PolicyInsurence from "./PolicyInsurence";
import FormInput from "./FormInput";

type LoginOrCreateProps = {
  onEmailConfirmed: (email: string) => void; // Email đã tồn tại → chuyển LoginWithEmail
  onContinueToConfirm?: (email: string) => void; // Email mới → nhấn Tiếp tục → EmailConfirm
};

const LoginOrCreate = ({
  onEmailConfirmed,
  onContinueToConfirm,
}: LoginOrCreateProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buttonState, setButtonState] = useState<
    "disabled" | "checking" | "ready"
  >("disabled");

  // Theo dõi kết quả kiểm tra email từ FormInput
  const handleEmailExists = (exists: boolean, currentEmail: string) => {
    if (exists && currentEmail.trim()) {
      // Email đã tồn tại → tự động chuyển sang LoginWithEmail
      onEmailConfirmed(currentEmail.trim());
    } else if (!exists && currentEmail.trim()) {
      // Email chưa tồn tại → bật nút "Tiếp tục"
      setButtonState("ready");
    }
  };

  const handleContinue = async () => {
    if (buttonState !== "ready" || !email.trim()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(
        "https://4ab83ec2e093.ngrok-free.app/api/Auth/pre-register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Email: email.trim() }),
        }
      );

      if (res.ok) {
        onContinueToConfirm?.(email.trim());
      } else {
        const errorData = await res.json();
        alert(
          errorData.message || "Không thể gửi mã xác minh. Vui lòng thử lại."
        );
      }
    } catch (err) {
      console.error("Lỗi gọi API:", err);
      alert("Lỗi kết nối. Vui lòng kiểm tra mạng.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Khi người dùng gõ email
  const handleEmailChange = (value: string) => {
    setEmail(value);

    // Nếu email hợp lệ → chuyển sang trạng thái checking (FormInput sẽ tự gọi API)
    if (value.trim() && /^\S+@\S+\.\S+$/.test(value.trim())) {
      setButtonState("checking");
    } else {
      setButtonState("disabled");
    }
  };

  // Reset khi người dùng xóa/sửa email sai
  useEffect(() => {
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setButtonState("disabled");
    }
  }, [email]);

  return (
    <div className="w-[80%] mx-auto!">
      <div className="my-2!">
        <FormInput
          type="email"
          label="Email"
          value={email}
          onChange={handleEmailChange}
          required
          placeholder="yourname@example.com"
          onEmailExists={handleEmailExists} // ← Quan trọng: nhận kết quả kiểm tra tồn tại
        />

        {/* Nút Tiếp tục - siêu mượt */}
        <button
          type="button"
          onClick={handleContinue}
          disabled={buttonState !== "ready" || isSubmitting}
          className={`relative mt-8! mb-10! w-full py-3.5! rounded-full text-white font-semibold text-md transition-all duration-300 flex items-center justify-center gap-3 shadow-md
            ${
              buttonState === "disabled" || isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : buttonState === "checking"
                ? "bg-sky-500 cursor-wait"
                : "bg-sky-600 hover:bg-sky-700 hover:shadow-lg cursor-pointer"
            }`}
        >
          {/* Spinner khi đang kiểm tra */}
          {(buttonState === "checking" || isSubmitting) && (
            <svg
              className="w-5 h-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                className="opacity-25"
              />
              <path
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                className="opacity-75"
              />
            </svg>
          )}

          <span>
            {buttonState === "checking" ? "Đang kiểm tra..." : "Tiếp tục"}
          </span>
        </button>
      </div>

      {/* Divider "Hoặc" */}
      <div className="relative my-8!">
        <hr className="border-gray-300" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4! text-sm text-gray-500 font-medium">
          Hoặc
        </span>
      </div>

      {/* Login Google & Facebook */}
      <div className="flex gap-4 my-4!">
        <button className="flex-1 flex items-center justify-center gap-3 bg-white rounded-full border border-gray-200 shadow-md py-3! hover:shadow-lg transition-shadow">
          <FontAwesomeIcon icon={faGoogle} className="text-red-500" />
          <span className="font-medium">Google</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-3 bg-white rounded-full border border-gray-200 shadow-md py-3! hover:shadow-lg transition-shadow">
          <FontAwesomeIcon icon={faFacebook} className="text-blue-600" />
          <span className="font-medium">Facebook</span>
        </button>
      </div>

      <PolicyInsurence />
    </div>
  );
};

export default LoginOrCreate;
