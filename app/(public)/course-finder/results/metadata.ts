import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Course Results – Courses Matching Your Search',
  description: 'Browse courses that match your preferences. Find the perfect online class for your child based on age, interest, and skill level.',
  alternates: {
    canonical: '/course-finder/results',
  },
  openGraph: {
    title: 'Course Results – Courses Matching Your Search | PlayFit',
    description: 'Browse courses that match your child\'s age, interests, and learning goals.',
    url: 'https://playfitclasses.com/course-finder/results',
    images: ['/logo.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Course Results – Courses Matching Your Search | PlayFit',
    description: 'Find the perfect course for your child.',
    images: ['/logo.jpg'],
  },
  robots: {
    index: false, // Don't index results page
    follow: true,
  },
};
