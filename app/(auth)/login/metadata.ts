import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Student Login | Playfit Classes - Access Your Learning Dashboard',
  description: 'Login to your Playfit Classes student account. Access live online courses, track your progress, and continue your learning journey in Art, Chess, Piano, and more.',
  keywords: ['student login', 'Playfit login', 'online learning login', 'student portal', 'learning dashboard'],
  openGraph: {
    title: 'Student Login | Playfit Classes',
    description: 'Login to access your courses and learning materials',
    url: 'https://playfitclasses.com/login',
    type: 'website',
  },
  alternates: {
    canonical: 'https://playfitclasses.com/login',
  },
  robots: {
    index: false, // Login pages should not be indexed
    follow: true,
  },
};
