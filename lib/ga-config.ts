// Google Analytics Configuration
// Centralized configuration for GA Measurement ID

export const GA_CONFIG = {
  measurementId: 'G-00P3F888CW',
  
  // Enable/disable tracking based on environment
  enabled: process.env.NODE_ENV === 'production',
  
  // Debug mode (shows detailed logs in console)
  debug: process.env.NODE_ENV === 'development',
} as const;

// Helper to check if GA is enabled
export const isGAEnabled = () => {
  return GA_CONFIG.enabled && typeof window !== 'undefined';
};

// Helper to log debug messages
export const gaDebugLog = (message: string, data?: unknown) => {
  if (GA_CONFIG.debug) {
    console.log(`[GA Debug] ${message}`, data || '');
  }
};
