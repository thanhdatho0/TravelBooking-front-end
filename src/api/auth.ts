// src/api/auth.ts
import { api, withApiPrefix } from "./api";

export type PreRegisterDto = { email: string };
export type VerifyEmailDto = { email: string; code: string };

export type RegisterRequest = {
  email: string;
  fullName: string;
  password: string;
};

export type LoginRequest = {
  userNameOrEmail: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  userId: string;
  userName: string;
  email: string;
};

function pickMessage(data: any): string | undefined {
  // backend của bạn hay trả { Message: "..." }
  return (
    data?.message ??
    data?.Message ??
    (typeof data === "string" ? data : undefined)
  );
}

/** GET: /api/Auth/validate-email?email=... */
export async function validateEmail(email: string): Promise<string> {
  const res = await api.get<string>("/api/Auth/validate-email", {
    params: { email },
  });
  // có thể backend trả string trực tiếp
  return (res.data as any) ?? "OK";
}

/** POST: /api/Auth/pre-register */
export async function preRegister(
  email: string
): Promise<{ message?: string; email?: string }> {
  const res = await api.post("/api/Auth/pre-register", {
    email,
  } satisfies PreRegisterDto);
  return {
    message: pickMessage(res.data),
    email: (res.data as any)?.email ?? email,
  };
}

/** POST: /api/Auth/verify-email */
export async function verifyEmail(
  email: string,
  code: string
): Promise<string> {
  const res = await api.post("/api/Auth/verify-email", {
    email,
    code,
  } satisfies VerifyEmailDto);
  return pickMessage(res.data) ?? "Xác thực email thành công";
}

/** POST: /api/Auth/register */
export async function registerAccount(
  payload: RegisterRequest
): Promise<string> {
  const res = await api.post("/api/Auth/register", payload);
  return pickMessage(res.data) ?? "Đăng ký thành công";
}

/** POST: /api/Auth/login  -> lưu token + userId */
export async function login(payload: LoginRequest) {
  const res = await api.post<AuthResponse>(
    withApiPrefix("/Auth/login"),
    payload
  );
  const dto = res.data;

  if (dto.accessToken) localStorage.setItem("accessToken", dto.accessToken);
  if (dto.refreshToken) localStorage.setItem("refreshToken", dto.refreshToken);

  // (khuyến nghị) lưu thêm để header/menu dùng
  if (dto.userId) localStorage.setItem("userId", dto.userId);
  if (dto.email) localStorage.setItem("email", dto.email);
  if (dto.userName) localStorage.setItem("userName", dto.userName);

  // ✅ quan trọng: báo cho UI biết auth đã thay đổi (cùng tab)
  window.dispatchEvent(new Event("auth-changed"));

  return dto;
}
/** optional: logout */
export function logoutLocal() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("email");
  localStorage.removeItem("userName");

  window.dispatchEvent(new Event("auth-changed"));
}
