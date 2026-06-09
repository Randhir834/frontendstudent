import api from './api';

export interface Certificate {
  id: number;
  certificate_number: string;
  course_title: string;
  student_name: string;
  instructor_name: string;
  issued_date: string;
  valid_from: string;
  valid_until: string;
  is_downloaded: boolean;
  downloaded_at?: string;
}

export const certificateService = {
  getMyCertificates: async (): Promise<{ certificates: Certificate[]; total: number }> => {
    const response = await api.get('/certificates');
    return response.data;
  },

  getCertificate: async (id: number): Promise<{ certificate: Certificate }> => {
    const response = await api.get(`/certificates/${id}`);
    return response.data;
  },

  downloadCertificate: async (id: number) => {
    const response = await api.post(`/certificates/${id}/download`);
    return response.data;
  },

  verifyCertificate: async (certificateNumber: string) => {
    const response = await api.get(`/certificates/verify/${certificateNumber}`);
    return response.data;
  },
};
