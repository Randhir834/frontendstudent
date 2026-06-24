import api from './api';

export interface LessonCompletion {
  lesson_number: number;
  completed_at: string;
  completed_by: number;
  notes: string | null;
  instructor_name?: string;
}

export interface StudentProgress {
  enrollment_id: number;
  course_id: number;
  course_title: string;
  total_lessons: number;
  completed_lessons: number;
  progress_percentage: number;
}

export const lessonCompletionService = {
  // Get student's own progress for a course
  async getMyProgress(courseId: number) {
    const response = await api.get(`/lessons/progress?course_id=${courseId}`);
    return response.data as { success: boolean; progress: StudentProgress };
  },

  // Get completed lessons for an enrollment
  async getCompletedLessons(enrollmentId: number) {
    const response = await api.get(`/lessons/completed/${enrollmentId}`);
    return response.data as { success: boolean; completed_lessons: LessonCompletion[] };
  }
};
