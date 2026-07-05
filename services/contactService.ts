import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ContactFormData {
  parentName: string;
  childName?: string;
  phone: string;
  email: string;
  courseInterest?: string;
  message?: string;
  type?: 'general' | 'trial';
}

export const contactService = {
  // Submit contact form
  submitContact: async (data: ContactFormData) => {
    const response = await axios.post(`${API_URL}/contact/submit`, data);
    return response.data;
  },
};
