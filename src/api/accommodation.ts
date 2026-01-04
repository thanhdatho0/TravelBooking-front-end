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

function accomEndpoint() {
  const base = (api.defaults.baseURL ?? "").replace(/\/+$/, "");
  // Nếu baseURL đã là ".../api" thì chỉ cần "/Accommodation"
  if (/\/api$/i.test(base)) return "/Accommodation";
  // Nếu baseURL chỉ là "http://localhost:5252" thì cần "/api/Accommodation"
  return "/api/Accommodation";
}

export async function getTop8Accommodations(
  q?: string
): Promise<AccomSummaryDto[]> {
  const res = await api.get<PagedResult<AccomSummaryDto>>(accomEndpoint(), {
    params: {
      page: 1,
      pageSize: 10,
      sortBy: "rating",
      desc: true,
      q: q && q.trim() ? q.trim() : undefined, // map vào request.Q
    },
  });

  return res.data.items ?? [];
}
