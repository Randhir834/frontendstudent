'use client';

import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary mb-2">Payment Successful</h1>
        <p className="text-xs sm:text-sm text-text-muted mb-6">Thank you for your purchase.</p>
      </div>
      
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader><CardTitle>Enrollment Confirmed</CardTitle></CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm text-text-muted mb-4 text-center">You are now enrolled in the course.</p>
            <div className="flex flex-col gap-3">
              <Link href="/student/learn" className="w-full">
                <Button className="w-full">Start Learning</Button>
              </Link>
              <Link href="/student/my-courses" className="w-full">
                <Button variant="outline" className="w-full">My Courses</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
