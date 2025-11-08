// components/AuthenticationForm/mainForm.tsx
import { X } from "lucide-react";
import LoginOrCreate from "./LoginOrCreate";

type AuthFormWrapperProps = {
  isOpen: boolean;
  isClosing: boolean;
  onClose: () => void;
};

const AuthFormWrapper = ({
  isOpen,
  isClosing,
  onClose,
}: AuthFormWrapperProps) => {
  if (!isOpen && !isClosing) return null;
  return (
    <>
      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50! flex items-center justify-center px-4! ">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            style={{
              animation: isClosing
                ? "fadeOut 0.25s ease-in forwards"
                : "fadeIn 0.3s ease-out forwards",
            }}
          />

          {/* Modal Container */}
          <div
            className={`
            relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden
            ${isClosing ? "animate-scaleOut" : "animate-scaleIn"}
          `}
          >
            {/* Nút đóng */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-700 transition"
            >
              <X size={28} />
            </button>

            {/* Header hình nền + logo + tiêu đề */}
            <div className="relative h-32 bg-linear-to-b from-blue-50 to-white">
              <img
                src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v4.6.0/1/1b565658013540c18aeedebbba29af50.png"
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />

              <div className="absolute top-5 left-0 right-0 flex justify-center">
                <img
                  src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v4.6.0/0/0a5d39e04e4c92fd9af2924ed555cdda.svg"
                  alt="Traveloka"
                  className="h-15"
                />
              </div>

              <div className="absolute bottom-4 left-0 right-0 text-center">
                <h4 className="text-lg font-semibold text-gray-800">
                  Đăng nhập hoặc tạo tài khoản mới!
                </h4>
              </div>
            </div>
            <LoginOrCreate />
          </div>
        </div>
      )}
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes scaleOut {
          to   { opacity: 0; transform: scale(0.9); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes fadeOut {
          to   { opacity: 0; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
        .animate-scaleOut {
          animation: scaleOut 0.25s ease-in forwards;
        }
      `}</style>
    </>
  );
};

export default AuthFormWrapper;
