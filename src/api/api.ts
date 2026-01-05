// src/api/api.ts
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

/**
 * Instance chính dùng cho toàn bộ API
 */
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL, // ví dụ: https://xxxx.ngrok-free.app  hoặc https://xxxx.ngrok-free.app/api
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Helper: build route đúng nếu baseURL có/không có "/api"
 * - Nếu baseURL đã có /api => return path
 * - Nếu baseURL chưa có /api => tự thêm /api
 */
export function withApiPrefix(path: string) {
  const base = (api.defaults.baseURL ?? "").replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  if (/\/api$/i.test(base)) return p;
  return `/api${p}`;
}

// ===== Public endpoints (không cần token) =====
const PUBLIC_ENDPOINTS = [
  "/Auth/login",
  "/Auth/register",
  "/Auth/admin-register",
  "/Auth/refresh",
];

const isPublicEndpoint = (url?: string) => {
  if (!url) return false;
  const u = url.toLowerCase();
  return PUBLIC_ENDPOINTS.some((p) => u.includes(p.toLowerCase()));
};

// ===== REQUEST INTERCEPTOR =====
api.interceptors.request.use(
  (config) => {
    // 1) Ngrok skip warning (bắt buộc nếu bạn bị chặn)
    config.headers = config.headers ?? {};
    (config.headers as any)["ngrok-skip-browser-warning"] = "69420";

    // 2) Clean params: xóa undefined hoặc ""
    if (config.params) {
      Object.keys(config.params).forEach((k) => {
        const v = (config.params as any)[k];
        if (v === undefined || v === "") delete (config.params as any)[k];
      });
    }

    // 3) Gắn Bearer token nếu có và không phải public endpoint
    const token = localStorage.getItem("accessToken");
    if (token && !isPublicEndpoint(config.url)) {
      (config.headers as any).Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===== RESPONSE INTERCEPTOR (refresh token + queue) =====
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const originalRequest = err.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // nếu không có response => network error
    if (!err.response) return Promise.reject(err);

    // chỉ xử lý 401
    if (err.response.status !== 401) return Promise.reject(err);

    // không retry refresh/login/register
    if (isPublicEndpoint(originalRequest.url)) return Promise.reject(err);

    // đã retry 1 lần rồi thì thôi
    if (originalRequest._retry) return Promise.reject(err);

    // đang refresh -> đưa request vào queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers = originalRequest.headers ?? {};
            (originalRequest.headers as any).Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) throw new Error("No tokens available");

      // ✅ Dùng axios instance MỚI để tránh circular dependency
      const refreshUrl = `${API_BASE_URL}${withApiPrefix("/Auth/refresh")}`;

      const refreshRes = await axios.post(
        refreshUrl,
        { accessToken, refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      const newTokens = refreshRes.data as {
        accessToken: string;
        refreshToken: string;
      };

      localStorage.setItem("accessToken", newTokens.accessToken);
      localStorage.setItem("refreshToken", newTokens.refreshToken);

      // set default header cho instance
      api.defaults.headers.common.Authorization = `Bearer ${newTokens.accessToken}`;

      processQueue(null, newTokens.accessToken);

      // retry request cũ
      originalRequest.headers = originalRequest.headers ?? {};
      (
        originalRequest.headers as any
      ).Authorization = `Bearer ${newTokens.accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      // xoá token + điều hướng (tuỳ bạn)
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("email");
      localStorage.removeItem("userName");

      window.location.href = "/signin";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
