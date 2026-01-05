import { api } from "./api";

// Cập nhật Type khớp 100% với C# ImageDto
export type ImageDto = {
  id: string; // Guid -> string
  url?: string | null; // string? -> string | null
  alt?: string | null; // string? -> string | null
  createdAt: string; // DateTime -> string
  modifyAt?: string | null; // DateTime? -> string | null
  updateBy?: string | null; // string? -> string | null
};

// Hàm gọi API lấy chi tiết ảnh theo ID
export async function getImageById(id: string) {
  const res = await api.get<ImageDto>(`/api/Image/${id}`);
  return res.data;
}
