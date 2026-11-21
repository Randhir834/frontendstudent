'use client';

import { ORGANIZATION } from '@/lib/structuredData';

/**
 * Website Schema
 * Removed SearchAction that pointed to /student/search (not public)
 */
export default function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": ORGANIZATION.name,
    "alternateName": ORGANIZATION.alternateName,
    "url": ORGANIZATION.url,
    "publisher": {
      "@type": "Organization",
      "name": ORGANIZATION.name,
      "logo": {
        "@type": "ImageObject",
        "url": ORGANIZATION.logo
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
