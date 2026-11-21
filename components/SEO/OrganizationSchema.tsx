'use client';

import { getOrganizationSchema } from '@/lib/structuredData';

/**
 * Organization Schema Component
 * Combines EducationalOrganization + LocalBusiness
 * Single source of truth for organization details
 */
export default function OrganizationSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrganizationSchema()) }}
    />
  );
}
