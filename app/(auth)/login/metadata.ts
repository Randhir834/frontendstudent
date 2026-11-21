import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Student Login – Access Your Learning Dashboard',
  description: 'Login to your PlayFit student account. Access live courses, track progress, and continue learning Phonics, Art, Chess, Piano, and more.',
  openGraph: {
    title: 'Student Login – Access Your Learning Dashboard | PlayFit',
    description: 'Login to access your courses, track progress, and continue your learning journey with PlayFit Classes.',
    url: 'https://playfitclasses.com/login',
    type: 'website',
    images: ['/logo.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Student Login – Access Your Learning Dashboard | PlayFit',
    description: 'Login to access your courses and learning materials.',
    images: ['/logo.jpg'],
  },
  alternates: {
    canonical: '/login',
  },
  robots: {
    index: false, // Don't index login page
    follow: true,
  },
};
