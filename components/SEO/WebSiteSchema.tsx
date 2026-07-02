'use client';

/**
 * Website Schema with SearchAction for Google Search Box
 */
export default function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "PlayFit Classes",
    "alternateName": ["PlayFit", "Playfit Classes"],
    "url": "https://playfitclasses.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://playfitclasses.com/student/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "PlayFit Classes",
      "logo": {
        "@type": "ImageObject",
        "url": "https://playfitclasses.com/images/playfit-logo.jpg"
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
