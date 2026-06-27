import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Student Dashboard | Playfit Classes - Your Learning Hub',
  description: 'Access your learning dashboard. View enrolled courses, track progress, join live classes, and manage your educational journey.',
  keywords: ['student dashboard', 'learning dashboard', 'my account', 'student portal', 'course dashboard'],
  openGraph: {
    title: 'Student Dashboard | Playfit Classes',
    description: 'Your personalized learning hub and progress tracker',
    url: 'https://playfitclasses.com/student',
    type: 'website',
  },
  alternates: {
    canonical: 'https://playfitclasses.com/student',
  },
  robots: {
    index: false,
    follow: true,
  },
};
