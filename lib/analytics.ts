// Google Analytics event tracking utilities

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-00P3F888CW', {
      page_path: url,
    });
  }
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track form submissions
export const trackFormSubmission = (formName: string) => {
  trackEvent('form_submission', 'engagement', formName);
};

// Track button clicks
export const trackButtonClick = (buttonName: string) => {
  trackEvent('button_click', 'engagement', buttonName);
};

// Track course interest
export const trackCourseInterest = (courseName: string) => {
  trackEvent('course_interest', 'courses', courseName);
};

// Track trial booking
export const trackTrialBooking = (courseName: string) => {
  trackEvent('trial_booking', 'conversions', courseName);
};

// Track enrollment
export const trackEnrollment = (courseName: string, price: number) => {
  trackEvent('enrollment', 'conversions', courseName, price);
};

// Track user login
export const trackLogin = (method: string) => {
  trackEvent('login', 'user_engagement', method);
};

// Track user signup
export const trackSignup = (method: string) => {
  trackEvent('sign_up', 'user_engagement', method);
};

// Track search
export const trackSearch = (searchTerm: string) => {
  trackEvent('search', 'engagement', searchTerm);
};

// Track video play
export const trackVideoPlay = (videoTitle: string) => {
  trackEvent('video_play', 'engagement', videoTitle);
};

// Track download
export const trackDownload = (fileName: string) => {
  trackEvent('file_download', 'engagement', fileName);
};
