import React, { useState, useRef, useEffect } from "react";
import BackBtn from "./BackBtn";

const EmailConfirm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Chỉ cho phép 1 số hoặc rỗng

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Tự động focus ô tiếp theo nếu có
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);
    const newPin = pastedData.padEnd(4, "").split("").slice(0, 4);
    setPin(newPin);
    // Focus ô cuối cùng có dữ liệu
    const lastIndex = newPin.findIndex((d) => d === "") - 1;
    const focusIndex = lastIndex >= 0 ? lastIndex : 3;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);

    // Giả lập API call
    setTimeout(() => {
      alert("Đăng nhập thành công!");
      setIsSubmitting(false);
    }, 1000);
  };

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 4);
  }, []);
  return (
    <div className="w-[80%] mx-auto!">
      <form onSubmit={handleSubmit} className="my-2!">
        <div>
          <label htmlFor="confirm-pinput" className="my-2!">
            Vui lòng nhập mã xác minh chúng tôi đã gửi tới thanhdatho0@gmail.com
          </label>
        </div>

        <div className="flex gap-5 justify-center my-10!">
          {pin.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              name="confirm-pinput"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`
            w-14 h-14 
            text-center text-2xl font-semibold
            border-2 rounded-lg
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600
            ${digit ? "border-sky-600" : "border-gray-300"}
            ${digit ? "text-gray-900" : "text-gray-400"}
            caret-transparent
            focus:caret-transparent
          `}
              placeholder="-"
            />
          ))}
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
            "Xác thực"
          )}
        </button>
        <button className="text-sky-600 text-md font-semibold text-center w-full py-3.5! my-2! rounded-full bg-sky-100 shadow-md cursor-pointer hover:shadow-lg hover:bg-sky-200 transition-shadow">
          Đợi 0s gửi lại mã xác minh
        </button>
      </form>

      <BackBtn />
    </div>
  );
};

export default EmailConfirm;
