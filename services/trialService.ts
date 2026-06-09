import api from './api';

export interface TrialRequestData {
  name: string;
  email: string;
  phone: string;
  grade?: string;
}

export const trialService = {
  requestTrial: async (data: TrialRequestData) => {
    const response = await api.post('/trial-requests', data);
    return response.data;
  },
};
