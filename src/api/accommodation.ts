import { api } from "./api";

export type PagedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type AccomSummaryDto = {
  id: string;
  name: string;
  accomTypeId?: string | null;
  accomTypeName?: string | null;
  star?: number | null;
  rating?: number | null;
  address?: string | null;
  location?: string | null;
  coverImageId?: string | null;
  ggMapsQuery?: string | null;
  ll?: string | null;
  price: number; // decimal -> number khi ra JSON
};

// PagedQuery + AccomSearchRequest đều là query string
export async function getTop8Accommodations() {
  const res = await api.get<PagedResult<AccomSummaryDto>>(
    "/api/Accommodation",
    {
      params: { page: 1, pageSize: 8 },
    }
  );
  return res.data.items;
}
