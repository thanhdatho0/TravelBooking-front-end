// components/FormInput.tsx
"use client";

import React, { useState, useEffect } from "react";
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
  showStrength?: boolean; // Chỉ cho password
  minLength?: number; // Tùy chọn: độ dài tối thiểu
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\d{10,11}$/; // VN: 10-11 số

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
}: FormInputProps) {
  const isControlled = externalValue !== undefined;
  const [internalValue, setInternalValue] = useState("");
  const value = isControlled ? externalValue : internalValue;

  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const inputId = id || name || `input-${type}`;
  const inputName = name || inputId;

  // Validate
  useEffect(() => {
    let newError: string | null = null;

    // 1. Lỗi trống → chỉ khi submit
    if (showEmptyErrorOnSubmit && required && !value.trim()) {
      newError = `${label || "Trường này"} không được để trống.`;
    }
    // 2. Lỗi định dạng → realtime
    else if (value.trim()) {
      // Email
      if (type === "email" && !emailRegex.test(value)) {
        newError = "Email không hợp lệ.";
      }
      // Phone
      else if (type === "tel" && !phoneRegex.test(value)) {
        newError = "Số điện thoại phải có 10-11 chữ số.";
      }
      // Min length
      else if (minLength && value.length < minLength) {
        newError = `Phải có ít nhất ${minLength} ký tự.`;
      }
      // Password strength (nếu bật)
      else if (type === "password" && showStrength) {
        const hasLetter = /[A-Za-z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value);
        const hasMinLength = value.length >= 8;

        if (!hasMinLength || !hasLetter || !hasNumber || !hasSymbol) {
          newError = "Mật khẩu cần chữ, số, ký tự đặc biệt và ít nhất 8 ký tự.";
        }
      }
    }

    setError(newError);
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
  };

  // Thanh độ mạnh (chỉ cho password)
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
          className={`w-full text-md outline outline-gray-400 focus:outline-sky-600 rounded-lg h-10 px-3! transition-all duration-200 ${
            type === "password" ? "pr-10!" : ""
          } ${error ? "outline-red-500 focus:outline-red-500" : ""}`}
        />

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

      {/* Thanh độ mạnh */}
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

      {/* Lỗi */}
      {error && (
        <p className="mt-1! text-sm text-red-600 animate-fade-in">{error}</p>
      )}
    </div>
  );
}
