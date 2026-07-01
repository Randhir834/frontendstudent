'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShoppingCart, CreditCard, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { courseService } from '@/services/courseService';
import { useAuth } from '@/hooks/useAuth';
import { useRazorpay } from '@/hooks/useRazorpay';
import type { Course } from '@/types';
import toast from 'react-hot-toast';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');
  
  const { user, isAuthenticated } = useAuth();
  const { isLoaded, isProcessing, initiatePayment } = useRazorpay();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!courseId) {
      setError('Course not specified');
      setLoading(false);
      return;
    }

    if (isAuthenticated) {
      fetchCourse();
    }
  }, [courseId, isAuthenticated]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await courseService.getCourseById(Number(courseId));
      setCourse(response.course);
    } catch (error: any) {
      console.error('Failed to fetch course:', error);
      setError(error.response?.data?.error || 'Failed to load course details');
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!course || !user) return;

    if (course.price === 0) {
      toast.error('This is a free course. You can enroll directly.');
      router.push(`/student/course/${course.id}`);
      return;
    }

    await initiatePayment(
      course.id,
      course.title,
      course.price,
      { name: user.name, email: user.email },
      (enrollment) => {
        // Success - redirect to course page
        toast.success('Enrollment successful!');
        router.push(`/student/my-courses/${course.id}`);
      },
      (error) => {
        // Failure handled in hook
        console.error('Payment failed:', error);
      }
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error || 'Course not found'}</p>
          <button
            onClick={() => router.push('/student/courses')}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  const platformFee = 0; // No platform fee
  const tax = 0; // Tax can be added based on requirements
  const totalAmount = course.price + platformFee + tax;

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 rounded-2xl blur-3xl opacity-30 -z-10"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Checkout
            </h1>
          </div>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 ml-0 sm:ml-14">
            Complete your purchase to start learning
          </p>
        </div>
      </div>

      {/* Course Details */}
      <div className="relative bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-200 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 rounded-2xl opacity-50"></div>
        <div className="relative">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4">Course Details</h2>
          <div className="flex gap-4">
            {course.thumbnail_url ? (
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-cover rounded-xl flex-shrink-0 shadow-md"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              </div>
            )}
            <div className="flex-1 space-y-2">
              <h3 className="font-bold text-base sm:text-lg md:text-xl text-gray-800">{course.title}</h3>
              {course.description && (
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                  {course.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-medium">
                  {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </span>
                {course.category_name && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg font-medium">
                    {course.category_name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="relative bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-200 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 rounded-2xl opacity-50"></div>
        <div className="relative space-y-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Payment Summary</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-gray-600">Course Price</span>
              <span className="font-semibold text-gray-800">₹{course.price.toLocaleString()}</span>
            </div>
            {platformFee > 0 && (
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">Platform Fee</span>
                <span className="font-semibold text-gray-800">₹{platformFee.toLocaleString()}</span>
              </div>
            )}
            {tax > 0 && (
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold text-gray-800">₹{tax.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="border-t border-gray-300 pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-base sm:text-lg font-bold text-gray-800">Total Amount</span>
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 bg-clip-text text-transparent">
                ₹{totalAmount.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing || !isLoaded}
              className="w-full px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : !isLoaded ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Pay ₹{totalAmount.toLocaleString()}
                </>
              )}
            </button>
          </div>

          <div className="p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs sm:text-sm text-blue-800">
              <strong className="block mb-1">100% Secure Payment</strong>
              Your payment information is encrypted and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
