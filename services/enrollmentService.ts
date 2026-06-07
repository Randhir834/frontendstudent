import api from './api';

export const enrollmentService = {
  enrollCourse: async (courseId: number, paymentMethod?: string) => {
    const payload: any = { course_id: courseId };
    if (paymentMethod) {
      payload.payment_method = paymentMethod;
    }
    const response = await api.post('/enrollments', payload);
    return response.data;
  },

  getEnrollments: async () => {
    const response = await api.get('/enrollments');
    return response.data;
  },

  getEnrollmentById: async (id: number) => {
    const response = await api.get(`/enrollments/${id}`);
    return response.data;
  },

  checkEnrollment: async (courseId: number) => {
    const response = await api.get(`/enrollments/check/${courseId}`);
    return response.data;
  },
};
