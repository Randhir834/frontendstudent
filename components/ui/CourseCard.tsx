'use client';

import Link from 'next/link';
import { BookOpen, Users, Clock, Star, Edit, Trash2, Eye, Play, CheckCircle2 } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from './Card';
import Button from './Button';
import type { Course } from '@/types';

interface CourseCardProps {
  course: Course;
  userRole: 'admin' | 'instructor' | 'student';
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
  deleting?: boolean;
  showActions?: boolean;
  linkPrefix?: string;
}

export default function CourseCard({ 
  course, 
  userRole, 
  onDelete, 
  onEdit, 
  deleting = false, 
  showActions = true,
  linkPrefix = ''
}: CourseCardProps) {
  const statusColors = {
    published: 'bg-[#C5E1A5] text-[#1E88E5]',
    archived: 'bg-[#FAFAFA] text-[#78909C]',
  };

  const levelColors = {
    beginner: 'bg-[#EFF6FF] text-[#1E40AF]',
    intermediate: 'bg-[#FEF3C7] text-[#D97706]',
    advanced: 'bg-[#FEE2E2] text-[#EC407A]',
  };

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `₹${price.toLocaleString()}`;
  };

  const formatDuration = (value: number, unit: string) => {
    return `${value} ${unit}${value > 1 ? '' : ''}`;
  };

  const instructorNames = course.instructors?.map(i => i.name).join(', ') || course.instructor_name || 'No instructor';

  const getViewLink = () => {
    if (userRole === 'admin') return `${linkPrefix}/admin/courses/${course.id}`;
    if (userRole === 'instructor') return `${linkPrefix}/instructor/courses/${course.id}`;
    // For enrolled courses, link to my-courses route to show slots
    // For browse courses, link to course route (no slots)
    if (course.is_enrolled) {
      return `${linkPrefix}/student/my-courses/${course.id}`;
    }
    return `${linkPrefix}/student/course/${course.id}`;
  };

  const getEditLink = () => {
    if (userRole === 'admin') return `${linkPrefix}/admin/courses/${course.id}/edit`;
    if (userRole === 'instructor') return `${linkPrefix}/instructor/courses/${course.id}/edit`;
    return null;
  };

  return (
    <Link href={getViewLink()}>
      <div className="group h-full flex flex-col bg-white rounded-2xl border border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
        <div className="relative overflow-hidden">
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-40 sm:h-44 md:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-40 sm:h-44 md:h-48 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center transition-all duration-300 group-hover:from-blue-200 group-hover:via-purple-200 group-hover:to-pink-200">
              <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400 animate-float" />
            </div>
          )}
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          {/* Title and Level */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-sm sm:text-base text-gray-800 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all leading-tight">
                {course.title}
              </h3>
              <span className={`px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0 shadow-sm ${
                course.level === 'beginner' ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700' :
                course.level === 'intermediate' ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700' :
                'bg-gradient-to-r from-red-100 to-pink-100 text-pink-700'
              }`}>
                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
              </span>
            </div>
            
            {course.description && (
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {course.description}
              </p>
            )}
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 p-2 rounded-lg border border-indigo-100">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs text-gray-700 font-medium truncate">{instructorNames}</span>
          </div>

          {/* Course Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded-lg">
                <Clock className="w-3 h-3 text-blue-600" />
                <span className="text-gray-700 font-medium whitespace-nowrap">{formatDuration(course.duration_value, course.duration_unit)}</span>
              </div>
              
              {course.enrollment_count !== undefined && (
                <div className="flex items-center gap-1.5 bg-purple-50 px-2 py-1 rounded-lg">
                  <Users className="w-3 h-3 text-purple-600" />
                  <span className="text-gray-700 font-medium">{course.enrollment_count}</span>
                </div>
              )}

              {course.rating && (
                <div className="flex items-center gap-1.5 bg-yellow-50 px-2 py-1 rounded-lg">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-700 font-semibold">{course.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {course.category_name && (
              <span className="text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-2.5 py-1 rounded-lg font-medium self-start sm:self-auto">
                {course.category_name}
              </span>
            )}
          </div>

          {/* Price & Enrollment Status */}
          <div className="flex items-center justify-between gap-2 pt-2">
            <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {formatPrice(course.price)}
            </div>
            
            {userRole === 'student' && course.is_enrolled && (
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-2.5 py-1.5 rounded-lg shadow-sm">
                <CheckCircle2 className="w-3 h-3" />
                <span className="text-xs font-semibold">Enrolled</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (userRole === 'admin' || (userRole === 'instructor' && getEditLink())) && (
          <div className="flex items-center gap-2 pt-3 border-t border-gray-200 mt-auto">
            {(userRole === 'admin' || (userRole === 'instructor' && getEditLink())) && onEdit && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onEdit(course.id);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 font-medium rounded-lg hover:from-blue-100 hover:to-purple-100 transition-all duration-200"
              >
                <Edit className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Edit</span>
              </button>
            )}

            {userRole === 'admin' && onDelete && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(course.id);
                }}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-red-50 to-pink-50 text-red-700 font-medium rounded-lg hover:from-red-100 hover:to-pink-100 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Delete</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
    </Link>
  );
}