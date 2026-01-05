// src/api/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ví dụ: http://localhost:5252  HOẶC http://localhost:5252/api
  timeout: 60000,
});

// helper: build route đúng nếu baseURL có/không có "/api"
export function withApiPrefix(path: string) {
  const base = (api.defaults.baseURL ?? "").replace(/\/+$/, "");
  if (/\/api$/i.test(base)) return path.startsWith("/") ? path : `/${path}`;
  // baseURL chưa có /api => thêm /api
  const p = path.startsWith("/") ? path : `/${path}`;
  return `/api${p}`;
}

// gắn token nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
