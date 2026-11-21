import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy – How We Use Cookies',
  description: 'Learn about PlayFit\'s cookie policy. Understand what cookies we use, why we use them, and how to manage your cookie preferences.',
  alternates: {
    canonical: '/cookies',
  },
  openGraph: {
    title: 'Cookie Policy – How We Use Cookies | PlayFit',
    description: 'Learn about how PlayFit uses cookies to improve your experience and how to manage your preferences.',
    url: 'https://playfitclasses.com/cookies',
    images: ['/logo.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cookie Policy – How We Use Cookies | PlayFit',
    description: 'Learn about our cookie usage and manage your preferences.',
    images: ['/logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};
