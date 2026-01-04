import { api } from "./api";

export type ImageDto = { id: string; url?: string | null; alt?: string | null };

export type RoomDto = {
  id: string;
  name?: string | null;
  available?: boolean;
  breakfast?: boolean;
  rating?: number | null;
  price?: number | null;
  categoryId?: string | null;
  categoryName?: string | null;
  bedTypeName?: string | null;
};

export type RoomCategoryDto = {
  id: string;
  name?: string | null;
  about?: string | null;
  basicFacilities?: string[];
  roomFacilities?: string[];
  bathAmenities?: string[];
  images?: ImageDto[];
  rooms?: RoomDto[];
};

export type FacilityDto = any; // vì bạn chưa gửi shape, mình render an toàn
export type PolicyDto = any;
export type GeneralInfoDto = any;
export type ReviewDto = any;

export type AccomDetailDto = {
  id: string;
  name?: string | null;
  accomTypeName?: string | null;
  star?: number | null;
  rating?: number | null;
  description?: string | null;

  email?: string | null;
  phone?: string | null;
  address?: string | null;
  location?: string | null;
  ggMapsQuery?: string | null;

  generalInfo?: GeneralInfoDto | null;
  policy?: PolicyDto | null;

  facilities: FacilityDto[];
  images: ImageDto[];
  roomCategories: RoomCategoryDto[];
  reviews: ReviewDto[];
};

export async function getAccommodationDetail(id: string) {
  const res = await api.get<AccomDetailDto>(`/api/Accommodation/${id}`);
  return res.data;
}
