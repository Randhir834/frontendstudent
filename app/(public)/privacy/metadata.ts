import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy – How We Protect Your Data',
  description: 'Read PlayFit\'s privacy policy. Learn how we collect, use, and protect your child\'s personal information on our online learning platform.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy – How We Protect Your Data | PlayFit',
    description: 'Learn how we collect, use, and protect your personal information when you use PlayFit Classes.',
    url: 'https://playfitclasses.com/privacy',
    images: ['/logo.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy – How We Protect Your Data | PlayFit',
    description: 'Learn how we protect your child\'s personal information.',
    images: ['/logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};
