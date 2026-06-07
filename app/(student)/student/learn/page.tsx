import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Link from 'next/link';

export default function StudentLearnPage() {
  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary">Learning</h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">Select a course to start learning.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader><CardTitle>My Enrolled Courses</CardTitle></CardHeader>
        <CardContent>
          <div className="text-center py-6 sm:py-8">
            <p className="text-xs sm:text-sm text-text-muted mb-4">Your enrolled courses and lessons will appear here.</p>
            <Link 
              href="/student/my-courses" 
              className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm text-primary-500 hover:text-primary-600 font-medium bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors min-h-[44px] sm:min-h-0"
            >
              View My Courses →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
