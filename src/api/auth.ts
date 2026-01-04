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

// AuthResponse backend bạn trả về (mình để linh hoạt)
export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  userId: string;
  userName: string;
  email: string;
};

export async function validateEmail(email: string) {
  return api.get<string>(withApiPrefix("/Auth/validate-email"), {
    params: { email },
  });
}

export async function preRegister(email: string) {
  return api.post(withApiPrefix("/Auth/pre-register"), {
    email,
  } satisfies PreRegisterDto);
}

export async function verifyEmail(email: string, code: string) {
  return api.post(withApiPrefix("/Auth/verify-email"), {
    email,
    code,
  } satisfies VerifyEmailDto);
}

export async function registerAccount(payload: RegisterRequest) {
  return api.post(withApiPrefix("/Auth/register"), payload);
}

export async function login(payload: LoginRequest) {
  const res = await api.post<AuthResponse>(
    withApiPrefix("/Auth/login"),
    payload
  );
  const dto = res.data;

  // lưu token (tên token có thể khác nhau tùy backend)
  const access = dto.accessToken ?? "";
  const refresh = dto.refreshToken ?? "";

  if (access) localStorage.setItem("accessToken", access);
  if (refresh) localStorage.setItem("refreshToken", refresh);

  return dto;
}
