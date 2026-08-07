'use client';

import Script from 'next/script';
import { GA_CONFIG } from '@/lib/ga-config';

export default function GoogleAnalytics() {
  // Only load GA in production or when explicitly enabled
  if (!GA_CONFIG.enabled) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_CONFIG.measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_CONFIG.measurementId}', {
              page_path: window.location.pathname,
              ${GA_CONFIG.debug ? "debug_mode: true," : ""}
            });
          `,
        }}
      />
    </>
  );
}
