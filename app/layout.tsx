import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import OrganizationSchema from '@/components/SEO/OrganizationSchema';
import WebSiteSchema from '@/components/SEO/WebSiteSchema';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import TopLoadingBar from "@/components/TopLoadingBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://playfitclasses.com'),
  title: {
    default: "Online Classes for Kids – Phonics, Public Speaking, Art & More | PlayFit",
    template: "%s | PlayFit"
  },
  description: "Live online classes for kids aged 4–10 in Kolkata and across India. Learn Phonics, Public Speaking, Art, Chess, Piano, Abacus, Coding, and Rubik's Cube with expert instructors.",
  authors: [{ name: 'PlayFit' }],
  creator: 'PlayFit',
  publisher: 'PlayFit',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://playfitclasses.com/',
    siteName: 'PlayFit',
    title: 'Online Classes for Kids – Phonics, Public Speaking, Art & More | PlayFit',
    description: 'Live online classes for kids aged 4–10 in Kolkata and across India. Learn Phonics, Public Speaking, Art, Chess, Piano, Abacus, Coding, and Rubik\'s Cube.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PlayFit Classes - Online Learning Platform for Kids',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Online Classes for Kids – Phonics, Public Speaking, Art & More | PlayFit',
    description: 'Live online classes for kids aged 4–10 in Kolkata and across India. Learn Phonics, Public Speaking, Art, Chess, Piano, and more.',
    images: ['/og-image.jpg'],
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
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PlayFit',
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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
        
        {/* Organization & Website Schema - Single source of truth */}
        <OrganizationSchema />
        <WebSiteSchema />
      </head>
      <body className="min-h-full flex flex-col">
        <GoogleAnalytics />
        <TopLoadingBar />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
