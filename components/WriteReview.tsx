'use client';

import { useState } from 'react';
import { Star, Send, Loader2, CheckCircle } from 'lucide-react';
import { submitReview } from '@/services/reviewService';

export default function WriteReview() {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    rating: 5,
    message: '',
    email: '',
    phone: '',
    courseName: '',
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleRatingClick = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.role.trim()) {
      setError('Role is required');
      return;
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setError('Review message must be at least 10 characters long');
      return;
    }

    try {
      setLoading(true);
      await submitReview({
        name: formData.name.trim(),
        role: formData.role.trim(),
        rating: formData.rating,
        message: formData.message.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        courseName: formData.courseName.trim() || undefined,
      });
      
      setSuccess(true);
      // Reset form
      setFormData({
        name: '',
        role: '',
        rating: 5,
        message: '',
        email: '',
        phone: '',
        courseName: '',
      });

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-[#F8FAFC] to-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] mb-4">
            Write a Review
          </h2>
          <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
            Share your experience with us! Your feedback helps us improve and helps others make informed decisions.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[#E2E8F0] p-6 sm:p-8">
          {success && (
            <div className="mb-6 p-4 bg-[#D1FAE5] border border-[#6EE7B7] rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-[#059669] flex-shrink-0" />
              <p className="text-[#065F46] text-sm">
                Thank you for your review! It will be visible after admin approval.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-[#FEE2E2] border border-[#FCA5A5] rounded-lg">
              <p className="text-[#991B1B] text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-2">
                  Your Name <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-2">
                  Your Role <span className="text-[#EF4444]">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select your role</option>
                  <option value="Student">Student</option>
                  <option value="Parent">Parent</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Alumni">Alumni</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-2">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Course Name */}
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-2">
                Course Name (Optional)
              </label>
              <input
                type="text"
                value={formData.courseName}
                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                placeholder="Which course did you take?"
                className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-3">
                Your Rating <span className="text-[#EF4444]">*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-10 h-10 transition-colors ${
                        star <= (hoveredRating || formData.rating)
                          ? 'fill-[#F59E0B] text-[#F59E0B]'
                          : 'text-[#E2E8F0]'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-[#64748B] mt-2">
                {formData.rating === 5 && 'Excellent!'}
                {formData.rating === 4 && 'Very Good!'}
                {formData.rating === 3 && 'Good'}
                {formData.rating === 2 && 'Fair'}
                {formData.rating === 1 && 'Needs Improvement'}
              </p>
            </div>

            {/* Review Message */}
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-2">
                Your Review <span className="text-[#EF4444]">*</span>
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Share your experience with us... (minimum 10 characters)"
                rows={5}
                className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all resize-none"
                required
                minLength={10}
              />
              <p className="text-xs text-[#64748B] mt-1">
                {formData.message.length} / 10 characters minimum
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-semibold rounded-lg hover:from-[#4F46E5] hover:to-[#7C3AED] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Review
                </>
              )}
            </button>

            <p className="text-xs text-[#64748B] mt-4">
              Your review will be reviewed by our team before being published on the website.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
