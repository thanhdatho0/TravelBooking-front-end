// components/FormInput.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";

type InputType = "text" | "email" | "password" | "tel" | "number";

interface FormInputProps {
  value?: string;
  onChange?: (value: string) => void;
  type?: InputType;
  placeholder?: string;
  label?: string;
  name?: string;
  id?: string;
  className?: string;
  required?: boolean;
  showEmptyErrorOnSubmit?: boolean;
  showStrength?: boolean;
  minLength?: number;
  disabled?: boolean;
  // Thêm callback để thông báo email đã tồn tại cho form cha (nếu cần)
  onEmailExists?: (exists: boolean, email: string) => void;
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\d{10,11}$/;

export default function FormInput({
  value: externalValue,
  onChange,
  type = "text",
  placeholder = "",
  label,
  name,
  id,
  className = "",
  required = false,
  showEmptyErrorOnSubmit = false,
  showStrength = false,
  minLength,
  onEmailExists,
  disabled,
}: FormInputProps) {
  const isControlled = externalValue !== undefined;
  const [internalValue, setInternalValue] = useState("");
  const value = isControlled ? externalValue || "" : internalValue;

  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lastCheckedEmail, setLastCheckedEmail] = useState<string | null>(null);

  const debounceTimeout = useRef<number | null>(null);

  const inputId = id || name || `input-${type}`;
  const inputName = name || inputId;

  // Hàm gọi API kiểm tra email
  const validateEmailExists = async (email: string) => {
    if (!emailRegex.test(email)) return;

    setCheckingEmail(true);
    setSuccessMessage(null);
    setError(null);

    try {
      const res = await fetch(
        `https://4ab83ec2e093.ngrok-free.app/api/Auth/validate-email?email=${encodeURIComponent(
          email
        )}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
          },
        }
      );

      const text = await res.text(); // Backend trả text, không phải JSON

      if (res.ok) {
        // 200 → email đã tồn tại → hiển thị thông báo XANH + chặn đăng ký
        setSuccessMessage(text); // "Đã được xác nhận"
        onEmailExists?.(true, email);
      } else if (res.status === 404) {
        // 404 → email chưa tồn tại → cho phép đăng ký
        setSuccessMessage("Tiếp tục để đăng ký tài khoản"); // "Chưa xác nhận hoặc chưa tồn tại"
        onEmailExists?.(false, email);
      } else {
        setError("Lỗi kiểm tra email. Vui lòng thử lại.");
        setSuccessMessage(null);
      }
    } catch (err) {
      console.error("Lỗi kết nối:", err);
      setError("Không kết nối được đến server.");
      setSuccessMessage(null);
    } finally {
      setCheckingEmail(false);
    }
  };

  // Debounce kiểm tra email
  useEffect(() => {
    if (disabled) return;
    if (type !== "email" || !value.trim()) {
      return;
    }

    // Nếu có lỗi định dạng email → không gọi API
    if (!emailRegex.test(value)) {
      return;
    }

    if (lastCheckedEmail === value) return;

    // Clear timeout cũ
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Đặt timeout mới: chờ 600ms sau khi người dùng ngừng gõ
    debounceTimeout.current = setTimeout(() => {
      validateEmailExists(value);
      setLastCheckedEmail(value);
    }, 600);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [value, type, lastCheckedEmail]);

  // Validate các lỗi khác (trống, định dạng, độ mạnh password, minLength...)
  useEffect(() => {
    let newError: string | null = null;

    // 1. Lỗi trống (chỉ khi submit - giữ nguyên logic cũ)
    if (showEmptyErrorOnSubmit && required && !value.trim()) {
      newError = `${label || "Trường này"} không được để trống.`;
    }
    // 2. Lỗi định dạng realtime
    else if (value.trim()) {
      if (type === "email" && !emailRegex.test(value)) {
        newError = "Email không hợp lệ.";
      } else if (type === "tel" && !phoneRegex.test(value)) {
        newError = "Số điện thoại phải có 10-11 chữ số.";
      } else if (minLength && value.length < minLength) {
        newError = `Phải có ít nhất ${minLength} ký tự.`;
      } else if (type === "password" && showStrength) {
        const hasLetter = /[A-Za-z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value);
        const hasMinLength = value.length >= 8;

        if (!hasMinLength || !hasLetter || !hasNumber || !hasSymbol) {
          newError = "Mật khẩu cần chữ, số, ký tự đặc biệt và ít nhất 8 ký tự.";
        }
      }
      // Lỗi email tồn tại sẽ được set ở validateEmailExists → không ghi đè ở đây
    }

    // Chỉ setError nếu không phải lỗi "email đã tồn tại" (đã được xử lý riêng)
    if (!newError || !error?.includes("đã được sử dụng")) {
      setError(newError);
    }
  }, [
    value,
    type,
    required,
    showEmptyErrorOnSubmit,
    showStrength,
    minLength,
    label,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!isControlled) setInternalValue(newValue);
    onChange?.(newValue);

    // Reset lỗi email tồn tại khi người dùng thay đổi lại email
    if (type === "email" && error?.includes("đã được sử dụng")) {
      setError(null);
      setSuccessMessage(null);
    }
  };

  const getStrength = () => {
    if (!value || type !== "password") return 0;
    let s = 0;
    if (value.length >= 8) s++;
    if (/[A-Za-z]/.test(value)) s++;
    if (/\d/.test(value)) s++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value)) s++;
    return s;
  };

  const strength = getStrength();
  const strengthColor =
    strength <= 1
      ? "bg-red-500"
      : strength <= 2
      ? "bg-yellow-500"
      : strength <= 3
      ? "bg-blue-500"
      : "bg-green-500";

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1!"
        >
          {label}
          {required && <span className="text-red-600 ml-1!">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          type={inputType}
          id={inputId}
          name={inputName}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full text-md outline outline-gray-400 focus:outline-sky-600 rounded-lg h-10 px-3! transition-all duration-200 ${
            type === "password" ? "pr-10!" : ""
          } ${error ? "outline-red-500 focus:outline-red-500" : ""} ${
            disabled ? "bg-gray-100 cursor-not-allowed opacity-70" : ""
          }`}
        />

        {/* Loading spinner khi đang check email */}
        {type === "email" && checkingEmail && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-sky-600 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Eye icon cho password */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {/* Thanh độ mạnh mật khẩu */}
      {showStrength && type === "password" && value && (
        <div className="mt-2!">
          <div className="flex gap-1 h-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`flex-1 rounded-full transition-all ${
                  i <= strength ? strengthColor : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1!">
            {strength === 1 && "Yếu"}
            {strength === 2 && "Trung bình"}
            {strength === 3 && "Mạnh"}
            {strength === 4 && "Rất mạnh"}
          </p>
        </div>
      )}
      {/* Thông báo thành công - màu xanh dương */}
      {successMessage && !error && (
        <p className="mt-2! text-sm font-medium text-sky-600 flex items-center gap-2 animate-fade-in">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          {successMessage}
        </p>
      )}

      {/* Thông báo lỗi */}
      {error && (
        <p className="mt-1! text-sm text-red-600 animate-fade-in">{error}</p>
      )}
    </div>
  );
}
