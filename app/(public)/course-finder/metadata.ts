import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find the Right Course for Your Kid – Interactive Tool',
  description: 'Use our course finder to discover the perfect class for your child aged 4–10. Filter by interest, age, skill level, and learning goals. Find the best fit!',
  alternates: {
    canonical: '/course-finder',
  },
  openGraph: {
    title: 'Find the Right Course for Your Kid – Interactive Tool | PlayFit',
    description: 'Use our course finder to discover the perfect class for your child aged 4–10. Filter by interest, age, skill level, and learning goals.',
    url: 'https://playfitclasses.com/course-finder',
    images: ['/logo.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find the Right Course for Your Kid – Interactive Tool | PlayFit',
    description: 'Discover the perfect class for your child. Filter by age, interest, and skill level to find the best online course.',
    images: ['/logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};
