import api from './api';
import { enrollmentService } from './enrollmentService';
import { liveClassService } from './liveClassService';
import { assignmentService } from './assignmentService';
import { notificationService } from './notificationService';
import { progressService } from './progressService';

export interface DashboardStats {
  enrolledCourses: number;
  liveClasses: number;
  assignments: number;
  achievements: number; // Actually represents quizzes count
}

export interface CourseProgress {
  id: number;
  title: string;
  thumbnail_url?: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
}

export interface LiveClass {
  id: number;
  title: string;
  course_name: string;
  scheduled_at: string;
  meet_link: string;
  instructor_name: string;
  duration_minutes: number;
}

export interface Announcement {
  id: number;
  title: string;
  message: string;
  created_at: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  earned_at: string;
  color?: string;
  borderColor?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  courses: CourseProgress[];
  nextLiveClass: LiveClass | null;
  announcements: Announcement[];
  achievements: Achievement[];
  overallProgress: number;
}

export const dashboardService = {
  // Get dashboard summary stats with better error handling
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const results = await Promise.allSettled([
        enrollmentService.getEnrollments(),
        liveClassService.getLiveClasses(),
        api.get('/assignments'), // Get all assignments assigned to student
        api.get('/quizzes') // Get all quizzes assigned to student
      ]);

      let enrollmentsCount = 0;
      let liveClassesCount = 0;
      let assignmentsCount = 0;
      let quizzesCount = 0;

      // Count active enrollments
      if (results[0].status === 'fulfilled') {
        const enrollments = results[0].value.enrollments || [];
        enrollmentsCount = enrollments.filter((e: any) => e.status === 'active').length;
      }

      // Count active live classes (not completed)
      if (results[1].status === 'fulfilled') {
        const allClasses = results[1].value.liveClasses || [];
        liveClassesCount = allClasses.filter((cls: any) => {
          const now = new Date().getTime();
          const startTime = new Date(cls.scheduled_at).getTime();
          const endTime = startTime + (cls.duration_minutes * 60 * 1000);
          return now <= endTime; // Count upcoming and ongoing classes
        }).length;
      }

      // Count assignments assigned to student
      if (results[2].status === 'fulfilled') {
        assignmentsCount = results[2].value.data?.assignments?.length || 0;
      }

      // Count quizzes assigned to student
      if (results[3].status === 'fulfilled') {
        quizzesCount = results[3].value.data?.quizzes?.length || 0;
      }

      return {
        enrolledCourses: enrollmentsCount,
        liveClasses: liveClassesCount,
        assignments: assignmentsCount,
        achievements: quizzesCount // Using quizzes count instead of hardcoded achievements
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        enrolledCourses: 0,
        liveClasses: 0,
        assignments: 0,
        achievements: 0
      };
    }
  },

  // Get courses with progress with proper error handling
  getCoursesWithProgress: async (): Promise<CourseProgress[]> => {
    try {
      const enrollments = await enrollmentService.getEnrollments();
      
      if (!enrollments.enrollments) return [];

      // Use Promise.allSettled to prevent one failure from breaking all
      const results = await Promise.allSettled(
        enrollments.enrollments.map(async (enrollment: any) => {
          const progress = await progressService.getCourseProgress(enrollment.course_id);
          return {
            id: enrollment.course_id,
            title: enrollment.course_title || 'Unknown Course',
            thumbnail_url: enrollment.thumbnail_url,
            progress: enrollment.progress || 0, // Use enrollment.progress directly
            totalLessons: progress.data?.total_lessons || 12,
            completedLessons: progress.data?.completed_lessons || 0
          };
        })
      );

      // Filter fulfilled promises and ignore rejected ones
      const coursesWithProgress = results
        .filter((result): result is PromiseFulfilledResult<CourseProgress> => result.status === 'fulfilled')
        .map(result => result.value);

      return coursesWithProgress;
    } catch (error) {
      console.error('Error fetching courses with progress:', error);
      return [];
    }
  },

  // Get next live class
  getNextLiveClass: async (): Promise<LiveClass | null> => {
    try {
      const liveClasses = await liveClassService.getLiveClasses();
      
      if (!liveClasses.data) return null;

      const scheduledClasses = liveClasses.data
        .filter((cls: any) => cls.status === 'scheduled')
        .sort((a: any, b: any) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());

      if (scheduledClasses.length === 0) return null;

      const nextClass = scheduledClasses[0];
      return {
        id: nextClass.id,
        title: nextClass.title,
        course_name: nextClass.course?.title || 'Unknown Course',
        scheduled_at: nextClass.scheduled_at,
        meet_link: nextClass.meet_link,
        instructor_name: nextClass.instructor?.name || 'Instructor',
        duration_minutes: nextClass.duration_minutes || 60
      };
    } catch (error) {
      console.error('Error fetching next live class:', error);
      return null;
    }
  },

  // Get announcements
  getAnnouncements: async (): Promise<Announcement[]> => {
    try {
      const notifications = await notificationService.getNotifications();
      
      if (!notifications.data) return [];

      return notifications.data
        .filter((notif: any) => notif.type === 'announcement')
        .map((notif: any) => ({
          id: notif.id,
          title: notif.title,
          message: notif.message,
          created_at: notif.created_at,
          type: notif.priority || 'info'
        }));
    } catch (error) {
      console.error('Error fetching announcements:', error);
      return [];
    }
  },

  // Get achievements (mock data for now)
  getAchievements: async (): Promise<Achievement[]> => {
    // This would be replaced with actual API call when achievements are implemented
    return [
      {
        id: 1,
        title: 'Quick Learner',
        description: 'Complete 5 lessons in one day',
        icon: 'star',
        earned_at: '2024-05-10T10:00:00Z'
      },
      {
        id: 2,
        title: 'Quiz Master',
        description: 'Score 100% on 3 quizzes',
        icon: 'target',
        earned_at: '2024-05-08T15:30:00Z'
      },
      {
        id: 3,
        title: 'Dedicated',
        description: '7-day learning streak',
        icon: 'award',
        earned_at: '2024-05-05T09:00:00Z'
      },
      {
        id: 4,
        title: 'Top Performer',
        description: 'Highest score in Mathematics',
        icon: 'trophy',
        earned_at: '2024-05-01T14:20:00Z'
      }
    ];
  },

  // Get overall progress
  getOverallProgress: async (): Promise<number> => {
    try {
      const courses = await dashboardService.getCoursesWithProgress();
      
      if (courses.length === 0) return 0;

      const totalProgress = courses.reduce((sum, course) => sum + course.progress, 0);
      return Math.round(totalProgress / courses.length);
    } catch (error) {
      console.error('Error calculating overall progress:', error);
      return 0;
    }
  },

  // Get all dashboard data
  getDashboardData: async (): Promise<DashboardData> => {
    const [stats, courses, nextLiveClass, announcements, achievements, overallProgress] = await Promise.all([
      dashboardService.getDashboardStats(),
      dashboardService.getCoursesWithProgress(),
      dashboardService.getNextLiveClass(),
      dashboardService.getAnnouncements(),
      dashboardService.getAchievements(),
      dashboardService.getOverallProgress()
    ]);

    return {
      stats,
      courses,
      nextLiveClass,
      announcements,
      achievements,
      overallProgress
    };
  }
};
