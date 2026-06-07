import api from './api';

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  type: 'number' | 'single_choice' | 'multiple_choice';
  question: string;
  required: boolean;
  min?: number;
  max?: number;
  max_selections?: number;
  options?: QuestionOption[];
}

export interface Questionnaire {
  questions: Question[];
}

export interface QuestionnaireResponses {
  child_age: number;
  interests?: string[];
  learning_style?: string;
  personality?: string[];
  goals?: string[];
  time_commitment?: string;
  experience_level?: string;
  challenges?: string[];
}

export interface CourseRecommendation {
  course_id: number;
  course_title: string;
  course_description: string;
  course_price: number;
  course_thumbnail: string;
  course_level: string;
  score: number;
  reasons: string[];
  benefits: string[];
  skills_developed: string[];
}

export interface RecommendationSubmission {
  parent_name?: string;
  parent_email?: string;
  parent_phone?: string;
  child_name?: string;
  responses: QuestionnaireResponses;
}

export interface RecommendationResponse {
  session_id: string;
  recommendations: CourseRecommendation[];
  message: string;
}

export const recommendationService = {
  // Get questionnaire structure
  getQuestionnaire: async (): Promise<Questionnaire> => {
    const response = await api.get('/recommendations/questionnaire');
    return response.data;
  },

  // Submit questionnaire and get recommendations
  submitQuestionnaire: async (data: RecommendationSubmission): Promise<RecommendationResponse> => {
    const response = await api.post('/recommendations/submit', data);
    return response.data;
  },

  // Get recommendations by session ID
  getRecommendationsBySession: async (sessionId: string): Promise<any> => {
    const response = await api.get(`/recommendations/session/${sessionId}`);
    return response.data;
  }
};
