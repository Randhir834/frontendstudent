'use client';

import { useEffect } from 'react';

interface CanonicalTagProps {
  url: string;
}

export default function CanonicalTag({ url }: CanonicalTagProps) {
  useEffect(() => {
    // Remove any existing canonical tags
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Add new canonical tag
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = url;
    document.head.appendChild(link);

    // Cleanup on unmount
    return () => {
      const canonical = document.querySelector(`link[rel="canonical"][href="${url}"]`);
      if (canonical) {
        canonical.remove();
      }
    };
  }, [url]);

  return null;
}
