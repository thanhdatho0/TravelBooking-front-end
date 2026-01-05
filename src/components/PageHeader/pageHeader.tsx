import "./pageHeader.css";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthFormWrapper from "../AuthenticationForm/AuthFormWrapper";
import { LogOut, User } from "lucide-react";

const isValidToken = (t: string | null) => {
  if (!t) return false;
  const s = t.trim();
  if (!s || s === "null" || s === "undefined") return false;
  // JWT thường có dạng: xxx.yyy.zzz
  return s.split(".").length === 3;
};

const clearAuthStorage = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("email");
  localStorage.removeItem("userName");
};

const PageHeader = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // ✅ chỉ logged in khi token hợp lệ
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() =>
    isValidToken(localStorage.getItem("accessToken"))
  );

  // dropdown
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

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

  const handleAuthSuccess = () => {
    // login() của bạn đã lưu token vào localStorage
    setIsLoggedIn(isValidToken(localStorage.getItem("accessToken")));
    setOpenMenu(false);
    closeModal();
  };

  const userEmail =
    localStorage.getItem("email") ||
    localStorage.getItem("userName") ||
    "Đã đăng nhập";

  const logout = () => {
    clearAuthStorage();
    setIsLoggedIn(false);
    setOpenMenu(false);
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.dispatchEvent(new Event("auth-changed"));
  };

  // ✅ dọn rác nếu trước đó từng lưu "undefined"/"null"/token lỗi
  useEffect(() => {
    const t = localStorage.getItem("accessToken");
    if (!isValidToken(t)) {
      clearAuthStorage();
      setIsLoggedIn(false);
    }
  }, []);

  // ✅ sync khi tab khác login/logout
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "accessToken") {
        setIsLoggedIn(isValidToken(localStorage.getItem("accessToken")));
        setOpenMenu(false);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // click outside -> đóng dropdown
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const el = menuRef.current;
      if (!el) return;
      if (openMenu && !el.contains(e.target as Node)) setOpenMenu(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [openMenu]);

  // ESC -> đóng dropdown
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="h-auto w-full bg-white items-center shadow-md flex justify-between px-10! py-1! sticky top-0 z-50">
        <Link
          to="/"
          className="shrink-0"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Về trang chủ"
          title="Về trang chủ"
        >
          <img
            src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v4.6.0/9/97f3e7a54e9c6987283b78e016664776.svg"
            alt="Traveloka"
            className="h-8 cursor-pointer select-none"
            draggable={false}
          />
        </Link>

        <div
          className="authen-btn flex gap-2 items-center relative"
          ref={menuRef}
        >
          {isLoggedIn ? (
            <>
              <button
                type="button"
                onClick={() => setOpenMenu((v) => !v)}
                className="user-icon-btn p-2! rounded-full border border-gray-300 hover:bg-gray-100 transition"
                title="Tài khoản của tôi"
                aria-haspopup="menu"
                aria-expanded={openMenu}
              >
                <User size={22} className="text-sky-600" />
              </button>

              {openMenu ? (
                <div
                  className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden"
                  role="menu"
                >
                  <div className="px-4 py-3 bg-sky-50 border-b border-sky-100">
                    <div className="text-sm font-extrabold text-slate-900">
                      Tài khoản
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5 truncate">
                      {userEmail}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full px-4 py-3 text-left hover:bg-slate-50 transition flex items-center gap-3"
                    onClick={() => {
                      setOpenMenu(false);
                      navigate("/profile");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    role="menuitem"
                  >
                    <span className="h-9 w-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700">
                      <User size={18} />
                    </span>
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        Thông tin cá nhân
                      </div>
                      <div className="text-xs text-slate-500">
                        Xem & cập nhật hồ sơ
                      </div>
                    </div>
                  </button>

                  <div className="h-px bg-slate-200" />

                  <button
                    type="button"
                    className="w-full px-4 py-3 text-left hover:bg-rose-50 transition flex items-center gap-3"
                    onClick={logout}
                    role="menuitem"
                  >
                    <span className="h-9 w-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-700">
                      <LogOut size={18} />
                    </span>
                    <div>
                      <div className="text-sm font-bold text-rose-700">
                        Thoát tài khoản
                      </div>
                      <div className="text-xs text-rose-600/80">
                        Đăng xuất khỏi hệ thống
                      </div>
                    </div>
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <>
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
                <span className="login-txt text-sm font-semibold">
                  Đăng Nhập
                </span>
              </button>

              <button
                type="button"
                onClick={openModal}
                className="signup-btn border border-solid rounded-sm border-sky-600 p-2! bg-sky-600 text-white hover:bg-sky-700 flex items-center hover:border-sky-700"
              >
                <span className="signup-txt text-sm font-semibold">
                  Đăng Ký
                </span>
              </button>
            </>
          )}
        </div>
      </header>

      <AuthFormWrapper
        key={isModalOpen ? "open" : "closed"}
        isOpen={isModalOpen}
        isClosing={isClosing}
        onClose={closeModal}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default PageHeader;
