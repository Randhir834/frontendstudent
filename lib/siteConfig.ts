/**
 * Site Configuration - Single Source of Truth
 * All business details, contact information, and site-wide constants
 * 
 * IMPORTANT: Update values here and they will automatically propagate
 * across the entire site (header, footer, metadata, schema, etc.)
 */

export const SITE_CONFIG = {
  // Business Information
  business: {
    name: "PlayFit Classes",
    legalName: "PlayFit Classes",
    alternateName: "PlayFit",
    tagline: "Live Online & Kolkata Classes for Kids",
    description: "Interactive live classes for kids aged 4-10 in Phonics, Public Speaking, Art, Grammar, and more. Expert instructors, flexible scheduling, personalized learning.",
  },

  // Contact Information
  contact: {
    email: "cplayfit@gmail.com",
    phone: "+91-8910484299",
    phoneDisplay: "+91 891 048 4299",
    supportEmail: "cplayfit@gmail.com",
  },

  // Physical Address (Kolkata Office)
  address: {
    full: "Gate No. 3, 4th Floor, Poddar Court, 18 Rabindra Sarani, Kolkata, West Bengal 700001, India",
    street: "Gate No. 3, 4th Floor, Poddar Court",
    street2: "18 Rabindra Sarani",
    city: "Kolkata",
    state: "West Bengal",
    stateCode: "WB",
    postalCode: "700001",
    country: "India",
    countryCode: "IN",
  },

  // Business Hours
  hours: {
    days: "Monday - Saturday",
    times: "11:00 AM - 7:00 PM",
    timeZone: "IST (Indian Standard Time)",
    openingHours: "Mo-Sa 11:00-19:00", // Schema.org format
  },

  // Student Demographics
  audience: {
    ageRange: "4-10 years",
    ageMin: 4,
    ageMax: 10,
    ageDisplay: "4–10",
    studentCount: "5,000+",
    studentCountNumeric: 5000,
  },

  // Courses Offered (in order of popularity)
  courses: {
    featured: [
      "Phonics",
      "Public Speaking",
      "Grammar",
      "Spell Bee",
    ],
    all: [
      "Phonics - Intermediate",
      "Public Speaking",
      "Grammar - Basic",
      "Spell Bee",
      "Reader's Club - Beginner",
      "Reader's Club - Intermediate",
      "Shlok",
      "AI - Artificial Intelligence",
      // Add other courses as they become available
      // "Art & Craft",
      // "Piano",
      // "Chess",
      // "Rubik's Cube",
      // "Abacus",
    ],
    categories: [
      { name: "Language & Communication", icon: "📝", courses: ["Phonics", "Grammar", "Public Speaking", "Spell Bee", "Reader's Club"] },
      { name: "STEM & Technology", icon: "💻", courses: ["AI - Artificial Intelligence"] },
      { name: "Cultural & Creative", icon: "🎨", courses: ["Shlok"] },
    ],
  },

  // Social Media Links (only verified accounts)
  social: {
    instagram: "https://www.instagram.com/playfitofficial_/",
    facebook: "https://www.facebook.com/playfitofficial",
    // Add others when available
    // twitter: "",
    // youtube: "",
    // linkedin: "",
  },

  // URLs
  urls: {
    main: "https://playfitclasses.com",
    baseUrl: "https://playfitclasses.com",
    logo: "https://playfitclasses.com/logo.jpg",
    ogImage: "https://playfitclasses.com/og-image.jpg",
    instructor: "https://instructor.playfit.com",
    admin: "https://admin.playfit.com",
  },

  // SEO & Metadata
  seo: {
    defaultTitle: "Online Classes for Kids – Phonics, Public Speaking, Art & More | PlayFit",
    titleTemplate: "%s | PlayFit",
    defaultDescription: "Live online classes for kids aged 4–10 in Kolkata and across India. Learn Phonics, Public Speaking, Art, Chess, Piano, Abacus, Coding, and Rubik's Cube with expert instructors.",
    keywords: ["online classes for kids", "Kolkata kids classes", "phonics classes", "public speaking for kids", "live online learning", "kids education India"],
    twitterHandle: "@playfitclasses",
  },

  // Statistics & Social Proof
  stats: {
    students: "5,000+",
    studentsNumeric: 5000,
    rating: 4.9,
    ratingMax: 5,
    reviewCount: "500+",
    reviewCountNumeric: 500,
    courseCount: "8+",
    courseCountNumeric: 8,
    satisfactionRate: "98%",
    satisfactionRateNumeric: 98,
  },

  // Features
  features: {
    trial: {
      available: true,
      duration: "1 class",
      price: "Free",
    },
    formats: ["Online", "Onsite (Kolkata)"],
    languages: ["English", "Hindi"],
    certifications: true,
    flexibleScheduling: true,
    expertInstructors: true,
  },

  // Legal & Compliance
  legal: {
    registeredName: "PlayFit Classes",
    // Add GST, CIN, etc. when available
    // gstNumber: "",
    // cin: "",
  },

  // Developer Info
  credits: {
    developedBy: "DevCastle.in",
    developedByUrl: "https://devcastle.in",
  },
} as const;

// Helper functions for commonly used data

/**
 * Get full formatted address
 */
export function getFullAddress(): string {
  const { street, street2, city, state, postalCode, country } = SITE_CONFIG.address;
  return `${street}, ${street2}, ${city}, ${state} ${postalCode}, ${country}`;
}

/**
 * Get address for schema.org
 */
export function getSchemaAddress() {
  return {
    "@type": "PostalAddress",
    "streetAddress": `${SITE_CONFIG.address.street}, ${SITE_CONFIG.address.street2}`,
    "addressLocality": SITE_CONFIG.address.city,
    "addressRegion": SITE_CONFIG.address.state,
    "postalCode": SITE_CONFIG.address.postalCode,
    "addressCountry": SITE_CONFIG.address.countryCode,
  };
}

/**
 * Get contact email with mailto: prefix
 */
export function getMailtoLink(): string {
  return `mailto:${SITE_CONFIG.contact.email}`;
}

/**
 * Get phone link with tel: prefix
 */
export function getPhoneLink(): string {
  return `tel:${SITE_CONFIG.contact.phone}`;
}

/**
 * Get social media links as array
 */
export function getSocialLinks(): string[] {
  return Object.values(SITE_CONFIG.social).filter(Boolean);
}

/**
 * Get age range for display
 */
export function getAgeRangeText(): string {
  return `${SITE_CONFIG.audience.ageMin}–${SITE_CONFIG.audience.ageMax} years`;
}

/**
 * Get formatted business hours
 */
export function getBusinessHours(): string {
  return `${SITE_CONFIG.hours.days}, ${SITE_CONFIG.hours.times}`;
}

// Type exports for TypeScript
export type SiteConfig = typeof SITE_CONFIG;
export type CourseName = typeof SITE_CONFIG.courses.all[number];
