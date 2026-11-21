'use client';

import { getFAQSchema } from '@/lib/structuredData';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

/**
 * FAQ Schema Component
 * Only use when FAQs are actually visible on the page
 */
export default function FAQSchema({ faqs }: FAQSchemaProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(getFAQSchema(faqs)) }}
    />
  );
}
