import api from './api';

export interface AttendanceRecord {
  id: number;
  course_id: number;
  course_title: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

export const attendanceService = {
  getStudentAttendanceHistory: async (courseId?: number) => {
    const params = courseId ? `?courseId=${courseId}` : '';
    const response = await api.get(`/attendance/students/me/history${params}`);
    return response.data;
  },

  getStudentStats: async (courseId?: number) => {
    const params = courseId ? `?courseId=${courseId}` : '';
    const response = await api.get(`/attendance/students/me/stats${params}`);
    return response.data;
  },
};