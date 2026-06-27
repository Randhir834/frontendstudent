import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast';
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
    default: "Playfit - Online Courses for Kids | Art, Chess, Piano, Abacus & More",
    template: "%s | Playfit - Online Learning Platform for Kids"
  },
  description: "Live online skill development courses for children aged 8-18. Learn Art & Drawing, Chess, Piano, Phonics, Public Speaking, Abacus, Computers, Rubiks Cube and more with expert instructors. Join 10,000+ students today!",
  keywords: [
    'Playfit',
    'online courses for kids',
    'online learning for children',
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
    'extracurricular activities'
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
    siteName: 'Playfit Classes',
    title: 'Playfit Classes - Online Courses for Kids | Art, Chess, Piano & More',
    description: 'Live online skill development courses for children aged 8-18. Join 10,000+ students learning Art, Chess, Piano, Public Speaking, and more with expert instructors.',
    images: [
      {
        url: '/images/playfit-logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Playfit Classes - Online Learning Platform for Kids',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Playfit Classes - Online Courses for Kids | Art, Chess, Piano & More',
    description: 'Live online skill development courses for children aged 8-18. Join 10,000+ students today!',
    images: ['/images/playfit-logo.jpg'],
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
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: 'https://playfitclasses.com',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Playfit',
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '1254x1254', type: 'image/png' },
      { url: '/images/playfit-logo.jpg', sizes: '1254x1254', type: 'image/png' }
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
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
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "Playfit Classes",
              "url": "https://playfitclasses.com",
              "logo": "https://playfitclasses.com/images/playfit-logo.jpg",
              "description": "Live online skill development courses for children aged 8-18. Learn Art, Chess, Piano, Public Speaking, and more with expert instructors.",
              "sameAs": [
                "https://facebook.com/playfitclasses",
                "https://twitter.com/playfitclasses",
                "https://instagram.com/playfitclasses",
                "https://linkedin.com/company/playfitclasses"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-XXX-XXX-XXXX",
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
                    "name": "Playfit Classes"
                  }
                },
                {
                  "@type": "Course",
                  "position": 2,
                  "name": "Chess Classes for Kids",
                  "description": "Strategic chess training for young minds",
                  "provider": {
                    "@type": "Organization",
                    "name": "Playfit Classes"
                  }
                },
                {
                  "@type": "Course",
                  "position": 3,
                  "name": "Piano Lessons Online",
                  "description": "Music education with expert piano instructors",
                  "provider": {
                    "@type": "Organization",
                    "name": "Playfit Classes"
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
