import api from './api';
import { Review, ReviewSubmission } from '@/types';

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
}

// Submit a review (public endpoint - no authentication required)
export const submitReview = async (review: ReviewSubmission): Promise<{ message: string; id: number }> => {
  const { data } = await api.post('/reviews/submit', review);
  return data;
};

// Get approved reviews only (public endpoint)
export const getApprovedReviews = async (limit?: number, rating?: number): Promise<ReviewsResponse> => {
  const params = new URLSearchParams();
  
  if (limit) params.append('limit', limit.toString());
  if (rating) params.append('rating', rating.toString());

  const { data } = await api.get(`/reviews/approved?${params.toString()}`);
  return data;
};
