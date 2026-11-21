/**
 * SEO Utility Functions for PlayFit Classes
 * Centralized functions for generating SEO-optimized content
 */

/**
 * Generate SEO-friendly URL slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Truncate text to specified length while keeping words intact
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  
  const truncated = text.substr(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return truncated.substr(0, lastSpace) + '...';
}

/**
 * Generate optimal meta description
 */
export function generateMetaDescription(
  text: string,
  maxLength: number = 160
): string {
  // Remove HTML tags
  const cleanText = text.replace(/<[^>]*>/g, '');
  return truncateText(cleanText, maxLength);
}

/**
 * Extract keywords from text (simple implementation)
 */
export function extractKeywords(text: string, count: number = 10): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'are', 'was', 'were', 'be',
    'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that',
    'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));

  // Count frequency
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  // Sort by frequency and return top keywords
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([word]) => word);
}

/**
 * Generate breadcrumb schema data
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate Course schema
 */
export function generateCourseSchema(course: {
  name: string;
  description: string;
  instructor?: string;
  price?: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
}) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: 'PlayFit Classes',
      url: 'https://playfitclasses.com',
    },
  };

  if (course.instructor) {
    schema.instructor = {
      '@type': 'Person',
      name: course.instructor,
    };
  }

  if (course.price !== undefined) {
    schema.offers = {
      '@type': 'Offer',
      price: course.price,
      priceCurrency: course.currency || 'INR',
      availability: 'https://schema.org/InStock',
    };
  }

  if (course.rating && course.reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: course.rating,
      reviewCount: course.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (course.imageUrl) {
    schema.image = course.imageUrl;
  }

  return schema;
}

/**
 * Generate FAQ schema
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Review schema
 */
export function generateReviewSchema(review: {
  author: string;
  rating: number;
  text: string;
  date: string;
  itemName: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.author,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: review.text,
    datePublished: review.date,
    itemReviewed: {
      '@type': 'Course',
      name: review.itemName,
    },
  };
}

/**
 * Generate Video schema
 */
export function generateVideoSchema(video: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string; // ISO 8601 format: PT1M30S
  contentUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    ...(video.duration && { duration: video.duration }),
    ...(video.contentUrl && { contentUrl: video.contentUrl }),
  };
}

/**
 * Generate Event schema for live classes
 */
export function generateEventSchema(event: {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  price?: number;
  currency?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    location: {
      '@type': 'VirtualLocation',
      url: event.location,
    },
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    organizer: {
      '@type': 'Organization',
      name: 'PlayFit Classes',
      url: 'https://playfitclasses.com',
    },
    ...(event.price !== undefined && {
      offers: {
        '@type': 'Offer',
        price: event.price,
        priceCurrency: event.currency || 'INR',
        availability: 'https://schema.org/InStock',
        url: 'https://playfitclasses.com',
      },
    }),
  };
}

/**
 * Calculate reading time for blog posts
 */
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string): string {
  const baseUrl = 'https://playfitclasses.com';
  const cleanPath = path.replace(/\/$/, ''); // Remove trailing slash
  return `${baseUrl}${cleanPath}`;
}

/**
 * Validate and sanitize URL parameters for SEO
 */
export function sanitizeUrlParams(url: string): string {
  const urlObj = new URL(url);
  const paramsToRemove = ['utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'gclid'];
  
  paramsToRemove.forEach(param => {
    urlObj.searchParams.delete(param);
  });
  
  return urlObj.toString();
}

/**
 * Generate alt text for images based on context
 */
export function generateAltText(fileName: string, context?: string): string {
  const baseName = fileName
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[-_]/g, ' ') // Replace hyphens and underscores with spaces
    .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letters
  
  return context ? `${context} - ${baseName}` : baseName;
}

/**
 * Check if URL is internal
 */
export function isInternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url, 'https://playfitclasses.com');
    return urlObj.hostname === 'playfitclasses.com' || 
           urlObj.hostname === 'www.playfitclasses.com';
  } catch {
    return true; // Relative URLs are internal
  }
}

/**
 * Generate hreflang tags for international SEO
 */
export function generateHreflangTags(path: string, languages: string[]): Array<{
  hreflang: string;
  href: string;
}> {
  const baseUrl = 'https://playfitclasses.com';
  return languages.map(lang => ({
    hreflang: lang,
    href: lang === 'en' ? `${baseUrl}${path}` : `${baseUrl}/${lang}${path}`,
  }));
}

/**
 * Optimize title for SEO (keep under 60 characters)
 */
export function optimizeTitle(title: string, siteName: string = 'PlayFit Classes'): string {
  const maxLength = 60;
  const separator = ' | ';
  const fullTitle = `${title}${separator}${siteName}`;
  
  if (fullTitle.length <= maxLength) {
    return fullTitle;
  }
  
  // If too long, truncate the title part
  const availableLength = maxLength - separator.length - siteName.length;
  const truncatedTitle = truncateText(title, availableLength);
  
  return `${truncatedTitle}${separator}${siteName}`;
}

/**
 * Format price for display and schema
 */
export function formatPrice(price: number, currency: string = 'INR'): {
  display: string;
  schema: number;
} {
  return {
    display: new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(price),
    schema: price,
  };
}
