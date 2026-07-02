'use client';

/**
 * Brand Schema Component for PlayFit
 * Helps Google understand PlayFit as a brand entity
 */
export default function BrandSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Brand",
    "name": "PlayFit",
    "alternateName": "Playfit Classes",
    "url": "https://playfitclasses.com",
    "logo": "https://playfitclasses.com/images/playfit-logo.jpg",
    "sameAs": [
      "https://facebook.com/playfitclasses",
      "https://twitter.com/playfitclasses",
      "https://instagram.com/playfitclasses",
      "https://linkedin.com/company/playfitclasses",
      "https://youtube.com/@playfitclasses"
    ],
    "description": "PlayFit is a leading online learning platform offering live skill development courses for children aged 8-18.",
    "slogan": "Transform Your Learning Journey",
    "foundingDate": "2020",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "10000",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
