import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import BrandSchema from '@/components/SEO/BrandSchema';
import WebSiteSchema from '@/components/SEO/WebSiteSchema';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://playfitclasses.com'),
  title: {
    default: "Online Skills Courses Kolkata | Art, Chess, Piano | PlayFit",
    template: "%s | PlayFit"
  },
  description: "Join online skills courses in Kolkata for Art, Chess, Piano, and more. Expert-led live classes help kids build creativity, confidence, and essential life skills.",
  keywords: [
    'Playfit',
    'PlayFit',
    'online courses for kids',
    'online learning for children',
    'online courses Kolkata',
    'kids classes Kolkata',
    'art classes for kids online',
    'chess classes for kids',
    'piano lessons online',
    'phonics classes',
    'public speaking for kids',
    'abacus classes online',
    'computer courses for children',
    'rubiks cube classes',
    'skill development courses',
    'live online classes',
    'kids education',
    'children learning platform',
    'online tutoring for kids',
    'creative classes for kids',
    'STEM education',
    'extracurricular activities',
    'Kolkata online classes',
    'West Bengal online courses'
  ],
  authors: [{ name: 'Playfit' }],
  creator: 'Playfit',
  publisher: 'Playfit',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://playfitclasses.com',
    siteName: 'PlayFit',
    title: 'Online Skills Courses Kolkata | Art, Chess, Piano | PlayFit',
    description: 'Join online skills courses in Kolkata for Art, Chess, Piano, and more. Expert-led live classes help kids build creativity, confidence, and essential life skills.',
    images: [
      {
        url: '/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Playfit Classes - Online Learning Platform for Kids',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Online Skills Courses Kolkata | Art, Chess, Piano | PlayFit',
    description: 'Join online skills courses in Kolkata for Art, Chess, Piano, and more. Expert-led live classes help kids build creativity, confidence, and essential life skills.',
    images: ['/logo.jpg'],
    creator: '@playfitclasses',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'Cp6blwy343IfJBbqgGCYvl9oeBK_FwWeNYNbb7ggA9I', // Google Search Console verification
    // yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: 'https://playfitclasses.com',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PlayFit',
  },
  icons: {
    icon: [
      { url: '/logo.jpg', sizes: '1254x1254', type: 'image/jpeg' },
      { url: '/logo.jpg', sizes: '1254x1254', type: 'image/jpeg' }
    ],
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
  category: 'Education',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#1E88E5',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Brand & Website Schema */}
        <BrandSchema />
        <WebSiteSchema />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "PlayFit",
              "url": "https://playfitclasses.com",
              "logo": "https://playfitclasses.com/logo.jpg",
              "description": "Join online skills courses in Kolkata for Art, Chess, Piano, and more. Expert-led live classes help kids build creativity, confidence, and essential life skills.",
              "sameAs": [
                "https://facebook.com/playfitclasses",
                "https://twitter.com/playfitclasses",
                "https://instagram.com/playfitclasses",
                "https://linkedin.com/company/playfitclasses"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Kolkata",
                "addressRegion": "West Bengal",
                "addressCountry": "IN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-891-048-4299",
                "contactType": "Customer Service",
                "availableLanguage": "English"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "10000",
                "bestRating": "5",
                "worstRating": "1"
              },
              "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "USD",
                "lowPrice": "0",
                "highPrice": "500",
                "offerCount": "11"
              }
            })
          }}
        />
        
        {/* Additional Structured Data for Courses */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "itemListElement": [
                {
                  "@type": "Course",
                  "position": 1,
                  "name": "Art & Drawing Classes for Kids",
                  "description": "Creative art and drawing courses for children",
                  "provider": {
                    "@type": "Organization",
                    "name": "PlayFit"
                  }
                },
                {
                  "@type": "Course",
                  "position": 2,
                  "name": "Chess Classes for Kids",
                  "description": "Strategic chess training for young minds",
                  "provider": {
                    "@type": "Organization",
                    "name": "PlayFit"
                  }
                },
                {
                  "@type": "Course",
                  "position": 3,
                  "name": "Piano Lessons Online",
                  "description": "Music education with expert piano instructors",
                  "provider": {
                    "@type": "Organization",
                    "name": "PlayFit"
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <GoogleAnalytics />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
