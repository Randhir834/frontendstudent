'use client';

import { getBreadcrumbSchema } from '@/lib/structuredData';

interface BreadcrumbItem {
  name: string;
  item: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export default function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumbSchema(items)) }}
    />
  );
}
