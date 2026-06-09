'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, X, Loader2, BookOpen, FileText, Video, Folder, Shapes } from 'lucide-react';
import { searchService, SearchResponse } from '@/services/searchService';

interface GlobalSearchProps {
  initialQuery?: string;
  className?: string;
}

// Extract context from current URL path
const getSearchContext = (pathname: string) => {
  const courseMatch = pathname.match(/\/courses\/(\d+)/);
  const myCoursesMatch = pathname.match(/\/my-courses\/(\d+)/);
  const assignmentMatch = pathname.match(/\/assignments/);
  const quizMatch = pathname.match(/\/quizzes/);
  const liveClassMatch = pathname.match(/\/live-classes/);
  
  if (myCoursesMatch) {
    return { type: 'course', id: parseInt(myCoursesMatch[1]) };
  } else if (courseMatch) {
    return { type: 'course', id: parseInt(courseMatch[1]) };
  } else if (assignmentMatch) {
    return { type: 'assignment', id: null };
  } else if (quizMatch) {
    return { type: 'quiz', id: null };
  } else if (liveClassMatch) {
    return { type: 'live_class', id: null };
  }
  
  return { type: null, id: null };
};

export default function GlobalSearch({ initialQuery = '', className = '' }: GlobalSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Perform search with debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length === 0) {
      setResults(null);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const context = getSearchContext(pathname || '');
        const searchResults = await searchService.globalSearch(query, context.type, context.id);
        setResults(searchResults);
        setIsOpen(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults(null);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, pathname]);

  const handleClear = () => {
    setQuery('');
    setResults(null);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleResultClick = (type: string, id: number, item?: any) => {
    setIsOpen(false);
    setQuery('');
    
    // Navigate based on result type
    switch (type) {
      case 'course':
        // Check if student is enrolled, if so go to my-courses, otherwise go to course details
        router.push(`/student/courses/${id}`);
        break;
      case 'lesson':
        const lesson = results?.results.lessons.find(l => l.id === id);
        if (lesson?.course_id) {
          // Navigate to the course page where the lesson is located
          router.push(`/student/my-courses/${lesson.course_id}`);
        }
        break;
      case 'section':
        const section = results?.results.sections?.find((s: any) => s.id === id);
        if (section?.course_id) {
          // Navigate to the course page where the section is located
          router.push(`/student/my-courses/${section.course_id}`);
        }
        break;
      case 'assignment':
        // Navigate to assignments page
        router.push(`/student/assignments`);
        break;
      case 'quiz':
        // Navigate to quizzes page
        router.push(`/student/quizzes`);
        break;
      case 'live_class':
        // Navigate to live classes page
        router.push(`/student/live-classes`);
        break;
      case 'category':
        // Navigate to courses page (can add category filter later)
        router.push(`/student/courses`);
        break;
      default:
        break;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="text-[#1E88E5]" size={18} />;
      case 'lesson':
        return <Video className="text-[#1E88E5]" size={18} />;
      case 'section':
        return <Folder className="text-[#8B5CF6]" size={18} />;
      case 'assignment':
        return <FileText className="text-[#FFA726]" size={18} />;
      case 'quiz':
        return <FileText className="text-[#EF4444]" size={18} />;
      case 'live_class':
        return <Video className="text-[#EC4899]" size={18} />;
      case 'category':
        return <Shapes className="text-[#10B981]" size={18} />;
      default:
        return <Search className="text-[#78909C]" size={18} />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      course: 'Course',
      lesson: 'Lesson',
      section: 'Section',
      assignment: 'Assignment',
      quiz: 'Quiz',
      live_class: 'Live Class',
      category: 'Category',
    };
    return labels[type] || type;
  };

  const renderResultItem = (item: any, type: string) => {
    // Determine if item is available/accessible
    const isPublished = item.status === 'published' || item.course_status === 'published';
    const isAvailable = type === 'course' ? item.status === 'published' : isPublished;
    
    return (
      <button
        key={`${type}-${item.id}`}
        onClick={() => handleResultClick(type, item.id, item)}
        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-[#FAFAFA] transition-colors text-left border-b border-[#E0E0E0] last:border-b-0"
      >
        <div className="mt-0.5 shrink-0">{getIcon(type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-[#78909C] uppercase tracking-wide">
              {getTypeLabel(type)}
            </span>
            {isAvailable && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#D1FAE5] text-[#065F46]">
                Available
              </span>
            )}
            {item.level && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#E0E7FF] text-[#4338CA]">
                {item.level}
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-[#1E3A5F] mb-1 truncate">
            {item.title || item.name || `${type} #${item.id}`}
          </p>
          {item.description && (
            <p className="text-xs text-[#78909C] line-clamp-2">{item.description}</p>
          )}
          {item.course_title && type !== 'course' && (
            <p className="text-xs text-[#78909C] mt-1">
              📚 Course: {item.course_title}
            </p>
          )}
          {item.category_name && (
            <p className="text-xs text-[#78909C] mt-1">
              🏷️ {item.category_name}
            </p>
          )}
          {item.duration && (
            <p className="text-xs text-[#78909C] mt-1">
              ⏱️ {item.duration} minutes
            </p>
          )}
          {item.price !== undefined && item.price !== null && (
            <p className="text-xs font-semibold text-[#1E88E5] mt-1">
              {item.price === 0 ? 'Free' : `₹${item.price}`}
            </p>
          )}
        </div>
      </button>
    );
  };

  const hasResults = results && results.totalResults > 0;
  
  // Get context-aware placeholder
  const getPlaceholder = () => {
    const context = getSearchContext(pathname || '');
    if (context.type === 'course') {
      return 'Search in this course...';
    } else if (context.type === 'assignment') {
      return 'Search assignments...';
    } else if (context.type === 'quiz') {
      return 'Search quizzes...';
    } else if (context.type === 'live_class') {
      return 'Search live classes...';
    }
    return 'Search for courses, lessons, assignments...';
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 sm:left-3.5 top-1/2 transform -translate-y-1/2 text-[#B0BEC5] size-4 sm:size-[18px]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim() && results) {
              setIsOpen(true);
            }
          }}
          className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-1 sm:py-1.5 bg-[#FAFAFA] border border-[#E0E0E0] rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
        />
        {(query || isLoading) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {isLoading && <Loader2 className="text-[#1E88E5] animate-spin" size={18} />}
            {query && !isLoading && (
              <button
                onClick={handleClear}
                className="text-[#78909C] hover:text-[#1E3A5F] transition-colors"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && hasResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E0E0E0] rounded-lg shadow-xl max-h-[70vh] overflow-y-auto z-50">
          <div className="sticky top-0 bg-white border-b border-[#E0E0E0] px-4 py-3">
            <p className="text-sm font-semibold text-[#1E3A5F]">
              Found {results.totalResults} result{results.totalResults !== 1 ? 's' : ''} for "{query}"
            </p>
            {getSearchContext(pathname || '').type && (
              <p className="text-xs text-[#78909C] mt-1">
                🎯 Prioritizing results from current page
              </p>
            )}
          </div>

          <div className="py-2">
            {results.results.courses.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-[#FAFAFA] border-b border-[#E0E0E0]">
                  <p className="text-xs font-semibold text-[#78909C] uppercase tracking-wide">
                    Courses
                  </p>
                </div>
                {results.results.courses.map((item) => renderResultItem(item, 'course'))}
              </div>
            )}
            {results.results.sections && results.results.sections.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-[#FAFAFA] border-b border-[#E0E0E0]">
                  <p className="text-xs font-semibold text-[#78909C] uppercase tracking-wide">
                    Sections
                  </p>
                </div>
                {results.results.sections.map((item: any) => renderResultItem(item, 'section'))}
              </div>
            )}
            {results.results.lessons.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-[#FAFAFA] border-b border-[#E0E0E0]">
                  <p className="text-xs font-semibold text-[#78909C] uppercase tracking-wide">
                    Lessons
                  </p>
                </div>
                {results.results.lessons.map((item) => renderResultItem(item, 'lesson'))}
              </div>
            )}
            {results.results.assignments.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-[#FAFAFA] border-b border-[#E0E0E0]">
                  <p className="text-xs font-semibold text-[#78909C] uppercase tracking-wide">
                    Assignments
                  </p>
                </div>
                {results.results.assignments.map((item) => renderResultItem(item, 'assignment'))}
              </div>
            )}
            {results.results.quizzes.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-[#FAFAFA] border-b border-[#E0E0E0]">
                  <p className="text-xs font-semibold text-[#78909C] uppercase tracking-wide">
                    Quizzes
                  </p>
                </div>
                {results.results.quizzes.map((item) => renderResultItem(item, 'quiz'))}
              </div>
            )}
            {results.results.liveClasses.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-[#FAFAFA] border-b border-[#E0E0E0]">
                  <p className="text-xs font-semibold text-[#78909C] uppercase tracking-wide">
                    Live Classes
                  </p>
                </div>
                {results.results.liveClasses.map((item) => renderResultItem(item, 'live_class'))}
              </div>
            )}
            {results.results.categories.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-[#FAFAFA] border-b border-[#E0E0E0]">
                  <p className="text-xs font-semibold text-[#78909C] uppercase tracking-wide">
                    Categories
                  </p>
                </div>
                {results.results.categories.map((item) => renderResultItem(item, 'category'))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && results && !hasResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E0E0E0] rounded-lg shadow-xl p-8 text-center z-50">
          <Search className="mx-auto text-[#E0E0E0] mb-3" size={48} />
          <p className="text-sm font-semibold text-[#1E3A5F] mb-1">No results found</p>
          <p className="text-xs text-[#78909C]">Try searching with different keywords</p>
        </div>
      )}
    </div>
  );
}
