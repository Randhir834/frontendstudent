/**
 * Centralized Structured Data (JSON-LD) Helper
 * All schema.org structured data for PlayFit Classes
 * 
 * Uses SITE_CONFIG as single source of truth for organization details
 */

import { SITE_CONFIG, getSchemaAddress, getSocialLinks } from './siteConfig';

// Re-export organization details for backward compatibility
export const ORGANIZATION = {
  name: SITE_CONFIG.business.name,
  alternateName: SITE_CONFIG.business.alternateName,
  url: SITE_CONFIG.urls.main,
  logo: SITE_CONFIG.urls.logo,
  email: SITE_CONFIG.contact.email,
  telephone: SITE_CONFIG.contact.phone,
  address: {
    streetAddress: `${SITE_CONFIG.address.street}, ${SITE_CONFIG.address.street2}`,
    addressLocality: SITE_CONFIG.address.city,
    addressRegion: SITE_CONFIG.address.state,
    postalCode: SITE_CONFIG.address.postalCode,
    addressCountry: SITE_CONFIG.address.countryCode
  },
  openingHours: SITE_CONFIG.hours.openingHours,
  sameAs: getSocialLinks(),
  description: SITE_CONFIG.business.description,
};

/**
 * Generate EducationalOrganization + OnlineBusiness schema
 * This is the main entity for the organization
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "OnlineBusiness"],
    "name": ORGANIZATION.name,
    "alternateName": ORGANIZATION.alternateName,
    "url": ORGANIZATION.url,
    "logo": ORGANIZATION.logo,
    "email": ORGANIZATION.email,
    "telephone": ORGANIZATION.telephone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": ORGANIZATION.address.streetAddress,
      "addressLocality": ORGANIZATION.address.addressLocality,
      "addressRegion": ORGANIZATION.address.addressRegion,
      "postalCode": ORGANIZATION.address.postalCode,
      "addressCountry": ORGANIZATION.address.addressCountry
    },
    "areaServed": {
      "@type": "Place",
      "name": "Worldwide"
    },
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "22.5726",
        "longitude": "88.3639"
      },
      "description": "Global online service available worldwide"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "11:00",
      "closes": "19:00"
    },
    "sameAs": ORGANIZATION.sameAs,
    "description": ORGANIZATION.description,
    "priceRange": "$$"
  };
}

/**
 * Generate Course schema with hasCourseInstance
 */
interface CourseSchemaProps {
  id: string | number;
  name: string;
  description: string;
  duration?: {
    value: number;
    unit: string;
  };
  level?: string;
  minAge?: number;
  maxAge?: number;
  language?: string;
  totalLessons?: number;
}

export function getCourseSchema(course: CourseSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.name,
    "description": course.description,
    "provider": {
      "@type": "EducationalOrganization",
      "name": ORGANIZATION.name,
      "url": ORGANIZATION.url
    },
    "courseCode": `PLAYFIT-${course.id}`,
  };

  // Add hasCourseInstance for online and onsite modes
  const courseInstances = [];
  
  // Online instance
  courseInstances.push({
    "@type": "CourseInstance",
    "courseMode": "online",
    "courseWorkload": course.totalLessons ? `${course.totalLessons} lessons` : undefined,
  });

  // Onsite instance (Kolkata classes)
  courseInstances.push({
    "@type": "CourseInstance",
    "courseMode": "onsite",
    "location": {
      "@type": "Place",
      "name": ORGANIZATION.name,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": ORGANIZATION.address.streetAddress,
        "addressLocality": ORGANIZATION.address.addressLocality,
        "addressRegion": ORGANIZATION.address.addressRegion,
        "postalCode": ORGANIZATION.address.postalCode,
        "addressCountry": ORGANIZATION.address.addressCountry
      }
    },
    "courseWorkload": course.totalLessons ? `${course.totalLessons} lessons` : undefined,
  });

  schema.hasCourseInstance = courseInstances;

  // Add duration if available
  if (course.duration && course.duration.value > 0) {
    // Convert to ISO 8601 duration format
    let isoDuration = "P";
    if (course.duration.unit === "weeks") {
      isoDuration += `${course.duration.value}W`;
    } else if (course.duration.unit === "months") {
      isoDuration += `${course.duration.value}M`;
    } else if (course.duration.unit === "days") {
      isoDuration += `${course.duration.value}D`;
    }
    
    if (isoDuration !== "P") {
      schema.timeRequired = isoDuration;
    }
  }

  // Add educational level
  if (course.level) {
    schema.educationalLevel = course.level;
  }

  // Add audience age range
  if (course.minAge && course.maxAge) {
    schema.audience = {
      "@type": "EducationalAudience",
      "educationalRole": "student",
      "audienceType": `Children aged ${course.minAge}-${course.maxAge}`
    };
  }

  // Add language
  if (course.language) {
    schema.inLanguage = course.language;
  }

  return schema;
}

/**
 * Generate BreadcrumbList schema
 */
interface BreadcrumbItem {
  name: string;
  item: string;
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item
    }))
  };
}

/**
 * Generate FAQPage schema
 * Only use when FAQs are actually visible on the page
 */
interface FAQItem {
  question: string;
  answer: string;
}

export function getFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * DO NOT USE: Google doesn't allow self-promotional AggregateRating
 * This is here as documentation only
 */
export function DO_NOT_USE_AggregateRating() {
  throw new Error(
    "Do not add AggregateRating for our own testimonials. " +
    "Google doesn't allow organizations to rate themselves. " +
    "Only use if you have third-party reviews from Google Reviews, Trustpilot, etc."
  );
}
