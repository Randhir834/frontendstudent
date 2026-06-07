import api from './api';

export interface TrialRequestData {
  name: string;
  email: string;
  phone: string;
  grade?: string;
  role?: 'student' | 'instructor';
}

export const trialService = {
  requestTrial: async (data: TrialRequestData) => {
    const response = await api.post('/trial-requests', {
      ...data,
      role: data.role || 'student',
    });
    return response.data;
  },
};
