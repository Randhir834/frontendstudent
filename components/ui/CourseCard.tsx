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
    return `${linkPrefix}/student/course/${course.id}`;
  };

  const getEditLink = () => {
    if (userRole === 'admin') return `${linkPrefix}/admin/courses/${course.id}/edit`;
    if (userRole === 'instructor') return `${linkPrefix}/instructor/courses/${course.id}/edit`;
    return null;
  };

  return (
    <Link href={getViewLink()}>
      <Card className="group hover:shadow-lg transition-all duration-200 border-[#E0E0E0] hover:border-[#1E88E5]/20 h-full flex flex-col cursor-pointer">
        <div className="relative">
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-40 sm:h-44 md:h-48 object-cover rounded-t-lg"
            />
          ) : (
            <div className="w-full h-40 sm:h-44 md:h-48 bg-gradient-to-br from-[#1E88E5]/10 to-[#1E88E5]/20 rounded-t-lg flex items-center justify-center">
              <BookOpen className="size-8 sm:size-10 md:size-12 text-[#1E88E5]/60" />
            </div>
          )}
        </div>

      <CardContent className="p-3 sm:p-4 flex-1 flex flex-col">
        <div className="space-y-1 sm:space-y-2 flex-1">
          {/* Title and Level */}
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-sm sm:text-base text-[#1E3A5F] line-clamp-2 group-hover:text-[#1E88E5] transition-colors leading-tight">
                {course.title}
              </h3>
              <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium rounded-full whitespace-nowrap flex-shrink-0 ${levelColors[course.level]}`}>
                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
              </span>
            </div>
            
            {course.description && (
              <p className="text-xs sm:text-sm text-[#78909C] line-clamp-2 leading-relaxed">
                {course.description}
              </p>
            )}
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#78909C]">
            <Users className="size-3 sm:size-4 flex-shrink-0" />
            <span className="truncate">{instructorNames}</span>
          </div>

          {/* Enrollment Status for Students */}
          {userRole === 'student' && course.is_enrolled && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1E88E5] bg-[#C5E1A5] px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
              <CheckCircle2 className="size-3 sm:size-4" />
              <span className="font-medium">Enrolled</span>
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && (userRole === 'admin' || (userRole === 'instructor' && getEditLink())) && (
          <div className="flex items-center gap-2 pt-2 sm:pt-3 border-t border-[#E0E0E0] mt-auto">
            {(userRole === 'admin' || (userRole === 'instructor' && getEditLink())) && onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(course.id)}
                className="px-2 sm:px-3 py-2 sm:py-2.5"
              >
                <Edit className="size-3 sm:size-4" />
              </Button>
            )}

            {userRole === 'admin' && onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(course.id)}
                disabled={deleting}
                className="px-2 sm:px-3 py-2 sm:py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="size-3 sm:size-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
    </Link>
  );
}