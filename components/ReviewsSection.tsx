'use client';

import { useEffect, useState } from 'react';
import { Star, Quote, Loader2, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { getApprovedReviews } from '@/services/reviewService';
import { Review } from '@/types';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 3;

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getApprovedReviews(50); // Get up to 50 reviews
      setReviews(data.reviews);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#E2E8F0]'
            }`}
          />
        ))}
      </div>
    );
  };

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const startIndex = currentPage * reviewsPerPage;
  const displayedReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-br from-[#F8FAFC] to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#6366F1]" />
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null; // Don't show section if there are no reviews
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-[#F8FAFC] to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] mb-4">
            What Our Students Say
          </h2>
          <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
            Hear from our amazing students and parents about their learning journey with us
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {displayedReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-10 h-10 text-[#6366F1] opacity-20" />
              </div>

              {/* Rating */}
              <div className="mb-4">
                {renderStars(review.rating)}
              </div>

              {/* Review Message */}
              <p className="text-[#475569] leading-relaxed mb-6 flex-grow">
                "{review.message}"
              </p>

              {/* Reviewer Info */}
              <div className="pt-4 border-t border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-lg">
                      {review.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1E293B] truncate">
                      {review.name}
                    </p>
                    <p className="text-sm text-[#64748B] truncate">
                      {review.role}
                      {review.course_name && ` • ${review.course_name}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePrevious}
              className="p-2 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
              aria-label="Previous reviews"
            >
              <ChevronLeft className="w-5 h-5 text-[#64748B]" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentPage === index
                      ? 'bg-[#6366F1] w-8'
                      : 'bg-[#E2E8F0] hover:bg-[#CBD5E1]'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-2 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
              aria-label="Next reviews"
            >
              <ChevronRight className="w-5 h-5 text-[#64748B]" />
            </button>
          </div>
        )}

        {/* Review Count */}
        <div className="text-center mt-8">
          <p className="text-sm text-[#64748B] flex items-center justify-center gap-2">
            <MessageSquare className="w-4 h-4" />
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} from our community
          </p>
        </div>
      </div>
    </section>
  );
}
