import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function CourseNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg text-center">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h1>
        <p className="text-gray-600 mb-6">
          The course you're looking for doesn't exist or has been removed.
        </p>
        <div className="space-y-3">
          <Link 
            href="/courses"
            className="block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Browse All Courses
          </Link>
          <Link 
            href="/"
            className="block px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
