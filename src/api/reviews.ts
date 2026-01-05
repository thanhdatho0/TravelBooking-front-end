// src/api/reviews.ts
import { api, withApiPrefix } from "./api";

export type ReviewDto = {
  id: string;
  rating?: number | null;
  review?: string | null;

  createdAt: string;
  createdBy?: string | null;
  userId?: string | null;
  userName?: string | null;
  accomId?: string | null;
};

export type ReviewCreateDto = {
  rating?: number | null;
  review?: string | null;
};
export type ReviewUpdateDto = {
  rating?: number | null;
  review?: string | null;
};

function authHeader() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getReviewsByAccommodation(accomId: string) {
  const res = await api.get<ReviewDto[]>(
    withApiPrefix(`/ReviewsAndRating/Accommodations/${accomId}`)
  );
  return res.data ?? [];
}

export async function createReview(accomId: string, payload: ReviewCreateDto) {
  const res = await api.post<string>(
    withApiPrefix(`/ReviewsAndRating/Accommodations/${accomId}`),
    payload,
    { headers: authHeader() }
  );
  return res.data;
}

export async function updateReview(reviewId: string, payload: ReviewUpdateDto) {
  await api.put(withApiPrefix(`/ReviewsAndRating/${reviewId}`), payload, {
    headers: authHeader(),
  });
}

export async function deleteReview(reviewId: string) {
  await api.delete(withApiPrefix(`/ReviewsAndRating/${reviewId}`), {
    headers: authHeader(),
  });
}
