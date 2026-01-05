import { api } from "./api";

export type UserPersonalInfoDto = {
  fullName: string;
  birthDate?: string | null; // DateOnly => "YYYY-MM-DD"
  sex?: boolean | null; // true/false
  email: string;
};

export type UserUpdateDto = {
  fullName: string;
  birthDate?: string | null;
  sex?: boolean | null;
};

export async function getUserById(id: string) {
  const res = await api.get<UserPersonalInfoDto>(`/api/User/${id}`);
  return res.data;
}

// Nếu backend bạn dùng PUT
export async function updateUser(id: string, body: UserUpdateDto) {
  const res = await api.put(`/api/User/${id}`, body);
  return res.data;
}
