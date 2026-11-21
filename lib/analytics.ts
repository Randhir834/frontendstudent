/**
 * Google Analytics 4 (GA4) Implementation
 * Add your GA4 Measurement ID to environment variables
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Pre-defined event tracking functions
export const trackCourseView = (courseId: string, courseName: string) => {
  event({
    action: 'view_course',
    category: 'engagement',
    label: `${courseId} - ${courseName}`,
  });
};

export const trackEnrollment = (courseId: string, courseName: string, price: number) => {
  event({
    action: 'begin_checkout',
    category: 'ecommerce',
    label: `${courseId} - ${courseName}`,
    value: price,
  });
};

export const trackTrialRequest = (courseId: string, courseName: string) => {
  event({
    action: 'request_trial',
    category: 'lead_generation',
    label: `${courseId} - ${courseName}`,
  });
};

export const trackVideoPlay = (courseId: string, videoTitle: string) => {
  event({
    action: 'play_video',
    category: 'engagement',
    label: `${courseId} - ${videoTitle}`,
  });
};

export const trackSearch = (searchTerm: string, resultCount: number) => {
  event({
    action: 'search',
    category: 'engagement',
    label: searchTerm,
    value: resultCount,
  });
};

export const trackFormSubmission = (formName: string) => {
  event({
    action: 'submit_form',
    category: 'lead_generation',
    label: formName,
  });
};

export const trackDownload = (resourceName: string) => {
  event({
    action: 'download',
    category: 'engagement',
    label: resourceName,
  });
};

export const trackOutboundLink = (url: string) => {
  event({
    action: 'click_outbound_link',
    category: 'engagement',
    label: url,
  });
};

export const trackLessonComplete = (courseId: string, lessonId: string) => {
  event({
    action: 'complete_lesson',
    category: 'engagement',
    label: `${courseId} - ${lessonId}`,
  });
};

export const trackPurchaseComplete = (
  courseId: string,
  courseName: string,
  price: number,
  transactionId: string
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: price,
      currency: 'INR',
      items: [
        {
          item_id: courseId,
          item_name: courseName,
          price: price,
          quantity: 1,
        },
      ],
    });
  }
};

// Enhanced ecommerce tracking
export const trackAddToCart = (courseId: string, courseName: string, price: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: 'INR',
      value: price,
      items: [
        {
          item_id: courseId,
          item_name: courseName,
          price: price,
          quantity: 1,
        },
      ],
    });
  }
};

// Declare gtag types
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: any
    ) => void;
  }
}
