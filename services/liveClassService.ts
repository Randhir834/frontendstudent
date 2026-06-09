import api from './api';

export interface LiveClass {
  id: number;
  course_id: number;
  course_title?: string;
  course_description?: string;
  thumbnail_url?: string;
  title: string;
  description?: string;
  meet_link: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  instructor_name?: string;
  instructor_email?: string;
  enrolled_count?: number;
  created_at: string;
  updated_at: string;
}

export const liveClassService = {
  // Get all live classes for student (enrolled courses)
  async getLiveClasses() {
    const response = await api.get('/live-classes');
    return response.data;
  },

  // Get courses with their live classes for student
  async getCoursesWithLiveClasses() {
    const response = await api.get('/live-classes/courses-with-classes');
    return response.data;
  },

  // Get live classes by course
  async getLiveClassesByCourse(courseId: number) {
    const response = await api.get(`/live-classes?course_id=${courseId}`);
    return response.data;
  },

  // Get single live class
  async getLiveClassById(id: number) {
    const response = await api.get(`/live-classes/${id}`);
    return response.data;
  },

  // Helper: Format date for display
  formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  // Helper: Format time for display
  formatTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  // Helper: Format date and time for display
  formatDateTime(dateString: string) {
    return `${this.formatDate(dateString)} at ${this.formatTime(dateString)}`;
  },

  // Helper: Check if class is upcoming
  isUpcoming(scheduledAt: string) {
    return new Date(scheduledAt) > new Date();
  },

  // Helper: Check if class is ongoing
  isOngoing(scheduledAt: string, durationMinutes: number) {
    const now = new Date().getTime();
    const startTime = new Date(scheduledAt).getTime();
    const endTime = startTime + (durationMinutes * 60 * 1000);
    return now >= startTime && now <= endTime;
  },

  // Helper: Check if class is completed
  isCompleted(scheduledAt: string, durationMinutes: number) {
    const now = new Date().getTime();
    const startTime = new Date(scheduledAt).getTime();
    const endTime = startTime + (durationMinutes * 60 * 1000);
    return now > endTime;
  },

  // Helper: Check if students can join the class (upcoming or ongoing, but not completed)
  canJoinClass(scheduledAt: string, durationMinutes: number) {
    return !this.isCompleted(scheduledAt, durationMinutes);
  },

  // Helper: Get class status
  getClassStatus(scheduledAt: string, durationMinutes: number): 'upcoming' | 'ongoing' | 'completed' {
    if (this.isOngoing(scheduledAt, durationMinutes)) {
      return 'ongoing';
    } else if (this.isCompleted(scheduledAt, durationMinutes)) {
      return 'completed';
    } else {
      return 'upcoming';
    }
  },

  // Helper: Check if class is today
  isToday(scheduledAt: string) {
    const classDate = new Date(scheduledAt);
    const today = new Date();
    return (
      classDate.getDate() === today.getDate() &&
      classDate.getMonth() === today.getMonth() &&
      classDate.getFullYear() === today.getFullYear()
    );
  },

  // Helper: Check if class is starting soon (within 30 minutes)
  isStartingSoon(scheduledAt: string) {
    const classTime = new Date(scheduledAt).getTime();
    const now = new Date().getTime();
    const thirtyMinutes = 30 * 60 * 1000;
    return classTime - now <= thirtyMinutes && classTime > now;
  },
};
