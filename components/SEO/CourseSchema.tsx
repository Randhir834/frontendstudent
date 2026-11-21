'use client';

import { getCourseSchema } from '@/lib/structuredData';

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

export default function CourseSchema(props: CourseSchemaProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(getCourseSchema(props)) }}
    />
  );
}
