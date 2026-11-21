import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service – PlayFit Usage Guidelines',
  description: 'Read PlayFit\'s terms of service. Understand the rules and conditions for using our online learning platform and enrolling in courses for kids.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms of Service – PlayFit Usage Guidelines',
    description: 'Understand the terms and conditions for using PlayFit Classes and enrolling in our courses.',
    url: 'https://playfitclasses.com/terms',
    images: ['/logo.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service – PlayFit Usage Guidelines',
    description: 'Read the terms and conditions for using our platform.',
    images: ['/logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};
