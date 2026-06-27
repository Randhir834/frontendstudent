import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Student Profile | Playfit Classes - Manage Your Account',
  description: 'Update your profile information, view learning achievements, manage account settings, and track your educational milestones.',
  keywords: ['student profile', 'account settings', 'my profile', 'user settings', 'profile management'],
  openGraph: {
    title: 'Student Profile | Playfit Classes',
    description: 'Manage your account and view your achievements',
    url: 'https://playfitclasses.com/student/profile',
    type: 'website',
  },
  alternates: {
    canonical: 'https://playfitclasses.com/student/profile',
  },
  robots: {
    index: false,
    follow: true,
  },
};
