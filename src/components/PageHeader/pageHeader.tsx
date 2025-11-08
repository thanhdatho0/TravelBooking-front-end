import "./pageHeader.css";
import { useState } from "react";
import AuthFormWrapper from "../AuthenticationForm/AuthFormWrapper";

const PageHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const openModal = () => {
    setIsClosing(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
    }, 250);
  };
  return (
    <>
      <header className="h-auto w-full bg-white items-center shadow-md flex justify-between px-10! py-1! sticky top-0 z-50">
        <img
          src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v4.6.0/9/97f3e7a54e9c6987283b78e016664776.svg"
          alt=""
        />
        <div className="authen-btn flex gap-2 items-center">
          <button
            type="button"
            onClick={openModal}
            className="login-btn flex gap-2 items-center border border-solid rounded-sm border-sky-600 p-1.5! hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6 login-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            <span className="login-txt text-sm font-semibold">Đăng Nhập</span>
          </button>
          <button
            type="button"
            onClick={openModal}
            className="signup-btn border border-solid rounded-sm border-sky-600 p-2! bg-sky-600 text-white hover:bg-sky-700 flex items-center hover:border-sky-700"
          >
            <span className="signup-txt text-sm font-semibold">Đăng Ký</span>
          </button>
        </div>
      </header>
      {/* Modal được điều khiển hoàn toàn từ header */}
      {/* TRUYỀN ĐỦ 3 PROPS */}
      <AuthFormWrapper
        isOpen={isModalOpen}
        isClosing={isClosing}
        onClose={closeModal}
      />
    </>
  );
};

export default PageHeader;
