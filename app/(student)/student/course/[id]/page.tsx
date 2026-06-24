'use client';

import { useEffect, useMemo, useState, use } from 'react';
import Link from 'next/link';
import { Loader2, Users, BookOpen, CheckCircle2, CreditCard, Play, Clock, Star, Award, FileText, Video } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { courseService } from '@/services/courseService';
import { enrollmentService } from '@/services/enrollmentService';
import { paymentService } from '@/services/paymentService';
import type { Course } from '@/types';

export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const courseId = Number(id);

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [courseRes, enrollRes] = await Promise.all([
          courseService.getCourseById(courseId),
          enrollmentService.checkEnrollment(courseId).catch(() => ({ enrolled: false })),
        ]);
        setCourse(courseRes.course || null);
        setEnrolled(!!enrollRes.enrolled);
        setEnrollmentData(enrollRes);
      } catch (error) {
        console.error('Failed to fetch course:', error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [courseId]);

  const instructorNames = useMemo(() => {
    if (!course?.instructors?.length) return course?.instructor_name || 'No instructor';
    return course.instructors.map((i) => i.name).join(', ');
  }, [course]);

  const handleEnroll = async () => {
    if (!course) return;

    try {
      setEnrollLoading(true);
      
      if (course.price > 0) {
        setShowPayment(true);
      } else {
        await enrollmentService.enrollCourse(courseId);
        setEnrolled(true);
        alert('Successfully enrolled in the free course!');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to enroll';
      alert(msg);
    } finally {
      setEnrollLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!course) return;

    try {
      setEnrollLoading(true);
      
      const enrollResult = await enrollmentService.enrollCourse(courseId, paymentMethod);
      
      if (enrollResult.payment) {
        // Handle payment redirect or confirmation
        alert('Payment successful! You are now enrolled in the course.');
        setEnrolled(true);
        setShowPayment(false);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Payment failed';
      alert(msg);
    } finally {
      setEnrollLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-[1200px] mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-[#1E88E5]" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-4 md:p-8 max-w-[1200px] mx-auto">
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <BookOpen className="size-12 text-[#E0E0E0] mx-auto mb-3" />
              <p className="text-sm text-[#78909C]">Course not found.</p>
              <Link href="/student/courses" className="inline-block mt-4">
                <Button variant="outline">Back to Courses</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto space-y-6">
      {/* Course Header */}
      <div className="space-y-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Course Info */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Title and Status */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#1E3A5F] mb-2">
                      {course.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-[#78909C]">
                      <div className="flex items-center gap-1">
                        <Users className="size-4" />
                        <span>{instructorNames}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="size-4" />
                        <span>{course.duration_value} {course.duration_unit}</span>
                      </div>
                      {course.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="size-4 fill-yellow-400 text-yellow-400" />
                          <span>{course.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      course.level === 'beginner' ? 'bg-[#EFF6FF] text-[#1E40AF]' :
                      course.level === 'intermediate' ? 'bg-[#FEF3C7] text-[#D97706]' :
                      'bg-[#FEE2E2] text-[#EC407A]'
                    }`}>
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </span>
                    {enrolled && (
                      <span className="px-3 py-1 text-sm font-medium bg-[#C5E1A5] text-[#1E88E5] rounded-full">
                        Enrolled
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar for Enrolled Students */}
                {enrolled && enrollmentData?.progress !== undefined && (
                  <div className="bg-[#FAFAFA] p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#1E3A5F]">Course Progress</span>
                      <span className="text-sm text-[#78909C]">{Math.round(enrollmentData.progress)}%</span>
                    </div>
                    <div className="w-full bg-[#E0E0E0] rounded-full h-3">
                      <div 
                        className="bg-[#1E88E5] h-3 rounded-full transition-all duration-300"
                        style={{ width: `${enrollmentData.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Description */}
                {course.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#1E3A5F] mb-2">About This Course</h3>
                    <p className="text-[#78909C] leading-relaxed">{course.description}</p>
                  </div>
                )}

                {/* What You'll Learn */}
                {course.what_you_learn && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#1E3A5F] mb-3">What You'll Learn</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {course.what_you_learn.split('\n').filter(item => item.trim()).map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="size-4 text-[#1E88E5] mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-[#78909C]">{item.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {course.requirements && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#1E3A5F] mb-3">Requirements</h3>
                    <div className="space-y-2">
                      {course.requirements.split('\n').filter(item => item.trim()).map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="size-2 bg-[#78909C] rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm text-[#78909C]">{item.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Enrollment/Payment Section */}
        {!enrolled && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-[#1E3A5F]">
                      {formatPrice(course.price)}
                    </h3>
                    <p className="text-sm text-[#78909C] mt-1">One-time payment</p>
                  </div>
                  
                  {!showPayment ? (
                    <Button
                      onClick={handleEnroll}
                      disabled={enrollLoading}
                      className="px-8 py-3 bg-[#1E88E5] text-white font-semibold rounded-lg hover:bg-[#1565C0] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enrollLoading ? (
                        <>
                          <Loader2 className="size-5 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {course.price > 0 ? (
                            <>
                              <CreditCard className="size-5 mr-2" />
                              Enroll Now
                            </>
                          ) : (
                            <>
                              <Play className="size-5 mr-2" />
                              Enroll Free
                            </>
                          )}
                        </>
                      )}
                    </Button>
                  ) : null}
                </div>

                {showPayment && (
                  <div className="space-y-4 pt-4 border-t border-[#E0E0E0]">
                    <h4 className="font-semibold text-[#1E3A5F]">Select Payment Method</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 border border-[#E0E0E0] rounded-lg cursor-pointer hover:bg-[#FAFAFA]">
                        <input
                          type="radio"
                          name="payment"
                          value="credit_card"
                          checked={paymentMethod === 'credit_card'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4 text-[#1E88E5]"
                        />
                        <CreditCard className="size-5 text-[#78909C]" />
                        <span className="text-sm text-[#1E3A5F]">Credit/Debit Card</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-[#E0E0E0] rounded-lg cursor-pointer hover:bg-[#FAFAFA]">
                        <input
                          type="radio"
                          name="payment"
                          value="upi"
                          checked={paymentMethod === 'upi'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4 text-[#1E88E5]"
                        />
                        <span className="text-sm text-[#1E3A5F]">UPI</span>
                      </label>
                    </div>
                    <Button
                      onClick={handlePayment}
                      disabled={enrollLoading}
                      className="w-full px-6 py-3 bg-[#1E88E5] text-white font-semibold rounded-lg hover:bg-[#1565C0] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enrollLoading ? (
                        <>
                          <Loader2 className="size-5 animate-spin mr-2" />
                          Processing Payment...
                        </>
                      ) : (
                        `Pay ${formatPrice(course.price)}`
                      )}
                    </Button>
                  </div>
                )}

                <div className="pt-4 border-t border-[#E0E0E0]">
                  <h4 className="font-semibold text-[#1E3A5F] mb-3">This course includes:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#78909C]">
                      <CheckCircle2 className="size-4 text-[#1E88E5]" />
                      <span>One-on-one mentoring sessions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#78909C]">
                      <CheckCircle2 className="size-4 text-[#1E88E5]" />
                      <span>Flexible scheduling</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#78909C]">
                      <CheckCircle2 className="size-4 text-[#1E88E5]" />
                      <span>Course materials and resources</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#78909C]">
                      <CheckCircle2 className="size-4 text-[#1E88E5]" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#78909C]">
                      <CheckCircle2 className="size-4 text-[#1E88E5]" />
                      <span>Lifetime access to course content</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {enrolled && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-[#C5E1A5] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="size-8 text-[#1E88E5]" />
                </div>
                <h3 className="text-xl font-bold text-[#1E3A5F]">You're Enrolled!</h3>
                <p className="text-[#78909C] mb-4">
                  Your instructor will schedule live classes for you. Check the Live Classes page for upcoming sessions.
                </p>
                <Link href="/student/live-classes">
                  <Button className="px-6 py-2 bg-gradient-to-r from-[#1E88E5] to-[#42A5F5] text-white font-semibold rounded-lg hover:from-[#1565C0] hover:to-[#1E88E5] transition-all">
                    <Video className="size-5 mr-2" />
                    View Live Classes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  function formatPrice(price: number) {
    return price === 0 ? 'Free' : `₹${price.toLocaleString()}`;
  }
}