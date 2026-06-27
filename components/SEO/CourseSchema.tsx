'use client';

interface CourseSchemaProps {
  name: string;
  description: string;
  provider: string;
  price?: string;
  priceCurrency?: string;
  courseMode?: 'online' | 'onsite' | 'blended';
  duration?: string;
  instructor?: string;
  rating?: number;
  reviewCount?: number;
}

export default function CourseSchema({
  name,
  description,
  provider = 'Playfit Classes',
  price,
  priceCurrency = 'USD',
  courseMode = 'online',
  duration,
  instructor,
  rating,
  reviewCount,
}: CourseSchemaProps) {
  const schemaData: {[key: string]: unknown} = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": name,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": provider,
      "url": "https://playfitclasses.com"
    },
    "courseMode": courseMode,
  };

  if (price) {
    schemaData.offers = {
      "@type": "Offer",
      "price": price,
      "priceCurrency": priceCurrency,
      "availability": "https://schema.org/InStock"
    };
  }

  if (duration) {
    schemaData.timeRequired = duration;
  }

  if (instructor) {
    schemaData.instructor = {
      "@type": "Person",
      "name": instructor
    };
  }

  if (rating && reviewCount) {
    schemaData.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "reviewCount": reviewCount,
      "bestRating": "5",
      "worstRating": "1"
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
