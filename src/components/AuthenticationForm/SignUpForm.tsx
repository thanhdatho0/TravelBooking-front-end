import FormInput from "./FormInput";
import { useState } from "react";
import { validateEmail } from "../../utils/validateEmail";
import { validatePassword } from "../../utils/validatePassword";
import BackBtn from "./BackBtn";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const validateForm = (): boolean => {
    const emailResult = validateEmail(email);
    const passwordResult = validatePassword(password);

    // Nếu có lỗi → không cho submit
    if (!emailResult.isValid || !passwordResult.isValid) {
      return false;
    }
    return true;
  };

  // Xử lý submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Ngăn reload trang
    setSubmitAttempted(true);
    if (!validateForm()) {
      return; // Dừng lại nếu validate fail
    }

    setIsSubmitting(true);

    // Giả lập API call
    setTimeout(() => {
      console.log("Đăng nhập thành công:", { email, password });
      alert("Đăng nhập thành công!");
      setIsSubmitting(false);
    }, 1000);
  };
  return (
    <div className="w-[80%] mx-auto!">
      <h1 className="text-2xl my-5!">Đăng ký tài khoản</h1>
      <form onSubmit={handleSubmit} className="">
        <div className="my-5!">
          <FormInput
            label="Email"
            type="email"
            placeholder="Ví dụ: yourname@gmail.com.vn"
            value={email}
            onChange={setEmail}
            required
            showEmptyErrorOnSubmit={submitAttempted}
          />
        </div>
        <div className="my-4!">
          <FormInput
            label="Họ và tên"
            type="text"
            placeholder="Nhập họ và tên của bạn"
            required
            showEmptyErrorOnSubmit={submitAttempted}
          />
          <p className="text-[0.75rem] text-gray-400">
            Để có thông tin đặt phòng chính xác, vui lòng đảm bảo rằng thông tin
            đó chính xác như được ghi trong ID/Hộ chiếu do chính phủ cấp.
          </p>
        </div>
        <div className="my-4!">
          <FormInput
            type="password"
            label="Mật khẩu"
            value={password}
            onChange={setPassword}
            required
            showStrength
            showEmptyErrorOnSubmit={submitAttempted}
            placeholder="Nhập mật khẩu của bạn"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`text-white text-md font-semibold text-center w-full py-3.5! my-2! rounded-full shadow-md cursor-pointer transition-all ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-sky-600 hover:shadow-lg hover:bg-sky-800"
          }`}
        >
          {isSubmitting ? (
            <svg
              aria-hidden="true"
              className="w-8 h-8 m-auto! text-gray-200 animate-spin dark:text-gray-600 fill-sky-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          ) : (
            "Đăng ký"
          )}
        </button>
      </form>

      <BackBtn />
    </div>
  );
};

export default SignUpForm;
